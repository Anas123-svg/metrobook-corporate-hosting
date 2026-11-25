import {
  ApiErrorResponse,
  CreateTeamAccountRequest,
  CreatePaymentMethodRequest,
  HostSignupResponse,
  isHostSignupResponse,
  HostProfileResponse,
  TeamAccount,
  UpdateTeamAccountRequest,
  toTeamAccountsResponse,
  toHostProfileResponse,
} from "../models/hostAuth";
import {
  CreateCustomerRequest,
  Customer,
  UpdateCustomerRequest,
  toCustomersResponse,
} from "../models/customer";
import {
  CreateListingRequest,
  FetchHostListingsFilters,
  HostListing,
  toListingsResponse,
} from "../models/listing";
import { getHostAuthToken } from "./hostAuthStorage";

const API_BASE_URL = (
  import.meta as ImportMeta & { env: Record<string, string | undefined> }
).env.NEXT_PUBLIC_API_URL?.trim();

const getApiErrorMessage = (value: unknown) => {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const candidate = value as ApiErrorResponse;
  return typeof candidate.message === "string" ? candidate.message : undefined;
};

export const loginHost = async (admin_email: string, password: string): Promise<HostSignupResponse> => {
  const loginUrl = API_BASE_URL ? `${API_BASE_URL.replace(/\/$/, "")}/hosts/login` : "/hosts/login";

  const response = await fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      admin_email,
      password,
    }),
  });

  const responseBody = (await response.json().catch(() => null)) as unknown | null;

  console.log("Host login response:", {
    url: loginUrl,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: responseBody,
  });

  if (!response.ok || !responseBody || !isHostSignupResponse(responseBody)) {
    const serverMessage = getApiErrorMessage(responseBody) ?? "Unable to sign in right now.";
    throw new Error(serverMessage);
  }

  return responseBody;
};

