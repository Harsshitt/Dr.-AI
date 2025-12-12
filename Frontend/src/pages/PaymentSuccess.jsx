import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("verifying"); // verifying | success | error

    useEffect(() => {
        const verifyPayment = async () => {
            const sessionId = searchParams.get("session_id");
            if (!sessionId) {
                setStatus("error");
                return;
            }

            try {
                const res = await fetch("http://localhost:5001/api/payment/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionId }),
                });
                const data = await res.json();

                if (data.verified) {
                    // Activate Pro locally
                    localStorage.setItem("dr_ai_pro", "true");

                    // Update User Object if exists
                    const userStr = localStorage.getItem("dr_ai_user");
                    if (userStr) {
                        const user = JSON.parse(userStr);
                        user.isPro = true;
                        localStorage.setItem("dr_ai_user", JSON.stringify(user));
                    }

                    setStatus("success");
                    setTimeout(() => navigate("/chat"), 3000);
                } else {
                    setStatus("error");
                }
            } catch (err) {
                console.error(err);
                setStatus("error");
            }
        };

        verifyPayment();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white rounded-3xl p-8 shadow-xl max-w-sm w-full text-center">
                {status === "verifying" && (
                    <>
                        <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-900">Verifying Payment...</h2>
                        <p className="text-slate-500 mt-2">Please wait a moment.</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-emerald-700">Payment Successful!</h2>
                        <p className="text-slate-600 mt-2">Welcome to Dr. AI Pro.</p>
                        <p className="text-slate-400 text-sm mt-4">Redirecting to chat...</p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-red-700">Payment Failed</h2>
                        <p className="text-slate-600 mt-2">We couldn't verify your payment.</p>
                        <button onClick={() => navigate("/upgrade")} className="mt-6 w-full py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200">
                            Try Again
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
