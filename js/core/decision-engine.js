/**
 * MULTIVERSE HUNTER — CENTRAL DECISION ENGINE (V3.1)
 * Reconciles user biometrics, recovery metrics, phase targets, and data confidence
 * into transparent directives with full user override capabilities.
 *
 * Flow:
 * USER DATA -> SYSTEM STATE -> RULE & CONFIDENCE ENGINE -> UNIFIED DIRECTIVE -> TRAINING / NUTRITION / RECOVERY
 *
 * Separation of Concerns:
 * - Real health, calorie, and biomechanics logic are purely evidence-based.
 * - Anime layer provides progression quests, mentor XP multipliers, and immersive RPG styling.
 */

class CentralDecisionEngine {
    constructor() {
        this.init();
    }

    init() {
        // Event delegation for plan override actions (Accept, Modify, Skip, Substitute, Pause)
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

    generateUnifiedDirective() {
        const s = window.systemState.data;
        const a = s.assessment;
        const rec = s.recoveryMetrics || {};
        const phase = s.player.activePhase || 'FOUNDATION';

        let trainingStress = 'NORMAL';
        let nutritionFocus = 'MAINTAIN_TARGET';
        let recoveryPriority = 'STANDARD';
        let systemReason = '';
        let volumeAdjustmentPct = 0;

        // 1. Check Safety & Emergency Stop
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

        // 2. Check Autonomic Recovery Status
        if (rec.readinessState === 'RED') {
            trainingStress = 'ACTIVE_RECOVERY';
            nutritionFocus = 'MAINTAIN_TARGET';
            recoveryPriority = 'HIGH_RESTORATION';
            volumeAdjustmentPct = -50;
            systemReason = `High systemic fatigue / muscle soreness (Score: ${rec.sorenessScore || 4}/5) detected. Training adjusted to mobility, breathwork, and gentle walking. Daily nutrition maintained.`;
        } else if (rec.readinessState === 'YELLOW') {
            trainingStress = 'MODIFIED_VOLUME';
            nutritionFocus = 'MAINTAIN_TARGET';
            recoveryPriority = 'MODERATE';
            volumeAdjustmentPct = -25;
            systemReason = `Moderate fatigue detected (Sleep: ${rec.sleepScore || 3}/5, Stress: ${rec.stressScore || 3}/5). Working sets reduced by 25% to optimize recovery while sustaining neuromuscular stimulus.`;
        } else {
            // GREEN: Normal planned training calibrated by active phase
            if (phase === 'FAT_LOSS') {
                trainingStress = 'PRESERVE_STRENGTH';
                nutritionFocus = 'CALORIC_DEFICIT';
                volumeAdjustmentPct = 0;
                systemReason = `Phase: FAT LOSS. Preserving heavy resistance performance (RIR: 1-2) with a sustainable deficit (${s.nutrition.caloriesTarget} kcal) and high protein (${s.nutrition.proteinTarget}g).`;
            } else if (phase === 'RECOMPOSITION' || phase === 'FOUNDATION') {
                trainingStress = 'PROGRESSIVE_OVERLOAD';
                nutritionFocus = 'MILD_DEFICIT';
                volumeAdjustmentPct = 0;
                systemReason = `Phase: ${phase}. Prioritizing V-Taper lat width and upper chest overload. 7-day weight delta (${s.tdeeModel?.weeklyWeightDeltaKg || -0.4}kg) indicates optimal body recomposition.`;
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

        if (contentEl) {
            contentEl.innerHTML = `
                <div class="explainer-card">
                    <div class="explainer-section">
                        <strong class="highlight-cyan font-14">SYSTEM REASONING & TRANSPARENCY:</strong>
                        <p class="mt-8 font-13 text-white">${d.systemReason}</p>
                    </div>

                    <div class="explainer-grid mt-15">
                        <div class="explainer-stat">
                            <span class="text-muted font-11">Primary Goal:</span>
                            <strong>${s.assessment.primaryObjective || 'V-Taper Aesthetics'}</strong>
                        </div>
                        <div class="explainer-stat">
                            <span class="text-muted font-11">Active Phase:</span>
                            <strong>${s.player.activePhase || 'FOUNDATION'}</strong>
                        </div>
                        <div class="explainer-stat">
                            <span class="text-muted font-11">Last 14-Day Consistency:</span>
                            <strong>${s.player.streakDays || 1} Days Active</strong>
                        </div>
                        <div class="explainer-stat">
                            <span class="text-muted font-11">Daily Step Average:</span>
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
                        <div class="font-12 text-muted uppercase">Decision Conclusion:</div>
                        <p class="font-13 text-green mt-5">
                            Target Calories: <strong>${s.nutrition.caloriesTarget} kcal</strong> | 
                            Protein: <strong>${s.nutrition.proteinTarget}g</strong> | 
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
