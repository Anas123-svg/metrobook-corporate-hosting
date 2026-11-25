import { Clock, Check, X, AlertCircle, User, CheckCircle, XCircle } from "lucide-react";

const pendingActions = [
  {
    id: 1,
    type: "booking_approval",
    title: "Booking Approval Request",
    description: "Enterprise Group - Premium Villa booking for $18,900",
    requestedBy: "Michael Chen",
    date: "2026-02-26",
    priority: "high",
    amount: "$18,900",
    property: "Premium Villa",
    checkIn: "2026-03-01",
    duration: "7 days",
  },
  {
    id: 2,
    type: "client_invitation",
    title: "Client Invitation Approval",
    description: "New client invitation for david@company.com",
    requestedBy: "Sarah Johnson",
    date: "2026-02-26",
    priority: "medium",
    amount: "$0",
    property: "N/A",
    checkIn: "N/A",
    duration: "N/A",
  },
  {
    id: 3,
    type: "budget_override",
    title: "Budget Override Request",
    description: "Global Tech Corp exceeded budget limit by $2,400",
    requestedBy: "Emily Rodriguez",
    date: "2026-02-25",
    priority: "high",
    amount: "$2,400",
    property: "N/A",
    checkIn: "N/A",
    duration: "N/A",
  },
  {
    id: 4,
    type: "booking_approval",
    title: "Extended Stay Approval",
    description: "TechStart Inc - 45 day stay approval needed",
    requestedBy: "Michael Chen",
    date: "2026-02-25",
    priority: "medium",
    amount: "$0",
    property: "N/A",
    checkIn: "N/A",
    duration: "45 days",
  },
  {
    id: 5,
    type: "budget_override",
    title: "Premium Property Override",
    description: "Luxury penthouse booking outside policy",
    requestedBy: "Sarah Johnson",
    date: "2026-02-24",
    priority: "low",
    amount: "$0",
    property: "Luxury Penthouse",
    checkIn: "N/A",
    duration: "N/A",
  },
];

export function PendingActionsPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">
            Pending Actions
          </h1>
          <p className="text-[#666666]">Review and approve pending booking requests</p>
        </div>
        <div className="px-5 py-2.5 bg-[#27F5E8]/20 text-[#27F5E8] rounded-xl border border-[#27F5E8]/30 font-medium">
          {pendingActions.length} Pending
        </div>
      </div>

      {/* Pending Actions List */}
      <div className="space-y-4">
        {pendingActions.map((action) => (
          <div key={action.id} className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                    action.priority === "high"
                      ? "bg-[#B3261E]/20 border-[#B3261E]/30"
                      : action.priority === "medium"
                      ? "bg-[#27F5E8]/20 border-[#27F5E8]/30"
                      : "bg-[#0E5E4F]/20 border-[#0E5E4F]/30"
                  }`}
                >
                  {action.priority === "high" ? (
                    <AlertCircle className="w-6 h-6 text-[#B3261E]" />
                  ) : (
                    <Clock className="w-6 h-6 text-[#27F5E8]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg text-[#0D0D0D] font-['Playfair_Display']">
                      {action.title}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs ${
                        action.priority === "high"
                          ? "bg-[#B3261E]/20 text-[#B3261E]"
                          : action.priority === "medium"
                          ? "bg-[#27F5E8]/20 text-[#27F5E8]"
                          : "bg-[#0E5E4F]/20 text-[#0E5E4F]"
                      }`}
                    >
                      {action.priority} priority
                    </span>
                  </div>
                  <p className="text-[#666666] mb-3">{action.description}</p>
                  <div className="flex items-center gap-4 text-sm text-[#999999]">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      {action.requestedBy}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {action.date}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Details */}
            <div className="bg-white rounded-xl p-4 mb-4 border border-black/10">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#666666] mb-1">Booking Amount</p>
                  <p className="text-[#0D0D0D] font-medium">{action.amount}</p>
                </div>
                <div>
                  <p className="text-[#666666] mb-1">Property</p>
                  <p className="text-[#0D0D0D] font-medium">{action.property}</p>
                </div>
                <div>
                  <p className="text-[#666666] mb-1">Check-in</p>
                  <p className="text-[#0D0D0D] font-medium">{action.checkIn}</p>
                </div>
                <div>
                  <p className="text-[#666666] mb-1">Duration</p>
                  <p className="text-[#0D0D0D] font-medium">{action.duration}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="flex-1 px-5 py-2.5 bg-[#0E5E4F] text-white rounded-xl hover:bg-[#0E5E4F]/90 transition-all flex items-center justify-center gap-2 font-medium shadow-sm">
                <CheckCircle className="w-5 h-5" />
                Approve
              </button>
              <button className="flex-1 px-5 py-2.5 border border-[#B3261E] text-[#B3261E] rounded-xl hover:bg-[#B3261E]/10 transition-all flex items-center justify-center gap-2 font-medium">
                <XCircle className="w-5 h-5" />
                Reject
              </button>
              <button className="px-5 py-2.5 border border-black/10 text-[#666666] rounded-xl hover:border-[#27F5E8]/40 hover:text-[#0D0D0D] transition-all flex items-center justify-center gap-2 font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}