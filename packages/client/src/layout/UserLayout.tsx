import { Outlet, NavLink } from 'react-router';
import { User, LogOut } from 'lucide-react';

const UserLayout = () => {
   return (
      <div className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-zinc-200">
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
                     <span className="font-bold tracking-tight text-lg text-zinc-950 hidden sm:block">
                        TimeFlow
                     </span>
                  </div>
                  {/* Nav Links */}
                  <nav className="hidden md:flex items-center gap-6">
                     <NavLink
                        to="/dashboard"
                        end
                        className={({ isActive }) =>
                           `text-sm font-medium transition-colors ${isActive ? 'text-zinc-950' : 'text-zinc-500 hover:text-zinc-950'}`
                        }
                     >
                        Dashboard
                     </NavLink>
                     <NavLink
                        to="/tasks"
                        className={({ isActive }) =>
                           `text-sm font-medium transition-colors ${isActive ? 'text-zinc-950' : 'text-zinc-500 hover:text-zinc-950'}`
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
                     <button className="flex items-center justify-center hover:bg-zinc-50 p-0.5 rounded-full border border-transparent hover:border-zinc-200 transition-all focus:outline-none outline-none">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                           <User className="w-4 h-4 text-zinc-600" />
                        </div>
                     </button>

                     {/* Dropdown Menu */}
                     <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-zinc-200 shadow-xl rounded-xl opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all origin-top-right transform scale-95 group-hover/nav:scale-100 z-50">
                        <div className="p-1.5 flex flex-col gap-0.5">
                           <div className="px-3 flex flex-col py-2 border-b border-zinc-100 mb-1">
                              <span className="text-sm font-semibold text-zinc-900">
                                 Admin User
                              </span>
                              <span className="text-xs text-zinc-500 truncate">
                                 admin@example.com
                              </span>
                           </div>
                           <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 rounded-lg transition-colors font-medium">
                              <User className="w-4 h-4" /> Profile Settings
                           </button>
                           <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors font-medium">
                              <LogOut className="w-4 h-4" /> Log out
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </header>

         <Outlet />
      </div>
   );
};

export default UserLayout;
