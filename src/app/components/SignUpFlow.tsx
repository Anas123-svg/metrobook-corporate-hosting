import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Building2,
  User,
  CheckCircle,
  MailCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { ApiErrorResponse, HostSignupResponse, isHostSignupResponse } from "../models/hostAuth";
import { storeHostSession } from "../services/hostAuthStorage";

const steps = [
  { id: 1, name: "Business Details", icon: Building2 },
  { id: 2, name: "Admin Details", icon: User },
  { id: 3, name: "Terms & Conditions", icon: CheckCircle },
  { id: 4, name: "Email Verification", icon: MailCheck },
];

type SignUpFlowProps = {
  onFinish?: () => void;
};

type SignUpFormData = {
  companyName: string;
  businessAddress: string;
  registrationNumber: string;
  taxId: string;
  companyPhoneNumber: string;
  adminName: string;
  adminEmail: string;
  adminJobTitle: string;
  adminPhoneNumber: string;
  password: string;
  termsAccepted: boolean;
  verificationCode: string;
};
const API_BASE_URL = (
  import.meta as ImportMeta & { env: Record<string, string | undefined> }
).env.NEXT_PUBLIC_API_URL?.trim();

const initialFormData: SignUpFormData = {
  companyName: "",
  businessAddress: "",
  registrationNumber: "",
  taxId: "",
  companyPhoneNumber: "",
  adminName: "",
  adminEmail: "",
  adminJobTitle: "",
  adminPhoneNumber: "",
  password: "",
  termsAccepted: false,
  verificationCode: "",
};

const getApiErrorMessage = (value: unknown) => {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const candidate = value as ApiErrorResponse;
  return typeof candidate.message === "string" ? candidate.message : undefined;
};

