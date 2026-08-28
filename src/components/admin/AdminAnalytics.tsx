import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  DollarSign, 
  Package, 
  FileCheck2, 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Filter, 
  Download, 
  Printer, 
  SlidersHorizontal, 
  Calendar, 
  Globe2, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plane, 
  FileText, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight, 
  Eye, 
  EyeOff, 
  Settings2, 
  RotateCcw,
  Sparkles,
  MapPin,
  Users,
  Target,
  Percent,
  CheckSquare,
  Square
} from 'lucide-react';
import { formatPrice } from '../../lib/currencies';
import { formatDate } from '../../lib/utils';
import { exportToCSV } from '../../lib/exportUtils';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

// Customizable Dashboard Configuration Type
interface DashboardWidgetConfig {
  kpiCards: boolean;
  slaTargets: boolean;
  deliverySuccess: boolean;
  recruitmentVelocity: boolean;
  visaTrends: boolean;
  revenueBreakdown: boolean;
  tradeCorridors: boolean;
  granularTable: boolean;
}

interface SlaTargetGoals {
  deliverySuccessRate: number; // e.g. 98.5%
  avgHireDays: number; // e.g. 15 days
  visaApprovalRate: number; // e.g. 96.0%
  revenueTarget: number; // e.g. 1200000
}

const DEFAULT_WIDGET_CONFIG: DashboardWidgetConfig = {
  kpiCards: true,
  slaTargets: true,
  deliverySuccess: true,
  recruitmentVelocity: true,
  visaTrends: true,
  revenueBreakdown: true,
  tradeCorridors: true,
  granularTable: true,
};

const DEFAULT_SLA_TARGETS: SlaTargetGoals = {
  deliverySuccessRate: 98.0,
  avgHireDays: 16.0,
  visaApprovalRate: 95.5,
  revenueTarget: 1200000,
};

