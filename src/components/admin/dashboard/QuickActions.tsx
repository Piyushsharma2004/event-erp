import Link from "next/link";
import { Briefcase, FileText, User, Settings } from "lucide-react";
import React from 'react';

interface QuickLink {
  path: string;
  title: string;
  icon: JSX.Element; // Ensure that the icon is correctly passed as JSX
}

interface QuickActionsProps {
  quickLinks: QuickLink[];
}

export default function QuickActions({ quickLinks }: QuickActionsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-6">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((link, index) => (
          <Link
            key={index}
            href={link.path}
            className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out transform hover:scale-105"
          >
            <span className="h-12 w-12 rounded-full bg-blue-100 dark:bg-gray-600 flex items-center justify-center text-blue-600 dark:text-gray-200 mb-2">
              {link.icon} {/* The icon should be passed correctly */}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{link.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Example usage with Lucide React icons
export const quickLinksData: QuickLink[] = [
  {
    path: "/admin/projects",
    title: "Projects",
    icon: <Briefcase className="h-6 w-6" />, // Make sure it&apos;s being rendered as a component
  },
  {
    path: "/admin/documents",
    title: "Documents",
    icon: <FileText className="h-6 w-6" />,
  },
  {
    path: "/admin/profile",
    title: "Profile",
    icon: <User className="h-6 w-6" />,
  },
  {
    path: "/admin/settings",
    title: "Settings",
    icon: <Settings className="h-6 w-6" />,
  },
];
