import { NavLink } from 'react-router';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useLogoutUser } from '@/features/auth/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { User as UserType } from '@/features/auth/types';

interface UserHeaderProps {
   user: UserType;
}

export function UserHeader({ user }: UserHeaderProps) {
   const logoutMutation = useLogoutUser();
   const queryClient = useQueryClient();

   const handleLogout = () => {
      toast.promise(logoutMutation.mutateAsync(), {
         loading: 'Logging out...',
         success: () => {
            // Using setQueryData safely overrides the memory to null synchronously,
            // bypassing the isLoading re-render and instantly forcing UserLayout to throw the Navigate to Auth!
            queryClient.setQueryData(['user'], null);
            return 'Logged out successfully';
         },
         error: 'Failed to log out',
      });
   };

   return (
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-200/60">
         <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-8 w-auto shrink-0">
               <div className="flex items-center gap-2.5 select-none w-auto shrink-0">
                  <div className="w-7 h-7 bg-zinc-950 text-white flex items-center justify-center rounded-md shrink-0 shadow-sm">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3.5 h-3.5"
                     >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                     </svg>
                  </div>
                  <span className="font-bold tracking-tight text-xl relative top-0.5 text-zinc-950 hidden sm:block">
                     TimeFlow
                  </span>
               </div>
               {/* Nav Links */}
               <nav className="hidden md:flex items-center gap-1.5 px-6 border-l border-zinc-200/50">
                  <NavLink
                     to="/dashboard"
                     end
                     className={({ isActive }) =>
                        `px-3 py-1.5 rounded-md text-sm font-medium transition-all ${isActive ? 'bg-zinc-100/80 text-zinc-950 shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 border border-transparent'}`
                     }
                  >
                     Dashboard
                  </NavLink>
                  <NavLink
                     to="/tasks"
                     className={({ isActive }) =>
                        `px-3 py-1.5 rounded-md text-sm font-medium transition-all ${isActive ? 'bg-zinc-100/80 text-zinc-950 shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 border border-transparent'}`
                     }
                  >
                     Tasks
                  </NavLink>
               </nav>
            </div>

            {/* Space to keep Profile aligned Right */}
            <div className="flex-1" />

            {/* Right Side Actions & Profile */}
            <div className="flex items-center justify-end gap-3 shrink-0">
               {/* User Profile Dropdown */}
               <div className="relative group/nav">
                  <button className="flex items-center cursor-pointer gap-2.5 hover:bg-zinc-50 pl-1 pr-3 py-1 rounded-full border border-transparent hover:border-zinc-200 transition-all outline-none">
                     <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        <User className="w-4 h-4" />
                     </div>
                     <span className="text-sm font-semibold text-zinc-700 hidden sm:block tracking-tight">
                        {user.name || 'User'}
                     </span>
                     <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:block transition-transform group-hover/nav:-rotate-180 duration-300" />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-zinc-200 shadow-xl rounded-xl opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all origin-top-right transform scale-95 group-hover/nav:scale-100 z-50">
                     <div className="p-1.5 flex flex-col gap-0.5">
                        <div className="px-3 flex flex-col py-2 border-b border-zinc-100 mb-1">
                           <span className="text-sm font-semibold text-zinc-900">
                              {user.name || 'User'}
                           </span>
                           <span className="text-xs text-zinc-500 truncate">{user.email}</span>
                        </div>
                        <button
                           onClick={handleLogout}
                           disabled={logoutMutation.isPending}
                           className="flex items-center cursor-pointer gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors font-medium text-left"
                        >
                           <LogOut className="w-4 h-4" /> Log out
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </header>
   );
}
