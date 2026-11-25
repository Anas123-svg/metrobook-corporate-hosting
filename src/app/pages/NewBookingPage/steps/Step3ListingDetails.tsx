import { Minus, Plus } from "lucide-react";

type ListingCountField = "guests" | "bedrooms" | "beds" | "bathrooms" | "kitchen";

interface Step3Props {
  listingData: any;
  setListingData: (value: any) => void;
  adjustListingCount: (field: ListingCountField, delta: number) => void;
}

export function Step3ListingDetails({
  listingData,
  setListingData,
  adjustListingCount,
}: Step3Props) {
  const capacityFields: Array<{ label: string; key: ListingCountField; icon: string }> = [
    { label: "Guests", key: "guests", icon: "👥" },
    { label: "Bedrooms", key: "bedrooms", icon: "🛏️" },
    { label: "Beds", key: "beds", icon: "🛌" },
    { label: "Bathrooms", key: "bathrooms", icon: "🚿" },
    { label: "Kitchen", key: "kitchen", icon: "🍳" },
  ];

  return (
    <div>
      <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display'] mb-6">Listing Details</h2>

      <div className="mb-8">
        <label className="block text-sm text-[#666666] mb-4">Property Area (m²)</label>
        <input
          type="number"
          min="0"
          step="1"
          value={listingData.areaM2}
          onChange={(e) => setListingData({ ...listingData, areaM2: e.target.value })}
          className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
          placeholder="Enter property area"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {capacityFields.map(({ label, key, icon }) => (
          <div key={key} className="p-6 bg-white border border-black/10 rounded-xl hover:border-[#00CFC5]/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{icon}</span>
                <label className="text-[#0D0D0D] font-medium">{label}</label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => adjustListingCount(key, -1)}
                className="w-10 h-10 rounded-lg bg-[#F8F8F8] hover:bg-[#00CFC5]/10 text-[#0D0D0D] hover:text-[#00CFC5] transition-all flex items-center justify-center"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-3xl font-bold text-[#00CFC5]">
                {(listingData as any)[key] || 0}
              </span>
              <button
                onClick={() => adjustListingCount(key, 1)}
                className="w-10 h-10 rounded-lg bg-[#00CFC5]/10 hover:bg-[#00CFC5]/20 text-[#00CFC5] hover:text-[#00CFC5] transition-all flex items-center justify-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
