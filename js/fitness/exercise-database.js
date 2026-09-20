/**
 * MULTIVERSE HUNTER — MOVEMENT PATTERN & EXERCISE DATABASE
 * Comprehensive biomechanical taxonomy supporting:
 * - Movement Patterns: squat, hinge, push_horizontal, push_vertical, pull_horizontal, pull_vertical, core, carry, conditioning
 * - Muscle Focus: chest, lats, shoulders, quads, hamstrings, glutes, triceps, biceps, abs
 * - Equipment Tags: barbell, dumbbells, cables, machines, pullup_bar, bands, bodyweight, household_backpack
 * - Progressions & Regressions
 * - Contraindications / Injury Flags: knee_pain, lower_back_fatigue, shoulder_impingement
 * - Scalable Alternatives
 */

class ExerciseDatabase {
    constructor() {
        this.exercises = this.getDatabase();
    }

    getDatabase() {
        return [
            // PULL VERTICAL (Lats / Back Width / V-Taper)
            {
                id: 'ex_lat_pulldown',
                name: 'Lat Pulldown (Wide Grip)',
                pattern: 'pull_vertical',
                primaryMuscles: ['lats', 'teres_major'],
                secondaryMuscles: ['biceps', 'rhomboids'],
                equipment: ['cables', 'machines'],
                difficulty: 2,
                progressions: ['ex_strict_pullup', 'ex_weighted_pullup'],
                regressions: ['ex_band_lat_pulldown', 'ex_inverted_row'],
                contraindications: ['shoulder_impingement'],
                alternatives: ['ex_strict_pullup', 'ex_band_lat_pulldown', 'ex_db_row', 'ex_backpack_row']
            },
            {
                id: 'ex_strict_pullup',
                name: 'Strict Bodyweight Pull-up',
                pattern: 'pull_vertical',
                primaryMuscles: ['lats', 'rhomboids'],
                secondaryMuscles: ['biceps', 'forearms', 'core'],
                equipment: ['pullup_bar'],
                difficulty: 3,
                progressions: ['ex_chest_to_bar', 'ex_muscleup'],
                regressions: ['ex_assisted_pullup', 'ex_inverted_row', 'ex_dead_hang'],
                contraindications: ['shoulder_impingement'],
                alternatives: ['ex_lat_pulldown', 'ex_assisted_pullup', 'ex_db_row', 'ex_band_pulldown']
            },
            {
                id: 'ex_assisted_pullup',
                name: 'Band / Machine Assisted Pull-up',
                pattern: 'pull_vertical',
                primaryMuscles: ['lats'],
                secondaryMuscles: ['biceps'],
                equipment: ['bands', 'pullup_bar', 'machines'],
                difficulty: 2,
                progressions: ['ex_strict_pullup'],
                regressions: ['ex_dead_hang', 'ex_inverted_row'],
                contraindications: [],
                alternatives: ['ex_lat_pulldown', 'ex_inverted_row', 'ex_db_row']
            },

            // PUSH VERTICAL (Shoulders / Delts / V-Taper Frame)
            {
                id: 'ex_db_overhead_press',
                name: 'Dumbbell Seated / Standing Overhead Press',
                pattern: 'push_vertical',
                primaryMuscles: ['front_delts', 'lateral_delts'],
                secondaryMuscles: ['triceps', 'upper_chest'],
                equipment: ['dumbbells'],
                difficulty: 2,
                progressions: ['ex_barbell_ohp', 'ex_handstand_pushup'],
                regressions: ['ex_seated_db_press', 'ex_pike_pushup'],
                contraindications: ['shoulder_impingement', 'lower_back_fatigue'],
                alternatives: ['ex_pike_pushup', 'ex_band_overhead_press', 'ex_barbell_ohp']
            },
            {
                id: 'ex_pike_pushup',
                name: 'Pike Push-ups (Elevated Feet)',
                pattern: 'push_vertical',
                primaryMuscles: ['deltoids'],
                secondaryMuscles: ['triceps', 'serratus'],
                equipment: ['bodyweight'],
                difficulty: 3,
                progressions: ['ex_wall_handstand_pushup'],
                regressions: ['ex_floor_pike_pushup', 'ex_incline_pushup'],
                contraindications: ['wrist_pain'],
                alternatives: ['ex_db_overhead_press', 'ex_band_overhead_press']
            },
            {
                id: 'ex_db_lateral_raise',
                name: 'Dumbbell Lateral Raises (Side Delts)',
                pattern: 'push_vertical',
                primaryMuscles: ['lateral_delts'],
                secondaryMuscles: ['traps'],
                equipment: ['dumbbells'],
                difficulty: 2,
                progressions: ['ex_cable_lateral_raise'],
                regressions: ['ex_band_lateral_raise'],
                contraindications: [],
                alternatives: ['ex_cable_lateral_raise', 'ex_band_lateral_raise']
            },

            // PUSH HORIZONTAL (Chest / Triceps)
            {
                id: 'ex_incline_db_press',
                name: 'Incline Dumbbell Chest Press',
                pattern: 'push_horizontal',
                primaryMuscles: ['upper_chest'],
                secondaryMuscles: ['front_delts', 'triceps'],
                equipment: ['dumbbells'],
                difficulty: 2,
                progressions: ['ex_barbell_incline_bench'],
                regressions: ['ex_decline_pushup'],
                contraindications: ['shoulder_impingement'],
                alternatives: ['ex_decline_pushup', 'ex_flat_db_press', 'ex_tempo_pushup']
            },
            {
                id: 'ex_standard_pushup',
                name: 'Standard Hollow-Body Push-up',
                pattern: 'push_horizontal',
                primaryMuscles: ['chest', 'triceps'],
                secondaryMuscles: ['core', 'front_delts'],
                equipment: ['bodyweight'],
                difficulty: 2,
                progressions: ['ex_diamond_pushup', 'ex_decline_pushup', 'ex_archer_pushup'],
                regressions: ['ex_knee_pushup', 'ex_incline_pushup'],
                contraindications: ['wrist_pain'],
                alternatives: ['ex_incline_db_press', 'ex_flat_db_press', 'ex_band_pushup']
            },

            // PULL HORIZONTAL (Rhomboids / Mid-Back Thickness)
            {
                id: 'ex_seated_cable_row',
                name: 'Seated Cable Row / Neutral Grip',
                pattern: 'pull_horizontal',
                primaryMuscles: ['rhomboids', 'mid_traps', 'lats'],
                secondaryMuscles: ['biceps', 'rear_delts'],
                equipment: ['cables', 'machines'],
                difficulty: 2,
                progressions: ['ex_barbell_row', 'ex_chest_supported_tbar'],
                regressions: ['ex_band_seated_row'],
                contraindications: [],
                alternatives: ['ex_db_single_arm_row', 'ex_inverted_row', 'ex_backpack_row']
            },
            {
                id: 'ex_db_single_arm_row',
                name: 'Single-Arm Dumbbell Row',
                pattern: 'pull_horizontal',
                primaryMuscles: ['lats', 'rhomboids'],
                secondaryMuscles: ['biceps'],
                equipment: ['dumbbells'],
                difficulty: 2,
                progressions: ['ex_heavy_kroc_row'],
                regressions: ['ex_band_row'],
                contraindications: ['lower_back_fatigue'],
                alternatives: ['ex_seated_cable_row', 'ex_inverted_row', 'ex_backpack_row']
            },
            {
                id: 'ex_inverted_row',
                name: 'Inverted Bodyweight Row (Table / Bar)',
                pattern: 'pull_horizontal',
                primaryMuscles: ['upper_back', 'rhomboids'],
                secondaryMuscles: ['biceps', 'grip'],
                equipment: ['pullup_bar', 'bodyweight'],
                difficulty: 2,
                progressions: ['ex_feet_elevated_inverted_row'],
                regressions: ['ex_high_angle_inverted_row'],
                contraindications: [],
                alternatives: ['ex_db_single_arm_row', 'ex_band_row', 'ex_backpack_row']
            },
            {
                id: 'ex_backpack_row',
                name: 'Weighted Backpack / Household Row',
                pattern: 'pull_horizontal',
                primaryMuscles: ['lats', 'rhomboids'],
                secondaryMuscles: ['biceps'],
                equipment: ['household_backpack'],
                difficulty: 1,
                progressions: ['ex_db_single_arm_row'],
                regressions: ['ex_towel_door_row'],
                contraindications: [],
                alternatives: ['ex_db_single_arm_row', 'ex_inverted_row']
            },

            // SQUAT & LOWER BODY
            {
                id: 'ex_barbell_squat',
                name: 'Barbell Back Squat',
                pattern: 'squat',
                primaryMuscles: ['quads', 'glutes'],
                secondaryMuscles: ['hamstrings', 'erectors', 'core'],
                equipment: ['barbell'],
                difficulty: 3,
                progressions: ['ex_heavy_squat_5x5'],
                regressions: ['ex_db_goblet_squat', 'ex_box_squat'],
                contraindications: ['knee_pain', 'lower_back_fatigue'],
                alternatives: ['ex_db_goblet_squat', 'ex_bulgarian_split_squat', 'ex_leg_press']
            },
            {
                id: 'ex_db_goblet_squat',
                name: 'Dumbbell Goblet Squat',
                pattern: 'squat',
                primaryMuscles: ['quads', 'glutes'],
                secondaryMuscles: ['core', 'upper_back'],
                equipment: ['dumbbells'],
                difficulty: 2,
                progressions: ['ex_barbell_squat', 'ex_bulgarian_split_squat'],
                regressions: ['ex_air_squat', 'ex_box_squat'],
                contraindications: ['knee_pain'],
                alternatives: ['ex_barbell_squat', 'ex_bulgarian_split_squat', 'ex_air_squat']
            },
            {
                id: 'ex_bulgarian_split_squat',
                name: 'Bulgarian Split Squat (Rear Foot Elevated)',
                pattern: 'squat',
                primaryMuscles: ['quads', 'glutes'],
                secondaryMuscles: ['adductors', 'core'],
                equipment: ['dumbbells', 'bodyweight'],
                difficulty: 3,
                progressions: ['ex_weighted_pistol_squat'],
                regressions: ['ex_split_squat', 'ex_reverse_lunge'],
                contraindications: ['knee_pain'],
                alternatives: ['ex_db_goblet_squat', 'ex_reverse_lunge', 'ex_leg_press']
            },
            {
                id: 'ex_air_squat',
                name: 'Bodyweight Air Squat (Tempo 3-1-1)',
                pattern: 'squat',
                primaryMuscles: ['quads', 'glutes'],
                secondaryMuscles: ['calves'],
                equipment: ['bodyweight'],
                difficulty: 1,
                progressions: ['ex_db_goblet_squat', 'ex_split_squat'],
                regressions: ['ex_box_assisted_squat'],
                contraindications: [],
                alternatives: ['ex_box_squat', 'ex_glute_bridge']
            },

            // HINGE (Hamstrings / Posterior Chain)
            {
                id: 'ex_romanian_deadlift',
                name: 'Dumbbell / Barbell Romanian Deadlift (RDL)',
                pattern: 'hinge',
                primaryMuscles: ['hamstrings', 'glutes'],
                secondaryMuscles: ['erectors', 'lats'],
                equipment: ['barbell', 'dumbbells'],
                difficulty: 3,
                progressions: ['ex_heavy_deadlift'],
                regressions: ['ex_single_leg_rdl', 'ex_glute_bridge'],
                contraindications: ['lower_back_fatigue'],
                alternatives: ['ex_single_leg_rdl', 'ex_glute_bridge', 'ex_hamstring_curl']
            },
            {
                id: 'ex_glute_bridge',
                name: 'Glute Bridge / Hip Thrust',
                pattern: 'hinge',
                primaryMuscles: ['glutes', 'hamstrings'],
                secondaryMuscles: ['core'],
                equipment: ['bodyweight', 'dumbbells', 'barbell'],
                difficulty: 1,
                progressions: ['ex_single_leg_glute_bridge', 'ex_barbell_hip_thrust'],
                regressions: ['ex_bodyweight_glute_bridge'],
                contraindications: [],
                alternatives: ['ex_romanian_deadlift', 'ex_single_leg_rdl']
            }
        ];
    }

    findExercise(id) {
        return this.exercises.find(e => e.id === id);
    }

    filterByEquipment(availableEquipmentList) {
        return this.exercises.filter(ex => {
            return ex.equipment.some(eq => availableEquipmentList.includes(eq));
        });
    }

    filterByContraindications(contraindicationList) {
        if (!contraindicationList || contraindicationList.length === 0) return this.exercises;
        return this.exercises.filter(ex => {
            return !ex.contraindications.some(c => contraindicationList.includes(c));
        });
    }
}

window.exerciseDatabase = new ExerciseDatabase();
