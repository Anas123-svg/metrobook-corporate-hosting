import { AlertCircle, Building2, DollarSign, Edit, Home, Loader2, MapPin, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CreateListingRequest, FetchHostListingsFilters, HostListing } from "../../models/listing";
import {
  deleteListingById,
  fetchCurrentHostProfile,
  fetchHostCustomers,
  fetchListingById,
  fetchHostListings,
  updateListingById,
} from "../../services/hostApi";
import { getHostDetails } from "../../services/hostAuthStorage";

type CustomerOption = {
  id: string;
  name: string;
};

type EditPropertyFormData = {
  property_name: string;
  property_type: string;
  city: string;
  state: string;
  postal_code: string;
  room_no: string;
  address: string;
  area: string;
  monthly_price: string;
  is_active: boolean;
};

const toEditFormData = (property: HostListing): EditPropertyFormData => ({
  property_name: property.property_name,
  property_type: property.property_type,
  city: property.city,
  state: property.state,
  postal_code: property.postal_code,
  room_no: property.room_no,
  address: property.address,
  area: String(property.area),
  monthly_price: String(property.monthly_price),
  is_active: property.is_active,
});

export function PropertiesPage() {
  const navigate = useNavigate();
  const [hostId, setHostId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [properties, setProperties] = useState<HostListing[]>([]);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [activeProperty, setActiveProperty] = useState<HostListing | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdatingProperty, setIsUpdatingProperty] = useState(false);
  const [isDeletingPropertyId, setIsDeletingPropertyId] = useState<string | null>(null);
  const [isTogglingPropertyId, setIsTogglingPropertyId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<EditPropertyFormData>({
    property_name: "",
    property_type: "",
    city: "",
    state: "",
    postal_code: "",
    room_no: "",
    address: "",
    area: "",
    monthly_price: "",
    is_active: true,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [clientId, setClientId] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [area, setArea] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [isCorporateOwner, setIsCorporateOwner] = useState("all");
  const [isActive, setIsActive] = useState("all");

  const resolveHostId = useCallback(async () => {
    if (hostId) {
      return hostId;
    }

    const hostFromStorage = getHostDetails()?.id;
    if (hostFromStorage) {
      setHostId(hostFromStorage);
      return hostFromStorage;
    }

    const hostProfile = await fetchCurrentHostProfile();
    if (!hostProfile.id) {
      throw new Error("Host ID is missing. Please sign in again.");
    }

    setHostId(hostProfile.id);
    return hostProfile.id;
  }, [hostId]);

  const loadCustomers = useCallback(async () => {
    try {
      const resolvedHostId = await resolveHostId();
      const hostCustomers = await fetchHostCustomers(resolvedHostId);
      setCustomers(
        hostCustomers.map((customer) => ({
          id: customer.id,
          name: customer.name,
        })),
      );
    } catch {
      setCustomers([]);
    }
  }, [resolveHostId]);

  const loadProperties = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const resolvedHostId = await resolveHostId();
      const filters: FetchHostListingsFilters = {};

      if (clientId !== "all") {
        filters.corporate_host_customer_id = clientId;
      }

      if (isCorporateOwner !== "all") {
        filters.is_corporate_owner_of_property = isCorporateOwner === "true";
      }

      if (propertyType !== "all") {
        filters.property_type = propertyType;
      }

      if (searchQuery.trim()) {
        filters.name = searchQuery.trim();
      }

      if (minPrice.trim()) {
        filters.min_price = Number(minPrice);
      }

      if (maxPrice.trim()) {
        filters.max_price = Number(maxPrice);
      }

      if (area.trim()) {
        filters.area = Number(area);
      } else {
        if (minArea.trim()) {
          filters.min_area = Number(minArea);
        }

        if (maxArea.trim()) {
          filters.max_area = Number(maxArea);
        }
      }

      if (isActive !== "all") {
        filters.is_active = isActive === "true";
      }

      const listings = await fetchHostListings(resolvedHostId, filters);
      setProperties(listings);
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : "Unable to load properties right now.");
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    area,
    clientId,
    isActive,
    isCorporateOwner,
    maxArea,
    maxPrice,
    minArea,
    minPrice,
    propertyType,
    resolveHostId,
    searchQuery,
  ]);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    void loadProperties();
  }, [loadProperties]);

  const propertyTypes = useMemo(
    () => Array.from(new Set(properties.map((property) => property.property_type).filter(Boolean))),
    [properties],
  );

  const handleOpenEditModal = (listingId: string) => {
    navigate(`/new-booking?editListingId=${encodeURIComponent(listingId)}`);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateProperty = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeProperty) {
      setActionError("Listing details are unavailable.");
      return;
    }

    setActionError(null);
    setIsUpdatingProperty(true);

    try {
      const monthly = Number(editFormData.monthly_price) || 0;
      const areaValue = Number(editFormData.area) || 0;

      const payload: Partial<CreateListingRequest> = {
        corporate_host_id: activeProperty.corporate_host_id,
        corporate_host_customer_id: activeProperty.corporate_host_customer_id || undefined,
        is_corporate_owner_of_property: activeProperty.is_corporate_owner_of_property,
        property_type: editFormData.property_type.trim(),
        property_name: editFormData.property_name.trim(),
        city: editFormData.city.trim(),
        state: editFormData.state.trim(),
        postal_code: editFormData.postal_code.trim(),
        room_no: editFormData.room_no.trim(),
        address: editFormData.address.trim(),
        longitude: activeProperty.longitude,
        latitude: activeProperty.latitude,
        area: areaValue,
        guests: activeProperty.guests,
        bedrooms: activeProperty.bedrooms,
        bathrooms: activeProperty.bathrooms,
        kitchen: activeProperty.kitchen,
        beds: activeProperty.beds,
        common_amenities: activeProperty.common_amenities,
        special_features: activeProperty.special_features,
        additional_features: activeProperty.additional_features,
        safety_security_features: activeProperty.safety_security_features,
        house_rules: activeProperty.house_rules,
        additional_house_rules: activeProperty.additional_house_rules,
        property_tags: activeProperty.property_tags,
        description: activeProperty.description,
        booking_availability: activeProperty.booking_availability === "Always" ? "Always" : "One Time",
        start_date: activeProperty.start_date || undefined,
        end_date: activeProperty.end_date || undefined,
        cover_image: activeProperty.cover_image,
        additional_images: activeProperty.additional_images,
        monthly_price: monthly,
        price_per_night: Number((monthly / 30).toFixed(2)),
        is_active: editFormData.is_active,
      };

      const updated = await updateListingById(activeProperty.id, payload);
      if (updated) {
        setActiveProperty(updated);
      }

      await loadProperties();
      setIsEditModalOpen(false);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to update listing right now.");
    } finally {
      setIsUpdatingProperty(false);
    }
  };

  const handleDeleteProperty = async (property: HostListing) => {
    const confirmed = window.confirm(
      `Delete ${property.property_name || "this property"}? This action cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }

    setActionError(null);
    setIsDeletingPropertyId(property.id);

    try {
      await deleteListingById(property.id);
      await loadProperties();
      if (activeProperty?.id === property.id) {
        setActiveProperty(null);
        setIsEditModalOpen(false);
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to delete listing right now.");
    } finally {
      setIsDeletingPropertyId(null);
    }
  };

  const handleTogglePropertyActive = async (property: HostListing) => {
    setActionError(null);
    setIsTogglingPropertyId(property.id);

    try {
      const payload: Partial<CreateListingRequest> = {
        corporate_host_id: property.corporate_host_id,
        corporate_host_customer_id: property.corporate_host_customer_id || undefined,
        is_corporate_owner_of_property: property.is_corporate_owner_of_property,
        property_type: property.property_type,
        property_name: property.property_name,
        city: property.city,
        state: property.state,
        postal_code: property.postal_code,
        room_no: property.room_no,
        address: property.address,
        longitude: property.longitude,
        latitude: property.latitude,
        area: property.area,
        guests: property.guests,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        kitchen: property.kitchen,
        beds: property.beds,
        common_amenities: property.common_amenities,
        special_features: property.special_features,
        additional_features: property.additional_features,
        safety_security_features: property.safety_security_features,
        house_rules: property.house_rules,
        additional_house_rules: property.additional_house_rules,
        property_tags: property.property_tags,
        description: property.description,
        booking_availability: property.booking_availability === "Always" ? "Always" : "One Time",
        start_date: property.start_date || undefined,
        end_date: property.end_date || undefined,
        cover_image: property.cover_image,
        additional_images: property.additional_images,
        monthly_price: property.monthly_price,
        price_per_night: property.price_per_night,
        is_active: !property.is_active,
      };

      const updated = await updateListingById(property.id, payload);

      if (updated) {
        setProperties((prev) => prev.map((item) => (item.id === property.id ? updated : item)));
      } else {
        setProperties((prev) =>
          prev.map((item) =>
            item.id === property.id
              ? {
                  ...item,
                  is_active: !item.is_active,
                }
              : item,
          ),
        );
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to change listing status right now.");
    } finally {
      setIsTogglingPropertyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">Properties</h1>
        <p className="text-[#666666]">Browse your listed properties</p>
      </div>

      {/* Filters */}
      <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
            />
          </div>

          {/* Property Type */}
          <div className="relative">
            <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40 appearance-none"
            >
              <option value="all">All Types</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Client */}
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40 appearance-none"
            >
              <option value="all">All Clients</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
            <input
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
            />
          </div>

          {/* Area */}
          <div className="relative">
            <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
            <input
              type="number"
              placeholder="Min area"
              value={minArea}
              onChange={(e) => setMinArea(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mt-4">
          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
          />

          <input
            type="number"
            placeholder="Exact area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
          />

          <input
            type="number"
            placeholder="Max area"
            value={maxArea}
            onChange={(e) => setMaxArea(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
          />

          <div className="flex gap-2">
            <select
              value={isCorporateOwner}
              onChange={(e) => setIsCorporateOwner(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40 appearance-none"
            >
              <option value="all">Owner: All</option>
              <option value="true">Owner: Corporation</option>
              <option value="false">Owner: Customer</option>
            </select>
            <select
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40 appearance-none"
            >
              <option value="all">Status: All</option>
              <option value="true">Available</option>
              <option value="false">Booked</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <button
            type="button"
            onClick={() => void loadProperties()}
            className="px-4 py-2 bg-[#00CFC5] text-white rounded-lg hover:bg-[#00CFC5]/90 transition-all"
          >
            Refresh
          </button>
        </div>
      </div>

      {fetchError && (
        <div className="mb-6 p-4 rounded-2xl border border-red-200 bg-red-50 text-red-700 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <p>{fetchError}</p>
        </div>
      )}

      {actionError && (
        <div className="mb-6 p-4 rounded-2xl border border-red-200 bg-red-50 text-red-700 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <p>{actionError}</p>
        </div>
      )}

      {/* Properties Grid */}
      {isLoading ? (
        <div className="bg-[#F8F8F8] rounded-2xl p-8 border border-black/5 shadow-sm flex items-center gap-2 text-[#666666]">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading properties...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
          <div
            key={property.id || `${property.property_name}-${property.latitude}-${property.longitude}`}
            className="bg-[#F8F8F8] rounded-2xl overflow-hidden border border-black/5 hover:border-[#00CFC5]/40 transition-all hover:shadow-lg group"
          >
            {/* Property Image */}
            <div className="h-56 overflow-hidden relative">
              <img
                src={property.cover_image || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1080&q=80"}
                alt={property.property_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    property.is_active
                      ? "bg-[#0E5E4F]/90 text-white"
                      : "bg-black/70 text-white"
                  }`}
                >
                  {property.is_active ? "Active" : "Inactive"}
                </span>
                <button
                  type="button"
                  onClick={() => void handleTogglePropertyActive(property)}
                  disabled={isTogglingPropertyId === property.id}
                  className={`px-3 py-1 rounded-full text-xs transition-colors disabled:opacity-70 ${
                    property.is_active
                      ? "bg-[#00CFC5] text-white hover:bg-[#00CFC5]/85"
                      : "bg-[#0E5E4F]/80 text-white hover:bg-[#0E5E4F]"
                  }`}
                >
                  {isTogglingPropertyId === property.id
                    ? "Updating..."
                    : property.is_active
                    ? "Available"
                    : "Booked"}
                </button>
              </div>
            </div>

            {/* Property Details */}
            <div className="p-6">
              <h3 className="text-xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">
                {property.property_name || "Untitled Property"}
              </h3>
              <div className="flex items-center gap-2 text-[#666666] text-sm mb-4">
                <MapPin className="w-4 h-4" />
                {property.city && property.state
                  ? `${property.city}, ${property.state}`
                  : "Location unavailable"}
              </div>

              <div className="h-px bg-black/10 my-4" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#666666] text-xs mb-1">Price per night</p>
                  <p className="text-[#00CFC5] text-2xl font-['Playfair_Display']">
                    ${property.price_per_night.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void handleOpenEditModal(property.id)}
                    className="p-2 rounded-lg border border-black/10 text-[#666666] hover:text-[#00CFC5] hover:bg-white"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeleteProperty(property)}
                    disabled={isDeletingPropertyId === property.id}
                    className="p-2 rounded-lg border border-black/10 text-[#666666] hover:text-red-600 hover:bg-white disabled:opacity-60"
                  >
                    {isDeletingPropertyId === property.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && properties.length === 0 && (
        <div className="bg-[#F8F8F8] rounded-2xl p-12 border border-black/5 text-center shadow-sm">
          <Home className="w-16 h-16 text-[#666666]/30 mx-auto mb-4" />
          <h3 className="text-xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">
            No properties found
          </h3>
          <p className="text-[#666666]">Try adjusting your filters</p>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-black/10 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-black/10 flex items-center justify-between">
              <h3 className="text-2xl text-[#0D0D0D] font-['Playfair_Display']">Edit Property</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-3 py-2 text-sm border border-black/10 rounded-lg hover:bg-black/5"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleUpdateProperty} className="p-6 space-y-4">
              {isActionLoading ? (
                <div className="flex items-center gap-2 text-[#666666]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading property details...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="property_name"
                      value={editFormData.property_name}
                      onChange={handleEditFormChange}
                      placeholder="Property name"
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
                    />
                    <input
                      type="text"
                      name="property_type"
                      value={editFormData.property_type}
                      onChange={handleEditFormChange}
                      placeholder="Property type"
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
                    />
                    <input
                      type="text"
                      name="city"
                      value={editFormData.city}
                      onChange={handleEditFormChange}
                      placeholder="City"
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
                    />
                    <input
                      type="text"
                      name="state"
                      value={editFormData.state}
                      onChange={handleEditFormChange}
                      placeholder="State"
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
                    />
                    <input
                      type="text"
                      name="postal_code"
                      value={editFormData.postal_code}
                      onChange={handleEditFormChange}
                      placeholder="Postal code"
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
                    />
                    <input
                      type="text"
                      name="room_no"
                      value={editFormData.room_no}
                      onChange={handleEditFormChange}
                      placeholder="Room no"
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
                    />
                    <input
                      type="text"
                      name="address"
                      value={editFormData.address}
                      onChange={handleEditFormChange}
                      placeholder="Address"
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] md:col-span-2"
                    />
                    <input
                      type="number"
                      name="area"
                      value={editFormData.area}
                      onChange={handleEditFormChange}
                      placeholder="Area"
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
                    />
                    <input
                      type="number"
                      name="monthly_price"
                      value={editFormData.monthly_price}
                      onChange={handleEditFormChange}
                      placeholder="Monthly price"
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm text-[#0D0D0D]">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={editFormData.is_active}
                      onChange={handleEditFormChange}
                    />
                    Active listing
                  </label>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 border border-black/10 rounded-lg hover:bg-black/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingProperty}
                      className="px-4 py-2 bg-[#00CFC5] text-white rounded-lg hover:bg-[#00CFC5]/90 disabled:opacity-70"
                    >
                      {isUpdatingProperty ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}