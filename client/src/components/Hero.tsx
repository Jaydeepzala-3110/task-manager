import { Button } from "./ui/button";
import Dashboard from "./Dashboard";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-black min-h-screen flex items-center">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-tight text-white">
          Organize tasks with{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            simplicity
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-gray-300 text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed">
          Taskify helps you create, prioritize, and track tasks effortlessly. Stay focused with smart filters and instant insights.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/register" className="w-full sm:w-auto">
            <Button className="w-full cursor-pointer sm:w-auto bg-neutral-900 relative z-10 hover:bg-black/90 border border-transparent text-white text-sm md:text-base transition font-medium duration-200 rounded-full px-8 py-3 flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset] hover:shadow-[0px_-1px_0px_0px_#FFFFFF60_inset,_0px_1px_0px_0px_#FFFFFF60_inset] hover:scale-105 transform">
              Get Started
            </Button>
          </a>
         
        </div>

        {/* Feature Cards */}
        <div className="mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          <div className="group rounded-xl border border-gray-700 p-6 bg-gray-900/60 backdrop-blur hover:bg-gray-800/60 transition-all duration-300 hover:border-gray-600 hover:shadow-xl hover:shadow-purple-500/10">
            <h3 className="font-semibold text-white text-lg mb-2">Smart Filters</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Filter by status, priority, assignee, and due dates to find what matters most to you.
            </p>
          </div>
          <div className="group rounded-xl border border-gray-700 p-6 bg-gray-900/60 backdrop-blur hover:bg-gray-800/60 transition-all duration-300 hover:border-gray-600 hover:shadow-xl hover:shadow-indigo-500/10">
            <h3 className="font-semibold text-white text-lg mb-2">Real-time Insights</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              See counts by status, overdue tasks, and priorities in one comprehensive glance.
            </p>
          </div>
          <div className="group rounded-xl border border-gray-700 p-6 bg-gray-900/60 backdrop-blur hover:bg-gray-800/60 transition-all duration-300 hover:border-gray-600 hover:shadow-xl hover:shadow-pink-500/10 sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-white text-lg mb-2">Team-ready</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Admins get full visibility; members see what they create or own for perfect collaboration.
            </p>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white mb-8">See it in action</h2>
          <Dashboard />
        </div>
      </div>
    </section>
  );
};


export default Hero