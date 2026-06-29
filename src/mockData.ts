/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Vehicle, Branch, Customer, Lead, TestDrive, Reservation, FinanceDeal, InsurancePolicy, RepairOrder, PartItem, Expense, SalesDeal, Employee, AuditLog, Supplier } from './types';

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'b1',
    name: 'Main Showroom - Lagos HQ',
    address: '102 Alfred Rewane Road, Ikoyi, Lagos, Nigeria',
    phone: '+234 803 123 4567',
    email: 'lagos@autoelite-dms.com',
    manager: 'Gbenga Adebayo',
  },
  {
    id: 'b2',
    name: 'Nairobi Branch - Westlands',
    address: 'Chiromo Road, Westlands, Nairobi, Kenya',
    phone: '+254 722 000 111',
    email: 'nairobi@autoelite-dms.com',
    manager: 'Mwangi Kamau',
  },
  {
    id: 'b3',
    name: 'Accra Elite Showroom',
    address: 'Liberia Road, Accra, Ghana',
    phone: '+233 24 455 6677',
    email: 'accra@autoelite-dms.com',
    manager: 'Kofi Mensah',
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'Global Auction Corp', contactPerson: 'Markus Vance', phone: '+1 305 555 0192', email: 'vance@globalauction.com', type: 'Auction' },
  { id: 's2', name: 'Nippon Auto Shippers', contactPerson: 'Hiroshi Sato', phone: '+81 3 5555 0144', email: 'sato@nippon-shippers.jp', type: 'Importer' },
  { id: 's3', name: 'Local Fleet Liquidations', contactPerson: 'Sarah Jenkins', phone: '+234 1 292 3848', email: 's.jenkins@fleetliquid.com', type: 'Direct Dealer' },
  { id: 's4', name: 'Private Trade-ins', contactPerson: 'In-House Appraisals', phone: 'N/A', email: 'appraisal@autoelite.com', type: 'Trade-in' }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    vin: '1FM5K8GC8KGB00129',
    plateNumber: 'LAG-402-AA',
    engineNumber: 'ENG-2.3L-ECB-923',
    chassisNumber: 'CHS-FORD-XP82-019',
    brand: 'Ford',
    model: 'Explorer',
    trim: 'Limited 4WD',
    year: 2021,
    mileage: 24500,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    color: 'Shadow Black',
    bodyType: 'SUV',
    driveType: 'AWD',
    horsepower: 300,
    engineCapacity: '2.3L EcoBoost',
    condition: 'Used',
    price: 34500,
    discount: 500,
    purchaseCost: 26000,
    expectedProfit: 8000,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Leather Seats', 'Navigation System', 'Apple CarPlay', 'Blind Spot Monitor', 'Third Row Seating', 'Sunroof'],
    warranty: '12 Months Bumper-to-Bumper Dealer Warranty',
    ownershipHistory: '1 Previous Owner, Corporate Fleet vehicle in Nigeria, fully serviced.',
    serviceRecords: [
      { id: 'sr1', date: '2025-10-15', type: 'Oil Change', description: 'Full synthetic oil change and tire rotation', cost: 120, mechanic: 'John Peters', mileage: 22000 }
    ],
    documents: [
      { id: 'd1', name: 'Customs Clearance Papers', type: 'Customs', url: '#', uploadedAt: '2026-01-10', size: '2.4 MB', version: 'v1.0' },
      { id: 'd2', name: 'Inspection Certificate', type: 'Inspection', url: '#', uploadedAt: '2026-01-11', size: '1.1 MB', version: 'v1.0', signedBy: 'Tunde Lawal' }
    ],
    branchId: 'b1',
    arrivalDate: '2026-01-12'
  },
  {
    id: 'v2',
    vin: 'WBA3A5C52KNF00214',
    plateNumber: 'NBI-777-K',
    engineNumber: 'ENG-2.0L-B48-812',
    chassisNumber: 'CHS-BMW-320I-3304',
    brand: 'BMW',
    model: '3 Series',
    trim: '320i M Sport',
    year: 2022,
    mileage: 12100,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    color: 'Portimao Blue Metallic',
    bodyType: 'Sedan',
    driveType: 'RWD',
    horsepower: 184,
    engineCapacity: '2.0L Turbo',
    condition: 'Certified',
    price: 42000,
    discount: 0,
    purchaseCost: 33000,
    expectedProfit: 9000,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['M Sport Package', 'Harman Kardon Sound', 'Heads-up Display', 'Adaptive Suspension', 'Ambient Lighting'],
    warranty: 'Original BMW Warranty active until Oct 2027',
    ownershipHistory: 'Single Owner, imported directly from Japan, perfect history report.',
    serviceRecords: [],
    documents: [
      { id: 'd3', name: 'Japanese Auction Grading Sheet', type: 'Inspection', url: '#', uploadedAt: '2026-02-05', size: '1.8 MB', version: 'v1.0' }
    ],
    branchId: 'b2',
    arrivalDate: '2026-02-06'
  },
  {
    id: 'v3',
    vin: '5YJ3E1EA0LF001928',
    plateNumber: 'ACC-8902-X',
    engineNumber: 'ENG-ELECTRIC-P8D',
    chassisNumber: 'CHS-TSLA-MOD3-883',
    brand: 'Tesla',
    model: 'Model 3',
    trim: 'Long Range AWD',
    year: 2023,
    mileage: 5600,
    fuelType: 'Electric',
    transmission: 'Automatic',
    color: 'Pearl White Multi-Coat',
    bodyType: 'Sedan',
    driveType: 'AWD',
    horsepower: 449,
    engineCapacity: '75 kWh Dual Motor',
    condition: 'Imported',
    price: 52900,
    discount: 1000,
    purchaseCost: 44000,
    expectedProfit: 7900,
    status: 'Reserved',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Autopilot', 'Panoramic Glass Roof', 'Premium Audio', 'All Black Premium Interior', 'Cold Weather Package'],
    warranty: 'Tesla Battery and Drive Unit Warranty active until 2031',
    ownershipHistory: 'Ex-demo model imported from Europe, pristine status.',
    serviceRecords: [],
    documents: [],
    branchId: 'b3',
    arrivalDate: '2026-03-01'
  },
  {
    id: 'v4',
    vin: 'W1N0G8DB1LG009212',
    plateNumber: 'LAG-381-BC',
    engineNumber: 'ENG-3.0L-M256-42',
    chassisNumber: 'CHS-MB-GLE450-482',
    brand: 'Mercedes-Benz',
    model: 'GLE',
    trim: 'GLE 450 4MATIC Sport',
    year: 2022,
    mileage: 18400,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    color: 'Selenite Grey Metallic',
    bodyType: 'SUV',
    driveType: 'AWD',
    horsepower: 362,
    engineCapacity: '3.0L Inline-6 Turbo w/ EQ Boost',
    condition: 'Certified',
    price: 79500,
    discount: 0,
    purchaseCost: 68000,
    expectedProfit: 11500,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Panoramic Roof', 'MBUX Navigation', 'Burmester Surround Sound', '360 Camera', 'Airmatic Suspension'],
    warranty: 'Mercedes Benz Certified Pre-Owned Extended Warranty active',
    ownershipHistory: 'Bought brand new locally, dealer maintained. Single executive owner.',
    serviceRecords: [
      { id: 'sr2', date: '2026-01-20', type: 'Inspections', description: 'Comprehensive Multi-Point Inspection and cabin filter swap', cost: 180, mechanic: 'Tunde Lawal', mileage: 17200 }
    ],
    documents: [
      { id: 'd4', name: 'Dealer Service Booklet', type: 'Warranty', url: '#', uploadedAt: '2026-02-12', size: '5.2 MB', version: 'v2.1' }
    ],
    branchId: 'b1',
    arrivalDate: '2026-02-14'
  },
  {
    id: 'v5',
    vin: 'SALWA2RV0EA008129',
    plateNumber: 'LAG-992-ZZ',
    engineNumber: 'ENG-3.0L-AJ300-88',
    chassisNumber: 'CHS-LR-DEF110-81',
    brand: 'Land Rover',
    model: 'Defender',
    trim: '110 SE P400',
    year: 2023,
    mileage: 8200,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    color: 'Pangea Green',
    bodyType: 'SUV',
    driveType: '4WD',
    horsepower: 395,
    engineCapacity: '3.0L Turbo Mild Hybrid',
    condition: 'New',
    price: 94000,
    discount: 2000,
    purchaseCost: 81000,
    expectedProfit: 13000,
    status: 'Sold',
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Air Suspension', 'ClearSight Rear View Mirror', 'Cold Climate Pack', 'Meridian Sound System', 'Off-road Tires'],
    warranty: '3 Years Full Manufacturer Warranty',
    ownershipHistory: 'Direct import from Solihull, UK. Sold in Lagos.',
    serviceRecords: [],
    documents: [
      { id: 'd5', name: 'Sales Contract', type: 'Contract', url: '#', uploadedAt: '2026-04-18', size: '1.2 MB', version: 'v1.0_signed', signedBy: 'Gbenga Adebayo' },
      { id: 'd6', name: 'Receipt', type: 'Receipt', url: '#', uploadedAt: '2026-04-18', size: '350 KB', version: 'v1.0' }
    ],
    branchId: 'b1',
    arrivalDate: '2026-04-01'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Aliko Danjuma',
    email: 'aliko@danjumagroup.com',
    phone: '+234 809 999 8888',
    address: 'VGC Estate, Lekki, Lagos',
    rating: 5,
    documents: [
      { idType: 'Driving License', docNumber: 'DL-LAG-2981389', verified: true },
      { idType: 'National ID', docNumber: 'NIN-928103982', verified: true }
    ],
    purchaseHistory: ['v5'],
    communications: [
      { id: 'comm1', date: '2026-04-10', type: 'WhatsApp', subject: 'Defender Delivery confirmation', notes: 'Agreed on delivery to his office in Victoria Island on Thursday.', agentName: 'Gbenga Adebayo' },
      { id: 'comm2', date: '2026-04-05', type: 'Call', subject: 'Price negotiation on Defender', notes: 'Client requested a discount on the expected Pangea Green. Agreed on 2000 USD reduction.', agentName: 'Gbenga Adebayo' }
    ],
    referrals: ['Sarah Lawson']
  },
  {
    id: 'c2',
    name: 'Priscilla Wambui',
    email: 'pwambui@techfinance.ke',
    phone: '+254 711 222 333',
    address: 'Lavington Estates, Nairobi',
    rating: 4,
    documents: [
      { idType: 'National ID', docNumber: 'ID-KE-82910392', verified: true }
    ],
    purchaseHistory: [],
    communications: [
      { id: 'comm3', date: '2026-06-20', type: 'Email', subject: 'BMW 3-Series Finance Offer', notes: 'Sent quotation with 10% deposit and 36-month dealer financing options.', agentName: 'Mwangi Kamau' }
    ],
    referrals: []
  },
  {
    id: 'c3',
    name: 'Ato Kwamena',
    email: 'ato.kwamena@goldfields.com.gh',
    phone: '+233 55 929 1839',
    address: 'Airport Residential Area, Accra',
    rating: 5,
    documents: [
      { idType: 'Passport', docNumber: 'PP-GH-092813', verified: true }
    ],
    purchaseHistory: [],
    communications: [],
    referrals: []
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'l1',
    customerName: 'Marcus Okon',
    email: 'marcus.okon@outlook.com',
    phone: '+234 812 345 6789',
    source: 'Website',
    status: 'Proposal',
    interestedVehicleId: 'v1',
    assignedTo: 'Gbenga Adebayo',
    notes: 'Inquired about the Ford Explorer price. Wants to schedule a test drive.',
    score: 85,
    createdAt: '2026-06-15T12:00:00Z'
  },
  {
    id: 'l2',
    customerName: 'Jessica Adeyemi',
    email: 'jessy_a@gmail.com',
    phone: '+234 905 555 1234',
    source: 'Facebook',
    status: 'New',
    interestedVehicleId: 'v4',
    assignedTo: 'Gbenga Adebayo',
    notes: 'Expressed interest in Mercedes GLE. Budget around 75k.',
    score: 92,
    createdAt: '2026-06-26T08:30:00Z'
  },
  {
    id: 'l3',
    customerName: 'David Kojo',
    email: 'kojo_d@yahoo.co.uk',
    phone: '+233 24 399 1828',
    source: 'Google Ads',
    status: 'Contacted',
    interestedVehicleId: 'v3',
    assignedTo: 'Kofi Mensah',
    notes: 'Wants to check Tesla Model 3 specifications for Ghanaian grid compatibility.',
    score: 64,
    createdAt: '2026-06-24T14:20:00Z'
  },
  {
    id: 'l4',
    customerName: 'Samson Kimani',
    email: 'samson@kimaniarchitects.ke',
    phone: '+254 733 999 111',
    source: 'Walk-in',
    status: 'Negotiation',
    interestedVehicleId: 'v2',
    assignedTo: 'Mwangi Kamau',
    notes: 'Bargaining the BMW. Offered 41k flat cash.',
    score: 78,
    createdAt: '2026-06-22T10:15:00Z'
  }
];

