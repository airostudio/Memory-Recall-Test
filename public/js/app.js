/**
 * Logical Reasoning Test Application
 * Comprehensive assessment for logical thinking and problem solving
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
    tests: ['abstract', 'deductive', 'pattern', 'analytical'],
    scores: {
        abstract: { correct: 0, total: 10, time: 0 },
        deductive: { correct: 0, total: 10, time: 0 },
        pattern: { correct: 0, total: 10, time: 0 },
        analytical: { correct: 0, total: 10, time: 0 }
    },
    currentQuestion: 0,
    testStartTime: null,
    selectedAnswer: null,
    paymentComplete: false
};

// ============================================
// SVG Shape Generators - Professional with Gradients
// ============================================

const colors = {
    blue: '#2563eb',
    purple: '#7c3aed',
    teal: '#0891b2',
    pink: '#db2777',
    orange: '#ea580c',
    red: '#dc2626',
    green: '#059669'
};

const gradients = {
    blue: ['#3b82f6', '#1d4ed8'],
    purple: ['#8b5cf6', '#6d28d9'],
    teal: ['#06b6d4', '#0e7490'],
    pink: ['#ec4899', '#be185d'],
    orange: ['#f97316', '#c2410c'],
    red: ['#ef4444', '#b91c1c'],
    green: ['#10b981', '#047857']
};

function getGradientDef(color, id) {
    const grad = gradients[Object.keys(colors).find(k => colors[k] === color)] || ['#64748b', '#475569'];
    return `<defs><linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${grad[0]}"/><stop offset="100%" style="stop-color:${grad[1]}"/></linearGradient></defs>`;
}

function createTriangle(color, rotation = 0, size = 'medium') {
    const sizes = { small: '30,42 10,42 20,15', medium: '30,48 6,48 18,8', large: '30,52 4,52 17,4' };
    const id = `tri_${Math.random().toString(36).substr(2, 9)}`;
    return `<svg viewBox="0 0 60 60">${getGradientDef(color, id)}<polygon points="${sizes[size]}" fill="url(#${id})" transform="rotate(${rotation} 30 30)" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.15))"/></svg>`;
}

function createSquare(color, rotation = 0, size = 'medium') {
    const sizes = { small: { x: 16, y: 16, w: 28, h: 28 }, medium: { x: 12, y: 12, w: 36, h: 36 }, large: { x: 8, y: 8, w: 44, h: 44 } };
    const s = sizes[size];
    const id = `sq_${Math.random().toString(36).substr(2, 9)}`;
    return `<svg viewBox="0 0 60 60">${getGradientDef(color, id)}<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="3" fill="url(#${id})" transform="rotate(${rotation} 30 30)" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.15))"/></svg>`;
}

function createCircle(color, size = 'medium') {
    const sizes = { small: 13, medium: 18, large: 23 };
    const id = `ci_${Math.random().toString(36).substr(2, 9)}`;
    return `<svg viewBox="0 0 60 60">${getGradientDef(color, id)}<circle cx="30" cy="30" r="${sizes[size]}" fill="url(#${id})" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.15))"/></svg>`;
}

function createDiamond(color, size = 'medium') {
    const sizes = { small: '30,12 44,30 30,48 16,30', medium: '30,8 48,30 30,52 12,30', large: '30,5 52,30 30,55 8,30' };
    const id = `di_${Math.random().toString(36).substr(2, 9)}`;
    return `<svg viewBox="0 0 60 60">${getGradientDef(color, id)}<polygon points="${sizes[size]}" fill="url(#${id})" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.15))"/></svg>`;
}

function createStar(color, size = 'medium') {
    const scales = { small: 0.65, medium: 0.8, large: 0.95 };
    const sc = scales[size];
    const id = `st_${Math.random().toString(36).substr(2, 9)}`;
    const cx = 30, cy = 30;
    const points = [];
    for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 72 - 90) * Math.PI / 180;
        const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180;
        points.push(`${cx + 22 * sc * Math.cos(outerAngle)},${cy + 22 * sc * Math.sin(outerAngle)}`);
        points.push(`${cx + 10 * sc * Math.cos(innerAngle)},${cy + 10 * sc * Math.sin(innerAngle)}`);
    }
    return `<svg viewBox="0 0 60 60">${getGradientDef(color, id)}<polygon points="${points.join(' ')}" fill="url(#${id})" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.15))"/></svg>`;
}

function createPentagon(color, size = 'medium') {
    const sizes = { small: '30,14 43,24 39,42 21,42 17,24', medium: '30,10 47,22 42,47 18,47 13,22', large: '30,7 50,21 44,50 16,50 10,21' };
    const id = `pe_${Math.random().toString(36).substr(2, 9)}`;
    return `<svg viewBox="0 0 60 60">${getGradientDef(color, id)}<polygon points="${sizes[size]}" fill="url(#${id})" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.15))"/></svg>`;
}

function createHexagon(color, size = 'medium') {
    const sizes = { small: '30,12 43,19 43,37 30,44 17,37 17,19', medium: '30,8 47,17 47,43 30,52 13,43 13,17', large: '30,5 50,15 50,45 30,55 10,45 10,15' };
    const id = `he_${Math.random().toString(36).substr(2, 9)}`;
    return `<svg viewBox="0 0 60 60">${getGradientDef(color, id)}<polygon points="${sizes[size]}" fill="url(#${id})" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.15))"/></svg>`;
}

function createCross(color, size = 'medium') {
    const sizes = {
        small: { x1: 23, y1: 12, w1: 14, h1: 36, x2: 12, y2: 23, w2: 36, h2: 14 },
        medium: { x1: 21, y1: 8, w1: 18, h1: 44, x2: 8, y2: 21, w2: 44, h2: 18 },
        large: { x1: 19, y1: 5, w1: 22, h1: 50, x2: 5, y2: 19, w2: 50, h2: 22 }
    };
    const s = sizes[size];
    const id = `cr_${Math.random().toString(36).substr(2, 9)}`;
    return `<svg viewBox="0 0 60 60">${getGradientDef(color, id)}<rect x="${s.x1}" y="${s.y1}" width="${s.w1}" height="${s.h1}" rx="2" fill="url(#${id})" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.15))"/><rect x="${s.x2}" y="${s.y2}" width="${s.w2}" height="${s.h2}" rx="2" fill="url(#${id})"/></svg>`;
}

function createArrow(color, direction = 'right') {
    const rotations = { right: 0, down: 90, left: 180, up: 270 };
    const id = `ar_${Math.random().toString(36).substr(2, 9)}`;
    return `<svg viewBox="0 0 60 60">${getGradientDef(color, id)}<polygon points="12,26 34,26 34,17 52,30 34,43 34,34 12,34" fill="url(#${id})" transform="rotate(${rotations[direction]} 30 30)" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.15))"/></svg>`;
}

// ============================================
// Abstract Reasoning Questions (Shape Patterns)
// ============================================

const abstractQuestions = [
    {
        // Pattern: Shapes rotate 90 degrees clockwise
        sequence: [
            createTriangle(colors.blue, 0),
            createTriangle(colors.blue, 90),
            createTriangle(colors.blue, 180)
        ],
        options: [
            createTriangle(colors.blue, 270),
            createTriangle(colors.blue, 0),
            createTriangle(colors.purple, 270),
            createTriangle(colors.blue, 180)
        ],
        correctIndex: 0
    },
    {
        // Pattern: Circle, Square, Triangle repeating with color change
        sequence: [
            createCircle(colors.teal),
            createSquare(colors.teal),
            createTriangle(colors.teal, 0),
            createCircle(colors.pink)
        ],
        options: [
            createTriangle(colors.pink, 0),
            createSquare(colors.pink),
            createCircle(colors.pink),
            createDiamond(colors.pink)
        ],
        correctIndex: 1
    },
    {
        // Pattern: Size increases (small, medium, large)
        sequence: [
            createSquare(colors.purple, 0, 'small'),
            createSquare(colors.purple, 0, 'medium'),
            createSquare(colors.purple, 0, 'large'),
            createCircle(colors.purple, 'small')
        ],
        options: [
            createCircle(colors.purple, 'large'),
            createCircle(colors.purple, 'small'),
            createCircle(colors.purple, 'medium'),
            createSquare(colors.purple, 0, 'medium')
        ],
        correctIndex: 2
    },
    {
        // Pattern: Color changes (blue, teal, pink) with same shape
        sequence: [
            createHexagon(colors.blue),
            createHexagon(colors.teal),
            createHexagon(colors.pink),
            createPentagon(colors.blue)
        ],
        options: [
            createPentagon(colors.pink),
            createPentagon(colors.teal),
            createHexagon(colors.blue),
            createPentagon(colors.orange)
        ],
        correctIndex: 1
    },
    {
        // Pattern: Alternating shapes (diamond, star)
        sequence: [
            createDiamond(colors.orange),
            createStar(colors.orange),
            createDiamond(colors.orange),
            createStar(colors.orange)
        ],
        options: [
            createStar(colors.orange),
            createCircle(colors.orange),
            createDiamond(colors.orange),
            createTriangle(colors.orange, 0)
        ],
        correctIndex: 2
    },
    {
        // Pattern: Arrows rotating clockwise
        sequence: [
            createArrow(colors.red, 'up'),
            createArrow(colors.red, 'right'),
            createArrow(colors.red, 'down')
        ],
        options: [
            createArrow(colors.red, 'up'),
            createArrow(colors.red, 'left'),
            createArrow(colors.red, 'right'),
            createArrow(colors.red, 'down')
        ],
        correctIndex: 1
    },
    {
        // Pattern: Shape sides increase (3, 4, 5, 6)
        sequence: [
            createTriangle(colors.green, 0),
            createSquare(colors.green, 0),
            createPentagon(colors.green)
        ],
        options: [
            createCircle(colors.green),
            createHexagon(colors.green),
            createDiamond(colors.green),
            createStar(colors.green)
        ],
        correctIndex: 1
    },
    {
        // Pattern: Cross rotates 45 degrees each time
        sequence: [
            createCross(colors.purple),
            createSquare(colors.purple, 45),
            createCross(colors.purple),
            createSquare(colors.purple, 45)
        ],
        options: [
            createSquare(colors.purple, 45),
            createCross(colors.purple),
            createDiamond(colors.purple),
            createCircle(colors.purple)
        ],
        correctIndex: 1
    },
    {
        // Pattern: Two shapes alternate with color swap
        sequence: [
            createCircle(colors.blue),
            createTriangle(colors.pink, 0),
            createCircle(colors.pink),
            createTriangle(colors.blue, 0)
        ],
        options: [
            createTriangle(colors.pink, 0),
            createCircle(colors.blue),
            createSquare(colors.blue),
            createCircle(colors.pink)
        ],
        correctIndex: 1
    },
    {
        // Pattern: Size decreases while shape changes
        sequence: [
            createSquare(colors.teal, 0, 'large'),
            createCircle(colors.teal, 'medium'),
            createTriangle(colors.teal, 0, 'small')
        ],
        options: [
            createDiamond(colors.teal, 'small'),
            createSquare(colors.teal, 0, 'large'),
            createCircle(colors.teal, 'large'),
            createHexagon(colors.teal, 'medium')
        ],
        correctIndex: 0
    }
];

// ============================================
// Deductive Reasoning Questions
// ============================================

const deductiveQuestions = [
    {
        premises: [
            "All engineers are logical thinkers.",
            "Sarah is an engineer."
        ],
        question: "What can be concluded?",
        options: [
            { text: "Sarah is a logical thinker.", correct: true },
            { text: "All logical thinkers are engineers.", correct: false },
            { text: "Sarah is not a logical thinker.", correct: false },
            { text: "Some engineers are not logical thinkers.", correct: false }
        ]
    },
    {
        premises: [
            "If it rains, the ground gets wet.",
            "The ground is wet."
        ],
        question: "What can be concluded?",
        options: [
            { text: "It definitely rained.", correct: false },
            { text: "It may or may not have rained.", correct: true },
            { text: "It did not rain.", correct: false },
            { text: "The ground is always wet.", correct: false }
        ]
    },
    {
        premises: [
            "No reptiles have fur.",
            "All snakes are reptiles."
        ],
        question: "What can be concluded?",
        options: [
            { text: "Some snakes have fur.", correct: false },
            { text: "No snakes have fur.", correct: true },
            { text: "All animals without fur are reptiles.", correct: false },
            { text: "Some reptiles are not snakes.", correct: false }
        ]
    },
    {
        premises: [
            "All prime numbers greater than 2 are odd.",
            "17 is a prime number greater than 2."
        ],
        question: "What can be concluded?",
        options: [
            { text: "17 is not a prime number.", correct: false },
            { text: "17 is even.", correct: false },
            { text: "17 is odd.", correct: true },
            { text: "All odd numbers are prime.", correct: false }
        ]
    },
    {
        premises: [
            "Either the project succeeds or the team is restructured.",
            "The project did not succeed."
        ],
        question: "What can be concluded?",
        options: [
            { text: "The team may or may not be restructured.", correct: false },
            { text: "The team will be restructured.", correct: true },
            { text: "The team will not be restructured.", correct: false },
            { text: "The project will eventually succeed.", correct: false }
        ]
    },
    {
        premises: [
            "If a shape has exactly three sides, it is a triangle.",
            "Figure X has exactly three sides."
        ],
        question: "What can be concluded?",
        options: [
            { text: "Figure X might be a triangle.", correct: false },
            { text: "Figure X is a triangle.", correct: true },
            { text: "Figure X is not a triangle.", correct: false },
            { text: "All triangles are Figure X.", correct: false }
        ]
    },
    {
        premises: [
            "Some doctors are researchers.",
            "All researchers publish papers."
        ],
        question: "What can be concluded?",
        options: [
            { text: "All doctors publish papers.", correct: false },
            { text: "Some doctors publish papers.", correct: true },
            { text: "No doctors publish papers.", correct: false },
            { text: "All those who publish papers are doctors.", correct: false }
        ]
    },
    {
        premises: [
            "If the alarm sounds, evacuate the building.",
            "The alarm is not sounding."
        ],
        question: "What can be concluded?",
        options: [
            { text: "Do not evacuate the building.", correct: false },
            { text: "We cannot conclude whether to evacuate or not.", correct: true },
            { text: "Evacuate the building anyway.", correct: false },
            { text: "The building is safe.", correct: false }
        ]
    },
    {
        premises: [
            "All mammals are warm-blooded.",
            "Whales are mammals.",
            "Some warm-blooded animals live in water."
        ],
        question: "What can be concluded?",
        options: [
            { text: "Whales are cold-blooded.", correct: false },
            { text: "All warm-blooded animals are mammals.", correct: false },
            { text: "Whales are warm-blooded.", correct: true },
            { text: "No mammals live in water.", correct: false }
        ]
    },
    {
        premises: [
            "No student who studied failed the exam.",
            "Tom failed the exam."
        ],
        question: "What can be concluded?",
        options: [
            { text: "Tom studied for the exam.", correct: false },
            { text: "Tom did not study for the exam.", correct: true },
            { text: "The exam was too difficult.", correct: false },
            { text: "All students who studied passed.", correct: false }
        ]
    }
];

// ============================================
// Pattern Recognition Questions (Number/Letter Sequences)
// ============================================

const patternQuestions = [
    {
        sequence: [2, 4, 8, 16, 32],
        question: "What comes next?",
        options: [48, 64, 56, 40],
        correctIndex: 1  // 64 (multiply by 2)
    },
    {
        sequence: [1, 1, 2, 3, 5, 8],
        question: "What comes next?",
        options: [11, 12, 13, 15],
        correctIndex: 2  // 13 (Fibonacci)
    },
    {
        sequence: [3, 6, 11, 18, 27],
        question: "What comes next?",
        options: [36, 38, 40, 35],
        correctIndex: 1  // 38 (add 3, 5, 7, 9, 11)
    },
    {
        sequence: [100, 95, 85, 70, 50],
        question: "What comes next?",
        options: [30, 25, 35, 20],
        correctIndex: 1  // 25 (subtract 5, 10, 15, 20, 25)
    },
    {
        sequence: [1, 4, 9, 16, 25],
        question: "What comes next?",
        options: [30, 36, 49, 34],
        correctIndex: 1  // 36 (perfect squares)
    },
    {
        sequence: [2, 6, 12, 20, 30],
        question: "What comes next?",
        options: [40, 42, 44, 38],
        correctIndex: 1  // 42 (n*(n+1): 1*2, 2*3, 3*4, 4*5, 5*6, 6*7)
    },
    {
        sequence: [1, 3, 7, 15, 31],
        question: "What comes next?",
        options: [47, 63, 55, 45],
        correctIndex: 1  // 63 (2^n - 1)
    },
    {
        sequence: [5, 10, 9, 18, 17],
        question: "What comes next?",
        options: [34, 16, 33, 35],
        correctIndex: 0  // 34 (×2, -1, ×2, -1...)
    },
    {
        sequence: [1, 2, 6, 24, 120],
        question: "What comes next?",
        options: [720, 600, 240, 144],
        correctIndex: 0  // 720 (factorials)
    },
    {
        sequence: [81, 27, 9, 3, 1],
        question: "What comes next?",
        options: [0, '1/3', -1, 3],
        correctIndex: 1  // 1/3 (divide by 3)
    }
];

// ============================================
// Analytical Thinking Questions (Verbal Reasoning)
// ============================================

const analyticalQuestions = [
    {
        passage: "A new study found that employees who work from home at least three days a week report higher job satisfaction than those who work entirely in the office. The study surveyed 5,000 workers across various industries. However, the study did not account for differences in job types or seniority levels.",
        statement: "Working from home causes higher job satisfaction.",
        options: ["True", "False", "Cannot Say"],
        correctIndex: 2  // Cannot Say - correlation vs causation, study limitations
    },
    {
        passage: "The city council has approved a plan to build a new community center. The center will include a swimming pool, gym, and meeting rooms. Construction is expected to begin next spring and take approximately 18 months to complete. The total budget for the project is $12 million.",
        statement: "The community center will be ready for use by the end of next year.",
        options: ["True", "False", "Cannot Say"],
        correctIndex: 1  // False - spring + 18 months = beyond end of next year
    },
    {
        passage: "Research indicates that students who eat breakfast perform better academically than those who skip it. The study tracked 2,000 students over three years and found a consistent correlation between breakfast consumption and test scores. Nutritionists recommend a balanced breakfast including protein and whole grains.",
        statement: "Students who skip breakfast always perform poorly in school.",
        options: ["True", "False", "Cannot Say"],
        correctIndex: 1  // False - passage says "better," not that skippers "always perform poorly"
    },
    {
        passage: "The company's quarterly report shows a 15% increase in revenue compared to the same period last year. Operating costs remained stable, resulting in improved profit margins. The CEO attributed the growth to the successful launch of two new product lines in the Asian market.",
        statement: "The company's profit margins improved due to cost-cutting measures.",
        options: ["True", "False", "Cannot Say"],
        correctIndex: 1  // False - costs "remained stable," improvement was from revenue growth
    },
    {
        passage: "A survey of 1,000 commuters found that 60% would consider switching to public transportation if service frequency increased. Currently, buses run every 30 minutes during peak hours. The transit authority is considering adding more buses to reduce wait times to 15 minutes.",
        statement: "If the transit authority adds more buses, at least 600 commuters will definitely switch to public transportation.",
        options: ["True", "False", "Cannot Say"],
        correctIndex: 1  // False - they would "consider" switching, not definitely switch
    },
    {
        passage: "The museum's new exhibit on ancient civilizations opened last month. Attendance figures show that weekend visitors outnumber weekday visitors by a ratio of 3:1. The exhibit features artifacts from Egypt, Greece, and Rome. Admission is free for children under 12.",
        statement: "The museum receives more than 75% of its weekly visitors on weekends.",
        options: ["True", "False", "Cannot Say"],
        correctIndex: 0  // True - 3:1 ratio means 75% weekend (3/(3+1))
    },
    {
        passage: "A clinical trial tested a new medication for treating migraines. Of the 500 participants who received the medication, 70% reported significant pain relief within two hours. Among the 500 participants who received a placebo, 30% reported similar relief. Side effects included mild drowsiness in 15% of medication recipients.",
        statement: "The medication is more effective than the placebo at treating migraines.",
        options: ["True", "False", "Cannot Say"],
        correctIndex: 0  // True - 70% vs 30% shows clear difference
    },
    {
        passage: "The library will extend its operating hours starting next month. Currently open from 9 AM to 6 PM on weekdays, it will now remain open until 9 PM. Weekend hours will change from 10 AM to 4 PM to 10 AM to 6 PM. The extended hours are in response to community requests.",
        statement: "The library will be open for the same number of hours on Saturdays as on weekdays.",
        options: ["True", "False", "Cannot Say"],
        correctIndex: 1  // False - weekdays 9AM-9PM = 12 hours, weekends 10AM-6PM = 8 hours
    },
    {
        passage: "A technology startup has secured $5 million in funding from venture capitalists. The company plans to use 40% of the funds for product development, 35% for marketing, and the remainder for operational expenses. The startup currently employs 20 people and plans to hire 10 more within the year.",
        statement: "The startup will spend more on marketing than on operational expenses.",
        options: ["True", "False", "Cannot Say"],
        correctIndex: 0  // True - 35% marketing vs 25% operational (100-40-35=25)
    },
    {
        passage: "Environmental scientists have documented a 20% decline in the local bee population over the past five years. They have identified pesticide use and habitat loss as potential contributing factors. A nearby farm has recently switched to organic farming methods, eliminating pesticide use on their property.",
        statement: "The switch to organic farming will reverse the decline in the bee population.",
        options: ["True", "False", "Cannot Say"],
        correctIndex: 2  // Cannot Say - we don't know if this one farm's change will be enough
    }
];

// 20 Additional Test Offers - All $1.99
const additionalTests = [
    { id: 1, name: 'Emotional Intelligence Test', icon: '💖', desc: 'Measure your EQ and emotional awareness', originalPrice: 9.99, currentPrice: 1.99 },
    { id: 2, name: 'Verbal Reasoning Test', icon: '📚', desc: 'Evaluate language comprehension skills', originalPrice: 9.99, currentPrice: 1.99 },
    { id: 3, name: 'Numerical Reasoning Test', icon: '🔢', desc: 'Test mathematical problem-solving', originalPrice: 9.99, currentPrice: 1.99 },
    { id: 4, name: 'Spatial Reasoning Test', icon: '🎯', desc: 'Assess 3D visualization abilities', originalPrice: 9.99, currentPrice: 1.99 },
    { id: 5, name: 'Critical Thinking Test', icon: '🤔', desc: 'Evaluate analytical decision making', originalPrice: 9.99, currentPrice: 1.99 },
    { id: 6, name: 'Memory Assessment', icon: '🧠', desc: 'Test short and long-term memory', originalPrice: 9.99, currentPrice: 1.99 },
    { id: 7, name: 'Personality Type Test', icon: '🎭', desc: 'Discover your personality profile', originalPrice: 9.99, currentPrice: 1.99 },
    { id: 8, name: 'Leadership Potential Test', icon: '👔', desc: 'Assess your leadership qualities', originalPrice: 9.99, currentPrice: 1.99 },
    { id: 9, name: 'Creativity Assessment', icon: '🎨', desc: 'Measure creative thinking abilities', originalPrice: 9.99, currentPrice: 1.99 },
    { id: 10, name: 'Stress Resilience Test', icon: '🧘', desc: 'Evaluate your stress management', originalPrice: 9.99, currentPrice: 1.99 },
    { id: 11, name: 'Problem Solving Test', icon: '🧩', desc: 'Test systematic problem-solving', originalPrice: 9.99, currentPrice: 1.99 },
    { id: 12, name: 'Attention to Detail Test', icon: '🔍', desc: 'Assess precision and accuracy', originalPrice: 9.99, currentPrice: 1.99 },
    { id: 13, name: 'Career Aptitude Test', icon: '💼', desc: 'Find your ideal career path', originalPrice: 9.99, currentPrice: 1.99 },
    { id: 14, name: 'Communication Skills Test', icon: '💬', desc: 'Evaluate interpersonal skills', originalPrice: 9.99, currentPrice: 1.99 },
    { id: 15, name: 'Time Management Test', icon: '⏰', desc: 'Assess productivity habits', originalPrice: 9.99, currentPrice: 1.99 },
    { id: 16, name: 'Decision Making Test', icon: '⚖️', desc: 'Test judgment under pressure', originalPrice: 9.99, currentPrice: 1.99 },
    { id: 17, name: 'Learning Style Assessment', icon: '📖', desc: 'Discover how you learn best', originalPrice: 9.99, currentPrice: 1.99 },
    { id: 18, name: 'Mechanical Reasoning Test', icon: '⚙️', desc: 'Test understanding of mechanics', originalPrice: 9.99, currentPrice: 1.99 },
    { id: 19, name: 'Situational Judgment Test', icon: '🎬', desc: 'Assess workplace judgment', originalPrice: 9.99, currentPrice: 1.99 },
    { id: 20, name: 'Complete Test Bundle', icon: '📦', desc: 'Access to all 20 cognitive assessments', originalPrice: 29.99, currentPrice: 9.99 }
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
    const totalQuestions = 40; // 10 * 4 tests
    const completedTests = state.currentTest;
    const currentTestProgress = state.currentQuestion / 10;
    const progress = ((completedTests + currentTestProgress) / 4) * 100;
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
        case 'abstract':
            testSectionId = 'testAbstract';
            break;
        case 'deductive':
            testSectionId = 'testDeductive';
            break;
        case 'pattern':
            testSectionId = 'testPattern';
            break;
        case 'analytical':
            testSectionId = 'testAnalytical';
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
        abstract: 'Abstract Reasoning',
        deductive: 'Deductive Reasoning',
        pattern: 'Pattern Recognition',
        analytical: 'Analytical Thinking'
    };
    document.getElementById('currentTestName').textContent = names[testId] || 'Logic Assessment';
}

function nextTest() {
    state.currentTest++;
    state.currentQuestion = 0;
    state.selectedAnswer = null;
    showCurrentTest();
}

// ============================================
// Abstract Reasoning Test
// ============================================

function startAbstract() {
    document.getElementById('abstractIntro').style.display = 'none';
    document.getElementById('abstractDisplay').style.display = 'block';
    state.currentQuestion = 0;
    state.testStartTime = Date.now();
    showAbstractQuestion();
}

function showAbstractQuestion() {
    if (state.currentQuestion >= abstractQuestions.length) {
        state.scores.abstract.time = (Date.now() - state.testStartTime) / 1000;
        nextTest();
        return;
    }

    const q = abstractQuestions[state.currentQuestion];
    document.getElementById('abstractCounter').textContent = `Question ${state.currentQuestion + 1} of ${abstractQuestions.length}`;
    document.getElementById('testTimer').textContent = `⏱️ Q${state.currentQuestion + 1}/${abstractQuestions.length}`;

    // Display sequence
    const sequenceContainer = document.getElementById('abstractSequence');
    sequenceContainer.innerHTML = '';
    q.sequence.forEach((shape, index) => {
        const div = document.createElement('div');
        div.className = 'pattern-item';
        div.innerHTML = shape;
        div.style.animationDelay = `${index * 0.1}s`;
        sequenceContainer.appendChild(div);
    });

    // Display options
    const optionsContainer = document.getElementById('abstractOptions');
    optionsContainer.innerHTML = '';
    q.options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'answer-option';
        div.innerHTML = option;
        div.dataset.index = index;
        div.addEventListener('click', () => selectAbstractAnswer(div, index, q.correctIndex));
        optionsContainer.appendChild(div);
    });

    state.selectedAnswer = null;
}

function selectAbstractAnswer(element, selectedIndex, correctIndex) {
    if (state.selectedAnswer !== null) return;
    state.selectedAnswer = selectedIndex;

    document.querySelectorAll('.answer-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');

    if (selectedIndex === correctIndex) {
        state.scores.abstract.correct++;
    }

    setTimeout(() => {
        state.currentQuestion++;
        updateProgress();
        showAbstractQuestion();
    }, 800);
}

// ============================================
// Deductive Reasoning Test
// ============================================

function startDeductive() {
    document.getElementById('deductiveIntro').style.display = 'none';
    document.getElementById('deductiveDisplay').style.display = 'block';
    state.currentQuestion = 0;
    state.testStartTime = Date.now();
    showDeductiveQuestion();
}

function showDeductiveQuestion() {
    if (state.currentQuestion >= deductiveQuestions.length) {
        state.scores.deductive.time = (Date.now() - state.testStartTime) / 1000;
        nextTest();
        return;
    }

    const q = deductiveQuestions[state.currentQuestion];
    document.getElementById('deductiveCounter').textContent = `Question ${state.currentQuestion + 1} of ${deductiveQuestions.length}`;
    document.getElementById('testTimer').textContent = `⏱️ Q${state.currentQuestion + 1}/${deductiveQuestions.length}`;

    // Display premises
    const premiseContainer = document.getElementById('premiseContainer');
    premiseContainer.innerHTML = '';
    q.premises.forEach((premise, index) => {
        const div = document.createElement('div');
        div.className = 'premise-box';
        div.innerHTML = `
            <div class="premise-label">Premise ${index + 1}</div>
            <div class="premise-text">${premise}</div>
        `;
        premiseContainer.appendChild(div);
    });

    // Display options
    const optionsContainer = document.getElementById('deductiveOptions');
    optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'deductive-option';
        div.innerHTML = `
            <span class="option-letter">${letters[index]}</span>
            <span class="option-text">${option.text}</span>
        `;
        div.dataset.correct = option.correct;
        div.addEventListener('click', () => selectDeductiveAnswer(div, option.correct));
        optionsContainer.appendChild(div);
    });

    state.selectedAnswer = null;
}

function selectDeductiveAnswer(element, isCorrect) {
    if (state.selectedAnswer !== null) return;
    state.selectedAnswer = true;

    document.querySelectorAll('.deductive-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');

    if (isCorrect) {
        state.scores.deductive.correct++;
    }

    setTimeout(() => {
        state.currentQuestion++;
        updateProgress();
        showDeductiveQuestion();
    }, 800);
}

// ============================================
// Pattern Recognition Test
// ============================================

function startPattern() {
    document.getElementById('patternIntro').style.display = 'none';
    document.getElementById('patternDisplay').style.display = 'block';
    state.currentQuestion = 0;
    state.testStartTime = Date.now();
    showPatternQuestion();
}

function showPatternQuestion() {
    if (state.currentQuestion >= patternQuestions.length) {
        state.scores.pattern.time = (Date.now() - state.testStartTime) / 1000;
        nextTest();
        return;
    }

    const q = patternQuestions[state.currentQuestion];
    document.getElementById('patternCounter').textContent = `Question ${state.currentQuestion + 1} of ${patternQuestions.length}`;
    document.getElementById('testTimer').textContent = `⏱️ Q${state.currentQuestion + 1}/${patternQuestions.length}`;

    // Display sequence
    const sequenceContainer = document.getElementById('sequenceDisplay');
    sequenceContainer.innerHTML = '';
    q.sequence.forEach((item, index) => {
        const span = document.createElement('span');
        span.className = 'sequence-item';
        span.textContent = item;
        span.style.animationDelay = `${index * 0.1}s`;
        sequenceContainer.appendChild(span);

        if (index < q.sequence.length - 1) {
            const arrow = document.createElement('span');
            arrow.className = 'sequence-arrow';
            arrow.textContent = '→';
            sequenceContainer.appendChild(arrow);
        }
    });

    // Add question mark
    const arrow = document.createElement('span');
    arrow.className = 'sequence-arrow';
    arrow.textContent = '→';
    sequenceContainer.appendChild(arrow);

    const questionMark = document.createElement('span');
    questionMark.className = 'sequence-question';
    questionMark.textContent = '?';
    sequenceContainer.appendChild(questionMark);

    // Display options
    const optionsContainer = document.getElementById('patternOptions');
    optionsContainer.innerHTML = '';
    q.options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'pattern-option';
        div.textContent = option;
        div.dataset.index = index;
        div.addEventListener('click', () => selectPatternAnswer(div, index, q.correctIndex));
        optionsContainer.appendChild(div);
    });

    state.selectedAnswer = null;
}

function selectPatternAnswer(element, selectedIndex, correctIndex) {
    if (state.selectedAnswer !== null) return;
    state.selectedAnswer = selectedIndex;

    document.querySelectorAll('.pattern-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');

    if (selectedIndex === correctIndex) {
        state.scores.pattern.correct++;
    }

    setTimeout(() => {
        state.currentQuestion++;
        updateProgress();
        showPatternQuestion();
    }, 800);
}

// ============================================
// Analytical Thinking Test
// ============================================

function startAnalytical() {
    document.getElementById('analyticalIntro').style.display = 'none';
    document.getElementById('analyticalDisplay').style.display = 'block';
    state.currentQuestion = 0;
    state.testStartTime = Date.now();
    showAnalyticalQuestion();
}

function showAnalyticalQuestion() {
    if (state.currentQuestion >= analyticalQuestions.length) {
        state.scores.analytical.time = (Date.now() - state.testStartTime) / 1000;
        nextTest();
        return;
    }

    const q = analyticalQuestions[state.currentQuestion];
    document.getElementById('analyticalCounter').textContent = `Question ${state.currentQuestion + 1} of ${analyticalQuestions.length}`;
    document.getElementById('testTimer').textContent = `⏱️ Q${state.currentQuestion + 1}/${analyticalQuestions.length}`;

    // Display passage
    document.getElementById('passageContainer').innerHTML = `
        <div class="passage-title">📖 Read the following passage:</div>
        <div class="passage-text">${q.passage}</div>
    `;

    // Display statement
    document.getElementById('statementContainer').innerHTML = `
        <div class="statement-label">Statement to Evaluate:</div>
        <div class="statement-text">"${q.statement}"</div>
    `;

    // Display options
    const optionsContainer = document.getElementById('analyticalOptions');
    optionsContainer.innerHTML = '';
    const optionClasses = ['true-opt', 'false-opt', 'cannot-opt'];
    q.options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = `verbal-option ${optionClasses[index]}`;
        div.textContent = option;
        div.dataset.index = index;
        div.addEventListener('click', () => selectAnalyticalAnswer(div, index, q.correctIndex));
        optionsContainer.appendChild(div);
    });

    state.selectedAnswer = null;
}

function selectAnalyticalAnswer(element, selectedIndex, correctIndex) {
    if (state.selectedAnswer !== null) return;
    state.selectedAnswer = selectedIndex;

    document.querySelectorAll('.verbal-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');

    if (selectedIndex === correctIndex) {
        state.scores.analytical.correct++;
    }

    setTimeout(() => {
        state.currentQuestion++;
        updateProgress();
        showAnalyticalQuestion();
    }, 800);
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
        buttonText.textContent = 'Pay $1.99';
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
