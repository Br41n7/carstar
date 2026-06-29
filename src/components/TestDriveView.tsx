/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Car, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  ShieldAlert,
  FileText,
  X
} from 'lucide-react';
import { TestDrive, Vehicle, Customer, UserRole } from '../types';
import { formatCurrency } from '../utils';

interface TestDriveViewProps {
  testDrives: TestDrive[];
  vehicles: Vehicle[];
  customers: Customer[];
  onAddTestDrive: (td: TestDrive) => void;
  onUpdateTestDriveStatus: (tdId: string, status: TestDrive['status'], result?: TestDrive['result']) => void;
  currentRole: UserRole;
}

export default function TestDriveView({
  testDrives,
  vehicles,
  customers,
  onAddTestDrive,
  onUpdateTestDriveStatus,
  currentRole,
}: TestDriveViewProps) {
  const [showBookModal, setShowBookModal] = useState(false);

  // Form states
  const [customerId, setCustomerId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [date, setDate] = useState('2026-06-28');
  const [time, setTime] = useState('10:00');

  // Create appointment handler
  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === customerId);
    const vehicle = vehicles.find(v => v.id === vehicleId);

    if (customer && vehicle) {
      const appointment: TestDrive = {
        id: 'td_' + Date.now(),
        vehicleId,
        customerId,
        customerName: customer.name,
        salespersonId: 'e1',
        salespersonName: 'Gbenga Adebayo',
        date,
        time,
        status: 'Approved',
        licenseVerified: true
      };

      onAddTestDrive(appointment);
      setShowBookModal(false);
      // Reset
      setCustomerId('');
      setVehicleId('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Test Drives & Appointments</h2>
          <p className="text-xs text-slate-500 font-medium">Coordinate client road trials, verify driving licenses, and log feedback.</p>
        </div>
        {currentRole !== 'Customer' && (
          <button
            onClick={() => setShowBookModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
            id="btn-trigger-book-drive"
          >
            <Plus size={16} /> Book Road Trial
          </button>
        )}
      </div>

      {/* Grid: Calendar listing and Licensing Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main List Column */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-50">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Scheduled Road Trials</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Vehicle Specs</th>
                  <th className="py-3 px-4">Schedule Date</th>
                  <th className="py-3 px-4">Assigned Advisor</th>
                  <th className="py-3 px-4">Licensing Verified</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Outcomes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                {testDrives.map((td) => {
                  const car = vehicles.find(v => v.id === td.vehicleId);
                  return (
                    <tr key={td.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800">{td.customerName}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {car?.brand} {car?.model}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        📅 {td.date} &bull; 🕒 {td.time}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        👤 {td.salespersonName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[9px] font-black uppercase">Yes ✓</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider text-white
                          ${td.status === 'Completed' ? 'bg-emerald-500' : ''}
                          ${td.status === 'Approved' ? 'bg-indigo-500' : ''}
                          ${td.status === 'Scheduled' ? 'bg-amber-500' : ''}
                          ${td.status === 'Cancelled' ? 'bg-slate-400' : ''}
                        `}>
                          {td.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {td.status !== 'Completed' ? (
                          <div className="flex justify-end gap-1.5 text-[9px]">
                            <button
                              onClick={() => onUpdateTestDriveStatus(td.id, 'Completed', 'Purchased')}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold cursor-pointer"
                              id={`btn-complete-buy-${td.id}`}
                            >
                              Won &bull; Buy
                            </button>
                            <button
                              onClick={() => onUpdateTestDriveStatus(td.id, 'Completed', 'Follow-up')}
                              className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold cursor-pointer"
                              id={`btn-complete-follow-${td.id}`}
                            >
                              Follow-up
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-extrabold italic">Logged: {td.result}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calendar Alerts and Feedback overview Right */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="text-amber-500 w-4 h-4" /> Safety & Legal Audit
          </h3>
          
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-2 font-semibold">
            <h4 className="text-[10px] uppercase text-slate-400">Prerequisites Check</h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-1.5">🟢 Verified Physical Driving License</li>
              <li className="flex items-center gap-1.5">🟢 Active Insurance Policy Coverage</li>
              <li className="flex items-center gap-1.5">🟢 Dealer Trade-plates Fitted</li>
              <li className="flex items-center gap-1.5">🟢 Pre-trial Safety Inspections Executed</li>
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Recent Driver Logs & Feedback</h4>
            {testDrives.filter(td => td.feedback).map(td => (
              <div key={td.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1.5 leading-normal font-semibold">
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>{td.customerName}</span>
                  <span>📅 {td.date}</span>
                </div>
                <p className="text-slate-700 italic">"{td.feedback}"</p>
                <div className="flex gap-2">
                  <span className="text-[8px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded uppercase font-bold">Result: {td.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Book Test Drive Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form 
            onSubmit={handleBookSubmit}
            className="bg-white rounded-3xl max-w-sm w-full shadow-2xl p-6 space-y-4 text-xs font-semibold"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Book Test Drive Appointment</h3>
              <button 
                type="button"
                onClick={() => setShowBookModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-500 mb-1">Select Client</label>
                <select
                  required
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="">Select Customer...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Showroom Vehicle</label>
                <select
                  required
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="">Select Vehicle...</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.brand} {v.model}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Appointment Date</label>
                  <input
                    type="date" required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Appointment Time</label>
                  <input
                    type="time" required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowBookModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
              >
                Confirm Appointment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
