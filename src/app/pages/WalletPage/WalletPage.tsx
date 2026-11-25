import { useMemo, useState } from "react";
import {
	Wallet,
	ArrowDownToLine,
	ArrowRightLeft,
	Receipt,
	Gift,
	Landmark,
	ShieldCheck,
	Trophy,
	PlusCircle,
} from "lucide-react";
import { motion } from "motion/react";

type PointTier = "Basic" | "Stellar" | "Platinum";

type RewardRule = {
	tier: PointTier;
	value: string;
	note: string;
};

const cashbackRules: RewardRule[] = [
	{
		tier: "Basic",
		value: "1 point = 1% of booking amount",
		note: "For referrals and email invites",
	},
	{
		tier: "Stellar",
		value: "1 point = 5% of booking amount",
		note: "For corporate clients when a listing is booked",
	},
	{
		tier: "Platinum",
		value: "1 point = 10% of booking amount",
		note: "For sweepstakes rewards or extra booking time",
	},
];

const referralRules: RewardRule[] = [
	{
		tier: "Basic",
		value: "1 point = $100",
		note: "For referrals and email invites",
	},
	{
		tier: "Stellar",
		value: "1 point = $500",
		note: "When a referral books or lists",
	},
	{
		tier: "Platinum",
		value: "1 point = $1,500",
		note: "When multiple referrals sign up, book, or list",
	},
];

const pointBalances = {
	basic: 120,
	stellar: 34,
	platinum: 8,
};

const rewardActivity = [
	{ id: 1, type: "Cashback", detail: "Enterprise Group booking", points: "+6 Stellar", amount: "+$3,000", date: "2026-02-26" },
	{ id: 2, type: "Referral", detail: "Invite accepted and booked", points: "+2 Basic", amount: "+$200", date: "2026-02-23" },
	{ id: 3, type: "Withdrawal", detail: "Bank transfer - **** 4432", points: "-", amount: "-$1,500", date: "2026-02-20" },
];

const tierBadgeClass: Record<PointTier, string> = {
	Basic: "bg-white text-[#666666] border border-black/10",
	Stellar: "bg-[#0E5E4F]/10 text-[#0E5E4F] border border-[#0E5E4F]/30",
	Platinum: "bg-[#00CFC5]/15 text-[#00CFC5] border border-[#00CFC5]/40",
};

