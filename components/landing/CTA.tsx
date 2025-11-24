
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTA: React.FC = () => {
    const navigate = useNavigate();
    const calendlyUrl = 'https://calendly.com/d/cn3-j2g-c5g/xeloo-demo-session';

    return (
        <section className="py-20 bg-primary-light">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the platform customers love.</h2>
                <p className="text-gray-300 max-w-2xl mx-auto mb-8">Trust your business with the world’s leading payment gateway.</p>
                <div className="flex justify-center space-x-4">
                    <a
                        href={calendlyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-accent text-accent font-bold py-3 px-6 rounded-lg hover:bg-accent hover:text-primary transition-colors"
                    >
                        Book A Demo
                    </a>
                    <button onClick={() => navigate('/onboarding')} className="bg-accent text-primary font-bold py-3 px-6 rounded-lg hover:opacity-90">Create free account</button>
                </div>
            </div>
        </section>
    );
};

export default CTA;
