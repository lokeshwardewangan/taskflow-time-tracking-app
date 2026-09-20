import {
   Play,
   Square,
   CheckCircle2,
   Circle,
   Clock,
   Edit2,
   Trash2,
   List,
   Loader2,
   X,
} from 'lucide-react';
import type { Task } from '../types';
import { formatTime } from '@/lib/time';
import { useState } from 'react';
import { useTaskTimeLogs } from '../hooks';
import type { TimeLog } from '../api';

interface TaskCardProps {
   task: Task;
   isActive: boolean;
   onStartTimer: (id: string) => void;
   onStopTimer: (id: string) => void;
   onComplete: (id: string) => void;
   onEdit: (task: Task) => void;
   onDelete: (id: string) => void;
}

export function TaskCard({
   task,
   isActive,
   onStartTimer,
   onStopTimer,
   onComplete,
   onEdit,
   onDelete,
}: TaskCardProps) {
   const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);

   const { data: logsResponse, isLoading: isLoadingLogs } = useTaskTimeLogs(
      task.id,
      isLogsModalOpen
   );
   const logs = logsResponse?.data || [];
   const totalLogsDuration = logs.reduce((acc: number, log: TimeLog) => {
      const duration =
         log.duration ??
         Math.floor((new Date().getTime() - new Date(log.startTime).getTime()) / 1000);
      return acc + duration;
   }, 0);

   return (
      <div
         className={`group flex flex-col p-5 bg-white border rounded-xl transition-all relative overflow-hidden ${
            isActive
               ? 'border-zinc-300 shadow-md ring-1 ring-zinc-950/5'
               : 'border-zinc-200 hover:border-zinc-300 hover:shadow-sm shadow-sm'
         }`}
      >
         {/* Live Timer Indicator Border Glow (Optional Premium Touch) */}
         {isActive && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 animate-pulse" />
         )}

         {/* Top Header Row */}
         <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex flex-col gap-1.5 min-w-0">
               <h3
                  className={`font-semibold text-[15px] truncate ${task.status === 'COMPLETED' ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}
               >
                  {task.title}
               </h3>
               {task.description && (
                  <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                     {task.description}
                  </p>
               )}
            </div>

            {/* Quick Actions Context Menu */}
            <div className="flex shrink-0 items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
               <button
                  onClick={() => onEdit(task)}
                  className="p-1.5 cursor-pointer text-zinc-400 hover:text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors"
               >
                  <Edit2 className="w-4 h-4" />
               </button>
               <button
                  onClick={() => onDelete(task.id)}
                  className="p-1.5 cursor-pointer text-zinc-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
               >
                  <Trash2 className="w-4 h-4" />
               </button>
            </div>
         </div>

         {/* Badges Row */}
         <div className="flex items-center gap-2 mb-6 mt-1 flex-wrap">
            <span
               className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase ${
                  task.status === 'COMPLETED'
                     ? 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                     : task.status === 'IN_PROGRESS'
                       ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                       : 'bg-zinc-50 text-zinc-600 border border-zinc-200'
               }`}
            >
               {task.status === 'COMPLETED' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
               ) : task.status === 'IN_PROGRESS' ? (
                  <Clock className="w-3.5 h-3.5" />
               ) : (
                  <Circle className="w-3.5 h-3.5" />
               )}
               {task.status === 'COMPLETED'
                  ? 'Done'
                  : task.status === 'IN_PROGRESS'
                    ? 'In Progress'
                    : 'Pending'}
            </span>

            <div
               className={`flex items-center gap-1.5 text-sm font-medium font-mono px-2 py-1 rounded-md border ${
                  isActive
                     ? 'bg-red-50 text-red-700 border-red-100'
                     : 'text-zinc-600 bg-zinc-50 border-zinc-100'
               }`}
            >
               {isActive && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
               {formatTime(task.trackedTime)}
            </div>

            <button
               onClick={() => setIsLogsModalOpen(true)}
               className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1.5 rounded-md border text-zinc-600 bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 transition-colors ml-auto shadow-sm"
            >
               <List className="w-3.5 h-3.5" />
               Logs
            </button>
         </div>

         {/* Footer Actions */}
         <div className="mt-auto border-t border-zinc-100 pt-4 flex items-center justify-between">
            {task.status !== 'COMPLETED' && (
               <button
                  onClick={() => (isActive ? onStopTimer(task.id) : onStartTimer(task.id))}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                     isActive
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200/50'
                        : 'bg-zinc-950 text-white hover:bg-zinc-900 shadow-sm active:scale-95'
                  }`}
               >
                  {isActive ? (
                     <Square className="w-3.5 h-3.5 fill-current" />
                  ) : (
                     <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  {isActive ? 'Stop Timer' : 'Track Time'}
               </button>
            )}

            {task.status !== 'COMPLETED' && (
               <button
                  onClick={() => onComplete(task.id)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-[13px] font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors ml-auto border border-zinc-200 bg-white shadow-sm"
               >
                  <CheckCircle2 className="w-4 h-4" /> Complete
               </button>
            )}
         </div>

         {/* Time Logs Modal Overlay */}
         {isLogsModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <div
                  className="absolute inset-0 bg-zinc-950/20 backdrop-blur-sm animate-in fade-in duration-200"
                  onClick={() => setIsLogsModalOpen(false)}
               />
               <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                     <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center border border-zinc-200">
                           <Clock className="w-4 h-4" />
                        </div>
                        <div>
                           <h2 className="text-base font-semibold text-zinc-950">Time Logs</h2>
                           <p className="text-xs text-zinc-500 truncate max-w-[200px]">
                              {task.title}
                           </p>
                        </div>
                     </div>
                     <button
                        onClick={() => setIsLogsModalOpen(false)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors"
                     >
                        <X className="w-4 h-4" />
                     </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-0 bg-zinc-50/50">
                     {isLoadingLogs ? (
                        <div className="flex flex-col items-center justify-center py-12">
                           <Loader2 className="w-6 h-6 animate-spin text-zinc-400 mb-2" />
                           <p className="text-sm text-zinc-500">Loading session history...</p>
                        </div>
                     ) : logs.length > 0 ? (
                        <div className="divide-y divide-zinc-100">
                           {logs.map((log: TimeLog) => {
                              const isRunning = !log.endTime;
                              return (
                                 <div
                                    key={log.id}
                                    className="px-6 py-3 flex items-center justify-between bg-white transition-colors"
                                 >
                                    <div className="flex flex-col gap-1">
                                       <span className="text-sm font-medium text-zinc-900">
                                          Session
                                       </span>
                                       <span className="text-xs text-zinc-500 font-mono">
                                          {new Date(log.startTime).toLocaleTimeString([], {
                                             hour: '2-digit',
                                             minute: '2-digit',
                                          })}
                                          {' - '}
                                          {isRunning
                                             ? 'Running'
                                             : new Date(log.endTime!).toLocaleTimeString([], {
                                                  hour: '2-digit',
                                                  minute: '2-digit',
                                               })}
                                       </span>
                                    </div>
                                    <div
                                       className={`font-mono text-sm font-medium ${isRunning ? 'text-amber-600' : 'text-zinc-700'}`}
                                    >
                                       {formatTime(
                                          log.duration ??
                                             Math.floor(
                                                (new Date().getTime() -
                                                   new Date(log.startTime).getTime()) /
                                                   1000
                                             )
                                       )}
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     ) : (
                        <div className="flex items-center justify-center py-12 text-sm text-zinc-500">
                           No time logged for this task yet.
                        </div>
                     )}
                  </div>

                  <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between">
                     <span className="text-sm font-semibold text-zinc-700">Total Duration</span>
                     <span className="text-lg font-bold font-mono text-zinc-950">
                        {formatTime(totalLogsDuration)}
                     </span>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
