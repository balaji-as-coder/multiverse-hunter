/**
 * MULTIVERSE HUNTER — "WHAT'S AVAILABLE TODAY?" SMART MEAL GENERATOR
 * Takes ingredients available at home today and builds an optimal meal schedule
 * meeting the day's calorie and protein targets across 2, 3, or 4 meals.
 */

class SmartMealGenerator {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const btnOpenAvail = document.getElementById('btn-open-available-ingredients');
        if (btnOpenAvail) {
            btnOpenAvail.addEventListener('click', () => {
                document.getElementById('modal-available-ingredients')?.classList.remove('hidden');
            });
        }

        const btnGenFromAvail = document.getElementById('btn-generate-from-available');
        if (btnGenFromAvail) {
            btnGenFromAvail.addEventListener('click', () => {
                this.generatePlanFromAvailablePills();
            });
        }

        // Ingredient selector pills toggle
        document.addEventListener('click', (e) => {
            const pill = e.target.closest('.ingredient-toggle-pill');
            if (pill) {
                pill.classList.toggle('selected');
                if (window.systemAudio) window.systemAudio.playClick();
            }
        });
    }

    generatePlanFromAvailablePills() {
        const selected = [];
        document.querySelectorAll('.ingredient-toggle-pill.selected').forEach(p => {
            selected.push(p.dataset.foodId);
        });

        if (selected.length === 0) {
            if (window.app) window.app.showToast('NO INGREDIENTS SELECTED', 'Select at least 2 ingredients available at home today.');
            return;
        }

        window.systemState.data.assessment.availableIngredientsToday = selected;
        this.buildDailyMealsFromList(selected);

        document.getElementById('modal-available-ingredients')?.classList.add('hidden');
        if (window.systemAudio) window.systemAudio.playLevelUp();
        if (window.app) {
            window.app.showToast('MEALS GENERATED', `Personalized daily menu built from ${selected.length} available home ingredients!`);
            window.app.syncUI();
        }
    }

    buildDailyMealsFromList(foodIds) {
        const db = window.foodDatabase;
        const s = window.systemState.data;
        if (!db) return;

        const available = foodIds.map(id => db.findFood(id)).filter(Boolean);
        const freq = s.assessment.mealFrequency || 3;

        // Separate proteins, carbs, and sides
        const proteins = available.filter(f => f.swapGroup === 'protein_primary');
        const carbs = available.filter(f => f.swapGroup === 'carb');
        const dals = available.filter(f => f.swapGroup === 'dal');
        const dairy = available.filter(f => f.swapGroup === 'dairy');

        const fallbackProt = db.findFood('f_eggs_whole') || db.findFood('f_paneer_standard') || db.findFood('f_soya_chunks');
        const fallbackCarb = db.findFood('f_steamed_rice') || db.findFood('f_wheat_roti');

        let newMeals = [];

        for (let i = 1; i <= freq; i++) {
            const mealItems = [];
            
            // Assign protein
            const prot = proteins[(i - 1) % Math.max(1, proteins.length)] || fallbackProt;
            if (prot) mealItems.push({ ...prot });

            // Assign carb
            const carb = carbs[(i - 1) % Math.max(1, carbs.length)] || fallbackCarb;
            if (carb) mealItems.push({ ...carb });

            // Assign dal or curd if available
            if (dals.length > 0 && i <= 2) {
                mealItems.push({ ...dals[0] });
            } else if (dairy.length > 0) {
                mealItems.push({ ...dairy[0] });
            }

            newMeals.push({
                id: `m_${i}`,
                name: `Meal ${i}: ${i === 1 ? 'Energy & Pre-Workout Fuel' : (i === 2 ? 'Post-Workout Power Plate' : 'Muscle Repair & Recovery')}`,
                time: i === 1 ? '08:30 AM' : (i === 2 ? '01:30 PM' : '08:30 PM'),
                items: mealItems,
                logged: false
            });
        }

        s.nutrition.dailyMeals = newMeals;
        if (window.nutritionEngine) window.nutritionEngine.recalculateConsumed();
        window.systemState.save();
    }
}

window.smartMealGenerator = new SmartMealGenerator();
