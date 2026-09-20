/**
 * MULTIVERSE HUNTER — SYSTEM STATE & CORE DATA ENGINE
 * Manages player profile, 10-step onboarding data, 4 training realms,
 * ICMR Indian nutrition, recovery check-ins, calisthenics skill tree,
 * 30-day adaptive arcs, coaching client profiles, and localStorage persistence.
 */

class SystemState {
    constructor() {
        this.STORAGE_KEY = 'MULTIVERSE_HUNTER_ASCENSION_V2';
        this.CLIENTS_STORAGE_KEY = 'MULTIVERSE_HUNTER_CLIENTS_V2';
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
            version: '2.0',
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),

            // MAIN CHARACTER IDENTITY
            player: {
                id: 'hunter_main',
                name: 'Hunter',
                title: 'Awakened Initiate',
                job: 'None (Unawakened)',
                rank: 'E',
                level: 1,
                xp: 0,
                xpToNext: 100,
                totalXpEarned: 0,
                unallocatedPoints: 5,
                gold: 150,
                crystals: 10,
                hpCurrent: 100,
                hpMax: 100,
                mpCurrent: 50,
                mpMax: 50,
                fatigue: 0,
                streakDays: 1,
                lastStreakDate: new Date().toDateString(),
                activeArc: 'Awakening Arc (Days 1–7)',
                arcDay: 1,
                assignedMentor: 'jinwoo'
            },

            // 8 SYSTEM STATS
            stats: {
                str: 10, // Strength (Lifting, Muscle, Power)
                agi: 10, // Agility (Cardio, Speed, Ground)
                vit: 10, // Vitality (Health, Rest, Stamina)
                int: 10, // Intelligence (Study, Coding, Technical)
                focus: 10, // Deep Focus (Concentration, Pomodoro)
                will: 10, // Willpower (Discipline, Consistency)
                energy: 10, // Life Energy (Vitality & Readiness)
                biz: 10 // Business / Career XP
            },

            // 6 DOMAIN BODY LEVELS
            bodyLevels: {
                strengthLevel: 1,
                cardioLevel: 1,
                mobilityLevel: 1,
                calisthenicsLevel: 1,
                bodyCompLevel: 1,
                recoveryLevel: 1
            },

            // ONBOARDING & ASSESSMENT PROFILE
            assessment: {
                // Identity
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

                // Goals
                physiqueArchetype: 'vtaper', // vtaper | athlete | lean_muscle | bulk | cut | slim_fit | aesthetic | combat
                primaryObjective: 'V-Taper Physique',
                secondaryObjective: 'Healthy Fat Loss & Recomp',
                timelineWeeks: 12,

                // Training Real & Equipment
                trainingRealms: ['gym', 'home', 'ground', 'calisthenics'],
                gymEquipment: ['barbell', 'dumbbells', 'cables', 'machines', 'pullup_bar'],
                homeEquipment: ['dumbbells', 'pullup_bar', 'bands'],
                fitnessLevel: 'beginner', // beginner | intermediate | advanced
                daysPerWeek: 4,
                minutesPerSession: 50,
                preferredTime: 'evening',

                // Baseline Capabilities
                capabilities: {
                    pushups: 15,
                    squats: 25,
                    pullups: 2,
                    plankSec: 45,
                    runningKm: 2.0,
                    runningMins: 14
                },

                // Nutrition Profile
                dietType: 'non_veg', // veg | egg_veg | non_veg
                mealFrequency: 3, // 2 | 3 | 4 | flexible
                foodBudget: 'medium', // low | medium | high
                cookPreference: 'self', // self | family | service | outside
                dislikedFoods: [],
                favoriteIndianFoods: ['rice', 'roti', 'chicken', 'dal', 'paneer', 'curd', 'eggs'],
                waterTargetLiters: 3.5,

                // Safety & Medical Limitations
                hasInjuries: false,
                injuryDetails: 'None',
                exerciseLimitations: 'None',

                // Life & Business Allocation
                timeAllocation: {
                    fitness: 25,
                    learning: 35,
                    business: 25,
                    life: 15
                }
            },

