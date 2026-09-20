/**
 * MULTIVERSE HUNTER — MASTER SYSTEM STATE & CORE PERSISTENCE
 * Central source of truth for:
 * - 6 Independent XP Tracks: Body XP, Nutrition XP, Recovery XP, Discipline XP, Mind XP, Business XP
 * - 2 Sub-Levels: Body Level & Life Level -> Hunter Level
 * - Adaptive TDEE & Actual Maintenance Tracking (Initial estimate -> 2-3 weeks actuals -> rolling 7-day average -> estimated maintenance)
 * - Dynamic Hydration Model (Weight + Climate + Exercise modifier)
 * - Performance Metrics (Push-ups, Pull-ups, Squats, Plank, 5km Pace, Bench, Deadlift, OHP)
 * - Recovery Metrics (Sleep, RHR, HRV, Subjective Recovery)
 * - System Memory (Learned user preferences for training days, foods, meal count, workout length)
 * - Persistent Arc History (Arc 1, Arc 2, Arc 3...)
 * - Daily Hunter Journal Entries
 * - Unified My Hunter vs Coach Clients architecture.
 */

class MasterSystemState {
    constructor() {
        this.STORAGE_KEY = 'MULTIVERSE_HUNTER_MASTER_V3';
        this.CLIENTS_STORAGE_KEY = 'MULTIVERSE_HUNTER_CLIENTS_V3';
        this.data = this.getDefaultData();
        this.clients = [];
        this.currentMode = 'my_hunter'; // 'my_hunter' | 'coach_clients'
        this.activeClientId = null;
        this.listeners = [];
        this.load();
    }