export const fetchCurrentHostProfile = async (): Promise<HostProfileResponse> => {
  const token = getHostAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const hostProfileUrl = API_BASE_URL ? `${API_BASE_URL.replace(/\/$/, "")}/hosts/me` : "/hosts/me";

  const response = await fetch(hostProfileUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseBody = (await response.json().catch(() => null)) as unknown | null;
  const parsedProfile = toHostProfileResponse(responseBody);

  console.log("Host profile response:", {
    url: hostProfileUrl,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: responseBody,
  });

  if (!response.ok || !parsedProfile) {
    const serverMessage =
      getApiErrorMessage(responseBody) ?? "Unable to fetch host profile right now.";
    throw new Error(serverMessage);
  }

  return parsedProfile;
};

export const createHostPaymentMethod = async (payload: CreatePaymentMethodRequest) => {
  const token = getHostAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const paymentMethodsUrl = API_BASE_URL
    ? `${API_BASE_URL.replace(/\/$/, "")}/payment-methods`
    : "/payment-methods";

  const response = await fetch(paymentMethodsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const responseBody = (await response.json().catch(() => null)) as unknown | null;

  console.log("Create payment method response:", {
    url: paymentMethodsUrl,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: responseBody,
  });

  if (!response.ok) {
    const serverMessage =
      getApiErrorMessage(responseBody) ?? "Unable to save payment method right now.";
    throw new Error(serverMessage);
  }

  return responseBody;
};

export const fetchHostTeamAccounts = async (hostId: string): Promise<TeamAccount[]> => {
  const token = getHostAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const teamAccountsUrl = API_BASE_URL
    ? `${API_BASE_URL.replace(/\/$/, "")}/hosts/${hostId}/team-accounts`
    : `/hosts/${hostId}/team-accounts`;

  const response = await fetch(teamAccountsUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseBody = (await response.json().catch(() => null)) as unknown | null;

  console.log("Fetch team accounts response:", {
    url: teamAccountsUrl,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: responseBody,
  });

  if (!response.ok) {
    const serverMessage = getApiErrorMessage(responseBody) ?? "Unable to fetch team members right now.";
    throw new Error(serverMessage);
  }

  return toTeamAccountsResponse(responseBody);
};

export const createHostTeamAccount = async (
  hostId: string,
  payload: CreateTeamAccountRequest,
): Promise<TeamAccount | null> => {
  const token = getHostAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const teamAccountsUrl = API_BASE_URL
    ? `${API_BASE_URL.replace(/\/$/, "")}/hosts/${hostId}/team-accounts`
    : `/hosts/${hostId}/team-accounts`;

  const response = await fetch(teamAccountsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const responseBody = (await response.json().catch(() => null)) as unknown | null;

  console.log("Create team account response:", {
    url: teamAccountsUrl,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: responseBody,
  });

  if (!response.ok) {
    const serverMessage = getApiErrorMessage(responseBody) ?? "Unable to add team member right now.";
    throw new Error(serverMessage);
  }

  const parsed = toTeamAccountsResponse(responseBody);
  return parsed[0] ?? null;
};

export const fetchTeamAccountById = async (teamAccountId: string): Promise<TeamAccount | null> => {
  const token = getHostAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const teamAccountUrl = API_BASE_URL
    ? `${API_BASE_URL.replace(/\/$/, "")}/team-accounts/${teamAccountId}`
    : `/team-accounts/${teamAccountId}`;

  const response = await fetch(teamAccountUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseBody = (await response.json().catch(() => null)) as unknown | null;

  console.log("Fetch team account by id response:", {
    url: teamAccountUrl,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: responseBody,
  });

  if (!response.ok) {
    const serverMessage = getApiErrorMessage(responseBody) ?? "Unable to fetch team member right now.";
    throw new Error(serverMessage);
  }

  return toTeamAccountsResponse(responseBody)[0] ?? null;
};

export const updateTeamAccountById = async (
  teamAccountId: string,
  payload: UpdateTeamAccountRequest,
): Promise<TeamAccount | null> => {
  const token = getHostAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const teamAccountUrl = API_BASE_URL
    ? `${API_BASE_URL.replace(/\/$/, "")}/team-accounts/${teamAccountId}`
    : `/team-accounts/${teamAccountId}`;

  const response = await fetch(teamAccountUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const responseBody = (await response.json().catch(() => null)) as unknown | null;

  console.log("Update team account response:", {
    url: teamAccountUrl,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: responseBody,
  });

  if (!response.ok) {
    const serverMessage = getApiErrorMessage(responseBody) ?? "Unable to update team member right now.";
    throw new Error(serverMessage);
  }

  return toTeamAccountsResponse(responseBody)[0] ?? null;
};

export const deleteTeamAccountById = async (teamAccountId: string): Promise<void> => {
  const token = getHostAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const teamAccountUrl = API_BASE_URL
    ? `${API_BASE_URL.replace(/\/$/, "")}/team-accounts/${teamAccountId}`
    : `/team-accounts/${teamAccountId}`;

  const response = await fetch(teamAccountUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseBody = (await response.json().catch(() => null)) as unknown | null;

  console.log("Delete team account response:", {
    url: teamAccountUrl,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: responseBody,
  });

  if (!response.ok) {
    const serverMessage = getApiErrorMessage(responseBody) ?? "Unable to delete team member right now.";
    throw new Error(serverMessage);
  }
};

export const createCustomer = async (payload: CreateCustomerRequest): Promise<Customer | null> => {
  const token = getHostAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const customersUrl = API_BASE_URL
    ? `${API_BASE_URL.replace(/\/$/, "")}/cb/customers`
    : "/cb/customers";

  const response = await fetch(customersUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const responseBody = (await response.json().catch(() => null)) as unknown | null;

  console.log("Create customer response:", {
    url: customersUrl,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: responseBody,
  });

  if (!response.ok) {
    const serverMessage = getApiErrorMessage(responseBody) ?? "Unable to add customer right now.";
    throw new Error(serverMessage);
  }

  return toCustomersResponse(responseBody)[0] ?? null;
};

export const fetchHostCustomers = async (hostId: string): Promise<Customer[]> => {
  const token = getHostAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const customersUrl = API_BASE_URL
    ? `${API_BASE_URL.replace(/\/$/, "")}/cb/hosts/${hostId}/customers`
    : `/cb/hosts/${hostId}/customers`;

  const response = await fetch(customersUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseBody = (await response.json().catch(() => null)) as unknown | null;

  console.log("Fetch host customers response:", {
    url: customersUrl,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: responseBody,
  });

  if (!response.ok) {
    const serverMessage = getApiErrorMessage(responseBody) ?? "Unable to fetch customers right now.";
    throw new Error(serverMessage);
  }

  return toCustomersResponse(responseBody);
};

export const fetchCustomerById = async (customerId: string): Promise<Customer | null> => {
  const token = getHostAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const customerUrl = API_BASE_URL
    ? `${API_BASE_URL.replace(/\/$/, "")}/cb/customers/${customerId}`
    : `/cb/customers/${customerId}`;

  const response = await fetch(customerUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseBody = (await response.json().catch(() => null)) as unknown | null;

  console.log("Fetch customer by id response:", {
    url: customerUrl,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: responseBody,
  });

  if (!response.ok) {
    const serverMessage = getApiErrorMessage(responseBody) ?? "Unable to fetch customer right now.";
    throw new Error(serverMessage);
  }

  return toCustomersResponse(responseBody)[0] ?? null;
};

export const updateCustomerById = async (
  customerId: string,
  payload: UpdateCustomerRequest,
): Promise<Customer | null> => {
  const token = getHostAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const customerUrl = API_BASE_URL
    ? `${API_BASE_URL.replace(/\/$/, "")}/cb/customers/${customerId}`
    : `/cb/customers/${customerId}`;

  const response = await fetch(customerUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const responseBody = (await response.json().catch(() => null)) as unknown | null;

  console.log("Update customer response:", {
    url: customerUrl,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: responseBody,
  });

  if (!response.ok) {
    const serverMessage = getApiErrorMessage(responseBody) ?? "Unable to update customer right now.";
    throw new Error(serverMessage);
  }

  return toCustomersResponse(responseBody)[0] ?? null;
};

export const deleteCustomerById = async (customerId: string): Promise<void> => {
  const token = getHostAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const customerUrl = API_BASE_URL
    ? `${API_BASE_URL.replace(/\/$/, "")}/cb/customers/${customerId}`
    : `/cb/customers/${customerId}`;

  const response = await fetch(customerUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseBody = (await response.json().catch(() => null)) as unknown | null;

  console.log("Delete customer response:", {
    url: customerUrl,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: responseBody,
  });

  if (!response.ok) {
    const serverMessage = getApiErrorMessage(responseBody) ?? "Unable to delete customer right now.";
    throw new Error(serverMessage);
  }
};

export const createListing = async (payload: CreateListingRequest): Promise<HostListing | null> => {
  const token = getHostAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const listingsUrl = API_BASE_URL ? `${API_BASE_URL.replace(/\/$/, "")}/listings` : "/listings";

  const response = await fetch(listingsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const responseBody = (await response.json().catch(() => null)) as unknown | null;

  console.log("Create listing response:", {
    url: listingsUrl,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: responseBody,
  });

  if (!response.ok) {
    const serverMessage = getApiErrorMessage(responseBody) ?? "Unable to create listing right now.";
    throw new Error(serverMessage);
  }

  return toListingsResponse(responseBody)[0] ?? null;
};

export const fetchHostListings = async (
  hostId: string,
  filters?: FetchHostListingsFilters,
): Promise<HostListing[]> => {
  const token = getHostAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const baseUrl = API_BASE_URL ? `${API_BASE_URL.replace(/\/$/, "")}/hosts/${hostId}/listings` : `/hosts/${hostId}/listings`;

  const params = new URLSearchParams();

  if (filters?.corporate_host_customer_id) {
    params.set("corporate_host_customer_id", filters.corporate_host_customer_id);
  }

  if (filters?.client_ids && filters.client_ids.length > 0) {
    params.set("client_ids", filters.client_ids.join(","));
  }

  if (typeof filters?.is_corporate_owner_of_property === "boolean") {
    params.set("is_corporate_owner_of_property", String(filters.is_corporate_owner_of_property));
  }

  if (filters?.property_type) {
    params.set("property_type", filters.property_type);
  }

  if (filters?.property_types && filters.property_types.length > 0) {
    params.set("property_types", filters.property_types.join(","));
  }

  if (filters?.property_name) {
    params.set("property_name", filters.property_name);
  }

  if (filters?.name) {
    params.set("name", filters.name);
  }

  if (typeof filters?.min_price === "number") {
    params.set("min_price", String(filters.min_price));
  }

  if (typeof filters?.max_price === "number") {
    params.set("max_price", String(filters.max_price));
  }

  if (filters?.price_type) {
    params.set("price_type", filters.price_type);
  }

  if (typeof filters?.area === "number") {
    params.set("area", String(filters.area));
  }

  if (typeof filters?.min_area === "number") {
    params.set("min_area", String(filters.min_area));
  }

  if (typeof filters?.max_area === "number") {
    params.set("max_area", String(filters.max_area));
  }

  if (typeof filters?.is_active === "boolean") {
    params.set("is_active", String(filters.is_active));
  }

  const listingsUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  const response = await fetch(listingsUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseBody = (await response.json().catch(() => null)) as unknown | null;

  console.log("Fetch host listings response:", {
    url: listingsUrl,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: responseBody,
  });

  if (!response.ok) {
    const serverMessage = getApiErrorMessage(responseBody) ?? "Unable to fetch listings right now.";
    throw new Error(serverMessage);
  }

  return toListingsResponse(responseBody);
};

export const fetchListingById = async (listingId: string): Promise<HostListing | null> => {
  const token = getHostAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const listingUrl = API_BASE_URL
    ? `${API_BASE_URL.replace(/\/$/, "")}/listings/${listingId}`
    : `/listings/${listingId}`;

  const response = await fetch(listingUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseBody = (await response.json().catch(() => null)) as unknown | null;

  console.log("Fetch listing by id response:", {
    url: listingUrl,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: responseBody,
  });

  if (!response.ok) {
    const serverMessage = getApiErrorMessage(responseBody) ?? "Unable to fetch listing right now.";
    throw new Error(serverMessage);
  }

  return toListingsResponse(responseBody)[0] ?? null;
};

export const updateListingById = async (
  listingId: string,
  payload: Partial<CreateListingRequest>,
): Promise<HostListing | null> => {
  const token = getHostAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const listingUrl = API_BASE_URL
    ? `${API_BASE_URL.replace(/\/$/, "")}/listings/${listingId}`
    : `/listings/${listingId}`;

  const response = await fetch(listingUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const responseBody = (await response.json().catch(() => null)) as unknown | null;

  console.log("Update listing response:", {
    url: listingUrl,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: responseBody,
  });

  if (!response.ok) {
    const serverMessage = getApiErrorMessage(responseBody) ?? "Unable to update listing right now.";
    throw new Error(serverMessage);
  }

  return toListingsResponse(responseBody)[0] ?? null;
};

export const deleteListingById = async (listingId: string): Promise<void> => {
  const token = getHostAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please sign in again.");
  }

  const listingUrl = API_BASE_URL
    ? `${API_BASE_URL.replace(/\/$/, "")}/listings/${listingId}`
    : `/listings/${listingId}`;

  const response = await fetch(listingUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseBody = (await response.json().catch(() => null)) as unknown | null;

  console.log("Delete listing response:", {
    url: listingUrl,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: responseBody,
  });

  if (!response.ok) {
    const serverMessage = getApiErrorMessage(responseBody) ?? "Unable to delete listing right now.";
    throw new Error(serverMessage);
  }
};
