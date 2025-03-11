'use client';
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Search, Filter, Upload, AlertCircle, CheckCircle, Download, PieChart, Trash2, Edit2, X } from "lucide-react";

function SponsorsAdminPage() {
  const [sponsors, setSponsors] = useState([
    { id: 1, name: "Tata", category: "Gold", logo: "https://via.placeholder.com/50", contribution: 250000, contactPerson: "John Doe", email: "john@tata.com", phone: "123-456-7890", events: ["Tech Fest 2025", "Annual Day"], status: "Active", dateAdded: "2025-01-15" },
    { id: 2, name: "Infosys", category: "Platinum", logo: "https://via.placeholder.com/50", contribution: 500000, contactPerson: "Jane Smith", email: "jane@infosys.com", phone: "987-654-3210", events: ["Hackathon", "Cultural Night"], status: "Active", dateAdded: "2025-02-10" },
    { id: 3, name: "Microsoft", category: "Platinum", logo: "https://via.placeholder.com/50", contribution: 450000, contactPerson: "Robert Johnson", email: "robert@microsoft.com", phone: "555-123-4567", events: ["Code Jam", "Tech Talks"], status: "Pending", dateAdded: "2025-02-28" },
  ]);
  
  const [newSponsor, setNewSponsor] = useState<NewSponsor>({
    name: "",
    category: "Gold",
    logo: "",
    contribution: "",
    contactPerson: "",
    email: "",
    phone: "",
    events: [],
    status: "Pending"
  });
  
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSponsorDetails, setActiveSponsorDetails] = useState<Sponsor | null>(null);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [collegeEvents, setCollegeEvents] = useState([
    "Tech Fest 2025", 
    "Annual Day", 
    "Hackathon", 
    "Cultural Night", 
    "Code Jam", 
    "Tech Talks", 
    "Sports Meet", 
    "Alumni Meet"
  ]);
  const [stats, setStats] = useState({
    totalSponsors: 0,
    totalContribution: 0,
    categoryBreakdown: { Gold: 0, Silver: 0, Platinum: 0 },
    statusBreakdown: { Active: 0, Pending: 0, Inactive: 0 }
  });

  // Update stats whenever sponsors change
  useEffect(() => {
    calculateStats();
  }, [sponsors]);

  const calculateStats = () => {
    const totalSponsors = sponsors.length;
    const totalContribution = sponsors.reduce((sum, sponsor) => sum + (Number(sponsor.contribution) || 0), 0);
    
    const categoryBreakdown: { Gold: number; Silver: number; Platinum: number } = { Gold: 0, Silver: 0, Platinum: 0 };
    const statusBreakdown: { Active: number; Pending: number; Inactive: number } = { Active: 0, Pending: 0, Inactive: 0 };
    
    sponsors.forEach(sponsor => {
      if (categoryBreakdown[sponsor.category as keyof typeof categoryBreakdown] !== undefined) {
        categoryBreakdown[sponsor.category as keyof typeof categoryBreakdown]++;
      }
      
      if (statusBreakdown[sponsor.status as keyof typeof statusBreakdown] !== undefined) {
        statusBreakdown[sponsor.status as keyof typeof statusBreakdown]++;
      }
    });
    
    setStats({
      totalSponsors,
      totalContribution,
      categoryBreakdown,
      statusBreakdown
    });
  };

  // Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSponsor({ ...newSponsor, [name]: value });
  };

  // Add New Sponsor
  const addSponsor = () => {
    if (newSponsor.name && newSponsor.logo && newSponsor.email) {
      const today = new Date().toISOString().split('T')[0];
      const newSponsorEntry = { 
        id: Date.now(), 
        ...newSponsor, 
        contribution: Number(newSponsor.contribution),
        dateAdded: today,
        events: selectedEvent ? [selectedEvent] : []
      };
      
      setSponsors([...sponsors, newSponsorEntry]);
      setNewSponsor({ 
        name: "", 
        category: "Gold", 
        logo: "", 
        contribution: "", 
        contactPerson: "", 
        email: "", 
        phone: "", 
        events: [], 
        status: "Pending" 
      });
      setSelectedEvent("");
      
      showNotificationMessage("Sponsor added successfully!", true);
      setIsModalOpen(false);
    } else {
      showNotificationMessage("Please fill all required fields!", false);
    }
  };

  // Edit Sponsor
  interface Sponsor {
    id: number;
    name: string;
    category: string;
    logo: string;
    contribution: number;
    contactPerson: string;
    email: string;
    phone: string;
    events: string[];
    status: string;
    dateAdded: string;
  }

  interface NewSponsor {
    name: string;
    category: string;
    logo: string;
    contribution: string;
    contactPerson: string;
    email: string;
    phone: string;
    events: string[];
    status: string;
  }

  const startEdit = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setNewSponsor({ 
      name: sponsor.name, 
      category: sponsor.category, 
      logo: sponsor.logo,
      contribution: sponsor.contribution.toString(),
      contactPerson: sponsor.contactPerson,
      email: sponsor.email,
      phone: sponsor.phone,
      events: sponsor.events,
      status: sponsor.status
    });
    setSelectedEvent(sponsor.events && sponsor.events.length > 0 ? sponsor.events[0] : "");
    setIsModalOpen(true);
  };

  const saveEdit = () => {
    const updatedSponsors = sponsors.map((s) => {
      if (editingSponsor && s.id === editingSponsor.id) {
        const updatedEvents = selectedEvent 
          ? [...(s.events || []).filter(event => event !== selectedEvent), selectedEvent]
          : s.events;
          
        return { 
          ...s, 
          ...newSponsor, 
          contribution: Number(newSponsor.contribution),
          events: updatedEvents
        };
      }
      return s;
    });
    
    setSponsors(updatedSponsors);
    setEditingSponsor(null);
    setNewSponsor({ 
      name: "", 
      category: "Gold", 
      logo: "", 
      contribution: "", 
      contactPerson: "", 
      email: "", 
      phone: "", 
      events: [], 
      status: "Pending" 
    });
    setSelectedEvent("");
    
    showNotificationMessage("Sponsor updated successfully!", true);
    setIsModalOpen(false);
  };

  // Delete Sponsor
  const deleteSponsor = (id: number) => {
    setSponsors(sponsors.filter((sponsor) => sponsor.id !== id));
    showNotificationMessage("Sponsor deleted successfully!", true);
  };

  // View Sponsor Details
  const viewSponsorDetails = (sponsor: Sponsor) => {
    setActiveSponsorDetails(sponsor);
  };

  // Filter sponsors based on search term and filters
  const filteredSponsors = sponsors.filter((sponsor) => {
    const matchesSearch = sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sponsor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sponsor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "All" || sponsor.category === filterCategory;
    const matchesStatus = filterStatus === "All" || sponsor.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Show notification
  interface NotificationMessage {
    message: string;
    success: boolean;
  }

  const showNotificationMessage = (message: string, success: boolean): void => {
    setNotificationMessage(message);
    setIsSuccess(success);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Export sponsors data as CSV
  const exportSponsorsCSV = () => {
    const headers = ["Name", "Category", "Contribution", "Contact Person", "Email", "Phone", "Status", "Date Added"];
    const csvContent = [
      headers.join(","),
      ...sponsors.map(sponsor => 
        [
          sponsor.name, 
          sponsor.category, 
          sponsor.contribution, 
          sponsor.contactPerson, 
          sponsor.email, 
          sponsor.phone, 
          sponsor.status, 
          sponsor.dateAdded
        ].join(",")
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sponsors_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotificationMessage("Sponsors data exported successfully!", true);
  };

  // Change sponsor status
  const changeStatus = (id: number, newStatus: string) => {
    setSponsors(sponsors.map(sponsor => 
      sponsor.id === id ? {...sponsor, status: newStatus} : sponsor
    ));
    
    showNotificationMessage(`Sponsor status changed to ${newStatus}!`, true);
  };

  return (
    <div className="w-full">
      <Head>
        <title>Sponsors Admin | Dashboard</title>
        <meta name="description" content="Manage event sponsors efficiently with the Sponsors Admin Dashboard." />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-gray-800 dark:text-white text-3xl font-bold">Sponsors Management</h1>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <span className="mr-2">+ New Sponsor</span>
            </button>
            <button 
              onClick={exportSponsorsCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Download size={16} className="mr-2" />
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Sponsors</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalSponsors}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Contribution</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">₹{stats.totalContribution.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Platinum Sponsors</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.categoryBreakdown.Platinum}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Gold Sponsors</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.categoryBreakdown.Gold}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search sponsors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="relative">
              <Filter size={18} className="absolute left-3 top-3 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
              >
                <option value="All">All Categories</option>
                <option value="Platinum">Platinum</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
              </select>
            </div>
            
            <div className="relative">
              <Filter size={18} className="absolute left-3 top-3 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sponsors Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-6">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sponsor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contribution</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSponsors.length > 0 ? (
                filteredSponsors.map((sponsor) => (
                  <tr key={sponsor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full" src={sponsor.logo} alt={sponsor.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{sponsor.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Added: {sponsor.dateAdded}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${sponsor.category === 'Platinum' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 
                         sponsor.category === 'Gold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                         'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {sponsor.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      ₹{parseInt(sponsor.contribution.toString() || "0").toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{sponsor.contactPerson}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{sponsor.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${sponsor.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                         sponsor.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                         'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                        {sponsor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => viewSponsorDetails(sponsor)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => startEdit(sponsor)}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteSponsor(sponsor.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No sponsors found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Sponsor Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingSponsor ? "Edit Sponsor" : "Add New Sponsor"}
                </h2>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingSponsor(null);
                    setNewSponsor({ 
                      name: "", 
                      category: "Gold", 
                      logo: "", 
                      contribution: "", 
                      contactPerson: "", 
                      email: "", 
                      phone: "", 
                      events: [], 
                      status: "Pending" 
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sponsor Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Company Name"
                    value={newSponsor.name}
                    onChange={(e) => setNewSponsor({ ...newSponsor, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={newSponsor.category}
                    onChange={(e) => setNewSponsor({ ...newSponsor, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Platinum">Platinum</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Logo URL*
                  </label>
                  <input
                    type="text"
                    name="logo"
                    placeholder="https://example.com/logo.png"
                    value={newSponsor.logo}
                    onChange={(e) => setNewSponsor({ ...newSponsor, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contribution (₹)
                  </label>
                  <input
                    type="number"
                    name="contribution"
                    placeholder="50000"
                    value={newSponsor.contribution}
                    onChange={(e) => setNewSponsor({ ...newSponsor, [e.target.name]: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    placeholder="Contact Person Name"
                    value={newSponsor.contactPerson}
                    onChange={(e) => setNewSponsor({ ...newSponsor, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="contact@example.com"
                    value={newSponsor.email}
                    onChange={(e) => setNewSponsor({ ...newSponsor, [e.target.name]: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="123-456-7890"
                    value={newSponsor.phone}
                    onChange={(e) => setNewSponsor({ ...newSponsor, status: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Associated Event
                  </label>
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Event</option>
                    {collegeEvents.map((event, index) => (
                      <option key={index} value={event}>{event}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={newSponsor.status}
                    onChange={(e) => setNewSponsor({ ...newSponsor, status: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingSponsor(null);
                    setNewSponsor({ 
                      name: "", 
                      category: "Gold", 
                      logo: "", 
                      contribution: "", 
                      contactPerson: "", 
                      email: "", 
                      phone: "", 
                      events: [], 
                      status: "Pending" 
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={editingSponsor ? saveEdit : addSponsor}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingSponsor ? "Save Changes" : "Add Sponsor"}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Sponsor Details Modal */}
        {activeSponsorDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Sponsor Details
                </h2>
                <button 
                  onClick={() => setActiveSponsorDetails(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 flex flex-col items-center mb-4 md:mb-0">
                  <img className="h-24 w-24 rounded-full mb-2" src={activeSponsorDetails.logo} alt={activeSponsorDetails.name} />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{activeSponsorDetails.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activeSponsorDetails.email}</p>
                </div>
                <div className="md:w-2/3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category
                      </label>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${activeSponsorDetails.category === 'Platinum' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 
                         activeSponsorDetails.category === 'Gold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                         'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {activeSponsorDetails.category}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contribution
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">₹{parseInt(activeSponsorDetails.contribution.toString() || "0").toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Person
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activeSponsorDetails.contactPerson}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activeSponsorDetails.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${activeSponsorDetails.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                         activeSponsorDetails.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                        {activeSponsorDetails.status}
                      </span>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Associated Events
                      </label>
                      <div className="flex space-x-2">
                        {activeSponsorDetails.events && activeSponsorDetails.events.length > 0 ? (
                          activeSponsorDetails.events.map((event, index) => (
                            <span key={index} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {event}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">No events associated yet.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
          
          {/* Notification */}
          {showNotification && (
            <div className={`fixed bottom-4 right-4 bg-${isSuccess ? 'green' : 'red'}-500 text-white px-4 py-2 rounded-lg flex items-center shadow-lg`}>
              {isSuccess ? <CheckCircle size={20} className="mr-2" /> : <AlertCircle size={20} className="mr-2" />}
              <span>{notificationMessage}</span>
            </div>
          )}
      </div>
    </div>
  );
}

export default SponsorsAdminPage;


