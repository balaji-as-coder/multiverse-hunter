/**
 * MULTIVERSE HUNTER — PLATEAU DETECTION & ADAPTATION ENGINE (V3.1)
 * Analyzes multi-week weight, waist circumference, and strength trends.
 * Conditional Diagnostic Tree:
 * Plateau detected -> Check tracking -> Check weight trend -> Check waist -> Check activity -> Check recovery -> Check adherence -> Determine intervention
 *
 * Potential Interventions:
 * 1. Maintain calories (if temporary water retention / cortisol elevation)
 * 2. Adjust activity (+1,000 to +1,500 daily NEAT steps)
 * 3. Improve tracking precision (cooking oils, sauces, condiments)
 * 4. Reduce training fatigue (active recovery / volume deload)
 * 5. Maintenance-Calorie Recovery Period (3-7 days at true maintenance)
 * 6. Nutrition review (protein distribution & fiber intake)
 */

class PlateauDetectionEngine {
    constructor() {
        this.init();
    }

    init() {
        // Event listener for opening plateau analysis
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('#btn-open-plateau-diagnostic');
            if (btn) {
                this.openDiagnosticModal();
            }
        });
    }

    /**
     * Executes the comprehensive conditional diagnostic tree.
     */
    evaluateDiagnosticTree() {
        const s = window.systemState.data;
        const logs = s.progressHistory?.weightLogs || [];
        const rec = s.recoveryMetrics || {};
        const steps = s.performanceMetrics?.walkingDailyAvgSteps || 8000;
        const streak = s.player.streakDays || 1;

        if (logs.length < 3) {
            return {
                status: 'CALIBRATING',
                isPlateau: false,
                summary: 'Gathering 2–3 weeks of rolling daily data for precise plateau diagnostics.',
                checklist: [
                    { step: 'Weight Trend History', status: 'INSUFFICIENT_DATA', note: 'Need >= 3 periodic check-in entries' },
                    { step: 'Waist Circumference', status: 'CALIBRATING', note: 'Baseline established' },
                    { step: 'Tracking Accuracy', status: 'GOOD', note: 'Daily food logger active' }
                ],
                intervention: 'Continue logging daily weight and food intake consistently.'
            };
        }

        const recent = logs.slice(-3);
        const wDelta = Math.abs(recent[recent.length - 1].weight - recent[0].weight);
        const waistDelta = Math.abs(recent[recent.length - 1].waist - recent[0].waist);
        const isWeightFlat = wDelta < 0.25;
        const isWaistFlat = waistDelta < 0.35;

        // Step 1: Weight & Waist Trend Check
        if (!isWeightFlat || !isWaistFlat) {
            return {
                status: 'PROGRESSING',
                isPlateau: false,
                summary: 'Morphological progression active: Waist or scale trend continues within expected variance.',
                checklist: [
                    { step: 'Weight Delta (14d)', status: 'PASS', note: `Delta: ${wDelta.toFixed(2)} kg` },
                    { step: 'Waist Delta (14d)', status: 'PASS', note: `Delta: ${waistDelta.toFixed(1)} cm` },
                    { step: 'Autonomic Recovery', status: 'PASS', note: `Readiness: ${rec.readinessState || 'GREEN'}` }
                ],
                intervention: 'Maintain current training prescription and nutritional target.'
            };
        }

        // STEP 2 - 7: CONDITIONAL DIAGNOSTIC TREE FOR DETECTED FLATLINE
        const checklist = [
            { step: '1. Scale Weight Trend', status: 'FLATLINE', note: 'Flat for 3 consecutive check-ins' },
            { step: '2. Waist Circumference', status: 'FLATLINE', note: 'No circumference reduction detected' }
        ];

        let determinedIntervention = '';
        let interventionType = 'ADJUST_ACTIVITY';
        let actionDirectives = [];

        // Check 3: Daily Activity / NEAT
        if (steps < 7000) {
            checklist.push({ step: '3. Daily Activity / Steps', status: 'LOW_NEAT', note: `Avg ${steps} steps/day (Sub-optimal expenditure)` });
            interventionType = 'INCREASE_NEAT';
            determinedIntervention = 'Unconscious reduction in daily non-exercise physical activity (NEAT) detected.';
            actionDirectives = [
                'Increase daily baseline walking by +1,500 steps (target: 8,500–10,000 steps).',
                'Maintain current food intake without reducing calories.',
                'Record step counts consistently in the daily journal.'
            ];
        } 
        // Check 4: Recovery Stress / Cortisol Elevation
        else if (rec.readinessState === 'RED' || (rec.sleepScore && rec.sleepScore <= 2) || (rec.sorenessScore && rec.sorenessScore >= 4)) {
            checklist.push({ step: '4. Autonomic Recovery / Sleep', status: 'ELEVATED_FATIGUE', note: 'High muscle soreness & low sleep duration' });
            interventionType = 'FATIGUE_MANAGEMENT';
            determinedIntervention = 'Elevated physiological stress / water retention masking fat loss.';
            actionDirectives = [
                'Reduce direct training volume by 20–30% for 5–7 days (Deload / Active Recovery).',
                'Prioritize 7.5+ hours of sleep per night to clear cortisol-driven fluid retention.',
                'Keep daily calorie targets steady; do not slash food.'
            ];
        }
        // Check 5: Tracking Accuracy / Unlogged Condiments
        else if (streak < 10) {
            checklist.push({ step: '5. Tracking Precision & Adherence', status: 'POTENTIAL_DRIFT', note: 'Logging frequency < 10 continuous days' });
            interventionType = 'AUDIT_TRACKING';
            determinedIntervention = 'Nutritional drift or untracked cooking oils / dressings suspected.';
            actionDirectives = [
                'Conduct a 7-day high-precision weighing audit on cooking oils, sauces, and snacks.',
                'Use the Food Swap engine to replace high-energy-density snacks with volumetric veggies.',
                'Verify portion estimates with kitchen scale measurements.'
            ];
        }
        // Check 6: Prolonged Deficit -> Maintenance-Calorie Recovery Period
        else {
            checklist.push({ step: '6. Metabolic Adaptation Check', status: 'PROLONGED_DEFICIT', note: 'Adherence high (>90%), activity optimal, fatigue stable' });
            interventionType = 'MAINTENANCE_RECOVERY_PERIOD';
            determinedIntervention = 'True metabolic down-regulation after prolonged caloric deficit.';
            actionDirectives = [
                'Initiate a structured Maintenance-Calorie Recovery Period for 3 to 7 days.',
                `Temporarily increase caloric intake to calculated actual maintenance (~${s.tdeeModel?.estimatedActualMaintenance || 2350} kcal).`,
                'Increase carbohydrate intake to replenish muscle glycogen and normalize leptin signaling.',
                'Maintain training intensity (RIR 1-3) to ensure anabolic signaling.'
            ];
        }

        // Record diagnostic audit log
        if (window.auditTrail) {
            window.auditTrail.logAdjustment(
                'PLATEAU_DIAGNOSTIC_EVALUATED',
                determinedIntervention,
                { wDelta, waistDelta, steps, readinessState: rec.readinessState },
                actionDirectives.join(' | '),
                'PLATEAU_DETECTION_ENGINE'
            );
        }

        return {
            status: 'PLATEAU_DIAGNOSED',
            isPlateau: true,
            summary: determinedIntervention,
            interventionType,
            checklist,
            actionDirectives
        };
    }

    openDiagnosticModal() {
        const modal = document.getElementById('modal-plateau-diagnostic');
        if (!modal) return;

        const analysis = this.evaluateDiagnosticTree();
        const contentEl = document.getElementById('plateau-diagnostic-content');
        if (contentEl) {
            let directivesHtml = '';
            if (analysis.actionDirectives && analysis.actionDirectives.length) {
                directivesHtml = `
                    <div class="plateau-recs-box mt-15">
                        <strong class="highlight-cyan">RECOMMENDED CLINICAL INTERVENTION:</strong>
                        <ul class="mt-10">
                            ${analysis.actionDirectives.map(r => `<li>⚡ ${r}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }

            let checklistHtml = '';
            if (analysis.checklist) {
                checklistHtml = `
                    <div class="diagnostic-checklist mt-15">
                        <h4 class="font-12 text-muted uppercase">Diagnostic Check Tree</h4>
                        <div class="checklist-grid mt-5">
                            ${analysis.checklist.map(c => `
                                <div class="checklist-item">
                                    <span class="checklist-step">${c.step}</span>
                                    <span class="checklist-status pill-${c.status.toLowerCase()}">${c.status}</span>
                                    <span class="checklist-note font-11 text-muted">${c.note}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            contentEl.innerHTML = `
                <div class="diagnostic-card">
                    <div class="diag-status-pill ${analysis.isPlateau ? 'status-warning' : 'status-optimal'}">${analysis.status}</div>
                    <p class="diag-msg mt-10 font-14">${analysis.summary}</p>
                    ${checklistHtml}
                    ${directivesHtml}
                </div>
            `;
        }

        modal.classList.remove('hidden');
        if (window.systemAudio) window.systemAudio.playClick();
    }
}

if (typeof window !== 'undefined') {
    window.plateauEngine = new PlateauDetectionEngine();
}
