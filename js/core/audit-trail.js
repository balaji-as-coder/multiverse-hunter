/**
 * MULTIVERSE HUNTER — AUDIT TRAIL ENGINE
 * Records every automated plan change, adjustment, diagnostic conclusion,
 * and safety override with timestamps, reasons, and actions.
 */

class AuditTrailSystem {
    constructor() {
        this.STORAGE_KEY = 'MULTIVERSE_HUNTER_AUDIT_LOGS_V3';
        this.logs = this.loadLogs();
    }

    loadLogs() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.error('AuditTrailSystem load error:', e);
        }
        return this.getSeedLogs();
    }

    saveLogs() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
        } catch (e) {
            console.error('AuditTrailSystem save error:', e);
        }
    }

    getSeedLogs() {
        return [
            {
                id: 'audit_init_001',
                timestamp: '2026-09-14T08:00:00.000Z',
                event: 'SYSTEM_CALIBRATION',
                reason: 'Hunter Awakening & Baseline Biometric Assessment completed',
                diagnosticMetrics: { weightKg: 78.0, waistCm: 88, targetCalories: 2100 },
                actionTaken: 'Initialized Foundation Phase with 4-day resistance split and 2,100 kcal target.',
                actor: 'AWAKENING_WIZARD'
            },
            {
                id: 'audit_adj_002',
                timestamp: '2026-09-18T18:30:00.000Z',
                event: 'RECOVERY_VOLUME_MODULATION',
                reason: 'Subjective soreness score 4/5 + sleep duration 5.8 hrs',
                diagnosticMetrics: { sleepHours: 5.8, sorenessScore: 4, readinessState: 'YELLOW' },
                actionTaken: 'Working sets reduced by 25% for upper body push session to prevent maladaptation.',
                actor: 'DECISION_ENGINE'
            }
        ];
    }

    logAdjustment(event, reason, diagnosticMetrics = {}, actionTaken = '', actor = 'DECISION_ENGINE') {
        const entry = {
            id: 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            timestamp: new Date().toISOString(),
            event,
            reason,
            diagnosticMetrics,
            actionTaken,
            actor
        };

        this.logs.unshift(entry);
        if (this.logs.length > 200) this.logs.pop(); // Keep last 200 events
        this.saveLogs();
        return entry;
    }

    getAllLogs() {
        return this.logs;
    }

    getLogsForClient(clientId) {
        return this.logs.filter(l => !l.clientId || l.clientId === clientId);
    }
}

if (typeof window !== 'undefined') {
    window.auditTrail = new AuditTrailSystem();
}
