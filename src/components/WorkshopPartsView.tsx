/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Wrench, 
  Settings, 
  AlertCircle, 
  Plus, 
  CheckCircle, 
  User, 
  Info, 
  Barcode, 
  Warehouse,
  FileText,
  X
} from 'lucide-react';
import { RepairOrder, PartItem, Vehicle, Employee } from '../types';
import { formatCurrency } from '../utils';

interface WorkshopPartsViewProps {
  repairs: RepairOrder[];
  parts: PartItem[];
  vehicles: Vehicle[];
  employees: Employee[];
  onAddRepair: (ro: RepairOrder) => void;
  onUpdateRepairStatus: (id: string, status: RepairOrder['status']) => void;
  currency: 'USD' | 'NGN' | 'KES' | 'GHS';
}

export default function WorkshopPartsView({
  repairs,
  parts,
  vehicles,
  employees,
  onAddRepair,
  onUpdateRepairStatus,
  currency,
}: WorkshopPartsViewProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'parts'>('orders');
  const [showAddRepairModal, setShowAddRepairModal] = useState(false);

  // Repair Form States
  const [vehicleId, setVehicleId] = useState('');
  const [mechanicId, setMechanicId] = useState('');
  const [serviceType, setServiceType] = useState<RepairOrder['serviceType']>('Oil Change');
  const [laborCost, setLaborCost] = useState(80);
  const [notes, setNotes] = useState('');

  const mechanics = employees.filter(e => e.department === 'Workshop');

  const handleCreateRepair = (e: React.FormEvent) => {
    e.preventDefault();
    const mech = employees.find(emp => emp.id === mechanicId);
    if (vehicleId && mech) {
      const ro: RepairOrder = {
        id: 'ro_' + Date.now(),
        vehicleId,
        mechanicId,
        mechanicName: mech.name,
        date: new Date().toISOString().split('T')[0],
        status: 'Diagnosing',
        serviceType,
        laborCost,
        partsUsed: [],
        totalCost: laborCost,
        notes
      };
      onAddRepair(ro);
      setShowAddRepairModal(false);
      // Reset
      setVehicleId('');
      setMechanicId('');
      setNotes('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab select bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Workshop Garage & Spare Parts</h2>
          <p className="text-xs text-slate-500 font-medium">Log repair orders, delegate diagnostic tasks to mechanics, and manage warehouse spare parts.</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'orders' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            id="tab-workshop-orders-btn"
          >
            Garage Repair Orders
          </button>
          <button
            onClick={() => setActiveTab('parts')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'parts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            id="tab-workshop-parts-btn"
          >
            Spare Parts Stock
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        /* Repair Orders List Tab */
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 border border-slate-100 rounded-2xl shadow-sm">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Wrench className="text-indigo-600 animate-spin-slow w-4.5 h-4.5" /> Maintenance bay tracking. Mechanics can update repair stage on-demand.
            </span>
            <button
              onClick={() => setShowAddRepairModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
              id="btn-add-repair-trigger"
            >
              <Plus size={14} /> Open Repair Order
            </button>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Showroom Vehicle</th>
                    <th className="py-3 px-4">Service Category</th>
                    <th className="py-3 px-4">Allocated Mechanic</th>
                    <th className="py-3 px-4">Diagnostics / Description</th>
                    <th className="py-3 px-4">Cost breakdown</th>
                    <th className="py-3 px-4">Job Status</th>
                    <th className="py-3 px-4 text-right">Progress Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                  {repairs.map(ro => {
                    const car = vehicles.find(v => v.id === ro.vehicleId);
                    return (
                      <tr key={ro.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono">{ro.id}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900">{car?.brand} {car?.model}</span>
                          <p className="text-[9px] text-slate-400 mt-0.5">{car?.plateNumber}</p>
                        </td>
                        <td className="py-3.5 px-4">{ro.serviceType}</td>
                        <td className="py-3.5 px-4">
                          <span className="flex items-center gap-1">👤 {ro.mechanicName}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 max-w-[200px] truncate" title={ro.notes}>
                          {ro.notes}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900">{formatCurrency(ro.totalCost, currency)}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider text-white
                            ${ro.status === 'Completed' ? 'bg-emerald-500' : ''}
                            ${ro.status === 'In Progress' ? 'bg-indigo-500' : ''}
                            ${ro.status === 'Awaiting Parts' ? 'bg-amber-500' : ''}
                            ${ro.status === 'Diagnosing' ? 'bg-purple-500' : ''}
                          `}>
                            {ro.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {ro.status !== 'Completed' && (
                            <select
                              value={ro.status}
                              onChange={(e) => onUpdateRepairStatus(ro.id, e.target.value as any)}
                              className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg p-1 text-[10px] focus:outline-none"
                              id={`select-status-repair-${ro.id}`}
                            >
                              <option value="Diagnosing">Diagnosing</option>
                              <option value="Awaiting Parts">Awaiting Parts</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Mark Completed ✓</option>
                            </select>
                          )}
                          {ro.status === 'Completed' && (
                            <span className="text-[10px] text-emerald-600 font-extrabold flex items-center justify-end gap-0.5">Job Done ✓</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Parts Stock Tab */
        <div className="space-y-4">
          {/* Minimum stock notifications warnings block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {parts.map(p => {
              const isLow = p.stock <= p.minStock;
              return (
                <div 
                  key={p.id} 
                  className={`p-4 border rounded-2xl flex flex-col justify-between font-semibold text-xs
                    ${isLow 
                      ? 'bg-amber-50 border-amber-200 text-amber-900' 
                      : 'bg-white border-slate-100 text-slate-700'
                    }
                  `}
                >
                  <div>
                    <div className="flex justify-between items-start font-bold">
                      <span className="text-sm truncate max-w-[160px]">{p.name}</span>
                      <span className="font-mono text-indigo-600">{formatCurrency(p.unitPrice, currency)}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono flex items-center gap-1"><Barcode size={12} /> {p.partNumber}</p>
                  </div>

                  <div className="flex justify-between items-end mt-4 pt-3 border-t border-slate-50">
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase font-bold">Stock Remaining</p>
                      <span className={`text-base font-black ${isLow ? 'text-amber-600' : 'text-slate-800'}`}>{p.stock} units</span>
                    </div>
                    <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 uppercase flex items-center gap-1"><Warehouse size={11} /> {p.warehouse.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Repair Order Modal */}
      {showAddRepairModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form 
            onSubmit={handleCreateRepair}
            className="bg-white rounded-3xl max-w-sm w-full shadow-2xl p-6 space-y-4 text-xs font-semibold"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Initiate Garage Repair Job</h3>
              <button 
                type="button"
                onClick={() => setShowAddRepairModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-500 mb-1">Select Car for Diagnostics</label>
                <select
                  required
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="">Select Vehicle...</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plateNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Assign Workshop Mechanic</label>
                <select
                  required
                  value={mechanicId}
                  onChange={(e) => setMechanicId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="">Select Mechanic...</option>
                  {mechanics.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Service Type</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5"
                  >
                    <option value="Oil Change">Oil Change</option>
                    <option value="Brake Service">Brake Service</option>
                    <option value="Battery">Battery swap</option>
                    <option value="Engine">Engine overhaul</option>
                    <option value="Tire Rotation">Tire Rotation</option>
                    <option value="Inspection">General Safety Inspection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Estimated Labor Cost ($)</label>
                  <input
                    type="number" required
                    value={laborCost}
                    onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Diagnostic Fault Notes</label>
                <textarea
                  placeholder="Mechanic instructions, e.g. squeaking rear brakes, check fluid levels..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 h-16 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddRepairModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
              >
                Dispatch Mechanic
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
