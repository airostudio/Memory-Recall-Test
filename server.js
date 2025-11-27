/**
 * Emotional Intelligence Test - Backend Server
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
                test_type: 'emotional_intelligence_comprehensive'
            },
            receipt_email: user.email,
            description: 'Emotional Intelligence Test - Comprehensive EQ Assessment Results'
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
        const totalPoints =
            scores.selfawareness.points +
            scores.selfregulation.points +
            scores.motivation.points +
            scores.empathy.points +
            scores.socialskills.points;

        const totalPossible =
            scores.selfawareness.total +
            scores.selfregulation.total +
            scores.motivation.total +
            scores.empathy.total +
            scores.socialskills.total;

        const overallPercentage = Math.round((totalPoints / totalPossible) * 100);

        // Calculate percentile (simulated based on score)
        let percentile;
        if (overallPercentage >= 90) percentile = 95;
        else if (overallPercentage >= 80) percentile = 85;
        else if (overallPercentage >= 70) percentile = 70;
        else if (overallPercentage >= 60) percentile = 55;
        else if (overallPercentage >= 50) percentile = 40;
        else percentile = 25;

        // Determine performance level
        let performanceLevel, performanceColor, recommendations;
        if (overallPercentage >= 85) {
            performanceLevel = 'Exceptional EQ';
            performanceColor = '#4ECDC4';
            recommendations = [
                'Your emotional intelligence is exceptional! You have a natural gift for understanding emotions.',
                'Consider roles in leadership, counseling, HR, or any position requiring strong interpersonal skills.',
                'Share your EQ skills by mentoring others in emotional awareness.',
                'Continue developing by exploring advanced emotional intelligence topics like emotional coaching.'
            ];
        } else if (overallPercentage >= 70) {
            performanceLevel = 'Strong EQ';
            performanceColor = '#45b7d1';
            recommendations = [
                'You demonstrate strong emotional intelligence across most areas.',
                'Practice mindfulness meditation to enhance your self-awareness further.',
                'Work on active listening skills to deepen your empathy.',
                'Consider journaling to track emotional patterns and growth.'
            ];
        } else if (overallPercentage >= 50) {
            performanceLevel = 'Developing EQ';
            performanceColor = '#F8B500';
            recommendations = [
                'Your emotional intelligence is developing well with room for growth.',
                'Practice naming your emotions throughout the day to build self-awareness.',
                'Try the "pause and reflect" technique before responding in emotional situations.',
                'Read books on emotional intelligence to expand your understanding.'
            ];
        } else {
            performanceLevel = 'Growth Opportunity';
            performanceColor = '#FF6B9D';
            recommendations = [
                'This assessment highlights opportunities for emotional growth.',
                'Start a daily emotion journal to track how you feel and why.',
                'Practice deep breathing exercises when feeling overwhelmed.',
                'Consider working with a coach or therapist to develop EQ skills.',
                'Remember: EQ can be developed significantly with practice!'
            ];
        }

        // Generate email HTML
        const emailHTML = generateResultsEmail(user, scores, {
            totalPoints,
            totalPossible,
            overallPercentage,
            percentile,
            performanceLevel,
            performanceColor,
            recommendations
        });

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"EmotionIQ Test" <noreply@emotioniqtest.com>',
            to: user.email,
            subject: '💖 Your Emotional Intelligence Test Results Are Ready!',
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
    const { totalPoints, totalPossible, overallPercentage, percentile, performanceLevel, performanceColor, recommendations } = analysis;

    // Calculate individual test percentages
    const selfAwarenessPercent = Math.round((scores.selfawareness.points / scores.selfawareness.total) * 100);
    const selfRegulationPercent = Math.round((scores.selfregulation.points / scores.selfregulation.total) * 100);
    const motivationPercent = Math.round((scores.motivation.points / scores.motivation.total) * 100);
    const empathyPercent = Math.round((scores.empathy.points / scores.empathy.total) * 100);
    const socialSkillsPercent = Math.round((scores.socialskills.points / scores.socialskills.total) * 100);

    // Find strongest and weakest areas
    const testScores = [
        { name: 'Self-Awareness', percent: selfAwarenessPercent },
        { name: 'Self-Regulation', percent: selfRegulationPercent },
        { name: 'Motivation', percent: motivationPercent },
        { name: 'Empathy', percent: empathyPercent },
        { name: 'Social Skills', percent: socialSkillsPercent }
    ];
    const strongest = testScores.reduce((a, b) => a.percent > b.percent ? a : b);
    const weakest = testScores.reduce((a, b) => a.percent < b.percent ? a : b);

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emotional Intelligence Test Results</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #2d132c 0%, #1a0a1a 100%);">

        <!-- Header -->
        <div style="padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">💖 EmotionIQ Test</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0;">Your Emotional Intelligence Assessment Results</p>
        </div>

        <!-- Main Content -->
        <div style="background: white; border-radius: 20px 20px 0 0; padding: 40px 30px;">

            <!-- Greeting -->
            <p style="font-size: 18px; color: #1a1a2e; margin-bottom: 30px;">
                Hello <strong>${user.name}</strong>,<br><br>
                Thank you for completing the Emotional Intelligence Assessment. Here are your detailed results:
            </p>

            <!-- Overall Score -->
            <div style="background: linear-gradient(135deg, ${performanceColor}20, ${performanceColor}10); border-radius: 15px; padding: 30px; text-align: center; margin-bottom: 30px; border-left: 5px solid ${performanceColor};">
                <h2 style="margin: 0 0 10px 0; color: #1a1a2e;">Overall EQ Score</h2>
                <div style="font-size: 64px; font-weight: bold; color: ${performanceColor}; margin: 10px 0;">${overallPercentage}%</div>
                <div style="display: inline-block; padding: 8px 20px; background: ${performanceColor}; color: white; border-radius: 50px; font-weight: bold;">
                    ${performanceLevel}
                </div>
                <p style="color: #666; margin: 15px 0 0 0;">
                    You scored ${totalPoints} out of ${totalPossible} points
                </p>
                <p style="color: #888; margin: 10px 0 0 0; font-size: 14px;">
                    Top ${100 - percentile}% of test-takers
                </p>
            </div>

            <!-- Strengths & Weaknesses -->
            <div style="display: flex; gap: 15px; margin-bottom: 30px;">
                <div style="flex: 1; background: linear-gradient(135deg, #d4edda, #c3e6cb); border-radius: 10px; padding: 15px; text-align: center;">
                    <div style="font-size: 12px; color: #155724; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">💪 Strongest</div>
                    <div style="font-weight: bold; color: #155724;">${strongest.name}</div>
                    <div style="color: #155724; font-size: 14px;">${strongest.percent}%</div>
                </div>
                <div style="flex: 1; background: linear-gradient(135deg, #fff3cd, #ffeeba); border-radius: 10px; padding: 15px; text-align: center;">
                    <div style="font-size: 12px; color: #856404; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">📈 Growth Area</div>
                    <div style="font-weight: bold; color: #856404;">${weakest.name}</div>
                    <div style="color: #856404; font-size: 14px;">${weakest.percent}%</div>
                </div>
            </div>

            <!-- Individual Test Results -->
            <h3 style="color: #1a1a2e; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
                📊 Detailed EQ Breakdown
            </h3>

            <!-- Self-Awareness -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #1a1a2e;">🪞 Self-Awareness</strong>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Recognizing your own emotions</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: bold; color: #FF6B9D;">${scores.selfawareness.points}/${scores.selfawareness.total}</div>
                        <div style="color: #666; font-size: 14px;">${selfAwarenessPercent}%</div>
                    </div>
                </div>
                <div style="background: #e9ecef; border-radius: 10px; height: 8px; margin-top: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #FF6B9D, #C44569); height: 100%; width: ${selfAwarenessPercent}%; border-radius: 10px;"></div>
                </div>
            </div>

            <!-- Self-Regulation -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #1a1a2e;">🧘 Self-Regulation</strong>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Managing emotional responses</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: bold; color: #4ECDC4;">${scores.selfregulation.points}/${scores.selfregulation.total}</div>
                        <div style="color: #666; font-size: 14px;">${selfRegulationPercent}%</div>
                    </div>
                </div>
                <div style="background: #e9ecef; border-radius: 10px; height: 8px; margin-top: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #4ECDC4, #2C9F8F); height: 100%; width: ${selfRegulationPercent}%; border-radius: 10px;"></div>
                </div>
            </div>

            <!-- Motivation -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #1a1a2e;">🔥 Motivation</strong>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Inner drive & optimism</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: bold; color: #F8B500;">${scores.motivation.points}/${scores.motivation.total}</div>
                        <div style="color: #666; font-size: 14px;">${motivationPercent}%</div>
                    </div>
                </div>
                <div style="background: #e9ecef; border-radius: 10px; height: 8px; margin-top: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #F8B500, #FFA500); height: 100%; width: ${motivationPercent}%; border-radius: 10px;"></div>
                </div>
            </div>

            <!-- Empathy -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #1a1a2e;">💕 Empathy</strong>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Understanding others' feelings</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: bold; color: #FF9A9E;">${scores.empathy.points}/${scores.empathy.total}</div>
                        <div style="color: #666; font-size: 14px;">${empathyPercent}%</div>
                    </div>
                </div>
                <div style="background: #e9ecef; border-radius: 10px; height: 8px; margin-top: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #FF9A9E, #FECFEF); height: 100%; width: ${empathyPercent}%; border-radius: 10px;"></div>
                </div>
            </div>

            <!-- Social Skills -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 15px; margin-bottom: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #1a1a2e;">🤝 Social Skills</strong>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Building & managing relationships</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: bold; color: #9B59B6;">${scores.socialskills.points}/${scores.socialskills.total}</div>
                        <div style="color: #666; font-size: 14px;">${socialSkillsPercent}%</div>
                    </div>
                </div>
                <div style="background: #e9ecef; border-radius: 10px; height: 8px; margin-top: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #9B59B6, #8E44AD); height: 100%; width: ${socialSkillsPercent}%; border-radius: 10px;"></div>
                </div>
            </div>

            <!-- Recommendations -->
            <h3 style="color: #1a1a2e; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
                💡 Personalized Growth Recommendations
            </h3>
            <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
                ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>

            <!-- Understanding EQ -->
            <div style="background: linear-gradient(135deg, #fff5f8, #ffe0eb); border-radius: 15px; padding: 25px; margin-top: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #1a1a2e;">💖 Why Emotional Intelligence Matters</h3>
                <p style="color: #666; margin: 0; line-height: 1.8;">
                    Research shows that EQ is often more important than IQ for success in life and work.
                    People with high emotional intelligence tend to have better relationships, greater career success,
                    improved mental health, and more effective leadership abilities.
                    The good news? Unlike IQ, emotional intelligence can be developed throughout your lifetime!
                </p>
            </div>

            <!-- More Tests CTA -->
            <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 15px; padding: 25px; text-align: center; margin-top: 30px;">
                <h3 style="margin: 0 0 10px 0; color: #1a1a2e;">🎯 Discover More About Yourself</h3>
                <p style="color: #666; margin: 0 0 20px 0;">Explore our collection of 20+ specialized assessments</p>
                <a href="${process.env.APP_URL || 'http://localhost:3000'}" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #FF6B9D, #C44569); color: white; text-decoration: none; border-radius: 50px; font-weight: bold;">
                    View All Tests →
                </a>
            </div>

            <!-- What's Included -->
            <div style="margin-top: 30px; padding: 20px; background: #f0fdf4; border-radius: 10px;">
                <h4 style="margin: 0 0 15px 0; color: #1a1a2e;">📦 Other Tests Available:</h4>
                <ul style="color: #666; margin: 0; padding-left: 20px; line-height: 1.8;">
                    <li>Leadership Assessment</li>
                    <li>Stress Resilience Test</li>
                    <li>Communication Style Test</li>
                    <li>Conflict Resolution Assessment</li>
                    <li>Logical Reasoning Test</li>
                    <li>Complete Personality Profile</li>
                    <li>And 14 more specialized tests!</li>
                </ul>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #0f0518; padding: 30px; text-align: center;">
            <p style="color: rgba(255,255,255,0.8); margin: 0 0 15px 0; font-size: 14px;">
                💖 EmotionIQ Test - World-Class Emotional Intelligence Assessments
            </p>
            <p style="color: rgba(255,255,255,0.5); margin: 0; font-size: 12px;">
                © ${new Date().getFullYear()} EmotionIQ Test. All rights reserved.<br>
                This assessment measures emotional intelligence for personal development purposes.
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
║   💖 EmotionIQ Test Server                               ║
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
