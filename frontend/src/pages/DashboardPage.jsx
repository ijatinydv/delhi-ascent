import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    applications: 0,
    schemes: 0,
    advisories: 0,
  });

  useEffect(() => {
    // In a real app, you would fetch dashboard data from the API
    // For now, we'll just simulate some data
    const fetchDashboardData = async () => {
      // Simulate API call
      setTimeout(() => {
        setStats({
          applications: 2,
          schemes: 5,
          advisories: 3,
        });
      }, 500);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="py-6">
      <div className="px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.fullName || 'User'}! Here's an overview of your business activities.
        </p>
      </div>

      <div className="mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Stats cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Applications card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Applications</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stats.applications}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href="/applications" className="font-medium text-indigo-600 hover:text-indigo-500">
                    View all applications
                    <span className="sr-only"> applications</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Schemes card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Available Schemes</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stats.schemes}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href="/schemes" className="font-medium text-indigo-600 hover:text-indigo-500">
                    View all schemes
                    <span className="sr-only"> schemes</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Advisories card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Advisories</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stats.advisories}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href="/advisory" className="font-medium text-indigo-600 hover:text-indigo-500">
                    View all advisories
                    <span className="sr-only"> advisories</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h2>
            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900">Start a New Application</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Apply for business licenses, permits, and registrations.
                  </p>
                </div>
                <div className="px-4 py-4 sm:px-6">
                  <a
                    href="/applications/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Start Application
                  </a>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900">Check Eligibility</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Find out which government schemes your business is eligible for.
                  </p>
                </div>
                <div className="px-4 py-4 sm:px-6">
                  <a
                    href="/schemes/eligibility"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Check Now
                  </a>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900">Get Business Advisory</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Chat with our AI assistant for business compliance guidance.
                  </p>
                </div>
                <div className="px-4 py-4 sm:px-6">
                  <a
                    href="/advisory"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Start Chat
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;