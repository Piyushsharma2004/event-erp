'use client';
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Search, Filter, Download, BarChart2, Printer, Calendar, Users, Tag, AlertTriangle } from "lucide-react";

 function TicketsAdminPage() {
  const [tickets, setTickets] = useState([
    { id: 1, event: "Garba Night", price: 500, status: "Available", quantity: 200, sold: 150, date: "2025-03-20", category: "Cultural", venue: "Main Auditorium" },
    { id: 2, event: "MakerCarnival", price: 800, status: "Sold Out", quantity: 100, sold: 100, date: "2025-04-15", category: "Technical", venue: "Innovation Hub" },
    { id: 3, event: "Tech Summit", price: 1200, status: "Available", quantity: 300, sold: 210, date: "2025-05-10", category: "Technical", venue: "Conference Hall" },
    { id: 4, event: "Cultural Festival", price: 600, status: "Limited", quantity: 400, sold: 380, date: "2025-03-25", category: "Cultural", venue: "Open Air Theater" },
  ]);
  
  const [newTicket, setNewTicket] = useState({ 
    event: "", 
    price: "", 
    status: "Available",
    quantity: "",
    sold: 0,
    date: "",
    category: "Cultural",
    venue: ""
  });
  
  const [editingTicket, setEditingTicket] = useState<{ id: number; event: string; price: number; status: string; quantity: number; sold: number; date: string; category: string; venue: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showStats, setShowStats] = useState(false);
  const [batchActionSelected, setBatchActionSelected] = useState<number[]>([]);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [sortField, setSortField] = useState<keyof typeof tickets[0]>("id");
  const [sortDirection, setSortDirection] = useState("asc");

  // Create categories from existing tickets
  const categories = ["All", ...Array.from(new Set(tickets.map(ticket => ticket.category)))];
  const statuses = ["All", "Available", "Limited", "Sold Out"];
  const venues = Array.from(new Set(tickets.map(ticket => ticket.venue)));

  // Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTicket({ ...newTicket, [name]: value });
  };

  // Update status based on quantity and sold
  useEffect(() => {
    if (newTicket.quantity && newTicket.sold) {
      const remaining = parseInt(newTicket.quantity.toString()) - parseInt(newTicket.sold.toString());
      if (remaining <= 0) {
        setNewTicket({ ...newTicket, status: "Sold Out" });
      } else if (remaining <= parseInt(newTicket.quantity) * 0.1) {
        setNewTicket({ ...newTicket, status: "Limited" });
      } else {
        setNewTicket({ ...newTicket, status: "Available" });
      }
    }
  }, [newTicket.quantity, newTicket.sold]);

  // Add New Ticket
  const addTicket = () => {
    if (newTicket.event && newTicket.price && newTicket.quantity && newTicket.date && newTicket.venue) {
      setTickets([...tickets, { id: Date.now(), ...newTicket, price: Number(newTicket.price), quantity: Number(newTicket.quantity) }]);
      setNewTicket({ 
        event: "", 
        price: "", 
        status: "Available",
        quantity: "",
        sold: 0,
        date: "",
        category: "Cultural",
        venue: ""
      });
    } else {
      alert("Please fill all required fields!");
    }
  };

  // Edit Ticket
  const startEdit = (ticket: { id: number; event: string; price: number; status: string; quantity: number; sold: number; date: string; category: string; venue: string }) => {
    setEditingTicket(ticket);
    setNewTicket({ 
      event: ticket.event, 
      price: ticket.price.toString(),
      status: ticket.status,
      quantity: ticket.quantity.toString(),
      sold: ticket.sold,
      date: ticket.date,
      category: ticket.category,
      venue: ticket.venue
    });
  };

  const saveEdit = () => {
    if (editingTicket) {
      setTickets(
        tickets.map((t) => (t.id === editingTicket.id ? { ...t, ...newTicket, id: t.id, price: Number(newTicket.price), quantity: Number(newTicket.quantity) } : t))
      );
    }
    setEditingTicket(null);
    setNewTicket({ 
      event: "", 
      price: "", 
      status: "Available",
      quantity: "",
      sold: 0,
      date: "",
      category: "Cultural",
      venue: ""
    });
  };

  // Delete Ticket
  const deleteTicket = (id: number) => {
    if (confirm("Are you sure you want to delete this ticket?")) {
      setTickets(tickets.filter((ticket) => ticket.id !== id));
    }
  };

  // Toggle selection for batch actions
  const toggleSelection = (id: number) => {
    if (batchActionSelected.includes(id)) {
      setBatchActionSelected(batchActionSelected.filter(ticketId => ticketId !== id));
    } else {
      setBatchActionSelected([...batchActionSelected, id]);
    }
  };

  // Apply batch discount
  const applyDiscountToSelected = () => {
    if (batchActionSelected.length === 0 || discountAmount <= 0) return;
    
    setTickets(tickets.map(ticket => {
      if (batchActionSelected.includes(ticket.id)) {
        const discountedPrice = Math.max(0, ticket.price - discountAmount);
        return { ...ticket, price: discountedPrice };
      }
      return ticket;
    }));
    
    setBatchActionSelected([]);
    setShowDiscountModal(false);
    setDiscountAmount(0);
  };

  // Batch delete selected tickets
  const deleteSelected = () => {
    if (batchActionSelected.length === 0) return;
    if (confirm(`Are you sure you want to delete ${batchActionSelected.length} selected tickets?`)) {
      setTickets(tickets.filter(ticket => !batchActionSelected.includes(ticket.id)));
      setBatchActionSelected([]);
    }
  };

  // Export tickets data
  const exportTickets = () => {
    const exportData = tickets.map(({ id, event, price, status, quantity, sold, date, category, venue }) => 
      `${id},${event},${price},${status},${quantity},${sold},${date},${category},${venue}`
    ).join('\n');
    
    const csvContent = `ID,Event,Price,Status,Quantity,Sold,Date,Category,Venue\n${exportData}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'tickets_export.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Sort tickets
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field as keyof typeof tickets[0]);
      setSortDirection("asc");
    }
  };

  // Apply filters
  const filteredTickets = tickets
    .filter(ticket => ticket.event.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      ticket.venue.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(ticket => filterCategory === "All" || ticket.category === filterCategory)
    .filter(ticket => filterStatus === "All" || ticket.status === filterStatus)
    .sort((a, b) => {
      if (sortField === "price" || sortField === "quantity" || sortField === "sold") {
        return sortDirection === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
      } else {
        return sortDirection === "asc" 
          ? String(a[sortField]).localeCompare(String(b[sortField])) 
          : String(b[sortField]).localeCompare(String(a[sortField]));
      }
    });

  // Calculate statistics
  const stats = {
    totalTickets: tickets.reduce((sum, t) => sum + parseInt(t.quantity.toString() || "0"), 0),
    totalSold: tickets.reduce((sum, t) => sum + parseInt(t.sold.toString() || "0"), 0),
    totalRevenue: tickets.reduce((sum, t) => sum + (parseInt(t.price.toString() || "0") * parseInt(t.sold.toString() || "0")), 0),
    avgPrice: tickets.length ? (tickets.reduce((sum, t) => sum + parseInt(t.price.toString() || "0"), 0) / tickets.length).toFixed(2) : 0,
    mostPopular: tickets.length ? tickets.reduce((prev, current) => 
      (prev.sold / prev.quantity > current.sold / current.quantity) ? prev : current
    ).event : "N/A"
  };

  // Low stock notification
  const lowStockTickets = tickets.filter(ticket => 
    ticket.status !== "Sold Out" && 
    (parseInt(ticket.quantity.toString()) - parseInt(ticket.sold.toString())) <= 10
  );

  return (
    <div className="w-full">
      <Head>
        <title>Tickets Admin | Smart College Event Management</title>
        <meta name="description" content="Comprehensive ticket management for college events" />
      </Head>

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <h1 className="text-black dark:text-white text-3xl font-bold mb-4 md:mb-0">Tickets Administration</h1>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowStats(!showStats)}
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
              >
                <BarChart2 size={18} /> {showStats ? "Hide Stats" : "Show Stats"}
              </button>
              
              <button
                onClick={exportTickets}
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600"
              >
                <Download size={18} /> Export
              </button>
              
              <button
                onClick={() => window.print()}
                className="bg-purple-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-purple-600"
              >
                <Printer size={18} /> Print
              </button>
            </div>
          </header>

          {/* Quick Stats Display */}
          {showStats && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Ticket Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                  <h3 className="text-sm text-blue-700 dark:text-blue-300">Total Tickets</h3>
                  <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{stats.totalTickets}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg">
                  <h3 className="text-sm text-green-700 dark:text-green-300">Tickets Sold</h3>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-200">{stats.totalSold}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg">
                  <h3 className="text-sm text-purple-700 dark:text-purple-300">Total Revenue</h3>
                  <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">₹{stats.totalRevenue}</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900 p-3 rounded-lg">
                  <h3 className="text-sm text-amber-700 dark:text-amber-300">Average Price</h3>
                  <p className="text-2xl font-bold text-amber-800 dark:text-amber-200">₹{stats.avgPrice}</p>
                </div>
                <div className="bg-rose-50 dark:bg-rose-900 p-3 rounded-lg">
                  <h3 className="text-sm text-rose-700 dark:text-rose-300">Most Popular</h3>
                  <p className="text-xl font-bold text-rose-800 dark:text-rose-200 truncate">{stats.mostPopular}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Low Stock Alert */}
          {lowStockTickets.length > 0 && (
            <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 p-4 mb-6 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="text-yellow-500 mr-2" size={20} />
                <div>
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Low Stock Alert!</h3>
                  <ul className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                    {lowStockTickets.map(ticket => (
                      <li key={`alert-${ticket.id}`}>
                        {ticket.event}: Only {parseInt(ticket.quantity.toString()) - parseInt(ticket.sold.toString())} tickets left
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filter Controls */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search events or venues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full p-2 border rounded-lg"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-800"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat} Events</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-800"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status === "All" ? "All Statuses" : status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Ticket Form */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editingTicket ? "Edit Ticket" : "Add New Ticket"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="text"
                name="event"
                placeholder="Event Name*"
                value={newTicket.event}
                onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                className="p-2 border rounded-lg"
                required
              />
              
              <div className="flex items-center gap-2">
                <span className="text-gray-500">₹</span>
                <input
                  type="number"
                  name="price"
                  placeholder="Ticket Price*"
                  value={newTicket.price}
                  onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              
              <select
                name="category"
                value={newTicket.category}
                onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                className="p-2 border rounded-lg dark:bg-gray-800"
              >
                {categories.filter(cat => cat !== "All").map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="Sports">Sports</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Other">Other</option>
              </select>
              
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-400" />
                <input
                  type="date"
                  name="date"
                  placeholder="Event Date*"
                  value={newTicket.date}
                  onChange={(e) => setNewTicket({ ...newTicket, [e.target.name]: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Users size={18} className="text-gray-400" />
                <input
                  type="number"
                  name="quantity"
                  placeholder="Total Quantity*"
                  value={newTicket.quantity}
                  onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              
              {editingTicket && (
                <div className="flex items-center gap-2">
                  <Tag size={18} className="text-gray-400" />
                  <input
                    type="number"
                    name="sold"
                    placeholder="Tickets Sold"
                    value={newTicket.sold}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              )}
              
              <input
                type="text"
                name="venue"
                placeholder="Venue*"
                value={newTicket.venue}
                onChange={(e) => setNewTicket({ ...newTicket, [e.target.name]: e.target.value })}
                className="p-2 border rounded-lg"
                required
              />
              
              <select
                name="status"
                value={newTicket.status}
                onChange={(e) => setNewTicket({ ...newTicket, status: e.target.value })}
                className="p-2 border rounded-lg dark:bg-gray-800"
                disabled={!!editingTicket && newTicket.quantity !== "" && newTicket.quantity !== null && newTicket.sold !== null}
              >
                <option value="Available">Available</option>
                <option value="Limited">Limited</option>
                <option value="Sold Out">Sold Out</option>
              </select>
            </div>
            
            <div className="mt-4 flex justify-end">
              {editingTicket && (
                <button
                  onClick={() => {
                    setEditingTicket(null);
                    setNewTicket({ 
                      event: "", 
                      price: "", 
                      status: "Available",
                      quantity: "",
                      sold: 0,
                      date: "",
                      category: "Cultural",
                      venue: ""
                    });
                  }}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
              
              <button
                onClick={editingTicket ? saveEdit : addTicket}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                {editingTicket ? "Save Changes" : "Add Ticket"}
              </button>
            </div>
          </div>

          {/* Batch Actions */}
          {batchActionSelected.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg mb-6 flex justify-between items-center">
              <p className="text-gray-700 dark:text-gray-300">
                {batchActionSelected.length} tickets selected
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDiscountModal(true)}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                >
                  Apply Discount
                </button>
                <button
                  onClick={deleteSelected}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setBatchActionSelected([])}
                  className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Ticket List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="w-12 px-3 py-3 text-left">
                      <input 
                        type="checkbox" 
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBatchActionSelected(filteredTickets.map(t => t.id));
                          } else {
                            setBatchActionSelected([]);
                          }
                        }}
                        checked={batchActionSelected.length === filteredTickets.length && filteredTickets.length > 0}
                        className="rounded"
                      />
                    </th>
                    <th 
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("event")}
                    >
                      Event {sortField === "event" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th 
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("price")}
                    >
                      Price {sortField === "price" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th 
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      Date {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th 
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("venue")}
                    >
                      Venue {sortField === "venue" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th 
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("category")}
                    >
                      Category {sortField === "category" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th 
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("quantity")}
                    >
                      Qty {sortField === "quantity" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th 
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("sold")}
                    >
                      Sold {sortField === "sold" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th 
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      Status {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-3 py-4">
                          <input 
                            type="checkbox" 
                            checked={batchActionSelected.includes(ticket.id)}
                            onChange={() => toggleSelection(ticket.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{ticket.event}</div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-300">₹{ticket.price}</div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-300">{ticket.date}</div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-300">{ticket.venue}</div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {ticket.category}
                          </span>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {ticket.quantity}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {ticket.sold}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            ticket.status === "Available" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                            ticket.status === "Limited" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => startEdit(ticket)}
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-200 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteTicket(ticket.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                        No tickets found. Adjust your search or add new tickets.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Apply Discount</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Enter the discount amount to apply to the selected tickets.
            </p>
            <input
              type="number"
              placeholder="Discount Amount"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(Number(e.target.value))}
              className="p-2 border rounded-lg w-full"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={applyDiscountToSelected}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Apply Discount
              </button>
              <button
                onClick={() => {
                  setShowDiscountModal(false);
                  setDiscountAmount(0);
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg ml-2 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketsAdminPage;
