import { Outlet } from 'react-router';

export default function Layout() {
   return (
      <div className="min-h-screen flex flex-col">
         {/* Nav goes here */}
         <main className="flex-1">
            <Outlet />
         </main>
      </div>
   );
}
