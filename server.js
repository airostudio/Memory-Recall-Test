/**
 * Memory Recall Test - Backend Server
 * Handles Stripe payments and email delivery of results
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');

// Initialize Stripe with secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// Email Configuration
// ============================================

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// ============================================
// API Routes
// ============================================

// Get Stripe publishable key
app.get('/api/config', (req, res) => {
    res.json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here'
    });
});

// Create payment intent
app.post('/api/create-payment-intent', async (req, res) => {
    try {
        const { user, scores } = req.body;

        // Create a payment intent for $2.99
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 299, // Amount in cents
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true
            },
            metadata: {
                customer_name: user.name,
                customer_email: user.email,
                customer_phone: user.phone,
                test_type: 'memory_recall_comprehensive'
            },
            receipt_email: user.email,
            description: 'Memory Recall Test - Comprehensive Assessment Results'
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

// Send results email
app.post('/api/send-results', async (req, res) => {
    try {
        const { user, scores } = req.body;

        // Calculate overall score
        const totalCorrect =
            scores.islt.correct +
            scores.adas.correct +
            scores.lm.correct +
            scores.skt.correct +
            scores.skt.recall +
            scores.sage.correct;

        const totalPossible =
            scores.islt.total +
            scores.adas.total +
            scores.lm.total +
            scores.skt.total +
            8 + // SKT recall
            scores.sage.total;

        const overallPercentage = Math.round((totalCorrect / totalPossible) * 100);

        // Determine performance level
        let performanceLevel, performanceColor, recommendations;
        if (overallPercentage >= 85) {
            performanceLevel = 'Excellent';
            performanceColor = '#4ecdc4';
            recommendations = [
                'Your memory function is excellent!',
                'Continue brain-healthy activities like reading and puzzles',
                'Maintain regular physical exercise',
                'Keep social connections active'
            ];
        } else if (overallPercentage >= 70) {
            performanceLevel = 'Good';
            performanceColor = '#45b7d1';
            recommendations = [
                'Your memory function is above average',
                'Try memory exercises like visualization techniques',
                'Consider brain-training apps for maintenance',
                'Ensure adequate sleep for memory consolidation'
            ];
        } else if (overallPercentage >= 50) {
            performanceLevel = 'Average';
            performanceColor = '#f9ca24';
            recommendations = [
                'Your memory function is within normal range',
                'Practice memory techniques like chunking',
                'Use mnemonic devices for better recall',
                'Consider stress reduction techniques'
            ];
        } else {
            performanceLevel = 'Below Average';
            performanceColor = '#ff6b6b';
            recommendations = [
                'Consider retaking the test when well-rested',
                'Consult a healthcare professional if concerned',
                'Practice daily memory exercises',
                'Reduce distractions during learning'
            ];
        }

        // Generate email HTML
        const emailHTML = generateResultsEmail(user, scores, {
            totalCorrect,
            totalPossible,
            overallPercentage,
            performanceLevel,
            performanceColor,
            recommendations
        });

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"Memory Recall Test" <noreply@memoryrecalltest.com>',
            to: user.email,
            subject: '🧠 Your Memory Recall Test Results Are Ready!',
            html: emailHTML
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error sending results email:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

// ============================================
// Email Template Generator
// ============================================

function generateResultsEmail(user, scores, analysis) {
    const { totalCorrect, totalPossible, overallPercentage, performanceLevel, performanceColor, recommendations } = analysis;

    // Calculate individual test percentages
    const isltPercent = Math.round((scores.islt.correct / scores.islt.total) * 100);
    const adasPercent = Math.round((scores.adas.correct / scores.adas.total) * 100);
    const lmPercent = Math.round((scores.lm.correct / scores.lm.total) * 100);
    const sktNamingPercent = Math.round((scores.skt.correct / scores.skt.total) * 100);
    const sktRecallPercent = Math.round((scores.skt.recall / 8) * 100);
    const sagePercent = Math.round((scores.sage.correct / scores.sage.total) * 100);

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Memory Recall Test Results</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">

        <!-- Header -->
        <div style="padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🧠 Memory Recall Test</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0;">Your Comprehensive Results</p>
        </div>

        <!-- Main Content -->
        <div style="background: white; border-radius: 20px 20px 0 0; padding: 40px 30px;">

            <!-- Greeting -->
            <p style="font-size: 18px; color: #1a1a2e; margin-bottom: 30px;">
                Hello <strong>${user.name}</strong>,<br><br>
                Thank you for completing the Memory Recall Assessment. Here are your detailed results:
            </p>

            <!-- Overall Score -->
            <div style="background: linear-gradient(135deg, ${performanceColor}20, ${performanceColor}10); border-radius: 15px; padding: 30px; text-align: center; margin-bottom: 30px; border-left: 5px solid ${performanceColor};">
                <h2 style="margin: 0 0 10px 0; color: #1a1a2e;">Overall Performance</h2>
                <div style="font-size: 64px; font-weight: bold; color: ${performanceColor}; margin: 10px 0;">${overallPercentage}%</div>
                <div style="display: inline-block; padding: 8px 20px; background: ${performanceColor}; color: white; border-radius: 50px; font-weight: bold;">
                    ${performanceLevel}
                </div>
                <p style="color: #666; margin: 15px 0 0 0;">
                    You scored ${totalCorrect} out of ${totalPossible} points
                </p>
            </div>

            <!-- Individual Test Results -->
            <h3 style="color: #1a1a2e; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
                📊 Test Breakdown
            </h3>

            <!-- ISLT -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #1a1a2e;">🛒 ISLT Shopping List</strong>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Items recalled from shopping list</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: bold; color: #667eea;">${scores.islt.correct}/${scores.islt.total}</div>
                        <div style="color: #666; font-size: 14px;">${isltPercent}%</div>
                    </div>
                </div>
            </div>

            <!-- ADAS-Cog -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #1a1a2e;">📝 ADAS-Cog Word Recall</strong>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">10-word memory test</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: bold; color: #764ba2;">${scores.adas.correct}/${scores.adas.total}</div>
                        <div style="color: #666; font-size: 14px;">${adasPercent}%</div>
                    </div>
                </div>
            </div>

            <!-- Logical Memory -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #1a1a2e;">📖 Logical Memory</strong>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Story comprehension & recall</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: bold; color: #4facfe;">${scores.lm.correct}/${scores.lm.total}</div>
                        <div style="color: #666; font-size: 14px;">${lmPercent}%</div>
                    </div>
                </div>
            </div>

            <!-- SKT -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #1a1a2e;">⏱️ SKT Speed Test</strong>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Naming: ${scores.skt.correct}/${scores.skt.total} | Recall: ${scores.skt.recall}/8</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: bold; color: #fa709a;">${scores.skt.speed.toFixed(1)}s</div>
                        <div style="color: #666; font-size: 14px;">Total time</div>
                    </div>
                </div>
            </div>

            <!-- SAGE -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 15px; margin-bottom: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #1a1a2e;">🎯 SAGE Assessment</strong>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Cognitive evaluation</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: bold; color: #f093fb;">${scores.sage.correct}/${scores.sage.total}</div>
                        <div style="color: #666; font-size: 14px;">${sagePercent}%</div>
                    </div>
                </div>
            </div>

            <!-- Recommendations -->
            <h3 style="color: #1a1a2e; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
                💡 Personalized Recommendations
            </h3>
            <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
                ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>

            <!-- More Tests CTA -->
            <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 15px; padding: 25px; text-align: center; margin-top: 30px;">
                <h3 style="margin: 0 0 10px 0; color: #1a1a2e;">🎯 Discover More About Your Mind</h3>
                <p style="color: #666; margin: 0 0 20px 0;">Explore our collection of 20+ specialized cognitive assessments</p>
                <a href="${process.env.APP_URL || 'http://localhost:3000'}" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; border-radius: 50px; font-weight: bold;">
                    View All Tests →
                </a>
            </div>

            <!-- What's Included -->
            <div style="margin-top: 30px; padding: 20px; background: #f0fdf4; border-radius: 10px;">
                <h4 style="margin: 0 0 15px 0; color: #1a1a2e;">📦 Your Assessment Includes:</h4>
                <ul style="color: #666; margin: 0; padding-left: 20px;">
                    <li>Attention & Focus Assessment</li>
                    <li>Visual Memory Evaluation</li>
                    <li>Working Memory Analysis</li>
                    <li>Processing Speed Measurement</li>
                    <li>Executive Function Testing</li>
                    <li>And 15 more cognitive tests!</li>
                </ul>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #0f0f23; padding: 30px; text-align: center;">
            <p style="color: rgba(255,255,255,0.8); margin: 0 0 15px 0; font-size: 14px;">
                🧠 Memory Recall Test - Scientifically Designed Cognitive Assessments
            </p>
            <p style="color: rgba(255,255,255,0.5); margin: 0; font-size: 12px;">
                © ${new Date().getFullYear()} Memory Recall Test. All rights reserved.<br>
                This assessment is for informational purposes only and is not a medical diagnosis.
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

// ============================================
// Stripe Webhook Handler
// ============================================

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('Payment succeeded:', paymentIntent.id);
            // Additional processing can be done here
            break;
        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log('Payment failed:', failedPayment.id);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

// ============================================
// Health Check
// ============================================

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// ============================================
// Catch-all route for SPA
// ============================================

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🧠 Memory Recall Test Server                           ║
║                                                          ║
║   Server running on http://localhost:${PORT}               ║
║                                                          ║
║   Endpoints:                                             ║
║   - GET  /api/config          - Stripe config            ║
║   - POST /api/create-payment-intent - Create payment     ║
║   - POST /api/send-results    - Send email results       ║
║   - GET  /api/health          - Health check             ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
