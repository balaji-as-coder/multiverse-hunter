/**
 * MULTIVERSE HUNTER — TRAINING ENGINE & 4 REALMS
 * Generates dynamic tailored workout plans across:
 * 1. 🏋️ Gym Realm (Hypertrophy, Strength, V-Taper, PPL, Upper/Lower)
 * 2. 🏠 Home Realm (Bodyweight, Dumbbells, Hybrid)
 * 3. 🌳 Ground Realm (Walk, Walk/Run, Jog, 5km Tempo, Sprint Intervals, Pace Tracker)
 * 4. 🤸 Calisthenics Realm (Progressive Skill Ladders)
 * Features smart 1-click "Gym -> Home" location converter and auto-progression logging.
 */

class TrainingEngine {
    constructor() {
        this.activeRealm = 'gym';
        this.exerciseDB = this.getExerciseDatabase();
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Realm tab toggles inside Training page
        document.querySelectorAll('.training-realm-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const realm = btn.dataset.realm;
                this.switchRealm(realm);
            });
        });

        // 1-Click Swap Gym to Home button
        const btnSwapLocation = document.getElementById('btn-swap-gym-home');
        if (btnSwapLocation) {
            btnSwapLocation.addEventListener('click', () => {
                this.convertGymToHomeWorkout();
            });
        }

        // Complete Today's Workout Button
        const btnCompleteWorkout = document.getElementById('btn-complete-workout');
        if (btnCompleteWorkout) {
            btnCompleteWorkout.addEventListener('click', () => {
                this.completeActiveWorkout();
            });
        }
    }

    switchRealm(realm) {
        this.activeRealm = realm;
        window.systemState.data.training.activeRealm = realm;
        document.querySelectorAll('.training-realm-tab').forEach(b => {
            b.classList.toggle('active', b.dataset.realm === realm);
        });

        document.querySelectorAll('.realm-view-panel').forEach(panel => {
            panel.classList.toggle('hidden', panel.dataset.realm !== realm);
        });

        if (window.systemAudio) window.systemAudio.playClick();
        this.renderRealmContent(realm);
    }

    getExerciseDatabase() {
        return {
            gym: {
                vtaper: [
                    { id: 'g_lat_pulldown', name: 'Lat Pulldown (Wide Grip)', sets: 4, reps: '8-12', rir: 2, defaultLoad: '45 kg', target: 'Lats / Back Width', homeAlt: 'Dumbbell Bent-Over Row / Pull-up' },
                    { id: 'g_db_shoulder_press', name: 'Dumbbell Overhead Shoulder Press', sets: 4, reps: '8-10', rir: 1, defaultLoad: '16 kg/hand', target: 'Front/Lateral Deltoids', homeAlt: 'Pike Push-ups / Dumbbell Press' },
                    { id: 'g_lat_raise', name: 'Cable / DB Lateral Raises', sets: 4, reps: '12-15', rir: 1, defaultLoad: '7.5 kg/hand', target: 'Side Deltoid Width', homeAlt: 'Dumbbell Lateral Raise' },
                    { id: 'g_incline_bench', name: 'Incline Dumbbell Chest Press', sets: 3, reps: '8-12', rir: 2, defaultLoad: '20 kg/hand', target: 'Upper Chest Clavicular Head', homeAlt: 'Feet-Elevated Decline Push-ups' },
                    { id: 'g_cable_face_pull', name: 'Cable Face Pulls', sets: 3, reps: '15', rir: 2, defaultLoad: '22 kg', target: 'Rear Delts & Posture', homeAlt: 'Resistance Band Pull-Aparts' }
                ],
                hypertrophy: [
                    { id: 'g_barbell_squat', name: 'Barbell Back Squat', sets: 4, reps: '6-8', rir: 2, defaultLoad: '60 kg', target: 'Quads & Glutes', homeAlt: 'Dumbbell Bulgarian Split Squat' },
                    { id: 'g_romanian_deadlift', name: 'Romanian Deadlift (RDL)', sets: 3, reps: '8-10', rir: 2, defaultLoad: '50 kg', target: 'Hamstrings & Glutes', homeAlt: 'Single-Leg Dumbbell RDL' },
                    { id: 'g_flat_bench', name: 'Barbell / DB Flat Bench Press', sets: 4, reps: '6-10', rir: 1, defaultLoad: '55 kg', target: 'Mid Chest & Triceps', homeAlt: 'Tempo Push-ups (3s descent)' },
                    { id: 'g_seated_cable_row', name: 'Seated Cable Row', sets: 4, reps: '10-12', rir: 2, defaultLoad: '40 kg', target: 'Mid Back & Rhomboids', homeAlt: 'Dumbbell Single Arm Row' },
                    { id: 'g_cable_curl', name: 'Bicep Cable Curl', sets: 3, reps: '12-15', rir: 1, defaultLoad: '15 kg', target: 'Biceps Peak', homeAlt: 'Dumbbell Hammer Curls' }
                ]
            },
            home: {
                hybrid: [
                    { id: 'h_pushup_prog', name: 'Progression Push-ups (Tempo 3-1-1)', sets: 4, reps: '12-20', rir: 1, target: 'Chest & Triceps', notes: 'Maintain strict hollow body core' },
                    { id: 'h_db_goblet_squat', name: 'Dumbbell Goblet Squat', sets: 4, reps: '12-15', rir: 2, target: 'Quads & Glutes', notes: 'Keep chest high and spine neutral' },
                    { id: 'h_bulgarian_split', name: 'Bulgarian Split Squat', sets: 3, reps: '10-12/leg', rir: 1, target: 'Single Leg Hypertrophy & Balance' },
                    { id: 'h_db_row', name: 'Dumbbell Bent-Over Row', sets: 4, reps: '10-12', rir: 2, target: 'Lats & Rhomboids' },
                    { id: 'h_pike_pushup', name: 'Pike Push-ups (Shoulder Builder)', sets: 3, reps: '8-12', rir: 1, target: 'Shoulders & Upper Torso' },
                    { id: 'h_plank_hold', name: 'Hollow Body Hold / RKC Plank', sets: 3, reps: '45-60s', rir: 1, target: 'Deep Core Stabilization' }
                ]
            },
            ground: {
                running: [
                    { phase: 'Warmup', title: 'Brisk Walk & Dynamic Leg Swings', duration: '5 mins', pace: 'Walk' },
                    { phase: 'Main Protocol', title: '3.5 km Interval Run (3 min Jog + 1 min Sprint x 4)', duration: '20 mins', pace: '5:45 min/km' },
                    { phase: 'Ground Circuit', title: 'Outdoor Bodyweight Stair Jumps + Walking Lunges', duration: '8 mins', pace: 'Conditioning' },
                    { phase: 'Cooldown', title: 'Post-Run Calf & Hamstring Mobility', duration: '5 mins', pace: 'Recovery' }
                ]
            }
        };
    }

    generateWeeklySchedule() {
        const a = window.systemState.data.assessment;
        const arch = a.physiqueArchetype;
        const days = a.daysPerWeek;

        let schedule = [];
        if (days === 3) {
            schedule = [
                { day: 'Monday', realm: 'gym', title: 'Gym — Full Body Power & V-Taper', duration: '50 min', focus: 'Lats, Chest, Quads, Delts', status: 'pending' },
                { day: 'Wednesday', realm: 'ground', title: 'Ground — 4km Interval Run & Core', duration: '35 min', focus: 'Cardio, Agility, VO2 Max', status: 'pending' },
                { day: 'Friday', realm: 'calisthenics', title: 'Calisthenics — Upper Mastery Ladder', duration: '45 min', focus: 'Pull-up & Push Progressions', status: 'pending' },
                { day: 'Sunday', realm: 'home', title: 'Home — Mobility & Recovery Protocol', duration: '20 min', focus: 'Active Joint Recovery', status: 'pending' }
            ];
        } else if (days >= 5) {
            schedule = [
                { day: 'Monday', realm: 'gym', title: 'Gym — Push & Lateral Shoulders', duration: '55 min', focus: 'Upper Chest, Delts, Triceps', status: 'pending' },
                { day: 'Tuesday', realm: 'gym', title: 'Gym — Pull & Lat Hypertrophy (V-Taper)', duration: '55 min', focus: 'Lats, Rhomboids, Biceps', status: 'pending' },
                { day: 'Wednesday', realm: 'ground', title: 'Ground — 5km Tempo Run & Agility', duration: '40 min', focus: 'Cardiovascular Endurance', status: 'pending' },
                { day: 'Thursday', realm: 'gym', title: 'Gym — Lower Body & Posterior Chain', duration: '50 min', focus: 'Quads, Hamstrings, Core', status: 'pending' },
                { day: 'Friday', realm: 'calisthenics', title: 'Calisthenics — Skill & Body Control', duration: '45 min', focus: 'Strict Dips, Pulls, L-Sit', status: 'pending' },
                { day: 'Saturday', realm: 'home', title: 'Home — Dumbbell Arms & Core Blast', duration: '30 min', focus: 'Arms, Abs & Obliques', status: 'pending' },
                { day: 'Sunday', realm: 'home', title: 'Rest & Deep Breathwork Protocol', duration: '20 min', focus: 'Full System Regeneration', status: 'pending' }
            ];
        } else {
            // Default 4-day hybrid
            schedule = [
                { day: 'Monday', realm: 'gym', title: 'Gym — Upper Body (V-Taper Focus)', duration: '55 min', focus: 'Shoulders, Lats, Upper Chest', status: 'pending' },
                { day: 'Tuesday', realm: 'ground', title: 'Ground — Interval Running & Mobility', duration: '35 min', focus: 'Agility & Stamina', status: 'pending' },
                { day: 'Thursday', realm: 'gym', title: 'Gym — Lower Body & Core', duration: '50 min', focus: 'Squats, RDLs, Abs', status: 'pending' },
                { day: 'Saturday', realm: 'calisthenics', title: 'Calisthenics — Skill Master Tree', duration: '45 min', focus: 'Pull-up Ladder & Handstand Prep', status: 'pending' }
            ];
        }

        window.systemState.data.training.weeklySchedule = schedule;
        window.systemState.save();
    }

    convertGymToHomeWorkout() {
        const s = window.systemState.data;
        const currentTitle = s.training.gymPlan;
        
        s.training.activeRealm = 'home';
        s.training.homePlan = 'Converted Home Alternative: ' + currentTitle.replace('Gym — ', '');
        this.switchRealm('home');

        if (window.app) {
            window.app.showToast('WORKOUT CONVERTED', 'Gym session intelligently adapted to Home Dumbbell & Bodyweight movements!');
            window.app.syncUI();
        }
        if (window.systemAudio) window.systemAudio.playGateEnter();
    }

    completeActiveWorkout() {
        const s = window.systemState.data;
        if (s.training.todayCompleted) {
            if (window.app) window.app.showToast('ALREADY CLEARED', "Today's training protocol is already completed!");
            return;
        }

        s.training.todayCompleted = true;
        // Mark first pending schedule item as done
        const pending = s.training.weeklySchedule.find(w => w.status === 'pending');
        if (pending) pending.status = 'completed';

        // Check quest completion
        const quest = s.quests.daily.find(q => q.id === 'q_workout');
        if (quest) quest.completed = true;

        // Gain Real Life XP and Attribute points
        const xpGain = 350;
        s.stats.str += 1;
        s.stats.vit += 1;
        window.systemState.gainXp(xpGain, 'Completed Scheduled Hunter Workout');

        if (window.systemAudio) window.systemAudio.playQuestComplete();
        if (window.app) {
            window.app.showToast('WORKOUT PROTOCOL CLEARED', `+${xpGain} XP Earned! +1 STR, +1 VIT allocated to Hunter.`);
            window.app.syncUI();
        }
    }

    renderRealmContent(realm) {
        // Handled reactively through UI sync in App
    }
}

// Global Training Engine instance
window.trainingEngine = new TrainingEngine();
