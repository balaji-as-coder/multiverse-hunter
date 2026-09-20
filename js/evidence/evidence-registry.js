/**
 * MULTIVERSE HUNTER — EVIDENCE LAYER & GUIDELINE REGISTRY
 * Explicitly separates:
 * 1. Established Scientific & Clinical Guidance (ICMR, ISSN, WHO, ACSM)
 * 2. Application Heuristics (Dynamic algorithms, rolling averages, safety limits)
 * 3. Anime & Progression Fantasy Layer (XP multipliers, Mentors, Bosses)
 */

class EvidenceRegistry {
    constructor() {
        this.registry = this.getEvidenceCatalog();
    }

    getEvidenceCatalog() {
        return [
            {
                ruleId: 'protein-target-resistance-v1',
                version: '1.0',
                category: 'nutrition',
                sourceType: 'guideline_review',
                source: 'ICMR-NIN Dietary Guidelines (2024) / ISSN Position Stand: Diets & Body Comp (2017)',
                population: 'Adults engaged in resistance training / body recomposition',
                guidance: 'Prescribe 1.6 - 2.2g protein per kg bodyweight for lean tissue preservation, recovery, and hypertrophy.',
                confidence: 'HIGH',
                applicationLevel: 'Core Prescription',
                lastReviewed: '2026-09-20',
                formula: 'Daily Protein (g) = Weight (kg) × 1.6 to 2.2 (scaled by lean mass & training intensity)'
            },
            {
                ruleId: 'safe-caloric-deficit-v1',
                version: '1.1',
                category: 'nutrition',
                sourceType: 'clinical_review',
                source: 'Helms et al. (2014) / ISSN Position Stand on Diets & Body Comp (2017)',
                population: 'Adults targeting fat loss with muscle retention',
                guidance: 'Prescribe a configurable deficit targeting 0.5% - 1.0% of body weight loss per week to minimize lean mass catabolism and hormonal down-regulation.',
                confidence: 'HIGH',
                applicationLevel: 'Core Prescription',
                lastReviewed: '2026-09-20',
                formula: 'Deficit % = 10% (conservative / lean) to 25% (higher adiposity / obese), dynamically modulated by recovery'
            },
            {
                ruleId: 'progressive-overload-rir-v1',
                version: '1.0',
                category: 'training',
                sourceType: 'meta_analysis',
                source: 'Schoenfeld et al. (2021) Resistance Training Volume & Hypertrophy Meta-Analysis',
                population: 'Intermediate and recreational lifters',
                guidance: '10 - 20 direct working sets per muscle group per week trained with 1 - 3 Repetitions in Reserve (RIR).',
                confidence: 'HIGH',
                applicationLevel: 'Core Prescription',
                lastReviewed: '2026-09-20',
                formula: 'Weekly Volume = 12-18 sets/muscle group; Intensity = 1-3 RIR (RPE 7-9)'
            },
            {
                ruleId: 'dynamic-readiness-modulation-v1',
                version: '1.0',
                category: 'recovery',
                sourceType: 'heuristic',
                source: 'Multiverse Hunter Dynamic Autonomic Algorithm (Sleep + Energy + Soreness + HRV)',
                population: 'General active users across all fitness levels',
                guidance: 'Reduce training set volume by 25% if recovery score < 10 or sleep < 6.5 hrs; switch to active recovery if severe muscle soreness or red state.',
                confidence: 'MEDIUM',
                applicationLevel: 'Application Heuristic',
                lastReviewed: '2026-09-20',
                formula: 'Readiness Score (1-25) = (Sleep × 1.5) + Energy + Motivation - Soreness - Stress'
            },
            {
                ruleId: 'maintenance-calorie-recovery-period-v1',
                version: '1.0',
                category: 'nutrition',
                sourceType: 'clinical_review',
                source: 'Peos et al. (2019) Intermittent Dieting and Diet Breaks / Trexler et al. (2014)',
                population: 'Individuals experiencing true weight/waist plateaus after prolonged deficit (>4 weeks)',
                guidance: 'Prescribe a conditional Maintenance-Calorie Recovery Period (3-7 days at calculated maintenance) following a full diagnostic check.',
                confidence: 'HIGH',
                applicationLevel: 'Core Prescription',
                lastReviewed: '2026-09-20',
                formula: 'Intervention = Restore caloric intake to estimated actual maintenance (TDEE); hold training load steady'
            },
            {
                ruleId: 'red-flag-emergency-stop-v1',
                version: '1.0',
                category: 'safety',
                sourceType: 'guideline_review',
                source: 'ACSM Guidelines for Exercise Testing & Prescription / AHA Red-Flag Safety Standards',
                population: 'All users engaging in physical activity',
                guidance: 'Immediate cessation of physical exercise recommendations upon reported chest pain, severe dizziness, syncope, or acute joint injury.',
                confidence: 'HIGH',
                applicationLevel: 'Core Prescription',
                lastReviewed: '2026-09-20',
                formula: 'If RedFlagPresent == true -> Suspend training directives + show clinical safety clearance notice'
            },
            {
                ruleId: 'weighted-hunter-progression-v1',
                version: '1.0',
                category: 'gamification',
                sourceType: 'heuristic',
                source: 'Multiverse Hunter Bi-Domain Weighted Progression Model',
                population: 'All registered Hunters',
                guidance: 'Calculate master Hunter Level from 70% Body-Domain XP (Body, Nutrition, Recovery, Discipline) + 30% Life-Domain XP (Mind, Business).',
                confidence: 'HIGH',
                applicationLevel: 'Core Heuristic (Progression)',
                lastReviewed: '2026-09-20',
                formula: 'HunterXP = (BodyDomainXP × 0.70) + (LifeDomainXP × 0.30); prevents farming business XP alone'
            },
            {
                ruleId: 'anime-xp-multiplier-v1',
                version: '1.0',
                category: 'gamification',
                sourceType: 'game_mechanic',
                source: 'Multiverse Hunter RPG Progression Layer',
                population: 'All Hunters',
                guidance: 'Award bonus Discipline/Mind XP and gold upon completing daily boss challenges. Never modifies biological caloric needs or biomechanical safety.',
                confidence: 'GAME_ONLY',
                applicationLevel: 'Anime Layer (Non-Physiological)',
                lastReviewed: '2026-09-20',
                formula: 'Bonus XP = Base XP × Mentor Multiplier (1.10 - 1.25)'
            }
        ];
    }

    getRule(ruleId) {
        return this.registry.find(r => r.ruleId === ruleId);
    }

    getAllRules() {
        return this.registry;
    }

    getRulesByCategory(category) {
        return this.registry.filter(r => r.category === category);
    }

    getScientificRules() {
        return this.registry.filter(r => r.sourceType === 'guideline_review' || r.sourceType === 'clinical_review' || r.sourceType === 'meta_analysis');
    }

    getHeuristics() {
        return this.registry.filter(r => r.sourceType === 'heuristic');
    }

    getGameRules() {
        return this.registry.filter(r => r.sourceType === 'game_mechanic');
    }
}

if (typeof window !== 'undefined') {
    window.evidenceRegistry = new EvidenceRegistry();
}
