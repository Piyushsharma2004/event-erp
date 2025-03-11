"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Clock, Filter, Search, Users, Tag, ChevronDown, Grid, List } from "lucide-react";

export default function EventsPage() {
  interface Event {
    id: string;
    name: string;
    description?: string;
    category: string;
    date: string;
    time?: string;
    club: string;
    location?: string;
    price: number;
    image?: string;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  
  const categories = ["All", "Academic", "Social", "Sports", "Arts", "Career"];

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setFilteredEvents(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching events:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let results = events;
    
    // Filter by search query
    if (searchQuery) {
      results = results.filter(event => 
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by category
    if (selectedCategory !== "All") {
      results = results.filter(event => event.category === selectedCategory);
    }
    
    setFilteredEvents(results);
  }, [searchQuery, selectedCategory, events]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-900 py-14 px-6">
        <div className="max-w-6xl mx-auto text-white">
          <h1 className="text-3xl md:text-5xl font-bold">Discover Events</h1>
          <p className="mt-3 text-white/90 text-lg">Find and join exciting university events</p>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="max-w-6xl mx-auto px-6 py-6 -mt-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 md:p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 dark:border-gray-700 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                           focus:border-transparent bg-white dark:bg-gray-700 
                           text-gray-800 dark:text-gray-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 dark:bg-gray-700 
                        rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition md:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300">Filters</span>
              <ChevronDown className={`w-4 h-4 transition text-gray-700 dark:text-gray-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select 
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                               bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                  <select className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg 
                                    focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                                    bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100">
                    <option>Any date</option>
                    <option>Today</option>
                    <option>This week</option>
                    <option>This month</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price</label>
                  <select className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg 
                                    focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                                    bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100">
                    <option>Any price</option>
                    <option>Free</option>
                    <option>Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort by</label>
                  <select className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg 
                                    focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                                    bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100">
                    <option>Date (Upcoming)</option>
                    <option>Date (Recent)</option>
                    <option>Price (Low to High)</option>
                    <option>Price (High to Low)</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button 
                  className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 
                            text-white font-medium px-5 py-2 rounded-lg transition"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Events List */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Results <span className="text-gray-600 dark:text-gray-400 text-lg font-normal">({filteredEvents.length} events)</span>
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 dark:text-gray-400">View:</span>
            <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button 
                className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button 
                className={`p-2 ${viewMode === 'list' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                onClick={() => setViewMode('list')}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
        
        {/* No Events State */}
        {!isLoading && filteredEvents.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-white">No events found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filter criteria</p>
            <button 
              className="mt-6 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 
                        text-white font-medium px-5 py-2 rounded-lg transition"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}
        
        {/* Events Grid/List View */}
        {!isLoading && filteredEvents.length > 0 && (
          <div className={viewMode === 'grid' ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
            {filteredEvents.map((event) => (
              <div 
                key={event.id} 
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition 
                           overflow-hidden border border-gray-100 dark:border-gray-700
                           ${viewMode === 'list' ? 'flex' : ''}`}
              >
                <div className={`flex flex-col ${viewMode === 'list' ? 'md:flex-row' : ''}`}>
                  <div 
                    className={`${viewMode === 'list' ? 'md:w-1/3 lg:w-1/4' : 'w-full'} h-48 relative overflow-hidden`}
                  >
                    {/* Event image with fallback */}
                    {event.image ? (
                      <div className="relative w-full h-full">
                        <Image 
                          src={event.image || "/api/placeholder/400/320"} 
                          alt={event.name}
                          className="object-cover"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                    {event.category && (
                      <span className="absolute top-3 left-3 bg-indigo-600 dark:bg-indigo-500 text-white 
                                      text-xs font-medium px-3 py-1 rounded-full z-10">
                        {event.category}
                      </span>
                    )}
                  </div>
                  
                  <div className={`p-6 flex-grow ${viewMode === 'list' ? 'md:flex md:flex-col md:justify-between' : ''}`}>
                    <div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{event.date}</span>
                        {event.time && (
                          <>
                            <Clock className="w-4 h-4 ml-4 mr-1" />
                            <span>{event.time}</span>
                          </>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white line-clamp-2">{event.name}</h3>
                      
                      {viewMode === 'list' && event.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{event.description}</p>
                      )}
                      
                      <div className="mt-2 flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>Organized by {event.club}</span>
                      </div>
                      
                      {event.location && (
                        <div className="mt-2 flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-5 flex justify-between items-center">
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-1" />
                        <span className="font-medium text-gray-800 dark:text-white">
                          {event.price === 0 ? "Free" : `₹${event.price}`}
                        </span>
                      </div>
                      <Link href={`/events/${event.id}`}>
                        <button className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 
                                          text-white px-5 py-2 rounded-lg transition">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {!isLoading && filteredEvents.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                              hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition">
                Previous
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg 
                              bg-indigo-600 dark:bg-indigo-700 text-white font-medium">
                1
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg 
                              hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                2
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg 
                              hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                3
              </button>
              <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg 
                              hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                10
              </button>
              <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                              hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}