import { useCallback, useState } from "react";
import { AlertCircle, ArrowLeft, Loader2, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createCustomer, fetchCurrentHostProfile } from "../../../services/hostApi";
import { getHostDetails } from "../../../services/hostAuthStorage";

export function AddCustomerPage() {
  const navigate = useNavigate();
  const [hostId, setHostId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Customer name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const resolvedHostId = await resolveHostId();

      await createCustomer({
        corporate_host_id: resolvedHostId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipcode: formData.zipcode.trim(),
        country: formData.country.trim(),
        notes: formData.notes.trim(),
      });

      navigate("/customers");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to add customer right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/customers");
  };

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col items-center">
      {/* Header */}
      <div className="mb-12 text-center w-full max-w-3xl">
        <button
          onClick={handleCancel}
          className="mb-6 flex items-center gap-2 text-[#666666] hover:text-[#0D0D0D] transition-colors mx-auto"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Customers
        </button>
        <div>
          <h1 className="text-4xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">Add New Customer</h1>
          <p className="text-[#666666]">Create a new customer account in the system</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-3xl">
        <div className="bg-[#F8F8F8] rounded-2xl p-10 border border-black/5 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#0D0D0D] mb-2">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter customer name"
                className={`w-full px-4 py-3 bg-white border rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none transition-all ${
                  errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-black/10 focus:border-[#00CFC5]/40"
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#0D0D0D] mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="customer@example.com"
                className={`w-full px-4 py-3 bg-white border rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none transition-all ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-black/10 focus:border-[#00CFC5]/40"
                }`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[#0D0D0D] mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className={`w-full px-4 py-3 bg-white border rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none transition-all ${
                  errors.phone
                    ? "border-red-500 focus:border-red-500"
                    : "border-black/10 focus:border-[#00CFC5]/40"
                }`}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#0D0D0D] mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Set account password"
                className={`w-full px-4 py-3 bg-white border rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none transition-all ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-black/10 focus:border-[#00CFC5]/40"
                }`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-[#0D0D0D] mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40 transition-all"
              />
            </div>

            {/* City, State, Zip - Row Layout */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0D0D0D] mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0D0D0D] mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0D0D0D] mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  placeholder="Zip code"
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40 transition-all"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-[#0D0D0D] mb-2">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40 transition-all"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-[#0D0D0D] mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional notes about this customer..."
                rows={4}
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40 transition-all resize-none"
              />
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <div>
                  <p className="font-medium">Could not add customer</p>
                  <p className="text-sm mt-1">{submitError}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-6 border-t border-black/10">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border border-black/10 rounded-xl text-[#0D0D0D] hover:bg-black/5 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-[#00CFC5] text-white rounded-xl hover:bg-[#00CFC5]/90 transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isSubmitting ? "Saving..." : "Add Customer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
