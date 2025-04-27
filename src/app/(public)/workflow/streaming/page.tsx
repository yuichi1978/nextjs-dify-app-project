import WorkflowStreaming from "@/components/WorkflowStreaming";

export default function WorkflowStreamingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">Dify workflow streaming API demo</h1>
        <WorkflowStreaming />
      </div>
    </main>
  )
}
