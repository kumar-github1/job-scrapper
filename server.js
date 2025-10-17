require('dotenv').config();
const nodemailer = require('nodemailer');
const axios = require('axios');
const fs = require('fs');

// Configuration
const CONFIG = {
    email: process.env.EMAIL,
    appPassword: process.env.APP_PASSWORD,
    geminiApiKey: process.env.GEMINI_API_KEY, // Get from https://aistudio.google.com/app/apikeys
    targetEmail: process.env.TARGET_EMAIL,
    checkInterval: 24 * 60 * 60 * 1000,
    jobsDatabase: 'sent_jobs.json'
};

// Email transporter with timeout and connection settings for cloud hosting
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: CONFIG.email,
        pass: CONFIG.appPassword
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000,
    socketTimeout: 60000
});

// Priority companies - These will be checked first and send immediate alerts
const PRIORITY_COMPANIES = [
    'amazon'
];

// All companies - Tech companies hiring freshers in India
const COMPANIES = [
    'ab inbev', 'abacus ai', 'abb', 'abhibus', 'accenture', 'accolite', 'achnet', 'acko',
    'adani digital labs', 'adobe', 'advantage club', 'aftershoot', 'aidash', 'air asia technology centre',
    'airbus', 'airtel', 'airtelxlabs', 'ajio', 'akamai technologies', 'allen', 'allen digital',
    'alphagrep securities', 'amadeus', 'amadeus labs', 'amagi', 'amazon', 'amd', 'amdocs',
    'american express', 'angel one', 'apollo 24x7', 'appdirect', 'apple', 'applied materials',
    'appviewx', 'aqr capital management', 'arcesium', 'arista networks', 'arm', 'arzooo',
    'atlassian', 'attentive os', 'aurigo software technologies', 'autodesk', 'avalara', 'avaya',
    'awiros', 'axis bank', 'axtria', 'axxela', 'azcom', 'baazar voice', 'bain and company',
    'bajaj finserv', 'baker hughes', 'bank of new york', 'barclays', 'bastian solutions',
    'baxter', 'beaconstac', 'belzabar', 'bharatpe', 'bidgely', 'bigbasket', 'birdeye',
    'bizongo', 'blinkit', 'bloomberg', 'bny mellon', 'bounce', 'bp', 'brane enterprises',
    'brevan howard', 'brew money', 'bright money', 'broadcom', 'buyhatke', 'byju', 'c2fo',
    'caastle', 'carelon global solutions', 'carestack', 'cars24', 'cashfree', 'catamaran ventures',
    'caterpillar', 'celigo', 'ceremorphic', 'chargebee', 'chegg', 'chqbook', 'chronus software',
    'chubb', 'ciena', 'cisco', 'citi', 'citibank', 'citrix', 'cleartax', 'clevertap',
    'cloudera', 'clumio', 'cme group', 'codenation', 'cognizant', 'cogoport', 'cohesity',
    'coinbase', 'coindcx', 'commvault', 'compass', 'confluent', 'contentstack', 'cradlepoint',
    'cred', 'credit suisse', 'cult fit', 'cvent', 'cyware labs', 'd e shaw', 'd kraft',
    'darwinbox', 'databricks', 'dealshare', 'decimal point analytics', 'deepen ai', 'dehaat',
    'deliveroo', 'dell', 'deloitte', 'designing solutions', 'deutsche bank', 'deutsche telekom digital labs',
    'directi', 'discovery', 'dish networks', 'disney', 'dp world', 'dream11', 'dremio',
    'druva', 'dtici', 'dunzo', 'edfora infotech', 'edgeverve', 'editorialist yx', 'eightfold ai',
    'endurance international group', 'energy exemplar', 'enfusion', 'enlyft', 'enphase energy',
    'epam systems', 'eq technologies', 'ericsson', 'everstage', 'exotel', 'expedia', 'fanatics',
    'fanclash', 'fareye', 'fastenal', 'fico', 'fidelity investments', 'flipkart', 'flock',
    'flyfin', 'fractal', 'freecharge', 'freescale', 'frontdoor', 'futures first', 'fynd',
    'gainsight', 'gameskraft', 'games24x7', 'ge digital', 'ge healthcare', 'general electric',
    'genpact', 'gep worldwide', 'glean', 'globallogic', 'gojek', 'goldman sachs', 'gomechanic',
    'google', 'grab', 'graviton research capital', 'grofers', 'groupon', 'groww', 'gupshup',
    'harman', 'harness', 'hdfc bank', 'headout', 'hewlett packard enterprises', 'hike',
    'honeywell', 'hp inc', 'hpe', 'hyperface technologies', 'hypersonix', 'ibm', 'icici bank',
    'idfc first bank', 'igl', 'increff', 'indeed', 'indiagold', 'indiamart', 'indianic infotech',
    'indmoney', 'infinx', 'info edge', 'infosys', 'inframarket', 'inmobi', 'innoplexus',
    'innovaccer', 'instabase', 'insurancedekho', 'interface', 'intuit', 'ion group',
    'iragecapital', 'iss', 'itc limited', 'ittiam systems', 'ivy', 'ixigo', 'jaguar land rover',
    'jar', 'jfrog', 'jio', 'jiocinema', 'jiosaavn', 'jivox', 'josh technology', 'joveo',
    'jp morgan chase', 'jubilant foodworks', 'junglee games', 'juniper networks', 'juspay',
    'karza technologies', 'keeptruckin', 'kickdrum', 'kivi capital', 'kla tencor', 'komprise',
    'l&t technology services', 'lam research', 'lambdatest', 'leena ai', 'letstransport',
    'licious', 'limechat', 'linkedin', 'livspace', 'logicboot it solutions', 'lowe', 'lti',
    'madover games', 'maersk', 'magicpin', 'majid al futtaim', 'makemytrip', 'maq software',
    'mastercard', 'mathworks', 'mcafee', 'mckinley rice', 'mckinsey', 'media net', 'meesho',
    'memechat', 'mentor graphics', 'mercedes benz r&d', 'micon', 'microchip', 'micron',
    'microsoft', 'millennium management', 'mindtickle', 'modeln', 'moengage', 'monarch tractor',
    'moneyview', 'morgan stanley', 'morphle labs', 'motorq', 'moveinsync', 'mpl', 'mtx group',
    'mu sigma', 'mx player', 'myntra', 'n k securities', 'narvar', 'national instruments',
    'natwest group', 'navi', 'ncr corporation', 'netapp', 'newfold digital', 'newzera',
    'nexthink', 'nference', 'ninjacart', 'nium', 'npci', 'nurture farm', 'nutanix', 'nvidia',
    'nxp', 'nykaa', 'oci', 'ofbusiness', 'ofss', 'ola', 'olx', 'onedirect', 'oneplus',
    'onlinesales ai', 'open financial', 'oppo', 'optmyzr', 'optum', 'oracle', 'oyo',
    'paisabazaar', 'palo alto networks', 'park', 'paypal', 'paytm', 'payu', 'people interactive',
    'pharmeasy', 'philips', 'phonepe', 'pine labs', 'planetspark', 'playsimple games', 'pocketfm',
    'pocketpills', 'policyadvisor', 'policybazaar', 'poshmark', 'posist technologies', 'procol',
    'providence global center', 'publicis sapient', 'pubmatic', 'pure storage', 'q2 software',
    'qoala', 'quadeye securities', 'qualcomm', 'qualys', 'quantbox', 'qube research and technologies',
    'quicksell', 'quizizz', 'radisys', 'rakuten india', 'rategain', 'razorpay', 'rebel foods',
    'reliance', 'renesas electronics', 'ring central', 'rippling', 'rivigo', 'rubrik', 'rupeek',
    'sabre', 'safe security', 'sailpoint', 'salesforce', 'samagra governance', 'samsung',
    'sandvine', 'sap', 'scry analytics', 'searce', 'sentinelone', 'servicenow', 'sharechat',
    'shipmnts', 'shipsy', 'shl', 'siemens', 'siemens healthineers', 'sigfig', 'sigmoid analytics',
    'silicon labs', 'silicon valley bank', 'simsim', 'sixt', 'slice', 'smartcoin financials',
    'societe generale', 'sophos', 'source one', 'sourcefuse technologies', 'spinny', 'splashlearn',
    'splunk', 'sprinklr', 'squadstack', 'sri', 'standard chartered', 'stanza living', 'stashfin',
    'stockx', 'strand', 'stripe', 'sugar fit', 'sumo logic', 'swiggy', 'swimlane', 'swym technologies',
    'syfe', 'synopsys', 't system', 'takion', 'tala', 'target', 'tata 1mg', 'tavisca',
    'tejas networks', 'tekion', 'telstra', 'teradata', 'tesco', 'texas instruments', 'thoughtspot',
    'thoughtworks', 'tiket com', 'times internet', 'titan', 'toppr', 'torcai', 'tower research capital',
    'traceable ai', 'travel triangle', 'trexquant', 'trifacta', 'trilogy innovations', 'truminds',
    'turtlemint', 'twilio', 'twitter', 'uber', 'ubs', 'udaan', 'uhg optum', 'ula',
    'ultimate kronos group', 'unacademy', 'unbxd', 'unicommerce', 'upstox', 'uptycs', 'urban company',
    'urjanet', 'veritas', 'vinculum solutions', 'virohan', 'visa', 'vmware', 'vymo', 'wadhwani ai',
    'walmart', 'wayfair', 'wells fargo', 'western digital', 'wework', 'wheelseye', 'whitehat jr',
    'winjit technologies', 'winzo', 'wipro', 'yellow ai', 'yugabyte', 'yulu', 'zamora innovation',
    'zebpay', 'zee entertainment', 'zee5', 'zeel', 'zenon', 'zeotap', 'zepto', 'zestmoney',
    'zeta', 'zolostays', 'zomato', 'zs associates', 'zscaler', 'zuora', 'accrete ai', 'alteryx',
    'codequotient', 'couchbase', 'couture ai', 'covered by sage', 'credavenue', 'delhivery',
    'dolat capitals', 'edgefocus partners', 'epsilon', 'fi money', 'finmechanics india', 'fivetran',
    'fleetx', 'flyhomes', 'kla', 'mathysis', 'mavenir', 'metadome', 'netradyne', 'meta',
    'netflix', 'piramal retail finance', 'porter', 'quillbot', 'ramp', 'rsa security', 'setu',
    'star health', 'telekom', 'tessell', 'turvo', 'versa networks'
];

