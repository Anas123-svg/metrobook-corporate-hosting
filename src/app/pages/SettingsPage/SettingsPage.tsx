import { useCallback, useEffect, useMemo, useState } from "react";
import { Building2, CreditCard, Bell, Save, AlertCircle, Loader2 } from "lucide-react";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { HostProfileResponse } from "../../models/hostAuth";
import { createHostPaymentMethod, fetchCurrentHostProfile } from "../../services/hostApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
const STRIPE_PUBLISHABLE_KEY = (
  import.meta as ImportMeta & { env: Record<string, string | undefined> }
).env.VITE_STRIPE_PUBLISHABLE_KEY?.trim();

const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

type AddPaymentDialogProps = {
  hostProfile: HostProfileResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentAdded: () => Promise<void>;
};

function AddPaymentDialogContent({
  hostProfile,
  onOpenChange,
  onPaymentAdded,
}: Omit<AddPaymentDialogProps, "open">) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSaving, setIsSaving] = useState(false);
  const [isDefault, setIsDefault] = useState(hostProfile.CorporateHostPaymentMethods.length === 0);
  const [modalError, setModalError] = useState<string | null>(null);

  const handleSavePayment = async () => {
    if (!stripe || !elements) {
      setModalError("Stripe is still loading. Please wait and try again.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setModalError("Card input is not ready. Please try again.");
      return;
    }

    setIsSaving(true);
    setModalError(null);

    try {
      const paymentMethodResult = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: hostProfile.admin_name,
          email: hostProfile.admin_email,
          phone: hostProfile.admin_phone_number,
        },
      });

      if (paymentMethodResult.error || !paymentMethodResult.paymentMethod) {
        throw new Error(paymentMethodResult.error?.message || "Unable to create payment method.");
      }

      const stripePaymentMethod = paymentMethodResult.paymentMethod;
      const cardDetails = stripePaymentMethod.card;

      if (!cardDetails) {
        throw new Error("Missing card details from Stripe response.");
      }

      const existingCustomerId =
        hostProfile.CorporateHostPaymentMethods.find((method) => method.stripe_customer_id)
          ?.stripe_customer_id ?? "";

      await createHostPaymentMethod({
        corporate_host_id: hostProfile.id,
        payment_type: "card",
        stripe_customer_id: existingCustomerId,
        stripe_payment_method_id: stripePaymentMethod.id,
        card_brand: cardDetails.brand,
        card_last4: cardDetails.last4,
        expiry_month: cardDetails.exp_month,
        expiry_year: cardDetails.exp_year,
        is_default: isDefault,
      });

      onOpenChange(false);
      await onPaymentAdded();
    } catch (error) {
      setModalError(
        error instanceof Error ? error.message : "Unable to save payment method right now.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl text-[#0D0D0D] font-['Playfair_Display']">
          Add Payment Method
        </DialogTitle>
        <DialogDescription>
          Enter card details. CVV and sensitive card information are securely handled by Stripe.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <label className="block text-sm text-[#666666] mb-2">Card Details</label>
          <div className="rounded-lg border border-black/10 px-3 py-3">
            <CardElement
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#0D0D0D",
                    "::placeholder": { color: "#9CA3AF" },
                  },
                },
              }}
            />
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm text-[#0D0D0D]">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(event) => setIsDefault(event.target.checked)}
            className="h-4 w-4 rounded border-black/20 accent-[#00CFC5]"
          />
          Set as default payment method
        </label>

        {modalError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {modalError}
          </div>
        )}
      </div>

      <DialogFooter>
        <button
          type="button"
          disabled={isSaving}
          onClick={() => onOpenChange(false)}
          className="px-4 py-2 rounded-xl border border-black/10 text-[#0D0D0D] hover:bg-black/5 transition-all disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={isSaving || !stripe || !elements}
          onClick={() => void handleSavePayment()}
          className="px-4 py-2 rounded-xl bg-[#00CFC5] text-white hover:bg-[#00CFC5]/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Payment Method
        </button>
      </DialogFooter>
    </>
  );
}