export const INITIAL_TEST_DRIVES: TestDrive[] = [
  {
    id: 'td1',
    vehicleId: 'v1',
    customerId: 'c1',
    customerName: 'Aliko Danjuma',
    salespersonId: 'e1',
    salespersonName: 'Gbenga Adebayo',
    date: '2026-06-28',
    time: '11:00',
    status: 'Scheduled',
    licenseVerified: true,
  },
  {
    id: 'td2',
    vehicleId: 'v2',
    customerId: 'c2',
    customerName: 'Priscilla Wambui',
    salespersonId: 'e2',
    salespersonName: 'Mwangi Kamau',
    date: '2026-06-25',
    time: '14:30',
    status: 'Completed',
    licenseVerified: true,
    feedback: 'Car has remarkable handling and response. Wants to proceed with dealer finance.',
    result: 'Follow-up'
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res1',
    vehicleId: 'v3',
    customerId: 'c3',
    customerName: 'Ato Kwamena',
    reservationDate: '2026-06-25',
    expirationDate: '2026-07-02',
    depositAmount: 5000,
    status: 'Active',
    agreementUrl: '#'
  }
];

export const INITIAL_FINANCE_DEALS: FinanceDeal[] = [
  {
    id: 'fd1',
    vehicleId: 'v2',
    customerId: 'c2',
    type: 'Dealer Financing',
    loanAmount: 37800, // 42000 - 10% (4200)
    interestRate: 6.5,
    termMonths: 36,
    monthlyPayment: 1158.45,
    outstandingBalance: 37800,
    status: 'Active',
    paymentSchedule: [
      { id: 'inst1', dueDate: '2026-07-25', amount: 1158.45, status: 'Pending' },
      { id: 'inst2', dueDate: '2026-08-25', amount: 1158.45, status: 'Pending' }
    ]
  }
];

