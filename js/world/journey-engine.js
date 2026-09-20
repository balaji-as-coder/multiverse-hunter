/**
 * MULTIVERSE HUNTER — PERFORMANCE & ADAPTIVE PROGRESSION ENGINE (V3.5)
 * Multi-metric performance tracking (Load, Reps, Volume, Estimated 1RM),
 * True zero-fake-log baseline data pipeline, Over-performance surge UX,
 * Real-time dynamic Body XP telemetry from central state, and
 * Decision Engine Progressive Overload calculation with Recovery Gate validation.
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
                why: {
                    phaseNeed: 'JOINT LUBRICATION & NEUROMUSCULAR ACTIVATION',
                    previous: '5 MIN PROTOCOL',
                    current: 'DYNAMIC OPENERS',
                    adaptation: 'Synovial fluid secretion and kinetic chain alignment prior to heavy loading.'
                },
                mentorQuote: '“Expand your perception. If your joints can’t glide freely, your technique will falter.”',
                exercises: [
                    { id: 'ex_stretch', name: 'World Greatest Stretch', sets: 2, reps: 5, weight: 0, target: 'Full Body Mobility' },
                    { id: 'ex_t_spine', name: 'Thoracic Spine Rotations', sets: 2, reps: 10, weight: 0, target: 'Upper Spine Mobility' }
                ],
                status: 'completed'
            },
            {
                id: 'step_warmup',
                stepNum: '02',
                title: 'DYNAMIC CORE WARM-UP',
                duration: '8 MIN',
                type: 'warmup',
                icon: '🔥',
                mentor: 'Rock Lee',
                desc: 'Core temperature rise, glute activation, hollow body prep.',
                xpReward: { bodyXp: 45, discXp: 25 },
                why: {
                    phaseNeed: 'CORE TEMPERATURE RISE & MOTOR UNIT RECRUITMENT',
                    previous: '30s HOLLOW HOLD',
                    current: '45s HOLLOW HOLD',
                    adaptation: 'High-threshold motor unit activation for spinal rigidity.'
                },
                mentorQuote: '“A burning spirit requires a burning core! Let us build an unbreakable foundation!”',
                exercises: [
                    { id: 'ex_hollow', name: 'Hollow Body Isometric Hold', sets: 3, reps: 30, weight: 0, target: 'Core Anterior Chain' },
                    { id: 'ex_band_walk', name: 'Banded Lateral Hip Walks', sets: 3, reps: 15, weight: 0, target: 'Glutes & Hip Abductors' }
                ],
                status: 'completed'
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
                why: {
                    phaseNeed: 'LOWER-BODY HYPERTROPHY & TENSION OVERLOAD',
                    previous: '75.0 KG (4x8)',
                    current: '80.0 KG (4x10)',
                    adaptation: 'Type-II muscle fiber hypertrophy and central nervous system force production.'
                },
                mentorQuote: '“Enough explanation. Show me what you’ve got.”',
                exercises: [
                    {
                        id: 'ex_barbell_squat',
                        name: 'Barbell Back Squat',
                        target: 'Quads & Glutes',
                        sets: 4,
                        reps: 10,
                        weight: 80,
                        prevWeight: 75,
                        rir: '1-2'
                    },
                    {
                        id: 'ex_overhead_press',
                        name: 'Overhead Barbell Military Press',
                        target: 'Delts & Core Stability',
                        sets: 3,
                        reps: 8,
                        weight: 45,
                        prevWeight: 42.5,
                        rir: '2'
                    },
                    {
                        id: 'ex_weighted_pullup',
                        name: 'Strict Weighted Pull-ups',
                        target: 'Lats & Rhomboids',
                        sets: 3,
                        reps: 8,
                        weight: 10,
                        prevWeight: 7.5,
                        rir: '1'
                    }
                ],
                status: 'in_progress'
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
                why: {
                    phaseNeed: 'ANAEROBIC GLYCOLYTIC WORK CAPACITY',
                    previous: '3 ROUNDS',
                    current: '4 ROUNDS',
                    adaptation: 'Lactate clearance acceleration and mitochondrial density improvement.'
                },
                mentorQuote: '“Not giving up is my magic! Push your heart rate to the absolute limit!”',
                exercises: [
                    { id: 'ex_jump_squat', name: 'Explosive Jump Squats', sets: 4, reps: 12, weight: 0, target: 'Type-II Muscle Fibers' },
                    { id: 'ex_diamond_pushup', name: 'Diamond Push-ups', sets: 4, reps: 12, weight: 0, target: 'Triceps & Upper Chest' }
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
                why: {
                    phaseNeed: 'PARASYMPATHETIC NERVOUS SYSTEM RECOVERY',
                    previous: 'STANDARD STRETCH',
                    current: 'DOWN-REGULATION PROTOCOL',
                    adaptation: 'Cortisol reduction and heart rate variability restoration.'
                },
                mentorQuote: '“Calm like the surface of still water. Allow your heartbeat to settle.”',
                exercises: [
                    { id: 'ex_pigeon', name: 'Deep Pigeon Pose', sets: 2, reps: 45, weight: 0, target: 'Glutes & Hip Rotators' },
                    { id: 'ex_couch_stretch', name: 'Couch Hip Flexor Stretch', sets: 2, reps: 45, weight: 0, target: 'Psoas & Quads' }
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
                mentor: 'Gojo Satoru',
                desc: 'Focus & Diaphragmatic Breathing Session (4s-4s-4s-2s Box Protocol).',
                xpReward: { mindXp: 100, recXp: 50, gold: 100 },
                why: {
                    phaseNeed: 'COGNITIVE FOCUS & BREATHING CALIBRATION',
                    previous: '5 MINUTE FOCUS',
                    current: '10 MINUTE VOID PROTOCOL',
                    adaptation: 'Autonomic nervous system balance and prefrontal attentional restoration.'
                },
                mentorQuote: '“Step inside the Void. Regulate each breath and quiet external noise.”',
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
                desc: 'Dimensional Gate Raid against the Special Grade Sovereign.',
                xpReward: { mindXp: 250, gold: 200 },
                why: {
                    phaseNeed: 'HUNTER RANK PROMOTION EXAM',
                    previous: 'C-RANK GATE',
                    current: 'B-RANK GATE',
                    adaptation: 'Full-system mental and physical stress endurance.'
                },
                mentorQuote: '“Arise. Prove to the System that you belong in the next tier.”',
                status: 'locked'
            }
        ];

        this.currentActiveStep = 'step_strength';
        this.activeSetSession = null;
        this.graphMode = 'load';
        this.init();
    }

    init() {
        this.loadProgress();
    }

    loadProgress() {
        try {
            const raw = localStorage.getItem('HUNTER_JOURNEY_PROGRESS_V3_5');
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
            localStorage.setItem('HUNTER_JOURNEY_PROGRESS_V3_5', JSON.stringify(map));
        } catch (e) {}
    }

    calculateEst1RM(weightKg, reps) {
        if (reps <= 0) return 0;
        if (reps === 1) return weightKg;
        return Math.round(weightKg * (1 + reps / 30) * 10) / 10;
    }

    getExercisePerformanceRecords(exerciseId, defaultSeedWeight = 65) {
        try {
            const key = `HUNTER_EX_PERF_${exerciseId}`;
            const raw = localStorage.getItem(key);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {}

        // Single seed baseline entry for unrecorded exercise
        return [
            {
                weightKg: defaultSeedWeight,
                reps: 8,
                volume: defaultSeedWeight * 8,
                est1RM: this.calculateEst1RM(defaultSeedWeight, 8),
                timestamp: Date.now() - 86400000 * 7,
                tag: 'SEED BASELINE'
            }
        ];
    }

    logExerciseSet(exerciseId, exerciseName, weightKg, reps, setNum) {
        try {
            const key = `HUNTER_EX_PERF_${exerciseId}`;
            let history = this.getExercisePerformanceRecords(exerciseId, weightKg ? weightKg - 15 : 65);

            const est1RM = this.calculateEst1RM(weightKg, reps);
            const volume = weightKg * reps;

            const prevMaxLoad = Math.max(...history.map(h => h.weightKg || 0), 0);
            const prevMax1RM = Math.max(...history.map(h => h.est1RM || 0), 0);
            const prevMaxVolume = Math.max(...history.map(h => h.volume || 0), 0);

            const isLoadPr = weightKg > prevMaxLoad;
            const is1RmPr = est1RM > prevMax1RM;
            const isVolumePr = volume > prevMaxVolume;

            const newEntry = {
                exerciseId,
                exerciseName,
                weightKg,
                reps,
                setNum,
                volume,
                est1RM,
                isLoadPr,
                is1RmPr,
                isVolumePr,
                timestamp: Date.now(),
                tag: 'VERIFIED USER LOG'
            };

            history.push(newEntry);
            localStorage.setItem(key, JSON.stringify(history));

            if (window.systemState) {
                if (!window.systemState.data.workoutHistory) {
                    window.systemState.data.workoutHistory = [];
                }
                window.systemState.data.workoutHistory.push(newEntry);
                
                if (exerciseId === 'ex_barbell_squat' && window.systemState.data.performanceMetrics.gymLifts) {
                    window.systemState.data.performanceMetrics.gymLifts.barbellSquatKg = Math.max(window.systemState.data.performanceMetrics.gymLifts.barbellSquatKg, weightKg);
                }
                window.systemState.save();
            }

            return { isLoadPr, is1RmPr, isVolumePr, est1RM, volume };
        } catch (e) {
            return { isLoadPr: false, is1RmPr: false, isVolumePr: false, est1RM: weightKg, volume: weightKg * reps };
        }
    }

    renderJourneyPath(containerId = 'journey-flow-path-container') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const currentActiveIdx = this.journeySteps.findIndex(s => s.status === 'in_progress' || s.status === 'ready');
        const activeStepObj = currentActiveIdx >= 0 ? this.journeySteps[currentActiveIdx] : this.journeySteps[2];

        // Horizontal Spatial Map
        const spatialMapHtml = `
            <div class="dungeon-spatial-strip">
                <div class="dss-header">
                    <span class="font-10 highlight-cyan">🗺️ DUNGEON SPATIAL PROGRESSION</span>
                    <span class="font-10 text-muted">DEPTH: SHADOW REALM LV. 24</span>
                </div>
                <div class="dss-path-nodes">
                    ${this.journeySteps.map((step, idx) => {
                        const isDone = step.status === 'completed';
                        const isCurrent = step.id === activeStepObj.id;
                        return `
                            <div class="dss-node ${isDone ? 'dss-done' : ''} ${isCurrent ? 'dss-current' : ''}">
                                <div class="dss-icon-wrap">
                                    ${isDone ? '✓' : step.icon}
                                </div>
                                <span class="dss-label">${step.title.split(' ')[0]}</span>
                                ${isCurrent ? '<div class="dss-indicator-tag">YOU ARE HERE</div>' : ''}
                            </div>
                            ${idx < this.journeySteps.length - 1 ? `<div class="dss-connector ${isDone ? 'dss-con-done' : ''}"></div>` : ''}
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        // Vertical Cards
        const nodesHtml = this.journeySteps.map((step, idx) => {
            const isLast = idx === this.journeySteps.length - 1;
            const isCurrent = step.id === activeStepObj.id;
            const statusClass = step.status === 'completed' ? 'step-completed' : (isCurrent || step.status === 'in_progress') ? 'step-active' : step.status === 'ready' ? 'step-ready' : 'step-locked';
            const statusTag = step.status === 'completed' ? '✓ CLEARED' : (isCurrent || step.status === 'in_progress') ? '⚔ YOU ARE HERE (ACTIVE)' : step.status === 'ready' ? '▶ READY' : '🔒 LOCKED';

            return `
                <div class="journey-node-wrap ${isCurrent ? 'jnw-current-highlight' : ''}">
                    <div class="journey-node-card ${statusClass}" data-step-id="${step.id}">
                        <div class="jnc-header">
                            <div class="jnc-h-left">
                                <span class="jnc-num font-10">PHASE ${step.stepNum}</span>
                                <span class="jnc-duration font-10 highlight-cyan">${step.duration}</span>
                            </div>
                            <span class="jnc-status-pill font-10 ${step.status === 'completed' ? 'highlight-green' : isCurrent ? 'highlight-gold pulse-fast' : 'text-muted'}">${statusTag}</span>
                        </div>
                        <div class="jnc-body mt-10">
                            <div class="jnc-icon">${step.icon}</div>
                            <div class="jnc-info">
                                <h4 class="jnc-title">${step.title}</h4>
                                <span class="jnc-mentor font-10 text-muted">MENTOR: <strong class="highlight-violet">${step.mentor.toUpperCase()}</strong></span>
                                <p class="jnc-desc font-11 mt-4">${step.desc}</p>
                            </div>
                        </div>
                        <div class="jnc-footer mt-12">
                            <button class="btn-primary-holo btn-sm btn-wide btn-launch-step ${isCurrent ? 'btn-glow-violet' : ''}" data-step-id="${step.id}">
                                ${step.status === 'completed' ? '🔄 RE-PLAY PHASE' : isCurrent ? '⚔ ENTER BATTLE CHAMBER' : '▶ LAUNCH PHASE'}
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
                        <span class="jfb-tag highlight-violet">🧭 STEP-BY-STEP ANIME TRAINING PATHWAY</span>
                        <h2 class="jfb-heading">ASCENSION DUNGEON — DAY 18</h2>
                        <p class="font-12 text-muted">Advance step-by-step through mobility, strength overload, conditioning, meditation and the boss gate.</p>
                    </div>
                    <div class="jfb-right">
                        <span class="jfb-progress-pill font-11">
                            ${this.journeySteps.filter(s => s.status === 'completed').length} / ${this.journeySteps.length} PHASES CLEARED
                        </span>
                    </div>
                </div>

                ${spatialMapHtml}

                <div class="journey-timeline-track mt-20">
                    ${nodesHtml}
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

        const primaryEx = step.exercises ? step.exercises[0] : { id: 'ex_1', name: 'Compound Movement', sets: 4, reps: 10, weight: 80, prevWeight: 75 };
        const records = this.getExercisePerformanceRecords(primaryEx.id, 65);

        // Resolve persistent adaptive targets from System State if previously calculated
        const sData = window.systemState ? window.systemState.data : null;
        const savedTarget = (sData && sData.adaptiveExerciseTargets) ? sData.adaptiveExerciseTargets[primaryEx.id] : null;

        const resolvedWeight = (savedTarget && typeof savedTarget.weightKg === 'number') ? savedTarget.weightKg : (primaryEx.weight || 80);
        const resolvedReps = (savedTarget && typeof savedTarget.reps === 'number') ? savedTarget.reps : (primaryEx.reps || 10);
        const prevWeight = (savedTarget && typeof primaryEx.weight === 'number') ? primaryEx.weight : (primaryEx.prevWeight || (resolvedWeight > 0 ? resolvedWeight - 2.5 : 0));

        this.activeSetSession = {
            step,
            currentExIndex: 0,
            currentSet: 1,
            totalSets: primaryEx.sets || 4,
            targetReps: resolvedReps,
            completedReps: 0,
            weightKg: resolvedWeight,
            prevWeightKg: prevWeight,
            records: records,
            selectedRir: 2,
            selectedForm: 'CLEAN',
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
        const why = sess.step.why || {
            phaseNeed: 'LOWER-BODY STRENGTH & HYPERTROPHY',
            previous: `${sess.prevWeightKg} KG`,
            current: `${sess.weightKg} KG`,
            adaptation: 'High mechanical tension and progressive motor unit recruitment.'
        };

        const targetR = Math.max(1, typeof sess.targetReps === 'number' ? sess.targetReps : 10);
        const currentEst1RM = this.calculateEst1RM(sess.weightKg, sess.completedReps > 0 ? sess.completedReps : targetR);
        const currentVolume = sess.weightKg * (sess.completedReps > 0 ? sess.completedReps : targetR);

        // Real Live Body XP from SystemState
        const sData = window.systemState ? window.systemState.data : null;
        const bodyTrack = (sData && sData.xpTracks && sData.xpTracks.bodyXp) ? sData.xpTracks.bodyXp : { current: 150, next: 300, level: 1 };
        const bodyPct = Math.min(100, Math.round((bodyTrack.current / Math.max(1, bodyTrack.next)) * 100));
        const xpRewardVal = sess.step.xpReward ? (sess.step.xpReward.bodyXp || 180) : 180;

        // Performance Graph Data Points (Load vs 1RM vs Volume)
        const records = sess.records || [];
        let plotValues = [];
        let unitLabel = 'kg';

        if (this.graphMode === '1rm') {
            plotValues = records.map(r => r.est1RM || r.weightKg || 65);
            unitLabel = '1RM kg';
        } else if (this.graphMode === 'volume') {
            plotValues = records.map(r => r.volume || (r.weightKg * (r.reps || 8)) || 500);
            unitLabel = 'kg vol';
        } else {
            plotValues = records.map(r => r.weightKg || 65);
            unitLabel = 'kg';
        }

        const maxVal = Math.max(...plotValues, sess.weightKg) * 1.1;
        const minVal = Math.max(0, Math.min(...plotValues) * 0.9);
        const range = maxVal - minVal || 1;

        const svgPoints = plotValues.map((val, idx) => {
            const x = 30 + idx * Math.min(65, 240 / Math.max(1, plotValues.length - 1));
            const y = 120 - ((val - minVal) / range) * 80;
            return `${x},${y}`;
        }).join(' ');

        // Over-Performance Surge calculations
        const isOverPerforming = sess.completedReps > targetR;
        const extraReps = isOverPerforming ? sess.completedReps - targetR : 0;

        // Set checklist pills
        const setChecklistHtml = Array.from({ length: sess.totalSets }).map((_, i) => {
            const setNum = i + 1;
            let statusBadge = '';
            let statusClass = '';
            if (setNum < sess.currentSet) {
                statusBadge = '✓ CLEARED';
                statusClass = 'set-item-cleared';
            } else if (setNum === sess.currentSet) {
                statusBadge = '● ACTIVE NOW';
                statusClass = 'set-item-active pulse-fast';
            } else {
                statusBadge = '○ PENDING';
                statusClass = 'set-item-pending';
            }
            return `
                <div class="set-check-badge ${statusClass}">
                    <span class="scb-num">SET ${setNum}</span>
                    <span class="scb-stat">${statusBadge}</span>
                </div>
            `;
        }).join('');

        // Interactive Rep-by-Rep Indicator Strip
        const repPillsHtml = Array.from({ length: targetR }).map((_, rIdx) => {
            const repNum = rIdx + 1;
            const isFilled = repNum <= sess.completedReps;
            return `
                <button class="btn-rep-dot ${isFilled ? 'rep-dot-filled' : 'rep-dot-empty'}" data-rep-num="${repNum}" title="Tap to set rep count to ${repNum}">
                    <span class="font-9">${repNum.toString().padStart(2, '0')}</span>
                    <span class="rd-symbol">${isFilled ? '●' : '○'}</span>
                </button>
            `;
        }).join('');

        modal.innerHTML = `
            <div class="modal-hologram form-holo active-set-modal-box">
                <div class="window-header">
                    <div class="w-head-left">
                        <span class="font-11 highlight-violet">⚔️ ${sess.step.mentor.toUpperCase()} TRAINING ARENA</span>
                        <h3 class="window-title">${sess.step.title}</h3>
                    </div>
                    <button class="modal-close-x" id="btn-close-active-training">✕</button>
                </div>

                <!-- 1. "WHY THIS EXERCISE?" Phase Intelligence Briefing -->
                <div class="why-exercise-intelligence-card mt-15">
                    <div class="weic-top">
                        <span class="weic-pill highlight-cyan">🧠 PHASE INTELLIGENCE BRIEFING</span>
                        <span class="font-10 text-muted">[SYSTEM ADAPTIVE TARGET]</span>
                    </div>
                    <div class="weic-grid mt-10">
                        <div class="weic-item">
                            <span class="font-9 text-muted">CURRENT PHASE DEMAND</span>
                            <strong class="font-11 highlight-gold">${why.phaseNeed}</strong>
                        </div>
                        <div class="weic-item">
                            <span class="font-9 text-muted">PREVIOUS RECORD</span>
                            <strong class="font-11 text-muted">${why.previous}</strong>
                        </div>
                        <div class="weic-item">
                            <span class="font-9 text-muted">TODAY'S ADAPTIVE TARGET</span>
                            <strong class="font-11 highlight-green">${sess.weightKg} KG × ${targetR} REPS</strong>
                        </div>
                    </div>
                    <p class="font-11 text-secondary mt-8"><strong>Biomechanical Goal:</strong> ${why.adaptation}</p>
                </div>

                <!-- Mentor Dialogue Bubble -->
                <div class="set-mentor-speech-wrap mt-15">
                    <div class="sms-avatar font-32">⚔️</div>
                    <div class="sms-bubble">
                        <strong class="highlight-cyan">${sess.step.mentor}:</strong>
                        <span>${isOverPerforming ? '“Over-performance detected! Channel that surge into complete control!”' : sess.step.mentorQuote || '“Enough explanation. Show me.”'}</span>
                    </div>
                </div>

                <!-- Active Exercise Arena -->
                <div class="active-exercise-card mt-20">
                    <div class="aec-top">
                        <span class="aec-badge highlight-gold">EXERCISE ${sess.currentExIndex + 1} OF ${sess.step.exercises.length}</span>
                        <h2 class="aec-name">${ex.name}</h2>
                        <span class="aec-target text-muted font-12">${ex.target || 'Hypertrophy & Biomechanical Tension'}</span>
                    </div>

                    <!-- Performance Intelligence Metrics Strip -->
                    <div class="perf-metrics-strip mt-15">
                        <div class="pms-item">
                            <span class="pms-lbl">LOAD LOADED</span>
                            <strong class="pms-val highlight-cyan">${sess.weightKg} KG</strong>
                        </div>
                        <div class="pms-item">
                            <span class="pms-lbl">ESTIMATED 1RM</span>
                            <strong class="pms-val highlight-gold">${currentEst1RM} KG</strong>
                        </div>
                        <div class="pms-item">
                            <span class="pms-lbl">SET VOLUME</span>
                            <strong class="pms-val highlight-purple">${currentVolume} KG</strong>
                        </div>
                        <div class="pms-item">
                            <span class="pms-lbl">SET TARGET</span>
                            <strong class="pms-val highlight-green">${sess.currentSet} / ${sess.totalSets}</strong>
                        </div>
                    </div>

                    <!-- Live Load & Rep Adjustment Strip -->
                    <div class="live-tuning-strip mt-15">
                        <div class="tuning-col">
                            <span class="font-9 text-muted">LOAD ADJUSTER (KG)</span>
                            <div class="tuning-ctrls mt-4">
                                <button id="btn-weight-minus" class="btn-tune-sm">- 2.5</button>
                                <strong class="font-16 highlight-cyan" id="disp-weight-val">${sess.weightKg} KG</strong>
                                <button id="btn-weight-plus" class="btn-tune-sm">+ 2.5</button>
                            </div>
                        </div>
                        <div class="tuning-col">
                            <span class="font-9 text-muted">REPS LOGGED (${sess.completedReps} / ${targetR}${isOverPerforming ? ` +${extraReps} EXTRA` : ''})</span>
                            <div class="tuning-ctrls mt-4">
                                <button id="btn-rep-minus" class="btn-tune-sm">- 1 REP</button>
                                <button id="btn-rep-plus" class="btn-tune-sm highlight-green">+ 1 REP</button>
                            </div>
                        </div>
                    </div>

                    <!-- REAL INTERACTIVE REP TRACKER WITH OVER-PERFORMANCE SURGE -->
                    <div class="interactive-rep-tracker-box mt-15">
                        <div class="irt-header font-10" style="display:flex; justify-content:space-between; align-items:center;">
                            <span class="text-muted">INTERACTIVE REP-BY-REP COUNTER</span>
                            ${isOverPerforming ? `<span class="badge-surge highlight-green font-10">⚡ OVER-PERFORMANCE SURGE: +${extraReps} EXTRA REPS</span>` : `<strong class="highlight-gold">${sess.completedReps} / ${targetR} REPS</strong>`}
                        </div>
                        <div class="rep-dots-strip mt-8">
                            ${repPillsHtml}
                            ${isOverPerforming ? `<div class="extra-reps-pill highlight-green">+${extraReps} REPS</div>` : ''}
                        </div>
                    </div>

                    <!-- 3 SIMULTANEOUS VISUALIZATIONS -->
                    <div class="three-viz-grid mt-20">
                        <!-- Visualization A: Multi-Metric Performance Intelligence Graph -->
                        <div class="viz-card viz-performance">
                            <div class="viz-header">
                                <div class="viz-mode-toggles">
                                    <button class="btn-viz-tab ${this.graphMode === 'load' ? 'active' : ''}" data-mode="load">LOAD</button>
                                    <button class="btn-viz-tab ${this.graphMode === '1rm' ? 'active' : ''}" data-mode="1rm">EST 1RM</button>
                                    <button class="btn-viz-tab ${this.graphMode === 'volume' ? 'active' : ''}" data-mode="volume">VOLUME</button>
                                </div>
                                <span class="font-9 text-muted">[VERIFIED HISTORY]</span>
                            </div>
                            <svg class="slg-svg" viewBox="0 0 300 130">
                                <defs>
                                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stop-color="#38bdf8" />
                                        <stop offset="100%" stop-color="#8b5cf6" />
                                    </linearGradient>
                                </defs>
                                <line x1="20" y1="120" x2="280" y2="120" stroke="rgba(255,255,255,0.1)" />
                                <line x1="20" y1="75" x2="280" y2="75" stroke="rgba(255,255,255,0.05)" />
                                <polyline fill="none" stroke="url(#lineGrad)" stroke-width="3" stroke-linecap="round" points="${svgPoints}" class="slg-polyline" />
                                ${plotValues.map((val, idx) => {
                                    const x = 30 + idx * Math.min(65, 240 / Math.max(1, plotValues.length - 1));
                                    const y = 120 - ((val - minVal) / range) * 80;
                                    return `<circle cx="${x}" cy="${y}" r="4" fill="#00f2fe" class="slg-dot" /><text x="${x}" y="${y - 8}" font-size="9" fill="#9ca3af" text-anchor="middle">${val}</text>`;
                                })}
                            </svg>
                            <div class="viz-graph-labels font-9 text-muted" style="display:flex; justify-content:space-around; margin-top:2px;">
                                ${records.map((r, i) => `<span>${r.tag === 'SEED BASELINE' ? 'BASELINE' : `SET ${i}`}</span>`).join('')}
                            </div>
                        </div>

                        <!-- Visualization B: Real Dynamic Body XP from State -->
                        <div class="viz-card viz-xp">
                            <div class="viz-header">
                                <span class="font-10 text-muted">B. BODY XP PROGRESSION</span>
                                <span class="font-10 highlight-cyan">${bodyPct}% (LV. ${bodyTrack.level})</span>
                            </div>
                            <div class="viz-xp-display mt-8">
                                <div class="viz-xp-bar-shell">
                                    <div class="viz-xp-bar-fill" style="width: ${bodyPct}%;"></div>
                                </div>
                                <div class="viz-xp-labels font-10 mt-6" style="display:flex; justify-content:space-between;">
                                    <span class="text-muted">Current: ${bodyTrack.current} / ${bodyTrack.next} XP</span>
                                    <span class="highlight-gold">+${xpRewardVal} XP on Clear</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Visualization C: Current Session Set Checklist -->
                    <div class="viz-card viz-session-sets mt-15">
                        <div class="viz-header">
                            <span class="font-10 text-muted">C. CURRENT SESSION SETS</span>
                            <span class="font-10 highlight-purple">${sess.weightKg} KG × ${sess.completedReps > 0 ? sess.completedReps : targetR} REPS</span>
                        </div>
                        <div class="session-set-pills-row mt-8">
                            ${setChecklistHtml}
                        </div>
                    </div>

                    <!-- V3.6 POST-SET RIR & FORM QUALITY CALIBRATION PANEL -->
                    <div class="post-set-calibration-card mt-15 p-12">
                        <div class="psc-top" style="display:flex; justify-content:space-between; align-items:center;">
                            <span class="highlight-gold font-11">🎯 POST-SET EFFORT & FORM CALIBRATION</span>
                            <span class="font-9 text-muted uppercase">[TRUTH ENGINE VERIFICATION]</span>
                        </div>

                        <div class="psc-field mt-10">
                            <div class="font-10 text-muted" style="display:flex; justify-content:space-between;">
                                <span>REPS IN RESERVE (RIR / PROXIMITY TO FAILURE):</span>
                                <strong class="highlight-cyan font-10">${sess.selectedRir === 0 ? '0 (Max Effort / Failure)' : sess.selectedRir === 2 ? '2 (Target Sweet Spot)' : `${sess.selectedRir} Reps Left`}</strong>
                            </div>
                            <div class="rir-pill-selector mt-6">
                                <button type="button" class="btn-rir-pill ${sess.selectedRir === 0 ? 'active rir-0' : ''}" data-rir="0">0 (Max)</button>
                                <button type="button" class="btn-rir-pill ${sess.selectedRir === 1 ? 'active rir-1' : ''}" data-rir="1">1</button>
                                <button type="button" class="btn-rir-pill ${sess.selectedRir === 2 ? 'active rir-2' : ''}" data-rir="2">2 (Target)</button>
                                <button type="button" class="btn-rir-pill ${sess.selectedRir === 3 ? 'active' : ''}" data-rir="3">3</button>
                                <button type="button" class="btn-rir-pill ${sess.selectedRir === 4 ? 'active' : ''}" data-rir="4">4</button>
                                <button type="button" class="btn-rir-pill ${sess.selectedRir >= 5 ? 'active' : ''}" data-rir="5">5+ (Easy)</button>
                            </div>
                        </div>

                        <div class="psc-field mt-12">
                            <div class="font-10 text-muted" style="display:flex; justify-content:space-between;">
                                <span>FORM QUALITY:</span>
                                <strong class="highlight-gold font-10">${sess.selectedForm === 'CLEAN' ? '✨ Strict Form' : sess.selectedForm === 'ACCEPTABLE' ? '⚖️ Acceptable' : '⚠️ Compromised (Blocks Overload)'}</strong>
                            </div>
                            <div class="form-pill-selector mt-6">
                                <button type="button" class="btn-form-pill ${sess.selectedForm === 'CLEAN' ? 'active form-clean' : ''}" data-form="CLEAN">✨ Clean</button>
                                <button type="button" class="btn-form-pill ${sess.selectedForm === 'ACCEPTABLE' ? 'active form-acc' : ''}" data-form="ACCEPTABLE">⚖️ Acceptable</button>
                                <button type="button" class="btn-form-pill ${sess.selectedForm === 'COMPROMISED' ? 'active form-comp' : ''}" data-form="COMPROMISED">⚠️ Compromised</button>
                            </div>
                        </div>
                    </div>

                    <!-- Log & Complete Set Action -->
                    <div class="active-set-action-bar mt-20">
                        <button id="btn-finish-active-set" class="btn-primary-holo btn-wide btn-lg btn-glow-violet">
                            ⚔ CONFIRM & LOG SET ${sess.currentSet} (${sess.completedReps > 0 ? sess.completedReps : targetR} REPS @ ${sess.weightKg} KG | RIR: ${sess.selectedRir})
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.bindActiveSetModalEvents();
    }

    bindActiveSetModalEvents() {
        const modal = document.getElementById('modal-active-training-session');
        if (!modal || !this.activeSetSession) return;

        const sess = this.activeSetSession;
        const targetR = Math.max(1, typeof sess.targetReps === 'number' ? sess.targetReps : 10);

        // Close
        const btnClose = modal.querySelector('#btn-close-active-training');
        if (btnClose) {
            btnClose.addEventListener('click', () => modal.classList.add('hidden'));
        }

        // Graph Mode Toggles (Load / 1RM / Volume)
        modal.querySelectorAll('.btn-viz-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.graphMode = e.target.dataset.mode;
                this.renderActiveSetModal();
            });
        });

        // Weight adjustments
        const btnWeightMinus = modal.querySelector('#btn-weight-minus');
        if (btnWeightMinus) {
            btnWeightMinus.addEventListener('click', () => {
                sess.weightKg = Math.max(0, sess.weightKg - 2.5);
                this.renderActiveSetModal();
            });
        }
        const btnWeightPlus = modal.querySelector('#btn-weight-plus');
        if (btnWeightPlus) {
            btnWeightPlus.addEventListener('click', () => {
                sess.weightKg = sess.weightKg + 2.5;
                this.renderActiveSetModal();
            });
        }

        // Rep adjustments (+1 / -1 with Over-Performance support)
        const btnRepMinus = modal.querySelector('#btn-rep-minus');
        if (btnRepMinus) {
            btnRepMinus.addEventListener('click', () => {
                sess.completedReps = Math.max(0, sess.completedReps - 1);
                this.renderActiveSetModal();
            });
        }
        const btnRepPlus = modal.querySelector('#btn-rep-plus');
        if (btnRepPlus) {
            btnRepPlus.addEventListener('click', () => {
                sess.completedReps = sess.completedReps + 1;
                if (window.systemAudio) window.systemAudio.playClick();
                this.renderActiveSetModal();
            });
        }

        // Direct tap on individual rep dots
        modal.querySelectorAll('.btn-rep-dot').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const repNum = parseInt(btn.dataset.repNum, 10);
                if (!isNaN(repNum)) {
                    sess.completedReps = repNum;
                    if (window.systemAudio) window.systemAudio.playClick();
                    this.renderActiveSetModal();
                }
            });
        });

        // RIR Pill Selection
        modal.querySelectorAll('.btn-rir-pill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const rirVal = parseInt(btn.dataset.rir, 10);
                if (!isNaN(rirVal)) {
                    sess.selectedRir = rirVal;
                    if (window.systemAudio) window.systemAudio.playClick();
                    this.renderActiveSetModal();
                }
            });
        });

        // Form Pill Selection
        modal.querySelectorAll('.btn-form-pill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const formVal = btn.dataset.form;
                if (formVal) {
                    sess.selectedForm = formVal;
                    if (window.systemAudio) window.systemAudio.playClick();
                    this.renderActiveSetModal();
                }
            });
        });

        // Finish set
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

        const ex = sess.step.exercises[sess.currentExIndex];
        const targetR = Math.max(1, typeof sess.targetReps === 'number' ? sess.targetReps : 10);
        const finalReps = sess.completedReps > 0 ? sess.completedReps : targetR;
        const userRir = typeof sess.selectedRir === 'number' ? sess.selectedRir : 2;
        const userForm = sess.selectedForm || 'CLEAN';

        // 1. Log real verified entry into persistent workout database and compute PRs
        const result = this.logExerciseSet(ex.id || 'ex_compound', ex.name, sess.weightKg, finalReps, sess.currentSet);

        // 2. Update active in-memory records array for graph visualization
        sess.records = this.getExercisePerformanceRecords(ex.id || 'ex_compound', 65);

        // 3. Central Decision Engine V3.6 Closed-Loop Adaptive Progression Calculation
        let decisionProgression = null;
        if (window.decisionEngine && window.decisionEngine.calculateExerciseProgression) {
            decisionProgression = window.decisionEngine.calculateExerciseProgression(
                ex.id || 'ex_compound',
                sess.weightKg,
                targetR,
                finalReps,
                userRir,
                userForm,
                ex.name
            );
        }

        if (window.systemAudio) window.systemAudio.playStatAdd();
        if (typeof confetti !== 'undefined') {
            confetti({ particleCount: result.isLoadPr ? 80 : 40, spread: 60, origin: { y: 0.6 } });
        }

        // 4. Trigger mentor relationship growth & reaction loop
        if (window.worldEngine) {
            window.worldEngine.recordMentorTraining(sess.step.mentor, 1);
        }

        // 5. Toast Feedback with genuine Progression decision
        let toastTitle = 'SET LOGGED & VERIFIED!';
        let nextTargetStr = decisionProgression ? ` Next Target: ${decisionProgression.nextWeightKg} kg × ${decisionProgression.nextTargetReps} reps.` : '';
        let toastMsg = `Logged ${sess.weightKg} kg × ${finalReps} reps (RIR: ${userRir}, Form: ${userForm}).${nextTargetStr}`;
        if (result.isLoadPr) {
            toastTitle = '★ NEW LOAD PERSONAL BEST! ★';
            toastMsg = `🔥 Surpassed previous load record with ${sess.weightKg} KG!${nextTargetStr}`;
        }

        if (sess.currentSet < sess.totalSets) {
            sess.currentSet++;
            sess.completedReps = 0; // Reset for next set
            this.renderActiveSetModal();
            if (window.app) window.app.showToast(toastTitle, toastMsg);
        } else {
            // Exercise completed
            if (sess.currentExIndex < sess.step.exercises.length - 1) {
                sess.currentExIndex++;
                sess.currentSet = 1;
                sess.completedReps = 0;
                const nextEx = sess.step.exercises[sess.currentExIndex];

                const sData = window.systemState ? window.systemState.data : null;
                const nextAdaptiveTarget = (sData && sData.adaptiveExerciseTargets) ? sData.adaptiveExerciseTargets[nextEx.id] : null;

                sess.weightKg = (nextAdaptiveTarget && typeof nextAdaptiveTarget.weightKg === 'number') ? nextAdaptiveTarget.weightKg : (nextEx.weight || 45);
                sess.targetReps = (nextAdaptiveTarget && typeof nextAdaptiveTarget.reps === 'number') ? nextAdaptiveTarget.reps : (nextEx.reps || 10);
                sess.prevWeightKg = (nextAdaptiveTarget && typeof nextEx.weight === 'number') ? nextEx.weight : (nextEx.prevWeight || 40);
                sess.records = this.getExercisePerformanceRecords(nextEx.id || 'ex_compound', 35);

                this.renderActiveSetModal();
                if (window.app) window.app.showToast('EXERCISE MASTERED', `Advancing to ${nextEx.name}!`);
            } else {
                // Entire Phase Cleared!
                sess.step.status = 'completed';
                this.saveProgress();
                const modal = document.getElementById('modal-active-training-session');
                if (modal) modal.classList.add('hidden');

                // Award verified XP
                const r = sess.step.xpReward || { bodyXp: 180, discXp: 60 };
                if (r.bodyXp) window.systemState.gainTrackXp('bodyXp', r.bodyXp, `Cleared ${sess.step.title}`);
                if (r.discXp) window.systemState.gainTrackXp('disciplineXp', r.discXp, `Discipline: ${sess.step.title}`);
                if (r.recXp) window.systemState.gainTrackXp('recoveryXp', r.recXp, `Recovery: ${sess.step.title}`);
                if (r.mindXp) window.systemState.gainTrackXp('mindXp', r.mindXp, `Mind: ${sess.step.title}`);

                if (window.systemAudio) window.systemAudio.playVictory();
                if (window.app) {
                    const nextTargetInfo = decisionProgression ? ` Next Session Target: ${decisionProgression.nextWeightKg} kg × ${decisionProgression.nextTargetReps} reps.` : '';
                    window.app.showToast('⚔️ PHASE CONQUERED!', `🎉 ${sess.step.title} fully completed!${nextTargetInfo}`);
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
