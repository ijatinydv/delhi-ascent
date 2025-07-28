// Service for AI model interaction (RAG implementation)
const fs = require('fs');
const path = require('path');
const { Document } = require('@langchain/core/documents');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { OpenAIEmbeddings } = require('@langchain/openai');
const { FaissStore } = require('@langchain/community/vectorstores/faiss');
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { RunnableSequence } = require('@langchain/core/runnables');
const { StringOutputParser } = require('@langchain/core/output_parsers');

// Initialize vector store
let vectorStore = null;

// Initialize OpenAI embeddings with environment variable
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Initialize LLM
const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-3.5-turbo',
  temperature: 0,
});

// Load and process documents from knowledge base
const loadDocuments = async () => {
  try {
    const knowledgeBasePath = path.join(__dirname, '../knowledge_base');
    const files = fs.readdirSync(knowledgeBasePath);
    
    // Array to hold all documents
    const docs = [];
    
    // Process each file in the knowledge base directory
    for (const file of files) {
      const filePath = path.join(knowledgeBasePath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Create a document with metadata
      const doc = new Document({
        pageContent: content,
        metadata: {
          source: file,
          filename: file,
        },
      });
      
      docs.push(doc);
    }
    
    // Split documents into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    const splitDocs = await textSplitter.splitDocuments(docs);
    
    try {
      // Create and save the vector store
      vectorStore = await FaissStore.fromDocuments(splitDocs, embeddings);
      console.log('Knowledge base documents loaded and indexed successfully');
    } catch (embeddingError) {
      console.error('Error creating vector store with embeddings:', embeddingError);
      // Create a simple in-memory store for basic functionality
      // This is a fallback when OpenAI API has issues
      vectorStore = {
        similaritySearch: async (query, k) => {
          // Simple keyword matching as fallback
          return docs.slice(0, k);
        }
      };
      console.log('Created fallback document store due to embedding API issues');
    }
  } catch (error) {
    console.error('Error loading knowledge base documents:', error);
  }
};

// Initialize the vector store on service startup
(async () => {
  try {
    await loadDocuments();
  } catch (error) {
    console.error('Error initializing vector store:', error);
    console.log('Continuing with fallback responses...');
  }
})();

// Retrieve relevant documents based on query
const retrieveRelevantDocuments = async (query, k = 3) => {
  if (!vectorStore) {
    console.warn('Vector store not initialized yet');
    return [];
  }
  
  try {
    // Search for similar documents
    const relevantDocs = await vectorStore.similaritySearch(query, k);
    return relevantDocs;
  } catch (error) {
    console.error('Error retrieving relevant documents:', error);
    return [];
  }
};

// Process user query and generate response
exports.getResponse = async (query, options = {}) => {
  try {
    const { businessType, applicationType, context } = options;
    
    // If vector store is not initialized, return a fallback response
    if (!vectorStore) {
      console.warn('Vector store not initialized yet');
      // Provide a more specific fallback response based on business type and application type
      let fallbackMessage = 'I can help with basic business registration information, but my advanced AI features are currently unavailable. What specific information are you looking for?';
      
      // Provide more specific guidance based on business type and application type
      if (businessType && applicationType) {
        fallbackMessage = `I can provide basic information about ${applicationType} for ${businessType} businesses, but my advanced AI features are currently unavailable. Here are some common requirements:\n\n`;
        
        // Add some basic information based on business type
        if (businessType.toLowerCase().includes('food') || businessType.toLowerCase().includes('restaurant')) {
          fallbackMessage += '- FSSAI license is required for all food businesses\n';
          fallbackMessage += '- Health trade license from local municipal corporation\n';
          fallbackMessage += '- GST registration if turnover exceeds ₹20 lakhs\n';
        } else if (businessType.toLowerCase().includes('retail') || businessType.toLowerCase().includes('shop')) {
          fallbackMessage += '- Shop and Establishment license\n';
          fallbackMessage += '- GST registration if turnover exceeds ₹20 lakhs\n';
          fallbackMessage += '- Professional tax registration\n';
        } else {
          fallbackMessage += '- Business registration/incorporation\n';
          fallbackMessage += '- GST registration if applicable\n';
          fallbackMessage += '- Professional tax registration\n';
        }
        
        fallbackMessage += '\nFor more detailed information, please try again later when our AI service is fully available.';
      }
      
      return {
        text: fallbackMessage,
        source: 'system'
      };
    }
    
    // Retrieve relevant documents based on the query
    const relevantDocs = await retrieveRelevantDocuments(query);
    
    if (relevantDocs.length === 0) {
      return {
        text: 'I don\'t have specific information about that. Please contact our support team for assistance.',
        source: 'general'
      };
    }
    
    // Extract context from relevant documents
    const contextText = relevantDocs.map(doc => doc.pageContent).join('\n\n');
    
    // Create a prompt template for the LLM
    const promptTemplate = PromptTemplate.fromTemplate(`
      You are a helpful assistant for Delhi business owners seeking information about regulations and compliance.
      Use the following pieces of context to answer the question at the end.
      If you don't know the answer, just say that you don't know, don't try to make up an answer.
      Keep your answer concise, factual, and to the point.
      
      Context:
      {context}
      
      Question: {question}
      
      Answer:
    `);
    
    // Create a chain to process the query
    const chain = RunnableSequence.from([
      {
        context: async () => contextText,
        question: async () => query
      },
      promptTemplate,
      llm,
      new StringOutputParser()
    ]);
    
    // Generate the response
    const response = await chain.invoke({});
    
    // Determine the source based on the most relevant document
    const sourceDocs = relevantDocs.map(doc => doc.metadata.source);
    const primarySource = sourceDocs[0] || 'general';
    
    return {
      text: response,
      source: primarySource,
      relevantSources: sourceDocs
    };
  } catch (error) {
    console.error('Error generating response:', error);
    
    // Handle different types of OpenAI API errors
    if (error.message) {
      // API key or authentication issues
      if (error.message.includes('API key') || error.message.includes('authentication')) {
        console.error('OpenAI API key validation error:', error.message);
        return {
          text: 'I can help with basic business registration information even without AI access. What would you like to know about business registration in Delhi?',
          source: 'system',
          suggestions: [
            'What documents do I need for business registration?',
            'How do I register a food business in Delhi?',
            'What are the GST requirements for new businesses?'
          ]
        };
      }
      
      // Rate limit or quota issues
      if (error.message.includes('quota') || error.message.includes('rate limit') || error.message.includes('429')) {
        console.log('OpenAI API quota exceeded or rate limited');
        return {
          text: 'I apologize, but I cannot access the AI service at the moment due to API limitations. You can still ask me about basic business registration information that I have in my local knowledge base.',
          source: 'system'
        };
      }
    }
    
    // Generic error response
    return {
      text: 'I apologize, but I encountered an error while processing your request. Please try again later.',
      source: 'system'
    };
  }
};

// Get document suggestions based on business type and application type
exports.getDocumentSuggestions = async (businessType, applicationType) => {
  try {
    // In a real implementation, this would be more sophisticated
    // For now, return a predefined list based on application type
    
    const commonDocuments = [
      'Business registration certificate',
      'PAN card of the business',
      'Address proof of the premises',
      'ID proof of the business owner',
      'Passport-sized photographs'
    ];
    
    let specificDocuments = [];
    
    if (applicationType.toLowerCase() === 'fssai') {
      specificDocuments = [
        'Food safety management plan',
        'List of food products',
        'Water analysis report',
        'Medical fitness certificates of food handlers',
        'NOC from property owner'
      ];
    } else if (applicationType.toLowerCase() === 'shops_act') {
      specificDocuments = [
        'Rent agreement/Lease deed',
        'Property tax receipt',
        'Electricity bill of the premises',
        'Floor plan of the establishment',
        'List of employees with details'
      ];
    } else if (applicationType.toLowerCase() === 'gst') {
      specificDocuments = [
        'Business constitution document',
        'Bank account details',
        'Digital signature',
        'Property documents',
        'Utility bills'
      ];
    }
    
    return {
      common: commonDocuments,
      specific: specificDocuments
    };
  } catch (error) {
    console.error('Error getting document suggestions:', error);
    throw new Error('Failed to get document suggestions');
  }
};

// Check eligibility for a specific license/permit
exports.checkEligibility = async (businessType, applicationType, businessDetails = {}) => {
  try {
    // In a real implementation, this would use more sophisticated logic
    // For now, return a simple response based on the application type
    
    let eligible = true;
    let requirements = [];
    let missingRequirements = [];
    
    if (applicationType.toLowerCase() === 'fssai') {
      requirements = [
        'Business must be registered',
        'Premises must meet hygiene standards',
        'Food safety management system must be in place',
        'Food handlers must have medical fitness certificates'
      ];
      
      // Check if any requirements are missing based on business details
      if (businessDetails.registered === false) {
        eligible = false;
        missingRequirements.push('Business must be registered');
      }
      
      if (businessDetails.hygieneStandards === false) {
        eligible = false;
        missingRequirements.push('Premises must meet hygiene standards');
      }
    } else if (applicationType.toLowerCase() === 'shops_act') {
      requirements = [
        'Business must have a physical establishment',
        'Premises must comply with safety regulations',
        'Working hours must be within permitted limits',
        'Proper employment records must be maintained'
      ];
      
      // Check if any requirements are missing based on business details
      if (businessDetails.physicalEstablishment === false) {
        eligible = false;
        missingRequirements.push('Business must have a physical establishment');
      }
      
      if (businessDetails.safetyCompliance === false) {
        eligible = false;
        missingRequirements.push('Premises must comply with safety regulations');
      }
    }
    
    return {
      eligible,
      requirements,
      missingRequirements
    };
  } catch (error) {
    console.error('Error checking eligibility:', error);
    throw new Error('Failed to check eligibility');
  }
};