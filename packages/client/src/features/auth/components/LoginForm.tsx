import { useState } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schema';
import { useLoginUser } from '../hooks';
import type { LoginInput } from '../types';
import { useQueryClient } from '@tanstack/react-query';

export function LoginForm() {
   const [showPassword, setShowPassword] = useState(false);
   const [apiError, setApiError] = useState<string | null>(null);
   const navigate = useNavigate();
   const queryClient = useQueryClient();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<LoginInput>({
      resolver: zodResolver(loginSchema),
   });

   const loginMutation = useLoginUser();

   const onSubmit = (data: LoginInput) => {
      setApiError(null);

      toast.promise(loginMutation.mutateAsync(data), {
         loading: 'Signing in...',
         success: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            navigate('/dashboard');
            return 'Successfully signed in!';
         },
         error: (err: unknown) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const error = err as any;
            const msg =
               error?.response?.data?.message || Math.random() < 2
                  ? error?.message
                  : 'Failed to login';
            setApiError(msg);
            return msg;
         },
      });
   };

   return (
      <div className="flex flex-col space-y-7">
         <div className="flex flex-col space-y-2 text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-zinc-950">
               Sign In
            </h1>
            <p className="text-sm text-zinc-500">
               Enter your email and password to access your workspace.
            </p>
         </div>

         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {apiError && (
               <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{apiError}</p>
               </div>
            )}

            <div className="space-y-2.5">
               <Label htmlFor="email" className="text-zinc-700 font-medium">
                  Email Address
               </Label>
               <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="name@example.com"
                  autoComplete="email"
                  disabled={loginMutation.isPending}
                  className={`h-11 px-3 py-2 bg-white transition-all shadow-sm rounded-lg ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'border-zinc-200 focus-visible:ring-zinc-950'}`}
               />
               {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2.5">
               <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-zinc-700 font-medium">
                     Password
                  </Label>
                  <a
                     href="/forgot-password"
                     className="text-sm text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
                  ></a>
               </div>
               <div className="relative">
                  <Input
                     id="password"
                     type={showPassword ? 'text' : 'password'}
                     {...register('password')}
                     placeholder="password"
                     disabled={loginMutation.isPending}
                     autoComplete="current-password"
                     className={`h-11 px-3 py-2 pr-10 bg-white transition-all shadow-sm rounded-lg ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'border-zinc-200 focus-visible:ring-zinc-950'}`}
                  />
                  <button
                     type="button"
                     className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-800 focus:outline-none transition-colors"
                     onClick={() => setShowPassword(!showPassword)}
                  >
                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
               </div>
               {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
               )}
            </div>

            <Button
               type="submit"
               disabled={loginMutation.isPending}
               className="w-full h-11 bg-zinc-950 hover:bg-zinc-900 text-white font-medium shadow-sm transition-all active:scale-[0.98] mt-2 rounded-lg disabled:opacity-70"
            >
               {loginMutation.isPending ? (
                  <span className="flex items-center gap-2">
                     <Loader2 className="w-4 h-4 animate-spin" />
                     Authenticating
                  </span>
               ) : (
                  'Continue'
               )}
            </Button>
         </form>

         <div className="text-center text-sm text-zinc-500 pt-2">
            Don't have an account?{' '}
            <Link
               to="/auth/register"
               className="font-medium text-zinc-900 hover:underline underline-offset-4"
            >
               Sign up
            </Link>
         </div>
      </div>
   );
}
