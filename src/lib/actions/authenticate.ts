"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirect: false,
    });

    redirect("/dashboard");
  } catch (error) {
    if (error instanceof AuthError) {
      // ここで error.message を見る
      if (error.message.includes("CredentialsSignin")) {
        return "メールアドレスまたはパスワードが正しくありません。";
      }
      return "エラーが発生しました。";
    }
    throw error;
  }
}
