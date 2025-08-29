import {
  Search,
  Users,
  UserPlus,
  Percent,
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="p-4 border bg-neutral-800 border-neutral-700 rounded-[32px] mt-20 relative">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Acme Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Full Screen
            </button>
          </div>
        </div>

        {/* Navigation Sidebar */}
        <div className="flex space-x-8">
          <div className="w-48">
            <nav className="space-y-2">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
                Dashboard
              </div>
              <div className="text-gray-600 px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                Profile
              </div>
              <div className="text-gray-600 px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                Settings
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Dashboard
            </h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Users */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-gray-800">12,345</p>
                    <p className="text-xs text-gray-500 mt-1">
                      The total number of registered users.
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* New Signups */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">New Signups</p>
                    <p className="text-2xl font-bold text-gray-800">1,234</p>
                    <p className="text-xs text-gray-500 mt-1">
                      The number of new users that signed up this month.
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Conversion Rate
                    </p>
                    <p className="text-2xl font-bold text-gray-800">12%</p>
                    <p className="text-xs text-gray-500 mt-1">
                      The percentage of visitors that become customers.
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Percent className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Revenue */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Revenue</p>
                    <p className="text-2xl font-bold text-gray-800">$123,456</p>
                    <p className="text-xs text-gray-500 mt-1">
                      The total revenue generated this month.
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales Trends */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Sales Trends</h3>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  A line chart showing sales trends over time.
                </p>
                <div className="h-32 bg-gray-50 rounded-lg flex items-end justify-center space-x-1 p-4">
                  <div className="w-8 bg-red-400 rounded-t h-8"></div>
                  <div className="w-8 bg-blue-400 rounded-t h-12"></div>
                  <div className="w-8 bg-red-400 rounded-t h-6"></div>
                  <div className="w-8 bg-blue-400 rounded-t h-10"></div>
                  <div className="w-8 bg-red-400 rounded-t h-4"></div>
                  <div className="w-8 bg-blue-400 rounded-t h-14"></div>
                  <div className="w-8 bg-red-400 rounded-t h-8"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>01</span>
                  <span>02</span>
                  <span>03</span>
                  <span>04</span>
                  <span>05</span>
                  <span>06</span>
                  <span>07</span>
                </div>
              </div>

              {/* User Acquisition */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">
                    User Acquisition
                  </h3>
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  A bar chart showing user acquisition by channel.
                </p>
                <div className="h-32 bg-gray-50 rounded-lg flex items-end justify-center space-x-2 p-4">
                  <div className="w-6 bg-blue-400 rounded-t h-16"></div>
                  <div className="w-6 bg-blue-400 rounded-t h-24"></div>
                  <div className="w-6 bg-blue-400 rounded-t h-20"></div>
                  <div className="w-6 bg-blue-400 rounded-t h-24"></div>
                  <div className="w-6 bg-blue-400 rounded-t h-18"></div>
                  <div className="w-6 bg-blue-400 rounded-t h-12"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Top Products</h3>
                  <PieChart className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  A pie chart showing the top selling products.
                </p>
                <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="w-20 h-20 bg-blue-400 rounded-full relative">
                    <div
                      className="absolute inset-0 bg-blue-400 rounded-full"
                      style={{
                        clipPath:
                          "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)",
                      }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-center space-x-4 text-xs text-gray-600 mt-2">
                  <span>72</span>
                  <span>157</span>
                  <span>150</span>
                  <span>129</span>
                  <span>111</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
