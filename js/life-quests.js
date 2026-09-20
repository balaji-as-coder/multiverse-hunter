/**
 * MULTIVERSE HUNTER — LIFE & HABIT QUEST ENGINE
 * Manages daily quest completions across Fitness, Mind, Learning, and Business.
 * Real-Life actions convert into XP, Gold, and Stat Points.
 */

class LifeQuestEngine {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Quest toggle buttons
        document.addEventListener('click', (e) => {
            const btnQuest = e.target.closest('.btn-complete-quest');
            if (btnQuest) {
                const questId = btnQuest.dataset.questId;
                this.toggleQuest(questId);
            }
        });

        // Open Custom Quest Modal
        const btnOpenCreate = document.getElementById('btn-open-create-quest');
        if (btnOpenCreate) {
            btnOpenCreate.addEventListener('click', () => {
                document.getElementById('modal-create-quest')?.classList.remove('hidden');
            });
        }

        // Close Custom Quest Modal
        const btnCloseCreate = document.getElementById('btn-close-quest-modal');
        if (btnCloseCreate) {
            btnCloseCreate.addEventListener('click', () => {
                document.getElementById('modal-create-quest')?.classList.add('hidden');
            });
        }

        // Submit Custom Quest Form
        const formQuest = document.getElementById('form-create-quest');
        if (formQuest) {
            formQuest.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createCustomQuest();
            });
        }
    }

    toggleQuest(questId) {
        const s = window.systemState.data;
        let quest = s.quests.daily.find(q => q.id === questId);
        if (!quest) {
            quest = s.quests.custom.find(q => q.id === questId);
        }
        if (!quest) return;

        quest.completed = !quest.completed;

        if (quest.completed) {
            // Allocate XP, Gold, and targeted attribute point
            const stat = quest.stat || 'str';
            if (stat in s.stats) s.stats[stat] += 1;
            s.player.gold += quest.gold || 100;
            window.systemState.gainXp(quest.xp || 200, `Completed Quest: ${quest.title}`);

            if (window.systemAudio) window.systemAudio.playQuestComplete();
            if (window.app) {
                window.app.showToast('QUEST CLEARED', `Completed: ${quest.title} (+${quest.xp} XP, +${quest.gold} Gold, +1 ${stat.toUpperCase()})`);
                window.app.syncUI();
            }
        } else {
            window.systemState.save();
            if (window.app) window.app.syncUI();
        }
    }

    createCustomQuest() {
        const title = document.getElementById('quest-input-title')?.value.trim();
        const stat = document.getElementById('quest-input-stat')?.value || 'int';
        const rank = document.getElementById('quest-input-rank')?.value || 'C';
        const desc = document.getElementById('quest-input-desc')?.value.trim() || '';

        if (!title) return;

        let xp = 200, gold = 100;
        if (rank === 'E') { xp = 100; gold = 50; }
        else if (rank === 'D') { xp = 150; gold = 80; }
        else if (rank === 'B') { xp = 300; gold = 150; }
        else if (rank === 'A') { xp = 450; gold = 220; }
        else if (rank === 'S') { xp = 800; gold = 400; }

        const newQuest = {
            id: 'custom_' + Date.now(),
            title,
            stat,
            rank,
            desc,
            xp,
            gold,
            completed: false
        };

        window.systemState.data.quests.custom.push(newQuest);
        window.systemState.save();

        document.getElementById('modal-create-quest')?.classList.add('hidden');
        document.getElementById('form-create-quest')?.reset();

        if (window.systemAudio) window.systemAudio.playStatAdd();
        if (window.app) {
            window.app.showToast('QUEST REGISTERED', `New Hunter Mission registered: ${title}`);
            window.app.syncUI();
        }
    }
}

// Global Life Quest Engine instance
window.lifeQuestEngine = new LifeQuestEngine();
