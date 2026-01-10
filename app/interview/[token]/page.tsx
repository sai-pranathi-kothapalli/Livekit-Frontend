import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { App } from '@/components/app/app';
import { getBooking } from '@/lib/api';
import { getAppConfig } from '@/lib/utils';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

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
    return notFound();
  }

  // Get booking from backend API
  let booking;
  try {
    booking = await getBooking(token);
  } catch (error) {
    console.error(`[interview] Error fetching booking for token ${token}:`, error);
    // In production, show a user-friendly error instead of 404
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md space-y-3 text-center">
          <h1 className="text-2xl font-semibold">Unable to load interview</h1>
          <p className="text-muted-foreground text-sm">
            There was an error connecting to the server. Please try again later.
          </p>
        </div>
      </main>
    );
  }

  if (!booking) {
    return notFound();
  }

  // Parse scheduled_at as UTC and convert to local time for display
  const scheduledAt = new Date(booking.scheduled_at);
  const now = new Date();
  const diffMinutes = (now.getTime() - scheduledAt.getTime()) / 60000;

  // Format date/time in user's local timezone
  const formattedDate = scheduledAt.toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });

  if (diffMinutes < -5) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md space-y-3 text-center">
          <h1 className="text-2xl font-semibold">Your interview has not started yet</h1>
          <p className="text-muted-foreground text-sm">Scheduled for {formattedDate}.</p>
          <p className="text-muted-foreground text-sm">
            Please join within 5 minutes before the scheduled time.
          </p>
        </div>
      </main>
    );
  }

  if (diffMinutes > 60) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md space-y-3 text-center">
          <h1 className="text-2xl font-semibold">Interview window has expired</h1>
          <p className="text-muted-foreground text-sm">
            This link is no longer active. Please contact support to reschedule.
          </p>
        </div>
      </main>
    );
  }

  const hdrs = await headers();
  const appConfig = await getAppConfig(hdrs);

  // Within the allowed window → render existing LiveKit app UI
  // Pass the token so connection-details can fetch resume text
  return <App appConfig={appConfig} interviewToken={token} />;
}
