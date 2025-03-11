import React from 'react';

interface DashboardStatsProps {
  stats: {
    totalEvents: number;
    publishedEvents: number;
    totalRegistrations: number;
    revenueThisMonth: number;
  };
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-gray-500 dark:text-gray-400">Total Events</h3>
        <p className="text-2xl font-bold dark:text-white">{stats.totalEvents}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-gray-500 dark:text-gray-400">Published Events</h3>
        <p className="text-2xl font-bold dark:text-white">{stats.publishedEvents}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-gray-500 dark:text-gray-400">Total Registrations</h3>
        <p className="text-2xl font-bold dark:text-white">{stats.totalRegistrations}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-gray-500 dark:text-gray-400">Revenue This Month</h3>
        <p className="text-2xl font-bold dark:text-white">{formatter.format(stats.revenueThisMonth)}</p>
      </div>
    </div>
  );
}
