export interface HostSummary {
  id: string;
  company_name: string;
  admin_email: string;
  role: string;
}

export interface HostSignupResponse {
  host: HostSummary;
  token: string;
}

export interface ApiErrorResponse {
  message?: string;
}

export interface CorporateHostPaymentMethod {
  id: string;
  corporate_host_id: string;
  payment_type: string;
  stripe_customer_id: string | null;
  stripe_payment_method_id: string | null;
  card_brand: string | null;
  card_last4: string | null;
  expiry_month: number | null;
  expiry_year: number | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentMethodRequest {
  corporate_host_id: string;
  payment_type: string;
  stripe_customer_id: string;
  stripe_payment_method_id: string;
  card_brand: string;
  card_last4: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
}

export interface HostProfileResponse {
  id: string;
  company_name: string;
  business_address: string;
  registration_number: string;
  tax_id: string;
  phone_number: string;
  admin_name: string;
  admin_email: string;
  admin_job_title: string;
  admin_phone_number: string;
  role: string;
  kyb_status: string;
  is_active: boolean;
  is_email_verified: boolean;
  terms_Conditions: boolean;
  created_at: string;
  updated_at: string;
  CorporateHostPaymentMethods: CorporateHostPaymentMethod[];
}

export interface TeamAccount {
  id: string;
  corporate_host_id: string;
  name: string;
  email: string;
  job_title: string;
  phone_number: string | null;
  profile_pic: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTeamAccountRequest {
  name: string;
  email: string;
  job_title: string;
  role: string;
  password: string;
  phone_number?: string;
  profile_pic?: string;
  is_active?: boolean;
}

export interface UpdateTeamAccountRequest {
  name?: string;
  email?: string;
  job_title?: string;
  role?: string;
  password?: string;
  phone_number?: string;
  profile_pic?: string;
  is_active?: boolean;
}

const asString = (value: unknown, fallback = "") => {
  return typeof value === "string" ? value : fallback;
};

const asBoolean = (value: unknown, fallback = false) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (value === 1) {
    return true;
  }

  if (value === 0) {
    return false;
  }

  return fallback;
};

const asNullableString = (value: unknown) => {
  return typeof value === "string" ? value : null;
};

const asNullableNumber = (value: unknown) => {
  return typeof value === "number" ? value : null;
};

const toTeamAccount = (value: unknown): TeamAccount | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<TeamAccount> & {
    corporateHostId?: unknown;
    corporate_hostid?: unknown;
    profilePic?: unknown;
    phoneNumber?: unknown;
    isActive?: unknown;
    createdAt?: unknown;
    updatedAt?: unknown;
  };

  return {
    id: asString(candidate.id),
    corporate_host_id: asString(
      candidate.corporate_host_id ?? candidate.corporateHostId ?? candidate.corporate_hostid,
    ),
    name: asString(candidate.name),
    email: asString(candidate.email),
    job_title: asString(candidate.job_title),
    phone_number: asNullableString(candidate.phone_number ?? candidate.phoneNumber),
    profile_pic: asNullableString(candidate.profile_pic ?? candidate.profilePic),
    role: asString(candidate.role),
    is_active: asBoolean(candidate.is_active ?? candidate.isActive),
    created_at: asString(candidate.created_at ?? candidate.createdAt),
    updated_at: asString(candidate.updated_at ?? candidate.updatedAt),
  };
};

export const toTeamAccountsResponse = (value: unknown): TeamAccount[] => {
  if (Array.isArray(value)) {
    return value
      .map((entry) => toTeamAccount(entry))
      .filter((entry): entry is TeamAccount => entry !== null);
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  const candidate = value as {
    team_accounts?: unknown[];
    teamAccounts?: unknown[];
    data?: unknown[];
    rows?: unknown[];
  };

  const rawAccounts = Array.isArray(candidate.team_accounts)
    ? candidate.team_accounts
    : Array.isArray(candidate.teamAccounts)
    ? candidate.teamAccounts
    : Array.isArray(candidate.data)
    ? candidate.data
    : Array.isArray(candidate.rows)
    ? candidate.rows
    : [];

  if (rawAccounts.length === 0) {
    const directAccount = toTeamAccount(value);
    return directAccount ? [directAccount] : [];
  }

  return rawAccounts
    .map((entry) => toTeamAccount(entry))
    .filter((entry): entry is TeamAccount => entry !== null);
};

export const isHostSignupResponse = (value: unknown): value is HostSignupResponse => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<HostSignupResponse>;
  return Boolean(
    candidate.token &&
      typeof candidate.token === "string" &&
      candidate.host &&
      typeof candidate.host === "object" &&
      "id" in candidate.host &&
      "company_name" in candidate.host &&
      "admin_email" in candidate.host &&
      "role" in candidate.host,
  );
};

