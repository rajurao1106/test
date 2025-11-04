import nodemailer from 'nodemailer';

// 1. Configure the transporter using environment variables
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

/**
 * Sends a password reset email.
 * @param {string} toEmail - The recipient's email address.
 * @param {string} token - The password reset token.
 */
export const sendResetEmail = async (toEmail, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/?token=${token}#reset`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Password Reset Request',
        html: `
            <h1>Password Reset</h1>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <p><a href="${resetUrl}">Reset Password Link</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request this, please ignore this email.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${toEmail}`);
    } catch (error) {
        console.error(`Error sending email to ${toEmail}:`, error);
        throw new Error('Failed to send reset email. Check server logs.');
    }
};
