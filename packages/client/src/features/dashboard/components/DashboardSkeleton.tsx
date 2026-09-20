export function DashboardSkeleton() {
   return (
      <div className="pb-20">
         <main className="max-w-[1400px] mx-auto px-6 mt-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
               <div>
                  <div className="h-8 w-48 bg-zinc-200 rounded-md animate-pulse mb-2"></div>
                  <div className="h-4 w-64 bg-zinc-100 rounded-md animate-pulse"></div>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
               {[...Array(4)].map((_, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-zinc-200 bg-white">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 animate-pulse" />
                        <div className="h-5 w-24 bg-zinc-100 rounded-md animate-pulse" />
                     </div>
                     <div className="h-8 w-32 bg-zinc-100 rounded-md animate-pulse mb-1" />
                  </div>
               ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
               <div className="lg:col-span-4 p-5 rounded-2xl border border-zinc-200 bg-white flex flex-col h-[400px]">
                  <div className="h-6 w-32 bg-zinc-100 rounded-md animate-pulse mb-8" />
                  <div className="flex-1 w-full bg-zinc-50 rounded-xl animate-pulse" />
               </div>
               <div className="lg:col-span-3 p-5 rounded-2xl border border-zinc-200 bg-white flex flex-col h-[400px]">
                  <div className="flex items-center justify-between mb-6">
                     <div className="h-6 w-24 bg-zinc-100 rounded-md animate-pulse" />
                     <div className="h-6 w-16 bg-zinc-100 rounded-md animate-pulse" />
                  </div>
                  <div className="flex flex-col gap-4">
                     {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-zinc-200 animate-pulse" />
                              <div className="h-4 w-32 bg-zinc-100 rounded-md animate-pulse" />
                           </div>
                           <div className="h-4 w-12 bg-zinc-100 rounded-md animate-pulse" />
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
}
