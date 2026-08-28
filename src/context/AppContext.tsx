import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  UserRole, 
  Shipment, 
  JobVacancy, 
  JobApplication, 
  VisaCategory, 
  VisaApplication, 
  AppDocument, 
  KYCRecord, 
  PaymentRecord, 
  Invoice, 
  SupportTicket, 
  Appointment, 
  AuditLog, 
  CMSContent, 
  NotificationItem,
  FlightOffer,
  FlightBooking,
  HotelOffer,
  HotelBooking,
  CreateInvoiceInput
} from '../types';
import { translations, Language } from '../i18n/translations';
import { CurrencyCode, formatPrice } from '../lib/currencies';
import {
  INITIAL_FLIGHT_OFFERS,
  INITIAL_FLIGHT_BOOKINGS,
  INITIAL_HOTEL_OFFERS,
  INITIAL_HOTEL_BOOKINGS
} from '../data/initialData';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  message?: string;
}

interface AppContextType {
  // Navigation & View
  currentView: string;
  setCurrentView: (view: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;
  t: typeof translations['en'];

  // Auth & Roles
  currentUser: User;
  allUsers: User[];
  switchUserRole: (role: UserRole) => void;
  loginUser: (email: string, password?: string) => Promise<boolean>;
  registerUser: (name: string, email: string, phone: string) => Promise<boolean>;
  logoutUser: () => void;

  // Active Data
  shipments: Shipment[];
  jobs: JobVacancy[];
  jobApplications: JobApplication[];
  visaCategories: VisaCategory[];
  visaApplications: VisaApplication[];
  documents: AppDocument[];
  kycRecords: KYCRecord[];
  invoices: Invoice[];
  payments: PaymentRecord[];
  tickets: SupportTicket[];
  appointments: Appointment[];
  auditLogs: AuditLog[];
  cmsContent: CMSContent;
  notifications: NotificationItem[];
  unreadNotificationCount: number;

  // Flights & Hotels
  flightOffers: FlightOffer[];
  flightBookings: FlightBooking[];
  hotelOffers: HotelOffer[];
  hotelBookings: HotelBooking[];

  // Quick Tracker
  activeTrackingQuery: string;
  setActiveTrackingQuery: (q: string) => void;
  searchedShipment: Shipment | null;
  trackShipmentByNumber: (trackingNumber: string) => Promise<Shipment | null>;

  // Actions
  refreshAllData: () => Promise<void>;
  createShipment: (shipmentData: Partial<Shipment>) => Promise<Shipment>;
  addTrackingEvent: (shipmentId: string, eventData: any) => Promise<void>;
  applyForJob: (jobId: string, applicationData: any) => Promise<JobApplication>;
  updateJobAppStatus: (appId: string, statusData: any) => Promise<void>;
  applyForVisa: (visaData: any) => Promise<VisaApplication>;
  updateVisaStatus: (visaAppId: string, statusData: any) => Promise<void>;
  uploadDocument: (docData: any) => Promise<AppDocument>;
  verifyDocument: (docId: string, status: any, notes?: string) => Promise<void>;
  processPayment: (paymentData: any) => Promise<PaymentRecord>;
  createSupportTicket: (ticketData: any) => Promise<SupportTicket>;
  sendTicketMessage: (ticketId: string, content: string) => Promise<void>;
  updateTicketStatus: (ticketId: string, status: string) => Promise<void>;
  bookAppointment: (aptData: any) => Promise<Appointment>;
  updateAppointment: (aptId: string, updates: any) => Promise<void>;
  updateCMS: (contentUpdates: Partial<CMSContent>) => Promise<void>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Flight & Hotel & Custom Invoice Operations
  bookFlight: (flightData: any) => Promise<FlightBooking>;
  checkinFlight: (bookingId: string, seatNumber?: string) => Promise<void>;
  bookHotel: (hotelData: any) => Promise<HotelBooking>;
  createCustomInvoice: (invoiceData: CreateInvoiceInput) => Promise<Invoice>;

  // Modals & Document Views
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  selectedInvoice: Invoice | null;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  selectedLabelShipment: Shipment | null;
  setSelectedLabelShipment: (shipment: Shipment | null) => void;
  checkoutModalData: {
    open: boolean;
    serviceType: string;
    amount: number;
    description: string;
    invoiceId?: string;
    relatedEntityId?: string;
  };
  openCheckout: (data: { serviceType: string; amount: number; description: string; invoiceId?: string; relatedEntityId?: string }) => void;
  closeCheckout: () => void;
  appointmentModalOpen: boolean;
  setAppointmentModalOpen: (open: boolean) => void;
  selectedJobForApply: JobVacancy | null;
  setSelectedJobForApply: (job: JobVacancy | null) => void;

  // Flight & Hotel & Invoice Modals
  selectedFlightTicket: FlightBooking | null;
  setSelectedFlightTicket: (booking: FlightBooking | null) => void;
  selectedFlightReceipt: FlightBooking | null;
  setSelectedFlightReceipt: (booking: FlightBooking | null) => void;
  selectedHotelBooking: HotelBooking | null;
  setSelectedHotelBooking: (booking: HotelBooking | null) => void;
  flightBookingModalOpen: boolean;
  setFlightBookingModalOpen: (open: boolean) => void;
  selectedFlightOfferForBook: FlightOffer | null;
  setSelectedFlightOfferForBook: (offer: FlightOffer | null) => void;
  hotelBookingModalOpen: boolean;
  setHotelBookingModalOpen: (open: boolean) => void;
  selectedHotelOfferForBook: HotelOffer | null;
  setSelectedHotelOfferForBook: (offer: HotelOffer | null) => void;
  createInvoiceModalOpen: boolean;
  setCreateInvoiceModalOpen: (open: boolean) => void;
  openFlightBookingModal: (offer?: FlightOffer) => void;
  openHotelBookingModal: (offer?: HotelOffer) => void;
  openTicketModal: (booking: FlightBooking) => void;
  openReceiptModal: (booking: FlightBooking) => void;

  // Toast Alerts
  toasts: Toast[];
  showToast: (type: 'success' | 'info' | 'error' | 'warning', title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [language, setLanguageState] = useState<Language>('en');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [activeTrackingQuery, setActiveTrackingQuery] = useState<string>('');
  const [searchedShipment, setSearchedShipment] = useState<Shipment | null>(null);

  // Users & Auth
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr-customer-1',
    name: 'Alexander Wright',
    email: 'k83576855@gmail.com',
    phone: '+1 (555) 234-8901',
    role: 'customer',
    createdAt: '2026-01-15T08:30:00Z',
    twoFactorEnabled: true,
    kycStatus: 'verified',
    preferredLanguage: 'en',
    preferredCurrency: 'USD',
    notificationPreferences: { email: true, sms: true, whatsapp: true },
  });

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedLabelShipment, setSelectedLabelShipment] = useState<Shipment | null>(null);
  const [checkoutModalData, setCheckoutModalData] = useState<{
    open: boolean;
    serviceType: string;
    amount: number;
    description: string;
    invoiceId?: string;
    relatedEntityId?: string;
  }>({
    open: false,
    serviceType: 'Courier Freight',
    amount: 0,
    description: '',
  });
  const [appointmentModalOpen, setAppointmentModalOpen] = useState<boolean>(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobVacancy | null>(null);

  // Flight & Hotel Modals & Selectors
  const [selectedFlightTicket, setSelectedFlightTicket] = useState<FlightBooking | null>(null);
  const [selectedFlightReceipt, setSelectedFlightReceipt] = useState<FlightBooking | null>(null);
  const [selectedHotelBooking, setSelectedHotelBooking] = useState<HotelBooking | null>(null);
  const [flightBookingModalOpen, setFlightBookingModalOpen] = useState<boolean>(false);
  const [selectedFlightOfferForBook, setSelectedFlightOfferForBook] = useState<FlightOffer | null>(null);
  const [hotelBookingModalOpen, setHotelBookingModalOpen] = useState<boolean>(false);
  const [selectedHotelOfferForBook, setSelectedHotelOfferForBook] = useState<HotelOffer | null>(null);
  const [createInvoiceModalOpen, setCreateInvoiceModalOpen] = useState<boolean>(false);

  // Live Data Lists
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [visaCategories, setVisaCategories] = useState<VisaCategory[]>([]);
  const [visaApplications, setVisaApplications] = useState<VisaApplication[]>([]);
  const [documents, setDocuments] = useState<AppDocument[]>([]);
  const [kycRecords, setKycRecords] = useState<KYCRecord[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [flightOffers, setFlightOffers] = useState<FlightOffer[]>([...INITIAL_FLIGHT_OFFERS as any]);
  const [flightBookings, setFlightBookings] = useState<FlightBooking[]>([...INITIAL_FLIGHT_BOOKINGS as any]);
  const [hotelOffers, setHotelOffers] = useState<HotelOffer[]>([...INITIAL_HOTEL_OFFERS as any]);
  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([...INITIAL_HOTEL_BOOKINGS as any]);
  const [cmsContent, setCmsContent] = useState<CMSContent>({
    heroTitle: 'Global Freight, International Talent & Visa Mobility Solutions',
    heroSubtitle: 'ApexGlobal seamlessly integrates express courier logistics, talent recruitment, and visa assistance.',
    announcementBanner: { enabled: true, text: 'Fast-track Air Freight corridors active between Frankfurt, Dubai, London & New York.' },
    contactInfo: { supportEmail: 'support@apexglobal.com', phone: '+1 (800) 555-0199', headquarters: 'Apex Tower, London', businessHours: '24/7' },
    socialLinks: { linkedin: '#', twitter: '#', facebook: '#', instagram: '#' },
    faqs: [],
    blogPosts: [],
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      userId: 'usr-customer-1',
      title: 'Shipment APX-98241 Update',
      message: 'Package is Out for Delivery with Manhattan South Delivery Hub.',
      type: 'shipment',
      read: false,
      timestamp: '2026-08-28T07:30:00Z',
    },
    {
      id: 'notif-2',
      userId: 'usr-customer-1',
      title: 'Job Interview Scheduled',
      message: 'Technical Interview for Senior Cloud Solutions Architect on Sept 2nd.',
      type: 'job',
      read: false,
      timestamp: '2026-08-20T09:20:00Z',
    },
    {
      id: 'notif-3',
      userId: 'usr-customer-1',
      title: 'Visa Document Approved',
      message: 'Your educational certificate has been successfully verified for UAE visa.',
      type: 'visa',
      read: true,
      timestamp: '2026-08-19T11:00:00Z',
    }
  ]);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: 'success' | 'info' | 'error' | 'warning', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Language & RTL handler
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', lang);
    }
  };

  const t = translations[language] || translations.en;

  // Initial Fetch
  const refreshAllData = async () => {
    try {
      const [
        usersRes,
        shipmentsRes,
        jobsRes,
        jobAppsRes,
        visaCatRes,
        visaAppsRes,
        docsRes,
        kycRes,
        invRes,
        payRes,
        tktRes,
        aptRes,
        auditRes,
        cmsRes,
        flightOffersRes,
        flightBookingsRes,
        hotelOffersRes,
        hotelBookingsRes,
      ] = await Promise.all([
        fetch('/api/auth/users').then(r => r.json()).catch(() => []),
        fetch('/api/shipments').then(r => r.json()).catch(() => []),
        fetch('/api/jobs').then(r => r.json()).catch(() => []),
        fetch('/api/job-applications').then(r => r.json()).catch(() => []),
        fetch('/api/visa-categories').then(r => r.json()).catch(() => []),
        fetch('/api/visa-applications').then(r => r.json()).catch(() => []),
        fetch('/api/documents').then(r => r.json()).catch(() => []),
        fetch('/api/kyc').then(r => r.json()).catch(() => []),
        fetch('/api/invoices').then(r => r.json()).catch(() => []),
        fetch('/api/payments').then(r => r.json()).catch(() => []),
        fetch('/api/tickets').then(r => r.json()).catch(() => []),
        fetch('/api/appointments').then(r => r.json()).catch(() => []),
        fetch('/api/audit-logs').then(r => r.json()).catch(() => []),
        fetch('/api/cms').then(r => r.json()).catch(() => null),
        fetch('/api/flights/offers').then(r => r.json()).catch(() => INITIAL_FLIGHT_OFFERS),
        fetch('/api/flights/bookings').then(r => r.json()).catch(() => INITIAL_FLIGHT_BOOKINGS),
        fetch('/api/hotels/offers').then(r => r.json()).catch(() => INITIAL_HOTEL_OFFERS),
        fetch('/api/hotels/bookings').then(r => r.json()).catch(() => INITIAL_HOTEL_BOOKINGS),
      ]);

      if (Array.isArray(usersRes)) setAllUsers(usersRes);
      if (Array.isArray(shipmentsRes)) {
        setShipments(shipmentsRes);
        if (!searchedShipment && shipmentsRes.length > 0) {
          setSearchedShipment(shipmentsRes[0]);
        }
      }
      if (Array.isArray(jobsRes)) setJobs(jobsRes);
      if (Array.isArray(jobAppsRes)) setJobApplications(jobAppsRes);
      if (Array.isArray(visaCatRes)) setVisaCategories(visaCatRes);
      if (Array.isArray(visaAppsRes)) setVisaApplications(visaAppsRes);
      if (Array.isArray(docsRes)) setDocuments(docsRes);
      if (Array.isArray(kycRes)) setKycRecords(kycRes);
      if (Array.isArray(invRes)) setInvoices(invRes);
      if (Array.isArray(payRes)) setPayments(payRes);
      if (Array.isArray(tktRes)) setTickets(tktRes);
      if (Array.isArray(aptRes)) setAppointments(aptRes);
      if (Array.isArray(auditRes)) setAuditLogs(auditRes);
      if (cmsRes && cmsRes.heroTitle) setCmsContent(cmsRes);
      if (Array.isArray(flightOffersRes)) setFlightOffers(flightOffersRes);
      if (Array.isArray(flightBookingsRes)) setFlightBookings(flightBookingsRes);
      if (Array.isArray(hotelOffersRes)) setHotelOffers(hotelOffersRes);
      if (Array.isArray(hotelBookingsRes)) setHotelBookings(hotelBookingsRes);
    } catch (err) {
      console.warn('API sync warning:', err);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Quick Tracking
  const trackShipmentByNumber = async (trackingNumber: string): Promise<Shipment | null> => {
    const cleanTn = trackingNumber.trim().toUpperCase();
    try {
      const res = await fetch(`/api/shipments/track/${encodeURIComponent(cleanTn)}`);
      if (res.ok) {
        const item = await res.json();
        setSearchedShipment(item);
        setActiveTrackingQuery(cleanTn);
        return item;
      } else {
        // Look in local state
        const match = shipments.find(s => s.trackingNumber.toUpperCase() === cleanTn);
        if (match) {
          setSearchedShipment(match);
          setActiveTrackingQuery(cleanTn);
          return match;
        }
        showToast('error', 'Tracking Number Not Found', `No shipment records match ${cleanTn}. Please verify and retry.`);
        return null;
      }
    } catch {
      const match = shipments.find(s => s.trackingNumber.toUpperCase() === cleanTn);
      if (match) {
        setSearchedShipment(match);
        return match;
      }
      return null;
    }
  };

  // Switch role test helper
  const switchUserRole = (role: UserRole) => {
    const targetUser = allUsers.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
    } else {
      setCurrentUser(prev => ({
        ...prev,
        role,
        name: role === 'super_admin' ? 'Eleanor Vance (Chief Ops)' :
              role === 'logistics_manager' ? 'Marcus Chen (Logistics Mgr)' :
              role === 'recruitment_manager' ? 'Sophia Al-Mansoor (Talent Lead)' :
              role === 'visa_officer' ? 'Claire Dupont (Visa Officer)' :
              role === 'finance_staff' ? 'David Sterling (Finance)' :
              role === 'customer_support' ? 'Fatima Zahra (Support)' :
              role === 'content_manager' ? 'Liam O’Connor (CMS)' : 'Alexander Wright',
      }));
    }
    showToast('info', 'Switched Persona', `Active profile role changed to: ${role.replace('_', ' ').toUpperCase()}`);
  };

  const loginUser = async (email: string, password?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        setAuthModalOpen(false);
        showToast('success', 'Welcome Back', `Signed in as ${data.user.name}`);
        return true;
      }
    } catch {
      showToast('error', 'Sign In Failed', 'Could not verify credentials.');
    }
    return false;
  };

  const registerUser = async (name: string, email: string, phone: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        setAuthModalOpen(false);
        await refreshAllData();
        showToast('success', 'Account Registered', 'Welcome to ApexGlobal. Your verified account is ready.');
        return true;
      }
    } catch {
      showToast('error', 'Registration Failed', 'Please verify your information.');
    }
    return false;
  };

  const logoutUser = () => {
    switchUserRole('customer');
    setCurrentView('home');
    showToast('info', 'Signed Out', 'You have been logged out.');
  };

  // Action methods
  const createShipment = async (shipmentData: Partial<Shipment>): Promise<Shipment> => {
    const res = await fetch('/api/shipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...shipmentData,
        userId: currentUser.id,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        customerPhone: currentUser.phone,
      }),
    });
    const newShipment = await res.json();
    setShipments(prev => [newShipment, ...prev]);
    setSearchedShipment(newShipment);
    await refreshAllData();
    showToast('success', 'Shipment Booked', `Tracking # ${newShipment.trackingNumber} generated with instant waybill.`);
    return newShipment;
  };

  const addTrackingEvent = async (shipmentId: string, eventData: any) => {
    const res = await fetch(`/api/shipments/${shipmentId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...eventData,
        createdByUser: currentUser.name,
      }),
    });
    const result = await res.json();
    if (result.shipment) {
      setShipments(prev => prev.map(s => s.id === shipmentId ? result.shipment : s));
      if (searchedShipment?.id === shipmentId) {
        setSearchedShipment(result.shipment);
      }
      showToast('success', 'Tracking Checkpoint Added', `New status "${eventData.status}" published.`);
    }
  };

  const applyForJob = async (jobId: string, applicationData: any): Promise<JobApplication> => {
    const res = await fetch(`/api/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...applicationData,
        userId: currentUser.id,
        applicantName: currentUser.name,
        applicantEmail: currentUser.email,
        applicantPhone: currentUser.phone,
      }),
    });
    const newApp = await res.json();
    setJobApplications(prev => [newApp, ...prev]);
    showToast('success', 'Application Submitted', 'Your CV and dossier have been sent to our talent acquisition team.');
    return newApp;
  };

  const updateJobAppStatus = async (appId: string, statusData: any) => {
    const res = await fetch(`/api/job-applications/${appId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusData),
    });
    const updated = await res.json();
    setJobApplications(prev => prev.map(a => a.id === appId ? updated : a));
    showToast('success', 'Applicant Status Updated', `Status changed to ${statusData.status}`);
  };

  const applyForVisa = async (visaData: any): Promise<VisaApplication> => {
    const res = await fetch('/api/visa-applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...visaData,
        userId: currentUser.id,
        applicantName: currentUser.name,
        applicantEmail: currentUser.email,
        applicantPhone: currentUser.phone,
      }),
    });
    const newVisaApp = await res.json();
    setVisaApplications(prev => [newVisaApp, ...prev]);
    await refreshAllData();
    showToast('success', 'Visa Dossier Created', `Application #${newVisaApp.applicationNumber} initiated under compliance review.`);
    return newVisaApp;
  };

  const updateVisaStatus = async (visaAppId: string, statusData: any) => {
    const res = await fetch(`/api/visa-applications/${visaAppId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusData),
    });
    const updated = await res.json();
    setVisaApplications(prev => prev.map(v => v.id === visaAppId ? updated : v));
    showToast('success', 'Visa Application Updated', `Case file updated to: ${statusData.status}`);
  };

  const uploadDocument = async (docData: any): Promise<AppDocument> => {
    const res = await fetch('/api/documents/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...docData,
        userId: currentUser.id,
        userName: currentUser.name,
      }),
    });
    const newDoc = await res.json();
    setDocuments(prev => [newDoc, ...prev]);
    showToast('success', 'Document Uploaded', `${newDoc.fileName} placed in secure compliance vault.`);
    return newDoc;
  };

  const verifyDocument = async (docId: string, status: any, notes?: string) => {
    const res = await fetch(`/api/documents/${docId}/verify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes: notes }),
    });
    const updated = await res.json();
    setDocuments(prev => prev.map(d => d.id === docId ? updated : d));
    showToast('success', 'Document Reviewed', `Status set to ${status}`);
  };

  const processPayment = async (paymentData: any): Promise<PaymentRecord> => {
    const res = await fetch('/api/payments/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...paymentData,
        userId: currentUser.id,
        customerName: currentUser.name,
      }),
    });
    const data = await res.json();
    setPayments(prev => [data.payment, ...prev]);
    await refreshAllData();
    showToast('success', 'Payment Successful', `Transaction ${data.payment.transactionId} confirmed.`);
    return data.payment;
  };

  const createSupportTicket = async (ticketData: any): Promise<SupportTicket> => {
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...ticketData,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
      }),
    });
    const newTkt = await res.json();
    setTickets(prev => [newTkt, ...prev]);
    showToast('success', 'Ticket Submitted', `Ticket #${newTkt.ticketNumber} opened. Our desk will respond promptly.`);
    return newTkt;
  };

  const sendTicketMessage = async (ticketId: string, content: string) => {
    const res = await fetch(`/api/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role === 'customer' ? 'customer' : 'staff',
        content,
      }),
    });
    const updated = await res.json();
    setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    const res = await fetch(`/api/tickets/${ticketId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, assignedStaffName: currentUser.name }),
    });
    const updated = await res.json();
    setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
    showToast('info', 'Ticket Status', `Ticket marked as ${status}`);
  };

  const bookAppointment = async (aptData: any): Promise<Appointment> => {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...aptData,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userPhone: currentUser.phone,
      }),
    });
    const newApt = await res.json();
    setAppointments(prev => [newApt, ...prev]);
    showToast('success', 'Appointment Scheduled', `Confirmed for ${newApt.date} (${newApt.timeSlot}). Calendar invite sent.`);
    return newApt;
  };

  const updateAppointment = async (aptId: string, updates: any) => {
    const res = await fetch(`/api/appointments/${aptId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const updated = await res.json();
    setAppointments(prev => prev.map(a => a.id === aptId ? updated : a));
    showToast('info', 'Appointment Updated', `Status: ${updates.status || 'Updated'}`);
  };

  const updateCMS = async (contentUpdates: Partial<CMSContent>) => {
    const res = await fetch('/api/cms', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contentUpdates),
    });
    const updated = await res.json();
    setCmsContent(updated);
    showToast('success', 'CMS Published', 'Website content and announcements refreshed.');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const openCheckout = (data: { serviceType: string; amount: number; description: string; invoiceId?: string; relatedEntityId?: string }) => {
    setCheckoutModalData({
      open: true,
      serviceType: data.serviceType,
      amount: data.amount,
      description: data.description,
      invoiceId: data.invoiceId,
      relatedEntityId: data.relatedEntityId,
    });
  };

  const closeCheckout = () => {
    setCheckoutModalData(prev => ({ ...prev, open: false }));
  };

  // Flight & Hotel Actions
  const bookFlight = async (flightData: any): Promise<FlightBooking> => {
    const res = await fetch('/api/flights/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...flightData,
        userId: currentUser.id,
        customerName: flightData.customerName || currentUser.name,
        customerEmail: flightData.customerEmail || currentUser.email,
        customerPhone: flightData.customerPhone || currentUser.phone,
      }),
    });
    const result = await res.json();
    const newBooking: FlightBooking = result.booking || result;
    setFlightBookings(prev => [newBooking, ...prev]);
    if (result.invoice) {
      setInvoices(prev => [result.invoice, ...prev]);
    }
    if (result.payment) {
      setPayments(prev => [result.payment, ...prev]);
    }
    showToast('success', 'Flight Booked Successfully', `Booking Reference: ${newBooking.bookingReference}. Ticket and tax receipt issued.`);
    return newBooking;
  };

  const checkinFlight = async (bookingId: string, seatNumber?: string) => {
    const res = await fetch(`/api/flights/bookings/${bookingId}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seatNumber }),
    });
    const updated = await res.json();
    setFlightBookings(prev => prev.map(b => b.id === bookingId ? updated : b));
    showToast('success', 'Boarding Pass Ready', `Checked in for ${updated.flightNumber}. Seat: ${updated.seatNumber}`);
  };

  const bookHotel = async (hotelData: any): Promise<HotelBooking> => {
    const res = await fetch('/api/hotels/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...hotelData,
        userId: currentUser.id,
        customerName: hotelData.customerName || currentUser.name,
        customerEmail: hotelData.customerEmail || currentUser.email,
        customerPhone: hotelData.customerPhone || currentUser.phone,
      }),
    });
    const result = await res.json();
    const newBooking: HotelBooking = result.booking || result;
    setHotelBookings(prev => [newBooking, ...prev]);
    if (result.invoice) {
      setInvoices(prev => [result.invoice, ...prev]);
    }
    if (result.payment) {
      setPayments(prev => [result.payment, ...prev]);
    }
    showToast('success', 'Hotel Reservation Confirmed', `Booking Ref: ${newBooking.bookingReference}. Commercial invoice generated.`);
    return newBooking;
  };

  const createCustomInvoice = async (invoiceData: CreateInvoiceInput): Promise<Invoice> => {
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...invoiceData,
        userId: currentUser.id,
      }),
    });
    const newInvoice = await res.json();
    setInvoices(prev => [newInvoice, ...prev]);
    showToast('success', 'Invoice Generated', `Invoice ${newInvoice.invoiceNumber} created and recorded in accounting ledger.`);
    return newInvoice;
  };

  const openFlightBookingModal = (offer?: FlightOffer) => {
    if (offer) setSelectedFlightOfferForBook(offer);
    setFlightBookingModalOpen(true);
  };

  const openHotelBookingModal = (offer?: HotelOffer) => {
    if (offer) setSelectedHotelOfferForBook(offer);
    setHotelBookingModalOpen(true);
  };

  const openTicketModal = (booking: FlightBooking) => {
    setSelectedFlightTicket(booking);
  };

  const openReceiptModal = (booking: FlightBooking) => {
    setSelectedFlightReceipt(booking);
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        language,
        setLanguage,
        currency,
        setCurrency,
        t,
        currentUser,
        allUsers,
        switchUserRole,
        loginUser,
        registerUser,
        logoutUser,
        shipments,
        jobs,
        jobApplications,
        visaCategories,
        visaApplications,
        documents,
        kycRecords,
        invoices,
        payments,
        tickets,
        appointments,
        auditLogs,
        cmsContent,
        notifications,
        unreadNotificationCount,
        flightOffers,
        flightBookings,
        hotelOffers,
        hotelBookings,
        activeTrackingQuery,
        setActiveTrackingQuery,
        searchedShipment,
        trackShipmentByNumber,
        refreshAllData,
        createShipment,
        addTrackingEvent,
        applyForJob,
        updateJobAppStatus,
        applyForVisa,
        updateVisaStatus,
        uploadDocument,
        verifyDocument,
        processPayment,
        createSupportTicket,
        sendTicketMessage,
        updateTicketStatus,
        bookAppointment,
        updateAppointment,
        updateCMS,
        markNotificationRead,
        markAllNotificationsRead,
        bookFlight,
        checkinFlight,
        bookHotel,
        createCustomInvoice,
        authModalOpen,
        setAuthModalOpen,
        selectedInvoice,
        setSelectedInvoice,
        selectedLabelShipment,
        setSelectedLabelShipment,
        checkoutModalData,
        openCheckout,
        closeCheckout,
        appointmentModalOpen,
        setAppointmentModalOpen,
        selectedJobForApply,
        setSelectedJobForApply,
        selectedFlightTicket,
        setSelectedFlightTicket,
        selectedFlightReceipt,
        setSelectedFlightReceipt,
        selectedHotelBooking,
        setSelectedHotelBooking,
        flightBookingModalOpen,
        setFlightBookingModalOpen,
        selectedFlightOfferForBook,
        setSelectedFlightOfferForBook,
        hotelBookingModalOpen,
        setHotelBookingModalOpen,
        selectedHotelOfferForBook,
        setSelectedHotelOfferForBook,
        createInvoiceModalOpen,
        setCreateInvoiceModalOpen,
        openFlightBookingModal,
        openHotelBookingModal,
        openTicketModal,
        openReceiptModal,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
