
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { User, UserRole, UserSubRole, BankAccount } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

// FIX: Export AuthContext to be used in the useAuth hook.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = useCallback((email: string, role: UserRole) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      let name = 'User';
      let companyName = 'Business Inc.';
      let bankAccounts: BankAccount[] = [];
      switch (role) {
        case UserRole.ADMIN: name = 'Super Admin'; companyName = 'Xeloo Corp'; break;
        case UserRole.PARTNER: name = 'Financial Partner'; companyName = 'Global Bank'; break;
        case UserRole.MERCHANT: name = 'Crypto Merchant'; companyName = 'Digital Assets LLC'; break;
        case UserRole.USER: 
          name = 'John Doe'; 
          companyName = 'Creative Solutions'; 
          bankAccounts = [
            { id: 'acc_1', bankName: 'Chase Bank', accountNumber: '**** **** **** 1234', country: 'USA', currency: 'USD', isDefault: true },
            { id: 'acc_2', bankName: 'Access Bank', accountNumber: '**** **** **** 5678', country: 'Nigeria', currency: 'NGN' },
          ];
          break;
      }
      const mockUser: User = { 
        id: '1', 
        email, 
        role, 
        name, 
        companyName,
        subRole: role === UserRole.USER ? UserSubRole.ADMINISTRATOR : undefined,
        bankAccounts,
        preferredCurrency: 'USD',
      };
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
