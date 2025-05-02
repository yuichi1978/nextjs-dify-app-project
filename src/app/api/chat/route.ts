import { NextRequest, NextResponse } from "next/server";
import { createConversation, updateConversation } from "@/lib/conversation";

const endpoint = `${process.env.DIFY_API_URL}/chat-messages`;
const DIFY_API_KEY = process.env.DIFY_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, userId, conversationId } = body;

    // DifyワークフローAPI接続
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DIFY_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: {},
        query: query,
        response_mode: "blocking",
        user: userId,
        coversation_id: conversationId || "",
      }),
    });

    const data = await response.json();
    console.log(data);

    if (!conversationId) {
      createConversation(data, userId, query);
    } else {
      updateConversation(data, userId);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("APIエラー", error);
    return NextResponse.json("Dify側でエラーが発生しました");
  }
}
