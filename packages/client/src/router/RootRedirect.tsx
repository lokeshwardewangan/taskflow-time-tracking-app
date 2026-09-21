import { Navigate } from 'react-router';
import { useUser } from '@/features/auth/hooks';
import { SplashLoader } from '@/components/ui/SplashLoader';

export function RootRedirect() {
   const { data: userResponse, isLoading } = useUser();
   if (isLoading) {
      return <SplashLoader message="Loading interface..." />;
   }
   if (userResponse?.data) return <Navigate to="/tasks" replace />;
   return <Navigate to="/auth/login" replace />;
}
