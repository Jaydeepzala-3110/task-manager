import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Add API call to login user
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
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    id="email"
                    name="email"
                    type="email"
                    placeholder="hello@johndoe.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full dark:bg-neutral-900 px-4 rounded-md border-0 py-1.5 shadow-aceternity text-white placeholder:text-gray-400 focus:ring-2 focus:ring-neutral-400 focus:outline-none sm:text-sm sm:leading-6"
                  />
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
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full dark:bg-neutral-900 px-4 rounded-md border-0 py-1.5 shadow-aceternity text-white placeholder:text-gray-400 focus:ring-2 focus:ring-neutral-400 focus:outline-none sm:text-sm sm:leading-6"
                  />
                  <div className="absolute right-3 top-[30%]">
                    {/* Eye Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-eye text-gray-400 cursor-pointer h-4"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Sign In Button */}
              <div>
                <button
                  type="submit"
                  className="bg-neutral-900 cursor-pointer relative z-10 hover:bg-black/90 border border-transparent text-white text-sm md:text-sm transition font-medium duration-200 rounded-full px-4 py-2 flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset] w-full"
                >
                  Sign In
                </button>
                <p className="text-sm text-center mt-4 text-muted dark:text-muted-dark">
                  Don't have an account?{" "}
                  <Link className="text-white dark:text-white" to="/register">
                    Sign up
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
              By signing in, you agree to our{" "}
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

export default Login;
