/**
 * MULTIVERSE HUNTER — DAILY HUNTER JOURNAL ENGINE
 * Manages daily reflection, lessons, priorities, and archives into 30-day chronicles.
 */

class HunterJournalEngine {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const btnOpenJournal = document.getElementById('btn-open-hunter-journal');
        if (btnOpenJournal) {
            btnOpenJournal.addEventListener('click', () => {
                document.getElementById('modal-hunter-journal')?.classList.remove('hidden');
            });
        }

        const formJournal = document.getElementById('form-hunter-journal');
        if (formJournal) {
            formJournal.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveJournalEntry();
            });
        }
    }

    saveJournalEntry() {
        const s = window.systemState.data;
        const wDone = document.getElementById('j-workout-check')?.checked || false;
        const nDone = document.getElementById('j-nutrition-check')?.checked || false;
        const lDone = document.getElementById('j-learning-check')?.checked || false;
        const bDone = document.getElementById('j-business-check')?.checked || false;
        const energy = parseInt(document.getElementById('j-energy-rating')?.value) || 8;
        const lesson = document.getElementById('j-lesson-text')?.value.trim() || 'Executed scheduled protocols with focus.';
        const priority = document.getElementById('j-priority-text')?.value.trim() || 'Lock in morning workout and deep work block.';

        const entry = {
            date: new Date().toISOString().split('T')[0],
            workoutCompleted: wDone,
            nutritionAdhered: nDone,
            learningCompleted: lDone,
            businessCompleted: bDone,
            energyScore: energy,
            todayLesson: lesson,
            tomorrowPriority: priority
        };

        if (!s.journal) s.journal = { entries: [] };
        s.journal.entries.unshift(entry);

        // Gain Discipline & Mind XP
        window.systemState.gainTrackXp('disciplineXp', 150, 'Logged Daily Hunter Journal');
        window.systemState.gainTrackXp('mindXp', 100, 'Daily Cognitive Reflection');

        document.getElementById('modal-hunter-journal')?.classList.add('hidden');
        if (window.systemAudio) window.systemAudio.playQuestComplete();
        if (window.app) {
            window.app.showToast('JOURNAL LOGGED', 'Daily Hunter chronicle recorded (+150 Discipline XP, +100 Mind XP)!');
            window.app.syncUI();
        }
    }
}

window.hunterJournal = new HunterJournalEngine();
