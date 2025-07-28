import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SchemesPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [businessProfile, setBusinessProfile] = useState({
    industryType: '',
    scale: ''
  });
  const [showFilterForm, setShowFilterForm] = useState(false);

  // Industry types for dropdown
  const industryTypes = [
    'All',
    'Manufacturing',
    'Service',
    'Retail',
    'Food & Beverages',
    'Technology',
    'Healthcare',
    'Education'
  ];

  // Business scales for dropdown
  const businessScales = [
    'MSME',
    'Small',
    'Medium',
    'Large',
    'Startup'
  ];

  // Fetch schemes on component mount
  useEffect(() => {
    fetchSchemes();
  }, []);

  // Fetch schemes from backend
  const fetchSchemes = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/schemes/match', filters);
      setSchemes(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching schemes:', err);
      setError('Failed to load schemes. Please try again later.');
      // Load default schemes if API fails
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusinessProfile({
      ...businessProfile,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSchemes(businessProfile);
    setShowFilterForm(false);
  };

  // Category badge colors
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Financial Support':
        return 'bg-green-100 text-green-800';
      case 'Loan':
        return 'bg-blue-100 text-blue-800';
      case 'Credit Guarantee':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Government Schemes</h1>
          <p className="mt-2 text-sm text-gray-700">
            Explore government schemes and programs to support your business growth.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowFilterForm(!showFilterForm)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            {showFilterForm ? 'Hide Filters' : 'Find Matching Schemes'}
          </button>
        </div>
      </div>

      {/* Filter Form */}
      {showFilterForm && (
        <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-2 md:gap-6">
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="industryType" className="block text-sm font-medium text-gray-700">
                      Industry Type
                    </label>
                    <select
                      id="industryType"
                      name="industryType"
                      value={businessProfile.industryType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select Industry</option>
                      {industryTypes.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="scale" className="block text-sm font-medium text-gray-700">
                      Business Scale
                    </label>
                    <select
                      id="scale"
                      name="scale"
                      value={businessProfile.scale}
                      onChange={handleInputChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select Scale</option>
                      {businessScales.map((scale) => (
                        <option key={scale} value={scale}>
                          {scale}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowFilterForm(false)}
                    className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Find Schemes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Loading and Error States */}
      {loading && (
        <div className="mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading schemes...</p>
        </div>
      )}

      {error && (
        <div className="mt-8 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && schemes.length === 0 && (
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">No matching schemes found. Try adjusting your filters.</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && schemes.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {schemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
          >
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">{scheme.title}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getCategoryColor(
                    scheme.category
                  )}`}
                >
                  {scheme.category}
                </span>
              </p>
            </div>
            <div className="px-4 py-4 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Eligibility</dt>
                  <dd className="mt-1 text-sm text-gray-900">{scheme.eligibility}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Benefits</dt>
                  <dd className="mt-1 text-sm text-gray-900">{scheme.benefits}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Application Deadline</dt>
                  <dd className="mt-1 text-sm text-gray-900">{scheme.deadline}</dd>
                </div>
                {scheme.description && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900">{scheme.description}</dd>
                  </div>
                )}
                {scheme.documents && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Required Documents</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <ul className="list-disc pl-5 text-xs">
                        {scheme.documents.map((doc, index) => (
                          <li key={index}>{doc}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            <div className="px-4 py-4 sm:px-6 bg-gray-50">
              <button
                onClick={() => {
                  // Open in new window with error handling
                  const newWindow = window.open(null, '_blank');
                  if (newWindow) {
                    newWindow.opener = null; // For security
                    newWindow.location = scheme.applicationUrl || '#';
                    // Handle potential navigation errors
                    newWindow.addEventListener('error', (e) => {
                      // Check if it's an ERR_ABORTED error
                      if (e.message && e.message.includes('ERR_ABORTED')) {
                        newWindow.document.body.innerHTML = `
                          <div style="text-align: center; padding: 20px;">
                            <h2>Connection Error</h2>
                            <p>Unable to connect to the government portal. Please try one of these options:</p>
                            <ul style="list-style: none; padding: 0;">
                              <li style="margin: 10px 0;"><a href="${scheme.applicationUrl}" target="_blank" rel="noopener noreferrer" style="color: blue;">Try opening directly</a></li>
                              <li style="margin: 10px 0;">Copy this URL: <input type="text" value="${scheme.applicationUrl}" style="width: 100%; padding: 5px;" onclick="this.select()" readonly /></li>
                            </ul>
                          </div>
                        `;
                      }
                    });
                  } else {
                    // Fallback if popup is blocked
                    window.location.href = scheme.applicationUrl || '#';
                  }
                }}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default SchemesPage;