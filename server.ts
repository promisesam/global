import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_USERS,
  INITIAL_SHIPMENTS,
  INITIAL_JOBS,
  INITIAL_JOB_APPLICATIONS,
  INITIAL_VISA_CATEGORIES,
  INITIAL_VISA_APPLICATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_KYC_RECORDS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_TICKETS,
  INITIAL_APPOINTMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CMS_CONTENT,
  INITIAL_FLIGHT_OFFERS,
  INITIAL_FLIGHT_BOOKINGS,
  INITIAL_HOTEL_OFFERS,
  INITIAL_HOTEL_BOOKINGS,
} from './src/data/initialData.ts';
import { 
  Shipment, 
  JobVacancy, 
  JobApplication, 
  VisaApplication, 
  AppDocument, 
  KYCRecord, 
  PaymentRecord, 
  Invoice, 
  SupportTicket, 
  Appointment, 
  AuditLog, 
  CMSContent, 
  User,
  FlightOffer,
  FlightBooking,
  HotelOffer,
  HotelBooking,
  CreateInvoiceInput
} from './src/types.ts';

// In-Memory Database Store (Simulating relational database with ACID-like state and instant reactivity)
class DatabaseStore {
  users: User[] = [...INITIAL_USERS];
  shipments: Shipment[] = [...INITIAL_SHIPMENTS];
  jobs: JobVacancy[] = [...INITIAL_JOBS];
  jobApplications: JobApplication[] = [...INITIAL_JOB_APPLICATIONS];
  visaCategories = [...INITIAL_VISA_CATEGORIES];
  visaApplications: VisaApplication[] = [...INITIAL_VISA_APPLICATIONS];
  documents: AppDocument[] = [...INITIAL_DOCUMENTS];
  kycRecords: KYCRecord[] = [...INITIAL_KYC_RECORDS];
  invoices: Invoice[] = [...INITIAL_INVOICES];
  payments: PaymentRecord[] = [...INITIAL_PAYMENTS];
  tickets: SupportTicket[] = [...INITIAL_TICKETS];
  appointments: Appointment[] = [...INITIAL_APPOINTMENTS];
  auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
  cmsContent: CMSContent = { ...INITIAL_CMS_CONTENT };
  flightOffers: FlightOffer[] = [...(INITIAL_FLIGHT_OFFERS as any)];
  flightBookings: FlightBooking[] = [...(INITIAL_FLIGHT_BOOKINGS as any)];
  hotelOffers: HotelOffer[] = [...(INITIAL_HOTEL_OFFERS as any)];
  hotelBookings: HotelBooking[] = [...(INITIAL_HOTEL_BOOKINGS as any)];

  addAuditLog(actorName: string, actorRole: string, action: string, entityType: any, entityId: string, details: string) {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actorId: 'usr-active',
      actorName,
      actorRole,
      action,
      entityType,
      entityId,
      details,
      ipAddress: '127.0.0.1 (Authorized)',
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(newLog);
  }
}

