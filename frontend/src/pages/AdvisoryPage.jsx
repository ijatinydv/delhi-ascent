import React, { useState } from 'react';
import ChatbotWidget from '../components/chatbot/ChatbotWidget.jsx';
import { FaBuilding, FaFileAlt, FaTrademark, FaMoneyBillWave, FaGlobe, FaIdCard, FaFileInvoice } from 'react-icons/fa';

const AdvisoryPage = () => {
  const [activeTab, setActiveTab] = useState('chat');
  
  // Sample legal services data
  const legalServices = [
    {
      id: 1,
      title: 'Company Incorporation',
      description: 'Complete company registration with MCA including name approval, DSC, DIN, and incorporation certificate.',
      price: '₹9,999',
      duration: '15-20 days',
      icon: <FaBuilding className="h-8 w-8 text-indigo-600" />,
      partnerUrl: 'https://www.mca.gov.in/'
    },
    {
      id: 2,
      title: 'GST Registration',
      description: 'Complete GST registration process including application filing and certificate procurement.',
      price: '₹2,999',
      duration: '3-7 days',
      icon: <FaFileInvoice className="h-8 w-8 text-indigo-600" />,
      partnerUrl: 'https://www.gst.gov.in/'
    },
    {
      id: 3,
      title: 'Trademark Filing',
      description: 'Trademark search and application filing with the Trademark Registry.',
      price: '₹7,499',
      duration: '12-18 months',
      icon: <FaTrademark className="h-8 w-8 text-indigo-600" />,
      partnerUrl: 'https://ipindia.gov.in/'
    },
    {
      id: 4,
      title: 'FSSAI Registration',
      description: 'Food business operator registration or licensing under FSSAI.',
      price: '₹3,999',
      duration: '15-30 days',
      icon: <FaIdCard className="h-8 w-8 text-indigo-600" />,
      partnerUrl: 'https://foscos.fssai.gov.in/'
    },
    {
      id: 5,
      title: 'MSME Registration',
      description: 'Official MSME/Udyam registration for your business.',
      price: '₹1,499',
      duration: '1-2 days',
      icon: <FaFileAlt className="h-8 w-8 text-indigo-600" />,
      partnerUrl: 'https://udyamregistration.gov.in/'
    },
    {
      id: 6,
      title: 'Import Export Code',
      description: 'IEC code registration for businesses involved in import/export activities.',
      price: '₹4,999',
      duration: '3-7 days',
      icon: <FaGlobe className="h-8 w-8 text-indigo-600" />,
      partnerUrl: 'https://www.dgft.gov.in/'
    },
  ];
  const [searchTerm, setSearchTerm] = useState('');

  // Sample advisors data
  const advisors = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      specialization: 'Business Registration',
      experience: '15+ years',
      rating: 4.8,
      reviews: 124,
      availability: 'Mon-Fri, 10:00 AM - 6:00 PM',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      specialization: 'Tax Compliance',
      experience: '12+ years',
      rating: 4.9,
      reviews: 98,
      availability: 'Mon-Sat, 9:00 AM - 5:00 PM',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      id: 3,
      name: 'Amit Patel',
      specialization: 'Legal Compliance',
      experience: '10+ years',
      rating: 4.7,
      reviews: 87,
      availability: 'Tue-Sat, 11:00 AM - 7:00 PM',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
      id: 4,
      name: 'Neha Gupta',
      specialization: 'Business Strategy',
      experience: '8+ years',
      rating: 4.6,
      reviews: 65,
      availability: 'Mon-Fri, 9:00 AM - 3:00 PM',
      image: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
  ];

  // Sample resources data
  const resources = [
    {
      id: 1,
      title: 'Guide to Business Registration in Delhi',
      type: 'PDF Guide',
      description: 'A comprehensive guide on how to register your business in Delhi.',
      downloadLink: '#',
    },
    {
      id: 2,
      title: 'Tax Compliance Checklist for Small Businesses',
      type: 'Checklist',
      description: 'Essential tax compliance requirements for small businesses in India.',
      downloadLink: '#',
    },
    {
      id: 3,
      title: 'Understanding GST for Startups',
      type: 'Video Tutorial',
      description: 'A detailed video tutorial explaining GST registration and filing for startups.',
      downloadLink: '#',
    },
    {
      id: 4,
      title: 'Legal Compliance Calendar 2023',
      type: 'Calendar',
      description: 'A month-by-month calendar of legal compliance deadlines for businesses.',
      downloadLink: '#',
    },
  ];

  // Filter data based on search term
  const filteredAdvisors = advisors.filter((advisor) =>
    advisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    advisor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Business Advisory</h1>
          <p className="mt-2 text-sm text-gray-700">
            Connect with business advisors and access resources to help your business grow.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Schedule Consultation
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            className={`${activeTab === 'chat'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('chat')}
          >
            AI Assistant
          </button>
          <button
            className={`${activeTab === 'advisors'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('advisors')}
          >
            Business Advisors
          </button>
          <button
            className={`${activeTab === 'resources'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
          <button
            className={`${activeTab === 'services'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('services')}
          >
            Legal Services
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6">
        <div className="relative">
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder={`Search ${activeTab === 'advisors' ? 'advisors' : 'resources'}...`}
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
      </div>

      {/* Content */}
      <div className="mt-8">
        {activeTab === 'chat' ? (
          <div className="max-w-3xl mx-auto">
            <ChatbotWidget />
          </div>
        ) : activeTab === 'advisors' ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAdvisors.map((advisor) => (
              <div
                key={advisor.id}
                className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
              >
                <div className="px-4 py-5 sm:px-6 flex items-center">
                  <img
                    className="h-16 w-16 rounded-full mr-4"
                    src={advisor.image}
                    alt={advisor.name}
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{advisor.name}</h3>
                    <p className="text-sm text-indigo-600">{advisor.specialization}</p>
                  </div>
                </div>
                <div className="px-4 py-4 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Experience</dt>
                      <dd className="mt-1 text-sm text-gray-900">{advisor.experience}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Rating</dt>
                      <dd className="mt-1 text-sm text-gray-900 flex items-center">
                        {advisor.rating}
                        <svg
                          className="h-4 w-4 text-yellow-400 ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-gray-500 ml-1">({advisor.reviews} reviews)</span>
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Availability</dt>
                      <dd className="mt-1 text-sm text-gray-900">{advisor.availability}</dd>
                    </div>
                  </dl>
                </div>
                <div className="px-4 py-4 sm:px-6 bg-gray-50">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'resources' ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredResources.map((resource) => (
                <li key={resource.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          {resource.type === 'PDF Guide' && (
                            <svg
                              className="h-6 w-6 text-indigo-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                          )}
                          {resource.type === 'Checklist' && (
                            <svg
                              className="h-6 w-6 text-indigo-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                          )}
                          {resource.type === 'Video Tutorial' && (
                            <svg
                              className="h-6 w-6 text-indigo-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                          {resource.type === 'Calendar' && (
                            <svg
                              className="h-6 w-6 text-indigo-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-indigo-600">{resource.type}</h4>
                          <h3 className="text-sm font-medium text-gray-900">{resource.title}</h3>
                          <p className="mt-1 text-sm text-gray-500">{resource.description}</p>
                        </div>
                      </div>
                      <div>
                        <a
                          href={resource.downloadLink}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-lg font-medium text-gray-900">Fixed-Price Legal Services</h2>
              <p className="mt-1 text-sm text-gray-500">
                Pre-scoped legal services with transparent pricing. Click on any service to get started with our legal partners.
              </p>
              
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {legalServices.map((service) => (
                  <div key={service.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 transition-all duration-200 hover:shadow-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {service.icon}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{service.title}</h3>
                          <p className="text-sm text-indigo-600 font-semibold">{service.price}</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-4 sm:px-6">
                      <p className="text-sm text-gray-700">{service.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Typical duration: {service.duration}</span>
                      </div>
                    </div>
                    <div className="px-4 py-4 sm:px-6 bg-gray-50">
                      <button
                        onClick={() => {
                          // Open in new window with error handling
                          const newWindow = window.open(null, '_blank');
                          if (newWindow) {
                            newWindow.opener = null; // For security
                            newWindow.location = service.partnerUrl;
                            // Handle potential navigation errors
                            newWindow.addEventListener('error', (e) => {
                              // Check if it's an ERR_ABORTED error
                              if (e.message && e.message.includes('ERR_ABORTED')) {
                                newWindow.document.body.innerHTML = `
                                  <div style="text-align: center; padding: 20px;">
                                    <h2>Connection Error</h2>
                                    <p>Unable to connect to the government portal. Please try one of these options:</p>
                                    <ul style="list-style: none; padding: 0;">
                                      <li style="margin: 10px 0;"><a href="${service.partnerUrl}" target="_blank" rel="noopener noreferrer" style="color: blue;">Try opening directly</a></li>
                                      <li style="margin: 10px 0;">Copy this URL: <input type="text" value="${service.partnerUrl}" style="width: 100%; padding: 5px;" onclick="this.select()" readonly /></li>
                                    </ul>
                                  </div>
                                `;
                              }
                            });
                          } else {
                            // Fallback if popup is blocked
                            window.location.href = service.partnerUrl;
                          }
                        }}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Need a custom legal solution?</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Our legal partners can provide customized solutions for your specific business needs.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setActiveTab('advisors')}
                  >
                    Connect with an Advisor
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvisoryPage;