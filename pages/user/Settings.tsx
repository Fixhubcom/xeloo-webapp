

import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../../components/common/Spinner';
import { UserSubRole, BankAccount } from '../../types';
import PasswordStrengthIndicator from '../../components/common/PasswordStrengthIndicator';

const mockTeam = [
  { id: 1, name: 'John Doe', email: 'john@creativesolutions.com', subRole: UserSubRole.ADMINISTRATOR },
  { id: 2, name: 'Jane Smith', email: 'jane@creativesolutions.com', subRole: UserSubRole.ACCOUNTANT },
  { id: 3, name: 'Peter Jones', email: 'peter@creativesolutions.com', subRole: UserSubRole.AUDITOR },
  { id: 4, name: 'Sam Wilson', email: 'sam@creativesolutions.com', subRole: UserSubRole.STANDARD },
];


const Settings: React.FC = () => {
    const { user, updateUser } = useAuth();
    // Profile
    const [formData, setFormData] = useState({
        name: user?.name || '',
        companyName: user?.companyName || '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    // Bank Accounts
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(user?.bankAccounts || []);
    const [showAddAccountForm, setShowAddAccountForm] = useState(false);
    
    // USDT Wallet
    const [usdtWallet, setUsdtWallet] = useState(user?.usdtWalletAddress || '');
    const [isSavingWallet, setIsSavingWallet] = useState(false);
    const [walletSuccess, setWalletSuccess] = useState(false);

    // Security
    const [newPassword, setNewPassword] = useState('');
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [show2FASetup, setShow2FASetup] = useState(false);

    // Username
    const [username, setUsername] = useState(user?.username || '');
    const [isUsernameSet, setIsUsernameSet] = useState(!!user?.username);
    const [isSavingUsername, setIsSavingUsername] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    
    // Team
    const [team, setTeam] = useState(mockTeam);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState(UserSubRole.STANDARD);
    const [isInviting, setIsInviting] = useState(false);
    const [inviteSuccess, setInviteSuccess] = useState(false);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setIsSuccess(false);
        setTimeout(() => {
            updateUser(formData);
            setIsSaving(false);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
        }, 1500);
    };
    
    const handleAddAccount = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const newAccount: BankAccount = {
            id: `acc_${Date.now()}`,
            bankName: form.get('bankName') as string,
            accountNumber: `**** **** **** ${ (form.get('accountNumber') as string).slice(-4)}`,
            country: form.get('country') as string,
            currency: form.get('currency') as string,
        };
        setBankAccounts(prev => [...prev, newAccount]);
        setShowAddAccountForm(false);
        e.currentTarget.reset();
    };

    const handleSaveWallet = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingWallet(true);
        setWalletSuccess(false);
        setTimeout(() => {
            updateUser({ usdtWalletAddress: usdtWallet });
            setIsSavingWallet(false);
            setWalletSuccess(true);
            setTimeout(() => setWalletSuccess(false), 3000);
        }, 1500);
    };

    const handleRoleChange = (memberId: number, newRole: UserSubRole) => {
        setTeam(currentTeam => 
            currentTeam.map(member => 
                member.id === memberId ? { ...member, subRole: newRole } : member
            )
        );
    };

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        setIsInviting(true);
        setInviteSuccess(false);
        setTimeout(() => {
            const newMember = {
                id: Date.now(),
                name: 'Invited User', // In a real app, this would be pending
                email: inviteEmail,
                subRole: inviteRole,
            };
            setTeam(prev => [...prev, newMember]);
            setIsInviting(false);
            setInviteSuccess(true);
            setInviteEmail('');
            setInviteRole(UserSubRole.STANDARD);
            setTimeout(() => setInviteSuccess(false), 3000);
        }, 1500);
    };
    
    const handleSetUsername = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || username.length < 3) {
            setUsernameError('Username must be at least 3 characters long and contain only letters, numbers, and underscores.');
            return;
        }
        setIsSavingUsername(true);
        setUsernameError('');
        setTimeout(() => {
            if (username === 'taken' || username === 'admin') {
                setUsernameError('This username is already taken.');
                setIsSavingUsername(false);
            } else {
                updateUser({ username });
                setIsUsernameSet(true);
                setIsSavingUsername(false);
            }
        }, 1000);
    };


    return (
        <div className="space-y-8">
            <Card>
                <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400">Full Name</label>
                        <input id="name" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 w-full bg-primary p-2 rounded border border-primary-light" />
                    </div>
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-400">Company Name</label>
                        <input id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} className="mt-1 w-full bg-primary p-2 rounded border border-primary-light" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email Address</label>
                        <input id="email" name="email" value={user?.email || ''} readOnly className="mt-1 w-full bg-primary p-2 rounded border border-primary-light text-gray-400 cursor-not-allowed" />
                    </div>
                     <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-400">Role</label>
                        <input id="role" name="role" value={user?.subRole || ''} readOnly className="mt-1 w-full bg-primary p-2 rounded border border-primary-light text-gray-400 cursor-not-allowed" />
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" disabled={isSaving} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90 flex items-center disabled:bg-gray-500">
                            {isSaving ? <Spinner className="mr-2" /> : null}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        {isSuccess && <span className="text-accent">Profile updated successfully!</span>}
                    </div>
                </form>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-6">Preferences</h2>
                <div>
                    <label htmlFor="preferredCurrency" className="block text-sm font-medium text-gray-400">Preferred Display Currency</label>
                    <p className="text-xs text-gray-500 mb-2">This currency will be used to show equivalent values across the app.</p>
                    <select
                        id="preferredCurrency"
                        value={user?.preferredCurrency || 'USD'}
                        onChange={(e) => updateUser({ preferredCurrency: e.target.value })}
                        className="mt-1 w-full max-w-xs bg-primary p-2 rounded border border-primary-light"
                    >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="NGN">NGN - Nigerian Naira</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                    </select>
                </div>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-6">Username & Profile URL</h2>
                <p className="text-sm text-gray-400 mb-4">Your username is unique and can be used for instant Xeloo-to-Xeloo transfers. It can only be set once.</p>
                {isUsernameSet ? (
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-400">Your Username</label>
                        <div className="mt-1 flex items-center">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-primary-light bg-primary text-gray-400 sm:text-sm">
                                xeloo.app/u/
                            </span>
                            <input id="username" name="username" value={username} readOnly className="flex-1 block w-full min-w-0 rounded-none rounded-r-md bg-primary-light p-2 border border-primary-light text-gray-400 cursor-not-allowed" />
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSetUsername} className="space-y-2">
                        <div className="flex items-end space-x-3">
                            <div className="flex-grow">
                                <label htmlFor="new_username" className="block text-sm font-medium text-gray-400">Set Your Username</label>
                                <div className="mt-1 flex items-center">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-primary-light bg-primary text-gray-400 sm:text-sm">
                                        xeloo.app/u/
                                    </span>
                                    <input 
                                        id="new_username" 
                                        name="new_username" 
                                        value={username}
                                        onChange={(e) => { setUsername(e.target.value); setUsernameError(''); }}
                                        pattern="^[a-zA-Z0-9_]{3,15}$"
                                        className="flex-1 block w-full min-w-0 rounded-none rounded-r-md bg-primary p-2 border border-primary-light" 
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={isSavingUsername} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90 flex items-center justify-center w-28">
                                 {isSavingUsername ? <Spinner /> : 'Save'}
                            </button>
                        </div>
                        {usernameError && <p className="text-yellow-400 text-xs mt-1">{usernameError}</p>}
                    </form>
                )}
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-6">Security</h2>
                {/* Change Password */}
                <div className="border-b border-primary pb-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                    <div className="max-w-sm space-y-4">
                         <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-primary p-2 rounded border border-primary-light" />
                         <PasswordStrengthIndicator password={newPassword} />
                         <button className="bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 text-sm">Update Password</button>
                    </div>
                </div>
                {/* 2FA Setup */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Two-Factor Authentication (2FA)</h3>
                    {is2FAEnabled ? (
                         <div className="flex items-center justify-between p-3 bg-accent/10 rounded-md">
                            <p className="text-accent font-medium">2FA is enabled on your account.</p>
                            <button onClick={() => setIs2FAEnabled(false)} className="bg-red-500/20 text-red-400 font-bold py-1 px-3 rounded hover:bg-red-500/40 text-sm">Disable</button>
                        </div>
                    ) : (
                        <div>
                            {!show2FASetup ? (
                                <>
                                    <p className="text-gray-400 mb-4">Add an extra layer of security to your account.</p>
                                    <button onClick={() => setShow2FASetup(true)} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">Setup 2FA</button>
                                </>
                            ) : (
                                <div className="space-y-4 pt-4">
                                    <p>1. Scan this QR code with your authenticator app (e.g., Google Authenticator).</p>
                                    <div className="bg-white p-2 inline-block rounded">
                                        <div className="w-32 h-32 bg-gray-800" title="Mock QR Code"></div>
                                    </div>
                                    <p>2. Enter the 6-digit code from your app to verify.</p>
                                    <div className="flex items-center space-x-3">
                                        <input type="text" maxLength={6} placeholder="123456" className="w-32 bg-primary p-2 rounded border border-primary-light text-center tracking-widest" />
                                        <button onClick={() => { setIs2FAEnabled(true); setShow2FASetup(false); }} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">Verify & Enable</button>
                                        <button onClick={() => setShow2FASetup(false)} className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-6">Bank Accounts</h2>
                <div className="space-y-3 mb-6">
                    {bankAccounts.map(account => (
                        <div key={account.id} className="flex items-center justify-between p-3 bg-primary rounded-md">
                            <div>
                                <p className="font-semibold text-white">{account.bankName} ({account.currency})</p>
                                <p className="text-sm text-gray-400">{account.accountNumber} - {account.country}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {!showAddAccountForm ? (
                    <button onClick={() => setShowAddAccountForm(true)} className="bg-accent/20 text-accent font-bold py-2 px-4 rounded hover:bg-accent/40">Add New Account</button>
                ) : (
                    <form onSubmit={handleAddAccount} className="space-y-4 pt-4 border-t border-primary">
                        <h3 className="font-semibold">Add Account Details</h3>
                        <input name="bankName" placeholder="Bank Name" required className="w-full bg-primary p-2 rounded border border-primary-light" />
                        <input name="accountNumber" placeholder="Account Number" required className="w-full bg-primary p-2 rounded border border-primary-light" />
                        <input name="country" placeholder="Country (e.g., USA)" required className="w-full bg-primary p-2 rounded border border-primary-light" />
                        <input name="currency" placeholder="Currency (e.g., USD)" required className="w-full bg-primary p-2 rounded border border-primary-light" />
                        <div className="flex justify-end space-x-3">
                            <button type="button" onClick={() => setShowAddAccountForm(false)} className="bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
                            <button type="submit" className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">Save Account</button>
                        </div>
                    </form>
                )}
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-6">USDT Payout Wallet</h2>
                <p className="text-sm text-gray-400 mb-4">Add your USDT (TRC20) wallet address to receive crypto payouts.</p>
                <form onSubmit={handleSaveWallet} className="space-y-4">
                    <div>
                        <label htmlFor="usdtWallet" className="block text-sm font-medium text-gray-400">USDT Wallet Address (TRC20)</label>
                        <input 
                            id="usdtWallet" 
                            name="usdtWallet" 
                            value={usdtWallet} 
                            onChange={(e) => setUsdtWallet(e.target.value)} 
                            placeholder="T..."
                            className="mt-1 w-full bg-primary p-2 rounded border border-primary-light font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" disabled={isSavingWallet} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90 flex items-center disabled:bg-gray-500">
                            {isSavingWallet ? <Spinner className="mr-2" /> : null}
                            {isSavingWallet ? 'Saving...' : 'Save Wallet'}
                        </button>
                        {walletSuccess && <span className="text-accent">Wallet address updated!</span>}
                    </div>
                </form>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-6">Team Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Invite New Member</h3>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400">Email Address</label>
                                <input 
                                    type="email" 
                                    required 
                                    placeholder="member@example.com" 
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    className="w-full bg-primary p-2 rounded border border-primary-light" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Role</label>
                                 <select 
                                    value={inviteRole}
                                    onChange={e => setInviteRole(e.target.value as UserSubRole)}
                                    className="w-full bg-primary p-2 rounded border border-primary-light">
                                    {Object.values(UserSubRole).map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" disabled={isInviting} className="w-full bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90 flex items-center justify-center">
                                {isInviting ? <Spinner /> : 'Send Invite'}
                            </button>
                            {inviteSuccess && <p className="text-accent text-sm text-center">Invitation sent!</p>}
                        </form>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Current Team</h3>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {team.map(member => (
                                <div key={member.id} className="flex items-center justify-between p-3 bg-primary rounded-md">
                                    <div>
                                        <p className="font-semibold text-white">{member.name}</p>
                                        <p className="text-sm text-gray-400">{member.email}</p>
                                    </div>
                                    <select 
                                        value={member.subRole} 
                                        onChange={(e) => handleRoleChange(member.id, e.target.value as UserSubRole)}
                                        className="bg-primary border border-primary-light rounded-md py-1 px-2 text-xs text-accent focus:outline-none focus:ring-accent focus:border-accent"
                                    >
                                        {Object.values(UserSubRole).map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Settings;