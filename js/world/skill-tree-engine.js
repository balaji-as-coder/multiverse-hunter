/**
 * MULTIVERSE HUNTER — RPG SKILL TREE & TALENT BRANCHES (V3.5)
 * Features 3 Archetype Trees (Strength, Mind, Discipline) with Multi-Factor Earned Prerequisites
 * (Dynamic Body Level, Discipline Level, Dynamic Arc Resolution), Dimensional Gate Shatter animations,
 * and clearly marked [RPG GAMIFIED BONUS] lore framing.
 */

class SkillTreeEngine {
    constructor() {
        this.branches = {
            strength: {
                name: '⚔️ STRENGTH & POWER',
                color: '#38bdf8',
                desc: 'Hypertrophy, biomechanical force production, and muscle recruitment.',
                nodes: [
                    {
                        id: 'str_power_1',
                        tier: 1,
                        name: 'Power Stance I',
                        desc: '[RPG BONUS] Grants +5% gamified strength XP multiplier on compound lifts.',
                        icon: '⚡',
                        reqs: { bodyLvl: 1, discLvl: 1, arc: 1 },
                        unlocked: true
                    },
                    {
                        id: 'str_power_2',
                        tier: 2,
                        name: 'Kinetic Chain Overload',
                        desc: '[RPG BONUS] Unlocks +5kg progressive overload training pathway recommendation.',
                        icon: '💥',
                        reqs: { bodyLvl: 10, discLvl: 8, arc: 1 },
                        unlocked: true
                    },
                    {
                        id: 'str_power_3',
                        tier: 3,
                        name: 'Beast Force III',
                        desc: '[RPG BONUS] High-tension myofibrillar protocol with +15% gamified power rating.',
                        icon: '🦍',
                        reqs: { bodyLvl: 15, discLvl: 12, arc: 1 },
                        unlocked: false
                    },
                    {
                        id: 'str_beast_mode',
                        tier: 4,
                        name: '👑 BEAST MODE ASCENSION',
                        desc: '[RPG BONUS] Monarch tier status title. Unlocks legendary strength raid encounters.',
                        icon: '🦁',
                        reqs: { bodyLvl: 25, discLvl: 20, arc: 2 },
                        unlocked: false
                    }
                ]
            },
            mind: {
                name: '🧠 MIND & FOCUS DOMAIN',
                color: '#a855f7',
                desc: 'Prefrontal cortex control, diaphragmatic breathing, and deep work stamina.',
                nodes: [
                    {
                        id: 'mind_breath_1',
                        tier: 1,
                        name: 'Resonant Breath I',
                        desc: '[RPG BONUS] Unlocks 4-4-4-2 box breathing protocol timer for heart rate stabilization.',
                        icon: '🍃',
                        reqs: { bodyLvl: 1, discLvl: 1, arc: 1 },
                        unlocked: true
                    },
                    {
                        id: 'mind_deep_work',
                        tier: 2,
                        name: 'Hyper-Focus Zone',
                        desc: '[RPG BONUS] 90-minute structured deep work quest timer with zero notification distractors.',
                        icon: '🎯',
                        reqs: { bodyLvl: 8, discLvl: 10, arc: 1 },
                        unlocked: false
                    },
                    {
                        id: 'mind_flow_state',
                        tier: 3,
                        name: 'Infinite Flow State',
                        desc: '[RPG BONUS] Deep concentration mode granting +20% Mind XP on completed learning quests.',
                        icon: '🌊',
                        reqs: { bodyLvl: 14, discLvl: 14, arc: 1 },
                        unlocked: false
                    },
                    {
                        id: 'mind_domain_master',
                        tier: 4,
                        name: '👑 DOMAIN EXPANSION: LIMITLESS',
                        desc: '[RPG BONUS] Unlocks Gojo Satoru’s master 15-minute Infinite Void meditation.',
                        icon: '🌌',
                        reqs: { bodyLvl: 22, discLvl: 20, arc: 2 },
                        unlocked: false
                    }
                ]
            },
            discipline: {
                name: '🔥 DISCIPLINE & WILLPOWER',
                color: '#f59e0b',
                desc: 'Uncompromising daily consistency, habit adherence, and sleep circadian lock.',
                nodes: [
                    {
                        id: 'disc_will_1',
                        tier: 1,
                        name: 'Iron Habit I',
                        desc: '[RPG BONUS] 7-day unbroken quest streak: +10% Gold and XP multipliers.',
                        icon: '🛡️',
                        reqs: { bodyLvl: 1, discLvl: 1, arc: 1 },
                        unlocked: true
                    },
                    {
                        id: 'disc_will_2',
                        tier: 2,
                        name: 'Circadian Anchor',
                        desc: '[RPG BONUS] Daily 7.5h sleep circadian habit quest with recovery XP bonus.',
                        icon: '🌙',
                        reqs: { bodyLvl: 10, discLvl: 10, arc: 1 },
                        unlocked: false
                    },
                    {
                        id: 'disc_iron_will',
                        tier: 3,
                        name: 'Unshakable Will III',
                        desc: '[RPG BONUS] Habit resilience bonus against skipped sessions under fatigue.',
                        icon: '⚔️',
                        reqs: { bodyLvl: 16, discLvl: 14, arc: 1 },
                        unlocked: false
                    },
                    {
                        id: 'disc_monarch',
                        tier: 4,
                        name: '👑 SHADOW MONARCH WILL',
                        desc: '[RPG BONUS] Ultimate sovereign discipline title and full multi-track XP amplifier.',
                        icon: '👑',
                        reqs: { bodyLvl: 26, discLvl: 22, arc: 2 },
                        unlocked: false
                    }
                ]
            }
        };

        this.init();
    }

