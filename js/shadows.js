/**
 * Shadow Army & "ARISE" (일어나라) Extraction Engine
 * Handles Shadow Extraction cinematics, commander roster, and passive buff application.
 */
class ShadowEngine {
    constructor() {
        this.pendingShadow = null;
        this.initEventListeners();
    }

    initEventListeners() {
        const btnPerform = document.getElementById('btn-perform-arise');
        if (btnPerform) {
            btnPerform.addEventListener('click', () => this.performExtraction());
        }
    }

    renderRoster() {
        const container = document.getElementById('shadow-army-grid');
        const countEl = document.getElementById('shadow-count');
        if (!container) return;

        const unlockedCount = window.systemState.data.shadowArmy.filter(s => s.unlocked).length;
        if (countEl) countEl.innerText = unlockedCount;

        container.innerHTML = window.systemState.data.shadowArmy.map(s => `
            <div class="shadow-card ${s.unlocked ? 'unlocked' : 'locked'}" style="${!s.unlocked ? 'opacity: 0.5; filter: grayscale(0.8);' : ''}">
                <div class="shadow-avatar">♚</div>
                <div class="shadow-name">${s.name}</div>
                <div class="shadow-grade">${s.grade}</div>
                <div class="shadow-buff">${s.buffDesc}</div>
                <div style="margin-top: 10px;">
                    ${s.unlocked ? 
                        `<span style="color: var(--purple-glow); font-family: var(--font-system); font-size: 11px; font-weight: 800;">STATUS: ACTIVE IN ARMY</span>` : 
                        `<span style="color: var(--text-muted); font-size: 11px;">LOCKED (Slay in Gate Raid to Extract)</span>`
                    }
                </div>
            </div>
        `).join('');
    }

    triggerAriseModal(shadow) {
        this.pendingShadow = shadow;
        const modal = document.getElementById('modal-arise');
        if (!modal) return;

        document.getElementById('arise-target-desc').innerText = `Extracting the eternal shadow of ${shadow.name}...`;
        document.getElementById('arise-progress-bar').style.width = '0%';
        modal.classList.remove('hidden');

        window.systemAudio.playArise();
        window.particleEngine.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 60, '#a855f7');
    }

    performExtraction() {
        if (!this.pendingShadow) return;

        const progressBar = document.getElementById('arise-progress-bar');
        const btn = document.getElementById('btn-perform-arise');
        btn.disabled = true;
        btn.innerText = 'EXTRACTING SOUL...';

        progressBar.style.width = '100%';
        window.systemAudio.playArise();

        setTimeout(() => {
            this.pendingShadow.unlocked = true;
            window.systemState.logEvent(`Extracted Shadow Commander: ${this.pendingShadow.name}! "ARISE!"`);
            window.systemState.save();

            window.systemAudio.playLevelUp();
            window.particleEngine.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 70, '#a855f7');
            window.app.showToast('SHADOW EXTRACTED!', `${this.pendingShadow.name} has pledged eternal loyalty.`);

            document.getElementById('modal-arise').classList.add('hidden');
            btn.disabled = false;
            btn.innerText = 'EXTRACT SHADOW';
            this.pendingShadow = null;
            this.renderRoster();
        }, 1600);
    }
}

window.shadowEngine = new ShadowEngine();
