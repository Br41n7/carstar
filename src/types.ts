/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole =
  | 'Super Admin'
  | 'Dealer Owner'
  | 'Sales Manager'
  | 'Sales Representative'
  | 'Inventory Manager'
  | 'Mechanic'
  | 'Accountant'
  | 'Customer';

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
}

export type VehicleCondition = 'New' | 'Used' | 'Certified' | 'Imported' | 'Local';
export type VehicleStatus = 'Available' | 'Reserved' | 'Sold' | 'Maintenance' | 'Auction';

export interface Vehicle {
  id: string;
  vin: string;
  plateNumber: string;
  engineNumber: string;
  chassisNumber: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  mileage: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Automatic' | 'Manual' | 'CVT';
  color: string;
  bodyType: 'Sedan' | 'SUV' | 'Coupe' | 'Hatchback' | 'Pickup' | 'Convertible' | 'Van';
  driveType: 'AWD' | 'FWD' | 'RWD' | '4WD';
  horsepower: number;
  engineCapacity: string;
  condition: VehicleCondition;
  price: number;
  discount: number;
  purchaseCost: number;
  expectedProfit: number;
  status: VehicleStatus;
  images: string[];
  features: string[];
  warranty: string;
  insuranceDetails?: string;
  ownershipHistory: string;
  serviceRecords: ServiceRecord[];
  documents: VehicleDocument[];
  branchId: string;
  qrCodeUrl?: string;
  arrivalDate: string;
}

export interface ServiceRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  cost: number;
  mechanic: string;
  mileage: number;
}

export interface VehicleDocument {
  id: string;
  name: string;
  type: 'Invoice' | 'Receipt' | 'Contract' | 'Inspection' | 'Insurance' | 'Warranty' | 'Customs';
  url: string;
  uploadedAt: string;
  size: string;
  version: string;
  signedBy?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  type: 'Auction' | 'Trade-in' | 'Direct Dealer' | 'Importer';
}

export interface PurchaseRecord {
  id: string;
  vehicleId: string;
  supplierId: string;
  purchaseDate: string;
  costBreakdown: {
    basePrice: number;
    shipping: number;
    taxes: number;
    importDuties: number;
    inspection: number;
  };
  totalCost: number;
  expectedSellingPrice: number;
  paymentStatus: 'Paid' | 'Pending' | 'Installment';
  source: 'Auction' | 'Trade-in' | 'Direct' | 'Import';
  invoiceNumber: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  rating: number; // 1-5
  documents: {
    idType: 'Driving License' | 'National ID' | 'Passport' | 'Proof of Address';
    docNumber: string;
    verified: boolean;
  }[];
  purchaseHistory: string[]; // vehicleIds
  communications: CommunicationLog[];
  referrals: string[];
}

export interface CommunicationLog {
  id: string;
  date: string;
  type: 'Call' | 'Email' | 'SMS' | 'WhatsApp';
  subject: string;
  notes: string;
  agentName: string;
}

export interface Lead {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  source: 'Website' | 'Facebook' | 'Instagram' | 'Google Ads' | 'Walk-in' | 'Phone' | 'Referral';
  status: 'New' | 'Contacted' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  interestedVehicleId?: string;
  assignedTo: string;
  notes: string;
  score: number; // AI score 1-100
  createdAt: string;
}

export interface TestDrive {
  id: string;
  vehicleId: string;
  customerId: string;
  customerName: string;
  salespersonId: string;
  salespersonName: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Approved' | 'Pending';
  licenseVerified: boolean;
  feedback?: string;
  result?: 'Purchased' | 'Declined' | 'Follow-up';
}

export interface Reservation {
  id: string;
  vehicleId: string;
  customerId: string;
  customerName: string;
  reservationDate: string;
  expirationDate: string;
  depositAmount: number;
  status: 'Active' | 'Completed' | 'Expired' | 'Refunded';
  agreementUrl?: string;
}

export interface FinanceDeal {
  id: string;
  vehicleId: string;
  customerId: string;
  type: 'Bank Loan' | 'Dealer Financing' | 'Cash Sale';
  bankName?: string;
  loanAmount: number;
  interestRate: number; // e.g. 5.5%
  termMonths: number;
  monthlyPayment: number;
  outstandingBalance: number;
  paymentSchedule: PaymentInstallment[];
  status: 'Pending' | 'Active' | 'Default Alert' | 'Paid Off';
}

export interface PaymentInstallment {
  id: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidDate?: string;
}

export interface InsurancePolicy {
  id: string;
  vehicleId: string;
  companyName: string;
  policyNumber: string;
  premiumAmount: number;
  coverage: string;
  startDate: string;
  expirationDate: string;
  status: 'Active' | 'Expired' | 'Pending Renewal';
  claims: InsuranceClaim[];
}

export interface InsuranceClaim {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Declined';
}

export interface RepairOrder {
  id: string;
  vehicleId: string;
  mechanicId: string;
  mechanicName: string;
  date: string;
  status: 'Diagnosing' | 'Awaiting Parts' | 'In Progress' | 'Completed';
  serviceType: 'Oil Change' | 'Brake Service' | 'Battery' | 'Engine' | 'Tire Rotation' | 'Inspection' | 'Warranty Repair';
  laborCost: number;
  partsUsed: PartUsage[];
  totalCost: number;
  notes: string;
}

export interface PartUsage {
  partId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface PartItem {
  id: string;
  name: string;
  partNumber: string;
  category: string;
  stock: number;
  minStock: number;
  supplier: string;
  unitPrice: number;
  warehouse: string;
  barcode: string;
}

export interface Expense {
  id: string;
  date: string;
  category: 'Fuel' | 'Transportation' | 'Salary' | 'Office' | 'Utilities' | 'Marketing' | 'Repairs' | 'Insurance' | 'Taxes' | 'Miscellaneous';
  amount: number;
  description: string;
  isRecurring: boolean;
  branchId: string;
}

export interface SalesDeal {
  id: string;
  vehicleId: string;
  customerId: string;
  customerName: string;
  salespersonId: string;
  salespersonName: string;
  date: string;
  dealType: 'Cash' | 'Financed' | 'Trade-In';
  sellingPrice: number;
  discount: number;
  deposit: number;
  warrantySelected: string;
  accessoriesSelected: string[];
  totalPrice: number;
  commission: number;
  status: 'Quotation' | 'Negotiation' | 'Reserved' | 'Paid' | 'Handed Over';
  invoiceNumber: string;
  signatureData?: string; // Base64 signature
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: 'Sales' | 'Inventory' | 'Workshop' | 'Accounting' | 'Administration';
  role: UserRole;
  salary: number;
  commissionRate: number; // e.g. 5% = 0.05
  joinedDate: string;
  attendanceStatus: 'Present' | 'Absent' | 'Leave' | 'Late';
  targets: {
    monthlySalesCount: number;
    currentSalesCount: number;
    monthlyRevenue: number;
    currentRevenue: number;
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
}
