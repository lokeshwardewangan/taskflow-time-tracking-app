import { useEffect, useState } from 'react';
import { X, AlertCircle, Sparkles, LoaderCircle, Check } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { isAxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Task, TaskSuggestion } from '../types';
import { useImproveTask } from '../hooks';

const taskSchema = z.object({
   title: z
      .string()
      .trim()
      .min(1, 'Task title is required')
      .max(200, 'Title cannot exceed 200 characters'),
   description: z
      .string()
      .trim()
      .max(4000, 'Description cannot exceed 4,000 characters')
      .optional(),
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
      control,
      getValues,
      setValue,
      setFocus,
      formState: { errors },
   } = useForm<TaskFormValues>({
      resolver: zodResolver(taskSchema),
      defaultValues: { title: '', description: '' },
   });

   const ai = useImproveTask();
   const [suggestion, setSuggestion] = useState<TaskSuggestion | null>(null);
   const [applied, setApplied] = useState(false);
   const [title = '', description = ''] = useWatch({ control, name: ['title', 'description'] });
   const canImprove =
      Boolean(title.trim() || description.trim()) &&
      title.length <= 200 &&
      description.length <= 4000;
   const validSuggestion = suggestion ? taskSchema.safeParse(suggestion) : null;
   const aiError = ai.error
      ? isAxiosError(ai.error) && ai.error.response?.status === 401
         ? 'Your session has expired. Please sign in again.'
         : isAxiosError(ai.error) && ai.error.response?.status === 422
           ? 'AI could not improve this text. Try rewording it, or continue with your original.'
           : 'AI suggestions are unavailable right now. Try again, or create your task as usual.'
      : null;

   const clearSuggestion = () => {
      setSuggestion(null);
      setApplied(false);
      ai.reset();
   };

   const improve = () => {
      if (!canImprove || ai.isPending) return;
      setApplied(false);
      const values = getValues();
      ai.mutate(
         { title: values.title.trim(), description: values.description?.trim() || '' },
         {
            onSuccess: (response) => setSuggestion(response.data),
         }
      );
   };

   const useSuggestion = () => {
      if (!validSuggestion?.success) return;
      setValue('title', validSuggestion.data.title, { shouldDirty: true, shouldValidate: true });
      setValue('description', validSuggestion.data.description || '', {
         shouldDirty: true,
         shouldValidate: true,
      });
      setSuggestion(null);
      setApplied(true);
      ai.reset();
      setFocus('title');
   };

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
      if (suggestion) return;
      onSave({ title: data.title, description: data.description || '' });
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         <div
            className="absolute inset-0 bg-zinc-950/20 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
         />
         <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-dialog-title"
            onKeyDown={(event) => {
               if (event.key === 'Escape') onClose();
               if (event.key === 'Tab') {
                  const controls = event.currentTarget.querySelectorAll<HTMLElement>(
                     'button:not(:disabled), input:not(:disabled), textarea:not(:disabled)'
                  );
                  const first = controls[0];
                  const last = controls[controls.length - 1];
                  if (event.shiftKey && document.activeElement === first) {
                     event.preventDefault();
                     last?.focus();
                  } else if (!event.shiftKey && document.activeElement === last) {
                     event.preventDefault();
                     first?.focus();
                  }
               }
            }}
            className="relative w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-100 animate-in fade-in zoom-in-95 duration-200"
         >
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
               <h2 id="task-dialog-title" className="text-lg font-semibold text-zinc-950">
                  {initialData ? 'Edit Task' : 'New Task'}
               </h2>
               <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close task dialog"
                  className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
               >
                  <X className="w-4 h-4" />
               </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
               <div className="space-y-2">
                  <label htmlFor="task-title" className="text-sm font-medium text-zinc-900">
                     Task Title
                  </label>
                  <input
                     id="task-title"
                     type="text"
                     autoFocus
                     readOnly={ai.isPending}
                     aria-invalid={Boolean(errors.title)}
                     {...register('title', { onChange: clearSuggestion })}
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
                  <label htmlFor="task-description" className="text-sm font-medium text-zinc-900">
                     Description <span className="text-zinc-500 font-normal">(Optional)</span>
                  </label>
                  <textarea
                     id="task-description"
                     readOnly={ai.isPending}
                     aria-invalid={Boolean(errors.description)}
                     {...register('description', { onChange: clearSuggestion })}
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

               {!initialData && (
                  <div className="space-y-3">
                     {!suggestion && (
                        <div className="space-y-2">
                           <button
                              type="button"
                              onClick={improve}
                              disabled={!canImprove || ai.isPending}
                              aria-describedby="ai-help"
                              className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-violet-200/60 bg-gradient-to-r from-violet-50 via-white to-sky-50 px-3 py-2 text-xs font-medium text-zinc-700 shadow-sm transition-colors hover:border-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 disabled:cursor-not-allowed disabled:opacity-50"
                           >
                              {ai.isPending ? (
                                 <LoaderCircle
                                    aria-hidden="true"
                                    className="size-3.5 animate-spin"
                                 />
                              ) : (
                                 <Sparkles
                                    aria-hidden="true"
                                    className="size-3.5 text-violet-500"
                                 />
                              )}
                              {ai.isPending ? 'Improving…' : 'Improve with AI'}
                           </button>
                           <p id="ai-help" className="text-xs leading-relaxed text-zinc-500">
                              Optional. Send your title and description to AI, then review before
                              using.
                           </p>
                        </div>
                     )}

                     <div role="status" className="text-xs text-zinc-500">
                        {ai.isPending &&
                           'Finding clearer wording. You can still create your task with the original text.'}
                        {suggestion && (
                           <span className="sr-only">AI suggestion ready to review.</span>
                        )}
                        {applied && (
                           <span className="flex items-center gap-1.5">
                              <Check aria-hidden="true" className="size-3.5" />
                              Suggestion applied. You can still edit before creating.
                           </span>
                        )}
                     </div>
                     {aiError && (
                        <p role="alert" className="text-xs leading-relaxed text-red-600">
                           {aiError}
                        </p>
                     )}

                     {suggestion && (
                        <section
                           aria-label="AI suggestion"
                           className="space-y-3 rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50/80 via-white to-sky-50/70 p-4"
                        >
                           <div>
                              <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                                 <Sparkles aria-hidden="true" className="size-4 text-violet-500" />
                                 AI suggestion
                              </h3>
                              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                                 Review or edit this version. Your original stays unchanged until
                                 you use it.
                              </p>
                           </div>
                           <div className="space-y-1.5">
                              <label
                                 htmlFor="suggested-title"
                                 className="text-xs font-medium text-zinc-700"
                              >
                                 Suggested title
                              </label>
                              <input
                                 id="suggested-title"
                                 autoFocus
                                 value={suggestion.title}
                                 maxLength={200}
                                 onChange={(event) =>
                                    setSuggestion({ ...suggestion, title: event.target.value })
                                 }
                                 className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                              />
                           </div>
                           <div className="space-y-1.5">
                              <label
                                 htmlFor="suggested-description"
                                 className="text-xs font-medium text-zinc-700"
                              >
                                 Suggested description
                              </label>
                              <textarea
                                 id="suggested-description"
                                 value={suggestion.description}
                                 maxLength={4000}
                                 onChange={(event) =>
                                    setSuggestion({
                                       ...suggestion,
                                       description: event.target.value,
                                    })
                                 }
                                 className="min-h-24 w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                              />
                           </div>
                           {!validSuggestion?.success && (
                              <p className="text-xs text-red-600">
                                 Add a title of 1–200 characters and keep the description within
                                 4,000 characters.
                              </p>
                           )}
                           <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                              <button
                                 type="button"
                                 onClick={() => {
                                    clearSuggestion();
                                    setFocus('title');
                                 }}
                                 className="min-h-9 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                              >
                                 Keep Original
                              </button>
                              <button
                                 type="button"
                                 onClick={useSuggestion}
                                 disabled={!validSuggestion?.success}
                                 className="min-h-9 rounded-lg bg-zinc-800 px-3 text-xs font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                 Use Suggestion
                              </button>
                           </div>
                           <p className="text-xs text-zinc-500">
                              Choose Use Suggestion or Keep Original, then create your task.
                           </p>
                        </section>
                     )}
                  </div>
               )}

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
                     disabled={Boolean(suggestion)}
                     className="h-10 px-4 flex items-center justify-center font-medium text-sm text-white bg-zinc-950 border border-zinc-950 rounded-lg hover:bg-zinc-900 transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                     {initialData ? 'Save Changes' : 'Create Task'}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}
