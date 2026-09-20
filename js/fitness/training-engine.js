/**
 * MULTIVERSE HUNTER — TRAINING ENGINE (FITNESS MODULE)
 */
class TrainingEngineModule {
    constructor() {
        this.activeRealm = 'gym';
        this.init();
    }

    init() {
        document.querySelectorAll('.training-realm-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                const realm = btn.dataset.realm;
                this.switchRealm(realm);
            });
        });

        const btnSwap = document.getElementById('btn-swap-gym-home');
        if (btnSwap) {
            btnSwap.addEventListener('click', () => this.convertGymToHome());
        }

        const btnClear = document.getElementById('btn-complete-workout');
        if (btnClear) {
            btnClear.addEventListener('click', () => this.clearWorkout());
        }
    }

    switchRealm(realm) {
        this.activeRealm = realm;
        window.systemState.data.training.activeRealm = realm;
        document.querySelectorAll('.training-realm-tab').forEach(b => {
            b.classList.toggle('active', b.dataset.realm === realm);
        });
        document.querySelectorAll('.realm-view-panel').forEach(p => {
            p.classList.toggle('hidden', p.dataset.realm !== realm);
        });
        if (window.systemAudio) window.systemAudio.playClick();
    }

    convertGymToHome() {
        this.switchRealm('home');
        if (window.app) {
            window.app.showToast('WORKOUT CONVERTED', 'Gym session adapted to Home Dumbbell & Bodyweight movements!');
            window.app.syncUI();
        }
        if (window.systemAudio) window.systemAudio.playGateEnter();
    }

    clearWorkout() {
        const s = window.systemState.data;
        if (s.training.todayCompleted) {
            if (window.app) window.app.showToast('ALREADY CLEARED', "Today's workout protocol is already cleared!");
            return;
        }
        s.training.todayCompleted = true;
        s.stats.str += 1;
        s.stats.vit += 1;
        window.systemState.gainTrackXp('bodyXp', 350, 'Cleared Scheduled Workout Protocol');

        if (window.systemAudio) window.systemAudio.playQuestComplete();
        if (window.app) {
            window.app.showToast('WORKOUT CLEARED', '+350 Body XP! +1 STR, +1 VIT allocated to Hunter.');
            window.app.syncUI();
        }
    }
}

window.trainingEngine = new TrainingEngineModule();
