/**
 * MULTIVERSE HUNTER — EMERGENCY STOP & SAFETY OVERRIDE
 * Immediate cessation of physical exercise recommendations upon reported red-flag symptoms.
 * Shows a serious, non-gamified medical alert.
 */

class EmergencyStopSystem {
    constructor() {
        this.RED_FLAGS = [
            { id: 'chest_pain', label: 'Chest pain, tightness, or pressure' },
            { id: 'fainting', label: 'Fainting, near-syncope, or loss of consciousness' },
            { id: 'severe_dizziness', label: 'Severe dizziness or sudden loss of balance' },
            { id: 'acute_injury', label: 'Acute joint injury, severe sharp pain, or swelling' },
            { id: 'severe_shortness_of_breath', label: 'Disproportionate or severe shortness of breath at rest' },
            { id: 'irregular_heartbeat', label: 'Sudden irregular heartbeat or palpitations with discomfort' }
        ];

        this.init();
    }

    init() {
        // Event delegation for opening the safety screening modal
        document.addEventListener('click', (e) => {
            const btnOpen = e.target.closest('#btn-open-emergency-stop, .btn-trigger-safety-screen');
            if (btnOpen) this.openEmergencyModal();

            const btnClear = e.target.closest('#btn-clear-emergency-stop');
            if (btnClear) this.clearEmergencyStop();

            const btnSubmitRedFlag = e.target.closest('#btn-submit-red-flags');
            if (btnSubmitRedFlag) this.handleRedFlagSubmission();
        });
    }

    isStopActive() {
        const s = window.systemState?.data;
        return !!(s && s.emergencyStopActive);
    }

    triggerStop(reportedSymptomNames = []) {
        const s = window.systemState.data;
        s.emergencyStopActive = true;
        s.emergencyStopDetails = {
            timestamp: new Date().toISOString(),
            symptoms: reportedSymptomNames,
            status: 'STOPPED'
        };

        // Record immutable audit log
        if (window.auditTrail) {
            window.auditTrail.logAdjustment(
                'EMERGENCY_STOP_ACTIVATED',
                `User reported safety red-flags: ${reportedSymptomNames.join(', ')}`,
                { symptoms: reportedSymptomNames },
                'Immediate suspension of all physical training prescriptions. Recommend medical clearance.',
                'SAFETY_SYSTEM'
            );
        }

        window.systemState.save();

        if (window.app) {
            window.app.showToast('⚠ SAFETY OVERRIDE', 'Training suspended. Clinical safety protocol activated.');
            window.app.syncUI();
        }

        this.renderEmergencyNotice();
    }

    clearEmergencyStop() {
        const s = window.systemState.data;
        s.emergencyStopActive = false;
        s.emergencyStopDetails = null;

        if (window.auditTrail) {
            window.auditTrail.logAdjustment(
                'EMERGENCY_STOP_RESOLVED',
                'User/Coach confirmed medical clearance / symptom resolution.',
                {},
                'Physical exercise prescriptions restored.',
                'USER_MANUAL_CLEARANCE'
            );
        }

        window.systemState.save();

        const modal = document.getElementById('modal-emergency-stop');
        if (modal) modal.classList.add('hidden');

        if (window.app) {
            window.app.showToast('SYSTEM RESTORED', 'Normal training protocols re-enabled.');
            window.app.syncUI();
        }
    }

    openEmergencyModal() {
        const modal = document.getElementById('modal-emergency-stop');
        if (!modal) return;

        const bodyEl = document.getElementById('emergency-modal-body');
        if (bodyEl) {
            const isActive = this.isStopActive();
            if (isActive) {
                const details = window.systemState.data.emergencyStopDetails || {};
                bodyEl.innerHTML = `
                    <div class="emergency-active-box">
                        <div class="emergency-badge-red">⚠ SYSTEM OVERRIDE — SAFETY PROTOCOL ACTIVE</div>
                        <h3 class="emergency-title mt-15">Exercise Directives Suspended</h3>
                        <p class="emergency-text mt-10">
                            You previously reported the following symptoms on <strong>${new Date(details.timestamp || Date.now()).toLocaleString()}</strong>:
                        </p>
                        <ul class="emergency-symptom-list mt-10">
                            ${(details.symptoms || []).map(sym => `<li>⚠️ ${sym}</li>`).join('')}
                        </ul>
                        <div class="emergency-medical-notice mt-15">
                            <strong>IMPORTANT CLINICAL NOTICE:</strong><br/>
                            Please seek professional medical evaluation or clearance before resuming intense exercise.
                        </div>
                        <div class="mt-20 text-center">
                            <button id="btn-clear-emergency-stop" class="btn btn-warning">I Have Received Medical Clearance / Symptoms Resolved</button>
                        </div>
                    </div>
                `;
            } else {
                bodyEl.innerHTML = `
                    <div class="emergency-screening-box">
                        <div class="emergency-badge-warning">HEALTH & SAFETY SCREENING</div>
                        <h4 class="mt-10">Are you experiencing any of the following symptoms?</h4>
                        <p class="text-muted font-12 mt-5">Select any that apply. If you check any symptom, training recommendations will be immediately suspended for your protection.</p>
                        <div class="red-flag-checkboxes mt-15">
                            ${this.RED_FLAGS.map(rf => `
                                <label class="red-flag-item">
                                    <input type="checkbox" name="red_flag" value="${rf.label}">
                                    <span>${rf.label}</span>
                                </label>
                            `).join('')}
                        </div>
                        <div class="mt-20 text-right">
                            <button id="btn-submit-red-flags" class="btn btn-danger">Confirm Status</button>
                        </div>
                    </div>
                `;
            }
        }

        modal.classList.remove('hidden');
    }

    handleRedFlagSubmission() {
        const checked = Array.from(document.querySelectorAll('input[name="red_flag"]:checked')).map(cb => cb.value);
        if (checked.length > 0) {
            this.triggerStop(checked);
            this.openEmergencyModal(); // Refresh to show active stop state
        } else {
            const modal = document.getElementById('modal-emergency-stop');
            if (modal) modal.classList.add('hidden');
            if (window.app) window.app.showToast('SAFETY CHECK PASSED', 'No red-flag symptoms reported. Training cleared.');
        }
    }

    renderEmergencyNotice() {
        // Look for the workout recommendation section and inject serious safety alert if stopped
        const container = document.getElementById('workout-routine-container');
        if (container && this.isStopActive()) {
            container.innerHTML = `
                <div class="emergency-lockout-banner">
                    <div class="lockout-header">⚠ SYSTEM OVERRIDE: PHYSICAL EXERCISE DIRECTIVES SUSPENDED</div>
                    <p class="mt-10 font-14 text-white">
                        Due to reported acute symptoms (chest pain, dizziness, fainting, or acute injury), regular workouts are locked.
                    </p>
                    <p class="font-12 text-muted mt-5">
                        Please consult a qualified healthcare provider. Focus exclusively on hydration, gentle nutrition, and rest.
                    </p>
                    <div class="mt-15">
                        <button class="btn btn-sm btn-secondary btn-trigger-safety-screen">Review / Update Safety Status</button>
                    </div>
                </div>
            `;
        }
    }
}

if (typeof window !== 'undefined') {
    window.emergencyStopSystem = new EmergencyStopSystem();
}
