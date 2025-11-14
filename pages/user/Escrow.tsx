

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { EscrowTransaction, EscrowStatus } from '../../types';
import { CheckCircleIcon, ShieldCheckIcon, UploadIcon } from '../../components/icons/Icons';

// Mock user data for search simulation
const mockXelooUsers: { [key: string]: { name: string, company: string } } = {
    'acmeinc': { name: 'Acme Inc.', company: 'Acme Incorporated' },
    'lagosventures': { name: 'Lagos Ventures', company: 'LV Capital' },
};

const mockEscrowTransactions: EscrowTransaction[] = [
    { id: 'esc-001', buyerUsername: 'johndoe', sellerUsername: 'acmeinc', amount: 1500, fee: 45, description: 'Design services for new website', status: 'In Escrow', createdAt: '2024-07-20', fundedAt: '2024-07-21' },
    { id: 'esc-002', buyerUsername: 'johndoe', sellerUsername: 'lagosventures', amount: 500, fee: 15, description: 'Consulting services', status: 'Awaiting Funding', createdAt: '2024-07-22' },
    { id: 'esc-003', buyerUsername: 'anotheruser', sellerUsername: 'johndoe', amount: 800, fee: 24, description: 'Handmade goods shipment', status: 'Awaiting Release', createdAt: '2024-07-18', fundedAt: '2024-07-18' },
    { id: 'esc-004', buyerUsername: 'johndoe', sellerUsername: 'acmeinc', amount: 200, fee: 6, description: 'Logo assets', status: 'Completed', createdAt: '2024-06-15', fundedAt: '2024-06-15', releasedAt: '2024-06-18' },
];

