import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { saveSubscription } from "@/lib/stripe/subscription";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text(); // 生データ
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature");

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        {
          error: "署名またはwebhookシークレットがありません",
        },
        {
          status: 400,
        }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
    console.log(event);

    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("webhookエラー", error);

    const statusCode =
      error instanceof Stripe.errors.StripeSignatureVerificationError
        ? 400
        : 500;

    return NextResponse.json({ error: "決済失敗" }, { status: statusCode });
  }
}

async function handleCheckoutCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.userId as string;
  const subscriptionId = session.subscription as string;

  // 追加情報の取得
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  console.log(subscription);

  const priceId = subscription.items.data[0]?.price.id;
  const customer = subscription.customer as string;
  const startDate = new Date(subscription.items.data[0]?.current_period_start);
  const endDate = new Date(subscription.items.data[0]?.current_period_end);
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;

  await saveSubscription(
    userId,
    customer,
    priceId,
    subscriptionId,
    startDate,
    endDate,
    cancelAtPeriodEnd
  );
}