export function WalletPage() {
	const [allocationTier, setAllocationTier] = useState<PointTier>("Basic");
	const [allocationPoints, setAllocationPoints] = useState(1);
	const [allocationReason, setAllocationReason] = useState("");

	const availableBalance = useMemo(
		() => pointBalances.basic * 100 + pointBalances.stellar * 500 + pointBalances.platinum * 1500,
		[]
	);

	const allocationPreview = useMemo(() => {
		if (allocationTier === "Basic") return allocationPoints * 100;
		if (allocationTier === "Stellar") return allocationPoints * 500;
		return allocationPoints * 1500;
	}, [allocationTier, allocationPoints]);

	return (
		<div className="min-h-screen bg-white p-8">
			<div className="mb-8 flex items-start justify-between gap-4">
				<div>
					<h1 className="text-4xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">Wallet</h1>
					<p className="text-[#666666]">Manage rewards, referral points, and balance operations</p>
				</div>
				<div className="bg-[#F8F8F8] border border-black/10 rounded-xl px-4 py-3 flex items-center gap-3">
					<Wallet className="w-5 h-5 text-[#00CFC5]" />
					<div>
						<p className="text-xs text-[#666666]">Available Balance</p>
						<p className="text-xl text-[#0D0D0D] font-['Playfair_Display']">${availableBalance.toLocaleString()}</p>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-4 gap-5 mb-8">
				<div className="bg-[#F8F8F8] rounded-2xl p-5 border border-black/5 shadow-sm">
					<p className="text-[#666666] text-sm mb-1">Basic Points</p>
					<p className="text-2xl text-[#0D0D0D] font-['Playfair_Display']">{pointBalances.basic}</p>
					<p className="text-xs text-[#666666] mt-1">Balance: ${(pointBalances.basic * 100).toLocaleString()}</p>
				</div>
				<div className="bg-[#F8F8F8] rounded-2xl p-5 border border-black/5 shadow-sm">
					<p className="text-[#666666] text-sm mb-1">Stellar Points</p>
					<p className="text-2xl text-[#0E5E4F] font-['Playfair_Display']">{pointBalances.stellar}</p>
					<p className="text-xs text-[#666666] mt-1">Balance: ${(pointBalances.stellar * 500).toLocaleString()}</p>
				</div>
				<div className="bg-[#F8F8F8] rounded-2xl p-5 border border-black/5 shadow-sm">
					<p className="text-[#666666] text-sm mb-1">Platinum Points</p>
					<p className="text-2xl text-[#00CFC5] font-['Playfair_Display']">{pointBalances.platinum}</p>
					<p className="text-xs text-[#666666] mt-1">Balance: ${(pointBalances.platinum * 1500).toLocaleString()}</p>
				</div>
				<div className="bg-[#0D0D0D] rounded-2xl p-5 border border-[#00CFC5]/30 shadow-sm">
					<p className="text-white/70 text-sm mb-1">Withdrawable</p>
					<p className="text-2xl text-[#00CFC5] font-['Playfair_Display']">$12,500</p>
					<p className="text-xs text-white/60 mt-1">After pending clearance</p>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-4 mb-8">
				{[
					{ label: "Withdraw to Bank", icon: ArrowDownToLine },
					// { label: "Transfer Balance", icon: ArrowRightLeft },
					// { label: "Redeem for Booking", icon: Gift },
					{ label: "Add Bank Account", icon: Landmark },
					{ label: "Download Statement", icon: Receipt },
					// { label: "Security & Limits", icon: ShieldCheck },
				].map((action, i) => (
					<motion.button
						key={action.label}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.2, delay: i * 0.04 }}
						className="bg-[#F8F8F8] border border-black/10 rounded-xl px-4 py-3 flex items-center gap-3 text-left hover:border-[#00CFC5]/40 transition-colors"
					>
						<action.icon className="w-4 h-4 text-[#00CFC5] flex-shrink-0" />
						<span className="text-sm text-[#0D0D0D] font-medium">{action.label}</span>
					</motion.button>
				))}
			</div>

			<div className="grid grid-cols-2 gap-6 mb-8">
				<div className="bg-[#F8F8F8] rounded-2xl border border-black/5 shadow-sm overflow-hidden">
					<div className="px-6 py-5 border-b border-black/8 flex items-center gap-2.5">
						<Trophy className="w-5 h-5 text-[#00CFC5]" />
						<h2 className="text-xl text-[#0D0D0D] font-['Playfair_Display']">Cash Back Rewards</h2>
					</div>
					<div className="p-4 space-y-3">
						{cashbackRules.map((rule) => (
							<div key={rule.tier} className="bg-white rounded-xl p-4 border border-black/8">
								<div className="flex items-center justify-between gap-3 mb-2">
									<span className={`px-2.5 py-1 rounded-full text-xs font-medium ${tierBadgeClass[rule.tier]}`}>{rule.tier} Point</span>
									<span className="text-sm text-[#0D0D0D] font-semibold">{rule.value}</span>
								</div>
								<p className="text-sm text-[#666666]">{rule.note}</p>
							</div>
						))}
					</div>
				</div>

				<div className="bg-[#F8F8F8] rounded-2xl border border-black/5 shadow-sm overflow-hidden">
					<div className="px-6 py-5 border-b border-black/8 flex items-center gap-2.5">
						<Gift className="w-5 h-5 text-[#00CFC5]" />
						<h2 className="text-xl text-[#0D0D0D] font-['Playfair_Display']">Referral Rewards</h2>
					</div>
					<div className="p-4 space-y-3">
						{referralRules.map((rule) => (
							<div key={rule.tier} className="bg-white rounded-xl p-4 border border-black/8">
								<div className="flex items-center justify-between gap-3 mb-2">
									<span className={`px-2.5 py-1 rounded-full text-xs font-medium ${tierBadgeClass[rule.tier]}`}>{rule.tier} Point</span>
									<span className="text-sm text-[#0D0D0D] font-semibold">{rule.value}</span>
								</div>
								<p className="text-sm text-[#666666]">{rule.note}</p>
							</div>
						))}
					</div>
				</div>
			</div>

			<div>
				<div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
					<h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display'] mb-4">Recent Wallet Activity</h2>
					<div className="space-y-3">
						{rewardActivity.map((row) => (
							<div key={row.id} className="bg-white rounded-xl border border-black/8 px-4 py-3 flex items-center justify-between gap-4">
								<div className="min-w-0">
									<p className="text-sm text-[#0D0D0D] font-medium truncate">{row.type} • {row.detail}</p>
									<p className="text-xs text-[#666666] mt-1">{row.date}</p>
								</div>
								<div className="text-right flex-shrink-0">
									<p className="text-sm text-[#0D0D0D] font-medium">{row.points}</p>
									<p className="text-sm text-[#00CFC5] font-semibold">{row.amount}</p>
								</div>
							</div>
						))}
					</div>
				</div>
				{/* <div className="col-span-2 bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 shadow-sm">
					<div className="flex items-center gap-2.5 mb-4">
						<PlusCircle className="w-5 h-5 text-[#00CFC5]" />
						<h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display']">Admin Point Allocation</h2>
					</div>
					<p className="text-sm text-[#666666] mb-4">Allocate bonus points manually for special campaigns, sweepstakes, and partner incentives.</p>

					<div className="space-y-3">
						<div>
							<label className="block text-sm text-[#666666] mb-1.5">Point Tier</label>
							<select
								value={allocationTier}
								onChange={(e) => setAllocationTier(e.target.value as PointTier)}
								className="w-full px-3 py-2.5 bg-white border border-black/10 rounded-xl text-sm text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
							>
								<option value="Basic">Basic</option>
								<option value="Stellar">Stellar</option>
								<option value="Platinum">Platinum</option>
							</select>
						</div>

						<div>
							<label className="block text-sm text-[#666666] mb-1.5">Number of Points</label>
							<input
								type="number"
								min={1}
								value={allocationPoints}
								onChange={(e) => setAllocationPoints(Math.max(1, Number(e.target.value) || 1))}
								className="w-full px-3 py-2.5 bg-white border border-black/10 rounded-xl text-sm text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
							/>
						</div>

						<div>
							<label className="block text-sm text-[#666666] mb-1.5">Reason</label>
							<textarea
								rows={3}
								value={allocationReason}
								onChange={(e) => setAllocationReason(e.target.value)}
								placeholder="e.g., Q1 campaign reward"
								className="w-full px-3 py-2.5 bg-white border border-black/10 rounded-xl text-sm text-[#0D0D0D] placeholder:text-[#BBBBBB] focus:outline-none focus:border-[#00CFC5]/40 resize-none"
							/>
						</div>
					</div>

					<div className="mt-4 p-3 bg-white border border-[#00CFC5]/25 rounded-xl">
						<p className="text-xs text-[#666666]">Allocation Value Preview</p>
						<p className="text-xl text-[#00CFC5] font-['Playfair_Display']">${allocationPreview.toLocaleString()}</p>
					</div>

					<button className="w-full mt-4 px-4 py-3 rounded-xl bg-[#00CFC5] text-white text-sm font-medium hover:bg-[#0E5E4F] transition-colors">
						Allocate Points
					</button>
				</div> */}

			</div>
		</div>
	);
}
