
import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../../components/common/Spinner';
import { UserSubRole, BankAccount } from '../../types';

const mockTeam = [
  { id: 1, name: 'John Doe', email: 'john@creativesolutions.com', subRole: UserSubRole.ADMINISTRATOR },
  { id: 2, name: 'Jane Smith', email: 'jane@creativesolutions.com', subRole: UserSubRole.ACCOUNTANT },
  { id: 3, name: 'Peter Jones', email: 'peter@creativesolutions.com', subRole: UserSubRole.AUDITOR },
  { id: 4, name: 'Sam Wilson', email: 'sam@creativesolutions.com', subRole: UserSubRole.STANDARD },
];


const Settings: React.FC = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        companyName: user?.companyName || '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [team, setTeam] = useState(mockTeam);
    const [apiKey, setApiKey] = useState<string | null>('xel_sk_test_************************a1b2');
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(user?.bankAccounts || []);
    const [showAddAccountForm, setShowAddAccountForm] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setIsSuccess(false);
        // Simulate API call to save data
        setTimeout(() => {
            console.log("Saving user data:", formData);
            setIsSaving(false);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000); // Hide success message after 3s
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


    const handleRoleChange = (memberId: number, newRole: UserSubRole) => {
        setTeam(currentTeam => 
            currentTeam.map(member => 
                member.id === memberId ? { ...member, subRole: newRole } : member
            )
        );
    };
    
    const generateNewKey = () => {
        // In a real app, this would be a secure, random string from the server.
        const newKey = `xel_sk_test_${[...Array(24)].map(() => Math.random().toString(36)[2]).join('')}${Math.random().toString(16).slice(10, 14)}`;
        setApiKey(newKey);
    };

    return (
        <div className="space-y-8">
            <Card>
                <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-light">Full Name</label>
                        <input id="name" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                    </div>
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-light">Company Name</label>
                        <input id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-light">Email Address</label>
                        <input id="email" name="email" value={user?.email || ''} readOnly className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium text-gray-400 cursor-not-allowed" />
                    </div>
                     <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-light">Role</label>
                        <input id="role" name="role" value={user?.subRole || ''} readOnly className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium text-gray-400 cursor-not-allowed" />
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" disabled={isSaving} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:bg-yellow-400 flex items-center disabled:bg-gray-500">
                            {isSaving ? <Spinner className="mr-2" /> : null}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        {isSuccess && <span className="text-green-400">Profile updated successfully!</span>}
                    </div>
                </form>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-6">Bank Accounts</h2>
                <div className="space-y-3 mb-6">
                    {bankAccounts.map(account => (
                        <div key={account.id} className="flex items-center justify-between p-3 bg-primary rounded-md">
                            <div>
                                <p className="font-semibold text-white">{account.bankName} ({account.currency})</p>
                                <p className="text-sm text-gray-light">{account.accountNumber} - {account.country}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {!showAddAccountForm ? (
                    <button onClick={() => setShowAddAccountForm(true)} className="bg-accent/20 text-accent font-bold py-2 px-4 rounded hover:bg-accent/40">Add New Account</button>
                ) : (
                    <form onSubmit={handleAddAccount} className="space-y-4 pt-4 border-t border-gray-medium">
                        <h3 className="font-semibold">Add Account Details</h3>
                        <input name="bankName" placeholder="Bank Name" required className="w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                        <input name="accountNumber" placeholder="Account Number" required className="w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                        <input name="country" placeholder="Country (e.g., USA)" required className="w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                        <input name="currency" placeholder="Currency (e.g., USD)" required className="w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                        <div className="flex justify-end space-x-3">
                            <button type="button" onClick={() => setShowAddAccountForm(false)} className="bg-gray-medium text-white font-bold py-2 px-4 rounded hover:bg-gray-500">Cancel</button>
                            <button type="submit" className="bg-accent text-primary font-bold py-2 px-4 rounded hover:bg-yellow-400">Save Account</button>
                        </div>
                    </form>
                )}
            </Card>


            <Card>
                <h2 className="text-2xl font-bold mb-6">Team Management</h2>
                <div className="space-y-3">
                    {team.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-primary rounded-md">
                            <div>
                                <p className="font-semibold text-white">{member.name}</p>
                                <p className="text-sm text-gray-light">{member.email}</p>
                            </div>
                            <select 
                                value={member.subRole} 
                                onChange={(e) => handleRoleChange(member.id, e.target.value as UserSubRole)}
                                className="bg-gray-dark border border-gray-medium rounded-md py-1 px-2 text-sm text-accent focus:outline-none focus:ring-accent focus:border-accent"
                                disabled={user?.subRole !== UserSubRole.ADMINISTRATOR}
                            >
                                {Object.values(UserSubRole).map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                     {user?.subRole !== UserSubRole.ADMINISTRATOR && <p className="text-xs text-gray-light mt-2">Only administrators can change roles.</p>}
                </div>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-6">API Key Management</h2>
                <div className="bg-primary p-4 rounded-md">
                    {apiKey ? (
                        <>
                            <p className="text-gray-light mb-2">Your secret API key:</p>
                            <p className="font-mono text-white bg-gray-dark p-3 rounded-md break-all">{apiKey}</p>
                            <div className="flex space-x-4 mt-4">
                                <button onClick={generateNewKey} className="bg-gray-medium text-white font-bold py-2 px-4 rounded hover:bg-gray-500">Generate New Key</button>
                                <button onClick={() => setApiKey(null)} className="bg-red-800/50 text-red-300 font-bold py-2 px-4 rounded hover:bg-red-800/80">Revoke Key</button>
                            </div>
                        </>
                    ) : (
                         <div>
                            <p className="text-gray-light mb-4">You do not have an active API key.</p>
                             <button onClick={generateNewKey} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:bg-yellow-400">Generate API Key</button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Settings;
