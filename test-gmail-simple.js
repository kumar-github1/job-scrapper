require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Testing Gmail configuration...\n');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    }
});

transporter.sendMail({
    from: process.env.EMAIL,
    to: process.env.TARGET_EMAIL,
    subject: 'Test from Job Scraper',
    text: 'If you receive this, Gmail is working!'
}, (error, info) => {
    if (error) {
        console.log('❌ FAILED:', error.message);
    } else {
        console.log('✅ SUCCESS! Email sent:', info.messageId);
        console.log('\n📧 This works locally.');
        console.log('🚨 But Railway may still block it due to cloud IP restrictions.');
        console.log('\n💡 BEST SOLUTION: Use Resend (see USE_RESEND.md)');
    }
});
