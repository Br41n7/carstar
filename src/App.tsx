/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  INITIAL_BRANCHES, 
  INITIAL_SUPPLIERS, 
  INITIAL_VEHICLES, 
  INITIAL_CUSTOMERS, 
  INITIAL_LEADS, 
  INITIAL_TEST_DRIVES, 
  INITIAL_RESERVATIONS, 
  INITIAL_FINANCE_DEALS, 
  INITIAL_INSURANCE_POLICIES, 
  INITIAL_REPAIR_ORDERS, 
  INITIAL_PARTS, 
  INITIAL_EXPENSES, 
  INITIAL_SALES_DEALS, 
  INITIAL_EMPLOYEES, 
} from './mockData';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import InventoryView from './components/InventoryView';
import CRMView from './components/CRMView';
import SalesView from './components/SalesView';
import PurchasingView from './components/PurchasingView';
import TestDriveView from './components/TestDriveView';
import FinancingInsuranceView from './components/FinancingInsuranceView';
import WorkshopPartsView from './components/WorkshopPartsView';
import AccountingView from './components/AccountingView';
import EmployeeBranchView from './components/EmployeeBranchView';
import MarketplaceView from './components/MarketplaceView';
import CustomerPortalView from './components/CustomerPortalView';
import LandingPageView from './components/LandingPageView';
import { UserRole, Vehicle, Customer, Lead, TestDrive, RepairOrder, SalesDeal } from './types';
import { Bell, Wallet, ShieldCheck, X } from 'lucide-react';
import { formatCurrency } from './utils';

