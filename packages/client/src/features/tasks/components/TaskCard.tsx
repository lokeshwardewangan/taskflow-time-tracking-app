import { Play, Square, CheckCircle2, Circle, Clock, Edit2, Trash2 } from 'lucide-react';
import type { Task } from '../types';
import { formatTime } from '@/lib/time';

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
                  className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors"
               >
                  <Edit2 className="w-4 h-4" />
               </button>
               <button
                  onClick={() => onDelete(task.id)}
                  className="p-1.5 text-zinc-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
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
      </div>
   );
}
