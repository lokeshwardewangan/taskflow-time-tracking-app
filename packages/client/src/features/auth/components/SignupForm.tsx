import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router';

export function SignupForm() {
   const [showPassword, setShowPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1200);
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

         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2.5">
               <Label htmlFor="name" className="text-zinc-700 font-medium">
                  Full Name
               </Label>
               <Input
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  required
                  autoComplete="name"
                  disabled={isLoading}
                  className="h-11 px-3 py-2 bg-white border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-950 transition-all shadow-sm rounded-lg"
               />
            </div>

            <div className="space-y-2.5">
               <Label htmlFor="email" className="text-zinc-700 font-medium">
                  Email Address
               </Label>
               <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  disabled={isLoading}
                  className="h-11 px-3 py-2 bg-white border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-950 transition-all shadow-sm rounded-lg"
               />
            </div>

            <div className="space-y-2.5">
               <Label htmlFor="password" className="text-zinc-700 font-medium">
                  Password
               </Label>
               <div className="relative">
                  <Input
                     id="password"
                     type={showPassword ? 'text' : 'password'}
                     required
                     placeholder="password"
                     disabled={isLoading}
                     autoComplete="new-password"
                     className="h-11 px-3 py-2 pr-10 bg-white border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-950 transition-all shadow-sm rounded-lg"
                  />
                  <button
                     type="button"
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-800 focus:outline-none transition-colors"
                     onClick={() => setShowPassword(!showPassword)}
                  >
                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
               </div>
               <p className="text-[13px] text-zinc-500 mt-1 font-medium leading-relaxed">
                  Must be at least 6 characters long.
               </p>
            </div>

            <Button
               type="submit"
               disabled={isLoading}
               className="w-full h-11 bg-zinc-950 hover:bg-zinc-900 text-white font-medium shadow-sm transition-all active:scale-[0.98] mt-4 rounded-lg"
            >
               {isLoading ? (
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
