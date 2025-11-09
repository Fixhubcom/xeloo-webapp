import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import { Transaction } from '../../types';

const mockTransactions: Transaction[] = [
    { id: '1', date: '2024-07-22', recipient: 'Acme Inc.', recipientCountry: 'USA', amountSent: 500.00, currencySent: 'USD', amountReceived: 495.00, currencyReceived: 'USD', commission: 5.00, status: 'Completed' },
    { id: '2', date: '2024-07-21', recipient: 'Lagos Ventures', recipientCountry: 'Nigeria', amountSent: 1000.00, currencySent: 'USD', amountReceived: 1450500.00, currencyReceived: 'NGN', commission: 15.00, status: 'Completed' },
    { id: '3', date: '2024-07-20', recipient: 'Innovate UK', recipientCountry: 'UK', amountSent: 250.00, currencySent: 'USD', amountReceived: 200.50, currencyReceived: 'GBP', commission: 3.75, status: 'Pending' },
    { id: '4', date: '2024-07-19', recipient: 'Ghana Goods', recipientCountry: 'Ghana', amountSent: 750.00, currencySent: 'USD', amountReceived: 9825.00, currencyReceived: 'GHS', commission: 11.25, status: 'Completed' },
    { id: '5', date: '2024-07-18', recipient: 'Nairobi Tech', recipientCountry: 'Kenya', amountSent: 1200.00, currencySent: 'USD', amountReceived: 155400.00, currencyReceived: 'KES', commission: 18.00, status: 'Failed' },
    { id: '6', date: '2024-06-15', recipient: 'Digital Exports', recipientCountry: 'USA', amountSent: 3500.00, currencySent: 'USD', amountReceived: 3482.50, currencyReceived: 'USD', commission: 52.50, status: 'Completed' },
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
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [countryFilter, setCountryFilter] = useState('All Countries');
    const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

    const uniqueCountries = useMemo(() => ['All Countries', ...Array.from(new Set(mockTransactions.map(tx => tx.recipientCountry)))], []);

    const filteredTransactions = useMemo(() => {
        return mockTransactions.filter(tx => {
            const statusMatch = statusFilter === 'All Status' || tx.status === statusFilter;
            const countryMatch = countryFilter === 'All Countries' || tx.recipientCountry === countryFilter;
            const searchMatch = !searchQuery || tx.recipient.toLowerCase().includes(searchQuery.toLowerCase());
            
            // Date matching logic
            const txDate = new Date(tx.date);
            const startDate = dateFilter.start ? new Date(dateFilter.start) : null;
            const endDate = dateFilter.end ? new Date(dateFilter.end) : null;
            if(startDate) startDate.setUTCHours(0,0,0,0);
            if(endDate) endDate.setUTCHours(23,59,59,999);
            
            const dateMatch = (!startDate || txDate >= startDate) && (!endDate || txDate <= endDate);

            return statusMatch && searchMatch && dateMatch && countryMatch;
        });
    }, [statusFilter, searchQuery, dateFilter, countryFilter]);

    const handleExport = () => {
        const headers = ['ID', 'Date', 'Recipient', 'Recipient Country', 'Amount Sent', 'Currency Sent', 'Amount Received', 'Currency Received', 'Commission', 'Status'];
        const rows = filteredTransactions.map(tx => 
            [tx.id, tx.date, tx.recipient, tx.recipientCountry, tx.amountSent, tx.currencySent, tx.amountReceived, tx.currencyReceived, tx.commission, tx.status].join(',')
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

    return (
        <Card>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                 <h2 className="text-xl font-bold text-white">Transaction History</h2>
                 <div className="flex flex-wrap items-center gap-2">
                     <input 
                        type="date" 
                        value={dateFilter.start}
                        onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value}))}
                        className="bg-gray-dark border border-gray-medium rounded-md py-1.5 px-3 text-white focus:outline-none focus:ring-accent focus:border-accent"
                     />
                      <span className="text-gray-light">to</span>
                     <input 
                        type="date" 
                        value={dateFilter.end}
                        onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value}))}
                        className="bg-gray-dark border border-gray-medium rounded-md py-1.5 px-3 text-white focus:outline-none focus:ring-accent focus:border-accent"
                     />
                      <select 
                         value={countryFilter}
                         onChange={(e) => setCountryFilter(e.target.value)}
                         className="bg-gray-dark border border-gray-medium rounded-md py-1.5 px-3 text-white focus:outline-none focus:ring-accent focus:border-accent"
                     >
                         {uniqueCountries.map(country => <option key={country}>{country}</option>)}
                     </select>
                     <select 
                         value={statusFilter}
                         onChange={(e) => setStatusFilter(e.target.value)}
                         className="bg-gray-dark border border-gray-medium rounded-md py-1.5 px-3 text-white focus:outline-none focus:ring-accent focus:border-accent"
                     >
                         <option>All Status</option>
                         <option>Completed</option>
                         <option>Pending</option>
                         <option>Failed</option>
                     </select>
                      <button onClick={handleExport} className="bg-accent text-primary font-bold py-1.5 px-4 rounded hover:bg-yellow-400">Export</button>
                 </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-light">
                    <thead className="text-xs text-gray-400 uppercase bg-primary">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Recipient</th>
                            <th scope="col" className="px-6 py-3">Amount Sent</th>
                            <th scope="col" className="px-6 py-3">Amount Received</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((tx) => (
                            <tr key={tx.id} className="bg-primary-light border-b border-gray-medium hover:bg-gray-dark">
                                <td className="px-6 py-4">{tx.date}</td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">{tx.recipient}</div>
                                    <div className="text-xs">{tx.recipientCountry}</div>
                                </td>
                                <td className="px-6 py-4 font-mono text-white">{tx.amountSent.toFixed(2)} {tx.currencySent}</td>
                                <td className="px-6 py-4 font-mono text-white">{tx.amountReceived.toLocaleString()} {tx.currencyReceived}</td>
                                <td className="px-6 py-4"><StatusBadge status={tx.status} /></td>
                            </tr>
                        ))}
                         {filteredTransactions.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-light">No transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}

export default Transactions;