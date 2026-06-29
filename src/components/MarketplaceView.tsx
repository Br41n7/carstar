/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Car, 
  Heart, 
  Calculator, 
  ChevronRight, 
  Plus, 
  Minus, 
  Check, 
  FileText, 
  Bookmark, 
  TrendingUp, 
  ArrowRightLeft,
  Wrench,
  Fuel,
  Settings,
  Gauge
} from 'lucide-react';
import { Vehicle } from '../types';
import { formatCurrency } from '../utils';

interface MarketplaceViewProps {
  vehicles: Vehicle[];
  onBookTestDrive: (vehicleId: string) => void;
  onReserveVehicle: (vehicleId: string, deposit: number) => void;
  currency: 'USD' | 'NGN' | 'KES' | 'GHS';
}

export default function MarketplaceView({
  vehicles,
  onBookTestDrive,
  onReserveVehicle,
  currency,
}: MarketplaceViewProps) {
  // Advanced filters state
  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('All');
  const [filterBody, setFilterBody] = useState('All');
  const [filterTransmission, setFilterTransmission] = useState('All');
  const [filterPrice, setFilterPrice] = useState(100000); // Max Price

  // Selected vehicle for details
  const [activeCar, setActiveCar] = useState<Vehicle | null>(null);

  // Compare state (up to 3 cars can be selected)
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareGrid, setShowCompareGrid] = useState(false);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>([]);

  // Finance Calculator state
  const [loanTerm, setLoanTerm] = useState(36);
  const [downPayment, setDownPayment] = useState(5000);
  const [interestRate, setInterestRate] = useState(5.5);

  // Filters logic
  const availableInventory = vehicles.filter(v => v.status === 'Available');

  const filtered = availableInventory.filter(v => {
    const matchesSearch = v.brand.toLowerCase().includes(search.toLowerCase()) || v.model.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = filterBrand === 'All' || v.brand === filterBrand;
    const matchesBody = filterBody === 'All' || v.bodyType === filterBody;
    const matchesTrans = filterTransmission === 'All' || v.transmission === filterTransmission;
    const matchesPrice = (v.price - v.discount) <= filterPrice;

    return matchesSearch && matchesBrand && matchesBody && matchesTrans && matchesPrice;
  });

  const brands = ['All', ...new Set(availableInventory.map(v => v.brand))];
  const bodies = ['All', ...new Set(availableInventory.map(v => v.bodyType))];

  // Compare toggling
  const toggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter(item => item !== id));
    } else {
      if (compareList.length < 3) {
        setCompareList([...compareList, id]);
      }
    }
  };

  // Bookmark favorites toggle
  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(item => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Financing formula for active car details
  const getMonthlyFinancing = (carPrice: number) => {
    const principal = carPrice - downPayment;
    const monthlyRate = (interestRate / 100) / 12;
    if (principal <= 0) return 0;
    if (monthlyRate === 0) return principal / loanTerm;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
  };

  return (
    <div className="space-y-8">
      {/* Upper Marketing banner */}
      <div className="relative rounded-3xl overflow-hidden aspect-video max-h-[250px] bg-slate-950 text-white p-6 flex flex-col justify-center border border-slate-900 shadow-xl">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        
        <div className="relative max-w-lg space-y-2 z-10">
          <span className="text-[10px] uppercase font-black bg-indigo-600 px-2.5 py-0.5 rounded text-indigo-100 tracking-wider">Summer Clearance Event 2026</span>
          <h2 className="text-xl md:text-2xl font-black tracking-tight leading-tight">Find Your Ultimate Certified Luxury Vehicle</h2>
          <p className="text-xs text-slate-300 leading-normal font-medium">Bespoke imports, premium physical multi-point safety clearing, and direct dealer interest rates.</p>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-semibold">
          {/* Search */}
          <div className="col-span-1 md:col-span-2 relative">
            <input
              type="text"
              placeholder="Search by brand or model name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              id="marketplace-search-input"
            />
          </div>

          {/* Brand select */}
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700"
            id="marketplace-brand-dropdown"
          >
            <option value="All">All Manufacturers</option>
            {brands.filter(b => b !== 'All').map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {/* Body select */}
          <select
            value={filterBody}
            onChange={(e) => setFilterBody(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700"
            id="marketplace-body-dropdown"
          >
            <option value="All">All Categories</option>
            {bodies.filter(bt => bt !== 'All').map(bt => (
              <option key={bt} value={bt}>{bt}</option>
            ))}
          </select>
        </div>

        {/* Max price filter slider */}
        <div className="pt-2 border-t border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-bold text-slate-600">
          <div className="flex-1 w-full space-y-1">
            <div className="flex justify-between">
              <span>Maximum Budget:</span>
              <span className="text-indigo-600 font-extrabold">{formatCurrency(filterPrice, currency)}</span>
            </div>
            <input
              type="range" min={15000} max={100000} step={2000}
              value={filterPrice}
              onChange={(e) => setFilterPrice(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Comparison trigger check */}
          {compareList.length > 0 && (
            <button
              onClick={() => setShowCompareGrid(true)}
              className="flex items-center gap-1.5 bg-indigo-600 text-white px-3.5 py-1.5 rounded-xl font-bold cursor-pointer transition-colors"
              id="btn-trigger-compare"
            >
              <ArrowRightLeft size={13} />
              Compare ({compareList.length}/3 cars)
            </button>
          )}
        </div>
      </div>

      {/* Grid of Available Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(car => {
          const isFav = favorites.includes(car.id);
          const isComp = compareList.includes(car.id);
          const finalPrice = car.price - car.discount;

          return (
            <div 
              key={car.id} 
              id={`market-car-card-${car.id}`}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-44 bg-slate-100">
                <img src={car.images[0]} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                
                {/* Bookmarks & Compare overlays */}
                <button
                  onClick={() => toggleFavorite(car.id)}
                  className={`absolute top-3 left-3 p-1.5 rounded-full backdrop-blur-sm shadow-sm border cursor-pointer transition-all
                    ${isFav ? 'bg-red-500 text-white border-red-500' : 'bg-white/90 text-slate-400 border-slate-100 hover:text-red-500'}
                  `}
                >
                  <Heart size={14} fill={isFav ? 'currentColor' : 'transparent'} />
                </button>

                <button
                  onClick={() => toggleCompare(car.id)}
                  className={`absolute top-3 right-3 text-[9px] font-black uppercase px-2 py-1 rounded-md backdrop-blur-sm shadow-sm border cursor-pointer transition-all
                    ${isComp ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white/90 text-slate-500 border-slate-100'}
                  `}
                >
                  {isComp ? 'Selected ✓' : '+ Compare'}
                </button>
              </div>

              {/* Specs & pricing */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{car.year} {car.brand} {car.model}</h4>
                      <p className="text-[11px] text-slate-400 font-bold">{car.trim}</p>
                    </div>
                    <span className="text-sm font-black text-indigo-600 font-mono">{formatCurrency(finalPrice, currency)}</span>
                  </div>

                  {/* Standard badges row */}
                  <div className="grid grid-cols-2 gap-2 my-4 text-[10px] font-bold text-slate-500 border-t border-slate-50 pt-3">
                    <div className="flex items-center gap-1.5"><Gauge size={13} /> {car.mileage.toLocaleString()} mi</div>
                    <div className="flex items-center gap-1.5"><Fuel size={13} /> {car.fuelType}</div>
                    <div className="flex items-center gap-1.5"><Settings size={13} /> {car.transmission}</div>
                    <div className="flex items-center gap-1.5"><Check size={13} /> {car.condition}</div>
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  <button
                    onClick={() => setActiveCar(car)}
                    className="w-full flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                    id={`btn-market-explore-${car.id}`}
                  >
                    <span>Inspect Vehicle specs</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-slate-400 font-semibold text-xs italic">No vehicles match current budget/filters. Try raising the maximum price.</p>
        )}
      </div>

      {/* Compare Side-by-Side Sheet dialog */}
      {showCompareGrid && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-5 shadow-2xl overflow-x-auto text-xs font-semibold">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Side-by-Side Model Comparison</h3>
              <button 
                onClick={() => setShowCompareGrid(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                Close
              </button>
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400">
                  <th className="py-2">Specifications</th>
                  {compareList.map(cid => {
                    const car = vehicles.find(v => v.id === cid);
                    return (
                      <th key={cid} className="py-2 text-slate-800">{car?.brand} {car?.model}</th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700 font-semibold">
                <tr>
                  <td className="py-2 text-slate-400">Price Ask</td>
                  {compareList.map(cid => {
                    const car = vehicles.find(v => v.id === cid);
                    return <td key={cid} className="py-2 text-indigo-600 font-extrabold">{car ? formatCurrency(car.price - car.discount, currency) : ''}</td>;
                  })}
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">Model Year</td>
                  {compareList.map(cid => {
                    const car = vehicles.find(v => v.id === cid);
                    return <td key={cid} className="py-2">{car?.year}</td>;
                  })}
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">Odometer mileage</td>
                  {compareList.map(cid => {
                    const car = vehicles.find(v => v.id === cid);
                    return <td key={cid} className="py-2 font-mono">{car?.mileage.toLocaleString()} mi</td>;
                  })}
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">Engine / Output</td>
                  {compareList.map(cid => {
                    const car = vehicles.find(v => v.id === cid);
                    return <td key={cid} className="py-2">{car?.engineCapacity} ({car?.horsepower} HP)</td>;
                  })}
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">Fuel & Transmission</td>
                  {compareList.map(cid => {
                    const car = vehicles.find(v => v.id === cid);
                    return <td key={cid} className="py-2">{car?.fuelType} &bull; {car?.transmission}</td>;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Car Specs Details modal with integrated down payment calculator */}
      {activeCar && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row">
            
            {/* Visuals left column */}
            <div className="md:w-1/2 bg-slate-950 text-white p-6 flex flex-col justify-between rounded-t-3xl md:rounded-t-none md:rounded-l-3xl">
              <div>
                <img src={activeCar.images[0]} alt="" referrerPolicy="no-referrer" className="rounded-2xl aspect-video object-cover w-full shadow-md" />
                <div className="mt-5 space-y-2.5 text-xs font-semibold">
                  <h4 className="text-slate-400 uppercase font-bold text-[9px] tracking-wider">Features included</h4>
                  <ul className="grid grid-cols-2 gap-2 text-slate-300">
                    {activeCar.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">✓ {f}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 mt-6 flex justify-between items-center text-xs">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Warranty coverage</p>
                  <p className="font-extrabold text-white mt-0.5">{activeCar.warranty}</p>
                </div>
              </div>
            </div>

            {/* Calculations & Bookings right column */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between text-xs font-semibold text-slate-700">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{activeCar.year} {activeCar.brand} {activeCar.model}</h3>
                    <p className="text-xs text-slate-500 font-bold">{activeCar.trim}</p>
                  </div>
                  <button 
                    onClick={() => setActiveCar(null)}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
                  >
                    Close
                  </button>
                </div>

                {/* Custom downpayment calculator block */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <Calculator className="text-indigo-600 w-4 h-4" /> Live Financing Estimate
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Down Payment ($)</label>
                      <input
                        type="number"
                        value={downPayment}
                        onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Interest APR %</label>
                      <input
                        type="number" step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/50">
                    <span className="font-bold text-slate-500">Estimated Monthly:</span>
                    <span className="font-mono text-indigo-600 font-extrabold text-sm">{formatCurrency(getMonthlyFinancing(activeCar.price - activeCar.discount), currency)} / mo</span>
                  </div>
                </div>

                {/* Booking actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      onBookTestDrive(activeCar.id);
                      setActiveCar(null);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-xs text-center"
                    id="btn-book-trial-modal"
                  >
                    Schedule Test Drive
                  </button>

                  <button
                    onClick={() => {
                      onReserveVehicle(activeCar.id, 2500);
                      setActiveCar(null);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-md text-center"
                    id="btn-reserve-car-modal"
                  >
                    Reserve with Deposit
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-slate-400 block font-bold uppercase">Cash Selling Price</span>
                  <span className="text-lg font-black text-slate-900">{formatCurrency(activeCar.price - activeCar.discount, currency)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
