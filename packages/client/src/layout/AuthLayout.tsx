import { Outlet, Navigate } from 'react-router';
import { useUser } from '@/features/auth/hooks';
import { SplashLoader } from '@/components/ui/SplashLoader';

export default function AuthLayout() {
   const { data: userResponse, isLoading } = useUser();

   if (isLoading) {
      return <SplashLoader message="Authenticating..." />;
   }

   if (userResponse?.data) {
      return <Navigate to="/dashboard" replace />;
   }

   return (
      <div className="min-h-screen w-full flex bg-white font-sans selection:bg-zinc-200">
         {/* Left Side - Brand Context */}
         <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-zinc-950 text-zinc-50 relative overflow-hidden border-r border-zinc-800">
            {/* Subtle Grid Background replacing the generic radial blur */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

            {/* Sharp Brand Header */}
            <div className="relative z-10 flex items-center gap-2.5 select-none">
               <div className="w-8 h-8 bg-white text-zinc-950 flex items-center justify-center rounded-md shrink-0 shadow-sm">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2.5"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     className="w-4 h-4"
                  >
                     <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
               </div>
               <span className="font-semibold tracking-tight text-xl">TimeFlow</span>
            </div>

            {/* Testimonial Feature */}
            <div className="relative z-10 max-w-lg mb-8">
               <blockquote className="space-y-5">
                  <p className="text-xl leading-relaxed text-zinc-300 font-medium text-balance">
                     &ldquo;This tool completely changed the way our engineering team tracks
                     velocity and manages focus hours. An absolute game-changer.&rdquo;
                  </p>
                  <footer className="text-sm">
                     <p className="font-semibold text-white">Sofia Davis</p>
                     <p className="text-zinc-500 mt-1">VP of Engineering, Acme Inc</p>
                  </footer>
               </blockquote>
            </div>
         </div>

         {/* Right Side - Auth Forms */}
         <div className="flex-1 flex flex-col justify-center px-6 lg:px-16 w-full max-w-xl mx-auto relative lg:bg-white bg-zinc-50">
            {/* Mobile Nav/Logo */}
            <div className="lg:hidden flex items-center gap-2 mb-12 mt-6 shrink-0 select-none justify-center">
               <div className="w-8 h-8 bg-zinc-950 text-white flex items-center justify-center rounded-md shrink-0 shadow-sm">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2.5"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     className="w-4 h-4"
                  >
                     <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
               </div>
               <span className="font-semibold tracking-tight text-xl text-zinc-950">TimeFlow</span>
            </div>

            {/* Injected Content bounded perfectly */}
            <main className="w-full sm:w-[400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
               <Outlet />
            </main>
         </div>
      </div>
   );
}