const StatusBadge: React.FC<{ status: EscrowStatus }> = ({ status }) => {
    const classes: { [key in EscrowStatus]: string } = {
        'Awaiting Funding': 'bg-blue-500/20 text-blue-300',
        'In Escrow': 'bg-yellow-500/20 text-yellow-300',
        'Awaiting Release': 'bg-purple-500/20 text-purple-300',
        'Completed': 'bg-green-500/20 text-green-300',
        'Disputed': 'bg-red-500/20 text-red-300',
        'Canceled': 'bg-gray-500/20 text-gray-300',
    };
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${classes[status]}`}>{status}</span>;
};


interface EscrowProps {
    searchQuery: string;
    initialSeller?: string;
    openAddFundsModal: () => void;
}

const Escrow: React.FC<EscrowProps> = ({ searchQuery, initialSeller, openAddFundsModal }) => {
    const { user, updateWalletBalance } = useAuth();
    // Assuming the current user's username is their name in lowercase
    const currentUser = user?.username || user?.name.toLowerCase().replace(' ', '') || 'johndoe'; 

    const [transactions, setTransactions] = useState(mockEscrowTransactions);
    const [view, setView] = useState<'list' | 'create' | 'detail' | 'dispute' | 'dispute_submitted'>(initialSeller ? 'create' : 'list');
    const [selectedTx, setSelectedTx] = useState<EscrowTransaction | null>(null);

    // Form state
    const [sellerUsername, setSellerUsername] = useState(initialSeller || '');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [foundUser, setFoundUser] = useState<{ name: string, company: string } | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const searchTimeout = useRef<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    // Dispute state
    const [disputeReason, setDisputeReason] = useState('');
    const [disputeFiles, setDisputeFiles] = useState<File[]>([]);
    const [fileErrors, setFileErrors] = useState<string[]>([]);
    const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);
    
    useEffect(() => {
        if (initialSeller) {
            setView('create');
            setSellerUsername(initialSeller);
        }
    }, [initialSeller]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const newErrors: string[] = [];
        const currentAndNewFiles = [...disputeFiles, ...files];

        if (currentAndNewFiles.length > 5) {
            newErrors.push('You can upload a maximum of 5 files.');
        }

        files.forEach((file: File) => {
            if (file.size > 10 * 1024 * 1024) { // 10MB
                newErrors.push(`${file.name} is too large (max 10MB).`);
            }
            if (!['image/png', 'image/jpeg', 'image/gif', 'video/mp4', 'application/pdf'].includes(file.type)) {
                newErrors.push(`${file.name} has an unsupported file type.`);
            }
        });

        if (newErrors.length > 0) {
            setFileErrors(newErrors);
        } else {
            setFileErrors([]);
            setDisputeFiles(currentAndNewFiles.slice(0, 5));
        }
    };
    
    const removeFile = (fileName: string) => {
        setDisputeFiles(disputeFiles.filter(f => f.name !== fileName));
    };


    const searchUser = useCallback((searchUsername: string) => {
        setIsSearching(true);
        setFoundUser(null);
        setSearchError('');
        setTimeout(() => {
            const userFound = mockXelooUsers[searchUsername.toLowerCase()];
            if (userFound) {
                setFoundUser(userFound);
            } else {
                setSearchError('Seller username not found.');
            }
            setIsSearching(false);
        }, 500);
    }, []);
    
    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        if (sellerUsername) {
            searchTimeout.current = window.setTimeout(() => searchUser(sellerUsername), 300);
        } else {
            setFoundUser(null);
            setSearchError('');
        }
    }, [sellerUsername, searchUser]);

    const handleCreateEscrow = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const newTx: EscrowTransaction = {
            id: `esc-${Date.now().toString().slice(-4)}`,
            buyerUsername: currentUser,
            sellerUsername,
            amount: parseFloat(amount),
            fee: parseFloat(amount) * 0.03,
            description,
            status: 'Awaiting Funding',
            createdAt: new Date().toISOString().split('T')[0],
        };
        setTimeout(() => {
            setTransactions(prev => [newTx, ...prev]);
            setView('list');
            // Reset form
            setSellerUsername('');
            setAmount('');
            setDescription('');
            setIsSaving(false);
        }, 1500);
    };

    const handleAction = (txId: string, newStatus: EscrowStatus) => {
        const txToUpdate = transactions.find(tx => tx.id === txId);
        if (!txToUpdate) return;
        
        // Special case for funding
        if (newStatus === 'In Escrow' && txToUpdate.status === 'Awaiting Funding') {
            const balance = user?.walletBalance || 0;
            if (balance < txToUpdate.amount) {
                openAddFundsModal();
                return;
            }
            updateWalletBalance(-txToUpdate.amount);
        }

        setTransactions(prev => prev.map(tx => {
            if (tx.id === txId) {
                const updatedTx = { ...tx, status: newStatus };
                if (newStatus === 'In Escrow') updatedTx.fundedAt = new Date().toISOString().split('T')[0];
                if (newStatus === 'Completed') updatedTx.releasedAt = new Date().toISOString().split('T')[0];
                setSelectedTx(updatedTx);
                return updatedTx;
            }
            return tx;
        }));
    };

    const handleDisputeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTx) return;
        setIsSubmittingDispute(true);
        setTimeout(() => {
            console.log('Dispute submitted:', {
                txId: selectedTx.id,
                reason: disputeReason,
                files: disputeFiles.map(f => f.name),
            });
            handleAction(selectedTx.id, 'Disputed');
            setIsSubmittingDispute(false);
            setView('dispute_submitted');
        }, 2000);
    };
    
    // RENDER VIEWS
    const renderListView = () => {
        const activeTxs = transactions.filter(tx => tx.status !== 'Completed' && tx.status !== 'Canceled');
        const pastTxs = transactions.filter(tx => tx.status === 'Completed' || tx.status === 'Canceled');
        
        return (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Your Escrow Transactions</h2>
                    <button onClick={() => setView('create')} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">Create New Escrow</button>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">Active Transactions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeTxs.map(tx => (
                        <Card key={tx.id} className="cursor-pointer hover:border-accent" onClick={() => { setSelectedTx(tx); setView('detail'); }}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-400">vs. {currentUser === tx.buyerUsername ? tx.sellerUsername : tx.buyerUsername}</p>
                                    <p className="text-lg font-bold text-white">{tx.description}</p>
                                </div>
                                <StatusBadge status={tx.status} />
                            </div>
                            <p className="text-2xl font-mono text-accent mt-2">{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                        </Card>
                    ))}
                    {activeTxs.length === 0 && <p className="text-gray-400">No active escrow transactions.</p>}
                </div>

                 <h3 className="text-lg font-semibold mt-8 mb-3">Past Transactions</h3>
                <div className="space-y-2">
                     {pastTxs.map(tx => (
                        <Card key={tx.id} className="flex justify-between items-center p-3">
                           <div>
                             <p className="font-semibold">{tx.description}</p>
                             <p className="text-xs text-gray-400">vs. {currentUser === tx.buyerUsername ? tx.sellerUsername : tx.buyerUsername}</p>
                           </div>
                           <div className="text-right">
                             <p className="font-mono text-white">{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                             <StatusBadge status={tx.status} />
                           </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    };

    const renderCreateView = () => (
        <Card className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Create Escrow Transaction</h2>
            <form onSubmit={handleCreateEscrow} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400">Seller's Username</label>
                    <input value={sellerUsername} onChange={e => setSellerUsername(e.target.value)} className="mt-1 w-full bg-primary p-2 rounded border border-primary-light" required />
                     {searchError && !isSearching && <p className="text-yellow-400 text-xs mt-1">{searchError}</p>}
                    {foundUser && !isSearching && <p className="text-accent text-xs mt-1">User found: {foundUser.name}</p>}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-400">Amount (USD)</label>
                    <input value={amount} onChange={e => setAmount(e.target.value)} type="number" step="0.01" className="mt-1 w-full bg-primary p-2 rounded border border-primary-light" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-400">Description of Goods/Service</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 w-full bg-primary p-2 rounded border border-primary-light" required />
                </div>
                {parseFloat(amount) > 0 && (
                    <div className="bg-primary p-3 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-400">Amount:</span> <span className="font-mono">${parseFloat(amount).toFixed(2)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Seller Fee (3%):</span> <span className="font-mono">${(parseFloat(amount) * 0.03).toFixed(2)}</span></div>
                        <hr className="border-primary-light" />
                        <div className="flex justify-between font-bold"><span className="text-white">You (Buyer) will fund:</span> <span className="font-mono text-accent">${parseFloat(amount).toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold"><span className="text-white">Seller will receive:</span> <span className="font-mono text-accent">${(parseFloat(amount) * 0.97).toFixed(2)}</span></div>
                    </div>
                )}
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={() => setView('list')} className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">Cancel</button>
                    <button type="submit" disabled={!foundUser || isSaving} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90 flex items-center justify-center w-40 disabled:bg-gray-500">
                        {isSaving ? <Spinner /> : 'Create Escrow'}
                    </button>
                </div>
            </form>
        </Card>
    );

    const renderDetailView = () => {
        if (!selectedTx) return null;
        const isBuyer = currentUser === selectedTx.buyerUsername;
        const hasSufficientFunds = (user?.walletBalance || 0) >= selectedTx.amount;
        
        return (
            <div>
                 <button onClick={() => setView('list')} className="bg-primary-light text-white font-bold py-2 px-4 rounded hover:opacity-90 mb-6">&larr; Back to List</button>
                <Card className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-bold">{selectedTx.description}</h2>
                        <StatusBadge status={selectedTx.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 my-6 text-sm">
                        <p><strong>Buyer:</strong> @{selectedTx.buyerUsername}</p>
                        <p><strong>Seller:</strong> @{selectedTx.sellerUsername}</p>
                        <p><strong>Created:</strong> {selectedTx.createdAt}</p>
                        <p><strong>Funded:</strong> {selectedTx.fundedAt || 'N/A'}</p>
                    </div>
                    
                    <div className="bg-primary p-4 rounded-lg space-y-2 text-sm text-center">
                        <p className="text-gray-400">TOTAL AMOUNT IN ESCROW</p>
                        <p className="text-4xl font-bold text-accent font-mono">{selectedTx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                    </div>

                    <div className="mt-8">
                        {selectedTx.status === 'Disputed' ? (
                            <div className="text-center p-4 bg-red-500/10 text-red-300 rounded-md">
                                <p className="font-bold">This transaction is disputed.</p>
                                <p className="text-sm">A support officer is reviewing the case and will mediate. The funds are frozen until a resolution is reached.</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
                                {isBuyer && selectedTx.status === 'Awaiting Funding' && (
                                    hasSufficientFunds ? (
                                        <button onClick={() => handleAction(selectedTx.id, 'In Escrow')} className="w-full bg-accent text-primary font-bold py-3 rounded">Fund Escrow from Wallet</button>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-yellow-300 mb-3">Insufficient wallet balance to fund this escrow.</p>
                                            <button onClick={openAddFundsModal} className="w-full bg-accent text-primary font-bold py-3 rounded">Add Funds to Wallet</button>
                                        </div>
                                    )
                                )}
                                {isBuyer && selectedTx.status === 'In Escrow' && <p className="text-gray-300">Waiting for the seller to deliver. Once you have received the goods/services, you can release the funds.</p>}
                                {isBuyer && selectedTx.status === 'Awaiting Release' && <button onClick={() => handleAction(selectedTx.id, 'Completed')} className="w-full bg-green-600 text-white font-bold py-3 rounded">Release Funds to Seller</button>}
                                {!isBuyer && selectedTx.status === 'Awaiting Funding' && <p className="text-gray-300">Waiting for the buyer to fund the escrow.</p>}
                                {!isBuyer && selectedTx.status === 'In Escrow' && <button onClick={() => handleAction(selectedTx.id, 'Awaiting Release')} className="w-full bg-blue-600 text-white font-bold py-3 rounded">Mark as Delivered / Service Rendered</button>}
                                {!isBuyer && selectedTx.status === 'Awaiting Release' && <p className="text-gray-300">You have marked the transaction as complete. Waiting for the buyer to release the funds.</p>}
                                {selectedTx.status === 'Completed' && <p className="text-center text-green-400 font-bold">This transaction was completed on {selectedTx.releasedAt}.</p>}
                                
                                {selectedTx.status !== 'Completed' && selectedTx.status !== 'Canceled' && (
                                     <button onClick={() => setView('dispute')} className="w-full mt-4 bg-red-800/50 text-red-300 font-bold py-2 rounded">Dispute Transaction</button>
                                )}
                            </>
                        )}
                    </div>
                </Card>
            </div>
        )
    };
    
    const renderDisputeFormView = () => {
        if (!selectedTx) return null;
        return (
            <Card className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-2">Dispute Transaction #{selectedTx.id}</h2>
                <p className="text-gray-400 mb-6">Please explain the issue in detail and provide any relevant evidence. A support officer will review your case.</p>
                <form onSubmit={handleDisputeSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Reason for Dispute</label>
                        <textarea value={disputeReason} onChange={e => setDisputeReason(e.target.value)} rows={5} className="mt-1 w-full bg-primary p-2 rounded border border-primary-light" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Upload Evidence ({disputeFiles.length} / 5 selected)</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-primary-light border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-400">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-primary rounded-md font-medium text-accent hover:text-yellow-300 focus-within:outline-none">
                                        <span>Upload files</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4, PDF up to 10MB each</p>
                            </div>
                        </div>
                        {fileErrors.length > 0 && (
                            <div className="mt-2 text-sm text-yellow-400 space-y-1">
                                {fileErrors.map((err, i) => <p key={i}>- {err}</p>)}
                            </div>
                        )}
                        {disputeFiles.length > 0 && (
                            <div className="mt-2 text-sm text-gray-300 space-y-2">
                                {disputeFiles.map(file => (
                                    <div key={file.name} className="flex justify-between items-center bg-primary p-2 rounded">
                                        <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                        <button type="button" onClick={() => removeFile(file.name)} className="text-red-400 hover:text-red-300 font-bold">&times;</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={() => setView('detail')} className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">Cancel</button>
                        <button type="submit" disabled={isSubmittingDispute || fileErrors.length > 0} className="bg-red-600 text-white font-bold py-2 px-6 rounded hover:opacity-90 flex items-center justify-center w-40 disabled:bg-gray-500">
                            {isSubmittingDispute ? <Spinner /> : 'Submit Dispute'}
                        </button>
                    </div>
                </form>
            </Card>
        );
    };

    const renderDisputeSubmittedView = () => (
        <Card className="max-w-2xl mx-auto text-center">
            <CheckCircleIcon className="w-16 h-16 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-accent mb-2">Dispute Submitted</h2>
            <p className="text-gray-light mb-6">
                Your case has been submitted and the transaction has been frozen. A support officer will review the details and contact you within 24-48 hours.
            </p>
            <button onClick={() => { setView('list'); setSelectedTx(null); }} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">
                Back to Escrow List
            </button>
        </Card>
    );
    
    switch(view) {
        case 'create': return renderCreateView();
        case 'detail': return renderDetailView();
        case 'dispute': return renderDisputeFormView();
        case 'dispute_submitted': return renderDisputeSubmittedView();
        default: return renderListView();
    }
};

export default Escrow;