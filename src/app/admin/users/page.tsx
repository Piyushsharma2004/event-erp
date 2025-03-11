'use client';
import React, { useState, useEffect } from 'react';
import { Search, Filter, UserPlus, Trash2, Edit, Mail, Shield, Calendar, Bell } from 'lucide-react';

function Page() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Piyush Mehta', email: 'piyush@example.com', role: 'admin', department: 'Computer Science', lastActive: '2025-03-08', eventsManaged: 12, status: 'active' },
    { id: 2, name: 'Ananya Sharma', email: 'ananya@example.com', role: 'event_manager', department: 'Electronics', lastActive: '2025-03-09', eventsManaged: 8, status: 'active' },
    { id: 3, name: 'Rajiv Kumar', email: 'rajiv@example.com', role: 'user', department: 'Mechanical', lastActive: '2025-03-01', eventsManaged: 0, status: 'inactive' },
    { id: 4, name: 'Priya Singh', email: 'priya@example.com', role: 'event_manager', department: 'Civil', lastActive: '2025-03-07', eventsManaged: 5, status: 'active' },
  ]);

  const [newUser, setNewUser] = useState({ 
    name: '', 
    email: '', 
    role: 'user', 
    department: '',
    status: 'active'
  });

  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: number; name: string; email: string; role: string; department: string; lastActive: string; eventsManaged: number; status: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New event manager request from Vikram Patel', time: '10 minutes ago' },
    { id: 2, message: 'System update scheduled for tomorrow', time: '1 hour ago' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editMode) {
      setCurrentUser({ ...currentUser, [name]: value } as typeof currentUser);
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  // Add new user
  const addUser = () => {
    if (newUser.name && newUser.email) {
      const newId = users.length ? Math.max(...users.map(user => user.id)) + 1 : 1;
      const currentDate = new Date().toISOString().split('T')[0];
      
      setUsers([...users, { 
        id: newId, 
        ...newUser, 
        lastActive: currentDate,
        eventsManaged: 0
      }]);
      
      setNewUser({ name: '', email: '', role: 'user', department: '', status: 'active' }); // Reset form
      
      // Add notification
      const newNotification = {
        id: notifications.length + 1,
        message: `New user ${newUser.name} (${newUser.role}) added to the system`,
        time: 'Just now'
      };
      setNotifications([newNotification, ...notifications]);
    }
  };

  // Edit user
  const startEdit = (user: { id: number; name: string; email: string; role: string; department: string; lastActive: string; eventsManaged: number; status: string }) => {
    setEditMode(true);
    setCurrentUser(user);
  };

  // Update user
  const updateUser = () => {
    if (currentUser && currentUser.name && currentUser.email) {
      setUsers(users.map(user => user.id === currentUser.id ? currentUser : user));
      setEditMode(false);
      setCurrentUser(null);
      
      // Add notification
      const newNotification = {
        id: notifications.length + 1,
        message: `User ${currentUser.name} details updated`,
        time: 'Just now'
      };
      setNotifications([newNotification, ...notifications]);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditMode(false);
    setCurrentUser(null);
  };

  // Remove user
  const removeUser = (id: number) => {
    const userToRemove = users.find(user => user.id === id);
    setUsers(users.filter(user => user.id !== id));
    
    if (userToRemove) {
      // Add notification
      const newNotification = {
        id: notifications.length + 1,
        message: `User ${userToRemove.name} removed from the system`,
        time: 'Just now'
      };
      setNotifications([newNotification, ...notifications]);
    }
  };

  // Toggle user status
  const toggleUserStatus = (id: number) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        
        // Add notification
        const newNotification = {
          id: notifications.length + 1,
          message: `User ${user.name} status changed to ${newStatus}`,
          time: 'Just now'
        };
        setNotifications([newNotification, ...notifications]);
        
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Toggle notifications panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Send notification to user
  const sendNotification = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      alert(`Notification would be sent to ${user.name} at ${user.email}`);
      
      // Add notification
      const newNotification = {
        id: notifications.length + 1,
        message: `Notification sent to ${user.name}`,
        time: 'Just now'
      };
      setNotifications([newNotification, ...notifications]);
    }
  };

  // Role badge component
  const RoleBadge = ({ role }: { role: string }) => {
    const getBadgeClass = () => {
      switch(role) {
        case 'admin':
          return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
        case 'event_manager':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    };
    
    const getRoleDisplay = () => {
      switch(role) {
        case 'admin':
          return 'Admin';
        case 'event_manager':
          return 'Event Manager';
        default:
          return 'User';
      }
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeClass()}`}>
        {getRoleDisplay()}
      </span>
    );
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getBadgeClass = () => {
      switch(status) {
        case 'active':
          return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        default:
          return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      }
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeClass()}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Stats section
  const UserStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'active').length;
    const eventManagers = users.filter(user => user.role === 'event_manager').length;
    const admins = users.filter(user => user.role === 'admin').length;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
            <UserPlus className="text-blue-600 dark:text-blue-300" size={24} />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Users</p>
            <p className="text-2xl font-bold">{totalUsers}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 flex items-center">
          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mr-4">
            <Shield className="text-green-600 dark:text-green-300" size={24} />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Active Users</p>
            <p className="text-2xl font-bold">{activeUsers}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 flex items-center">
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mr-4">
            <Calendar className="text-purple-600 dark:text-purple-300" size={24} />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Event Managers</p>
            <p className="text-2xl font-bold">{eventManagers}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 flex items-center">
          <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full mr-4">
            <Shield className="text-amber-600 dark:text-amber-300" size={24} />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Admins</p>
            <p className="text-2xl font-bold">{admins}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen w-full">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={toggleNotifications}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full relative hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.length}
              </span>
            </button>
            
            {/* Notifications panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-20">
                <h3 className="font-semibold mb-2">Notifications</h3>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(notification => (
                    <div key={notification.id} className="py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <UserStats />
        
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={18} className="text-gray-500 dark:text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Filter size={18} className="text-gray-500 dark:text-gray-400" />
                </span>
                <select
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="event_manager">Event Manager</option>
                  <option value="user">User</option>
                </select>
              </div>
              
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Filter size={18} className="text-gray-500 dark:text-gray-400" />
                </span>
                <select
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
          <h2 className="text-xl font-semibold p-4 border-b border-gray-200 dark:border-gray-700">
            Registered Users ({filteredUsers.length})
          </h2>
          
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Department</th>
                    <th className="py-3 px-4 text-left">Role</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Last Active</th>
                    <th className="py-3 px-4 text-left">Events</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">{user.department || '-'}</td>
                      <td className="py-3 px-4"><RoleBadge role={user.role} /></td>
                      <td className="py-3 px-4"><StatusBadge status={user.status} /></td>
                      <td className="py-3 px-4">{user.lastActive}</td>
                      <td className="py-3 px-4">{user.eventsManaged}</td>
                      <td className="py-3 px-4 space-x-2">
                        <button
                          className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => startEdit(user)}
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => removeUser(user.id)}
                          title="Remove"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          className="p-1 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                          onClick={() => toggleUserStatus(user.id)}
                          title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {user.status === 'active' ? '⊘' : '✓'}
                        </button>
                        <button
                          className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          onClick={() => sendNotification(user.id)}
                          title="Send Notification"
                        >
                          <Mail size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 p-4">No users found matching your filters.</p>
          )}
        </div>

        {/* Add or Edit User Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editMode ? 'Edit User' : 'Add New User'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={editMode && currentUser ? currentUser.name : newUser.name}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={editMode && currentUser ? currentUser.email : newUser.email}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                name="role"
                value={editMode && currentUser ? currentUser.role : newUser.role}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-700 dark:text-white"
              >
                <option value="admin">Admin</option>
                <option value="event_manager">Event Manager</option>
                <option value="user">User</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <input
                type="text"
                name="department"
                placeholder="Enter Department"
                value={editMode && currentUser ? currentUser.department : newUser.department}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={editMode && currentUser ? currentUser.status : newUser.status}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-700 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {editMode ? (
              <>
                <button
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition flex-1"
                  onClick={updateUser}
                >
                  Update User
                </button>
                <button
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition flex-1 flex items-center justify-center"
                onClick={addUser}
              >
                <UserPlus size={18} className="mr-2" />
                Add User
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;