interface SplashLoaderProps {
   message?: string;
}

export function SplashLoader({ message = 'Loading...' }: SplashLoaderProps) {
   return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white z-[999]">
         <div className="w-12 h-12 mb-5 bg-zinc-950 text-white flex items-center justify-center rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            <svg
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth="2.5"
               strokeLinecap="round"
               strokeLinejoin="round"
               className="w-6 h-6 relative z-10"
            >
               <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
         </div>
         <div className="text-zinc-400 text-sm font-medium animate-pulse tracking-wide">
            {message}
         </div>
      </div>
   );
}
