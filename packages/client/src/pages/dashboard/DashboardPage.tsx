import { formatTime } from '@/lib/time';
import { SummaryCards } from '@/features/dashboard/components/SummaryCards';
import { TimeByTaskChart } from '@/features/dashboard/components/TimeByTaskChart';
import { ActivityTable } from '@/features/dashboard/components/ActivityTable';
import { useDailySummary } from '@/features/dashboard/hooks';
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton';

export default function DashboardPage() {
   const { data: response, isLoading } = useDailySummary();
   const data = response?.data;

   if (isLoading || !data) {
      return <DashboardSkeleton />;
   }

   const SUMMARY_METRICS = {
      totalTrackedTimeTodaySeconds: data.totalTrackedTimeTodaySeconds,
      todayCompletedTaskCount: data.todayCompletedTaskCount,
      totalInProgressTaskCount: data.totalInProgressTaskCount,
      totalPendingTaskCount: data.totalPendingTaskCount,
   };

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
               <TimeByTaskChart tasks={data.tasksWorkedOnToday} />
               <ActivityTable tasks={data.tasksWorkedOnToday} formatTime={formatTime} />
            </div>
         </main>
      </div>
   );
}
