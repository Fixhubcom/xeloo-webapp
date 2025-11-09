
import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import { SparklesIcon } from '../../components/icons/Icons';
import { getSupportResponseSuggestion } from '../../services/geminiService';
import Spinner from '../../components/common/Spinner';

// --- Types ---
type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
type TicketPriority = 'Low' | 'Medium' | 'High';

interface SupportTicket {
    id: number;
    user: string;
    userEmail: string;
    userCompany: string;
    subject: string;
    status: TicketStatus;
    priority: TicketPriority;
    assignedTo: string;
    lastUpdate: string;
    lastMessage: string;
}

interface ConversationMessage {
    from: 'user' | 'agent';
    text: string;
    timestamp: string;
    agentName?: string;
}

interface InternalNote {
    id: number;
    agentName: string;
    text: string;
    timestamp: string;
}

// --- Mock Data ---
const mockTickets: SupportTicket[] = [
    { id: 1, user: 'John Doe', userEmail: 'john@creativesolutions.com', userCompany: 'Creative Solutions', subject: 'Payment to Lagos Ventures pending', status: 'Open', priority: 'High', assignedTo: 'Support Lead', lastUpdate: '2 mins ago', lastMessage: 'Hi, I sent a payment yesterday and it\'s still showing as pending. Can you check?' },
    { id: 2, user: 'Jane Smith', userEmail: 'jane.s@newbiz.co', userCompany: 'NewBiz Co', subject: 'Question about API limits', status: 'Open', priority: 'Medium', assignedTo: 'Support Lead', lastUpdate: '1 hour ago', lastMessage: 'What are the rate limits for the payments API on the free plan?' },
    { id: 3, user: 'Acme Inc.', userEmail: 'billing@acme.com', userCompany: 'Acme Incorporated', subject: 'Invoice INV-002 overdue', status: 'Closed', priority: 'Low', assignedTo: 'Support Lead', lastUpdate: '1 day ago', lastMessage: 'Thanks for the help!' },
    { id: 4, user: 'Financial Partner', userEmail: 'contact@globalbank.com', userCompany: 'Global Bank', subject: 'Settlement Discrepancy', status: 'In Progress', priority: 'High', assignedTo: 'Support Lead', lastUpdate: '3 hours ago', lastMessage: 'We have noticed a discrepancy in yesterday\'s settlement batch. Can you investigate?' },
];

const mockConversations: { [key: number]: { messages: ConversationMessage[], notes: InternalNote[] } } = {
    1: {
        messages: [
            { from: 'user', text: 'Hi, I sent a payment yesterday and it\'s still showing as pending. Can you check?', timestamp: 'Yesterday, 4:32 PM' },
            { from: 'agent', agentName: 'Support Lead', text: 'Hello John, thanks for reaching out. I can certainly look into that for you. Could you please provide the transaction ID?', timestamp: 'Yesterday, 4:35 PM' },
        ],
        notes: [
            { id: 1, agentName: 'Support Lead', text: 'User seems frustrated. Priority is high. Transaction ID is likely TXN-12345. Checking with the payments team.', timestamp: 'Yesterday, 4:36 PM' }
        ]
    },
    2: { messages: [{ from: 'user', text: 'What are the rate limits for the payments API on the free plan?', timestamp: 'Today, 10:15 AM' }], notes: [] },
    3: { messages: [{ from: 'user', text: 'Where can I find my invoice?', timestamp: '1 day ago' }, {from: 'agent', agentName: 'Support Lead', text: 'You can find it under the Invoices tab.', timestamp: '1 day ago'}, { from: 'user', text: 'Thanks for the help!', timestamp: '1 day ago' }], notes: [] },
    4: { messages: [{ from: 'user', text: 'We have noticed a discrepancy in yesterday\'s settlement batch. Can you investigate?', timestamp: 'Today, 8:00 AM' }], notes: [{ id: 1, agentName: 'Support Lead', text: 'Potential high-impact issue. Escalating to the finance department to verify batch totals.', timestamp: 'Today, 8:05 AM' }] }
};

