import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { register as registerUser, clearError } from '../store/authSlice';
import { registerSchema, type RegisterFormData } from '../lib/validations';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      
      // Show success message or redirect
      reset();
    } catch (error) {
      // Error is handled by the Redux slice
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="bg-black antialiased h-full w-full">
    <main className="flex h-full min-h-screen w-full">
      <div className="flex items-center w-full justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div>
            <div className="flex">
              <Link
                className="font-normal flex space-x-2 items-center text-sm mr-4 text-white px-2 py-1 relative z-20"
                to="/"
              >
                <div className="h-5 w-5 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm"></div>
                <span className="font-medium text-white dark:text-white">
                  Taskify
                </span>
              </Link>
            </div>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-white dark:text-white">
              Sign up for an account
            </h2>
          </div>

          <div className="mt-10">
            {/* Error Toast */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Full Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-white dark:text-muted-dark"
                >
                  Full name
                </label>
                <div className="mt-2">
                  <input
                    {...register('username')}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Jaydeep Zala"
                    className={`block w-full dark:bg-neutral-900 px-4 rounded-md border-0 py-1.5  shadow-aceternity text-white placeholder:text-gray-400 focus:ring-2 focus:ring-neutral-400 focus:outline-none sm:text-sm sm:leading-6 ${
                      errors.username ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-400">{errors.username.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-white dark:text-muted-dark"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    {...register('email')}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="hello@johndoe.com"
                    className={`block w-full dark:bg-neutral-900 px-4 rounded-md border-0 py-1.5 shadow-aceternity text-white placeholder:text-gray-400 focus:ring-2 focus:ring-neutral-400 focus:outline-none sm:text-sm sm:leading-6 ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white dark:text-muted-dark"
                >
                  Password
                </label>
                <div className="mt-2 relative">
                  <input
                    {...register('password')}
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`block w-full dark:bg-neutral-900 px-4 rounded-md border-0 py-1.5 shadow-aceternity text-white placeholder:text-gray-400 focus:ring-2 focus:ring-neutral-400 focus:outline-none sm:text-sm sm:leading-6 pr-12 ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[30%] text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
                  )}
                </div>
              </div>

              {/* Sign Up Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-neutral-900 cursor-pointer relative z-10 hover:bg-black/90 border border-transparent text-white text-sm md:text-sm transition font-medium duration-200 rounded-full px-4 py-2 flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset] w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Creating Account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </button>
                <p className="text-sm text-center mt-4 text-muted dark:text-muted-dark">
                  Already have an account?{" "}
                  <Link className="text-white dark:text-white" to="/login">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Divider */}
          <div className="mt-10">
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-neutral-300 dark:border-neutral-700"></div>
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
              </div>
            </div>

            <p className="text-neutral-600 dark:text-neutral-400 text-sm text-center mt-8">
              By clicking on sign up, you agree to our{" "}
              <a className="text-neutral-500 dark:text-neutral-300" href="#">
                Terms of Service
              </a>{" "}
              and{" "}
              <a className="text-neutral-500 dark:text-neutral-300" href="#">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
    </div>
  );
};

export default Register;
