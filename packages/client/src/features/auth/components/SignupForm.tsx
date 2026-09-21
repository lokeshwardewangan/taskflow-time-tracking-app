import { useState } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schema';
import { useRegisterUser } from '../hooks';
import type { RegisterInput } from '../types';

export function SignupForm() {
   const [showPassword, setShowPassword] = useState(false);
   const [apiError, setApiError] = useState<string | null>(null);
   const navigate = useNavigate();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<RegisterInput>({
      resolver: zodResolver(registerSchema),
   });

   const registerMutation = useRegisterUser();

   const onSubmit = (data: RegisterInput) => {
      setApiError(null);

      toast.promise(registerMutation.mutateAsync(data), {
         loading: 'Creating your account...',
         success: () => {
            navigate('/auth/login');
            return 'Account created! Please log in.';
         },
         error: (err: unknown) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const error = err as any;
            const msg =
               error?.response?.data?.message || error?.message || 'Failed to create account';
            setApiError(msg);
            return msg;
         },
      });
   };

   return (
      <div className="flex flex-col space-y-7">
         <div className="flex flex-col space-y-2 text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-zinc-950">
               Create an account
            </h1>
            <p className="text-sm text-zinc-500">
               Join TimeFlow to take back control of your productivity.
            </p>
         </div>

         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {apiError && (
               <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{apiError}</p>
               </div>
            )}

            <div className="space-y-2.5">
               <Label htmlFor="name" className="text-zinc-700 font-medium">
                  Full Name
               </Label>
               <Input
                  id="name"
                  type="text"
                  {...register('name')}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  disabled={registerMutation.isPending}
                  className={`h-11 px-3 py-2 bg-white transition-all shadow-sm rounded-lg ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : 'border-zinc-200 focus-visible:ring-zinc-950'}`}
               />
               {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

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
                  disabled={registerMutation.isPending}
                  className={`h-11 px-3 py-2 bg-white transition-all shadow-sm rounded-lg ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'border-zinc-200 focus-visible:ring-zinc-950'}`}
               />
               {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2.5">
               <Label htmlFor="password" className="text-zinc-700 font-medium">
                  Password
               </Label>
               <div className="relative">
                  <Input
                     id="password"
                     type={showPassword ? 'text' : 'password'}
                     {...register('password')}
                     placeholder="password"
                     disabled={registerMutation.isPending}
                     autoComplete="new-password"
                     className={`h-11 px-3 py-2 pr-10 bg-white transition-all shadow-sm rounded-lg ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'border-zinc-200 focus-visible:ring-zinc-950'}`}
                  />
                  <button
                     type="button"
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-800 focus:outline-none transition-colors"
                     onClick={() => setShowPassword(!showPassword)}
                  >
                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
               </div>
               {errors.password ? (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
               ) : (
                  <p className="text-[13px] text-zinc-500 mt-1 font-medium leading-relaxed">
                     Must be at least 6 characters long.
                  </p>
               )}
            </div>

            <Button
               type="submit"
               disabled={registerMutation.isPending}
               className="w-full h-11 bg-zinc-950 hover:bg-zinc-900 text-white font-medium shadow-sm transition-all active:scale-[0.98] mt-4 rounded-lg disabled:opacity-70"
            >
               {registerMutation.isPending ? (
                  <span className="flex items-center gap-2">
                     <Loader2 className="w-4 h-4 animate-spin" />
                     Creating account
                  </span>
               ) : (
                  'Create Account'
               )}
            </Button>
         </form>

         <div className="text-center text-sm text-zinc-500 mt-2">
            Already have an account?{' '}
            <Link
               to="/auth/login"
               className="font-medium text-zinc-900 hover:underline underline-offset-4"
            >
               Sign In
            </Link>
         </div>
      </div>
   );
}