            // RECOVERY & READINESS
            recovery: {
                lastCheckDate: new Date().toDateString(),
                sleepScore: 4, // 1-5
                energyScore: 4,
                sorenessScore: 2,
                stressScore: 2,
                motivationScore: 5,
                readinessState: 'GREEN', // GREEN | YELLOW | RED
                readinessMessage: 'Optimal recovery. All systems cleared for peak performance.',
                healthIndex: 84, // 0 - 100
                pillarScores: {
                    movement: 88,
                    strength: 82,
                    recovery: 85,
                    nutrition: 80,
                    consistency: 86
                }
            },

            // TRAINING STATE & ACTIVE WORKOUTS
            training: {
                activeRealm: 'gym', // 'gym' | 'home' | 'ground' | 'calisthenics'
                currentDayIndex: 0, // 0 = Mon, 1 = Tue, etc.
                todayCompleted: false,
                gymPlan: 'Upper Body (Push/Pull Focus)',
                homePlan: 'Dumbbell & Calisthenics Hybrid',
                groundPlan: '3.5 km Interval Run & Mobility',
                calisthenicsPlan: 'Push & Pull Progression Ladder',
                weeklySchedule: [
                    { day: 'Monday', realm: 'gym', title: 'Gym — Upper Body (V-Taper Priority)', duration: '55 min', focus: 'Shoulders, Lats, Upper Chest', status: 'pending' },
                    { day: 'Tuesday', realm: 'ground', title: 'Ground — Interval Running & Core', duration: '35 min', focus: 'Cardio, Agility, VO2 Max', status: 'pending' },
                    { day: 'Wednesday', realm: 'home', title: 'Home — Mobility, Core & Active Rest', duration: '30 min', focus: 'Spine, Hips, Core Resilience', status: 'pending' },
                    { day: 'Thursday', realm: 'gym', title: 'Gym — Lower Body & Hypertrophy', duration: '50 min', focus: 'Quads, Hamstrings, Calves', status: 'pending' },
                    { day: 'Friday', realm: 'calisthenics', title: 'Calisthenics — Skill & Mastery Tree', duration: '45 min', focus: 'Pull-up Ladder, Dip/Push Progressions', status: 'pending' },
                    { day: 'Saturday', realm: 'ground', title: 'Ground / Outdoor — 5km Tempo Run', duration: '40 min', focus: 'Endurance, Ground Work', status: 'pending' },
                    { day: 'Sunday', realm: 'home', title: 'Rest & Deep Recovery Protocol', duration: '20 min', focus: 'Breathwork, Light Walk, Recovery XP', status: 'pending' }
                ],
                exerciseLogs: []
            },

            // CALISTHENICS PROGRESSION STATE
            calisthenicsMastery: {
                push: { currentTier: 3, unlockedName: 'Standard Push-up', nextTierName: 'Diamond Push-up' },
                pull: { currentTier: 3, unlockedName: 'Assisted Pull-up', nextTierName: 'Bodyweight Pull-up' },
                legs: { currentTier: 2, unlockedName: 'Split Squat', nextTierName: 'Bulgarian Split Squat' },
                core: { currentTier: 2, unlockedName: 'Lying Leg Raise', nextTierName: 'Hanging Knee Raise' },
                skills: {
                    handstand: { unlocked: false, progressPct: 35, req: 'Push-up Tier 4 + Pike Hold' },
                    lsit: { unlocked: false, progressPct: 40, req: 'Core Tier 3 + Dead Hang 45s' },
                    muscleup: { unlocked: false, progressPct: 15, req: '10 Strict Pull-ups + 15 Dips' },
                    frontlever: { unlocked: false, progressPct: 10, req: 'Pull-up Tier 5' },
                    planche: { unlocked: false, progressPct: 5, req: 'Handstand Master' }
                }
            },

