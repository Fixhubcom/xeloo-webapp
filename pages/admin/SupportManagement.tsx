
import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { SparklesIcon } from '../../components/icons/Icons';
import { getSupportResponseSuggestion } from '../../services/geminiService';
import Spinner from '../../components/common/Spinner';

const mockTickets = [
    { id: 1, user: 'John Doe', subject: 'Payment to Lagos Ventures pending', status: 'Open', lastMessage: 'Hi, I sent a payment yesterday and it\'s still showing as pending. Can you check?' },
    { id: 2, user: 'Jane Smith', subject: 'Question about API limits', status: 'Open', lastMessage: 'What are the rate limits for the payments API on the free plan?' },
    { id: 3, user: 'Acme Inc.', subject: 'Invoice INV-002 overdue', status: 'Closed', lastMessage: 'Thanks for the help!' },
];

const mockConversation = [
    { from: 'user', text: 'Hi, I sent a payment yesterday and it\'s still showing as pending. Can you check?' },
    { from: 'agent', text: 'Hello John, thanks for reaching out. I can certainly look into that for you. Could you please provide the transaction ID?' },
];

const SupportManagement: React.FC = () => {
    const [reply, setReply] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [isSuggesting, setIsSuggesting] = useState(false);
    const lastUserMessage = mockConversation.filter(m => m.from === 'user').pop()?.text || '';

    const handleGetSuggestion = async () => {
        setIsSuggesting(true);
        setSuggestion('');
        const result = await getSupportResponseSuggestion(lastUserMessage);
        setSuggestion(result);
        setIsSuggesting(false);
    };

    const useSuggestion = () => {
        setReply(suggestion);
        setSuggestion('');
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-10rem)]">
            <div className="lg:col-span-1">
                <Card className="h-full flex flex-col">
                    <h2 className="text-xl font-bold mb-4">Support Tickets</h2>
                    <div className="flex-1 overflow-y-auto -mr-4 pr-4">
                        {mockTickets.map(ticket => (
                            <div key={ticket.id} className="p-3 bg-primary rounded-md mb-3 cursor-pointer hover:bg-primary/80 border-l-4 border-accent">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-white">{ticket.subject}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${ticket.status === 'Open' ? 'bg-accent/20 text-accent' : 'bg-gray-500/20 text-gray-300'}`}>{ticket.status}</span>
                                </div>
                                <p className="text-sm text-gray-400 mt-1 truncate">{ticket.user}: {ticket.lastMessage}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
             <div className="lg:col-span-2">
                <Card className="h-full flex flex-col">
                    <h2 className="text-xl font-bold mb-4">Conversation with John Doe</h2>
                    {/* Chat Area */}
                    <div className="flex-1 bg-primary p-4 rounded-lg overflow-y-auto mb-4 space-y-4">
                        {mockConversation.map((msg, index) => (
                            <div key={index} className={`flex ${msg.from === 'user' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${msg.from === 'user' ? 'bg-gray-700 text-white' : 'bg-accent text-primary'}`}>
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* AI Assistant */}
                     <div className="border border-primary rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-accent flex items-center"><SparklesIcon className="mr-2"/> Gemini AI Assistant</h3>
                            {!isSuggesting && !suggestion && <button onClick={handleGetSuggestion} className="bg-accent/80 text-primary font-bold py-1 px-3 rounded text-sm hover:bg-accent">Suggest Reply</button>}
                        </div>
                        {isSuggesting && <div className="flex items-center text-gray-400 mt-2"><Spinner className="mr-2"/>Generating...</div>}
                        {suggestion && (
                            <div className="mt-2 bg-primary p-3 rounded-md">
                                <p className="text-gray-300 text-sm italic whitespace-pre-wrap">{suggestion}</p>
                                <div className="flex justify-end space-x-2 mt-2">
                                    <button onClick={() => setSuggestion('')} className="text-xs text-gray-400 hover:underline">Dismiss</button>
                                    <button onClick={useSuggestion} className="text-xs bg-accent/20 text-accent font-bold py-1 px-2 rounded hover:bg-accent/40">Use this reply</button>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Reply Area */}
                    <div className="flex space-x-3">
                        <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..." rows={2} className="flex-1 bg-primary p-2 rounded border border-primary-light focus:ring-accent focus:border-accent"></textarea>
                        <button className="bg-accent text-primary font-bold px-6 rounded hover:opacity-90 self-end">Send</button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SupportManagement;