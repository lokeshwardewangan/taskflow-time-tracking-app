import { useEffect, useId, useRef, useState } from 'react';
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
   const [profileOpen, setProfileOpen] = useState(false);
   const profileRef = useRef<HTMLDivElement>(null);
   const profileButtonRef = useRef<HTMLButtonElement>(null);
   const profileId = useId();

   useEffect(() => {
      if (!profileOpen) return;

      const handlePointerDown = (event: PointerEvent) => {
         if (!profileRef.current?.contains(event.target as Node)) setProfileOpen(false);
      };
      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key === 'Escape') {
            setProfileOpen(false);
            profileButtonRef.current?.focus();
         }
      };

      document.addEventListener('pointerdown', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
         document.removeEventListener('pointerdown', handlePointerDown);
         document.removeEventListener('keydown', handleKeyDown);
      };
   }, [profileOpen]);

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
         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 md:gap-x-8 md:h-16">
            {/* Logo and Navigation */}
            <div className="contents">
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
                  <span className="font-bold tracking-tight text-xl relative top-0.5 text-zinc-950">
                     TimeFlow
                  </span>
               </div>
               {/* Nav Links */}
               <nav
                  aria-label="Main navigation"
                  className="row-start-2 col-span-2 md:row-start-1 md:col-start-2 md:col-span-1 flex items-center gap-1.5 pt-1 pb-2 md:py-0 md:pl-6 border-t md:border-t-0 md:border-l border-zinc-200/50"
               >
                  <NavLink
                     to="/dashboard"
                     end
                     className={({ isActive }) =>
                        `flex min-h-11 flex-1 md:flex-none items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 ${isActive ? 'bg-zinc-100/80 text-zinc-950 shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 border border-transparent'}`
                     }
                  >
                     Dashboard
                  </NavLink>
                  <NavLink
                     to="/tasks"
                     className={({ isActive }) =>
                        `flex min-h-11 flex-1 md:flex-none items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 ${isActive ? 'bg-zinc-100/80 text-zinc-950 shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 border border-transparent'}`
                     }
                  >
                     Tasks
                  </NavLink>
               </nav>
            </div>

            {/* Right Side Actions & Profile */}
            <div className="row-start-1 col-start-2 md:col-start-3 flex h-16 items-center justify-end min-w-0">
               {/* User Profile Dropdown */}
               <div
                  ref={profileRef}
                  className="relative"
                  onBlur={(event) => {
                     if (!event.currentTarget.contains(event.relatedTarget)) setProfileOpen(false);
                  }}
               >
                  <button
                     ref={profileButtonRef}
                     type="button"
                     aria-label="Your profile"
                     aria-expanded={profileOpen}
                     aria-controls={profileId}
                     onClick={() => setProfileOpen((open) => !open)}
                     className="flex min-h-11 items-center cursor-pointer gap-2.5 hover:bg-zinc-50 pl-1 pr-3 py-1 rounded-full border border-transparent hover:border-zinc-200 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
                  >
                     <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        <User className="w-4 h-4" />
                     </div>
                     <span className="max-w-32 lg:max-w-48 truncate text-sm font-semibold text-zinc-700 hidden sm:block tracking-tight">
                        {user.name || 'User'}
                     </span>
                     <ChevronDown
                        className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${profileOpen ? '-rotate-180' : ''}`}
                     />
                  </button>

                  {/* Dropdown Menu */}
                  <div
                     id={profileId}
                     hidden={!profileOpen}
                     className="absolute right-0 top-full mt-1.5 w-64 max-w-[calc(100vw-2rem)] bg-white border border-zinc-200 shadow-xl rounded-xl z-50"
                  >
                     <div className="p-1.5 flex flex-col gap-0.5">
                        <div className="px-3 flex flex-col py-2 border-b border-zinc-100 mb-1">
                           <span className="text-sm font-semibold text-zinc-900 wrap-anywhere">
                              {user.name || 'User'}
                           </span>
                           <span className="text-xs text-zinc-500 wrap-anywhere">{user.email}</span>
                        </div>
                        <button
                           onClick={handleLogout}
                           disabled={logoutMutation.isPending}
                           className="flex min-h-11 items-center cursor-pointer gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors font-medium text-left focus-visible:outline-2 focus-visible:outline-red-500"
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
