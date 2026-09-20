/**
 * MULTIVERSE HUNTER — INTERACTIVE TRAINING JOURNEY & ACTIVE SET ENGINE (V3.1)
 * Transforms static workout lists into an engaging, step-by-step visual anime path:
 * 01 AWAKENING (5m) -> 02 WARM-UP (8m) -> 03 STRENGTH (42m) -> 04 CONDITIONING (15m) -> 05 COOL DOWN (5m) -> 06 MEDITATION (10m) -> 07 BOSS TRIAL
 *
 * Includes Interactive Active Set Execution modal with live mentor coaching (Zoro/Rock Lee),
 * rep progression bars, auto-rest countdowns, and animated personal best graphs.
 */

class JourneyEngine {
    constructor() {
        this.journeySteps = [
            {
                id: 'step_awakening',
                stepNum: '01',
                title: 'AWAKENING & MOBILITY',
                duration: '5 MIN',
                type: 'mobility',
                icon: '🌅',
                mentor: 'Gojo Satoru',
                desc: 'Joint lubrication, cat-cows, wrist & hip opening protocols.',
                xpReward: { bodyXp: 30, recXp: 20 },
                exercises: [
                    { name: 'World Greatest Stretch', sets: 2, reps: '5/side', target: 'Full Body Mobility' },
                    { name: 'Thoracic Rotations', sets: 2, reps: '10/side', target: 'Upper Spine Mobility' }
                ],
                status: 'ready' // ready | in_progress | completed
            },
            {
                id: 'step_warmup',
                stepNum: '02',
                title: 'DYNAMIC WARM-UP',
                duration: '8 MIN',
                type: 'warmup',
                icon: '🔥',
                mentor: 'Rock Lee',
                desc: 'Core temperature rise, glute activation, hollow body prep.',
                xpReward: { bodyXp: 45, discXp: 25 },
                exercises: [
                    { name: 'Hollow Body Hold', sets: 3, reps: '30s hold', target: 'Core Anterior Chain' },
                    { name: 'Banded Lateral Walks / Air Squats', sets: 3, reps: '15 reps', target: 'Glutes & Hip Flexors' }
                ],
                status: 'pending'
            },
            {
                id: 'step_strength',
                stepNum: '03',
                title: 'PRIMARY STRENGTH TRIAL',
                duration: '42 MIN',
                type: 'strength',
                icon: '⚔️',
                mentor: 'Roronoa Zoro',
                desc: 'Heavy compound progressive overload with strict biomechanical tension.',
                xpReward: { bodyXp: 180, discXp: 60, gold: 150 },
                exercises: [
                    {
                        name: 'Barbell Back Squat',
                        target: 'Quads & Glutes',
                        sets: 4,
                        reps: 8,
                        weight: 80,
                        prevWeight: 75,
                        rir: '1-2',
                        history: [65, 70, 75, 80]
                    },
                    {
                        name: 'Overhead Barbell Press',
                        target: 'Delts & Core Stability',
                        sets: 3,
                        reps: 8,
                        weight: 45,
                        prevWeight: 42.5,
                        rir: '2',
                        history: [35, 40, 42.5, 45]
                    },
                    {
                        name: 'Strict Weighted Pull-ups / Inverted Rows',
                        target: 'Lats & Rhomboids',
                        sets: 3,
                        reps: 8,
                        weight: 10,
                        prevWeight: 7.5,
                        rir: '1',
                        history: [0, 5, 7.5, 10]
                    }
                ],
                status: 'pending'
            },
            {
                id: 'step_conditioning',
                stepNum: '04',
                title: 'HIGH-INTENSITY CONDITIONING',
                duration: '15 MIN',
                type: 'conditioning',
                icon: '⚡',
                mentor: 'Asta',
                desc: 'Explosive jump circuits & anaerobic work capacity testing.',
                xpReward: { bodyXp: 90, discXp: 50 },
                exercises: [
                    { name: 'Explosive Jump Squats', sets: 4, reps: '12 reps', target: 'Type-II Muscle Fibers' },
                    { name: 'Diamond Push-ups', sets: 4, reps: '12 reps', target: 'Triceps & Upper Chest' },
                    { name: 'Shadow Sprints / Fast Steps', sets: 4, reps: '45s max effort', target: 'VO2 Max' }
                ],
                status: 'pending'
            },
            {
                id: 'step_cooldown',
                stepNum: '05',
                title: 'RECOVERY COOL DOWN',
                duration: '5 MIN',
                type: 'cooldown',
                icon: '🍃',
                mentor: 'Giyu Tomioka',
                desc: 'Parasympathetic shift, static stretching, diaphragmatic breathing.',
                xpReward: { recXp: 40, bodyXp: 20 },
                exercises: [
                    { name: 'Pigeon Pose Stretch', sets: 2, reps: '45s/side', target: 'Glutes & Hip Capsule' },
                    { name: 'Couch Stretch', sets: 2, reps: '45s/side', target: 'Hip Flexors & Quads' }
                ],
                status: 'pending'
            },
            {
                id: 'step_meditation',
                stepNum: '06',
                title: 'DOMAIN: DEEP MEDITATION',
                duration: '10 MIN',
                type: 'meditation',
                icon: '🌌',
                mentor: 'Satoru Gojo',
                desc: 'Infinite Void cognitive calibration & alpha-wave brain state.',
                xpReward: { mindXp: 100, recXp: 50, gold: 100 },
                status: 'pending'
            },
            {
                id: 'step_boss_trial',
                stepNum: '07',
                title: 'SPECIAL GRADE BOSS TRIAL',
                duration: 'GATE',
                type: 'boss',
                icon: '👹',
                mentor: 'Sung Jin-Woo',
                desc: 'Dimensional Gate Raid against the Special Grade Boss.',
                xpReward: { mindXp: 250, gold: 200 },
                status: 'locked'
            }
        ];

        this.currentActiveStep = 'step_strength';
        this.activeSetSession = null;
        this.init();
    }

