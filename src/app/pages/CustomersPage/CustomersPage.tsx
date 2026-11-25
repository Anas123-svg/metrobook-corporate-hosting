import { AlertCircle, Edit, Eye, Loader2, Search, Trash2, UserPlus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Customer } from "../../models/customer";
import {
  deleteCustomerById,
  fetchCurrentHostProfile,
  fetchCustomerById,
  fetchHostCustomers,
  updateCustomerById,
} from "../../services/hostApi";
import { getHostDetails } from "../../services/hostAuthStorage";

type EditCustomerFormData = {
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
};

const toEditCustomerFormData = (customer: Customer): EditCustomerFormData => ({
  name: customer.name,
  email: customer.email,
  password: "",
  phone: customer.phone,
  address: customer.address,
  city: customer.city,
  state: customer.state,
  zipcode: customer.zipcode,
  country: customer.country,
  notes: customer.notes,
});

export function CustomersPage() {
  const navigate = useNavigate();
  const [hostId, setHostId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdatingCustomer, setIsUpdatingCustomer] = useState(false);
  const [isDeletingCustomerId, setIsDeletingCustomerId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<EditCustomerFormData>({
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
    setIsLoading(true);
    setFetchError(null);

    try {
      const resolvedHostId = await resolveHostId();
      const hostCustomers = await fetchHostCustomers(resolvedHostId);
      setCustomers(hostCustomers);
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : "Unable to load customers right now.");
    } finally {
      setIsLoading(false);
    }
  }, [resolveHostId]);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase();

    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(normalizedQuery) ||
        customer.email.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [customers, searchQuery]);

  const handleOpenViewModal = async (customerId: string) => {
    setActionError(null);
    setIsViewModalOpen(true);
    setIsActionLoading(true);

    try {
      const customer = await fetchCustomerById(customerId);

      if (!customer) {
        throw new Error("Customer details are unavailable.");
      }

      setActiveCustomer(customer);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to fetch customer details right now.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOpenEditModal = async (customerId: string) => {
    setActionError(null);
    setIsEditModalOpen(true);
    setIsActionLoading(true);

    try {
      const customer = await fetchCustomerById(customerId);

      if (!customer) {
        throw new Error("Customer details are unavailable.");
      }

      setActiveCustomer(customer);
      setEditFormData(toEditCustomerFormData(customer));
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to load customer for editing.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeCustomer) {
      setActionError("Customer details are unavailable.");
      return;
    }

    setActionError(null);
    setIsUpdatingCustomer(true);

    try {
      const trimmedName = editFormData.name.trim();
      const trimmedEmail = editFormData.email.trim();
      const trimmedPhone = editFormData.phone.trim();

      if (!trimmedName || !trimmedEmail || !trimmedPhone) {
        throw new Error("Name, email, and phone are required.");
      }

      const updatedCustomer = await updateCustomerById(activeCustomer.id, {
        name: trimmedName,
        email: trimmedEmail,
        password: editFormData.password.trim() || undefined,
        phone: trimmedPhone,
        address: editFormData.address.trim(),
        city: editFormData.city.trim(),
        state: editFormData.state.trim(),
        zipcode: editFormData.zipcode.trim(),
        country: editFormData.country.trim(),
        notes: editFormData.notes.trim(),
      });

      if (updatedCustomer) {
        setActiveCustomer(updatedCustomer);
      }

      await loadCustomers();
      setIsEditModalOpen(false);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to update customer right now.");
    } finally {
      setIsUpdatingCustomer(false);
    }
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    const confirmed = window.confirm(`Delete ${customer.name || "this customer"}? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setActionError(null);
    setIsDeletingCustomerId(customer.id);

    try {
      await deleteCustomerById(customer.id);
      await loadCustomers();

      if (activeCustomer?.id === customer.id) {
        setActiveCustomer(null);
        setIsViewModalOpen(false);
        setIsEditModalOpen(false);
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to delete customer right now.");
    } finally {
      setIsDeletingCustomerId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-[#0D0D0D] font-['Playfair_Display'] mb-2">Customers</h1>
          <p className="text-[#666666]">Manage corporate clients and accounts</p>
        </div>
        <button 
          onClick={() => navigate("/customers/add")}
          className="px-6 py-3 bg-[#00CFC5] text-white rounded-xl hover:bg-[#00CFC5]/90 transition-all flex items-center gap-2 shadow-sm font-medium">
          <UserPlus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="bg-[#F8F8F8] rounded-2xl p-6 border border-black/5 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#F8F8F8] rounded-2xl border border-black/5 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-black/10 flex items-center justify-between">
          <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display']">Customer Accounts</h2>
          <button
            type="button"
            onClick={() => void loadCustomers()}
            className="px-3 py-2 rounded-lg border border-black/10 text-sm text-[#0D0D0D] hover:bg-black/5"
          >
            Refresh
          </button>
        </div>

        {actionError && (
          <div className="px-6 pt-6">
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <div>
                <p className="font-medium">Customer action failed</p>
                <p className="text-sm mt-1">{actionError}</p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="p-8 flex items-center gap-2 text-[#666666]">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading customers...
          </div>
        ) : fetchError ? (
          <div className="p-8">
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <div>
                <p className="font-medium">Could not load customers</p>
                <p className="text-sm mt-1">{fetchError}</p>
              </div>
            </div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-[#666666]">
            {searchQuery.trim()
              ? "No customers match your search."
              : "No customers yet. Use Add Customer to create one."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="text-left text-sm text-[#666666] p-6 font-medium">Client Name</th>
                  <th className="text-left text-sm text-[#666666] p-6 font-medium">Email</th>
                  <th className="text-left text-sm text-[#666666] p-6 font-medium">Phone</th>
                  <th className="text-left text-sm text-[#666666] p-6 font-medium">Total Listings</th>
                  <th className="text-left text-sm text-[#666666] p-6 font-medium">Status</th>
                  <th className="text-left text-sm text-[#666666] p-6 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-black/5 hover:bg-white transition-colors"
                  >
                    <td className="p-6">
                      <span className="text-[#0D0D0D] font-medium">{customer.name || "-"}</span>
                    </td>
                    <td className="p-6">
                      <span className="text-[#666666]">{customer.email || "-"}</span>
                    </td>
                    <td className="p-6">
                      <span className="text-[#666666]">{customer.phone || "-"}</span>
                    </td>
                    <td className="p-6">
                      <span className="text-[#0D0D0D]">{customer.total_listings}</span>
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          customer.is_active
                            ? "bg-[#0E5E4F]/20 text-[#0E5E4F] border border-[#0E5E4F]/30"
                            : "bg-black/10 text-[#666666] border border-black/10"
                        }`}
                      >
                        {customer.is_active ? "active" : "inactive"}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void handleOpenViewModal(customer.id)}
                          className="p-2 hover:bg-black/5 rounded-lg transition-colors text-[#666666] hover:text-[#0D0D0D]"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleOpenEditModal(customer.id)}
                          className="p-2 hover:bg-black/5 rounded-lg transition-colors text-[#666666] hover:text-[#00CFC5]"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={isDeletingCustomerId === customer.id}
                          onClick={() => void handleDeleteCustomer(customer)}
                          className="p-2 hover:bg-black/5 rounded-lg transition-colors text-[#666666] hover:text-red-600 disabled:opacity-60"
                        >
                          {isDeletingCustomerId === customer.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isViewModalOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-black/10">
            <div className="p-6 border-b border-black/10 flex items-center justify-between">
              <h3 className="text-2xl text-[#0D0D0D] font-['Playfair_Display']">Customer Details</h3>
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="px-3 py-2 text-sm border border-black/10 rounded-lg hover:bg-black/5"
              >
                Close
              </button>
            </div>
            <div className="p-6">
              {isActionLoading ? (
                <div className="flex items-center gap-2 text-[#666666]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading customer details...
                </div>
              ) : activeCustomer ? (
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-[#666666]">Name</dt>
                    <dd className="text-[#0D0D0D] font-medium">{activeCustomer.name || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-[#666666]">Email</dt>
                    <dd className="text-[#0D0D0D] font-medium">{activeCustomer.email || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-[#666666]">Phone</dt>
                    <dd className="text-[#0D0D0D] font-medium">{activeCustomer.phone || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-[#666666]">Status</dt>
                    <dd className="text-[#0D0D0D] font-medium">
                      {activeCustomer.is_active ? "active" : "inactive"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#666666]">Address</dt>
                    <dd className="text-[#0D0D0D] font-medium">{activeCustomer.address || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-[#666666]">City</dt>
                    <dd className="text-[#0D0D0D] font-medium">{activeCustomer.city || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-[#666666]">State</dt>
                    <dd className="text-[#0D0D0D] font-medium">{activeCustomer.state || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-[#666666]">Zipcode</dt>
                    <dd className="text-[#0D0D0D] font-medium">{activeCustomer.zipcode || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-[#666666]">Country</dt>
                    <dd className="text-[#0D0D0D] font-medium">{activeCustomer.country || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-[#666666]">Listings</dt>
                    <dd className="text-[#0D0D0D] font-medium">{activeCustomer.total_listings}</dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="text-[#666666]">Notes</dt>
                    <dd className="text-[#0D0D0D] font-medium whitespace-pre-wrap">
                      {activeCustomer.notes || "-"}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="text-[#666666]">Customer details are unavailable.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-black/10 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-black/10 flex items-center justify-between">
              <h3 className="text-2xl text-[#0D0D0D] font-['Playfair_Display']">Edit Customer</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-3 py-2 text-sm border border-black/10 rounded-lg hover:bg-black/5"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleUpdateCustomer} className="p-6 space-y-4">
              {isActionLoading ? (
                <div className="flex items-center gap-2 text-[#666666]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading customer details...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditFormChange}
                      placeholder="Name"
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
                    />
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditFormChange}
                      placeholder="Email"
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
                    />
                    <input
                      type="password"
                      name="password"
                      value={editFormData.password}
                      onChange={handleEditFormChange}
                      placeholder="New password (optional)"
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
                    />
                    <input
                      type="text"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleEditFormChange}
                      placeholder="Phone"
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
                      name="zipcode"
                      value={editFormData.zipcode}
                      onChange={handleEditFormChange}
                      placeholder="Zipcode"
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
                    />
                    <input
                      type="text"
                      name="country"
                      value={editFormData.country}
                      onChange={handleEditFormChange}
                      placeholder="Country"
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D]"
                    />
                  </div>
                  <textarea
                    name="notes"
                    value={editFormData.notes}
                    onChange={handleEditFormChange}
                    placeholder="Notes"
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] resize-none"
                  />
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
                      disabled={isUpdatingCustomer}
                      className="px-4 py-2 bg-[#00CFC5] text-white rounded-lg hover:bg-[#00CFC5]/90 disabled:opacity-70"
                    >
                      {isUpdatingCustomer ? "Saving..." : "Save Changes"}
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