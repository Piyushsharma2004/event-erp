
import React from 'react';




interface Alert {
  id: number;
  type: 'warning' | 'info' | 'error' | 'success';
  message: string;
  date: string;
  }
  
  interface AlertsPanelProps {
    alerts: Alert[];
  }
  
  export default function AlertsPanel({ alerts }: AlertsPanelProps) {
    const getAlertIcon = (type: Alert['type']) => {
      switch (type) {
        case 'warning':
          return (
            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          );
        case 'info':
          return (
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          );
        case 'error':
          return (
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          );
        default:
          return null;
      }
    };
  
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-200">Recent Alerts</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-600">
          {alerts.map(alert => (
            <div key={alert.id} className="p-4 flex items-start">
              <div className="flex-shrink-0 mr-3">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 dark:text-gray-200">{alert.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{alert.date}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-right">
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-600">
            View All Alerts
          </button>
        </div>
      </div>
    );
  }
  