            // NUTRITION & INDIAN FOOD TRACKER
            nutrition: {
                caloriesTarget: 2150,
                proteinTarget: 145,
                carbsTarget: 235,
                fatsTarget: 65,
                waterTargetLiters: 3.5,
                caloriesConsumed: 1250,
                proteinConsumed: 92,
                carbsConsumed: 135,
                fatsConsumed: 38,
                waterConsumedLiters: 2.2,
                selectedMealPlanType: '3_meals', // 2_meals | 3_meals | 4_meals
                dailyMeals: [
                    {
                        id: 'm_1',
                        name: 'Meal 1: Breakfast / Pre-Workout Fuel',
                        time: '08:30 AM',
                        items: [
                            { id: 'f_oats', name: 'Oats with Milk & Banana', portion: '60g oats + 200ml milk', cal: 360, protein: 14, carbs: 58, fat: 7 },
                            { id: 'f_eggs', name: 'Boiled Eggs (3 whole)', portion: '3 large eggs', cal: 210, protein: 18, carbs: 1, fat: 15 }
                        ],
                        logged: true
                    },
                    {
                        id: 'm_2',
                        name: 'Meal 2: Post-Workout Lunch (Indian Power Plate)',
                        time: '01:30 PM',
                        items: [
                            { id: 'f_rice', name: 'Steamed Rice', portion: '1.5 cups (200g)', cal: 260, protein: 5, carbs: 56, fat: 1 },
                            { id: 'f_chicken', name: 'Chicken Breast Curry / Grilled', portion: '150g', cal: 245, protein: 42, carbs: 2, fat: 6 },
                            { id: 'f_dal', name: 'Tadka Moong Dal', portion: '1 bowl (150g)', cal: 175, protein: 11, carbs: 22, fat: 4 },
                            { id: 'f_curd', name: 'Fresh Curd (Dahi)', portion: '1 cup (150g)', cal: 98, protein: 6, carbs: 6, fat: 5 }
                        ],
                        logged: true
                    },
                    {
                        id: 'm_3',
                        name: 'Meal 3: Dinner (V-Taper Recovery)',
                        time: '08:30 PM',
                        items: [
                            { id: 'f_roti', name: 'Whole Wheat Roti', portion: '3 rotis', cal: 270, protein: 9, carbs: 51, fat: 2 },
                            { id: 'f_paneer', name: 'Low-Oil Paneer / Soya Bhurji', portion: '120g', cal: 280, protein: 22, carbs: 6, fat: 18 },
                            { id: 'f_salad', name: 'Cucumber & Sprout Salad', portion: '1 bowl', cal: 60, protein: 4, carbs: 10, fat: 1 }
                        ],
                        logged: false
                    }
                ]
            },

            // PROGRESS & BODY MEASUREMENT HISTORY
            progressHistory: {
                weightLogs: [
                    { date: '2026-08-24', weight: 81.2, waist: 91.0, rollingAvg: 81.2, note: 'Initial Awakening' },
                    { date: '2026-08-31', weight: 80.4, waist: 90.2, rollingAvg: 80.8, note: 'Week 1 Adaptation' },
                    { date: '2026-09-07', weight: 79.5, waist: 89.4, rollingAvg: 79.9, note: 'Week 2 Overload' },
                    { date: '2026-09-14', weight: 78.7, waist: 88.6, rollingAvg: 79.1, note: 'Week 3 Recomposition' },
                    { date: '2026-09-20', weight: 78.0, waist: 88.0, rollingAvg: 78.3, note: 'Current Level' }
                ],
                personalRecords: [
                    { exercise: 'Push-ups in 1 set', record: '26 reps', prev: '15 reps', date: '2026-09-18' },
                    { exercise: 'Strict Pull-ups', record: '6 reps', prev: '2 reps', date: '2026-09-19' },
                    { exercise: '5km Running Time', record: '27m 40s', prev: '32m 10s', date: '2026-09-15' },
                    { exercise: 'Barbell Squat', record: '75 kg x 6', prev: '60 kg x 6', date: '2026-09-12' }
                ],
                weeklyArcs: [
                    { name: 'Awakening Arc (Days 1–7)', status: 'completed', completionRate: 94, xpEarned: 3400 },
                    { name: 'Foundation Arc (Days 8–14)', status: 'completed', completionRate: 88, xpEarned: 4100 },
                    { name: 'Evolution Arc (Days 15–21)', status: 'active', completionRate: 76, xpEarned: 3200 },
                    { name: 'Hunter Trial (Days 22–30)', status: 'locked', completionRate: 0, xpEarned: 0 }
                ]
            },

