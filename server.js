/**
 * Logical Reasoning Test - Backend Server
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

        // Create a payment intent for $1.99
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 199, // Amount in cents
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true
            },
            metadata: {
                customer_name: user.name,
                customer_email: user.email,
                customer_phone: user.phone,
                test_type: 'logical_reasoning_comprehensive'
            },
            receipt_email: user.email,
            description: 'Logical Reasoning Test - Comprehensive Logic Assessment Results'
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
            scores.abstract.correct +
            scores.deductive.correct +
            scores.pattern.correct +
            scores.analytical.correct;

        const totalQuestions =
            scores.abstract.total +
            scores.deductive.total +
            scores.pattern.total +
            scores.analytical.total;

        const overallPercentage = Math.round((totalCorrect / totalQuestions) * 100);

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
            performanceLevel = 'Exceptional Logic';
            performanceColor = '#00d4aa';
            recommendations = [
                'Your logical reasoning ability is exceptional! You excel at identifying patterns and drawing conclusions.',
                'Consider careers in data science, software engineering, law, research, or strategic planning.',
                'Challenge yourself with advanced logic puzzles, mathematical proofs, and complex problem-solving.',
                'Share your analytical skills by mentoring others or teaching logical thinking techniques.'
            ];
        } else if (overallPercentage >= 70) {
            performanceLevel = 'Strong Logic';
            performanceColor = '#667eea';
            recommendations = [
                'You demonstrate strong logical reasoning across most areas.',
                'Practice with varied logic puzzles to strengthen pattern recognition further.',
                'Work on timed reasoning exercises to improve processing speed.',
                'Consider taking advanced courses in critical thinking or formal logic.'
            ];
        } else if (overallPercentage >= 50) {
            performanceLevel = 'Developing Logic';
            performanceColor = '#F8B500';
            recommendations = [
                'Your logical reasoning skills are developing well with room for growth.',
                'Practice breaking complex problems into smaller, manageable steps.',
                'Try daily logic puzzles like Sudoku or pattern games to build skills.',
                'Focus on understanding the "why" behind logical rules and patterns.'
            ];
        } else {
            performanceLevel = 'Growth Opportunity';
            performanceColor = '#f093fb';
            recommendations = [
                'This assessment highlights opportunities for logical skill development.',
                'Start with basic logic puzzles and gradually increase difficulty.',
                'Practice identifying cause-and-effect relationships in everyday situations.',
                'Consider using logic training apps or taking an introductory logic course.',
                'Remember: Logical thinking can be significantly improved with practice!'
            ];
        }

        // Generate email HTML
        const emailHTML = generateResultsEmail(user, scores, {
            totalCorrect,
            totalQuestions,
            overallPercentage,
            percentile,
            performanceLevel,
            performanceColor,
            recommendations
        });

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"LogicMind Test" <noreply@logicmindtest.com>',
            to: user.email,
            subject: '🧠 Your Logical Reasoning Test Results Are Ready!',
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
    const { totalCorrect, totalQuestions, overallPercentage, percentile, performanceLevel, performanceColor, recommendations } = analysis;

    // Calculate individual test percentages
    const abstractPercent = Math.round((scores.abstract.correct / scores.abstract.total) * 100);
    const deductivePercent = Math.round((scores.deductive.correct / scores.deductive.total) * 100);
    const patternPercent = Math.round((scores.pattern.correct / scores.pattern.total) * 100);
    const analyticalPercent = Math.round((scores.analytical.correct / scores.analytical.total) * 100);

    // Find strongest and weakest areas
    const testScores = [
        { name: 'Abstract Reasoning', percent: abstractPercent },
        { name: 'Deductive Reasoning', percent: deductivePercent },
        { name: 'Pattern Recognition', percent: patternPercent },
        { name: 'Analytical Thinking', percent: analyticalPercent }
    ];
    const strongest = testScores.reduce((a, b) => a.percent > b.percent ? a : b);
    const weakest = testScores.reduce((a, b) => a.percent < b.percent ? a : b);

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logical Reasoning Test Results</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a0a2e 0%, #0f0a1a 100%);">

        <!-- Header -->
        <div style="padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🧠 LogicMind Test</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0;">Your Logical Reasoning Assessment Results</p>
        </div>

        <!-- Main Content -->
        <div style="background: white; border-radius: 20px 20px 0 0; padding: 40px 30px;">

            <!-- Greeting -->
            <p style="font-size: 18px; color: #1a1a2e; margin-bottom: 30px;">
                Hello <strong>${user.name}</strong>,<br><br>
                Thank you for completing the Logical Reasoning Assessment. Here are your detailed results:
            </p>

            <!-- Overall Score -->
            <div style="background: linear-gradient(135deg, ${performanceColor}20, ${performanceColor}10); border-radius: 15px; padding: 30px; text-align: center; margin-bottom: 30px; border-left: 5px solid ${performanceColor};">
                <h2 style="margin: 0 0 10px 0; color: #1a1a2e;">Overall Logic Score</h2>
                <div style="font-size: 64px; font-weight: bold; color: ${performanceColor}; margin: 10px 0;">${overallPercentage}%</div>
                <div style="display: inline-block; padding: 8px 20px; background: ${performanceColor}; color: white; border-radius: 50px; font-weight: bold;">
                    ${performanceLevel}
                </div>
                <p style="color: #666; margin: 15px 0 0 0;">
                    You answered ${totalCorrect} out of ${totalQuestions} questions correctly
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
                📊 Detailed Logic Breakdown
            </h3>

            <!-- Abstract Reasoning -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #1a1a2e;">🔷 Abstract Reasoning</strong>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Pattern recognition in shapes</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: bold; color: #667eea;">${scores.abstract.correct}/${scores.abstract.total}</div>
                        <div style="color: #666; font-size: 14px;">${abstractPercent}%</div>
                    </div>
                </div>
                <div style="background: #e9ecef; border-radius: 10px; height: 8px; margin-top: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${abstractPercent}%; border-radius: 10px;"></div>
                </div>
            </div>

            <!-- Deductive Reasoning -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #1a1a2e;">🔗 Deductive Reasoning</strong>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Drawing logical conclusions</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: bold; color: #00d4aa;">${scores.deductive.correct}/${scores.deductive.total}</div>
                        <div style="color: #666; font-size: 14px;">${deductivePercent}%</div>
                    </div>
                </div>
                <div style="background: #e9ecef; border-radius: 10px; height: 8px; margin-top: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #00d4aa, #00b894); height: 100%; width: ${deductivePercent}%; border-radius: 10px;"></div>
                </div>
            </div>

            <!-- Pattern Recognition -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #1a1a2e;">📊 Pattern Recognition</strong>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Sequence analysis</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: bold; color: #f093fb;">${scores.pattern.correct}/${scores.pattern.total}</div>
                        <div style="color: #666; font-size: 14px;">${patternPercent}%</div>
                    </div>
                </div>
                <div style="background: #e9ecef; border-radius: 10px; height: 8px; margin-top: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #f093fb, #f5576c); height: 100%; width: ${patternPercent}%; border-radius: 10px;"></div>
                </div>
            </div>

            <!-- Analytical Thinking -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 15px; margin-bottom: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: #1a1a2e;">📝 Analytical Thinking</strong>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Evaluating arguments</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 24px; font-weight: bold; color: #F8B500;">${scores.analytical.correct}/${scores.analytical.total}</div>
                        <div style="color: #666; font-size: 14px;">${analyticalPercent}%</div>
                    </div>
                </div>
                <div style="background: #e9ecef; border-radius: 10px; height: 8px; margin-top: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #F8B500, #FFA500); height: 100%; width: ${analyticalPercent}%; border-radius: 10px;"></div>
                </div>
            </div>

            <!-- Recommendations -->
            <h3 style="color: #1a1a2e; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
                💡 Personalized Development Recommendations
            </h3>
            <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
                ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>

            <!-- Understanding Logic -->
            <div style="background: linear-gradient(135deg, #f0f4ff, #e8ecff); border-radius: 15px; padding: 25px; margin-top: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #1a1a2e;">🧠 Why Logical Reasoning Matters</h3>
                <p style="color: #666; margin: 0; line-height: 1.8;">
                    Logical reasoning is a key indicator of problem-solving ability and critical thinking.
                    High logical reasoning scores correlate with success in STEM fields, law, management,
                    and any role requiring analytical decision-making. Research shows that logical skills
                    can be significantly developed through practice and targeted training!
                </p>
            </div>

            <!-- More Tests CTA -->
            <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 15px; padding: 25px; text-align: center; margin-top: 30px;">
                <h3 style="margin: 0 0 10px 0; color: #1a1a2e;">🎯 Discover More About Yourself</h3>
                <p style="color: #666; margin: 0 0 20px 0;">Explore our collection of 20+ specialized cognitive assessments</p>
                <a href="${process.env.APP_URL || 'http://localhost:3000'}" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; border-radius: 50px; font-weight: bold;">
                    View All Tests →
                </a>
            </div>

            <!-- What's Included -->
            <div style="margin-top: 30px; padding: 20px; background: #f0fdf4; border-radius: 10px;">
                <h4 style="margin: 0 0 15px 0; color: #1a1a2e;">📦 Other Tests Available:</h4>
                <ul style="color: #666; margin: 0; padding-left: 20px; line-height: 1.8;">
                    <li>Emotional Intelligence Test</li>
                    <li>Verbal Reasoning Test</li>
                    <li>Numerical Reasoning Test</li>
                    <li>Spatial Reasoning Test</li>
                    <li>Critical Thinking Test</li>
                    <li>Memory Assessment</li>
                    <li>Personality Type Test</li>
                    <li>Leadership Potential Test</li>
                    <li>Creativity Assessment</li>
                    <li>Problem Solving Test</li>
                    <li>Career Aptitude Test</li>
                    <li>And 9 more specialized tests!</li>
                </ul>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #0f0518; padding: 30px; text-align: center;">
            <p style="color: rgba(255,255,255,0.8); margin: 0 0 15px 0; font-size: 14px;">
                🧠 LogicMind Test - World-Class Logical Reasoning Assessments
            </p>
            <p style="color: rgba(255,255,255,0.5); margin: 0; font-size: 12px;">
                © ${new Date().getFullYear()} LogicMind Test. All rights reserved.<br>
                This assessment measures logical reasoning for personal and professional development purposes.
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
║   🧠 LogicMind Test Server                               ║
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
