import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Search, CheckCircle2, LayoutGrid, Clock, Circle, Square } from 'lucide-react';
import type { Task, TaskStatus } from '@/features/tasks/types';
import { TaskCard } from '@/features/tasks/components/TaskCard';
import { TaskFormModal } from '@/features/tasks/components/TaskFormModal';
import { TasksSkeleton } from '@/features/tasks/components/TasksSkeleton';
import {
   useTasks,
   useCreateTask,
   useUpdateTask,
   useDeleteTask,
   useStartTaskTimer,
   useStopTaskTimer,
} from '@/features/tasks/hooks';
import { toast } from 'sonner';

export default function TasksPage() {
   const queryClient = useQueryClient();
   const { data: tasksResponse, isLoading } = useTasks();
   const tasks = tasksResponse?.data || [];

   const createTaskMutation = useCreateTask();
   const updateTaskMutation = useUpdateTask();
   const deleteTaskMutation = useDeleteTask();
   const startTimerMutation = useStartTaskTimer();
   const stopTimerMutation = useStopTaskTimer();

   const [searchQuery, setSearchQuery] = useState('');
   const [filterStatus, setFilterStatus] = useState<TaskStatus | 'ALL'>('ALL');

   // Form Modal State
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingTask, setEditingTask] = useState<Task | null>(null);

   // Timer State
   const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
   const [activeTaskSessionTime, setActiveTaskSessionTime] = useState<number>(0);
   const [pendingStartTaskId, setPendingStartTaskId] = useState<string | null>(null);

   const activeTask = tasks.find((t) => t.id === activeTaskId);
   // Provide a live-computed version of the active task
   const liveActiveTask = activeTask
      ? { ...activeTask, trackedTime: activeTask.trackedTime + activeTaskSessionTime }
      : undefined;

   useEffect(() => {
      if (!activeTaskId) return;
      const interval = setInterval(() => {
         setActiveTaskSessionTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
   }, [activeTaskId]);

   // --- Actions ---
   const handleStartTimer = (id: string) => {
      if (activeTaskId && activeTaskId !== id) {
         setPendingStartTaskId(id);
         return;
      }
      setActiveTaskId(id);
      setActiveTaskSessionTime(0);
      startTimerMutation.mutate(id);
   };

   const handleConfirmSwitchTimer = () => {
      if (!pendingStartTaskId || !activeTaskId) return;

      const currentActive = tasks.find((t) => t.id === activeTaskId);
      if (currentActive) {
         stopTimerMutation.mutate(activeTaskId);
      }

      setActiveTaskId(pendingStartTaskId);
      setActiveTaskSessionTime(0);
      startTimerMutation.mutate(pendingStartTaskId);
      setPendingStartTaskId(null);
   };

   const formatTime = (seconds: number) => {
      // Converts seconds to HH:MM:SS format perfectly padded
      return new Date(seconds * 1000).toISOString().substring(11, 19);
   };

   const handleStopTimer = (id: string) => {
      if (activeTaskId === id) {
         setActiveTaskId(null);
         setActiveTaskSessionTime(0);
      }

      const current = tasks.find((t) => t.id === id);
      if (current) {
         stopTimerMutation.mutate(id);
         updateTaskMutation.mutate({
            id,
            payload: { status: 'PENDING', trackedTime: current.trackedTime },
         });
      }
   };

   const handleComplete = (id: string) => {
      if (activeTaskId === id) {
         setActiveTaskId(null);
         setActiveTaskSessionTime(0);
         stopTimerMutation.mutate(id);
      }
      const current = tasks.find((t) => t.id === id);
      if (current) {
         updateTaskMutation.mutate({
            id,
            payload: { status: 'COMPLETED', trackedTime: current.trackedTime },
         });
         toast.success('Task marked as completed!');
      }
   };

   const handleDelete = (id: string) => {
      if (activeTaskId === id) {
         setActiveTaskId(null);
         setActiveTaskSessionTime(0);
      }
      deleteTaskMutation.mutate(id, {
         onSuccess: () => toast.success('Task deleted successfully'),
      });
   };

   const handleOpenModal = (task?: Task) => {
      setEditingTask(task || null);
      setIsModalOpen(true);
   };

   const handleSaveTask = (data: { title: string; description: string }) => {
      if (editingTask) {
         const promise = updateTaskMutation.mutateAsync({ id: editingTask.id, payload: data });
         toast.promise(promise, {
            loading: 'Updating task...',
            success: 'Task updated successfully!',
            error: 'Failed to update task',
         });
      } else {
         const promise = createTaskMutation.mutateAsync(data);
         toast.promise(promise, {
            loading: 'Creating task...',
            success: 'Task created successfully!',
            error: 'Failed to create task',
         });
      }
      setIsModalOpen(false);
   };

   // --- Derived State ---
   const filteredTasks = tasks
      .map((t) =>
         t.id === activeTaskId ? { ...t, trackedTime: t.trackedTime + activeTaskSessionTime } : t
      )
      .filter((t) => {
         const matchesSearch =
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase());
         const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
         return matchesSearch && matchesStatus;
      });

   return (
      <div className="pb-20">
         <main className="max-w-[1400px] mx-auto px-6 mt-10">
            {/* Global Active Timer Banner */}
            {liveActiveTask && (
               <div className="mb-8 p-4 sm:p-5 rounded-xl border border-zinc-200 bg-zinc-50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                     <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 shadow-sm flex flex-shrink-0 items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-ping" />
                        <Clock className="w-4 h-4 text-zinc-900" />
                     </div>
                     <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                           Currently Tracking
                        </span>
                        <h3
                           className="text-[15px] font-semibold text-zinc-900 truncate mt-0.5"
                           title={liveActiveTask.title}
                        >
                           {liveActiveTask.title}
                        </h3>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 sm:ml-auto shrink-0">
                     <div className="flex bg-white items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="font-mono font-medium text-sm text-zinc-700">
                           {formatTime(liveActiveTask.trackedTime)}
                        </span>
                     </div>
                     <button
                        onClick={() => handleStopTimer(liveActiveTask.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-950 text-white rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-all shadow-sm active:scale-95"
                     >
                        <Square className="w-3.5 h-3.5 fill-current" /> Stop Timer
                     </button>
                  </div>
               </div>
            )}

            {/* View Header with Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-6">
               <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
                     Your Workspace
                  </h1>
                  <p className="text-sm text-zinc-500 mt-1">
                     Manage, prioritize, and track your active tasks.
                  </p>
               </div>

               <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* New Task Button - Prominent Placement */}
                  <button
                     onClick={() => handleOpenModal()}
                     className="h-9 px-4 bg-zinc-950 hover:bg-zinc-900 text-white text-sm font-semibold rounded-md shadow-sm transition-all active:scale-95 flex items-center gap-2 w-full sm:w-auto justify-center shrink-0"
                  >
                     <Plus className="w-4 h-4" />
                     <span>New Task</span>
                  </button>
               </div>
            </div>

            {/* Search and Filters Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
               {/* Search Bar */}
               <div className="relative w-full md:w-80 shrink-0">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                     type="text"
                     placeholder="Search tasks..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="h-10 w-full pl-9 pr-3 rounded-lg bg-zinc-50 border border-zinc-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all shadow-sm placeholder:text-zinc-500"
                  />
               </div>

               {/* Filters - Mobile Scrollable */}
               <div className="w-full sm:w-auto -mx-6 px-6 sm:mx-0 sm:px-0 overflow-x-auto pb-2 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-lg border border-zinc-200/50 w-max">
                     <button
                        onClick={() => setFilterStatus('ALL')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                           filterStatus === 'ALL'
                              ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/50'
                              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                        }`}
                     >
                        <LayoutGrid className="w-3.5 h-3.5" /> All Tasks
                     </button>
                     <button
                        onClick={() => setFilterStatus('PENDING')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                           filterStatus === 'PENDING'
                              ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/50'
                              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                        }`}
                     >
                        <Circle className="w-3.5 h-3.5" /> Pending
                     </button>
                     <button
                        onClick={() => setFilterStatus('IN_PROGRESS')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                           filterStatus === 'IN_PROGRESS'
                              ? 'bg-white text-amber-700 shadow-sm border border-amber-200/50'
                              : 'text-zinc-600 hover:text-amber-700 hover:bg-zinc-200/50'
                        }`}
                     >
                        <Clock className="w-3.5 h-3.5" /> In Progress
                     </button>
                     <button
                        onClick={() => setFilterStatus('COMPLETED')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                           filterStatus === 'COMPLETED'
                              ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/50'
                              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                        }`}
                     >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                     </button>
                  </div>
               </div>
            </div>

            {/* Task Grid rendering */}
            {isLoading ? (
               <TasksSkeleton />
            ) : filteredTasks.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-zinc-300 rounded-2xl bg-zinc-50/50">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center mb-5 shadow-sm">
                     {filterStatus === 'ALL' ? (
                        <CheckCircle2 className="w-8 h-8 text-zinc-300" />
                     ) : filterStatus === 'IN_PROGRESS' ? (
                        <Clock className="w-8 h-8 text-amber-300" />
                     ) : (
                        <Search className="w-8 h-8 text-zinc-300" />
                     )}
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-950 mt-1">No tasks found</h3>
                  <p className="text-sm text-zinc-500 mt-2 max-w-sm text-balance leading-relaxed">
                     {searchQuery
                        ? "We couldn't find anything matching your search. Try adjusting your query."
                        : "You're all caught up! Create a new task to start tracking your time."}
                  </p>
                  {searchQuery && (
                     <button
                        onClick={() => setSearchQuery('')}
                        className="mt-5 text-sm font-semibold text-zinc-900 border border-zinc-200 px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors shadow-sm"
                     >
                        Clear Search
                     </button>
                  )}
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTasks.map((task) => (
                     <TaskCard
                        key={task.id}
                        task={task}
                        isActive={activeTaskId === task.id}
                        onStartTimer={handleStartTimer}
                        onStopTimer={handleStopTimer}
                        onComplete={handleComplete}
                        onEdit={handleOpenModal}
                        onDelete={handleDelete}
                     />
                  ))}
               </div>
            )}
         </main>

         {/* Extracted Form Modal Component */}
         {isModalOpen && (
            <TaskFormModal
               isOpen={isModalOpen}
               onClose={() => setIsModalOpen(false)}
               onSave={handleSaveTask}
               initialData={editingTask}
            />
         )}

         {/* Timer Switch Confirmation Modal */}
         {pendingStartTaskId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <div
                  className="absolute inset-0 bg-zinc-950/20 backdrop-blur-sm animate-in fade-in duration-200"
                  onClick={() => setPendingStartTaskId(null)}
               />
               <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100/50">
                     <Clock className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-semibold text-zinc-950 mb-2">Switch Active Timer?</h2>
                  <p className="text-sm text-zinc-500 mb-6 text-balance">
                     You already have a task in progress. Do you want to stop the current timer and
                     start tracking this one instead?
                  </p>
                  <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-center gap-3">
                     <button
                        onClick={() => setPendingStartTaskId(null)}
                        className="h-10 px-4 w-full sm:w-auto font-medium text-sm text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors shadow-sm"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={handleConfirmSwitchTimer}
                        className="h-10 px-4 w-full sm:w-auto font-medium text-sm text-white bg-zinc-950 border border-zinc-950 rounded-lg hover:bg-zinc-900 transition-colors shadow-sm"
                     >
                        Stop Old & Start New
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
