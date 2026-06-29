/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Calendar, 
  Calculator, 
  Wrench, 
  TrendingUp, 
  Store, 
  Menu, 
  X, 
  DollarSign, 
  User, 
  Truck,
  Briefcase,
  Home
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Sidebar({
  activeSection,
  setActiveSection,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Define section navigation options without SaaS branch or AI tabs
  const menuItems = [
    { id: 'landing', label: 'Dealer Landing Page', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Vehicle Inventory', icon: Car },
    { id: 'purchasing', label: 'Purchases & Trade-ins', icon: Truck },
    { id: 'sales', label: 'Sales & Invoicing', icon: DollarSign },
    { id: 'crm', label: 'CRM & Lead Funnel', icon: Users },
    { id: 'testdrives', label: 'Test Drives & Bookings', icon: Calendar },
    { id: 'financing', label: 'Financing & Insurance', icon: Calculator },
    { id: 'workshop', label: 'Workshop & Maintenance', icon: Wrench },
    { id: 'accounting', label: 'Financial Accounting', icon: TrendingUp },
    { id: 'staff', label: 'Staff & Targets', icon: Briefcase },
    { id: 'marketplace', label: 'Online Car Shop', icon: Store },
    { id: 'portal', label: 'Customer Portal', icon: User },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <Car className="text-indigo-400 w-6 h-6" />
          <span className="font-bold tracking-tight text-lg text-white">AutoElite <span className="text-indigo-400">DMS</span></span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 hover:bg-slate-800 rounded transition-colors text-slate-300 focus:outline-none"
          id="mobile-menu-toggle"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Main Navigation Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-900 text-slate-300 transform lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:sticky lg:top-0 lg:h-screen
      `}>
        {/* Top Branding Section */}
        <div className="hidden lg:flex items-center gap-3 px-6 py-5 border-b border-slate-900">
          <div className="p-2 bg-indigo-600/10 rounded-lg border border-indigo-500/20">
            <Car className="text-indigo-400 w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-lg leading-tight tracking-tight">AutoElite <span className="text-indigo-400 text-xs font-semibold px-1.5 py-0.5 bg-indigo-500/10 rounded-md ml-1">DMS</span></h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Enterprise Suite v4.2</p>
          </div>
        </div>

        {/* Dynamic Navigation Menu Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
          <p className="px-3 text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-2">Navigation</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all group duration-200
                  ${isSelected 
                    ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 font-bold' 
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                  }
                `}
              >
                <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isSelected ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logged User Info */}
        <div className="p-4 border-t border-slate-900 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xs">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                Admin User
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                admin@autoelite.com
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  );
}
