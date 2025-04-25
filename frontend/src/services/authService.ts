import { api } from '../lib/axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        console.log("=================response.data===================")
        console.log(response.data)
        localStorage.setItem('token', response.data.token);
        // Store the user data without the token
        const userData = { 
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        };
        localStorage.setItem('user', JSON.stringify(userData));
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // localStorage.removeItem('role');
    delete api.defaults.headers.common['Authorization'];
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): any | null {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      // Ensure the user object has the expected structure
      if (!user || !user.role) {
        console.error('Invalid user data structure:', user);
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  },

  getUserRole(): string | null {
    return localStorage.getItem('role');
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  },

  initializeAuth(): void {
    const token = this.getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
}; 