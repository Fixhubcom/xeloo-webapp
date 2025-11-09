
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { User, UserRole, UserSubRole, BankAccount } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

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
      let avatarInitials = 'U';
      let avatarBgColor = '#3b82f6';
      let isSubscribed = true; // Subscribed by default for admin/partner/merchant
      let hederaWalletAddress: string | undefined = undefined;
      let accountOfficerId: string | undefined = undefined;

      switch (role) {
        case UserRole.ADMIN: name = 'Super Admin'; companyName = 'Xeloo Corp'; avatarInitials="SA"; avatarBgColor="#ef4444"; break;
        case UserRole.PARTNER: 
            name = 'Financial Partner'; 
            companyName = 'Global Bank'; 
            avatarInitials="FP"; 
            avatarBgColor="#10b981"; 
            hederaWalletAddress="0.0.123456";
            accountOfficerId = '5';
            break;
        case UserRole.MERCHANT: 
            name = 'Crypto Merchant'; 
            companyName = 'Digital Assets LLC'; 
            avatarInitials="CM"; 
            avatarBgColor="#8b5cf6"; 
            accountOfficerId = '5';
            break;
        case UserRole.USER: 
          name = 'John Doe'; 
          companyName = 'Creative Solutions'; 
          avatarInitials="JD";
          avatarBgColor="#fdda1a";
          isSubscribed = false; // Regular users are on the free plan
          bankAccounts = [
            { id: 'acc_1', bankName: 'Chase Bank', accountNumber: '**** **** **** 1234', country: 'USA', currency: 'USD', isDefault: true },
            { id: 'acc_2', bankName: 'Access Bank', accountNumber: '**** **** **** 5678', country: 'Nigeria', currency: 'NGN' },
          ];
          accountOfficerId = '7';
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
        avatarInitials,
        avatarBgColor,
        isSubscribed,
        hederaWalletAddress,
        accountOfficerId,
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