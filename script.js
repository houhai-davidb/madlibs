// Mad Libs Story Database
const stories = [
    {
        id: 1,
        title: "Space Adventure",
        icon: "fas fa-rocket",
        description: "Blast off on an interstellar journey!",
        template: `One day, {name} decided to build a {adjective} building out of {material}. They flew to the {place} and met a {animal} wearing a {clothing}. Together they {verb} through the galaxy eating {food} along the way. It was {emotion}! The end.`,
        prompts: [
            { type: "name", label: "A person's name", placeholder: "e.g., Alex" },
            { type: "adjective", label: "An adjective", placeholder: "e.g., shiny" },
            { type: "material", label: "A material", placeholder: "e.g., cardboard" },
            { type: "place", label: "A place", placeholder: "e.g., Mars" },
            { type: "animal", label: "An animal", placeholder: "e.g., penguin" },
            { type: "clothing", label: "An article of clothing", placeholder: "e.g., top hat" },
            { type: "verb", label: "A verb", placeholder: "e.g., dance" },
            { type: "food", label: "A food", placeholder: "e.g., pizza" },
            { type: "emotion", label: "An emotion", placeholder: "e.g., fantastic" }
        ],
        wordCount: 9
    },
    {
        id: 2,
        title: "Fairytale Mishap",
        icon: "fas fa-crown",
        description: "A royal story with a twist!",
        template: `Once upon a time, {name} found a {adjective} {object} in the {place}. When they touched it, they suddenly turned into a {animal} who loved to {verb} {adverb}. The {silly_word} fairy appeared and said, "This is what happens when you {verb2} without permission!" The moral of the story is: never trust a {silly_word2}.`,
        prompts: [
            { type: "name", label: "A character's name", placeholder: "e.g., Princess Bella" },
            { type: "adjective", label: "An adjective", placeholder: "e.g., glowing" },
            { type: "object", label: "An object", placeholder: "e.g., lamp" },
            { type: "place", label: "A place", placeholder: "e.g., enchanted forest" },
            { type: "animal", label: "An animal", placeholder: "e.g., squirrel" },
            { type: "verb", label: "A verb", placeholder: "e.g., sing" },
            { type: "adverb", label: "An adverb", placeholder: "e.g., loudly" },
            { type: "silly_word", label: "A silly word", placeholder: "e.g., flibbertigibbet" },
            { type: "verb2", label: "Another verb", placeholder: "e.g., sneeze" },
            { type: "silly_word2", label: "Another silly word", placeholder: "e.g., snickerdoodle" }
        ],
        wordCount: 10
    },
    {
        id: 3,
        title: "Pirate's Quest",
        icon: "fas fa-skull-crossbones",
        description: "Set sail for treasure and trouble!",
        template: `Arrr! Captain {name} was the {adjective} pirate on the seven seas. Their ship, the "{ship_name}", was searching for a treasure chest full of {plural_noun}. But first, they had to defeat the dreaded {monster} using only a {weapon}. After {verb} for {number} days, they found the treasure on {island_name} Island. Shiver me timbers, it was {emotion}!`,
        prompts: [
            { type: "name", label: "Pirate name", placeholder: "e.g., Blackbeard" },
            { type: "adjective", label: "An adjective", placeholder: "e.g., fearsome" },
            { type: "ship_name", label: "Ship name", placeholder: "e.g., Jolly Roger" },
            { type: "plural_noun", label: "Plural noun", placeholder: "e.g., bananas" },
            { type: "monster", label: "A monster", placeholder: "e.g., kraken" },
            { type: "weapon", label: "A weapon", placeholder: "e.g., spatula" },
            { type: "verb", label: "A verb", placeholder: "e.g., sailing" },
            { type: "number", label: "A number", placeholder: "e.g., 42" },
            { type: "island_name", label: "Island name", placeholder: "e.g., Skull" },
            { type: "emotion", label: "An emotion", placeholder: "e.g., terrifying" }
        ],
        wordCount: 10
    },
    {
        id: 4,
        title: "Superhero Origin",
        icon: "fas fa-mask",
        description: "Create your own superhero story!",
        template: `In a world where {plural_noun} could talk, {name} was just a normal {occupation}. But one day, they were bitten by a {adjective} {animal} and gained the power to {superpower}. Now known as "{hero_name}", they fight crime while eating {food}. Their weakness? {weakness}. But when the city needs them, they shout: "{catchphrase}"!`,
        prompts: [
            { type: "plural_noun", label: "Plural noun", placeholder: "e.g., toasters" },
            { type: "name", label: "A name", placeholder: "e.g., Clark" },
            { type: "occupation", label: "An occupation", placeholder: "e.g., accountant" },
            { type: "adjective", label: "An adjective", placeholder: "e.g., radioactive" },
            { type: "animal", label: "An animal", placeholder: "e.g., hamster" },
            { type: "superpower", label: "A superpower", placeholder: "e.g., fly" },
            { type: "hero_name", label: "Hero name", placeholder: "e.g., Captain Amazing" },
            { type: "food", label: "A food", placeholder: "e.g., tacos" },
            { type: "weakness", label: "A weakness", placeholder: "e.g., kryptonite" },
            { type: "catchphrase", label: "A catchphrase", placeholder: "e.g., To infinity and beyond!" }
        ],
        wordCount: 10
    }
];

