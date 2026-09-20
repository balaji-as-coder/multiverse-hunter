/**
 * MULTIVERSE HUNTER — AWAKENING ONBOARDING MODULE
 */
class OnboardingWizardModule {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 10;
        this.init();
    }

    init() {
        const btnStart = document.getElementById('btn-awakening-start');
        if (btnStart) {
            btnStart.addEventListener('click', () => this.showStep(1));
        }

        const btnNext = document.getElementById('btn-wizard-next');
        if (btnNext) {
            btnNext.addEventListener('click', () => this.nextStep());
        }

        const btnPrev = document.getElementById('btn-wizard-prev');
        if (btnPrev) {
            btnPrev.addEventListener('click', () => this.prevStep());
        }

        const btnFinish = document.getElementById('btn-wizard-finish');
        if (btnFinish) {
            btnFinish.addEventListener('click', () => this.finishOnboarding());
        }

        const btnReassess = document.getElementById('btn-reassess-profile');
        if (btnReassess) {
            btnReassess.addEventListener('click', () => this.openWizard(true));
        }

        document.querySelectorAll('.archetype-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.archetype-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                const val = card.dataset.archetype;
                if (document.getElementById('input-physique-archetype')) {
                    document.getElementById('input-physique-archetype').value = val;
                }
                if (window.systemAudio) window.systemAudio.playClick();
            });
        });

        document.querySelectorAll('.realm-select-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                pill.classList.toggle('selected');
                if (window.systemAudio) window.systemAudio.playClick();
            });
        });

        document.querySelectorAll('.diet-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.diet-pill').forEach(p => p.classList.remove('selected'));
                pill.classList.add('selected');
                if (window.systemAudio) window.systemAudio.playClick();
            });
        });
    }

    openWizard(isReassessment = false) {
        const modal = document.getElementById('modal-awakening-protocol');
        if (!modal) return;
        modal.classList.remove('hidden');

        if (isReassessment) {
            document.getElementById('awakening-intro-screen')?.classList.add('hidden');
            document.getElementById('awakening-wizard-content')?.classList.remove('hidden');
            this.showStep(1);
        } else {
            document.getElementById('awakening-intro-screen')?.classList.remove('hidden');
            document.getElementById('awakening-wizard-content')?.classList.add('hidden');
        }
    }

    showStep(stepNum) {
        this.currentStep = stepNum;
        document.getElementById('awakening-intro-screen')?.classList.add('hidden');
        document.getElementById('awakening-wizard-content')?.classList.remove('hidden');

        document.querySelectorAll('.wizard-step-panel').forEach(panel => {
            panel.classList.add('hidden');
        });

        const activePanel = document.getElementById(`wizard-step-${stepNum}`);
        if (activePanel) activePanel.classList.remove('hidden');

        const pct = Math.round(((stepNum) / this.totalSteps) * 100);
        const bar = document.getElementById('wizard-progress-bar');
        if (bar) bar.style.width = `${pct}%`;

        const stepText = document.getElementById('wizard-step-indicator');
        if (stepText) stepText.innerText = `STEP ${stepNum} OF ${this.totalSteps}`;

        const btnPrev = document.getElementById('btn-wizard-prev');
        const btnNext = document.getElementById('btn-wizard-next');
        const btnFinish = document.getElementById('btn-wizard-finish');

        if (btnPrev) btnPrev.style.display = (stepNum === 1) ? 'none' : 'inline-block';
        if (btnNext) btnNext.style.display = (stepNum === this.totalSteps) ? 'none' : 'inline-block';
        if (btnFinish) btnFinish.style.display = (stepNum === this.totalSteps) ? 'inline-block' : 'none';

        if (window.systemAudio) window.systemAudio.playClick();
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.showStep(this.currentStep + 1);
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }

    finishOnboarding() {
        const s = window.systemState.data;

        s.player.name = document.getElementById('ob-hunter-name')?.value.trim() || 'Hunter';
        s.assessment.age = parseInt(document.getElementById('ob-age')?.value) || 24;
        s.assessment.sex = document.getElementById('ob-sex')?.value || 'male';
        s.assessment.heightCm = parseFloat(document.getElementById('ob-height')?.value) || 175;
        s.assessment.currentWeightKg = parseFloat(document.getElementById('ob-weight')?.value) || 75;
        s.assessment.targetWeightKg = parseFloat(document.getElementById('ob-target-weight')?.value) || 70;

        s.assessment.waistCm = parseFloat(document.getElementById('ob-waist')?.value) || 86;
        s.assessment.chestCm = parseFloat(document.getElementById('ob-chest')?.value) || 96;
        s.assessment.shoulderCm = parseFloat(document.getElementById('ob-shoulder')?.value) || 110;

        const selectedArch = document.querySelector('.archetype-card.selected')?.dataset.archetype || 'vtaper';
        s.assessment.physiqueArchetype = selectedArch;

        s.awakened = true;
        s.player.activePhase = 'FOUNDATION';

        window.systemState.calculateAdaptiveTDEE();
        if (window.smartMealGenerator) {
            window.smartMealGenerator.buildDailyMealsFromList(s.assessment.availableIngredientsToday || ['eggs', 'rice', 'dal', 'paneer', 'roti']);
        }

        window.systemState.gainTrackXp('disciplineXp', 200, 'Completed System Awakening Assessment');
        window.systemState.save();

        document.getElementById('modal-awakening-protocol')?.classList.add('hidden');
        if (window.systemAudio) window.systemAudio.playLevelUp();
        if (window.app) {
            window.app.showToast('SYSTEM AWAKENED', `Welcome Hunter ${s.player.name}. Adaptive Evolution Protocol is live!`);
            window.app.syncUI();
        }
    }
}

window.onboardingWizard = new OnboardingWizardModule();
