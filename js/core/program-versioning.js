/**
 * MULTIVERSE HUNTER — PROGRAM VERSIONING ENGINE
 * Stores immutable history of client assessments and generated plans:
 * Client
 *  ├── Assessment v1
 *  ├── Plan v1
 *  ├── Plan v2
 *  ├── Plan v3
 *  └── Current Plan
 */

class ProgramVersioningEngine {
    constructor() {
        this.STORAGE_KEY = 'MULTIVERSE_HUNTER_PLAN_VERSIONS_V3';
        this.versions = this.loadVersions();
    }

    loadVersions() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.error('ProgramVersioningEngine load error:', e);
        }
        return this.getSeedVersions();
    }

    saveVersions() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.versions));
        } catch (e) {
            console.error('ProgramVersioningEngine save error:', e);
        }
    }

    getSeedVersions() {
        return {
            hunter_main: {
                assessments: [
                    {
                        version: 1,
                        createdAt: '2026-09-14T08:00:00.000Z',
                        weightKg: 78.0,
                        waistCm: 88,
                        phase: 'FOUNDATION',
                        goal: 'V-Taper Aesthetics + Recomp'
                    }
                ],
                plans: [
                    {
                        version: 1,
                        createdAt: '2026-09-14T08:05:00.000Z',
                        phase: 'FOUNDATION',
                        targetCalories: 2100,
                        proteinTarget: 145,
                        trainingSplit: '4-Day Hypertrophy & Calisthenics',
                        reason: 'Initial onboarding calibration based on assessment data.'
                    },
                    {
                        version: 2,
                        createdAt: '2026-09-19T10:00:00.000Z',
                        phase: 'RECOMPOSITION',
                        targetCalories: 2100,
                        proteinTarget: 150,
                        trainingSplit: '4-Day V-Taper Focus (Lat Width + Upper Chest)',
                        reason: 'Upgraded volume for Upper Chest & Lat Pulldowns following successful Foundation completion.'
                    }
                ],
                currentPlanVersion: 2
            }
        };
    }

    createPlanVersion(clientId, planData, reason = 'Automated periodic adaptation') {
        if (!this.versions[clientId]) {
            this.versions[clientId] = {
                assessments: [],
                plans: [],
                currentPlanVersion: 0
            };
        }

        const clientStore = this.versions[clientId];
        const nextVer = clientStore.plans.length + 1;
        const newVersion = {
            version: nextVer,
            createdAt: new Date().toISOString(),
            phase: planData.phase || 'RECOMPOSITION',
            targetCalories: planData.targetCalories || 2100,
            proteinTarget: planData.proteinTarget || 145,
            trainingSplit: planData.trainingSplit || '4-Day Adaptive Split',
            details: planData,
            reason
        };

        clientStore.plans.push(newVersion);
        clientStore.currentPlanVersion = nextVer;
        this.saveVersions();

        // Also record in audit trail
        if (window.auditTrail) {
            window.auditTrail.logAdjustment(
                `PROGRAM_VERSION_CREATED_v${nextVer}`,
                reason,
                { phase: newVersion.phase, targetCalories: newVersion.targetCalories },
                `Generated Program Version v${nextVer}`,
                'PROGRAM_VERSIONING_ENGINE'
            );
        }

        return newVersion;
    }

    getClientHistory(clientId) {
        return this.versions[clientId] || { assessments: [], plans: [], currentPlanVersion: 0 };
    }
}

if (typeof window !== 'undefined') {
    window.programVersioning = new ProgramVersioningEngine();
}
