import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUsers } from '../services/api';

export default function GetUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();
                setUsers(response.data);
            } catch (error) {
                console.error('Error:', error)
            }
        };

        fetchUsers();
    }, []);

    return (
        <ul>
            <div className='user_list_div_component'>
                {users.map(user => (
                    <li key={user.id} className='user_list_component'>
                        <p className='UserId'>{user.id}</p>
                        {user.profile_picture && (
                            <img src={user.profile_picture} alt="Profile" className="user_pp_component" />
                        )}
                        <p className='user_username_component'>{user.username}</p>
                    </li>
                ))}
            </div>
        </ul>
    );
}
