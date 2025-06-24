const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to make HTTP requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session management
      ...options,
    };

    console.log(`Making API request to: ${url}`, config);

    try {
      const response = await fetch(url, config);
      
      console.log(`API Response status: ${response.status}`, response);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // OTP endpoints
  async sendOtp(email) {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyOtp(email, otp) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  // Complaint endpoints
  async getComplaints() {
    return this.request('/complaints');
  }

  async getComplaint(id) {
    return this.request(`/complaints/id/${id}`);
  }

  async createComplaint(complaintData) {
    return this.request('/complaints/submit', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    });
  }

  async updateComplaint(id, complaintData) {
    return this.request(`/complaints/${id}`, {
      method: 'PUT',
      body: JSON.stringify(complaintData),
    });
  }

  async deleteComplaint(id) {
    return this.request(`/complaints/${id}`, {
      method: 'DELETE',
    });
  }

  async trackComplaint(grievanceId) {
    return this.request(`/complaints/${grievanceId}`);
  }

  // File upload helper
  async uploadFile(file, endpoint = '/upload') {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }
}

const apiService = new ApiService();
export default apiService; 