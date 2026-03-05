'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BarChart3, Box, ListChecks, Star, Menu, X } from 'lucide-react';

interface AdminSidebarProps {
  activeSection: 'dashboard' | 'businesses' | 'categories' | 'reviews';
}

export default function AdminSidebar({ activeSection }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
      icon: BarChart3,
      href: '#overview',
    },
    {
      id: 'businesses',
      label: 'All Businesses',
      icon: Box,
      href: '#businesses',
    },
    {
      id: 'categories',
      label: 'All Categories',
      icon: ListChecks,
      href: '#categories',
    },
    {
      id: 'reviews',
      label: 'All Ratings & Reviews',
      icon: Star,
      href: '#reviews',
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-40 md:hidden bg-blue-600 text-white p-2 rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0  h-[calc(100vh-64px)] w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 transition-transform duration-300 z-30 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <h2 className="text-xl font-bold mb-8 text-white">Admin Menu</h2>

        <nav className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Quick Actions */}
        {/* <div className="mt-8 pt-8 border-t border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Link
              href="#add-category"
              className="flex items-center gap-3 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              + New Category
            </Link>
            <Link
              href="#add-business"
              className="flex items-center gap-3 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              + New Business
            </Link>
          </div>
        </div> */}
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
