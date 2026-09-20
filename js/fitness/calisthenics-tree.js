/**
 * MULTIVERSE HUNTER — CALISTHENICS MODULE
 */
class CalisthenicsTreeModule {
    constructor() {
        this.treeData = {
            push: [
                { tier: 1, name: 'Wall / Incline Push-up', repsTarget: '3 x 15 reps', status: 'mastered', xp: 50, req: 'None' },
                { tier: 2, name: 'Knee Push-up', repsTarget: '3 x 12 reps', status: 'mastered', xp: 80, req: 'Tier 1 Mastered' },
                { tier: 3, name: 'Standard Floor Push-up', repsTarget: '3 x 15 reps', status: 'active', xp: 150, req: 'Tier 2 Mastered' },
                { tier: 4, name: 'Diamond Push-up', repsTarget: '3 x 10 reps', status: 'locked', xp: 220, req: '20 Strict Push-ups' },
                { tier: 5, name: 'Decline / Archer Push-up', repsTarget: '3 x 8 reps/side', status: 'locked', xp: 300, req: 'Tier 4 Mastered' }
            ],
            pull: [
                { tier: 1, name: 'Dead Hang Active Bar Hold', repsTarget: '3 x 30 sec', status: 'mastered', xp: 60, req: 'None' },
                { tier: 2, name: 'Scapular Pulls & Inverted Rows', repsTarget: '3 x 10 reps', status: 'mastered', xp: 100, req: '45s Dead Hang' },
                { tier: 3, name: 'Band-Assisted Pull-up', repsTarget: '3 x 8 reps', status: 'active', xp: 180, req: 'Tier 2 Mastered' },
                { tier: 4, name: 'Strict Bodyweight Pull-up', repsTarget: '3 x 6 reps', status: 'locked', xp: 260, req: '10 Banded Pull-ups' },
                { tier: 5, name: 'Bar Muscle-Up', repsTarget: '1-3 strict reps', status: 'locked', xp: 600, req: '10 Chest-to-Bar + 15 Dips' }
            ],
            legs: [
                { tier: 1, name: 'Bodyweight Air Squat', repsTarget: '3 x 20 reps', status: 'mastered', xp: 50, req: 'None' },
                { tier: 2, name: 'Split Squat / Step-ups', repsTarget: '3 x 12 reps/side', status: 'active', xp: 120, req: 'Tier 1 Mastered' },
                { tier: 3, name: 'Bulgarian Split Squat', repsTarget: '3 x 10 reps/side', status: 'locked', xp: 200, req: 'Tier 2 Mastered' },
                { tier: 4, name: 'Pistol Squat', repsTarget: '3 x 5 reps/side', status: 'locked', xp: 450, req: '15 Bulgarian Split Squats' }
            ],
            core: [
                { tier: 1, name: 'Hollow Body Floor Plank', repsTarget: '3 x 45 sec', status: 'mastered', xp: 50, req: 'None' },
                { tier: 2, name: 'Lying Leg Raises', repsTarget: '3 x 12 reps', status: 'active', xp: 110, req: '60s Strict Plank' },
                { tier: 3, name: 'Hanging Knee Raises', repsTarget: '3 x 10 reps', status: 'locked', xp: 190, req: 'Tier 2 Mastered' },
                { tier: 4, name: 'L-Sit on Parallel Bars', repsTarget: '3 x 15 sec', status: 'locked', xp: 400, req: 'Tier 3 + 45s Dead Hang' }
            ]
        };
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            const nodeEl = e.target.closest('.calisthenics-node');
            if (nodeEl) {
                const branch = nodeEl.dataset.branch;
                const tier = parseInt(nodeEl.dataset.tier);
                this.handleNodeClick(branch, tier);
            }
        });
    }

    handleNodeClick(branch, tier) {
        const list = this.treeData[branch];
        if (!list) return;
        const item = list.find(i => i.tier === tier);
        if (!item) return;

        if (item.status === 'locked') {
            if (window.app) window.app.showToast('PREREQUISITE LOCKED', `Requirement for ${item.name}: ${item.req}`);
            if (window.systemAudio) window.systemAudio.playPenaltyAlert();
            return;
        }

        if (item.status === 'active') {
            item.status = 'mastered';
            const next = list.find(i => i.tier === tier + 1);
            if (next) next.status = 'active';

            window.systemState.data.stats.str += 1;
            window.systemState.data.stats.agi += 1;
            window.systemState.gainTrackXp('bodyXp', item.xp, `Mastered Calisthenics: ${item.name}`);

            if (window.systemAudio) window.systemAudio.playLevelUp();
            if (window.app) {
                window.app.showToast('CALISTHENICS MASTERY', `Mastered ${item.name}! (+${item.xp} Body XP, +1 STR, +1 AGI)`);
                window.app.syncUI();
            }
        }
    }
}

window.calisthenicsEngine = new CalisthenicsTreeModule();
