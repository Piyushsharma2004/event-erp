import { Line } from 'react-chartjs-2';
import React from 'react';

import { ChartData } from 'chart.js';

interface RegistrationTrendsProps {
  registrationChartData: ChartData<'line'>;
}

export default function RegistrationTrends({ registrationChartData }: RegistrationTrendsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Event Registration Trends</h2>
      <div className="h-80">
        <Line data={registrationChartData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
}