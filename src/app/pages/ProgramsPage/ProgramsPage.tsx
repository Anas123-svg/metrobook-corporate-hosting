import { Gift, DollarSign, Users, Award, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

const rewardsData = [
  {
    title: "Total Credits Earned",
    value: "$8,420",
    icon: DollarSign,
    color: "#00CFC5",
  },
  {
    title: "Credits Used",
    value: "$3,200",
    icon: Award,
    color: "#0E5E4F",
  },
  {
    title: "Available Balance",
    value: "$5,220",
    icon: Gift,
    color: "#E5E5E5",
  },
  {
    title: "Referrals Made",
    value: "12",
    icon: Users,
    color: "#00CFC5",
  },
];

const rewardsHistory = [
  {
    id: 1,
    type: "earned",
    description: "Cashback from Enterprise Group booking",
    amount: "+$248",
    date: "2026-02-25",
  },
  {
    id: 2,
    type: "used",
    description: "Applied credits to INV-2403",
    amount: "-$560",
    date: "2026-02-20",
  },
  {
    id: 3,
    type: "earned",
    description: "Referral bonus - TechStart Inc",
    amount: "+$500",
    date: "2026-02-15",
  },
  {
    id: 4,
    type: "earned",
    description: "Cashback from Global Tech Corp booking",
    amount: "+$186",
    date: "2026-02-12",
  },
];

export function ProgramsPage() {
  const progress = 65;

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">
          Loyalty & Rewards
        </h1>
        <p className="text-[#666666]">Track rewards, cashback, and referral bonuses</p>
      </div>

      {/* Program Cards */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Cashback Program */}
        <div className="bg-[#F8F8F8] rounded-2xl p-8 border border-black/5 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="w-14 h-14 rounded-xl bg-[#00CFC5]/20 flex items-center justify-center mb-4 border border-[#00CFC5]/30">
                <DollarSign className="w-7 h-7 text-[#00CFC5]" />
              </div>
              <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">
                Cashback Program
              </h2>
              <p className="text-[#666666] text-sm">
                Earn 2% cashback on all corporate bookings
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#00CFC5]/20">
            <p className="text-[#666666] text-xs mb-1">This Month</p>
            <p className="text-2xl text-[#00CFC5] font-['Playfair_Display']">$434</p>
            <p className="text-[#666666] text-xs mt-2">Total Earned: $2,847</p>
          </div>
        </div>

        {/* Referral Program */}
        <div className="bg-[#F8F8F8] rounded-2xl p-8 border border-black/5 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="w-14 h-14 rounded-xl bg-[#00CFC5]/20 flex items-center justify-center mb-4 border border-[#00CFC5]/30">
                <Users className="w-7 h-7 text-[#00CFC5]" />
              </div>
              <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">
                Referral Program
              </h2>
              <p className="text-[#666666] text-sm">
                Earn $500 for every successful referral
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#00CFC5]/20">
            <p className="text-[#666666] text-xs mb-1">Total Earned</p>
            <p className="text-2xl text-[#00CFC5] font-['Playfair_Display']">$6,000</p>
            <p className="text-[#666666] text-xs mt-2">12 Successful Referrals</p>
          </div>
        </div>
      </div>

      {/* Loyalty Progress */}
      <div className="bg-[#F8F8F8] rounded-2xl p-8 border border-black/5 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">
              Loyalty Status
            </h2>
            <p className="text-[#666666]">Gold Member - {progress}% to Platinum</p>
          </div>
          <Award className="w-12 h-12 text-[#00CFC5]" />
        </div>
        <div className="w-full h-4 bg-white rounded-full overflow-hidden border border-black/10">
          <div
            className="h-full bg-gradient-to-r from-[#00CFC5] to-[#0E5E4F] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-black/10">
            <p className="text-[#666666] text-sm mb-1">Current Tier</p>
            <p className="text-lg text-[#00CFC5] font-['Playfair_Display']">Gold</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-black/10">
            <p className="text-[#666666] text-sm mb-1">Bookings This Year</p>
            <p className="text-lg text-[#0D0D0D] font-['Playfair_Display']">42</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-black/10">
            <p className="text-[#666666] text-sm mb-1">Total Spent</p>
            <p className="text-lg text-[#0D0D0D] font-['Playfair_Display']">$186,400</p>
          </div>
        </div>
      </div>

    </div>
  );
}