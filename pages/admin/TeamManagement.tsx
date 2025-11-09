
import React, { useState } from 'react';
import Card from '../../components/common/Card';

enum AdminTeamRole {
    SUPER_ADMIN = 'Super Admin',
    SUPPORT_LEAD = 'Support Lead',
    COMPLIANCE_OFFICER = 'Compliance Officer',
    DEVELOPER = 'Developer',
}

interface AdminTeamMember {
    id: number;
    name: string;
    email: string;
    role: AdminTeamRole;
}

const mockAdminTeam: AdminTeamMember[] = [
    { id: 1, name: 'Super Admin', email: 'admin@xeloo.com', role: AdminTeamRole.SUPER_ADMIN },
    { id: 2, name: 'Support Lead', email: 'support.lead@xeloo.com', role: AdminTeamRole.SUPPORT_LEAD },
    { id: 3, name: 'Compliance Officer', email: 'compliance@xeloo.com', role: AdminTeamRole.COMPLIANCE_OFFICER },
];


const AdminTeamManagement: React.FC = () => {
    const [team, setTeam] = useState(mockAdminTeam);

    const handleRoleChange = (memberId: number, newRole: AdminTeamRole) => {
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
                    <h2 className="text-xl font-bold mb-4">Admin Team Members</h2>
                    <p className="text-gray-400 mb-6">Manage roles and permissions for your internal admin team.</p>
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
                                {team.map(member => (
                                    <tr key={member.id} className="bg-primary-light border-b border-primary">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{member.name}</div>
                                            <div className="text-xs">{member.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                             <select
                                                value={member.role}
                                                onChange={(e) => handleRoleChange(member.id, e.target.value as AdminTeamRole)}
                                                className="bg-primary border border-primary-light rounded-md py-1 px-2 text-xs text-accent focus:outline-none focus:ring-accent focus:border-accent"
                                            >
                                                {Object.values(AdminTeamRole).map(role => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="font-medium text-red-400 hover:underline">Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
             <div className="lg:col-span-1">
                <Card>
                    <h2 className="text-xl font-bold mb-4">Invite New Admin</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-400">Email Address</label>
                            <input type="email" required placeholder="admin@example.com" className="w-full bg-primary p-2 rounded border border-primary-light" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Role</label>
                             <select className="w-full bg-primary p-2 rounded border border-primary-light">
                                {Object.values(AdminTeamRole).map(role => (
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

export default AdminTeamManagement;
