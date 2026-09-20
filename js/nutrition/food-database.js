/**
 * MULTIVERSE HUNTER — INDIAN FOOD DATABASE & TAXONOMY
 * Realistic Indian dietary resources categorized by:
 * - Grains (Rice, Roti, Oats, Poha, Idli, Dosa)
 * - Pulses & Dals (Moong Dal, Toor Dal, Kala Chana, Rajma, Sprouts)
 * - Dairy (Paneer, Fresh Curd, Chaas, Milk, Ghee)
 * - Eggs (Whole Eggs, Egg Whites)
 * - Poultry, Meat & Fish (Chicken Breast, Rohu Fish, Mutton)
 * - Soya & Tofu (Soya Chunks, Tofu)
 * - Healthy Fats (Mustard Oil, Peanuts, Almonds)
 * Includes budget tiers: low, medium, high, premium.
 */

class IndianFoodDatabase {
    constructor() {
        this.database = this.getFoodItems();
    }

    getFoodItems() {
        return [
            // PROTEIN - VEGETARIAN & VEGAN
            { id: 'f_soya_chunks', name: 'Soya Chunks (Curry / Bhurji)', category: 'soya_tofu', serving: '50g dry (150g cooked)', cal: 175, protein: 26, carbs: 16, fat: 0.5, diet: 'veg', budget: 'low', swapGroup: 'protein_primary' },
            { id: 'f_paneer_standard', name: 'Fresh Paneer (Cottage Cheese)', category: 'dairy', serving: '120g', cal: 310, protein: 22, carbs: 4, fat: 24, diet: 'veg', budget: 'medium', swapGroup: 'protein_primary' },
            { id: 'f_paneer_lowfat', name: 'Low-Fat Paneer', category: 'dairy', serving: '120g', cal: 210, protein: 28, carbs: 4, fat: 9, diet: 'veg', budget: 'medium', swapGroup: 'protein_primary' },
            { id: 'f_tofu_bhurji', name: 'Tofu Bhurji / Grilled', category: 'soya_tofu', serving: '150g', cal: 180, protein: 20, carbs: 4, fat: 10, diet: 'veg', budget: 'medium', swapGroup: 'protein_primary' },
            { id: 'f_moong_sprouts', name: 'Steamed Moong Sprouts Salad', category: 'pulses', serving: '1 cup (120g)', cal: 130, protein: 9, carbs: 22, fat: 1, diet: 'veg', budget: 'low', swapGroup: 'dal' },

            // PROTEIN - EGG & NON-VEG
            { id: 'f_eggs_whole', name: 'Boiled Eggs (3 whole)', category: 'eggs', serving: '3 large eggs', cal: 210, protein: 18, carbs: 1, fat: 15, diet: 'egg_veg', budget: 'low', swapGroup: 'protein_primary' },
            { id: 'f_egg_whites_5', name: 'Egg White Scramble (5 whites)', category: 'eggs', serving: '5 egg whites', cal: 85, protein: 18, carbs: 1, fat: 0.5, diet: 'egg_veg', budget: 'low', swapGroup: 'protein_primary' },
            { id: 'f_chicken_breast', name: 'Chicken Breast Curry / Grilled', category: 'meat', serving: '150g raw wt', cal: 245, protein: 42, carbs: 2, fat: 6, diet: 'non_veg', budget: 'medium', swapGroup: 'protein_primary' },
            { id: 'f_rohu_fish', name: 'Rohu / Pomfret Fish Curry', category: 'meat', serving: '150g', cal: 210, protein: 32, carbs: 2, fat: 7, diet: 'non_veg', budget: 'high', swapGroup: 'protein_primary' },

            // DALS & LEGUMES
            { id: 'f_moong_dal', name: 'Tadka Moong / Toor Dal', category: 'pulses', serving: '1 bowl (150g)', cal: 175, protein: 11, carbs: 24, fat: 4, diet: 'veg', budget: 'low', swapGroup: 'dal' },
            { id: 'f_kala_chana', name: 'Kala Chana Masala (Black Chickpeas)', category: 'pulses', serving: '1 bowl (150g)', cal: 210, protein: 12, carbs: 32, fat: 3.5, diet: 'veg', budget: 'low', swapGroup: 'dal' },
            { id: 'f_rajma_curry', name: 'Rajma Masala (Kidney Beans)', category: 'pulses', serving: '1 bowl (150g)', cal: 205, protein: 11.5, carbs: 33, fat: 3, diet: 'veg', budget: 'low', swapGroup: 'dal' },

            // GRAINS & CARBOHYDRATES
            { id: 'f_steamed_rice', name: 'Steamed Basmati / Sona Masoori Rice', category: 'grains', serving: '1.5 cups cooked (200g)', cal: 260, protein: 5, carbs: 56, fat: 1, diet: 'veg', budget: 'low', swapGroup: 'carb' },
            { id: 'f_wheat_roti', name: 'Whole Wheat Roti / Chapati (3 rotis)', category: 'grains', serving: '3 medium rotis (90g flour)', cal: 270, protein: 9, carbs: 52, fat: 2.5, diet: 'veg', budget: 'low', swapGroup: 'carb' },
            { id: 'f_rolled_oats', name: 'Rolled Oats with Milk & Fruit', category: 'grains', serving: '60g oats + 200ml milk', cal: 360, protein: 14, carbs: 58, fat: 7, diet: 'veg', budget: 'medium', swapGroup: 'carb' },
            { id: 'f_veg_poha', name: 'Vegetable Peanut Poha', category: 'grains', serving: '1 plate (180g)', cal: 280, protein: 6, carbs: 48, fat: 8, diet: 'veg', budget: 'low', swapGroup: 'carb' },
            { id: 'f_idli_sambar', name: 'Steamed Idlis with Sambar', category: 'grains', serving: '3 idlis + 1 cup sambar', cal: 290, protein: 10, carbs: 54, fat: 3, diet: 'veg', budget: 'low', swapGroup: 'carb' },

            // DAIRY & HEALTHY FATS
            { id: 'f_fresh_curd', name: 'Fresh Curd / Dahi', category: 'dairy', serving: '1 cup (150g)', cal: 98, protein: 6, carbs: 6, fat: 5, diet: 'veg', budget: 'low', swapGroup: 'dairy' },
            { id: 'f_spiced_chaas', name: 'Spiced Buttermilk (Chaas)', category: 'dairy', serving: '1 tall glass (300ml)', cal: 60, protein: 4, carbs: 5, fat: 2.5, diet: 'veg', budget: 'low', swapGroup: 'dairy' },
            { id: 'f_roasted_peanuts', name: 'Roasted Peanuts (Groundnuts)', category: 'fats', serving: '30g', cal: 170, protein: 8, carbs: 5, fat: 14, diet: 'veg', budget: 'low', swapGroup: 'fat' },
            { id: 'f_desi_ghee', name: 'Pure Desi Ghee (Cooking)', category: 'fats', serving: '1 tsp (5g)', cal: 45, protein: 0, carbs: 0, fat: 5, diet: 'veg', budget: 'medium', swapGroup: 'fat' }
        ];
    }

    findFood(id) {
        return this.database.find(f => f.id === id);
    }

    filterByDiet(dietType) {
        if (dietType === 'non_veg') return this.database;
        if (dietType === 'egg_veg') return this.database.filter(f => f.diet === 'veg' || f.diet === 'egg_veg');
        return this.database.filter(f => f.diet === 'veg');
    }

    filterByBudget(budgetLevel) {
        if (budgetLevel === 'premium' || budgetLevel === 'high') return this.database;
        if (budgetLevel === 'medium') return this.database.filter(f => f.budget !== 'premium');
        return this.database.filter(f => f.budget === 'low');
    }
}

window.foodDatabase = new IndianFoodDatabase();
