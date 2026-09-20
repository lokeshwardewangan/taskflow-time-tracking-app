import { createBrowserRouter } from 'react-router';
import Layout from '@/layout/Layout';
import AuthLayout from '@/layout/AuthLayout';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import UserLayout from '@/layout/UserLayout';
import TasksPage from '@/pages/tasks/TasksPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import { Navigate } from 'react-router';
import { useUser } from '@/features/auth/hooks';
import { Loader2 } from 'lucide-react';

const RootRedirect = () => {
   const { data: userResponse, isLoading } = useUser();
   if (isLoading)
      return (
         <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
         </div>
      );
   if (userResponse?.data) return <Navigate to="/dashboard" replace />;
   return <Navigate to="/auth/login" replace />;
};

const router = createBrowserRouter([
   {
      path: '/',
      element: <Layout />,
      children: [
         {
            index: true,
            element: <RootRedirect />,
         },
         {
            path: 'auth',
            element: <AuthLayout />,
            children: [
               {
                  path: 'login',
                  element: <LoginPage />,
               },
               {
                  path: 'register',
                  element: <RegisterPage />,
               },
            ],
         },
         {
            element: <UserLayout />,
            children: [
               {
                  path: 'dashboard',
                  element: <DashboardPage />,
               },
               {
                  path: 'tasks',
                  element: <TasksPage />,
               },
            ],
         },
      ],
   },
]);

export default router;
