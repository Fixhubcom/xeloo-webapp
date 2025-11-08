
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import Card from '../../components/common/Card';

const transactionData = [
  { name: 'Jan', Sent: 4000, Received: 2400 },
  { name: 'Feb', Sent: 3000, Received: 1398 },
  { name: 'Mar', Sent: 2000, Received: 9800 },
  { name: 'Apr', Sent: 2780, Received: 3908 },
  { name: 'May', Sent: 1890, Received: 4800 },
  { name: 'Jun', Sent: 2390, Received: 3800 },
];

const cashflowData = [
  { name: 'Week 1', Inflow: 1200, Outflow: 800 },
  { name: 'Week 2', Inflow: 2100, Outflow: 980 },
  { name: 'Week 3', Inflow: 800, Outflow: 1500 },
  { name: 'Week 4', Inflow: 2500, Outflow: 1200 },
];

const UserAnalytics: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
            <h3 className="text-lg text-gray-light">Total Sent (Month)</h3>
            <p className="text-3xl font-bold text-accent">$12,450.00</p>
        </Card>
        <Card className="text-center">
            <h3 className="text-lg text-gray-light">Total Received (Month)</h3>
            <p className="text-3xl font-bold text-green-400">$22,206.00</p>
        </Card>
        <Card className="text-center">
            <h3 className="text-lg text-gray-light">Net Balance</h3>
            <p className="text-3xl font-bold text-white">$98,750.50</p>
        </Card>
      </div>
      
      <Card>
        <h3 className="text-xl font-bold mb-4">Monthly Transaction Volume</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={transactionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }} />
            <Legend />
            <Bar dataKey="Received" fill="#4ade80" />
            <Bar dataKey="Sent" fill="#fdda1a" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className="text-xl font-bold mb-4">Weekly Cash Flow</h3>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cashflowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }} />
                <Legend />
                <Line type="monotone" dataKey="Inflow" stroke="#4ade80" strokeWidth={2} />
                <Line type="monotone" dataKey="Outflow" stroke="#f87171" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default UserAnalytics;
