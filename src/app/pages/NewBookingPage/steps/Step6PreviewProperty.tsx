import { Home, MapPin } from "lucide-react";
import { motion } from "motion/react";

interface Step6Props {
  listingData: any;
  coverImage: File | null;
  coverImageUrl?: string;
  monthlyPrice: number;
}

export function Step6PreviewProperty({
  listingData,
  coverImage,
  coverImageUrl,
  monthlyPrice,
}: Step6Props) {
  const perNightPrice = monthlyPrice / 30;
  const coverPreview = coverImageUrl || (coverImage ? URL.createObjectURL(coverImage) : "");

  return (
    <div>
      <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display'] mb-6">Preview Your Property</h2>
      <p className="text-[#666666] mb-8">Here's how your property will appear to potential guests</p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md mx-auto"
      >
        <div className="bg-white rounded-2xl border border-black/10 overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          {/* Cover Image */}
          <div className="relative w-full h-48 bg-gradient-to-br from-[#00CFC5]/10 to-[#00CFC5]/5 flex items-center justify-center overflow-hidden">
            {coverPreview ? (
              <motion.img
                src={coverPreview}
                alt="Property"
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-[#00CFC5]/50">
                <Home className="w-16 h-16" />
                <span className="text-sm font-medium">No image</span>
              </div>
            )}
          </div>

          {/* Property Info */}
          <div className="p-4 space-y-3">
            {/* Name and Badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-[#0D0D0D] truncate">
                  {listingData.placeName || "Property Name"}
                </h3>
              </div>
              <span className="flex-shrink-0 px-2.5 py-1 text-xs font-medium bg-[#00CFC5]/10 text-[#00CFC5] rounded-full whitespace-nowrap">
                Available
              </span>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2 text-[#666666]">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="text-sm truncate">
                {listingData.city && listingData.state
                  ? `${listingData.city}, ${listingData.state}`
                  : "Location TBD"}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1 pt-2 border-t border-black/5">
              <span className="text-2xl font-bold text-[#00CFC5]">${perNightPrice.toFixed(0)}</span>
              <span className="text-[#666666] text-sm">/night</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 p-6 bg-gradient-to-r from-[#00CFC5]/10 to-[#00CFC5]/5 rounded-xl border border-[#00CFC5]/20">
        <h3 className="text-lg font-medium text-[#0D0D0D] mb-3">Ready to Publish?</h3>
        <p className="text-[#666666] mb-4">
          Once you publish your property, it will be visible to potential guests. You can edit the listing details anytime in your property management dashboard.
        </p>
        <ul className="space-y-2 text-sm text-[#666666]">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00CFC5]" />
            Property details are complete
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00CFC5]" />
            Pricing and availability are set
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00CFC5]" />
            Ready for guest inquiries
          </li>
        </ul>
      </div>
    </div>
  );
}
