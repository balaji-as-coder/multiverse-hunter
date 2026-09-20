/**
 * Instant Gate Raids & Focus Boss Battle Engine
 * Converts deep focus / Pomodoro sessions into epic animated boss battles.
 */
class DungeonEngine {
    constructor() {
        this.activeDungeon = null;
        this.timerInterval = null;
        this.remainingSeconds = 0;
        this.totalSeconds = 0;
        this.isPaused = false;

        this.gates = [
            {
                id: 'gate_e',
                name: 'Goblin Scout Cave',
                rank: 'E',
                focusMinutes: 15,
                bossName: 'Hobgoblin Chief',
                bossHp: 300,
                bossIcon: '👹',
                xpReward: 80,
                goldReward: 120,
                crystalReward: 2,
                shadowUnlockId: null,
                desc: 'Quick 15-minute high intensity focus sprint.'
            },
            {
                id: 'gate_d',
                name: 'Subway Kasaka Den',
                rank: 'D',
                focusMinutes: 25,
                bossName: 'Blue-Venom Fang Kasaka',
                bossHp: 600,
                bossIcon: '🐍',
                xpReward: 160,
                goldReward: 240,
                crystalReward: 5,
                shadowUnlockId: null,
                desc: 'Standard 25-minute Pomodoro focus raid.'
            },
            {
                id: 'gate_c',
                name: 'Lizardman Swamplands',
                rank: 'C',
                focusMinutes: 40,
                bossName: 'Swamp Monarch Gabor',
                bossHp: 1000,
                bossIcon: '🦎',
                xpReward: 300,
                goldReward: 450,
                crystalReward: 10,
                shadowUnlockId: null,
                desc: '40-minute deep concentration session.'
            },
            {
                id: 'gate_b',
                name: 'Red Gate: Ice Elf Caverns',
                rank: 'B',
                focusMinutes: 50,
                bossName: 'Ice Elf Monarch Baruka',
                bossHp: 1600,
                bossIcon: '❄',
                xpReward: 550,
                goldReward: 800,
                crystalReward: 20,
                shadowUnlockId: 'shadow_tank',
                desc: '50-minute intense deep work challenge. Unlocks Tank shadow!'
            },
            {
                id: 'gate_a',
                name: 'Job Change Quest: Demon Castle',
                rank: 'A',
                focusMinutes: 60,
                bossName: 'Blood-Red Commander Igris',
                bossHp: 2400,
                bossIcon: '⚔',
                xpReward: 1000,
                goldReward: 1500,
                crystalReward: 40,
                shadowUnlockId: 'shadow_igris',
                desc: '60-minute trial to unlock Shadow Extraction for Igris!'
            },
            {
                id: 'gate_s',
                name: 'Jeju Island S-Rank Hive Raid',
                rank: 'S',
                focusMinutes: 90,
                bossName: 'Ant King (Beru)',
                bossHp: 4000,
                bossIcon: '👑',
                xpReward: 2500,
                goldReward: 4000,
                crystalReward: 100,
                shadowUnlockId: 'shadow_beru',
                desc: '90-minute ultimate focus marathon. Unlocks Marshal Beru!'
            }
        ];

        this.initEventListeners();
    }

    initEventListeners() {
        const btnPause = document.getElementById('btn-dungeon-pause');
        const btnStrike = document.getElementById('btn-dungeon-strike');
        const btnForfeit = document.getElementById('btn-dungeon-forfeit');

        if (btnPause) {
            btnPause.addEventListener('click', () => this.togglePause());
        }
        if (btnStrike) {
            btnStrike.addEventListener('click', () => this.manualStrike());
        }
        if (btnForfeit) {
            btnForfeit.addEventListener('click', () => this.forfeit());
        }
    }

    renderGatesList() {
        const container = document.getElementById('available-gates-list');
        if (!container) return;

        container.innerHTML = this.gates.map(g => `
            <div class="gate-card rank-${g.rank.toLowerCase()}">
                <div class="gate-header">
                    <span class="gate-name">${g.name}</span>
                    <span class="rank-badge rank-${g.rank.toLowerCase()}">${g.rank}-RANK</span>
                </div>
                <div class="gate-meta">
                    <span>⏱ ${g.focusMinutes} Min Focus</span>
                    <span>👹 Boss: ${g.bossName}</span>
                </div>
                <p style="font-size: 12px; color: var(--text-muted);">${g.desc}</p>
                <div style="font-family: var(--font-system); font-size: 11px; color: var(--cyan-glow);">
                    Rewards: +${g.xpReward} EXP, +${g.goldReward} Gold, +${g.crystalReward} Crystals
                </div>
                <button class="btn-primary-holo btn-sm" onclick="window.dungeonEngine.enterGate('${g.id}')">ENTER GATE</button>
            </div>
        `).join('');
    }

