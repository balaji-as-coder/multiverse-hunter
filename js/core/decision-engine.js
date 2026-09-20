/**
 * MULTIVERSE HUNTER — CENTRAL DECISION & PROGRESSIVE OVERLOAD ENGINE (V3.5)
 * Reconciles user biometrics, recovery metrics, phase targets, data confidence,
 * and exercise-specific progressive overload algorithms with Recovery Gate safety checks.
 */

class CentralDecisionEngine {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            const btnAccept = e.target.closest('#btn-accept-daily-plan');
            if (btnAccept) this.handlePlanDecision('ACCEPT');

            const btnModify = e.target.closest('#btn-modify-daily-plan');
            if (btnModify) this.handlePlanDecision('MODIFY');

            const btnSkip = e.target.closest('#btn-skip-daily-plan');
            if (btnSkip) this.handlePlanDecision('SKIP');

            const btnSub = e.target.closest('#btn-substitute-daily-plan');
            if (btnSub) this.handlePlanDecision('SUBSTITUTE');

            const btnPause = e.target.closest('#btn-pause-daily-plan');
            if (btnPause) this.handlePlanDecision('PAUSE');

            const btnShowExplainer = e.target.closest('#btn-show-plan-explainer');
            if (btnShowExplainer) this.openTransparencyExplainer();
        });
    }

    /**
     * V3.6 Exercise-Specific Progressive Overload Engine with Multi-Session Confidence & Recovery Gate
     * Evaluates actual reps, user-entered RIR, form quality, recovery readiness, and statistical history.
     * Persists calculated targets into systemState.data.adaptiveExerciseTargets and systemState.data.latestDecisionRecord.
     */
    calculateExerciseProgression(exerciseId, currentWeightKg, targetReps, actualReps, rir = 2, formQuality = 'CLEAN', exerciseName = '') {
        const s = window.systemState ? window.systemState.data : {};
        const rec = s.recoveryMetrics || { readinessState: 'GREEN', hrvMs: 62, sleepHoursAvg: 7.5 };
        const phase = (s.player && s.player.activePhase) ? s.player.activePhase : 'FOUNDATION';

        // 1. STATISTICAL MULTI-SESSION CONFIDENCE CALCULATION
        let verifiedLogs = [];
        try {
            const rawKey = `HUNTER_EX_PERF_${exerciseId}`;
            const stored = localStorage.getItem(rawKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    verifiedLogs = parsed.filter(p => p.tag === 'VERIFIED USER LOG');
                }
            }
        } catch (e) {}

        const verifiedCount = verifiedLogs.length;
        let confidenceLevel = 'LOW';
        let confidenceDetail = '';

        if (verifiedCount >= 4) {
            confidenceLevel = 'HIGH';
            confidenceDetail = `HIGH (Statistical score: ${verifiedCount} verified sessions logged with consistent execution)`;
        } else if (verifiedCount >= 2) {
            confidenceLevel = 'MODERATE';
            confidenceDetail = `MODERATE (${verifiedCount} verified sessions logged — building statistical baseline)`;
        } else {
            confidenceLevel = 'LOW';
            confidenceDetail = `LOW (${verifiedCount} verified session logged — initial calibration phase)`;
        }

        let nextWeightKg = currentWeightKg;
        let nextTargetReps = targetReps;
        let wasIncremented = false;
        let actionReason = '';
        let recoveryGateStatus = 'PASSED (GREEN READINESS)';

        // 2. RECOVERY GATE EVALUATION
        if (rec.readinessState === 'RED') {
            nextWeightKg = Math.max(0, Math.round(currentWeightKg * 0.85 * 10) / 10); // 15% deload under severe fatigue
            recoveryGateStatus = 'BLOCKED (RED READINESS)';
            actionReason = `Severe autonomic fatigue detected (Readiness RED). Recovery Gate blocked overload progression; 15% active recovery deload prescribed.`;
        } else if (rec.readinessState === 'YELLOW') {
            recoveryGateStatus = 'HOLD (YELLOW READINESS)';
            actionReason = `Moderate fatigue detected (Readiness YELLOW). Load held at ${currentWeightKg} kg to consolidate volume without CNS overreaching.`;
        } else {
            // 3. GREEN RECOVERY: FORM QUALITY GATE & EXERCISE PROFILE PROGRESSION
            if (formQuality === 'COMPROMISED') {
                nextWeightKg = currentWeightKg;
                nextTargetReps = targetReps;
                actionReason = `Form breakdown reported (${formQuality}). Overload paused; load maintained at ${currentWeightKg} kg to reinforce technical integrity and joint safety.`;
            } else {
                const isLowerCompound = exerciseId.includes('squat') || exerciseId.includes('deadlift');
                const isUpperCompound = exerciseId.includes('press') || exerciseId.includes('bench') || exerciseId.includes('pullup') || exerciseId.includes('row') || exerciseId.includes('dip') || exerciseId.includes('ohp');
                const isBodyweight = currentWeightKg === 0 || exerciseId.includes('pushup') || exerciseId.includes('hollow') || exerciseId.includes('plank');

                const repsExceeded = actualReps >= targetReps;
                const strongSurge = actualReps >= targetReps + 2;

                if (isBodyweight) {
                    if (repsExceeded && rir >= 1) {
                        nextTargetReps = targetReps + 2;
                        wasIncremented = true;
                        actionReason = `Completed ${actualReps}/${targetReps} reps with ${formQuality.toLowerCase()} form (RIR ${rir}). Target volume increased by +2 reps for next session.`;
                    } else {
                        nextTargetReps = targetReps;
                        actionReason = `Completed ${actualReps}/${targetReps} reps (RIR ${rir}). Target volume maintained to reinforce movement control.`;
                    }
                } else if (isLowerCompound) {
                    if (strongSurge && rir >= 2 && formQuality === 'CLEAN' && verifiedCount >= 2) {
                        nextWeightKg = currentWeightKg + 5.0; // 5kg surge progression on verified lower compounds
                        wasIncremented = true;
                        actionReason = `Strong technical surge (+${actualReps - targetReps} reps, RIR ${rir}, Clean form). Lower compound load increased by +5.0 kg for next session.`;
                    } else if (repsExceeded && rir >= 1) {
                        nextWeightKg = currentWeightKg + 2.5; // Standard 2.5kg increment
                        wasIncremented = true;
                        actionReason = `Prescribed ${targetReps} reps completed with ${formQuality.toLowerCase()} form (RIR ${rir}). Standard progressive overload bump of +2.5 kg applied.`;
                    } else {
                        nextWeightKg = currentWeightKg;
                        actionReason = actualReps < targetReps && rir === 0
                            ? `Muscular failure reached at ${actualReps}/${targetReps} reps (RIR 0). Load maintained at ${currentWeightKg} kg to consolidate neuromuscular adaptation.`
                            : `Completed ${actualReps}/${targetReps} reps. Load maintained at ${currentWeightKg} kg.`;
                    }
                } else if (isUpperCompound) {
                    if (repsExceeded && rir >= 1) {
                        nextWeightKg = currentWeightKg + 2.5; // Upper compound progressive increment capped for safety
                        wasIncremented = true;
                        actionReason = strongSurge
                            ? `Upper compound surge (+${actualReps - targetReps} reps, RIR ${rir}). Overload bump of +2.5 kg scheduled for next session.`
                            : `Completed ${actualReps}/${targetReps} reps on upper compound lift. Overload bump of +2.5 kg scheduled for next session.`;
                    } else {
                        nextWeightKg = currentWeightKg;
                        actionReason = `Target load maintained at ${currentWeightKg} kg.`;
                    }
                } else {
                    // Isolation / accessory movements
                    if (repsExceeded && rir >= 1) {
                        nextTargetReps = targetReps + 1;
                        wasIncremented = true;
                        actionReason = `Reps incremented by +1 to progress toward higher hypertrophy threshold.`;
                    } else {
                        actionReason = `Maintained current isolation volume.`;
                    }
                }
            }
        }

        // 4. CLOSED-LOOP PERSISTENCE: SAVE TARGET & AUDIT RECORD
        const readableName = exerciseName || (exerciseId.replace('ex_', '').replace(/_/g, ' ').toUpperCase());
        const decisionRecord = {
            exerciseId,
            exerciseName: readableName,
            previousLoad: currentWeightKg,
            previousReps: targetReps,
            actualReps,
            rir,
            formQuality,
            readiness: rec.readinessState || 'GREEN',
            recoveryGate: recoveryGateStatus,
            verifiedSessionsCount: verifiedCount,
            confidenceLevel,
            confidenceDetail,
            wasIncremented,
            nextWeightKg,
            nextTargetReps,
            actionReason,
            timestamp: new Date().toISOString()
        };

        if (window.systemState && window.systemState.data) {
            if (!window.systemState.data.adaptiveExerciseTargets) {
                window.systemState.data.adaptiveExerciseTargets = {};
            }
            window.systemState.data.adaptiveExerciseTargets[exerciseId] = {
                exerciseId,
                exerciseName: readableName,
                weightKg: nextWeightKg,
                reps: nextTargetReps,
                lastUpdated: Date.now(),
                reason: actionReason
            };

            window.systemState.data.latestDecisionRecord = decisionRecord;
            if (!window.systemState.data.decisionRecordHistory) {
                window.systemState.data.decisionRecordHistory = [];
            }
            window.systemState.data.decisionRecordHistory.push(decisionRecord);
            window.systemState.save();
        }

        return decisionRecord;
    }

    generateUnifiedDirective() {
        const s = window.systemState.data;
        const rec = s.recoveryMetrics || {};
        const phase = s.player.activePhase || 'FOUNDATION';

        let trainingStress = 'NORMAL';
        let nutritionFocus = 'MAINTAIN_TARGET';
        let recoveryPriority = 'STANDARD';
        let systemReason = '';
        let volumeAdjustmentPct = 0;

        if (s.emergencyStopActive) {
            return {
                status: 'EMERGENCY_STOP',
                systemReason: '⚠ SYSTEM OVERRIDE: Acute health symptoms or severe discomfort reported. Normal physical training suspended pending medical clearance.',
                trainingStress: 'SUSPENDED',
                nutritionFocus: 'MAINTENANCE_NUTRITION',
                recoveryPriority: 'MAXIMUM_CARE',
                volumeAdjustmentPct: -100,
                timestamp: new Date().toISOString()
            };
        }

        if (rec.readinessState === 'RED') {
            trainingStress = 'ACTIVE_RECOVERY';
            nutritionFocus = 'MAINTAIN_TARGET';
            recoveryPriority = 'HIGH_RESTORATION';
            volumeAdjustmentPct = -50;
            systemReason = `High systemic fatigue / muscle soreness detected. Training adjusted to mobility, breathwork, and gentle walking. Daily nutrition maintained.`;
        } else if (rec.readinessState === 'YELLOW') {
            trainingStress = 'MODIFIED_VOLUME';
            nutritionFocus = 'MAINTAIN_TARGET';
            recoveryPriority = 'MODERATE';
            volumeAdjustmentPct = -25;
            systemReason = `Moderate fatigue detected. Working sets reduced by 25% to optimize recovery while sustaining neuromuscular stimulus.`;
        } else {
            if (phase === 'FAT_LOSS') {
                trainingStress = 'PRESERVE_STRENGTH';
                nutritionFocus = 'CALORIC_DEFICIT';
                volumeAdjustmentPct = 0;
                systemReason = `Phase: FAT LOSS. Preserving heavy resistance performance (RIR: 1-2) with a sustainable deficit (${s.nutrition.caloriesTarget} kcal) and high protein (${s.nutrition.proteinTarget}g).`;
            } else if (phase === 'RECOMPOSITION' || phase === 'FOUNDATION') {
                trainingStress = 'PROGRESSIVE_OVERLOAD';
                nutritionFocus = 'MILD_DEFICIT';
                volumeAdjustmentPct = 0;
                systemReason = `Phase: ${phase}. Prioritizing progressive overload on compound lifts. Weekly weight delta (${s.tdeeModel?.weeklyWeightDeltaKg || -0.4}kg) indicates optimal body recomposition.`;
            } else if (phase === 'MUSCLE_GAIN') {
                trainingStress = 'HYPERTROPHY_OVERLOAD';
                nutritionFocus = 'SURPLUS';
                volumeAdjustmentPct = 0;
                systemReason = `Phase: MUSCLE GAIN. Progressive volume increase authorized with clean caloric surplus (${s.nutrition.caloriesTarget} kcal).`;
            } else {
                trainingStress = 'NORMAL';
                nutritionFocus = 'MAINTAIN_TARGET';
                volumeAdjustmentPct = 0;
                systemReason = `Phase: ${phase}. Training volume and nutritional energy target aligned with maintenance stability.`;
            }
        }

        const directive = {
            status: 'ACTIVE',
            trainingStress,
            nutritionFocus,
            recoveryPriority,
            volumeAdjustmentPct,
            systemReason,
            timestamp: new Date().toISOString()
        };

        s.activeDirective = directive;
        return directive;
    }

    handlePlanDecision(action) {
        const s = window.systemState.data;

        if (action === 'ACCEPT') {
            if (window.app) window.app.showToast('PLAN CONFIRMED', 'Daily training and nutrition protocol locked in!');
            if (window.systemAudio) window.systemAudio.playClick();
        } else if (action === 'MODIFY') {
            if (window.app) window.app.showToast('MODIFY PROTOCOL', 'Select any exercise below to customize sets, reps, or equipment.');
        } else if (action === 'SKIP') {
            if (window.app) window.app.showToast('SESSION SKIPPED', 'Session marked as rest day. Hydration and nutrition targets remain active.');
            s.training.todayCompleted = true;
            window.systemState.save();
            if (window.app) window.app.syncUI();
        } else if (action === 'SUBSTITUTE') {
            if (window.substitutionEngine) {
                if (window.app) window.app.showToast('SUBSTITUTE EXERCISES', 'Equipment substitution modal opened.');
            }
        } else if (action === 'PAUSE') {
            s.player.activePhase = 'MAINTENANCE';
            window.systemState.save();
            if (window.app) {
                window.app.showToast('TRAINING PAUSED', 'System shifted to Maintenance consolidation phase.');
                window.app.syncUI();
            }
        }
    }

    openTransparencyExplainer() {
        const modal = document.getElementById('modal-plan-explainer');
        if (!modal) return;

        const s = window.systemState.data;
        const d = this.generateUnifiedDirective();
        const contentEl = document.getElementById('plan-explainer-content');
        const latestRec = s.latestDecisionRecord;

        let whyTargetHtml = '';
        if (latestRec) {
            const readinessColor = latestRec.readiness === 'GREEN' ? 'highlight-green' : latestRec.readiness === 'YELLOW' ? 'highlight-gold' : 'highlight-red';
            const confColor = latestRec.confidenceLevel === 'HIGH' ? 'highlight-green' : latestRec.confidenceLevel === 'MODERATE' ? 'highlight-cyan' : 'highlight-gold';

            whyTargetHtml = `
                <div class="why-target-changed-panel mt-15 p-14" style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: var(--card-radius);">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong class="highlight-gold font-12">🔍 "WHY DID MY TARGET LOAD CHANGE?"</strong>
                        <span class="font-9 text-muted uppercase">[DYNAMIC TRUTH ENGINE RECORD]</span>
                    </div>
                    <div class="decision-record-details font-12 text-secondary mt-8" style="line-height: 1.6;">
                        <div><strong>Last Exercise Logged:</strong> <span class="highlight-cyan font-12 font-bold">${latestRec.exerciseName}</span></div>
                        <div><strong>Performance Input:</strong> ${latestRec.previousLoad} kg × ${latestRec.actualReps} reps (Target: ${latestRec.previousReps} reps | User RIR: <strong>${latestRec.rir}</strong> | Form: <strong>${latestRec.formQuality}</strong>)</div>
                        <div><strong>Autonomic Recovery Gate:</strong> <span class="${readinessColor} font-bold">${latestRec.recoveryGate}</span></div>
                        <div><strong>Multi-Session Consistency:</strong> <span class="${confColor} font-bold">${latestRec.confidenceDetail}</span></div>
                        <div class="mt-4 p-8" style="background: rgba(0, 0, 0, 0.35); border-left: 3px solid var(--accent-primary); border-radius: 4px;">
                            <strong class="text-white">Decision Rationale:</strong> ${latestRec.actionReason}<br>
                            <span class="highlight-green font-bold">Next Session Target: ${latestRec.nextWeightKg} kg × ${latestRec.nextTargetReps} reps</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            whyTargetHtml = `
                <div class="why-target-changed-panel mt-15 p-14" style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: var(--card-radius);">
                    <strong class="highlight-gold font-12">🔍 "WHY DID MY TARGET LOAD CHANGE?"</strong>
                    <p class="font-12 text-secondary mt-6">
                        <strong>Active Calibration Status:</strong> Initializing Baseline Protocol<br>
                        <strong>Autonomic Recovery Gate:</strong> <span class="highlight-green">PASSED (${s.recoveryMetrics?.readinessState || 'GREEN'} READINESS)</span><br>
                        <strong>Multi-Session Consistency:</strong> Awaiting first live set verification<br>
                        <strong>Decision Directive:</strong> Complete your scheduled working sets with user-verified RIR to unlock closed-loop adaptive target evolution.
                    </p>
                </div>
            `;
        }

        if (contentEl) {
            contentEl.innerHTML = `
                <div class="explainer-card">
                    <div class="explainer-section">
                        <strong class="highlight-cyan font-14">SYSTEM REASONING & TRANSPARENCY:</strong>
                        <p class="mt-8 font-13 text-white">${d.systemReason}</p>
                    </div>

                    <!-- DYNAMIC WHY DID MY TARGET CHANGE? Diagnostic Panel -->
                    ${whyTargetHtml}

                    <div class="explainer-grid mt-15">
                        <div class="explainer-stat">
                            <span class="text-muted font-11">Primary Goal:</span>
                            <strong>${s.assessment?.primaryObjective || 'V-Taper Aesthetics'}</strong>
                        </div>
                        <div class="explainer-stat">
                            <span class="text-muted font-11">Active Phase:</span>
                            <strong>${s.player?.activePhase || 'FOUNDATION'}</strong>
                        </div>
                        <div class="explainer-stat">
                            <span class="text-muted font-11">Consistency Streak:</span>
                            <strong>${s.player?.streakDays || 1} Days Active</strong>
                        </div>
                        <div class="explainer-stat">
                            <span class="text-muted font-11">Step Average:</span>
                            <strong>${s.performanceMetrics?.walkingDailyAvgSteps || 8500} Steps</strong>
                        </div>
                        <div class="explainer-stat">
                            <span class="text-muted font-11">Weight Trend Delta:</span>
                            <strong>${s.tdeeModel?.weeklyWeightDeltaKg || -0.45} kg/wk</strong>
                        </div>
                        <div class="explainer-stat">
                            <span class="text-muted font-11">Autonomic Readiness:</span>
                            <strong class="pill-${(s.recoveryMetrics?.readinessState || 'GREEN').toLowerCase()}">${s.recoveryMetrics?.readinessState || 'GREEN'}</strong>
                        </div>
                    </div>

                    <div class="explainer-conclusion mt-15">
                        <div class="font-12 text-muted uppercase">Decision Directives:</div>
                        <p class="font-13 text-green mt-5">
                            Target Calories: <strong>${s.nutrition?.caloriesTarget} kcal</strong> | 
                            Protein: <strong>${s.nutrition?.proteinTarget}g</strong> | 
                            Volume Modifier: <strong>${d.volumeAdjustmentPct >= 0 ? '+' : ''}${d.volumeAdjustmentPct}%</strong>
                        </p>
                    </div>
                </div>
            `;
        }

        modal.classList.remove('hidden');
        if (window.systemAudio) window.systemAudio.playClick();
    }
}

if (typeof window !== 'undefined') {
    window.decisionEngine = new CentralDecisionEngine();
}
