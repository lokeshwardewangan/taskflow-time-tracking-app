import { Timer, CheckCircle2, Clock, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryCardsProps {
   metrics: {
      totalTrackedTimeTodaySeconds: number;
      todayCompletedTaskCount: number;
      totalInProgressTaskCount: number;
      totalPendingTaskCount: number;
   };
   formatTime: (seconds: number) => string;
}

export function SummaryCards({ metrics, formatTime }: SummaryCardsProps) {
   return (
      <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-4 mb-8">
         {/* Card 1: Total Tracked (Soft Blue Gradient Orb) */}
         <Card className="bg-white shadow-sm border-zinc-200 hover:border-zinc-300 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-28 h-28 bg-blue-400/10 rounded-full z-0 opacity-60 blur-2xl transition-all group-hover:opacity-100 group-hover:scale-110 group-hover:bg-blue-400/20" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
               <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wide text-[11px]">
                  Total Tracked
               </CardTitle>
               <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Timer className="w-4 h-4 text-blue-600" />
               </div>
            </CardHeader>
            <CardContent className="relative z-10 mt-2">
               <div className="text-3xl font-bold text-zinc-950 tracking-tight">
                  {formatTime(metrics.totalTrackedTimeTodaySeconds)}
               </div>
               <p className="text-[13px] font-medium text-zinc-500 mt-1.5">
                  Active time logged today
               </p>
            </CardContent>
         </Card>

         {/* Card 2: Completed (Soft Emerald Gradient Orb) */}
         <Card className="bg-white shadow-sm border-zinc-200 hover:border-zinc-300 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-28 h-28 bg-emerald-400/10 rounded-full z-0 opacity-60 blur-2xl transition-all group-hover:opacity-100 group-hover:scale-110 group-hover:bg-emerald-400/20" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
               <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wide text-[11px]">
                  Completed
               </CardTitle>
               <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
               </div>
            </CardHeader>
            <CardContent className="relative z-10 mt-2">
               <div className="text-3xl font-bold text-zinc-950 tracking-tight">
                  {metrics.todayCompletedTaskCount}
               </div>
               <p className="text-[13px] font-medium text-zinc-500 mt-1.5">Tasks finished today</p>
            </CardContent>
         </Card>

         {/* Card 3: In Progress (Soft Amber Gradient Orb) */}
         <Card className="bg-white shadow-sm border-zinc-200 hover:border-zinc-300 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-28 h-28 bg-amber-400/10 rounded-full z-0 opacity-60 blur-2xl transition-all group-hover:opacity-100 group-hover:scale-110 group-hover:bg-amber-400/20" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
               <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wide text-[11px]">
                  In Progress
               </CardTitle>
               <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4 text-amber-600" />
               </div>
            </CardHeader>
            <CardContent className="relative z-10 mt-2">
               <div className="text-3xl font-bold text-zinc-950 tracking-tight">
                  {metrics.totalInProgressTaskCount}
               </div>
               <p className="text-[13px] font-medium text-zinc-500 mt-1.5">
                  Tasks currently active
               </p>
            </CardContent>
         </Card>

         {/* Card 4: Pending (Soft Zinc Gradient Orb) */}
         <Card className="bg-white shadow-sm border-zinc-200 hover:border-zinc-300 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-28 h-28 bg-zinc-400/10 rounded-full z-0 opacity-60 blur-2xl transition-all group-hover:opacity-100 group-hover:scale-110 group-hover:bg-zinc-400/20" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
               <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wide text-[11px]">
                  Pending
               </CardTitle>
               <div className="w-8 h-8 rounded-full bg-zinc-50 border border-zinc-200/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Circle className="w-4 h-4 text-zinc-600" />
               </div>
            </CardHeader>
            <CardContent className="relative z-10 mt-2">
               <div className="text-3xl font-bold text-zinc-950 tracking-tight">
                  {metrics.totalPendingTaskCount}
               </div>
               <p className="text-[13px] font-medium text-zinc-500 mt-1.5">Tasks awaiting start</p>
            </CardContent>
         </Card>
      </div>
   );
}
