
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
    const navigate = useNavigate();
    return (
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 text-center overflow-hidden">
             <div className="absolute inset-0 bg-primary opacity-50 z-0"></div>
             <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full filter blur-3xl"></div>
             <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full filter blur-3xl"></div>
            <div className="container mx-auto px-4 relative z-10">
                <p className="font-mono text-accent tracking-widest mb-2">Fiat – Borderless – Fiat</p>
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                   instant cross-border transactions
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                    Revolutionize Cross-Border Payments. AI-powered borderless remittances and business payments. Send money instantly with 1.5% fees, plus integrated accounting, invoicing, and payroll.
                </p>
                 <button
                    onClick={() => navigate('/onboarding')}
                    className="bg-accent text-primary font-bold py-3 px-8 rounded-lg text-lg hover:opacity-90 transition-transform transform hover:scale-105"
                >
                    Create free account
                </button>
                <p className="text-sm text-gray-400 mt-4">Rated 5 stars by 1,000+ businesses ★★★★★</p>
                
                 <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="bg-primary-light p-4 rounded-lg border border-primary shadow-lg animate-float-left">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">All: ▲ 33.3%</span>
                            <span className="text-lg font-bold text-white">80%</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">Transaction</p>
                        <p className="text-2xl font-bold text-green-400">+ $2,473.65</p>
                    </div>
                     <div className="bg-primary-light p-4 rounded-lg border border-primary shadow-lg z-10 animate-float-center">
                        <p className="text-sm text-gray-400">Performance</p>
                        <div className="w-full bg-primary h-2 rounded-full mt-2">
                            <div className="bg-accent w-3/4 h-2 rounded-full"></div>
                        </div>
                        <p className="text-right text-xs text-gray-400 mt-1">Quarter 🔻</p>
                    </div>
                     <div className="bg-primary-light p-4 rounded-lg border border-primary shadow-lg animate-float-right">
                        <p className="text-sm text-gray-400">Expenses <span className="text-red-400">$123,456</span></p>
                        <p className="text-sm text-gray-400">Income <span className="text-green-400">$654,321</span></p>
                        <p className="text-lg font-bold text-white mt-1">Profit <span className="text-accent">+ $530,865</span></p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Hero;
