
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Copy, CreditCard, Landmark, QrCode, Smartphone, SmartphoneNfc, CheckCircle2, ShieldCheck, Lock } from "lucide-react";

export default function MockCheckout() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [method, setMethod] = useState("upi"); // upi | qr | netbanking | card

    // Mock States
    const [upiId, setUpiId] = useState("");
    const [bank, setBank] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const handlePayment = () => {
        setLoading(true);
        // Simulate network delay
        setTimeout(() => {
            // Redirect to success with a mock session ID
            window.location.href = `${window.location.origin}/payment/success?session_id=mock_${Date.now()}`;
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 flex justify-center items-start">
            <div className="w-full max-w-4xl grid md:grid-cols-3 gap-8">

                {/* Left: Checkout Form */}
                <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            <span className="font-semibold">Secure Checkout</span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono">256-BIT ENCRYPTION</div>
                    </div>

                    <div className="p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-6">Select Payment Method</h2>

                        {/* Payment Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                            {[
                                { id: "upi", label: "UPI", icon: <Smartphone className="w-4 h-4" /> },
                                { id: "qr", label: "QR Code", icon: <QrCode className="w-4 h-4" /> },
                                { id: "netbanking", label: "Netbanking", icon: <Landmark className="w-4 h-4" /> },
                                { id: "card", label: "Card", icon: <CreditCard className="w-4 h-4" /> }
                            ].map(m => (
                                <button
                                    key={m.id}
                                    onClick={() => setMethod(m.id)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border
                                        ${method === m.id
                                            ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm"
                                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}
                                    `}
                                >
                                    {m.icon}
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        {/* Payment Content */}
                        <div className="min-h-[300px]">

                            {/* UPI */}
                            {method === "upi" && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                                        <SmartphoneNfc className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-bold text-emerald-800">Pay via UPI</h4>
                                            <p className="text-xs text-emerald-600 mt-1">Accept requests from Google Pay, PhonePe, Paytm, BHIM, etc.</p>
                                        </div>
                                    </div>
                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700">Enter UPI ID</span>
                                        <input
                                            type="text"
                                            placeholder="mobile-number@upi"
                                            value={upiId}
                                            onChange={e => setUpiId(e.target.value)}
                                            className="mt-1 w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">e.g. 9876543210@ybl, username@oksbi</p>
                                    </label>
                                    <button
                                        onClick={handlePayment}
                                        disabled={loading || !upiId}
                                        className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
                                    >
                                        {loading ? "Requesting Payment..." : "Verify & Pay"}
                                    </button>
                                </div>
                            )}

                            {/* QR Code */}
                            {method === "qr" && (
                                <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 py-4">
                                    <div className="text-center">
                                        <h4 className="font-bold text-slate-900">Scan QR to Pay</h4>
                                        <p className="text-sm text-slate-500">Use any UPI app to scan this code</p>
                                    </div>
                                    <div className="relative group">
                                        <div className="w-48 h-48 bg-white p-2 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                                            {/* Fake QR Pattern */}
                                            <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Dr.AI-Payment-Mock')] bg-cover bg-no-repeat opacity-90 group-hover:opacity-100 transition-opacity"></div>

                                            {/* Center Logo Overlay */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 shadow-md">
                                                <div className="w-full h-full bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs">AI</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 opacity-70 grayscale">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/1200px-Google_Pay_Logo.svg.png" className="h-4" alt="GPay" />
                                        <img src="https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png" className="h-6" alt="PhonePe" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png" className="h-3" alt="Paytm" />
                                    </div>
                                    <button
                                        onClick={handlePayment}
                                        disabled={loading}
                                        className="w-full max-w-xs py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                                    >
                                        {loading ? "Checking Status..." : "I have paid"}
                                    </button>
                                </div>
                            )}

                            {/* Netbanking */}
                            {method === "netbanking" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="grid grid-cols-2 gap-3">
                                        {["HDFC Bank", "SBI", "ICICI Bank", "Axis Bank", "Kotak", "Yes Bank"].map(b => (
                                            <button
                                                key={b}
                                                onClick={() => setBank(b)}
                                                className={`
                                                    p-3 rounded-xl border text-left text-sm font-medium transition-all
                                                    ${bank === b ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500" : "border-slate-200 hover:border-slate-300 text-slate-600"}
                                                `}
                                            >
                                                {b}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-slate-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-white px-2 text-slate-500">Or select other bank</span>
                                        </div>
                                    </div>
                                    <select
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                                        onChange={(e) => setBank(e.target.value)}
                                        value={bank}
                                    >
                                        <option value="">Select a different bank</option>
                                        <option value="pnb">Punjab National Bank</option>
                                        <option value="bob">Bank of Baroda</option>
                                        <option value="indus">IndusInd Bank</option>
                                    </select>
                                    <button
                                        onClick={handlePayment}
                                        disabled={loading || !bank}
                                        className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
                                    >
                                        {loading ? "Redirecting to Bank..." : `Pay via ${bank || 'Netbanking'}`}
                                    </button>
                                </div>
                            )}

                            {/* Card */}
                            {method === "card" && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700">Card Number</span>
                                        <div className="relative mt-1">
                                            <input
                                                type="text"
                                                placeholder="0000 0000 0000 0000"
                                                value={cardNumber}
                                                onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                                            />
                                            <CreditCard className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
                                        </div>
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700">Expiry</span>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                value={expiry}
                                                onChange={e => setExpiry(e.target.value)}
                                                className="mt-1 w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                                            />
                                        </label>
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700">CVV</span>
                                            <div className="relative mt-1">
                                                <input
                                                    type="password"
                                                    placeholder="123"
                                                    value={cvv}
                                                    onChange={e => setCvv(e.target.value.substring(0, 3))}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                                                />
                                                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                                            </div>
                                        </label>
                                    </div>
                                    <button
                                        onClick={handlePayment}
                                        disabled={loading || cardNumber.length < 16 || cvv.length < 3}
                                        className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
                                    >
                                        {loading ? "Processing..." : "Pay ₹799.00"}
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Right: Order Summary */}
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-4">Order Summary</h3>
                        <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-100">
                            <div>
                                <div className="font-medium text-slate-900">Dr. AI Pro Access</div>
                                <div className="text-xs text-slate-500">1 Month Plan</div>
                            </div>
                            <div className="font-medium text-slate-900">₹799.00</div>
                        </div>
                        <div className="flex justify-between items-center text-sm mb-2 text-slate-600">
                            <div>Subtotal</div>
                            <div>₹799.00</div>
                        </div>
                        <div className="flex justify-between items-center text-sm mb-4 text-slate-600">
                            <div>Tax (18% GST)</div>
                            <div>Included</div>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold text-slate-900 pt-2 border-t border-slate-100">
                            <div>Total</div>
                            <div>₹799.00</div>
                        </div>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex gap-3 items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-emerald-800">
                            <span className="font-semibold block mb-0.5">Mock Payment Mode</span>
                            This is a simulated secure environment for demonstration purposes. No real money will be deducted.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