const supervisors = ['Operations Manager', 'Head of Support', 'CTO', 'Finance Department'];

// --- Helper Components ---
const StatusBadge: React.FC<{ status: TicketStatus }> = ({ status }) => {
    const classes = {
        Open: 'bg-accent/20 text-accent',
        'In Progress': 'bg-blue-500/20 text-blue-300',
        Resolved: 'bg-green-500/20 text-green-300',
        Closed: 'bg-gray-500/20 text-gray-300',
    };
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${classes[status]}`}>{status}</span>;
};

const PriorityBadge: React.FC<{ priority: TicketPriority }> = ({ priority }) => {
    const classes = {
        High: 'bg-red-500/20 text-red-300',
        Medium: 'bg-yellow-500/20 text-yellow-300',
        Low: 'bg-gray-500/20 text-gray-300',
    };
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${classes[priority]}`}>{priority}</span>;
};

const ForwardModal: React.FC<{ ticket: SupportTicket; onClose: () => void; onForward: () => void; }> = ({ ticket, onClose, onForward }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
            <Card className="w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Forward Ticket #{ticket.id}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400">Forward to</label>
                        <select className="w-full bg-primary p-2 rounded border border-primary-light mt-1">
                            {supervisors.map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Add a note (optional)</label>
                        <textarea rows={3} placeholder="e.g., Please review this settlement issue urgently." className="w-full bg-primary p-2 rounded border border-primary-light mt-1"></textarea>
                    </div>
                </div>
                 <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">Cancel</button>
                    <button onClick={onForward} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">Forward</button>
                </div>
            </Card>
        </div>
    );
};

interface SupportManagementProps {
    searchQuery: string;
}

