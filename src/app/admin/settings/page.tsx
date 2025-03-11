'use client';
import React, { useState, useEffect } from 'react';
import { Bell, Moon, Sun, Save, Users, Calendar, BarChart, Settings as SettingsIcon } from 'lucide-react';

function SettingsPage() {
  const [theme, setTheme] = useState('light');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [settings, setSettings] = useState({
    emailNotifications: false,
    pushNotifications: false,
    eventReminders: false,
    dataAnalytics: true,
    autoApproval: false,
    publicCalendar: true,
    resourceManagement: true
  });
  const [activeTab, setActiveTab] = useState('general');

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Handle user role change
  interface Settings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    eventReminders: boolean;
    dataAnalytics: boolean;
    autoApproval: boolean;
    publicCalendar: boolean;
    resourceManagement: boolean;
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedRole(e.target.value);
  };

  // Handle settings change
  interface Settings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    eventReminders: boolean;
    dataAnalytics: boolean;
    autoApproval: boolean;
    publicCalendar: boolean;
    resourceManagement: boolean;
  }

  const handleSettingChange = (setting: keyof Settings): void => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  // Save all settings
  const saveSettings = () => {
    // Simulate saving to backend
    console.log('Saving settings:', { theme, selectedRole, settings });
    // Show success message
    const saveMessage = document.getElementById('saveMessage');
    if (saveMessage) {
      saveMessage.classList.remove('opacity-0');
    }
    setTimeout(() => {
      if (saveMessage) {
        saveMessage.classList.add('opacity-0');
      }
    }, 3000);
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 w-full`}>
      {/* Top Navigation */}
   

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 h-screen p-6 shadow-md">
          <h2 className="text-xl font-bold mb-6">Settings</h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('general')}
                className={`flex items-center space-x-2 w-full p-3 rounded-lg ${
                  activeTab === 'general' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <SettingsIcon size={18} />
                <span>General Settings</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center space-x-2 w-full p-3 rounded-lg ${
                  activeTab === 'users' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Users size={18} />
                <span>User Management</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('events')}
                className={`flex items-center space-x-2 w-full p-3 rounded-lg ${
                  activeTab === 'events' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Calendar size={18} />
                <span>Event Settings</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center space-x-2 w-full p-3 rounded-lg ${
                  activeTab === 'analytics' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <BarChart size={18} />
                <span>Analytics</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div id="saveMessage" className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md transition-opacity duration-300 opacity-0">
            Settings saved successfully!
          </div>

          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">General Settings</h2>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Theme Settings</h3>
                <div className="flex items-center">
                  <button
                    onClick={toggleTheme}
                    className="relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 dark:bg-blue-600"
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full transition-transform bg-white ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="ml-3">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Notification Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Email Notifications</span>
                    <button
                      onClick={() => handleSettingChange('emailNotifications')}
                      className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full transition-transform bg-white ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Push Notifications</span>
                    <button
                      onClick={() => handleSettingChange('pushNotifications')}
                      className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full transition-transform bg-white ${settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Event Reminders</span>
                    <button
                      onClick={() => handleSettingChange('eventReminders')}
                      className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${settings.eventReminders ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full transition-transform bg-white ${settings.eventReminders ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">User Interface Preferences</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Interface Density</label>
                  <select className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                    <option>Comfortable</option>
                    <option>Compact</option>
                    <option>Spacious</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">User Management</h2>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">User Role Management</h3>
                <div className="mb-4">
                  <label htmlFor="role" className="block text-sm font-medium mb-2">Current User Role:</label>
                  <select
                    id="role"
                    value={selectedRole}
                    onChange={handleRoleChange}
                    className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                  >
                    <option value="admin">Admin</option>
                    <option value="event_manager">Event Manager</option>
                    <option value="faculty_coordinator">Faculty Coordinator</option>
                    <option value="student_organizer">Student Organizer</option>
                    <option value="user">Regular User</option>
                  </select>
                </div>
                
                <h4 className="font-medium mb-2 mt-4">Role Permissions:</h4>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                  {selectedRole === 'admin' && (
                    <ul className="list-disc list-inside text-sm">
                      <li>Full access to all system features</li>
                      <li>Manage users and permissions</li>
                      <li>Configure system settings</li>
                      <li>Approve/reject event requests</li>
                      <li>Access to all analytics and reports</li>
                    </ul>
                  )}
                  {selectedRole === 'event_manager' && (
                    <ul className="list-disc list-inside text-sm">
                      <li>Manage all events</li>
                      <li>Approve/reject event requests</li>
                      <li>Assign resources to events</li>
                      <li>Access to event analytics</li>
                    </ul>
                  )}
                  {selectedRole === 'faculty_coordinator' && (
                    <ul className="list-disc list-inside text-sm">
                      <li>Create and manage department events</li>
                      <li>Preliminary approval of student events</li>
                      <li>Request resources for events</li>
                      <li>Access to department event reports</li>
                    </ul>
                  )}
                  {selectedRole === 'student_organizer' && (
                    <ul className="list-disc list-inside text-sm">
                      <li>Create event proposals</li>
                      <li>Manage assigned events</li>
                      <li>Submit post-event reports</li>
                      <li>Basic analytics access</li>
                    </ul>
                  )}
                  {selectedRole === 'user' && (
                    <ul className="list-disc list-inside text-sm">
                      <li>View public events</li>
                      <li>Register for events</li>
                      <li>Submit feedback</li>
                    </ul>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">User Access Control</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Auto-approve new user registrations</span>
                    <button className="relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200">
                      <span className="inline-block h-5 w-5 transform rounded-full transition-transform bg-white translate-x-1" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Require email verification</span>
                    <button className="relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600">
                      <span className="inline-block h-5 w-5 transform rounded-full transition-transform bg-white translate-x-6" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Allow users to delete their accounts</span>
                    <button className="relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600">
                      <span className="inline-block h-5 w-5 transform rounded-full transition-transform bg-white translate-x-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Event Settings Tab */}
          {activeTab === 'events' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Event Settings</h2>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Event Approval Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Auto-approve small events (under 50 attendees)</span>
                    <button
                      onClick={() => handleSettingChange('autoApproval')}
                      className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${settings.autoApproval ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full transition-transform bg-white ${settings.autoApproval ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Public event calendar</span>
                    <button
                      onClick={() => handleSettingChange('publicCalendar')}
                      className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${settings.publicCalendar ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full transition-transform bg-white ${settings.publicCalendar ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Resource Management</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Enable resource conflict detection</span>
                    <button
                      onClick={() => handleSettingChange('resourceManagement')}
                      className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${settings.resourceManagement ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full transition-transform bg-white ${settings.resourceManagement ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>

                <h4 className="font-medium mt-4 mb-2">Managed Resource Types:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" checked className="rounded text-blue-500" />
                    <span>Venues</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" checked className="rounded text-blue-500" />
                    <span>AV Equipment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" checked className="rounded text-blue-500" />
                    <span>Furniture</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" checked className="rounded text-blue-500" />
                    <span>Technical Staff</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-blue-500" />
                    <span>Catering</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-blue-500" />
                    <span>Transportation</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Event Type Configuration</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Active Event Categories</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked className="rounded text-blue-500" />
                      <span>Academic</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked className="rounded text-blue-500" />
                      <span>Cultural</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked className="rounded text-blue-500" />
                      <span>Sports</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked className="rounded text-blue-500" />
                      <span>Workshop</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked className="rounded text-blue-500" />
                      <span>Seminar</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-blue-500" />
                      <span>Competition</span>
                    </div>
                  </div>
                </div>
                
                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium mt-2">
                  + Add custom event category
                </button>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Analytics Settings</h2>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Data Collection Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Enable data analytics</span>
                    <button
                      onClick={() => handleSettingChange('dataAnalytics')}
                      className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${settings.dataAnalytics ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full transition-transform bg-white ${settings.dataAnalytics ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
                
                <h4 className="font-medium mt-4 mb-2">Analytics Data Collection:</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" checked className="rounded text-blue-500" />
                    <span>Event attendance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" checked className="rounded text-blue-500" />
                    <span>User feedback</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" checked className="rounded text-blue-500" />
                    <span>Resource utilization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" checked className="rounded text-blue-500" />
                    <span>Event type popularity</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-blue-500" />
                    <span>User demographic data</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Report Settings</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Automatic Reports</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked className="rounded text-blue-500" />
                      <span>Weekly event summary</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked className="rounded text-blue-500" />
                      <span>Monthly resource utilization</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-blue-500" />
                      <span>Quarterly trend analysis</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Report Delivery Method</label>
                  <select className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                    <option>Email</option>
                    <option>Dashboard only</option>
                    <option>Both email and dashboard</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={saveSettings}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
            >
              <Save size={18} />
              <span>Save All Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;