
import React from 'react';
import { RocketIcon, PercentIcon, ShieldCheckIcon, PayrollIcon } from '../icons/Icons';

interface FeatureCardProps { icon: React.ReactNode; title: string; description: string; }
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
    <div className="bg-primary-light p-6 rounded-lg text-left transform hover:-translate-y-2 transition-transform duration-300">
        <div className="inline-block bg-accent/10 text-accent p-3 rounded-lg mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
    </div>
);

const Features: React.FC = () => (
    <section className="py-20">
        <div className="container mx-auto px-4">
            <div className="text-center">
                 <h2 className="text-3xl md:text-4xl font-bold mb-4">The all-in-one solution for cross-border payment</h2>
                 <p className="text-gray-300 max-w-2xl mx-auto mb-12">See why over 10,000 people trust our platform for instant cross-border transaction for .</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FeatureCard icon={<RocketIcon className="w-8 h-8"/>} title="Lightning Fast" description="Settlement in seconds vs days with traditional methods" />
                <FeatureCard icon={<PercentIcon className="w-8 h-8"/>} title="Ultra Low Fees" description="1.5% transaction fees vs up to 15% with traditional remittance" />
                <FeatureCard icon={<ShieldCheckIcon className="w-8 h-8"/>} title="AI-Powered Security" description="Advanced fraud detection and compliance with biometric authentication" />
                <FeatureCard icon={<PayrollIcon className="w-8 h-8"/>} title="Payroll Management" description="Streamlined payroll processing for businesses of all sizes" />
            </div>
             <div className="text-center mt-12">
                <button className="bg-accent text-primary font-bold py-3 px-8 rounded-lg hover:opacity-90">Get Started</button>
            </div>
        </div>
    </section>
);

export default Features;
