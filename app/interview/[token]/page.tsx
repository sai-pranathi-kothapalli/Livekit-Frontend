// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface InterviewPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  // Await params first (required in Next.js 15)
  const { token } = await params;

  // Validate token exists
  if (!token || typeof token !== 'string') {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md space-y-3 text-center">
          <h1 className="text-2xl font-semibold">Invalid Interview Token</h1>
        </div>
      </main>
    );
  }

  // For now, just show token to verify routing works
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md space-y-3 text-center">
        <h1 className="text-2xl font-semibold">Interview Route Working!</h1>
        <p className="text-muted-foreground text-sm">Token: {token}</p>
      </div>
    </main>
  );
}
