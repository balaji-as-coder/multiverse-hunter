/**
 * MULTIVERSE HUNTER — MASTER RPG SKILL TREE & MIND DOMAIN TREE (V3.1)
 * Multi-branch RPG talent system connecting real physical & cognitive habits
 * to skill unlocks across Strength, Mind, and Discipline.
 */

class SkillTreeEngine {
    constructor() {
        this.branches = {
            'strength': {
                name: '⚔️ STRENGTH & COMBAT BRANCH',
                mentor: 'Roronoa Zoro & Son Goku',
                color: '#ff3366',
                nodes: [
                    { id: 'str_1', name: 'Power I: Compound Alignment', tier: 1, req: 'Complete 3 Gym Workouts', icon: '🏋️', unlocked: true, desc: '+10% Strength XP from Barbell & Dumbbell lifts' },
                    { id: 'str_2', name: 'Power II: Hypertrophy Surge', tier: 2, req: 'Hit RIR 1-2 on 5 Sessions', icon: '💥', unlocked: true, desc: 'Unlocks advanced progressive overload tracking' },
                    { id: 'str_3', name: 'Power III: Heavy Density', tier: 3, req: 'Squat/Deadlift 1.25x Bodyweight', icon: '⚡', unlocked: false, desc: '+15% Body XP and accelerated fatigue recovery' },
                    { id: 'str_4', name: 'Beast Mode: Apex Overload', tier: 4, req: 'Reach Level 25 & 100 Working Sets', icon: '👑', unlocked: false, desc: 'Unlocks Limit Breaker Transformation aura' }
                ]
            },
            'mind': {
                name: '🧠 MIND & MEDITATION DOMAIN',
                mentor: 'Satoru Gojo & Kisuke Urahara',
                color: '#38bdf8',
                nodes: [
                    { id: 'mind_1', name: 'Breath Control I: Box Cadence', tier: 1, req: 'Complete 3 Meditation Sessions', icon: '🌬️', unlocked: true, desc: '+15% Parasympathetic recovery during sleep' },
                    { id: 'mind_2', name: 'Deep Work: 90-Min Focus Block', tier: 2, req: 'Log 5 Focus Sessions > 45m', icon: '🎯', unlocked: true, desc: '+25% Mind XP on distraction-free work blocks' },
                    { id: 'mind_3', name: 'Flow State: Cognitive Precision', tier: 3, req: '7 Consecutive Meditation Days', icon: '🌌', unlocked: false, desc: 'Unlocks binaural alpha drone meditation soundscapes' },
                    { id: 'mind_4', name: 'Domain Master: Infinite Void', tier: 4, req: 'Reach Level 30 & 500m Meditated', icon: '👁️', unlocked: false, desc: 'Unlocks Gojo Domain Expansion cutscene trigger' }
                ]
            },
            'discipline': {
                name: '🔥 DISCIPLINE & HABIT BRANCH',
                mentor: 'Rock Lee & Might Guy',
                color: '#f59e0b',
                nodes: [
                    { id: 'disc_1', name: 'Will I: Morning Calibration', tier: 1, req: 'Log 5 Morning Readiness Checks', icon: '🌅', unlocked: true, desc: '+10% Gold from all daily quest completions' },
                    { id: 'disc_2', name: 'Will II: Zero Missed Habits', tier: 2, req: 'Maintain 7-Day Streak', icon: '🥊', unlocked: true, desc: 'Doubles streak milestone crystal rewards' },
                    { id: 'disc_3', name: 'Iron Will: Hardship Resistance', tier: 3, req: '14-Day 100% Meal & Workout Target', icon: '⛓️', unlocked: false, desc: '+500 Bonus Discipline XP per weekly arc review' },
                    { id: 'disc_4', name: 'Monarch of Discipline: Unstoppable', tier: 4, req: 'Reach 30-Day Master Arc Complete', icon: '👑', unlocked: false, desc: 'Permanent +20% XP multiplier across all 6 tracks' }
                ]
            }
        };

        this.init();
    }

    init() {
        this.loadSkillTree();
    }

    loadSkillTree() {
        try {
            const raw = localStorage.getItem('HUNTER_SKILL_TREE_V3');
            if (raw) {
                const saved = JSON.parse(raw);
                Object.keys(this.branches).forEach(bKey => {
                    this.branches[bKey].nodes.forEach(node => {
                        if (saved[node.id] !== undefined) node.unlocked = saved[node.id];
                    });
                });
            }
        } catch (e) {}
    }

    saveSkillTree() {
        try {
            const map = {};
            Object.keys(this.branches).forEach(bKey => {
                this.branches[bKey].nodes.forEach(node => {
                    map[node.id] = node.unlocked;
                });
            });
            localStorage.setItem('HUNTER_SKILL_TREE_V3', JSON.stringify(map));
        } catch (e) {}
    }

