/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  DollarSign, 
  User, 
  Car, 
  FileCheck, 
  Printer, 
  PenTool, 
  CheckCircle, 
  Percent, 
  Plus, 
  Info,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  X
} from 'lucide-react';
import { SalesDeal, Customer, Vehicle, UserRole } from '../types';
import { formatCurrency } from '../utils';

interface SalesViewProps {
  sales: SalesDeal[];
  customers: Customer[];
  vehicles: Vehicle[];
  onAddSale: (sale: SalesDeal) => void;
  currentRole: UserRole;
  currency: 'USD' | 'NGN' | 'KES' | 'GHS';
}

export default function SalesView({
  sales,
  customers,
  vehicles,
  onAddSale,
  currentRole,
  currency,
}: SalesViewProps) {
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<SalesDeal | null>(null);

  // New Deal Form State
  const [buyerId, setBuyerId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [dealType, setDealType] = useState<SalesDeal['dealType']>('Cash');
  const [warranty, setWarranty] = useState('Standard 1 Year');
  const [accessories, setAccessories] = useState<string[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Signature states
  const [isSigning, setIsSigning] = useState(false);
  const [signatureSaved, setSignatureSaved] = useState(false);
  const signatureRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive signature logic
  const handleStartSigning = (e: React.MouseEvent) => {
    const canvas = signatureRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        const rect = canvas.getBoundingClientRect();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        setIsSigning(true);
      }
    }
  };

  const handleDrawing = (e: React.MouseEvent) => {
    if (!isSigning) return;
    const canvas = signatureRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const handleStopSigning = () => {
    setIsSigning(false);
  };

  const clearSignature = () => {
    const canvas = signatureRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignatureSaved(false);
      }
    }
  };

  const saveSignature = () => {
    setSignatureSaved(true);
  };

  // Create Sale handler
  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const buyer = customers.find(c => c.id === buyerId);
    const car = vehicles.find(v => v.id === vehicleId);

    if (buyer && car) {
      const sellingPrice = car.price - car.discount;
      const totalPrice = sellingPrice - appliedDiscount + (warranty.includes('3 Years') ? 1500 : 0);
      const commission = Math.round(totalPrice * (currentRole === 'Sales Representative' ? 0.03 : 0.05));

      const deal: SalesDeal = {
        id: 'sd_' + Date.now(),
        vehicleId,
        customerId: buyerId,
        customerName: buyer.name,
        salespersonId: 'e1',
        salespersonName: 'Gbenga Adebayo',
        date: new Date().toISOString().split('T')[0],
        dealType,
        sellingPrice,
        discount: appliedDiscount,
        deposit: totalPrice,
        warrantySelected: warranty,
        accessoriesSelected: accessories,
        totalPrice,
        commission,
        status: signatureSaved ? 'Handed Over' : 'Quotation',
        invoiceNumber: 'INV-2026-0' + Math.floor(Math.random() * 800 + 100),
        signatureData: signatureSaved ? 'SIGNED_ELECTRONICALLY' : undefined
      };

      onAddSale(deal);
      setShowNewDealModal(false);
      // Reset
      setBuyerId('');
      setVehicleId('');
      setAppliedDiscount(0);
      setSignatureSaved(false);
    }
  };

  // Available stock filtered for sales listing (Available ones first)
  const availableCars = vehicles.filter(v => v.status === 'Available');

  return (
    <div className="space-y-6">
      {/* Sales Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Deals & Invoicing</h2>
          <p className="text-xs text-slate-500 font-medium">Issue quotations, calculate agent commissions, and lock down digital handovers.</p>
        </div>
        {currentRole !== 'Customer' && (
          <button
            onClick={() => {
              setShowNewDealModal(true);
              setSignatureSaved(false);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
            id="btn-draft-deal"
          >
            <Plus size={16} />
            <span>Formulate Sales Agreement</span>
          </button>
        )}
      </div>

      {/* Main Splits view: Left is Sales History Ledger, Right is detailed Invoice view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deal listing Left */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-50">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Active Deals & Contracts</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Purchaser</th>
                  <th className="py-3 px-4">Vehicle Attached</th>
                  <th className="py-3 px-4">Deal Structure</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Rep Commission</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                {sales.map((deal) => {
                  const car = vehicles.find(v => v.id === deal.vehicleId);
                  return (
                    <tr key={deal.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-900">{deal.invoiceNumber}</td>
                      <td className="py-3.5 px-4">{deal.customerName}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900">{car?.brand} {car?.model}</span>
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">{car?.vin}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-bold">{deal.dealType}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-900 font-extrabold">{formatCurrency(deal.totalPrice, currency)}</td>
                      <td className="py-3.5 px-4 text-emerald-600 font-bold">{formatCurrency(deal.commission, currency)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider text-white
                          ${deal.status === 'Handed Over' ? 'bg-emerald-500' : 'bg-amber-500'}
                        `}>
                          {deal.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedDeal(deal)}
                          className="text-indigo-600 hover:text-indigo-800 text-[11px] font-bold flex items-center justify-end gap-1 cursor-pointer"
                        >
                          Invoice <ChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Generator Panel Right */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
          {selectedDeal ? (
            <div className="space-y-5">
              <div className="pb-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase">Tax Invoice</span>
                  <h4 className="font-mono text-xs font-bold text-slate-800 mt-2">{selectedDeal.invoiceNumber}</h4>
                </div>
                <button
                  onClick={() => window.print()}
                  className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-pointer"
                >
                  <Printer size={15} />
                </button>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                {/* Dealer info / Buyer info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-bold">Showroom Issuer</p>
                    <p className="font-bold text-slate-800 mt-0.5">AutoElite Lagos Showroom</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Lekki-Epe Expressway, Lagos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400 uppercase font-bold">Billed Purchaser</p>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedDeal.customerName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Corporate Client</p>
                  </div>
                </div>

                {/* Line items details */}
                <div className="border-t border-b border-slate-100 py-3.5 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Base Selling MSRP</span>
                    <span className="font-mono">{formatCurrency(selectedDeal.sellingPrice, currency)}</span>
                  </div>
                  {selectedDeal.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Applied Direct Discount</span>
                      <span className="font-mono">- {formatCurrency(selectedDeal.discount, currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>Warranty Package ({selectedDeal.warrantySelected})</span>
                    <span className="font-mono">{selectedDeal.warrantySelected.includes('3 Years') ? formatCurrency(1500, currency) : '$0'}</span>
                  </div>
                </div>

                {/* Grand total */}
                <div className="flex justify-between items-center bg-slate-900 text-white p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Settled Amount Paid</span>
                  <span className="text-base font-black font-mono">{formatCurrency(selectedDeal.totalPrice, currency)}</span>
                </div>

                {/* Signature status overlay */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <ShieldCheck className="text-emerald-500 w-5 h-5 shrink-0" />
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-800 uppercase">Cryptographic signature status</h5>
                    <p className="text-[9px] text-slate-500 mt-0.5">Electronically verified under Dealer Code AE-0941. Handover authorized by Gbenga Adebayo.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center p-4 text-slate-400 italic">
              <FileCheck size={36} className="text-slate-300 mb-1.5" />
              <p className="text-xs font-bold leading-normal">Select a deal in the table to review cost breakdowns, line items, and generate print-ready tax invoices.</p>
            </div>
          )}
        </div>
      </div>

      {/* Draft New Deal Modal */}
      {showNewDealModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form 
            onSubmit={handleCreateDeal}
            className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 space-y-4 text-xs font-semibold"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Formulate Sales & Finance Contract</h3>
              <button 
                type="button"
                onClick={() => setShowNewDealModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-500 mb-1">Select Purchaser</label>
                <select
                  required
                  value={buyerId}
                  onChange={(e) => setBuyerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="">Choose Buyer...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Vehicle Stock</label>
                <select
                  required
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="">Select Available Car...</option>
                  {availableCars.map(v => (
                    <option key={v.id} value={v.id}>{v.brand} {v.model} ({formatCurrency(v.price - v.discount, currency)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Payment Scheme</label>
                <select
                  value={dealType}
                  onChange={(e) => setDealType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="Cash">Immediate Cash Payment</option>
                  <option value="Financed">Bank / Dealer Financed</option>
                  <option value="Trade-In">Trade-In Exchange valuation</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Applied Dealer Discount ($)</label>
                <input
                  type="number"
                  value={appliedDiscount}
                  onChange={(e) => setAppliedDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Warranty Program</label>
                <select
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="Standard 1 Year">Dealer Standard 1 Year</option>
                  <option value="3 Years Full Comprehensive">3 Years Full Comprehensive (+$1,500)</option>
                  <option value="Manufacturer Direct">Manufacturer Direct</option>
                </select>
              </div>
            </div>

            {/* Electronic signature box */}
            <div className="pt-2">
              <label className="block text-slate-500 mb-1">Required Purchaser Handover Signature</label>
              <div className="bg-slate-100 border border-slate-200 rounded-2xl p-2.5 space-y-2">
                <canvas
                  ref={signatureRef}
                  width={380}
                  height={100}
                  onMouseDown={handleStartSigning}
                  onMouseMove={handleDrawing}
                  onMouseUp={handleStopSigning}
                  onMouseLeave={handleStopSigning}
                  className="w-full bg-white border border-slate-200 rounded-xl cursor-crosshair h-24 touch-none"
                />
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-slate-400">Draw inside the canvas to sign contract.</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold rounded-lg cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={saveSignature}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${signatureSaved ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                    >
                      {signatureSaved ? 'Saved ✓' : 'Save Signature'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewDealModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
              >
                Issue Signed Tax Invoice
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