const isCorporateHostPaymentMethod = (value: unknown): value is CorporateHostPaymentMethod => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<CorporateHostPaymentMethod>;
  return Boolean(
    typeof candidate.id === "string" &&
      typeof candidate.corporate_host_id === "string" &&
      typeof candidate.payment_type === "string" &&
      typeof candidate.is_default === "boolean" &&
      typeof candidate.created_at === "string" &&
      typeof candidate.updated_at === "string",
  );
};

const toCorporateHostPaymentMethod = (value: unknown): CorporateHostPaymentMethod | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<CorporateHostPaymentMethod>;

  return {
    id: asString(candidate.id),
    corporate_host_id: asString(candidate.corporate_host_id),
    payment_type: asString(candidate.payment_type),
    stripe_customer_id: asNullableString(candidate.stripe_customer_id),
    stripe_payment_method_id: asNullableString(candidate.stripe_payment_method_id),
    card_brand: asNullableString(candidate.card_brand),
    card_last4: asNullableString(candidate.card_last4),
    expiry_month: asNullableNumber(candidate.expiry_month),
    expiry_year: asNullableNumber(candidate.expiry_year),
    is_default: asBoolean(candidate.is_default),
    created_at: asString(candidate.created_at),
    updated_at: asString(candidate.updated_at),
  };
};

export const isHostProfileResponse = (value: unknown): value is HostProfileResponse => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<HostProfileResponse>;

  if (
    typeof candidate.id !== "string" ||
    typeof candidate.company_name !== "string" ||
    typeof candidate.business_address !== "string" ||
    typeof candidate.registration_number !== "string" ||
    typeof candidate.tax_id !== "string" ||
    typeof candidate.phone_number !== "string" ||
    typeof candidate.admin_name !== "string" ||
    typeof candidate.admin_email !== "string" ||
    typeof candidate.admin_job_title !== "string" ||
    typeof candidate.admin_phone_number !== "string" ||
    typeof candidate.role !== "string" ||
    typeof candidate.kyb_status !== "string" ||
    typeof candidate.is_active !== "boolean" ||
    typeof candidate.is_email_verified !== "boolean" ||
    typeof candidate.terms_Conditions !== "boolean" ||
    typeof candidate.created_at !== "string" ||
    typeof candidate.updated_at !== "string" ||
    !Array.isArray(candidate.CorporateHostPaymentMethods)
  ) {
    return false;
  }

  return candidate.CorporateHostPaymentMethods.every(isCorporateHostPaymentMethod);
};

export const toHostProfileResponse = (value: unknown): HostProfileResponse | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<HostProfileResponse> & {
    corporateHostPaymentMethods?: unknown[];
  };

  const rawPaymentMethods = Array.isArray(candidate.CorporateHostPaymentMethods)
    ? candidate.CorporateHostPaymentMethods
    : Array.isArray(candidate.corporateHostPaymentMethods)
    ? candidate.corporateHostPaymentMethods
    : [];

  const paymentMethods = rawPaymentMethods
    .map((method) => toCorporateHostPaymentMethod(method))
    .filter((method): method is CorporateHostPaymentMethod => method !== null);

  return {
    id: asString(candidate.id),
    company_name: asString(candidate.company_name),
    business_address: asString(candidate.business_address),
    registration_number: asString(candidate.registration_number),
    tax_id: asString(candidate.tax_id),
    phone_number: asString(candidate.phone_number),
    admin_name: asString(candidate.admin_name),
    admin_email: asString(candidate.admin_email),
    admin_job_title: asString(candidate.admin_job_title),
    admin_phone_number: asString(candidate.admin_phone_number),
    role: asString(candidate.role),
    kyb_status: asString(candidate.kyb_status),
    is_active: asBoolean(candidate.is_active),
    is_email_verified: asBoolean(candidate.is_email_verified),
    terms_Conditions: asBoolean(candidate.terms_Conditions),
    created_at: asString(candidate.created_at),
    updated_at: asString(candidate.updated_at),
    CorporateHostPaymentMethods: paymentMethods,
  };
};
