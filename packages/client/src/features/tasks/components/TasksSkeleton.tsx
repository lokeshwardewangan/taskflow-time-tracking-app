export function TasksSkeleton() {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {[...Array(6)].map((_, i) => (
            <div
               key={i}
               className="flex flex-col p-5 bg-white border border-zinc-200 rounded-xl h-[180px]"
            >
               <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-2 w-full">
                     <div className="h-5 w-40 bg-zinc-200 rounded-md animate-pulse" />
                     <div className="h-4 w-[70%] bg-zinc-100 rounded-md animate-pulse mt-1" />
                  </div>
                  <div className="flex gap-1 shrink-0 ml-4">
                     <div className="w-7 h-7 bg-zinc-100 rounded-md animate-pulse" />
                     <div className="w-7 h-7 bg-zinc-100 rounded-md animate-pulse" />
                  </div>
               </div>
               <div className="flex gap-2 mb-auto mt-2">
                  <div className="h-6 w-20 bg-zinc-100 rounded-md animate-pulse" />
                  <div className="h-6 w-16 bg-zinc-100 rounded-md animate-pulse" />
               </div>
               <div className="mt-4 pt-4 border-t border-zinc-100 flex justify-between">
                  <div className="h-8 w-28 bg-zinc-100 rounded-lg animate-pulse" />
                  <div className="h-8 w-24 bg-zinc-100 rounded-lg animate-pulse" />
               </div>
            </div>
         ))}
      </div>
   );
}
