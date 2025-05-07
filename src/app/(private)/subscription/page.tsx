"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  // 通知表示
  useEffect(() => {
    if (success) {
      toast("サブスクリプション成功", {
        description: "Proプランへのサブスクリプションが完了しました！",
      });
      router.replace("/subscription");
    }
    if (canceled) {
      toast("サブスクリプションのキャンセル", {
        description: "チェックアウトがキャンセルされました",
      });
      router.replace("/subscription");
    }
  }, [success, canceled, router]);

  // 支払いプロセス
  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.url) {
        router.push(data.url);
      }
    } catch (error) {
      toast("エラー", {
        description: "サブスクリプション中にエラーが発生しました。",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            プランをアップグレード
          </CardTitle>
          <CardDescription className="text-center">Proプラン</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-2">Proプラン</h2>
            <p className="text-gray-600 mb-4">
              より多くの会話と高度な機能を利用できます
            </p>
            <div className="text-3xl font-bold mb-4">
              $5<span className="text-lg text-gray-500">/月</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full py-2"
          >
            {loading ? "処理中..." : "Proプランにアップグレード"}
          </Button>
          <p className="text-xs text-gray-500 text-center">
            サブスクリプションはいつでもキャンセルできます。<br />
            クレジットカードで安全に決済されます。
          </p>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  );
}
