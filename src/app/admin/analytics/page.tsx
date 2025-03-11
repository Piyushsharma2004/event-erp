'use client'
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function Page() {
  // Events state with additional fields for analytics
  const [events, setEvents] = useState([
    { id: 1, title: "Garba Night", date: "2025-03-15", description: "Traditional dance night.", status: "Approved", budget: 2500, attendees: 350, category: "Cultural", venue: "College Auditorium", organizer: "Cultural Committee" },
    { id: 2, title: "MakerCarnival", date: "2025-04-20", description: "Tech and innovation carnival.", status: "Pending", budget: 3800, attendees: 420, category: "Technical", venue: "Main Campus", organizer: "Tech Club" },
    { id: 3, title: "Career Fair", date: "2025-03-25", description: "Annual placement and internship fair.", status: "Approved", budget: 5000, attendees: 600, category: "Career", venue: "College Gymnasium", organizer: "Placement Cell" },
  ]);

  const [newEvent, setNewEvent] = useState({ 
    title: "", 
    date: "", 
    description: "", 
    status: "Pending", 
    budget: "", 
    attendees: "", 
    category: "", 
    venue: "",
    organizer: ""
  });

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [isAnalyticsView, setIsAnalyticsView] = useState(false);
  const [budgetUtilization, setBudgetUtilization] = useState(0);
  const [activeTab, setActiveTab] = useState("events");

  // Categories for dropdown
  const categories = ["Cultural", "Technical", "Sports", "Academic", "Career", "Workshop", "Other"];
  const venues = ["College Auditorium", "Main Campus", "College Gymnasium", "Seminar Hall", "Classroom Block", "Sports Ground", "Other"];
  const statuses = ["Pending", "Approved", "Completed", "Cancelled"];

  // Calculate budget utilization
  useEffect(() => {
    const approvedAndCompletedEvents = events.filter(event => 
      event.status === "Approved" || event.status === "Completed"
    );
    const totalBudget = approvedAndCompletedEvents.reduce((total, event) => total + (Number(event.budget) || 0), 0);
    setBudgetUtilization(totalBudget);
  }, [events]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.name === "budget" || e.target.name === "attendees" 
      ? Number(e.target.value) 
      : e.target.value;
    
    if (editingEventId) {
      setEvents(events.map(event => 
        event.id === editingEventId 
          ? { ...event, [e.target.name]: value } 
          : event
      ));
    } else {
      setNewEvent({ ...newEvent, [e.target.name]: value });
    }
  };

  // Add a new event
  const addEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.description) {
      const newId = events.length ? Math.max(...events.map(e => e.id)) + 1 : 1;
      setEvents([...events, { id: newId, ...newEvent, budget: Number(newEvent.budget), attendees: Number(newEvent.attendees) }]);
      setNewEvent({ 
        title: "", 
        date: "", 
        description: "", 
        status: "Pending", 
        budget: "", 
        attendees: "",
        category: "",
        venue: "",
        organizer: ""
      });
    }
  };

  // Remove an event
  const removeEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
  };

  // Edit an event
  const startEditingEvent = (event: { id: number; title: string; date: string; description: string; status: string; budget: number; attendees: number; category: string; venue: string; organizer: string }) => {
    setEditingEventId(event.id);
  };

  // Save edited event
  const saveEditedEvent = () => {
    setEditingEventId(null);
  };

  // Cancel editing
  const cancelEditingEvent = () => {
    setEditingEventId(null);
  };

  // Update event status
  const updateEventStatus = (id: number, newStatus: string) => {
    setEvents(events.map(event => 
      event.id === id 
        ? { ...event, status: newStatus } 
        : event
    ));
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesStatus = filterStatus === "All" || event.status === filterStatus;
    const matchesCategory = filterCategory === "All" || event.category === filterCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Analytics data
  const categoryData = categories.map(category => ({
    name: category,
    count: events.filter(event => event.category === category).length
  })).filter(item => item.count > 0);

  const statusData = statuses.map(status => ({
    name: status,
    count: events.filter(event => event.status === status).length
  }));

  const attendeeData = events.map(event => ({
    name: event.title,
    attendees: event.attendees || 0
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6B6B', '#4BC0C0'];

  return (
    <div className="text-center w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-6">
      <h1 className="text-5xl font-bold mb-6">Analytics Admin Dashboard</h1>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-6">
        <button 
          className={`px-6 py-3 mx-2 rounded-lg transition ${activeTab === 'events' ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
          onClick={() => setActiveTab('events')}
        >
          Event Management
        </button>
        <button 
          className={`px-6 py-3 mx-2 ml-2 rounded-lg transition ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics Dashboard
        </button>
        <button 
          className={`px-6 py-3 mx-2 ml-2 rounded-lg transition ${activeTab === 'reports' ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports & Exports
        </button>
      </div>

      {activeTab === 'events' && (
        <>
          {/* Filters and Search */}
          <div className="flex flex-wrap justify-between items-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="mr-2">Status:</label>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-600 dark:text-white"
                >
                  <option value="All">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="mr-2">Category:</label>
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-600 dark:text-white"
                >
                  <option value="All">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex-grow mx-4">
              <input 
                type="text" 
                placeholder="Search events..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-gray-50 dark:bg-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Events List */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">Event Management</h2>
            {filteredEvents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto bg-white dark:bg-gray-700 rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-600">
                      <th className="py-2 px-4 text-left">Event</th>
                      <th className="py-2 px-4 text-left">Date</th>
                      <th className="py-2 px-4 text-left">Category</th>
                      <th className="py-2 px-4 text-left">Venue</th>
                      <th className="py-2 px-4 text-left">Budget</th>
                      <th className="py-2 px-4 text-left">Attendees</th>
                      <th className="py-2 px-4 text-left">Status</th>
                      <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map(event => (
                      <tr key={event.id} className="border-t border-gray-200 dark:border-gray-600">
                        <td className="py-2 px-4">
                          {editingEventId === event.id ? (
                            <input 
                              type="text" 
                              name="title"
                              value={event.title} 
                              onChange={handleChange} 
                              className="border p-1 w-full dark:bg-gray-600 dark:text-white"
                            />
                          ) : (
                            <div>
                              <div className="font-medium">{event.title}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{event.description}</div>
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {editingEventId === event.id ? (
                            <input 
                              type="date" 
                              name="date"
                              value={event.date} 
                              onChange={handleChange} 
                              className="border p-1 w-full dark:bg-gray-600 dark:text-white"
                            />
                          ) : (
                            event.date
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {editingEventId === event.id ? (
                            <select 
                              name="category"
                              value={event.category} 
                              onChange={handleChange} 
                              className="border p-1 w-full dark:bg-gray-600 dark:text-white"
                            >
                              {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          ) : (
                            event.category
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {editingEventId === event.id ? (
                            <select 
                              name="venue"
                              value={event.venue} 
                              onChange={handleChange} 
                              className="border p-1 w-full dark:bg-gray-600 dark:text-white"
                            >
                              {venues.map(venue => (
                                <option key={venue} value={venue}>{venue}</option>
                              ))}
                            </select>
                          ) : (
                            event.venue
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {editingEventId === event.id ? (
                            <input 
                              type="number" 
                              name="budget"
                              value={event.budget} 
                              onChange={handleChange} 
                              className="border p-1 w-full dark:bg-gray-600 dark:text-white"
                            />
                          ) : (
                            `$${event.budget || 0}`
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {editingEventId === event.id ? (
                            <input 
                              type="number" 
                              name="attendees"
                              value={event.attendees} 
                              onChange={handleChange} 
                              className="border p-1 w-full dark:bg-gray-600 dark:text-white"
                            />
                          ) : (
                            event.attendees || '-'
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {editingEventId === event.id ? (
                            <select 
                              name="status"
                              value={event.status} 
                              onChange={handleChange} 
                              className="border p-1 w-full dark:bg-gray-600 dark:text-white"
                            >
                              {statuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              event.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              event.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              event.status === 'Completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {event.status}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {editingEventId === event.id ? (
                            <div className="flex space-x-2">
                              <button 
                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition text-sm"
                                onClick={saveEditedEvent}
                              >
                                Save
                              </button>
                              <button 
                                className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition text-sm"
                                onClick={cancelEditingEvent}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col space-y-2">
                              <button 
                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition text-sm"
                                onClick={() => startEditingEvent(event)}
                              >
                                Edit
                              </button>
                              <button 
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition text-sm"
                                onClick={() => removeEvent(event.id)}
                              >
                                Remove
                              </button>
                              {event.status === 'Pending' && (
                                <button 
                                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition text-sm"
                                  onClick={() => updateEventStatus(event.id, 'Approved')}
                                >
                                  Approve
                                </button>
                              )}
                              {event.status === 'Approved' && (
                                <button 
                                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition text-sm"
                                  onClick={() => updateEventStatus(event.id, 'Completed')}
                                >
                                  Mark Complete
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No events found matching your criteria.</p>
            )}
          </div>

          {/* Add Event Form */}
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add New Event</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                name="title"
                placeholder="Event Title" 
                value={newEvent.title} 
                onChange={handleChange} 
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input 
                type="date" 
                name="date"
                value={newEvent.date} 
                onChange={handleChange} 
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <select
                name="category"
                value={newEvent.category}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                name="venue"
                value={newEvent.venue}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              >
                <option value="">Select Venue</option>
                {venues.map(venue => (
                  <option key={venue} value={venue}>{venue}</option>
                ))}
              </select>
              <input 
                type="number" 
                name="budget"
                placeholder="Budget ($)" 
                value={newEvent.budget} 
                onChange={handleChange} 
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input 
                type="text" 
                name="organizer"
                placeholder="Organizing Committee/Club" 
                value={newEvent.organizer} 
                onChange={handleChange} 
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <textarea 
                name="description" 
                placeholder="Event Description" 
                value={newEvent.description} 
                onChange={handleChange} 
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-gray-50 dark:bg-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 md:col-span-2"
                rows={3}
              />
            </div>
            <button 
              className="bg-blue-500 text-white px-6 py-3 rounded-lg mt-4 w-full hover:bg-blue-600 transition"
              onClick={addEvent}
            >
              Add Event
            </button>
          </div>
        </>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-8">Analytics Dashboard</h2>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
              <h3 className="text-xl mb-2">Total Events</h3>
              <p className="text-3xl font-bold">{events.length}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow">
              <h3 className="text-xl mb-2">Upcoming Events</h3>
              <p className="text-3xl font-bold">
                {events.filter(e => new Date(e.date) > new Date() && e.status !== 'Cancelled').length}
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow">
              <h3 className="text-xl mb-2">Budget Utilization</h3>
              <p className="text-3xl font-bold">${budgetUtilization}</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow">
              <h3 className="text-xl mb-2">Total Attendees</h3>
              <p className="text-3xl font-bold">
                {events.reduce((sum, event) => sum + (event.attendees || 0), 0)}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Events by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Event Status Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statusData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow md:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Attendees by Event</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={attendeeData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attendees" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-6">Reports & Exports</h2>
          
          {/* Report Generation Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Generate Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
                <h4 className="text-lg font-medium mb-2">Event Summary Report</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Complete overview of all events with status and key metrics.</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full">Generate PDF</button>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
                <h4 className="text-lg font-medium mb-2">Budget Analysis Report</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Detailed breakdown of budget allocation and utilization.</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full">Generate PDF</button>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
                <h4 className="text-lg font-medium mb-2">Attendance & Engagement</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Analysis of student participation across different event types.</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full">Generate PDF</button>
              </div>
            </div>
          </div>
          
          {/* Export Data Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Export Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="text-lg font-medium mb-2">Export as Excel</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Download complete event data in Microsoft Excel format.</p>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                  Export to Excel
                </button>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="text-lg font-medium mb-2">Export as CSV</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Download event data in CSV format for compatibility.</p>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
                  Export to CSV
                </button>
              </div>
            </div>
          </div>
          
          {/* Scheduled Reports */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Scheduled Reports</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-medium mb-2">Set up automated reports</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Configure reports to be automatically generated and emailed.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-600 dark:text-white">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                  Schedule Report
                </button>
              </div>
            </div>
          </div>
       
      )}
    </div>
  );
}

export default Page;