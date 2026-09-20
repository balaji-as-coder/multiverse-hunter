/**
 * MULTIVERSE HUNTER — CALISTHENICS MASTER TREE ENGINE
 * Complete progressive calisthenics skill tree with strict physical capability prerequisites.
 * Branches:
 * 1. PUSH (Wall -> Incline -> Knee -> Push-up -> Diamond -> Decline -> Archer -> Pike -> Handstand Push-up)
 * 2. PULL (Dead Hang -> Scapular Pulls -> Inverted Row -> Assisted Pull-up -> Strict Pull-up -> Chest-to-Bar -> Muscle-up)
 * 3. LEGS (Bodyweight Squat -> Split Squat -> Bulgarian Split Squat -> Assisted Pistol -> Strict Pistol Squat)
 * 4. CORE (Plank -> Lying Leg Raise -> Hanging Knee Raise -> Hanging Leg Raise -> Dragon Flag -> L-Sit)
 * 5. ADVANCED SKILLS (Handstand, L-Sit, Front Lever, Back Lever, Muscle-Up, Planche)
 */

class CalisthenicsEngine {
    constructor() {
        this.treeData = this.getTreeStructure();
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Event delegation for calisthenics node clicks
        document.addEventListener('click', (e) => {
            const nodeEl = e.target.closest('.calisthenics-node');
            if (nodeEl) {
                const branch = nodeEl.dataset.branch;
                const tier = parseInt(nodeEl.dataset.tier);
                this.handleNodeClick(branch, tier);
            }

            const skillCard = e.target.closest('.skill-mastery-card');
            if (skillCard) {
                const skillId = skillCard.dataset.skillId;
                this.testSkillPrerequisite(skillId);
            }
        });
    }

    getTreeStructure() {
        return {
            push: [
                { tier: 1, name: 'Wall / Incline Push-up', repsTarget: '3 x 15 reps', status: 'mastered', xp: 50, req: 'None' },
                { tier: 2, name: 'Knee Push-up', repsTarget: '3 x 12 reps', status: 'mastered', xp: 80, req: 'Tier 1 Mastered' },
                { tier: 3, name: 'Standard Floor Push-up', repsTarget: '3 x 15 reps', status: 'active', xp: 150, req: 'Tier 2 Mastered' },
                { tier: 4, name: 'Diamond Push-up', repsTarget: '3 x 10 reps', status: 'locked', xp: 220, req: '20 Strict Push-ups' },
                { tier: 5, name: 'Decline / Archer Push-up', repsTarget: '3 x 8 reps/side', status: 'locked', xp: 300, req: 'Tier 4 Mastered' },
                { tier: 6, name: 'Wall Handstand Push-up', repsTarget: '3 x 5 reps', status: 'locked', xp: 500, req: 'Tier 5 + 45s Wall Handstand' }
            ],
            pull: [
                { tier: 1, name: 'Dead Hang Active Bar Hold', repsTarget: '3 x 30 sec', status: 'mastered', xp: 60, req: 'None' },
                { tier: 2, name: 'Scapular Pulls & Inverted Rows', repsTarget: '3 x 10 reps', status: 'mastered', xp: 100, req: '45s Dead Hang' },
                { tier: 3, name: 'Band-Assisted Pull-up', repsTarget: '3 x 8 reps', status: 'active', xp: 180, req: 'Tier 2 Mastered' },
                { tier: 4, name: 'Strict Bodyweight Pull-up', repsTarget: '3 x 6 reps', status: 'locked', xp: 260, req: '10 Banded Pull-ups' },
                { tier: 5, name: 'Chest-to-Bar Explosive Pull-up', repsTarget: '3 x 5 reps', status: 'locked', xp: 380, req: '8 Strict Pull-ups' },
                { tier: 6, name: 'Bar Muscle-Up', repsTarget: '1-3 strict reps', status: 'locked', xp: 600, req: '10 Chest-to-Bar + 15 Deep Dips' }
            ],
            legs: [
                { tier: 1, name: 'Bodyweight Air Squat', repsTarget: '3 x 20 reps', status: 'mastered', xp: 50, req: 'None' },
                { tier: 2, name: 'Split Squat / Step-ups', repsTarget: '3 x 12 reps/side', status: 'active', xp: 120, req: 'Tier 1 Mastered' },
                { tier: 3, name: 'Bulgarian Split Squat', repsTarget: '3 x 10 reps/side', status: 'locked', xp: 200, req: 'Tier 2 Mastered' },
                { tier: 4, name: 'Assisted Pistol Squat', repsTarget: '3 x 6 reps/side', status: 'locked', xp: 320, req: '15 Bulgarian Split Squats' },
                { tier: 5, name: 'Full Strict Pistol Squat', repsTarget: '3 x 5 reps/side', status: 'locked', xp: 450, req: 'Tier 4 Mastered' }
            ],
            core: [
                { tier: 1, name: 'Hollow Body Floor Plank', repsTarget: '3 x 45 sec', status: 'mastered', xp: 50, req: 'None' },
                { tier: 2, name: 'Lying Leg Raises', repsTarget: '3 x 12 reps', status: 'active', xp: 110, req: '60s Strict Plank' },
                { tier: 3, name: 'Hanging Knee Raises', repsTarget: '3 x 10 reps', status: 'locked', xp: 190, req: 'Tier 2 Mastered' },
                { tier: 4, name: 'Hanging Toes-to-Bar', repsTarget: '3 x 8 reps', status: 'locked', xp: 280, req: 'Tier 3 Mastered' },
                { tier: 5, name: 'L-Sit on Parallel Bars', repsTarget: '3 x 15 sec', status: 'locked', xp: 400, req: 'Tier 4 + 45s Dead Hang' }
            ]
        };
    }