    init() {
        this.loadProgress();
    }

    loadProgress() {
        try {
            const raw = localStorage.getItem('HUNTER_SKILL_TREE_V3_5');
            if (raw) {
                const saved = JSON.parse(raw);
                Object.keys(this.branches).forEach(bKey => {
                    this.branches[bKey].nodes.forEach(node => {
                        if (saved[node.id] !== undefined) {
                            node.unlocked = saved[node.id];
                        }
                    });
                });
            }
        } catch (e) {}
    }

    saveProgress() {
        try {
            const map = {};
            Object.keys(this.branches).forEach(bKey => {
                this.branches[bKey].nodes.forEach(n => map[n.id] = n.unlocked);
            });
            localStorage.setItem('HUNTER_SKILL_TREE_V3_5', JSON.stringify(map));
        } catch (e) {}
    }

    checkNodePrerequisites(node) {
        const s = window.systemState ? window.systemState.data : null;
        const currentBodyLvl = (s && s.player && s.player.bodyLevel) ? s.player.bodyLevel : 12;
        const currentDiscLvl = (s && s.xpTracks && s.xpTracks.disciplineXp) ? s.xpTracks.disciplineXp.level : 10;
        
        // Dynamically compute active / completed Arc number from system state
        const currentArc = (s && s.player && s.player.activeArcNumber) ? s.player.activeArcNumber : (s && s.arcHistory) ? s.arcHistory.length : 1;

        const reqs = node.reqs || { bodyLvl: 1, discLvl: 1, arc: 1 };
        const bodyOk = currentBodyLvl >= reqs.bodyLvl;
        const discOk = currentDiscLvl >= reqs.discLvl;
        const arcOk = currentArc >= reqs.arc;
        const allMet = bodyOk && discOk && arcOk;

        return {
            reqs,
            bodyOk,
            discOk,
            arcOk,
            allMet,
            currentBodyLvl,
            currentDiscLvl,
            currentArc
        };
    }

