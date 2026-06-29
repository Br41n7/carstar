/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Truck, 
  DollarSign, 
  ArrowUpRight, 
  Plus, 
  Info, 
  ShieldAlert, 
  Scale, 
  Users,
  Percent,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Supplier, Vehicle, UserRole } from '../types';
import { formatCurrency } from '../utils';

interface PurchasingViewProps {
  vehicles: Vehicle[];
  suppliers: Supplier[];
  onAddVehicle: (vehicle: Vehicle) => void;
  currentRole: UserRole;
  currency: 'USD' | 'NGN' | 'KES' | 'GHS';
}

export default function PurchasingView({
  vehicles,
  suppliers,
  onAddVehicle,
  currentRole,
  currency,
}: PurchasingViewProps) {
  // Purchasing state
  const [purchaseCost, setPurchaseCost] = useState(25000);
  const [shipping, setShipping] = useState(1500);
  const [taxes, setTaxes] = useState(500);
  const [importDuties, setImportDuties] = useState(3000);
  const [inspections, setInspections] = useState(200);

  // Valuation simulation
  const [tradeInBrand, setTradeInBrand] = useState('Toyota');
  const [tradeInYear, setTradeInYear] = useState(2018);
  const [tradeInMileage, setTradeInMileage] = useState(65000);
  const [tradeInCondition, setTradeInCondition] = useState<'Excellent' | 'Good' | 'Fair' | 'Poor'>('Good');
  const [simulatedTradeInValue, setSimulatedTradeInValue] = useState<number | null>(null);

  const calculateTotalCost = () => {
    return purchaseCost + shipping + taxes + importDuties + inspections;
  };

  const handleSimulateTradeIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Trade-in appraisal algorithm
    let baseVal = 22000;
    if (tradeInBrand === 'Mercedes-Benz' || tradeInBrand === 'BMW') baseVal = 32000;
    if (tradeInBrand === 'Ford') baseVal = 18000;

    const ageDep = Math.max(0.4, 1 - (2026 - tradeInYear) * 0.08);
    const mileDep = Math.max(0.5, 1 - (tradeInMileage / 200000) * 0.45);
    
    let condMult = 1.0;
    if (tradeInCondition === 'Excellent') condMult = 1.15;
    if (tradeInCondition === 'Fair') condMult = 0.8;
    if (tradeInCondition === 'Poor') condMult = 0.55;

    const finalVal = Math.round((baseVal * ageDep * mileDep * condMult) / 100) * 100;
    setSimulatedTradeInValue(finalVal);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Acquisitions & Appraisals</h2>
          <p className="text-xs text-slate-500">Track inbound customs shipping clearances, appraisal trade-ins, and supplier books.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Breakdown & Acquisition Intake Left */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="text-indigo-600 w-4 h-4" /> Import Cost Breakdown Sheet
            </h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">Lagos Port Terminal</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-400 mb-1">Base Purchasing Cost ($)</label>
              <input
                type="number"
                value={purchaseCost}
                onChange={(e) => setPurchaseCost(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Customs Import Duties ($)</label>
              <input
                type="number"
                value={importDuties}
                onChange={(e) => setImportDuties(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Ocean/Air Freight Shipping ($)</label>
              <input
                type="number"
                value={shipping}
                onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Quality Inspection Certifications ($)</label>
              <input
                type="number"
                value={inspections}
                onChange={(e) => setInspections(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>
          </div>

          {/* Grand totals display */}
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex justify-between items-center text-xs">
            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px]">Fully Landed Capital Investment</p>
              <p className="text-xl font-black text-slate-900 mt-1 font-mono">{formatCurrency(calculateTotalCost(), currency)}</p>
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px] text-right">MSRP target recommended</p>
              <p className="text-base font-black text-indigo-600 mt-1 text-right font-mono">{formatCurrency(calculateTotalCost() * 1.22, currency)}</p>
            </div>
          </div>
        </div>

        {/* Trade-In Appraisals Valuation simulator Right */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="text-emerald-500 w-4 h-4" /> Live Trade-in Valuator
          </h3>
          <p className="text-[11px] text-slate-400">Perform in-house vehicle appraisals to determine instant buyer trade-in equity allowances.</p>

          <form onSubmit={handleSimulateTradeIn} className="space-y-3.5 text-xs font-semibold">
            <div>
              <label className="block text-slate-400 mb-1">Appraisal Make</label>
              <select
                value={tradeInBrand}
                onChange={(e) => setTradeInBrand(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5"
              >
                <option value="Toyota">Toyota</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="BMW">BMW</option>
                <option value="Ford">Ford</option>
                <option value="Hyundai">Hyundai</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Model Year</label>
                <input
                  type="number" min={2000} max={2026}
                  value={tradeInYear}
                  onChange={(e) => setTradeInYear(parseInt(e.target.value) || 2018)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Odometer mi</label>
                <input
                  type="number"
                  value={tradeInMileage}
                  onChange={(e) => setTradeInMileage(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Visual & Engine Quality</label>
              <select
                value={tradeInCondition}
                onChange={(e) => setTradeInCondition(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold"
              >
                <option value="Excellent">Excellent (No defects, OEM paint)</option>
                <option value="Good">Good (Minor stone chips, clean mechanicals)</option>
                <option value="Fair">Fair (Needs filter service / minor dings)</option>
                <option value="Poor">Poor (Major scratches, oil leaks)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl transition-all cursor-pointer shadow-sm text-center"
            >
              Analyze Dealer Equity Value
            </button>
          </form>

          {simulatedTradeInValue !== null && (
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-xs space-y-2.5">
              <div className="flex justify-between items-center font-bold text-slate-800">
                <span>Appraised Equity:</span>
                <span className="font-mono text-emerald-700 font-extrabold text-base">{formatCurrency(simulatedTradeInValue, currency)}</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                This valuation represents in-house trade-in buying potential. Value can be applied directly as deposit allowance towards purchase orders.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Supplier Log Sheets */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Users className="text-slate-500 w-4 h-4" /> Global Acquisition Suppliers Directory
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {suppliers.map(sup => (
            <div key={sup.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-2">
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-800">{sup.name}</span>
                <span className="text-[8px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded uppercase">{sup.type}</span>
              </div>
              <div className="text-slate-400 text-[10px] space-y-1 font-semibold">
                <p>👤 {sup.contactPerson}</p>
                <p>📞 {sup.phone}</p>
                <p>✉️ {sup.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
