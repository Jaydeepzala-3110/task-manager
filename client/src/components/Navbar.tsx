import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/authSlice";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    return user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard';
  };

  return (
    <header className="w-full bg-black backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between bg-black">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
          <span className="font-semibold text-lg tracking-tight text-white">
            Taskify
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to={getDashboardPath()}>
                <Button
                  variant="ghost"
                  className="cursor-pointer relative z-10 bg-transparent hover:text-white hover:bg-neutral-800 border border-transparent text-white text-sm md:text-sm transition font-medium duration-200 rounded-full px-4 py-2 flex items-center justify-center dark:text-white dark:hover:bg-neutral-800 dark:hover:shadow-xl"
                >
                  <User size={16} className="mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="cursor-pointer bg-neutral-900 relative z-10 hover:bg-black/90 border border-transparent text-white text-sm md:text-sm transition font-medium duration-182 rounded-full px-4 py-2 flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset]"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="cursor-pointer relative z-10 bg-transparent hover:text-white hover:bg-neutral-800 border border-transparent text-white text-sm md:text-sm transition font-medium duration-200 rounded-full px-4 py-2 flex items-center justify-center dark:text-white dark:hover:bg-neutral-800 dark:hover:shadow-xl"
                >
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="cursor-pointer bg-neutral-900 relative z-10 hover:bg-black/90 border border-transparent text-white text-sm md:text-sm transition font-medium duration-182 rounded-full px-4 py-2 flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset]">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>

        <button
          onClick={() => setIsMenuOpen((s) => !s)}
          className="md:hidden p-2 text-white hover:bg-gray-800 rounded-md transition-colors"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-black/95 backdrop-blur">
          <div className="mx-auto max-w-xs space-y-3 flex flex-col items-center mt-4 w-full px-4">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardPath()} className="w-full" onClick={closeMenu}>
                  <Button
                    variant="ghost"
                    className="w-full h-10 cursor-pointer relative z-10 bg-transparent hover:text-white hover:bg-neutral-800 border border-transparent text-white text-sm md:text-sm transition font-medium duration-200 rounded-full px-4 py-2 flex items-center justify-center dark:text-white dark:hover:bg-neutral-800 dark:hover:shadow-xl"
                  >
                    <User size={16} className="mr-2" />
                    Dashboard
                  </Button>
                </Link>

                <Button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  variant="ghost"
                  className="w-full h-10 cursor-pointer bg-neutral-900 relative z-10 hover:bg-black/90 border border-transparent text-white text-sm md:text-sm transition font-medium duration-182 rounded-full px-4 py-2 flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset]"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="w-full" onClick={closeMenu}>
                  <Button
                    variant="ghost"
                    className="w-full h-10 cursor-pointer relative z-10 bg-transparent hover:text-white hover:bg-neutral-800 border border-transparent text-white text-sm md:text-sm transition font-medium duration-200 rounded-full px-4 py-2 flex items-center justify-center dark:text-white dark:hover:bg-neutral-800 dark:hover:shadow-xl"
                  >
                    Login
                  </Button>
                </Link>

                <Link to="/register" className="w-full" onClick={closeMenu}>
                  <Button className="w-full h-10 cursor-pointer bg-neutral-900 relative z-10 hover:bg-black/90 border border-transparent text-white text-sm md:text-sm transition font-medium duration-182 rounded-full px-4 py-2 flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset]">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