export const INITIAL_INSURANCE_POLICIES: InsurancePolicy[] = [
  {
    id: 'ins_p1',
    vehicleId: 'v1',
    companyName: 'AXA Mansard Nigeria',
    policyNumber: 'AXA-MNS-88910-AUT',
    premiumAmount: 850,
    coverage: 'Comprehensive Gold Coverage including Engine and Body damages',
    startDate: '2026-01-15',
    expirationDate: '2027-01-14',
    status: 'Active',
    claims: []
  }
];

export const INITIAL_REPAIR_ORDERS: RepairOrder[] = [
  {
    id: 'ro1',
    vehicleId: 'v1',
    mechanicId: 'm1',
    mechanicName: 'Tunde Lawal',
    date: '2026-06-20',
    status: 'Completed',
    serviceType: 'Brake Service',
    laborCost: 150,
    partsUsed: [
      { partId: 'p1', name: 'Front Brake Pads - Ford Explorer', quantity: 1, unitPrice: 85 }
    ],
    totalCost: 235,
    notes: 'Front brake pads worn out. Replaced with OEM pads, tested and confirmed functioning well.'
  },
  {
    id: 'ro2',
    vehicleId: 'v4',
    mechanicId: 'm1',
    mechanicName: 'Tunde Lawal',
    date: '2026-06-26',
    status: 'In Progress',
    serviceType: 'Oil Change',
    laborCost: 60,
    partsUsed: [
      { partId: 'p2', name: 'Premium Synthetic Engine Oil 5W-30', quantity: 6, unitPrice: 15 },
      { partId: 'p3', name: 'Mercedes GLE Oil Filter', quantity: 1, unitPrice: 22 }
    ],
    totalCost: 172,
    notes: 'Routine scheduled fluid change.'
  }
];

