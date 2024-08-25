import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel: React.FC = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/api/admin/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h1>Admin Panel</h1>
            <ul>
                {users.map((user: any) => (
                    <li key={user.user_id}>{user.username} - {user.email}</li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;
