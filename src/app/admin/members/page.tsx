'use client';
import React, { useState, useEffect } from 'react';

type Member = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  joinDate: string;
  eventsAttended: number;
  status: string;
};

const MemberAdminPage = () => {
  const [members, setMembers] = useState([
    { id: 1, name: "Piyush Mehta", email: "piyush@example.com", role: "Organizer", department: "Computer Science", joinDate: "2024-01-15", eventsAttended: 5, status: "Active" },
    { id: 2, name: "Ananya Sharma", email: "ananya@example.com", role: "Volunteer", department: "Electronics", joinDate: "2024-02-20", eventsAttended: 3, status: "Active" },
  ]);

  const [newMember, setNewMember] = useState({ 
    name: "", 
    email: "", 
    role: "Member", 
    department: "", 
    joinDate: getCurrentDate(),
    eventsAttended: 0,
    status: "Active"
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Member>>({});
  const [notification, setNotification] = useState<Notification | null>(null);

  // Get current date in YYYY-MM-DD format
  function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Handle input change for new member form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewMember({ ...newMember, [e.target.name]: e.target.value });
  };

  // Handle input change for edit form
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  // Add new member
  const addMember = () => {
    if (newMember.name && newMember.email && newMember.department) {
      const newId = members.length ? members[members.length - 1].id + 1 : 1;
      const memberToAdd = { id: newId, ...newMember };
      setMembers([...members, memberToAdd]);
      setNewMember({ 
        name: "", 
        email: "", 
        role: "Member", 
        department: "", 
        joinDate: getCurrentDate(),
        eventsAttended: 0,
        status: "Active"
      });
      showNotification("Member added successfully!");
    } else {
      showNotification("Please fill all required fields!", "error");
    }
  };

  // Remove member
  const removeMember = (id: number) => {
    setMembers(members.filter(member => member.id !== id));
    setSelectedMembers(selectedMembers.filter(memberId => memberId !== id));
    showNotification("Member removed successfully!");
  };

  // Bulk remove selected members
  const removeSelectedMembers = () => {
    if (selectedMembers.length === 0) {
      showNotification("No members selected!", "error");
      return;
    }
    setMembers(members.filter(member => !selectedMembers.includes(member.id)));
    setSelectedMembers([]);
    showNotification(`${selectedMembers.length} members removed successfully!`);
  };

  // Handle checkbox selection
  const handleSelectMember = (id: number) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(memberId => memberId !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  // Select all members
  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(member => member.id));
    }
  };

  // Start editing a member
  const startEditing = (member: Member) => {
    setIsEditing(member.id);
    setEditFormData({ ...member });
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(null);
    setEditFormData({});
  };

  // Save edited member
  const saveEdit = () => {
    if (editFormData.name && editFormData.email && editFormData.department) {
      setMembers(members.map(member => 
        member.id === isEditing ? { ...member, ...editFormData } : member
      ));
      setIsEditing(null);
      setEditFormData({});
      showNotification("Member updated successfully!");
    } else {
      showNotification("Please fill all required fields!", "error");
    }
  };

  // Change member status
  const changeStatus = (id: number, newStatus: string) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, status: newStatus } : member
    ));
    showNotification(`Member status changed to ${newStatus}!`);
  };

  // Show notification
  interface Notification {
    message: string;
    type: "success" | "error";
  }

  const showNotification = (message: string, type: "success" | "error" = "success"): void => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Sort members
  const handleSort = (field: keyof Member) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Import members from CSV
  interface CSVMember {
      id: number;
      name: string;
      email: string;
      role: string;
      department: string;
      joinDate: string;
      eventsAttended: number;
      status: string;
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        const newMembers: CSVMember[] = [];
        
        // Skip header row
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === '') continue;
          
          const values = lines[i].split(',');
          const newId = members.length + newMembers.length + 1;
          
          newMembers.push({
            id: newId,
            name: values[0]?.trim() || "",
            email: values[1]?.trim() || "",
            role: values[2]?.trim() || "Member",
            department: values[3]?.trim() || "",
            joinDate: values[4]?.trim() || getCurrentDate(),
            eventsAttended: parseInt(values[5]?.trim() || "0"),
            status: values[6]?.trim() || "Active"
          });
        }
        
        setMembers([...members, ...newMembers]);
        showNotification(`${newMembers.length} members imported successfully!`);
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  // Export members to CSV
  const exportToCsv = () => {
    const header = "Name,Email,Role,Department,Join Date,Events Attended,Status\n";
    const csv = members.map(member => 
      `${member.name},${member.email},${member.role},${member.department},${member.joinDate},${member.eventsAttended},${member.status}`
    ).join('\n');
    
    const blob = new Blob([header + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'college_event_members.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification("Members exported successfully!");
  };

  // Filter members based on search and filter criteria
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "All" || member.role === filterRole;
    const matchesDepartment = filterDepartment === "All" || member.department === filterDepartment;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

  // Sort filtered members
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (a[sortField as keyof Member] < b[sortField as keyof Member]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField as keyof Member] > b[sortField as keyof Member]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Get unique departments for filter
  const departments = ["All", ...new Set(members.map(member => member.department).filter(Boolean))];
  
  // Get unique roles for filter
  const roles = ["All", ...new Set(members.map(member => member.role))];

  return (
    <div className=" mx-auto p-6 w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold text-center mb-6">Event System Member Management</h1>
      
      {/* Notification */}
      {notification && (
        <div className={`mb-4 p-3 rounded-lg text-white ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {notification.message}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <input 
            type="text" 
            placeholder="Search by name, email..." 
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-gray-50 dark:bg-gray-600 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select 
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-gray-50 dark:bg-gray-600 dark:text-white"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <select 
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-gray-50 dark:bg-gray-600 dark:text-white"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end space-x-2">
          <button 
            className="bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition flex-1"
            onClick={exportToCsv}
          >
            Export CSV
          </button>
          <label className="bg-teal-500 text-white px-3 py-2 rounded-lg hover:bg-teal-600 transition cursor-pointer flex-1 text-center">
            Import CSV
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleImport}
            />
          </label>
        </div>
      </div>

      {/* Member List */}
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md mb-6 overflow-x-auto">
        <div className="flex justify-between mb-3">
          <h2 className="text-xl font-semibold">Registered Members ({filteredMembers.length})</h2>
          {selectedMembers.length > 0 && (
            <button 
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
              onClick={removeSelectedMembers}
            >
              Remove Selected ({selectedMembers.length})
            </button>
          )}
        </div>
        {sortedMembers.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-600">
              <tr>
                <th className="px-4 py-2">
                  <input 
                    type="checkbox" 
                    checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4"
                  />
                </th>
                <th 
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort('role')}
                >
                  Role {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort('department')}
                >
                  Department {sortField === 'department' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort('joinDate')}
                >
                  Join Date {sortField === 'joinDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort('eventsAttended')}
                >
                  Events {sortField === 'eventsAttended' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {sortedMembers.map(member => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-4 py-2">
                    <input 
                      type="checkbox" 
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => handleSelectMember(member.id)}
                      className="h-4 w-4"
                    />
                  </td>
                  {isEditing === member.id ? (
                    <>
                      <td className="px-4 py-2">
                        <input 
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditChange}
                          className="border border-gray-300 dark:border-gray-600 p-1 rounded w-full bg-gray-50 dark:bg-gray-600 dark:text-white"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          type="email"
                          name="email"
                          value={editFormData.email}
                          onChange={handleEditChange}
                          className="border border-gray-300 dark:border-gray-600 p-1 rounded w-full bg-gray-50 dark:bg-gray-600 dark:text-white"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          name="role"
                          value={editFormData.role}
                          onChange={handleEditChange}
                          className="border border-gray-300 dark:border-gray-600 p-1 rounded w-full bg-gray-50 dark:bg-gray-600 dark:text-white"
                        >
                          <option value="Member">Member</option>
                          <option value="Organizer">Organizer</option>
                          <option value="Volunteer">Volunteer</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          type="text"
                          name="department"
                          value={editFormData.department}
                          onChange={handleEditChange}
                          className="border border-gray-300 dark:border-gray-600 p-1 rounded w-full bg-gray-50 dark:bg-gray-600 dark:text-white"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          type="date"
                          name="joinDate"
                          value={editFormData.joinDate}
                          onChange={handleEditChange}
                          className="border border-gray-300 dark:border-gray-600 p-1 rounded w-full bg-gray-50 dark:bg-gray-600 dark:text-white"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          type="number"
                          name="eventsAttended"
                          value={editFormData.eventsAttended}
                          onChange={handleEditChange}
                          className="border border-gray-300 dark:border-gray-600 p-1 rounded w-full bg-gray-50 dark:bg-gray-600 dark:text-white"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          name="status"
                          value={editFormData.status}
                          onChange={handleEditChange}
                          className="border border-gray-300 dark:border-gray-600 p-1 rounded w-full bg-gray-50 dark:bg-gray-600 dark:text-white"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 space-x-1">
                        <button 
                          className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600 transition"
                          onClick={saveEdit}
                        >
                          Save
                        </button>
                        <button 
                          className="bg-gray-500 text-white px-2 py-1 rounded text-sm hover:bg-gray-600 transition"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2">{member.name}</td>
                      <td className="px-4 py-2">{member.email}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          member.role === 'Admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                          member.role === 'Organizer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          member.role === 'Volunteer' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-4 py-2">{member.department}</td>
                      <td className="px-4 py-2">{member.joinDate}</td>
                      <td className="px-4 py-2">{member.eventsAttended}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          member.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          member.status === 'Inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 space-x-1">
                        <button 
                          className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition"
                          onClick={() => startEditing(member)}
                        >
                          Edit
                        </button>
                        <button 
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition"
                          onClick={() => removeMember(member.id)}
                        >
                          Remove
                        </button>
                        <button 
                          className={`${member.status === 'Active' ? 'bg-red-500' : 'bg-green-500'} text-white px-2 py-1 rounded text-xs hover:opacity-80 transition`}
                          onClick={() => changeStatus(member.id, member.status === 'Active' ? 'Inactive' : 'Active')}
                        >
                          {member.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No members found matching your criteria.</p>
        )}
      </div>

      {/* Add Member Form */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Add New Member</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input 
              type="text" 
              name="name"
              placeholder="Enter Name" 
              value={newMember.name} 
              onChange={handleChange} 
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input 
              type="email" 
              name="email"
              placeholder="Enter Email" 
              value={newMember.email} 
              onChange={handleChange} 
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={newMember.role}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-600 dark:text-white"
            >
              <option value="Member">Member</option>
              <option value="Organizer">Organizer</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department *</label>
            <input 
              type="text" 
              name="department"
              placeholder="Enter Department" 
              value={newMember.department} 
              onChange={handleChange} 
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Join Date</label>
            <input 
              type="date" 
              name="joinDate"
              value={newMember.joinDate} 
              onChange={handleChange} 
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Events Attended</label>
            <input 
              type="number" 
              name="eventsAttended"
              placeholder="0" 
              value={newMember.eventsAttended} 
              onChange={handleChange} 
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-600 dark:text-white"
            />
          </div>
        </div>
        <button 
          className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-600 transition"
          onClick={addMember}
        >
          Add Member
        </button>
      </div>
    </div>
  );
};

export default MemberAdminPage;