export const INITIAL_PARTS: PartItem[] = [
  {
    id: 'p1',
    name: 'Front Brake Pads - Ford Explorer',
    partNumber: 'FRBP-EXPL-20',
    category: 'Brakes',
    stock: 12,
    minStock: 3,
    supplier: 'Global Spares Ltd',
    unitPrice: 85,
    warehouse: 'Lagos Main Garage',
    barcode: '710292810398'
  },
  {
    id: 'p2',
    name: 'Premium Synthetic Engine Oil 5W-30',
    partNumber: 'SYN-OIL-5W30',
    category: 'Fluids',
    stock: 5, // Low stock, triggers alert
    minStock: 10,
    supplier: 'Oando Lubricants',
    unitPrice: 15,
    warehouse: 'Lagos Main Garage',
    barcode: '400192839482'
  },
  {
    id: 'p3',
    name: 'Mercedes GLE Oil Filter',
    partNumber: 'MB-GLE-OF',
    category: 'Filters',
    stock: 24,
    minStock: 5,
    supplier: 'Benz Germany Spares',
    unitPrice: 22,
    warehouse: 'Nairobi Storage B',
    barcode: '918203928111'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: 'exp1', date: '2026-06-10', category: 'Marketing', amount: 1500, description: 'Facebook and Google ads for June', isRecurring: false, branchId: 'b1' },
  { id: 'exp2', date: '2026-06-25', category: 'Salary', amount: 8000, description: 'Lagos staff monthly salary payout', isRecurring: true, branchId: 'b1' },
  { id: 'exp3', date: '2026-06-05', category: 'Utilities', amount: 450, description: 'Electricity and generator diesel Lagos HQ', isRecurring: true, branchId: 'b1' },
  { id: 'exp4', date: '2026-06-12', category: 'Transportation', amount: 2200, description: 'Customs port transfer for Land Rover Defender', isRecurring: false, branchId: 'b1' }
];

