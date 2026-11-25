import { TrendingUp, TrendingDown, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const summaryData = [
  {
    title: "Total Properties",
    value: "1,247",
    change: "+12.5%",
    trend: "up",
    icon: Calendar,
    color: "#00CFC5",
  },
  {
    title: "Booked Properties",
    value: "342",
    change: "+8.2%",
    trend: "up",
    icon: CheckCircle,
    color: "#0E5E4F",
  },
  {
    title: "Cancelled Bookings",
    value: "28",
    change: "-3.1%",
    trend: "down",
    icon: XCircle,
    color: "#B3261E",
  },
  {
    title: "Available Properties",
    value: "56",
    change: "+5.4%",
    trend: "up",
    icon: Clock,
    color: "#E5E5E5",
  },
];

const chartData = [
  { month: "Jan", bookings: 65, revenue: 12400 },
  { month: "Feb", bookings: 78, revenue: 15200 },
  { month: "Mar", bookings: 92, revenue: 18900 },
  { month: "Apr", bookings: 85, revenue: 16700 },
  { month: "May", bookings: 105, revenue: 21300 },
  { month: "Jun", bookings: 118, revenue: 24800 },
];

const recentBookings = [
  {
    id: "BK-2401",
    client: "John Doe",
    property: "Luxury Penthouse Suite",
    checkIn: "2026-03-01",
    nights: 30,
    amount: "$12,400",
    status: "confirmed",
  },
  {
    id: "BK-2402",
    client: "Josphine Smith",
    property: "Executive Apartment",
    checkIn: "2026-03-05",
    nights: 60,
    amount: "$24,000",
    status: "confirmed",
  },
  {
    id: "BK-2403",
    client: "Caroline Lee",
    property: "Modern Studio",
    checkIn: "2026-03-08",
    nights: 90,
    amount: "$5,600",
    status: "pending",
  },
  {
    id: "BK-2404",
    client: "Michael Brown",
    property: "Premium Villa",
    checkIn: "2026-03-12",
    nights: 120,
    amount: "$18,900",
    status: "confirmed",
  },
];

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">Dashboard</h1>
        <p className="text-[#666666]">Welcome back, manage your corporate Hostings</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {summaryData.map((card, index) => (
          <div
            key={index}
            className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 hover:border-[#27F5E8]/30 transition-all hover:shadow-lg hover:shadow-black/5 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${card.color}20` }}
              >
                <card.icon className="w-6 h-6" style={{ color: card.color }} />
              </div>
              <div className="flex items-center gap-1 text-sm">
                {card.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-[#0E5E4F]" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-[#B3261E]" />
                )}
                <span className={card.trend === "up" ? "text-[#0E5E4F]" : "text-[#B3261E]"}>
                  {card.change}
                </span>
              </div>
            </div>
            <h3 className="text-3xl text-[#0D0D0D] font-['Playfair_Display'] mb-1">{card.value}</h3>
            <p className="text-sm text-[#666666]">{card.title}</p>
            
            {/* Mini trend chart */}
            <div className="mt-4 h-12 -mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={card.color} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={card.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    stroke={card.color}
                    strokeWidth={2}
                    fill={`url(#gradient-${index})`}
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Bookings Chart */}
        <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display'] mb-1">Monthly Bookings</h2>
            <p className="text-sm text-[#666666]">Booking trends over the last 6 months</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" stroke="#666666" />
              <YAxis stroke="#666666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  borderRadius: "12px",
                  color: "#0D0D0D",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Bar dataKey="bookings" fill="#00CFC5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display'] mb-1">Revenue Overview</h2>
            <p className="text-sm text-[#666666]">Revenue growth over time</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0E5E4F" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0E5E4F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#666666" />
              <YAxis stroke="#666666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  borderRadius: "12px",
                  color: "#0D0D0D",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0E5E4F"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display'] mb-1">Recent Bookings</h2>
            <p className="text-sm text-[#666666]">Latest corporate booking activity</p>
          </div>
          <button className="px-6 py-2 bg-[#00CFC5] text-white rounded-xl hover:bg-[#00CFC5]/90 transition-all font-medium shadow-sm">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left text-sm text-[#0E5E4F] pb-4 pr-4 font-medium">Booking ID</th>
                <th className="text-left text-sm text-[#666666] pb-4 pr-4 font-medium">Client</th>
                <th className="text-left text-sm text-[#666666] pb-4 pr-4 font-medium">Property</th>
                <th className="text-left text-sm text-[#666666] pb-4 pr-4 font-medium">Check-in</th>
                <th className="text-left text-sm text-[#666666] pb-4 pr-4 font-medium">Nights</th>
                <th className="text-left text-sm text-[#666666] pb-4 pr-4 font-medium">Amount</th>
                <th className="text-left text-sm text-[#666666] pb-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 pr-4">
                    <span className="text-[#0E5E4F] font-mono text-sm">{booking.id}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-black text-sm">{booking.client}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-black/80 text-sm">{booking.property}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-black/60 text-sm">{booking.checkIn}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-black/60 text-sm">{booking.nights} nights</span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-black font-medium text-sm">{booking.amount}</span>
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        booking.status === "confirmed"
                          ? "bg-[#0E5E4F]/20 text-[#0E5E4F] border border-[#0E5E4F]/30"
                          : "bg-[#00CFC5]/20 text-[#00CFC5] border border-[#00CFC5]/30"
                      }`}
                    >
                      {booking.status}
                    </span>
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