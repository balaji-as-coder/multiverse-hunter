/**
 * MULTIVERSE HUNTER — RECOVERY ENGINE & READINESS PROTOCOL
 * Evaluates daily biological recovery and readiness with evidence-based non-diagnostic wording:
 * - 🟢 GREEN: Normal planned training
 * - 🟡 YELLOW: Modified training (reduce volume/load by 25%)
 * - 🔴 RED: Recovery-focused session (mobility, breathwork, active walking)
 * Manages Dynamic Hydration Targets (Baseline estimate + exercise/climate modifier + user configuration).
 * Calculates the Hunter Health Index (0-100) across 5 pillars.
 */

class ReadinessEngine {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const btnOpenCheck = document.getElementById('btn-open-morning-check');
        if (btnOpenCheck) {
            btnOpenCheck.addEventListener('click', () => {
                document.getElementById('modal-morning-check')?.classList.remove('hidden');
            });
        }

        const btnCloseCheck = document.getElementById('btn-close-morning-check');
        if (btnCloseCheck) {
            btnCloseCheck.addEventListener('click', () => {
                document.getElementById('modal-morning-check')?.classList.add('hidden');
            });
        }

        // Live preview on slider adjustments
        ['rec-sleep', 'rec-energy', 'rec-soreness', 'rec-stress', 'rec-motivation'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => this.updateLivePreview());
        });

        // Submit check-in
        const btnSubmit = document.getElementById('btn-submit-morning-check');
        if (btnSubmit) {
            btnSubmit.addEventListener('click', () => this.processCheckIn());
        }

        // Configure Hydration Target
        const btnSetWater = document.getElementById('btn-configure-water');
        if (btnSetWater) {
            btnSetWater.addEventListener('click', () => {
                const custom = prompt('Enter your daily hydration target in Liters:', window.systemState.data.hydration.configuredTargetLiters || 3.2);
                if (custom && !isNaN(custom)) {
                    window.systemState.data.hydration.configuredTargetLiters = parseFloat(custom);
                    window.systemState.data.hydration.userOverride = true;
                    window.systemState.save();
                    if (window.app) window.app.syncUI();
                }
            });
        }
    }

    updateLivePreview() {
        const sleep = parseInt(document.getElementById('rec-sleep')?.value) || 4;
        const energy = parseInt(document.getElementById('rec-energy')?.value) || 4;
        const soreness = parseInt(document.getElementById('rec-soreness')?.value) || 2;
        const stress = parseInt(document.getElementById('rec-stress')?.value) || 2;
        const motivation = parseInt(document.getElementById('rec-motivation')?.value) || 4;

        const score = (sleep * 2) + (energy * 2) + (motivation * 1.5) - (soreness * 1.5) - (stress * 1.5);
        
        let state = 'GREEN';
        let badgeColor = '#10b981';
        let msg = 'Normal planned training. System physiology balanced.';

        if (score < 5 || sleep <= 2 || soreness >= 4) {
            state = 'RED';
            badgeColor = '#ff2a5f';
            msg = 'Recovery-focused session. High systemic fatigue detected; active mobility, breathwork, and light walking recommended.';
        } else if (score < 10 || stress >= 4) {
            state = 'YELLOW';
            badgeColor = '#fbbf24';
            msg = 'Modified training. Moderate fatigue detected; maintain movement pattern stimulus with 25% lower working sets.';
        }

        const previewEl = document.getElementById('morning-check-preview');
        if (previewEl) {
            previewEl.innerHTML = `<span style="color: ${badgeColor}; font-weight: bold;">[ ${state} READINESS ]</span> ${msg}`;
        }
    }

    processCheckIn() {
        const s = window.systemState.data;
        const sleep = parseInt(document.getElementById('rec-sleep')?.value) || 4;
        const energy = parseInt(document.getElementById('rec-energy')?.value) || 4;
        const soreness = parseInt(document.getElementById('rec-soreness')?.value) || 2;
        const stress = parseInt(document.getElementById('rec-stress')?.value) || 2;
        const motivation = parseInt(document.getElementById('rec-motivation')?.value) || 4;

        s.recoveryMetrics.sleepScore = sleep;
        s.recoveryMetrics.energyScore = energy;
        s.recoveryMetrics.sorenessScore = soreness;
        s.recoveryMetrics.stressScore = stress;
        s.recoveryMetrics.motivationScore = motivation;
        s.recoveryMetrics.lastCheckDate = new Date().toDateString();

        const score = (sleep * 2) + (energy * 2) + (motivation * 1.5) - (soreness * 1.5) - (stress * 1.5);
        
        if (score < 5 || sleep <= 2 || soreness >= 4) {
            s.recoveryMetrics.readinessState = 'RED';
            s.recoveryMetrics.readinessMessage = 'Recovery-focused session. High systemic fatigue; active mobility and light walking recommended.';
            s.player.fatigue = 40;
        } else if (score < 10 || stress >= 4) {
            s.recoveryMetrics.readinessState = 'YELLOW';
            s.recoveryMetrics.readinessMessage = 'Modified training. Moderate fatigue detected; training sets reduced by 25% for safety.';
            s.player.fatigue = 20;
        } else {
            s.recoveryMetrics.readinessState = 'GREEN';
            s.recoveryMetrics.readinessMessage = 'Normal planned training. System physiology balanced.';
            s.player.fatigue = 5;
        }

        this.recalculateHealthIndex();
        window.systemState.gainTrackXp('recoveryXp', 120, `Morning Check-In (${s.recoveryMetrics.readinessState})`);
        
        document.getElementById('modal-morning-check')?.classList.add('hidden');
        if (window.systemAudio) window.systemAudio.playQuestComplete();
        if (window.app) {
            window.app.showToast('READINESS UPDATED', `State: ${s.recoveryMetrics.readinessState}. Hydration Target: ${s.hydration.configuredTargetLiters}L`);
            window.app.syncUI();
        }
    }

    recalculateHealthIndex() {
        const s = window.systemState.data;
        const sleep = s.recoveryMetrics.sleepScore || 4;
        const energy = s.recoveryMetrics.energyScore || 4;
        
        const movScore = Math.min(99, 70 + (s.stats.agi * 1.5));
        const strScore = Math.min(99, 65 + (s.stats.str * 1.6));
        const recScore = Math.round((sleep / 5) * 50 + (energy / 5) * 45);
        const nutScore = Math.round((s.nutrition.proteinConsumed / Math.max(1, s.nutrition.proteinTarget)) * 85);
        const consScore = Math.min(98, 75 + (s.player.streakDays * 2));

        const avg = Math.round((movScore + strScore + recScore + nutScore + consScore) / 5);
        if (!s.recoveryMetrics.healthIndex) s.recoveryMetrics.healthIndex = avg;
        else s.recoveryMetrics.healthIndex = Math.min(99, Math.max(20, avg));
        window.systemState.save();
    }
}

window.readinessEngine = new ReadinessEngine();
window.recoveryEngine = window.readinessEngine;
