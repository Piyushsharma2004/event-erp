"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import React from 'react';

export default function EventsPreview() {
  interface Event {
    id: string;
    name: string;
    description?: string;
    date: string;
    club: string;
    isPublished: boolean;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    Promise.all([
      fetch("/api/auth/user").then(res => res.json()),
      fetch("/api/admin/events/upcoming").then(res => res.json())
    ]).then(([userData, eventsData]) => {
      setUser(userData);
      
      // If club admin, filter events for their club
      if (userData.role === "club_admin") {
        setEvents(eventsData.filter((event: any) => event.club === userData.club).slice(0, 5));
      } else {
        setEvents(eventsData.slice(0, 5));
      }
      
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching data:", error);
      setLoading(false);
    });
  }, []);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Upcoming Events</h2>
        <Link href="/admin/events">
          <span className="text-blue-500 text-sm hover:underline">View All</span>
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No upcoming events found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map(event => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{event.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {event.description && event.description.substring(0, 40)}
                      {event.description && event.description.length > 40 ? "..." : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {event.club}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      event.isPublished 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {event.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Link href={`/admin/events/edit/${event.id}`}>
                      <span className="text-blue-600 hover:text-blue-900 mr-3">Edit</span>
                    </Link>
                    <Link href={`/admin/events/registrations/${event.id}`}>
                      <span className="text-gray-600 hover:text-gray-900">Registrations</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}