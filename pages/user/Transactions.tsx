
import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { Transaction } from '../../types';
import { getTransactionsSummary, categorizeTransaction } from '../../services/geminiService';
import { SparklesIcon } from '../../components/icons/Icons';

const mockTransactions: Transaction[] = [
    { id: '1', date: '2024-07-22', recipient: 'Acme Inc.', recipientCountry: 'USA', amountSent: 500.00, currencySent: 'USD', amountReceived: 495.00, currencyReceived: 'USD', commission: 5.00, status: 'Completed', category: 'Supplies' },
    { id: '2', date: '2024-07-21', recipient: 'Lagos Ventures', recipientCountry: 'Nigeria', amountSent: 1000.00, currencySent: 'USD', amountReceived: 1450500.00, currencyReceived: 'NGN', commission: 15.00, status: 'Completed' },
    { id: '3', date: '2024-07-20', recipient: 'Innovate UK', recipientCountry: 'UK', amountSent: 250.00, currencySent: 'USD', amountReceived: 200.50, currencyReceived: 'GBP', commission: 3.75, status: 'Pending', category: 'Software & Subscriptions' },
    { id: '4', date: '2024-07-19', recipient: 'Ghana Goods', recipientCountry: 'Ghana', amountSent: 750.00, currencySent: 'USD', amountReceived: 9825.00, currencyReceived: 'GHS', commission: 11.25, status: 'Completed' },
    { id: '5', date: '2024-07-18', recipient: 'Nairobi Tech', recipientCountry: 'Kenya', amountSent: 1200.00, currencySent: 'USD', amountReceived: 155400.00, currencyReceived: 'KES', commission: 18.00, status: 'Failed', category: 'Other' },
    { id: '6', date: '2024-06-15', recipient: 'Digital Exports', recipientCountry: 'USA', amountSent: 3500.00, currencySent: 'USD', amountReceived: 3482.50, currencyReceived: 'USD', commission: 52.50, status: 'Completed', category: 'Payroll' },
];