    getDefaultData() {
        return {
            awakened: false,
            version: '3.0',
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),

            // MAIN CHARACTER IDENTITY
            player: {
                id: 'hunter_main',
                name: 'Hunter Protagonist',
                title: 'Awakened Initiate',
                job: 'None (Unawakened)',
                rank: 'E',
                
                // MULTI-LEVEL SYSTEM
                hunterLevel: 1,
                bodyLevel: 1,
                lifeLevel: 1,
                
                totalXp: 0,
                unallocatedPoints: 5,
                gold: 250,
                crystals: 15,
                
                fatigue: 0,
                streakDays: 1,
                lastStreakDate: new Date().toDateString(),
                activePhase: 'FOUNDATION', // ASSESSMENT | FOUNDATION | FAT_LOSS | RECOMPOSITION | MUSCLE_GAIN | MAINTENANCE | ATHLETIC_PERFORMANCE | SKILL_SPECIALIZATION
                activeArcNumber: 1,
                activeArcName: 'Awakening & Calibration Arc',
                arcDay: 1,
                assignedMentor: 'jinwoo'
            },

            // USER ROLES & ACCESS CONTROL
            currentUserRole: 'HUNTER', // 'HUNTER' | 'COACH' | 'ADMIN'

            // WEIGHTED PROGRESSION CONFIGURATION
            progressionConfig: {
                bodyDomainWeight: 0.70, // 70% Body-domain XP (Body + Nutrition + Recovery + Discipline)
                lifeDomainWeight: 0.30  // 30% Life-domain XP (Mind + Business)
            },

            // SAFETY & EMERGENCY OVERRIDE
            emergencyStopActive: false,
            emergencyStopDetails: null,

            // 6 INDEPENDENT XP TRACKS
            xpTracks: {
                bodyXp: { current: 0, next: 100, level: 1, total: 0 },
                nutritionXp: { current: 0, next: 100, level: 1, total: 0 },
                recoveryXp: { current: 0, next: 100, level: 1, total: 0 },
                disciplineXp: { current: 0, next: 100, level: 1, total: 0 },
                mindXp: { current: 0, next: 100, level: 1, total: 0 },
                businessXp: { current: 0, next: 100, level: 1, total: 0 }
            },

            // 8 SYSTEM ATTRIBUTES
            stats: {
                str: 10,
                agi: 10,
                vit: 10,
                int: 10,
                focus: 10,
                will: 10,
                energy: 10,
                biz: 10
            },

            // ONBOARDING & BIOMETRICS PROFILE
            assessment: {
                age: 24,
                sex: 'male',
                heightCm: 175,
                currentWeightKg: 78.0,
                targetWeightKg: 72.0,
                waistCm: 88,
                chestCm: 98,
                shoulderCm: 112,
                armCm: 33,
                hipCm: 96,
                thighCm: 56,
                bodyFatPct: 22,

                physiqueArchetype: 'vtaper',
                primaryObjective: 'V-Taper Aesthetics',
                secondaryObjective: 'Healthy Fat Loss & Recomposition',
                timelineWeeks: 12,

                trainingRealms: ['gym', 'home', 'ground', 'calisthenics'],
                availableEquipment: ['barbell', 'dumbbells', 'pullup_bar', 'bands', 'bodyweight', 'cables'],
                fitnessLevel: 'beginner',
                daysPerWeek: 4,
                minutesPerSession: 50,
                preferredTime: 'evening',

                dietType: 'non_veg', // veg | egg_veg | non_veg
                mealFrequency: 3, // 2 | 3 | 4 | flexible
                foodBudget: 'medium', // low | medium | high | premium
                cookPreference: 'self',
                dislikedFoods: [],
                availableIngredientsToday: ['eggs', 'rice', 'dal', 'paneer', 'chicken', 'curd', 'roti', 'oats', 'sprouts'],

                hasInjuries: false,
                injuryDetails: 'None',
                contraindications: [] // e.g. ['knee_pain', 'lower_back_fatigue']
            },

            // ADAPTIVE TDEE & MAINTENANCE ENGINE STATE
            tdeeModel: {
                initialEstimatedBmr: 1720,
                initialEstimatedTdee: 2400,
                estimatedActualMaintenance: 2350,
                targetCalories: 2100,
                calorieHistory: [
                    { date: '2026-09-14', consumed: 2120, target: 2100 },
                    { date: '2026-09-15', consumed: 2080, target: 2100 },
                    { date: '2026-09-16', consumed: 2150, target: 2100 },
                    { date: '2026-09-17', consumed: 2090, target: 2100 },
                    { date: '2026-09-18', consumed: 2110, target: 2100 },
                    { date: '2026-09-19', consumed: 2140, target: 2100 },
                    { date: '2026-09-20', consumed: 2100, target: 2100 }
                ],
                rolling7DayAvgWeight: 78.2,
                weeklyWeightDeltaKg: -0.45,
                maintenanceConfidence: 'Moderate (2 weeks of tracking)'
            },

            // DYNAMIC HYDRATION ENGINE
            hydration: {
                configuredTargetLiters: 3.2,
                consumedLiters: 2.0,
                baselineNeedLiters: 2.6,
                exerciseAdjustmentLiters: 0.6,
                climateAdjustmentLiters: 0.0,
                userOverride: false
            },

            // PERFORMANCE MEASUREMENTS (LIFTS & BODYWEIGHT PRs)
            performanceMetrics: {
                pushupsMax: 26,
                pullupsMax: 6,
                plankMaxSec: 65,
                bodyweightSquatsMax: 40,
                runningPaceMinPerKm: '5:40',
                running5kTime: '28:20',
                walkingDailyAvgSteps: 8500,
                gymLifts: {
                    benchPressKg: 65,
                    barbellSquatKg: 75,
                    deadliftKg: 90,
                    overheadPressKg: 40
                }
            },

            // RECOVERY MEASUREMENTS
            recoveryMetrics: {
                sleepHoursAvg: 7.3,
                restingHeartRateBpm: 64,
                hrvMs: 62,
                subjectiveRecoveryScore: 8, // 1-10
                lastCheckDate: new Date().toDateString(),
                sleepScore: 4,
                energyScore: 4,
                sorenessScore: 2,
                stressScore: 2,
                motivationScore: 5,
                readinessState: 'GREEN', // GREEN: Normal planned training | YELLOW: Modified training | RED: Recovery-focused session
                readinessMessage: 'Normal planned training. System physiology balanced.'
            },

            // HUNTER JOURNAL
            journal: {
                entries: [
                    {
                        date: '2026-09-19',
                        workoutCompleted: true,
                        nutritionAdhered: true,
                        learningCompleted: true,
                        businessCompleted: true,
                        energyScore: 8,
                        todayLesson: 'Keeping rest between sets to strict 90s noticeably boosted lat pump on pulldowns.',
                        tomorrowPriority: 'Lock in 90-min deep coding block before 11 AM.'
                    }
                ]
            },

            // SYSTEM MEMORY & LEARNED PREFERENCES
            systemMemory: {
                preferredDays: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
                preferredWorkoutDurationMins: 50,
                favoriteExercises: ['Lat Pulldowns', 'Dumbbell Lateral Raises', 'Push-ups'],
                skippedExercises: [],
                preferredMealCount: 3,
                highAdherenceFoods: ['Chicken breast', 'Moong dal', 'Boiled eggs', 'Curd'],
                lowAdherenceFoods: []
            },

            // PERSISTENT 30-DAY ARC HISTORY
            arcHistory: [
                {
                    arcNumber: 1,
                    title: 'Awakening & Calibration Arc (Days 1–7)',
                    phase: 'FOUNDATION',
                    status: 'active',
                    startDate: '2026-09-14',
                    completionRate: 88,
                    xpEarned: 3850,
                    bodyDeltas: { weightDeltaKg: -0.6, waistDeltaCm: -0.8, pushupsDelta: +5 },
                    highlights: 'Calibrated maintenance calories, established 4-day training habit, zero missed workouts.'
                }
            ],

            // NUTRITION TARGETS & DAILY MEALS
            nutrition: {
                caloriesTarget: 2100,
                proteinTarget: 145,
                carbsTarget: 235,
                fatsTarget: 60,
                caloriesConsumed: 1250,
                proteinConsumed: 92,
                carbsConsumed: 135,
                fatsConsumed: 38,
                selectedMealPlanType: '3_meals',
                dailyMeals: []
            },

            // TRAINING SCHEDULE & EXERCISE LOGS
            training: {
                activeRealm: 'gym',
                todayCompleted: false,
                weeklySchedule: [],
                exerciseLogs: []
            },

            // CALISTHENICS PROGRESSION STATE
            calisthenics: {
                pushTier: 3,
                pullTier: 3,
                legsTier: 2,
                coreTier: 2,
                skills: {
                    handstand: { unlocked: false, progressPct: 35, physicalPrereqPassed: false },
                    lsit: { unlocked: false, progressPct: 40, physicalPrereqPassed: false },
                    muscleup: { unlocked: false, progressPct: 15, physicalPrereqPassed: false },
                    frontlever: { unlocked: false, progressPct: 10, physicalPrereqPassed: false },
                    planche: { unlocked: false, progressPct: 5, physicalPrereqPassed: false }
                }
            },

            // MULTIVERSE CHALLENGES, LEGION & STAGE PROGRESSION
            multiverse: {
                assignedMentor: 'jinwoo',
                currentStage: 1,
                mentors: [
                    // --- SOLO LEVELING ---
                    { id: 'jinwoo', name: 'Sung Jin-Woo', universe: 'Solo Leveling', roles: ['monarch-supreme', 'willpower'], mentorRole: 'Shadow Monarch (Autonomic Recovery)', challenge: 'Maintain 7-day sleep > 7.2 hrs & morning resting HR -> +450 Recovery XP', unlocked: true, avatar: '👑', quote: 'Arise.' },
                    { id: 'beru', name: 'Beru', universe: 'Solo Leveling', roles: ['monarch-supreme', 'bosses'], mentorRole: 'Apex Ant King (Metabolic Efficiency)', challenge: 'Hit exact daily calorie target within ±3% for 5 days -> +400 Nutrition XP', unlocked: true, avatar: '🐜', quote: 'My King, your will is absolute!' },
                    { id: 'igris', name: 'Blood-Red Commander Igris', universe: 'Solo Leveling', roles: ['warrior'], mentorRole: 'Knight Commander (Pure Strict Lifting Form)', challenge: 'Execute 4 compound lifts with zero form breakdown -> +350 Body XP', unlocked: true, avatar: '⚔️', quote: 'Silent, resolute loyalty to the standard.' },

                    // --- JUJUTSU KAISEN ---
                    { id: 'gojo', name: 'Satoru Gojo', universe: 'Jujutsu Kaisen', roles: ['monarch-supreme', 'strategist'], mentorRole: 'Limitless Focus (Deep Cognitive Flow)', challenge: '90-min distraction-free deep block -> +400 Mind XP', unlocked: true, avatar: '🌌', quote: 'Throughout heaven and earth, I alone am the honored one.' },
                    { id: 'sukuna', name: 'Ryomen Sukuna', universe: 'Jujutsu Kaisen', roles: ['monarch-supreme', 'bosses'], mentorRole: 'Malevolent Shrine (Boss Raid Target)', challenge: 'Conquer Stage 5 Pomodoro focus raid to inflict 3,000 damage', unlocked: true, avatar: '👹', quote: 'Know your place, fool.' },
                    { id: 'yuji', name: 'Yuji Itadori', universe: 'Jujutsu Kaisen', roles: ['willpower', 'discipline-training'], mentorRole: 'Divergent Fist (Explosive Ground Output)', challenge: 'Complete 10,000 steps + 3 explosive sprint sets -> +350 Body XP', unlocked: true, avatar: '👊', quote: "I don't want to regret how I lived." },
                    { id: 'toji', name: 'Toji Fushiguro', universe: 'Jujutsu Kaisen', roles: ['warrior', 'discipline-training'], mentorRole: 'Heavenly Restriction (Calisthenics Mastery)', challenge: 'Advance any skill tier in the Calisthenics Progression Ladder -> +400 Body XP', unlocked: true, avatar: '⛓️', quote: 'I have no cursed energy, but my physical body is absolute.' },
                    { id: 'yuta', name: 'Yuta Okkotsu', universe: 'Jujutsu Kaisen', roles: ['warrior', 'monarch-supreme'], mentorRole: 'Boundless Reserves (Work Capacity & Volume)', challenge: 'Complete 18+ high-quality working sets in a session -> +350 Body XP', unlocked: true, avatar: '💍', quote: "I'll do whatever it takes to protect my friends." },

                    // --- ONE PIECE ---
                    { id: 'luffy', name: 'Monkey D. Luffy', universe: 'One Piece', roles: ['willpower'], mentorRole: 'Gear Fifth (Unbreakable Resilience)', challenge: 'Bounce back from a tough training session with 8.5h sleep -> +400 Recovery XP', unlocked: true, avatar: '🍖', quote: "I'm going to become the King of the Pirates!" },
                    { id: 'zoro', name: 'Roronoa Zoro', universe: 'One Piece', roles: ['warrior', 'willpower'], mentorRole: 'Three-Sword Discipline (Zero Missed Sessions)', challenge: 'Complete 100% scheduled workouts in week -> +450 Discipline XP', unlocked: true, avatar: '⚔️', quote: "Scars on the back are a swordsman's shame." },
                    { id: 'shanks', name: 'Red-Haired Shanks', universe: 'One Piece', roles: ['warrior', 'strategist'], mentorRole: 'Conqueror’s Presence (High-Level Business Execution)', challenge: 'Complete top business/work objective before 12 PM -> +400 Business XP', unlocked: true, avatar: '👒', quote: 'By experiencing both victory and defeat, a man becomes a true hunter.' },
                    { id: 'kaido', name: 'Kaido of the Beasts', universe: 'One Piece', roles: ['monarch-supreme', 'bosses', 'warrior'], mentorRole: 'King of the Beasts (Heavy Compounds)', challenge: 'Clear full 4-set heavy compound barbell protocol with RIR 1-2 -> +400 Body XP', unlocked: true, avatar: '🐉', quote: 'Only Haki transcends all!' },
                    { id: 'mihawk', name: 'Dracule Mihawk', universe: 'One Piece', roles: ['warrior'], mentorRole: 'World’s Strongest Precision (Biomechanical Isolation)', challenge: 'Isolate target muscle group with strict 3-sec eccentric tempos -> +350 Body XP', unlocked: true, avatar: '🗡️', quote: 'It is not a sword that cuts without reason.' },

                    // --- NARUTO ---
                    { id: 'naruto', name: 'Naruto Uzumaki', universe: 'Naruto', roles: ['willpower'], mentorRole: 'Sage Mode Will (Never Give Up)', challenge: 'Complete scheduled workout even on low motivation days -> +450 Discipline XP', unlocked: true, avatar: '🍥', quote: "I never go back on my word. That's my nindo!" },
                    { id: 'sasuke', name: 'Sasuke Uchiha', universe: 'Naruto', roles: ['warrior'], mentorRole: 'Chidori Precision (Form & Speed)', challenge: 'Perform all working sets with laser biomechanical alignment -> +350 Body XP', unlocked: true, avatar: '⚡', quote: 'My path is clear.' },
                    { id: 'madara', name: 'Madara Uchiha', universe: 'Naruto', roles: ['monarch-supreme', 'strategist', 'bosses'], mentorRole: 'Planetary Execution (Macro Strategy)', challenge: 'Lock in 14-day progressive overload training block -> +500 Mind XP', unlocked: true, avatar: '👁️', quote: 'Wake up to reality.' },
                    { id: 'kakashi', name: 'Kakashi Hatake', universe: 'Naruto', roles: ['strategist'], mentorRole: 'Copy Ninja Analysis (Micro-Periodization)', challenge: 'Review and log all set weights and RPE accurately in journal -> +350 Mind XP', unlocked: true, avatar: '📖', quote: 'The next generation will always surpass the previous one.' },
                    { id: 'might_guy', name: 'Might Guy', universe: 'Naruto', roles: ['discipline-training', 'willpower'], mentorRole: 'Eight Gates Dynamic (Cardio & Steps Engine)', challenge: 'Hit 10,000 steps for 5 consecutive days -> +450 Body XP', unlocked: true, avatar: '🥋', quote: 'Youth is about burning with passion!' },
                    { id: 'rock_lee', name: 'Rock Lee', universe: 'Naruto', roles: ['discipline-training', 'willpower'], mentorRole: 'Genius of Hard Work (Push-up Rep Volume)', challenge: '100 Strict Hollow Push-ups in a single day -> +350 Body XP', unlocked: true, avatar: '🥊', quote: 'A drop of sweat is worth more than a sea of talent.' },
                    { id: 'shikamaru', name: 'Shikamaru Nara', universe: 'Naruto', roles: ['strategist'], mentorRole: 'Shadow Tactics (TDEE & Macro Calibration)', challenge: 'Maintain caloric deficit within ±50 kcal of target for 5 days -> +400 Mind XP', unlocked: true, avatar: '♟️', quote: "What a drag... but let's calculate the optimal path." },

                    // --- BLEACH ---
                    { id: 'ichigo', name: 'Ichigo Kurosaki', universe: 'Bleach', roles: ['warrior', 'willpower'], mentorRole: 'Bankai Overload (High Threshold Hypertrophy)', challenge: 'Hit 1-2 RIR on all primary working sets -> +350 Body XP', unlocked: true, avatar: '🗡️', quote: 'I will protect everyone.' },
                    { id: 'aizen', name: 'Sosuke Aizen', universe: 'Bleach', roles: ['monarch-supreme', 'strategist', 'bosses'], mentorRole: 'Kyoka Suigetsu (Weekly Architecture)', challenge: 'Zero missed workout or nutrition entries for 14 days -> +500 Mind XP', unlocked: true, avatar: '🦋', quote: 'Since when were you under the impression that you were in control?' },
                    { id: 'urahara', name: 'Kisuke Urahara', universe: 'Bleach', roles: ['strategist'], mentorRole: 'Scientific Adaptation (System Optimization)', challenge: 'Optimize pre/post workout carb timing for 5 training days -> +350 Mind XP', unlocked: true, avatar: '👒', quote: 'There is nothing but fear in a warrior who does not think.' },
                    { id: 'kenpachi', name: 'Kenpachi Zaraki', universe: 'Bleach', roles: ['warrior', 'willpower'], mentorRole: 'No-Limit Strength (Heavy Singles & Doubles)', challenge: 'Safely test and lock in a new 3-rep max with spotter/safeties -> +400 Body XP', unlocked: true, avatar: '👹', quote: 'Sanity? Sorry, I don’t remember having such a useless thing.' },

                    // --- DRAGON BALL ---
                    { id: 'goku', name: 'Son Goku', universe: 'Dragon Ball', roles: ['discipline-training', 'monarch-supreme'], mentorRole: 'Limit Breaker (Strength PR Progression)', challenge: 'Set a new personal lifting PR with RIR 1 -> +400 Body XP', unlocked: true, avatar: '🔥', quote: 'Power comes in response to a need, not a desire.' },
                    { id: 'vegeta', name: 'Vegeta', universe: 'Dragon Ball', roles: ['warrior', 'discipline-training'], mentorRole: 'Saiyan Pride (Progressive Overload)', challenge: "Beat previous week's reps or load on primary lift -> +400 Body XP", unlocked: true, avatar: '👑', quote: 'Surpass your limits every single day!' },
                    { id: 'gohan', name: 'Son Gohan', universe: 'Dragon Ball', roles: ['discipline-training', 'willpower'], mentorRole: 'Latent Potential (Hybrid Mind & Muscle)', challenge: 'Execute both a 60-min workout and a 60-min learning block -> +400 XP', unlocked: true, avatar: '⚡', quote: 'I have to protect those who cannot protect themselves.' },
                    { id: 'broly', name: 'Broly', universe: 'Dragon Ball', roles: ['warrior', 'bosses'], mentorRole: 'Untamed Power (Volume Capacity)', challenge: 'Conquer high-intensity training session without dropping set intensity -> +400 Body XP', unlocked: true, avatar: '💥', quote: 'ROAAAR!' },
                    { id: 'frieza', name: 'Frieza', universe: 'Dragon Ball', roles: ['monarch-supreme', 'bosses'], mentorRole: 'Emperor’s Tyranny (Stage 7 Raid Target)', challenge: 'Conquer Stage 7 Golden Emperor focus raid to deal 4,000 damage', unlocked: true, avatar: '🟣', quote: 'My power level is far beyond anything you can comprehend.' },

                    // --- ONE PUNCH MAN ---
                    { id: 'saitama', name: 'Saitama', universe: 'One Punch Man', roles: ['discipline-training', 'monarch-supreme'], mentorRole: 'Daily Hero Protocol (Habit Lock)', challenge: '100% daily workout & protein adherence -> +500 Discipline XP', unlocked: true, avatar: '👊', quote: '100 push-ups, 100 sit-ups, 100 squats, 10km run every single day!' },
                    { id: 'genos', name: 'Genos', universe: 'One Punch Man', roles: ['discipline-training', 'warrior'], mentorRole: 'Cyborg Upgrade (Data Tracking & Log Precision)', challenge: 'Log every macro and weight metric precisely for 7 straight days -> +350 Mind XP', unlocked: true, avatar: '🤖', quote: 'I will eliminate all obstacles in the path of growth.' },
                    { id: 'garou', name: 'Garou', universe: 'One Punch Man', roles: ['discipline-training', 'bosses', 'willpower'], mentorRole: 'Hero Hunter Adaptation (Overcoming Fatigue)', challenge: 'Complete mobility + core workout on active recovery day -> +350 Recovery XP', unlocked: true, avatar: '🐺', quote: 'The popular will win, the hated will lose... I will change that.' },
                    { id: 'bang', name: 'Silver Fang (Bang)', universe: 'One Punch Man', roles: ['discipline-training', 'warrior'], mentorRole: 'Water Stream Fist (Joints & Mobility)', challenge: 'Complete 15-min joint mobility session -> +300 Recovery XP', unlocked: true, avatar: '🥋', quote: 'Flow like water, strike like stone.' },

                    // --- DEMON SLAYER ---
                    { id: 'tanjiro', name: 'Tanjiro Kamado', universe: 'Demon Slayer', roles: ['willpower', 'discipline-training'], mentorRole: 'Total Concentration Breathing (Cardio Endurance)', challenge: 'Maintain steady nasal breathing during whole cardio/step session -> +350 Body XP', unlocked: true, avatar: '🌊', quote: 'No matter how many people you may lose, you have no choice but to go on living.' },
                    { id: 'rengoku', name: 'Kyojuro Rengoku', universe: 'Demon Slayer', roles: ['discipline-training', 'willpower'], mentorRole: 'Heart Ablaze (Consistency Lock)', challenge: '7 consecutive days of 100% meal target adherence -> +450 Discipline XP', unlocked: true, avatar: '🔥', quote: 'Set your heart ablaze! Overcome your limits!' },
                    { id: 'giyu', name: 'Giyu Tomioka', universe: 'Demon Slayer', roles: ['warrior'], mentorRole: 'Dead Calm (HRV & Parasympathetic Recovery)', challenge: '10-min breathwork / cold shower recovery session -> +300 Recovery XP', unlocked: true, avatar: '🌊', quote: 'Dead Calm.' },
                    { id: 'muzan', name: 'Muzan Kibutsuji', universe: 'Demon Slayer', roles: ['monarch-supreme', 'bosses'], mentorRole: 'Demon King (Stage 9 Raid Target)', challenge: 'Conquer Stage 9 Infinity Fortress focus raid to deal 6,000 damage', unlocked: true, avatar: '🩸', quote: 'I am a creature that is near perfection.' },
                    { id: 'uzui', name: 'Tengen Uzui', universe: 'Demon Slayer', roles: ['discipline-training', 'warrior'], mentorRole: 'Flashy Agility (VO2 Max & Speed Intervals)', challenge: 'Complete 25m interval sprint circuit -> +350 Body XP', unlocked: true, avatar: '🎇', quote: "We're going to make this as flashy as possible!" },
                    { id: 'doma', name: 'Doma (Upper Moon 2)', universe: 'Demon Slayer', roles: ['bosses'], mentorRole: 'Frozen Lotus (Stage 2 Raid Target)', challenge: 'Conquer Stage 2 25-min focus raid to deal 1,500 damage', unlocked: true, avatar: '❄️', quote: 'Why take life so seriously?' },
                    { id: 'kokushibo', name: 'Kokushibo (Upper Moon 1)', universe: 'Demon Slayer', roles: ['warrior', 'bosses'], mentorRole: 'Moon Breathing (Blade Form & Hypertrophy)', challenge: 'Complete 5 heavy working sets with perfect tempo -> +400 Body XP', unlocked: true, avatar: '🌙', quote: 'I have dedicated centuries to mastering the blade.' },

                    // --- BLACK CLOVER ---
                    { id: 'asta', name: 'Asta', universe: 'Black Clover', roles: ['willpower', 'discipline-training'], mentorRole: 'Anti-Magic Grit (Heavy Calisthenics & Dumbbell Volume)', challenge: 'Complete 150 bodyweight squats + 50 pull-ups/rows in day -> +400 Body XP', unlocked: true, avatar: '🗡️', quote: "My magic is never giving up!" },
                    { id: 'yami', name: 'Yami Sukehiro', universe: 'Black Clover', roles: ['warrior', 'willpower'], mentorRole: 'Surpass Your Limits (0 RIR PR Challenge)', challenge: 'Push final set of compound lift to true technical failure -> +400 Body XP', unlocked: true, avatar: '🚬', quote: 'Surpass your limits right here, right now!' },
                    { id: 'yuno', name: 'Yuno Grinberryall', universe: 'Black Clover', roles: ['warrior', 'strategist'], mentorRole: 'Wind Precision (Metabolic Conditioning)', challenge: 'Hit target heart rate zone for 25 continuous minutes -> +350 Body XP', unlocked: true, avatar: '🍃', quote: 'I will become the Wizard King.' },

                    // --- HUNTER × HUNTER ---
                    { id: 'gon', name: 'Gon Freecss', universe: 'Hunter × Hunter', roles: ['willpower'], mentorRole: 'Jajanken Resolve (Maximum Effort Output)', challenge: 'Push maximum effort on single hardest lift of the week -> +400 Body XP', unlocked: true, avatar: '🎣', quote: 'If you want to know someone, find out what makes them angry.' },
                    { id: 'killua', name: 'Killua Zoldyck', universe: 'Hunter × Hunter', roles: ['warrior', 'strategist'], mentorRole: 'Godspeed Agility (Fast Twitch Sprints)', challenge: 'Complete 5x 50m sprint intervals -> +350 Body XP', unlocked: true, avatar: '⚡', quote: 'I’ve got to move at Godspeed.' },
                    { id: 'hisoka', name: 'Hisoka Morow', universe: 'Hunter × Hunter', roles: ['warrior', 'bosses'], mentorRole: 'Bungee Gum (Elastic Flexibility & Mobility)', challenge: 'Complete 20-min full body stretching protocol -> +300 Recovery XP', unlocked: true, avatar: '🃏', quote: 'My Bungee Gum has the properties of both rubber and gum.' },
                    { id: 'chrollo', name: 'Chrollo Lucilfer', universe: 'Hunter × Hunter', roles: ['strategist', 'bosses'], mentorRole: 'Skill Hunter (Versatile Routine Assembly)', challenge: 'Complete full multi-domain quest log in 24 hours -> +450 XP', unlocked: true, avatar: '📖', quote: 'The calendar loses a precious leaf.' },
                    { id: 'meruem', name: 'Meruem (Chimera Ant King)', universe: 'Hunter × Hunter', roles: ['monarch-supreme', 'bosses', 'strategist'], mentorRole: 'Supreme King (Stage 8 Raid Target)', challenge: 'Conquer Stage 8 90-min deep architecture block to inflict 5,000 damage', unlocked: true, avatar: '👑', quote: 'I was born to rule this world.' },

                    // --- MASTERMINDS & WILLPOWER TITANS ---
                    { id: 'senku', name: 'Senku Ishigami', universe: 'Dr. Stone', roles: ['strategist'], mentorRole: 'Kingdom of Science (Nutritional Chemistry)', challenge: 'Calculate and hit macro split with 100% precision for 3 days -> +400 Mind XP', unlocked: true, avatar: '🧪', quote: 'This is ten billion percent exhilarating!' },
                    { id: 'lelouch', name: 'Lelouch Lamperouge', universe: 'Code Geass', roles: ['strategist'], mentorRole: 'Absolute Command (Daily Time-Blocking)', challenge: 'Time-block whole day in 60-min intervals with 0 deviation -> +450 Mind XP', unlocked: true, avatar: '♟️', quote: 'The only ones who should kill are those who are prepared to be killed.' },
                    { id: 'deku', name: 'Izuku Midoriya (Deku)', universe: 'My Hero Academia', roles: ['willpower'], mentorRole: 'One For All (Continuous Evolution)', challenge: 'Add 1 rep or +1kg on every exercise in workout -> +400 Body XP', unlocked: true, avatar: '🥦', quote: 'I have to work harder than anyone else to make it!' },
                    { id: 'shigaraki', name: 'Tomura Shigaraki', universe: 'My Hero Academia', roles: ['bosses'], mentorRole: 'Decay Calamity (Stage 3 Raid Target)', challenge: 'Conquer Stage 3 30-min deep focus raid to inflict 2,000 damage', unlocked: true, avatar: '🖐️', quote: 'Everything I hate will crumble into dust.' }
                ],
                bossRaids: [
                    { id: 'boss_stage_1', stage: 1, name: 'The Procrastination Imp', rank: 'E-Rank', icon: '👿', hp: 800, currentHp: 800, durationMins: 15, realObjective: '15-Minute Focused Deep Work + Stretch Session', rewardXp: 400, rewardGold: 150, active: true },
                    { id: 'boss_stage_2', stage: 2, name: 'Doma (Upper Moon 2)', rank: 'D-Rank', icon: '❄️', hp: 1500, currentHp: 1500, durationMins: 25, realObjective: '25-Minute Pomodoro Focus Block', rewardXp: 750, rewardGold: 250, active: false },
                    { id: 'boss_stage_3', stage: 3, name: 'Tomura Shigaraki', rank: 'C-Rank', icon: '🖐️', hp: 2200, currentHp: 2200, durationMins: 30, realObjective: '30-Minute Coding / Skill Mastery Session', rewardXp: 1100, rewardGold: 350, active: false },
                    { id: 'boss_stage_4', stage: 4, name: 'Garou (Awakened Monster)', rank: 'B-Rank', icon: '🐺', hp: 3000, currentHp: 3000, durationMins: 40, realObjective: '40-Minute Deep Architecture Block', rewardXp: 1600, rewardGold: 500, active: false },
                    { id: 'boss_stage_5', stage: 5, name: 'Ryomen Sukuna', rank: 'A-Rank', icon: '👹', hp: 4000, currentHp: 4000, durationMins: 45, realObjective: '45-Minute Pure Focus Zone + Workout Clear', rewardXp: 2200, rewardGold: 700, active: false },
                    { id: 'boss_stage_6', stage: 6, name: 'Madara Uchiha', rank: 'S-Rank', icon: '👁️', hp: 5500, currentHp: 5500, durationMins: 60, realObjective: '60-Minute Heavy Sprint / Strategy Execution', rewardXp: 3000, rewardGold: 1000, active: false },
                    { id: 'boss_stage_7', stage: 7, name: 'Golden Frieza', rank: 'S-Rank', icon: '🟣', hp: 7000, currentHp: 7000, durationMins: 75, realObjective: '75-Minute System Engineering Block', rewardXp: 4000, rewardGold: 1300, active: false },
                    { id: 'boss_stage_8', stage: 8, name: 'Meruem (Chimera King)', rank: 'National Level', icon: '👑', hp: 9000, currentHp: 9000, durationMins: 90, realObjective: '90-Minute Unbroken Flow State Protocol', rewardXp: 5500, rewardGold: 1800, active: false },
                    { id: 'boss_stage_9', stage: 9, name: 'Muzan Kibutsuji', rank: 'Monarch Level', icon: '🩸', hp: 12000, currentHp: 12000, durationMins: 100, realObjective: '100-Minute Master Hunter Deep Synthesis Block', rewardXp: 7500, rewardGold: 2500, active: false },
                    { id: 'boss_stage_10', stage: 10, name: 'Sosuke Aizen (Transcendent)', rank: 'Transcendent', icon: '🦋', hp: 16000, currentHp: 16000, durationMins: 120, realObjective: '120-Minute Transcendent Focus Marathon', rewardXp: 10000, rewardGold: 3500, active: false }
                ]
            },

            // QUESTS & TASKS
            quests: {
                daily: [
                    { id: 'q_workout', title: 'Complete Scheduled Realm Workout', track: 'bodyXp', stat: 'str', xp: 350, gold: 120, completed: false },
                    { id: 'q_nutrition', title: 'Hit Daily Protein Target & Calorie Goal', track: 'nutritionXp', stat: 'vit', xp: 250, gold: 100, completed: true },
                    { id: 'q_ground', title: '8,000 Daily Steps / Outdoor Ground Movement', track: 'bodyXp', stat: 'agi', xp: 200, gold: 80, completed: false },
                    { id: 'q_coding', title: '90 Mins Deep Focus Coding / System Study', track: 'mindXp', stat: 'int', xp: 400, gold: 150, completed: false },
                    { id: 'q_biz', title: 'Advance High-Priority Business / CRM Task', track: 'businessXp', stat: 'biz', xp: 350, gold: 130, completed: false },
                    { id: 'q_recovery', title: 'Log Morning Check-In & Hydration Goal', track: 'recoveryXp', stat: 'energy', xp: 200, gold: 70, completed: true }
                ],
                custom: []
            },

            // REAL REWARDS
            rewards: [
                { id: 'rw_gaming', title: '90 Mins Guilt-Free Video Games', cost: 400, icon: '🎮', desc: 'Unlocked through real-world quest execution.' },
                { id: 'rw_cheat', title: 'Favorite Treat / Cheat Meal', cost: 700, icon: '🍕', desc: 'Earned by hitting 6 days of nutrition adherence.' },
                { id: 'rw_movie', title: 'Cinema / Binge Night Episode Block', cost: 500, icon: '🎬', desc: 'Weekend reward for finishing weekly Hunter Arc.' }
            ],

            // CLOSED-LOOP ADAPTIVE EXERCISE TARGETS & PERSISTENT PROGRESSION (V3.6)
            adaptiveExerciseTargets: {},
            latestDecisionRecord: null,
            decisionRecordHistory: [],
            workoutHistory: [],

            activityLog: []
        };
    }

    load() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                this.data = this.deepMerge(this.getDefaultData(), parsed);
            }
            const clientsRaw = localStorage.getItem(this.CLIENTS_STORAGE_KEY);
            if (clientsRaw) {
                this.clients = JSON.parse(clientsRaw);
            } else {
                this.clients = this.getSeedClients();
                this.saveClients();
            }
        } catch (e) {
            console.error('MasterSystemState load error:', e);
            this.data = this.getDefaultData();
        }
    }

    save() {
        try {
            this.data.lastActive = new Date().toISOString();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
            this.notifyListeners();
        } catch (e) {
            console.error('MasterSystemState save error:', e);
        }
    }

    saveClients() {
        try {
            localStorage.setItem(this.CLIENTS_STORAGE_KEY, JSON.stringify(this.clients));
        } catch (e) {
            console.error('MasterSystemState saveClients error:', e);
        }
    }

    getSeedClients() {
        return [
            {
                id: 'client_101',
                name: 'Vikram Sharma',
                age: 35,
                sex: 'male',
                heightCm: 172,
                weightKg: 102.5,
                targetWeightKg: 80.0,
                waistCm: 108,
                dietType: 'veg',
                foodBudget: 'low',
                fitnessLevel: 'beginner',
                trainingRealms: ['home', 'ground'],
                physiqueArchetype: 'cut',
                activePhase: 'FOUNDATION',
                targetCalories: 1950,
                proteinTarget: 115,
                adherenceRate: 88,
                notes: 'Sedentary desk worker. Needs joint-friendly progressions and budget vegetarian protein sources.'
            },
            {
                id: 'client_102',
                name: 'Aarav Patel',
                age: 22,
                sex: 'male',
                heightCm: 180,
                weightKg: 68.0,
                targetWeightKg: 75.0,
                waistCm: 76,
                dietType: 'non_veg',
                foodBudget: 'high',
                fitnessLevel: 'intermediate',
                trainingRealms: ['gym', 'calisthenics'],
                physiqueArchetype: 'vtaper',
                activePhase: 'MUSCLE_GAIN',
                targetCalories: 2750,
                proteinTarget: 155,
                adherenceRate: 94,
                notes: 'Focus on lat width, upper chest, and calisthenics muscle-up mastery.'
            }
        ];
    }

    deepMerge(target, source) {
        for (const key of Object.keys(source)) {
            if (source[key] instanceof Object && key in target && !(source[key] instanceof Array)) {
                Object.assign(source[key], this.deepMerge(target[key], source[key]));
            }
        }
        Object.assign(target || {}, source);
        return target;
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notifyListeners() {
        this.listeners.forEach(fn => {
            try { fn(this.data); } catch (e) { console.error('Listener err:', e); }
        });
    }

    // GAIN XP TO SPECIFIC TRACK
    gainTrackXp(trackKey, amount, reason = '') {
        if (!amount || amount <= 0) return;
        const tracks = this.data.xpTracks;
        if (!(trackKey in tracks)) trackKey = 'bodyXp';

        const track = tracks[trackKey];
        track.current += amount;
        track.total += amount;
        this.data.player.totalXp += amount;

        let leveledTrack = false;
        while (track.current >= track.next) {
            track.current -= track.next;
            track.level += 1;
            track.next = Math.floor(100 * Math.pow(track.level, 1.3));
            leveledTrack = true;
        }

        // WEIGHTED PROGRESSION MODEL (V3.1):
        // 1. Body-Domain XP = Body + Nutrition + Recovery + Discipline
        // 2. Life-Domain XP = Mind + Business
        // 3. Master Hunter XP = (BodyDomainXP * 70%) + (LifeDomainXP * 30%)
        const bodyDomainXp = (tracks.bodyXp.total || 0) + (tracks.nutritionXp.total || 0) + (tracks.recoveryXp.total || 0) + (tracks.disciplineXp.total || 0);
        const lifeDomainXp = (tracks.mindXp.total || 0) + (tracks.businessXp.total || 0);

        const config = this.data.progressionConfig || { bodyDomainWeight: 0.70, lifeDomainWeight: 0.30 };
        const bodyW = typeof config.bodyDomainWeight === 'number' ? config.bodyDomainWeight : 0.70;
        const lifeW = typeof config.lifeDomainWeight === 'number' ? config.lifeDomainWeight : 0.30;

        const weightedHunterXp = Math.floor((bodyDomainXp * bodyW) + (lifeDomainXp * lifeW));

        // Sub-levels derived from respective domain XP
        const bLevel = Math.max(1, Math.floor(1 + Math.pow(bodyDomainXp / 400, 0.62)));
        const lLevel = Math.max(1, Math.floor(1 + Math.pow(lifeDomainXp / 200, 0.62)));
        
        // Hunter Level derived from cumulative weighted Hunter XP (smooth exponential scaling)
        const hLevel = Math.max(1, Math.floor(1 + Math.pow(weightedHunterXp / 120, 0.62)));

        const oldHLevel = this.data.player.hunterLevel;
        this.data.player.bodyLevel = bLevel;
        this.data.player.lifeLevel = lLevel;
        this.data.player.hunterLevel = hLevel;

        if (hLevel > oldHLevel) {
            this.data.player.unallocatedPoints += 3 * (hLevel - oldHLevel);
            this.data.player.gold += 150 * hLevel;
            this.data.player.crystals += 5;
            this.updateRank();

            if (window.cinematicEngine) {
                window.cinematicEngine.levelUp({
                    newLevel: hLevel,
                    bodyLevel: bLevel,
                    lifeLevel: lLevel,
                    rank: this.data.player.rank
                });
            }
        }

        if (reason) {
            this.logEvent(`+${amount} ${trackKey.toUpperCase()}: ${reason}`);
        }

        this.save();
        return { leveledTrack, newHunterLevel: hLevel, leveledUpHunter: hLevel > oldHLevel };
    }

    gainXp(amount, reason = '') {
        return this.gainTrackXp('disciplineXp', amount, reason);
    }

    updateRank() {
        const lvl = this.data.player.hunterLevel;
        let rank = 'E';
        let job = 'Novice Hunter';

        if (lvl >= 200) { rank = 'TRANSCENDENT'; job = 'Cosmic Transcender'; }
        else if (lvl >= 150) { rank = 'MULTIVERSE'; job = 'Multiverse Vanguard'; }
        else if (lvl >= 100) { rank = 'SHADOW MONARCH'; job = 'Monarch of Discipline'; }
        else if (lvl >= 75) { rank = 'NATIONAL'; job = 'National Level Hunter'; }
        else if (lvl >= 50) { rank = 'S'; job = 'S-Rank Elite Master'; }
        else if (lvl >= 40) { rank = 'A'; job = 'A-Rank Commander'; }
        else if (lvl >= 30) { rank = 'B'; job = 'B-Rank Vanguard'; }
        else if (lvl >= 20) { rank = 'C'; job = 'C-Rank Striker'; }
        else if (lvl >= 10) { rank = 'D'; job = 'D-Rank Awakened'; }
        else { rank = 'E'; job = 'E-Rank Initiate'; }

        this.data.player.rank = rank;
        this.data.player.job = job;
    }

    /**
     * Data-Driven Avatar Evolution Engine
     * Calculates the Hunter's visual stage strictly from real progression metrics:
     * - hunterRank, bodyLevel, completedArcs, achievements, streakDays
     *
     * Progression: Awakened -> Foundation -> Evolved -> Elite -> Monarch
     */
    getAvatarEvolution(overrideMetrics = null) {
        const p = this.data.player;
        const metrics = overrideMetrics || {
            hunterRank: p.rank || 'E',
            bodyLevel: p.bodyLevel || 1,
            completedArcs: (this.data.arcHistory || []).length,
            achievements: (this.data.achievements || []).filter(a => a.unlocked).length,
            streakDays: p.streakDays || 1
        };

        const { hunterRank, bodyLevel, completedArcs, achievements, streakDays } = metrics;

        // Stage 5: Monarch
        if (['S', 'NATIONAL', 'SHADOW MONARCH', 'MULTIVERSE', 'TRANSCENDENT'].includes(hunterRank) || bodyLevel >= 35) {
            return {
                stageKey: 'monarch',
                title: 'Monarch / Apex Sovereign',
                auraColor: '#8b5cf6',
                auraGlow: '0 0 35px rgba(139, 92, 246, 0.7)',
                avatarIcon: '👑',
                badgeText: 'STAGE V: MONARCH',
                description: 'Apex physical vessel. Boundless work capacity and transcendent mind-muscle synergy.'
            };
        }

        // Stage 4: Elite
        if (['A', 'B'].includes(hunterRank) || bodyLevel >= 20 || completedArcs >= 3) {
            return {
                stageKey: 'elite',
                title: 'Elite Commander',
                auraColor: '#00f2fe',
                auraGlow: '0 0 28px rgba(0, 242, 254, 0.6)',
                avatarIcon: '⚡',
                badgeText: 'STAGE IV: ELITE',
                description: 'Mastered intermediate compound progressions and advanced calisthenics ladders.'
            };
        }

        // Stage 3: Evolved
        if (hunterRank === 'C' || bodyLevel >= 10 || completedArcs >= 1 || streakDays >= 14) {
            return {
                stageKey: 'evolved',
                title: 'Evolved Striker',
                auraColor: '#38bdf8',
                auraGlow: '0 0 22px rgba(56, 189, 248, 0.5)',
                avatarIcon: '⚔️',
                badgeText: 'STAGE III: EVOLVED',
                description: 'Established progressive overload trajectory and high metabolic efficiency.'
            };
        }

        // Stage 2: Foundation
        if (hunterRank === 'D' || bodyLevel >= 5 || streakDays >= 7) {
            return {
                stageKey: 'foundation',
                title: 'Foundation Hunter',
                auraColor: '#22c55e',
                auraGlow: '0 0 18px rgba(34, 197, 94, 0.45)',
                avatarIcon: '🛡️',
                badgeText: 'STAGE II: FOUNDATION',
                description: 'Solidified daily recovery and baseline movement biomechanics.'
            };
        }

        // Stage 1: Awakened
        return {
            stageKey: 'awakened',
            title: 'Awakened Initiate',
            auraColor: '#9ca3af',
            auraGlow: '0 0 12px rgba(156, 163, 175, 0.3)',
            avatarIcon: '👤',
            badgeText: 'STAGE I: AWAKENED',
            description: 'Synchronized with System 3.0. Establishing initial baseline measurements.'
        };
    }

    allocateStat(statKey) {
        if (this.data.player.unallocatedPoints <= 0) return false;
        if (!(statKey in this.data.stats)) return false;

        this.data.stats[statKey] += 1;
        this.data.player.unallocatedPoints -= 1;
        this.save();
        return true;
    }

    autoAssignStats() {
        if (this.data.player.unallocatedPoints <= 0) return;
        const keys = Object.keys(this.data.stats);
        while (this.data.player.unallocatedPoints > 0) {
            const key = keys[Math.floor(Math.random() * keys.length)];
            this.data.stats[key] += 1;
            this.data.player.unallocatedPoints -= 1;
        }
        this.save();
    }

    logEvent(event) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.data.activityLog.unshift({ time: `Today, ${time}`, event });
        if (this.data.activityLog.length > 50) this.data.activityLog.pop();
    }

    calculateAdaptiveTDEE() {
        const a = this.data.assessment;
        // Baseline BMR: Mifflin-St Jeor
        let bmr = (10 * a.currentWeightKg) + (6.25 * a.heightCm) - (5 * a.age);
        bmr = (a.sex === 'female') ? (bmr - 161) : (bmr + 5);

        let activityMultiplier = 1.2;
        if (a.daysPerWeek >= 6) activityMultiplier = 1.65;
        else if (a.daysPerWeek >= 4) activityMultiplier = 1.5;
        else if (a.daysPerWeek >= 2) activityMultiplier = 1.35;

        const initialTdee = Math.round(bmr * activityMultiplier);
        this.data.tdeeModel.initialEstimatedBmr = Math.round(bmr);
        this.data.tdeeModel.initialEstimatedTdee = initialTdee;

        // Dynamic target adjusted by active phase
        let targetCals = initialTdee;
        let protGramsPerKg = 1.8;

        const phase = this.data.player.activePhase;
        if (phase === 'FAT_LOSS' || a.physiqueArchetype === 'cut') {
            targetCals = Math.round(initialTdee - (initialTdee * 0.18)); // 18% safe deficit
            protGramsPerKg = 2.0;
        } else if (phase === 'RECOMPOSITION' || a.physiqueArchetype === 'vtaper' || a.physiqueArchetype === 'aesthetic') {
            targetCals = Math.round(initialTdee - (initialTdee * 0.08)); // 8% recomp deficit
            protGramsPerKg = 2.0;
        } else if (phase === 'MUSCLE_GAIN' || a.physiqueArchetype === 'bulk') {
            targetCals = Math.round(initialTdee + 250); // Clean 250 surplus
            protGramsPerKg = 1.8;
        } else if (phase === 'ATHLETIC_PERFORMANCE' || a.physiqueArchetype === 'athlete' || a.physiqueArchetype === 'combat') {
            targetCals = Math.round(initialTdee + 100);
            protGramsPerKg = 1.9;
        }

        const proteinGrams = Math.round(a.currentWeightKg * protGramsPerKg);
        const fatGrams = Math.round((targetCals * 0.25) / 9);
        const carbGrams = Math.max(70, Math.round((targetCals - (proteinGrams * 4) - (fatGrams * 9)) / 4));

        this.data.tdeeModel.targetCalories = targetCals;
        this.data.nutrition.caloriesTarget = targetCals;
        this.data.nutrition.proteinTarget = proteinGrams;
        this.data.nutrition.carbsTarget = carbGrams;
        this.data.nutrition.fatsTarget = fatGrams;

        // Calculate Dynamic Hydration
        this.calculateDynamicHydration();

        return {
            bmr: Math.round(bmr),
            initialTdee,
            targetCals,
            proteinGrams,
            carbGrams,
            fatGrams
        };
    }

    calculateDynamicHydration() {
        const w = this.data.assessment.currentWeightKg;
        const baseNeed = +(w * 0.035).toFixed(2); // 35ml / kg
        const exerciseAdj = this.data.assessment.minutesPerSession > 45 ? 0.6 : 0.3;
        
        this.data.hydration.baselineNeedLiters = baseNeed;
        this.data.hydration.exerciseAdjustmentLiters = exerciseAdj;
        
        if (!this.data.hydration.userOverride) {
            this.data.hydration.configuredTargetLiters = +(baseNeed + exerciseAdj).toFixed(1);
        }
    }

    // USER ROLES & PERMISSIONS
    setUserRole(role) {
        const validRoles = ['HUNTER', 'COACH', 'ADMIN'];
        if (!validRoles.includes(role)) return;
        this.data.currentUserRole = role;
        this.save();
        if (window.app) {
            window.app.showToast('ROLE CHANGED', `Active perspective set to ${role}`);
            window.app.syncUI();
        }
    }

    getUserRole() {
        return this.data.currentUserRole || 'HUNTER';
    }

    getRolePermissions() {
        const role = this.getUserRole();
        return {
            canManageOwnProfile: true,
            canManageClients: role === 'COACH' || role === 'ADMIN',
            canManageDatabases: role === 'ADMIN',
            canManageRules: role === 'ADMIN',
            canManageSubscriptions: role === 'ADMIN'
        };
    }

    // DATABASE MIGRATION SCHEMA EXPORTER
    exportDatabaseSchema() {
        const d = this.data;
        return {
            schemaVersion: '3.1.0',
            exportedAt: new Date().toISOString(),
            tables: {
                users: [{ id: d.player.id, name: d.player.name, role: d.currentUserRole || 'HUNTER' }],
                profiles: [d.player],
                assessments: [d.assessment],
                measurements: d.progressHistory?.weightLogs || [],
                workouts: d.training?.weeklySchedule || [],
                workoutLogs: d.training?.exerciseLogs || [],
                nutritionLogs: d.nutrition?.dailyMeals || [],
                recoveryLogs: [d.recoveryMetrics],
                xpTracks: d.xpTracks,
                arcs: d.arcHistory || [],
                clients: this.clients,
                auditLogs: (window.auditTrail ? window.auditTrail.getAllLogs() : []),
                planVersions: (window.programVersioning ? window.programVersioning.getClientHistory('hunter_main') : {})
            }
        };
    }
}

window.systemState = new MasterSystemState();

