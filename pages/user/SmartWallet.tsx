
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { generateSmartWalletInsights } from '../../services/geminiService';
import { WalletAIAnalysis, Transaction } from '../../types';
import { SparklesIcon, TrendingUpIcon, ExclamationIcon, CheckCircleIcon, BrainIcon } from '../../components/icons/Icons';
import { useTheme } from '../../context/ThemeContext';

// Mock initial transactions to feed the AI if user has none
const mockTransactionsForAI: Transaction[] = [
    { id: '1', date: '2024-07-22', recipient: 'Acme Inc.', recipientCountry: 'USA', amountSent: 500.00, currencySent: 'USD', amountReceived: 495.00, currencyReceived: 'USD', commission: 5.00, status: 'Completed', category: 'Supplies', amountSentUSD: 500 },
    { id: '2', date: '2024-07-21', recipient: 'Lagos Ventures', recipientCountry: 'Nigeria', amountSent: 1000.00, currencySent: 'USD', amountReceived: 1450500.00, currencyReceived: 'NGN', commission: 15.00, status: 'Completed', amountSentUSD: 1000 },
    { id: '3', date: '2024-07-20', recipient: 'Lagos Ventures', recipientCountry: 'Nigeria', amountSent: 1000.00, currencySent: 'USD', amountReceived: 1450500.00, currencyReceived: 'NGN', commission: 15.00, status: 'Completed', amountSentUSD: 1000 }, // Intentionally duplicate for anomaly detection
];

const InsightCard: React.FC<{ insight: any }> = ({ insight }) => {
    const getIcon = () => {
        switch (insight.type) {
            case 'ANOMALY': return <ExclamationIcon className="w-6 h-6 text-red-500" />;
            case 'FX_ADVICE': return <TrendingUpIcon className="w-6 h-6 text-blue-500" />;
            case 'MISSING_INVOICE': return <CheckCircleIcon className="w-6 h-6 text-yellow-500" />;
            default: return <SparklesIcon className="w-6 h-6 text-accent" />;
        }
    };

    const getBorderColor = () => {
        switch (insight.severity) {
            case 'High': return 'border-l-4 border-red-500';
            case 'Medium': return 'border-l-4 border-yellow-500';
            default: return 'border-l-4 border-blue-500';
        }
    };

    return (
        <div className={`bg-white dark:bg-primary-light p-4 rounded shadow-sm mb-3 flex items-start gap-3 ${getBorderColor()}`}>
            <div className="mt-1">{getIcon()}</div>
            <div className="flex-1">
                <div className="flex justify-between">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{insight.title}</h4>
                    <span className="text-xs font-mono text-gray-500 uppercase">{insight.type.replace('_', ' ')}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{insight.description}</p>
                {insight.action && (
                    <button className="mt-2 text-xs font-bold text-accent hover:underline">
                        Action: {insight.action} &rarr;
                    </button>
                )}
            </div>
        </div>
    );
};

const FXCard: React.FC<{ sentiment: any }> = ({ sentiment }) => (
    <div className="bg-primary border border-primary-light p-3 rounded-lg text-center">
        <p className="text-xs text-gray-400">{sentiment.pair}</p>
        <p className={`text-xl font-bold my-1 ${sentiment.action === 'Buy' ? 'text-green-400' : sentiment.action === 'Sell' ? 'text-red-400' : 'text-yellow-400'}`}>
            {sentiment.action}
        </p>
        <p className="text-[10px] text-gray-500 leading-tight">{sentiment.reasoning}</p>
    </div>
);

const SmartWallet: React.FC = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const [analysis, setAnalysis] = useState<WalletAIAnalysis | null>(null);
    const [loading, setLoading] = useState(true);

    const gridColor = theme === 'dark' ? '#294A21' : '#e5e7eb';
    const textColor = theme === 'dark' ? '#a8a29e' : '#6b7280';
    const areaColor = theme === 'dark' ? '#FDDA1A' : '#F59E0B';

    useEffect(() => {
        const fetchAI = async () => {
            // In a real app, fetch real transaction history here
            const result = await generateSmartWalletInsights(mockTransactionsForAI, user?.walletBalance || 10000);
            setAnalysis(result);
            setLoading(false);
        };
        fetchAI();
    }, [user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <Spinner className="w-12 h-12 text-accent" />
                <p className="mt-4 text-gray-500 animate-pulse">Xeloo AI is analyzing your finances...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-accent/20 p-2 rounded-full"><BrainIcon className="w-6 h-6 text-accent" /></div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Wallet Brain</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">AI-optimized insights for your business.</p>
                </div>
            </div>

            {/* Top Row: Cash Flow Prediction */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <TrendingUpIcon className="w-5 h-5 text-green-400" />
                                Cash Flow Prediction (7 Days)
                            </h3>
                            <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">AI Projected</span>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analysis?.cashFlow}>
                                    <defs>
                                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={areaColor} stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor={areaColor} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                    <XAxis dataKey="date" stroke={textColor} tick={{fontSize: 12}} tickFormatter={(val) => val.slice(5)} />
                                    <YAxis stroke={textColor} tick={{fontSize: 12}} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: theme === 'dark' ? '#041401' : '#fff', borderColor: gridColor }}
                                        itemStyle={{ color: textColor }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke={areaColor} fillOpacity={1} fill="url(#colorBalance)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Right Column: FX Advice */}
                <div className="space-y-6">
                    <Card>
                        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-accent" />
                            FX Strategy
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {analysis?.fxSentiment.map((sentiment, idx) => (
                                <FXCard key={idx} sentiment={sentiment} />
                            ))}
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-primary to-primary-light border border-accent/20">
                        <h3 className="text-lg font-bold mb-2 text-white">Auto-Report</h3>
                        <p className="text-xs text-gray-400 mb-3">Generate financial statements instantly.</p>
                        <button className="w-full bg-white/10 hover:bg-white/20 text-white text-sm font-bold py-2 rounded transition-colors mb-2">
                            Download P&L
                        </button>
                        <button className="w-full bg-accent text-primary text-sm font-bold py-2 rounded hover:opacity-90 transition-colors">
                            Balance Sheet
                        </button>
                    </Card>
                </div>
            </div>

            {/* Bottom Row: Anomalies & Insights */}
            <Card>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <ExclamationIcon className="w-5 h-5 text-yellow-400" />
                    Anomalies & Opportunities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis?.insights.map((insight, idx) => (
                        <InsightCard key={idx} insight={insight} />
                    ))}
                    {analysis?.insights.length === 0 && (
                        <p className="text-gray-500 italic">No anomalies detected. Your finances look healthy!</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default SmartWallet;
