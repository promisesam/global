export type UserRole = 
  | 'customer'
  | 'super_admin'
  | 'logistics_manager'
  | 'recruitment_manager'
  | 'visa_officer'
  | 'finance_staff'
  | 'customer_support'
  | 'content_manager';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  twoFactorEnabled?: boolean;
  kycStatus: 'unsubmitted' | 'pending' | 'verified' | 'rejected';
  preferredLanguage: 'en' | 'ar' | 'fr';
  preferredCurrency: 'USD' | 'EUR' | 'GBP' | 'AED' | 'CAD' | 'SAR';
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
}

export type ShipmentStatus = 
  | 'Shipment Created'
  | 'Picked Up'
  | 'Processing'
  | 'In Transit'
  | 'Arrived at Facility'
  | 'Departed Facility'
  | 'Customs Processing'
  | 'Customs Cleared'
  | 'Arrived at Destination'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  date: string;
  time: string;
  status: ShipmentStatus;
  location: string;
  facility: string;
  description: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdByUser?: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shipmentType: 'Express Air' | 'Standard Freight' | 'Ocean Cargo' | 'Document Priority' | 'Temperature Controlled';
  serviceSpeed: 'Same-Day' | 'Next-Day Priority' | 'Express 2-3 Days' | 'Standard 5-7 Days';
  
  sender: {
    name: string;
    company?: string;
    address: string;
    city: string;
    country: string;
    phone: string;
  };
  recipient: {
    name: string;
    company?: string;
    address: string;
    city: string;
    country: string;
    phone: string;
  };

  origin: string;
  destination: string;
  currentLocation: string;
  currentCoordinates: {
    lat: number;
    lng: number;
  };
  routeWaypoints?: Array<{
    name: string;
    lat: number;
    lng: number;
    passed: boolean;
  }>;

  packageWeight: number; // in kg
  packageDimensions?: {
    length: number;
    width: number;
    height: number;
  };
  packageCount: number;
  declaredValue: number;
  currency: string;
  shippingCost: number;

  status: ShipmentStatus;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;

  events: TrackingEvent[];
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }>;
  invoiceId?: string;
  assignedStaffId?: string;
}

export type JobApplicationStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Rejected';

export interface JobVacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  country: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid';
  salaryMin: number;
  salaryMax: number;
  currency: string;
  experienceLevel: 'Entry-level' | 'Mid-level' | 'Senior' | 'Lead / Executive';
  educationRequirements: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits?: string[];
  applicationDeadline: string;
  featured?: boolean;
  active: boolean;
  createdAt: string;
  type?: string;
  visaProvided?: boolean;
  postedAt?: string;
}

export interface JobApplication {
  id: string;
  applicationNumber: string;
  jobId: string;
  jobTitle: string;
  department: string;
  userId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  currentLocation: string;
  experienceYears: number;
  resumeFileName: string;
  resumeUrl?: string;
  coverLetter?: string;
  certificates?: Array<{ name: string; url: string }>;
  status: JobApplicationStatus;
  appliedDate: string;
  interviewDate?: string;
  interviewNotes?: string;
  messages: Array<{
    id: string;
    sender: 'applicant' | 'recruiter';
    senderName: string;
    message: string;
    timestamp: string;
  }>;
  internalNotes?: string;
  candidateName?: string;
  candidateEmail?: string;
  cvFileName?: string;
  visaRequired?: boolean;
  appliedAt?: string;
  companyName?: string;
}

export type VisaApplicationStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Documents Under Review'
  | 'Additional Information Required'
  | 'Application Processing'
  | 'Decision Received'
  | 'Completed'
  | 'Cancelled';

export interface VisaCategory {
  id: string;
  code: string;
  name: string;
  country: string;
  countryCode: string;
  categoryType: 'Work Visa' | 'Tourist / Visitor' | 'Student Visa' | 'Business & Investor' | 'Permanent Residency' | 'Transit';
  processingTime: string;
  validityPeriod: string;
  governmentFee: number;
  serviceFee: number;
  currency: string;
  description: string;
  eligibility: string[];
  requiredDocumentsList: string[];
  popular?: boolean;
}

export interface VisaApplication {
  id: string;
  applicationNumber: string;
  userId: string;
  visaCategoryId: string;
  visaName: string;
  destinationCountry: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  passportNumber: string;
  passportExpiry: string;
  nationality: string;
  travelDate: string;
  status: VisaApplicationStatus;
  submittedDate: string;
  lastUpdated: string;
  requiredDocuments: Array<{
    name: string;
    status: 'Required' | 'Uploaded' | 'Verified' | 'Rejected' | 'Replacement Required';
    documentId?: string;
    notes?: string;
  }>;
  appointments: Array<{
    id: string;
    type: 'Document Verification' | 'Biometrics / Consular Interview' | 'Visa Strategy Consultation';
    date: string;
    time: string;
    location: string;
    status: 'Scheduled' | 'Completed' | 'Rescheduled' | 'Cancelled';
  }>;
  messages: Array<{
    id: string;
    sender: 'applicant' | 'officer';
    senderName: string;
    message: string;
    timestamp: string;
  }>;
  paymentId?: string;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  officialDecisionNotes?: string;
  officerNotes?: string;
  assignedOfficerName?: string;
  country?: string;
  visaType?: string;
  submittedAt?: string;
  documents?: Array<{
    name: string;
    status: 'Required' | 'Uploaded' | 'Verified' | 'Rejected' | 'Replacement Required' | string;
    documentId?: string;
    notes?: string;
  }>;
}