export const INITIAL_SALES_DEALS: SalesDeal[] = [
  {
    id: 'sd1',
    vehicleId: 'v5',
    customerId: 'c1',
    customerName: 'Aliko Danjuma',
    salespersonId: 'e1',
    salespersonName: 'Gbenga Adebayo',
    date: '2026-04-18',
    dealType: 'Cash',
    sellingPrice: 94000,
    discount: 2000,
    deposit: 92000,
    warrantySelected: '3 Years Full Manufacturer',
    accessoriesSelected: ['Off-road Tires', 'Side Steps'],
    totalPrice: 92000,
    commission: 4600, // 5%
    status: 'Handed Over',
    invoiceNumber: 'INV-2026-0041'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'e1',
    name: 'Gbenga Adebayo',
    email: 'gbenga@autoelite.com',
    phone: '+234 803 123 9999',
    department: 'Sales',
    role: 'Sales Manager',
    salary: 3500,
    commissionRate: 0.05,
    joinedDate: '2021-04-15',
    attendanceStatus: 'Present',
    targets: {
      monthlySalesCount: 6,
      currentSalesCount: 4,
      monthlyRevenue: 200000,
      currentRevenue: 134000
    }
  },
  {
    id: 'e2',
    name: 'Mwangi Kamau',
    email: 'kamau@autoelite.com',
    phone: '+254 722 000 222',
    department: 'Sales',
    role: 'Sales Representative',
    salary: 2000,
    commissionRate: 0.03,
    joinedDate: '2023-01-10',
    attendanceStatus: 'Present',
    targets: {
      monthlySalesCount: 4,
      currentSalesCount: 2,
      monthlyRevenue: 100000,
      currentRevenue: 42000
    }
  },
  {
    id: 'e3',
    name: 'Tunde Lawal',
    email: 'tunde@autoelite.com',
    phone: '+234 805 123 4455',
    department: 'Workshop',
    role: 'Mechanic',
    salary: 1800,
    commissionRate: 0,
    joinedDate: '2022-09-01',
    attendanceStatus: 'Present',
    targets: {
      monthlySalesCount: 0,
      currentSalesCount: 0,
      monthlyRevenue: 0,
      currentRevenue: 0
    }
  }
];

export const INITIAL_AUDITS: AuditLog[] = [
  { id: 'al1', timestamp: '2026-06-27T10:15:00Z', user: 'Gbenga Adebayo', role: 'Sales Manager', action: 'CREATE_LEAD', details: 'Added lead Jessica Adeyemi from Facebook' },
  { id: 'al2', timestamp: '2026-06-26T16:20:00Z', user: 'Tunde Lawal', role: 'Mechanic', action: 'UPDATE_REPAIR_ORDER', details: 'Marked oil change on Mercedes GLE as In Progress' },
  { id: 'al3', timestamp: '2026-06-25T09:00:00Z', user: 'Admin System', role: 'Super Admin', action: 'BACKUP_DB', details: 'Daily automatic system backup executed successfully' }
];
