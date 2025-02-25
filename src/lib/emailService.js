// src/lib/emailService.js
import nodemailer from 'nodemailer';

// Configure your email transporter - **IMPORTANT: Replace placeholders with your actual email service credentials**
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,       // e.g., 'smtp.gmail.com' or your SMTP server address
    port: process.env.EMAIL_PORT,       // e.g., 465 for SSL, 587 for TLS (check your service provider)
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for ports > 587 - or use STARTTLS options. Process env should be string 'true' or 'false'
    auth: {
        user: process.env.EMAIL_USER,       // Your email address (sender email)
        pass: process.env.EMAIL_PASSWORD,   // Your email password or an "app password" (if using Gmail and 2FA)
    },
});

/**
 * Sends an email using Nodemailer.
 *
 * @param {object} options - Email options.
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Email subject.
 * @param {string} options.html - Email body in HTML format.
 * @returns {Promise<boolean>} - True if email sent successfully, false otherwise.
 */
export async function sendEmail({ to, subject, html }) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address (configured in transporter, but can be overridden here)
            to: to,                     // Recipient address
            subject: subject,             // Email subject
            html: html,                   // Email body in HTML
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId, info.response); // Log success details
        return true; // Email sent successfully

    } catch (error) {
        console.error("Error sending email:", error);
        // In a production environment, you might want to handle errors more gracefully (e.g., logging to a dedicated error tracking service)
        return false; // Email sending failed
    }
}

// Example usage (for testing - you can remove this later):
// async function main() {
//     const emailSent = await sendEmail({
//         to: 'recipient@example.com', // Replace with a real recipient email for testing
//         subject: 'Test Email from Nodemailer',
//         html: '<p>This is a test email sent from Nodemailer in your Next.js app.</p>'
//     });

//     if (emailSent) {
//         console.log('Test email was sent successfully!');
//     } else {
//         console.error('Failed to send test email.');
//     }
// }

// if (process.env.NODE_ENV !== 'production') { // Only run test email in development to avoid accidental sending
//     // main().catch(console.error);
// }