    handleNodeClick(branch, tier) {
        const branchList = this.treeData[branch];
        if (!branchList) return;
        const item = branchList.find(i => i.tier === tier);
        if (!item) return;

        if (item.status === 'locked') {
            if (window.app) {
                window.app.showToast('PREREQUISITE LOCKED', `Requirements to unlock ${item.name}: ${item.req}`);
            }
            if (window.systemAudio) window.systemAudio.playPenaltyAlert();
            return;
        }

        if (item.status === 'active') {
            // Master this tier!
            item.status = 'mastered';
            const nextItem = branchList.find(i => i.tier === tier + 1);
            if (nextItem) nextItem.status = 'active';

            // Gain XP and stat
            window.systemState.data.stats.str += 1;
            window.systemState.data.stats.agi += 1;
            window.systemState.data.bodyLevels.calisthenicsLevel += 1;
            window.systemState.gainXp(item.xp, `Mastered Calisthenics: ${item.name}`);

            if (window.systemAudio) window.systemAudio.playLevelUp();
            if (window.app) {
                window.app.showToast('CALISTHENICS MASTERY UNLOCKED', `Mastered ${item.name}! +${item.xp} XP & Calisthenics Level Up!`);
                window.app.syncUI();
            }
        }
    }

    testSkillPrerequisite(skillId) {
        const s = window.systemState.data;
        const skill = s.calisthenicsMastery.skills[skillId];
        if (!skill) return;

        if (skill.unlocked) {
            if (window.app) window.app.showToast('SKILL MASTERED', `${skillId.toUpperCase()} is already fully mastered in your Skill Arsenal!`);
            return;
        }

        if (skill.progressPct < 100) {
            skill.progressPct = Math.min(100, skill.progressPct + 25);
            if (skill.progressPct === 100) {
                skill.unlocked = true;
                window.systemState.gainXp(500, `Fully Unlocked Master Skill: ${skillId.toUpperCase()}`);
                if (window.systemAudio) window.systemAudio.playLevelUp();
                if (window.app) window.app.showToast('LEGENDARY SKILL UNLOCKED', `Mastered ${skillId.toUpperCase()}!`);
            } else {
                window.systemState.gainXp(75, `Trained Progression: ${skillId.toUpperCase()}`);
                if (window.app) window.app.showToast('PROGRESSION ADVANCED', `${skillId.toUpperCase()} progression reached ${skill.progressPct}%!`);
            }
            window.systemState.save();
            if (window.app) window.app.syncUI();
        }
    }
}

// Global Calisthenics Engine instance
window.calisthenicsEngine = new CalisthenicsEngine();