    renderSkillTrees(containerId = 'skill-tree-display-container') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const branchesHtml = Object.keys(this.branches).map(bKey => {
            const branch = this.branches[bKey];
            const nodesHtml = branch.nodes.map((n, idx) => {
                const isLast = idx === branch.nodes.length - 1;
                const check = this.checkNodePrerequisites(n);

                if (n.unlocked) {
                    return `
                        <div class="skill-node-item">
                            <div class="skill-node-card node-unlocked" data-node-id="${n.id}" style="border-color: ${branch.color}">
                                <div class="sn-icon-wrap" style="box-shadow: 0 0 20px ${branch.color}55">
                                    ${n.icon}
                                </div>
                                <div class="sn-details">
                                    <div class="sn-tier font-10" style="color: ${branch.color}">TIER ${n.tier} ACTIVE</div>
                                    <h4 class="sn-name">${n.name}</h4>
                                    <p class="sn-desc font-11 text-muted mt-2">${n.desc}</p>
                                    <div class="sn-req font-10 mt-6 highlight-green">
                                        ✓ UNLOCKED & ACTIVE IN LOADOUT
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
                                    <p class="sn-desc font-11 text-muted mt-2">Locked inside dimensional rift. Earn multi-factor prerequisites to shatter gate.</p>
                                    
                                    <!-- Multi-Factor Prerequisites Checklist -->
                                    <div class="sn-multi-prereqs mt-8">
                                        <div class="smp-item font-10 ${check.bodyOk ? 'highlight-green' : 'highlight-crimson'}">
                                            ${check.bodyOk ? '✓' : '🔒'} Body Level ${check.reqs.bodyLvl}+ (Current: ${check.currentBodyLvl})
                                        </div>
                                        <div class="smp-item font-10 ${check.discOk ? 'highlight-green' : 'highlight-crimson'}">
                                            ${check.discOk ? '✓' : '🔒'} Discipline Level ${check.reqs.discLvl}+ (Current: ${check.currentDiscLvl})
                                        </div>
                                        <div class="smp-item font-10 ${check.arcOk ? 'highlight-green' : 'highlight-crimson'}">
                                            ${check.arcOk ? '✓' : '🔒'} Arc 0${check.reqs.arc} Cleared
                                        </div>
                                    </div>
                                </div>
                                <button class="btn-cinematic-danger btn-sm btn-unlock-node mt-10 ${check.allMet ? 'btn-glow-violet' : 'opacity-70'}" data-node-id="${n.id}">
                                    ${check.allMet ? '⚔ SHATTER GATE & UNLOCK' : '🔒 PREREQUISITES PENDING'}
                                </button>
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
                        <p class="font-11 text-muted mt-2">${branch.desc}</p>
                    </div>
                    <div class="sbc-nodes-track mt-15">
                        ${nodesHtml}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="skill-tree-wrapper">
                <div class="st-banner">
                    <span class="st-tag highlight-cyan">🌳 RPG TALENT TREES & DIMENSIONAL SKILL GATES</span>
                    <h2 class="st-heading mt-2">MULTIVERSE HUNTER TALENT MATRIX</h2>
                    <p class="font-12 text-muted">Each locked gate physically exists in the world. Meet multi-factor biometric prerequisites to shatter rifts and awaken master skills.</p>
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
        let foundBranch = null;

        Object.keys(this.branches).forEach(bKey => {
            const n = this.branches[bKey].nodes.find(item => item.id === nodeId);
            if (n) {
                foundNode = n;
                foundBranch = this.branches[bKey];
            }
        });

        if (!foundNode) return;

        foundNode.unlocked = true;
        this.saveProgress();

        if (window.systemAudio) window.systemAudio.playGateOpen();
        if (typeof confetti !== 'undefined') {
            confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        }

        if (window.app) {
            window.app.showToast('⚔️ DIMENSIONAL GATE SHATTERED!', `🔥 Unlocked [ ${foundNode.name} ] in ${foundBranch.name}!`);
            window.app.syncUI();
        }

        this.renderSkillTrees();
    }
}

// Global Singleton
if (typeof window !== 'undefined') {
    window.skillTreeEngine = new SkillTreeEngine();
}
