import { X, AlertCircle, DollarSign, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RefundPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RefundPolicyModal({ isOpen, onClose }: RefundPolicyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50"
          >
            <div className="bg-[#1C1C1C] rounded-2xl border border-[#27F5E8]/20 p-8 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#27F5E8]/10 flex items-center justify-center border border-[#27F5E8]/30">
                    <AlertCircle className="w-6 h-6 text-[#27F5E8]" />
                  </div>
                  <div>
                    <h2 className="text-2xl text-white font-['Playfair_Display']">
                      Refund Policy
                    </h2>
                    <p className="text-white/60 text-sm">Cancellation terms and conditions</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Policy Content */}
              <div className="space-y-6">
                {/* Policy Card 1 */}
                <div className="bg-[#0D0D0D] rounded-xl p-6 border border-[#0E5E4F]/20">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#0E5E4F]/20 flex items-center justify-center border border-[#0E5E4F]/30">
                      <Calendar className="w-5 h-5 text-[#0E5E4F]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg text-white font-medium mb-2">
                        Cancellation 15+ Days Before Move-in
                      </h3>
                      <p className="text-white/70 text-sm mb-3">
                        If you cancel your booking 15 days or more before the scheduled move-in
                        date:
                      </p>
                      <div className="bg-[#0E5E4F]/10 rounded-lg p-4 border border-[#0E5E4F]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-[#0E5E4F]" />
                          <span className="text-[#0E5E4F] font-medium">
                            Half month rent will be charged
                          </span>
                        </div>
                        <p className="text-white/60 text-sm">
                          Example: For a $2,000/month property, you'll be charged $1,000
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Policy Card 2 */}
                <div className="bg-[#0D0D0D] rounded-xl p-6 border border-[#B3261E]/20">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#B3261E]/20 flex items-center justify-center border border-[#B3261E]/30">
                      <AlertCircle className="w-5 h-5 text-[#B3261E]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg text-white font-medium mb-2">
                        Cancellation Less Than 15 Days Before Move-in
                      </h3>
                      <p className="text-white/70 text-sm mb-3">
                        If you cancel your booking less than 15 days before the scheduled
                        move-in date:
                      </p>
                      <div className="bg-[#B3261E]/10 rounded-lg p-4 border border-[#B3261E]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-[#B3261E]" />
                          <span className="text-[#B3261E] font-medium">
                            One full month rent will be charged
                          </span>
                        </div>
                        <p className="text-white/60 text-sm">
                          Example: For a $2,000/month property, you'll be charged $2,000
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Terms */}
                <div className="bg-[#0D0D0D] rounded-xl p-6 border border-[#27F5E8]/20">
                  <h3 className="text-white font-medium mb-3">Additional Terms</h3>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-[#27F5E8] mt-1">•</span>
                      <span>Processing fees are non-refundable in all cases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#27F5E8] mt-1">•</span>
                      <span>
                        Refunds will be processed within 7-10 business days to the original
                        payment method
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#27F5E8] mt-1">•</span>
                      <span>
                        For corporate bookings, refund credits may be applied to your account
                        balance
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#27F5E8] mt-1">•</span>
                      <span>Special circumstances may be reviewed on a case-by-case basis</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-[#27F5E8]/20 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-white/20 text-white/70 rounded-xl hover:border-[#27F5E8]/40 hover:text-white transition-all"
                >
                  Close
                </button>
                <button className="px-6 py-3 bg-[#27F5E8] text-[#0D0D0D] rounded-xl hover:bg-[#27F5E8]/90 transition-all">
                  I Understand
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
