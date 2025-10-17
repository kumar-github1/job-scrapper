require('dotenv').config();
const { Resend } = require('resend');

console.log('🧪 Testing Resend Email...\n');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
    try {
        console.log('Sending test email via Resend...');

        const { data, error } = await resend.emails.send({
            from: 'Job Scraper <onboarding@resend.dev>',
            to: process.env.TARGET_EMAIL,
            subject: '✅ Resend Test - Job Scraper Works!',
            html: `
                <h2>🎉 Success!</h2>
                <p>Your Resend integration is working perfectly!</p>
                <p><strong>From:</strong> Job Scraper</p>
                <p><strong>To:</strong> ${process.env.TARGET_EMAIL}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <hr>
                <h3>✅ This means:</h3>
                <ul>
                    <li>Resend API key is valid</li>
                    <li>Email delivery is working</li>
                    <li>Your Railway app will work perfectly!</li>
                </ul>
                <p><strong>Next step:</strong> Deploy to Railway and enjoy automated job alerts!</p>
            `
        });

        if (error) {
            console.log('❌ FAILED:', error.message);
            console.log('\n💡 Common issues:');
            console.log('1. Invalid RESEND_API_KEY');
            console.log('2. Target email is invalid');
            console.log('3. Resend account not verified');
        } else {
            console.log('✅ SUCCESS! Email sent via Resend!');
            console.log(`Email ID: ${data.id}`);
            console.log(`\n📧 Check ${process.env.TARGET_EMAIL} for the email!`);
            console.log('\n🎉 Perfect! Resend is working!');
            console.log('\n📝 For Railway, set these environment variables:');
            console.log('   RESEND_API_KEY=' + process.env.RESEND_API_KEY);
            console.log('   TARGET_EMAIL=' + process.env.TARGET_EMAIL);
            console.log('   GEMINI_API_KEY=' + process.env.GEMINI_API_KEY);
            console.log('   EMAIL=' + process.env.EMAIL);
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

testEmail();