export function SignUpFlow({ onFinish }: SignUpFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>(initialFormData);
  const [pendingSignupSession, setPendingSignupSession] = useState<HostSignupResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const progressPercentage =
    steps.length > 1 ? ((currentStep - 1) / (steps.length - 1)) * 100 : 100;

  const updateField = <K extends keyof SignUpFormData>(field: K, value: SignUpFormData[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const validateStep = () => {
    if (currentStep === 1) {
      return Boolean(
        formData.companyName.trim() &&
          formData.registrationNumber.trim() &&
          formData.taxId.trim() &&
          formData.companyPhoneNumber.trim() &&
          formData.businessAddress.trim(),
      );
    }

    if (currentStep === 2) {
      return Boolean(
        formData.adminName.trim() &&
          formData.adminEmail.trim() &&
          formData.adminJobTitle.trim() &&
          formData.adminPhoneNumber.trim() &&
          formData.password.trim(),
      );
    }

    if (currentStep === 3) {
      return formData.termsAccepted;
    }

    return Boolean(formData.verificationCode.trim());
  };

  const submitSignUp = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const signupUrl = API_BASE_URL
        ? `${API_BASE_URL.replace(/\/$/, "")}/hosts`
        : "/hosts";

      const response = await fetch(signupUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: formData.companyName.trim(),
          business_address: formData.businessAddress.trim(),
          registration_number: formData.registrationNumber.trim(),
          tax_id: formData.taxId.trim(),
          phone_number: formData.companyPhoneNumber.trim(),
          admin_name: formData.adminName.trim(),
          admin_email: formData.adminEmail.trim(),
          admin_job_title: formData.adminJobTitle.trim(),
          admin_phone_number: formData.adminPhoneNumber.trim(),
          role: "super_admin",
          kyb_status: "pending",
          is_active: true,
          terms_Conditions: formData.termsAccepted,
          password: formData.password,
        }),
      });

      const responseBody = (await response.json().catch(() => null)) as unknown | null;

      console.log("Host signup response:", {
        url: signupUrl,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        body: responseBody,
      });

      if (!response.ok || !responseBody || !isHostSignupResponse(responseBody)) {
        const serverMessage =
          getApiErrorMessage(responseBody) ?? "Unable to create your account right now.";
        throw new Error(serverMessage);
      }

      setPendingSignupSession(responseBody);
      setCurrentStep(4);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to create your account right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitEmailVerification = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const verifyEmailUrl = API_BASE_URL
        ? `${API_BASE_URL.replace(/\/$/, "")}/hosts/verify-email`
        : "/hosts/verify-email";

      const response = await fetch(verifyEmailUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.adminEmail.trim(),
          code: formData.verificationCode.trim(),
        }),
      });

      const responseBody = (await response.json().catch(() => null)) as unknown | null;

      console.log("Verify host email response:", {
        url: verifyEmailUrl,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        body: responseBody,
      });

      if (!response.ok) {
        const serverMessage =
          getApiErrorMessage(responseBody) ?? "Unable to verify your email code right now.";
        throw new Error(serverMessage);
      }

      if (pendingSignupSession) {
        storeHostSession(pendingSignupSession);
      }

      if (onFinish) {
        onFinish();
      } else {
        setIsComplete(true);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to verify your email code right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      setErrorMessage("Please complete all required fields before continuing.");
      return;
    }

    setErrorMessage(null);

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      void submitSignUp();
    } else {
      void submitEmailVerification();
    }
  };

  const handlePrevious = () => {
    setErrorMessage(null);
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl w-full"
        >
          <div className=" rounded-2xl p-12  text-center">
            <div className="w-68 h-32 mx-auto mb-6 rounded-2xl   flex items-center justify-center p-4">
              <img src="/logo4.png" alt="MetroBook" className="w-full h-full object-contain" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#27F5E8]/20 flex items-center justify-center border-2 border-[#27F5E8]"
            >
              <CheckCircle className="w-12 h-12 text-[#27F5E8]" />
            </motion.div>
            <h1 className="text-4xl text-white font-['Playfair_Display'] mb-4">
              Welcome to MB Corporate Hosting
            </h1>
            <p className="text-white/60 text-lg mb-8">
              Your account has been successfully created
            </p>
            <div className="bg-[#0D0D0D] rounded-xl p-6 border border-[#27F5E8]/20 mb-8">
              <p className="text-white/80 text-sm mb-2">
                Your dashboard is ready and you can start managing hosting  right away
              </p>
              <p className="text-white/60 text-sm">
                You can update your account details and preferences at any time
              </p>
            </div>
            <button
              onClick={onFinish}
              className="px-8 py-3 bg-[#27F5E8] text-[#0D0D0D] rounded-xl hover:bg-[#27F5E8]/90 transition-all shadow-lg shadow-[#27F5E8]/20"
            >
              Go to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-82 h-30 mx-auto  rounded-2xl  flex items-center justify-center p-4">
            <img src="/logo4.png" alt="MetroBook" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl text-white font-['Playfair_Display'] mb-2">
            Corporate Account Registration
          </h1>
          <p className="text-white/60">Complete your account setup</p>
        </div>

        {/* Progress Indicator */}
        <div className="bg-[#1C1C1C] rounded-2xl px-4 py-5 sm:px-5 sm:py-5 border border-[#27F5E8]/20 mb-8">
          <div className="relative">
            <div className="absolute left-0 right-0 top-5.5 h-0.5 bg-white/10" />
            <div
              className="absolute left-0 top-5.5 h-0.5 bg-[#27F5E8] transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />

            <div
              className="relative grid gap-4"
              style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
            >
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center text-center">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all bg-[#1C1C1C] ${
                      currentStep >= step.id
                        ? "border-[#27F5E8] text-[#0D0D0D] bg-[#27F5E8]"
                        : "border-white/20 text-white/40 bg-[#0D0D0D]"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <p
                    className={`mt-2 max-w-24 text-[11px] sm:text-xs leading-snug ${
                      currentStep >= step.id ? "text-white" : "text-white/40"
                    }`}
                  >
                    {step.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#1C1C1C] rounded-2xl p-8 border border-[#27F5E8]/20"
        >
          {/* Step 1: Business Details */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl text-white font-['Playfair_Display'] mb-6">
                Business Details
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-white/80 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(event) => updateField("companyName", event.target.value)}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#27F5E8]/40"
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-2">Registration Number</label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(event) => updateField("registrationNumber", event.target.value)}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#27F5E8]/40"
                    placeholder="Company registration number"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-2">Tax ID</label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(event) => updateField("taxId", event.target.value)}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#27F5E8]/40"
                    placeholder="Tax identification number"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.companyPhoneNumber}
                    onChange={(event) => updateField("companyPhoneNumber", event.target.value)}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#27F5E8]/40"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-white/80 mb-2">Business Address</label>
                  <textarea
                    rows={3}
                    value={formData.businessAddress}
                    onChange={(event) => updateField("businessAddress", event.target.value)}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#27F5E8]/40 resize-none"
                    placeholder="Full business address"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Admin Details */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl text-white font-['Playfair_Display'] mb-6">
                Administrator Details
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-white/80 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.adminName}
                    onChange={(event) => updateField("adminName", event.target.value)}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#27F5E8]/40"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.adminEmail}
                    onChange={(event) => updateField("adminEmail", event.target.value)}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#27F5E8]/40"
                    placeholder="admin@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.adminPhoneNumber}
                    onChange={(event) => updateField("adminPhoneNumber", event.target.value)}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#27F5E8]/40"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={formData.adminJobTitle}
                    onChange={(event) => updateField("adminJobTitle", event.target.value)}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#27F5E8]/40"
                    placeholder="Your job title"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-white/80 mb-2">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(event) => updateField("password", event.target.value)}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#27F5E8]/40"
                    placeholder="Create a secure password"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl text-white font-['Playfair_Display'] mb-6">
                Terms & Conditions
              </h2>
              <div className="bg-[#0D0D0D] rounded-xl p-6 border border-white/10 max-h-96 overflow-y-auto mb-6">
                <p className="text-white/70 text-sm mb-4">
                  By creating a corporate account with MB Corporate Booking, you agree to the
                  following terms and conditions...
                </p>
                <div className="space-y-2 text-sm text-white/60">
                  <p>1. You are authorized to act on behalf of your organization</p>
                  <p>2. All provided information is accurate and up-to-date</p>
                  <p>3. You agree to our refund and cancellation policies</p>
                  <p>4. You accept responsibility for all bookings made under your account</p>
                  <p>5. You will maintain the confidentiality of your account credentials</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.termsAccepted}
                  onChange={(event) => updateField("termsAccepted", event.target.checked)}
                  className="w-5 h-5 bg-[#0D0D0D] border border-white/10 rounded accent-[#27F5E8]"
                />
                <label htmlFor="terms" className="text-white/80">
                  I agree to the Terms & Conditions and Privacy Policy
                </label>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl text-white font-['Playfair_Display'] mb-3">
                Verify Your Email
              </h2>
              <p className="text-white/70 mb-6">
                We sent a verification code to {formData.adminEmail || "your email"}. Enter the
                code below to finish setting up your account.
              </p>
              <div>
                <label className="block text-sm text-white/80 mb-2">Verification Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.verificationCode}
                  onChange={(event) => updateField("verificationCode", event.target.value)}
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#27F5E8]/40"
                  placeholder="Enter 6-digit code"
                />
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#27F5E8]/20">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1 || isSubmitting}
              className="px-6 py-3 border border-white/10 rounded-xl text-white hover:border-[#27F5E8]/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#27F5E8] text-[#0D0D0D] rounded-xl hover:bg-[#27F5E8]/90 transition-all shadow-lg shadow-[#27F5E8]/20 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? currentStep === 4
                  ? "Verifying..."
                  : "Creating Account..."
                : currentStep === steps.length
                ? "Verify & Continue"
                : currentStep === 3
                ? "Create Account"
                : "Next"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
