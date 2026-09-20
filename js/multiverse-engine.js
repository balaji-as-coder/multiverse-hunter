/**
 * MULTIVERSE HUNTER — MULTIVERSE ENGINE & FOCUS BOSS RAIDS
 * The user is always the protagonist.
 * Anime characters serve as Mentors, Commanders, and Boss Challenges.
 * Features:
 * - Multiverse Portals (Solo Leveling, JJK, One Piece, Naruto, Bleach, Dragon Ball, OPM)
 * - Hunter Legion / Mentors providing tactical discipline perks
 * - Boss Raids tied to real-life focus blocks and habit milestones
 * - Gate Focus Raids (Pomodoro combat with active timer, audio effects, and XP drops).
 */

class MultiverseEngine {
    constructor() {
        this.activeRaid = null;
        this.raidTimer = null;
        this.remainingSeconds = 0;
        this.totalSeconds = 0;
        this.isRaidRunning = false;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Mentor Selection / Assignment
        document.addEventListener('click', (e) => {
            const mentorCard = e.target.closest('.mentor-card');
            if (mentorCard) {
                const mentorId = mentorCard.dataset.mentorId;
                this.assignMentor(mentorId);
            }

            const bossCard = e.target.closest('.boss-raid-card');
            if (bossCard) {
                const bossId = bossCard.dataset.bossId;
                this.startBossRaid(bossId);
            }
        });

        // Gate Raid Focus Timer Controls
        const btnStartRaid = document.getElementById('btn-start-focus-raid');
        if (btnStartRaid) {
            btnStartRaid.addEventListener('click', () => this.toggleFocusRaid());
        }

        const btnAbandonRaid = document.getElementById('btn-abandon-raid');
        if (btnAbandonRaid) {
            btnAbandonRaid.addEventListener('click', () => this.abandonFocusRaid());
        }
    }

    assignMentor(mentorId) {
        const s = window.systemState.data;
        const mentor = s.multiverse.mentors.find(m => m.id === mentorId);
        if (!mentor) return;

        if (!mentor.unlocked) {
            if (window.app) window.app.showToast('MENTOR LOCKED', `Requirement to recruit ${mentor.name}: ${mentor.req}`);
            if (window.systemAudio) window.systemAudio.playPenaltyAlert();
            return;
        }

        s.player.assignedMentor = mentorId;
        window.systemState.save();

        if (window.systemAudio) window.systemAudio.playLevelUp();
        if (window.app) {
            window.app.showToast('COMMANDER ASSIGNED', `${mentor.name} is now your active Multiverse Mentor! Perk: ${mentor.perk}`);
            window.app.syncUI();
        }
    }

    startBossRaid(bossId) {
        const s = window.systemState.data;
        const boss = s.multiverse.bossRaids.find(b => b.id === bossId);
        if (!boss) return;

        // Open Boss Raid Modal
        const modal = document.getElementById('modal-boss-raid');
        if (!modal) return;

        this.activeRaid = boss;
        this.totalSeconds = 45 * 60; // 45 minute deep focus raid
        this.remainingSeconds = this.totalSeconds;

        const titleEl = document.getElementById('boss-raid-name');
        if (titleEl) titleEl.innerText = `[ ${boss.rank} BOSS: ${boss.name.toUpperCase()} ]`;

        const objEl = document.getElementById('boss-raid-objective');
        if (objEl) objEl.innerText = `Real-World Objective: ${boss.realObjective}`;

        const rewardEl = document.getElementById('boss-raid-rewards');
        if (rewardEl) rewardEl.innerText = `Rewards: +${boss.rewardXp} XP, +${boss.rewardGold} Gold`;

        modal.classList.remove('hidden');
        if (window.systemAudio) window.systemAudio.playBossEncounter();
    }

    toggleFocusRaid() {
        const btn = document.getElementById('btn-start-focus-raid');
        if (this.isRaidRunning) {
            // Pause
            clearInterval(this.raidTimer);
            this.isRaidRunning = false;
            if (btn) btn.innerText = 'RESUME FOCUS RAID';
        } else {
            // Start / Resume
            this.isRaidRunning = true;
            if (btn) btn.innerText = 'PAUSE FOCUS RAID';
            this.raidTimer = setInterval(() => {
                this.tickRaid();
            }, 1000);
            if (window.systemAudio) window.systemAudio.playGateEnter();
        }
    }

    tickRaid() {
        if (this.remainingSeconds <= 0) {
            this.completeBossRaid();
            return;
        }

        this.remainingSeconds -= 1;
        const mins = Math.floor(this.remainingSeconds / 60);
        const secs = this.remainingSeconds % 60;
        const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        const timerEl = document.getElementById('boss-raid-timer');
        if (timerEl) timerEl.innerText = formatted;

        // Deal damage to boss relative to focus time
        if (this.activeRaid) {
            const damage = Math.round((1 / this.totalSeconds) * this.activeRaid.hp);
            this.activeRaid.currentHp = Math.max(0, this.activeRaid.currentHp - damage);

            const hpBar = document.getElementById('boss-hp-fill');
            if (hpBar) {
                const pct = (this.activeRaid.currentHp / this.activeRaid.hp) * 100;
                hpBar.style.width = `${pct}%`;
            }
        }
    }

    completeBossRaid() {
        clearInterval(this.raidTimer);
        this.isRaidRunning = false;

        const boss = this.activeRaid;
        if (!boss) return;

        boss.currentHp = 0;
        window.systemState.data.player.gold += boss.rewardGold;
        window.systemState.gainXp(boss.rewardXp, `Conquered Boss: ${boss.name}`);

        document.getElementById('modal-boss-raid')?.classList.add('hidden');
        if (window.systemAudio) window.systemAudio.playVictory();
        if (window.app) {
            window.app.showToast('BOSS RAID CLEARED', `You defeated ${boss.name}! +${boss.rewardXp} XP & +${boss.rewardGold} Gold.`);
            window.app.syncUI();
        }
    }

    abandonFocusRaid() {
        clearInterval(this.raidTimer);
        this.isRaidRunning = false;
        document.getElementById('modal-boss-raid')?.classList.add('hidden');
        if (window.app) window.app.showToast('RAID RETREATED', 'Retreated from Boss Chamber.');
    }
}

// Global Multiverse Engine instance
window.multiverseEngine = new MultiverseEngine();
