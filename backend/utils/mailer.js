import nodemailer from "nodemailer";

// Configure Nodemailer transporter
const getTransporter = () => {
    const user = process.env.EMAIL_USER;
    // Remove spaces from app password just in case
    const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';

    if (!user || !pass) {
        console.warn("⚠️ EMAIL_USER or EMAIL_PASS not set in .env");
        return null;
    }

    console.log(`[Mailer] Configuring for user: ${user}`);

    return nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
        debug: true, // Enable debug output
        logger: true  // Log information to console
    });
};

export const sendEmail = async (to, subject, text) => {
    const transporter = getTransporter();

    if (!transporter) {
        console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Body: ${text}`);
        return false;
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent: " + info.response);
        return true;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        // Fallback log
        console.log(`[FALLBACK EMAIL LOG] To: ${to} | OTP: ${text}`);
        return false;
    }
};
