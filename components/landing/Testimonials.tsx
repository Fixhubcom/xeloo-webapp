
import React from 'react';

const Testimonials: React.FC = () => {
    const testimonialData = [
        { name: 'John Smith', quote: 'This is an amazing product for international trades. Thank you for creating this platform.' },
        { name: 'Mary Adams', quote: 'Simply an amazing product. Thank you for the speed and time you save for my business.' },
        { name: 'Adekunle Suen', quote: 'This product was introduced to me at the right time. i can now pay my suppliers like the speed of light.' },
        { name: 'Janeth Adakole', quote: 'After connecting this product’s API, i was able to receive payment on my website from anywhere in the world.' },
    ];
    return (
        <section className="py-20 bg-primary-light">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Hear what people are saying about us</h2>
                    <p className="text-gray-300 max-w-3xl mx-auto mb-12">Discover the smart cross-border payment for your business and instant settlement in bank accounts, account management, invoicing and payroll software for instant payment anywhere you are.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonialData.map(t => (
                        <div key={t.name} className="bg-primary p-6 rounded-lg">
                            <p className="text-accent font-bold text-xl">★★★★★</p>
                            <p className="text-gray-300 my-4">"{t.quote}"</p>
                            <p className="font-bold text-white">- {t.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
