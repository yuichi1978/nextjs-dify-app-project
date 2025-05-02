import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ChatProps } from "@/types/chat";
import { useChatStore } from "@/store/chatStore";
import { useRouter } from "next/navigation";

export default function ChatInput({ userId }: ChatProps) {
  const [input, setInput] = useState("");
  const router = useRouter();

  const { conversationId, setConversationId, addMessage, setLoading } =
    useChatStore();

  const callDifyApi = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    try {
      setLoading(true);

      addMessage({
        role: "user",
        content: input,
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: input,
          userId: userId,
          conversationId: conversationId,
        }),
      });

      const result = await response.json();
      // console.log(result)

      // 会話IDがセットされていなければ設定
      if (!conversationId) {
        setConversationId(result.conversation_id);
        router.push(`chat/${result.conversation_id}`);
      }

      // Dify APIの応答をストアに追加
      addMessage({
        id: result.message_id,
        role: "assistant",
        content: result.answer,
      });

      setInput("");
    } catch (error) {
      console.error("API接続に失敗しました", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="flex flex-col gap-2 px-4 max-w-4xl max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Textarea
            className="
            flex-1 min-h-[60px] max-h-[200px] text-sm 
            md:text-base bg-white resize-none"
            placeholder="メッセージを入力してください"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></Textarea>
          <Button
            onClick={callDifyApi}
            type="submit"
            className="h-10 px-4 shrink-0"
          >
            送信
          </Button>
        </div>
      </form>
    </div>
  );
}
