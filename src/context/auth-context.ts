import { User } from '@supabase/supabase-js';
import { createContext } from 'react';

interface UserMetadata {
  user_name?: string;
  avatar_url?: string;
}

export interface AuthContextType {
  user: (User & { user_metadata: UserMetadata }) | null;
  signInWithGitHub: () => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined); 