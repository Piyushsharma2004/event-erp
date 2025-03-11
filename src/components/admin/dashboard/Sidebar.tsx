"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from 'react';


export default function Sidebar() {
  interface User {
    name: string;
    role: string;
  }
  
  const [user, setUser] = useState<User | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false); // Changed to false for testing
  const [submenuOpen, setSubmenuOpen] = useState<number | null>(null);
  const pathname = usePathname();
  
  // For testing - skip API call and use test user
  useEffect(() => {
    // Test user with access to everything
    const testUser = { 
      name: "Test User", 
      role: "super_admin" // Role with all permissions for testing
    };
    
    setUser(testUser);
    console.log("Using test user:", testUser);
    
    // Comment out actual API call during testing
    /*
    fetch("/api/auth/user")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("User data loaded:", data);
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading user:", err);
        // For testing, still create user with full access
        setUser(testUser);
        setLoading(false);
      });
    */
  }, []);

  const toggleSubmenu = (index: number, e: React.MouseEvent) => {
    // Prevent the Link navigation when clicking on the toggle area
    e.stopPropagation();
    
    if (submenuOpen === index) {
      setSubmenuOpen(null);
    } else {
      setSubmenuOpen(index);
    }
  };

  const menuItems = [
    { 
      name: "Dashboard", 
      path: "/admin/", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      allowedRoles: ["super_admin", "admin", "club_admin"] 
    },
    { 
      name: "Events", 
      path: "/admin/events", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      allowedRoles: ["super_admin", "admin", "club_admin"]
    },
    { 
      name: "Tickets", 
      path: "/admin/tickets", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
      allowedRoles: ["super_admin", "admin", "club_admin"]
    },
    { 
      name: "Sponsors", 
      path: "/admin/sponsors", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      allowedRoles: ["super_admin", "admin", "club_admin"]
     
    },
    { 
      name: "Email Campaigns", 
      path: "/admin/emails", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      allowedRoles: ["super_admin", "admin", "club_admin"] 
    },
    { 
      name: "Promotions", 
      path: "/admin/promotions", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      allowedRoles: ["super_admin", "admin", "club_admin"] 
    },
    { 
      name: "Members", 
      path: "/admin/members", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      allowedRoles: ["super_admin", "admin", "club_admin"] 
    },
    { 
      name: "Analytics", 
      path: "/admin/analytics", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      allowedRoles: ["super_admin", "admin"] 
    },
    { 
      name: "Settings", 
      path: "/admin/settings", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      allowedRoles: ["super_admin", "admin"] 
    },
    { 
      name: "Users", 
      path: "/admin/users", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      allowedRoles: ["super_admin"] 
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // While loading, show a loading indicator - should not appear in testing mode
  if (loading) {
    return (
      <div className="w-16 md:w-64 bg-gray-800 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-gray-800 dark:bg-gray-900 text-white min-h-screen transition-all duration-300 ease-in-out shadow-lg flex flex-col  `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && (
          <div className="text-xl font-semibold">Admin Panel <span className="text-xs text-yellow-400">(Test Mode)</span></div>
        )}
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={collapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7M19 19l-7-7 7-7"} />
          </svg>
        </button>
      </div>

      {/* Menu items with scrollable area */}
      <div className="py-2 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {/* Show ALL menu items for testing, regardless of role */}
        {menuItems.map((item, index) => (
          <div key={index}>
            {/* Main menu item - Use Link for navigation */}
            <Link 
              href={item.path}
              className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-200 ${
                pathname === item.path || pathname.startsWith(item.path + '/')
                  ? 'bg-gray-700 dark:bg-gray-800 text-white' 
                  : 'text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="flex-grow">{item.name}</span>
                </>
              )}
            </Link>
            
            {/* Submenu items */}
          </div>
        ))}
      </div>

      {/* User profile and logout section - fixed at bottom */}
      <div className="border-t border-gray-700 p-4 mt-auto">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
            T
          </div>
          {!collapsed && (
            <div className="ml-3 overflow-hidden">
              <div className="text-sm font-medium truncate">Test User</div>
              <div className="text-xs text-gray-400">Testing Mode</div>
            </div>
          )}
        </div>
        <Link 
          href="/api/auth/logout" 
          className={`flex items-center mt-4 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md px-3 py-2 transition-colors duration-200 ${collapsed ? 'justify-center' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span className="ml-2">Logout</span>}
        </Link>
      </div>
    </div>
  );
}