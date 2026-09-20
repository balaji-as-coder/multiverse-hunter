/**
 * MULTIVERSE HUNTER — EXERCISE SUBSTITUTION ENGINE
 * Dynamically converts and substitutes exercises based on:
 * - Missing equipment (e.g., No pullup bar -> Inverted Row / DB Row / Backpack Row)
 * - Location switch (Gym -> Home / Ground)
 * - Fatigue / Readiness deloads
 * - Real-world constraints.
 */

class ExerciseSubstitutionEngine {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Event delegation for substituting a specific exercise
        document.addEventListener('click', (e) => {
            const btnSub = e.target.closest('.btn-substitute-exercise');
            if (btnSub) {
                const exId = btnSub.dataset.exerciseId;
                this.openSubstitutionModal(exId);
            }
        });
    }

    getSubstitutions(currentExId, availableEquipment = ['dumbbells', 'bodyweight', 'household_backpack']) {
        const db = window.exerciseDatabase;
        if (!db) return [];

        const current = db.findExercise(currentExId);
        if (!current) return [];

        const pattern = current.pattern;
        // Find exercises with same movement pattern matching available equipment
        const matches = db.exercises.filter(ex => {
            if (ex.id === currentExId) return false;
            const matchesPattern = ex.pattern === pattern;
            const hasEquipment = ex.equipment.some(eq => availableEquipment.includes(eq));
            return matchesPattern && hasEquipment;
        });

        return matches;
    }

    openSubstitutionModal(exId) {
        const db = window.exerciseDatabase;
        const current = db ? db.findExercise(exId) : null;
        if (!current) return;

        const modal = document.getElementById('modal-exercise-substitution');
        if (!modal) return;

        const titleEl = document.getElementById('sub-modal-target-name');
        if (titleEl) titleEl.innerText = `${current.name} (${current.pattern.replace('_', ' ').toUpperCase()})`;

        const s = window.systemState.data;
        const availableEquipment = s.assessment.availableEquipment || ['dumbbells', 'bodyweight'];
        const alternatives = this.getSubstitutions(exId, availableEquipment);

        const listContainer = document.getElementById('sub-modal-options-list');
        if (listContainer) {
            listContainer.innerHTML = '';
            if (alternatives.length === 0) {
                listContainer.innerHTML = '<p class="text-muted">No direct pattern alternatives found for current equipment setup.</p>';
            } else {
                alternatives.forEach(alt => {
                    const div = document.createElement('div');
                    div.className = 'exercise-sub-card';
                    div.innerHTML = `
                        <div class="sub-info">
                            <h4 class="sub-name">${alt.name}</h4>
                            <span class="sub-meta">Pattern: ${alt.pattern.toUpperCase()} | Equipment: ${alt.equipment.join(', ')}</span>
                        </div>
                        <button class="btn-primary-holo btn-sm btn-apply-sub" data-old-id="${exId}" data-new-id="${alt.id}">SWAP EXERCISE</button>
                    `;
                    listContainer.appendChild(div);
                });
            }
        }

        modal.classList.remove('hidden');
    }
}

window.substitutionEngine = new ExerciseSubstitutionEngine();
