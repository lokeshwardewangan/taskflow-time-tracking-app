import { Outlet, Navigate } from 'react-router';
import { useUser } from '@/features/auth/hooks';
import { UserHeader } from './UserHeader';
import { SplashLoader } from '@/components/ui/SplashLoader';

const UserLayout = () => {
   const { data: userResponse, isLoading } = useUser();

   if (isLoading) {
      return <SplashLoader message="Preparing workspace..." />;
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
