/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ArrowRight, 
  Car, 
  ShieldCheck, 
  Clock, 
  Award, 
  Key, 
  Wrench, 
  ChevronRight, 
  BadgePercent,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { Vehicle } from '../types';

interface LandingPageViewProps {
  vehicles: Vehicle[];
  onNavigate: (tabId: string) => void;
  onSelectCar?: (car: Vehicle) => void;
}

export default function LandingPageView({
  vehicles,
  onNavigate,
}: LandingPageViewProps) {
  // Get a few available featured premium cars
  const featuredCars = vehicles
    .filter(v => v.status === 'Available')
    .slice(0, 3);

  return (
    <div className="space-y-16 pb-12 animate-fade-in">
      
      {/* 1. Hero Showcase Section */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-950 text-white border border-slate-900 shadow-2xl">
        {/* Subtle grid background accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <Award size={13} /> The Standard of Automotive Excellence
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white max-w-3xl mx-auto">
            Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-white">AutoElite</span> Legacy
          </h1>
          
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-semibold leading-relaxed">
            Discover a curated collection of ultra-premium and high-performance vehicles. Backed by expert support, transparent pricing, and comprehensive elite warranty coverage.
          </p>

          <div className="pt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigate('marketplace')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-indigo-500/10 cursor-pointer transition-all"
              id="hero-browse-btn"
            >
              <span>Explore Marketplace</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 font-extrabold text-xs px-6 py-3.5 rounded-xl cursor-pointer transition-all"
              id="hero-console-btn"
            >
              Enter DMS Console
            </button>
          </div>
        </div>

        {/* Banner Quick Stats Strip */}
        <div className="bg-slate-900/60 border-t border-slate-900 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-850 text-center py-6 text-slate-300 font-bold">
          <div className="p-4">
            <p className="text-2xl font-black text-white font-mono">15,000+</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Premium Deliveries</p>
          </div>
          <div className="p-4">
            <p className="text-2xl font-black text-white font-mono">100-Point</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Quality Inspection</p>
          </div>
          <div className="p-4">
            <p className="text-2xl font-black text-white font-mono">99.4%</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Satisfaction Score</p>
          </div>
          <div className="p-4">
            <p className="text-2xl font-black text-white font-mono">3 Branches</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Showroom Locations</p>
          </div>
        </div>
      </section>

      {/* 2. Brand Core Pillars & Features */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xs uppercase font-black tracking-widest text-indigo-600">Why AutoElite</h2>
          <p className="text-2xl font-black tracking-tight text-slate-900">Designed Around Pure Performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Guaranteed Protection</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Every vehicle undergoes a meticulous 100-point mechanic verification and comes with a minimum 1-year elite warranty option.
            </p>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Streamlined Process</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Skip the exhausting negotiations. View upfront pricing, book active road trial slots, and secure instant digital reservations.
            </p>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BadgePercent size={20} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Direct Trade-Ins</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Receive competitive, clear, and instant valuations on your existing car, seamlessly credited as downpayment equity.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured Premium Cars Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xs uppercase font-black tracking-widest text-indigo-600">Current Collection</h2>
            <p className="text-2xl font-black tracking-tight text-slate-900">Featured Vehicles on the Floor</p>
          </div>
          <button
            onClick={() => onNavigate('marketplace')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline cursor-pointer"
            id="view-all-cars-link"
          >
            <span>View Complete Showroom</span>
            <ChevronRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCars.map((car) => (
            <div 
              key={car.id} 
              className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden group hover:border-indigo-500/20 hover:shadow-md transition-all duration-300"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-900">
                <img 
                  src={car.images[0]} 
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white font-black text-[9px] uppercase px-2.5 py-1 rounded-lg tracking-wider border border-slate-800">
                  {car.year}
                </span>
                <span className="absolute top-3 right-3 bg-indigo-600 text-white font-bold text-[9px] px-2.5 py-1 rounded-lg tracking-wider shadow">
                  {car.condition}
                </span>
              </div>

              <div className="p-5 space-y-4 font-semibold text-xs text-slate-600">
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-tight">{car.brand} {car.model}</h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-wide mt-0.5">{car.trim} &bull; {car.color}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-[10px] font-bold text-center text-slate-500">
                  <div>
                    <p className="text-slate-400 font-medium">Mileage</p>
                    <p className="text-slate-700 mt-0.5 font-mono">{car.mileage.toLocaleString()} mi</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Engine</p>
                    <p className="text-slate-700 mt-0.5">{car.horsepower} HP</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Type</p>
                    <p className="text-slate-700 mt-0.5">{car.transmission.split(' ')[0]}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">List Price</p>
                    <p className="text-base font-black text-slate-900 font-mono">${car.price.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => onNavigate('marketplace')}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Quick Action Pathways Banner */}
      <section className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-center shadow-sm">
        <div className="space-y-2 text-center md:text-left max-w-xl">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Need routine service or trade-in assessment?</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            AutoElite provides direct pathways to book regular preventative diagnostics, claim repair ticket updates, or schedule a customized trade-in evaluation at any of our showfloor locations.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('portal')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center gap-2 shadow cursor-pointer transition-all"
            id="pathway-portal-btn"
          >
            <Calendar size={14} />
            <span>Open Customer Portal</span>
          </button>
          <button
            onClick={() => onNavigate('workshop')}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-xs px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer transition-all"
            id="pathway-workshop-btn"
          >
            <Wrench size={14} />
            <span>Schedule Maintenance</span>
          </button>
        </div>
      </section>

      {/* 5. Contact & Location Information */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100 text-slate-600 font-semibold text-xs">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700">
              <Car size={16} />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">AutoElite Showroom Headquarters</h4>
          </div>
          <p className="leading-relaxed text-slate-500 max-w-sm">
            Visit our prime showroom location to test drive our exclusive line-up in person or coordinate direct secure vehicle delivery and paperwork clearances.
          </p>
          <div className="space-y-2 text-slate-700">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-indigo-600" />
              <span>Plot 12, Lekki Expressway Phase I, Lagos</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-indigo-600" />
              <span>+234 (01) 455-9000 &bull; support@autoelite.com</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl space-y-4 shadow-sm">
          <h4 className="font-extrabold text-sm text-slate-900">Showroom Hours</h4>
          <div className="space-y-2 divide-y divide-slate-50 text-slate-500">
            <div className="flex justify-between py-1.5 font-bold">
              <span>Monday &ndash; Friday</span>
              <span className="text-slate-900 font-mono">08:00 AM &ndash; 06:00 PM</span>
            </div>
            <div className="flex justify-between py-1.5 font-bold">
              <span>Saturday</span>
              <span className="text-slate-900 font-mono">09:00 AM &ndash; 05:00 PM</span>
            </div>
            <div className="flex justify-between py-1.5 font-bold">
              <span>Sunday</span>
              <span className="text-rose-500">Showroom Closed</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
