/**
 * Quest Board & Regimen Engine
 * Manages Daily Mandatory Quests, Rep Counters, Penalty Zone Trigger, and Custom Quest Life Tracking.
 */
class QuestEngine {
    constructor() {
        this.filter = 'all';
        this.initEventListeners();
    }

    initEventListeners() {
        // Daily Task Rep Buttons
        document.querySelectorAll('.btn-rep-add').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const task = e.target.dataset.task;
                const val = parseFloat(e.target.dataset.val);
                this.addDailyProgress(task, val);
            });
        });

        document.querySelectorAll('.btn-rep-complete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const task = e.target.dataset.task;
                this.completeDailyTask(task);
            });
        });

        // Daily Quest Claim Button
        const btnClaim = document.getElementById('btn-claim-daily');
        if (btnClaim) {
            btnClaim.addEventListener('click', () => this.claimDailyRewards());
        }

        // Filter Pills
        document.querySelectorAll('.pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
                e.target.classList.add('active');
                this.filter = e.target.dataset.filter;
                this.renderCustomQuests();
            });
        });

        // Create Quest Modal
        const btnOpenCreate = document.getElementById('btn-create-quest-modal');
        const modalCreate = document.getElementById('modal-create-quest');
        const btnCloseCreate = document.getElementById('btn-close-quest-modal');
        const btnCancelCreate = document.getElementById('btn-cancel-quest');
        const formCreate = document.getElementById('form-create-quest');

        if (btnOpenCreate) {
            btnOpenCreate.addEventListener('click', () => {
                modalCreate.classList.remove('hidden');
                window.systemAudio.playClick();
            });
        }

        [btnCloseCreate, btnCancelCreate].forEach(btn => {
            if (btn) btn.addEventListener('click', () => modalCreate.classList.add('hidden'));
        });

        if (formCreate) {
            formCreate.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createCustomQuest();
                modalCreate.classList.add('hidden');
                formCreate.reset();
            });
        }
    }

    addDailyProgress(taskKey, amount) {
        const d = window.systemState.data.dailyQuest.tasks[taskKey];
        if (!d) return;

        d.current = Math.min(d.max, parseFloat((d.current + amount).toFixed(1)));
        window.systemAudio.playStatAdd();
        window.systemState.save();
        this.renderDailyUI();
    }

    completeDailyTask(taskKey) {
        const d = window.systemState.data.dailyQuest.tasks[taskKey];
        if (!d) return;

        d.current = d.max;
        window.systemAudio.playNotification();
        window.systemState.save();
        this.renderDailyUI();
    }

    claimDailyRewards() {
        if (!window.systemState.isDailyQuestComplete() || window.systemState.data.dailyQuest.claimedToday) return;

        window.systemState.data.dailyQuest.claimedToday = true;
        
        // Grant rewards
        window.systemState.data.player.unallocatedPoints += 3;
        window.systemState.data.player.gold += 200;
        window.systemState.data.player.hpCurrent = window.systemState.getMaxHp();
        window.systemState.data.player.mpCurrent = window.systemState.getMaxMp();
        window.systemState.data.player.fatigue = 0;
        window.systemState.data.analytics.totalQuestsCompleted += 1;
        window.systemState.logEvent('Completed Daily Mandatory Regimen!');

        // Add mystery box to inventory
        window.systemState.data.inventory.push({
            id: 'box_' + Date.now(),
            name: 'Blessed Random Box',
            type: 'box',
            icon: '🎁',
            qty: 1,
            desc: 'Contains rare elixir or hunter gold.'
        });

        const xpResult = window.systemState.addXp(100);
        window.systemState.save();

        window.systemAudio.playLevelUp();
        window.particleEngine.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 40, '#00e5ff');
        window.app.showToast('DAILY QUEST COMPLETE!', 'You earned 100 EXP, 3 Stat Points, 200 Gold, and 1x Blessed Box!');

        if (xpResult.leveledUp) {
            window.app.triggerLevelUpModal(xpResult.oldLevel, xpResult.newLevel);
        }

        this.renderDailyUI();
    }

    createCustomQuest() {
        const title = document.getElementById('quest-input-title').value.trim();
        const rank = document.getElementById('quest-input-rank').value;
        const stat = document.getElementById('quest-input-stat').value;
        const desc = document.getElementById('quest-input-desc').value.trim();

        const rankRewards = {
            'E': { xp: 30, gold: 40, statGain: 1 },
            'D': { xp: 60, gold: 80, statGain: 1 },
            'C': { xp: 120, gold: 160, statGain: 2 },
            'B': { xp: 250, gold: 350, statGain: 3 },
            'A': { xp: 500, gold: 750, statGain: 4 },
            'S': { xp: 1200, gold: 2000, statGain: 6 }
        };

        const reward = rankRewards[rank] || rankRewards['E'];

        const newQuest = {
            id: 'cq_' + Date.now(),
            title,
            rank,
            stat,
            desc,
            xp: reward.xp,
            gold: reward.gold,
            statGain: reward.statGain,
            completed: false
        };

        window.systemState.data.customQuests.unshift(newQuest);
        window.systemState.logEvent(`Registered new ${rank}-Rank Quest: "${title}"`);
        window.systemState.save();
        window.systemAudio.playNotification();
        window.app.showToast('NEW QUEST ISSUED', `[${rank}-Rank] ${title}`);
        this.renderCustomQuests();
    }

    completeCustomQuest(id) {
        const quest = window.systemState.data.customQuests.find(q => q.id === id);
        if (!quest || quest.completed) return;

        quest.completed = true;
        window.systemState.data.stats[quest.stat] += quest.statGain;
        window.systemState.data.player.gold += quest.gold;
        window.systemState.data.analytics.totalQuestsCompleted += 1;
        window.systemState.logEvent(`Conquered [${quest.rank}-Rank] Quest: ${quest.title}`);

        const xpResult = window.systemState.addXp(quest.xp);
        window.systemState.save();

        window.systemAudio.playLevelUp();
        window.particleEngine.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 30, '#a855f7');
        window.app.showToast('QUEST ACCOMPLISHED!', `+${quest.xp} EXP, +${quest.gold} Gold, +${quest.statGain} ${quest.stat.toUpperCase()}`);

        if (xpResult.leveledUp) {
            window.app.triggerLevelUpModal(xpResult.oldLevel, xpResult.newLevel);
        }

        this.renderCustomQuests();
    }

    deleteCustomQuest(id) {
        window.systemState.data.customQuests = window.systemState.data.customQuests.filter(q => q.id !== id);
        window.systemState.save();
        window.systemAudio.playClick();
        this.renderCustomQuests();
    }

    renderDailyUI() {
        const tasks = window.systemState.data.dailyQuest.tasks;
        for (let k in tasks) {
            const curEl = document.getElementById(`${k}-cur`);
            const barEl = document.getElementById(`${k}-bar`);
            const card = document.getElementById(`task-${k}`);

            if (curEl) curEl.innerText = tasks[k].current;
            if (barEl) {
                const pct = Math.min(100, (tasks[k].current / tasks[k].max) * 100);
                barEl.style.width = `${pct}%`;
            }
            if (card) {
                if (tasks[k].current >= tasks[k].max) {
                    card.classList.add('completed');
                } else {
                    card.classList.remove('completed');
                }
            }
        }

        const isComplete = window.systemState.isDailyQuestComplete();
        const claimed = window.systemState.data.dailyQuest.claimedToday;
        const btnClaim = document.getElementById('btn-claim-daily');

        if (btnClaim) {
            if (claimed) {
                btnClaim.disabled = true;
                btnClaim.innerHTML = '<span>✔ DAILY REWARD CLAIMED</span>';
            } else if (isComplete) {
                btnClaim.disabled = false;
                btnClaim.innerHTML = '<span class="claim-icon">🎁</span><span>CLAIM DAILY REWARD</span>';
            } else {
                btnClaim.disabled = true;
                btnClaim.innerHTML = '<span class="claim-icon">🎁</span><span>REGIMEN INCOMPLETE</span>';
            }
        }
    }

    renderCustomQuests() {
        const container = document.getElementById('custom-quests-list');
        if (!container) return;

        const filtered = window.systemState.data.customQuests.filter(q => {
            if (this.filter === 'all') return true;
            return q.rank === this.filter;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<div class="inspect-placeholder" style="grid-column: 1/-1; padding: 30px;"><p>No active quests in this rank. Click "+ CREATE REAL-LIFE QUEST" above to issue one!</p></div>`;
            return;
        }

        container.innerHTML = filtered.map(q => `
            <div class="quest-item-card ${q.completed ? 'completed' : ''}">
                <div class="quest-card-top">
                    <div>
                        <div class="q-title">${q.title}</div>
                        <div class="q-desc">${q.desc || 'Conquer this objective in reality.'}</div>
                    </div>
                    <span class="rank-badge rank-${q.rank.toLowerCase()}">${q.rank}-RANK</span>
                </div>
                <div class="q-rewards-row">
                    <span>✨ +${q.xp} EXP</span>
                    <span>🪙 +${q.gold} Gold</span>
                    <span>⚡ +${q.statGain} ${q.stat.toUpperCase()}</span>
                </div>
                <div class="q-actions">
                    ${q.completed ? 
                        `<button class="btn-secondary-holo btn-sm" disabled>COMPLETED ✔</button>` : 
                        `<button class="btn-primary-holo btn-sm" onclick="window.questEngine.completeCustomQuest('${q.id}')">COMPLETE QUEST</button>`
                    }
                    <button class="btn-secondary-holo btn-sm" onclick="window.questEngine.deleteCustomQuest('${q.id}')">REMOVE</button>
                </div>
            </div>
        `).join('');
    }
}

window.questEngine = new QuestEngine();
