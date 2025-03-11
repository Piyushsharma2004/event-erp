'use client';
import React, { useState, useRef } from "react";
import Head from "next/head";

function EventAdminPage() {
  // Enhanced event data structure
  const [events, setEvents] = useState([
    { 
      id: 1, 
      name: "Garba Night", 
      date: "2025-03-20",
      time: "19:00",
      endTime: "23:00",
      location: "Main Auditorium",
      price: 50,
      isFree: false,
      organizer: "Cultural Committee",
      about: "Join us for a night of traditional Garba dance and celebration.",
      highlights: ["Live music", "Dance competition", "Traditional attire"],
      speakers: ["Dr. Meera Patel", "Prof. Rohan Sharma"],
      totalSpots: 200,
      registeredAttendees: 75,
      imageUrl: "/event.jpeg",
      bannerPreview: null as string | ArrayBuffer | null
    },
    { 
      id: 2, 
      name: "MakerCarnival", 
      date: "2025-04-05",
      time: "10:00",
      endTime: "16:00",
      location: "Engineering Block",
      price: 0,
      isFree: true,
      organizer: "Tech Club",
      about: "A day-long festival celebrating innovation and creativity.",
      highlights: ["Project showcase", "Hands-on workshops", "Networking"],
      speakers: ["Prof. Amit Kumar", "Ms. Priya Singh", "Mr. Vikram Malhotra"],
      totalSpots: 150,
      registeredAttendees: 42,
      imageUrl: "/event.jpeg",
      bannerPreview: null
    },
  ]);

  // Default state for new event
  const defaultNewEvent = {
    name: "",
    date: "",
    time: "",
    endTime: "",
    location: "",
    price: 0,
    isFree: false,
    organizer: "",
    about: "",
    highlights: [""],
    speakers: [""],
    totalSpots: 100,
    registeredAttendees: 0,
    imageUrl: "",
    bannerPreview: null as string | ArrayBuffer | null
  };

  const [newEvent, setNewEvent] = useState({ ...defaultNewEvent });
  const [editingEvent, setEditingEvent] = useState<typeof events[0] | null>(null);
  const [activeTab, setActiveTab] = useState("basic"); // Tabs: basic, details, speakers
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      // Handle checkbox specifically for isFree
      setNewEvent({ 
        ...newEvent, 
        [name]: checked,
        // Reset price to 0 if event is marked as free
        ...(name === "isFree" && checked ? { price: 0 } : {})
      });
    } else {
      setNewEvent({ ...newEvent, [name]: value });
    }
  };

  // Handle array inputs (highlights, speakers)
  const handleArrayInputChange = (index: number, field: 'highlights' | 'speakers', value: string) => {
    const updatedArray = [...newEvent[field]];
    updatedArray[index] = value;
    setNewEvent({ ...newEvent, [field]: updatedArray });
  };

  const addArrayItem = (field: 'highlights' | 'speakers') => {
    setNewEvent({ ...newEvent, [field]: [...newEvent[field], ""] });
  };

  const removeArrayItem = (field: 'highlights' | 'speakers', index: number) => {
    const updatedArray = [...newEvent[field]];
    updatedArray.splice(index, 1);
    setNewEvent({ ...newEvent, [field]: updatedArray });
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEvent({
          ...newEvent,
          imageUrl: file.name, // In a real app, this would be the upload URL
          bannerPreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add New Event
  const addEvent = () => {
    if (newEvent.name && newEvent.date) {
      setEvents([...events, { id: Date.now(), ...newEvent }]);
      setNewEvent({ ...defaultNewEvent });
      setActiveTab("basic");
    } else {
      alert("Event name and date are required!");
    }
  };

  // Edit Event
  const startEdit = (event: typeof events[0]) => {
    setEditingEvent(event);
    setNewEvent({ ...event });
    setActiveTab("basic");
  };

  const saveEdit = () => {
    if (editingEvent) {
      setEvents(
        events.map((ev) => (ev.id === editingEvent.id ? { ...ev, ...newEvent } : ev))
      );
    }
    setEditingEvent(null);
    setNewEvent({ ...defaultNewEvent });
    setActiveTab("basic");
  };

  // Delete Event
  const deleteEvent = (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  // Cancel Edit/Add
  const cancelForm = () => {
    setEditingEvent(null);
    setNewEvent({ ...defaultNewEvent });
    setActiveTab("basic");
  };

  return (
    <div className="w-full">
      <Head>
        <title>Event Admin | Dashboard</title>
        <meta name="description" content="Manage your college events efficiently with the Event Admin Dashboard." />
      </Head>

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <h1 className="text-black dark:text-white text-4xl font-bold mb-6 text-center">EVENT ADMIN DASHBOARD</h1>

        {/* Event Form */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {editingEvent ? "Edit Event" : "Add New Event"}
          </h2>
          
          {/* Tab Navigation */}
          <div className="flex border-b mb-4">
            <button 
              className={`py-2 px-4 ${activeTab === 'basic' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('basic')}
            >
              Basic Info
            </button>
            <button 
              className={`py-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('details')}
            >
              Event Details
            </button>
            <button 
              className={`py-2 px-4 ${activeTab === 'speakers' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('speakers')}
            >
              Speakers & Capacity
            </button>
          </div>

          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Event Name"
                  value={newEvent.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    name="time"
                    value={newEvent.time}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={newEvent.endTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Event Location"
                  value={newEvent.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organized By</label>
                <input
                  type="text"
                  name="organizer"
                  placeholder="Club or Department Name"
                  value={newEvent.organizer}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFree"
                  name="isFree"
                  checked={newEvent.isFree}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="isFree" className="text-sm font-medium text-gray-700 dark:text-gray-300">Free Event</label>
              </div>
              
              {!newEvent.isFree && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="0"
                    value={newEvent.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
              )}
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Banner</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current && fileInputRef.current.click()} 
                  className="w-full h-32 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {newEvent.bannerPreview ? (
                    <img src={newEvent.bannerPreview as string} alt="Preview" className="h-full object-contain" />
                  ) : (
                    <span className="text-gray-500">Click to upload image</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Event Details Tab */}
          {activeTab === 'details' && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About This Event</label>
                <textarea
                  name="about"
                  placeholder="Describe the event..."
                  value={newEvent.about}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows={4}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Highlights</label>
                {newEvent.highlights.map((highlight, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      placeholder={`Highlight ${index + 1}`}
                      value={highlight}
                      onChange={(e) => handleArrayInputChange(index, 'highlights', e.target.value)}
                      className="flex-grow p-2 border rounded mr-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('highlights', index)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('highlights')}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  + Add Highlight
                </button>
              </div>
            </div>
          )}

          {/* Speakers & Capacity Tab */}
          {activeTab === 'speakers' && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Speakers / Guests</label>
                {newEvent.speakers.map((speaker, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      placeholder={`Speaker ${index + 1} Name`}
                      value={speaker}
                      onChange={(e) => handleArrayInputChange(index, 'speakers', e.target.value)}
                      className="flex-grow p-2 border rounded mr-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('speakers', index)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('speakers')}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  + Add Speaker
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Available Spots</label>
                  <input
                    type="number"
                    name="totalSpots"
                    placeholder="100"
                    value={newEvent.totalSpots}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registered Attendees</label>
                  <input
                    type="number"
                    name="registeredAttendees"
                    placeholder="0"
                    value={newEvent.registeredAttendees}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={cancelForm}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={editingEvent ? saveEdit : addEvent}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              {editingEvent ? "Save Changes" : "Add Event"}
            </button>
          </div>
        </div>

        {/* Event List */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                {/* Event Banner */}
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  {event.bannerPreview ? (
                    <img src={event.bannerPreview as string} alt={event.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-gray-500">No image</span>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{event.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{event.date} • {event.time}-{event.endTime}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{event.location}</p>
                      <p className="text-sm font-medium mt-2">
                        {event.isFree ? (
                          <span className="text-green-600 dark:text-green-400">Free</span>
                        ) : (
                          <span className="text-blue-600 dark:text-blue-400">₹{event.price}</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full px-2 py-1">
                        {event.registeredAttendees}/{event.totalSpots} Spots
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 my-3 pt-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Organized by {event.organizer}</p>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => startEdit(event)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventAdminPage;