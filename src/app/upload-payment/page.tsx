"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Upload, ArrowLeft, CheckCircle2, Shield, Scan, Edit2, Sparkles, CreditCard
} from 'lucide-react';

export default function UploadPaymentPage() {
  const [playerName, setPlayerName] = useState('Elias Solomon Kassa');
  const [parentPhone, setParentPhone] = useState('+251912334455');
  const [paymentMethod, setPaymentMethod] = useState<'Telebirr' | 'CBE Birr' | 'Bank Transfer'>('Telebirr');
  const [amount, setAmount] = useState('5000');
  
  const [imageUploaded, setImageUploaded] = useState(false);
  const [ocrScanning, setOcrScanning] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isEditingTxn, setIsEditingTxn] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSimulatedUpload = async () => {
    setImageUploaded(true);
    setOcrScanning(true);

    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: 'receipt_cbe_telebirr.png', text: paymentMethod })
      }).then(r => r.json());

      if (res.success && res.data) {
        setTransactionId(res.data.extractedTransactionId);
        setConfidence(res.data.confidence);
      }
    } catch (err) {
      setTransactionId(`TXN-${Math.floor(1000000 + Math.random()*9000000)}`);
    } finally {
      setOcrScanning(false);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId) return;

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName,
          parentName: 'Parent Applicant',
          parentPhone,
          amount: Number(amount),
          type: 'REGISTRATION',
          transactionId,
          paymentMethod,
          screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
        })
      }).then(r => r.json());

      if (res.success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <Link href="/login" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
          <span className="font-extrabold text-brand-orange text-lg">Bulbula Amen FC</span>
        </div>

        {submitted ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-xl">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Payment Proof Submitted!</h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Your payment receipt with Transaction ID <strong className="text-brand-orange">{transactionId}</strong> ({amount} ETB) has been sent to our Finance Department.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
              Status: <span className="text-amber-600 font-bold uppercase">UNDER VERIFICATION</span>
            </div>
            <Link href="/login" className="inline-block px-6 py-3 bg-brand-orange text-white font-bold rounded-xl text-sm hover:bg-brand-orange-dark shadow-md">
              Return to Login
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase text-brand-orange tracking-widest mb-1">
                <Sparkles className="w-4 h-4" /> Upload Receipt Screenshot
              </div>
              <h1 className="text-3xl font-black text-slate-900">Payment Proof & Verification</h1>
              <p className="text-slate-500 text-sm mt-1">Upload Telebirr or CBE Birr screenshot to extract transaction ID automatically.</p>
            </div>

            {/* Official Payment Accounts Info Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold uppercase text-slate-600 block flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-brand-orange" /> Official Bulbula Amen FC Accounts
              </span>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-500 block">Telebirr Account</span>
                  <span className="font-extrabold text-brand-orange text-sm">10002938481</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-500 block">CBE Account</span>
                  <span className="font-extrabold text-blue-600 text-sm">1000123456789</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Player Full Name *</label>
                  <input 
                    type="text" 
                    required
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-brand-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parent Phone Number *</label>
                  <input 
                    type="text" 
                    required
                    value={parentPhone}
                    onChange={e => setParentPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Channel *</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-brand-orange focus:outline-none"
                  >
                    <option value="Telebirr">Telebirr</option>
                    <option value="CBE Birr">CBE Birr</option>
                    <option value="Bank Transfer">Commercial Bank of Ethiopia (CBE)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amount Paid (ETB) *</label>
                  <input 
                    type="number" 
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              {/* Upload Screenshot Area */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Payment Proof Screenshot *</label>
                {!imageUploaded ? (
                  <div 
                    onClick={handleSimulatedUpload}
                    className="p-8 border-2 border-dashed border-slate-300 hover:border-brand-orange rounded-2xl text-center cursor-pointer bg-slate-50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-brand-orange mx-auto mb-2" />
                    <span className="font-bold text-sm text-slate-900 block">Click to upload screenshot receipt</span>
                    <span className="text-xs text-slate-500">OCR scanner will automatically detect the transaction reference ID</span>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150&auto=format&fit=crop&q=80" 
                        alt="Receipt" 
                        className="w-16 h-16 object-cover rounded-xl border border-slate-200"
                      />
                      <div className="flex-1">
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Screenshot Uploaded
                        </span>
                        <span className="text-xs text-slate-500 block">receipt_telebirr.png (340 KB)</span>
                      </div>
                      <button 
                        type="button"
                        onClick={handleSimulatedUpload}
                        className="text-xs text-slate-500 hover:text-slate-900 underline"
                      >
                        Re-upload
                      </button>
                    </div>

                    {/* OCR Scan Result Box */}
                    <div className="p-4 rounded-xl bg-orange-50/80 border border-brand-orange/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-orange uppercase flex items-center gap-1">
                          <Scan className="w-4 h-4" /> OCR Detected Transaction ID
                        </span>
                        {ocrScanning && <span className="text-xs text-amber-600 animate-pulse font-bold">Scanning canvas...</span>}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        {isEditingTxn ? (
                          <input 
                            type="text" 
                            value={transactionId}
                            onChange={e => setTransactionId(e.target.value)}
                            className="px-3 py-1 bg-white border border-brand-orange text-slate-900 rounded text-sm font-mono w-full"
                          />
                        ) : (
                          <span className="text-xl font-black font-mono text-slate-900">
                            {transactionId || "Extracting..."}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => setIsEditingTxn(!isEditingTxn)}
                          className="px-2.5 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded hover:bg-slate-100 flex items-center gap-1 shadow-xs"
                        >
                          <Edit2 className="w-3 h-3" /> {isEditingTxn ? "Save" : "Edit"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!transactionId}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 text-white font-extrabold text-sm hover:shadow-xl shadow-brand-orange/30 disabled:opacity-50 transition-all"
              >
                Submit Payment for Verification
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
