import ChatContainer from "@/components/ChatContainer";
import { auth } from "@/auth";

type Params = {
  params: Promise<{
    conversationId: string;
  }>;
};

export default async function ChatPage({ params }: Params) {
  const session = await auth();
  const userId = session?.user?.id as string;

  const { conversationId } = await params;

  return (
    <ChatContainer
      isNewChat={false}
      initialMessages={[]}
      conversationId={conversationId}
      userId={userId}
    />
  );
}
