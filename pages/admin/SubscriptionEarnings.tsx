import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface SubscriptionEarning {
  id: string;
  user: string;
  company: string;
  plan: 'Pro Monthly' | 'Pro Yearly';
  amount: number;
  date: string;
}

const allSubscriptions: SubscriptionEarning[] = [
    { id: 's1', user: 'John Doe', company: 'Creative Solutions', plan: 'Pro Monthly', amount: 29.99, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: 's2', user: 'Jane Smith', company: 'NewBiz Co', plan: 'Pro Monthly', amount: 29.99, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: 's3', user: 'Another User', company: 'Another Co', plan: 'Pro Yearly', amount: 299.99, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: 's4', user: 'Old User', company: 'Old Company', plan: 'Pro Monthly', amount: 29.99, date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
];

const COLORS_DARK = ['#FDDA1A', '#a8a29e'];
const COLORS_LIGHT = ['#D97706', '#6B7280'];

type TimeFilter = '24h' | '7d' | '30d';

const SubscriptionEarnings: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
    const { theme } = useTheme();
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d');
    
    const tooltipStyles = {
        contentStyle: {
            backgroundColor: theme === 'dark' ? '#041401' : '#ffffff',
            border: `1px solid ${theme === 'dark' ? '#294A21' : '#e5e7eb'}`,
        }
    };
    const COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;
    const textColor = theme === 'dark' ? '#a8a29e' : '#475569';


    const filteredSubscriptions = useMemo(() => {
        const now = new Date();
        const filterDate = new Date();
        
        if (timeFilter === '24h') {
            filterDate.setDate(now.getDate() - 1);
        } else if (timeFilter === '7d') {
            filterDate.setDate(now.getDate() - 7);
        } else if (timeFilter === '30d') {
            filterDate.setDate(now.getDate() - 30);
        }

        return allSubscriptions.filter(s => {
            const subDate = new Date(s.date);
            const searchMatch = !searchQuery || 
                s.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                s.company.toLowerCase().includes(searchQuery.toLowerCase());

            return subDate >= filterDate && searchMatch;
        });
    }, [timeFilter, searchQuery]);
    
    const totalEarnings = useMemo(() => {
        return filteredSubscriptions.reduce((sum, s) => sum + s.amount, 0);
    }, [filteredSubscriptions]);

    const chartData = useMemo(() => {
        const monthly = filteredSubscriptions.filter(s => s.plan === 'Pro Monthly').length;
        const yearly = filteredSubscriptions.filter(s => s.plan === 'Pro Yearly').length;
        return [
            { name: 'Monthly Plans', value: monthly },
            { name: 'Yearly Plans', value: yearly },
        ];
    }, [filteredSubscriptions]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex space-x-2 p-1 bg-white dark:bg-primary-light rounded-lg">
                    {(['24h', '7d', '30d'] as TimeFilter[]).map(filter => (
                        <button
                            key={filter}
                            onClick={() => setTimeFilter(filter)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${timeFilter === filter ? 'bg-accent text-primary' : 'text-gray-500 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-primary'}`}
                        >
                            Last {filter === '24h' ? '24 Hours' : filter.replace('d', ' Days')}
                        </button>
                    ))}
                </div>
                <Card className="text-center p-4">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Earnings ({timeFilter.replace('h', ' hours').replace('d', ' days')})</h3>
                    <p className="text-2xl font-bold text-accent">{totalEarnings.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                </Card>
            </div>
            
            <Card>
                <h3 className="text-xl font-bold mb-4">Subscription Plan Breakdown</h3>
                <ResponsiveContainer width="100%" height={250}>
                     <PieChart>
                        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={{fill: textColor}}>
                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip {...tooltipStyles} />
                        <Legend wrapperStyle={{ color: textColor }} />
                    </PieChart>
                </ResponsiveContainer>
            </Card>

            <Card>
                <h2 className="text-xl font-bold mb-4">Subscription Log</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-slate-100 dark:bg-primary">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Plan</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubscriptions.map(s => (
                                <tr key={s.id} className="bg-white dark:bg-primary-light border-b border-slate-100 dark:border-primary">
                                    <td className="px-6 py-4">{s.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800 dark:text-white">{s.user}</div>
                                        <div className="text-xs">{s.company}</div>
                                    </td>
                                    <td className="px-6 py-4">{s.plan}</td>
                                    <td className="px-6 py-4 font-mono text-right text-accent">{s.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                </tr>
                            ))}
                            {filteredSubscriptions.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">No subscriptions found for this period.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

export default SubscriptionEarnings;