            // MULTIVERSE CONTENT (Mentors, Raids, Bosses, Skills, Titles)
            multiverse: {
                activeUniverse: 'solo_leveling',
                universes: ['solo_leveling', 'jjk', 'one_piece', 'naruto', 'bleach', 'dragon_ball', 'opm'],
                mentors: [
                    { id: 'jinwoo', name: 'Sung Jin-woo', universe: 'Solo Leveling', role: 'Supreme Commander', perk: '+15% STR Gain & Instant Fatigue Reset', unlocked: true, avatar: '⚔️' },
                    { id: 'gojo', name: 'Satoru Gojo', universe: 'Jujutsu Kaisen', role: 'Focus & Mind Mentor', perk: '+25% XP on 90m Deep Focus & Willpower +4', unlocked: true, avatar: '🌌' },
                    { id: 'zoro', name: 'Roronoa Zoro', universe: 'One Piece', role: 'Discipline Master', perk: '+20% Calisthenics Mastery & Habit Multiplier', unlocked: false, req: 'Reach Level 15', avatar: '⚔️' },
                    { id: 'goku', name: 'Son Goku', universe: 'Dragon Ball', role: 'Limit Breaker', perk: '+30% Ground & Cardio XP on HIIT days', unlocked: false, req: 'Reach Level 30', avatar: '🔥' },
                    { id: 'saitama', name: 'Saitama', universe: 'One Punch Man', role: 'Body Transcender', perk: '+50% XP when 100% of Daily Workout is hit', unlocked: false, req: 'Reach S-Rank', avatar: '👊' }
                ],
                bossRaids: [
                    {
                        id: 'boss_procrastination',
                        name: 'The Procrastination Demon (Ignis of Lethargy)',
                        rank: 'A-Rank',
                        icon: '👹',
                        hp: 1000,
                        currentHp: 450,
                        realObjective: '90-Minute Deep Work Session + Complete Push Workout',
                        rewardXp: 1800,
                        rewardGold: 500,
                        active: true
                    },
                    {
                        id: 'boss_sugar_fiend',
                        name: 'The Craving Behemoth (Sugar Fiend)',
                        rank: 'B-Rank',
                        icon: '🦎',
                        hp: 800,
                        currentHp: 800,
                        realObjective: 'Hit Exact Protein Target + 0 Processed Junk Food Today',
                        rewardXp: 1200,
                        rewardGold: 350,
                        active: false
                    },
                    {
                        id: 'boss_iron_titan',
                        name: 'The Iron Titan of Overtraining',
                        rank: 'S-Rank',
                        icon: '🗿',
                        hp: 2500,
                        currentHp: 2500,
                        realObjective: 'Complete 7-Day Consistency Arc without breaking recovery thresholds',
                        rewardXp: 3500,
                        rewardGold: 1000,
                        active: false
                    }
                ],
                titles: [
                    { id: 'title_weakest', name: 'The Weakest Hunter', desc: 'Starting rank of an Awakened entity.', equipped: false },
                    { id: 'title_vtaper', name: 'Architect of the V-Taper', desc: 'Achieved 4 weeks of strict upper-body adherence.', equipped: true },
                    { id: 'title_ironwill', name: 'Conqueror of Lethargy', desc: 'Defeated the Procrastination Demon boss.', equipped: false }
                ]
            },