// App State
let currentStory = null;
let userWords = {};
let history = JSON.parse(localStorage.getItem('madlibsHistory')) || [];

// DOM Elements
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');
const storyOptions = document.getElementById('story-options');
const wordForm = document.getElementById('word-form');
const currentStoryTitle = document.getElementById('current-story-title');
const completedStoryTitle = document.getElementById('completed-story-title');
const completedStory = document.getElementById('completed-story');

// Initialize the app
function init() {
    renderStoryCards();
    setupEventListeners();
    checkForSavedWords();
}

// Render story selection cards
function renderStoryCards() {
    storyOptions.innerHTML = '';
    
    stories.forEach(story => {
        const card = document.createElement('div');
        card.className = 'story-card';
        card.innerHTML = `
            <i class="${story.icon}"></i>
            <h3>${story.title}</h3>
            <p>${story.description}</p>
            <div class="story-badge">${story.wordCount} words needed</div>
        `;
        
        card.addEventListener('click', () => selectStory(story));
        storyOptions.appendChild(card);
    });
}

// Select a story and move to step 2
function selectStory(story) {
    currentStory = story;
    userWords = {};
    
    // Update UI
    currentStoryTitle.textContent = story.title;
    
    // Generate form inputs
    wordForm.innerHTML = '';
    story.prompts.forEach((prompt, index) => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        
        const icon = getIconForWordType(prompt.type);
        const isFirst = index === 0;
        
        inputGroup.innerHTML = `
            <label for="word-${index}">
                <i class="${icon}"></i>
                ${prompt.label}
            </label>
            <input 
                type="text" 
                id="word-${index}" 
                placeholder="${prompt.placeholder}"
                data-type="${prompt.type}"
                ${isFirst ? 'autofocus' : ''}
            >
        `;
        
        wordForm.appendChild(inputGroup);
    });
    
    // Switch to step 2
    showStep(2);
    
    // Focus first input
    setTimeout(() => {
        document.getElementById('word-0')?.focus();
    }, 100);
}

// Get appropriate icon for word type
function getIconForWordType(type) {
    const icons = {
        name: 'fas fa-user',
        adjective: 'fas fa-paint-brush',
        verb: 'fas fa-running',
        adverb: 'fas fa-tachometer-alt',
        animal: 'fas fa-paw',
        place: 'fas fa-map-marker-alt',
        food: 'fas fa-utensils',
        emotion: 'fas fa-smile',
        object: 'fas fa-cube',
        clothing: 'fas fa-tshirt',
        material: 'fas fa-box',
        silly_word: 'fas fa-star',
        plural_noun: 'fas fa-language',
        ship_name: 'fas fa-ship',
        monster: 'fas fa-dragon',
        weapon: 'fas fa-fist-raised',
        number: 'fas fa-hashtag',
        island_name: 'fas fa-umbrella-beach',
        occupation: 'fas fa-briefcase',
        superpower: 'fas fa-bolt',
        hero_name: 'fas fa-mask',
        weakness: 'fas fa-biohazard',
        catchphrase: 'fas fa-comment-alt'
    };
    
    return icons[type] || 'fas fa-font';
}

