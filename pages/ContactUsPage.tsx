
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import Card from '../components/common/Card';
import { LocationMarkerIcon } from '../components/icons/Icons';
import Spinner from '../components/common/Spinner';

const ContactUsPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);

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
                    <div className="inline-block bg-accent/10 text-accent p-4 rounded-full mb-4">
                        <LocationMarkerIcon className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 text-accent">Get in Touch</h1>
                    <p className="text-lg text-gray-300 mb-12">
                        We'd love to hear from you. Whether you have a question about features, trials, pricing, or anything else, our team is ready to answer all your questions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                        <div className="space-y-4 text-gray-300">
                            <div>
                                <h3 className="font-bold text-white">Our Office</h3>
                                <p>123 Finance Avenue, Lagos, Nigeria</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Email Us</h3>
                                <p>Sales: <a href="mailto:sales@xeloo.app" className="text-accent">sales@xeloo.app</a></p>
                                <p>Support: <a href="mailto:support@xeloo.app" className="text-accent">support@xeloo.app</a></p>
                            </div>
                             <div>
                                <h3 className="font-bold text-white">Call Us</h3>
                                <p><a href="tel:+2348001234567" className="text-accent">+234 (800) 123-4567</a></p>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <h2 className="text-2xl font-bold mb-4">Send us a Message</h2>
                         {isSuccess ? (
                            <div className="text-center p-4 bg-accent/10 text-accent rounded-md h-full flex flex-col justify-center">
                                <p className="font-semibold">Thank you for your message!</p>
                                <p className="text-sm">We will get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input name="name" placeholder="Your Name" required className="w-full bg-primary p-2 rounded border border-primary-light" />
                                <input name="email" type="email" placeholder="Your Email" required className="w-full bg-primary p-2 rounded border border-primary-light" />
                                <textarea name="message" rows={4} placeholder="Your Message" required className="w-full bg-primary p-2 rounded border border-primary-light"></textarea>
                                <button type="submit" disabled={isSubmitting} className="w-full bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90 flex items-center justify-center disabled:bg-gray-500">
                                    {isSubmitting ? <Spinner /> : 'Submit'}
                                </button>
                            </form>
                        )}
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default ContactUsPage;
