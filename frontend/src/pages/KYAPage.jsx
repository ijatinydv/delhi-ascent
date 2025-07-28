import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

// Configure axios defaults
axios.defaults.baseURL = window.location.origin; // Use the same origin as the frontend
axios.defaults.timeout = 15000; // 15 seconds timeout

const KYAPage = () => {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Questionnaire state
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [formData, setFormData] = useState({
    industryType: '',
    scale: '',
    businessActivity: '',
    location: 'Delhi NCR' // Default location
  });
  
  // Results state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [kyaResults, setKyaResults] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setKyaResults(null); // Reset previous results
    
    try {
      const response = await axios.post(
        '/api/applications/kya-results',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 10000 // 10 second timeout
        }
      );
      
      // Validate response data structure
      if (response.data && response.data.requiredApprovals) {
        setKyaResults(response.data.requiredApprovals);
        if (response.data.requiredApprovals.length === 0) {
          setError('No approvals found for your business profile. Try adjusting your business details.');
        }
      } else {
        setError('Invalid response format from server. Please try again.');
        console.error('Invalid KYA response format:', response.data);
      }
    } catch (err) {
      console.error('KYA results error:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. The server is taking too long to respond. Please try again later.');
      } else if (!navigator.onLine) {
        setError('You appear to be offline. Please check your internet connection and try again.');
      } else if (err.response) {
        // Server responded with an error status code
        const status = err.response.status;
        if (status === 401 || status === 403) {
          setError('Authentication error. Please log in again.');
        } else if (status >= 500) {
          setError('Server error. Our team has been notified. Please try again later.');
        } else {
          setError(err.response.data?.message || `Server error: ${status}. Please try again.`);
        }
      } else if (err.request) {
        // Request was made but no response received
        setError('No response from server. Please check if the backend server is running.');
      } else {
        // Something else caused the error
        setError('Failed to get KYA results: ' + (err.message || 'Unknown error. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Sample acts and regulations data
  const acts = [
    {
      id: 1,
      title: 'Shops and Establishment Act',
      category: 'Retail',
      description: 'Regulates the working conditions of employees in shops and commercial establishments.',
      keyPoints: [
        'Registration is mandatory for all shops and establishments',
        'Regulates working hours, holidays, and leave policies',
        'Ensures proper health and safety measures',
        'Mandates proper record-keeping of employees',
      ],
    },
    {
      id: 2,
      title: 'Food Safety and Standards Act',
      category: 'Food & Beverage',
      description: 'Ensures food safety and regulates the manufacture, storage, distribution, and sale of food.',
      keyPoints: [
        'FSSAI license/registration required for food businesses',
        'Compliance with food safety standards and hygiene practices',
        'Regular inspection and quality checks',
        'Proper labeling and packaging requirements',
      ],
    },
    {
      id: 3,
      title: 'Micro, Small and Medium Enterprises Development Act',
      category: 'MSME',
      description: 'Facilitates the promotion, development, and enhances the competitiveness of MSMEs.',
      keyPoints: [
        'Udyam Registration for MSMEs',
        'Protection against delayed payments',
        'Access to various government schemes and benefits',
        'Simplified compliance procedures',
      ],
    },
    {
      id: 4,
      title: 'Goods and Services Tax (GST) Act',
      category: 'Taxation',
      description: 'A comprehensive indirect tax on the manufacture, sale, and consumption of goods and services.',
      keyPoints: [
        'GST registration required for businesses with turnover above threshold',
        'Regular filing of GST returns',
        'Input tax credit mechanism',
        'Different tax slabs for various goods and services',
      ],
    },
  ];

  // Categories for filter
  const categories = ['All', 'Retail', 'Food & Beverage', 'MSME', 'Taxation'];

  // Filter acts based on search term and category
  const filteredActs = acts.filter((act) => {
    const matchesSearch = act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || act.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Know Your Approvals</h1>
          <p className="mt-2 text-sm text-gray-700">
            Find out which licenses and approvals your business needs based on your business profile.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowQuestionnaire(!showQuestionnaire)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            {showQuestionnaire ? 'Hide Questionnaire' : 'Start Questionnaire'}
          </button>
        </div>
      </div>
      
      {/* Questionnaire Form */}
      {showQuestionnaire && (
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Business Profile Questionnaire</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="industryType" className="block text-sm font-medium text-gray-700">Industry Type</label>
                <select
                  id="industryType"
                  name="industryType"
                  value={formData.industryType}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Industry Type</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="IT & Technology">IT & Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="scale" className="block text-sm font-medium text-gray-700">Business Scale</label>
                <select
                  id="scale"
                  name="scale"
                  value={formData.scale}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Business Scale</option>
                  <option value="Micro">Micro</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                  <option value="Startup">Startup</option>
                </select>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="businessActivity" className="block text-sm font-medium text-gray-700">Business Activities</label>
                <textarea
                  id="businessActivity"
                  name="businessActivity"
                  value={formData.businessActivity}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Describe your business activities (e.g., retail sales, manufacturing, interstate commerce, etc.)"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Get Required Approvals'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* KYA Results */}
      {kyaResults && (
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Required Approvals for Your Business</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Based on your business profile, you need the following approvals:</p>
          </div>
          <div className="border-t border-gray-200">
            {kyaResults.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {kyaResults.map((approval, index) => (
                  <li key={index} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <h4 className="text-sm font-medium text-indigo-600">{approval.approvalName}</h4>
                        <p className="text-sm text-gray-500">{approval.department}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${approval.priority === 'High' ? 'bg-red-100 text-red-800' : approval.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {approval.priority} Priority
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {approval.description}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          <span className="font-medium text-gray-900">Est. Time:</span> {approval.estimatedTime}
                        </p>
                        <p className="ml-4">
                          <span className="font-medium text-gray-900">Fee:</span> {approval.applicationFee}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Link
                        to="/applications"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Apply for this approval <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No approvals found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your business profile details to get relevant approvals.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Browse Regulatory Information</h2>

      {/* Search and Filter */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Search acts and regulations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="sm:w-64">
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Acts List */}
      <div className="mt-8 space-y-6">
        {filteredActs.length > 0 ? (
          filteredActs.map((act) => (
            <div
              key={act.id}
              className="bg-white shadow overflow-hidden sm:rounded-lg"
            >
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{act.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{act.category}</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500 mb-4">{act.description}</p>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Key Compliance Points:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {act.keyPoints.map((point, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Read Full Act
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white shadow overflow-hidden sm:rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No acts found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default KYAPage;