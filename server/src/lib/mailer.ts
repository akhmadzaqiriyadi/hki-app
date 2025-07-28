// server/src/lib/mailer.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '465', 10),
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

interface MailOptions {
    to: string;
    subject: string;
    text: string;
    html: string;
}

export const sendMail = async (options: MailOptions) => {
    try {
        const info = await transporter.sendMail({
            from: `"Sentra HKI UTY" <${process.env.EMAIL_USER}>`,
            ...options,
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Gagal mengirim email.');
    }
};