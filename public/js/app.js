/**
 * Emotional Intelligence (EQ) Test Application
 * Comprehensive assessment for emotional awareness and management
 */

// ============================================
// Global State
// ============================================
const state = {
    user: {
        name: '',
        email: '',
        phone: ''
    },
    currentTest: 0,
    tests: ['selfawareness', 'selfregulation', 'motivation', 'empathy', 'socialskills'],
    scores: {
        selfawareness: { points: 0, total: 32, time: 0 },
        selfregulation: { points: 0, total: 32, time: 0 },
        motivation: { points: 0, total: 32, time: 0 },
        empathy: { points: 0, total: 32, time: 0 },
        socialskills: { points: 0, total: 32, time: 0 }
    },
    currentQuestion: 0,
    testStartTime: null,
    selectedAnswer: null,
    paymentComplete: false
};

// ============================================
// Self-Awareness Questions
// ============================================

const selfAwarenessQuestions = [
    {
        scenario: "You're in a meeting and suddenly feel your heart racing and palms sweating when asked to present an idea unexpectedly.",
        question: "How would you handle this situation?",
        options: [
            { text: "Ignore the physical sensations and try to power through without acknowledging how you feel", points: 1 },
            { text: "Recognize that you're feeling anxious, take a deep breath, and acknowledge that this is a normal response to unexpected pressure", points: 4 },
            { text: "Refuse to present because you're not prepared and leave the room", points: 1 },
            { text: "Get angry at whoever put you on the spot", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "After receiving feedback that your recent project didn't meet expectations, you notice yourself feeling defensive and irritable for the rest of the day.",
        question: "What's the most emotionally intelligent response?",
        options: [
            { text: "Tell yourself the feedback was unfair and dismiss it entirely", points: 1 },
            { text: "Recognize your defensive feelings, understand they're protecting your ego, and reflect on what you can learn from the feedback", points: 4 },
            { text: "Vent to coworkers about how wrong the feedback was", points: 1 },
            { text: "Work harder without addressing how you feel about the criticism", points: 2 }
        ],
        correctIndex: 1
    },
    {
        scenario: "You find yourself constantly checking your phone and struggling to focus during family dinner time.",
        question: "How do you interpret this behavior?",
        options: [
            { text: "It's normal - everyone does this nowadays", points: 1 },
            { text: "Recognize this might indicate anxiety about work or difficulty being present, and explore what's driving this need for constant connectivity", points: 4 },
            { text: "Blame your job for being too demanding", points: 1 },
            { text: "Try to hide your phone use from family members", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "You've been procrastinating on an important task for weeks and the deadline is approaching.",
        question: "What insight does this procrastination reveal?",
        options: [
            { text: "You're just lazy and need more discipline", points: 1 },
            { text: "The task might be triggering fear of failure, perfectionism, or feeling overwhelmed - understanding this can help address the root cause", points: 4 },
            { text: "The deadline isn't realistic and should be extended", points: 2 },
            { text: "You work better under pressure anyway", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "During a conversation with your partner, you notice yourself becoming increasingly short and dismissive.",
        question: "How would you respond?",
        options: [
            { text: "Continue the conversation as usual - your partner is probably being too sensitive", points: 1 },
            { text: "Pause and acknowledge: 'I notice I'm getting defensive. Can we take a break and continue when I'm in a better headspace?'", points: 4 },
            { text: "End the conversation abruptly and walk away", points: 1 },
            { text: "Apologize repeatedly without understanding why you're feeling this way", points: 2 }
        ],
        correctIndex: 1
    },
    {
        scenario: "You received a promotion, but instead of feeling happy, you're experiencing anxiety and self-doubt.",
        question: "How do you interpret these feelings?",
        options: [
            { text: "Something must be wrong - you should feel happy about good news", points: 1 },
            { text: "Recognize this might be 'imposter syndrome' - a common response to success that doesn't mean you're undeserving", points: 4 },
            { text: "Consider turning down the promotion since you don't feel ready", points: 1 },
            { text: "Push down these feelings and act confident even if you don't feel it", points: 2 }
        ],
        correctIndex: 1
    },
    {
        scenario: "You often find yourself agreeing to commitments you don't want to take on, then feeling resentful afterward.",
        question: "What does this pattern suggest about your self-awareness?",
        options: [
            { text: "You're a helpful person and should continue saying yes", points: 1 },
            { text: "This pattern indicates difficulty recognizing your own needs and boundaries in the moment - learning to pause before responding could help", points: 4 },
            { text: "Other people are too demanding of your time", points: 1 },
            { text: "You should start saying no to everything to protect yourself", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "When someone asks how you're feeling, you often respond with 'fine' even when you're not.",
        question: "What would help you become more self-aware?",
        options: [
            { text: "Keep saying 'fine' - detailed emotional discussions are unnecessary", points: 1 },
            { text: "Practice identifying and naming your emotions more specifically - developing a richer emotional vocabulary can increase self-understanding", points: 4 },
            { text: "Start sharing all your problems with anyone who asks", points: 1 },
            { text: "Avoid people who ask about your feelings", points: 1 }
        ],
        correctIndex: 1
    }
];

// ============================================
// Self-Regulation Questions
// ============================================

const selfRegulationQuestions = [
    {
        scenario: "You receive an email that feels like a personal attack on your work. Your first impulse is to fire back an angry response.",
        question: "What's the best approach?",
        options: [
            { text: "Send a measured response immediately to show you won't be pushed around", points: 1 },
            { text: "Wait before responding - draft a reply but don't send it. Review it later when you're calmer, and respond professionally", points: 4 },
            { text: "Forward the email to your manager to show how unprofessional the sender is", points: 1 },
            { text: "Ignore the email completely and never respond", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "You're stuck in heavy traffic and running late for an important meeting. You feel your frustration building.",
        question: "How do you manage this situation?",
        options: [
            { text: "Honk aggressively and weave between lanes to save time", points: 1 },
            { text: "Accept what you can't control, take deep breaths, call ahead to explain, and use the time to mentally prepare for the meeting", points: 4 },
            { text: "Cancel the meeting entirely - you're too stressed now", points: 1 },
            { text: "Arrive late and blame the traffic loudly so everyone knows it wasn't your fault", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "During a heated argument with a family member, you feel the urge to say something you know will hurt them deeply.",
        question: "What would you do?",
        options: [
            { text: "Say it - they need to hear the truth and you're just being honest", points: 1 },
            { text: "Recognize this urge as a sign you need to step away. Say: 'I need a moment to cool down before we continue this conversation'", points: 4 },
            { text: "Say something less hurtful but still critical to get your point across", points: 2 },
            { text: "Give them the silent treatment instead", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "You've been working on healthy eating, but after a stressful day, you find yourself craving comfort food.",
        question: "How do you handle this?",
        options: [
            { text: "Give in completely - you deserve it after such a hard day", points: 1 },
            { text: "Acknowledge the craving, understand it's an emotional response to stress, and find alternative ways to comfort yourself while honoring your goals", points: 4 },
            { text: "Strictly deny yourself any comfort food and feel miserable about it", points: 2 },
            { text: "Binge now and promise to start over tomorrow", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "A colleague takes credit for your idea in a team meeting. You feel angry and want to call them out publicly.",
        question: "What's the best course of action?",
        options: [
            { text: "Interrupt and correct them in front of everyone", points: 1 },
            { text: "Control your immediate reaction, then address it privately with the colleague after the meeting to understand what happened", points: 4 },
            { text: "Silently vow to never share ideas with that person again", points: 2 },
            { text: "Complain to other colleagues about what happened", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "You wake up in a bad mood for no apparent reason and it's affecting your interactions with others.",
        question: "How do you handle this?",
        options: [
            { text: "Continue as normal - others should just deal with your mood", points: 1 },
            { text: "Acknowledge your mood, warn others if needed ('I'm having an off day'), and use healthy strategies to reset your emotional state", points: 4 },
            { text: "Isolate yourself completely until the mood passes", points: 2 },
            { text: "Force yourself to act cheerful even though you feel terrible inside", points: 2 }
        ],
        correctIndex: 1
    },
    {
        scenario: "You're facing a major deadline and suddenly feel overwhelmed with anxiety about whether you can complete it.",
        question: "What strategy would help most?",
        options: [
            { text: "Work around the clock without breaks to finish faster", points: 1 },
            { text: "Break the task into smaller, manageable parts, acknowledge the anxiety, and focus on one step at a time", points: 4 },
            { text: "Ask for an extension without attempting the work", points: 1 },
            { text: "Distract yourself with other activities until the last minute", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "Someone makes a political comment you strongly disagree with at a social gathering.",
        question: "How do you respond?",
        options: [
            { text: "Argue passionately to change their mind", points: 1 },
            { text: "Manage your emotional reaction, decide if engaging is worthwhile, and if so, share your perspective calmly without attacking their character", points: 4 },
            { text: "Make a sarcastic comment and walk away", points: 1 },
            { text: "Agree with them to avoid conflict even though you disagree", points: 1 }
        ],
        correctIndex: 1
    }
];

// ============================================
// Motivation Questions
// ============================================

const motivationQuestions = [
    {
        scenario: "You've applied for several jobs but received rejections. You're starting to doubt your abilities.",
        question: "How do you maintain motivation?",
        options: [
            { text: "Give up on job searching - it's clearly not meant to be", points: 1 },
            { text: "View each rejection as feedback, refine your approach, and remember that persistence is key to success. Focus on what you can learn and improve", points: 4 },
            { text: "Lower your standards and apply to any job available", points: 2 },
            { text: "Blame the job market or hiring managers for being unfair", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "You've been working on a personal goal (fitness, learning a skill, etc.) for months but progress is slower than expected.",
        question: "What keeps you going?",
        options: [
            { text: "The goal was probably unrealistic anyway - time to give up", points: 1 },
            { text: "Focus on the progress you have made, adjust expectations if needed, and find intrinsic enjoyment in the process rather than just the outcome", points: 4 },
            { text: "Push harder with extreme measures to catch up", points: 1 },
            { text: "Find a completely different goal that might be easier", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "Your current job is secure but unfulfilling. An opportunity arises that excites you but involves risk.",
        question: "How do you approach this decision?",
        options: [
            { text: "Stay in the safe position - fulfillment is overrated", points: 1 },
            { text: "Weigh the risks thoughtfully, consider your values and long-term goals, and recognize that meaningful growth often requires some risk", points: 4 },
            { text: "Jump immediately without any planning", points: 1 },
            { text: "Wait for a perfect opportunity with no risk", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "You set a New Year's resolution but by March, your enthusiasm has faded significantly.",
        question: "How do you reconnect with your motivation?",
        options: [
            { text: "Accept that resolutions never work and abandon it", points: 1 },
            { text: "Revisit why this goal matters to you, break it into smaller milestones, and create systems rather than relying on willpower alone", points: 4 },
            { text: "Feel guilty about lacking discipline and push harder", points: 2 },
            { text: "Make the same resolution next year instead", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "A project you've invested significant time in is cancelled due to circumstances beyond your control.",
        question: "How do you respond emotionally?",
        options: [
            { text: "Feel completely devastated and question all your future efforts", points: 1 },
            { text: "Allow yourself to feel disappointed, then focus on the skills and experience gained, and channel your energy into new opportunities", points: 4 },
            { text: "Pretend you never cared about the project anyway", points: 1 },
            { text: "Blame whoever made the decision to cancel", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "You see others achieving success faster than you in similar pursuits.",
        question: "How do you maintain your drive?",
        options: [
            { text: "Compare yourself constantly and feel increasingly inadequate", points: 1 },
            { text: "Focus on your own journey, learn from others' successes without envy, and remember that everyone's path is unique", points: 4 },
            { text: "Copy exactly what successful people do without adapting to your situation", points: 2 },
            { text: "Dismiss their success as luck or unfair advantages", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "You're facing a challenging task that you've failed at before.",
        question: "What mindset helps you approach it again?",
        options: [
            { text: "You failed before so you'll probably fail again", points: 1 },
            { text: "View the previous failure as learning experience, identify what went wrong, and approach with curiosity about what you can do differently", points: 4 },
            { text: "Convince yourself this time is completely different with no connection to the past", points: 2 },
            { text: "Avoid it entirely to prevent another failure", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "Your work doesn't receive external recognition even though you've done your best.",
        question: "How do you stay motivated?",
        options: [
            { text: "Stop putting in effort since no one notices anyway", points: 1 },
            { text: "Find intrinsic satisfaction in doing quality work regardless of external recognition, while also communicating your value more effectively", points: 4 },
            { text: "Start doing only the minimum required", points: 1 },
            { text: "Demand recognition from others more forcefully", points: 1 }
        ],
        correctIndex: 1
    }
];

// ============================================
// Empathy Questions
// ============================================

const empathyQuestions = [
    {
        scenario: "A friend is upset about something that seems minor to you (like losing a small item).",
        question: "How do you respond?",
        options: [
            { text: "Tell them it's not a big deal and they should get over it", points: 1 },
            { text: "Recognize that the item might have emotional significance, validate their feelings, and ask what the item meant to them", points: 4 },
            { text: "Help them find the item without acknowledging their emotions", points: 2 },
            { text: "Change the subject to distract them", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "A colleague seems withdrawn and is performing below their usual standard at work.",
        question: "What would you do?",
        options: [
            { text: "Complain to management about their performance", points: 1 },
            { text: "Find a private moment to check in genuinely - ask how they're doing and if there's anything you can support with", points: 4 },
            { text: "Avoid them to not get involved in their problems", points: 1 },
            { text: "Gossip with other colleagues about what might be wrong", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "Someone from a different cultural background explains a tradition that seems strange to you.",
        question: "How do you engage?",
        options: [
            { text: "Point out why the tradition doesn't make logical sense", points: 1 },
            { text: "Ask curious questions to understand the meaning and history behind the tradition, seeking to appreciate their perspective", points: 4 },
            { text: "Politely nod while thinking it's odd", points: 2 },
            { text: "Share why your own traditions are better", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "Your partner is stressed about work and snaps at you when you ask an innocent question.",
        question: "How do you interpret and respond?",
        options: [
            { text: "Snap back - they shouldn't take their stress out on you", points: 1 },
            { text: "Recognize their stress isn't really about you, give them space, and later gently express that while you understand they're stressed, you'd appreciate kinder communication", points: 4 },
            { text: "Give them the silent treatment to show they hurt you", points: 1 },
            { text: "Apologize for bothering them even though you did nothing wrong", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "A team member disagrees with your idea in a meeting, and you feel defensive.",
        question: "How do you handle this?",
        options: [
            { text: "Argue your point more forcefully to win", points: 1 },
            { text: "Try to understand their perspective - ask what concerns they have and genuinely consider whether their points might improve your idea", points: 4 },
            { text: "Take it personally and disengage from the discussion", points: 1 },
            { text: "Agree with them just to end the disagreement", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "You witness someone being publicly humiliated by their boss.",
        question: "What's the empathetic response?",
        options: [
            { text: "Stay silent - it's not your business", points: 1 },
            { text: "After the situation, privately check on the person, offer support, and acknowledge how difficult that must have been", points: 4 },
            { text: "Join in to avoid being the boss's next target", points: 1 },
            { text: "Immediately confront the boss publicly", points: 2 }
        ],
        correctIndex: 1
    },
    {
        scenario: "A friend shares exciting news about an achievement, but you're going through a difficult time yourself.",
        question: "How do you respond?",
        options: [
            { text: "Minimize their achievement because you're not in the mood to celebrate", points: 1 },
            { text: "Genuinely celebrate with them while acknowledging internally that you can hold space for both their joy and your struggles", points: 4 },
            { text: "Immediately share your own problems to shift focus", points: 1 },
            { text: "Fake enthusiasm while feeling resentful", points: 2 }
        ],
        correctIndex: 1
    },
    {
        scenario: "Someone you know has made choices you personally disagree with in their life.",
        question: "How do you approach your relationship with them?",
        options: [
            { text: "Cut them off because you can't support their choices", points: 1 },
            { text: "Separate your personal values from your ability to understand their perspective and maintain the relationship with compassion", points: 4 },
            { text: "Constantly lecture them about making better choices", points: 1 },
            { text: "Pretend to agree with their choices to keep the peace", points: 1 }
        ],
        correctIndex: 1
    }
];

// ============================================
// Social Skills Questions
// ============================================

const socialSkillsQuestions = [
    {
        scenario: "You need to deliver critical feedback to a team member whose work has been subpar.",
        question: "How do you approach this conversation?",
        options: [
            { text: "Be direct and harsh so they understand the severity", points: 1 },
            { text: "Start with genuine appreciation for their efforts, be specific about areas for improvement, and collaborate on solutions while maintaining their dignity", points: 4 },
            { text: "Avoid the conversation and hope they improve on their own", points: 1 },
            { text: "Send an email instead of talking face-to-face", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "You're at a networking event and feel uncomfortable approaching strangers.",
        question: "What strategy helps you connect effectively?",
        options: [
            { text: "Stand alone hoping someone approaches you", points: 1 },
            { text: "Focus on being genuinely curious about others - ask thoughtful questions and listen actively rather than worrying about impressing them", points: 4 },
            { text: "Talk only about yourself and your achievements", points: 1 },
            { text: "Stick close to people you already know the entire time", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "Two people on your team are in conflict, and it's affecting group productivity.",
        question: "How do you help resolve the situation?",
        options: [
            { text: "Take one side that you agree with more", points: 1 },
            { text: "Facilitate a conversation where both feel heard, focus on shared goals, and help them find common ground without taking sides", points: 4 },
            { text: "Report them both to management", points: 1 },
            { text: "Ignore it and hope they work it out themselves", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "You need to persuade your manager to approve a new initiative you believe in.",
        question: "What approach is most effective?",
        options: [
            { text: "Push your idea forcefully and argue against any objections", points: 1 },
            { text: "Understand your manager's priorities first, present your idea in terms of benefits they care about, and be open to modifications", points: 4 },
            { text: "Complain to colleagues if your manager doesn't agree immediately", points: 1 },
            { text: "Give up if there's any initial resistance", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "You realize you've said something that unintentionally hurt someone's feelings.",
        question: "How do you handle this?",
        options: [
            { text: "Justify what you said - they're being too sensitive", points: 1 },
            { text: "Acknowledge the impact of your words, apologize sincerely without making excuses, and ask how you can make it right", points: 4 },
            { text: "Over-apologize repeatedly until they feel awkward", points: 2 },
            { text: "Avoid them going forward to prevent future incidents", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "You're leading a meeting and notice some participants haven't spoken while others dominate.",
        question: "How do you ensure everyone contributes?",
        options: [
            { text: "Let the meeting continue as is - quiet people can speak up if they want", points: 1 },
            { text: "Directly invite quieter members to share thoughts, create structure for equal participation, and gently manage over-talkers", points: 4 },
            { text: "Call out the quiet people publicly for not participating", points: 1 },
            { text: "Let the dominant voices lead since they seem most engaged", points: 1 }
        ],
        correctIndex: 1
    },
    {
        scenario: "A new person joins your team and seems to be struggling to fit in.",
        question: "What do you do?",
        options: [
            { text: "Let them figure it out - everyone goes through adjustment periods", points: 1 },
            { text: "Proactively reach out to include them, introduce them to others, explain unwritten team norms, and check in periodically on how they're doing", points: 4 },
            { text: "Tell them everything they're doing wrong so they can improve faster", points: 1 },
            { text: "Wait for them to ask for help if they need it", points: 2 }
        ],
        correctIndex: 1
    },
    {
        scenario: "You're in a group project and one person isn't pulling their weight.",
        question: "How do you address this?",
        options: [
            { text: "Do their work for them to ensure the project succeeds", points: 1 },
            { text: "Have a private, non-accusatory conversation to understand if there are obstacles, clarify expectations, and agree on accountability", points: 4 },
            { text: "Complain about them to other team members", points: 1 },
            { text: "Report them to the supervisor immediately without discussing with them first", points: 1 }
        ],
        correctIndex: 1
    }
];

// 20 Additional Test Offers
const additionalTests = [
    { id: 1, name: 'Leadership Assessment', icon: '👔', desc: 'Evaluate your leadership potential and style', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 2, name: 'Stress Resilience Test', icon: '🧘', desc: 'Measure your ability to handle pressure', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 3, name: 'Communication Style Test', icon: '💬', desc: 'Discover your communication strengths', originalPrice: 12.99, currentPrice: 4.99 },
    { id: 4, name: 'Conflict Resolution Test', icon: '🤝', desc: 'Assess how you handle disagreements', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 5, name: 'Personality Type Assessment', icon: '🎭', desc: 'Understand your personality traits', originalPrice: 14.99, currentPrice: 5.99 },
    { id: 6, name: 'Emotional Triggers Test', icon: '⚡', desc: 'Identify your emotional triggers', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 7, name: 'Attachment Style Test', icon: '💕', desc: 'Understand your relationship patterns', originalPrice: 11.99, currentPrice: 4.49 },
    { id: 8, name: 'Assertiveness Assessment', icon: '🦁', desc: 'Evaluate your assertiveness level', originalPrice: 14.99, currentPrice: 5.99 },
    { id: 9, name: 'Mindfulness Quiz', icon: '🧠', desc: 'Test your present-moment awareness', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 10, name: 'Burnout Risk Assessment', icon: '🔥', desc: 'Evaluate your burnout warning signs', originalPrice: 11.99, currentPrice: 4.49 },
    { id: 11, name: 'Logical Reasoning Test', icon: '🧩', desc: 'Measure your analytical thinking', originalPrice: 14.99, currentPrice: 5.99 },
    { id: 12, name: 'Memory Assessment', icon: '💭', desc: 'Evaluate memory capacity', originalPrice: 12.99, currentPrice: 4.99 },
    { id: 13, name: 'Anxiety Self-Assessment', icon: '🌊', desc: 'Understand your anxiety patterns', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 14, name: 'Self-Esteem Test', icon: '⭐', desc: 'Measure your self-worth beliefs', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 15, name: 'Gratitude Assessment', icon: '🙏', desc: 'Evaluate your appreciation mindset', originalPrice: 12.99, currentPrice: 4.99 },
    { id: 16, name: 'Work-Life Balance Test', icon: '⚖️', desc: 'Assess your life balance', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 17, name: 'Decision Making Test', icon: '🎯', desc: 'Evaluate judgment skills', originalPrice: 14.99, currentPrice: 5.99 },
    { id: 18, name: 'Optimism Assessment', icon: '☀️', desc: 'Measure your positive thinking', originalPrice: 7.99, currentPrice: 2.99 },
    { id: 19, name: 'Boundary Setting Test', icon: '🚧', desc: 'Assess your personal boundaries', originalPrice: 19.99, currentPrice: 7.99 },
    { id: 20, name: 'Complete EQ Assessment', icon: '💖', desc: 'Full emotional intelligence deep-dive', originalPrice: 29.99, currentPrice: 12.99 }
];

// ============================================
// Utility Functions
// ============================================

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function updateProgress() {
    const totalQuestions = 40; // 8 + 8 + 8 + 8 + 8
    const progress = Math.min((state.currentTest / state.tests.length) * 100, 100);
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `${Math.round(progress)}% Complete`;
}

// ============================================
// Start Test Flow
// ============================================

function startTest() {
    openModal('registrationModal');
}

// Registration Form Handler
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    state.user.name = document.getElementById('userName').value;
    state.user.email = document.getElementById('userEmail').value;
    state.user.phone = document.getElementById('userPhone').value;

    closeModal('registrationModal');

    // Hide hero and show test container
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.test-categories').style.display = 'none';
    document.getElementById('testContainer').style.display = 'block';

    // Start first test
    showCurrentTest();
});

function showCurrentTest() {
    // Hide all test sections
    document.querySelectorAll('.test-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById('testComplete').style.display = 'none';

    if (state.currentTest >= state.tests.length) {
        showTestComplete();
        return;
    }

    const currentTestId = state.tests[state.currentTest];
    let testSectionId;

    switch(currentTestId) {
        case 'selfawareness':
            testSectionId = 'testSelfAwareness';
            break;
        case 'selfregulation':
            testSectionId = 'testSelfRegulation';
            break;
        case 'motivation':
            testSectionId = 'testMotivation';
            break;
        case 'empathy':
            testSectionId = 'testEmpathy';
            break;
        case 'socialskills':
            testSectionId = 'testSocialSkills';
            break;
    }

    const testSection = document.getElementById(testSectionId);
    if (testSection) {
        testSection.style.display = 'block';
        updateTestName(currentTestId);
        updateProgress();
    }
}

function updateTestName(testId) {
    const names = {
        selfawareness: 'Self-Awareness',
        selfregulation: 'Self-Regulation',
        motivation: 'Motivation',
        empathy: 'Empathy',
        socialskills: 'Social Skills'
    };
    document.getElementById('currentTestName').textContent = names[testId] || 'EQ Assessment';
}

function nextTest() {
    state.currentTest++;
    state.currentQuestion = 0;
    state.selectedAnswer = null;
    showCurrentTest();
}

// ============================================
// Generic EQ Question Display Function
// ============================================

function showEQQuestion(testName, questions, displayId, counterId, scenarioId, questionId, optionsId) {
    if (state.currentQuestion >= questions.length) {
        state.scores[testName].time = (Date.now() - state.testStartTime) / 1000;
        nextTest();
        return;
    }

    const q = questions[state.currentQuestion];
    document.getElementById(counterId).textContent = `Question ${state.currentQuestion + 1} of ${questions.length}`;
    document.getElementById('testTimer').textContent = `⏱️ Q${state.currentQuestion + 1}/${questions.length}`;

    // Display scenario
    document.getElementById(scenarioId).innerHTML = `
        <div class="scenario-label">📖 Scenario</div>
        <div class="scenario-text">${q.scenario}</div>
    `;

    // Display question
    document.getElementById(questionId).innerHTML = `
        <div class="eq-question-text">${q.question}</div>
    `;

    // Display options
    const optionsContainer = document.getElementById(optionsId);
    optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'eq-option';
        div.innerHTML = `
            <span class="option-letter">${letters[index]}</span>
            <span class="option-text">${option.text}</span>
        `;
        div.dataset.index = index;
        div.dataset.points = option.points;
        div.addEventListener('click', () => selectEQAnswer(div, testName, option.points));
        optionsContainer.appendChild(div);
    });

    state.selectedAnswer = null;
}

function selectEQAnswer(element, testName, points) {
    if (state.selectedAnswer !== null) return;
    state.selectedAnswer = true;

    document.querySelectorAll('.eq-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');

    state.scores[testName].points += points;

    setTimeout(() => {
        state.currentQuestion++;

        // Determine which question display function to call
        switch(testName) {
            case 'selfawareness':
                showSelfAwarenessQuestion();
                break;
            case 'selfregulation':
                showSelfRegulationQuestion();
                break;
            case 'motivation':
                showMotivationQuestion();
                break;
            case 'empathy':
                showEmpathyQuestion();
                break;
            case 'socialskills':
                showSocialSkillsQuestion();
                break;
        }
    }, 800);
}

// ============================================
// Self-Awareness Test
// ============================================

function startSelfAwareness() {
    document.getElementById('selfAwarenessIntro').style.display = 'none';
    document.getElementById('selfAwarenessDisplay').style.display = 'block';
    state.currentQuestion = 0;
    state.testStartTime = Date.now();
    showSelfAwarenessQuestion();
}

function showSelfAwarenessQuestion() {
    showEQQuestion(
        'selfawareness',
        selfAwarenessQuestions,
        'selfAwarenessDisplay',
        'selfAwarenessCounter',
        'selfAwarenessScenario',
        'selfAwarenessQuestion',
        'selfAwarenessOptions'
    );
}

// ============================================
// Self-Regulation Test
// ============================================

function startSelfRegulation() {
    document.getElementById('selfRegulationIntro').style.display = 'none';
    document.getElementById('selfRegulationDisplay').style.display = 'block';
    state.currentQuestion = 0;
    state.testStartTime = Date.now();
    showSelfRegulationQuestion();
}

function showSelfRegulationQuestion() {
    showEQQuestion(
        'selfregulation',
        selfRegulationQuestions,
        'selfRegulationDisplay',
        'selfRegulationCounter',
        'selfRegulationScenario',
        'selfRegulationQuestion',
        'selfRegulationOptions'
    );
}

// ============================================
// Motivation Test
// ============================================

function startMotivation() {
    document.getElementById('motivationIntro').style.display = 'none';
    document.getElementById('motivationDisplay').style.display = 'block';
    state.currentQuestion = 0;
    state.testStartTime = Date.now();
    showMotivationQuestion();
}

function showMotivationQuestion() {
    showEQQuestion(
        'motivation',
        motivationQuestions,
        'motivationDisplay',
        'motivationCounter',
        'motivationScenario',
        'motivationQuestion',
        'motivationOptions'
    );
}

// ============================================
// Empathy Test
// ============================================

function startEmpathy() {
    document.getElementById('empathyIntro').style.display = 'none';
    document.getElementById('empathyDisplay').style.display = 'block';
    state.currentQuestion = 0;
    state.testStartTime = Date.now();
    showEmpathyQuestion();
}

function showEmpathyQuestion() {
    showEQQuestion(
        'empathy',
        empathyQuestions,
        'empathyDisplay',
        'empathyCounter',
        'empathyScenario',
        'empathyQuestion',
        'empathyOptions'
    );
}

// ============================================
// Social Skills Test
// ============================================

function startSocialSkills() {
    document.getElementById('socialSkillsIntro').style.display = 'none';
    document.getElementById('socialSkillsDisplay').style.display = 'block';
    state.currentQuestion = 0;
    state.testStartTime = Date.now();
    showSocialSkillsQuestion();
}

function showSocialSkillsQuestion() {
    showEQQuestion(
        'socialskills',
        socialSkillsQuestions,
        'socialSkillsDisplay',
        'socialSkillsCounter',
        'socialSkillsScenario',
        'socialSkillsQuestion',
        'socialSkillsOptions'
    );
}

// ============================================
// Test Complete & Payment
// ============================================

function showTestComplete() {
    document.querySelectorAll('.test-section').forEach(section => {
        section.style.display = 'none';
    });

    document.getElementById('testComplete').style.display = 'block';
    document.getElementById('progressFill').style.width = '100%';
    document.getElementById('progressText').textContent = '100% Complete';
    document.getElementById('currentTestName').textContent = 'Assessment Complete';
    document.getElementById('testTimer').textContent = '✓ Done';
}

// ============================================
// Stripe Payment Integration
// ============================================

let stripe;
let elements;
let cardElement;

function initiatePayment() {
    openModal('paymentModal');
    initializeStripe();
}

async function initializeStripe() {
    try {
        const response = await fetch('/api/config');
        const { publishableKey } = await response.json();

        stripe = Stripe(publishableKey);
        elements = stripe.elements();

        cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#1a1a2e',
                    '::placeholder': {
                        color: '#6c757d'
                    }
                },
                invalid: {
                    color: '#ff6b6b'
                }
            }
        });

        cardElement.mount('#card-element');

        cardElement.on('change', function(event) {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
    } catch (error) {
        console.error('Error initializing Stripe:', error);
        document.getElementById('card-errors').textContent = 'Unable to load payment system. Please try again.';
    }
}

document.getElementById('payment-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitButton = document.getElementById('submit-payment');
    const buttonText = document.getElementById('button-text');
    const spinner = document.getElementById('spinner');

    submitButton.disabled = true;
    buttonText.textContent = 'Processing...';
    spinner.classList.remove('hidden');

    try {
        const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: state.user,
                scores: state.scores
            })
        });

        const { clientSecret, error: serverError } = await response.json();

        if (serverError) {
            throw new Error(serverError);
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: state.user.name,
                    email: state.user.email
                }
            }
        });

        if (error) {
            throw new Error(error.message);
        }

        if (paymentIntent.status === 'succeeded') {
            state.paymentComplete = true;
            await sendResultsEmail();
            closeModal('paymentModal');
            showSuccessModal();
        }
    } catch (error) {
        document.getElementById('card-errors').textContent = error.message;
        submitButton.disabled = false;
        buttonText.textContent = 'Pay $2.99';
        spinner.classList.add('hidden');
    }
});

async function sendResultsEmail() {
    try {
        await fetch('/api/send-results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: state.user,
                scores: state.scores
            })
        });
    } catch (error) {
        console.error('Error sending results email:', error);
    }
}

function showSuccessModal() {
    document.getElementById('emailSentTo').textContent = state.user.email;
    openModal('successModal');
}

// ============================================
// More Tests Display
// ============================================

function showMoreTests() {
    closeModal('successModal');
    openModal('moreTestsModal');
    renderAdditionalTests();
}

function renderAdditionalTests() {
    const grid = document.getElementById('testsGrid');
    grid.innerHTML = '';

    additionalTests.forEach(test => {
        const card = document.createElement('div');
        card.className = 'test-offer-card';
        card.innerHTML = `
            <div class="test-offer-icon">${test.icon}</div>
            <h4>${test.name}</h4>
            <p>${test.desc}</p>
            <div class="test-offer-price">
                <span class="original">$${test.originalPrice.toFixed(2)}</span>
                <span class="current">$${test.currentPrice.toFixed(2)}</span>
            </div>
        `;
        card.addEventListener('click', () => {
            alert(`${test.name} - Coming soon! Stay tuned for more assessments.`);
        });
        grid.appendChild(card);
    });
}

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Handle click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
});