// Main Component
const SupportManagement: React.FC<SupportManagementProps> = ({ searchQuery }) => {
    const [tickets, setTickets] = useState(mockTickets);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0]);
    const [conversations, setConversations] = useState(mockConversations);
    
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');

    const [activeTab, setActiveTab] = useState<'Conversation' | 'Client Details' | 'Internal Notes'>('Conversation');
    const [isForwarding, setIsForwarding] = useState(false);
    
    const [reply, setReply] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [isSuggesting, setIsSuggesting] = useState(false);
    
    const [internalNote, setInternalNote] = useState('');

    const filteredTickets = useMemo(() => {
        return tickets.filter(t => {
            const statusMatch = (statusFilter === 'All' || t.status === statusFilter);
            const priorityMatch = (priorityFilter === 'All' || t.priority === priorityFilter);
            const lowercasedQuery = searchQuery.toLowerCase();
            const searchMatch = !searchQuery ||
                t.subject.toLowerCase().includes(lowercasedQuery) ||
                t.user.toLowerCase().includes(lowercasedQuery) ||
                t.userCompany.toLowerCase().includes(lowercasedQuery);
            return statusMatch && priorityMatch && searchMatch;
        });
    }, [tickets, statusFilter, priorityFilter, searchQuery]);

    const handleStatusChange = (ticketId: number, newStatus: TicketStatus) => {
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
        if(selectedTicket?.id === ticketId) {
            setSelectedTicket(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };
    
    const handleForward = () => {
        // Here you would add logic to notify the supervisor. We'll just close the modal for now.
        setIsForwarding(false);
        // Maybe add an internal note automatically
        if (!selectedTicket) return;
        const currentNotes = conversations[selectedTicket.id]?.notes || [];
        const newNote: InternalNote = {
            id: currentNotes.length + 1,
            agentName: 'Support Lead',
            text: `Ticket forwarded to supervisor.`,
            timestamp: 'Just now',
        };
         setConversations(prev => ({
            ...prev,
            [selectedTicket.id]: {
                ...prev[selectedTicket.id],
                notes: [newNote, ...currentNotes],
            }
        }));
    };

    const handleAddInternalNote = () => {
        if (!internalNote.trim() || !selectedTicket) return;
        const currentNotes = conversations[selectedTicket.id]?.notes || [];
        const newNote: InternalNote = {
            id: currentNotes.length + 1,
            agentName: 'Support Lead', // Assuming current user
            text: internalNote,
            timestamp: 'Just now',
        };
        setConversations(prev => ({
            ...prev,
            [selectedTicket.id]: {
                ...(prev[selectedTicket.id] || { messages: [], notes: [] }),
                notes: [newNote, ...currentNotes],
            }
        }));
        setInternalNote('');
    };
    
    const handleSendReply = () => {
        if (!reply.trim() || !selectedTicket) return;
        const currentMessages = conversations[selectedTicket.id]?.messages || [];
        const newMessage: ConversationMessage = {
            from: 'agent',
            agentName: 'Support Lead',
            text: reply,
            timestamp: 'Just now',
        };
         setConversations(prev => ({
            ...prev,
            [selectedTicket.id]: {
                ...(prev[selectedTicket.id] || { messages: [], notes: [] }),
                messages: [...currentMessages, newMessage],
            }
        }));
        setReply('');
    };
    
    const lastUserMessage = useMemo(() => {
        if (!selectedTicket) return '';
        const messages = conversations[selectedTicket.id]?.messages || [];
        return messages.filter(m => m.from === 'user').pop()?.text || '';
    }, [selectedTicket, conversations]);

    const handleGetSuggestion = async () => {
        if (!lastUserMessage) return;
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
            {/* Ticket List Panel */}
            <div className="lg:col-span-1">
                <Card className="h-full flex flex-col">
                    <h2 className="text-xl font-bold mb-4">Support Inbox</h2>
                    <div className="flex gap-2 mb-4">
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-primary p-2 rounded border border-primary-light text-sm">
                            <option>All Status</option>
                            {(['Open', 'In Progress', 'Resolved', 'Closed'] as TicketStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                         <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="w-full bg-primary p-2 rounded border border-primary-light text-sm">
                            <option>All Priority</option>
                            {(['High', 'Medium', 'Low'] as TicketPriority[]).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 overflow-y-auto -mr-4 pr-4">
                        {filteredTickets.map(ticket => (
                            <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} className={`p-3 bg-primary-light rounded-md mb-3 cursor-pointer hover:opacity-80 border-l-4 ${selectedTicket?.id === ticket.id ? 'border-accent' : 'border-primary-light'}`}>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-white text-sm pr-2">{ticket.subject}</h3>
                                    <StatusBadge status={ticket.status} />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{ticket.user}</p>
                                <div className="flex justify-between items-center mt-2 text-xs">
                                    <PriorityBadge priority={ticket.priority} />
                                    <span className="text-gray-500">{ticket.lastUpdate}</span>
                                </div>
                            </div>
                        ))}
                        {filteredTickets.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p>No tickets found.</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
            {/* Conversation Panel */}
             <div className="lg:col-span-2">
                {selectedTicket ? (
                <Card className="h-full flex flex-col">
                    {/* Ticket Header */}
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-primary">
                        <div>
                            <h2 className="text-xl font-bold">#{selectedTicket.id}: {selectedTicket.subject}</h2>
                            <p className="text-sm text-gray-400">From: {selectedTicket.user} ({selectedTicket.userCompany})</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <select value={selectedTicket.status} onChange={e => handleStatusChange(selectedTicket!.id, e.target.value as TicketStatus)} className="bg-primary border border-primary-light rounded-md py-1 px-2 text-xs text-white">
                                 {(['Open', 'In Progress', 'Resolved', 'Closed'] as TicketStatus[]).map(s => <option key={s}>{s}</option>)}
                            </select>
                            <button onClick={() => setIsForwarding(true)} className="text-sm bg-primary-light text-white font-bold py-1 px-3 rounded hover:opacity-80">Forward</button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-primary mb-4">
                        {(['Conversation', 'Client Details', 'Internal Notes'] as const).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-accent text-accent' : 'text-gray-400'}`}>{tab}</button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto mb-4 pr-2">
                        {activeTab === 'Conversation' && (
                            <div className="space-y-4">
                                {(conversations[selectedTicket.id]?.messages || []).map((msg, index) => (
                                    <div key={index} className={`flex ${msg.from === 'user' ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-md p-3 rounded-xl ${msg.from === 'user' ? 'bg-primary text-white' : 'bg-accent/80 text-primary'}`}>
                                            <p className="text-sm">{msg.text}</p>
                                            <p className="text-xs opacity-70 mt-1 text-right">{msg.from === 'agent' ? msg.agentName : selectedTicket.user} - {msg.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                         {activeTab === 'Client Details' && (
                            <div className="text-sm space-y-2 text-gray-300">
                                <p><strong>Name:</strong> {selectedTicket.user}</p>
                                <p><strong>Email:</strong> {selectedTicket.userEmail}</p>
                                <p><strong>Company:</strong> {selectedTicket.userCompany}</p>
                                <p><strong>Status:</strong> <span className="text-accent">Active User</span></p>
                                <p><strong>Joined:</strong> 1 year ago</p>
                            </div>
                         )}
                        {activeTab === 'Internal Notes' && (
                            <div>
                                <div className="flex space-x-2 mb-4">
                                    <textarea value={internalNote} onChange={e => setInternalNote(e.target.value)} placeholder="Add an internal note..." rows={2} className="flex-1 bg-primary p-2 rounded border border-primary-light"></textarea>
                                    <button onClick={handleAddInternalNote} className="bg-primary-light text-white font-bold px-4 rounded hover:opacity-80 self-end">Add Note</button>
                                </div>
                                <div className="space-y-3">
                                    {(conversations[selectedTicket.id]?.notes || []).map(note => (
                                        <div key={note.id} className="bg-primary p-3 rounded-md border-l-2 border-yellow-400">
                                            <p className="text-sm text-gray-300">{note.text}</p>
                                            <p className="text-xs text-gray-500 mt-1 text-right">{note.agentName} - {note.timestamp}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* AI Assistant & Reply */}
                    {activeTab === 'Conversation' && (
                        <>
                            <div className="border border-primary rounded-lg p-3 mb-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-base font-semibold text-accent flex items-center"><SparklesIcon className="mr-2 h-5 w-5"/> Gemini AI Assistant</h3>
                                    {!isSuggesting && !suggestion && <button onClick={handleGetSuggestion} className="bg-accent/80 text-primary font-bold py-1 px-3 rounded text-sm hover:bg-accent">Suggest Reply</button>}
                                </div>
                                {isSuggesting && <div className="flex items-center text-gray-400 mt-2"><Spinner className="mr-2"/>Generating...</div>}
                                {suggestion && (
                                    <div className="mt-2 bg-primary p-3 rounded-md">
                                        <p className="text-gray-300 text-sm italic whitespace-pre-wrap">{suggestion}</p>
                                        <div className="flex justify-end space-x-2 mt-2"><button onClick={() => setSuggestion('')} className="text-xs text-gray-400 hover:underline">Dismiss</button><button onClick={useSuggestion} className="text-xs bg-accent/20 text-accent font-bold py-1 px-2 rounded hover:bg-accent/40">Use this reply</button></div>
                                    </div>
                                )}
                            </div>
                            <div className="flex space-x-3">
                                <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply to the client..." rows={3} className="flex-1 bg-primary p-2 rounded border border-primary-light focus:ring-accent focus:border-accent"></textarea>
                                <button onClick={handleSendReply} className="bg-accent text-primary font-bold px-6 rounded hover:opacity-90 self-end">Send</button>
                            </div>
                        </>
                    )}
                </Card>
                ) : (
                    <Card className="h-full flex items-center justify-center text-gray-500">Select a ticket to view the conversation.</Card>
                )}
            </div>
             {isForwarding && selectedTicket && <ForwardModal ticket={selectedTicket} onClose={() => setIsForwarding(false)} onForward={handleForward} />}
        </div>
    );
};

export default SupportManagement;
