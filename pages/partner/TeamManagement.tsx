
import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import { UserSubRole } from '../../types';

interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: UserSubRole;
}

const mockTeam: TeamMember[] = [
    { id: 1, name: 'Partner Admin', email: 'admin@globalbank.com', role: UserSubRole.ADMINISTRATOR },
    { id: 2, name: 'Auditor', email: 'audit@globalbank.com', role: UserSubRole.AUDITOR },
    { id: 3, name: 'Analyst', email: 'analyst@globalbank.com', role: UserSubRole.STANDARD },
];

interface TeamManagementProps {
    searchQuery: string;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ searchQuery }) => {
    const [team, setTeam] = useState(mockTeam);

    const filteredTeam = useMemo(() => {
        if (!searchQuery) return team;
        const lowercasedQuery = searchQuery.toLowerCase();
        return team.filter(member => 
            member.name.toLowerCase().includes(lowercasedQuery) ||
            member.email.toLowerCase().includes(lowercasedQuery)
        );
    }, [team, searchQuery]);

    const handleRoleChange = (memberId: number, newRole: UserSubRole) => {
        setTeam(currentTeam => 
            currentTeam.map(member => 
                member.id === memberId ? { ...member, role: newRole } : member
            )
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card>
                    <h2 className="text-xl font-bold mb-4">Team Members</h2>
                    <p className="text-gray-400 mb-6">Manage roles and permissions for your team.</p>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-400 uppercase bg-primary">
                                <tr>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTeam.map(member => (
                                    <tr key={member.id} className="bg-primary-light border-b border-primary">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{member.name}</div>
                                            <div className="text-xs">{member.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                             <select 
                                                value={member.role} 
                                                onChange={(e) => handleRoleChange(member.id, e.target.value as UserSubRole)}
                                                className="bg-primary border border-primary-light rounded-md py-1 px-2 text-xs text-accent focus:outline-none focus:ring-accent focus:border-accent"
                                            >
                                                {Object.values(UserSubRole).map(role => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="font-medium text-red-400 hover:underline">Remove</button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredTeam.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="text-center py-8 text-gray-400">No team members found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
             <div className="lg:col-span-1">
                <Card>
                    <h2 className="text-xl font-bold mb-4">Invite New Member</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-400">Email Address</label>
                            <input type="email" required placeholder="member@example.com" className="w-full bg-primary p-2 rounded border border-primary-light" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Role</label>
                             <select className="w-full bg-primary p-2 rounded border border-primary-light">
                                {Object.values(UserSubRole).map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">Send Invite</button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default TeamManagement;
