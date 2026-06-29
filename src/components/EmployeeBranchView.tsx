/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  UserPlus, 
  Plus, 
  ArrowRightLeft, 
  Percent, 
  TrendingUp, 
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { Employee, Branch, Vehicle, UserRole } from '../types';
import { formatCurrency } from '../utils';

interface EmployeeBranchViewProps {
  employees: Employee[];
  branches: Branch[];
  vehicles: Vehicle[];
  onTransferVehicle: (vehicleId: string, destBranchId: string) => void;
  currentRole: UserRole;
  currency: 'USD' | 'NGN' | 'KES' | 'GHS';
}

export default function EmployeeBranchView({
  employees,
  branches,
  vehicles,
  onTransferVehicle,
  currentRole,
  currency,
}: EmployeeBranchViewProps) {
  const [activeTab, setActiveTab] = useState<'staff' | 'branches'>('staff');
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Transfer form state
  const [transferVehicleId, setTransferVehicleId] = useState('');
  const [transferDestBranchId, setTransferDestBranchId] = useState('');

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transferVehicleId && transferDestBranchId) {
      onTransferVehicle(transferVehicleId, transferDestBranchId);
      setShowTransferModal(false);
      setTransferVehicleId('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab selecting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Staff & Showroom Branches</h2>
          <p className="text-xs text-slate-500 font-medium">Verify employee sales targets, mark rosters, and route vehicles across physical showrooms.</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'staff' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            id="tab-staff-btn"
          >
            Staff Directory & Targets
          </button>
          <button
            onClick={() => setActiveTab('branches')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'branches' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            id="tab-branches-btn"
          >
            Showrooms & Logistics
          </button>
        </div>
      </div>

      {activeTab === 'staff' ? (
        /* Staff Directory with targets metrics meters */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map(emp => {
            const hasTargets = emp.targets.monthlySalesCount > 0;
            const targetSalesProgress = hasTargets ? (emp.targets.currentSalesCount / emp.targets.monthlySalesCount) * 100 : 0;
            const targetRevenueProgress = hasTargets ? (emp.targets.currentRevenue / emp.targets.monthlyRevenue) * 100 : 0;

            return (
              <div key={emp.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4 font-semibold text-xs text-slate-700">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-800 text-sm">
                      {emp.name[0]}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{emp.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold">{emp.role} &bull; {emp.department}</p>
                    </div>
                  </div>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase text-white
                    ${emp.attendanceStatus === 'Present' ? 'bg-emerald-500' : 'bg-amber-500'}
                  `}>
                    {emp.attendanceStatus}
                  </span>
                </div>

                <div className="text-[10px] text-slate-500 space-y-1 font-semibold">
                  <p>📞 {emp.phone}</p>
                  <p>✉️ {emp.email}</p>
                </div>

                {hasTargets && (
                  <div className="border-t border-slate-100 pt-3.5 space-y-3">
                    <h5 className="text-[10px] uppercase font-bold text-slate-400">Monthly Targets Achievement</h5>
                    
                    {/* Units target */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-600 font-bold">
                        <span>Vehicles Sold:</span>
                        <span>{emp.targets.currentSalesCount} / {emp.targets.monthlySalesCount} units</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-full rounded-full" 
                          style={{ width: `${Math.min(100, targetSalesProgress)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Revenue target */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-600 font-bold">
                        <span>Showroom Revenue:</span>
                        <span>{formatCurrency(emp.targets.currentRevenue, currency)} / {formatCurrency(emp.targets.monthlyRevenue, currency)}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full" 
                          style={{ width: `${Math.min(100, targetRevenueProgress)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Showrooms list & Logistics vehicles transfers */
        <div className="space-y-4">
          {currentRole !== 'Customer' && (
            <div className="flex justify-between items-center bg-white p-4 border border-slate-100 rounded-2xl shadow-sm">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <ArrowRightLeft className="text-indigo-600 w-4.5 h-4.5" /> Inter-branch logistics control. Move vehicles to meet target demand.
              </span>
              <button
                onClick={() => setShowTransferModal(true)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                id="btn-transfer-vehicle-trigger"
              >
                Transfer Vehicle
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {branches.map(br => {
              const branchVehicles = vehicles.filter(v => v.branchId === br.id);
              const branchValue = branchVehicles.reduce((sum, v) => sum + v.purchaseCost, 0);

              return (
                <div key={br.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4 font-semibold text-xs text-slate-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{br.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold">{br.address}</p>
                    </div>
                    <MapPin className="text-indigo-600 w-4.5 h-4.5" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold text-slate-700">
                    <div>
                      <span className="text-[9px] uppercase text-slate-400">Total Cars</span>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{branchVehicles.length}</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-400">Assets Valuation</span>
                      <p className="text-sm font-black text-indigo-600 mt-0.5 font-mono">{formatCurrency(branchValue, currency)}</p>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 space-y-1 font-semibold">
                    <p>💼 Manager: {br.manager}</p>
                    <p>📞 Phone: {br.phone}</p>
                    <p>✉️ Email: {br.email}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transfer Vehicle Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form 
            onSubmit={handleTransferSubmit}
            className="bg-white rounded-3xl max-w-sm w-full shadow-2xl p-6 space-y-4 text-xs font-semibold"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Inter-showroom Fleet Transfer</h3>
              <button 
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-500 mb-1">Select Transit Vehicle</label>
                <select
                  required
                  value={transferVehicleId}
                  onChange={(e) => setTransferVehicleId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="">Choose Car...</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plateNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Destination Branch</label>
                <select
                  required
                  value={transferDestBranchId}
                  onChange={(e) => setTransferDestBranchId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="">Select Destination Showroom...</option>
                  {branches.map(br => (
                    <option key={br.id} value={br.id}>{br.name.split(' - ')[0]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
              >
                Authorize Transit Transfer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