export type DocumentType = 
  | 'Passport'
  | 'National ID'
  | 'Curriculum Vitae (CV)'
  | 'Educational Certificate'
  | 'Employment Letter'
  | 'Bank Statement'
  | 'Photograph'
  | 'Shipping Commercial Invoice'
  | 'Bill of Lading'
  | 'Customs Declaration'
  | 'Proof of Address'
  | 'Other';

export type DocumentStatus = 
  | 'Uploaded'
  | 'Under Review'
  | 'Verified'
  | 'Rejected'
  | 'Replacement Required';

export interface AppDocument {
  id: string;
  userId: string;
  userName: string;
  documentType: DocumentType;
  fileName: string;
  fileSize: number; // in bytes
  fileFormat: string;
  fileUrl?: string;
  status: DocumentStatus;
  uploadedAt: string;
  verifiedAt?: string;
  adminNotes?: string;
  relatedService: 'Shipment' | 'Job Recruitment' | 'Visa Assistance' | 'KYC';
  relatedEntityId?: string;
}

export interface KYCRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  idDocumentType: 'Passport' | 'National ID Card' | 'Driving License';
  idNumber: string;
  idDocumentUrl: string;
  proofOfAddressUrl?: string;
  selfieUrl?: string;
  status: 'Pending' | 'Under Review' | 'Verified' | 'Rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
  reviewedBy?: string;
}

export interface PaymentRecord {
  id: string;
  transactionId: string;
  userId: string;
  customerName: string;
  serviceType: 'Courier Freight' | 'Visa Assistance' | 'Recruitment Placement Fee' | 'Appointment Booking' | 'Document Verification';
  relatedEntityId?: string;
  amount: number;
  currency: string;
  paymentMethod: 'Credit/Debit Card (Stripe)' | 'PayPal' | 'Bank Wire Transfer' | 'Corporate Account';
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  createdAt: string;
  invoiceId: string;
  receiptUrl?: string;
  refundAmount?: number;
  refundReason?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  serviceType: string;
  relatedEntityId?: string;
  issueDate: string;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  taxRate: number; // e.g. 0.05 (5%)
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  status: 'Paid' | 'Unpaid' | 'Overdue' | 'Cancelled';
  paymentDate?: string;
  paymentMethod?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: 'Shipment Tracking' | 'Visa Processing' | 'Job Recruitment' | 'Billing & Invoices' | 'Technical Support' | 'General Inquiry';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  subject: string;
  status: 'Open' | 'In Progress' | 'Waiting for Customer' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  messages: Array<{
    id: string;
    senderId: string;
    senderName: string;
    senderRole: 'customer' | 'staff' | 'admin';
    content: string;
    timestamp: string;
    attachments?: string[];
  }>;
}

export interface Appointment {
  id: string;
  appointmentNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  serviceType: 'Visa Consultation' | 'Job Interview' | 'Courier Business Account' | 'Document Verification' | 'Executive Meeting';
  date: string;
  timeSlot: string;
  mode: 'Video Call (Google Meet / Zoom)' | 'In-Person (Headquarters Hub)' | 'Phone Consultation';
  locationOrLink: string;
  status: 'Scheduled' | 'Completed' | 'Rescheduled' | 'Cancelled';
  staffAssigned?: string;
  notes?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'shipment' | 'job' | 'visa' | 'payment' | 'document' | 'appointment' | 'ticket' | 'system';
  link?: string;
  read: boolean;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: 'Shipment' | 'Job' | 'Visa' | 'Document' | 'Payment' | 'User' | 'CMS' | 'Ticket';
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface CMSContent {
  heroTitle: string;
  heroSubtitle: string;
  announcementBanner: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  contactInfo: {
    supportEmail: string;
    phone: string;
    headquarters: string;
    businessHours: string;
  };
  socialLinks: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
  };
  faqs: Array<{
    id: string;
    category: 'Logistics' | 'Recruitment' | 'Visa & Immigration' | 'Billing' | string;
    question: string;
    answer: string;
  }>;
  blogPosts: Array<{
    id: string;
    title: string;
    slug?: string;
    category: 'Logistics' | 'Careers' | 'Immigration' | 'Company News' | string;
    excerpt?: string;
    summary?: string;
    content: string;
    author: string;
    date?: string;
    publishedAt?: string;
    readTime?: string;
    imageUrl?: string;
  }>;
}