export const AdminAnalytics: React.FC = () => {
  const { 
    shipments, 
    jobApplications, 
    visaApplications, 
    invoices, 
    currency, 
    setCurrentView 
  } = useApp();

  // Filters State
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'month' | 'quarter' | 'ytd' | 'custom'>('quarter');
  const [customStartDate, setCustomStartDate] = useState('2026-06-01');
  const [customEndDate, setCustomEndDate] = useState('2026-08-31');
  const [regionFilter, setRegionFilter] = useState<'all' | 'europe' | 'north_america' | 'middle_east' | 'apac'>('all');
  const [serviceFilter, setServiceFilter] = useState<'all' | 'logistics' | 'visas' | 'recruitment' | 'courier'>('all');

  // Customizer Drawer / Modal State
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [focusPreset, setFocusPreset] = useState<'balanced' | 'logistics' | 'visas' | 'recruitment' | 'finance'>('balanced');
  
  // Stored preferences
  const [widgetConfig, setWidgetConfig] = useState<DashboardWidgetConfig>(() => {
    try {
      const saved = localStorage.getItem('apex_admin_dashboard_config');
      return saved ? JSON.parse(saved) : DEFAULT_WIDGET_CONFIG;
    } catch {
      return DEFAULT_WIDGET_CONFIG;
    }
  });

  const [slaTargets, setSlaTargets] = useState<SlaTargetGoals>(() => {
    try {
      const saved = localStorage.getItem('apex_admin_sla_targets');
      return saved ? JSON.parse(saved) : DEFAULT_SLA_TARGETS;
    } catch {
      return DEFAULT_SLA_TARGETS;
    }
  });

  const [activeTab, setActiveTab] = useState<'all' | 'logistics' | 'recruitment' | 'visas' | 'finances'>('all');
  const [searchTableQuery, setSearchTableQuery] = useState('');

  // Persist customizer changes
  const handleSaveConfig = (newConfig: DashboardWidgetConfig, newTargets: SlaTargetGoals) => {
    setWidgetConfig(newConfig);
    setSlaTargets(newTargets);
    localStorage.setItem('apex_admin_dashboard_config', JSON.stringify(newConfig));
    localStorage.setItem('apex_admin_sla_targets', JSON.stringify(newTargets));
  };

  const handleApplyPreset = (preset: 'balanced' | 'logistics' | 'visas' | 'recruitment' | 'finance') => {
    setFocusPreset(preset);
    let newConfig: DashboardWidgetConfig;
    if (preset === 'balanced') {
      newConfig = { ...DEFAULT_WIDGET_CONFIG };
    } else if (preset === 'logistics') {
      newConfig = {
        kpiCards: true,
        slaTargets: true,
        deliverySuccess: true,
        tradeCorridors: true,
        granularTable: true,
        recruitmentVelocity: false,
        visaTrends: false,
        revenueBreakdown: true,
      };
    } else if (preset === 'visas') {
      newConfig = {
        kpiCards: true,
        slaTargets: true,
        visaTrends: true,
        granularTable: true,
        deliverySuccess: false,
        recruitmentVelocity: false,
        revenueBreakdown: true,
        tradeCorridors: false,
      };
    } else if (preset === 'recruitment') {
      newConfig = {
        kpiCards: true,
        slaTargets: true,
        recruitmentVelocity: true,
        granularTable: true,
        deliverySuccess: false,
        visaTrends: false,
        revenueBreakdown: true,
        tradeCorridors: false,
      };
    } else {
      // Finance
      newConfig = {
        kpiCards: true,
        slaTargets: true,
        revenueBreakdown: true,
        granularTable: true,
        deliverySuccess: true,
        recruitmentVelocity: false,
        visaTrends: false,
        tradeCorridors: true,
      };
    }
    handleSaveConfig(newConfig, slaTargets);
  };

  // KPI Calculations based on active data + historical models
  const totalSettledRevenue = useMemo(() => {
    return invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0) || 1213200;
  }, [invoices]);

  // Delivery Success Rates & Route Telemetry
  const deliveryMetrics = useMemo(() => {
    const totalCargo = shipments.length || 10;
    const deliveredCargo = shipments.filter(s => s.status === 'delivered').length || 4;
    const inTransitCargo = shipments.filter(s => s.status !== 'delivered' && s.status !== 'Cancelled').length || 6;
    const onTimeRate = 98.4;
    const exceptionRate = 0.8;
    const customsDwellHours = 4.2;
    const avgTransitDays = 2.4;

    const routes = [
      { id: 'fra-jfk', corridor: 'Frankfurt (FRA) ✈️ New York (JFK)', successRate: 99.2, avgHours: 28.5, volume: 420, exceptions: 0, status: 'Optimal' },
      { id: 'lhr-dxb', corridor: 'London (LHR) ✈️ Dubai (DXB)', successRate: 98.8, avgHours: 32.0, volume: 385, exceptions: 1, status: 'Optimal' },
      { id: 'sin-cdg', corridor: 'Singapore (SIN) ✈️ Paris (CDG)', successRate: 97.9, avgHours: 36.4, volume: 290, exceptions: 1, status: 'Good' },
      { id: 'dxb-ord', corridor: 'Dubai (DXB) ✈️ Chicago (ORD)', successRate: 98.5, avgHours: 34.2, volume: 310, exceptions: 0, status: 'Optimal' },
      { id: 'nrt-fra', corridor: 'Tokyo (NRT) ✈️ Frankfurt (FRA)', successRate: 99.0, avgHours: 30.1, volume: 260, exceptions: 0, status: 'Optimal' },
    ];

    const delayCauses = [
      { reason: 'Customs Secondary Inspection', share: 52, color: '#f59e0b' },
      { reason: 'Airport Ramp / Cargo Hub Congestion', share: 28, color: '#3b82f6' },
      { reason: 'Transatlantic Weather Diversions', share: 14, color: '#8b5cf6' },
      { reason: 'Consignee Delivery Reschedule', share: 6, color: '#10b981' },
    ];

    return {
      totalCargo,
      deliveredCargo,
      inTransitCargo,
      onTimeRate,
      exceptionRate,
      customsDwellHours,
      avgTransitDays,
      routes,
      delayCauses,
    };
  }, [shipments]);

  // Recruitment Velocity & Stage Processing Time
  const recruitmentMetrics = useMemo(() => {
    const totalApps = jobApplications.length || 8;
    const avgProcessingDays = 15.6;
    const offerConversionRate = 68.4;

    const stagesBreakdown = [
      { stage: '1. Initial CV & Compliance Screening', avgDays: 2.1, benchmark: 2.5, passRate: 78 },
      { stage: '2. Technical Architecture & Portfolio', avgDays: 3.8, benchmark: 4.0, passRate: 64 },
      { stage: '3. Executive Client Panel Interview', avgDays: 5.4, benchmark: 6.0, passRate: 52 },
      { stage: '4. Offer Structuring & Compensation', avgDays: 2.5, benchmark: 3.0, passRate: 88 },
      { stage: '5. Consular Dossier / Security Check', avgDays: 1.8, benchmark: 2.0, passRate: 99 },
    ];

    const funnelData = [
      { name: 'Applied', candidates: 148, fill: '#3b82f6' },
      { name: 'Screened', candidates: 115, fill: '#6366f1' },
      { name: 'Technical', candidates: 74, fill: '#8b5cf6' },
      { name: 'Client Final', candidates: 38, fill: '#a855f7' },
      { name: 'Offers Extended', candidates: 26, fill: '#ec4899' },
      { name: 'Placed / Onboarded', candidates: 22, fill: '#10b981' },
    ];

    const roleVelocity = [
      { role: 'Cloud Solutions Architects', avgDays: 14.2, salaryAvg: '$165k' },
      { role: 'Consular Logistics Officers', avgDays: 12.8, salaryAvg: '$92k' },
      { role: 'VP of Trade Finance', avgDays: 22.4, salaryAvg: '$210k' },
      { role: 'Petroleum & Energy Engineers', avgDays: 18.0, salaryAvg: '$145k' },
    ];

    return {
      totalApps,
      avgProcessingDays,
      offerConversionRate,
      stagesBreakdown,
      funnelData,
      roleVelocity,
    };
  }, [jobApplications]);

  // Visa Application Approval Trends
  const visaMetrics = useMemo(() => {
    const totalVisas = visaApplications.length || 7;
    const approvalRate = 97.2;
    const rfeRate = 1.9; // Request for evidence
    const rejectionRate = 0.9;
    const avgTurnaroundDays = 8.5;

    const monthlyTrends = [
      { period: '2025 Q3', approvalRate: 94.8, applications: 85, approved: 81, rfe: 3 },
      { period: '2025 Q4', approvalRate: 95.6, applications: 110, approved: 105, rfe: 4 },
      { period: '2026 Q1', approvalRate: 96.4, applications: 142, approved: 137, rfe: 4 },
      { period: '2026 Q2', approvalRate: 97.0, applications: 178, approved: 173, rfe: 3 },
      { period: '2026 Q3 (Current)', approvalRate: 97.2, applications: 215, approved: 209, rfe: 4 },
    ];

    const visaCategories = [
      { category: 'UK Skilled Worker & Tech Specialist', approvalRate: 98.6, avgDays: 11.5, volume: 92 },
      { category: 'UAE Golden Tech & Executive Visa', approvalRate: 99.1, avgDays: 3.2, volume: 74 },
      { category: 'US EB-1 / O-1 Extraordinary Ability', approvalRate: 94.2, avgDays: 26.0, volume: 28 },
      { category: 'EU Blue Card & Intra-Company', approvalRate: 98.0, avgDays: 8.4, volume: 46 },
    ];

    return {
      totalVisas,
      approvalRate,
      rfeRate,
      rejectionRate,
      avgTurnaroundDays,
      monthlyTrends,
      visaCategories,
    };
  }, [visaApplications]);

  // Revenue Breakdown by Service
  const revenueMetrics = useMemo(() => {
    const serviceBreakdown = [
      { service: 'Air Freight & Cargo Logistics', revenue: 482500, margin: 26, growth: '+28.4%', color: '#2563eb' },
      { service: 'Consular Visa Dossiers & Legal', revenue: 318200, margin: 52, growth: '+34.1%', color: '#9333ea' },
      { service: 'Executive Headhunting & Talent', revenue: 294000, margin: 64, growth: '+22.6%', color: '#4f46e5' },
      { service: 'Priority Express Document Courier', revenue: 118500, margin: 38, growth: '+18.2%', color: '#06b6d4' },
    ];

    const regionalContribution = [
      { region: 'Europe (UK, DE, FR)', revenue: 420000, share: 34.6, color: '#3b82f6' },
      { region: 'Middle East & Gulf (UAE, KSA)', revenue: 390000, share: 32.1, color: '#8b5cf6' },
      { region: 'North America (US, CA)', revenue: 310000, share: 25.5, color: '#06b6d4' },
      { region: 'Asia-Pacific (SG, JP, AU)', revenue: 93200, share: 7.8, color: '#10b981' },
    ];

    const quarterlyTrajectory = [
      { quarter: '2025 Q3', logistics: 320000, visas: 190000, recruitment: 180000, courier: 75000 },
      { quarter: '2025 Q4', logistics: 365000, visas: 220000, recruitment: 215000, courier: 88000 },
      { quarter: '2026 Q1', logistics: 410000, visas: 260000, recruitment: 245000, courier: 98000 },
      { quarter: '2026 Q2', logistics: 445000, visas: 290000, recruitment: 270000, courier: 108000 },
      { quarter: '2026 Q3 (Current)', logistics: 482500, visas: 318200, recruitment: 294000, courier: 118500 },
    ];

    return {
      serviceBreakdown,
      regionalContribution,
      quarterlyTrajectory,
    };
  }, []);

  // Filtered Granular Table Data
  const rawTableRecords = useMemo(() => {
    const list: Array<{
      id: string;
      type: 'Freight' | 'Visa' | 'Recruitment' | 'Invoice';
      title: string;
      reference: string;
      region: string;
      date: string;
      status: string;
      amount?: number;
    }> = [];

    shipments.forEach(s => {
      list.push({
        id: s.id,
        type: 'Freight',
        title: `${s.origin} ✈️ ${s.destination} (${s.shipmentType})`,
        reference: s.trackingNumber,
        region: s.origin.includes('Germany') || s.origin.includes('UK') ? 'Europe' : s.origin.includes('Dubai') ? 'Middle East' : 'North America',
        date: s.routeWaypoints?.[0]?.passed ? '2026-08-27' : '2026-08-25',
        status: s.status,
        amount: 3450,
      });
    });

    visaApplications.forEach(v => {
      list.push({
        id: v.id,
        type: 'Visa',
        title: `${v.visaCategoryName} (${v.applicantName})`,
        reference: v.dossierNumber,
        region: v.destinationCountry.includes('UK') || v.destinationCountry.includes('France') ? 'Europe' : v.destinationCountry.includes('UAE') ? 'Middle East' : 'North America',
        date: formatDate(v.submittedAt || '2026-08-20'),
        status: v.status,
        amount: v.totalFee || 2800,
      });
    });

    jobApplications.forEach(j => {
      list.push({
        id: j.id,
        type: 'Recruitment',
        title: `${j.jobTitle} (${j.candidateName})`,
        reference: `APP-${j.id.slice(-5)}`,
        region: 'Europe',
        date: formatDate(j.appliedAt || '2026-08-22'),
        status: j.status,
        amount: 8500,
      });
    });

    invoices.forEach(inv => {
      list.push({
        id: inv.id,
        type: 'Invoice',
        title: `${inv.customerName} - ${inv.items[0]?.description || 'Consolidated Operations'}`,
        reference: inv.invoiceNumber,
        region: 'Global',
        date: formatDate(inv.issueDate),
        status: inv.status,
        amount: inv.total,
      });
    });

    // Apply active filter
    return list.filter(item => {
      if (serviceFilter !== 'all') {
        if (serviceFilter === 'logistics' && item.type !== 'Freight') return false;
        if (serviceFilter === 'visas' && item.type !== 'Visa') return false;
        if (serviceFilter === 'recruitment' && item.type !== 'Recruitment') return false;
      }
      if (regionFilter !== 'all') {
        if (regionFilter === 'europe' && item.region !== 'Europe') return false;
        if (regionFilter === 'middle_east' && item.region !== 'Middle East') return false;
        if (regionFilter === 'north_america' && item.region !== 'North America') return false;
      }
      if (searchTableQuery.trim()) {
        const q = searchTableQuery.toLowerCase();
        return item.title.toLowerCase().includes(q) || item.reference.toLowerCase().includes(q) || item.status.toLowerCase().includes(q);
      }
      return true;
    });
  }, [shipments, visaApplications, jobApplications, invoices, serviceFilter, regionFilter, searchTableQuery]);

  // Export handlers
  const handleExportKPICSV = () => {
    const headers = ['KPI Metric', 'Current Value', 'Target SLA', 'Status vs Target', 'Primary Unit'];
    const rows = [
      ['Shipment On-Time Delivery Rate', `${deliveryMetrics.onTimeRate}%`, `${slaTargets.deliverySuccessRate}%`, deliveryMetrics.onTimeRate >= slaTargets.deliverySuccessRate ? 'Exceeding SLA' : 'Below SLA', 'Percentage'],
      ['Average Air Transit Dwell Time', `${deliveryMetrics.customsDwellHours} Hours`, '4.5 Hours', 'Optimal', 'Hours'],
      ['Average Job Application Processing Time', `${recruitmentMetrics.avgProcessingDays} Days`, `${slaTargets.avgHireDays} Days`, recruitmentMetrics.avgProcessingDays <= slaTargets.avgHireDays ? 'Exceeding Target' : 'Needs Optimization', 'Days'],
      ['Recruitment Offer Conversion Rate', `${recruitmentMetrics.offerConversionRate}%`, '65.0%', 'Exceeding', 'Percentage'],
      ['Visa Application Approval Rate', `${visaMetrics.approvalRate}%`, `${slaTargets.visaApprovalRate}%`, visaMetrics.approvalRate >= slaTargets.visaApprovalRate ? 'Optimal' : 'Standard', 'Percentage'],
      ['Visa Dossier Turnaround Lead Time', `${visaMetrics.avgTurnaroundDays} Days`, '10.0 Days', 'Fast-Track', 'Days'],
      ['Multi-Service Settled Revenue', `$${totalSettledRevenue.toLocaleString()}`, `$${slaTargets.revenueTarget.toLocaleString()}`, totalSettledRevenue >= slaTargets.revenueTarget ? 'Target Achieved' : 'On Track', 'USD'],
      ['Active Air Cargo Consignments', `${shipments.length}`, 'N/A', 'Active Operations', 'Consignments'],
      ['Active Candidate Applications', `${jobApplications.length}`, 'N/A', 'In Pipeline', 'Dossiers'],
    ];

    exportToCSV('Apex_Global_KPI_Analytics_Report', headers, rows);
  };

  const handleExportGranularCSV = () => {
    const headers = ['Record ID', 'Vertical Type', 'Title & Description', 'Reference Code', 'Region', 'Date Created', 'Operational Status', 'Settled Value (USD)'];
    const rows = rawTableRecords.map(r => [
      r.id,
      r.type,
      r.title,
      r.reference,
      r.region,
      r.date,
      r.status,
      r.amount || 0
    ]);

    exportToCSV('Apex_Global_Operations_Granular_Data', headers, rows);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Executive Command Intelligence Header */}
      <div className="bg-white/[0.04] backdrop-blur-2xl text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono bg-blue-500/20 px-2.5 py-0.5 rounded-full border border-blue-500/30">
              Operations HQ • ISO 9001:2026 Telemetry
            </span>
            <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live Streaming Telemetry Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
            Analytics & Executive Reporting
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Multi-corridor logistics SLA metrics, candidate hiring velocity, sovereign visa approval trajectories, and multi-service financial yield.
          </p>
        </div>

        {/* Global Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10 w-full sm:w-auto">
          {/* Customizer Button */}
          <button
            onClick={() => setCustomizerOpen(true)}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl border border-white/15 backdrop-blur-md transition flex items-center gap-2 shadow-sm"
            title="Configure Dashboard Widgets & Targets"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-400" />
            <span>Customize Dashboard</span>
          </button>

          {/* Export Dropdown / Actions */}
          <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl border border-white/15 backdrop-blur-md">
            <button
              onClick={handleExportKPICSV}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm"
              title="Download KPI Analytics Summary CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>KPI CSV</span>
            </button>
            <button
              onClick={handleExportGranularCSV}
              className="px-3 py-1.5 hover:bg-white/10 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
              title="Download Granular Operations Dataset CSV"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-300" />
              <span>Full CSV</span>
            </button>
            <button
              onClick={handlePrintReport}
              className="px-3 py-1.5 hover:bg-white/10 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
              title="Print Official PDF Executive Intelligence Dossier"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>Print PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Dimensional Filter Toolbar */}
      <div className="bg-white/[0.04] backdrop-blur-2xl p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg text-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
            <Filter className="w-4 h-4 text-blue-400" />
            <span>Telemetry Filters:</span>
          </div>

          {/* Date Range Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { key: '7d', label: 'Last 7 Days' },
              { key: '30d', label: 'Last 30 Days' },
              { key: 'month', label: 'This Month' },
              { key: 'quarter', label: 'Q3 2026 (Active)' },
              { key: 'ytd', label: 'Year-to-Date (2026)' },
              { key: 'custom', label: 'Custom Range' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setDateRange(tab.key as any)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  dateRange === tab.key
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Region & Service Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Region Filter */}
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
              <Globe2 className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value as any)}
                className="bg-transparent text-white font-medium focus:outline-none text-xs cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">All Trade Regions</option>
                <option value="europe" className="bg-slate-900 text-white">Europe (LHR, FRA, CDG)</option>
                <option value="middle_east" className="bg-slate-900 text-white">Middle East (DXB, DOH, RUH)</option>
                <option value="north_america" className="bg-slate-900 text-white">North America (JFK, ORD, YYZ)</option>
                <option value="apac" className="bg-slate-900 text-white">Asia-Pacific (SIN, NRT, SYD)</option>
              </select>
            </div>

            {/* Service Type Filter */}
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value as any)}
                className="bg-transparent text-white font-medium focus:outline-none text-xs cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">All Service Verticals</option>
                <option value="logistics" className="bg-slate-900 text-white">Air Cargo & Freight</option>
                <option value="visas" className="bg-slate-900 text-white">Consular Visas & Legal</option>
                <option value="recruitment" className="bg-slate-900 text-white">Executive Headhunting</option>
                <option value="courier" className="bg-slate-900 text-white">Express Document Courier</option>
              </select>
            </div>
          </div>

        </div>

        {/* Custom Date Pickers when active */}
        {dateRange === 'custom' && (
          <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl flex flex-wrap items-center gap-4 text-slate-300">
            <span className="text-[11px] font-semibold text-slate-400">Specify Custom Date Horizon:</span>
            <div className="flex items-center gap-2">
              <label className="text-xs">From:</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="bg-slate-800 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs">To:</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="bg-slate-800 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white"
              />
            </div>
            <span className="text-[11px] text-emerald-400 ml-auto font-mono font-semibold">
              Applying custom date bounds
            </span>
          </div>
        )}
      </div>

      {/* 1. Core Primary KPI Scorecard Grid */}
      {widgetConfig.kpiCards && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* KPI 1: Shipment Delivery Success Rate */}
          <div className="bg-white/[0.04] backdrop-blur-2xl p-5 rounded-2xl border border-white/10 shadow-lg space-y-2 hover:border-blue-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-bold uppercase text-[10px] tracking-wider text-blue-400 font-mono">Freight Reliability</span>
              <Package className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-white font-display">
                {deliveryMetrics.onTimeRate}%
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +0.9% SLA
              </span>
            </div>
            <div className="text-[11px] text-slate-300 flex items-center justify-between pt-1 border-t border-white/5">
              <span>Target: {slaTargets.deliverySuccessRate}%</span>
              <span className="text-emerald-400 font-semibold">{deliveryMetrics.customsDwellHours}h Avg Dwell</span>
            </div>
          </div>

          {/* KPI 2: Average Job Application Processing Time */}
          <div className="bg-white/[0.04] backdrop-blur-2xl p-5 rounded-2xl border border-white/10 shadow-lg space-y-2 hover:border-indigo-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-bold uppercase text-[10px] tracking-wider text-indigo-400 font-mono">Talent Velocity</span>
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-white font-display">
                {recruitmentMetrics.avgProcessingDays}d
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-0.5">
                <ArrowDownRight className="w-3 h-3" /> -2.4d Faster
              </span>
            </div>
            <div className="text-[11px] text-slate-300 flex items-center justify-between pt-1 border-t border-white/5">
              <span>Target: &lt;{slaTargets.avgHireDays}d</span>
              <span className="text-indigo-300 font-semibold">{recruitmentMetrics.offerConversionRate}% Offer Rate</span>
            </div>
          </div>

          {/* KPI 3: Visa Application Approval Trend */}
          <div className="bg-white/[0.04] backdrop-blur-2xl p-5 rounded-2xl border border-white/10 shadow-lg space-y-2 hover:border-purple-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-bold uppercase text-[10px] tracking-wider text-purple-400 font-mono">Consular Clearance</span>
              <FileCheck2 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-white font-display">
                {visaMetrics.approvalRate}%
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +1.4% YoY
              </span>
            </div>
            <div className="text-[11px] text-slate-300 flex items-center justify-between pt-1 border-t border-white/5">
              <span>Target: {slaTargets.visaApprovalRate}%</span>
              <span className="text-purple-300 font-semibold">{visaMetrics.avgTurnaroundDays}d Lead Time</span>
            </div>
          </div>

          {/* KPI 4: Multi-Service Settled Revenue */}
          <div className="bg-white/[0.04] backdrop-blur-2xl p-5 rounded-2xl border border-white/10 shadow-lg space-y-2 hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-bold uppercase text-[10px] tracking-wider text-emerald-400 font-mono">Settled Volume</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-white font-display">
                {formatPrice(totalSettledRevenue, currency)}
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +26.8%
              </span>
            </div>
            <div className="text-[11px] text-slate-300 flex items-center justify-between pt-1 border-t border-white/5">
              <span>Goal: {formatPrice(slaTargets.revenueTarget, currency)}</span>
              <span className="text-emerald-400 font-semibold">101.1% Target</span>
            </div>
          </div>

        </div>
      )}

      {/* 2. Target vs Actual SLA Progress Gauges */}
      {widgetConfig.slaTargets && (
        <div className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-white font-display">
                Operational SLA Targets vs. Actual Field Telemetry
              </h3>
            </div>
            <button
              onClick={() => setCustomizerOpen(true)}
              className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Adjust Goal Parameters</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Delivery SLA Progress */}
            <div className="space-y-2 bg-white/[0.03] p-4 rounded-2xl border border-white/10">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Air Cargo On-Time SLA</span>
                <span className="text-emerald-400 font-mono">{deliveryMetrics.onTimeRate}% / {slaTargets.deliverySuccessRate}% Goal</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                  style={{ width: `${Math.min((deliveryMetrics.onTimeRate / slaTargets.deliverySuccessRate) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Tolerance: ±1.0%</span>
                <span className="text-emerald-300 font-bold">100.4% Target Met</span>
              </div>
            </div>

            {/* Recruitment Turnaround Progress */}
            <div className="space-y-2 bg-white/[0.03] p-4 rounded-2xl border border-white/10">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Candidate Placement Turnaround</span>
                <span className="text-indigo-300 font-mono">{recruitmentMetrics.avgProcessingDays}d / {slaTargets.avgHireDays}d Target</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full"
                  style={{ width: `${Math.min((slaTargets.avgHireDays / recruitmentMetrics.avgProcessingDays) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Benchmark: 18.0 days</span>
                <span className="text-emerald-300 font-bold">13.3% Ahead of Schedule</span>
              </div>
            </div>

            {/* Visa Approval Progress */}
            <div className="space-y-2 bg-white/[0.03] p-4 rounded-2xl border border-white/10">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Consular Visa Compliance Approval</span>
                <span className="text-purple-300 font-mono">{visaMetrics.approvalRate}% / {slaTargets.visaApprovalRate}% Goal</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full"
                  style={{ width: `${Math.min((visaMetrics.approvalRate / slaTargets.visaApprovalRate) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>RFE Rate: {visaMetrics.rfeRate}%</span>
                <span className="text-emerald-300 font-bold">101.8% Goal Achieved</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Detailed Reports Grid: Delivery Success & Visa Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Report 1: Shipment Delivery Success Rates & Delay Factors */}
        {widgetConfig.deliverySuccess && (
          <div className="lg:col-span-7 bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono">KPI Deep Dive #1</span>
                <h3 className="text-base font-bold text-white font-display">Shipment Delivery Success & Dwell Time</h3>
                <p className="text-xs text-slate-400">Flight route clearance success, dwell hours, and exception breakdown</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                  98.4% Net On-Time
                </span>
              </div>
            </div>

            {/* Route Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10">
                    <th className="pb-2">Strategic Trade Corridor</th>
                    <th className="pb-2">Success Rate</th>
                    <th className="pb-2">Avg Transit</th>
                    <th className="pb-2">Volume</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {deliveryMetrics.routes.map(r => (
                    <tr key={r.id} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 font-medium text-white flex items-center gap-2">
                        <Plane className="w-3.5 h-3.5 text-blue-400" />
                        <span>{r.corridor}</span>
                      </td>
                      <td className="py-2.5 font-mono font-bold text-emerald-400">{r.successRate}%</td>
                      <td className="py-2.5 text-slate-300">{r.avgHours}h</td>
                      <td className="py-2.5 font-mono text-slate-300">{r.volume} Waybills</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Delay Cause Distribution */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Exception & Dwell Time Factors</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {deliveryMetrics.delayCauses.map((c, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="text-[10px] text-slate-400 truncate" title={c.reason}>{c.reason}</div>
                    <div className="font-bold font-mono text-white text-sm" style={{ color: c.color }}>{c.share}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Report 2: Visa Application Approval Trends */}
        {widgetConfig.visaTrends && (
          <div className="lg:col-span-5 bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-xl space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">KPI Deep Dive #2</span>
                  <h3 className="text-base font-bold text-white font-display">Visa Application Approval Trends</h3>
                  <p className="text-xs text-slate-400">Quarterly sovereign approval rates across global embassies</p>
                </div>
                <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-xl border border-purple-500/30">
                  97.2% Net Approval
                </span>
              </div>

              {/* Visa Quarterly Line / Bar Chart */}
              <div className="h-44 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visaMetrics.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="period" stroke="#94a3b8" fontSize={10} />
                    <YAxis domain={[90, 100]} stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `${v}%`} />
                    <Tooltip 
                      formatter={(val: number) => [`${val}% Approval Rate`, 'Approval']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '11px' }}
                    />
                    <Line type="monotone" dataKey="approvalRate" stroke="#c084fc" strokeWidth={3} dot={{ fill: '#a855f7', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Visa Category Approvals List */}
            <div className="space-y-2 border-t border-white/10 pt-3 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Class Performance & Processing SLA</div>
              <div className="space-y-1.5">
                {visaMetrics.visaCategories.map((vc, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/5 p-2 rounded-xl border border-white/10 text-[11px]">
                    <span className="font-medium text-slate-200 truncate max-w-[200px]" title={vc.category}>{vc.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{vc.avgDays}d</span>
                      <span className="font-mono font-bold text-purple-300">{vc.approvalRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 4. Detailed Reports Grid: Recruitment Velocity & Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Report 3: Average Job Application Processing Time */}
        {widgetConfig.recruitmentVelocity && (
          <div className="lg:col-span-6 bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-xl space-y-5">
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">KPI Deep Dive #3</span>
                <h3 className="text-base font-bold text-white font-display">Recruitment Funnel & Processing Time</h3>
                <p className="text-xs text-slate-400">Stage dwell times, benchmark SLAs, and candidate throughput</p>
              </div>
              <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-xl border border-indigo-500/30">
                15.6 Days Avg Hire
              </span>
            </div>

            {/* Stages Bar Progress */}
            <div className="space-y-3 text-xs">
              {recruitmentMetrics.stagesBreakdown.map((st, i) => (
                <div key={i} className="space-y-1 bg-white/[0.03] p-2.5 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-slate-200">{st.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-300">{st.avgDays} Days</span>
                      <span className="text-slate-500">(Target: {st.benchmark}d)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full"
                      style={{ width: `${(st.avgDays / st.benchmark) * 80}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Role Velocity Badges */}
            <div className="pt-2 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              {recruitmentMetrics.roleVelocity.map((r, i) => (
                <div key={i} className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-400 truncate" title={r.role}>{r.role}</div>
                  <div className="font-bold text-indigo-300 mt-0.5">{r.avgDays} Days</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report 4: Revenue Breakdown by Service & Region */}
        {widgetConfig.revenueBreakdown && (
          <div className="lg:col-span-6 bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-xl space-y-5">
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">KPI Deep Dive #4</span>
                <h3 className="text-base font-bold text-white font-display">Revenue Breakdown by Service Vertical</h3>
                <p className="text-xs text-slate-400">Contribution, gross margins, and regional fiscal split</p>
              </div>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                {formatPrice(totalSettledRevenue, currency)}
              </span>
            </div>

            {/* Multi-Service Area Chart */}
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueMetrics.quarterlyTrajectory}>
                  <defs>
                    <linearGradient id="areaLogistics" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="areaVisa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="areaTalent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="quarter" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip 
                    formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="logistics" name="Air Freight" stroke="#2563eb" fillOpacity={1} fill="url(#areaLogistics)" strokeWidth={2} />
                  <Area type="monotone" dataKey="visas" name="Consular Visas" stroke="#9333ea" fillOpacity={1} fill="url(#areaVisa)" strokeWidth={2} />
                  <Area type="monotone" dataKey="recruitment" name="Executive Recruitment" stroke="#4f46e5" fillOpacity={1} fill="url(#areaTalent)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Service & Margin List */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
              {revenueMetrics.serviceBreakdown.map((s, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-200 truncate" title={s.service}>{s.service}</span>
                    <span className="text-emerald-400 font-mono text-[10px]">{s.growth}</span>
                  </div>
                  <div className="flex justify-between items-baseline font-mono">
                    <span className="font-bold text-white">${s.revenue.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400">{s.margin}% Margin</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 5. Granular Multi-Service Data Audit Table */}
      {widgetConfig.granularTable && (
        <div className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="font-bold text-white text-base font-display flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Auditable Operations & Transaction Telemetry</span>
              </h3>
              <p className="text-xs text-slate-400">Live synchronized records across consignments, candidates, consular filings, and billing</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={searchTableQuery}
                onChange={(e) => setSearchTableQuery(e.target.value)}
                placeholder="Search waybill, candidate, dossier, status..."
                className="bg-slate-800/80 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10">
                  <th className="pb-3">Service Type</th>
                  <th className="pb-3">Reference ID</th>
                  <th className="pb-3">Subject / Description</th>
                  <th className="pb-3">Corridor / Hub</th>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Value (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rawTableRecords.slice(0, 10).map((rec, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition">
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.type === 'Freight' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        rec.type === 'Visa' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        rec.type === 'Recruitment' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {rec.type}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-200">{rec.reference}</td>
                    <td className="py-3 font-medium text-white max-w-xs truncate">{rec.title}</td>
                    <td className="py-3 text-slate-300">{rec.region}</td>
                    <td className="py-3 text-slate-400">{rec.date}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-slate-200 border border-white/10">
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-white text-right">
                      {rec.amount ? `$${rec.amount.toLocaleString()}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <span>Showing {Math.min(rawTableRecords.length, 10)} of {rawTableRecords.length} synchronized operational telemetry events</span>
            <button
              onClick={handleExportGranularCSV}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <span>Export Full Table (CSV)</span>
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Admin Dashboard Customizer Modal / Drawer */}
      {customizerOpen && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900/95 backdrop-blur-2xl text-white rounded-3xl border border-white/15 shadow-2xl w-full max-w-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200 text-xs">
            
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Customize Administrator Dashboard View
                  </h3>
                  <p className="text-xs text-slate-400">Prioritize widgets, set operational focus, and configure SLA target thresholds.</p>
                </div>
              </div>
              <button
                onClick={() => setCustomizerOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Preset Selectors */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  Executive Operational Focus Preset:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'balanced', label: 'Balanced Command', desc: 'All metrics active' },
                    { id: 'logistics', label: 'Logistics Operations First', desc: 'Cargo & Corridors' },
                    { id: 'visas', label: 'Consular Dossiers First', desc: 'Visa Approvals & Embassies' },
                    { id: 'recruitment', label: 'Talent Mobility First', desc: 'Recruitment & Velocity' },
                    { id: 'finance', label: 'Financial Health First', desc: 'Revenue & Margins' },
                  ].map(pr => (
                    <button
                      key={pr.id}
                      type="button"
                      onClick={() => handleApplyPreset(pr.id as any)}
                      className={`p-3 rounded-2xl border text-left transition ${
                        focusPreset === pr.id
                          ? 'bg-blue-600/30 border-blue-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">{pr.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{pr.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Widget Visibility Toggles */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <label className="block font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  Toggle Visible Dashboard Widgets:
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { key: 'kpiCards', label: 'Core KPI Summary Cards (4 Metrics)' },
                    { key: 'slaTargets', label: 'Target vs. Actual SLA Progress Gauges' },
                    { key: 'deliverySuccess', label: 'Shipment Delivery Success & Routes' },
                    { key: 'recruitmentVelocity', label: 'Talent Processing Velocity & Funnel' },
                    { key: 'visaTrends', label: 'Visa Application Approval Trends' },
                    { key: 'revenueBreakdown', label: 'Revenue Breakdown & Profit Margins' },
                    { key: 'granularTable', label: 'Granular Auditable Operations Table' },
                  ].map(w => (
                    <button
                      key={w.key}
                      type="button"
                      onClick={() => {
                        const key = w.key as keyof DashboardWidgetConfig;
                        handleSaveConfig({ ...widgetConfig, [key]: !widgetConfig[key] }, slaTargets);
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between text-left transition ${
                        widgetConfig[w.key as keyof DashboardWidgetConfig]
                          ? 'bg-blue-500/10 border-blue-500/30 text-white'
                          : 'bg-white/[0.02] border-white/10 text-slate-400'
                      }`}
                    >
                      <span className="font-semibold text-xs">{w.label}</span>
                      {widgetConfig[w.key as keyof DashboardWidgetConfig] ? (
                        <CheckSquare className="w-4 h-4 text-blue-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* SLA Target Values Manager */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <label className="block font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  Customizable SLA & KPI Goal Thresholds:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Target Delivery Success Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={slaTargets.deliverySuccessRate}
                      onChange={(e) => handleSaveConfig(widgetConfig, { ...slaTargets, deliverySuccessRate: parseFloat(e.target.value) || 98 })}
                      className="w-full bg-slate-800 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Target Hire Turnaround (Days)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={slaTargets.avgHireDays}
                      onChange={(e) => handleSaveConfig(widgetConfig, { ...slaTargets, avgHireDays: parseFloat(e.target.value) || 15 })}
                      className="w-full bg-slate-800 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Target Visa Approval Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={slaTargets.visaApprovalRate}
                      onChange={(e) => handleSaveConfig(widgetConfig, { ...slaTargets, visaApprovalRate: parseFloat(e.target.value) || 96 })}
                      className="w-full bg-slate-800 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Annual Revenue Goal ($ USD)</label>
                    <input
                      type="number"
                      step="50000"
                      value={slaTargets.revenueTarget}
                      onChange={(e) => handleSaveConfig(widgetConfig, { ...slaTargets, revenueTarget: parseFloat(e.target.value) || 1200000 })}
                      className="w-full bg-slate-800 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  handleSaveConfig(DEFAULT_WIDGET_CONFIG, DEFAULT_SLA_TARGETS);
                  setFocusPreset('balanced');
                }}
                className="px-3 py-2 text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to System Defaults</span>
              </button>

              <button
                type="button"
                onClick={() => setCustomizerOpen(false)}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition"
              >
                Apply & Save Dashboard
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
