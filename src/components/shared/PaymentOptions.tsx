import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banknote, Clock, Layers, ArrowRight, ArrowLeft, Loader } from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────────────────────

export function formatNaira(amount: number): string {
  return '₦' + Math.round(amount).toLocaleString('en-NG');
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PaymentOptionsProps {
  totalNaira: number;
  isProcessing: boolean;
  onPayNow: () => void;
  onPayLater: () => void;
  onInstallmentPayNow: (installmentAmount: number, installmentCount: number) => void;
  onInstallmentPayLater: (installmentAmount: number, installmentCount: number) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PaymentOptions({
  totalNaira,
  isProcessing,
  onPayNow,
  onPayLater,
  onInstallmentPayNow,
  onInstallmentPayLater,
}: PaymentOptionsProps) {
  const [view, setView] = useState<'options' | 'installment'>('options');
  const [installmentCount, setInstallmentCount] = useState(2);
  const installmentAmount = Math.ceil(totalNaira / installmentCount);

  return (
    <AnimatePresence mode="wait">
      {view === 'options' && (
        <motion.div
          key="options"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <div className="text-center mb-6">
            <div className="text-sm text-gray-500 mb-1">Total Amount</div>
            <div className="text-3xl font-bold text-[#D4AF37]">{formatNaira(totalNaira)}</div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Pay Now */}
            <button
              type="button"
              onClick={onPayNow}
              disabled={isProcessing}
              className="group flex items-center gap-4 p-6 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] rounded-xl text-left hover:shadow-xl transition-all disabled:opacity-50"
            >
              <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center flex-shrink-0">
                {isProcessing ? <Loader className="w-6 h-6 text-black animate-spin" /> : <Banknote className="w-6 h-6 text-black" />}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-black">Pay Now</h4>
                <p className="text-sm text-black/70">Complete full payment immediately via Lotus Bank</p>
              </div>
              <ArrowRight className="w-5 h-5 text-black/60 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Pay Later */}
            <button
              type="button"
              onClick={onPayLater}
              disabled={isProcessing}
              className="group flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl text-left hover:border-[#D4AF37] hover:shadow-lg transition-all disabled:opacity-50"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900">Pay Later</h4>
                <p className="text-sm text-gray-600">Submit your booking and pay at a later time</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Pay Small Small */}
            <button
              type="button"
              onClick={() => setView('installment')}
              disabled={isProcessing}
              className="group flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl text-left hover:border-[#D4AF37] hover:shadow-lg transition-all disabled:opacity-50"
            >
              <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Layers className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900">Pay Small Small</h4>
                <p className="text-sm text-gray-600">Split your payment into installments with Libragold PSS</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-2">
            <span>Payments Powered & Secured By</span>
            <span className="font-semibold text-[#D4AF37]">Lotus Bank</span>
          </div>
        </motion.div>
      )}

      {view === 'installment' && (
        <motion.div
          key="installment"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Libragold PSS</h3>
            <p className="text-gray-600 mt-1">Pay Small Small — split your cost into equal installments</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <span className="text-gray-600">Total Amount</span>
            <span className="text-xl font-bold text-gray-900">{formatNaira(totalNaira)}</span>
          </div>

          <div className="bg-white border-2 border-[#D4AF37]/30 rounded-xl p-6 space-y-4">
            <label className="block text-sm font-semibold text-gray-900">
              How many installments do you want to pay?
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={2}
                max={12}
                value={installmentCount}
                onChange={(e) => setInstallmentCount(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />
              <div className="w-16 text-center">
                <span className="text-2xl font-bold text-[#D4AF37]">{installmentCount}</span>
                <div className="text-xs text-gray-500">times</div>
              </div>
            </div>
            <div className="bg-[#D4AF37]/5 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">You pay per installment</div>
              <div className="text-3xl font-bold text-[#D4AF37]">{formatNaira(installmentAmount)}</div>
              <div className="text-xs text-gray-500 mt-1">
                {installmentCount} payments of {formatNaira(installmentAmount)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onInstallmentPayNow(installmentAmount, installmentCount)}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] text-black font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isProcessing ? <Loader className="w-4 h-4 animate-spin" /> : <Banknote className="w-5 h-5" />}
              Make First Payment Now
            </button>
            <button
              type="button"
              onClick={() => onInstallmentPayLater(installmentAmount, installmentCount)}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-[#D4AF37] hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isProcessing ? <Loader className="w-4 h-4 animate-spin" /> : <Clock className="w-5 h-5" />}
              Start Payment Later
            </button>
          </div>

          <button
            type="button"
            onClick={() => setView('options')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Payment Options
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
