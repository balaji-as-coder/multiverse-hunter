/**
 * MULTIVERSE HUNTER — DATA CONFIDENCE SYSTEM
 * Evaluates the reliability and precision of user inputs and telemetry before
 * allowing the Decision Engine to enact significant plan adaptations.
 *
 * Metric Confidence Hierarchy:
 * - Smartwatch Telemetry (Resting HR, Steps, Sleep Duration): HIGH (direct sensor capture)
 * - Calibrated Scale Weight: HIGH (objective quantitative metric)
 * - Weighed Food Intake: MEDIUM (reliable but subject to minor label/cooking variances)
 * - Self-Reported RPE / Soreness / Stress: MEDIUM (subjective ordinal scale)
 * - Progress Photos: MEDIUM (subject to lighting, hydration, and posture)
 * - Caliper / Bio-impedance Body-Fat Estimate: LOW (high error margin ±3-5%)
 *
 * Core Decision Rule:
 * "Never trigger a major plan change (e.g. aggressive caloric cut or drastic deload)
 * based on a single low-confidence or unconfirmed measurement."
 */

class DataConfidenceSystem {
    constructor() {
        this.confidenceRatings = {
            SMARTWATCH_HR: { level: 'HIGH', score: 0.95, desc: 'Direct sensor optical telemetry' },
            DAILY_WEIGHT: { level: 'HIGH', score: 0.90, desc: 'Digital scale measurement (rolling 7-day average)' },
            DAILY_STEPS: { level: 'HIGH', score: 0.90, desc: 'Accelerometer / step counter' },
            FOOD_INTAKE: { level: 'MEDIUM', score: 0.75, desc: 'Self-logged weighed meals' },
            SELF_REPORTED_RPE: { level: 'MEDIUM', score: 0.70, desc: 'Subjective rate of perceived exertion' },
            RECOVERY_SCORES: { level: 'MEDIUM', score: 0.70, desc: 'Self-reported sleep quality and soreness (1-5)' },
            PROGRESS_PHOTOS: { level: 'MEDIUM', score: 0.65, desc: 'Visual composition check' },
            BODY_FAT_ESTIMATE: { level: 'LOW', score: 0.40, desc: 'Single-point caliper or BIA scale calculation' }
        };
    }

    getMetricConfidence(metricKey) {
        return this.confidenceRatings[metricKey] || { level: 'MEDIUM', score: 0.60, desc: 'Standard user entry' };
    }

    /**
     * Assesses whether a set of metrics is confident enough to justify a major plan change.
     * Requires either:
     * 1. At least one HIGH confidence metric confirmed over >= 7-14 days, OR
     * 2. Multiple concurring MEDIUM confidence metrics across >= 2 domains (e.g. weight + waist + steps).
     */
    canTriggerMajorPlanChange(metricObservations = []) {
        if (!metricObservations.length) return { allowed: false, reason: 'Insufficient telemetry data' };

        let totalConfidenceScore = 0;
        let hasHighConfidence = false;
        let consecutiveDays = 0;

        metricObservations.forEach(obs => {
            const conf = this.getMetricConfidence(obs.metricKey);
            totalConfidenceScore += conf.score;
            if (conf.level === 'HIGH') hasHighConfidence = true;
            if (obs.daysTracked) consecutiveDays = Math.max(consecutiveDays, obs.daysTracked);
        });

        const avgScore = totalConfidenceScore / metricObservations.length;

        // Condition 1: High confidence metric with at least 7 days of rolling data
        if (hasHighConfidence && consecutiveDays >= 7) {
            return {
                allowed: true,
                confidenceGrade: 'HIGH',
                reason: `Validated by ${consecutiveDays} days of high-confidence objective tracking.`
            };
        }

        // Condition 2: Multiple concurring medium metrics with at least 14 days
        if (avgScore >= 0.65 && consecutiveDays >= 14) {
            return {
                allowed: true,
                confidenceGrade: 'MEDIUM_CONFIRMED',
                reason: `Multi-signal convergence confirmed across ${consecutiveDays} days of consistent logging.`
            };
        }

        return {
            allowed: false,
            confidenceGrade: 'INSUFFICIENT_CONFIDENCE',
            reason: `Data confidence score (${(avgScore * 100).toFixed(0)}%) or time horizon (${consecutiveDays} days) is insufficient for major program adjustments. Collecting further rolling data.`
        };
    }
}

if (typeof window !== 'undefined') {
    window.dataConfidenceSystem = new DataConfidenceSystem();
}