// Generate the story from user inputs
function generateStory() {
    // Collect all words
    const inputs = wordForm.querySelectorAll('input');
    let allFilled = true;
    
    inputs.forEach((input, index) => {
        const word = input.value.trim();
        const type = input.dataset.type;
        
        if (word) {
            userWords[type] = word;
            input.classList.remove('error');
        } else {
            input.classList.add('error');
            allFilled = false;
            
            if (allFilled) {
                input.focus();
            }
        }
    });
    
    if (!allFilled) {
        alert('Please fill in all the words!');
        return;
    }
    
    // Replace placeholders in template
    let finalStory = currentStory.template;
    
    Object.entries(userWords).forEach(([type, word]) => {
        const regex = new RegExp(`{${type}}`, 'g');
        finalStory = finalStory.replace(regex, `<span class="user-word">${word}</span>`);
    });
    
    // Add to history
    const historyEntry = {
        storyTitle: currentStory.title,
        date: new Date().toLocaleString(),
        words: {...userWords},
        story: finalStory
    };
    
    history.unshift(historyEntry);
    if (history.length > 20) history.pop(); // Keep only last 20
    
    localStorage.setItem('madlibsHistory', JSON.stringify(history));
    
    // Display the story
    completedStoryTitle.textContent = currentStory.title;
    completedStory.innerHTML = finalStory;
    
    // Show step 3
    showStep(3);
    
    // Scroll to top of story
    setTimeout(() => {
        completedStory.scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

// Show specific step
function showStep(stepNumber) {
    [step1, step2, step3].forEach(step => step.classList.remove('active'));
    
    switch(stepNumber) {
        case 1:
            step1.classList.add('active');
            break;
        case 2:
            step2.classList.add('active');
            break;
        case 3:
            step3.classList.add('active');
            break;
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Copy story to clipboard
function copyToClipboard() {
    const storyText = completedStory.innerText;
    
    navigator.clipboard.writeText(storyText)
        .then(() => {
            const btn = document.getElementById('copy-story');
            const originalHTML = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            btn.style.background = 'var(--success)';
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy:', err);
            alert('Could not copy to clipboard. Please try again.');
        });
}

// Share story
function shareStory() {
    const storyText = completedStory.innerText;
    const title = currentStory.title;
    
    if (navigator.share) {
        navigator.share({
            title: `My Mad Lib: ${title}`,
            text: storyText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        copyToClipboard();
        alert('Story copied to clipboard! You can now paste it anywhere.');
    }
}

// Check for saved words (from previous session)
function checkForSavedWords() {
    const saved = localStorage.getItem('madlibsLastWords');
    if (saved) {
        try {
            const { storyId, words } = JSON.parse(saved);
            const story = stories.find(s => s.id === storyId);
            if (story) {
                if (confirm('Would you like to continue with your previous words?')) {
                    currentStory = story;
                    userWords = words;
                    selectStory(story);
                    
                    // Fill in saved words
                    setTimeout(() => {
                        Object.entries(words).forEach(([type, word]) => {
                            const input = document.querySelector(`input[data-type="${type}"]`);
                            if (input) input.value = word;
                        });
                    }, 100);
                }
            }
        } catch (e) {
            // Invalid saved data
            localStorage.removeItem('madlibsLastWords');
        }
    }
}

// Save current words
function saveCurrentWords() {
    if (currentStory && Object.keys(userWords).length > 0) {
        const saveData = {
            storyId: currentStory.id,
            words: userWords,
            timestamp: Date.now()
        };
        localStorage.setItem('madlibsLastWords', JSON.stringify(saveData));
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('back-to-stories').addEventListener('click', () => showStep(1));
    document.getElementById('generate-story').addEventListener('click', generateStory);
    document.getElementById('start-over').addEventListener('click', () => selectStory(currentStory));
    document.getElementById('new-story').addEventListener('click', () => showStep(1));
    
    // Story actions
    document.getElementById('copy-story').addEventListener('click', copyToClipboard);
    document.getElementById('share-story').addEventListener('click', shareStory);
    
    // Form submission
    wordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        generateStory();
    });
    
    // Input auto-save
    wordForm.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT') {
            const type = e.target.dataset.type;
            const value = e.target.value.trim();
            
            if (value) {
                userWords[type] = value;
                saveCurrentWords();
            }
        }
    });
    
    // Enter key moves to next input
    wordForm.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            e.preventDefault();
            
            const inputs = Array.from(wordForm.querySelectorAll('input'));
            const currentIndex = inputs.indexOf(e.target);
            
            if (currentIndex < inputs.length - 1) {
                inputs[currentIndex + 1].focus();
            } else {
                generateStory();
            }
        }
    });
    
    // Footer links
    document.getElementById('view-history').addEventListener('click', (e) => {
        e.preventDefault();
        showHistory();
    });
    
    document.getElementById('submit-story').addEventListener('click', (e) => {
        e.preventDefault();
        submitCustomStory();
    });
}

// Show history modal
function showHistory() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'history-modal';
    
    let historyHTML = '<h2>Your Story History</h2>';
    
    if (history.length === 0) {
        historyHTML += '<p class="empty-history">No stories yet. Create your first one!</p>';
    } else {
        historyHTML += '<div class="history-list">';
        
        history.forEach((entry, index) => {
            historyHTML += `
                <div class="history-item">
                    <h4>${entry.storyTitle} <span class="history-date">${entry.date}</span></h4>
                    <div class="history-words">
                        ${Object.entries(entry.words).map(([type, word]) => 
                            `<span class="history-word">${word}</span>`
                        ).join(' ')}
                    </div>
                    <button class="btn small view-history-story" data-index="${index}">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            `;
        });
        
        historyHTML += '</div>';
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            ${historyHTML}
            ${history.length > 0 ? 
                `<button class="btn secondary" id="clear-history">
                    <i class="fas fa-trash"></i> Clear History
                </button>` : ''
            }
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    // Close when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Clear history button
    const clearBtn = modal.querySelector('#clear-history');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all history?')) {
                history = [];
                localStorage.removeItem('madlibsHistory');
                modal.remove();
            }
        });
    }
    
    // View story buttons
    modal.querySelectorAll('.view-history-story').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.dataset.index;
            const entry = history[index];
            
            completedStoryTitle.textContent = entry.storyTitle;
            completedStory.innerHTML = entry.story;
            
            modal.remove();
            showStep(3);
        });
    });
}

// Submit custom story (simple version)
function submitCustomStory() {
    const title = prompt('Enter a title for your story:');
    if (!title) return;
    
    const template = prompt('Enter your story template with {placeholders} like {noun}, {verb}:');
    if (!template) return;
    
    alert('Thanks for your submission! In a full version, this would be sent to a server.');
}

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', init);

// Save words before page unload
window.addEventListener('beforeunload', saveCurrentWords);
