/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Grid, 
  List, 
  Plus, 
  Edit, 
  Printer, 
  QrCode, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  ShieldAlert, 
  Fuel, 
  Gauge, 
  Settings, 
  History, 
  X,
  FileText,
  RotateCw,
  Eye,
  CheckCircle,
  AlertTriangle,
  Upload,
  Trash2
} from 'lucide-react';
import { Vehicle, VehicleCondition, VehicleStatus, VehicleDocument, ServiceRecord } from '../types';
import { formatCurrency, getSVGQRCode, getWindowStickerHTML, DealerAISimulator } from '../utils';

interface InventoryViewProps {
  vehicles: Vehicle[];
  onAddVehicle: (vehicle: Vehicle) => void;
  onUpdateVehicle: (vehicle: Vehicle) => void;
  currentRole: string;
  activeBranchId: string;
  currency: 'USD' | 'NGN' | 'KES' | 'GHS';
}

export default function InventoryView({
  vehicles,
  onAddVehicle,
  onUpdateVehicle,
  currentRole,
  activeBranchId,
  currency,
}: InventoryViewProps) {
  // State variables for inventory
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedBodyType, setSelectedBodyType] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Selected Vehicle for detail modal
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  // Interactive 360 simulation index
  const [rotationIndex, setRotationIndex] = useState(0);

  // Forms state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [aiGeneratedDescription, setAiGeneratedDescription] = useState('');

  // Add Car form state
  const [newCar, setNewCar] = useState<Partial<Vehicle>>({
    brand: '', model: '', trim: '', year: 2024, mileage: 0,
    fuelType: 'Petrol', transmission: 'Automatic', color: '',
    bodyType: 'SUV', driveType: 'AWD', horsepower: 200,
    engineCapacity: '2.0L', condition: 'New', price: 25000,
    discount: 0, purchaseCost: 18000, expectedProfit: 7000,
    status: 'Available', features: [], warranty: '1 Year Warranty',
    ownershipHistory: 'None', images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'],
    vin: '', plateNumber: '', engineNumber: '', chassisNumber: '',
    serviceRecords: [], documents: [], qrCodeUrl: ''
  });

  // Edit Car state
  const [editingCar, setEditingCar] = useState<Vehicle | null>(null);

  // Drag and drop states for file upload
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processImageFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewCar(prev => ({
            ...prev,
            images: [event.target?.result as string]
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setNewCar(prev => ({
      ...prev,
      images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800']
    }));
  };

  // Unique list of Brands and Body types for filters
  const brands = ['All', ...new Set(vehicles.map(v => v.brand))];
  const bodyTypes = ['All', ...new Set(vehicles.map(v => v.bodyType))];

  // Filter logic
  const filteredVehicles = vehicles.filter(v => {
    // Branch boundary: Super Admin sees all, others see branch specific
    if (currentRole !== 'Super Admin' && v.branchId !== activeBranchId) return false;

    const matchesSearch = v.brand.toLowerCase().includes(search.toLowerCase()) || 
                          v.model.toLowerCase().includes(search.toLowerCase()) ||
                          v.vin.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = selectedBrand === 'All' || v.brand === selectedBrand;
    const matchesBody = selectedBodyType === 'All' || v.bodyType === selectedBodyType;
    const matchesCondition = selectedCondition === 'All' || v.condition === selectedCondition;
    const matchesStatus = selectedStatus === 'All' || v.status === selectedStatus;

    return matchesSearch && matchesBrand && matchesBody && matchesCondition && matchesStatus;
  });

  // Handle printing window sticker
  const handlePrintSticker = (vehicle: Vehicle) => {
    const stickerHtml = getWindowStickerHTML(vehicle, currency);
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(stickerHtml);
      win.document.close();
    }
  };

  // Generate smart marketing copywriting on vehicle details
  const triggerAIDescription = (vehicle: Vehicle) => {
    const desc = DealerAISimulator.generateDescription(vehicle);
    setAiGeneratedDescription(desc);
  };

  // Submit new vehicle
  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Vehicle = {
      ...newCar,
      id: 'v_' + Date.now(),
      branchId: activeBranchId,
      arrivalDate: new Date().toISOString().split('T')[0],
      features: (newCar.features as string[]) || ['Leather Seats', 'ABS', 'Adaptive Cruise Control'],
    } as Vehicle;

    onAddVehicle(created);
    setShowAddModal(false);
    // Reset
    setNewCar({
      brand: '', model: '', trim: '', year: 2024, mileage: 0,
      fuelType: 'Petrol', transmission: 'Automatic', color: '',
      bodyType: 'SUV', driveType: 'AWD', horsepower: 200,
      engineCapacity: '2.0L', condition: 'New', price: 25000,
      discount: 0, purchaseCost: 18000, expectedProfit: 7000,
      status: 'Available', features: [], warranty: '1 Year Warranty',
      ownershipHistory: 'None', images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'],
      vin: '', plateNumber: '', engineNumber: '', chassisNumber: '',
      serviceRecords: [], documents: [], qrCodeUrl: ''
    });
  };

  // Submit edit vehicle
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCar) {
      onUpdateVehicle(editingCar);
      setShowEditModal(false);
      if (selectedVehicle?.id === editingCar.id) {
        setSelectedVehicle(editingCar);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Car Trigger */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Active Vehicle Stock</h2>
          <p className="text-xs text-slate-500">Track purchase records, conditions, specifications, and print showroom stickers.</p>
        </div>
        {currentRole !== 'Customer' && currentRole !== 'Mechanic' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
            id="btn-add-car"
          >
            <Plus size={16} />
            <span>Acquire & Intake Car</span>
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Global Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-2.5 text-slate-400 w-4.5 h-4.5" />
            <input
              type="text"
              placeholder="Search by Brand, Model or VIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-medium text-slate-800"
              id="inventory-search-input"
            />
          </div>

          {/* Toggle View layout */}
          <div className="flex gap-2.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl border transition-colors ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              id="view-grid-btn"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl border transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              id="view-list-btn"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Dropdowns filters row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-slate-50">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Make</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
              id="filter-brand-dropdown"
            >
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Body Type</label>
            <select
              value={selectedBodyType}
              onChange={(e) => setSelectedBodyType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
              id="filter-body-dropdown"
            >
              {bodyTypes.map(bt => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Condition</label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
              id="filter-condition-dropdown"
            >
              <option value="All">All Conditions</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Certified">Certified Pre-Owned</option>
              <option value="Imported">Imported</option>
              <option value="Local">Local Assembly</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
              id="filter-status-dropdown"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Auction">Auction Block</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid or List Stock Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((car) => {
            const finalPrice = car.price - car.discount;
            return (
              <div 
                key={car.id}
                id={`vehicle-card-${car.id}`}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
              >
                {/* Visual Banner */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img 
                    src={car.images[0]} 
                    alt={`${car.brand} ${car.model}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  {/* Absolute badging overlays */}
                  <span className={`absolute top-3 left-3 px-2 py-1 text-[9px] font-black uppercase tracking-wider rounded-md text-white shadow-sm
                    ${car.status === 'Available' ? 'bg-emerald-500' : ''}
                    ${car.status === 'Reserved' ? 'bg-blue-500' : ''}
                    ${car.status === 'Sold' ? 'bg-slate-600' : ''}
                    ${car.status === 'Maintenance' ? 'bg-amber-500' : ''}
                    ${car.status === 'Auction' ? 'bg-red-500' : ''}
                  `}>
                    {car.status}
                  </span>

                  <span className="absolute top-3 right-3 px-2 py-0.5 text-[9px] font-black bg-white/95 text-slate-800 rounded-md backdrop-blur-sm shadow-sm border border-slate-100">
                    {car.condition}
                  </span>
                </div>

                {/* Card Text Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm leading-tight">{car.year} {car.brand} {car.model}</h4>
                        <p className="text-[11px] text-slate-400 font-medium">{car.trim}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-indigo-600 block">{formatCurrency(finalPrice, currency)}</span>
                        {car.discount > 0 && (
                          <span className="text-[9px] line-through text-slate-400 block">{formatCurrency(car.price, currency)}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 gap-x-1.5 my-4 pt-4 border-t border-slate-50 text-[10px] font-semibold text-slate-500">
                      <div className="flex items-center gap-1.5"><Gauge size={13} className="text-slate-400" /> {car.mileage.toLocaleString()} miles</div>
                      <div className="flex items-center gap-1.5"><Fuel size={13} className="text-slate-400" /> {car.fuelType}</div>
                      <div className="flex items-center gap-1.5"><Settings size={13} className="text-slate-400" /> {car.transmission}</div>
                      <div className="flex items-center gap-1.5"><CheckCircle size={13} className="text-slate-400" /> {car.driveType}</div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setSelectedVehicle(car);
                        setRotationIndex(0);
                        setAiGeneratedDescription('');
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                      id={`btn-view-${car.id}`}
                    >
                      <Eye size={13} />
                      <span>Explore Assets</span>
                    </button>
                    {currentRole !== 'Customer' && (
                      <button
                        onClick={() => {
                          setEditingCar(car);
                          setShowEditModal(true);
                        }}
                        className="px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-all cursor-pointer"
                        id={`btn-edit-${car.id}`}
                      >
                        <Edit size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Mode Table layout */
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Vehicle Details</th>
                  <th className="py-3 px-4">VIN</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Specs</th>
                  <th className="py-3 px-4">Cost Basis</th>
                  <th className="py-3 px-4">Asking Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                {filteredVehicles.map(car => (
                  <tr key={car.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={car.images[0]} alt="" referrerPolicy="no-referrer" className="w-10 h-8 rounded object-cover bg-slate-100" />
                        <div>
                          <p className="font-bold text-slate-900 leading-none">{car.year} {car.brand} {car.model}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{car.trim}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px]">{car.vin}</td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[9px] font-bold">{car.condition}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[10px]">
                      {car.fuelType} &bull; {car.transmission} &bull; {car.mileage.toLocaleString()} mi
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">{formatCurrency(car.purchaseCost, currency)}</td>
                    <td className="py-3 px-4 font-mono text-indigo-600 font-extrabold">{formatCurrency(car.price - car.discount, currency)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider text-white
                        ${car.status === 'Available' ? 'bg-emerald-500' : ''}
                        ${car.status === 'Reserved' ? 'bg-blue-500' : ''}
                        ${car.status === 'Sold' ? 'bg-slate-500' : ''}
                        ${car.status === 'Maintenance' ? 'bg-amber-500' : ''}
                      `}>
                        {car.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedVehicle(car);
                            setRotationIndex(0);
                            setAiGeneratedDescription('');
                          }}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-all cursor-pointer"
                          id={`btn-view-list-${car.id}`}
                        >
                          <Eye size={14} />
                        </button>
                        {currentRole !== 'Customer' && (
                          <button
                            onClick={() => {
                              setEditingCar(car);
                              setShowEditModal(true);
                            }}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-all cursor-pointer"
                            id={`btn-edit-list-${car.id}`}
                          >
                            <Edit size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Explore Asset Modal Dialog */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row">
            {/* Left Column: Interactive Visuals, 360 viewer, QR */}
            <div className="md:w-1/2 bg-slate-950 text-white p-6 flex flex-col justify-between rounded-t-3xl md:rounded-t-none md:rounded-l-3xl">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400">Interactive Showroom View</span>
                  <span className="px-2 py-0.5 text-[8px] bg-indigo-500 text-white rounded font-black uppercase">{selectedVehicle.condition}</span>
                </div>
                
                {/* 360-degree interactive photo simulator */}
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-slate-800">
                  <img 
                    src={selectedVehicle.images[rotationIndex % selectedVehicle.images.length]} 
                    alt="360 view"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-opacity duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  
                  {/* Slider Rotation controls */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <button 
                      onClick={() => setRotationIndex(p => p === 0 ? selectedVehicle.images.length - 1 : p - 1)}
                      className="p-1.5 bg-slate-900/90 hover:bg-slate-800 rounded-lg border border-slate-700/50 text-white text-xs transition-colors cursor-pointer"
                    >
                      &larr; Prev
                    </button>
                    <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                      <RotateCw size={11} className="animate-spin-slow text-indigo-400" />
                      Rotate 360&deg; Model (Asset {rotationIndex + 1}/{selectedVehicle.images.length})
                    </span>
                    <button 
                      onClick={() => setRotationIndex(p => p + 1)}
                      className="p-1.5 bg-slate-900/90 hover:bg-slate-800 rounded-lg border border-slate-700/50 text-white text-xs transition-colors cursor-pointer"
                    >
                      Next &rarr;
                    </button>
                  </div>
                </div>

                {/* SVG QR Code component */}
                <div className="mt-6 flex gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-800/80">
                  <div className="w-16 h-16 bg-white p-1 rounded-lg shrink-0">
                    <div dangerouslySetInnerHTML={{ __html: getSVGQRCode(`autoelite://vin/${selectedVehicle.vin}`) }} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <QrCode size={13} className="text-indigo-400" /> Smart Window QR Code
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">Buyers can scan this code to decode the vehicle specifications and service log on their smart devices instantly.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 mt-6 flex justify-between items-center text-xs">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Dealer Landing Page</p>
                  <p className="font-extrabold text-white mt-0.5">{selectedVehicle.vin}</p>
                </div>
                <button
                  onClick={() => handlePrintSticker(selectedVehicle)}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-black transition-colors cursor-pointer"
                  id="print-sticker-btn"
                >
                  <Printer size={12} />
                  Print Sticker
                </button>
              </div>
            </div>

            {/* Right Column: Detailed Specs, Description Composer, Services, Docs */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{selectedVehicle.year} {selectedVehicle.brand} {selectedVehicle.model}</h3>
                    <p className="text-xs text-slate-500 font-bold">{selectedVehicle.trim}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedVehicle(null)}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div><span className="text-slate-400 block font-bold text-[9px] uppercase">Engine</span><span className="font-bold text-slate-800">{selectedVehicle.engineCapacity}</span></div>
                  <div><span className="text-slate-400 block font-bold text-[9px] uppercase">Drivetrain</span><span className="font-bold text-slate-800">{selectedVehicle.driveType} ({selectedVehicle.horsepower} HP)</span></div>
                  <div><span className="text-slate-400 block font-bold text-[9px] uppercase">Chassis No</span><span className="font-bold text-slate-800 font-mono text-[10px]">{selectedVehicle.chassisNumber}</span></div>
                  <div><span className="text-slate-400 block font-bold text-[9px] uppercase">Color Scheme</span><span className="font-bold text-slate-800">{selectedVehicle.color}</span></div>
                </div>

                {/* Marketing description generator panel */}
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
                      <FileText className="text-indigo-600 w-3.5 h-3.5" /> Description Composer
                    </h4>
                    <button
                      onClick={() => triggerAIDescription(selectedVehicle)}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 font-extrabold flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded cursor-pointer"
                    >
                      Compose Copy &rarr;
                    </button>
                  </div>
                  
                  {aiGeneratedDescription ? (
                    <div className="bg-indigo-50/50 border border-indigo-100 p-3.5 rounded-xl text-xs text-slate-700 leading-relaxed max-h-36 overflow-y-auto font-medium">
                      {aiGeneratedDescription}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400">Click compose to compile a compelling, search-optimized marketing copy powered by local vehicle parameters.</p>
                  )}
                </div>

                {/* Service records list */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2.5 flex items-center gap-1">
                    <History className="text-slate-500 w-3.5 h-3.5" /> Ownership & Service History
                  </h4>
                  <div className="space-y-2 max-h-36 overflow-y-auto scrollbar-thin pr-1">
                    <p className="text-[11px] text-slate-500 italic font-medium leading-relaxed mb-2">"{selectedVehicle.ownershipHistory}"</p>
                    {selectedVehicle.serviceRecords.map((record) => (
                      <div key={record.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-800">{record.type}</p>
                          <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{record.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-800">{formatCurrency(record.cost, currency)}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">{record.date}</p>
                        </div>
                      </div>
                    ))}
                    {selectedVehicle.serviceRecords.length === 0 && (
                      <p className="text-[11px] text-slate-400 italic">No historical service orders logged for this vehicle.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-slate-400 block font-bold uppercase">Total Asking Price</span>
                  <span className="text-lg font-black text-slate-900">{formatCurrency(selectedVehicle.price - selectedVehicle.discount, currency)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedVehicle(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Vehicle Intake Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form 
            onSubmit={handleCreateVehicle}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Vehicle Acquisition & Intake Form</h3>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              {/* Left Column: Specifications */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Specifications</p>
                
                <div>
                  <label className="block text-slate-500 mb-1">VIN (17 characters)</label>
                  <input
                    type="text"
                    required
                    maxLength={17}
                    value={newCar.vin}
                    onChange={(e) => setNewCar({ ...newCar, vin: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono"
                    placeholder="e.g. 1FM5K8GC8KGB00129"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-500 mb-1">Brand/Make</label>
                    <input
                      type="text" required
                      value={newCar.brand}
                      onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      placeholder="e.g. Mercedes-Benz"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Model Name</label>
                    <input
                      type="text" required
                      value={newCar.model}
                      onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      placeholder="e.g. GLE 450"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-500 mb-1">Year</label>
                    <input
                      type="number" required min={1900} max={2027}
                      value={newCar.year}
                      onChange={(e) => setNewCar({ ...newCar, year: parseInt(e.target.value) || 2024 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Trim / Spec</label>
                    <input
                      type="text"
                      value={newCar.trim}
                      onChange={(e) => setNewCar({ ...newCar, trim: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      placeholder="e.g. Sport Premium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-500 mb-1">Exterior Color</label>
                    <input
                      type="text"
                      value={newCar.color}
                      onChange={(e) => setNewCar({ ...newCar, color: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      placeholder="e.g. Obsidian Black"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Mileage (mi)</label>
                    <input
                      type="number" min={0}
                      value={newCar.mileage}
                      onChange={(e) => setNewCar({ ...newCar, mileage: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-500 mb-1">Transmission</label>
                    <select
                      value={newCar.transmission}
                      onChange={(e) => setNewCar({ ...newCar, transmission: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                      <option value="CVT">CVT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Fuel Type</label>
                    <select
                      value={newCar.fuelType}
                      onChange={(e) => setNewCar({ ...newCar, fuelType: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-500 mb-1">Body Type</label>
                    <select
                      value={newCar.bodyType}
                      onChange={(e) => setNewCar({ ...newCar, bodyType: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="SUV">SUV</option>
                      <option value="Sedan">Sedan</option>
                      <option value="Coupe">Coupe</option>
                      <option value="Convertible">Convertible</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Truck">Truck</option>
                      <option value="Van">Van</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Horsepower</label>
                    <input
                      type="number"
                      value={newCar.horsepower}
                      onChange={(e) => setNewCar({ ...newCar, horsepower: parseInt(e.target.value) || 200 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Acquisition, Status, Image Upload */}
              <div className="space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Acquisition & Showroom Status</p>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-500 mb-1">Purchase Cost ($)</label>
                      <input
                        type="number" required
                        value={newCar.purchaseCost}
                        onChange={(e) => setNewCar({ ...newCar, purchaseCost: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Asking MSRP ($)</label>
                      <input
                        type="number" required
                        value={newCar.price}
                        onChange={(e) => setNewCar({ ...newCar, price: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-500 mb-1">Condition</label>
                      <select
                        value={newCar.condition}
                        onChange={(e) => setNewCar({ ...newCar, condition: e.target.value as any })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="New">New</option>
                        <option value="Used">Used</option>
                        <option value="Certified">Certified Pre-Owned</option>
                        <option value="Imported">Imported</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Plate Number</label>
                      <input
                        type="text" required
                        value={newCar.plateNumber}
                        onChange={(e) => setNewCar({ ...newCar, plateNumber: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        placeholder="e.g. LAG-102-AB"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Intake Showroom Status</label>
                    <select
                      value={newCar.status}
                      onChange={(e) => setNewCar({ ...newCar, status: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="Available">Available (For Sale on Online Shop)</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Maintenance">Maintenance / Shop Workshop</option>
                    </select>
                  </div>
                </div>

                {/* Drag and Drop Image Upload Zone */}
                <div className="space-y-1.5 pt-2">
                  <label className="block text-slate-500">Vehicle Image Upload</label>
                  
                  {newCar.images && newCar.images.length > 0 && !newCar.images[0].includes('unsplash.com') ? (
                    <div className="relative border border-slate-200 rounded-2xl overflow-hidden aspect-video group">
                      <img 
                        src={newCar.images[0]} 
                        alt="Uploaded preview" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all shadow-md cursor-pointer animate-fade-in"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`
                        border-2 border-dashed rounded-2xl p-5 text-center flex flex-col items-center justify-center cursor-pointer transition-all min-h-[110px] relative
                        ${dragActive ? 'border-indigo-500 bg-indigo-50/40' : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'}
                      `}
                      onClick={() => document.getElementById('vehicle-image-input')?.click()}
                    >
                      <input 
                        type="file" 
                        id="vehicle-image-input" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                      <Upload className="text-slate-400 mb-1 w-6 h-6 animate-bounce" />
                      <p className="text-[11px] font-bold text-slate-700 leading-tight">Drag and drop car photo</p>
                      <p className="text-[9px] text-slate-400 font-medium mt-0.5">or click to browse your files</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                Finalize Stock Intake
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {showEditModal && editingCar && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form 
            onSubmit={handleSaveEdit}
            className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Modify Vehicle Parameters</h3>
              <button 
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 mb-1">Asking MSRP ($)</label>
                <input
                  type="number" required
                  value={editingCar.price}
                  onChange={(e) => setEditingCar({ ...editingCar, price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Applied Discount ($)</label>
                <input
                  type="number" required
                  value={editingCar.discount}
                  onChange={(e) => setEditingCar({ ...editingCar, discount: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Current Mileage</label>
                <input
                  type="number" required
                  value={editingCar.mileage}
                  onChange={(e) => setEditingCar({ ...editingCar, mileage: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Status</label>
                <select
                  value={editingCar.status}
                  onChange={(e) => setEditingCar({ ...editingCar, status: e.target.value as VehicleStatus })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Sold">Sold</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Auction">Auction Block</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-slate-500 mb-1">Ownership / History Note</label>
                <textarea
                  value={editingCar.ownershipHistory}
                  onChange={(e) => setEditingCar({ ...editingCar, ownershipHistory: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none h-20"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
