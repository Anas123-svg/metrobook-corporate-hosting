import { MapPin, Navigation } from "lucide-react";
import { motion } from "motion/react";

interface Step2Props {
  listingData: any;
  setListingData: (value: any) => void;
  googleMapRef: React.RefObject<HTMLDivElement | null>;
  mapsLoaded: boolean;
  initializeMap: () => void;
}

export function Step2PropertyDetails({
  listingData,
  setListingData,
  googleMapRef,
  mapsLoaded,
  initializeMap,
}: Step2Props) {
  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setListingData({
          ...listingData,
          latitude,
          longitude,
        });
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display'] mb-6">Property Details</h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm text-[#666666] mb-2">Property Type</label>
          <select
            value={listingData.propertyType}
            onChange={(e) => setListingData({ ...listingData, propertyType: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40 appearance-none cursor-pointer"
          >
            <option value="">Select property type</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Villa">Villa</option>
            <option value="Studio">Studio</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Penthouse">Penthouse</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-[#666666] mb-2">Property Name</label>
          <input
            type="text"
            value={listingData.placeName}
            onChange={(e) => setListingData({ ...listingData, placeName: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
            placeholder="e.g., Seaside Villa with Ocean View"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm text-[#666666] mb-2">City</label>
          <input
            type="text"
            value={listingData.city}
            onChange={(e) => setListingData({ ...listingData, city: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
            placeholder="City"
          />
        </div>
        <div>
          <label className="block text-sm text-[#666666] mb-2">State</label>
          <input
            type="text"
            value={listingData.state}
            onChange={(e) => setListingData({ ...listingData, state: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
            placeholder="State"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm text-[#666666] mb-2">Postal Code</label>
          <input
            type="text"
            value={listingData.postalCode}
            onChange={(e) => setListingData({ ...listingData, postalCode: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
            placeholder="Postal Code"
          />
        </div>
        <div>
          <label className="block text-sm text-[#666666] mb-2">Room # (Optional)</label>
          <input
            type="text"
            value={listingData.roomNumber}
            onChange={(e) => setListingData({ ...listingData, roomNumber: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
            placeholder="Room #"
          />
        </div>
        <div>
          <label className="block text-sm text-[#666666] mb-2">Address</label>
          <input
            type="text"
            value={listingData.street}
            onChange={(e) => setListingData({ ...listingData, street: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
            placeholder="Street address"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm text-[#0D0D0D] font-medium">Location on Map</label>
          <button
            onClick={handleGeolocation}
            className="flex items-center gap-2 px-4 py-2 text-[#00CFC5] hover:text-[#00CFC5]/80 transition-colors text-sm font-medium"
          >
            <Navigation className="w-4 h-4" />
            Use My Location
          </button>
        </div>
        <div
          ref={googleMapRef}
          className="w-full h-96 rounded-xl border border-black/10 overflow-hidden shadow-sm"
        />
        <div className="mt-4 p-3 bg-[#F8F8F8] rounded-xl flex items-start gap-3">
          <MapPin className="w-4 h-4 text-[#00CFC5] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-[#666666]">
            <p className="font-medium text-[#0D0D0D] mb-1">Click on the map to set location</p>
            <p>You can drag the marker to adjust the exact position of your property.</p>
          </div>
        </div>
        {mapsLoaded && (
          <button
            onClick={initializeMap}
            className="mt-4 w-full px-4 py-3 bg-[#00CFC5]/10 hover:bg-[#00CFC5]/20 text-[#00CFC5] rounded-xl font-medium transition-colors"
          >
            Initialize Map
          </button>
        )}
      </motion.div>
    </div>
  );
}
