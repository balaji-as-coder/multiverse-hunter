/**
 * MULTIVERSE HUNTER — RULE VERSION SCHEMA
 * Validates and tracks health, training, nutrition, and gamification rules.
 */

class RuleVersion {
    constructor({
        ruleId,
        version = '1.0',
        category,          // 'nutrition' | 'training' | 'recovery' | 'safety' | 'gamification'
        sourceType,        // 'guideline_review' | 'clinical_review' | 'meta_analysis' | 'heuristic' | 'game_mechanic'
        source,
        retrievedAt = '2026-09-20',
        population,
        confidence = 'HIGH', // 'HIGH' | 'MEDIUM' | 'LOW' | 'GAME_ONLY'
        applicationLevel,  // 'Core Prescription' | 'Application Heuristic' | 'Anime Layer (Non-Physiological)'
        lastReviewed = '2026-09-20',
        description = '',
        formula = ''
    }) {
        this.ruleId = ruleId;
        this.version = version;
        this.category = category;
        this.sourceType = sourceType;
        this.source = source;
        this.retrievedAt = retrievedAt;
        this.population = population;
        this.confidence = confidence;
        this.applicationLevel = applicationLevel;
        this.lastReviewed = lastReviewed;
        this.description = description;
        this.formula = formula;
    }

    isEvidenceBased() {
        return this.sourceType === 'guideline_review' || 
               this.sourceType === 'clinical_review' || 
               this.sourceType === 'meta_analysis';
    }

    isGameOnly() {
        return this.sourceType === 'game_mechanic' || this.confidence === 'GAME_ONLY';
    }
}

if (typeof window !== 'undefined') {
    window.RuleVersion = RuleVersion;
}
