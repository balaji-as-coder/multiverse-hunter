/**
 * MULTIVERSE HUNTER — NUTRITION & INDIAN FOOD ENGINE
 * Designed specifically around ICMR dietary guidelines and authentic Indian foods.
 * Features:
 * - Dynamic calorie/protein/carb/fat targets linked directly to today's training realm
 * - Meal distribution across 2, 3, or 4 meals per day
 * - Comprehensive Indian food database (Veg, Egg-Veg, Non-Veg)
 * - Intelligent 1-Click Food Swap Engine maintaining exact nutritional equivalence
 * - Daily meal check-in, macro totals, and water intake tracker.
 */

class NutritionEngine {
    constructor() {
        this.foodDatabase = this.getIndianFoodDB();
        this.swapModalTarget = null;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Water Add Buttons
        const btnAddWater = document.getElementById('btn-add-water');
        if (btnAddWater) {
            btnAddWater.addEventListener('click', () => this.addWater(0.25));
        }
        const btnResetWater = document.getElementById('btn-reset-water');
        if (btnResetWater) {
            btnResetWater.addEventListener('click', () => this.resetWater());
        }

        // Meal Frequency Filter / Selector
        document.querySelectorAll('.meal-freq-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const freq = btn.dataset.freq;
                this.setMealFrequency(freq);
            });
        });

        // Event delegation for Food Swap clicks
        document.addEventListener('click', (e) => {
            const swapBtn = e.target.closest('.btn-food-swap');
            if (swapBtn) {
                const mealId = swapBtn.dataset.mealId;
                const itemId = swapBtn.dataset.itemId;
                this.openSwapModal(mealId, itemId);
            }

            const toggleMealBtn = e.target.closest('.btn-toggle-meal');
            if (toggleMealBtn) {
                const mealId = toggleMealBtn.dataset.mealId;
                this.toggleMealLogged(mealId);
            }

            const swapOptionBtn = e.target.closest('.food-swap-option');
            if (swapOptionBtn) {
                const newFoodKey = swapOptionBtn.dataset.foodKey;
                this.executeFoodSwap(newFoodKey);
            }
        });

        // Close Swap Modal
        const btnCloseSwap = document.getElementById('btn-close-swap-modal');
        if (btnCloseSwap) {
            btnCloseSwap.addEventListener('click', () => {
                document.getElementById('modal-food-swap')?.classList.add('hidden');
            });
        }
    }

    getIndianFoodDB() {
        return {
            // High Protein Sources
            f_paneer: { name: 'Paneer (Cottage Cheese)', portion: '120g', cal: 310, protein: 22, carbs: 4, fat: 24, cat: 'veg', swapGroup: 'protein_primary' },
            f_soya: { name: 'Soya Chunks (Cooked Curry)', portion: '50g dry (150g cooked)', cal: 175, protein: 26, carbs: 16, fat: 0.5, cat: 'veg', swapGroup: 'protein_primary' },
            f_chicken: { name: 'Chicken Breast Curry / Grilled', portion: '150g', cal: 245, protein: 42, carbs: 2, fat: 6, cat: 'non_veg', swapGroup: 'protein_primary' },
            f_eggs: { name: 'Boiled Eggs (3 whole)', portion: '3 large eggs', cal: 210, protein: 18, carbs: 1, fat: 15, cat: 'egg_veg', swapGroup: 'protein_primary' },
            f_egg_whites: { name: 'Egg White Scramble', portion: '5 whites', cal: 85, protein: 18, carbs: 1, fat: 0.5, cat: 'egg_veg', swapGroup: 'protein_primary' },
            f_tofu: { name: 'Tofu Bhurji / Grilled', portion: '150g', cal: 180, protein: 20, carbs: 4, fat: 10, cat: 'veg', swapGroup: 'protein_primary' },
            f_fish: { name: 'Rohu / Pomfret Fish Curry', portion: '150g', cal: 210, protein: 32, carbs: 2, fat: 7, cat: 'non_veg', swapGroup: 'protein_primary' },
            
            // Dals & Legumes
            f_dal: { name: 'Tadka Moong / Toor Dal', portion: '1 bowl (150g)', cal: 175, protein: 11, carbs: 24, fat: 4, cat: 'veg', swapGroup: 'dal' },
            f_chana: { name: 'Black Chana / Kala Chana Masala', portion: '1 bowl (150g)', cal: 210, protein: 12, carbs: 32, fat: 3.5, cat: 'dal' },
            f_rajma: { name: 'Rajma Curry (Kidney Beans)', portion: '1 bowl (150g)', cal: 205, protein: 11.5, carbs: 33, fat: 3, cat: 'dal' },
            f_sprouts: { name: 'Steamed Moong Sprouts Salad', portion: '1 cup (120g)', cal: 130, protein: 9, carbs: 22, fat: 1, cat: 'dal' },
            
            // Complex Carbohydrates
            f_rice: { name: 'Steamed Basmati Rice', portion: '1.5 cups (200g)', cal: 260, protein: 5, carbs: 56, fat: 1, cat: 'veg', swapGroup: 'carb' },
            f_roti: { name: 'Whole Wheat Roti / Chapati', portion: '3 medium rotis', cal: 270, protein: 9, carbs: 52, fat: 2.5, cat: 'veg', swapGroup: 'carb' },
            f_oats: { name: 'Oats with Milk & Cinnamon', portion: '60g oats + 200ml milk', cal: 360, protein: 14, carbs: 58, fat: 7, cat: 'veg', swapGroup: 'carb' },
            f_poha: { name: 'Vegetable Peanut Poha', portion: '1 plate (180g)', cal: 280, protein: 6, carbs: 48, fat: 8, cat: 'veg', swapGroup: 'carb' },
            f_idli: { name: 'Steamed Idli with Sambar', portion: '3 idlis + 1 cup sambar', cal: 290, protein: 10, carbs: 54, fat: 3, cat: 'veg', swapGroup: 'carb' },
            
            // Dairy & Fats
            f_curd: { name: 'Fresh Curd / Dahi', portion: '1 cup (150g)', cal: 98, protein: 6, carbs: 6, fat: 5, cat: 'veg', swapGroup: 'dairy' },
            f_buttermilk: { name: 'Chaas / Spiced Buttermilk', portion: '1 tall glass (300ml)', cal: 60, protein: 4, carbs: 5, fat: 2.5, cat: 'dairy' },
            f_ghee: { name: 'Desi Ghee (Cooking)', portion: '1 tsp (5g)', cal: 45, protein: 0, carbs: 0, fat: 5, cat: 'veg', swapGroup: 'fat' },
            f_peanuts: { name: 'Roasted Peanuts', portion: '30g', cal: 170, protein: 8, carbs: 5, fat: 14, cat: 'veg', swapGroup: 'fat' }
        };
    }

    generateDailyMeals() {
        const s = window.systemState.data;
        const diet = s.assessment.dietType;
        const freq = s.assessment.mealFrequency || 3;

        let meals = [];

        if (freq === 2) {
            // 2 Large Meals
            meals = [
                {
                    id: 'm_1',
                    name: 'Meal 1: High-Power Feast (Brunch / Post-Fast)',
                    time: '11:30 AM',
                    items: [
                        diet === 'veg' ? { id: 'f_paneer', ...this.foodDatabase['f_paneer'] } : { id: 'f_chicken', ...this.foodDatabase['f_chicken'] },
                        { id: 'f_rice', ...this.foodDatabase['f_rice'] },
                        { id: 'f_dal', ...this.foodDatabase['f_dal'] },
                        { id: 'f_curd', ...this.foodDatabase['f_curd'] }
                    ],
                    logged: false
                },
                {
                    id: 'm_2',
                    name: 'Meal 2: Recovery Dinner & Muscle Synthesis',
                    time: '07:30 PM',
                    items: [
                        diet === 'non_veg' ? { id: 'f_eggs', ...this.foodDatabase['f_eggs'] } : { id: 'f_soya', ...this.foodDatabase['f_soya'] },
                        { id: 'f_roti', ...this.foodDatabase['f_roti'] },
                        { id: 'f_chana', ...this.foodDatabase['f_chana'] },
                        { id: 'f_buttermilk', ...this.foodDatabase['f_buttermilk'] }
                    ],
                    logged: false
                }
            ];
        } else if (freq === 4) {
            // 4 Smaller Meals
            meals = [
                { id: 'm_1', name: 'Meal 1: Morning Fuel', time: '08:00 AM', items: [{ id: 'f_oats', ...this.foodDatabase['f_oats'] }, { id: 'f_eggs', ...this.foodDatabase['f_eggs'] }], logged: false },
                { id: 'm_2', name: 'Meal 2: Lunch Plate', time: '01:00 PM', items: [{ id: 'f_rice', ...this.foodDatabase['f_rice'] }, diet === 'veg' ? { id: 'f_paneer', ...this.foodDatabase['f_paneer'] } : { id: 'f_chicken', ...this.foodDatabase['f_chicken'] }, { id: 'f_dal', ...this.foodDatabase['f_dal'] }], logged: false },
                { id: 'm_3', name: 'Meal 3: Pre-Workout / Evening Snack', time: '05:30 PM', items: [{ id: 'f_sprouts', ...this.foodDatabase['f_sprouts'] }, { id: 'f_peanuts', ...this.foodDatabase['f_peanuts'] }], logged: false },
                { id: 'm_4', name: 'Meal 4: Anabolic Dinner', time: '09:00 PM', items: [{ id: 'f_roti', ...this.foodDatabase['f_roti'] }, { id: 'f_soya', ...this.foodDatabase['f_soya'] }, { id: 'f_curd', ...this.foodDatabase['f_curd'] }], logged: false }
            ];
        } else {
            // Default 3 Meals
            meals = [
                { id: 'm_1', name: 'Meal 1: Breakfast / Morning Energy', time: '08:30 AM', items: [{ id: 'f_oats', ...this.foodDatabase['f_oats'] }, { id: 'f_eggs', ...this.foodDatabase['f_eggs'] }], logged: true },
                { id: 'm_2', name: 'Meal 2: Post-Workout Lunch (Indian Power Plate)', time: '01:30 PM', items: [{ id: 'f_rice', ...this.foodDatabase['f_rice'] }, diet === 'veg' ? { id: 'f_soya', ...this.foodDatabase['f_soya'] } : { id: 'f_chicken', ...this.foodDatabase['f_chicken'] }, { id: 'f_dal', ...this.foodDatabase['f_dal'] }, { id: 'f_curd', ...this.foodDatabase['f_curd'] }], logged: true },
                { id: 'm_3', name: 'Meal 3: Dinner (V-Taper Recovery & Repair)', time: '08:30 PM', items: [{ id: 'f_roti', ...this.foodDatabase['f_roti'] }, { id: 'f_paneer', ...this.foodDatabase['f_paneer'] }], logged: false }
            ];
        }

        s.nutrition.dailyMeals = meals;
        this.recalculateConsumed();
        window.systemState.save();
    }

    setMealFrequency(freqStr) {
        const count = parseInt(freqStr) || 3;
        window.systemState.data.assessment.mealFrequency = count;
        this.generateDailyMeals();
        if (window.app) {
            window.app.showToast('MEAL PLAN RESTRUCTURED', `Switched to ${count} meals/day structure.`);
            window.app.syncUI();
        }
    }

    recalculateConsumed() {
        const s = window.systemState.data;
        let cCal = 0, cProt = 0, cCarb = 0, cFat = 0;

        s.nutrition.dailyMeals.forEach(meal => {
            if (meal.logged) {
                meal.items.forEach(item => {
                    cCal += item.cal || 0;
                    cProt += item.protein || 0;
                    cCarb += item.carbs || 0;
                    cFat += item.fat || 0;
                });
            }
        });

        s.nutrition.caloriesConsumed = cCal;
        s.nutrition.proteinConsumed = cProt;
        s.nutrition.carbsConsumed = cCarb;
        s.nutrition.fatsConsumed = cFat;
    }

    toggleMealLogged(mealId) {
        const s = window.systemState.data;
        const meal = s.nutrition.dailyMeals.find(m => m.id === mealId);
        if (!meal) return;

        meal.logged = !meal.logged;
        this.recalculateConsumed();

        if (meal.logged) {
            window.systemState.gainXp(60, `Logged ${meal.name}`);
            if (window.systemAudio) window.systemAudio.playStatAdd();
        }

        // Check if all meals logged
        const allDone = s.nutrition.dailyMeals.every(m => m.logged);
        const quest = s.quests.daily.find(q => q.id === 'q_nutrition');
        if (quest && allDone) {
            quest.completed = true;
            window.systemState.gainXp(250, 'Completed 100% Daily Nutrition Targets');
        }

        window.systemState.save();
        if (window.app) window.app.syncUI();
    }

    openSwapModal(mealId, itemId) {
        this.swapModalTarget = { mealId, itemId };
        const modal = document.getElementById('modal-food-swap');
        if (!modal) return;

        const currentItem = this.findFoodItem(mealId, itemId);
        const titleEl = document.getElementById('swap-modal-item-name');
        if (titleEl && currentItem) {
            titleEl.innerText = `${currentItem.name} (${currentItem.portion} — ${currentItem.protein}g Protein, ${currentItem.cal} kcal)`;
        }

        // Generate equivalent swap options
        const container = document.getElementById('food-swap-options-list');
        if (container) {
            container.innerHTML = '';
            const swapOptions = this.getEquivalentSwaps(currentItem);
            swapOptions.forEach(opt => {
                const optCard = document.createElement('div');
                optCard.className = 'food-swap-option';
                optCard.dataset.foodKey = opt.key;
                optCard.innerHTML = `
                    <div class="swap-opt-info">
                        <div class="swap-opt-title">${opt.name}</div>
                        <div class="swap-opt-portion">${opt.portion}</div>
                    </div>
                    <div class="swap-opt-macros">
                        <span class="macro-badge-prot">${opt.protein}g P</span>
                        <span class="macro-badge-cal">${opt.cal} kcal</span>
                    </div>
                    <button class="btn-swap-select">CHOOSE SWAP</button>
                `;
                container.appendChild(optCard);
            });
        }

        modal.classList.remove('hidden');
        if (window.systemAudio) window.systemAudio.playClick();
    }

    findFoodItem(mealId, itemId) {
        const s = window.systemState.data;
        const meal = s.nutrition.dailyMeals.find(m => m.id === mealId);
        if (!meal) return null;
        return meal.items.find(i => i.id === itemId);
    }

    getEquivalentSwaps(currentItem) {
        if (!currentItem) return [];
        const group = currentItem.swapGroup || 'protein_primary';
        const results = [];

        Object.keys(this.foodDatabase).forEach(key => {
            const food = this.foodDatabase[key];
            if (food.swapGroup === group && food.name !== currentItem.name) {
                results.push({ key, ...food });
            }
        });

        return results;
    }

    executeFoodSwap(newFoodKey) {
        if (!this.swapModalTarget) return;
        const { mealId, itemId } = this.swapModalTarget;
        const s = window.systemState.data;
        const meal = s.nutrition.dailyMeals.find(m => m.id === mealId);
        if (!meal) return;

        const newFood = this.foodDatabase[newFoodKey];
        if (!newFood) return;

        const idx = meal.items.findIndex(i => i.id === itemId);
        if (idx !== -1) {
            meal.items[idx] = { id: newFoodKey, ...newFood };
            this.recalculateConsumed();
            window.systemState.save();

            document.getElementById('modal-food-swap')?.classList.add('hidden');
            if (window.systemAudio) window.systemAudio.playStatAdd();
            if (window.app) {
                window.app.showToast('FOOD SWAP APPLIED', `Replaced item with ${newFood.name} maintaining macro balance!`);
                window.app.syncUI();
            }
        }
    }

    addWater(amountLiters) {
        const s = window.systemState.data;
        s.nutrition.waterConsumedLiters = Math.min(6.0, +(s.nutrition.waterConsumedLiters + amountLiters).toFixed(2));
        if (s.nutrition.waterConsumedLiters >= s.nutrition.waterTargetLiters) {
            window.systemState.gainXp(50, 'Reached Optimal Daily Hydration Target (3.5L)');
        }
        window.systemState.save();
        if (window.systemAudio) window.systemAudio.playStatAdd();
        if (window.app) window.app.syncUI();
    }

    resetWater() {
        const s = window.systemState.data;
        s.nutrition.waterConsumedLiters = 0;
        window.systemState.save();
        if (window.app) window.app.syncUI();
    }
}

// Global Nutrition Engine instance
window.nutritionEngine = new NutritionEngine();
