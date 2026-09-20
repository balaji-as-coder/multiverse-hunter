/**
 * MULTIVERSE HUNTER — MULTIVERSE LEGION & BOSS RAID ENGINE (V3.1)
 * Features:
 * - Multi-Category Character Classification (Discipline, Monarch, Warrior, Strategist, Willpower, Bosses)
 * - Independent Gameplay Mentor Roles
 * - Dynamic Legion Filtering
 * - Full Character Dossier Modal with lore, quote, and challenge bonuses
 * - Focus Boss Raid Pomodoro Combat Arena
 */

class MultiverseEngineModule {
    constructor() {
        this.activeFilter = 'ALL';
        this.activeRaid = null;
        this.raidTimer = null;
        this.remainingSeconds = 0;
        this.totalSeconds = 0;
        this.isRaidRunning = false;
        this.init();
    }

    init() {
        // Event delegation for Legion filter buttons
        document.addEventListener('click', (e) => {
            const filterBtn = e.target.closest('.btn-legion-filter');
            if (filterBtn) {
                document.querySelectorAll('.btn-legion-filter').forEach(b => b.classList.remove('active'));
                filterBtn.classList.add('active');
                this.activeFilter = filterBtn.dataset.filter || 'ALL';
                this.renderLegion();
            }

            const btnAssign = e.target.closest('.btn-summon-mentor');
            if (btnAssign) {
                const mentorId = btnAssign.dataset.mentorId;
                this.assignMentor(mentorId);
            }

            const btnViewDossier = e.target.closest('.btn-view-dossier');
            if (btnViewDossier) {
                const charId = btnViewDossier.dataset.charId;
                this.openCharacterDossier(charId);
            }

            const bossCard = e.target.closest('.boss-raid-card, .btn-start-raid-direct');
            if (bossCard) {
                const bossId = bossCard.dataset.bossId || 'boss_procrastination';
                this.startBossRaid(bossId);
            }
        });

        // Boss Raid Modal Actions
        const btnStartRaid = document.getElementById('btn-start-focus-raid');
        if (btnStartRaid) {
            btnStartRaid.addEventListener('click', () => this.toggleFocusRaid());
        }

        const btnAbandon = document.getElementById('btn-abandon-raid');
        if (btnAbandon) {
            btnAbandon.addEventListener('click', () => this.abandonFocusRaid());
        }

        // Hunterdle Daily Guess Actions
        const btnPlayHunterdle = document.getElementById('btn-play-hunterdle');
        if (btnPlayHunterdle) {
            btnPlayHunterdle.addEventListener('click', () => this.openHunterdleModal());
        }

        const btnSubmitGuess = document.getElementById('btn-submit-hunterdle-guess');
        if (btnSubmitGuess) {
            btnSubmitGuess.addEventListener('click', () => this.submitHunterdleGuess());
        }
    }

    getFilteredCharacters() {
        const s = window.systemState.data;
        const all = s.multiverse.mentors || [];
        if (this.activeFilter === 'ALL') return all;
        return all.filter(c => c.roles && c.roles.includes(this.activeFilter));
    }

    renderLegion() {
        const container = document.getElementById('multiverse-mentors-container');
        if (!container) return;

        const characters = this.getFilteredCharacters();
        const s = window.systemState.data;
        container.innerHTML = '';

        if (characters.length === 0) {
            container.innerHTML = '<p class="text-muted font-13 p-10">No Hunter characters found in this classification.</p>';
            return;
        }

        characters.forEach(char => {
            const isAssigned = s.player.assignedMentor === char.id;
            const card = document.createElement('div');
            card.className = `legion-character-card ${isAssigned ? 'assigned-active' : ''}`;
            
            // Format role badges
            const roleBadgesHtml = (char.roles || []).map(r => {
                let label = r.replace('-', ' / ').toUpperCase();
                let icon = '⚡';
                if (r === 'monarch-supreme') icon = '👑';
                else if (r === 'discipline-training') icon = '🥋';
                else if (r === 'warrior') icon = '⚔️';
                else if (r === 'strategist') icon = '🧠';
                else if (r === 'willpower') icon = '🔥';
                else if (r === 'bosses') icon = '👹';
                return `<span class="legion-role-pill role-${r}">${icon} ${label}</span>`;
            }).join('');

            card.innerHTML = `
                <div class="lcc-top">
                    <div class="lcc-avatar-wrap">
                        <div class="lcc-avatar">${char.avatar || '👤'}</div>
                        ${isAssigned ? '<span class="lcc-active-badge">ASSIGNED</span>' : ''}
                    </div>
                    <div class="lcc-header-text">
                        <h4 class="lcc-name">${char.name}</h4>
                        <div class="lcc-universe">${char.universe}</div>
                    </div>
                </div>

                <div class="lcc-roles-wrap mt-10">
                    ${roleBadgesHtml}
                </div>

                <div class="lcc-gameplay-func mt-10">
                    <span class="lcc-func-label">MENTOR ROLE:</span>
                    <strong class="lcc-func-val">${char.mentorRole}</strong>
                </div>

                <div class="lcc-challenge-box mt-8">
                    <p class="lcc-challenge-txt">${char.challenge}</p>
                </div>

                <div class="lcc-actions-row mt-15">
                    <button class="btn-secondary-holo btn-sm btn-view-dossier" data-char-id="${char.id}">VIEW DOSSIER</button>
                    ${isAssigned 
                        ? '<button class="btn-primary-holo btn-sm btn-summon-mentor active-assigned" data-mentor-id="' + char.id + '">✓ ACTIVE MENTOR</button>'
                        : '<button class="btn-primary-holo btn-sm btn-summon-mentor" data-mentor-id="' + char.id + '">SUMMON / ASSIGN</button>'
                    }
                </div>
            `;
            container.appendChild(card);
        });

        // Smooth GSAP reveal if available
        if (typeof gsap !== 'undefined') {
            gsap.from('.legion-character-card', { opacity: 0, y: 15, stagger: 0.04, duration: 0.25, ease: 'power2.out' });
        }
    }

