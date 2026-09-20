import { formatTime } from '@/lib/time';
import { SummaryCards } from '@/features/dashboard/components/SummaryCards';
import { TimeByTaskChart } from '@/features/dashboard/components/TimeByTaskChart';
import { ActivityTable } from '@/features/dashboard/components/ActivityTable';

// Mock data based on the API response structure
const SUMMARY_METRICS = {
   totalTrackedTimeTodaySeconds: 14500, // ~4 hours
   todayCompletedTaskCount: 2,
   totalInProgressTaskCount: 3,
   totalPendingTaskCount: 5,
};

const TASKS_WORKED_ON_TODAY = [
   { id: 't-2', title: 'Setup Database Schema', status: 'IN_PROGRESS', trackedTime: 7200 },
   { id: 't-3', title: 'Initialize Git Repository', status: 'COMPLETED', trackedTime: 3600 },
   { id: 't-4', title: 'Write Auth Middleware', status: 'IN_PROGRESS', trackedTime: 2500 },
   { id: 't-5', title: 'Fix CSS Layouts', status: 'COMPLETED', trackedTime: 1200 },
];

export default function DashboardPage() {
   return (
      <div className="pb-20 animate-in fade-in duration-500">
         <main className="max-w-[1400px] mx-auto px-6 mt-10">
            {/* View Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
               <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Daily Summary</h1>
                  <p className="text-sm text-zinc-500 mt-1">
                     Here's an overview of your productivity today.
                  </p>
               </div>
            </div>

            {/* Extracted Components */}
            <SummaryCards metrics={SUMMARY_METRICS} formatTime={formatTime} />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
               <TimeByTaskChart tasks={TASKS_WORKED_ON_TODAY} />
               <ActivityTable tasks={TASKS_WORKED_ON_TODAY} formatTime={formatTime} />
            </div>
         </main>
      </div>
   );
}
