import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public Pages
import { HomePage } from './components/pages/HomePage';
import { TrackingPage } from './components/pages/TrackingPage';
import { JobsPage } from './components/pages/JobsPage';
import { VisaPage } from './components/pages/VisaPage';
import { AboutPage } from './components/pages/AboutPage';
import { ServicesPage } from './components/pages/ServicesPage';
import { PricingPage } from './components/pages/PricingPage';
import { FAQPage } from './components/pages/FAQPage';
import { NewsPage } from './components/pages/NewsPage';
import { ContactPage } from './components/pages/ContactPage';
import { TravelPage } from './components/pages/TravelPage';

// Customer Portal
import { CustomerLayout } from './components/customer/CustomerLayout';
import { CustomerOverview } from './components/customer/CustomerOverview';
import { CustomerTravel } from './components/customer/CustomerTravel';
import { CustomerShipments } from './components/customer/CustomerShipments';
import { CustomerJobs } from './components/customer/CustomerJobs';
import { CustomerVisas } from './components/customer/CustomerVisas';
import { CustomerDocuments } from './components/customer/CustomerDocuments';
import { CustomerPayments } from './components/customer/CustomerPayments';
import { CustomerAppointments } from './components/customer/CustomerAppointments';
import { CustomerTickets } from './components/customer/CustomerTickets';
import { CustomerSettings } from './components/customer/CustomerSettings';

// Admin Command Center
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminShipments } from './components/admin/AdminShipments';
import { AdminJobs } from './components/admin/AdminJobs';
import { AdminVisas } from './components/admin/AdminVisas';
import { AdminFinances } from './components/admin/AdminFinances';
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminAuditLogs } from './components/admin/AdminAuditLogs';
import { AdminCms } from './components/admin/AdminCms';

// Modals
import { InvoiceModal } from './components/modals/InvoiceModal';
import { ShippingLabelModal } from './components/modals/ShippingLabelModal';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { AppointmentBookingModal } from './components/modals/AppointmentBookingModal';
import { AuthModal } from './components/modals/AuthModal';
import { FlightBookingModal } from './components/modals/FlightBookingModal';
import { HotelBookingModal } from './components/modals/HotelBookingModal';
import { FlightTicketModal } from './components/modals/FlightTicketModal';
import { FlightReceiptModal } from './components/modals/FlightReceiptModal';
import { CreateInvoiceModal } from './components/modals/CreateInvoiceModal';

// Toast stack
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-2xl flex items-start gap-3 animate-in slide-in-from-bottom-5 text-xs transition ${
            toast.type === 'success'
              ? 'bg-slate-900/90 text-white border-emerald-500/40 shadow-emerald-950/40'
              : toast.type === 'error'
              ? 'bg-rose-950/90 text-white border-rose-500/40 shadow-rose-950/40'
              : 'bg-slate-900/90 text-white border-blue-500/40 shadow-blue-950/40'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}

          <div className="flex-1 space-y-0.5">
            <div className="font-bold text-slate-100">{toast.title}</div>
            <div className="text-[11px] text-slate-300 leading-relaxed">{toast.message}</div>
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="text-slate-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

const MainRouter: React.FC = () => {
  const { currentView } = useApp();

  // 1. Customer Portal Routing
  if (currentView.startsWith('customer-')) {
    return (
      <CustomerLayout>
        {currentView === 'customer-overview' && <CustomerOverview />}
        {currentView === 'customer-travel' && <CustomerTravel />}
        {currentView === 'customer-shipments' && <CustomerShipments />}
        {currentView === 'customer-jobs' && <CustomerJobs />}
        {currentView === 'customer-visas' && <CustomerVisas />}
        {currentView === 'customer-documents' && <CustomerDocuments />}
        {currentView === 'customer-payments' && <CustomerPayments />}
        {currentView === 'customer-appointments' && <CustomerAppointments />}
        {currentView === 'customer-tickets' && <CustomerTickets />}
        {currentView === 'customer-settings' && <CustomerSettings />}
      </CustomerLayout>
    );
  }

  // 2. Admin Command Center Routing
  if (currentView.startsWith('admin-')) {
    return (
      <AdminLayout>
        {currentView === 'admin-dashboard' && <AdminDashboard />}
        {currentView === 'admin-shipments' && <AdminShipments />}
        {currentView === 'admin-jobs' && <AdminJobs />}
        {currentView === 'admin-visas' && <AdminVisas />}
        {currentView === 'admin-finances' && <AdminFinances />}
        {currentView === 'admin-users' && <AdminUsers />}
        {currentView === 'admin-audit' && <AdminAuditLogs />}
        {currentView === 'admin-cms' && <AdminCms />}
      </AdminLayout>
    );
  }

  // 3. Public Web Pages
  return (
    <>
      <main className="flex-1 relative z-10">
        {currentView === 'home' && <HomePage />}
        {currentView === 'travel' && <TravelPage />}
        {currentView === 'tracking' && <TrackingPage />}
        {currentView === 'jobs' && <JobsPage />}
        {currentView === 'visa' && <VisaPage />}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'services' && <ServicesPage />}
        {currentView === 'pricing' && <PricingPage />}
        {currentView === 'faq' && <FAQPage />}
        {currentView === 'news' && <NewsPage />}
        {currentView === 'contact' && <ContactPage />}
      </main>
      <Footer />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 font-sans antialiased relative overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200">
        {/* Ambient Glowing Blobs for Frosted Glass Backdrop */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] bg-blue-600/15 rounded-full blur-[140px] animate-pulse duration-10000" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-600/15 rounded-full blur-[140px]" />
          <div className="absolute top-[35%] right-[5%] w-[35vw] h-[35vw] bg-purple-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[25%] left-[10%] w-[30vw] h-[30vw] bg-emerald-600/10 rounded-full blur-[120px]" />
        </div>

        <Navbar />
        <MainRouter />

        {/* Global Modals */}
        <InvoiceModal />
        <ShippingLabelModal />
        <CheckoutModal />
        <AppointmentBookingModal />
        <AuthModal />
        <FlightBookingModal />
        <HotelBookingModal />
        <FlightTicketModal />
        <FlightReceiptModal />
        <CreateInvoiceModal />

        {/* Notification Toast Stack */}
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