// Aliases for convenience across modules
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AED' | 'CAD' | 'SAR' | string;
export type LanguageCode = 'en' | 'ar' | 'fr' | 'de' | 'zh' | string;
export type JobPosting = JobVacancy;
export type ApplicationStatus = JobApplicationStatus | 'applied' | 'screening' | 'interview_scheduled' | 'offer_extended' | 'accepted' | 'rejected';
export type VisaStatus = VisaApplicationStatus | 'draft' | 'submitted' | 'under_review' | 'biometrics_scheduled' | 'approved' | 'additional_docs_required' | 'rejected';

// --- FLIGHT BOOKING & TICKET TYPES ---
export type CabinClass = 'Economy' | 'Premium Economy' | 'Business Class' | 'First Class';
export type FlightBookingStatus = 'Confirmed' | 'Ticket Issued' | 'Checked In' | 'Boarding' | 'Departed' | 'Completed' | 'Cancelled';

export interface FlightPassenger {
  id: string;
  name: string;
  type: 'Adult' | 'Child' | 'Infant';
  passportNumber: string;
  passportExpiry: string;
  nationality: string;
  dateOfBirth?: string;
  seat: string;
  ticketNumber: string;
  specialMeal?: string;
  frequentFlyerNumber?: string;
}

export interface FlightOffer {
  id: string;
  airline: {
    name: string;
    code: string;
    logoUrl?: string;
    accentColor?: string;
  };
  flightNumber: string;
  aircraft: string;
  departure: {
    airportCode: string;
    airportName: string;
    city: string;
    country: string;
    terminal: string;
    gate?: string;
    time: string; // ISO or local time string
  };
  arrival: {
    airportCode: string;
    airportName: string;
    city: string;
    country: string;
    terminal: string;
    gate?: string;
    time: string;
  };
  duration: string; // e.g. "7h 45m"
  stops: number; // 0 = Direct, 1 = 1 Stop
  stopAirport?: string;
  basePrice: number;
  currency: string;
  availableClasses: Array<{
    cabinClass: CabinClass;
    price: number;
    baggage: string;
    seatsLeft: number;
  }>;
  amenities: string[];
}

export interface FlightBooking {
  id: string;
  bookingReference: string; // PNR e.g. "APX-FL-9428"
  ticketNumber: string; // e.g. "ETKT-098-84920194"
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  flightOfferId: string;
  airline: {
    name: string;
    code: string;
    accentColor?: string;
  };
  flightNumber: string;
  aircraft: string;
  departure: {
    airportCode: string;
    airportName: string;
    city: string;
    country: string;
    terminal: string;
    gate: string;
    time: string;
  };
  arrival: {
    airportCode: string;
    airportName: string;
    city: string;
    country: string;
    terminal: string;
    gate: string;
    time: string;
  };
  duration: string;
  cabinClass: CabinClass;
  boardingGroup: string;
  seatNumber: string;
  baggageAllowance: string;
  passengers: FlightPassenger[];
  pricing: {
    baseFare: number;
    airportTaxes: number;
    fuelSurcharge: number;
    baggageFee: number;
    serviceFee: number;
    taxAmount: number;
    totalAmount: number;
    currency: string;
  };
  status: FlightBookingStatus;
  paymentStatus: 'Paid' | 'Pending';
  invoiceId: string;
  paymentId: string;
  bookingDate: string;
  specialRequests?: string;
}

// --- HOTEL BOOKING & INVOICE TYPES ---
export type RoomType = 'Deluxe King Suite' | 'Executive Panoramic Suite' | 'Presidential Suite' | 'Superior Double Room' | 'Grand Oceanfront Studio';
export type HotelBookingStatus = 'Confirmed' | 'Voucher Issued' | 'Checked In' | 'Completed' | 'Cancelled';

export interface HotelOffer {
  id: string;
  hotelName: string;
  destinationCity: string;
  country: string;
  address: string;
  starRating: number;
  imageUrl: string;
  nightlyRate: number;
  currency: string;
  availableRooms: Array<{
    roomType: RoomType;
    nightlyRate: number;
    capacity: number;
    bedConfiguration: string;
    description: string;
  }>;
  amenities: string[];
  description: string;
}

export interface HotelBooking {
  id: string;
  bookingReference: string; // e.g. "HTL-BK-2026-9812"
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  hotelId: string;
  hotelName: string;
  destinationCity: string;
  country: string;
  address: string;
  starRating: number;
  roomType: RoomType;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfGuests: number;
  numberOfRooms: number;
  mealPlan: string;
  amenities: string[];
  pricing: {
    nightlyRate: number;
    subtotal: number;
    tourismTax: number;
    vatTax: number;
    serviceCharge: number;
    totalAmount: number;
    currency: string;
  };
  specialRequests?: string;
  status: HotelBookingStatus;
  paymentStatus: 'Paid' | 'Pending';
  invoiceId: string; // Linked official Hotel Invoice!
  paymentId?: string;
  bookingDate: string;
}

// --- CUSTOM INVOICE CREATION INPUT ---
export interface CreateInvoiceInput {
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  serviceType: string;
  relatedEntityId?: string;
  issueDate?: string;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  taxRate?: number;
  discountAmount?: number;
  currency: string;
  status?: 'Paid' | 'Unpaid';
  notes?: string;
}


