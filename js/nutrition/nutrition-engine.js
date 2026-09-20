/**
 * MULTIVERSE HUNTER — NUTRITION ENGINE MODULE
 */
class NutritionEngineModule {
    constructor() {
        this.swapModalTarget = null;
        this.init();
    }

    init() {
        // Food swap click handler
        document.addEventListener('click', (e) => {
            const btnSwap = e.target.closest('.btn-food-swap');
            if (btnSwap) {
                const mealId = btnSwap.dataset.mealId;
                const itemId = btnSwap.dataset.itemId;
                this.openSwapModal(mealId, itemId);
            }

            const btnToggleMeal = e.target.closest('.btn-toggle-meal');
            if (btnToggleMeal) {
                const mealId = btnToggleMeal.dataset.mealId;
                this.toggleMealLogged(mealId);
            }

            const btnApplySwap = e.target.closest('.btn-apply-food-swap');
            if (btnApplySwap) {
                const foodId = btnApplySwap.dataset.foodId;
                this.applyFoodSwap(foodId);
            }
        });

        // Meal freq buttons
        document.querySelectorAll('.meal-freq-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const freq = parseInt(btn.dataset.freq) || 3;
                window.systemState.data.assessment.mealFrequency = freq;
                if (window.smartMealGenerator) {
                    window.smartMealGenerator.buildDailyMealsFromList(window.systemState.data.assessment.availableIngredientsToday || []);
                }
                if (window.app) window.app.syncUI();
            });
        });
    }

    openSwapModal(mealId, itemId) {
        this.swapModalTarget = { mealId, itemId };
        const s = window.systemState.data;
        const meal = s.nutrition.dailyMeals.find(m => m.id === mealId);
        if (!meal) return;
        const item = meal.items.find(i => i.id === itemId);
        if (!item) return;

        const modal = document.getElementById('modal-food-swap');
        if (!modal) return;

        const nameEl = document.getElementById('swap-modal-item-name');
        if (nameEl) nameEl.innerText = `${item.name} (${item.serving || item.portion || '1 portion'} — ${item.protein}g Protein, ${item.cal} kcal)`;

        const container = document.getElementById('food-swap-options-list');
        if (container && window.foodSwapEngine) {
            container.innerHTML = '';
            const replacements = window.foodSwapEngine.findClosestReplacements(item, s.assessment.dietType, s.assessment.foodBudget);
            
            if (replacements.length === 0) {
                container.innerHTML = '<p class="text-muted">No direct macro replacements found within ±20% tolerance.</p>';
            } else {
                replacements.forEach(cand => {
                    const f = cand.food;
                    const div = document.createElement('div');
                    div.className = 'food-swap-option';
                    div.innerHTML = `
                        <div class="swap-opt-info">
                            <div class="swap-opt-title">${f.name}</div>
                            <div class="swap-opt-portion">${f.serving} | Category: ${f.category}</div>
                        </div>
                        <div class="swap-opt-macros">
                            <span class="macro-badge-prot">${f.protein}g P</span>
                            <span class="macro-badge-cal">${f.cal} kcal</span>
                        </div>
                        <button class="btn-swap-select btn-apply-food-swap" data-food-id="${f.id}">SWAP FOOD</button>
                    `;
                    container.appendChild(div);
                });
            }
        }

        modal.classList.remove('hidden');
    }

    applyFoodSwap(newFoodId) {
        if (!this.swapModalTarget) return;
        const { mealId, itemId } = this.swapModalTarget;
        const s = window.systemState.data;
        const meal = s.nutrition.dailyMeals.find(m => m.id === mealId);
        if (!meal) return;

        const db = window.foodDatabase;
        const newFood = db ? db.findFood(newFoodId) : null;
        if (!newFood) return;

        const idx = meal.items.findIndex(i => i.id === itemId);
        if (idx !== -1) {
            meal.items[idx] = { ...newFood };
            this.recalculateConsumed();
            window.systemState.save();

            document.getElementById('modal-food-swap')?.classList.add('hidden');
            if (window.systemAudio) window.systemAudio.playStatAdd();
            if (window.app) {
                window.app.showToast('FOOD SWAP APPLIED', `Replaced with ${newFood.name} maintaining macro balance!`);
                window.app.syncUI();
            }
        }
    }

    toggleMealLogged(mealId) {
        const s = window.systemState.data;
        const meal = s.nutrition.dailyMeals.find(m => m.id === mealId);
        if (!meal) return;

        meal.logged = !meal.logged;
        this.recalculateConsumed();

        if (meal.logged) {
            window.systemState.gainTrackXp('nutritionXp', 60, `Logged ${meal.name}`);
            if (window.systemAudio) window.systemAudio.playStatAdd();
        }

        window.systemState.save();
        if (window.app) window.app.syncUI();
    }

    recalculateConsumed() {
        const s = window.systemState.data;
        let cCal = 0, cProt = 0, cCarb = 0, cFat = 0;

        (s.nutrition.dailyMeals || []).forEach(m => {
            if (m.logged) {
                m.items.forEach(i => {
                    cCal += i.cal || 0;
                    cProt += i.protein || 0;
                    cCarb += i.carbs || 0;
                    cFat += i.fat || 0;
                });
            }
        });

        s.nutrition.caloriesConsumed = cCal;
        s.nutrition.proteinConsumed = cProt;
        s.nutrition.carbsConsumed = cCarb;
        s.nutrition.fatsConsumed = cFat;
    }
}

window.nutritionEngine = new NutritionEngineModule();
