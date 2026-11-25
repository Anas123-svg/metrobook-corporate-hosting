import { Download, Calendar } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const monthlyData = [
  { month: "Jan", nights: 420, amount: 28400, avgRate: 67.6 },
  { month: "Feb", nights: 485, amount: 32800, avgRate: 67.6 },
  { month: "Mar", nights: 520, amount: 38200, avgRate: 73.5 },
  { month: "Apr", nights: 450, amount: 33100, avgRate: 73.6 },
  { month: "May", nights: 610, amount: 42800, avgRate: 70.2 },
  { month: "Jun", nights: 680, amount: 48600, avgRate: 71.5 },
];

const clientSpendData = [
  { name: "Global Tech Corp", value: 186400, color: "#00CFC5" },
  { name: "Enterprise Group", value: 248000, color: "#0E5E4F" },
  { name: "Innovate Solutions", value: 142800, color: "#E5E5E5" },
  { name: "TechStart Inc", value: 95200, color: "#B3261E" },
];

export function ReportingPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">Reporting</h1>
          <p className="text-[#666666]">Analytics and insights for corporate bookings</p>
        </div>
        <button className="px-6 py-3 border border-[#00CFC5] text-[#00CFC5] rounded-xl hover:bg-[#00CFC5]/10 transition-all flex items-center gap-2 font-medium">
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 mb-8 shadow-sm">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-[#666666]" />
          <input
            type="date"
            className="px-4 py-2 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
            defaultValue="2026-01-01"
          />
          <span className="text-[#666666]">to</span>
          <input
            type="date"
            className="px-4 py-2 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
            defaultValue="2026-06-30"
          />
          <button className="px-6 py-2 bg-[#00CFC5] text-white rounded-xl hover:bg-[#00CFC5]/90 transition-all ml-auto font-medium shadow-sm">
            Apply Filter
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
          <p className="text-[#666666] text-sm mb-2">Total Nights Booked</p>
          <p className="text-4xl text-[#0D0D0D] font-['Playfair_Display']">3,165</p>
          <p className="text-[#0E5E4F] text-sm mt-2">+18.2% from last period</p>
        </div>
        <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
          <p className="text-[#666666] text-sm mb-2">Total Amount Spent</p>
          <p className="text-4xl text-[#0D0D0D] font-['Playfair_Display']">$223,900</p>
          <p className="text-[#0E5E4F] text-sm mt-2">+22.5% from last period</p>
        </div>
        <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
          <p className="text-[#666666] text-sm mb-2">Average Daily Rate</p>
          <p className="text-4xl text-[#0D0D0D] font-['Playfair_Display']">$70.76</p>
          <p className="text-[#00CFC5] text-sm mt-2">+3.6% from last period</p>
        </div>
        <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
          <p className="text-[#666666] text-sm mb-2">Active Clients</p>
          <p className="text-4xl text-[#0D0D0D] font-['Playfair_Display']">24</p>
          <p className="text-[#0E5E4F] text-sm mt-2">+4 new this period</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Total Nights Chart */}
        <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
          <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display'] mb-6">
            Total Nights Booked
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
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
              <Bar dataKey="nights" fill="#00CFC5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Total Amount Spent Chart */}
        <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
          <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display'] mb-6">
            Total Amount Spent
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="amountGradient" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="amount"
                stroke="#0E5E4F"
                strokeWidth={2}
                fill="url(#amountGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Client Spending Distribution */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
          <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display'] mb-6">
            Average Daily Rate Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00CFC5" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#00CFC5" stopOpacity={0} />
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
                dataKey="avgRate"
                stroke="#00CFC5"
                strokeWidth={2}
                fill="url(#rateGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
          <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display'] mb-6">Top Clients</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={clientSpendData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {clientSpendData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  borderRadius: "12px",
                  color: "#0D0D0D",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {clientSpendData.map((client, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: client.color }}
                  />
                  <span className="text-[#0D0D0D]/80">{client.name}</span>
                </div>
                <span className="text-[#666666]">${(client.value / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}