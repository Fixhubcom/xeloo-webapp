
import React from 'react';

const Pricing: React.FC = () => (
    <section className="py-20">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Plans for business engagement</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-12">Choose the right product feature for your business</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="bg-primary-light p-8 rounded-lg text-left border border-primary"><h3 className="text-2xl font-bold">Payment</h3><p className="text-gray-400 my-4">Save Time and excessive transaction cost.</p><p className="text-3xl font-bold"><span className="text-accent">1.5%</span>/per transaction</p><ul className="space-y-2 my-6 text-gray-300"><li>✓ Cross-border Payment</li><li>✓ Instant Settlement</li><li>✓ Transaction History</li><li>✓ Supports All Currencies</li><li>✓ Instant payouts</li><li>- Accounting Tools</li><li>- Invoicing Tools</li></ul><button className="w-full bg-accent text-primary font-bold py-3 rounded-lg hover:opacity-90">Choose Payment</button></div>
                <div className="bg-primary-light p-8 rounded-lg text-left border-2 border-accent transform scale-105"><h3 className="text-2xl font-bold">Business</h3><p className="text-gray-400 my-4"><span className="line-through">$60</span></p><p className="text-3xl font-bold"><span className="text-accent">$29.99</span>/month</p><ul className="space-y-2 my-6 text-gray-300"><li>✓ Cross-border Payment</li><li>✓ Unlimited analytics</li><li>✓ Instant Settlement</li><li>✓ Transaction History</li><li>✓ Supports All Currencies</li><li>✓ Instant payouts</li><li>✓ Accounting & Invoicing Tools</li></ul><button className="w-full bg-accent text-primary font-bold py-3 rounded-lg hover:opacity-90">Choose Business</button></div>
                <div className="bg-primary-light p-8 rounded-lg text-left border border-primary"><h3 className="text-2xl font-bold">Pro</h3><p className="text-gray-400 my-4"><span className="line-through">$720</span></p><p className="text-3xl font-bold"><span className="text-accent">$299.99</span>/year</p><ul className="space-y-2 my-6 text-gray-300"><li>✓ Cross-border Payment</li><li>✓ Unlimited analytics</li><li>✓ Instant Settlement</li><li>✓ Transaction History</li><li>✓ Supports All Currencies</li><li>✓ Instant payouts</li><li>✓ Accounting & Invoicing Tools</li></ul><button className="w-full bg-accent text-primary font-bold py-3 rounded-lg hover:opacity-90">Choose Pro</button></div>
            </div>
        </div>
    </section>
);

export default Pricing;
