import { Loader2, Upload, X } from "lucide-react";
import { motion } from "motion/react";

interface Step5Props {
  listingData: any;
  setListingData: (value: any) => void;
  coverImage: File | null;
  setCoverImage: (value: File | null) => void;
  placeImages: File[];
  setPlaceImages: (value: File[]) => void;
  monthlyPrice: number;
  setMonthlyPrice: (value: number) => void;
  isUploadingCover: boolean;
  isUploadingPlaceImages: boolean;
  uploadError: string | null;
  handleCoverImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveCoverImage: () => void;
  handlePlaceImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePlaceImage: (index: number) => void;
}

export function Step5MediaPricing({
  listingData,
  setListingData,
  coverImage,
  setCoverImage,
  placeImages,
  setPlaceImages,
  monthlyPrice,
  setMonthlyPrice,
  isUploadingCover,
  isUploadingPlaceImages,
  uploadError,
  handleCoverImageChange,
  handleRemoveCoverImage,
  handlePlaceImagesChange,
  removePlaceImage,
}: Step5Props) {
  const perNightPrice = monthlyPrice / 30;

  const coverImagePreview = listingData.coverImageUrl || (coverImage ? URL.createObjectURL(coverImage) : "");
  const additionalPhotoCount = Array.isArray(listingData.imageUrls) ? listingData.imageUrls.length : placeImages.length;
  const additionalPhotoPreviews: string[] =
    Array.isArray(listingData.imageUrls) && listingData.imageUrls.length > 0
      ? listingData.imageUrls
      : placeImages.map((img) => URL.createObjectURL(img));

  return (
    <div>
      <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display'] mb-6">Media & Pricing</h2>

      {/* Description */}
      <div className="mb-8">
        <label className="block text-sm text-[#666666] mb-2">Property Description</label>
        <textarea
          value={listingData.placeDescription}
          onChange={(e) => setListingData({ ...listingData, placeDescription: e.target.value })}
          className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40 resize-none"
          rows={5}
          placeholder="Describe your property... Include unique features, nearby attractions, etc."
        />
      </div>

      {/* Cover Image */}
      <div className="mb-8">
        <label className="block text-sm text-[#666666] mb-3 font-medium">Cover Image</label>
        {coverImagePreview ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-xl overflow-hidden border border-black/10 h-48"
          >
            <img
              src={coverImagePreview}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveCoverImage}
              className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {isUploadingCover && (
              <div className="absolute inset-0 bg-black/35 flex items-center justify-center gap-2 text-white font-medium">
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading cover...
              </div>
            )}
          </motion.div>
        ) : (
          <label className="block relative border-2 border-dashed border-black/10 rounded-xl p-8 hover:border-[#00CFC5]/40 transition-colors cursor-pointer group">
            <input type="file" accept="image/*" onChange={handleCoverImageChange} className="hidden" />
            <div className="flex flex-col items-center justify-center gap-3 py-6">
              <Upload className="w-12 h-12 text-[#00CFC5]/50 group-hover:text-[#00CFC5] transition-colors" />
              <div className="text-center">
                <p className="text-[#0D0D0D] font-medium">Click to upload cover image</p>
                <p className="text-[#999999] text-sm">or drag and drop</p>
              </div>
            </div>
          </label>
        )}
      </div>

      {/* Additional Images */}
      <div className="mb-8">
        <label className="block text-sm text-[#666666] mb-3 font-medium">Additional Photos ({additionalPhotoCount}/10)</label>
        <label className="block relative border-2 border-dashed border-black/10 rounded-xl p-8 hover:border-[#00CFC5]/40 transition-colors cursor-pointer group mb-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePlaceImagesChange}
            className="hidden"
            disabled={additionalPhotoCount >= 10}
          />
          <div className="flex flex-col items-center justify-center gap-3 py-4">
            <Upload className="w-10 h-10 text-[#00CFC5]/50 group-hover:text-[#00CFC5] transition-colors" />
            <div className="text-center">
              <p className="text-[#0D0D0D] font-medium">Add more photos</p>
              <p className="text-[#999999] text-sm">Up to 10 photos total, uploaded to Cloudinary</p>
            </div>
          </div>
        </label>

        {isUploadingPlaceImages && (
          <div className="mb-4 flex items-center gap-2 text-sm text-[#666666]">
            <Loader2 className="w-4 h-4 animate-spin text-[#00CFC5]" />
            Uploading photos...
          </div>
        )}

        {additionalPhotoPreviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {additionalPhotoPreviews.map((imageUrl: string, idx: number) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative rounded-lg overflow-hidden border border-black/10 h-24"
              >
                <img
                  src={imageUrl}
                  alt={`Place ${idx}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePlaceImage(idx)}
                  className="absolute inset-0 bg-black/0 hover:bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-all group"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {uploadError && (
          <p className="mt-3 text-sm text-[#E74C3C]">{uploadError}</p>
        )}
      </div>

      {/* Pricing */}
      <div className="mb-8">
        <h3 className="text-lg text-[#0D0D0D] font-medium mb-4">Pricing</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-[#666666] mb-2">Monthly Price</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0D0D0D] font-medium">$</span>
              <input
                type="number"
                min="0"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#666666] mb-2">Price Per Night (Calculated)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0D0D0D] font-medium">$</span>
              <input
                type="text"
                value={perNightPrice.toFixed(2)}
                readOnly
                disabled
                className="w-full pl-8 pr-4 py-3 bg-[#F8F8F8] border border-black/10 rounded-xl text-[#0D0D0D] cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-lg text-[#0D0D0D] font-medium mb-4">Availability</h3>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white border border-black/10 rounded-xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() =>
                setListingData({
                  ...listingData,
                  availabilityType: "always",
                  availabilityStartDate: "",
                  availabilityEndDate: "",
                })
              }
              className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                listingData.availabilityType === "always"
                  ? "bg-[#00CFC5]/15 border-[#00CFC5]/40 text-[#00CFC5]"
                  : "bg-white border-black/10 text-[#666666] hover:border-[#00CFC5]/30"
              }`}
            >
              Always
            </button>
            <button
              type="button"
              onClick={() =>
                setListingData({
                  ...listingData,
                  availabilityType: "one-time",
                })
              }
              className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                listingData.availabilityType === "one-time"
                  ? "bg-[#00CFC5]/15 border-[#00CFC5]/40 text-[#00CFC5]"
                  : "bg-white border-black/10 text-[#666666] hover:border-[#00CFC5]/30"
              }`}
            >
              One Time
            </button>
          </div>

          {listingData.availabilityType === "always" ? (
            <div className="p-4 bg-[#F8F8F8] rounded-xl text-sm text-[#666666]">
              This property will be available all the time.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#666666] mb-2">Start Date</label>
                <input
                  type="date"
                  value={listingData.availabilityStartDate}
                  onChange={(e) =>
                    setListingData({
                      ...listingData,
                      availabilityStartDate: e.target.value,
                      availabilityEndDate:
                        listingData.availabilityEndDate && listingData.availabilityEndDate < e.target.value
                          ? e.target.value
                          : listingData.availabilityEndDate,
                    })
                  }
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
                />
              </div>
              <div>
                <label className="block text-sm text-[#666666] mb-2">End Date</label>
                <input
                  type="date"
                  value={listingData.availabilityEndDate}
                  min={listingData.availabilityStartDate || undefined}
                  onChange={(e) =>
                    setListingData({
                      ...listingData,
                      availabilityEndDate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
