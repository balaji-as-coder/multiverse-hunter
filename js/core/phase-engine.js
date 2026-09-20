/**
 * MULTIVERSE HUNTER — PHASE ENGINE (V3.1)
 * Prevents "weight loss forever" and establishes structured progression phases.
 * Dynamic target range for FAT_LOSS based on:
 * - Current body composition context
 * - Rate of weight change
 * - Training status & performance preservation
 * - Recovery status & adherence
 * - User goal
 */

class PhaseEngine {
    constructor() {
        this.phases = {
            ASSESSMENT: {
                title: 'Assessment & Baseline Calibration',
                desc: 'Calibrating movement technique, resting vitals, and initial metabolic expenditure.',
                durationWeeks: 1,
                focus: 'Consistency & Baseline Data'
            },
            FOUNDATION: {
                title: 'Foundation & Habit Lock Phase',
                desc: 'Building biomechanical efficiency, tendon strength, and daily habit execution.',
                durationWeeks: 3,
                focus: 'Technique Mastery & Step Volume'
            },
            FAT_LOSS: {
                title: 'Targeted Fat Loss & Lean Preservation',
                desc: 'Context-adaptive caloric deficit (10–25% target range) preserving contractile strength and neuromuscular performance.',
                durationWeeks: 8,
                focus: 'High Protein & Progressive Resistance'
            },
            RECOMPOSITION: {
                title: 'Body Recomposition & V-Taper Sculpting',
                desc: 'Decreasing waist circumference while increasing upper body strength and muscle density.',
                durationWeeks: 8,
                focus: 'Waist Tapering & Upper Chest/Lat Hypertrophy'
            },
            MUSCLE_GAIN: {
                title: 'Hypertrophy & Controlled Muscle Gain',
                desc: 'Progressive overload with clean energy surplus to build dense contractile tissue.',
                durationWeeks: 10,
                focus: 'Strength PRs & Hypertrophy Overload'
            },
            MAINTENANCE: {
                title: 'Metabolic Maintenance & Recovery Consolidation',
                desc: 'Holding body composition steady and giving joints/hormones full recovery.',
                durationWeeks: 4,
                focus: 'Solidifying Adaptations'
            },
            ATHLETIC_PERFORMANCE: {
                title: 'Athletic Conditioning & Agility',
                desc: 'Ground endurance, interval conditioning, and explosive power output.',
                durationWeeks: 6,
                focus: 'VO2 Max & Speed Endurance'
            },
            SKILL_SPECIALIZATION: {
                title: 'Calisthenics Skill Specialization',
                desc: 'Dedicated skill blocks for Muscle-Up, Planche, Front Lever, and Handstand holds.',
                durationWeeks: 6,
                focus: 'Advanced Relative Strength'
            }
        };
    }

    /**
     * Calculates the evidence-based deficit percentage dynamically for FAT_LOSS.
     * Prevents fixed arbitrary deficits; balances sustainable progress with performance preservation.
     */
    calculateAdaptiveDeficit(state) {
        const s = state || window.systemState.data;
        const a = s.assessment;
        const rec = s.recoveryMetrics || {};
        const bf = a.bodyFatPct || 20;
        const weight = a.currentWeightKg || 75;
        const delta = s.tdeeModel?.weeklyWeightDeltaKg || -0.4;

        // Base deficit scaled by adiposity (Helms et al., 2014)
        // High body fat (>24% male, >32% female) can comfortably sustain higher deficits
        let deficitPct = 0.18; // 18% default baseline

        if (bf >= 25) {
            deficitPct = 0.22; // 22% for higher adiposity
        } else if (bf <= 14) {
            deficitPct = 0.12; // 12% conservative deficit to protect lean mass
        } else {
            deficitPct = 0.16; // 16% moderate
        }

        // Modulation by rate of weight change (Target: 0.5% - 1.0% bodyweight per week)
        const weeklyLossPct = Math.abs(delta) / weight;
        if (weeklyLossPct > 0.012) {
            // Losing too fast (>1.2% per week) -> soften deficit to prevent muscle loss
            deficitPct = Math.max(0.10, deficitPct - 0.05);
        } else if (weeklyLossPct < 0.003 && s.player.streakDays >= 14) {
            // Very slow progress (<0.3%) despite high adherence -> small increment within safe envelope
            deficitPct = Math.min(0.24, deficitPct + 0.03);
        }

        // Modulation by Recovery Status: if sleep/recovery is poor, reduce deficit to avoid excessive fatigue
        if (rec.readinessState === 'RED' || (rec.sleepScore && rec.sleepScore <= 2)) {
            deficitPct = Math.max(0.10, deficitPct - 0.04);
        }

        return +deficitPct.toFixed(2);
    }

    setPhase(phaseKey) {
        if (!(phaseKey in this.phases)) return;
        const s = window.systemState.data;
        s.player.activePhase = phaseKey;
        
        // Recalculate TDEE and nutritional distribution
        window.systemState.calculateAdaptiveTDEE();
        window.systemState.save();

        if (window.app) {
            window.app.showToast('NEW EVOLUTION PHASE', `Switched to ${this.phases[phaseKey].title}!`);
            window.app.syncUI();
        }
    }

    evaluateAutoTransition() {
        const s = window.systemState.data;
        const a = s.assessment;

        // If in Foundation and week >= 2, transition to primary goal phase
        if (s.player.activePhase === 'FOUNDATION' && s.player.activeArcNumber >= 2) {
            if (a.physiqueArchetype === 'cut') {
                this.setPhase('FAT_LOSS');
            } else if (a.physiqueArchetype === 'bulk') {
                this.setPhase('MUSCLE_GAIN');
            } else {
                this.setPhase('RECOMPOSITION');
            }
        }
    }
}

if (typeof window !== 'undefined') {
    window.phaseEngine = new PhaseEngine();
}
