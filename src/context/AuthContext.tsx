import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../supabase'; // Assume your Supabase client is initialized here
import { User, Session } from '@supabase/supabase-js';

// Define the types for the context value
interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
}

// Define the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for accessing the context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component props
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  // Sign-in function with email and password
  const signIn = async (email: string, password: string): Promise<User | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      throw new Error(error?.message || 'Sign-in failed');
    }
    setUser(data.user);
    return data.user;
  };

  // Sign-out function
  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Subscribe to authentication state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session: Session | null) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
