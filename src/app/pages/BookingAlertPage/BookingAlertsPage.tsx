import { Bell, DollarSign, MapPin, Building2, Plus } from "lucide-react";
import { useState } from "react";

const alertRules = [
  {
    id: 1,
    name: "Budget Threshold Alert",
    type: "budget",
    condition: "When booking exceeds $10,000",
    active: true,
  },
  {
    id: 2,
    name: "Premium Property Alert",
    type: "property",
    condition: "When booking luxury properties",
    active: true,
  },
  {
    id: 3,
    name: "Location Restriction",
    type: "location",
    condition: "Alert for bookings outside approved locations",
    active: false,
  },
  {
    id: 4,
    name: "Extended Stay Alert",
    type: "duration",
    condition: "When booking exceeds 30 days",
    active: true,
  },
];

const recentAlerts = [
  {
    id: 1,
    title: "Budget threshold exceeded",
    description: "Enterprise Group booking exceeded $10,000 limit",
    time: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    title: "Premium property booking",
    description: "Global Tech Corp booked a luxury penthouse",
    time: "5 hours ago",
    status: "approved",
  },
  {
    id: 3,
    title: "Extended stay requested",
    description: "TechStart Inc requested 45-day stay",
    time: "1 day ago",
    status: "pending",
  },
];

export function BookingAlertsPage() {
  const [rules, setRules] = useState(alertRules);

  const toggleRule = (id: number) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, active: !rule.active } : rule
    ));
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">Booking Alerts</h1>
          <p className="text-[#666666]">Configure rules and manage booking notifications</p>
        </div>
        <button className="px-6 py-3 bg-[#27F5E8] text-white rounded-xl hover:bg-[#27F5E8]/90 transition-all flex items-center gap-2 shadow-sm font-medium">
          <Plus className="w-5 h-5" />
          Add Rule
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Alert Rules */}
        <div className="col-span-2 space-y-4">
          <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
            <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display'] mb-6">Alert Rules</h2>
            <div className="space-y-4">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-white rounded-xl p-4 border border-black/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#27F5E8]/10 flex items-center justify-center border border-[#27F5E8]/30">
                      {rule.type === "budget" && <DollarSign className="w-6 h-6 text-[#27F5E8]" />}
                      {rule.type === "property" && <Building2 className="w-6 h-6 text-[#27F5E8]" />}
                      {rule.type === "location" && <MapPin className="w-6 h-6 text-[#27F5E8]" />}
                      {rule.type === "duration" && <Bell className="w-6 h-6 text-[#27F5E8]" />}
                    </div>
                    <div>
                      <h3 className="text-[#0D0D0D] font-medium mb-1">{rule.name}</h3>
                      <p className="text-[#666666] text-sm">{rule.condition}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                      rule.active ? "bg-[#27F5E8]" : "bg-black/10"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        rule.active ? "translate-x-8" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Settings */}
          <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
            <h2 className="text-xl text-[#0D0D0D] font-['Playfair_Display'] mb-6">
              Budget Configuration
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#666666] mb-2">
                  Maximum Booking Amount
                </label>
                <input
                  type="text"
                  defaultValue="$10,000"
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#27F5E8]/40"
                />
              </div>
              <div>
                <label className="block text-sm text-[#666666] mb-2">
                  Approval Required Above
                </label>
                <input
                  type="text"
                  defaultValue="$5,000"
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#27F5E8]/40"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
          <h2 className="text-xl text-[#0D0D0D] font-['Playfair_Display'] mb-6">Recent Alerts</h2>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white rounded-xl p-4 border border-black/10"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Bell className="w-5 h-5 text-[#27F5E8] mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#0D0D0D] text-sm font-medium mb-1">{alert.title}</h3>
                    <p className="text-[#666666] text-xs mb-2">{alert.description}</p>
                    <p className="text-[#999999] text-xs">{alert.time}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    alert.status === "approved"
                      ? "bg-[#0E5E4F]/20 text-[#0E5E4F]"
                      : "bg-[#27F5E8]/20 text-[#27F5E8]"
                  }`}
                >
                  {alert.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}