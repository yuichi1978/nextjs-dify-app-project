import { prisma } from "@/lib/prisma";

export async function saveSubscription(
  userId: string,
  stripeCustomerId: string,
  stripePriceId: string,
  stripeSubscriptionId: string,
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: Boolean = false
) {
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      stripeCustomerId,
      stripePriceId,
      stripeSubscriptionId,
      status: "ACTIVE",
      plan: "PRO",
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd,
    },
    create: {
      userId,
      stripeCustomerId,
      stripePriceId,
      stripeSubscriptionId,
      status: "ACTIVE",
      plan: "PRO",
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd,
    },
  });
}
