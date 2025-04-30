import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FiUsers, FiPlus, FiTrash2, FiEdit, 
    FiSearch, FiLoader, FiUserX, FiAlertCircle 
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_BASE_URL from '../config/api';

function Home() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [editUserName, setEditUserName] = useState('');
    const [editUserEmail, setEditUserEmail] = useState('');
    const [editUserPassword, setEditUserPassword] = useState('');
    const [editingUserId, setEditingUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        fetch(`${API_BASE_URL}/fetch-details`, {
            method: 'GET'
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data, "Data Fetched Successfully");
            setData(data.data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            setIsLoading(false);
            setError('Failed to load user data. Please try again later.');
        });
    }, []);

    const deleteUser = (id, name) => {
        console.log('Deleting the user with id:', id);
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            axios.post(`${API_BASE_URL}/delete-user`, {id})
            .then((res) => {
                if (res.data.message === 'User Deleted Successfully') {
                    setData(prevData => prevData.filter(user => user._id !== id));
                    toast.success(`${name} deleted successfully`);
                } else {
                    toast.error('Failed to delete user');
                }
            })
            .catch(error => {
                console.error("Error deleting user:", error);
                alert("An error occurred while deleting the user");
            });
        }
    }
    
    const handleLogout = () => {
        navigate('/');
    }

    const handleEditUser = (id, name, email) => {
        setEditingUserId(id);
        setEditUserName(name);
        setEditUserEmail(email);
        setEditUserPassword(''); // Reset password field when editing
    }

    const filteredData = data.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = () => {
        // Create update object with required fields
        const updatedData = {
            name: editUserName,
            email: editUserEmail
        };
        
        // Only include password if it was provided
        if (editUserPassword) {
            updatedData.password = editUserPassword;
        }
        
        axios.post(`${API_BASE_URL}/update-user`, { id: editingUserId, ...updatedData })
        .then(response => {
            if(response.data.message === 'updated') {
                toast.success('User updated successfully');
                // Update the local state to reflect changes
                setData(prevData => prevData.map(user => 
                    user._id === editingUserId ? { ...user, ...updatedData } : user
                ));
                // Reset edit mode
                setEditingUserId(null);
                setEditUserName('');
                setEditUserEmail('');
                setEditUserPassword('');
            }
            else {
                toast.error('Failed to update user');
            }
        })
        .catch(error => {
            console.error("Error updating user:", error);
            toast.error('An error occurred while updating the user');
        });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 w-full"></div>
            
            <header className="bg-white shadow-sm py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="inline-flex justify-center items-center w-10 h-10 rounded-full bg-blue-100 mr-3">
                            <FiUsers className="text-blue-600 text-xl" />
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800">
                            User Management
                        </h1>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {error && (
                    <div className="mb-4 p-3 flex items-center gap-2 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                        <FiAlertCircle className="text-red-500 flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search users..." 
                                className="pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {isLoading ? (
                        <div className="flex justify-center items-center p-10">
                            <div className="flex items-center gap-2 text-gray-600">
                                <FiLoader className="animate-spin h-6 w-6" />
                                <span>Loading users...</span>
                            </div>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="p-10 text-center">
                            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <FiUserX className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="mt-3 text-sm text-gray-500">
                                {searchTerm ? 'No users match your search' : 'No users found'}
                            </p>
                            <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 mx-auto">
                                <FiPlus className="text-white" />
                                Add your first user
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        <th className="px-6 py-3">ID</th>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Password</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredData.map((item, index) => (
                                        <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {item._id ? item._id.slice(-5) : `User ${index + 1}`}
                                            </td>
                                            
                                            {editingUserId === item._id ? (
                                                <>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input 
                                                            type="text" 
                                                            className="border rounded px-2 py-1 w-full" 
                                                            value={editUserName}
                                                            onChange={(e) => setEditUserName(e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input 
                                                            type="email" 
                                                            className="border rounded px-2 py-1 w-full" 
                                                            value={editUserEmail}
                                                            onChange={(e) => setEditUserEmail(e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input 
                                                            type="password" 
                                                            className="border rounded px-2 py-1 w-full" 
                                                            placeholder="New password (optional)"
                                                            value={editUserPassword}
                                                            onChange={(e) => setEditUserPassword(e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex space-x-2">
                                                            <button 
                                                                className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded transition-colors duration-200 flex items-center"
                                                                onClick={handleSubmit}
                                                            >
                                                                Save
                                                            </button>
                                                            <button 
                                                                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded transition-colors duration-200 flex items-center"
                                                                onClick={() => setEditingUserId(null)}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{item.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{item.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className="bg-gray-100 px-3 py-1 rounded-md text-gray-600">********</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex space-x-2">
                                                            <button 
                                                                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded transition-colors duration-200 flex items-center"
                                                                onClick={() => handleEditUser(item._id, item.name, item.email)}
                                                            >
                                                                <FiEdit className="h-3.5 w-3.5 mr-1" />
                                                                Edit
                                                            </button>
                                                            <button 
                                                                className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded transition-colors duration-200 flex items-center"
                                                                onClick={() => deleteUser(item._id, item.name)}
                                                            >
                                                                <FiTrash2 className="h-3.5 w-3.5 mr-1" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    

                    <div className="px-6 py-3 bg-gray-50 text-center text-xs text-gray-500">
                        Showing {filteredData.length} users
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;