const StatusBadge: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
    const statusClasses = {
        Completed: "bg-green-500/20 text-green-300",
        Pending: "bg-yellow-500/20 text-yellow-300",
        Failed: "bg-red-500/20 text-red-300",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

interface TransactionsProps {
  searchQuery: string;
}

const Transactions: React.FC<TransactionsProps> = ({ searchQuery }) => {
    const [transactions, setTransactions] = useState(mockTransactions);
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [countryFilter, setCountryFilter] = useState('All Countries');
    const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
    const [amountFilter, setAmountFilter] = useState({ min: '', max: '' });
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [categorizingId, setCategorizingId] = useState<string | null>(null);

    const uniqueCountries = useMemo(() => ['All Countries', ...Array.from(new Set(transactions.map(tx => tx.recipientCountry)))], [transactions]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const statusMatch = statusFilter === 'All Status' || tx.status === statusFilter;
            const countryMatch = countryFilter === 'All Countries' || tx.recipientCountry === countryFilter;
            const searchMatch = !searchQuery || tx.recipient.toLowerCase().includes(searchQuery.toLowerCase());
            
            const minAmount = parseFloat(amountFilter.min);
            const maxAmount = parseFloat(amountFilter.max);
            const amountMatch = (isNaN(minAmount) || tx.amountSent >= minAmount) && (isNaN(maxAmount) || tx.amountSent <= maxAmount);

            // Date matching logic
            const txDate = new Date(tx.date);
            const startDate = dateFilter.start ? new Date(dateFilter.start) : null;
            const endDate = dateFilter.end ? new Date(dateFilter.end) : null;
            if(startDate) startDate.setUTCHours(0,0,0,0);
            if(endDate) endDate.setUTCHours(23,59,59,999);
            
            const dateMatch = (!startDate || txDate >= startDate) && (!endDate || txDate <= endDate);

            return statusMatch && searchMatch && dateMatch && countryMatch && amountMatch;
        });
    }, [statusFilter, searchQuery, dateFilter, countryFilter, amountFilter, transactions]);

    const handleExport = () => {
        const headers = ['ID', 'Date', 'Recipient', 'Recipient Country', 'Amount Sent', 'Currency Sent', 'Amount Received', 'Currency Received', 'Commission', 'Status', 'Category'];
        const rows = filteredTransactions.map(tx => 
            [tx.id, tx.date, tx.recipient, tx.recipientCountry, tx.amountSent, tx.currencySent, tx.amountReceived, tx.currencyReceived, tx.commission, tx.status, tx.category || 'N/A'].join(',')
        );

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleAnalyze = async () => {
        setShowAnalysis(true);
        setIsAnalyzing(true);
        const result = await getTransactionsSummary(filteredTransactions);
        setAnalysisResult(result);
        setIsAnalyzing(false);
    }
    
    const handleCategorize = async (txId: string) => {
      setCategorizingId(txId);
      const txToCategorize = transactions.find(t => t.id === txId);
      if (txToCategorize) {
        const { category } = await categorizeTransaction(txToCategorize.recipient, txToCategorize.amountSent);
        setTransactions(currentTransactions => 
          currentTransactions.map(t => 
            t.id === txId ? { ...t, category } : t
          )
        );
      }
      setCategorizingId(null);
    };

    return (
        <>
        <Card>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transaction History</h2>
                 <div className="flex flex-wrap items-center gap-2">
                     <input 
                        type="date" 
                        value={dateFilter.start}
                        onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value}))}
                        className="bg-gray-100 dark:bg-gray-dark border border-gray-300 dark:border-gray-medium rounded-md py-1.5 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-accent focus:border-accent"
                     />
                      <span className="text-gray-500 dark:text-gray-light">to</span>
                     <input 
                        type="date" 
                        value={dateFilter.end}
                        onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value}))}
                        className="bg-gray-100 dark:bg-gray-dark border border-gray-300 dark:border-gray-medium rounded-md py-1.5 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-accent focus:border-accent"
                     />
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            placeholder="Min Amount"
                            value={amountFilter.min}
                            onChange={(e) => setAmountFilter(prev => ({ ...prev, min: e.target.value }))}
                            className="w-28 bg-gray-100 dark:bg-gray-dark border border-gray-300 dark:border-gray-medium rounded-md py-1.5 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-accent focus:border-accent"
                        />
                        <input
                            type="number"
                            placeholder="Max Amount"
                            value={amountFilter.max}
                            onChange={(e) => setAmountFilter(prev => ({ ...prev, max: e.target.value }))}
                            className="w-28 bg-gray-100 dark:bg-gray-dark border border-gray-300 dark:border-gray-medium rounded-md py-1.5 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-accent focus:border-accent"
                        />
                    </div>
                      <select 
                         value={countryFilter}
                         onChange={(e) => setCountryFilter(e.target.value)}
                         className="bg-gray-100 dark:bg-gray-dark border border-gray-300 dark:border-gray-medium rounded-md py-1.5 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-accent focus:border-accent"
                     >
                         {uniqueCountries.map(country => <option key={country}>{country}</option>)}
                     </select>
                     <select 
                         value={statusFilter}
                         onChange={(e) => setStatusFilter(e.target.value)}
                         className="bg-gray-100 dark:bg-gray-dark border border-gray-300 dark:border-gray-medium rounded-md py-1.5 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-accent focus:border-accent"
                     >
                         <option>All Status</option>
                         <option>Completed</option>
                         <option>Pending</option>
                         <option>Failed</option>
                     </select>
                      <button onClick={handleAnalyze} className="bg-purple-600 text-white font-bold py-1.5 px-4 rounded hover:bg-purple-700 flex items-center"><SparklesIcon className="w-4 h-4 mr-2" />Analyze</button>
                      <button onClick={handleExport} className="bg-accent text-primary font-bold py-1.5 px-4 rounded hover:bg-yellow-400">Export</button>
                 </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-light">
                    <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-primary">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-medium tracking-wider text-left">Date</th>
                            <th scope="col" className="px-6 py-4 font-medium tracking-wider text-left">Recipient</th>
                            <th scope="col" className="px-6 py-4 font-medium tracking-wider text-left">Amount Sent</th>
                            <th scope="col" className="px-6 py-4 font-medium tracking-wider text-left">Category</th>
                            <th scope="col" className="px-6 py-4 font-medium tracking-wider text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((tx) => (
                            <tr key={tx.id} className="bg-white dark:bg-primary-light border-b border-gray-200 dark:border-gray-medium last:border-b-0 hover:bg-gray-50 dark:hover:bg-primary/80 transition-colors duration-200 ease-in-out">
                                <td className="px-6 py-5 whitespace-nowrap align-middle text-gray-500 dark:text-gray-light">{tx.date}</td>
                                <td className="px-6 py-5 align-middle">
                                    <div className="font-semibold text-gray-900 dark:text-white">{tx.recipient}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-light">{tx.recipientCountry}</div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap align-middle font-mono text-gray-800 dark:text-gray-200">{tx.amountSent.toLocaleString('en-US', { style: 'currency', currency: tx.currencySent })}</td>
                                <td className="px-6 py-5 align-middle">
                                    {tx.category ? (
                                        <span className="text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded-full">{tx.category}</span>
                                    ) : categorizingId === tx.id ? (
                                        <Spinner className="w-4 h-4" />
                                    ) : (
                                        <button onClick={() => handleCategorize(tx.id)} className="bg-purple-500/20 text-purple-400 text-xs font-bold py-1 px-2 rounded-full hover:bg-purple-500/40 flex items-center">
                                            <SparklesIcon className="w-3 h-3 mr-1" />
                                            Categorize
                                        </button>
                                    )}
                                </td>
                                <td className="px-6 py-5 align-middle"><StatusBadge status={tx.status} /></td>
                            </tr>
                        ))}
                         {filteredTransactions.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-400 dark:text-gray-light">No transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>

        {showAnalysis && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowAnalysis(false)}>
                <Card className="max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-2xl font-bold mb-4 flex items-center"><SparklesIcon className="w-6 h-6 mr-2 text-purple-500" /> AI Analysis</h2>
                    {isAnalyzing ? (
                        <div className="flex items-center justify-center py-8">
                           <Spinner />
                           <p className="ml-4">Analyzing your transactions...</p>
                        </div>
                    ) : (
                        <div className="space-y-4 text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                            <p>{analysisResult}</p>
                        </div>
                    )}
                     <div className="flex justify-end mt-6">
                        <button onClick={() => setShowAnalysis(false)} className="bg-gray-500 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">
                            Close
                        </button>
                    </div>
                </Card>
            </div>
        )}
        </>
    )
}

export default Transactions;
