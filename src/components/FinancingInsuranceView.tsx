/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calculator, 
  ShieldAlert, 
  Percent, 
  FileCheck, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { FinanceDeal, InsurancePolicy, Vehicle, Customer } from '../types';
import { formatCurrency } from '../utils';

interface FinancingInsuranceViewProps {
  financeDeals: FinanceDeal[];
  insurancePolicies: InsurancePolicy[];
  vehicles: Vehicle[];
  customers: Customer[];
  currency: 'USD' | 'NGN' | 'KES' | 'GHS';
}

export default function FinancingInsuranceView({
  financeDeals,
  insurancePolicies,
  vehicles,
  customers,
  currency,
}: FinancingInsuranceViewProps) {
  // Calculator state
  const [calcVehiclePrice, setCalcVehiclePrice] = useState(45000);
  const [calcDownPayment, setCalcDownPayment] = useState(5000);
  const [calcInterestRate, setCalcInterestRate] = useState(5.5);
  const [calcTermMonths, setCalcTermMonths] = useState(36);

  // Calculate monthly payment formula
  const principal = calcVehiclePrice - calcDownPayment;
  const monthlyRate = (calcInterestRate / 100) / 12;
  const numPayments = calcTermMonths;

  const calculateMonthly = () => {
    if (monthlyRate === 0) return principal / numPayments;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  const calculateTotalInterest = () => {
    const totalPaid = calculateMonthly() * numPayments;
    return totalPaid - principal;
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Financing & Insurance Desk</h2>
          <p className="text-xs text-slate-500 font-medium">Verify credit profiles, calculate interest schedules, and monitor policy expirations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Payment Calculator Left */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="text-indigo-600 w-4 h-4" /> Credit Payment Amortization Calculator
            </h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">Standard Formula</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-400 mb-1">Vehicle Price ($)</label>
              <input
                type="number"
                value={calcVehiclePrice}
                onChange={(e) => setCalcVehiclePrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Down Payment ($)</label>
              <input
                type="number"
                value={calcDownPayment}
                onChange={(e) => setCalcDownPayment(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Annual Interest %</label>
              <input
                type="number" step="0.1"
                value={calcInterestRate}
                onChange={(e) => setCalcInterestRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Term Tenure (Months)</label>
              <select
                value={calcTermMonths}
                onChange={(e) => setCalcTermMonths(parseInt(e.target.value) || 36)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700"
              >
                <option value={12}>12 Months (1 Year)</option>
                <option value={24}>24 Months (2 Years)</option>
                <option value={36}>36 Months (3 Years)</option>
                <option value={48}>48 Months (4 Years)</option>
                <option value={60}>60 Months (5 Years)</option>
              </select>
            </div>
          </div>

          {/* Calculator Results display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-xs">
              <span className="text-[9px] uppercase font-bold text-slate-400">Monthly Payment</span>
              <p className="text-xl font-black text-indigo-900 mt-1 font-mono">{formatCurrency(calculateMonthly(), currency)}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
              <span className="text-[9px] uppercase font-bold text-slate-400">Total Borrowed Amount</span>
              <p className="text-xl font-black text-slate-800 mt-1 font-mono">{formatCurrency(principal, currency)}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
              <span className="text-[9px] uppercase font-bold text-slate-400">Cumulative Interest Accrued</span>
              <p className="text-xl font-black text-slate-800 mt-1 font-mono">{formatCurrency(calculateTotalInterest(), currency)}</p>
            </div>
          </div>
        </div>

        {/* Insurance Coverages Panel Right */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="text-indigo-600 w-4 h-4" /> Active Insurance Bindings
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">Verify premium status and tracking of fleet coverages across showrooms.</p>

          <div className="space-y-3">
            {insurancePolicies.map(policy => {
              const car = vehicles.find(v => v.id === policy.vehicleId);
              return (
                <div key={policy.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-800">{policy.companyName}</span>
                    <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded uppercase">{policy.status}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold space-y-1">
                    <p>🚗 Vehicle: {car ? `${car.brand} ${car.model}` : 'Showroom stock'}</p>
                    <p>🏷️ Policy: {policy.policyNumber}</p>
                    <p>📅 Expiration: {policy.expirationDate}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Credit Deals Registry */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-3">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck className="text-slate-500 w-4 h-4" /> Dealer Financing Credit Ledger
          </h3>
          <span className="text-[9px] bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded font-black uppercase flex items-center gap-1">
            <AlertTriangle size={12} /> Default Warning Trigger Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Deal ID</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Lien Vehicle</th>
                <th className="py-3 px-4">Original Loan</th>
                <th className="py-3 px-4">Term</th>
                <th className="py-3 px-4">Monthly Payment</th>
                <th className="py-3 px-4">Outstanding Balance</th>
                <th className="py-3 px-4 text-right">Lien Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
              {financeDeals.map(deal => {
                const car = vehicles.find(v => v.id === deal.vehicleId);
                const buyer = customers.find(c => c.id === deal.customerId);
                return (
                  <tr key={deal.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono">{deal.id}</td>
                    <td className="py-3 px-4">{buyer?.name || 'Private client'}</td>
                    <td className="py-3 px-4">{car?.brand} {car?.model}</td>
                    <td className="py-3 px-4 font-mono">{formatCurrency(deal.loanAmount, currency)}</td>
                    <td className="py-3 px-4">{deal.termMonths} Months</td>
                    <td className="py-3 px-4 font-mono text-indigo-600 font-extrabold">{formatCurrency(deal.monthlyPayment, currency)}</td>
                    <td className="py-3 px-4 font-mono text-slate-900">{formatCurrency(deal.outstandingBalance, currency)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">{deal.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
