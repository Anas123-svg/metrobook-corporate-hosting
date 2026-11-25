import { Search, Download, Eye } from "lucide-react";
import { useState } from "react";

const invoicesData = [
  {
    id: "INV-2401",
    client: "Global Tech Corp",
    date: "2026-02-15",
    dueDate: "2026-03-15",
    amount: "$12,400",
    status: "paid",
  },
  {
    id: "INV-2402",
    client: "Innovate Solutions",
    date: "2026-02-18",
    dueDate: "2026-03-18",
    amount: "$24,000",
    status: "paid",
  },
  {
    id: "INV-2403",
    client: "TechStart Inc",
    date: "2026-02-20",
    dueDate: "2026-03-20",
    amount: "$5,600",
    status: "pending",
  },
  {
    id: "INV-2404",
    client: "Enterprise Group",
    date: "2026-02-22",
    dueDate: "2026-03-22",
    amount: "$18,900",
    status: "paid",
  },
  {
    id: "INV-2405",
    client: "Digital Ventures",
    date: "2026-02-25",
    dueDate: "2026-03-25",
    amount: "$15,000",
    status: "overdue",
  },
];

export function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredInvoices = invoicesData.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">Invoices</h1>
        <p className="text-[#666666]">Manage billing and invoices</p>
      </div>

      {/* Filters */}
      <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-[#F8F8F8] rounded-2xl border border-black/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left text-sm text-[#0E5E4F] p-6 font-medium">Invoice Number</th>
                <th className="text-left text-sm text-[#666666] p-6 font-medium">Client</th>
                <th className="text-left text-sm text-[#666666] p-6 font-medium">Date</th>
                <th className="text-left text-sm text-[#666666] p-6 font-medium">Due Date</th>
                <th className="text-left text-sm text-[#666666] p-6 font-medium">Amount</th>
                <th className="text-left text-sm text-[#666666] p-6 font-medium">Status</th>
                <th className="text-left text-sm text-[#666666] p-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-black/5 hover:bg-white transition-colors"
                >
                  <td className="p-6">
                    <span className="text-[#0E5E4F] font-mono">{invoice.id}</span>
                  </td>
                  <td className="p-6">
                    <span className="text-[#0D0D0D]">{invoice.client}</span>
                  </td>
                  <td className="p-6">
                    <span className="text-[#666666]">{invoice.date}</span>
                  </td>
                  <td className="p-6">
                    <span className="text-[#666666]">{invoice.dueDate}</span>
                  </td>
                  <td className="p-6">
                    <span className="text-[#0D0D0D] font-medium">{invoice.amount}</span>
                  </td>
                  <td className="p-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        invoice.status === "paid"
                          ? "bg-[#0E5E4F]/20 text-[#0E5E4F] border border-[#0E5E4F]/30"
                          : invoice.status === "pending"
                          ? "bg-[#00CFC5]/20 text-[#00CFC5] border border-[#00CFC5]/30"
                          : "bg-[#B3261E]/20 text-[#B3261E] border border-[#B3261E]/30"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-black/5 rounded-lg transition-colors text-[#666666] hover:text-[#0D0D0D]">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-black/5 rounded-lg transition-colors text-[#666666] hover:text-[#00CFC5]">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}