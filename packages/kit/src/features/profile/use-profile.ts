import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export function useProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      });
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const refresh = () => {
    loadProfile();
  };

  return { user, loading, refresh };
}