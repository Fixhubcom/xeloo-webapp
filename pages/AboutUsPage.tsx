
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';

const AboutUsPage: React.FC = () => {
    const navigate = useNavigate();

    const team = [
        { name: 'John Doe', title: 'CEO & Founder', initials: 'JD', color: '#3b82f6' },
        { name: 'Jane Smith', title: 'Chief Technology Officer', initials: 'JS', color: '#ef4444' },
        { name: 'Alex Chen', title: 'Head of Partnerships', initials: 'AC', color: '#10b981' },
        { name: 'Maria Garcia', title: 'Head of Customer Success', initials: 'MG', color: '#8b5cf6' },
    ];

    return (
        <div className="bg-primary text-white min-h-screen">
            <header className="py-4 px-8 bg-primary-light shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <Logo className="text-3xl" />
                    <button onClick={() => navigate('/')} className="text-accent font-medium hover:underline">
                        &larr; Back to Home
                    </button>
                </div>
            </header>

            <main className="container mx-auto py-12 px-4 md:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4 text-accent">About Xeloo</h1>
                    <p className="text-lg text-gray-300 mb-12">
                        We're on a mission to democratize global finance, making it faster, cheaper, and more accessible for everyone.
                    </p>
                </div>

                <Card className="mb-8">
                    <h2 className="text-2xl font-bold mb-3">Our Story</h2>
                    <p className="text-gray-300">
                        Founded by a team of fintech veterans and blockchain enthusiasts, Xeloo was born from a shared frustration with the slow, expensive, and opaque nature of traditional cross-border payments. We envisioned a world where sending money across borders is as simple as sending an email. By combining the power of AI with the efficiency of blockchain technology, we're turning that vision into a reality for thousands of businesses and individuals worldwide.
                    </p>
                </Card>
                
                 <Card className="mb-8">
                    <h2 className="text-2xl font-bold mb-3">Our Mission & Vision</h2>
                    <p className="text-gray-300">
                        Our mission is to build the financial infrastructure for a borderless economy. We strive to empower businesses and individuals by providing seamless, secure, and affordable financial services. Our vision is a world where economic opportunity is not limited by geography, and value can flow freely and instantly to every corner of the globe.
                    </p>
                </Card>

                <div className="text-center mt-16">
                    <h2 className="text-3xl font-bold mb-8">Meet the Team</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {team.map(member => (
                            <div key={member.name}>
                                <Avatar initials={member.initials} bgColor={member.color} className="w-24 h-24 text-4xl mx-auto mb-3" />
                                <h3 className="font-bold text-white">{member.name}</h3>
                                <p className="text-sm text-accent">{member.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AboutUsPage;
