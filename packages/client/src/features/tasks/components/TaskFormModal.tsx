import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Task } from '../types';

interface TaskFormModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSave: (data: { title: string; description: string }) => void;
   initialData: Task | null;
}

export function TaskFormModal({ isOpen, onClose, onSave, initialData }: TaskFormModalProps) {
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');

   useEffect(() => {
      if (isOpen) {
         // eslint-disable-next-line react-hooks/set-state-in-effect
         setTitle(initialData?.title || '');
         setDescription(initialData?.description || '');
      }
   }, [isOpen, initialData]);

   if (!isOpen) return null;

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({ title, description });
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

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
               <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-900">Task Title</label>
                  <input
                     type="text"
                     required
                     autoFocus
                     className="w-full h-11 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-500 transition-all placeholder:text-zinc-400 shadow-sm"
                     placeholder="e.g. Design presentation slides"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-900">
                     Description <span className="text-zinc-500 font-normal">(Optional)</span>
                  </label>
                  <textarea
                     className="w-full h-24 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-500 transition-all resize-none placeholder:text-zinc-400 shadow-sm"
                     placeholder="Add some details..."
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                  />
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
