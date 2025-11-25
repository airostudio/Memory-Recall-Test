/**
 * Memory Recall Test Application
 * Based on ISLT, ADAS-Cog, Logical Memory, SKT, and SAGE standardized tests
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
    tests: ['islt', 'adas', 'lm', 'skt', 'sage'],
    scores: {
        islt: { correct: 0, total: 12, time: 0 },
        adas: { correct: 0, total: 10, time: 0 },
        lm: { correct: 0, total: 5, time: 0 },
        skt: { correct: 0, total: 8, speed: 0, recall: 0 },
        sage: { correct: 0, total: 8, time: 0 }
    },
    testData: {},
    paymentComplete: false
};

// ============================================
// Test Data
// ============================================

// ISLT Shopping List Items (International Shopping List Test)
const shoppingItems = [
    { name: 'Bread', icon: '🍞' },
    { name: 'Milk', icon: '🥛' },
    { name: 'Eggs', icon: '🥚' },
    { name: 'Butter', icon: '🧈' },
    { name: 'Cheese', icon: '🧀' },
    { name: 'Apple', icon: '🍎' },
    { name: 'Banana', icon: '🍌' },
    { name: 'Orange', icon: '🍊' },
    { name: 'Tomato', icon: '🍅' },
    { name: 'Carrot', icon: '🥕' },
    { name: 'Onion', icon: '🧅' },
    { name: 'Potato', icon: '🥔' }
];

// Distractor items for recall
const distractorItems = [
    { name: 'Grapes', icon: '🍇' },
    { name: 'Lemon', icon: '🍋' },
    { name: 'Corn', icon: '🌽' },
    { name: 'Mushroom', icon: '🍄' },
    { name: 'Pepper', icon: '🫑' },
    { name: 'Broccoli', icon: '🥦' },
    { name: 'Fish', icon: '🐟' },
    { name: 'Chicken', icon: '🍗' }
];

// ADAS-Cog Word List (10-word recall)
const adasWords = [
    'OCEAN', 'LETTER', 'QUEEN', 'GARDEN', 'CABIN',
    'NEEDLE', 'BUTTER', 'VILLAGE', 'METAL', 'ARMY'
];

// Logical Memory Story
const stories = [
    {
        title: 'The Brave Firefighter',
        content: `Anna Roberts, a 32-year-old firefighter from Chicago, saved three children from a burning apartment building on Oak Street last Tuesday evening. The fire started at 7:45 PM on the third floor. Anna climbed a 40-foot ladder and carried each child to safety. The children, ages 4, 6, and 8, were treated for minor smoke inhalation at Memorial Hospital. The mayor awarded Anna the Medal of Valor on Friday.`,
        questions: [
            { question: "What was the firefighter's first name?", options: ['Sarah', 'Anna', 'Maria', 'Emma'], answer: 'Anna' },
            { question: "How old was the firefighter?", options: ['28', '30', '32', '35'], answer: '32' },
            { question: "What street was the building on?", options: ['Elm Street', 'Oak Street', 'Pine Street', 'Maple Street'], answer: 'Oak Street' },
            { question: "How many children were saved?", options: ['Two', 'Three', 'Four', 'Five'], answer: 'Three' },
            { question: "What award did Anna receive?", options: ['Medal of Honor', 'Medal of Valor', 'Bravery Award', 'Hero Medal'], answer: 'Medal of Valor' }
        ]
    }
];

// SKT Objects for speed naming
const sktObjects = [
    { emoji: '🏠', name: 'House', options: ['House', 'Building', 'Tower', 'Cabin'] },
    { emoji: '🚗', name: 'Car', options: ['Car', 'Bus', 'Truck', 'Van'] },
    { emoji: '✂️', name: 'Scissors', options: ['Scissors', 'Knife', 'Blade', 'Cutter'] },
    { emoji: '⌚', name: 'Watch', options: ['Watch', 'Clock', 'Timer', 'Compass'] },
    { emoji: '📱', name: 'Phone', options: ['Phone', 'Tablet', 'Remote', 'Calculator'] },
    { emoji: '🔑', name: 'Key', options: ['Key', 'Lock', 'Chain', 'Ring'] },
    { emoji: '👓', name: 'Glasses', options: ['Glasses', 'Goggles', 'Sunglasses', 'Monocle'] },
    { emoji: '📚', name: 'Books', options: ['Books', 'Papers', 'Magazines', 'Notebooks'] }
];

// SKT Distractors
const sktDistractors = [
    { emoji: '🎸', name: 'Guitar' },
    { emoji: '🎨', name: 'Palette' },
    { emoji: '🔔', name: 'Bell' },
    { emoji: '🎯', name: 'Target' },
    { emoji: '🎭', name: 'Masks' },
    { emoji: '🏆', name: 'Trophy' }
];

// SAGE Assessment Questions
const sageQuestions = [
    {
        type: 'orientation',
        question: 'What day of the week is it today?',
        visual: '📅',
        options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        getAnswer: () => new Date().toLocaleDateString('en-US', { weekday: 'long' })
    },
    {
        type: 'calculation',
        question: 'What is 93 minus 7?',
        visual: '🧮',
        options: ['84', '85', '86', '87'],
        answer: '86'
    },
    {
        type: 'calculation',
        question: 'What is 86 minus 7?',
        visual: '➖',
        options: ['77', '78', '79', '80'],
        answer: '79'
    },
    {
        type: 'pattern',
        question: 'What comes next: 2, 4, 8, 16, ?',
        visual: '🔢',
        options: ['20', '24', '32', '64'],
        answer: '32'
    },
    {
        type: 'language',
        question: 'Which word does NOT belong?',
        visual: '🔤',
        options: ['Apple', 'Orange', 'Banana', 'Carrot'],
        answer: 'Carrot'
    },
    {
        type: 'visual',
        question: 'How many triangles are in this shape? △△△△',
        visual: '📐',
        options: ['2', '3', '4', '5'],
        answer: '4'
    },
    {
        type: 'reasoning',
        question: 'If all roses are flowers, and some flowers fade quickly, then:',
        visual: '🌹',
        options: ['All roses fade quickly', 'Some roses may fade quickly', 'No roses fade quickly', 'Roses never fade'],
        answer: 'Some roses may fade quickly'
    },
    {
        type: 'memory',
        question: 'Earlier you saw a shopping list. What was the FIRST item?',
        visual: '🧠',
        options: ['Bread', 'Milk', 'Eggs', 'Butter'],
        answer: 'Bread'
    }
];

// 20 Additional Test Offers
const additionalTests = [
    { id: 1, name: 'Attention & Focus Test', icon: '🎯', desc: 'Measure your concentration abilities', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 2, name: 'Visual Memory Test', icon: '👁️', desc: 'Test your visual recall capabilities', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 3, name: 'Working Memory Assessment', icon: '💭', desc: 'Evaluate your mental workspace', originalPrice: 12.99, currentPrice: 4.99 },
    { id: 4, name: 'Processing Speed Test', icon: '⚡', desc: 'Measure cognitive processing speed', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 5, name: 'Executive Function Test', icon: '🧩', desc: 'Assess planning and organization', originalPrice: 14.99, currentPrice: 5.99 },
    { id: 6, name: 'Verbal Fluency Assessment', icon: '💬', desc: 'Test language retrieval abilities', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 7, name: 'Spatial Reasoning Test', icon: '📐', desc: 'Evaluate 3D mental manipulation', originalPrice: 11.99, currentPrice: 4.49 },
    { id: 8, name: 'Reaction Time Test', icon: '🏃', desc: 'Measure response speed', originalPrice: 7.99, currentPrice: 2.99 },
    { id: 9, name: 'Pattern Recognition Test', icon: '🔳', desc: 'Test visual pattern abilities', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 10, name: 'Numerical Reasoning Test', icon: '🔢', desc: 'Assess mathematical thinking', originalPrice: 11.99, currentPrice: 4.49 },
    { id: 11, name: 'Emotional Intelligence Test', icon: '❤️', desc: 'Measure EQ and empathy', originalPrice: 14.99, currentPrice: 5.99 },
    { id: 12, name: 'Creativity Assessment', icon: '🎨', desc: 'Evaluate divergent thinking', originalPrice: 12.99, currentPrice: 4.99 },
    { id: 13, name: 'Problem Solving Test', icon: '🔧', desc: 'Test analytical abilities', originalPrice: 11.99, currentPrice: 4.49 },
    { id: 14, name: 'Memory Span Test', icon: '📏', desc: 'Measure memory capacity', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 15, name: 'Cognitive Flexibility Test', icon: '🔄', desc: 'Assess mental adaptability', originalPrice: 12.99, currentPrice: 4.99 },
    { id: 16, name: 'Auditory Memory Test', icon: '👂', desc: 'Test sound recall abilities', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 17, name: 'Decision Making Test', icon: '⚖️', desc: 'Evaluate judgment skills', originalPrice: 14.99, currentPrice: 5.99 },
    { id: 18, name: 'Mental Math Test', icon: '➕', desc: 'Test calculation speed', originalPrice: 7.99, currentPrice: 2.99 },
    { id: 19, name: 'Sequential Memory Test', icon: '📋', desc: 'Assess order recall', originalPrice: 9.99, currentPrice: 3.99 },
    { id: 20, name: 'Comprehensive Brain Health', icon: '🧠', desc: 'Full cognitive assessment', originalPrice: 29.99, currentPrice: 12.99 }
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
    const progress = ((state.currentTest) / state.tests.length) * 100;
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

    const currentTestId = state.tests[state.currentTest];
    const testSection = document.getElementById(`test${currentTestId.toUpperCase()}`);

    if (testSection) {
        testSection.style.display = 'block';
        updateTestName(currentTestId);
        updateProgress();
    } else {
        // All tests complete
        showTestComplete();
    }
}

function updateTestName(testId) {
    const names = {
        islt: 'ISLT Shopping List',
        adas: 'ADAS-Cog Word Recall',
        lm: 'Logical Memory Test',
        skt: 'SKT Speed Test',
        sage: 'SAGE Assessment'
    };
    document.getElementById('currentTestName').textContent = names[testId] || 'Memory Test';
}

function nextTest() {
    state.currentTest++;
    showCurrentTest();
}

// ============================================
// ISLT Shopping List Test
// ============================================

let isltTimer;
let isltTimeLeft = 30;

function startISLT() {
    document.getElementById('isltIntro').style.display = 'none';
    document.getElementById('isltDisplay').style.display = 'block';

    // Display shopping items
    const grid = document.getElementById('shoppingGrid');
    grid.innerHTML = '';

    shoppingItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'shopping-item';
        div.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div class="item-name">${item.name}</div>
        `;
        grid.appendChild(div);
    });

    // Start countdown
    isltTimeLeft = 30;
    updateISLTCountdown();
    isltTimer = setInterval(() => {
        isltTimeLeft--;
        updateISLTCountdown();

        if (isltTimeLeft <= 0) {
            clearInterval(isltTimer);
            showISLTRecall();
        }
    }, 1000);
}

function updateISLTCountdown() {
    document.querySelector('#isltCountdown .countdown-number').textContent = isltTimeLeft;
    document.getElementById('testTimer').textContent = `⏱️ 0:${isltTimeLeft.toString().padStart(2, '0')}`;
}

function showISLTRecall() {
    document.getElementById('isltDisplay').style.display = 'none';
    document.getElementById('isltRecall').style.display = 'block';
    document.getElementById('testTimer').textContent = '⏱️ Recall';

    // Create recall grid with items and distractors
    const allItems = shuffleArray([...shoppingItems, ...distractorItems]);
    const grid = document.getElementById('recallGrid');
    grid.innerHTML = '';

    allItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'recall-option';
        div.dataset.name = item.name;
        div.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div class="item-name">${item.name}</div>
        `;
        div.addEventListener('click', () => {
            div.classList.toggle('selected');
        });
        grid.appendChild(div);
    });
}

function submitISLT() {
    const selected = document.querySelectorAll('#recallGrid .recall-option.selected');
    const originalNames = shoppingItems.map(i => i.name);

    let correct = 0;
    selected.forEach(item => {
        if (originalNames.includes(item.dataset.name)) {
            correct++;
        }
    });

    state.scores.islt.correct = correct;
    state.scores.islt.time = 30 - isltTimeLeft;

    nextTest();
}

// ============================================
// ADAS-Cog Word Recall Test
// ============================================

let adasWordIndex = 0;
let adasWordTimer;
let recalledWords = [];

function startADAS() {
    document.getElementById('adasIntro').style.display = 'none';
    document.getElementById('adasDisplay').style.display = 'block';

    adasWordIndex = 0;
    showNextWord();
}

function showNextWord() {
    if (adasWordIndex >= adasWords.length) {
        showADASRecall();
        return;
    }

    const wordCard = document.getElementById('wordCard');
    wordCard.style.animation = 'none';
    wordCard.offsetHeight; // Trigger reflow
    wordCard.style.animation = 'wordPulse 3s ease-in-out';

    document.getElementById('currentWord').textContent = adasWords[adasWordIndex];
    document.getElementById('wordCounter').textContent = `Word ${adasWordIndex + 1} of ${adasWords.length}`;
    document.getElementById('testTimer').textContent = `⏱️ Word ${adasWordIndex + 1}/10`;

    adasWordIndex++;

    setTimeout(() => {
        showNextWord();
    }, 3000);
}

function showADASRecall() {
    document.getElementById('adasDisplay').style.display = 'none';
    document.getElementById('adasRecall').style.display = 'block';
    document.getElementById('testTimer').textContent = '⏱️ Recall';

    recalledWords = [];
    document.getElementById('recalledWords').innerHTML = '';
    document.getElementById('wordInput').value = '';
    document.getElementById('wordInput').focus();
}

// Word input handler
document.getElementById('wordInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addRecalledWord();
    }
});

function addRecalledWord() {
    const input = document.getElementById('wordInput');
    const word = input.value.trim().toUpperCase();

    if (word && !recalledWords.includes(word)) {
        recalledWords.push(word);

        const container = document.getElementById('recalledWords');
        const wordDiv = document.createElement('div');
        wordDiv.className = 'recalled-word';
        wordDiv.innerHTML = `
            ${word}
            <button class="remove-word" onclick="removeWord('${word}')">&times;</button>
        `;
        container.appendChild(wordDiv);
    }

    input.value = '';
    input.focus();
}

function removeWord(word) {
    recalledWords = recalledWords.filter(w => w !== word);
    const container = document.getElementById('recalledWords');
    container.innerHTML = '';
    recalledWords.forEach(w => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'recalled-word';
        wordDiv.innerHTML = `
            ${w}
            <button class="remove-word" onclick="removeWord('${w}')">&times;</button>
        `;
        container.appendChild(wordDiv);
    });
}

function submitADAS() {
    let correct = 0;
    recalledWords.forEach(word => {
        if (adasWords.includes(word)) {
            correct++;
        }
    });

    state.scores.adas.correct = correct;
    nextTest();
}

// ============================================
// Logical Memory Test
// ============================================

let lmTimer;
let lmTimeLeft = 45;
let currentStory = stories[0];
let lmAnswers = {};

function startLM() {
    document.getElementById('lmIntro').style.display = 'none';
    document.getElementById('lmDisplay').style.display = 'block';

    // Display story
    document.getElementById('storyCard').innerHTML = `
        <div class="story-title">${currentStory.title}</div>
        <p>${currentStory.content}</p>
    `;

    // Start countdown
    lmTimeLeft = 45;
    updateLMCountdown();
    lmTimer = setInterval(() => {
        lmTimeLeft--;
        updateLMCountdown();

        if (lmTimeLeft <= 0) {
            clearInterval(lmTimer);
            showLMQuestions();
        }
    }, 1000);
}

function updateLMCountdown() {
    document.querySelector('#lmCountdown .countdown-number').textContent = lmTimeLeft;
    document.getElementById('testTimer').textContent = `⏱️ 0:${lmTimeLeft.toString().padStart(2, '0')}`;
}

function showLMQuestions() {
    document.getElementById('lmDisplay').style.display = 'none';
    document.getElementById('lmRecall').style.display = 'block';
    document.getElementById('testTimer').textContent = '⏱️ Questions';

    const container = document.getElementById('lmQuestions');
    container.innerHTML = '';

    currentStory.questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.innerHTML = `
            <div class="question-text">
                <span class="question-number">${index + 1}</span>
                <span>${q.question}</span>
            </div>
            <div class="question-options">
                ${q.options.map(opt => `
                    <label class="question-option" data-question="${index}" data-value="${opt}">
                        <input type="radio" name="lm_q${index}" value="${opt}">
                        <span class="option-circle"></span>
                        <span>${opt}</span>
                    </label>
                `).join('')}
            </div>
        `;
        container.appendChild(questionDiv);
    });

    // Add click handlers
    document.querySelectorAll('.question-option').forEach(option => {
        option.addEventListener('click', function() {
            const qIndex = this.dataset.question;
            document.querySelectorAll(`[data-question="${qIndex}"]`).forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            this.querySelector('input').checked = true;
            lmAnswers[qIndex] = this.dataset.value;
        });
    });
}

function submitLM() {
    let correct = 0;
    currentStory.questions.forEach((q, index) => {
        if (lmAnswers[index] === q.answer) {
            correct++;
        }
    });

    state.scores.lm.correct = correct;
    state.scores.lm.time = 45 - lmTimeLeft;
    nextTest();
}

// ============================================
// SKT Speed Memory Test
// ============================================

let sktObjectIndex = 0;
let sktStartTime;
let sktTotalTime = 0;
let sktNamingCorrect = 0;
let seenObjects = [];

function startSKT() {
    document.getElementById('sktIntro').style.display = 'none';
    document.getElementById('sktDisplay').style.display = 'block';

    sktObjectIndex = 0;
    sktTotalTime = 0;
    sktNamingCorrect = 0;
    seenObjects = [...sktObjects];

    showNextObject();
}

function showNextObject() {
    if (sktObjectIndex >= sktObjects.length) {
        showSKTRecall();
        return;
    }

    const obj = sktObjects[sktObjectIndex];
    document.getElementById('objectDisplay').textContent = obj.emoji;
    document.getElementById('testTimer').textContent = `⏱️ Object ${sktObjectIndex + 1}/8`;

    // Shuffle options
    const options = shuffleArray(obj.options);
    const optionsContainer = document.getElementById('namingOptions');
    optionsContainer.innerHTML = '';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'naming-option';
        btn.textContent = opt;
        btn.addEventListener('click', () => selectSKTAnswer(opt, obj.name));
        optionsContainer.appendChild(btn);
    });

    sktStartTime = Date.now();

    // Start timer display
    updateSpeedTimer();
}

function updateSpeedTimer() {
    if (sktObjectIndex < sktObjects.length) {
        const elapsed = ((Date.now() - sktStartTime) / 1000).toFixed(2);
        document.getElementById('speedTimer').textContent = `${elapsed}s`;
        requestAnimationFrame(updateSpeedTimer);
    }
}

function selectSKTAnswer(selected, correct) {
    const elapsed = Date.now() - sktStartTime;
    sktTotalTime += elapsed;

    // Visual feedback
    const options = document.querySelectorAll('.naming-option');
    options.forEach(opt => {
        if (opt.textContent === correct) {
            opt.classList.add('correct');
        } else if (opt.textContent === selected && selected !== correct) {
            opt.classList.add('wrong');
        }
    });

    if (selected === correct) {
        sktNamingCorrect++;
    }

    // Move to next object after brief delay
    setTimeout(() => {
        sktObjectIndex++;
        showNextObject();
    }, 500);
}

function showSKTRecall() {
    document.getElementById('sktDisplay').style.display = 'none';
    document.getElementById('sktRecall').style.display = 'block';
    document.getElementById('testTimer').textContent = '⏱️ Recall';

    // Create recall grid with objects and distractors
    const allObjects = shuffleArray([...sktObjects, ...sktDistractors]);
    const grid = document.getElementById('sktRecallGrid');
    grid.innerHTML = '';

    allObjects.forEach(obj => {
        const div = document.createElement('div');
        div.className = 'recall-option';
        div.dataset.name = obj.name;
        div.innerHTML = `
            <div class="item-icon">${obj.emoji}</div>
            <div class="item-name">${obj.name}</div>
        `;
        div.addEventListener('click', () => {
            div.classList.toggle('selected');
        });
        grid.appendChild(div);
    });
}

function submitSKT() {
    const selected = document.querySelectorAll('#sktRecallGrid .recall-option.selected');
    const originalNames = sktObjects.map(o => o.name);

    let recallCorrect = 0;
    selected.forEach(item => {
        if (originalNames.includes(item.dataset.name)) {
            recallCorrect++;
        }
    });

    state.scores.skt.correct = sktNamingCorrect;
    state.scores.skt.speed = sktTotalTime / 1000;
    state.scores.skt.recall = recallCorrect;

    nextTest();
}

// ============================================
// SAGE Assessment
// ============================================

let sageQuestionIndex = 0;
let sageAnswers = {};

function startSAGE() {
    document.getElementById('sageIntro').style.display = 'none';
    document.getElementById('sageDisplay').style.display = 'block';

    sageQuestionIndex = 0;
    sageAnswers = {};
    showSAGEQuestion();
}

function showSAGEQuestion() {
    if (sageQuestionIndex >= sageQuestions.length) {
        // Calculate score and finish
        calculateSAGEScore();
        nextTest();
        return;
    }

    const q = sageQuestions[sageQuestionIndex];
    document.getElementById('sageQuestionNum').textContent = `Question ${sageQuestionIndex + 1} of ${sageQuestions.length}`;
    document.getElementById('testTimer').textContent = `⏱️ Q${sageQuestionIndex + 1}/${sageQuestions.length}`;

    document.getElementById('sageQuestion').innerHTML = `
        <div class="question-visual">${q.visual}</div>
        <h3>${q.question}</h3>
    `;

    const optionsContainer = document.getElementById('sageOptions');
    optionsContainer.innerHTML = '';

    q.options.forEach(opt => {
        const div = document.createElement('div');
        div.className = 'sage-option';
        div.textContent = opt;
        div.addEventListener('click', () => selectSAGEOption(div, opt));
        optionsContainer.appendChild(div);
    });
}

function selectSAGEOption(element, value) {
    document.querySelectorAll('.sage-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
    sageAnswers[sageQuestionIndex] = value;
}

function nextSAGEQuestion() {
    if (sageAnswers[sageQuestionIndex] === undefined) {
        alert('Please select an answer');
        return;
    }

    sageQuestionIndex++;
    showSAGEQuestion();
}

function calculateSAGEScore() {
    let correct = 0;
    sageQuestions.forEach((q, index) => {
        const answer = q.getAnswer ? q.getAnswer() : q.answer;
        if (sageAnswers[index] === answer) {
            correct++;
        }
    });

    state.scores.sage.correct = correct;
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
        // Fetch Stripe publishable key from server
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

// Payment form submission
document.getElementById('payment-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitButton = document.getElementById('submit-payment');
    const buttonText = document.getElementById('button-text');
    const spinner = document.getElementById('spinner');

    submitButton.disabled = true;
    buttonText.textContent = 'Processing...';
    spinner.classList.remove('hidden');

    try {
        // Create payment intent on server
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

        // Confirm payment with Stripe
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

            // Send results email
            await sendResultsEmail();

            // Show success modal
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
    // Preload test data
    state.testData = {
        shopping: shuffleArray(shoppingItems),
        words: shuffleArray(adasWords),
        objects: shuffleArray(sktObjects)
    };

    // Handle click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
});
