
import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import { MultiSigTransaction } from '../../types';
import Spinner from '../../components/common/Spinner';

const mockPendingAdminTransactions: MultiSigTransaction[] = [
    { id: 'TXN-HEDERA-003', partnerId: '2', partnerName: 'Africa Payouts Ltd', amount: 100000, currency: 'USDT', destinationAddress: '0.0.445566', status: 'Pending Admin' },
];
const mockHistoryTransactions: MultiSigTransaction[] = [
    { id: 'TXN-HEDERA-001', partnerId: '1', partnerName: 'Global Bank', amount: 50000, currency: 'USDT', destinationAddress: '0.0.987654', status: 'Completed' },
    { id: 'TXN-HEDERA-002', partnerId: '1', partnerName: 'Global Bank', amount: 25000, currency: 'USDT', destinationAddress: '0.0.112233', status: 'Rejected' },
]


const StatusBadge: React.FC<{ status: MultiSigTransaction['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
    const statusClasses = {
        'Pending Partner': "bg-yellow-500/20 text-yellow-300",
        'Pending Admin': "bg-blue-500/20 text-blue-300",
        Completed: "bg-accent/20 text-accent",
        Rejected: "bg-red-500/20 text-red-300",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const BlockchainManagement: React.FC = () => {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInitiateTransfer = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setIsSuccess(false);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            (e.target as HTMLFormElement).reset();
            setTimeout(() => setIsSuccess(false), 5000);
        }, 2000);
    }

    return (
        <div className="space-y-8">
            <Card>
                <h2 className="text-xl font-bold mb-2">Hedera Multi-Sig Wallet</h2>
                <p className="text-gray-400 mb-6">This is your organization's multi-signature treasury wallet used for co-signing partner settlements.</p>
                <div className="bg-primary p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center"><span className="text-gray-400">Network:</span><span className="font-mono text-white">Hedera Mainnet</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-400">Asset:</span><span className="font-mono text-white">USDT (HBAR-backed)</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-400">Treasury Address:</span><span className="font-mono text-accent">0.0.123987</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-400">Current Balance (USD):</span><span className="font-mono text-2xl font-bold text-white">$10,500,000.00</span></div>
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-bold mb-4">Initiate Treasury Transfer</h2>
                <p className="text-gray-400 mb-6">Initiate a transfer from the treasury wallet. This will require a co-signature from the receiving partner.</p>
                {isSuccess ? (
                     <div className="text-center p-4 bg-accent/10 text-accent rounded-md">
                        <p className="font-semibold">Transfer Initiated!</p>
                        <p className="text-sm">The transaction is now awaiting partner co-signature.</p>
                    </div>
                ) : (
                    <form onSubmit={handleInitiateTransfer} className="space-y-4">
                        <input name="destinationAddress" placeholder="Partner Destination Wallet Address" required className="w-full bg-primary p-2 rounded border border-primary-light" />
                        <div className="flex gap-4">
                            <input name="amount" type="number" step="0.01" placeholder="Amount" required className="flex-grow bg-primary p-2 rounded border border-primary-light" />
                            <select name="currency" className="bg-primary p-2 rounded border border-primary-light"><option>USDT</option></select>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" disabled={isSubmitting} className="w-48 bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90 flex items-center justify-center">
                                {isSubmitting ? <Spinner /> : 'Initiate & Sign'}
                            </button>
                        </div>
                    </form>
                )}
            </Card>

            <Card>
                <h2 className="text-xl font-bold mb-4 text-accent">Action Required: Pending Co-Signatures</h2>
                <p className="text-gray-400 mb-6">The following transactions have been signed by the partner and require a co-signature from Xeloo admin to be executed on the Hedera network.</p>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-primary"><tr><th className="px-6 py-3">Transaction ID</th><th className="px-6 py-3">Partner</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Destination</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-center">Actions</th></tr></thead>
                        <tbody>
                            {mockPendingAdminTransactions.map(tx => (
                                <tr key={tx.id} className="bg-primary-light border-b border-primary">
                                    <td className="px-6 py-4 font-mono text-white">{tx.id}</td><td className="px-6 py-4">{tx.partnerName}</td><td className="px-6 py-4 font-mono">{tx.amount.toLocaleString()} {tx.currency}</td><td className="px-6 py-4 font-mono">{tx.destinationAddress}</td><td className="px-6 py-4"><StatusBadge status={tx.status} /></td>
                                    <td className="px-6 py-4 space-x-2 text-center"><button className="text-xs font-bold py-1 px-3 rounded bg-accent/20 text-accent hover:bg-accent/40">Co-Sign & Approve</button><button className="text-xs font-bold py-1 px-3 rounded bg-red-500/20 text-red-300 hover:bg-red-500/40">Reject</button></td>
                                </tr>
                            ))}
                             {mockPendingAdminTransactions.length === 0 && (<tr><td colSpan={6} className="text-center py-4 text-gray-400">No transactions require your signature.</td></tr>)}
                        </tbody>
                    </table>
                 </div>
            </Card>

            <Card>
                <h2 className="text-xl font-bold mb-4">Transaction History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-primary"><tr><th className="px-6 py-3">Transaction ID</th><th className="px-6 py-3">Partner</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Status</th></tr></thead>
                        <tbody>
                            {mockHistoryTransactions.map(tx => (
                                <tr key={tx.id} className="bg-primary-light border-b border-primary">
                                    <td className="px-6 py-4 font-mono text-white">{tx.id}</td><td className="px-6 py-4">{tx.partnerName}</td><td className="px-6 py-4 font-mono">{tx.amount.toLocaleString()} {tx.currency}</td><td className="px-6 py-4"><StatusBadge status={tx.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </Card>
        </div>
    );
};

export default BlockchainManagement;