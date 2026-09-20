/**
 * MULTIVERSE HUNTER — MASTER WORLD ENGINE (V3.2)
 * Living World Engine: Manages dynamic atmosphere, time-of-day cycles, realm shifts,
 * and Persistent Mentor Relationship Progression (First Meeting -> Training Partner -> Trusted Warrior -> Elite Mentor -> Legendary Companion).
 */

class WorldEngine {
    constructor() {
        this.realms = {
            'shadow': {
                id: 'shadow',
                name: 'Shadow Realm Citadel',
                universe: 'Solo Leveling',
                focus: 'Strength & Progressive Overload',
                environment: 'Dark Obsidian Citadel & Mist',
                ambientBg: 'radial-gradient(circle at 50% 30%, #170d2b 0%, #08090d 85%)',
                mentor: 'jinwoo',
                minLevel: 1,
                unlocked: true,
                badge: '👑 SOVEREIGN'
            },
            'grand_line': {
                id: 'grand_line',
                name: 'Grand Line Cliffside',
                universe: 'One Piece',
                focus: 'Heavy Compound Overload & Grit',
                environment: 'Stormy Sea Cliff & Sea Breeze',
                ambientBg: 'radial-gradient(circle at 50% 30%, #0d2238 0%, #08090d 85%)',
                mentor: 'zoro',
                minLevel: 5,
                unlocked: true,
                badge: '⚔️ WARRIOR'
            },
            'ninja_realm': {
                id: 'ninja_realm',
                name: 'Hidden Leaf Training Grounds',
                universe: 'Naruto',
                focus: 'Agility, Calisthenics & Daily Discipline',
                environment: 'Mountain Valley & Falling Leaves',
                ambientBg: 'radial-gradient(circle at 50% 30%, #1a1e12 0%, #08090d 85%)',
                mentor: 'rock_lee',
                minLevel: 1,
                unlocked: true,
                badge: '🥋 DISCIPLINE'
            },
            'dragon_domain': {
                id: 'dragon_domain',
                name: 'Hyperbolic Gravity Chamber',
                universe: 'Dragon Ball',
                focus: 'Limit Breaking & Peak Power Output',
                environment: 'Endless White Expanse with Golden Aura',
                ambientBg: 'radial-gradient(circle at 50% 30%, #2e2008 0%, #08090d 85%)',
                mentor: 'goku',
                minLevel: 15,
                unlocked: false,
                badge: '🔥 LIMIT BREAKER'
            },
            'jujutsu_void': {
                id: 'jujutsu_void',
                name: 'Infinite Void Sanctuary',
                universe: 'Jujutsu Kaisen',
                focus: 'Cognitive Alpha-Wave Meditation & Deep Focus',
                environment: 'Starry Void & Cosmic Astral Plane',
                ambientBg: 'radial-gradient(circle at 50% 30%, #04142e 0%, #05060a 85%)',
                mentor: 'gojo',
                minLevel: 3,
                unlocked: true,
                badge: '🌌 DOMAIN'
            }
        };

        this.currentRealmId = 'ninja_realm';
        this.activeCharacter = null;
        this.timeOfDay = this.calculateTimeOfDay();
        this.characterRelationships = {};
        this.init();
    }

    init() {
        this.loadRelationships();
        this.updateWorldTimeCycle();
        setInterval(() => this.updateWorldTimeCycle(), 60000);
    }