    openCharacterDossier(charId) {
        const s = window.systemState.data;
        const char = (s.multiverse.mentors || []).find(c => c.id === charId);
        if (!char) return;

        let modal = document.getElementById('modal-character-dossier');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-character-dossier';
            modal.className = 'system-modal-backdrop hidden';
            document.body.appendChild(modal);
        }

        const isAssigned = s.player.assignedMentor === char.id;

        modal.innerHTML = `
            <div class="modal-hologram form-holo">
                <div class="window-header">
                    <h3 class="window-title">[ LEGION CHARACTER DOSSIER ]</h3>
                    <button class="modal-close-x" onclick="document.getElementById('modal-character-dossier').classList.add('hidden')">✕</button>
                </div>
                <div class="dossier-content">
                    <div class="dossier-hero">
                        <div class="dossier-avatar">${char.avatar || '👤'}</div>
                        <div class="dossier-hero-info">
                            <h2 class="dossier-name">${char.name}</h2>
                            <div class="dossier-universe">${char.universe} Dimension</div>
                            <div class="dossier-roles-row mt-5">
                                ${(char.roles || []).map(r => `<span class="legion-role-pill role-${r}">${r.replace('-', ' / ').toUpperCase()}</span>`).join(' ')}
                            </div>
                        </div>
                    </div>

                    <div class="dossier-quote-box mt-15">
                        <div class="dossier-quote-mark">“</div>
                        <p class="dossier-quote-text">${char.quote || 'Surpass your limits.'}</p>
                    </div>

                    <div class="dossier-mechanics-grid mt-15">
                        <div class="dmg-card">
                            <span class="dmg-lbl">GAMEPLAY FUNCTION</span>
                            <strong>${char.mentorRole}</strong>
                        </div>
                        <div class="dmg-card">
                            <span class="dmg-lbl">MENTOR CHALLENGE</span>
                            <strong class="text-violet">${char.challenge}</strong>
                        </div>
                    </div>

                    <div class="modal-actions mt-20">
                        ${isAssigned 
                            ? '<button class="btn-primary-holo btn-wide" disabled>✓ CURRENTLY ACTIVE MENTOR</button>'
                            : '<button class="btn-primary-holo btn-wide btn-summon-mentor" data-mentor-id="' + char.id + '">SUMMON AS ACTIVE MENTOR</button>'
                        }
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        if (window.systemAudio) window.systemAudio.playClick();
    }

    assignMentor(mentorId) {
        const s = window.systemState.data;
        const mentor = (s.multiverse.mentors || []).find(m => m.id === mentorId);
        if (!mentor) return;

        s.player.assignedMentor = mentorId;
        window.systemState.save();

        if (window.systemAudio) window.systemAudio.playLevelUp();
        if (window.app) {
            window.app.showToast('MENTOR ASSIGNED', `${mentor.name} summoned! Challenge modifier active.`);
            window.app.syncUI();
        }

        this.renderLegion();

        const dossierModal = document.getElementById('modal-character-dossier');
        if (dossierModal) dossierModal.classList.add('hidden');
    }

    renderBossStages() {
        const container = document.getElementById('multiverse-boss-stages-container');
        if (!container) return;

        const s = window.systemState.data;
        const currentStage = s.multiverse.currentStage || 1;
        const stageBadge = document.getElementById('multiverse-current-stage-badge');
        if (stageBadge) {
            stageBadge.innerText = `STAGE ${currentStage}`;
        }

        const stages = s.multiverse.bossRaids || [];
        container.innerHTML = '';

        stages.forEach(boss => {
            const isUnlocked = boss.stage <= currentStage;
            const isCleared = boss.stage < currentStage;
            const isCurrent = boss.stage === currentStage;

            const card = document.createElement('div');
            card.className = `boss-raid-card stage-card ${isCurrent ? 'current-active-stage' : isCleared ? 'cleared-stage' : 'locked-stage'}`;
            card.dataset.bossId = boss.id;

            card.innerHTML = `
                <div class="brc-top-bar" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span class="brc-badge">
                        STAGE ${boss.stage}: ${boss.rank}
                    </span>
                    ${isCleared ? '<span class="stage-cleared-pill font-10 highlight-green">✓ CLEARED</span>' : isCurrent ? '<span class="stage-active-pill font-10 highlight-crimson">⚔ ACTIVE GATE</span>' : '<span class="stage-locked-pill font-10 text-muted">🔒 LOCKED</span>'}
                </div>
                <div class="brc-avatar mt-5">${boss.icon || '👹'}</div>
                <h4 class="brc-name">${boss.name}</h4>
                <div class="brc-hp-meta font-11 mt-4">
                    <span class="text-muted">GATE HP:</span> <strong class="highlight-crimson">${boss.hp.toLocaleString()} HP</strong>
                    <span class="text-muted ml-8">| DURATION:</span> <strong class="highlight-cyan">${boss.durationMins || 25}m</strong>
                </div>
                <p class="brc-obj mt-6">${boss.realObjective}</p>
                <div class="brc-rewards-row mt-8 font-11" style="display:flex; justify-content:center; gap:12px;">
                    <span class="highlight-green">+${(boss.rewardXp || 500).toLocaleString()} Mind XP</span>
                    <span class="highlight-gold">+${boss.rewardGold || 150} Gold</span>
                </div>
                <div class="brc-actions mt-12">
                    ${isUnlocked 
                        ? `<button class="btn-cinematic-danger btn-sm btn-wide btn-start-raid-direct" data-boss-id="${boss.id}">${isCurrent ? '⚔ ENTER ACTIVE RAID GATE' : '🔄 RE-ENGAGE BOSS'}</button>`
                        : `<button class="btn-secondary-holo btn-sm btn-wide" disabled>🔒 REACH STAGE ${boss.stage} TO UNLOCK</button>`
                    }
                </div>
            `;
            container.appendChild(card);
        });
    }

    startBossRaid(bossId) {
        const s = window.systemState.data;
        const boss = (s.multiverse.bossRaids || []).find(b => b.id === bossId) || {
            name: 'Ryomen Sukuna',
            rank: 'Special Grade',
            hp: 2500,
            currentHp: 2500,
            durationMins: 45,
            realObjective: '45-Minute Deep Focus Work Session'
        };

        this.activeRaid = boss;
        this.totalSeconds = (boss.durationMins || 45) * 60;
        this.remainingSeconds = this.totalSeconds;

        if (window.cinematicEngine) {
            window.cinematicEngine.bossIntro({
                bossName: boss.name.toUpperCase(),
                grade: boss.rank.toUpperCase(),
                objective: boss.realObjective || '45-Minute Deep Coding / Study Block',
                durationMins: boss.durationMins || 45
            });
        }
    }

    toggleFocusRaid() {
        const btn = document.getElementById('btn-start-focus-raid');
        if (this.isRaidRunning) {
            clearInterval(this.raidTimer);
            this.isRaidRunning = false;
            if (btn) btn.innerText = 'RESUME FOCUS RAID';
        } else {
            this.isRaidRunning = true;
            if (btn) btn.innerText = 'PAUSE FOCUS RAID';
            this.raidTimer = setInterval(() => this.tickRaid(), 1000);
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

        const boss = this.activeRaid || { name: 'Sukuna', stage: 1, rewardXp: 500, rewardGold: 300 };
        document.getElementById('modal-boss-raid')?.classList.add('hidden');

        if (window.cinematicEngine) {
            window.cinematicEngine.bossDefeat({
                bossName: boss.name,
                xpEarned: boss.rewardXp || 500,
                goldEarned: boss.rewardGold || 300
            });
        }

        const s = window.systemState.data;
        if (boss.stage === (s.multiverse.currentStage || 1)) {
            s.multiverse.currentStage = (s.multiverse.currentStage || 1) + 1;
            if (window.app) {
                window.app.showToast('STAGE ADVANCEMENT', `Stage ${boss.stage} Cleared! Unlocked Stage ${s.multiverse.currentStage} Boss Gate.`);
            }
        }

        window.systemState.gainTrackXp('mindXp', boss.rewardXp || 500, `Conquered Stage ${boss.stage || 1} Boss: ${boss.name}`);
        s.player.gold += (boss.rewardGold || 300);
        window.systemState.save();

        this.renderBossStages();
        if (window.app) window.app.syncUI();
    }

    getDailySecretCharacter() {
        const s = window.systemState.data;
        const mentors = s.multiverse.mentors || [];
        if (mentors.length === 0) return null;

        // Daily seed based on date
        const todayStr = new Date().toISOString().slice(0, 10);
        let hash = 0;
        for (let i = 0; i < todayStr.length; i++) {
            hash = (hash << 5) - hash + todayStr.charCodeAt(i);
            hash |= 0;
        }
        const index = Math.abs(hash) % mentors.length;
        return mentors[index];
    }

    openHunterdleModal() {
        const secret = this.getDailySecretCharacter();
        if (!secret) return;

        const modal = document.getElementById('modal-hunterdle');
        if (!modal) return;

        // Populate Clues
        const universeEl = document.getElementById('hunterdle-clue-universe');
        if (universeEl) universeEl.innerText = `${secret.universe} Dimension`;

        const rolesEl = document.getElementById('hunterdle-clue-roles');
        if (rolesEl) {
            rolesEl.innerText = (secret.roles || []).map(r => r.replace('-', ' / ').toUpperCase()).join(' • ');
        }

        const quoteEl = document.getElementById('hunterdle-clue-quote');
        if (quoteEl) quoteEl.innerText = `“${secret.quote}”`;

        // Populate Options Dropdown
        const selectEl = document.getElementById('select-hunterdle-guess');
        if (selectEl) {
            const mentors = window.systemState.data.multiverse.mentors || [];
            selectEl.innerHTML = '<option value="">-- Choose Character --</option>';
            const sorted = [...mentors].sort((a, b) => a.name.localeCompare(b.name));
            sorted.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.id;
                opt.innerText = `${m.name} (${m.universe})`;
                selectEl.appendChild(opt);
            });
        }

        const resultBox = document.getElementById('hunterdle-result-box');
        if (resultBox) {
            resultBox.classList.add('hidden');
            resultBox.innerHTML = '';
        }

        modal.classList.remove('hidden');
        if (window.systemAudio) window.systemAudio.playClick();
    }

    submitHunterdleGuess() {
        const selectEl = document.getElementById('select-hunterdle-guess');
        const guessId = selectEl ? selectEl.value : '';
        const secret = this.getDailySecretCharacter();
        const resultBox = document.getElementById('hunterdle-result-box');
        if (!secret || !resultBox) return;

        if (!guessId) {
            resultBox.className = 'hunterdle-result-box hunterdle-fail mt-20';
            resultBox.innerText = 'Please select a character from the list!';
            resultBox.classList.remove('hidden');
            return;
        }

        if (guessId === secret.id) {
            // Correct Guess!
            resultBox.className = 'hunterdle-result-box hunterdle-success mt-20';
            resultBox.innerHTML = `
                🎉 <strong>CORRECT! IT IS ${secret.name.toUpperCase()}!</strong>
                <div class="mt-4 font-11">+300 Mind XP & +150 Gold Awarded!</div>
            `;
            resultBox.classList.remove('hidden');

            if (typeof confetti !== 'undefined') {
                confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            }
            if (window.systemAudio) window.systemAudio.playVictory();

            window.systemState.gainTrackXp('mindXp', 300, `Solved Daily Hunterdle: ${secret.name}`);
            window.systemState.data.player.gold += 150;
            window.systemState.save();
            if (window.app) window.app.syncUI();
        } else {
            // Wrong Guess
            const guessedChar = (window.systemState.data.multiverse.mentors || []).find(m => m.id === guessId);
            resultBox.className = 'hunterdle-result-box hunterdle-fail mt-20';
            resultBox.innerHTML = `
                ❌ <strong>INCORRECT: ${guessedChar ? guessedChar.name : 'Unknown'} is not the secret Hunter!</strong>
                <div class="mt-4 font-11 text-muted">Hint: Focus on the quote and universe clues above.</div>
            `;
            resultBox.classList.remove('hidden');
            if (window.systemAudio) window.systemAudio.playClick();
        }
    }

    abandonFocusRaid() {
        clearInterval(this.raidTimer);
        this.isRaidRunning = false;
        document.getElementById('modal-boss-raid')?.classList.add('hidden');
    }
}

if (typeof window !== 'undefined') {
    window.multiverseEngine = new MultiverseEngineModule();
}
