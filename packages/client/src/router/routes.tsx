import { createBrowserRouter } from 'react-router';
import Layout from '@/layout/Layout';
import AuthLayout from '@/layout/AuthLayout';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import UserLayout from '@/layout/UserLayout';
import TasksPage from '@/pages/tasks/TasksPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';

const router = createBrowserRouter([
   {
      path: '/',
      element: <Layout />,
      children: [
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
