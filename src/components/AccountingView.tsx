/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Percent, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle,
  PiggyBank,
  Briefcase
} from 'lucide-react';
import { SalesDeal, Expense, Employee, UserRole } from '../types';
import { formatCurrency } from '../utils';

interface AccountingViewProps {
  sales: SalesDeal[];
  expenses: Expense[];
  employees: Employee[];
  currency: 'USD' | 'NGN' | 'KES' | 'GHS';
}

export default function AccountingView({
  sales,
  expenses,
  employees,
  currency,
}: AccountingViewProps) {
  // 1. Calculations
  const revenue = sales.reduce((sum, s) => sum + s.totalPrice, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const directCommissions = sales.reduce((sum, s) => sum + s.commission, 0);
  const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);
  
  const netEarnings = revenue - totalExpenses - directCommissions - totalPayroll;

  // Expense Categories mapping
  const expenseCategories = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Accounting Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Financial Accounting Ledger</h2>
          <p className="text-xs text-slate-500 font-medium">Monitor cash flows, balance sheets, payroll targets, and tax filing drafts.</p>
        </div>
      </div>

      {/* Ratios row widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(revenue, currency)}</h3>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">✓ Active Cycle</span>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operational Expenses</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalExpenses, currency)}</h3>
          <span className="text-[10px] text-slate-500 mt-1">Marketing, logistics, rentals</span>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Payroll & Overheads</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalPayroll + directCommissions, currency)}</h3>
          <span className="text-[10px] text-indigo-600 font-bold mt-1">Includes sales agent commissions</span>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Adjusted Net Earnings</p>
          <h3 className={`text-2xl font-black mt-1 ${netEarnings >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {formatCurrency(netEarnings, currency)}
          </h3>
          <span className="text-[10px] text-slate-500 mt-1">Landed profit after all overheads</span>
        </div>
      </div>

      {/* Main Analysis grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expenses List Left */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Direct Expenditures Ledgers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Recurrency</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                {expenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-slate-50/40">
                    <td className="py-2.5 px-3 font-mono text-[10px]">{exp.date}</td>
                    <td className="py-2.5 px-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[9px] font-bold">{exp.category}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-medium">{exp.description}</td>
                    <td className="py-2.5 px-3 text-slate-400 text-[10px]">{exp.isRecurring ? 'Monthly Auto' : 'One-time'}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-900">{formatCurrency(exp.amount, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses Category breakdown donut and staff commissions list */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-5">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <PiggyBank className="text-indigo-600 w-4 h-4" /> Expenditures Breakdown
          </h3>

          <div className="space-y-3">
            {Object.entries(expenseCategories).map(([cat, val]) => (
              <div key={cat} className="space-y-1.5 text-xs font-semibold">
                <div className="flex justify-between text-slate-600">
                  <span>{cat}</span>
                  <span className="font-mono text-slate-800">{formatCurrency(val, currency)}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full" 
                    style={{ width: `${totalExpenses ? (val / totalExpenses) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="text-slate-500 w-4 h-4" /> Commission & Payroll Roster
            </h3>
            {employees.map(emp => {
              // calculate aggregate commission generated
              const commMade = sales.filter(s => s.salespersonId === emp.id).reduce((sum, s) => sum + s.commission, 0);
              return (
                <div key={emp.id} className="flex justify-between items-center text-xs pb-2 border-b border-slate-50 font-semibold">
                  <div>
                    <p className="font-bold text-slate-800">{emp.name}</p>
                    <p className="text-[9px] text-slate-400">{emp.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 font-mono">Base: {formatCurrency(emp.salary, currency)}</p>
                    {commMade > 0 && <p className="text-[10px] text-emerald-600 font-bold font-mono">Comm: +{formatCurrency(commMade, currency)}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
