# 🧠 Memory Recall Test

A comprehensive, scientifically-designed cognitive assessment platform based on standardized memory tests including **ISLT**, **ADAS-Cog**, **Logical Memory**, **SKT**, and **SAGE**.

![Memory Recall Test](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)

## ✨ Features

- **🛒 ISLT Shopping List Test** - International Shopping List Test with 12 items
- **📝 ADAS-Cog Word Recall** - 10-word recall test based on clinical standards
- **📖 Logical Memory Test** - Story comprehension and recall assessment
- **⏱️ SKT Speed Memory Test** - Timed object naming and recall
- **🎯 SAGE Assessment** - Self-Administered Gerocognitive Examination

### Additional Features

- 💳 Secure Stripe payment integration ($2.99 per test)
- 📧 Automatic email delivery of detailed results
- 🎨 Colorful, eye-catching animated UI
- 📱 Fully responsive design
- 🔒 Privacy-focused data handling
- 📊 Personalized recommendations based on scores
- 🛍️ 20+ additional cognitive tests available

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16.0.0
- npm or yarn
- Stripe account (for payments)
- SMTP email service (for sending results)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/memory-recall-test.git
   cd memory-recall-test
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your credentials:
   ```env
   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_secret

   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   EMAIL_FROM=Memory Recall Test <noreply@yourdomain.com>

   # Server
   PORT=3000
   APP_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 💳 Stripe Setup

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the Dashboard
3. Set up a webhook endpoint for `/webhook`
4. Configure the webhook to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

## 📧 Email Setup (Gmail)

1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to Google Account → Security → App Passwords
   - Create a new app password for "Mail"
3. Use this password as `SMTP_PASS`

## 🧪 Test Structure

### 1. ISLT Shopping List Test
- View 12 shopping items for 30 seconds
- Select remembered items from a larger set including distractors

### 2. ADAS-Cog Word Recall
- See 10 words displayed one at a time (3 seconds each)
- Type as many words as you can remember

### 3. Logical Memory Test
- Read a short story for 45 seconds
- Answer 5 comprehension questions about the story

### 4. SKT Speed Test
- Quickly name 8 objects shown one at a time
- Recall which objects were shown

### 5. SAGE Assessment
- 8 questions covering:
  - Orientation
  - Calculation
  - Pattern recognition
  - Language
  - Visual reasoning
  - Memory recall

## 📊 Scoring

Results are calculated as percentages and categorized:
- **Excellent** (85%+): Superior memory function
- **Good** (70-84%): Above average performance
- **Average** (50-69%): Normal range
- **Below Average** (<50%): May warrant follow-up

## 🎨 Customization

### Colors
Edit `public/css/styles.css` CSS variables:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    /* ... more colors */
}
```

### Test Content
Edit `public/js/app.js` data arrays:
- `shoppingItems` - ISLT items
- `adasWords` - Word recall words
- `stories` - Logical memory stories
- `sktObjects` - SKT objects
- `sageQuestions` - SAGE questions

### Pricing
Update in:
- `public/index.html` - Display prices
- `server.js` - Payment intent amount (in cents)

## 📁 Project Structure

```
memory-recall-test/
├── public/
│   ├── css/
│   │   └── styles.css      # Rich, animated styles
│   ├── js/
│   │   └── app.js          # Test logic & Stripe
│   ├── images/             # Image assets
│   └── index.html          # Main HTML
├── server.js               # Express server
├── package.json            # Dependencies
├── .env.example            # Environment template
├── .gitignore
└── README.md
```

## 🔒 Security

- No sensitive data stored client-side
- Stripe handles all payment processing
- Email sent via secure SMTP
- Environment variables for all secrets

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/config` | Get Stripe publishable key |
| POST | `/api/create-payment-intent` | Create payment intent |
| POST | `/api/send-results` | Send results email |
| GET | `/api/health` | Health check |
| POST | `/webhook` | Stripe webhook handler |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## ⚠️ Disclaimer

This assessment is for informational and educational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified health provider with any questions regarding memory or cognitive concerns.

---

Built with ❤️ for cognitive health awareness
