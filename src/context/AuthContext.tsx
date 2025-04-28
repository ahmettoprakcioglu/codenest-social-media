import { ReactElement, useEffect, useState } from 'react';
import { supabase } from '../supabase-client';
import { AuthContext, AuthContextType } from './auth-context';

export const AuthProvider = ({ children }: { children: React.ReactNode }): ReactElement => {
  const [user, setUser] = useState<AuthContextType['user']>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGitHub = (): void => {
    void supabase.auth.signInWithOAuth({ provider: 'github' });
  };

  const signOut = (): void => {
    void supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGitHub, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};