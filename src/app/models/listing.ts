export interface CreateListingRequest {
  corporate_host_id: string;
  corporate_host_customer_id?: string;
  is_corporate_owner_of_property: boolean;
  property_type: string;
  property_name: string;
  city: string;
  state: string;
  postal_code: string;
  room_no: string;
  address: string;
  longitude: string;
  latitude: string;
  area: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  kitchen: number;
  beds: number;
  common_amenities: string[];
  special_features: string[];
  additional_features: string[];
  safety_security_features: string[];
  house_rules: string[];
  additional_house_rules: string[];
  property_tags: string[];
  description: string;
  booking_availability: "Always" | "One Time";
  start_date?: string;
  end_date?: string;
  cover_image: string;
  additional_images: string[];
  monthly_price: number;
  price_per_night: number;
  is_active: boolean;
}

export interface HostListing {
  id: string;
  corporate_host_id: string;
  corporate_host_customer_id: string;
  is_corporate_owner_of_property: boolean;
  property_type: string;
  property_name: string;
  city: string;
  state: string;
  postal_code: string;
  room_no: string;
  address: string;
  longitude: string;
  latitude: string;
  area: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  kitchen: number;
  beds: number;
  common_amenities: string[];
  special_features: string[];
  additional_features: string[];
  safety_security_features: string[];
  house_rules: string[];
  additional_house_rules: string[];
  property_tags: string[];
  description: string;
  booking_availability: string;
  start_date: string;
  end_date: string;
  cover_image: string;
  additional_images: string[];
  monthly_price: number;
  price_per_night: number;
  is_active: boolean;
}

export interface FetchHostListingsFilters {
  corporate_host_customer_id?: string;
  client_ids?: string[];
  is_corporate_owner_of_property?: boolean;
  property_type?: string;
  property_types?: string[];
  property_name?: string;
  name?: string;
  min_price?: number;
  max_price?: number;
  price_type?: "monthly" | "night" | "both";
  area?: number;
  min_area?: number;
  max_area?: number;
  is_active?: boolean;
}

const asString = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);

const asNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const asBoolean = (value: unknown, fallback = false) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true" || value === 1) {
    return true;
  }

  if (value === "false" || value === 0) {
    return false;
  }

  return fallback;
};

const asStringArray = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string");
};

const toListing = (value: unknown): HostListing | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  return {
    id: asString(candidate.id),
    corporate_host_id: asString(candidate.corporate_host_id ?? candidate.corporateHostId),
    corporate_host_customer_id: asString(
      candidate.corporate_host_customer_id ?? candidate.corporateHostCustomerId,
    ),
    is_corporate_owner_of_property: asBoolean(
      candidate.is_corporate_owner_of_property ?? candidate.isCorporateOwnerOfProperty,
    ),
    property_type: asString(candidate.property_type ?? candidate.propertyType),
    property_name: asString(candidate.property_name ?? candidate.propertyName),
    city: asString(candidate.city),
    state: asString(candidate.state),
    postal_code: asString(candidate.postal_code ?? candidate.postalCode),
    room_no: asString(candidate.room_no ?? candidate.roomNo),
    address: asString(candidate.address),
    longitude: asString(candidate.longitude),
    latitude: asString(candidate.latitude),
    area: asNumber(candidate.area),
    guests: asNumber(candidate.guests),
    bedrooms: asNumber(candidate.bedrooms),
    bathrooms: asNumber(candidate.bathrooms),
    kitchen: asNumber(candidate.kitchen),
    beds: asNumber(candidate.beds),
    common_amenities: asStringArray(candidate.common_amenities ?? candidate.commonAmenities),
    special_features: asStringArray(candidate.special_features ?? candidate.specialFeatures),
    additional_features: asStringArray(candidate.additional_features ?? candidate.additionalFeatures),
    safety_security_features: asStringArray(
      candidate.safety_security_features ?? candidate.safetySecurityFeatures,
    ),
    house_rules: asStringArray(candidate.house_rules ?? candidate.houseRules),
    additional_house_rules: asStringArray(
      candidate.additional_house_rules ?? candidate.additionalHouseRules,
    ),
    property_tags: asStringArray(candidate.property_tags ?? candidate.propertyTags),
    description: asString(candidate.description),
    booking_availability: asString(candidate.booking_availability ?? candidate.bookingAvailability),
    start_date: asString(candidate.start_date ?? candidate.startDate),
    end_date: asString(candidate.end_date ?? candidate.endDate),
    cover_image: asString(candidate.cover_image ?? candidate.coverImage),
    additional_images: asStringArray(candidate.additional_images ?? candidate.additionalImages),
    monthly_price: asNumber(candidate.monthly_price ?? candidate.monthlyPrice),
    price_per_night: asNumber(candidate.price_per_night ?? candidate.pricePerNight),
    is_active: asBoolean(candidate.is_active ?? candidate.isActive, true),
  };
};

export const toListingsResponse = (value: unknown): HostListing[] => {
  if (Array.isArray(value)) {
    return value.map(toListing).filter((entry): entry is HostListing => entry !== null);
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  const candidate = value as {
    listings?: unknown[];
    data?: unknown[];
    rows?: unknown[];
    results?: unknown[];
  };

  const rawListings = Array.isArray(candidate.listings)
    ? candidate.listings
    : Array.isArray(candidate.data)
    ? candidate.data
    : Array.isArray(candidate.rows)
    ? candidate.rows
    : Array.isArray(candidate.results)
    ? candidate.results
    : [];

  if (rawListings.length === 0) {
    const oneListing = toListing(value);
    return oneListing ? [oneListing] : [];
  }

  return rawListings.map(toListing).filter((entry): entry is HostListing => entry !== null);
};
