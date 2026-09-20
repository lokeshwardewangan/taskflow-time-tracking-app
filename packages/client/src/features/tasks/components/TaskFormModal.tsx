import { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Task } from '../types';

const taskSchema = z.object({
   title: z
      .string()
      .min(1, 'Task title is required')
      .max(100, 'Title cannot exceed 100 characters'),
   description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSave: (data: { title: string; description: string }) => void;
   initialData: Task | null;
}

export function TaskFormModal({ isOpen, onClose, onSave, initialData }: TaskFormModalProps) {
   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<TaskFormValues>({
      resolver: zodResolver(taskSchema),
      defaultValues: { title: '', description: '' },
   });

   useEffect(() => {
      if (isOpen) {
         if (initialData) {
            reset({ title: initialData.title, description: initialData.description });
         } else {
            reset({ title: '', description: '' });
         }
      }
   }, [isOpen, initialData, reset]);

   if (!isOpen) return null;

   const onSubmit = (data: TaskFormValues) => {
      onSave({ title: data.title, description: data.description || '' });
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         <div
            className="absolute inset-0 bg-zinc-950/20 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
         />
         <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
               <h2 className="text-lg font-semibold text-zinc-950">
                  {initialData ? 'Edit Task' : 'New Task'}
               </h2>
               <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
               >
                  <X className="w-4 h-4" />
               </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
               <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-900">Task Title</label>
                  <input
                     type="text"
                     autoFocus
                     {...register('title')}
                     className={`w-full h-11 px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all placeholder:text-zinc-400 shadow-sm ${
                        errors.title
                           ? 'border-red-500 focus:border-red-500 text-red-900 placeholder:text-red-300'
                           : 'border-zinc-200 focus:border-zinc-500'
                     }`}
                     placeholder="e.g. Design presentation slides"
                  />
                  {errors.title && (
                     <p className="text-xs text-red-500 flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.title.message}
                     </p>
                  )}
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-900">
                     Description <span className="text-zinc-500 font-normal">(Optional)</span>
                  </label>
                  <textarea
                     {...register('description')}
                     className={`w-full h-24 px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all resize-none placeholder:text-zinc-400 shadow-sm ${
                        errors.description
                           ? 'border-red-500 focus:border-red-500 text-red-900 placeholder:text-red-300'
                           : 'border-zinc-200 focus:border-zinc-500'
                     }`}
                     placeholder="Add some details..."
                  />
                  {errors.description && (
                     <p className="text-xs text-red-500 flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.description.message}
                     </p>
                  )}
               </div>

               <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-3">
                  <button
                     type="button"
                     onClick={onClose}
                     className="h-10 px-4 flex items-center justify-center font-medium text-sm text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors shadow-sm"
                  >
                     Cancel
                  </button>
                  <button
                     type="submit"
                     className="h-10 px-4 flex items-center justify-center font-medium text-sm text-white bg-zinc-950 border border-zinc-950 rounded-lg hover:bg-zinc-900 transition-colors shadow-sm"
                  >
                     {initialData ? 'Save Changes' : 'Create Task'}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}
