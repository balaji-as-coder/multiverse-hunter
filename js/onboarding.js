/**
 * MULTIVERSE HUNTER — AWAKENING PROTOCOL & 10-STEP ONBOARDING WIZARD
 * Guides the user through a cinematic Awakening assessment to forge
 * their personalized Hunter Profile, calculate TDEE, assign starting archetype,
 * configure 4 training realms, and generate the first 30-Day Adaptive Arc.
 */

class OnboardingWizard {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 10;
        this.formData = {};
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Modal buttons
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

        // Physique Archetype Selector Cards
        document.querySelectorAll('.archetype-card').forEach(card => {
            card.addEventListener('click', (e) => {
                document.querySelectorAll('.archetype-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                const val = card.dataset.archetype;
                if (document.getElementById('input-physique-archetype')) {
                    document.getElementById('input-physique-archetype').value = val;
                }
                if (window.systemAudio) window.systemAudio.playClick();
            });
        });

        // Realm Multi-Select Toggles
        document.querySelectorAll('.realm-select-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                pill.classList.toggle('selected');
                if (window.systemAudio) window.systemAudio.playClick();
            });
        });

        // Diet Preference Pills
        document.querySelectorAll('.diet-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.diet-pill').forEach(p => p.classList.remove('selected'));
                pill.classList.add('selected');
                if (document.getElementById('input-diet-type')) {
                    document.getElementById('input-diet-type').value = pill.dataset.diet;
                }
                if (window.systemAudio) window.systemAudio.playClick();
            });
        });
    }

    openWizard(isReassessment = false) {
        const modal = document.getElementById('modal-awakening-protocol');
        if (!modal) return;
        modal.classList.remove('hidden');

        if (isReassessment) {
            document.getElementById('awakening-intro-screen').classList.add('hidden');
            document.getElementById('awakening-wizard-content').classList.remove('hidden');
            this.populateFromState();
            this.showStep(1);
        } else {
            document.getElementById('awakening-intro-screen').classList.remove('hidden');
            document.getElementById('awakening-wizard-content').classList.add('hidden');
        }
    }

    showStep(stepNum) {
        this.currentStep = stepNum;
        document.getElementById('awakening-intro-screen').classList.add('hidden');
        document.getElementById('awakening-wizard-content').classList.remove('hidden');

        // Hide all step containers
        document.querySelectorAll('.wizard-step-panel').forEach(panel => {
            panel.classList.add('hidden');
        });

        const activePanel = document.getElementById(`wizard-step-${stepNum}`);
        if (activePanel) {
            activePanel.classList.remove('hidden');
        }

        // Update progress bar & counters
        const pct = Math.round(((stepNum) / this.totalSteps) * 100);
        const bar = document.getElementById('wizard-progress-bar');
        if (bar) bar.style.width = `${pct}%`;

        const stepText = document.getElementById('wizard-step-indicator');
        if (stepText) stepText.innerText = `STEP ${stepNum} OF ${this.totalSteps}`;

        // Toggle buttons
        const btnPrev = document.getElementById('btn-wizard-prev');
        const btnNext = document.getElementById('btn-wizard-next');
        const btnFinish = document.getElementById('btn-wizard-finish');

        if (btnPrev) btnPrev.style.display = (stepNum === 1) ? 'none' : 'inline-block';
        if (btnNext) btnNext.style.display = (stepNum === this.totalSteps) ? 'none' : 'inline-block';
        if (btnFinish) btnFinish.style.display = (stepNum === this.totalSteps) ? 'inline-block' : 'none';

        if (window.systemAudio) window.systemAudio.playClick();
    }

    nextStep() {
        if (!this.validateCurrentStep()) return;
        if (this.currentStep < this.totalSteps) {
            this.showStep(this.currentStep + 1);
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }

    validateCurrentStep() {
        // Basic sanity validation per step
        if (this.currentStep === 1) {
            const name = document.getElementById('ob-hunter-name')?.value.trim();
            if (!name) {
                alert('Hunter, please provide your protagonist name to continue.');
                return false;
            }
        }
        return true;
    }

    populateFromState() {
        const s = window.systemState.data;
        const a = s.assessment;

        if (document.getElementById('ob-hunter-name')) document.getElementById('ob-hunter-name').value = s.player.name;
        if (document.getElementById('ob-age')) document.getElementById('ob-age').value = a.age;
        if (document.getElementById('ob-sex')) document.getElementById('ob-sex').value = a.sex;
        if (document.getElementById('ob-height')) document.getElementById('ob-height').value = a.heightCm;
        if (document.getElementById('ob-weight')) document.getElementById('ob-weight').value = a.currentWeightKg;
        if (document.getElementById('ob-target-weight')) document.getElementById('ob-target-weight').value = a.targetWeightKg;

        if (document.getElementById('ob-waist')) document.getElementById('ob-waist').value = a.waistCm;
        if (document.getElementById('ob-chest')) document.getElementById('ob-chest').value = a.chestCm;
        if (document.getElementById('ob-shoulder')) document.getElementById('ob-shoulder').value = a.shoulderCm;
        if (document.getElementById('ob-arm')) document.getElementById('ob-arm').value = a.armCm;
        if (document.getElementById('ob-hip')) document.getElementById('ob-hip').value = a.hipCm;
        if (document.getElementById('ob-thigh')) document.getElementById('ob-thigh').value = a.thighCm;

        // Select archetype card
        document.querySelectorAll('.archetype-card').forEach(card => {
            if (card.dataset.archetype === a.physiqueArchetype) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    }

    finishOnboarding() {
        const s = window.systemState.data;

        // Step 1: Identity & Biometrics
        s.player.name = document.getElementById('ob-hunter-name')?.value.trim() || 'Hunter Protagonist';
        s.assessment.age = parseInt(document.getElementById('ob-age')?.value) || 24;
        s.assessment.sex = document.getElementById('ob-sex')?.value || 'male';
        s.assessment.heightCm = parseFloat(document.getElementById('ob-height')?.value) || 175;
        s.assessment.currentWeightKg = parseFloat(document.getElementById('ob-weight')?.value) || 75;
        s.assessment.targetWeightKg = parseFloat(document.getElementById('ob-target-weight')?.value) || 70;

        // Step 2: Measurements
        s.assessment.waistCm = parseFloat(document.getElementById('ob-waist')?.value) || 86;
        s.assessment.chestCm = parseFloat(document.getElementById('ob-chest')?.value) || 96;
        s.assessment.shoulderCm = parseFloat(document.getElementById('ob-shoulder')?.value) || 110;
        s.assessment.armCm = parseFloat(document.getElementById('ob-arm')?.value) || 32;
        s.assessment.hipCm = parseFloat(document.getElementById('ob-hip')?.value) || 95;
        s.assessment.thighCm = parseFloat(document.getElementById('ob-thigh')?.value) || 55;
        s.assessment.bodyFatPct = parseFloat(document.getElementById('ob-bodyfat')?.value) || 20;

        // Step 3: Goal Archetype
        const selectedArch = document.querySelector('.archetype-card.selected')?.dataset.archetype || 'vtaper';
        s.assessment.physiqueArchetype = selectedArch;
        s.assessment.primaryObjective = document.getElementById('ob-primary-objective')?.value || 'V-Taper Aesthetics';
        s.assessment.secondaryObjective = document.getElementById('ob-secondary-objective')?.value || 'Fat Loss & Recomposition';
        s.assessment.timelineWeeks = parseInt(document.getElementById('ob-timeline')?.value) || 12;

        // Step 4: Realms & Equipment
        const realms = [];
        document.querySelectorAll('.realm-select-pill.selected').forEach(p => {
            realms.push(p.dataset.realm);
        });
        s.assessment.trainingRealms = realms.length ? realms : ['gym', 'home', 'ground', 'calisthenics'];

        // Step 5: Capabilities
        s.assessment.fitnessLevel = document.getElementById('ob-fitness-level')?.value || 'beginner';
        s.assessment.capabilities.pushups = parseInt(document.getElementById('ob-cap-pushups')?.value) || 15;
        s.assessment.capabilities.squats = parseInt(document.getElementById('ob-cap-squats')?.value) || 25;
        s.assessment.capabilities.pullups = parseInt(document.getElementById('ob-cap-pullups')?.value) || 2;
        s.assessment.capabilities.plankSec = parseInt(document.getElementById('ob-cap-plank')?.value) || 45;
        s.assessment.capabilities.runningKm = parseFloat(document.getElementById('ob-cap-run-km')?.value) || 2.0;

        // Step 6: Schedule
        s.assessment.daysPerWeek = parseInt(document.getElementById('ob-days-week')?.value) || 4;
        s.assessment.minutesPerSession = parseInt(document.getElementById('ob-mins-session')?.value) || 50;
        s.assessment.preferredTime = document.getElementById('ob-pref-time')?.value || 'evening';

        // Step 7: Nutrition & Indian Foods
        const selectedDiet = document.querySelector('.diet-pill.selected')?.dataset.diet || 'non_veg';
        s.assessment.dietType = selectedDiet;
        s.assessment.mealFrequency = parseInt(document.getElementById('ob-meal-freq')?.value) || 3;
        s.assessment.foodBudget = document.getElementById('ob-food-budget')?.value || 'medium';
        s.assessment.cookPreference = document.getElementById('ob-cook-pref')?.value || 'self';

        // Step 8: Safety & Limitations
        const injuryCheck = document.getElementById('ob-injury-toggle')?.checked || false;
        s.assessment.hasInjuries = injuryCheck;
        s.assessment.injuryDetails = document.getElementById('ob-injury-details')?.value || 'None';

        // Step 9: Life & Business
        s.assessment.timeAllocation.fitness = parseInt(document.getElementById('ob-alloc-fitness')?.value) || 25;
        s.assessment.timeAllocation.learning = parseInt(document.getElementById('ob-alloc-learning')?.value) || 35;
        s.assessment.timeAllocation.business = parseInt(document.getElementById('ob-alloc-business')?.value) || 25;
        s.assessment.timeAllocation.life = parseInt(document.getElementById('ob-alloc-life')?.value) || 15;

        // Mark awakened
        s.awakened = true;

        // Recalculate TDEE, targets, meal distribution, and training plan
        window.systemState.calculateTDEE();
        if (window.trainingEngine) window.trainingEngine.generateWeeklySchedule();
        if (window.nutritionEngine) window.nutritionEngine.generateDailyMeals();
        if (window.recoveryEngine) window.recoveryEngine.recalculateHealthIndex();

        window.systemState.gainXp(150, 'Completed System Awakening Assessment');
        window.systemState.save();

        // Close modal and play fanfare
        document.getElementById('modal-awakening-protocol')?.classList.add('hidden');
        if (window.systemAudio) window.systemAudio.playLevelUp();
        if (window.app) {
            window.app.showToast('SYSTEM AWAKENED', `Welcome Hunter ${s.player.name}. Personalized Evolution Plan Active!`);
            window.app.syncUI();
        }
    }
}

// Instantiate
window.onboardingWizard = new OnboardingWizard();