            // LIFE & HABIT QUESTS
            quests: {
                daily: [
                    { id: 'q_workout', title: 'Complete Scheduled Realm Workout', stat: 'str', xp: 350, gold: 120, completed: false, category: 'fitness' },
                    { id: 'q_nutrition', title: 'Hit Protein Target (145g) & Calorie Goal', stat: 'vit', xp: 250, gold: 100, completed: true, category: 'nutrition' },
                    { id: 'q_ground', title: '8,000 Daily Steps / Ground Movement', stat: 'agi', xp: 200, gold: 80, completed: false, category: 'cardio' },
                    { id: 'q_coding', title: '90 Mins Deep Focus Coding / System Study', stat: 'int', xp: 400, gold: 150, completed: false, category: 'learning' },
                    { id: 'q_biz', title: 'Advance Business Task / Client Development', stat: 'biz', xp: 350, gold: 130, completed: false, category: 'business' },
                    { id: 'q_recovery', title: 'Log Morning Check-In & Drink 3.5L Water', stat: 'energy', xp: 200, gold: 70, completed: true, category: 'recovery' }
                ],
                custom: []
            },

            // SYSTEM LEARNING & AI INSIGHTS
            systemInsights: [
                { id: 'ins_1', text: 'You perform 22% better on Upper Body workouts when trained in the evening.', tag: 'TRAINING' },
                { id: 'ins_2', text: 'Your nutrition adherence is highest with a 3-meal structure vs 2-meal intermittent fasting.', tag: 'NUTRITION' },
                { id: 'ins_3', text: 'Recovery drops to YELLOW state whenever sleep falls below 6.5 hours.', tag: 'RECOVERY' },
                { id: 'ins_4', text: 'Waist circumference decreased 3.0cm over 4 weeks while push-up strength increased by 73%. Recomposition is optimal.', tag: 'RECOMPOSITION' }
            ],

            // REAL LIFE REWARDS & SHOP
            rewards: [
                { id: 'rw_gaming', title: '90 Mins Guilt-Free Video Games', cost: 400, icon: '🎮', desc: 'Unlocked through real-world quest execution.' },
                { id: 'rw_cheat', title: 'Favorite Treat / Cheat Meal', cost: 700, icon: '🍕', desc: 'Earned by hitting 6 days of nutrition adherence.' },
                { id: 'rw_movie', title: 'Cinema / Binge Night Episode Block', cost: 500, icon: '🎬', desc: 'Weekend reward for finishing weekly Hunter Arc.' }
            ],

            inventory: [
                { id: 'inv_elixir', name: 'Vitality Elixir (Electrolytes + Hydration)', icon: '🧪', qty: 4, desc: 'Restores energy and reduces muscle fatigue.' },
                { id: 'inv_key', name: 'S-Rank Gate Raid Pass (Focus Pomodoro)', icon: '🗝', qty: 2, desc: 'Unlocks high-yield Deep Focus boss raids.' }
            ],

