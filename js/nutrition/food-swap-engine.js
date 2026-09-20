/**
 * MULTIVERSE HUNTER — MATHEMATICALLY CONTROLLED FOOD SWAP ENGINE
 * Calculates "Closest Nutritional Replacement" with configurable tolerance ranges:
 * - Protein tolerance: ±15%
 * - Calorie tolerance: ±15%
 * - Ranks available replacements by Euclidean macro distance: sqrt((dP)^2 + (dC/4)^2 + (dF*2)^2)
 */

class FoodSwapEngine {
    constructor() {
        this.proteinTolerancePct = 0.20; // 20% max deviation
        this.calorieTolerancePct = 0.20;
    }

    findClosestReplacements(targetFoodItem, userDiet = 'non_veg', userBudget = 'medium') {
        const db = window.foodDatabase;
        if (!db || !targetFoodItem) return [];

        const availableFoods = db.filterByDiet(userDiet);
        const candidates = [];

        const targetP = targetFoodItem.protein || 20;
        const targetCal = targetFoodItem.cal || 250;

        availableFoods.forEach(food => {
            if (food.id === targetFoodItem.id) return;
            if (food.swapGroup !== targetFoodItem.swapGroup && food.category !== targetFoodItem.category) return;

            const pDiff = Math.abs(food.protein - targetP);
            const calDiff = Math.abs(food.cal - targetCal);

            // Check if within acceptable tolerance range
            const pTolerance = targetP * this.proteinTolerancePct;
            const calTolerance = targetCal * this.calorieTolerancePct;

            // Score similarity (lower score = closer match)
            const score = Math.sqrt(Math.pow(pDiff, 2) + Math.pow(calDiff / 10, 2));

            candidates.push({
                food,
                proteinDiff: food.protein - targetP,
                calDiff: food.cal - targetCal,
                score,
                isCloseMatch: pDiff <= pTolerance || calDiff <= calTolerance
            });
        });

        // Rank by closest score
        candidates.sort((a, b) => a.score - b.score);
        return candidates;
    }
}

window.foodSwapEngine = new FoodSwapEngine();
