const API_BASE_URL = 'http://localhost:5000';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  
  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch {
      // If response is not JSON or empty, fallback to text
      try {
        const text = await response.text();
        errorData = { message: text };
      } catch {
        errorData = { message: 'Unknown error' };
      }
    }
    console.error('API Error Status:', response.status);
    console.error('API Error URL:', response.url);
    console.error('API Error Data:', errorData);
    throw new Error(errorData.message || errorData.errors?.[0]?.msg || `HTTP error! status: ${response.status}`);
  }
  // Defensive: check if response has content
  const text = await response.text();
  if (!text) return {}; // or null, or throw, depending on your needs
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

// API service for hero endpoints
export const heroApi = {
  // Get all heroes
  getAll: async () => {
    console.log('Fetching heroes from:', `${API_BASE_URL}/hero`);
    const response = await fetch(`${API_BASE_URL}/hero`);
    console.log('Hero response status:', response.status);
    return handleResponse(response);
  },

  // Get hero by ID
  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/hero/${id}`);
    return handleResponse(response);
  },

  // Create new hero
  create: async (formData: FormData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/hero`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },

  // Update hero
  update: async (id: number, formData: FormData) => {
    const token = getAuthToken();
    console.log('Updating hero with ID:', id);
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, ':', value);
    }
    
    const response = await fetch(`${API_BASE_URL}/hero/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    console.log('Update response status:', response.status);
    return handleResponse(response);
  },

  // Delete hero
  delete: async (id: number) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/hero/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return true;
  },
};

// API service for histoire endpoints
export const histoireApi = {
  // Get all histoires
  getAll: async () => {
    console.log('Fetching histoires from:', `${API_BASE_URL}/histoire`);
    const response = await fetch(`${API_BASE_URL}/histoire`);
    console.log('Histoire response status:', response.status);
    return handleResponse(response);
  },

  // Get histoire by ID
  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/histoire/${id}`);
    return handleResponse(response);
  },

  // Create new histoire
  create: async (formData: FormData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/histoire`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },

  // Update histoire
  update: async (id: number, formData: FormData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/histoire/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },

  // Delete histoire
  delete: async (id: number) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/histoire/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return true;
  },
};

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    console.log('Sending login request:', { email, password: '***' });
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    console.log('Login response status:', response.status);
    return handleResponse(response);
  },
}; 

// Infrastructure (map) API
export const infrastructureApi = {
  // Get the infrastructure map (returns a single object or null)
  get: async () => {
    const response = await fetch(`${API_BASE_URL}/map`);
    return handleResponse(response);
  },

  // Create new infrastructure map
  create: async (formData: FormData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/map`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },

  // Update infrastructure map
  update: async (id: number, formData: FormData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/map/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },

  // Delete infrastructure map
  delete: async (id: number) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/map/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return true;
  },
}; 

// Media API
export const mediaApi = {
  // Get all media
  getAll: async () => {
    const url = `${API_BASE_URL}/medias`;
    console.log('Fetching media from:', url);
    const response = await fetch(url);
    console.log('Media response status:', response.status);
    console.log('Media response URL:', response.url);
    return handleResponse(response);
  },

  // Get media by ID
  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/medias/${id}`);
    return handleResponse(response);
  },

  // Create new media
  create: async (formData: FormData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/medias`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },

  // Update media
  update: async (id: number, formData: FormData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/medias/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },

  // Delete media
  delete: async (id: number) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/medias/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return true;
  },
}; 

// Multimedia API
export const multimediaApi = {
  // Get all multimedia
  getAll: async () => {
    const url = `${API_BASE_URL}/multimedia`;
    console.log('Fetching multimedia from:', url);
    const response = await fetch(url);
    console.log('Multimedia response status:', response.status);
    return handleResponse(response);
  },

  // Get multimedia by ID
  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/multimedia/${id}`);
    return handleResponse(response);
  },

  // Create new multimedia
  create: async (formData: FormData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/multimedia`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },

  // Update multimedia
  update: async (id: number, formData: FormData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/multimedia/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },

  // Delete multimedia
  delete: async (id: number) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/multimedia/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return true;
  },
}; 