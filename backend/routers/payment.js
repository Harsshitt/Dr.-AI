import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = express.Router();

// Initialize Razorpay
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
} else {
    console.warn("⚠️ RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing.");
}

// POST /api/payment/create-payment-link
router.post("/create-payment-link", async (req, res) => {
    try {
        const { origin, email = "user@example.com", name = "User Name", phone = "9999999999" } = req.body;

        if (!razorpay) {
            return res.status(503).json({ error: "Payment gateway not configured (Razorpay keys missing)." });
        }

        const options = {
            amount: 79900, // ₹799.00
            currency: "INR",
            accept_partial: false,
            description: "Dr. AI Pro Access (1 Month)",
            customer: {
                name: name,
                email: email,
                contact: phone
            },
            notify: {
                sms: true,
                email: true
            },
            reminder_enable: true,
            notes: {
                policy_name: "Dr. AI Pro"
            },
            callback_url: `${origin}/payment/success`, // Razorpay redirects here with payment details
            callback_method: "get"
        };

        const paymentLink = await razorpay.paymentLink.create(options);
        res.json({ url: paymentLink.short_url, id: paymentLink.id });

    } catch (error) {
        console.error("Razorpay Link Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/payment/verify
router.post("/verify", async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_payment_link_id, razorpay_payment_link_reference_id, razorpay_payment_link_status, razorpay_signature } = req.body;

        // For Payment Links, the signature verification is slightly different or relies on webhook usually.
        // But if redirected with fields, we can reconstruct the signature logic if Razorpay provides secret.
        // However, standard Razorpay Payment Link redirect params include:
        // razorpay_payment_id, razorpay_payment_link_id, razorpay_payment_link_reference_id, razorpay_payment_link_status, razorpay_signature

        const body = razorpay_payment_link_id + "|" + razorpay_payment_link_reference_id + "|" + razorpay_payment_link_status + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        // The redirect signature verification rule for Payment Link:
        // https://razorpay.com/docs/api/payment-links/#callback-url-parameters
        // Only if razorpay_signature is present.

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic && razorpay_payment_link_status === 'paid') {
            // In a real app, verify status is 'paid'
            res.json({
                success: true,
                message: "Payment verified successfully"
            });
        } else {
            // Fallback: If signature check fails (sometimes format differs), trust 'paid' status for MVP if signature missing
            // STRICTLY speaking, we MUST match signature. 
            // Let's assume passed signature matches body construction.

            if (isAuthentic) {
                res.json({ success: true, message: "Verified" });
            } else {
                console.warn("Signature mismatch", { expectedSignature, razorpay_signature, body });
                res.status(400).json({ success: false, message: "Invalid payment signature" });
            }
        }
    } catch (error) {
        console.error("Verify Error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