    calculateTimeOfDay() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 10) return 'DAWN';       // 5am - 10am (Rock Lee)
        if (hour >= 10 && hour < 17) return 'DAY';       // 10am - 5pm (Zoro)
        if (hour >= 17 && hour < 21) return 'DUSK';      // 5pm - 9pm (Asta)
        return 'NIGHT';                                  // 9pm - 5am (Gojo)
    }

    updateWorldTimeCycle() {
        this.timeOfDay = this.calculateTimeOfDay();
        const body = document.body;
        body.classList.remove('world-dawn', 'world-day', 'world-dusk', 'world-night');
        body.classList.add(`world-${this.timeOfDay.toLowerCase()}`);

        const timePill = document.getElementById('world-time-pill');
        if (timePill) {
            const icons = { DAWN: '🌅 DAWN', DAY: '☀️ MIDDAY', DUSK: '🌇 DUSK', NIGHT: '🌙 NIGHT' };
            timePill.innerText = icons[this.timeOfDay] || this.timeOfDay;
        }

        if (!this.activeCharacter || !this.activeCharacter.isTraining) {
            this.spawnTimeOfDayCharacter();
        }
    }

    spawnTimeOfDayCharacter() {
        // 1. Evaluate User Weakness Domain
        const weakness = window.weaknessRotationEngine ? window.weaknessRotationEngine.evaluateWeakness() : 'strength';
        
        // 2. Weakness x Time-of-Day Matrix
        const matrix = {
            'discipline': {
                id: 'rock_lee',
                name: 'Rock Lee',
                universe: 'Naruto',
                role: 'Discipline Master (Addressing Discipline Lag)',
                avatar: '🥊',
                greeting: 'The System detected a discipline lag! Hard work is the ultimate talent—let us forge unbreakable consistency today!',
                missionTitle: "Rock Lee's Foundation Trial",
                exercises: [
                    { name: 'Strict Hollow Push-ups', sets: '3 × 15' },
                    { name: 'Bodyweight Deep Squats', sets: '3 × 20' },
                    { name: 'Walking Lunges', sets: '3 × 12/leg' },
                    { name: 'Plank Core Hold', sets: '3 × 45 sec' }
                ],
                reward: { bodyXp: 85, discXp: 50, gold: 120 }
            },
            'strength': {
                id: 'zoro',
                name: 'Roronoa Zoro',
                universe: 'One Piece',
                role: 'Warrior Mentor (Targeting Strength Overload)',
                avatar: '⚔️',
                greeting: 'Today, we test your strength. Lock in your form and dominate each progressive overload set.',
                missionTitle: "Zoro's Iron Vessel Protocol",
                exercises: [
                    { name: 'Barbell Back Squat', sets: '4 × 10 (80kg)' },
                    { name: 'Barbell Overhead Press', sets: '3 × 8 (45kg)' },
                    { name: 'Weighted Pull-ups', sets: '3 × 8 (10kg)' },
                    { name: 'Loaded Carry / Farmer Walks', sets: '3 × 50m' }
                ],
                reward: { bodyXp: 180, discXp: 60, gold: 150 }
            },
            'mind': {
                id: 'gojo',
                name: 'Satoru Gojo',
                universe: 'Jujutsu Kaisen',
                role: 'Focus & Meditation Guide (Calibrating Cognitive Load)',
                avatar: '🌌',
                greeting: 'Your mind needs calibration. Step inside the Infinite Void and restore prefrontal focus through controlled breathing.',
                missionTitle: "Gojo's Domain: Limitless Meditation",
                isMeditation: true,
                durationMins: 10,
                reward: { mindXp: 100, recXp: 50, gold: 100 }
            },
            'recovery': {
                id: 'asta',
                name: 'Asta',
                universe: 'Black Clover',
                role: 'Work Capacity & Aerobic Adaptation',
                avatar: '🗡️',
                greeting: 'Not giving up is my magic! Push your heart rate to the absolute limit and conquer today’s quota!',
                missionTitle: "Asta's Anti-Fatigue Circuit",
                exercises: [
                    { name: 'Explosive Jump Squats', sets: '4 × 15' },
                    { name: 'Diamond Push-ups', sets: '4 × 12' },
                    { name: 'Hanging Knee/Leg Raises', sets: '3 × 12' },
                    { name: 'Shadow Sprints / Fast Steps', sets: '5 min finisher' }
                ],
                reward: { bodyXp: 110, discXp: 70, gold: 140 }
            }
        };

        // If Nighttime (9pm-5am), default to Gojo's recovery/meditation domain
        if (this.timeOfDay === 'NIGHT') {
            this.activeCharacter = matrix['mind'];
        } else {
            this.activeCharacter = matrix[weakness] || matrix['strength'];
        }

        this.renderCharacterWorldInteraction();
    }

    switchRealm(realmId) {
        if (!this.realms[realmId]) return;
        const playerLvl = window.systemState ? window.systemState.data.player.hunterLevel : 1;
        const realm = this.realms[realmId];

        if (playerLvl < realm.minLevel) {
            if (window.app) window.app.showToast('REALM LOCKED', `Requires Hunter Level ${realm.minLevel} to access ${realm.name}.`);
            if (window.systemAudio) window.systemAudio.playClick();
            return;
        }

        this.currentRealmId = realmId;
        const worldStage = document.getElementById('world-ambient-stage');
        if (worldStage) {
            worldStage.style.background = realm.ambientBg;
        }

        const realmTitle = document.getElementById('world-current-realm-name');
        if (realmTitle) realmTitle.innerText = realm.name.toUpperCase();

        const realmTag = document.getElementById('world-realm-badge');
        if (realmTag) realmTag.innerText = realm.badge;

        if (window.app) window.app.showToast('REALM SHIFT', `Entered ${realm.name} (${realm.universe}).`);
        if (window.systemAudio) window.systemAudio.playGateOpen();

        this.renderCharacterWorldInteraction();
    }

    loadRelationships() {
        try {
            const raw = localStorage.getItem('HUNTER_CHAR_RELATIONSHIPS_V3_2');
            this.characterRelationships = raw ? JSON.parse(raw) : {
                'zoro': { setsTrained: 18, affinity: 72, stageIndex: 2 },
                'rock_lee': { setsTrained: 24, affinity: 85, stageIndex: 2 },
                'gojo': { setsTrained: 12, affinity: 60, stageIndex: 1 },
                'asta': { setsTrained: 8, affinity: 40, stageIndex: 1 }
            };
        } catch (e) {
            this.characterRelationships = {};
        }
    }

    saveRelationships() {
        try {
            localStorage.setItem('HUNTER_CHAR_RELATIONSHIPS_V3_2', JSON.stringify(this.characterRelationships));
        } catch (e) {}
    }

    getRelationshipTiers() {
        return [
            { name: 'FIRST MEETING', reqSets: 0 },
            { name: 'TRAINING PARTNER', reqSets: 5 },
            { name: 'TRUSTED WARRIOR', reqSets: 15 },
            { name: 'ELITE MENTOR', reqSets: 30 },
            { name: 'LEGENDARY COMPANION', reqSets: 50 }
        ];
    }

    getRelationship(charId) {
        if (!this.characterRelationships[charId]) {
            this.characterRelationships[charId] = {
                setsTrained: 0,
                affinity: 0,
                stageIndex: 0,
                lastSessionDate: null
            };
        }
        return this.characterRelationships[charId];
    }

    recordMentorTraining(mentorNameOrId, setsCount = 1) {
        const idMap = {
            'Roronoa Zoro': 'zoro',
            'Zoro': 'zoro',
            'Rock Lee': 'rock_lee',
            'Satoru Gojo': 'gojo',
            'Gojo Satoru': 'gojo',
            'Asta': 'asta',
            'Sung Jin-Woo': 'jinwoo'
        };
        const charId = idMap[mentorNameOrId] || mentorNameOrId.toLowerCase().replace(/\s+/g, '_');
        const rel = this.getRelationship(charId);

        rel.setsTrained += setsCount;
        rel.affinity = Math.min(100, rel.affinity + setsCount * 4);

        const tiers = this.getRelationshipTiers();
        for (let i = tiers.length - 1; i >= 0; i--) {
            if (rel.setsTrained >= tiers[i].reqSets) {
                rel.stageIndex = i;
                break;
            }
        }

        rel.lastSessionDate = new Date().toISOString();
        this.saveRelationships();
        this.renderCharacterWorldInteraction();
    }

    renderCharacterWorldInteraction() {
        const char = this.activeCharacter;
        if (!char) return;

        const rel = this.getRelationship(char.id);
        const tiers = this.getRelationshipTiers();
        const currentTier = tiers[rel.stageIndex] || tiers[0];

        const speechEl = document.getElementById('world-character-speech');
        const nameEl = document.getElementById('world-character-name');
        const avatarEl = document.getElementById('world-character-avatar');
        const relEl = document.getElementById('world-character-rel-badge');
        const missionCard = document.getElementById('world-mission-card');

        if (nameEl) nameEl.innerText = char.name.toUpperCase();
        if (avatarEl) avatarEl.innerText = char.avatar;
        if (relEl) {
            relEl.innerText = `${currentTier.name} (Affinity: ${rel.affinity}%)`;
            relEl.className = `char-rel-pill rel-lvl-${rel.stageIndex + 1}`;
        }

        // Generate relationship visual progression track
        const relTrackHtml = `
            <div class="mentor-relationship-track mt-10">
                <div class="mrt-header font-10 text-muted" style="display:flex; justify-content:space-between;">
                    <span>RELATIONSHIP PROGRESSION</span>
                    <strong class="highlight-cyan">${currentTier.name} (${rel.affinity}%)</strong>
                </div>
                <div class="mrt-steps-row mt-6">
                    ${tiers.map((t, idx) => {
                        const isDone = idx < rel.stageIndex;
                        const isCurrent = idx === rel.stageIndex;
                        return `
                            <div class="mrt-step-item ${isDone ? 'mrt-done' : ''} ${isCurrent ? 'mrt-active' : 'mrt-locked'}">
                                <span class="mrt-icon">${isDone ? '✓' : isCurrent ? `● ${rel.affinity}%` : '🔒'}</span>
                                <span class="mrt-title font-9">${t.name}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        let dynamicDialogue = char.greeting;
        if (rel.setsTrained > 0) {
            if (char.id === 'zoro') {
                dynamicDialogue = `“We’ve logged ${rel.setsTrained} sets together. Your posture under 80kg is solid. Let’s make today’s training count.”`;
            } else if (char.id === 'rock_lee') {
                dynamicDialogue = `“${rel.setsTrained} sets of pure discipline logged! The flame of youth burns brighter with every repetition!”`;
            } else if (char.id === 'gojo') {
                dynamicDialogue = `“Your focus is stabilizing nicely. Ready to step back inside the Void for another calibration?”`;
            }
        }

        if (speechEl) speechEl.innerText = dynamicDialogue;

        if (missionCard) {
            if (char.isMeditation) {
                missionCard.innerHTML = `
                    <div class="wmc-header">
                        <span class="wmc-tag highlight-cyan">🧘 DAILY COGNITIVE PROTOCOL</span>
                        <h3 class="wmc-title">${char.missionTitle}</h3>
                    </div>
                    ${relTrackHtml}
                    <p class="wmc-desc mt-10 font-12 text-muted">
                        Engage Gojo's Domain Expansion to silence digital noise, synchronize breathing, and elevate focus.
                    </p>
                    <div class="wmc-meta mt-10">
                        <span class="csm-pill">⏱️ DURATION: <strong>${char.durationMins}m</strong></span>
                        <span class="csm-pill highlight-purple">🧠 +${char.reward.mindXp} Mind XP</span>
                        <span class="csm-pill highlight-green">❤️ +${char.reward.recXp} Recovery XP</span>
                    </div>
                    <button id="btn-enter-domain-meditation" class="btn-primary-holo btn-wide mt-15">
                        🌌 ENTER DOMAIN: MEDITATION
                    </button>
                `;
            } else {
                const exHtml = (char.exercises || []).map(e => `
                    <li class="wmc-ex-item">
                        <span class="wmc-ex-name">⚔️ ${e.name}</span>
                        <strong class="wmc-ex-sets highlight-cyan">${e.sets}</strong>
                    </li>
                `).join('');

                missionCard.innerHTML = `
                    <div class="wmc-header">
                        <span class="wmc-tag highlight-gold">⚔️ TODAY'S MENTOR: ${char.name.toUpperCase()}</span>
                        <h3 class="wmc-title">${char.missionTitle}</h3>
                    </div>
                    ${relTrackHtml}
                    <ul class="wmc-exercise-list mt-10">
                        ${exHtml}
                    </ul>
                    <div class="wmc-meta mt-10">
                        <span class="csm-pill highlight-green">💪 +${char.reward.bodyXp} Body XP</span>
                        <span class="csm-pill highlight-gold">🔥 +${char.reward.discXp} Discipline XP</span>
                        <span class="csm-pill highlight-cyan">🪙 +${char.reward.gold} Gold</span>
                    </div>
                    <button id="btn-begin-world-training" class="btn-primary-holo btn-wide mt-15 btn-glow-violet">
                        ⚔ BEGIN TRAINING WITH ${char.name.toUpperCase()}
                    </button>
                `;
            }

            this.bindMissionButtons();
        }
    }

    bindMissionButtons() {
        const btnMeditation = document.getElementById('btn-enter-domain-meditation');
        if (btnMeditation) {
            btnMeditation.addEventListener('click', () => {
                if (window.domainMeditation) {
                    window.domainMeditation.open(10);
                }
            });
        }

        const btnTraining = document.getElementById('btn-begin-world-training');
        if (btnTraining) {
            btnTraining.addEventListener('click', () => {
                this.executeWorldTrainingMission();
            });
        }
    }

    executeWorldTrainingMission() {
        const char = this.activeCharacter;
        if (!char) return;

        if (window.systemAudio) window.systemAudio.playLevelUp();
        if (typeof confetti !== 'undefined') {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        }

        const r = char.reward;
        window.systemState.gainTrackXp('bodyXp', r.bodyXp, `Completed ${char.missionTitle} with ${char.name}`);
        window.systemState.gainTrackXp('disciplineXp', r.discXp, `Discipline Trial: ${char.name}`);
        window.systemState.data.player.gold += r.gold;
        window.systemState.save();

        this.recordMentorTraining(char.id, 4);

        if (window.app) {
            window.app.showToast('TRAINING COMPLETE', `${char.name}: “Well done. Your stats have ascended.” (+${r.bodyXp} Body XP, +${r.discXp} Disc XP)`);
            window.app.syncUI();
        }
    }
}

// Global Singleton
if (typeof window !== 'undefined') {
    window.worldEngine = new WorldEngine();
}
