
import React from 'react';
import Card from '../../components/common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const userGrowthData = [
    { name: 'Jan', Users: 1200 }, { name: 'Feb', Users: 2100 }, { name: 'Mar', Users: 3500 },
    { name: 'Apr', Users: 5200 }, { name: 'May', Users: 7800 }, { name: 'Jun', Users: 10200 },
];
const volumeData = [
    { name: 'Jan', Volume: 2.4 }, { name: 'Feb', Volume: 3.1 }, { name: 'Mar', Volume: 4.5 },
    { name: 'Apr', Volume: 5.2 }, { name: 'May', Volume: 6.8 }, { name: 'Jun', Volume: 8.1 },
];
const revenueData = [
    { name: 'Commissions', value: 75320 },
    { name: 'Subscriptions', value: 12850 },
];
const COLORS = ['#FDDA1A', '#FFFFFF'];

const AdminReports: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <h3 className="text-xl font-bold mb-4">User Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={userGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#294A21"/>
                            <XAxis dataKey="name" stroke="#a8a29e" />
                            <YAxis stroke="#a8a29e" />
                            <Tooltip contentStyle={{ backgroundColor: '#041401', border: '1px solid #294A21' }} />
                            <Legend />
                            <Line type="monotone" dataKey="Users" stroke="#FDDA1A" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
                <Card>
                    <h3 className="text-xl font-bold mb-4">Transaction Volume (in Millions USD)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={volumeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#294A21" />
                            <XAxis dataKey="name" stroke="#a8a29e" />
                            <YAxis stroke="#a8a29e" />
                            <Tooltip contentStyle={{ backgroundColor: '#041401', border: '1px solid #294A21' }} />
                            <Legend />
                            <Bar dataKey="Volume" fill="#FDDA1A" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            <Card>
                <h3 className="text-xl font-bold mb-4">Revenue Sources (Last 30d)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={revenueData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {revenueData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#041401', border: '1px solid #294A21' }} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default AdminReports;
