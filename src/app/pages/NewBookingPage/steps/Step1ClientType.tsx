import { Building2, Check, ChevronDown, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Step1Props {
  clientMode: "existing" | "corporation";
  handleSwitchMode: (mode: "existing" | "corporation") => void;
  clientSearch: string;
  setClientSearch: (value: string) => void;
  showClientDropdown: boolean;
  setShowClientDropdown: (value: boolean) => void;
  selectedClient: any;
  handleClearClient: () => void;
  filteredClients: any[];
  handleSelectExistingClient: (client: any) => void;
  formData: any;
  setFormData: (value: any) => void;
}

export function Step1ClientType({
  clientMode,
  handleSwitchMode,
  clientSearch,
  setClientSearch,
  showClientDropdown,
  setShowClientDropdown,
  selectedClient,
  handleClearClient,
  filteredClients,
  handleSelectExistingClient,
  formData,
  setFormData,
}: Step1Props) {
  return (
    <div>
      <h2 className="text-2xl text-[#0D0D0D] font-['Playfair_Display'] mb-6">Select Client Type</h2>
      <div className="flex items-center gap-1 p-1 bg-white border border-black/10 rounded-xl w-fit mb-6">
        <button
          onClick={() => handleSwitchMode("existing")}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            clientMode === "existing" ? "bg-[#00CFC5] text-white shadow-sm" : "text-[#666666] hover:text-[#0D0D0D]"
          }`}
        >
          Existing Customer
        </button>
        <button
          onClick={() => handleSwitchMode("corporation")}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            clientMode === "corporation" ? "bg-[#00CFC5] text-white shadow-sm" : "text-[#666666] hover:text-[#0D0D0D]"
          }`}
        >
          For Corporation (Myself)
        </button>
      </div>

      <AnimatePresence>
        {clientMode === "existing" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-6"
          >
            <label className="block text-sm text-[#666666] mb-2">Search Client</label>
            <div className="relative">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-[#999999] pointer-events-none" />
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    setShowClientDropdown(true);
                    if (!e.target.value) handleClearClient();
                  }}
                  onFocus={() => setShowClientDropdown(true)}
                  className="w-full pl-10 pr-10 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
                  placeholder="Search by name, email, or country..."
                />
                {selectedClient ? (
                  <button
                    onClick={handleClearClient}
                    className="absolute right-4 text-[#999999] hover:text-[#0D0D0D] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <ChevronDown className="absolute right-4 w-4 h-4 text-[#999999] pointer-events-none" />
                )}
              </div>
              <AnimatePresence>
                {showClientDropdown && !selectedClient && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-black/10 rounded-xl shadow-lg overflow-hidden"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <button
                          key={client.id}
                          onClick={() => handleSelectExistingClient(client)}
                          className="w-full px-4 py-3 text-left hover:bg-[#00CFC5]/5 transition-colors border-b border-black/5 last:border-0 flex items-center gap-3"
                        >
                          <div className="w-9 h-9 rounded-full bg-[#00CFC5]/15 flex items-center justify-center flex-shrink-0">
                            <span className="text-[#00CFC5] text-sm font-medium">
                              {client.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[#0D0D0D] text-sm font-medium truncate">{client.name}</p>
                            <p className="text-[#999999] text-xs truncate">{client.country} · {client.email}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-[#999999] text-sm">No clients found</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {selectedClient && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 p-4 bg-white border border-[#00CFC5]/30 rounded-xl flex items-center gap-4"
                >
                  <div className="w-11 h-11 rounded-full bg-[#00CFC5]/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#00CFC5] font-medium">
                      {selectedClient.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#0D0D0D] font-medium">{selectedClient.name}</p>
                    <p className="text-[#666666] text-sm">{selectedClient.country}</p>
                    <p className="text-[#999999] text-xs mt-0.5">
                      {selectedClient.email} · {selectedClient.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#00CFC5] text-sm font-medium flex-shrink-0">
                    <Check className="w-4 h-4" />
                    Selected
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {clientMode === "corporation" ? (
        <div className="p-6 bg-white border border-[#00CFC5]/30 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#00CFC5]/15 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#00CFC5]" />
            </div>
            <div>
              <p className="text-[#0D0D0D] font-medium text-lg">Corporate Listing</p>
              <p className="text-[#666666] text-sm">This property will be listed under your corporate account</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-[#F8F8F8] rounded-xl">
            <p className="text-sm text-[#666666]">
              Properties listed for your corporation will be managed directly under your corporate account and visible
              in your main property portfolio.
            </p>
          </div>
        </div>
      ) : (
        <div className={`grid grid-cols-2 gap-6 transition-opacity duration-200 ${clientMode === "existing" && selectedClient ? "opacity-60 pointer-events-none" : ""}`}>
          <div>
            <label className="block text-sm text-[#666666] mb-2">Client Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              readOnly={clientMode === "existing" && !!selectedClient}
              className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
              placeholder="Enter client name"
            />
          </div>
          <div>
            <label className="block text-sm text-[#666666] mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              readOnly={clientMode === "existing" && !!selectedClient}
              className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
              placeholder="email@company.com"
            />
          </div>
          <div>
            <label className="block text-sm text-[#666666] mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              readOnly={clientMode === "existing" && !!selectedClient}
              className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div>
            <label className="block text-sm text-[#666666] mb-2">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              readOnly={clientMode === "existing" && !!selectedClient}
              className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[#0D0D0D] placeholder:text-[#999999] focus:outline-none focus:border-[#00CFC5]/40"
              placeholder="Country"
            />
          </div>
        </div>
      )}

    </div>
  );
}
