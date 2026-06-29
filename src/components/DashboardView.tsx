/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, 
  Car, 
  Calendar, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle, 
  Bell, 
  FileSpreadsheet, 
  Zap, 
  UserPlus, 
  ChevronRight,
  ClipboardList,
  Wrench,
  Percent
} from 'lucide-react';
import { Vehicle, Customer, Lead, RepairOrder, SalesDeal, PartItem, Expense } from '../types';
import { formatCurrency } from '../utils';

interface DashboardViewProps {
  vehicles: Vehicle[];
  leads: Lead[];
  customers: Customer[];
  testDrives: any[];
  repairs: RepairOrder[];
  sales: SalesDeal[];
  parts: PartItem[];
  expenses: Expense[];
  onQuickAction: (actionId: string) => void;
  currency: 'USD' | 'NGN' | 'KES' | 'GHS';
}

export default function DashboardView({
  vehicles,
  leads,
  customers,
  testDrives,
  repairs,
  sales,
  parts,
  expenses,
  onQuickAction,
  currency,
}: DashboardViewProps) {
  // 1. Calculate Metrics
  const totalSalesCount = sales.length;
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalPrice, 0);
  const totalPurchaseCostOfSoldCars = sales.reduce((sum, s) => {
    const v = vehicles.find(veh => veh.id === s.vehicleId);
    return sum + (v ? v.purchaseCost : 0);
  }, 0);
  
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const grossProfit = totalRevenue - totalPurchaseCostOfSoldCars;
  const netProfit = grossProfit - totalExpenses;

  const carsAvailable = vehicles.filter(v => v.status === 'Available').length;
  const carsReserved = vehicles.filter(v => v.status === 'Reserved').length;
  const pendingServices = repairs.filter(r => r.status !== 'Completed').length;
  const totalInventoryValue = vehicles.reduce((sum, v) => sum + v.purchaseCost, 0);

  // 2. Notifications/Alerts List
  const alerts: string[] = [];
  parts.forEach(p => {
    if (p.stock <= p.minStock) {
      alerts.push(`Low Stock Alert: ${p.name} (${p.stock} units remaining in ${p.warehouse})`);
    }
  });
  vehicles.forEach(v => {
    if (v.status === 'Maintenance') {
      alerts.push(`Workshop Status: ${v.brand} ${v.model} (${v.plateNumber}) currently undergoing diagnostics`);
    }
  });
  leads.forEach(l => {
    if (l.status === 'New' && l.score >= 80) {
      alerts.push(`Hot New Lead: ${l.customerName} is highly interested in ${vehicles.find(v => v.id === l.interestedVehicleId)?.brand || 'inventory'} (Lead score: ${l.score}%)`);
    }
  });

  // Default alerts fallback
  if (alerts.length === 0) {
    alerts.push('All system parameters functioning normally. Database backed up.');
  }

  // 3. Sales Funnel Categories counts
  const funnelStages = {
    New: leads.filter(l => l.status === 'New').length,
    Contacted: leads.filter(l => l.status === 'Contacted').length,
    Proposal: leads.filter(l => l.status === 'Proposal').length,
    Negotiation: leads.filter(l => l.status === 'Negotiation').length,
    Won: leads.filter(l => l.status === 'Won').length + sales.length,
  };

  const totalFunnelLeads = funnelStages.New + funnelStages.Contacted + funnelStages.Proposal + funnelStages.Negotiation + funnelStages.Won;

  // 4. Vehicle category analysis
  const categoriesCount = vehicles.reduce((acc, v) => {
    acc[v.bodyType] = (acc[v.bodyType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Showroom Control Panel</h2>
          <p className="text-sm text-slate-500">Real-time metrics, active campaigns, and dealer health indicators.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
          <span>SYSTEM LIVE &bull; LAGOS HQ & BRANCHES</span>
        </div>
      </div>

      {/* Grid of Key Indicator Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dealer Sales Revenue</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalRevenue, currency)}</h3>
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
                <TrendingUp size={14} /> +12.4% vs last month
              </p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Profit Ledger</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(netProfit, currency)}</h3>
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
                <TrendingUp size={14} /> 84.1% margin ratio
              </p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Inventory Value</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalInventoryValue, currency)}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {carsAvailable} cars available for immediate buy
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Car size={20} />
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Operations & Services</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{pendingServices} Active</h3>
              <p className="text-xs text-amber-600 font-bold flex items-center gap-1 mt-1">
                {carsReserved} vehicles reserved &bull; {testDrives.length} scheduled
              </p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
              <Wrench size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Quick Action Command Console</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={() => onQuickAction('add-car')}
            className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700/80 p-3 rounded-xl text-left transition-colors border border-slate-700/50"
            id="action-add-car"
          >
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Car size={16} />
            </div>
            <div>
              <p className="text-xs font-bold">Acquire Vehicle</p>
              <p className="text-[10px] text-slate-400">Stock intake</p>
            </div>
          </button>

          <button 
            onClick={() => onQuickAction('create-lead')}
            className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700/80 p-3 rounded-xl text-left transition-colors border border-slate-700/50"
            id="action-create-lead"
          >
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <UserPlus size={16} />
            </div>
            <div>
              <p className="text-xs font-bold">Register CRM Lead</p>
              <p className="text-[10px] text-slate-400">Add buyer contact</p>
            </div>
          </button>

          <button 
            onClick={() => onQuickAction('schedule-testdrive')}
            className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700/80 p-3 rounded-xl text-left transition-colors border border-slate-700/50"
            id="action-testdrive"
          >
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <Calendar size={16} />
            </div>
            <div>
              <p className="text-xs font-bold">Book Test Drive</p>
              <p className="text-[10px] text-slate-400">Approve timeslot</p>
            </div>
          </button>

          <button 
            onClick={() => onQuickAction('forecast-sales')}
            className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700/80 p-3 rounded-xl text-left transition-colors border border-slate-700/50 group"
            id="action-forecast"
          >
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg group-hover:animate-bounce">
              <Zap size={16} />
            </div>
            <div>
              <p className="text-xs font-bold">Sales Trend Forecast</p>
              <p className="text-[10px] text-slate-400">Show floor projections</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Grid for Analytics and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custom Visual SVG Graphs Column */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">Active Funnel & Customer Growth Analysis</h4>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Dynamic SVG Visualization</span>
          </div>

          {/* SVG Customer Growth and Performance Chart */}
          <div className="relative">
            <p className="text-xs font-bold text-slate-600 mb-2">Simulated Sales Trend & Revenue Cycle (Q1-Q2 2026)</p>
            <div className="h-44 w-full bg-slate-50 rounded-xl border border-slate-100 p-4 relative flex items-end">
              {/* SVG Line Graph */}
              <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 300 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="300" y2="50" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="0" y1="80" x2="300" y2="80" stroke="#f1f5f9" strokeWidth="0.5" />

                {/* Filled Area */}
                <path
                  d="M 10 90 L 60 70 L 120 75 L 180 40 L 240 45 L 290 20 L 290 90 Z"
                  fill="url(#chartGradient)"
                />
                
                {/* Drawn Line */}
                <path
                  d="M 10 90 L 60 70 L 120 75 L 180 40 L 240 45 L 290 20"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive Dot Markers */}
                <circle cx="10" cy="90" r="4" fill="#4f46e5" className="hover:scale-125 transition-transform" />
                <circle cx="60" cy="70" r="4" fill="#4f46e5" />
                <circle cx="120" cy="75" r="4" fill="#4f46e5" />
                <circle cx="180" cy="40" r="4" fill="#4f46e5" />
                <circle cx="240" cy="45" r="4" fill="#4f46e5" />
                <circle cx="290" cy="20" r="4" fill="#4f46e5" />
              </svg>

              {/* X-Axis labels */}
              <div className="w-full flex justify-between text-[9px] font-extrabold text-slate-400 px-2 z-10">
                <span>JAN (10k)</span>
                <span>FEB (25k)</span>
                <span>MAR (30k)</span>
                <span>APR (75k)</span>
                <span>MAY (62k)</span>
                <span>JUN (94k)</span>
              </div>
            </div>
          </div>

          {/* Sales Funnel conversion visual mapping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h5 className="text-xs font-bold text-slate-700 mb-3">CRM Lead Pipeline Funnel</h5>
              <div className="space-y-2.5">
                {/* Funnel segments */}
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                    <span>1. New Inquiries</span>
                    <span>{funnelStages.New} Leads ({totalFunnelLeads ? Math.round((funnelStages.New / totalFunnelLeads) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${totalFunnelLeads ? (funnelStages.New / totalFunnelLeads) * 100 : 0}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                    <span>2. Contact Established</span>
                    <span>{funnelStages.Contacted} Leads</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${totalFunnelLeads ? (funnelStages.Contacted / totalFunnelLeads) * 100 : 0}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                    <span>3. Proposal Formulated</span>
                    <span>{funnelStages.Proposal} Leads</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-pink-500 h-full rounded-full" style={{ width: `${totalFunnelLeads ? (funnelStages.Proposal / totalFunnelLeads) * 100 : 0}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                    <span>4. Sales Contract Sent</span>
                    <span>{funnelStages.Negotiation} Leads</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${totalFunnelLeads ? (funnelStages.Negotiation / totalFunnelLeads) * 100 : 0}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                    <span>5. Handovers Done</span>
                    <span>{funnelStages.Won} Completed</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${totalFunnelLeads ? (funnelStages.Won / totalFunnelLeads) * 100 : 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category distribution Pie Mock */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <h5 className="text-xs font-bold text-slate-700 mb-3">Vehicle Distribution by Category</h5>
                <div className="flex items-center justify-around">
                  {/* Visual mini-donut */}
                  <div className="relative w-20 h-20">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                      <circle cx="16" cy="16" r="14" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                      <circle cx="16" cy="16" r="14" fill="transparent" stroke="#4f46e5" strokeWidth="4" strokeDasharray="50 100" />
                      <circle cx="16" cy="16" r="14" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-50" />
                      <circle cx="16" cy="16" r="14" fill="transparent" stroke="#f59e0b" strokeWidth="4" strokeDasharray="15 100" strokeDashoffset="-75" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-black text-slate-800">{vehicles.length} Total</span>
                    </div>
                  </div>

                  <div className="text-[10px] space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
                      <span className="font-bold">SUV ({categoriesCount.SUV || 0} units)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      <span className="font-bold">Sedan ({categoriesCount.Sedan || 0} units)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                      <span className="font-bold">Others ({vehicles.length - (categoriesCount.SUV || 0) - (categoriesCount.Sedan || 0)} units)</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 font-medium italic mt-2 text-center">Data represents active showrooms, including Lagos, Nairobi & Accra.</p>
            </div>
          </div>
        </div>

        {/* System Monitoring & Notification Stream Column */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bell className="text-slate-700 w-4 h-4 animate-swing" />
              <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">Active Operations Feed</h4>
            </div>
            <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-black uppercase">Alert Tracker</span>
          </div>

          {/* Warnings and alerts stream */}
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100/80 text-xs text-slate-700 relative overflow-hidden group hover:border-slate-300 transition-colors"
              >
                <div className="p-1 bg-amber-100 text-amber-600 rounded mt-0.5">
                  <AlertCircle size={14} />
                </div>
                <div>
                  <p className="font-medium text-slate-700 leading-tight">{alert}</p>
                  <p className="text-[9px] text-slate-400 mt-1">Just Now &bull; System Verified</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats overview */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <h5 className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wide">Live Transaction Records</h5>
            {sales.slice(0, 3).map((deal, i) => (
              <div key={deal.id} className="flex justify-between items-center text-xs border-b border-slate-50 pb-2.5">
                <div>
                  <p className="font-bold text-slate-800">{deal.customerName}</p>
                  <p className="text-[10px] text-slate-400">{deal.date} &bull; {deal.dealType}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-indigo-600">{formatCurrency(deal.totalPrice, currency)}</p>
                  <span className="text-[8px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">{deal.status}</span>
                </div>
              </div>
            ))}
            {sales.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No deals logged in current session.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
