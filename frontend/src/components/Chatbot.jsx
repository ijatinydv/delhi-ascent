import React, { useState, useRef, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import chatbotApi from '../api/chatbot.api';

const Chatbot = ({ businessType = null, applicationType = null }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add initial welcome message
  useEffect(() => {
    setMessages([
      {
        text: "Hello! I'm your Delhi Ascent assistant. How can I help you with business registration and compliance today?",
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send request to backend using the API service
      const response = await chatbotApi.sendQuery(
        input,
        businessType,
        applicationType,
        user?.id
      );

      // Add bot response to chat
      const botMessage = {
        text: response.data?.response?.text || 
              (typeof response.data?.response === 'object' ? response.data?.response?.text : response.data?.response) || 
              'I couldn\'t process that request. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
        source: response.data?.response?.source || 'general',
        isError: response.data?.response?.source === 'system',
        suggestions: response.data?.response?.suggestions
      };
      
      // Add helpful suggestions for API errors
      if (botMessage.isError) {
        // If suggestions aren't already provided by the backend
        if (!botMessage.suggestions || botMessage.suggestions.length === 0) {
          if (botMessage.text.includes('API limitations')) {
            botMessage.suggestions = [
              'What documents do I need for business registration?',
              'What are the basic requirements for a food business?',
              'How do I register for GST?'
            ];
          } else {
            // Default suggestions for any error
            botMessage.suggestions = [
              'What documents do I need for business registration?',
              'Tell me about GST registration',
              'What licenses do I need for a retail shop?'
            ];
          }
        }
      }

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      
      // This should rarely happen now since the API handles errors
      const errorMessage = {
        text: 'Sorry, I encountered an unexpected error. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Chat widget */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out max-h-[500px]">
          {/* Chat header */}
          <div className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="rounded-full bg-white p-1 mr-2">
                <svg
                  className="h-5 w-5 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-sm">Delhi Ascent Assistant</h3>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-3 overflow-y-auto max-h-[350px]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${message.sender === 'user'
                    ? 'bg-indigo-100 text-gray-800'
                    : message.isError
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  <p>{message.text}</p>
                  {message.source && message.source !== 'system' && message.source !== 'general' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Source: {message.source.replace('.txt', '')}
                    </p>
                  )}
                  
                  {/* Show suggestions when available */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 border-t border-gray-200 pt-2">
                      <p className="text-xs text-gray-600 mb-1">You can try asking about:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setInput(suggestion);
                              // Auto-submit after a short delay
                              setTimeout(() => {
                                const event = new Event('submit', { bubbles: true });
                                document.querySelector('form').dispatchEvent(event);
                              }, 500);
                            }}
                            className="text-xs bg-white border border-indigo-300 text-indigo-700 px-2 py-1 rounded-full hover:bg-indigo-50 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3">
            <div className="flex rounded-md shadow-sm">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;