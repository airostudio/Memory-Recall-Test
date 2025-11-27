/**
 * Logical Reasoning Test Application
 * World-class aptitude assessment for logical thinking and problem-solving
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
    tests: ['abstract', 'deductive', 'pattern', 'verbal', 'spatial'],
    scores: {
        abstract: { correct: 0, total: 10, time: 0 },
        deductive: { correct: 0, total: 8, time: 0 },
        pattern: { correct: 0, total: 8, time: 0 },
        verbal: { correct: 0, total: 6, time: 0 },
        spatial: { correct: 0, total: 8, time: 0 }
    },
    currentQuestion: 0,
    testStartTime: null,
    selectedAnswer: null,
    paymentComplete: false
};

// ============================================
// SVG Shape Generators
// ============================================

const colors = {
    red: '#FF6B6B',
    blue: '#4ECDC4',
    purple: '#667eea',
    orange: '#FFA502',
    green: '#26de81',
    pink: '#F093FB',
    yellow: '#FECA57',
    cyan: '#45B7D1'
};

function createTriangle(color, rotation = 0) {
    return `<svg viewBox="0 0 100 100">
        <polygon points="50,10 90,90 10,90" fill="${color}" transform="rotate(${rotation} 50 50)"/>
    </svg>`;
}

function createSquare(color, rotation = 0) {
    return `<svg viewBox="0 0 100 100">
        <rect x="15" y="15" width="70" height="70" fill="${color}" transform="rotate(${rotation} 50 50)"/>
    </svg>`;
}

function createCircle(color) {
    return `<svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="${color}"/>
    </svg>`;
}

function createDiamond(color, rotation = 0) {
    return `<svg viewBox="0 0 100 100">
        <polygon points="50,10 90,50 50,90 10,50" fill="${color}" transform="rotate(${rotation} 50 50)"/>
    </svg>`;
}

function createPentagon(color, rotation = 0) {
    return `<svg viewBox="0 0 100 100">
        <polygon points="50,10 95,40 80,90 20,90 5,40" fill="${color}" transform="rotate(${rotation} 50 50)"/>
    </svg>`;
}

function createHexagon(color, rotation = 0) {
    return `<svg viewBox="0 0 100 100">
        <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="${color}" transform="rotate(${rotation} 50 50)"/>
    </svg>`;
}

function createStar(color, rotation = 0) {
    return `<svg viewBox="0 0 100 100">
        <polygon points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40" fill="${color}" transform="rotate(${rotation} 50 50)"/>
    </svg>`;
}

function createArrow(color, rotation = 0) {
    return `<svg viewBox="0 0 100 100">
        <polygon points="50,10 80,50 65,50 65,90 35,90 35,50 20,50" fill="${color}" transform="rotate(${rotation} 50 50)"/>
    </svg>`;
}

function createCross(color, rotation = 0) {
    return `<svg viewBox="0 0 100 100">
        <path d="M35,10 L65,10 L65,35 L90,35 L90,65 L65,65 L65,90 L35,90 L35,65 L10,65 L10,35 L35,35 Z" fill="${color}" transform="rotate(${rotation} 50 50)"/>
    </svg>`;
}

function createLShape(color, rotation = 0) {
    return `<svg viewBox="0 0 100 100">
        <path d="M20,10 L50,10 L50,60 L90,60 L90,90 L20,90 Z" fill="${color}" transform="rotate(${rotation} 50 50)"/>
    </svg>`;
}

// ============================================
// Abstract Reasoning Questions (Shape Patterns)
// ============================================

const abstractQuestions = [
    {
        // Pattern: Size increases
        sequence: [
            createCircle(colors.blue),
            `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="25" fill="${colors.blue}"/></svg>`,
            `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" fill="${colors.blue}"/></svg>`,
        ],
        options: [
            `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="${colors.blue}"/></svg>`,
            `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="${colors.blue}"/></svg>`,
            createSquare(colors.blue),
            `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" fill="${colors.red}"/></svg>`,
        ],
        answer: 0
    },
    {
        // Pattern: Rotation +90 degrees
        sequence: [
            createTriangle(colors.red, 0),
            createTriangle(colors.red, 90),
            createTriangle(colors.red, 180),
        ],
        options: [
            createTriangle(colors.red, 270),
            createTriangle(colors.red, 0),
            createTriangle(colors.blue, 270),
            createSquare(colors.red, 270),
        ],
        answer: 0
    },
    {
        // Pattern: Shape sequence (circle, square, triangle, repeat)
        sequence: [
            createCircle(colors.purple),
            createSquare(colors.purple),
            createTriangle(colors.purple),
            createCircle(colors.purple),
        ],
        options: [
            createSquare(colors.purple),
            createTriangle(colors.purple),
            createCircle(colors.purple),
            createDiamond(colors.purple),
        ],
        answer: 0
    },
    {
        // Pattern: Color change (red, blue, red, blue)
        sequence: [
            createSquare(colors.red),
            createSquare(colors.blue),
            createSquare(colors.red),
        ],
        options: [
            createSquare(colors.blue),
            createSquare(colors.red),
            createSquare(colors.green),
            createCircle(colors.blue),
        ],
        answer: 0
    },
    {
        // Pattern: Adding sides (triangle, square, pentagon, hexagon)
        sequence: [
            createTriangle(colors.orange),
            createSquare(colors.orange),
            createPentagon(colors.orange),
        ],
        options: [
            createHexagon(colors.orange),
            createCircle(colors.orange),
            createTriangle(colors.orange),
            createStar(colors.orange),
        ],
        answer: 0
    },
    {
        // Pattern: Alternating shapes with rotation
        sequence: [
            createArrow(colors.green, 0),
            createArrow(colors.green, 90),
            createArrow(colors.green, 180),
        ],
        options: [
            createArrow(colors.green, 270),
            createArrow(colors.green, 0),
            createArrow(colors.red, 270),
            createTriangle(colors.green, 270),
        ],
        answer: 0
    },
    {
        // Pattern: Diamond rotation
        sequence: [
            createDiamond(colors.cyan, 0),
            createDiamond(colors.cyan, 45),
            createDiamond(colors.cyan, 90),
        ],
        options: [
            createDiamond(colors.cyan, 135),
            createDiamond(colors.cyan, 0),
            createSquare(colors.cyan, 135),
            createDiamond(colors.red, 135),
        ],
        answer: 0
    },
    {
        // Pattern: Star with color change
        sequence: [
            createStar(colors.yellow),
            createStar(colors.orange),
            createStar(colors.red),
        ],
        options: [
            createStar(colors.pink),
            createStar(colors.yellow),
            createCircle(colors.pink),
            createStar(colors.blue),
        ],
        answer: 0
    },
    {
        // Pattern: Cross rotation
        sequence: [
            createCross(colors.blue, 0),
            createCross(colors.blue, 45),
            createCross(colors.blue, 90),
        ],
        options: [
            createCross(colors.blue, 135),
            createCross(colors.blue, 0),
            createCross(colors.red, 135),
            createStar(colors.blue, 135),
        ],
        answer: 0
    },
    {
        // Pattern: L-shape rotation
        sequence: [
            createLShape(colors.purple, 0),
            createLShape(colors.purple, 90),
            createLShape(colors.purple, 180),
        ],
        options: [
            createLShape(colors.purple, 270),
            createLShape(colors.purple, 0),
            createLShape(colors.red, 270),
            createSquare(colors.purple, 270),
        ],
        answer: 0
    }
];

// ============================================
// Deductive Reasoning Questions
// ============================================

const deductiveQuestions = [
    {
        premises: [
            "All dogs are mammals.",
            "All mammals are warm-blooded."
        ],
        options: [
            "All dogs are warm-blooded.",
            "All warm-blooded animals are dogs.",
            "Some mammals are not warm-blooded.",
            "No dogs are warm-blooded."
        ],
        answer: 0
    },
    {
        premises: [
            "If it rains, the ground gets wet.",
            "The ground is wet."
        ],
        options: [
            "It definitely rained.",
            "The ground might have been watered.",
            "It did not rain.",
            "We cannot conclude whether it rained."
        ],
        answer: 3
    },
    {
        premises: [
            "All students in Class A passed the exam.",
            "John is a student in Class A."
        ],
        options: [
            "John passed the exam.",
            "John might have failed the exam.",
            "John is the best student.",
            "Some students in Class A failed."
        ],
        answer: 0
    },
    {
        premises: [
            "No reptiles are warm-blooded.",
            "All snakes are reptiles."
        ],
        options: [
            "All snakes are warm-blooded.",
            "No snakes are warm-blooded.",
            "Some snakes are warm-blooded.",
            "Snakes might be warm-blooded."
        ],
        answer: 1
    },
    {
        premises: [
            "All prime numbers greater than 2 are odd.",
            "17 is a prime number greater than 2."
        ],
        options: [
            "17 is even.",
            "17 is odd.",
            "17 might be even or odd.",
            "We cannot determine if 17 is odd."
        ],
        answer: 1
    },
    {
        premises: [
            "Some birds can fly.",
            "Penguins are birds."
        ],
        options: [
            "Penguins can definitely fly.",
            "Penguins cannot fly.",
            "Penguins may or may not fly based on this information.",
            "All birds can fly."
        ],
        answer: 2
    },
    {
        premises: [
            "If a shape has four equal sides and four right angles, it is a square.",
            "Shape X has four equal sides and four right angles."
        ],
        options: [
            "Shape X is a rectangle.",
            "Shape X is a square.",
            "Shape X might be a square.",
            "Shape X is a rhombus."
        ],
        answer: 1
    },
    {
        premises: [
            "All managers attended the meeting.",
            "Sarah did not attend the meeting."
        ],
        options: [
            "Sarah is a manager.",
            "Sarah is not a manager.",
            "Sarah might be a manager.",
            "The meeting was canceled."
        ],
        answer: 1
    }
];

// ============================================
// Pattern Recognition Questions (Number/Letter Sequences)
// ============================================

const patternQuestions = [
    {
        sequence: [2, 4, 6, 8],
        type: 'number',
        options: [10, 9, 12, 16],
        answer: 0
    },
    {
        sequence: [1, 4, 9, 16],
        type: 'number',
        options: [20, 25, 32, 36],
        answer: 1
    },
    {
        sequence: [3, 6, 12, 24],
        type: 'number',
        options: [36, 48, 30, 72],
        answer: 1
    },
    {
        sequence: ['A', 'C', 'E', 'G'],
        type: 'letter',
        options: ['H', 'I', 'J', 'K'],
        answer: 1
    },
    {
        sequence: [1, 1, 2, 3, 5],
        type: 'number',
        options: [6, 7, 8, 10],
        answer: 2
    },
    {
        sequence: [100, 50, 25, 12.5],
        type: 'number',
        options: [6.25, 6, 10, 5],
        answer: 0
    },
    {
        sequence: ['Z', 'X', 'V', 'T'],
        type: 'letter',
        options: ['S', 'R', 'Q', 'P'],
        answer: 1
    },
    {
        sequence: [2, 6, 18, 54],
        type: 'number',
        options: [108, 162, 72, 216],
        answer: 1
    }
];

// ============================================
// Verbal Reasoning Questions
// ============================================

const verbalQuestions = [
    {
        passage: "The company announced record profits for the third quarter. Revenue increased by 25% compared to the same period last year. The CEO attributed this success to the launch of their new product line and expansion into Asian markets.",
        statement: "The company's profits increased due to their new product line.",
        options: ['True', 'False', 'Cannot Say'],
        answer: 0
    },
    {
        passage: "Studies show that regular exercise improves mental health. Participants who exercised for 30 minutes daily reported lower stress levels. The research was conducted over a six-month period with 500 participants.",
        statement: "All 500 participants experienced lower stress levels.",
        options: ['True', 'False', 'Cannot Say'],
        answer: 2
    },
    {
        passage: "The museum will be closed for renovations from January to March. During this period, some exhibits will be moved to the city's cultural center. The renovation will include upgrading the lighting systems and installing new climate control.",
        statement: "Visitors cannot see any museum exhibits during the renovation period.",
        options: ['True', 'False', 'Cannot Say'],
        answer: 1
    },
    {
        passage: "The new traffic regulations require all cyclists to wear helmets in urban areas. Fines for non-compliance will be $50 for first-time offenders and $100 for repeat violations. The law comes into effect on April 1st.",
        statement: "Cyclists in rural areas are not required to wear helmets under the new regulations.",
        options: ['True', 'False', 'Cannot Say'],
        answer: 2
    },
    {
        passage: "The technology conference attracted over 5,000 attendees from 30 countries. The keynote speech focused on artificial intelligence in healthcare. Several companies announced partnerships during the event.",
        statement: "The conference had attendees from fewer than 25 countries.",
        options: ['True', 'False', 'Cannot Say'],
        answer: 1
    },
    {
        passage: "Research indicates that bilingual children often show enhanced problem-solving abilities. A study at Northwestern University found that switching between languages exercises the brain's executive function. The benefits were observed in children who regularly used both languages at home.",
        statement: "Children who speak only one language cannot develop good problem-solving abilities.",
        options: ['True', 'False', 'Cannot Say'],
        answer: 2
    }
];

// ============================================
// Spatial Reasoning Questions
// ============================================

const spatialQuestions = [
    {
        title: "Which shape is the 90° clockwise rotation of the original?",
        original: createLShape(colors.blue, 0),
        options: [
            createLShape(colors.blue, 90),
            createLShape(colors.blue, 180),
            createLShape(colors.blue, 270),
            createLShape(colors.blue, 45),
        ],
        answer: 0
    },
    {
        title: "Which shape is the mirror image (flipped horizontally)?",
        original: `<svg viewBox="0 0 100 100"><path d="M20,20 L80,20 L80,50 L50,50 L50,80 L20,80 Z" fill="${colors.purple}"/></svg>`,
        options: [
            `<svg viewBox="0 0 100 100"><path d="M80,20 L20,20 L20,50 L50,50 L50,80 L80,80 Z" fill="${colors.purple}"/></svg>`,
            `<svg viewBox="0 0 100 100"><path d="M20,80 L80,80 L80,50 L50,50 L50,20 L20,20 Z" fill="${colors.purple}"/></svg>`,
            `<svg viewBox="0 0 100 100"><path d="M20,20 L80,20 L80,50 L50,50 L50,80 L20,80 Z" fill="${colors.purple}"/></svg>`,
            `<svg viewBox="0 0 100 100"><path d="M50,20 L80,20 L80,80 L20,80 L20,50 L50,50 Z" fill="${colors.purple}"/></svg>`,
        ],
        answer: 0
    },
    {
        title: "Which shape is the 180° rotation of the original?",
        original: createArrow(colors.green, 0),
        options: [
            createArrow(colors.green, 90),
            createArrow(colors.green, 180),
            createArrow(colors.green, 270),
            createArrow(colors.green, 45),
        ],
        answer: 1
    },
    {
        title: "Which shape is the 270° clockwise rotation of the original?",
        original: createTriangle(colors.red, 0),
        options: [
            createTriangle(colors.red, 90),
            createTriangle(colors.red, 180),
            createTriangle(colors.red, 270),
            createTriangle(colors.red, 45),
        ],
        answer: 2
    },
    {
        title: "Which shape is the same as the original but rotated 45°?",
        original: createSquare(colors.orange, 0),
        options: [
            createSquare(colors.orange, 90),
            createSquare(colors.orange, 45),
            createSquare(colors.orange, 30),
            createSquare(colors.orange, 0),
        ],
        answer: 1
    },
    {
        title: "Which shape completes the pattern when rotated?",
        original: createCross(colors.cyan, 0),
        options: [
            createCross(colors.cyan, 45),
            createCross(colors.cyan, 90),
            createCross(colors.cyan, 135),
            createCross(colors.cyan, 180),
        ],
        answer: 0
    },
    {
        title: "Which shape is the 90° counter-clockwise rotation?",
        original: createPentagon(colors.pink, 0),
        options: [
            createPentagon(colors.pink, 90),
            createPentagon(colors.pink, 270),
            createPentagon(colors.pink, 180),
            createPentagon(colors.pink, 45),
        ],
        answer: 1
    },
    {
        title: "Which shape is the 180° rotation of the original?",
        original: createHexagon(colors.yellow, 0),
        options: [
            createHexagon(colors.yellow, 90),
            createHexagon(colors.yellow, 45),
            createHexagon(colors.yellow, 180),
            createHexagon(colors.yellow, 270),
        ],
        answer: 2
    }
];

// 20 Additional Test Offers
const additionalTests = [
    { id: 1, name: 'Numerical Reasoning Test', icon: '🔢', desc: 'Measure your numerical analysis abilities', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 2, name: 'Critical Thinking Test', icon: '🎯', desc: 'Test your analytical reasoning skills', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 3, name: 'Mechanical Reasoning Test', icon: '⚙️', desc: 'Evaluate understanding of physical principles', originalPrice: 12.99, currentPrice: 4.99 },
    { id: 4, name: 'Situational Judgment Test', icon: '👔', desc: 'Assess workplace decision-making', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 5, name: 'Inductive Reasoning Test', icon: '🧩', desc: 'Test pattern recognition abilities', originalPrice: 14.99, currentPrice: 5.99 },
    { id: 6, name: 'Diagrammatic Reasoning Test', icon: '📊', desc: 'Analyze flowcharts and diagrams', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 7, name: 'Error Checking Test', icon: '🔍', desc: 'Evaluate attention to detail', originalPrice: 11.99, currentPrice: 4.49 },
    { id: 8, name: 'Watson Glaser Test', icon: '📚', desc: 'Critical thinking assessment', originalPrice: 14.99, currentPrice: 5.99 },
    { id: 9, name: 'Cognitive Ability Test', icon: '🧠', desc: 'Comprehensive mental aptitude', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 10, name: 'Abstract Reasoning Advanced', icon: '🔷', desc: 'Advanced pattern analysis', originalPrice: 11.99, currentPrice: 4.49 },
    { id: 11, name: 'Emotional Intelligence Test', icon: '❤️', desc: 'Measure EQ and empathy', originalPrice: 14.99, currentPrice: 5.99 },
    { id: 12, name: 'Memory Assessment', icon: '💭', desc: 'Evaluate memory capacity', originalPrice: 12.99, currentPrice: 4.99 },
    { id: 13, name: 'Processing Speed Test', icon: '⚡', desc: 'Test cognitive processing speed', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 14, name: 'Syllogisms Test', icon: '📝', desc: 'Advanced deductive reasoning', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 15, name: 'Analogies Test', icon: '🔄', desc: 'Verbal and visual analogies', originalPrice: 12.99, currentPrice: 4.99 },
    { id: 16, name: 'Data Interpretation Test', icon: '📈', desc: 'Analyze charts and graphs', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 17, name: 'Decision Making Test', icon: '⚖️', desc: 'Evaluate judgment skills', originalPrice: 14.99, currentPrice: 5.99 },
    { id: 18, name: 'Sequence Completion Test', icon: '➡️', desc: 'Advanced pattern completion', originalPrice: 7.99, currentPrice: 2.99 },
    { id: 19, name: 'Coding Assessment', icon: '💻', desc: 'Logic in programming context', originalPrice: 19.99, currentPrice: 7.99 },
    { id: 20, name: 'Complete IQ Assessment', icon: '🏆', desc: 'Full intelligence quotient test', originalPrice: 29.99, currentPrice: 12.99 }
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
    const totalQuestions = 40; // 10 + 8 + 8 + 6 + 8
    const completedQuestions =
        (state.currentTest > 0 ? 10 : state.currentQuestion) +
        (state.currentTest > 1 ? 8 : (state.currentTest === 1 ? state.currentQuestion : 0)) +
        (state.currentTest > 2 ? 8 : (state.currentTest === 2 ? state.currentQuestion : 0)) +
        (state.currentTest > 3 ? 6 : (state.currentTest === 3 ? state.currentQuestion : 0)) +
        (state.currentTest > 4 ? 8 : (state.currentTest === 4 ? state.currentQuestion : 0));

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
    const testSection = document.getElementById(`test${currentTestId.charAt(0).toUpperCase() + currentTestId.slice(1)}`);

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
        verbal: 'Verbal Reasoning',
        spatial: 'Spatial Reasoning'
    };
    document.getElementById('currentTestName').textContent = names[testId] || 'Reasoning Test';
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
    const sequenceContainer = document.getElementById('patternSequence');
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
        div.addEventListener('click', () => selectAbstractAnswer(div, index, q.answer));
        optionsContainer.appendChild(div);
    });

    state.selectedAnswer = null;
}

function selectAbstractAnswer(element, selected, correct) {
    if (state.selectedAnswer !== null) return;
    state.selectedAnswer = selected;

    // Remove previous selections
    document.querySelectorAll('.answer-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');

    if (selected === correct) {
        state.scores.abstract.correct++;
    }

    // Move to next question after delay
    setTimeout(() => {
        state.currentQuestion++;
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
            <span class="option-text">${option}</span>
        `;
        div.dataset.index = index;
        div.addEventListener('click', () => selectDeductiveAnswer(div, index, q.answer));
        optionsContainer.appendChild(div);
    });

    state.selectedAnswer = null;
}

function selectDeductiveAnswer(element, selected, correct) {
    if (state.selectedAnswer !== null) return;
    state.selectedAnswer = selected;

    document.querySelectorAll('.deductive-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');

    if (selected === correct) {
        state.scores.deductive.correct++;
    }

    setTimeout(() => {
        state.currentQuestion++;
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
        const div = document.createElement('div');
        div.className = 'sequence-item';
        div.textContent = item;
        div.style.animationDelay = `${index * 0.1}s`;
        sequenceContainer.appendChild(div);
    });

    // Add question mark
    const questionDiv = document.createElement('div');
    questionDiv.className = 'sequence-question';
    questionDiv.textContent = '?';
    sequenceContainer.appendChild(questionDiv);

    // Display options
    const optionsContainer = document.getElementById('patternOptions');
    optionsContainer.innerHTML = '';
    q.options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'pattern-option';
        div.textContent = option;
        div.dataset.index = index;
        div.addEventListener('click', () => selectPatternAnswer(div, index, q.answer));
        optionsContainer.appendChild(div);
    });

    state.selectedAnswer = null;
}

function selectPatternAnswer(element, selected, correct) {
    if (state.selectedAnswer !== null) return;
    state.selectedAnswer = selected;

    document.querySelectorAll('.pattern-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');

    if (selected === correct) {
        state.scores.pattern.correct++;
    }

    setTimeout(() => {
        state.currentQuestion++;
        showPatternQuestion();
    }, 800);
}

// ============================================
// Verbal Reasoning Test
// ============================================

function startVerbal() {
    document.getElementById('verbalIntro').style.display = 'none';
    document.getElementById('verbalDisplay').style.display = 'block';
    state.currentQuestion = 0;
    state.testStartTime = Date.now();
    showVerbalQuestion();
}

function showVerbalQuestion() {
    if (state.currentQuestion >= verbalQuestions.length) {
        state.scores.verbal.time = (Date.now() - state.testStartTime) / 1000;
        nextTest();
        return;
    }

    const q = verbalQuestions[state.currentQuestion];
    document.getElementById('verbalCounter').textContent = `Question ${state.currentQuestion + 1} of ${verbalQuestions.length}`;
    document.getElementById('testTimer').textContent = `⏱️ Q${state.currentQuestion + 1}/${verbalQuestions.length}`;

    // Display passage
    document.getElementById('passageContainer').innerHTML = `
        <div class="passage-title">📖 Passage</div>
        <div class="passage-text">${q.passage}</div>
    `;

    // Display statement
    document.getElementById('statementContainer').innerHTML = `
        <div class="statement-label">Statement to Evaluate:</div>
        <div class="statement-text">${q.statement}</div>
    `;

    // Display options
    const optionsContainer = document.getElementById('verbalOptions');
    optionsContainer.innerHTML = '';
    q.options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'verbal-option';
        if (option === 'True') div.classList.add('true-opt');
        if (option === 'False') div.classList.add('false-opt');
        if (option === 'Cannot Say') div.classList.add('cannot-opt');
        div.textContent = option;
        div.dataset.index = index;
        div.addEventListener('click', () => selectVerbalAnswer(div, index, q.answer));
        optionsContainer.appendChild(div);
    });

    state.selectedAnswer = null;
}

function selectVerbalAnswer(element, selected, correct) {
    if (state.selectedAnswer !== null) return;
    state.selectedAnswer = selected;

    document.querySelectorAll('.verbal-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');

    if (selected === correct) {
        state.scores.verbal.correct++;
    }

    setTimeout(() => {
        state.currentQuestion++;
        showVerbalQuestion();
    }, 800);
}

// ============================================
// Spatial Reasoning Test
// ============================================

function startSpatial() {
    document.getElementById('spatialIntro').style.display = 'none';
    document.getElementById('spatialDisplay').style.display = 'block';
    state.currentQuestion = 0;
    state.testStartTime = Date.now();
    showSpatialQuestion();
}

function showSpatialQuestion() {
    if (state.currentQuestion >= spatialQuestions.length) {
        state.scores.spatial.time = (Date.now() - state.testStartTime) / 1000;
        nextTest();
        return;
    }

    const q = spatialQuestions[state.currentQuestion];
    document.getElementById('spatialCounter').textContent = `Question ${state.currentQuestion + 1} of ${spatialQuestions.length}`;
    document.getElementById('testTimer').textContent = `⏱️ Q${state.currentQuestion + 1}/${spatialQuestions.length}`;
    document.getElementById('spatialTitle').textContent = q.title;

    // Display original shape
    document.getElementById('spatialQuestion').innerHTML = `
        <div class="original-shape">
            <div class="original-label">Original Shape</div>
            <div class="shape-box">${q.original}</div>
        </div>
    `;

    // Display options
    const optionsContainer = document.getElementById('spatialOptions');
    optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'spatial-option';
        div.innerHTML = `
            <span class="spatial-option-label">${letters[index]}</span>
            ${option}
        `;
        div.dataset.index = index;
        div.addEventListener('click', () => selectSpatialAnswer(div, index, q.answer));
        optionsContainer.appendChild(div);
    });

    state.selectedAnswer = null;
}

function selectSpatialAnswer(element, selected, correct) {
    if (state.selectedAnswer !== null) return;
    state.selectedAnswer = selected;

    document.querySelectorAll('.spatial-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');

    if (selected === correct) {
        state.scores.spatial.correct++;
    }

    setTimeout(() => {
        state.currentQuestion++;
        showSpatialQuestion();
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
            alert(`${test.name} - Coming soon! Stay tuned for more cognitive assessments.`);
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