function AddPaymentDialog(props: AddPaymentDialogProps) {
  const { hostProfile, open, onOpenChange, onPaymentAdded } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        {!stripePromise ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl text-[#0D0D0D] font-['Playfair_Display']">
                Stripe Not Configured
              </DialogTitle>
              <DialogDescription>
                Set NEXT_STRIPE_PUBLISHABLE_KEY in .env.local and restart the dev server.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 rounded-xl border border-black/10 text-[#0D0D0D] hover:bg-black/5 transition-all"
              >
                Close
              </button>
            </DialogFooter>
          </>
        ) : (
          <Elements stripe={stripePromise}>
            <AddPaymentDialogContent
              hostProfile={hostProfile}
              onOpenChange={onOpenChange}
              onPaymentAdded={onPaymentAdded}
            />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function SettingsPage() {
  const [hostProfile, setHostProfile] = useState<HostProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

  const loadHostProfile = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const profile = await fetchCurrentHostProfile();
      setHostProfile(profile);
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : "Unable to load host details right now.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHostProfile();
  }, [loadHostProfile]);

  const paymentMethods = useMemo(() => {
    return hostProfile?.CorporateHostPaymentMethods ?? [];
  }, [hostProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="mb-8">
          <h1 className="text-4xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">Settings</h1>
          <p className="text-[#666666]">Loading host details...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="mb-8">
          <h1 className="text-4xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">Settings</h1>
          <p className="text-[#666666]">Manage your account and preferences</p>
        </div>

        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>
            <p className="font-medium">Could not load host details</p>
            <p className="text-sm mt-1">{fetchError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hostProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">Settings</h1>
        <p className="text-[#666666]">Manage your account and preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Account Information */}
        <div className="bg-[#F8F8F8] rounded-2xl p-8 border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-6 h-6 text-[#00CFC5]" />
            <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display']">
              Account Information
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[#666666] mb-2">Company Name</label>
              <input
                type="text"
                value={hostProfile.company_name}
                readOnly
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
              />
            </div>
            <div>
              <label className="block text-sm text-[#666666] mb-2">Registration Number</label>
              <input
                type="text"
                value={hostProfile.registration_number}
                readOnly
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
              />
            </div>
            <div>
              <label className="block text-sm text-[#666666] mb-2">Tax ID</label>
              <input
                type="text"
                value={hostProfile.tax_id}
                readOnly
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
              />
            </div>
            <div>
              <label className="block text-sm text-[#666666] mb-2">Phone Number</label>
              <input
                type="tel"
                value={hostProfile.phone_number}
                readOnly
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-[#666666] mb-2">Business Address</label>
              <textarea
                rows={3}
                value={hostProfile.business_address}
                readOnly
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#666666] mb-2">Admin Name</label>
              <input
                type="text"
                value={hostProfile.admin_name}
                readOnly
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
              />
            </div>
            <div>
              <label className="block text-sm text-[#666666] mb-2">Admin Email</label>
              <input
                type="email"
                value={hostProfile.admin_email}
                readOnly
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
              />
            </div>
            <div>
              <label className="block text-sm text-[#666666] mb-2">Admin Job Title</label>
              <input
                type="text"
                value={hostProfile.admin_job_title}
                readOnly
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
              />
            </div>
            <div>
              <label className="block text-sm text-[#666666] mb-2">Admin Phone Number</label>
              <input
                type="text"
                value={hostProfile.admin_phone_number}
                readOnly
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
              />
            </div>
            <div>
              <label className="block text-sm text-[#666666] mb-2">Role</label>
              <input
                type="text"
                value={hostProfile.role}
                readOnly
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
              />
            </div>
            <div>
              <label className="block text-sm text-[#666666] mb-2">KYB Status</label>
              <input
                type="text"
                value={hostProfile.kyb_status}
                readOnly
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
              />
            </div>
            <div>
              <label className="block text-sm text-[#666666] mb-2">Active</label>
              <input
                type="text"
                value={hostProfile.is_active ? "Yes" : "No"}
                readOnly
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
              />
            </div>
            <div>
              <label className="block text-sm text-[#666666] mb-2">Email Verified</label>
              <input
                type="text"
                value={hostProfile.is_email_verified ? "Yes" : "No"}
                readOnly
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
              />
            </div>
            <div>
              <label className="block text-sm text-[#666666] mb-2">Terms Accepted</label>
              <input
                type="text"
                value={hostProfile.terms_Conditions ? "Yes" : "No"}
                readOnly
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
              />
            </div>
            {/* <div>
              <label className="block text-sm text-[#666666] mb-2">Created At</label>
              <input
                type="text"
                value={formatDate(hostProfile.created_at)}
                readOnly
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
              />
            </div>
            <div>
              <label className="block text-sm text-[#666666] mb-2">Updated At</label>
              <input
                type="text"
                value={formatDate(hostProfile.updated_at)}
                readOnly
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
              />
            </div> */}
            {/* <div className="col-span-2">
              <label className="block text-sm text-[#666666] mb-2">Host ID</label>
              <input
                type="text"
                value={hostProfile.id}
                readOnly
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] focus:outline-none focus:border-[#00CFC5]/40"
              />
            </div> */}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-[#F8F8F8] rounded-2xl p-8 border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-[#00CFC5]" />
              <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display']">Payment Methods</h2>
            </div>
            <button
              onClick={() => setIsAddPaymentOpen(true)}
              className="px-4 py-2 border border-[#00CFC5] text-[#00CFC5] rounded-xl hover:bg-[#00CFC5]/10 transition-all text-sm font-medium"
            >
              Add Payment
            </button>
          </div>
          <div className="space-y-3">
            {paymentMethods.length === 0 && (
              <div className="bg-white rounded-xl p-4 border border-black/10">
                <p className="text-[#666666] text-sm">No payment methods found for this host.</p>
              </div>
            )}

            {paymentMethods.map((method) => (
              <div key={method.id} className="bg-white rounded-xl p-4 border border-black/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-gradient-to-r from-[#00CFC5] to-[#0E5E4F] rounded"></div>
                    <div>
                      <p className="text-[#0D0D0D] font-medium mb-1">
                        {method.card_brand?.toUpperCase() || method.payment_type} •••• {method.card_last4 || "----"}
                      </p>
                      <p className="text-[#666666] text-sm">
                        Expires {method.expiry_month ?? "--"}/{method.expiry_year ?? "----"}
                      </p>
                    </div>
                  </div>
                  {method.is_default && (
                    <span className="px-3 py-1 bg-[#0E5E4F]/20 text-[#0E5E4F] rounded-full text-xs border border-[#0E5E4F]/30">
                      Default
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-[#666666] border-t border-black/10 pt-3">
                  <p>Payment Type: {method.payment_type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        {/* <div className="bg-[#F8F8F8] rounded-2xl p-8 border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-[#00CFC5]" />
            <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display']">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-black/10">
              <div>
                <p className="text-[#0D0D0D] font-medium mb-1">Booking Confirmations</p>
                <p className="text-[#666666] text-sm">
                  Receive notifications when bookings are confirmed
                </p>
              </div>
              <button className="relative inline-flex h-7 w-14 items-center rounded-full bg-[#00CFC5]">
                <span className="inline-block h-5 w-5 transform rounded-full bg-white translate-x-8 transition-transform" />
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-black/10">
              <div>
                <p className="text-[#0D0D0D] font-medium mb-1">Payment Reminders</p>
                <p className="text-[#666666] text-sm">Get reminders for upcoming payments</p>
              </div>
              <button className="relative inline-flex h-7 w-14 items-center rounded-full bg-[#00CFC5]">
                <span className="inline-block h-5 w-5 transform rounded-full bg-white translate-x-8 transition-transform" />
              </button>
            </div>
          </div>
        </div> */}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            disabled
            className="px-8 py-3 bg-[#00CFC5] text-white rounded-xl transition-all flex items-center gap-2 shadow-sm font-medium opacity-60 cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            Read-Only
          </button>
        </div>
      </div>

      {hostProfile && (
        <AddPaymentDialog
          hostProfile={hostProfile}
          open={isAddPaymentOpen}
          onOpenChange={setIsAddPaymentOpen}
          onPaymentAdded={loadHostProfile}
        />
      )}
    </div>
  );
}