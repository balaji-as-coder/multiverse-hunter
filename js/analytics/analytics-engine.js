/**
 * MULTIVERSE HUNTER — ANALYTICS MODULE
 */
class AnalyticsEngineModule {
    constructor() {
        this.init();
    }

    init() {
        const btnLogMeas = document.getElementById('btn-open-log-measurement');
        if (btnLogMeas) {
            btnLogMeas.addEventListener('click', () => {
                document.getElementById('modal-log-measurement')?.classList.remove('hidden');
            });
        }

        const formMeas = document.getElementById('form-log-measurement');
        if (formMeas) {
            formMeas.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveMeasurementEntry();
            });
        }
    }

    saveMeasurementEntry() {
        const s = window.systemState.data;
        const w = parseFloat(document.getElementById('meas-weight')?.value) || s.assessment.currentWeightKg;
        const waist = parseFloat(document.getElementById('meas-waist')?.value) || s.assessment.waistCm;
        const notes = document.getElementById('meas-notes')?.value || 'Periodic Check-In';

        s.assessment.currentWeightKg = w;
        s.assessment.waistCm = waist;

        if (!s.progressHistory) s.progressHistory = { weightLogs: [] };
        const history = s.progressHistory.weightLogs;
        const lastFew = history.slice(-4).map(h => h.weight);
        lastFew.push(w);
        const rollingAvg = +(lastFew.reduce((a, b) => a + b, 0) / lastFew.length).toFixed(1);

        const newLog = {
            date: new Date().toISOString().split('T')[0],
            weight: w,
            waist: waist,
            rollingAvg: rollingAvg,
            note: notes
        };

        history.push(newLog);
        s.tdeeModel.rolling7DayAvgWeight = rollingAvg;
        window.systemState.calculateAdaptiveTDEE();
        window.systemState.gainTrackXp('bodyXp', 180, 'Logged Biometric Progress Delta');

        document.getElementById('modal-log-measurement')?.classList.add('hidden');
        if (window.systemAudio) window.systemAudio.playStatAdd();
        if (window.app) {
            window.app.showToast('MEASUREMENT LOGGED', `Weight: ${w}kg | Waist: ${waist}cm | Rolling Avg: ${rollingAvg}kg`);
            window.app.syncUI();
        }
    }
}

window.analyticsEngine = new AnalyticsEngineModule();