    enterGate(gateId) {
        const gate = this.gates.find(g => g.id === gateId);
        if (!gate) return;

        this.activeDungeon = {
            ...gate,
            currentHp: gate.bossHp
        };

        this.totalSeconds = gate.focusMinutes * 60;
        this.remainingSeconds = this.totalSeconds;
        this.isPaused = false;

        // Switch to arena view
        document.getElementById('dungeon-gate-selector').classList.add('hidden');
        document.getElementById('dungeon-active-arena').classList.remove('hidden');

        document.getElementById('arena-gate-rank').innerText = `${gate.rank}-RANK GATE`;
        document.getElementById('arena-gate-rank').className = `gate-rank-badge rank-badge rank-${gate.rank.toLowerCase()}`;
        document.getElementById('arena-boss-name').innerText = gate.bossName;
        document.getElementById('boss-portrait-art').innerText = gate.bossIcon;
        document.getElementById('boss-hp-cur').innerText = gate.bossHp;
        document.getElementById('boss-hp-max').innerText = gate.bossHp;
        document.getElementById('boss-hp-bar').style.width = '100%';

        window.systemAudio.playNotification();
        window.systemState.logEvent(`Entered ${gate.rank}-Rank Gate: [${gate.name}]`);
        window.app.showToast('GATE OPENED', `Deep work focus session started: ${gate.bossName}`);

        this.startTimer();
    }

    startTimer() {
        clearInterval(this.timerInterval);
        this.updateTimerDisplay();

        this.timerInterval = setInterval(() => {
            if (!this.isPaused) {
                this.remainingSeconds--;
                this.updateTimerDisplay();

                // Periodic Boss Damage every 20 seconds of focus
                if (this.remainingSeconds % 20 === 0) {
                    const dmg = Math.ceil(this.activeDungeon.bossHp / (this.totalSeconds / 20));
                    this.damageBoss(dmg, false);
                }

                if (this.remainingSeconds <= 0) {
                    this.victory();
                }
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const mins = Math.floor(this.remainingSeconds / 60);
        const secs = this.remainingSeconds % 60;
        const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        const el = document.getElementById('dungeon-timer-display');
        if (el) el.innerText = display;
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const btn = document.getElementById('btn-dungeon-pause');
        if (btn) {
            btn.innerText = this.isPaused ? 'RESUME FOCUS' : 'PAUSE FOCUS';
        }
        if (this.isPaused) {
            window.systemState.data.player.fatigue = Math.min(100, window.systemState.data.player.fatigue + 5);
            window.systemState.save();
            window.app.showToast('FOCUS PAUSED', 'Pause penalty: +5% Fatigue buildup');
        }
        window.systemAudio.playClick();
    }

    manualStrike() {
        if (this.isPaused) return;
        this.damageBoss(Math.floor(this.activeDungeon.bossHp * 0.08), true);
        window.particleEngine.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 25, '#ef4444');
    }

    damageBoss(amount, isManual = false) {
        if (!this.activeDungeon) return;
        this.activeDungeon.currentHp = Math.max(0, this.activeDungeon.currentHp - amount);

        document.getElementById('boss-hp-cur').innerText = this.activeDungeon.currentHp;
        const pct = (this.activeDungeon.currentHp / this.activeDungeon.bossHp) * 100;
        document.getElementById('boss-hp-bar').style.width = `${pct}%`;

        window.systemAudio.playBossHit();

        // Screen Shake FX
        const sprite = document.getElementById('boss-sprite-frame');
        if (sprite) {
            sprite.style.transform = 'scale(0.95)';
            setTimeout(() => { sprite.style.transform = 'scale(1)'; }, 100);
        }

        if (this.activeDungeon.currentHp <= 0) {
            this.victory();
        }
    }

    victory() {
        clearInterval(this.timerInterval);
        const gate = this.activeDungeon;

        window.systemState.data.player.gold += gate.goldReward;
        window.systemState.data.player.crystals += gate.crystalReward;
        window.systemState.data.analytics.totalFocusMinutes += gate.focusMinutes;
        window.systemState.logEvent(`Defeated Gate Boss: ${gate.bossName}!`);

        const xpRes = window.systemState.addXp(gate.xpReward);
        window.systemState.save();

        window.systemAudio.playLevelUp();
        window.particleEngine.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 50, '#fbbf24');
        window.app.showToast('GATE SUBJUGATED!', `Boss Slayed! +${gate.xpReward} EXP, +${gate.goldReward} Gold, +${gate.crystalReward} Mana Crystals!`);

        // Check for shadow extraction trigger
        if (gate.shadowUnlockId) {
            const shadow = window.systemState.data.shadowArmy.find(s => s.id === gate.shadowUnlockId);
            if (shadow && !shadow.unlocked) {
                setTimeout(() => {
                    window.shadowEngine.triggerAriseModal(shadow);
                }, 1200);
            }
        }

        if (xpRes.leveledUp) {
            window.app.triggerLevelUpModal(xpRes.oldLevel, xpRes.newLevel);
        }

        this.exitArena();
    }

    forfeit() {
        clearInterval(this.timerInterval);
        window.systemState.data.player.fatigue = Math.min(100, window.systemState.data.player.fatigue + 15);
        window.systemState.logEvent(`Forfeited ${this.activeDungeon.name}`);
        window.systemState.save();
        window.systemAudio.playPenaltyAlert();
        window.app.showToast('DUNGEON FORFEITED', 'Escaped gate with +15% Fatigue penalty.');
        this.exitArena();
    }

    exitArena() {
        this.activeDungeon = null;
        document.getElementById('dungeon-active-arena').classList.add('hidden');
        document.getElementById('dungeon-gate-selector').classList.remove('hidden');
        this.renderGatesList();
    }
}

window.dungeonEngine = new DungeonEngine();