    init() {
        this.loadProgress();
    }

    loadProgress() {
        try {
            const raw = localStorage.getItem('HUNTER_JOURNEY_PROGRESS_V3');
            if (raw) {
                const saved = JSON.parse(raw);
                this.journeySteps.forEach(step => {
                    if (saved[step.id]) step.status = saved[step.id];
                });
            }
        } catch (e) {}
    }

    saveProgress() {
        try {
            const map = {};
            this.journeySteps.forEach(s => map[s.id] = s.status);
            localStorage.setItem('HUNTER_JOURNEY_PROGRESS_V3', JSON.stringify(map));
        } catch (e) {}
    }

    renderJourneyPath(containerId = 'journey-flow-path-container') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const html = this.journeySteps.map((step, idx) => {
            const isLast = idx === this.journeySteps.length - 1;
            const statusClass = step.status === 'completed' ? 'step-completed' : step.status === 'in_progress' ? 'step-active' : step.status === 'ready' ? 'step-ready' : 'step-locked';
            const statusTag = step.status === 'completed' ? '✓ CLEARED' : step.status === 'in_progress' ? '⚔ IN BATTLE' : step.status === 'ready' ? '▶ READY' : '🔒 LOCKED';

            return `
                <div class="journey-node-wrap">
                    <div class="journey-node-card ${statusClass}" data-step-id="${step.id}">
                        <div class="jnc-header">
                            <span class="jnc-num font-10">PHASE ${step.stepNum}</span>
                            <span class="jnc-duration font-10 highlight-cyan">${step.duration}</span>
                            <span class="jnc-status-pill font-10 ${step.status === 'completed' ? 'highlight-green' : 'text-muted'}">${statusTag}</span>
                        </div>
                        <div class="jnc-body mt-8">
                            <div class="jnc-icon">${step.icon}</div>
                            <div class="jnc-info">
                                <h4 class="jnc-title">${step.title}</h4>
                                <span class="jnc-mentor font-10 text-muted">GUIDE: ${step.mentor.toUpperCase()}</span>
                                <p class="jnc-desc font-11 mt-4">${step.desc}</p>
                            </div>
                        </div>
                        <div class="jnc-footer mt-10">
                            <button class="btn-primary-holo btn-sm btn-wide btn-launch-step" data-step-id="${step.id}">
                                ${step.status === 'completed' ? '🔄 RE-PLAY PHASE' : step.status === 'in_progress' ? '⚔ CONTINUE PHASE' : '▶ LAUNCH PHASE'}
                            </button>
                        </div>
                    </div>
                    ${!isLast ? '<div class="journey-connector-line"><span class="connector-glow"></span></div>' : ''}
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="journey-flow-wrapper">
                <div class="journey-flow-banner">
                    <div class="jfb-left">
                        <span class="jfb-tag highlight-violet">🧭 TODAY'S STRUCTURED HUNTER JOURNEY</span>
                        <h2 class="jfb-heading">ASCENSION PATHWAY — DAY 18</h2>
                        <p class="font-12 text-muted">Complete phases sequentially to maximize neuromuscular adaptation, mental flow & recovery.</p>
                    </div>
                    <div class="jfb-right">
                        <span class="jfb-progress-pill font-11">
                            ${this.journeySteps.filter(s => s.status === 'completed').length} / ${this.journeySteps.length} PHASES CLEARED
                        </span>
                    </div>
                </div>
                <div class="journey-timeline-track mt-20">
                    ${html}
                </div>
            </div>
        `;

        this.bindJourneyButtons(container);
    }

    bindJourneyButtons(container) {
        container.querySelectorAll('.btn-launch-step').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const stepId = btn.dataset.stepId;
                this.launchStep(stepId);
            });
        });
    }

    launchStep(stepId) {
        const step = this.journeySteps.find(s => s.id === stepId);
        if (!step) return;

        if (step.type === 'meditation') {
            if (window.domainMeditation) {
                window.domainMeditation.open(10);
            }
            return;
        }

        if (step.type === 'boss') {
            if (window.multiverseEngine) {
                window.multiverseEngine.startBossRaid('sukuna');
            }
            return;
        }

        // Open Interactive Set Execution Modal for Physical Phases
        this.openActiveSetModal(step);
    }

    openActiveSetModal(step) {
        let modal = document.getElementById('modal-active-training-session');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-active-training-session';
            modal.className = 'system-modal-backdrop hidden';
            document.body.appendChild(modal);
        }

        const primaryEx = step.exercises ? step.exercises[0] : { name: 'Compound Movement', sets: 3, reps: 10, weight: 60 };
        this.activeSetSession = {
            step,
            currentExIndex: 0,
            currentSet: 1,
            totalSets: primaryEx.sets || 3,
            targetReps: primaryEx.reps || 10,
            weightKg: primaryEx.weight || 60,
            prevWeightKg: primaryEx.prevWeight || (primaryEx.weight ? primaryEx.weight - 5 : 55),
            history: primaryEx.history || [50, 55, 60],
            isComplete: false
        };

        this.renderActiveSetModal();
        modal.classList.remove('hidden');
        if (window.systemAudio) window.systemAudio.playGateOpen();
    }

    renderActiveSetModal() {
        const modal = document.getElementById('modal-active-training-session');
        if (!modal || !this.activeSetSession) return;

        const sess = this.activeSetSession;
        const ex = sess.step.exercises[sess.currentExIndex];
        const isPb = sess.weightKg > sess.prevWeightKg;

        // Render live SVG strength progression graph
        const historyData = sess.history || [60, 65, 70, 75];
        const maxVal = Math.max(...historyData, sess.weightKg) + 10;
        const minVal = Math.max(0, Math.min(...historyData) - 10);
        const range = maxVal - minVal || 1;

        const svgPoints = historyData.map((val, idx) => {
            const x = 30 + idx * 70;
            const y = 130 - ((val - minVal) / range) * 90;
            return `${x},${y}`;
        }).join(' ');

        modal.innerHTML = `
            <div class="modal-hologram form-holo active-set-modal-box">
                <div class="window-header">
                    <div class="w-head-left">
                        <span class="font-11 highlight-violet">⚔️ ${sess.step.mentor.toUpperCase()} TRAINING CHAMBER</span>
                        <h3 class="window-title">${sess.step.title}</h3>
                    </div>
                    <button class="modal-close-x" id="btn-close-active-training">✕</button>
                </div>

                <!-- Mentor Dialogue Bubble -->
                <div class="set-mentor-speech-wrap mt-15">
                    <div class="sms-avatar font-28">⚔️</div>
                    <div class="sms-bubble">
                        <strong class="highlight-cyan">${sess.step.mentor}:</strong>
                        <span>“Last time you handled ${sess.prevWeightKg} kg. Today we're demanding ${sess.weightKg} kg on ${ex.name}. Lock in your breathing and dominate each rep!”</span>
                    </div>
                </div>

                <!-- Active Exercise Focus Card -->
                <div class="active-exercise-card mt-20">
                    <div class="aec-top">
                        <span class="aec-badge highlight-gold">EXERCISE ${sess.currentExIndex + 1} OF ${sess.step.exercises.length}</span>
                        <h2 class="aec-name">${ex.name}</h2>
                        <span class="aec-target text-muted font-12">${ex.target || 'Hypertrophy & Biomechanical Tension'}</span>
                    </div>

                    <div class="aec-stats-strip mt-15">
                        <div class="aec-stat-box">
                            <span class="aec-lbl">CURRENT LOAD</span>
                            <strong class="aec-val highlight-cyan">${sess.weightKg} KG</strong>
                        </div>
                        <div class="aec-stat-box">
                            <span class="aec-lbl">PREVIOUS LOAD</span>
                            <strong class="aec-val text-muted">${sess.prevWeightKg} KG</strong>
                        </div>
                        <div class="aec-stat-box">
                            <span class="aec-lbl">TARGET REPS</span>
                            <strong class="aec-val highlight-green">${sess.targetReps} REPS</strong>
                        </div>
                        <div class="aec-stat-box">
                            <span class="aec-lbl">SET NUMBER</span>
                            <strong class="aec-val highlight-purple">${sess.currentSet} / ${sess.totalSets}</strong>
                        </div>
                    </div>

                    <!-- Animated Strength Progress Line Graph -->
                    <div class="strength-live-graph-wrap mt-20">
                        <div class="slg-header">
                            <span class="font-11 text-muted">PROGRESSIVE OVERLOAD TRAJECTORY</span>
                            ${isPb ? '<span class="pb-badge font-10 highlight-gold">★ NEW PERSONAL BEST (+5.0 KG)</span>' : ''}
                        </div>
                        <svg class="slg-svg" viewBox="0 0 320 140">
                            <defs>
                                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stop-color="#38bdf8" />
                                    <stop offset="100%" stop-color="#8b5cf6" />
                                </linearGradient>
                            </defs>
                            <!-- Grid Lines -->
                            <line x1="20" y1="130" x2="300" y2="130" stroke="rgba(255,255,255,0.1)" />
                            <line x1="20" y1="85" x2="300" y2="85" stroke="rgba(255,255,255,0.05)" />
                            <line x1="20" y1="40" x2="300" y2="40" stroke="rgba(255,255,255,0.05)" />
                            
                            <!-- Animated Line Path -->
                            <polyline fill="none" stroke="url(#lineGrad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${svgPoints}" class="slg-polyline" />
                            
                            <!-- Data Dots -->
                            ${historyData.map((val, idx) => {
                                const x = 30 + idx * 70;
                                const y = 130 - ((val - minVal) / range) * 90;
                                return `<circle cx="${x}" cy="${y}" r="4" fill="#00f2fe" class="slg-dot" /><text x="${x}" y="${y - 8}" font-size="9" fill="#9ca3af" text-anchor="middle">${val}k</text>`;
                            }).join('')}
                        </svg>
                    </div>

                    <!-- Rep Progress Bar & Complete Action -->
                    <div class="active-set-action-bar mt-25">
                        <button id="btn-finish-active-set" class="btn-primary-holo btn-wide btn-lg">
                            ✓ COMPLETE SET ${sess.currentSet} (+${sess.targetReps} REPS @ ${sess.weightKg}KG)
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.bindActiveSetModalEvents();
    }

    bindActiveSetModalEvents() {
        const modal = document.getElementById('modal-active-training-session');
        if (!modal) return;

        const btnClose = modal.querySelector('#btn-close-active-training');
        if (btnClose) {
            btnClose.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }

        const btnFinishSet = modal.querySelector('#btn-finish-active-set');
        if (btnFinishSet) {
            btnFinishSet.addEventListener('click', () => {
                this.completeCurrentSet();
            });
        }
    }

    completeCurrentSet() {
        const sess = this.activeSetSession;
        if (!sess) return;

        if (window.systemAudio) window.systemAudio.playStatAdd();
        if (typeof confetti !== 'undefined') {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        }

        if (sess.currentSet < sess.totalSets) {
            sess.currentSet++;
            this.renderActiveSetModal();
            if (window.app) window.app.showToast('SET RECORDED', `Set ${sess.currentSet - 1} cleared! Prepare for Set ${sess.currentSet}.`);
        } else {
            // Exercise completed
            if (sess.currentExIndex < sess.step.exercises.length - 1) {
                sess.currentExIndex++;
                sess.currentSet = 1;
                this.renderActiveSetModal();
                if (window.app) window.app.showToast('EXERCISE CLEARED', `Moving to next exercise: ${sess.step.exercises[sess.currentExIndex].name}`);
            } else {
                // Entire Phase Cleared!
                sess.step.status = 'completed';
                this.saveProgress();
                const modal = document.getElementById('modal-active-training-session');
                if (modal) modal.classList.add('hidden');

                // Award verified XP
                const r = sess.step.xpReward || { bodyXp: 150, discXp: 50 };
                if (r.bodyXp) window.systemState.gainTrackXp('bodyXp', r.bodyXp, `Cleared ${sess.step.title}`);
                if (r.discXp) window.systemState.gainTrackXp('disciplineXp', r.discXp, `Discipline: ${sess.step.title}`);
                if (r.recXp) window.systemState.gainTrackXp('recoveryXp', r.recXp, `Recovery Protocol: ${sess.step.title}`);
                if (r.mindXp) window.systemState.gainTrackXp('mindXp', r.mindXp, `Mind Protocol: ${sess.step.title}`);

                if (window.systemAudio) window.systemAudio.playVictory();
                if (window.app) {
                    window.app.showToast('PHASE CONQUERED!', `🎉 ${sess.step.title} fully completed! Your Hunter stats have ascended.`);
                    window.app.syncUI();
                }
                this.renderJourneyPath();
            }
        }
    }
}

// Global Singleton
if (typeof window !== 'undefined') {
    window.journeyEngine = new JourneyEngine();
}
