import { Outlet, Navigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/features/auth/hooks';
import { UserHeader } from './UserHeader';

const UserLayout = () => {
   const { data: userResponse, isLoading } = useUser();

   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
         </div>
      );
   }

   if (!userResponse?.data) {
      return <Navigate to="/auth/login" replace />;
   }

   const user = userResponse.data;

   return (
      <div className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-zinc-200">
         <UserHeader user={user} />
         <Outlet />
      </div>
   );
};

export default UserLayout;
