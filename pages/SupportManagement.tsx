
import React from 'react';
import Card from '../components/common/Card';
import { useAuth } from '../hooks/useAuth';
import Avatar from '../components/common/Avatar';
import Spinner from '../components/common/Spinner';

interface AccountManager {
    id: string;
    name: string;
    title: string;
    email: string;
    phone: string;
    avatar: {
        initials: string;
        bgColor: string;
    };
}

const accountManagers: { [key: string]: AccountManager } = {
    '5': { 
        id: '5', 
        name: 'Alex Chen', 
        title: 'Senior Partner & Merchant Success Manager', 
        email: 'alex.chen@xeloo.com', 
        phone: '+1 (800) 555-0105', 
        avatar: { initials: 'AC', bgColor: '#10b981' }
    },
    '7': { 
        id: '7', 
        name: 'Maria Garcia', 
        title: 'Dedicated Account Manager', 
        email: 'maria.garcia@xeloo.com', 
        phone: '+1 (800) 555-0107', 
        avatar: { initials: 'MG', bgColor: '#3b82f6' }
    },
    'default': {
        id: '0',
        name: 'General Support',
        title: 'Xeloo Support Team',
        email: 'support@xeloo.com',
        phone: '+1 (800) 555-0100',
        avatar: { initials: 'XS', bgColor: '#8b5cf6' }
    }
};

const SupportManagement: React.FC = () => {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    
    const manager = accountManagers[user?.accountOfficerId || 'default'] || accountManagers['default'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setIsSuccess(false);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            (e.target as HTMLFormElement).reset();
        }, 1500);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <Card>
                    <h2 className="text-xl font-bold mb-4">Your Account Manager</h2>
                    <div className="flex flex-col items-center text-center">
                        <Avatar 
                            initials={manager.avatar.initials} 
                            bgColor={manager.avatar.bgColor} 
                            className="w-24 h-24 text-4xl mb-4"
                        />
                        <h3 className="text-2xl font-bold text-white">{manager.name}</h3>
                        <p className="text-accent">{manager.title}</p>
                        <div className="mt-6 w-full text-left space-y-3">
                            <div>
                                <p className="text-sm text-gray-400">Email Address</p>
                                <a href={`mailto:${manager.email}`} className="text-white hover:text-accent">{manager.email}</a>
                            </div>
                             <div>
                                <p className="text-sm text-gray-400">Phone Number</p>
                                <a href={`tel:${manager.phone}`} className="text-white hover:text-accent">{manager.phone}</a>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2">
                 <Card>
                    <h2 className="text-xl font-bold mb-4">Contact Support</h2>
                    <p className="text-gray-400 mb-6">Have a question or need assistance? Send us a message, and we'll get back to you as soon as possible.</p>
                     {isSuccess ? (
                        <div className="text-center p-4 bg-accent/10 text-accent rounded-md">
                            <p className="font-semibold">Your message has been sent!</p>
                            <p className="text-sm">Our support team will get back to you shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                                <input id="subject" type="text" placeholder="e.g., Question about a recent transaction" required className="w-full bg-primary p-2 rounded border border-primary-light" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                                <textarea id="message" rows={5} placeholder="Describe your issue or question in detail..." required className="w-full bg-primary p-2 rounded border border-primary-light"></textarea>
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" disabled={isSubmitting} className="w-48 bg-accent text-primary font-bold py-2.5 px-4 rounded hover:opacity-90 flex items-center justify-center disabled:bg-gray-500">
                                    {isSubmitting ? <Spinner /> : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default SupportManagement;
