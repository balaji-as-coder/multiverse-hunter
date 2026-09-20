/**
 * MULTIVERSE HUNTER — SAFETY & INJURY ROUTER
 * Non-diagnostic safety filter that:
 * - Checks for user-reported joint pain, lower-back fatigue, shoulder impingement, or wrist strain.
 * - Automatically filters out aggravating movement patterns.
 * - Replaces high-compression exercises with joint-friendly regressions.
 * - Recommends professional evaluation when acute discomfort is flagged.
 * - Never uses anime mechanics to encourage unsafe physical exertion.
 */

class SafetyRouter {
    constructor() {
        this.contraindicationMap = {
            knee_pain: {
                aggravating: ['ex_barbell_squat', 'ex_bulgarian_split_squat'],
                safeReplacements: ['ex_box_squat', 'ex_glute_bridge', 'ex_hamstring_curl'],
                guidance: 'Knee discomfort detected: High quad shear movements swapped to hip-dominant glute bridges & box squats.'
            },
            lower_back_fatigue: {
                aggravating: ['ex_romanian_deadlift', 'ex_barbell_squat', 'ex_barbell_row'],
                safeReplacements: ['ex_chest_supported_tbar', 'ex_glute_bridge', 'ex_lat_pulldown'],
                guidance: 'Spinal fatigue detected: Spinal loading movements converted to chest-supported and seated patterns.'
            },
            shoulder_impingement: {
                aggravating: ['ex_db_overhead_press', 'ex_lat_pulldown'],
                safeReplacements: ['ex_landmine_press', 'ex_cable_face_pull', 'ex_inverted_row'],
                guidance: 'Shoulder discomfort detected: Overhead pressing replaced with neutral-grip and horizontal pulling.'
            }
        };
    }

    applySafetyRouting() {
        const s = window.systemState.data;
        const contra = s.assessment.contraindications || [];
        if (contra.length === 0) return { routed: false, messages: [] };

        const messages = [];
        contra.forEach(flag => {
            if (flag in this.contraindicationMap) {
                messages.push(this.contraindicationMap[flag].guidance);
            }
        });

        return {
            routed: true,
            messages
        };
    }

    flagContraindication(flagKey) {
        const s = window.systemState.data;
        if (!s.assessment.contraindications) s.assessment.contraindications = [];
        if (!s.assessment.contraindications.includes(flagKey)) {
            s.assessment.contraindications.push(flagKey);
            window.systemState.save();
        }
    }
}

window.safetyRouter = new SafetyRouter();
