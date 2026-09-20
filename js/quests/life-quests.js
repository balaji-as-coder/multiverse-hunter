/**
 * MULTIVERSE HUNTER — QUESTS MODULE
 */
class LifeQuestEngineModule {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            const btnQuest = e.target.closest('.btn-complete-quest');
            if (btnQuest) {
                const qId = btnQuest.dataset.questId;
                this.toggleQuest(qId, e.clientX, e.clientY);
            }
        });

        const btnOpenCreate = document.getElementById('btn-open-create-quest');
        if (btnOpenCreate) {
            btnOpenCreate.addEventListener('click', () => {
                document.getElementById('modal-create-quest')?.classList.remove('hidden');
            });
        }

        const formQuest = document.getElementById('form-create-quest');
        if (formQuest) {
            formQuest.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createCustomQuest();
            });
        }
    }

    toggleQuest(questId, clientX, clientY) {
        const s = window.systemState.data;
        let quest = s.quests.daily.find(q => q.id === questId) || s.quests.custom.find(q => q.id === questId);
        if (!quest) return;

        quest.completed = !quest.completed;

        if (quest.completed) {
            const stat = quest.stat || 'str';
            if (stat in s.stats) s.stats[stat] += 1;
            s.player.gold += quest.gold || 100;

            const track = quest.track || 'disciplineXp';
            const res = window.systemState.gainTrackXp(track, quest.xp || 200, `Completed: ${quest.title}`);

            if (window.particleEngine) {
                window.particleEngine.spawnBurst(clientX, clientY, 35, '#00e5ff');
                window.particleEngine.spawnFloatingText(`+${quest.xp} XP`, clientX, clientY, '#00e5ff');
                if (res && res.leveledUpHunter) {
                    window.particleEngine.triggerCelebrationConfetti();
                }
            }

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

        if (!title) return;

        let xp = 200, gold = 100;
        if (rank === 'E') { xp = 100; gold = 50; }
        else if (rank === 'D') { xp = 150; gold = 80; }
        else if (rank === 'B') { xp = 300; gold = 150; }
        else if (rank === 'A') { xp = 450; gold = 220; }

        let track = 'disciplineXp';
        if (stat === 'str' || stat === 'agi') track = 'bodyXp';
        else if (stat === 'int' || stat === 'focus') track = 'mindXp';
        else if (stat === 'biz') track = 'businessXp';
        else if (stat === 'vit' || stat === 'energy') track = 'recoveryXp';

        const newQuest = {
            id: 'custom_' + Date.now(),
            title,
            stat,
            rank,
            track,
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
            window.app.showToast('QUEST ISSUED', `New quest registered: ${title}`);
            window.app.syncUI();
        }
    }
}

window.lifeQuestEngine = new LifeQuestEngineModule();