    renderSkillTree(containerId = 'skill-tree-display-container') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const branchKeys = Object.keys(this.branches);
        const branchesHtml = branchKeys.map(bKey => {
            const branch = this.branches[bKey];
            const nodesHtml = branch.nodes.map((n, idx) => {
                const isLast = idx === branch.nodes.length - 1;
                if (n.unlocked) {
                    return `
                        <div class="skill-node-item">
                            <div class="skill-node-card node-unlocked" data-node-id="${n.id}" style="border-color: ${branch.color}">
                                <div class="sn-icon-wrap" style="box-shadow: 0 0 20px ${branch.color}55">
                                    ${n.icon}
                                </div>
                                <div class="sn-details">
                                    <div class="sn-tier font-10" style="color: ${branch.color}">TIER ${n.tier}</div>
                                    <h4 class="sn-name">${n.name}</h4>
                                    <p class="sn-desc font-11 text-muted mt-2">${n.desc}</p>
                                    <div class="sn-req font-10 mt-6 highlight-green">
                                        ✓ UNLOCKED & ACTIVE
                                    </div>
                                </div>
                            </div>
                            ${!isLast ? `<div class="skill-connector-down"><span class="sc-dot" style="background: ${branch.color}"></span></div>` : ''}
                        </div>
                    `;
                } else {
                    return `
                        <div class="skill-node-item">
                            <div class="skill-node-card dimensional-gate-locked" data-node-id="${n.id}">
                                <div class="gate-rift-overlay"></div>
                                <div class="sn-icon-wrap font-22">🔒</div>
                                <div class="sn-details">
                                    <div class="sn-tier font-10 text-muted">DIMENSIONAL GATE // TIER ${n.tier}</div>
                                    <h4 class="sn-name">[ UNKNOWN SKILL ]</h4>
                                    <p class="sn-desc font-11 text-muted mt-2">Locked in dimensional rift. Fulfill habit prerequisite to unlock.</p>
                                    <div class="sn-req font-10 mt-6 highlight-crimson">
                                        🔒 ${n.req}
                                    </div>
                                </div>
                                <button class="btn-cinematic-danger btn-sm btn-unlock-node mt-8" data-node-id="${n.id}">⚔ SHATTER GATE & UNLOCK</button>
                            </div>
                            ${!isLast ? `<div class="skill-connector-down"><span class="sc-dot" style="background: rgba(255,255,255,0.15)"></span></div>` : ''}
                        </div>
                    `;
                }
            }).join('');

            return `
                <div class="skill-branch-column">
                    <div class="sbc-header" style="border-color: ${branch.color}">
                        <h3 class="sbc-title" style="color: ${branch.color}">${branch.name}</h3>
                        <span class="sbc-mentor font-10 text-muted">MENTORS: ${branch.mentor.toUpperCase()}</span>
                    </div>
                    <div class="sbc-nodes-list mt-15">
                        ${nodesHtml}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="skill-tree-wrapper">
                <div class="st-banner">
                    <span class="st-tag highlight-gold">🌳 RPG MULTIVERSE TALENT & MASTERY TREE</span>
                    <h2 class="st-heading">HUNTER ASCENSION SKILL TREES</h2>
                    <p class="font-12 text-muted">Real-world workout consistency and deep focus blocks unlock legendary passive abilities.</p>
                </div>
                <div class="skill-branches-grid mt-20">
                    ${branchesHtml}
                </div>
            </div>
        `;

        this.bindSkillTreeButtons(container);
    }

    bindSkillTreeButtons(container) {
        container.querySelectorAll('.btn-unlock-node').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const nodeId = btn.dataset.nodeId;
                this.unlockNode(nodeId);
            });
        });
    }

    unlockNode(nodeId) {
        let foundNode = null;
        Object.keys(this.branches).forEach(bKey => {
            const n = this.branches[bKey].nodes.find(item => item.id === nodeId);
            if (n) foundNode = n;
        });

        if (!foundNode) return;
        foundNode.unlocked = true;
        this.saveSkillTree();

        if (window.systemAudio) window.systemAudio.playVictory();
        if (typeof confetti !== 'undefined') {
            confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
        }

        if (window.cinematicEngine) {
            window.cinematicEngine.skillUnlock({
                skillName: foundNode.name,
                universe: 'Multiverse Ascension',
                desc: foundNode.desc
            });
        }

        if (window.app) {
            window.app.showToast('SKILL UNLOCKED', `🎉 Unlocked ${foundNode.name}!`);
            window.app.syncUI();
        }

        this.renderSkillTree();
    }
}

// Global Singleton
if (typeof window !== 'undefined') {
    window.skillTreeEngine = new SkillTreeEngine();
}
