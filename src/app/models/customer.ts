export interface Customer {
  id: string;
  corporate_host_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  notes: string;
  is_active: boolean;
  total_listings: number;
}

export interface CreateCustomerRequest {
  corporate_host_id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  notes: string;
}

export interface UpdateCustomerRequest {
  name: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  notes: string;
}

const asString = (value: unknown, fallback = "") => {
  return typeof value === "string" ? value : fallback;
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

const toCustomer = (value: unknown): Customer | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as {
    id?: unknown;
    corporate_host_id?: unknown;
    corporateHostId?: unknown;
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    address?: unknown;
    city?: unknown;
    state?: unknown;
    zipcode?: unknown;
    zipCode?: unknown;
    country?: unknown;
    notes?: unknown;
    is_active?: unknown;
    isActive?: unknown;
    status?: unknown;
    total_listings?: unknown;
    totalListings?: unknown;
    listings_count?: unknown;
    listingCount?: unknown;
  };

  const status = asString(candidate.status).toLowerCase();

  return {
    id: asString(candidate.id),
    corporate_host_id: asString(candidate.corporate_host_id ?? candidate.corporateHostId),
    name: asString(candidate.name),
    email: asString(candidate.email),
    phone: asString(candidate.phone),
    address: asString(candidate.address),
    city: asString(candidate.city),
    state: asString(candidate.state),
    zipcode: asString(candidate.zipcode ?? candidate.zipCode),
    country: asString(candidate.country),
    notes: asString(candidate.notes),
    is_active:
      typeof candidate.is_active !== "undefined" || typeof candidate.isActive !== "undefined"
        ? asBoolean(candidate.is_active ?? candidate.isActive)
        : status
        ? status === "active"
        : true,
    total_listings: asNumber(
      candidate.total_listings ?? candidate.totalListings ?? candidate.listings_count ?? candidate.listingCount,
    ),
  };
};

export const toCustomersResponse = (value: unknown): Customer[] => {
  if (Array.isArray(value)) {
    return value
      .map((entry) => toCustomer(entry))
      .filter((entry): entry is Customer => entry !== null);
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  const candidate = value as {
    customers?: unknown[];
    data?: unknown[];
    rows?: unknown[];
    results?: unknown[];
  };

  const rawCustomers = Array.isArray(candidate.customers)
    ? candidate.customers
    : Array.isArray(candidate.data)
    ? candidate.data
    : Array.isArray(candidate.rows)
    ? candidate.rows
    : Array.isArray(candidate.results)
    ? candidate.results
    : [];

  if (rawCustomers.length === 0) {
    const directCustomer = toCustomer(value);
    return directCustomer ? [directCustomer] : [];
  }

  return rawCustomers
    .map((entry) => toCustomer(entry))
    .filter((entry): entry is Customer => entry !== null);
};