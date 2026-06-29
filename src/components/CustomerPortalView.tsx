/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Car, 
  Calendar, 
  Clock, 
  FileCheck, 
  ShieldCheck, 
  Wrench, 
  Download,
  Info,
  DollarSign
} from 'lucide-react';
import { Vehicle, TestDrive, RepairOrder, SalesDeal } from '../types';
import { formatCurrency } from '../utils';

interface CustomerPortalViewProps {
  purchasedCars: Vehicle[];
  testDrives: TestDrive[];
  repairs: RepairOrder[];
  sales: SalesDeal[];
  currency: 'USD' | 'NGN' | 'KES' | 'GHS';
}

export default function CustomerPortalView({
  purchasedCars,
  testDrives,
  repairs,
  sales,
  currency,
}: CustomerPortalViewProps) {
  // Filter for customer specific items
  const myPurchases = sales;
  const myTestDrives = testDrives;
  const myRepairs = repairs;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Customer Portal</h2>
          <p className="text-xs text-slate-500 font-medium">Review your garage repair schedules, vehicle agreements, and booked test drives.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core vehicle files and records Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active acquisitions list */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Car className="text-indigo-600 w-4 h-4" /> My Showroom Purchases
            </h3>
            
            {myPurchases.length > 0 ? (
              <div className="divide-y divide-slate-50 font-semibold text-xs text-slate-700">
                {myPurchases.map(deal => (
                  <div key={deal.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900">MSRP: {formatCurrency(deal.totalPrice, currency)}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">Invoice: {deal.invoiceNumber} &bull; Date: {deal.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded uppercase font-black">Handover Complete</span>
                      <button 
                        onClick={() => window.print()}
                        className="p-1 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-pointer"
                        title="Download tax invoice"
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">No historical purchase orders found under this account.</p>
            )}
          </div>

          {/* Service Repair tickets list */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="text-indigo-600 w-4 h-4 animate-spin-slow" /> Active Service Center Logs
            </h3>

            {myRepairs.length > 0 ? (
              <div className="space-y-3">
                {myRepairs.map(ro => (
                  <div key={ro.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs flex justify-between items-center font-semibold">
                    <div>
                      <p className="font-bold text-slate-800">{ro.serviceType} overhaul</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">Assigned Tech: {ro.mechanicName}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider text-white
                        ${ro.status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-500'}
                      `}>
                        {ro.status}
                      </span>
                      <p className="text-[10px] font-bold text-slate-900 mt-1 font-mono">{formatCurrency(ro.totalCost, currency)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">No garage repair tickets are currently open for your vehicles.</p>
            )}
          </div>
        </div>

        {/* Test Drives Right */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4 font-semibold text-xs text-slate-700">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="text-indigo-600 w-4 h-4" /> Booked Road Appointments
          </h3>
          <p className="text-[11px] text-slate-400">Track pending or past road test drives. Ensure to bring your physical driving license.</p>

          <div className="space-y-3">
            {myTestDrives.map(td => (
              <div key={td.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-2">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-800">📅 {td.date}</span>
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase text-white
                    ${td.status === 'Completed' ? 'bg-slate-400' : 'bg-indigo-500'}
                  `}>
                    {td.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 space-y-1 font-semibold">
                  <p>🕒 Time: {td.time}</p>
                  <p>👤 Advisor: {td.salespersonName}</p>
                </div>
              </div>
            ))}
            
            {myTestDrives.length === 0 && (
              <p className="text-[11px] text-slate-400 italic">No active test drive appointments scheduled.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
