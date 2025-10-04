import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from './api';
import { jwtDecode } from 'jwt-decode'; 

interface User {
  username: string;
  email: string;
}

interface WishlistItem {
  id: number;
  movie_id: number;
  user_id: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  wishlist: WishlistItem[];
  login: (formData: FormData) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  addToWishlist: (movieId: number) => Promise<void>;
  removeFromWishlist: (movieId: number) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          // You can decode the token to get user info if it's stored there
          // Or, more securely, fetch user data from a /users/me endpoint
          const response = await api.get('/users/me');
          const wishlistResponse = await api.get('/users/me/wishlist');
          setWishlist(wishlistResponse.data);
          setUser(response.data);
        } catch (error) {
          console.error("Session expired or invalid. Logging out.");
          logout(); // Token is invalid, so log out
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token]); // Note: `logout` is not in dependency array to avoid re-running on logout

  const login = async (formData: FormData) => {
    const response = await api.post('/auth/token', formData);
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    setToken(access_token);
  };

  const signup = async (userData: any) => {
    // This is just an example. The user will need to log in after signing up.
    await api.post('/auth/signup', userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setWishlist([]);
    // Optionally, redirect to home or login page
    window.location.href = '/login';
  };

  const addToWishlist = async (movieId: number) => {
    const response = await api.post('/users/me/wishlist', { movie_id: movieId });
    setWishlist(prev => [...prev, response.data]);
  };

  const removeFromWishlist = async (movieId: number) => {
    await api.delete(`/users/me/wishlist/${movieId}`);
    setWishlist(prev => prev.filter(item => item.movie_id !== movieId));
  };

  const value = {
    isAuthenticated: !!token,
    user,
    token,
    wishlist,
    login,
    signup,
    logout,
    addToWishlist,
    removeFromWishlist,
    loading,
  };

  // Don't render the app until we've checked for an existing session
  if (loading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};