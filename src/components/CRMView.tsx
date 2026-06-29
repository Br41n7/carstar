/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  Phone, 
  Mail, 
  MessageSquare, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Calendar, 
  ArrowRight, 
  Plus, 
  Sparkles,
  ShieldCheck,
  Star,
  FileText,
  Bookmark,
  X
} from 'lucide-react';
import { Customer, Lead, Vehicle, CommunicationLog } from '../types';
import { formatCurrency } from '../utils';

interface CRMViewProps {
  customers: Customer[];
  leads: Lead[];
  vehicles: Vehicle[];
  onAddLead: (lead: Lead) => void;
  onUpdateLeadStatus: (leadId: string, status: Lead['status']) => void;
  onAddCommunication: (customerId: string, comm: CommunicationLog) => void;
}

export default function CRMView({
  customers,
  leads,
  vehicles,
  onAddLead,
  onUpdateLeadStatus,
  onAddCommunication,
}: CRMViewProps) {
  const [activeTab, setActiveTab] = useState<'leads' | 'directory'>('leads');
  const [search, setSearch] = useState('');
  
  // Dialogs state
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // New Lead form state
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadSource, setNewLeadSource] = useState<Lead['source']>('Website');
  const [newLeadVehicleId, setNewLeadVehicleId] = useState('');
  const [newLeadNotes, setNewLeadNotes] = useState('');

  // Log communication state
  const [commType, setCommType] = useState<'Call' | 'Email' | 'SMS' | 'WhatsApp'>('Call');
  const [commSubject, setCommSubject] = useState('');
  const [commNotes, setCommNotes] = useState('');

  // Lead Kanban status categories
  const leadStatuses: Lead['status'][] = ['New', 'Contacted', 'Proposal', 'Negotiation', 'Won'];

  // Handle lead creation
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Lead = {
      id: 'l_' + Date.now(),
      customerName: newLeadName,
      email: newLeadEmail,
      phone: newLeadPhone,
      source: newLeadSource,
      status: 'New',
      interestedVehicleId: newLeadVehicleId || undefined,
      assignedTo: 'Gbenga Adebayo',
      notes: newLeadNotes,
      score: Math.floor(Math.random() * 40) + 60, // Priority Score 60-100
      createdAt: new Date().toISOString()
    };
    onAddLead(created);
    setShowAddLeadModal(false);
    // Reset fields
    setNewLeadName('');
    setNewLeadEmail('');
    setNewLeadPhone('');
    setNewLeadNotes('');
  };

  // Add communication
  const handleAddCommSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCustomer && commSubject) {
      const comm: CommunicationLog = {
        id: 'comm_' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        type: commType,
        subject: commSubject,
        notes: commNotes,
        agentName: 'Gbenga Adebayo'
      };
      onAddCommunication(selectedCustomer.id, comm);
      // Reset
      setCommSubject('');
      setCommNotes('');
      // Refresh customer ref in state
      const updatedCust = customers.find(c => c.id === selectedCustomer.id);
      if (updatedCust) {
        setSelectedCustomer({
          ...updatedCust,
          communications: [...updatedCust.communications, comm]
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Tab Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">CRM & Client Relations</h2>
          <p className="text-xs text-slate-500">Nurture leads, verify driver details, audit logs, and simulate customer touchpoints.</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'leads' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            id="tab-leads-btn"
          >
            Leads Kanban Pipeline
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'directory' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            id="tab-directory-btn"
          >
            Client Directory
          </button>
        </div>
      </div>

      {activeTab === 'leads' ? (
        /* Leads Kanban View */
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 border border-slate-100 rounded-2xl shadow-sm">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Sparkles className="text-indigo-600 animate-pulse w-4 h-4" /> Lead Priority Ranking Active &bull; Assesses buyer motivation.
            </span>
            <button
              onClick={() => setShowAddLeadModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
              id="btn-trigger-add-lead"
            >
              <Plus size={14} /> Add Lead
            </button>
          </div>

          {/* Kanban Board columns */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {leadStatuses.map(status => {
              const statusLeads = leads.filter(l => l.status === status);
              return (
                <div key={status} className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/50 flex flex-col min-h-[450px]">
                  <div className="flex justify-between items-center mb-3 px-1">
                    <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">{status}</span>
                    <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">{statusLeads.length}</span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
                    {statusLeads.map(lead => {
                      const car = vehicles.find(v => v.id === lead.interestedVehicleId);
                      return (
                        <div 
                          key={lead.id}
                          className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group"
                        >
                          {/* Top border colored by lead priority score */}
                          <div className={`absolute top-0 left-0 right-0 h-1 
                            ${lead.score >= 85 ? 'bg-emerald-500' : ''}
                            ${lead.score < 85 && lead.score >= 70 ? 'bg-indigo-500' : ''}
                            ${lead.score < 70 ? 'bg-amber-500' : ''}
                          `}></div>

                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-extrabold text-slate-800 text-xs truncate max-w-[110px]">{lead.customerName}</h4>
                            <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                              <Sparkles size={8} /> Priority {lead.score}%
                            </span>
                          </div>

                          <p className="text-[10px] text-slate-400 font-medium truncate mb-2">{lead.email}</p>
                          
                          {car && (
                            <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-[9px] font-bold text-slate-700 mb-3">
                              🏷️ {car.brand} {car.model} ({formatCurrency(car.price - car.discount)})
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-2.5 border-t border-slate-50 text-[10px] font-bold">
                            <span className="text-slate-400 uppercase tracking-wide text-[8px]">{lead.source}</span>
                            
                            {/* Simple forward stage button */}
                            {status !== 'Won' && (
                              <button
                                onClick={() => {
                                  const currentIdx = leadStatuses.indexOf(status);
                                  const nextStatus = leadStatuses[currentIdx + 1];
                                  if (nextStatus) onUpdateLeadStatus(lead.id, nextStatus);
                                }}
                                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 text-[9px] cursor-pointer"
                                id={`btn-advance-lead-${lead.id}`}
                              >
                                Advance <ArrowRight size={10} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {statusLeads.length === 0 && (
                      <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center text-slate-400 text-[10px] italic flex items-center justify-center h-20">
                        No active leads
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Client Directory Directory Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customers List Left */}
          <div className="md:col-span-1 bg-white border border-slate-100 rounded-2xl shadow-sm p-4 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Client Directory</h3>
            <div className="space-y-2">
              {customers.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex justify-between items-center font-semibold text-xs
                    ${selectedCustomer?.id === c.id 
                      ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900' 
                      : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700'
                    }
                  `}
                >
                  <div>
                    <p className="font-bold">{c.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{c.phone}</p>
                  </div>
                  <div className="flex gap-0.5 text-amber-500">
                    {Array.from({ length: c.rating }).map((_, i) => (
                      <Star key={i} size={10} fill="currentColor" />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Customer Details Screen Right */}
          <div className="md:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex flex-col justify-between">
            {selectedCustomer ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{selectedCustomer.name}</h3>
                    <p className="text-xs text-slate-500">{selectedCustomer.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Contact Card</p>
                    <div className="flex gap-2.5 mt-1.5 text-slate-500">
                      <a href={`tel:${selectedCustomer.phone}`} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100"><Phone size={14} /></a>
                      <a href={`mailto:${selectedCustomer.email}`} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100"><Mail size={14} /></a>
                    </div>
                  </div>
                </div>

                {/* ID documents details */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2.5 flex items-center gap-1">
                    <ShieldCheck className="text-emerald-500 w-4.5 h-4.5" /> ID verification status
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {selectedCustomer.documents.map((doc, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center font-semibold">
                        <div>
                          <p className="text-slate-400 text-[10px] uppercase font-bold">{doc.idType}</p>
                          <p className="font-mono text-slate-800 mt-0.5">{doc.docNumber}</p>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Verified</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact logs / call sheets */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
                      <MessageSquare className="text-slate-500 w-4 h-4" /> CRM Touchpoint log
                    </h4>
                  </div>
                  <div className="space-y-2.5 max-h-44 overflow-y-auto scrollbar-thin">
                    {selectedCustomer.communications.map(log => (
                      <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <div className="flex justify-between font-bold mb-1">
                          <span className="text-indigo-600 font-extrabold flex items-center gap-1 text-[11px]">
                            💬 {log.type}: {log.subject}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{log.date}</span>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed">{log.notes}</p>
                        <p className="text-[9px] text-slate-400 mt-1">Logged by Agent: {log.agentName}</p>
                      </div>
                    ))}
                    {selectedCustomer.communications.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No communication logs recorded.</p>
                    )}
                  </div>
                </div>

                {/* Log custom message form */}
                <form onSubmit={handleAddCommSubmit} className="pt-4 border-t border-slate-100 space-y-3">
                  <h5 className="text-xs font-extrabold text-slate-800">Add New Touchpoint Log</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    <select
                      value={commType}
                      onChange={(e) => setCommType(e.target.value as any)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-bold"
                    >
                      <option value="Call">📞 Call Log</option>
                      <option value="Email">📧 Email</option>
                      <option value="SMS">💬 SMS</option>
                      <option value="WhatsApp">🟢 WhatsApp</option>
                    </select>
                    <input
                      type="text" required
                      placeholder="Subject, e.g. Warranty details discussion"
                      value={commSubject}
                      onChange={(e) => setCommSubject(e.target.value)}
                      className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <textarea
                    required
                    placeholder="Enter detailed notes of discussion..."
                    value={commNotes}
                    onChange={(e) => setCommNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs h-16 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    Log Touchpoint
                  </button>
                </form>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 italic">
                <Users size={36} className="text-slate-300 mb-2" />
                <p className="text-xs font-bold">Select a client from the directory to review profiles, clearance papers, and call registers.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form 
            onSubmit={handleCreateLead}
            className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4 text-xs font-semibold"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Add New CRM Lead</h3>
              <button 
                type="button"
                onClick={() => setShowAddLeadModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-500 mb-1">Customer Full Name</label>
                <input
                  type="text" required
                  placeholder="e.g. Samuel Adekunle"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Email</label>
                  <input
                    type="email" required
                    placeholder="e.g. sam@tech.com"
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Phone</label>
                  <input
                    type="text" required
                    placeholder="e.g. +234..."
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Lead Source</label>
                  <select
                    value={newLeadSource}
                    onChange={(e) => setNewLeadSource(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Website">Website</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Phone">Phone Calls</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Interested Vehicle</label>
                  <select
                    value={newLeadVehicleId}
                    onChange={(e) => setNewLeadVehicleId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select Vehicle...</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.brand} {v.model}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Requirements Note</label>
                <textarea
                  placeholder="What specifically is the client looking for?"
                  value={newLeadNotes}
                  onChange={(e) => setNewLeadNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 h-16 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddLeadModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
              >
                Save CRM Lead
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