            activityLog: [
                { time: 'Today, 08:30 AM', event: 'Logged Meal 1: Oats + 3 Boiled Eggs (+50 XP)' },
                { time: 'Today, 07:15 AM', event: 'Morning System Check completed: Status GREEN (+100 XP)' },
                { time: 'Yesterday', event: 'Upper Body Workout Cleared: Push-ups PR 26 reps (+350 XP)' }
            ]
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
            console.error('SystemState load error:', e);
            this.data = this.getDefaultData();
        }
    }

    save() {
        try {
            this.data.lastActive = new Date().toISOString();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
            this.notifyListeners();
        } catch (e) {
            console.error('SystemState save error:', e);
        }
    }

    saveClients() {
        try {
            localStorage.setItem(this.CLIENTS_STORAGE_KEY, JSON.stringify(this.clients));
        } catch (e) {
            console.error('SystemState saveClients error:', e);
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
                mealFrequency: 2,
                fitnessLevel: 'beginner',
                trainingRealms: ['home', 'ground'],
                homeEquipment: ['bodyweight'],
                physiqueArchetype: 'cut',
                caloriesTarget: 1950,
                proteinTarget: 110,
                status: 'Active (Week 2)',
                healthIndex: 68,
                currentArc: 'Awakening & Mobility Arc',
                adherenceRate: 88,
                notes: 'Sedentary desk worker. Needs joint-friendly progressions and vegetarian protein guidance.'
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
                mealFrequency: 4,
                fitnessLevel: 'intermediate',
                trainingRealms: ['gym', 'calisthenics'],
                gymEquipment: ['barbell', 'dumbbells', 'cables', 'machines'],
                physiqueArchetype: 'lean_muscle',
                caloriesTarget: 2750,
                proteinTarget: 155,
                status: 'Active (Week 6)',
                healthIndex: 91,
                currentArc: 'Hypertrophy & V-Taper Arc',
                adherenceRate: 94,
                notes: 'Wants maximum lat width, upper chest, and calisthenics muscle-up mastery.'
            },
            {
                id: 'client_103',
                name: 'Priya Nair',
                age: 28,
                sex: 'female',
                heightCm: 164,
                weightKg: 64.0,
                targetWeightKg: 58.0,
                waistCm: 80,
                dietType: 'egg_veg',
                mealFrequency: 3,
                fitnessLevel: 'beginner',
                trainingRealms: ['home', 'ground'],
                homeEquipment: ['dumbbells', 'bands'],
                physiqueArchetype: 'athlete',
                caloriesTarget: 1700,
                proteinTarget: 95,
                status: 'Active (Week 4)',
                healthIndex: 82,
                currentArc: 'Ground Endurance & Tone Arc',
                adherenceRate: 90,
                notes: 'Focus on 5k running progression and dumbbell home resistance.'
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

    // GAIN XP & REAL-LIFE LEVEL CALCULATION
    gainXp(amount, reason = '') {
        if (!amount || amount <= 0) return { leveledUp: false };
        this.data.player.xp += amount;
        this.data.player.totalXpEarned += amount;

        let leveledUp = false;
        let oldLevel = this.data.player.level;

        while (this.data.player.xp >= this.data.player.xpToNext) {
            this.data.player.xp -= this.data.player.xpToNext;
            this.data.player.level += 1;
            this.data.player.unallocatedPoints += 3;
            this.data.player.gold += 100 * this.data.player.level;
            this.data.player.crystals += 5;
            this.data.player.xpToNext = Math.floor(100 * Math.pow(this.data.player.level, 1.35));
            leveledUp = true;
        }

        this.updateRank();
        this.updateBodyLevels();

        if (reason) {
            this.logEvent(`+${amount} XP: ${reason}`);
        }

        this.save();
        return {
            leveledUp,
            oldLevel,
            newLevel: this.data.player.level,
            rank: this.data.player.rank
        };
    }

    updateRank() {
        const lvl = this.data.player.level;
        let rank = 'E';
        let job = 'Unawakened Initiate';

        if (lvl >= 200) { rank = 'TRANSCENDENT'; job = 'Cosmic Transcender'; }
        else if (lvl >= 150) { rank = 'MULTIVERSE'; job = 'Multiverse Vanguard'; }
        else if (lvl >= 100) { rank = 'SHADOW MONARCH'; job = 'Monarch of Shadows'; }
        else if (lvl >= 75) { rank = 'NATIONAL'; job = 'National Level Hunter'; }
        else if (lvl >= 50) { rank = 'S'; job = 'S-Rank Elite Master'; }
        else if (lvl >= 40) { rank = 'A'; job = 'A-Rank Commander'; }
        else if (lvl >= 30) { rank = 'B'; job = 'B-Rank Vanguard'; }
        else if (lvl >= 20) { rank = 'C'; job = 'C-Rank Striker'; }
        else if (lvl >= 10) { rank = 'D'; job = 'D-Rank Awakened'; }
        else { rank = 'E'; job = 'E-Rank Novice'; }

        this.data.player.rank = rank;
        this.data.player.job = job;
    }

    updateBodyLevels() {
        const p = this.data.stats;
        this.data.bodyLevels.strengthLevel = Math.max(1, Math.floor(p.str / 10));
        this.data.bodyLevels.cardioLevel = Math.max(1, Math.floor(p.agi / 10));
        this.data.bodyLevels.mobilityLevel = Math.max(1, Math.floor((p.agi + p.vit) / 20));
        this.data.bodyLevels.calisthenicsLevel = Math.max(1, Math.floor((p.str + p.agi) / 20));
        this.data.bodyLevels.bodyCompLevel = Math.max(1, Math.floor((p.str + p.vit + p.will) / 30));
        this.data.bodyLevels.recoveryLevel = Math.max(1, Math.floor((p.vit + p.energy) / 20));
    }

    allocateStat(statKey) {
        if (this.data.player.unallocatedPoints <= 0) return false;
        if (!(statKey in this.data.stats)) return false;

        this.data.stats[statKey] += 1;
        this.data.player.unallocatedPoints -= 1;
        this.updateBodyLevels();
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
        this.updateBodyLevels();
        this.save();
    }

    logEvent(event) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.data.activityLog.unshift({ time: `Today, ${time}`, event });
        if (this.data.activityLog.length > 50) this.data.activityLog.pop();
    }

    calculateTDEE() {
        const a = this.data.assessment;
        // Mifflin-St Jeor Formula
        let bmr = (10 * a.currentWeightKg) + (6.25 * a.heightCm) - (5 * a.age);
        bmr = (a.sex === 'female') ? (bmr - 161) : (bmr + 5);

        // Activity Multiplier based on days
        let activityMultiplier = 1.2;
        if (a.daysPerWeek >= 6) activityMultiplier = 1.7;
        else if (a.daysPerWeek >= 4) activityMultiplier = 1.55;
        else if (a.daysPerWeek >= 2) activityMultiplier = 1.375;

        const tdee = Math.round(bmr * activityMultiplier);

        // Goal Adjustment
        let calorieTarget = tdee;
        let proteinPerKg = 1.8;

        switch (a.physiqueArchetype) {
            case 'cut':
            case 'slim_fit':
                calorieTarget = Math.round(tdee - (tdee * 0.18)); // Safe 18% deficit
                proteinPerKg = 2.0;
                break;
            case 'vtaper':
            case 'aesthetic':
            case 'recomp':
                calorieTarget = Math.round(tdee - (tdee * 0.10)); // Moderate recomp deficit
                proteinPerKg = 2.0;
                break;
            case 'lean_muscle':
            case 'athlete':
            case 'combat':
                calorieTarget = Math.round(tdee + 150); // Slight lean surplus
                proteinPerKg = 1.9;
                break;
            case 'bulk':
                calorieTarget = Math.round(tdee + 350); // Controlled surplus
                proteinPerKg = 1.8;
                break;
            default:
                calorieTarget = tdee;
        }

        const proteinGrams = Math.round(a.currentWeightKg * proteinPerKg);
        const fatGrams = Math.round((calorieTarget * 0.25) / 9);
        const carbGrams = Math.max(80, Math.round((calorieTarget - (proteinGrams * 4) - (fatGrams * 9)) / 4));

        this.data.nutrition.caloriesTarget = calorieTarget;
        this.data.nutrition.proteinTarget = proteinGrams;
        this.data.nutrition.carbsTarget = carbGrams;
        this.data.nutrition.fatsTarget = fatGrams;
        this.data.nutrition.waterTargetLiters = Math.max(3.0, +(a.currentWeightKg * 0.045).toFixed(1));

        return {
            bmr: Math.round(bmr),
            tdee,
            calorieTarget,
            proteinGrams,
            carbGrams,
            fatGrams,
            waterTarget: this.data.nutrition.waterTargetLiters
        };
    }
}

// Global Singleton
window.systemState = new SystemState();
