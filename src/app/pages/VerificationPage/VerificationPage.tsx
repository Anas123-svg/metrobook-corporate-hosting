import { Shield, CheckCircle, Clock, XCircle, Upload, FileText, Check } from "lucide-react";
import { motion } from "motion/react";

const verificationSteps = [
  {
    id: 1,
    title: "Business Registration",
    description: "Upload company registration documents",
    status: "completed",
  },
  {
    id: 2,
    title: "Tax Documents",
    description: "Provide tax identification and documentation",
    status: "completed",
  },
  {
    id: 3,
    title: "Identity Verification",
    description: "Verify authorized signatory identity",
    status: "in_progress",
  },
  {
    id: 4,
    title: "Final Approval",
    description: "Administrative review and approval",
    status: "pending",
  },
];

const uploadedDocuments = [
  {
    id: 1,
    name: "Business_Registration.pdf",
    type: "Registration",
    uploadedOn: "2026-02-20",
    status: "verified",
  },
  {
    id: 2,
    name: "Tax_ID_Certificate.pdf",
    type: "Tax Document",
    uploadedOn: "2026-02-20",
    status: "verified",
  },
  {
    id: 3,
    name: "Authorization_Letter.pdf",
    type: "Authorization",
    uploadedOn: "2026-02-25",
    status: "under_review",
  },
];

export function VerificationPage() {
  const currentStep = 3;
  const progress = (currentStep / verificationSteps.length) * 100;

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">
          KYB Verification
        </h1>
        <p className="text-[#666666]">Track your Know Your Business verification status</p>
      </div>

      {/* Status Overview */}
      <div className="bg-[#F8F8F8] rounded-2xl p-8 border border-black/5 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-full bg-[#00CFC5]/20 flex items-center justify-center border border-[#00CFC5]/30">
                <Shield className="w-7 h-7 text-[#00CFC5]" />
              </div>
              <div>
                <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display']">
                  Verification Status
                </h2>
                <p className="text-[#666666] text-sm">Last updated: February 26, 2026</p>
              </div>
            </div>
          </div>
          <div className="px-5 py-2.5 bg-[#00CFC5]/20 text-[#00CFC5] rounded-xl border border-[#00CFC5]/30 flex items-center gap-2 font-medium">
            <Clock className="w-5 h-5" />
            Under Review
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#666666]">Completion Progress</span>
            <span className="text-sm text-[#0D0D0D] font-medium">75%</span>
          </div>
          <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-black/10">
            <div className="h-full bg-gradient-to-r from-[#00CFC5] to-[#0E5E4F] w-3/4 transition-all" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-black/10">
            <p className="text-[#666666] text-sm mb-1">Documents Uploaded</p>
            <p className="text-2xl text-[#0D0D0D] font-['Playfair_Display']">3/4</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-black/10">
            <p className="text-[#666666] text-sm mb-1">Verification Type</p>
            <p className="text-lg text-[#0D0D0D] font-['Playfair_Display']">Corporate</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-black/10">
            <p className="text-[#666666] text-sm mb-1">Expected Completion</p>
            <p className="text-lg text-[#0D0D0D] font-['Playfair_Display']">2-3 days</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Verification Steps */}
        <div className="col-span-2 space-y-6">
          {/* Company Information */}
          <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#0E5E4F]/20 flex items-center justify-center border border-[#0E5E4F]/30">
                <CheckCircle className="w-5 h-5 text-[#0E5E4F]" />
              </div>
              <div>
                <h2 className="text-xl text-[#0D0D0D] font-['Playfair_Display']">
                  Company Information
                </h2>
                <p className="text-[#0E5E4F] text-sm">Verified</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#666666] mb-1">Company Name</p>
                <p className="text-[#0D0D0D] font-medium">MB Corporate</p>
              </div>
              <div>
                <p className="text-[#666666] mb-1">Registration Number</p>
                <p className="text-[#0D0D0D] font-medium">REG-2024-00123</p>
              </div>
              <div>
                <p className="text-[#666666] mb-1">Tax ID</p>
                <p className="text-[#0D0D0D] font-medium">TAX-98765432</p>
              </div>
              <div>
                <p className="text-[#666666] mb-1">Business Type</p>
                <p className="text-[#0D0D0D] font-medium">Corporation</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#0E5E4F]/20 flex items-center justify-center border border-[#0E5E4F]/30">
                <CheckCircle className="w-5 h-5 text-[#0E5E4F]" />
              </div>
              <div>
                <h2 className="text-xl text-[#0D0D0D] font-['Playfair_Display']">
                  Contact Details
                </h2>
                <p className="text-[#0E5E4F] text-sm">Verified</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#666666] mb-1">Primary Contact</p>
                <p className="text-[#0D0D0D] font-medium">Sarah Johnson</p>
              </div>
              <div>
                <p className="text-[#666666] mb-1">Email</p>
                <p className="text-[#0D0D0D] font-medium">admin@mbcorporate.com</p>
              </div>
              <div>
                <p className="text-[#666666] mb-1">Phone</p>
                <p className="text-[#0D0D0D] font-medium">+1 (555) 123-4567</p>
              </div>
              <div>
                <p className="text-[#666666] mb-1">Address</p>
                <p className="text-[#0D0D0D] font-medium">New York, NY</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00CFC5]/20 flex items-center justify-center border border-[#00CFC5]/30">
                  <FileText className="w-5 h-5 text-[#00CFC5]" />
                </div>
                <div>
                  <h2 className="text-xl text-[#0D0D0D] font-['Playfair_Display']">
                    Required Documents
                  </h2>
                  <p className="text-[#00CFC5] text-sm">In Review</p>
                </div>
              </div>
              <button className="px-4 py-2 border border-[#00CFC5] text-[#00CFC5] rounded-xl hover:bg-[#00CFC5]/10 transition-all text-sm font-medium">
                Upload More
              </button>
            </div>
            <div className="space-y-3">
              {uploadedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl p-4 border border-black/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#666666]" />
                    <div>
                      <p className="text-[#0D0D0D] font-medium text-sm">{doc.name}</p>
                      <p className="text-[#999999] text-xs">{doc.uploadedOn}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      doc.status === "verified"
                        ? "bg-[#0E5E4F]/20 text-[#0E5E4F] border border-[#0E5E4F]/30"
                        : doc.status === "pending"
                        ? "bg-[#00CFC5]/20 text-[#00CFC5] border border-[#00CFC5]/30"
                        : "bg-black/10 text-[#666666] border border-black/10"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
          <h2 className="text-xl text-[#0D0D0D] font-['Playfair_Display'] mb-6">Timeline</h2>
          <div className="space-y-6">
            {verificationSteps.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.status === "completed"
                        ? "bg-[#0E5E4F] text-white"
                        : event.status === "current"
                        ? "bg-[#00CFC5] text-white"
                        : "bg-white border border-black/10 text-[#999999]"
                    }`}
                  >
                    {event.status === "completed" ? (
                      <Check className="w-4 h-4" />
                    ) : event.status === "current" ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-[#999999]" />
                    )}
                  </div>
                  {index < verificationSteps.length - 1 && (
                    <div className="w-px h-12 bg-black/10 my-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-[#0D0D0D] font-medium text-sm mb-1">{event.title}</p>
                  <p className="text-[#999999] text-xs">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}