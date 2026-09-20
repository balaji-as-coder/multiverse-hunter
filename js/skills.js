/**
 * Hunter Skill Tree Engine
 * Manages active focus skills and passive buffs unlocked with Skill Points.
 */
class SkillEngine {
    constructor() {
        this.skillsCatalog = [
            {
                id: 'skill_sprint',
                name: 'Sprint (Agility)',
                type: 'active',
                icon: '⚡',
                cost: '5 MP',
                lvl: 1,
                maxLvl: 5,
                desc: 'Quick burst cardio / instant micro-task speed +30%.'
            },
            {
                id: 'skill_ironbody',
                name: 'Iron Will (Vitality)',
                type: 'passive',
                icon: '🛡',
                cost: 'Passive',
                lvl: 1,
                maxLvl: 5,
                desc: 'Reduces real-world mental & physical fatigue buildup by 15%.'
            },
            {
                id: 'skill_focus',
                name: 'Deep Cognition (Intelligence)',
                type: 'active',
                icon: '🧠',
                cost: '10 MP',
                lvl: 1,
                maxLvl: 5,
                desc: 'Enhances focus retention and doubles XP gained during study sessions.'
            },
            {
                id: 'skill_dominator',
                name: "Ruler's Authority / Dominator's Touch",
                type: 'active',
                icon: '🖐',
                cost: '15 MP',
                lvl: 1,
                maxLvl: 5,
                desc: 'Instantly completes 1 rep milestone of any active daily task without physical fatigue.'
            },
            {
                id: 'skill_stealth',
                name: 'Stealth Mode (Do Not Disturb)',
                type: 'active',
                icon: '👁',
                cost: '8 MP',
                lvl: 1,
                maxLvl: 5,
                desc: 'Blocks all distractions and digital noise during Gate Raids.'
            }
        ];
    }

    renderSkills() {
        const passiveContainer = document.getElementById('passive-skills-list');
        const activeContainer = document.getElementById('active-skills-list');
        const spEl = document.getElementById('skill-points-val');

        if (spEl) spEl.innerText = window.systemState.data.player.skillPoints;

        const passives = this.skillsCatalog.filter(s => s.type === 'passive');
        const actives = this.skillsCatalog.filter(s => s.type === 'active');

        if (passiveContainer) {
            passiveContainer.innerHTML = passives.map(s => this.renderSkillCard(s)).join('');
        }
        if (activeContainer) {
            activeContainer.innerHTML = actives.map(s => this.renderSkillCard(s)).join('');
        }
    }

    renderSkillCard(s) {
        const canUpgrade = window.systemState.data.player.skillPoints > 0 && s.lvl < s.maxLvl;
        return `
            <div class="skill-card">
                <div class="skill-icon">${s.icon}</div>
                <div class="skill-details">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span class="skill-name">${s.name}</span>
                        <span class="skill-lvl-badge">Lv. ${s.lvl}/${s.maxLvl}</span>
                    </div>
                    <div class="skill-desc">${s.desc}</div>
                    <div style="font-size: 11px; color: var(--purple-glow); margin-top: 4px;">Cost: ${s.cost}</div>
                </div>
                <button class="btn-primary-holo btn-sm" ${!canUpgrade ? 'disabled' : ''} onclick="window.skillEngine.upgradeSkill('${s.id}')">
                    UPGRADE (1 SP)
                </button>
            </div>
        `;
    }

    upgradeSkill(skillId) {
        if (window.systemState.data.player.skillPoints <= 0) return;
        const skill = this.skillsCatalog.find(s => s.id === skillId);
        if (!skill || skill.lvl >= skill.maxLvl) return;

        window.systemState.data.player.skillPoints -= 1;
        skill.lvl += 1;
        window.systemState.logEvent(`Upgraded Skill: ${skill.name} to Lv. ${skill.lvl}`);
        window.systemState.save();

        window.systemAudio.playStatAdd();
        window.particleEngine.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 25, '#00e5ff');
        window.app.showToast('SKILL ENHANCED', `${skill.name} increased to Level ${skill.lvl}!`);

        this.renderSkills();
    }
}

window.skillEngine = new SkillEngine();
