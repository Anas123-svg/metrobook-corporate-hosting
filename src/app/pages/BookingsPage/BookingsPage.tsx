import { Search, Filter, Plus, Eye, Edit, XCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const bookingsData = [
  {
    id: "BK-2401",
    client: "Global Tech Corp",
    property: "Luxury Penthouse Suite",
    checkIn: "2026-03-01",
    checkOut: "2026-03-15",
    status: "confirmed",
    amount: "$12,400",
  },
  {
    id: "BK-2402",
    client: "Innovate Solutions",
    property: "Executive Apartment",
    checkIn: "2026-03-05",
    checkOut: "2026-04-04",
    status: "confirmed",
    amount: "$24,000",
  },
  {
    id: "BK-2403",
    client: "TechStart Inc",
    property: "Modern Studio",
    checkIn: "2026-03-08",
    checkOut: "2026-03-15",
    status: "pending",
    amount: "$5,600",
  },
  {
    id: "BK-2404",
    client: "Enterprise Group",
    property: "Premium Villa",
    checkIn: "2026-03-12",
    checkOut: "2026-04-02",
    status: "confirmed",
    amount: "$18,900",
  },
  {
    id: "BK-2405",
    client: "Digital Ventures",
    property: "Corporate Suite",
    checkIn: "2026-03-20",
    checkOut: "2026-04-10",
    status: "cancelled",
    amount: "$15,000",
  },
  {
    id: "BK-2406",
    client: "Alpha Consulting",
    property: "Luxury Loft",
    checkIn: "2026-04-01",
    checkOut: "2026-04-14",
    status: "confirmed",
    amount: "$9,800",
  },
];

export function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBookings = bookingsData.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.property.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">Booked Properties</h1>
          <p className="text-[#666666]">View Booked Properties</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#666666]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#F8F8F8] rounded-2xl border border-black/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left text-sm text-[#0E5E4F] p-6 font-medium">Booking ID</th>
                <th className="text-left text-sm text-[#666666] p-6 font-medium">Client Name</th>
                <th className="text-left text-sm text-[#666666] p-6 font-medium">Property</th>
                <th className="text-left text-sm text-[#666666] p-6 font-medium">Check-in</th>
                <th className="text-left text-sm text-[#666666] p-6 font-medium">Check-out</th>
                <th className="text-left text-sm text-[#666666] p-6 font-medium">Status</th>
                <th className="text-left text-sm text-[#666666] p-6 font-medium">Amount</th>
                <th className="text-left text-sm text-[#666666] p-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-black/5 hover:bg-white transition-colors"
                >
                  <td className="p-6">
                    <span className="text-[#0E5E4F] font-mono">{booking.id}</span>
                  </td>
                  <td className="p-6">
                    <span className="text-[#0D0D0D]">{booking.client}</span>
                  </td>
                  <td className="p-6">
                    <span className="text-[#0D0D0D]/80">{booking.property}</span>
                  </td>
                  <td className="p-6">
                    <span className="text-[#666666]">{booking.checkIn}</span>
                  </td>
                  <td className="p-6">
                    <span className="text-[#666666]">{booking.checkOut}</span>
                  </td>
                  <td className="p-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        booking.status === "confirmed"
                          ? "bg-[#0E5E4F]/20 text-[#0E5E4F] border border-[#0E5E4F]/30"
                          : booking.status === "pending"
                          ? "bg-[#00CFC5]/20 text-[#00CFC5] border border-[#00CFC5]/30"
                          : "bg-[#B3261E]/20 text-[#B3261E] border border-[#B3261E]/30"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className="text-[#0D0D0D] font-medium">{booking.amount}</span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-black/5 rounded-lg transition-colors text-[#666666] hover:text-[#0D0D0D]">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-black/5 rounded-lg transition-colors text-[#666666] hover:text-[#00CFC5]">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-black/5 rounded-lg transition-colors text-[#666666] hover:text-[#B3261E]">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-black/10 flex items-center justify-between">
          <p className="text-sm text-[#666666]">
            Showing {filteredBookings.length} of {bookingsData.length} bookings
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-black/10 rounded-lg text-[#666666] hover:text-[#0D0D0D] hover:border-[#00CFC5]/40 transition-all">
              Previous
            </button>
            <button className="px-4 py-2 bg-[#00CFC5] text-white rounded-lg font-medium">1</button>
            <button className="px-4 py-2 bg-white border border-black/10 rounded-lg text-[#666666] hover:text-[#0D0D0D] hover:border-[#00CFC5]/40 transition-all">
              2
            </button>
            <button className="px-4 py-2 bg-white border border-black/10 rounded-lg text-[#666666] hover:text-[#0D0D0D] hover:border-[#00CFC5]/40 transition-all">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}