/**
 * MULTIVERSE HUNTER — MASTER WORLD ENGINE (V3.1)
 * Transforms the application into a living anime universe where:
 * - The World responds dynamically to the real time of day, environment & hunter progression.
 * - Anime characters arrive at your training ground, challenge you, acknowledge your real lifts,
 *   and evolve their relationship with you over time.
 * - Governs Multiverse Realms (Shadow Realm, Grand Line, Ninja Realm, Dragon Domain, Jujutsu Void).
 */

class WorldEngine {
    constructor() {
        this.realms = {
            'shadow': {
                id: 'shadow',
                name: 'Shadow Realm',
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
                name: 'Grand Line World',
                universe: 'One Piece',
                focus: 'Endurance, Heavy Compound Grit & Recovery',
                environment: 'Stormy Sea Cliff & Sea Breeze',
                ambientBg: 'radial-gradient(circle at 50% 30%, #0d2238 0%, #08090d 85%)',
                mentor: 'zoro',
                minLevel: 5,
                unlocked: true,
                badge: '⚔️ WARRIOR'
            },
            'ninja_realm': {
                id: 'ninja_realm',
                name: 'Hidden Leaf Grounds',
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
                focus: 'Limit Breaking, High-Volume & Peak Power',
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
                focus: 'Mind, Meditation & Cognitive Deep Focus',
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
        if (hour >= 5 && hour < 10) return 'DAWN';       // 5am - 10am (Rock Lee / Morning Discipline)
        if (hour >= 10 && hour < 17) return 'DAY';       // 10am - 5pm (Zoro / Compound Training)
        if (hour >= 17 && hour < 21) return 'DUSK';      // 5pm - 9pm (Asta / High-Effort Conditioning)
        return 'NIGHT';                                  // 9pm - 5am (Gojo / Domain Meditation & Recovery)
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

        // Spawn time-appropriate character if none currently locked in training
        if (!this.activeCharacter || !this.activeCharacter.isTraining) {
            this.spawnTimeOfDayCharacter();
        }
    }

    /**
     * Determines which character walks onto the training ground
     */
    spawnTimeOfDayCharacter() {
        const charMap = {
            'DAWN': {
                id: 'rock_lee',
                name: 'Rock Lee',
                universe: 'Naruto',
                role: 'Discipline Master',
                avatar: '🥊',
                greeting: 'You came. Good! Today, we forge unbreakable discipline through bodyweight repetition!',
                missionTitle: "Rock Lee's Foundation Trial",
                exercises: [
                    { name: 'Strict Hollow Push-ups', sets: '3 × 15' },
                    { name: 'Bodyweight Deep Squats', sets: '3 × 20' },
                    { name: 'Walking Lunges', sets: '3 × 12/leg' },
                    { name: 'Plank Core Hold', sets: '3 × 45 sec' }
                ],
                reward: { bodyXp: 85, discXp: 50, gold: 120 }
            },
            'DAY': {
                id: 'zoro',
                name: 'Roronoa Zoro',
                universe: 'One Piece',
                role: 'Warrior Mentor',
                avatar: '⚔️',
                greeting: 'Three swords are useless if your vessel cannot carry them. Let’s see your progressive overload today.',
                missionTitle: "Zoro's Iron Vessel Protocol",
                exercises: [
                    { name: 'Heavy Barbell Deadlift', sets: '4 × 6 (RIR 2)' },
                    { name: 'Barbell Overhead Press', sets: '3 × 8' },
                    { name: 'Weighted Pull-ups / Rows', sets: '3 × 8-10' },
                    { name: 'Loaded Carry / Farmer Walks', sets: '3 × 50m' }
                ],
                reward: { bodyXp: 120, discXp: 60, gold: 150 }
            },
            'DUSK': {
                id: 'asta',
                name: 'Asta',
                universe: 'Black Clover',
                role: 'Willpower Limit Breaker',
                avatar: '🗡️',
                greeting: 'My magic is never giving up! Push past your fatigue limit and conquer today’s quota!',
                missionTitle: "Asta's Anti-Fatigue Circuit",
                exercises: [
                    { name: 'Explosive Jump Squats', sets: '4 × 15' },
                    { name: 'Diamond Push-ups', sets: '4 × 12' },
                    { name: 'Hanging Knee/Leg Raises', sets: '3 × 12' },
                    { name: 'Shadow Boxing / Fast Steps', sets: '5 min finisher' }
                ],
                reward: { bodyXp: 110, discXp: 70, gold: 140 }
            },
            'NIGHT': {
                id: 'gojo',
                name: 'Satoru Gojo',
                universe: 'Jujutsu Kaisen',
                role: 'Focus & Meditation Guide',
                avatar: '🌌',
                greeting: 'Your body has fought well today. Now, silence the noise outside and master your mind inside the Void.',
                missionTitle: "Gojo's Domain: Limitless Meditation",
                isMeditation: true,
                durationMins: 10,
                reward: { mindXp: 90, recXp: 60, gold: 150 }
            }
        };

        this.activeCharacter = charMap[this.timeOfDay] || charMap['DAY'];
        this.renderCharacterWorldInteraction();
    }

    /**
     * Switch current Multiverse Realm
     */
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

    /**
     * Character Relationship Management
     */
    loadRelationships() {
        try {
            const raw = localStorage.getItem('HUNTER_CHAR_RELATIONSHIPS_V3');
            this.characterRelationships = raw ? JSON.parse(raw) : {};
        } catch (e) {
            this.characterRelationships = {};
        }
    }

    saveRelationships() {
        try {
            localStorage.setItem('HUNTER_CHAR_RELATIONSHIPS_V3', JSON.stringify(this.characterRelationships));
        } catch (e) {}
    }

    getRelationship(charId) {
        if (!this.characterRelationships[charId]) {
            this.characterRelationships[charId] = {
                sessionsCompleted: 0,
                stage: 'First Meeting',
                level: 1,
                affinity: 0,
                lastPerformanceRecord: null
            };
        }
        return this.characterRelationships[charId];
    }

    recordSessionWithCharacter(charId, performanceData = {}) {
        const rel = this.getRelationship(charId);
        rel.sessionsCompleted += 1;
        rel.affinity += 25;
        rel.lastPerformanceRecord = {
            date: new Date().toISOString(),
            ...performanceData
        };

        // Progressive relationship evolution
        if (rel.sessionsCompleted >= 25) { rel.stage = 'Legendary Companion'; rel.level = 5; }
        else if (rel.sessionsCompleted >= 15) { rel.stage = 'Elite Mentor'; rel.level = 4; }
        else if (rel.sessionsCompleted >= 7) { rel.stage = 'Trusted Warrior'; rel.level = 3; }
        else if (rel.sessionsCompleted >= 2) { rel.stage = 'Training Partner'; rel.level = 2; }
        else { rel.stage = 'First Meeting'; rel.level = 1; }

        this.saveRelationships();
        return rel;
    }

    /**
     * Renders character speech, dynamic relationship pill, and training prompt in the World Hub
     */
    renderCharacterWorldInteraction() {
        const char = this.activeCharacter;
        if (!char) return;

        const rel = this.getRelationship(char.id);
        const speechEl = document.getElementById('world-character-speech');
        const nameEl = document.getElementById('world-character-name');
        const avatarEl = document.getElementById('world-character-avatar');
        const relEl = document.getElementById('world-character-rel-badge');
        const missionCard = document.getElementById('world-mission-card');

        if (nameEl) nameEl.innerText = char.name.toUpperCase();
        if (avatarEl) avatarEl.innerText = char.avatar;
        if (relEl) {
            relEl.innerText = `${rel.stage.toUpperCase()} (Lvl ${rel.level})`;
            relEl.className = `char-rel-pill rel-lvl-${rel.level}`;
        }

        // Context-aware speech based on relationship and history
        let dynamicDialogue = char.greeting;
        if (rel.sessionsCompleted > 0 && rel.lastPerformanceRecord) {
            if (char.id === 'zoro') {
                dynamicDialogue = `“You’ve logged ${rel.sessionsCompleted} sessions with me. Last time your output pushed past limits. Let's see your progressive overload today!”`;
            } else if (char.id === 'rock_lee') {
                dynamicDialogue = `“Session #${rel.sessionsCompleted + 1}! Hard work never betrays the spirit! Let's conquer this discipline set!”`;
            } else if (char.id === 'gojo') {
                dynamicDialogue = `“Welcome back to the Void. Your cognitive control has been sharpening. Ready for 10 minutes of pure clarity?”`;
            }
        }

        if (speechEl) speechEl.innerText = dynamicDialogue;

        // Render World Mission Card
        if (missionCard) {
            if (char.isMeditation) {
                missionCard.innerHTML = `
                    <div class="wmc-header">
                        <span class="wmc-tag highlight-cyan">🧘 DAILY COGNITIVE PROTOCOL</span>
                        <h3 class="wmc-title">${char.missionTitle}</h3>
                    </div>
                    <p class="wmc-desc mt-6 font-12 text-muted">
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
                        <span class="wmc-tag highlight-gold">⚔️ DAILY CHALLENGE FROM ${char.name.toUpperCase()}</span>
                        <h3 class="wmc-title">${char.missionTitle}</h3>
                    </div>
                    <ul class="wmc-exercise-list mt-10">
                        ${exHtml}
                    </ul>
                    <div class="wmc-meta mt-10">
                        <span class="csm-pill highlight-green">💪 +${char.reward.bodyXp} Body XP</span>
                        <span class="csm-pill highlight-gold">🔥 +${char.reward.discXp} Discipline XP</span>
                        <span class="csm-pill highlight-cyan">🪙 +${char.reward.gold} Gold</span>
                    </div>
                    <button id="btn-begin-world-training" class="btn-primary-holo btn-wide mt-15">
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
                    window.domainMeditation.open();
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

        // Award verified XP & Gold through central state engine
        const r = char.reward;
        window.systemState.gainTrackXp('bodyXp', r.bodyXp, `Completed ${char.missionTitle} with ${char.name}`);
        window.systemState.gainTrackXp('disciplineXp', r.discXp, `Discipline Trial: ${char.name}`);
        window.systemState.data.player.gold += r.gold;
        window.systemState.save();

        // Advance character relationship
        const rel = this.recordSessionWithCharacter(char.id, { exercises: char.exercises });

        if (window.app) {
            window.app.showToast('TRAINING COMPLETE', `${char.name}: “Excellent execution. Your strength evolves.” (+${r.bodyXp} Body XP, +${r.discXp} Disc XP)`);
            window.app.syncUI();
        }

        this.renderCharacterWorldInteraction();
    }
}

// Global Singleton
if (typeof window !== 'undefined') {
    window.worldEngine = new WorldEngine();
}