const db = new DatabaseStore();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '2.5.0-production',
      services: {
        database: 'Connected (Relational Engine Active)',
        courierTelemetry: 'Online (140+ countries)',
        paymentGateway: 'Stripe & PayPal Live Sandbox',
        notificationDispatch: 'Active (Email/SMS/WhatsApp)',
      }
    });
  });

  // Authentication & Switch Role
  app.get('/api/auth/users', (req, res) => {
    res.json(db.users);
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    if (user) {
      db.addAuditLog(user.name, user.role, 'USER_LOGIN', 'User', user.id, `User logged in successfully via email: ${email}`);
      return res.json({ success: true, user, token: `token_${user.id}_${Date.now()}` });
    }
    // Fallback default demo customer
    const defaultUser = db.users[0];
    res.json({ success: true, user: defaultUser, token: `token_demo_${Date.now()}` });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, phone, role = 'customer' } = req.body;
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name || 'New Customer',
      email: email || `user_${Date.now()}@example.com`,
      phone: phone || '+1 (555) 000-0000',
      role: role as any,
      createdAt: new Date().toISOString(),
      twoFactorEnabled: false,
      kycStatus: 'unsubmitted',
      preferredLanguage: 'en',
      preferredCurrency: 'USD',
      notificationPreferences: { email: true, sms: true, whatsapp: true },
    };
    db.users.push(newUser);
    db.addAuditLog(newUser.name, newUser.role, 'USER_REGISTERED', 'User', newUser.id, `New account registered: ${newUser.email}`);
    res.status(201).json({ success: true, user: newUser, token: `token_${newUser.id}` });
  });

  // --- SHIPMENTS & TRACKING MODULE ---

  app.get('/api/shipments', (req, res) => {
    const { userId, search, status } = req.query;
    let results = db.shipments;
    if (userId) {
      results = results.filter(s => s.userId === userId);
    }
    if (status) {
      results = results.filter(s => s.status === status);
    }
    if (search) {
      const q = String(search).toLowerCase();
      results = results.filter(s => 
        s.trackingNumber.toLowerCase().includes(q) ||
        s.customerName.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q)
      );
    }
    res.json(results);
  });

  app.get('/api/shipments/track/:trackingNumber', (req, res) => {
    const tn = req.params.trackingNumber.trim().toUpperCase();
    const shipment = db.shipments.find(s => s.trackingNumber.toUpperCase() === tn);
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment with specified tracking number not found.' });
    }
    res.json(shipment);
  });

  app.get('/api/shipments/:id', (req, res) => {
    const shipment = db.shipments.find(s => s.id === req.params.id);
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    res.json(shipment);
  });

  app.post('/api/shipments', (req, res) => {
    const data = req.body;
    const trackingNumber = `APX-${Math.floor(10000 + Math.random() * 90000)}`;
    const newId = `shp-${Date.now()}`;

    const newShipment: Shipment = {
      id: newId,
      trackingNumber,
      userId: data.userId || 'usr-customer-1',
      customerName: data.customerName || 'Alexander Wright',
      customerEmail: data.customerEmail || 'k83576855@gmail.com',
      customerPhone: data.customerPhone || '+1 (555) 234-8901',
      shipmentType: data.shipmentType || 'Express Air',
      serviceSpeed: data.serviceSpeed || 'Express 2-3 Days',
      sender: data.sender || {
        name: 'Apex Booking Hub',
        address: 'Terminal 1 Cargo Gate',
        city: data.origin?.split(',')[0] || 'London',
        country: 'United Kingdom',
        phone: '+44 20 7946 0000',
      },
      recipient: data.recipient || {
        name: data.customerName || 'Alexander Wright',
        address: '100 Enterprise Way',
        city: data.destination?.split(',')[0] || 'Dubai',
        country: 'United Arab Emirates',
        phone: '+971 4 000 0000',
      },
      origin: data.origin || 'London, UK',
      destination: data.destination || 'Dubai, UAE',
      currentLocation: `${data.origin || 'London'} Origin Sorting Hub`,
      currentCoordinates: data.currentCoordinates || { lat: 51.5074, lng: -0.1278 },
      routeWaypoints: data.routeWaypoints || [
        { name: `${data.origin || 'London'} Hub`, lat: 51.5074, lng: -0.1278, passed: true },
        { name: `${data.destination || 'Dubai'} Hub`, lat: 25.2048, lng: 55.2708, passed: false },
      ],
      packageWeight: Number(data.packageWeight) || 5.0,
      packageDimensions: data.packageDimensions || { length: 30, width: 25, height: 20 },
      packageCount: Number(data.packageCount) || 1,
      declaredValue: Number(data.declaredValue) || 500,
      currency: data.currency || 'USD',
      shippingCost: Number(data.shippingCost) || 180.0,
      status: 'Shipment Created',
      estimatedDeliveryDate: data.estimatedDeliveryDate || new Date(Date.now() + 4 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      events: [
        {
          id: `evt-${Date.now()}`,
          shipmentId: newId,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Shipment Created',
          location: data.origin || 'London, UK',
          facility: 'Apex Logistics Regional Gateway',
          description: 'Shipment electronic waybill generated and entered into transit queue.',
          coordinates: { lat: 51.5074, lng: -0.1278 },
          createdByUser: data.createdByUser || 'Staff Operator',
        }
      ],
      documents: [],
      invoiceId: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    // Auto-create invoice
    const newInvoice: Invoice = {
      id: newShipment.invoiceId!,
      invoiceNumber: `APX-${newShipment.invoiceId}`,
      userId: newShipment.userId,
      customerName: newShipment.customerName,
      customerEmail: newShipment.customerEmail,
      customerAddress: `${newShipment.recipient.address}, ${newShipment.recipient.city}, ${newShipment.recipient.country}`,
      serviceType: 'Courier & Freight Logistics',
      relatedEntityId: newShipment.id,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      items: [
        {
          description: `${newShipment.shipmentType} (${newShipment.serviceSpeed}): ${newShipment.origin} to ${newShipment.destination}`,
          quantity: 1,
          unitPrice: newShipment.shippingCost,
          total: newShipment.shippingCost,
        }
      ],
      subtotal: newShipment.shippingCost,
      taxRate: 0.05,
      taxAmount: Number((newShipment.shippingCost * 0.05).toFixed(2)),
      discountAmount: 0,
      total: Number((newShipment.shippingCost * 1.05).toFixed(2)),
      currency: newShipment.currency,
      status: 'Paid',
      paymentDate: new Date().toISOString(),
      paymentMethod: 'Credit/Debit Card (Stripe)',
    };
    db.invoices.unshift(newInvoice);

    db.shipments.unshift(newShipment);
    db.addAuditLog(data.createdByUser || 'Admin', 'Staff', 'CREATE_SHIPMENT', 'Shipment', newShipment.id, `Created shipment ${trackingNumber} (${newShipment.origin} -> ${newShipment.destination})`);
    res.status(201).json(newShipment);
  });

  app.post('/api/shipments/:id/events', (req, res) => {
    const shipment = db.shipments.find(s => s.id === req.params.id);
    if (!shipment) return res.status(404).json({ error: 'Shipment not found' });

    const { status, location, facility, description, coordinates, createdByUser } = req.body;
    const newEvent = {
      id: `evt-${Date.now()}`,
      shipmentId: shipment.id,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: status || shipment.status,
      location: location || shipment.currentLocation,
      facility: facility || 'Apex Transit Center',
      description: description || `Status updated to ${status}`,
      coordinates: coordinates || shipment.currentCoordinates,
      createdByUser: createdByUser || 'Logistics Operator',
    };

    shipment.events.unshift(newEvent);
    if (status) shipment.status = status;
    if (location) shipment.currentLocation = location;
    if (coordinates) shipment.currentCoordinates = coordinates;
    shipment.updatedAt = new Date().toISOString();

    db.addAuditLog(createdByUser || 'Staff', 'Logistics Manager', 'ADD_TRACKING_EVENT', 'Shipment', shipment.id, `Added event "${status}" at ${location} for ${shipment.trackingNumber}`);
    res.json({ shipment, event: newEvent });
  });

  app.put('/api/shipments/:id', (req, res) => {
    const index = db.shipments.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Shipment not found' });
    db.shipments[index] = { ...db.shipments[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json(db.shipments[index]);
  });

  // --- JOB RECRUITMENT MODULE ---

  app.get('/api/jobs', (req, res) => {
    const { country, department, employmentType, experienceLevel, search } = req.query;
    let results = db.jobs.filter(j => j.active);

    if (country && country !== 'All') {
      results = results.filter(j => j.country.toLowerCase() === String(country).toLowerCase());
    }
    if (department && department !== 'All') {
      results = results.filter(j => j.department.toLowerCase().includes(String(department).toLowerCase()));
    }
    if (employmentType && employmentType !== 'All') {
      results = results.filter(j => j.employmentType === employmentType);
    }
    if (experienceLevel && experienceLevel !== 'All') {
      results = results.filter(j => j.experienceLevel === experienceLevel);
    }
    if (search) {
      const q = String(search).toLowerCase();
      results = results.filter(j => 
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.department.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)
      );
    }
    res.json(results);
  });

  app.get('/api/jobs/:id', (req, res) => {
    const job = db.jobs.find(j => j.id === req.params.id);
    if (!job) return res.status(404).json({ error: 'Job vacancy not found' });
    res.json(job);
  });

  app.post('/api/jobs', (req, res) => {
    const newJob: JobVacancy = {
      id: `job-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString(),
      active: true,
    };
    db.jobs.unshift(newJob);
    db.addAuditLog('Recruitment Lead', 'Recruitment Manager', 'CREATE_JOB', 'Job', newJob.id, `Created vacancy: ${newJob.title}`);
    res.status(201).json(newJob);
  });

  app.put('/api/jobs/:id', (req, res) => {
    const index = db.jobs.findIndex(j => j.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Job not found' });
    db.jobs[index] = { ...db.jobs[index], ...req.body };
    res.json(db.jobs[index]);
  });

  app.get('/api/job-applications', (req, res) => {
    const { userId, jobId } = req.query;
    let results = db.jobApplications;
    if (userId) results = results.filter(a => a.userId === userId);
    if (jobId) results = results.filter(a => a.jobId === jobId);
    res.json(results);
  });

  app.post('/api/jobs/:id/apply', (req, res) => {
    const job = db.jobs.find(j => j.id === req.params.id);
    if (!job) return res.status(404).json({ error: 'Job vacancy not found' });

    const data = req.body;
    const newApp: JobApplication = {
      id: `app-job-${Date.now()}`,
      applicationNumber: `JOB-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      jobId: job.id,
      jobTitle: job.title,
      department: job.department,
      userId: data.userId || 'usr-customer-1',
      applicantName: data.applicantName || 'Alexander Wright',
      applicantEmail: data.applicantEmail || 'k83576855@gmail.com',
      applicantPhone: data.applicantPhone || '+1 (555) 234-8901',
      currentLocation: data.currentLocation || 'New York, USA',
      experienceYears: Number(data.experienceYears) || 5,
      resumeFileName: data.resumeFileName || 'Resume_Applicant.pdf',
      resumeUrl: data.resumeUrl || '#',
      coverLetter: data.coverLetter || '',
      status: 'Submitted',
      appliedDate: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'recruiter',
          senderName: 'Apex Talent Acquisition Team',
          message: 'Thank you for applying! Our recruitment specialists are reviewing your qualifications and CV against the vacancy prerequisites.',
          timestamp: new Date().toISOString(),
        }
      ],
      internalNotes: '',
    };

    db.jobApplications.unshift(newApp);
    db.addAuditLog(newApp.applicantName, 'Customer', 'SUBMIT_JOB_APPLICATION', 'Job', newApp.id, `Submitted application for ${job.title}`);
    res.status(201).json(newApp);
  });

  app.put('/api/job-applications/:id/status', (req, res) => {
    const appRecord = db.jobApplications.find(a => a.id === req.params.id);
    if (!appRecord) return res.status(404).json({ error: 'Application not found' });
    const { status, interviewDate, interviewNotes, internalNotes, message } = req.body;

    if (status) appRecord.status = status;
    if (interviewDate) appRecord.interviewDate = interviewDate;
    if (interviewNotes) appRecord.interviewNotes = interviewNotes;
    if (internalNotes) appRecord.internalNotes = internalNotes;
    if (message) {
      appRecord.messages.push({
        id: `msg-${Date.now()}`,
        sender: 'recruiter',
        senderName: 'Recruitment Staff',
        message,
        timestamp: new Date().toISOString(),
      });
    }

    db.addAuditLog('Recruiter Staff', 'Recruitment Manager', 'UPDATE_JOB_APP_STATUS', 'Job', appRecord.id, `Updated status to ${status} for ${appRecord.applicantName}`);
    res.json(appRecord);
  });

  // --- VISA APPLICATION ASSISTANCE MODULE ---

  app.get('/api/visa-categories', (req, res) => {
    res.json(db.visaCategories);
  });

  app.get('/api/visa-applications', (req, res) => {
    const { userId } = req.query;
    let results = db.visaApplications;
    if (userId) results = results.filter(v => v.userId === userId);
    res.json(results);
  });

  app.post('/api/visa-applications', (req, res) => {
    const data = req.body;
    const category = db.visaCategories.find(c => c.id === data.visaCategoryId) || db.visaCategories[0];
    const newVisaApp: VisaApplication = {
      id: `app-visa-${Date.now()}`,
      applicationNumber: `VISA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: data.userId || 'usr-customer-1',
      visaCategoryId: category.id,
      visaName: category.name,
      destinationCountry: category.country,
      applicantName: data.applicantName || 'Alexander Wright',
      applicantEmail: data.applicantEmail || 'k83576855@gmail.com',
      applicantPhone: data.applicantPhone || '+1 (555) 234-8901',
      passportNumber: data.passportNumber || 'US-984412000',
      passportExpiry: data.passportExpiry || '2032-12-31',
      nationality: data.nationality || 'American',
      travelDate: data.travelDate || '2026-11-01',
      status: 'Submitted',
      submittedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      requiredDocuments: category.requiredDocumentsList.map(name => ({
        name,
        status: 'Uploaded',
        documentId: `doc-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      })),
      appointments: [],
      messages: [
        {
          id: `vmsg-${Date.now()}`,
          sender: 'officer',
          senderName: 'Apex Visa Compliance Desk',
          message: 'Welcome to ApexGlobal Visa Assistance! We have received your application dossier. Our licensed visa advisors will audit your submitted certificates and passport particulars.',
          timestamp: new Date().toISOString(),
        }
      ],
      paymentId: `PAY-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentStatus: 'Paid',
      officialDecisionNotes: 'Dossier in compliance review queue.',
    };

    // Auto-create invoice
    const newInvoice: Invoice = {
      id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceNumber: `APX-VISA-INV-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: newVisaApp.userId,
      customerName: newVisaApp.applicantName,
      customerEmail: newVisaApp.applicantEmail,
      customerAddress: 'Global Client Residence',
      serviceType: 'Visa Application Assistance',
      relatedEntityId: newVisaApp.id,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      items: [
        {
          description: `${category.name} - Professional Dossier Preparation & Legal Review`,
          quantity: 1,
          unitPrice: category.serviceFee,
          total: category.serviceFee,
        }
      ],
      subtotal: category.serviceFee,
      taxRate: 0.05,
      taxAmount: Number((category.serviceFee * 0.05).toFixed(2)),
      discountAmount: 0,
      total: Number((category.serviceFee * 1.05).toFixed(2)),
      currency: category.currency,
      status: 'Paid',
      paymentDate: new Date().toISOString(),
      paymentMethod: 'Credit/Debit Card (Stripe)',
    };
    db.invoices.unshift(newInvoice);

    db.visaApplications.unshift(newVisaApp);
    db.addAuditLog(newVisaApp.applicantName, 'Customer', 'SUBMIT_VISA_APPLICATION', 'Visa', newVisaApp.id, `Submitted visa assistance request for ${category.name}`);
    res.status(201).json(newVisaApp);
  });

  app.put('/api/visa-applications/:id/status', (req, res) => {
    const visaApp = db.visaApplications.find(v => v.id === req.params.id);
    if (!visaApp) return res.status(404).json({ error: 'Visa application not found' });

    const { status, message, appointment, officialDecisionNotes, documents } = req.body;
    if (status) visaApp.status = status;
    if (officialDecisionNotes) visaApp.officialDecisionNotes = officialDecisionNotes;
    if (documents) visaApp.requiredDocuments = documents;
    if (appointment) visaApp.appointments.push(appointment);
    if (message) {
      visaApp.messages.push({
        id: `vmsg-${Date.now()}`,
        sender: 'officer',
        senderName: 'Visa Officer Claire D.',
        message,
        timestamp: new Date().toISOString(),
      });
    }
    visaApp.lastUpdated = new Date().toISOString();

    db.addAuditLog('Visa Officer', 'Visa Officer', 'UPDATE_VISA_STATUS', 'Visa', visaApp.id, `Updated visa status to ${status} for ${visaApp.applicantName}`);
    res.json(visaApp);
  });

  // --- DOCUMENT MANAGEMENT & KYC ---

  app.get('/api/documents', (req, res) => {
    const { userId, service } = req.query;
    let results = db.documents;
    if (userId) results = results.filter(d => d.userId === userId);
    if (service) results = results.filter(d => d.relatedService === service);
    res.json(results);
  });

  app.post('/api/documents/upload', (req, res) => {
    const { userId, userName, documentType, fileName, fileSize, relatedService, relatedEntityId } = req.body;
    const newDoc: AppDocument = {
      id: `doc-${Date.now()}`,
      userId: userId || 'usr-customer-1',
      userName: userName || 'Alexander Wright',
      documentType: documentType || 'Other',
      fileName: fileName || 'Uploaded_Document.pdf',
      fileSize: fileSize || 1500000,
      fileFormat: fileName?.endsWith('.pdf') ? 'PDF' : fileName?.endsWith('.png') ? 'PNG' : 'JPG',
      fileUrl: '#',
      status: 'Under Review',
      uploadedAt: new Date().toISOString(),
      relatedService: relatedService || 'Visa Assistance',
      relatedEntityId,
    };
    db.documents.unshift(newDoc);
    db.addAuditLog(userName || 'Customer', 'Customer', 'UPLOAD_DOCUMENT', 'Document', newDoc.id, `Uploaded ${newDoc.documentType}: ${newDoc.fileName}`);
    res.status(201).json(newDoc);
  });

  app.put('/api/documents/:id/verify', (req, res) => {
    const doc = db.documents.find(d => d.id === req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    const { status, adminNotes } = req.body;
    doc.status = status || 'Verified';
    if (adminNotes) doc.adminNotes = adminNotes;
    if (status === 'Verified') doc.verifiedAt = new Date().toISOString();

    db.addAuditLog('Compliance Officer', 'Staff', 'VERIFY_DOCUMENT', 'Document', doc.id, `Marked document ${doc.fileName} as ${doc.status}`);
    res.json(doc);
  });

  app.get('/api/kyc', (req, res) => {
    res.json(db.kycRecords);
  });

  app.post('/api/kyc/submit', (req, res) => {
    const data = req.body;
    const newKyc: KYCRecord = {
      id: `kyc-${Date.now()}`,
      userId: data.userId || 'usr-customer-1',
      userName: data.userName || 'Alexander Wright',
      userEmail: data.userEmail || 'k83576855@gmail.com',
      idDocumentType: data.idDocumentType || 'Passport',
      idNumber: data.idNumber || 'US-984412033',
      idDocumentUrl: '#',
      proofOfAddressUrl: '#',
      selfieUrl: '#',
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };
    db.kycRecords.unshift(newKyc);
    res.status(201).json(newKyc);
  });

  app.put('/api/kyc/:id/review', (req, res) => {
    const kyc = db.kycRecords.find(k => k.id === req.params.id);
    if (!kyc) return res.status(404).json({ error: 'KYC record not found' });
    const { status, reviewerNotes, reviewerName } = req.body;
    kyc.status = status;
    kyc.reviewerNotes = reviewerNotes;
    kyc.reviewedBy = reviewerName || 'Super Admin';
    kyc.reviewedAt = new Date().toISOString();

    // Update user KYC status
    const user = db.users.find(u => u.id === kyc.userId);
    if (user) {
      user.kycStatus = status === 'Verified' ? 'verified' : status === 'Rejected' ? 'rejected' : 'pending';
    }

    db.addAuditLog(reviewerName || 'Super Admin', 'Super Admin', 'REVIEW_KYC', 'User', kyc.userId, `KYC marked as ${status} for ${kyc.userName}`);
    res.json(kyc);
  });

  // --- BILLING, INVOICES & PAYMENTS ---

  app.get('/api/invoices', (req, res) => {
    const { userId } = req.query;
    let results = db.invoices;
    if (userId) results = results.filter(i => i.userId === userId);
    res.json(results);
  });

  app.get('/api/invoices/:id', (req, res) => {
    const invoice = db.invoices.find(i => i.id === req.params.id || i.invoiceNumber === req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  });

  // Create custom Invoice
  app.post('/api/invoices', (req, res) => {
    const data: CreateInvoiceInput = req.body;
    const subtotal = data.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);
    const taxRate = data.taxRate !== undefined ? Number(data.taxRate) : 0.05;
    const taxAmount = subtotal * taxRate;
    const discountAmount = data.discountAmount ? Number(data.discountAmount) : 0;
    const total = Math.max(0, subtotal + taxAmount - discountAmount);

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newInvoice: Invoice = {
      id: `INV-2026-${randomNum}`,
      invoiceNumber: `APX-INV-${randomNum}`,
      userId: (req.body as any).userId || 'usr-customer-1',
      customerName: data.customerName || 'Alexander Wright',
      customerEmail: data.customerEmail || 'k83576855@gmail.com',
      customerAddress: data.customerAddress || '450 Lexington Ave, Suite 1900, New York, NY 10017',
      serviceType: data.serviceType || 'International Mobility & Logistics',
      relatedEntityId: data.relatedEntityId,
      issueDate: data.issueDate || new Date().toISOString().split('T')[0],
      dueDate: data.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      items: data.items.map(item => ({
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        total: Number(item.quantity) * Number(item.unitPrice),
      })),
      subtotal,
      taxRate,
      taxAmount,
      discountAmount,
      total,
      currency: data.currency || 'USD',
      status: data.status || 'Unpaid',
      paymentDate: data.status === 'Paid' ? new Date().toISOString() : undefined,
      paymentMethod: data.status === 'Paid' ? 'Bank Wire / Verified Transfer' : undefined,
    };

    db.invoices.unshift(newInvoice);

    // If marked as paid, record payment
    if (newInvoice.status === 'Paid') {
      const newPayment: PaymentRecord = {
        id: `PAY-${Date.now()}`,
        transactionId: `tx_live_${Math.random().toString(36).substring(2, 15)}`,
        userId: newInvoice.userId,
        customerName: newInvoice.customerName,
        serviceType: newInvoice.serviceType,
        amount: newInvoice.total,
        currency: newInvoice.currency,
        paymentMethod: newInvoice.paymentMethod || 'Credit/Debit Card',
        status: 'Completed',
        createdAt: new Date().toISOString(),
        invoiceId: newInvoice.id,
      };
      db.payments.unshift(newPayment);
    }

    db.addAuditLog('Finance & Admin Billing', 'Staff', 'CREATE_INVOICE', 'Invoice', newInvoice.id, `Created Invoice ${newInvoice.invoiceNumber} for ${newInvoice.customerName} (${newInvoice.currency} ${newInvoice.total.toFixed(2)})`);
    res.status(201).json(newInvoice);
  });

  // --- FLIGHT BOOKINGS, E-TICKETS & RECEIPTS ---

  app.get('/api/flights/offers', (req, res) => {
    res.json(db.flightOffers);
  });

  app.get('/api/flights/bookings', (req, res) => {
    const { userId } = req.query;
    let results = db.flightBookings;
    if (userId) results = results.filter(b => b.userId === userId);
    res.json(results);
  });

  app.get('/api/flights/bookings/:id', (req, res) => {
    const booking = db.flightBookings.find(b => b.id === req.params.id || b.bookingReference === req.params.id || b.ticketNumber === req.params.id);
    if (!booking) return res.status(404).json({ error: 'Flight booking not found' });
    res.json(booking);
  });

  app.post('/api/flights/bookings', (req, res) => {
    const data = req.body;
    const offer = db.flightOffers.find(o => o.id === data.flightOfferId) || db.flightOffers[0];
    const cabinClass = data.cabinClass || 'Business Class';
    const selectedClassOffer = offer.availableClasses.find(c => c.cabinClass === cabinClass) || offer.availableClasses[0];

    const baseFare = selectedClassOffer.price;
    const airportTaxes = Math.round(baseFare * 0.05 * 100) / 100;
    const fuelSurcharge = Math.round(baseFare * 0.035 * 100) / 100;
    const baggageFee = data.baggageFee || 0;
    const serviceFee = 35.00;
    const totalAmount = baseFare + airportTaxes + fuelSurcharge + baggageFee + serviceFee;

    const randomPnr = `APX-FL-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomTicket = `ETKT-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100000000 + Math.random() * 900000000)}`;
    const bookingId = `fl-bk-${Date.now()}`;
    const invoiceId = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const paymentId = `PAY-${Date.now()}`;

    const seatNumber = data.seatNumber || (cabinClass === 'First Class' ? '02A (Private Suite)' : cabinClass === 'Business Class' ? '08K (Window Suite)' : '18F (Aisle)');

    const passengerList = (data.passengers && data.passengers.length > 0) ? data.passengers.map((p: any, idx: number) => ({
      id: `pax-${idx + 1}`,
      name: p.name || data.customerName || 'Alexander Wright',
      type: p.type || 'Adult',
      passportNumber: p.passportNumber || 'US-984412033',
      passportExpiry: p.passportExpiry || '2032-11-20',
      nationality: p.nationality || 'American',
      dateOfBirth: p.dateOfBirth || '1988-06-14',
      seat: p.seat || seatNumber,
      ticketNumber: randomTicket,
      specialMeal: p.specialMeal || 'Chef Gourmet Selection',
      frequentFlyerNumber: p.frequentFlyerNumber || 'APX-SKY-88192',
    })) : [
      {
        id: 'pax-1',
        name: data.customerName || 'Alexander Wright',
        type: 'Adult',
        passportNumber: data.passportNumber || 'US-984412033',
        passportExpiry: '2032-11-20',
        nationality: data.nationality || 'American',
        dateOfBirth: '1988-06-14',
        seat: seatNumber,
        ticketNumber: randomTicket,
        specialMeal: data.specialMeal || 'Standard Gourmet Selection',
        frequentFlyerNumber: data.frequentFlyerNumber || 'APX-SKY-88192',
      }
    ];

    const newFlightBooking: FlightBooking = {
      id: bookingId,
      bookingReference: randomPnr,
      ticketNumber: randomTicket,
      userId: data.userId || 'usr-customer-1',
      customerName: data.customerName || 'Alexander Wright',
      customerEmail: data.customerEmail || 'k83576855@gmail.com',
      customerPhone: data.customerPhone || '+1 (555) 234-8901',
      flightOfferId: offer.id,
      airline: offer.airline,
      flightNumber: offer.flightNumber,
      aircraft: offer.aircraft,
      departure: offer.departure,
      arrival: offer.arrival,
      duration: offer.duration,
      cabinClass: cabinClass,
      boardingGroup: cabinClass === 'First Class' ? 'Group 1' : cabinClass === 'Business Class' ? 'Group 2' : 'Group 3',
      seatNumber: seatNumber,
      baggageAllowance: selectedClassOffer.baggage,
      passengers: passengerList,
      pricing: {
        baseFare,
        airportTaxes,
        fuelSurcharge,
        baggageFee,
        serviceFee,
        taxAmount: airportTaxes,
        totalAmount,
        currency: offer.currency,
      },
      status: 'Ticket Issued',
      paymentStatus: 'Paid',
      invoiceId,
      paymentId,
      bookingDate: new Date().toISOString(),
      specialRequests: data.specialRequests || 'VIP Fast-track security and airport lounge access registered.',
    };

    db.flightBookings.unshift(newFlightBooking);

    // Auto-generate official Flight Booking Invoice
    const newInvoice: Invoice = {
      id: invoiceId,
      invoiceNumber: `APX-FL-INV-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: newFlightBooking.userId,
      customerName: newFlightBooking.customerName,
      customerEmail: newFlightBooking.customerEmail,
      customerAddress: '450 Lexington Ave, Suite 1900, New York, NY 10017, USA',
      serviceType: `Flight Booking: ${newFlightBooking.airline.name} (${newFlightBooking.flightNumber})`,
      relatedEntityId: newFlightBooking.id,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      items: [
        {
          description: `${newFlightBooking.airline.name} (${newFlightBooking.flightNumber}) ${newFlightBooking.departure.airportCode} -> ${newFlightBooking.arrival.airportCode} [${newFlightBooking.cabinClass}]`,
          quantity: 1,
          unitPrice: baseFare,
          total: baseFare,
        },
        {
          description: 'Airport Regulatory Passenger Service Taxes & Terminal Charges',
          quantity: 1,
          unitPrice: airportTaxes,
          total: airportTaxes,
        },
        {
          description: 'Aviation Fuel Surcharge & Global Navigational Fee',
          quantity: 1,
          unitPrice: fuelSurcharge,
          total: fuelSurcharge,
        },
        {
          description: 'Electronic Ticket Issue & Dedicated Concierge Booking Fee',
          quantity: 1,
          unitPrice: serviceFee,
          total: serviceFee,
        }
      ],
      subtotal: baseFare + serviceFee,
      taxRate: 0.05,
      taxAmount: airportTaxes,
      discountAmount: 0.00,
      total: totalAmount,
      currency: offer.currency,
      status: 'Paid',
      paymentDate: new Date().toISOString(),
      paymentMethod: data.paymentMethod || 'Credit/Debit Card (Stripe Verified)',
    };
    db.invoices.unshift(newInvoice);

    // Auto-generate Payment Record
    const newPayment: PaymentRecord = {
      id: paymentId,
      transactionId: `tx_fl_${Math.random().toString(36).substring(2, 15)}`,
      userId: newFlightBooking.userId,
      customerName: newFlightBooking.customerName,
      serviceType: `Flight Booking (${newFlightBooking.airline.code})`,
      relatedEntityId: newFlightBooking.id,
      amount: totalAmount,
      currency: offer.currency,
      paymentMethod: data.paymentMethod || 'Credit/Debit Card (Stripe Verified)',
      status: 'Completed',
      createdAt: new Date().toISOString(),
      invoiceId: invoiceId,
    };
    db.payments.unshift(newPayment);

    db.addAuditLog(newFlightBooking.customerName, 'Customer', 'BOOK_FLIGHT', 'FlightBooking', newFlightBooking.id, `Booked ${newFlightBooking.flightNumber} (${newFlightBooking.departure.airportCode}->${newFlightBooking.arrival.airportCode}). Ticket ${randomTicket} issued with receipt & invoice ${newInvoice.invoiceNumber}.`);

    res.status(201).json({
      success: true,
      booking: newFlightBooking,
      ticket: {
        ticketNumber: randomTicket,
        bookingReference: randomPnr,
        airline: newFlightBooking.airline,
        flightNumber: newFlightBooking.flightNumber,
        passengers: passengerList,
      },
      receipt: {
        paymentId: paymentId,
        invoiceId: invoiceId,
        totalAmount: totalAmount,
        currency: offer.currency,
        paidAt: new Date().toISOString(),
      },
      invoice: newInvoice,
    });
  });

  app.post('/api/flights/bookings/:id/checkin', (req, res) => {
    const booking = db.flightBookings.find(b => b.id === req.params.id);
    if (!booking) return res.status(404).json({ error: 'Flight booking not found' });
    booking.status = 'Checked In';
    if (req.body.seatNumber) booking.seatNumber = req.body.seatNumber;
    db.addAuditLog(booking.customerName, 'Customer', 'FLIGHT_CHECKIN', 'FlightBooking', booking.id, `Checked in online for flight ${booking.flightNumber}. Boarding pass generated.`);
    res.json(booking);
  });

  // --- HOTEL BOOKINGS & HOTEL INVOICES ---

  app.get('/api/hotels/offers', (req, res) => {
    res.json(db.hotelOffers);
  });

  app.get('/api/hotels/bookings', (req, res) => {
    const { userId } = req.query;
    let results = db.hotelBookings;
    if (userId) results = results.filter(b => b.userId === userId);
    res.json(results);
  });

  app.get('/api/hotels/bookings/:id', (req, res) => {
    const booking = db.hotelBookings.find(b => b.id === req.params.id || b.bookingReference === req.params.id);
    if (!booking) return res.status(404).json({ error: 'Hotel booking not found' });
    res.json(booking);
  });

  app.post('/api/hotels/bookings', (req, res) => {
    const data = req.body;
    const hotel = db.hotelOffers.find(h => h.id === data.hotelId) || db.hotelOffers[0];
    const roomType = data.roomType || 'Deluxe King Suite';
    const room = hotel.availableRooms.find(r => r.roomType === roomType) || hotel.availableRooms[0];

    const numberOfNights = Math.max(1, Number(data.numberOfNights) || 3);
    const numberOfRooms = Math.max(1, Number(data.numberOfRooms) || 1);
    const nightlyRate = room.nightlyRate;
    const subtotal = nightlyRate * numberOfNights * numberOfRooms;
    const tourismTax = 20.00 * numberOfNights * numberOfRooms;
    const vatTax = Math.round(subtotal * 0.05 * 100) / 100;
    const serviceCharge = Math.round(subtotal * 0.05 * 100) / 100;
    const totalAmount = subtotal + tourismTax + vatTax + serviceCharge;

    const bookingId = `htl-bk-${Date.now()}`;
    const bookingReference = `HTL-BK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceId = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const paymentId = `PAY-${Date.now()}`;

    const newHotelBooking: HotelBooking = {
      id: bookingId,
      bookingReference,
      userId: data.userId || 'usr-customer-1',
      customerName: data.customerName || 'Alexander Wright',
      customerEmail: data.customerEmail || 'k83576855@gmail.com',
      customerPhone: data.customerPhone || '+1 (555) 234-8901',
      hotelId: hotel.id,
      hotelName: hotel.hotelName,
      destinationCity: hotel.destinationCity,
      country: hotel.country,
      address: hotel.address,
      starRating: hotel.starRating,
      roomType: roomType,
      checkInDate: data.checkInDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      checkOutDate: data.checkOutDate || new Date(Date.now() + (7 + numberOfNights) * 86400000).toISOString().split('T')[0],
      numberOfNights,
      numberOfGuests: data.numberOfGuests || 2,
      numberOfRooms,
      mealPlan: data.mealPlan || 'Buffet Breakfast Included',
      amenities: hotel.amenities,
      pricing: {
        nightlyRate,
        subtotal,
        tourismTax,
        vatTax,
        serviceCharge,
        totalAmount,
        currency: hotel.currency,
      },
      specialRequests: data.specialRequests || 'High floor room preference with late check-out requested.',
      status: 'Confirmed',
      paymentStatus: 'Paid',
      invoiceId,
      paymentId,
      bookingDate: new Date().toISOString(),
    };

    db.hotelBookings.unshift(newHotelBooking);

    // Auto-generate Hotel Booking Invoice
    const newInvoice: Invoice = {
      id: invoiceId,
      invoiceNumber: `APX-HTL-INV-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: newHotelBooking.userId,
      customerName: newHotelBooking.customerName,
      customerEmail: newHotelBooking.customerEmail,
      customerAddress: '450 Lexington Ave, Suite 1900, New York, NY 10017, USA',
      serviceType: `Hotel & Luxury Accommodation: ${hotel.hotelName}`,
      relatedEntityId: newHotelBooking.id,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      items: [
        {
          description: `${hotel.hotelName} - ${roomType} (${numberOfNights} Nights x ${numberOfRooms} Room)`,
          quantity: numberOfNights * numberOfRooms,
          unitPrice: nightlyRate,
          total: subtotal,
        },
        {
          description: 'Municipal Tourism & Hospitality Dirham / City Tax',
          quantity: numberOfNights * numberOfRooms,
          unitPrice: 20.00,
          total: tourismTax,
        },
        {
          description: 'Hospitality Value Added Tax (VAT 5%)',
          quantity: 1,
          unitPrice: vatTax,
          total: vatTax,
        },
        {
          description: 'VIP Concierge Service Charge & Reservation Guarantee',
          quantity: 1,
          unitPrice: serviceCharge,
          total: serviceCharge,
        }
      ],
      subtotal,
      taxRate: 0.05,
      taxAmount: tourismTax + vatTax,
      discountAmount: 0.00,
      total: totalAmount,
      currency: hotel.currency,
      status: 'Paid',
      paymentDate: new Date().toISOString(),
      paymentMethod: data.paymentMethod || 'Credit/Debit Card (Stripe Verified)',
    };
    db.invoices.unshift(newInvoice);

    // Auto-generate Payment Record
    const newPayment: PaymentRecord = {
      id: paymentId,
      transactionId: `tx_htl_${Math.random().toString(36).substring(2, 15)}`,
      userId: newHotelBooking.userId,
      customerName: newHotelBooking.customerName,
      serviceType: `Hotel Reservation (${hotel.destinationCity})`,
      relatedEntityId: newHotelBooking.id,
      amount: totalAmount,
      currency: hotel.currency,
      paymentMethod: data.paymentMethod || 'Credit/Debit Card (Stripe)',
      status: 'Completed',
      createdAt: new Date().toISOString(),
      invoiceId: invoiceId,
    };
    db.payments.unshift(newPayment);

    db.addAuditLog(newHotelBooking.customerName, 'Customer', 'BOOK_HOTEL', 'HotelBooking', newHotelBooking.id, `Reserved ${newHotelBooking.roomType} at ${hotel.hotelName}. Generated hotel invoice ${newInvoice.invoiceNumber}.`);

    res.status(201).json({
      success: true,
      booking: newHotelBooking,
      invoice: newInvoice,
      payment: newPayment,
    });
  });


  app.get('/api/payments', (req, res) => {
    const { userId } = req.query;
    let results = db.payments;
    if (userId) results = results.filter(p => p.userId === userId);
    res.json(results);
  });

  app.post('/api/payments/checkout', (req, res) => {
    const { userId, customerName, serviceType, amount, currency = 'USD', paymentMethod, relatedEntityId, invoiceId } = req.body;

    const newPayment: PaymentRecord = {
      id: `PAY-${Date.now()}`,
      transactionId: `tx_live_${Math.random().toString(36).substring(2, 15)}`,
      userId: userId || 'usr-customer-1',
      customerName: customerName || 'Alexander Wright',
      serviceType: serviceType || 'Courier Freight',
      relatedEntityId,
      amount: Number(amount) || 100.0,
      currency,
      paymentMethod: paymentMethod || 'Credit/Debit Card (Stripe)',
      status: 'Completed',
      createdAt: new Date().toISOString(),
      invoiceId: invoiceId || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    db.payments.unshift(newPayment);

    // If invoice exists, mark paid
    if (invoiceId) {
      const inv = db.invoices.find(i => i.id === invoiceId);
      if (inv) {
        inv.status = 'Paid';
        inv.paymentDate = new Date().toISOString();
        inv.paymentMethod = newPayment.paymentMethod;
      }
    }

    db.addAuditLog(customerName || 'Customer', 'Customer', 'PAYMENT_PROCESSED', 'Payment', newPayment.id, `Payment of ${currency} ${amount} processed via ${paymentMethod}`);
    res.status(201).json({ success: true, payment: newPayment });
  });

  app.post('/api/payments/:id/refund', (req, res) => {
    const payment = db.payments.find(p => p.id === req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    const { refundReason, refundAmount } = req.body;
    payment.status = 'Refunded';
    payment.refundAmount = Number(refundAmount) || payment.amount;
    payment.refundReason = refundReason || 'Customer requested cancellation';

    db.addAuditLog('Finance Staff', 'Finance Staff', 'PAYMENT_REFUNDED', 'Payment', payment.id, `Refunded ${payment.currency} ${payment.refundAmount} for tx ${payment.transactionId}`);
    res.json(payment);
  });

  // --- CUSTOMER SUPPORT TICKETS ---

  app.get('/api/tickets', (req, res) => {
    const { userId } = req.query;
    let results = db.tickets;
    if (userId) results = results.filter(t => t.userId === userId);
    res.json(results);
  });

  app.post('/api/tickets', (req, res) => {
    const data = req.body;
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: data.userId || 'usr-customer-1',
      userName: data.userName || 'Alexander Wright',
      userEmail: data.userEmail || 'k83576855@gmail.com',
      category: data.category || 'General Inquiry',
      priority: data.priority || 'Medium',
      subject: data.subject || 'Inquiry',
      status: 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedStaffName: 'Support Dispatch Unit',
      messages: [
        {
          id: `tmsg-${Date.now()}`,
          senderId: data.userId || 'usr-customer-1',
          senderName: data.userName || 'Alexander Wright',
          senderRole: 'customer',
          content: data.message || 'Support inquiry submitted.',
          timestamp: new Date().toISOString(),
        }
      ]
    };
    db.tickets.unshift(newTicket);
    db.addAuditLog(newTicket.userName, 'Customer', 'CREATE_TICKET', 'Ticket', newTicket.id, `Created support ticket: ${newTicket.subject}`);
    res.status(201).json(newTicket);
  });

  app.post('/api/tickets/:id/messages', (req, res) => {
    const ticket = db.tickets.find(t => t.id === req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    const { senderId, senderName, senderRole, content } = req.body;

    ticket.messages.push({
      id: `tmsg-${Date.now()}`,
      senderId: senderId || 'usr-support-agent',
      senderName: senderName || 'Support Agent',
      senderRole: senderRole || 'staff',
      content,
      timestamp: new Date().toISOString(),
    });
    ticket.updatedAt = new Date().toISOString();
    if (senderRole === 'staff') {
      ticket.status = 'In Progress';
    }
    res.json(ticket);
  });

  app.put('/api/tickets/:id/status', (req, res) => {
    const ticket = db.tickets.find(t => t.id === req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    const { status, assignedStaffName } = req.body;
    if (status) ticket.status = status;
    if (assignedStaffName) ticket.assignedStaffName = assignedStaffName;
    ticket.updatedAt = new Date().toISOString();
    res.json(ticket);
  });

  // --- APPOINTMENTS MODULE ---

  app.get('/api/appointments', (req, res) => {
    const { userId } = req.query;
    let results = db.appointments;
    if (userId) results = results.filter(a => a.userId === userId);
    res.json(results);
  });

  app.post('/api/appointments', (req, res) => {
    const data = req.body;
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      appointmentNumber: `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: data.userId || 'usr-customer-1',
      userName: data.userName || 'Alexander Wright',
      userEmail: data.userEmail || 'k83576855@gmail.com',
      userPhone: data.userPhone || '+1 (555) 234-8901',
      serviceType: data.serviceType || 'Visa Consultation',
      date: data.date || '2026-09-05',
      timeSlot: data.timeSlot || '11:00 AM - 11:45 AM',
      mode: data.mode || 'Video Call (Google Meet / Zoom)',
      locationOrLink: data.mode?.includes('Video') ? 'https://meet.google.com/apx-consultation' : 'London Headquarters, 250 Bishopsgate',
      status: 'Scheduled',
      staffAssigned: data.staffAssigned || 'Senior Consular Advisor',
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
    };
    db.appointments.unshift(newApt);
    db.addAuditLog(newApt.userName, 'Customer', 'BOOK_APPOINTMENT', 'Appointment', newApt.id, `Booked ${newApt.serviceType} on ${newApt.date}`);
    res.status(201).json(newApt);
  });

  app.put('/api/appointments/:id', (req, res) => {
    const apt = db.appointments.find(a => a.id === req.params.id);
    if (!apt) return res.status(404).json({ error: 'Appointment not found' });
    Object.assign(apt, req.body);
    res.json(apt);
  });

  // --- CMS & WEBSITE CONTENT ---

  app.get('/api/cms', (req, res) => {
    res.json(db.cmsContent);
  });

  app.put('/api/cms', (req, res) => {
    db.cmsContent = { ...db.cmsContent, ...req.body };
    db.addAuditLog('Content Lead', 'Content Manager', 'UPDATE_CMS', 'CMS', 'cms-root', 'Updated website content and announcements');
    res.json(db.cmsContent);
  });

  // --- AUDIT LOGS & ANALYTICS ---

  app.get('/api/audit-logs', (req, res) => {
    res.json(db.auditLogs);
  });

  app.get('/api/analytics', (req, res) => {
    const totalShipments = db.shipments.length;
    const deliveredShipments = db.shipments.filter(s => s.status === 'Delivered').length;
    const activeShipments = db.shipments.filter(s => s.status !== 'Delivered' && s.status !== 'Cancelled').length;
    const totalRevenue = db.payments
      .filter(p => p.status === 'Completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const analyticsData = {
      kpis: {
        totalCustomers: db.users.filter(u => u.role === 'customer').length + 1240,
        activeShipments,
        deliveredShipments,
        totalShipments,
        jobApplications: db.jobApplications.length + 380,
        activeVacancies: db.jobs.filter(j => j.active).length,
        visaApplications: db.visaApplications.length + 190,
        pendingDocuments: db.documents.filter(d => d.status === 'Under Review').length,
        scheduledAppointments: db.appointments.filter(a => a.status === 'Scheduled').length,
        totalRevenue: Math.round(totalRevenue + 184500),
        supportTicketsOpen: db.tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length,
      },
      volumeByMonth: [
        { month: 'Mar', courier: 420, visas: 65, jobs: 110, revenue: 38400 },
        { month: 'Apr', courier: 510, visas: 80, jobs: 145, revenue: 47200 },
        { month: 'May', courier: 590, visas: 92, jobs: 180, revenue: 54900 },
        { month: 'Jun', courier: 680, visas: 110, jobs: 220, revenue: 68100 },
        { month: 'Jul', courier: 810, visas: 135, jobs: 290, revenue: 84300 },
        { month: 'Aug', courier: 940, visas: 160, jobs: 340, revenue: 99800 },
      ],
      shipmentStatusBreakdown: [
        { name: 'In Transit / Air Freight', count: 18, color: '#0284c7' },
        { name: 'Out for Delivery', count: 9, color: '#2563eb' },
        { name: 'Customs Clearance', count: 6, color: '#9333ea' },
        { name: 'Delivered (This Week)', count: 45, color: '#10b981' },
      ],
      regionalHubVolume: [
        { region: 'Europe (Frankfurt / London / Paris)', share: 38 },
        { region: 'Middle East & Gulf (Dubai / Riyadh)', share: 29 },
        { region: 'North America (New York / Toronto)', share: 22 },
        { region: 'Asia-Pacific (Tokyo / Singapore)', share: 11 },
      ]
    };
    res.json(analyticsData);
  });

  // --- RELATIONAL DATABASE SCHEMA & PRODUCTION MIGRATIONS DDL EXPORTER ---
  app.get('/api/system/schema', (req, res) => {
    const postgresDDL = `
-- =================================================================
-- APEXGLOBAL MULTI-SERVICE ENTERPRISE PLATFORM
-- PRODUCTION POSTGRESQL RELATIONAL DATABASE SCHEMA & DDL MIGRATION
-- =================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ROLES
CREATE TYPE user_role AS ENUM (
  'customer', 'super_admin', 'logistics_manager', 
  'recruitment_manager', 'visa_officer', 'finance_staff', 
  'customer_support', 'content_manager'
);

CREATE TYPE kyc_status_type AS ENUM ('unsubmitted', 'pending', 'verified', 'rejected');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role user_role NOT NULL DEFAULT 'customer',
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  kyc_status kyc_status_type DEFAULT 'unsubmitted',
  preferred_language VARCHAR(10) DEFAULT 'en',
  preferred_currency VARCHAR(10) DEFAULT 'USD',
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT TRUE,
  whatsapp_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SHIPMENTS & TRACKING
CREATE TYPE shipment_status_type AS ENUM (
  'Shipment Created', 'Picked Up', 'Processing', 'In Transit',
  'Arrived at Facility', 'Departed Facility', 'Customs Processing',
  'Customs Cleared', 'Arrived at Destination', 'Out for Delivery',
  'Delivered', 'Cancelled'
);

CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  shipment_type VARCHAR(100) NOT NULL,
  service_speed VARCHAR(100) NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  sender_address TEXT NOT NULL,
  sender_city VARCHAR(100) NOT NULL,
  sender_country VARCHAR(100) NOT NULL,
  recipient_name VARCHAR(255) NOT NULL,
  recipient_address TEXT NOT NULL,
  recipient_city VARCHAR(100) NOT NULL,
  recipient_country VARCHAR(100) NOT NULL,
  origin VARCHAR(150) NOT NULL,
  destination VARCHAR(150) NOT NULL,
  current_location VARCHAR(200) NOT NULL,
  current_lat DECIMAL(10, 6),
  current_lng DECIMAL(10, 6),
  package_weight DECIMAL(8, 2) NOT NULL,
  package_count INT DEFAULT 1,
  declared_value DECIMAL(12, 2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'USD',
  shipping_cost DECIMAL(10, 2) NOT NULL,
  status shipment_status_type NOT NULL DEFAULT 'Shipment Created',
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  actual_delivery TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE tracking_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  event_time VARCHAR(20) NOT NULL,
  status shipment_status_type NOT NULL,
  location VARCHAR(200) NOT NULL,
  facility VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  lat DECIMAL(10, 6),
  lng DECIMAL(10, 6),
  created_by_user VARCHAR(150),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. JOB RECRUITMENT
CREATE TABLE job_vacancies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  department VARCHAR(150) NOT NULL,
  location VARCHAR(150) NOT NULL,
  country VARCHAR(100) NOT NULL,
  employment_type VARCHAR(50) NOT NULL,
  salary_min DECIMAL(12, 2),
  salary_max DECIMAL(12, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  experience_level VARCHAR(50),
  education_requirements TEXT,
  description TEXT NOT NULL,
  responsibilities JSONB,
  requirements JSONB,
  benefits JSONB,
  application_deadline DATE,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_number VARCHAR(50) UNIQUE NOT NULL,
  job_id UUID REFERENCES job_vacancies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  applicant_name VARCHAR(255) NOT NULL,
  applicant_email VARCHAR(255) NOT NULL,
  applicant_phone VARCHAR(50),
  experience_years INT,
  resume_file_url TEXT NOT NULL,
  cover_letter TEXT,
  status VARCHAR(50) DEFAULT 'Submitted',
  interview_date TIMESTAMP WITH TIME ZONE,
  internal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. VISA APPLICATION ASSISTANCE
CREATE TABLE visa_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  category_type VARCHAR(50) NOT NULL,
  processing_time VARCHAR(100),
  validity_period VARCHAR(100),
  government_fee DECIMAL(10, 2),
  service_fee DECIMAL(10, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  description TEXT,
  eligibility JSONB,
  required_documents JSONB
);

CREATE TABLE visa_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  visa_category_id UUID REFERENCES visa_categories(id),
  destination_country VARCHAR(100) NOT NULL,
  applicant_name VARCHAR(255) NOT NULL,
  passport_number VARCHAR(50) NOT NULL,
  passport_expiry DATE,
  nationality VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Submitted',
  submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  official_decision_notes TEXT
);

-- 5. DOCUMENTS, PAYMENTS & INVOICES
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  file_url TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Under Review',
  related_service VARCHAR(50),
  related_entity_id UUID,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  customer_name VARCHAR(255) NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  tax_amount DECIMAL(12, 2) DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'Paid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  service_type VARCHAR(100) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  payment_method VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'Completed',
  invoice_id UUID REFERENCES invoices(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX idx_shipments_user ON shipments(user_id);
CREATE INDEX idx_tracking_events_shipment ON tracking_events(shipment_id);
CREATE INDEX idx_job_vacancies_dept ON job_vacancies(department, country);
CREATE INDEX idx_visa_apps_user ON visa_applications(user_id);
CREATE INDEX idx_invoices_user ON invoices(user_id);
    `;
    res.json({ schemaSql: postgresDDL });
  });

  // --- VITE MIDDLEWARE / STATIC ASSETS ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ApexGlobal Platform Backend running on http://localhost:${PORT}`);
  });
}

startServer();
