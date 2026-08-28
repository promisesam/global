import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FolderLock, 
  Upload, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Download, 
  Lock, 
  Plus,
  AlertCircle
} from 'lucide-react';
import { formatStatus, formatDate, getStatusBadgeColor } from '../../lib/utils';

export const CustomerDocuments: React.FC = () => {
  const { documents, currentUser, uploadDocument, showToast } = useApp();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState<'passport' | 'educational_certificate' | 'commercial_invoice' | 'police_clearance' | 'bank_statement'>('passport');
  const [serviceLink, setServiceLink] = useState<'logistics' | 'recruitment' | 'visa' | 'kyc'>('visa');
  const [isUploading, setIsUploading] = useState(false);

  const userDocs = documents.filter(d => d.userId === currentUser.id);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;
    setIsUploading(true);
    try {
      await uploadDocument({
        fileName: fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`,
        fileType: 'application/pdf',
        fileSizeMb: 2.4,
        category,
        serviceLink,
      });
      setIsUploading(false);
      setUploadModalOpen(false);
      setFileName('');
    } catch {
      setIsUploading(false);
    }
  };

  const handleSimulatedDownload = (docName: string) => {
    showToast('info', 'Document Decrypted', `Secure download stream opened for ${docName}.`);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 font-display">Encrypted Document & KYC Vault</h1>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" /> AES-256
            </span>
          </div>
          <p className="text-xs text-slate-500">Secure cloud repository for passports, degrees, police certificates, and cargo declarations.</p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
        >
          <Upload className="w-4 h-4" /> Upload New File
        </button>
      </div>

      {/* Vault List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Document Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Linked Service</th>
                <th className="py-3.5 px-4">Uploaded</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No documents currently stored in your encrypted vault.
                  </td>
                </tr>
              ) : (
                userDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{doc.fileName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {doc.category.replace('_', ' ').toUpperCase()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                        {doc.serviceLink}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {formatDate(doc.uploadedAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeColor(doc.status)}`}>
                        {formatStatus(doc.status)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleSimulatedDownload(doc.fileName)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition inline-flex"
                        title="Download Decrypted Copy"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 text-xs animate-in zoom-in-95">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-600" /> Upload Document to Encrypted Vault
            </h3>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Label / File Title</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. Passport_Bio_Page.pdf"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="passport">Valid International Passport Bio Page</option>
                  <option value="educational_certificate">Attested University Degree / Diploma</option>
                  <option value="bank_statement">Certified Bank Statement (Proof of Funds)</option>
                  <option value="police_clearance">Police Clearance Certificate</option>
                  <option value="commercial_invoice">Commercial Cargo Invoice</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Associated Business Service</label>
                <select
                  value={serviceLink}
                  onChange={(e) => setServiceLink(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="visa">Visa & Consular Case File</option>
                  <option value="recruitment">Recruitment & Employment Sponsorship</option>
                  <option value="logistics">Courier & Freight Clearance</option>
                  <option value="kyc">General Identity & KYC Verification</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Files are encrypted with zero-knowledge keys before persistence.</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                >
                  {isUploading ? 'Encrypting & Storing...' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