function loadSentJobs() {
    try {
        if (fs.existsSync(CONFIG.jobsDatabase)) {
            return JSON.parse(fs.readFileSync(CONFIG.jobsDatabase, 'utf8'));
        }
    } catch (e) {
        console.log('No previous jobs database found');
    }
    return {};
}

function saveSentJobs(jobs) {
    fs.writeFileSync(CONFIG.jobsDatabase, JSON.stringify(jobs, null, 2));
}

// Search for jobs using Gemini AI
async function searchJobsWithGemini(batchCompanies) {
    try {
        const companiesStr = batchCompanies.join(', ');

        const prompt = `You are a job search expert. Search for FRESHER SOFTWARE ENGINEERING job openings ONLY for the following companies: ${companiesStr}

CRITICAL REQUIREMENTS - Only include jobs that match ALL of these:

1. **Job Roles (Software Engineering ONLY):**
   - SDE (Software Development Engineer)
   - SWE (Software Engineer)
   - SDET (Software Development Engineer in Test)
   - MTS (Member of Technical Staff)
   - Graduate Trainee (Software/Engineering)
   - SDE Intern
   - Software Engineer Intern
   - University Graduate - Software
   - Associate Software Engineer
   - Junior Software Engineer
   - Backend Developer
   - Frontend Developer
   - Full Stack Developer
   - Mobile App Developer
   - QA Engineer / Test Engineer

2. **Experience Level:**
   - 0 YOE (0 Years of Experience)
   - Fresher
   - New Grad
   - University Graduate
   - Entry Level

3. **Location (MANDATORY):**
   - ONLY jobs in India (Bangalore, Mumbai, Delhi, Hyderabad, Pune, Chennai, Noida, Gurgaon, etc.)
   - OR Remote positions
   - EXCLUDE all non-India locations unless Remote

IMPORTANT: Return ONLY valid JSON, nothing else. No markdown, no explanations.

Return format:
{
  "jobs": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "role": "SDE/SWE/SDET/MTS/etc",
      "experience": "0 YOE / Fresher / New Grad",
      "location": "India City Name / Remote",
      "link": "direct job application link if found"
    }
  ],
  "searchDate": "${new Date().toISOString()}"
}

If no jobs found for a company, still include it with empty jobs array.
Return at least 2-3 jobs per company if available.`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${CONFIG.geminiApiKey}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        if (response.data.candidates && response.data.candidates[0]) {
            const content = response.data.candidates[0].content.parts[0].text;

            // Extract JSON from response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const result = JSON.parse(jsonMatch[0]);
                    return result.jobs || [];
                } catch (e) {
                    console.log('❌ Failed to parse Gemini response');
                    return [];
                }
            }
        }
        return [];
    } catch (error) {
        if (error.response?.status === 400) {
            console.log(`⚠ Gemini API Error: Invalid request - ${error.response.data.error.message}`);
        } else if (error.response?.status === 429) {
            console.log('⚠ Gemini API: Rate limited - waiting 60 seconds...');
            await new Promise(resolve => setTimeout(resolve, 60000));
        } else {
            console.log(`⚠ Gemini API Error: ${error.message}`);
        }
        return [];
    }
}

