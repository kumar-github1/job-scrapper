require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🧪 Testing Email Configuration...\n');

// Test 1: Check environment variables
console.log('📋 Step 1: Checking Environment Variables');
console.log(`EMAIL: ${process.env.EMAIL ? '✅ Set' : '❌ Missing'}`);
console.log(`APP_PASSWORD: ${process.env.APP_PASSWORD ? '✅ Set' : '❌ Missing'}`);
console.log(`TARGET_EMAIL: ${process.env.TARGET_EMAIL ? '✅ Set' : '❌ Missing'}\n`);

if (!process.env.EMAIL || !process.env.APP_PASSWORD || !process.env.TARGET_EMAIL) {
    console.log('❌ ERROR: Environment variables are missing!\n');
    process.exit(1);
}

// Test 2: Test SMTP connection
console.log('📋 Step 2: Testing SMTP Connection...\n');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    debug: true, // Enable debug output
    logger: true  // Log to console
});

// Test 3: Verify connection
console.log('📋 Step 3: Verifying SMTP Connection...\n');
transporter.verify(function(error, success) {
    if (error) {
        console.log('❌ SMTP Connection Failed:');
        console.log(error.message);
        console.log('\n🔧 Possible Solutions:');
        console.log('1. Use Gmail App Password (not regular password)');
        console.log('   - Go to: https://myaccount.google.com/apppasswords');
        console.log('   - Enable 2-Step Verification first');
        console.log('   - Generate App Password for "Mail"');
        console.log('2. Check if EMAIL matches the account that generated the App Password');
        console.log('3. Ensure APP_PASSWORD has no spaces\n');
    } else {
        console.log('✅ SMTP Connection Successful!\n');

        // Test 4: Send actual test email
        console.log('📋 Step 4: Sending Test Email...\n');

        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.TARGET_EMAIL,
            subject: '🧪 Test Email from Job Scraper',
            html: `
                <h2>✅ Email Configuration Works!</h2>
                <p>Your job scraper email is configured correctly.</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>From:</strong> ${process.env.EMAIL}</p>
                <p><strong>To:</strong> ${process.env.TARGET_EMAIL}</p>
                <hr>
                <p><small>This is a test email. Your job alerts will look different.</small></p>
            `
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log('❌ Email Send Failed:');
                console.log(error.message);
                console.log('\n🔧 This usually means:');
                console.log('- Gmail is blocking the connection from cloud IPs');
                console.log('- Solution: Use Gmail App Password (not regular password)');
                console.log('- Already using App Password? Regenerate a new one\n');
            } else {
                console.log('✅ Email Sent Successfully!');
                console.log(`Message ID: ${info.messageId}`);
                console.log(`\n📧 Check ${process.env.TARGET_EMAIL} for the test email!\n`);
                console.log('🎉 Your email configuration is working perfectly!');
                console.log('You can now deploy to Railway with confidence.\n');
            }
        });
    }
});