export default function App() {
  // Current active view tab
  const [activeTab, setActiveTab] = useState('landing');

  // Hardcoded central variables replacing multi-tenant SaaS features
  const currentRole: UserRole = 'Super Admin';
  const selectedBranchId = 'b1';
  const currency = 'USD';

  // Dynamic States for persistent interactions across views
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [sales, setSales] = useState<SalesDeal[]>(INITIAL_SALES_DEALS);
  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [parts, setParts] = useState(INITIAL_PARTS);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [testDrives, setTestDrives] = useState<TestDrive[]>(INITIAL_TEST_DRIVES);
  const [repairs, setRepairs] = useState<RepairOrder[]>(INITIAL_REPAIR_ORDERS);
  const [financeDeals, setFinanceDeals] = useState(INITIAL_FINANCE_DEALS);
  const [insurancePolicies, setInsurancePolicies] = useState(INITIAL_INSURANCE_POLICIES);

  // Showroom Notifications
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Insurance Expiration', message: 'Fleet vehicle LAG-402-AA coverage expires in 4 days.', date: '3h ago', type: 'warning' as const, read: false },
    { id: '2', title: 'New Customer Lead', message: 'Jessica Adeyemi requested premium appraisal for Mercedes GLE.', date: '5h ago', type: 'info' as const, read: false },
    { id: '3', title: 'Maintenance Milestone', message: 'Toyota Camry oil-change has completed servicing.', date: '1d ago', type: 'success' as const, read: true }
  ]);

  // Local Payment checkout modal (simulation)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutVehicle, setCheckoutVehicle] = useState<Vehicle | null>(null);
  const [checkoutAmount, setCheckoutAmount] = useState(0);
  const [paymentProvider, setPaymentProvider] = useState<'Paystack' | 'Flutterwave' | 'Stripe'>('Stripe');

  // Notifications dropdown trigger
  const [showNotifications, setShowNotifications] = useState(false);

  // ---------------- STATE HANDLERS ----------------

  // Add new vehicle stock
  const handleAddVehicle = (newCar: Vehicle) => {
    setVehicles(prev => [newCar, ...prev]);
    const newAlert = {
      id: 'notif_' + Date.now(),
      title: 'New Showroom Arrival',
      message: `${newCar.brand} ${newCar.model} successfully logged to base.`,
      date: 'Just Now',
      type: 'info' as const,
      read: false
    };
    setNotifications(prev => [newAlert, ...prev]);
  };

  // Edit existing vehicle specification
  const handleUpdateVehicle = (editedCar: Vehicle) => {
    setVehicles(prev => prev.map(v => v.id === editedCar.id ? editedCar : v));
  };

  // Add complete Sale (cash or credit)
  const handleAddSale = (newDeal: SalesDeal) => {
    setSales(prev => [newDeal, ...prev]);
    setVehicles(prev => prev.map(v => v.id === newDeal.vehicleId ? { ...v, status: 'Sold' } : v));
    
    const newAlert = {
      id: 'notif_' + Date.now(),
      title: 'Deal Cleared!',
      message: `Invoice ${newDeal.invoiceNumber} signed by ${newDeal.customerName}.`,
      date: 'Just Now',
      type: 'success' as const,
      read: false
    };
    setNotifications(prev => [newAlert, ...prev]);
  };

  // Book a test drive road trial
  const handleAddTestDrive = (td: TestDrive) => {
    setTestDrives(prev => [td, ...prev]);
  };

  // Complete/cancel road test drive appointment
  const handleUpdateTestDriveStatus = (tdId: string, status: TestDrive['status'], result?: TestDrive['result']) => {
    setTestDrives(prev => prev.map(item => item.id === tdId ? { ...item, status, result, feedback: result === 'Purchased' ? 'Absolutely loved the responsive acceleration and active display cluster.' : undefined } : item));
  };

  // Open maintenance workshop ticket
  const handleAddRepair = (ro: RepairOrder) => {
    setRepairs(prev => [ro, ...prev]);
  };

  // Upgrade mechanic status stages
  const handleUpdateRepairStatus = (id: string, status: RepairOrder['status']) => {
    setRepairs(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };

  // Inter-branch transit transport
  const handleTransferVehicle = (vehicleId: string, destBranchId: string) => {
    setVehicles(prev => prev.map(car => car.id === vehicleId ? { ...car, branchId: destBranchId } : car));
    const targetBranch = INITIAL_BRANCHES.find(b => b.id === destBranchId);
    
    const newAlert = {
      id: 'notif_' + Date.now(),
      title: 'Transit Authorized',
      message: `Vehicle transferred to ${targetBranch?.name}.`,
      date: 'Just Now',
      type: 'info' as const,
      read: false
    };
    setNotifications(prev => [newAlert, ...prev]);
  };

  // CRM Update leads stage
  const handleUpdateLead = (leadId: string, status: Lead['status']) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
  };

  // Marketplace quick booking integrations
  const handleMarketplaceBookTestDrive = (vehicleId: string) => {
    const car = vehicles.find(v => v.id === vehicleId);
    if (car) {
      const appt: TestDrive = {
        id: 'td_' + Date.now(),
        vehicleId,
        customerId: 'c1',
        customerName: 'Chinedu Okafor',
        salespersonId: 'e1',
        salespersonName: 'Gbenga Adebayo',
        date: new Date().toISOString().split('T')[0],
        time: '11:00',
        status: 'Approved',
        licenseVerified: true
      };
      handleAddTestDrive(appt);
      setActiveTab('testdrives');
    }
  };

  const handleMarketplaceReserveVehicle = (vehicleId: string, deposit: number) => {
    const car = vehicles.find(v => v.id === vehicleId);
    if (car) {
      setCheckoutVehicle(car);
      setCheckoutAmount(deposit);
      setPaymentProvider('Stripe');
      setShowCheckoutModal(true);
    }
  };

  // Process checkout simulated payment completion
  const handleConfirmSimulatedCheckout = () => {
    if (checkoutVehicle) {
      setVehicles(prev => prev.map(v => v.id === checkoutVehicle.id ? { ...v, status: 'Reserved' } : v));
      
      const newAlert = {
        id: 'notif_' + Date.now(),
        title: 'Holding Deposit Logged',
        message: `${checkoutVehicle.brand} ${checkoutVehicle.model} is now Reserved. Secure receipt sent.`,
        date: 'Just Now',
        type: 'success' as const,
        read: false
      };
      setNotifications(prev => [newAlert, ...prev]);
      setShowCheckoutModal(false);
      setCheckoutVehicle(null);
      setActiveTab('portal');
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans select-none text-slate-800">
      
      {/* 1. Left Navigation Sidebar */}
      <Sidebar 
        activeSection={activeTab}
        setActiveSection={setActiveTab}
      />

      {/* 2. Main content center platform */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top platform corporate dashboard header banner */}
        <header className="bg-white border-b border-slate-100 px-6 py-3.5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">AutoElite Showroom DMS</h2>
            <span className="text-xs text-slate-300">|</span>
            <span className="text-xs text-slate-400 font-bold font-mono">USD ($) Base Currency</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications panel bell icon */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 cursor-pointer transition-all"
                id="btn-header-notif"
              >
                <Bell size={16} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                )}
              </button>

              {/* Notifications panel context list */}
              {showNotifications && (
                <div className="absolute right-0 mt-2.5 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl p-3 z-50 text-xs font-semibold text-slate-700 space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                    <span className="font-extrabold text-slate-900">Showroom Alerts</span>
                    <button 
                      onClick={() => setNotifications(prev => prev.map(n => ({...n, read: true})))}
                      className="text-[9px] text-indigo-600 font-bold hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-50">
                    {notifications.map(item => (
                      <div key={item.id} className="py-2 space-y-0.5">
                        <p className="font-bold text-slate-800">{item.title}</p>
                        <p className="text-[10px] text-slate-500 leading-normal font-medium">{item.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 3. Core dynamic switch router panel body */}
        <main className="flex-1 overflow-y-auto p-6 focus:outline-none">
          {activeTab === 'landing' && (
            <LandingPageView 
              vehicles={vehicles} 
              onNavigate={(tabId) => setActiveTab(tabId)}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView 
              vehicles={vehicles} 
              leads={leads} 
              customers={customers} 
              testDrives={testDrives} 
              repairs={repairs} 
              sales={sales} 
              parts={parts} 
              expenses={expenses} 
              onQuickAction={(actionId) => {
                if (actionId === 'add-vehicle') setActiveTab('inventory');
                else if (actionId === 'new-lead') setActiveTab('crm');
                else if (actionId === 'close-deal') setActiveTab('sales');
              }}
              currency={currency} 
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView 
              vehicles={vehicles} 
              onAddVehicle={handleAddVehicle} 
              onUpdateVehicle={handleUpdateVehicle} 
              currentRole={currentRole} 
              activeBranchId={selectedBranchId}
              currency={currency} 
            />
          )}

          {activeTab === 'crm' && (
            <CRMView 
              customers={customers}
              leads={leads}
              vehicles={vehicles}
              onAddLead={(newLead) => setLeads(prev => [newLead, ...prev])}
              onUpdateLeadStatus={handleUpdateLead}
              onAddCommunication={(custId, comm) => {
                setCustomers(prev => prev.map(c => c.id === custId ? {
                  ...c,
                  communications: [comm, ...c.communications]
                } : c));
              }}
            />
          )}

          {activeTab === 'sales' && (
            <SalesView 
              sales={sales} 
              customers={customers} 
              vehicles={vehicles} 
              onAddSale={handleAddSale} 
              currentRole={currentRole} 
              currency={currency} 
            />
          )}

          {activeTab === 'purchasing' && (
            <PurchasingView 
              vehicles={vehicles} 
              suppliers={INITIAL_SUPPLIERS} 
              onAddVehicle={handleAddVehicle} 
              currentRole={currentRole} 
              currency={currency} 
            />
          )}

          {activeTab === 'testdrives' && (
            <TestDriveView 
              testDrives={testDrives} 
              vehicles={vehicles} 
              customers={customers} 
              onAddTestDrive={handleAddTestDrive} 
              onUpdateTestDriveStatus={handleUpdateTestDriveStatus} 
              currentRole={currentRole} 
            />
          )}

          {activeTab === 'financing' && (
            <FinancingInsuranceView 
              financeDeals={financeDeals} 
              insurancePolicies={insurancePolicies} 
              vehicles={vehicles} 
              customers={customers} 
              currency={currency} 
            />
          )}

          {activeTab === 'workshop' && (
            <WorkshopPartsView 
              repairs={repairs} 
              parts={parts} 
              vehicles={vehicles} 
              employees={INITIAL_EMPLOYEES} 
              onAddRepair={handleAddRepair} 
              onUpdateRepairStatus={handleUpdateRepairStatus} 
              currency={currency} 
            />
          )}

          {activeTab === 'accounting' && (
            <AccountingView 
              sales={sales} 
              expenses={expenses} 
              employees={INITIAL_EMPLOYEES} 
              currency={currency} 
            />
          )}

          {activeTab === 'staff' && (
            <EmployeeBranchView 
              employees={INITIAL_EMPLOYEES} 
              branches={branches} 
              vehicles={vehicles} 
              onTransferVehicle={handleTransferVehicle} 
              currentRole={currentRole} 
              currency={currency} 
            />
          )}

          {activeTab === 'marketplace' && (
            <MarketplaceView 
              vehicles={vehicles} 
              onBookTestDrive={handleMarketplaceBookTestDrive} 
              onReserveVehicle={handleMarketplaceReserveVehicle} 
              currency={currency} 
            />
          )}

          {activeTab === 'portal' && (
            <CustomerPortalView 
              purchasedCars={vehicles.filter(v => v.status === 'Sold')} 
              testDrives={testDrives} 
              repairs={repairs} 
              sales={sales} 
              currency={currency} 
            />
          )}
        </main>
      </div>

      {/* 4. Local Integrated Payment Gateway Dialog Mock (Stripe) */}
      {showCheckoutModal && checkoutVehicle && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 text-xs font-semibold relative overflow-hidden shadow-2xl">
            
            {/* Colored provider bar header */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-indigo-600"></div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Wallet className="text-slate-800" size={16} />
                <h3 className="font-black text-slate-900">{paymentProvider} Payment Gateway</h3>
              </div>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 font-semibold text-xs text-slate-600">
              <p className="text-slate-400 uppercase text-[9px] tracking-wider">Securing vehicle reservation for:</p>
              <h4 className="text-sm font-black text-slate-900 mt-1">{checkoutVehicle.brand} {checkoutVehicle.model} ({checkoutVehicle.year})</h4>

              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex justify-between items-center mt-2.5">
                <span>Required Secure Holding Deposit:</span>
                <span className="text-base font-black text-slate-900 font-mono">{formatCurrency(checkoutAmount, currency)}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex gap-2">
                  <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={15} />
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Payments are encrypted under certified security clearances. Money will be credited directly as downpayment equity on your vehicle contract.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmSimulatedCheckout}
                  className="w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-xl transition-all shadow-md cursor-pointer"
                  id="btn-gateway-confirm"
                >
                  Confirm payment of {formatCurrency(checkoutAmount, currency)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