// Main scraping function
async function findNewJobs(companiesList, isPriority = false) {
    const sentJobs = loadSentJobs();
    const newJobs = [];

    const label = isPriority ? '🔥 PRIORITY' : '📋 REGULAR';
    console.log(`\n[${new Date().toISOString()}] ${label} job search started...\n`);

    // Process companies in batches of 5
    const batchSize = 5;
    for (let i = 0; i < companiesList.length; i += batchSize) {
        const batch = companiesList.slice(i, i + batchSize);
        console.log(`[${i + 1}/${companiesList.length}] Searching: ${batch.join(', ')}...`);

        try {
            const jobs = await searchJobsWithGemini(batch);

            if (jobs.length > 0) {
                console.log(`  ✓ Found ${jobs.length} jobs\n`);
            } else {
                console.log(`  ❌ No jobs found\n`);
            }

            for (const job of jobs) {
                const jobKey = `${job.company}_${job.title}_${job.location}`;

                if (!sentJobs[jobKey]) {
                    newJobs.push(job);
                    sentJobs[jobKey] = new Date().toISOString();
                }
            }

            // Rate limiting between batches
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.log(`⚠ Batch error: ${error.message}\n`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    saveSentJobs(sentJobs);
    console.log(`\n✅ ${label} search complete. Found ${newJobs.length} new jobs!\n`);
    return newJobs;
}

// Format email
function formatEmailHTML(jobs) {
    if (jobs.length === 0) {
        return `
      <h2>🔍 Job Search Report</h2>
      <p>No new fresher/graduate roles found in the last 24 hours.</p>
      <p><small>Searched using Gemini AI across ${COMPANIES.length} companies</small></p>
    `;
    }

    const jobsHTML = jobs.map((job, idx) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #ddd;">
        <strong>${idx + 1}. ${job.title}</strong><br>
        <small style="color: #666;">${job.company}</small>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd;">
        <small>${job.role || 'Developer'}</small>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd;">
        <small>${job.location || 'N/A'}</small>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd;">
        ${job.link ? `<a href="${job.link}" style="color: #0066cc; text-decoration: none;">Apply →</a>` : 'Search careers'}
      </td>
    </tr>
  `).join('');

    return `
    <h2>🎯 New Fresher/Graduate Roles Found!</h2>
    <p>Found <strong>${jobs.length}</strong> new positions (Fresher/0 YOE, Remote/India)</p>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-family: Arial, sans-serif;">
      <tr style="background-color: #f0f0f0;">
        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Position & Company</th>
        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Role</th>
        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Location</th>
        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Apply</th>
      </tr>
      ${jobsHTML}
    </table>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    <p style="font-size: 12px; color: #666;">
      🤖 Powered by Gemini AI | Searched ${COMPANIES.length} companies | ${new Date().toLocaleString()}
    </p>
  `;
}

// Send email with retry logic
async function sendEmail(jobs, isPriority = false) {
    const prefix = isPriority ? '🔥 PRIORITY ALERT' : '📋 Job Alert';
    const mailOptions = {
        from: CONFIG.email,
        to: CONFIG.targetEmail,
        subject: `[${prefix}] ${jobs.length} New Fresher Software Roles - ${new Date().toLocaleDateString()}`,
        html: formatEmailHTML(jobs)
    };

    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            console.log(`📧 Attempting to send email... (Attempt ${retryCount + 1}/${maxRetries})`);
            await transporter.sendMail(mailOptions);
            console.log(`✅ Email sent successfully to ${CONFIG.targetEmail}\n`);
            return; // Success, exit function
        } catch (error) {
            retryCount++;
            console.log(`❌ Email attempt ${retryCount} failed: ${error.message}`);

            if (retryCount < maxRetries) {
                const waitTime = retryCount * 5000; // Wait 5s, then 10s, then 15s
                console.log(`⏳ Waiting ${waitTime / 1000}s before retry...\n`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
                console.log(`❌ Failed to send email after ${maxRetries} attempts\n`);
                console.log(`   Error: ${error.message}\n`);
            }
        }
    }
}

// Main execution
async function main() {
    console.log('🤖 Gemini-Powered Job Scraper Started');
    console.log(`📧 Sending alerts to: ${CONFIG.targetEmail}`);
    console.log(`🏢 Tracking ${COMPANIES.length} companies`);
    console.log(`⏱️  Check interval: Every 24 hours\n`);

    // Validate configuration
    if (!CONFIG.geminiApiKey) {
        console.log('❌ ERROR: Please set your Gemini API key in .env file\n');
        console.log('Steps:');
        console.log('1. Go to https://aistudio.google.com/app/apikeys');
        console.log('2. Click "Create API Key"');
        console.log('3. Add GEMINI_API_KEY=your_key to .env file\n');
        return;
    }

    if (!CONFIG.email || !CONFIG.appPassword) {
        console.log('❌ ERROR: Please set EMAIL and APP_PASSWORD in .env file\n');
        return;
    }

    if (!CONFIG.targetEmail) {
        console.log('❌ ERROR: Please set TARGET_EMAIL in .env file\n');
        return;
    }

    // Get non-priority companies (remove priority ones from main list)
    const prioritySet = new Set(PRIORITY_COMPANIES);
    const regularCompanies = COMPANIES.filter(c => !prioritySet.has(c));

    console.log(`🔥 Priority companies: ${PRIORITY_COMPANIES.length}`);
    console.log(`📋 Regular companies: ${regularCompanies.length}`);
    console.log(`📊 Total companies: ${PRIORITY_COMPANIES.length + regularCompanies.length}\n`);

    // Run immediately - Priority companies first
    console.log('⚡ Step 1: Searching priority companies...');
    const priorityJobs = await findNewJobs(PRIORITY_COMPANIES, true);

    if (priorityJobs.length > 0) {
        console.log(`🚀 IMMEDIATE ALERT: Found ${priorityJobs.length} jobs in priority companies!`);
        await sendEmail(priorityJobs, true);
    } else {
        console.log('No priority jobs found in this round.\n');
    }

    // Then search regular companies
    console.log('⚡ Step 2: Searching regular companies...');
    const regularJobs = await findNewJobs(regularCompanies, false);

    if (regularJobs.length > 0) {
        console.log(`📧 Sending regular job alert: ${regularJobs.length} jobs found`);
        await sendEmail(regularJobs, false);
    } else {
        console.log('No regular jobs found in this round.\n');
    }

    // Schedule every 24 hours
    setInterval(async () => {
        console.log('\n' + '='.repeat(80));
        console.log('🔄 Starting scheduled job search...\n');

        // Priority companies first
        const priorityJobs = await findNewJobs(PRIORITY_COMPANIES, true);
        if (priorityJobs.length > 0) {
            console.log(`🚀 IMMEDIATE ALERT: Found ${priorityJobs.length} jobs in priority companies!`);
            await sendEmail(priorityJobs, true);
        }

        // Then regular companies
        const regularJobs = await findNewJobs(regularCompanies, false);
        if (regularJobs.length > 0) {
            await sendEmail(regularJobs, false);
        }
    }, CONFIG.checkInterval);
}

main().catch(console.error);