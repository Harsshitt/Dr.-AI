import express from "express";
import Stripe from "stripe";

const router = express.Router();

// Initialize Stripe (Fail gracefully if key is missing)
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
    console.warn("⚠️ STRIPE_SECRET_KEY is missing. Payments will fail.");
}

// POST /api/payment/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
    try {
        const { origin } = req.body; // e.g. "http://localhost:5173"

        // HYBRID MODE: If Stripe is not configured, redirect to Mock Checkout
        if (!stripe) {
            console.log("⚠️ Stripe missing, redirecting to Mock Checkout");
            return res.json({ url: `${origin}/payment/mock-checkout` });
        }

        const session = await stripe.checkout.sessions.create({
            ui_mode: 'hosted',
            line_items: [
                {
                    price_data: {
                        currency: "inr", // Required for UPI
                        product_data: {
                            name: "Dr. AI Pro Access (1 Month)",
                            description: "Unlimited Access to Premium Health Tools",
                            images: ["https://cdn-icons-png.flaticon.com/512/3774/3774299.png"],
                        },
                        unit_amount: 79900, // ₹799.00 (~$9)
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/upgrade`,
            billing_address_collection: 'required',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/payment/verify
router.post("/verify", async (req, res) => {
    try {
        const { sessionId } = req.body;

        // HYBRID MODE: Verify Mock Session
        if (!stripe || (sessionId && sessionId.startsWith("mock_"))) {
            console.log(`[Payment] Verifying Mock Session: ${sessionId}`);
            return res.json({ verified: true });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            // In a real app, update DB here
            res.json({ verified: true });
        } else {
            res.json({ verified: false });
        }
    } catch (error) {
        console.error("Verify Error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
