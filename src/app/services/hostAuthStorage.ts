import { HostSignupResponse, HostSummary } from "../models/hostAuth";

const FIRST_VISIT_KEY = "metrobook.signup.completed";
const HOST_AUTH_TOKEN_KEY = "metrobook.auth.token";
const HOST_DETAILS_KEY = "metrobook.auth.host";

export const isSignUpComplete = () => {
  if (typeof window === "undefined") {
    return true;
  }

  return localStorage.getItem(FIRST_VISIT_KEY) === "true";
};

export const markSignUpComplete = () => {
  localStorage.setItem(FIRST_VISIT_KEY, "true");
};

export const storeHostSession = (response: HostSignupResponse) => {
  localStorage.setItem(HOST_AUTH_TOKEN_KEY, response.token);
  localStorage.setItem(HOST_DETAILS_KEY, JSON.stringify(response.host));
  markSignUpComplete();
};

export const getHostAuthToken = () => {
  return localStorage.getItem(HOST_AUTH_TOKEN_KEY);
};

export const clearHostAuthToken = () => {
  localStorage.removeItem(HOST_AUTH_TOKEN_KEY);
};

export const getHostDetails = (): HostSummary | null => {
  const value = localStorage.getItem(HOST_DETAILS_KEY);
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as HostSummary;
  } catch {
    return null;
  }
};

export const clearHostSession = () => {
  localStorage.removeItem(HOST_AUTH_TOKEN_KEY);
  localStorage.removeItem(HOST_DETAILS_KEY);
  localStorage.removeItem(FIRST_VISIT_KEY);
};
