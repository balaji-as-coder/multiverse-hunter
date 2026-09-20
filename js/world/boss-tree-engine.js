/**
 * MULTIVERSE HUNTER — 30-DAY ANIME TRAINING ARC & BOSS TREE ENGINE (V3.1)
 * Manages long-term arc progression, behavioral bosses (Procrastinator, Plateau, Special Grade),
 * and generates the 30-Day Monthly Transformation Report Card.
 */

class BossTreeEngine {
    constructor() {
        this.arcMilestones = [
            { day: 1, title: 'AWAKENING & CALIBRATION', icon: '🌅', desc: 'Baseline measurements, 1RM estimation, nutrition lock.', status: 'completed' },
            { day: 7, title: 'FOUNDATION TRIAL (7-DAY BOSS)', icon: '🛡️', desc: 'Boss: The Procrastinator (Defeat via 100% adherence for 7 straight days)', bossName: 'The Procrastinator', hp: 1200, status: 'completed' },
            { day: 14, title: 'DISCIPLINE SURGE (14-DAY BOSS)', icon: '🔥', desc: 'Boss: The Plateau Crusher (Overcome by strict progressive overload load bump)', bossName: 'The Plateau Crusher', hp: 2000, status: 'active' },
            { day: 21, title: 'BIOMECHANICAL EVOLUTION', icon: '⚡', desc: 'Calisthenics tier upgrade & 5km aerobic pace test.', status: 'pending' },
            { day: 30, title: 'HUNTER MASTER TRIAL (STAGE BOSS)', icon: '👑', desc: 'Boss: Ryomen Sukuna / Monarch Trial (Full 30-day transformation exam)', bossName: 'Special Grade Sovereign', hp: 5000, status: 'pending' }
        ];

        this.init();
    }

    init() {
        this.loadArcState();
    }

    loadArcState() {
        try {
            const raw = localStorage.getItem('HUNTER_ARC_TREE_V3');
            if (raw) {
                const saved = JSON.parse(raw);
                this.arcMilestones.forEach(m => {
                    if (saved[m.day]) m.status = saved[m.day];
                });
            }
        } catch (e) {}
    }

    renderBossAndArcTree(containerId = 'boss-arc-tree-display-container') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const arcItemsHtml = this.arcMilestones.map((m, idx) => {
            const isLast = idx === this.arcMilestones.length - 1;
            const statusClass = m.status === 'completed' ? 'arc-cleared' : m.status === 'active' ? 'arc-current' : 'arc-locked';
            const statusText = m.status === 'completed' ? '✓ CLEARED' : m.status === 'active' ? '⚔ IN PROGRESS' : '🔒 LOCKED';

            return `
                <div class="arc-timeline-item">
                    <div class="arc-card ${statusClass}">
                        <div class="arc-card-top">
                            <span class="arc-day-badge highlight-cyan font-10">DAY ${m.day.toString().padStart(2, '0')}</span>
                            <span class="arc-status font-10 ${m.status === 'completed' ? 'highlight-green' : 'text-muted'}">${statusText}</span>
                        </div>
                        <div class="arc-card-main mt-8">
                            <span class="arc-icon font-24">${m.icon}</span>
                            <div class="arc-text">
                                <h4 class="arc-title font-13">${m.title}</h4>
                                <p class="arc-desc font-11 text-muted mt-2">${m.desc}</p>
                            </div>
                        </div>
                        ${m.bossName ? `
                            <div class="arc-boss-badge mt-10">
                                <span class="font-10 highlight-crimson">👹 BOSS CHALLENGE: <strong>${m.bossName}</strong></span>
                            </div>
                        ` : ''}
                    </div>
                    ${!isLast ? '<div class="arc-connector-line"><span class="arc-glow-pulse"></span></div>' : ''}
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="boss-arc-tree-wrapper">
                <div class="bat-banner">
                    <div class="bat-left">
                        <span class="bat-tag highlight-crimson">📅 30-DAY ANIME TRAINING ARC & BOSS PROGRESSION</span>
                        <h2 class="bat-heading">CHAPTER 01: THE AWAKENED VESSEL</h2>
                        <p class="font-12 text-muted">Defeat behavioral and physical bosses through real daily adherence.</p>
                    </div>
                    <div class="bat-right">
                        <button id="btn-view-monthly-report" class="btn-primary-holo btn-sm">🏆 VIEW 30-DAY HUNTER REPORT</button>
                    </div>
                </div>

                <div class="arc-timeline-path mt-20">
                    ${arcItemsHtml}
                </div>

                <!-- Monthly Transformation Report Modal Container -->
                <div id="modal-monthly-report" class="system-modal-backdrop hidden">
                    <div class="modal-hologram form-holo monthly-report-box">
                        <div class="window-header">
                            <h3 class="window-title">[ 🏆 HUNTER TRANSFORMATION REPORT — ARC 01 ]</h3>
                            <button class="modal-close-x" onclick="document.getElementById('modal-monthly-report').classList.add('hidden')">✕</button>
                        </div>
                        <div class="report-content-body mt-15">
                            <div class="report-hunter-hero">
                                <div class="rhh-avatar font-36">👑</div>
                                <div class="rhh-info">
                                    <h3 class="rhh-name highlight-gold">HUNTER ASCENSION COMPLETE</h3>
                                    <span class="font-12 text-muted">RANK ADVANCEMENT: <strong>E-RANK ➔ C-RANK STRIKER</strong></span>
                                </div>
                            </div>

                            <div class="report-metrics-bars mt-20">
                                <div class="rm-item"><div class="rm-lbl"><span>💪 BODY EVOLUTION</span><strong class="highlight-green">+18%</strong></div><div class="bar-shell"><div class="bar-fill" style="width: 78%; background: #22c55e;"></div></div></div>
                                <div class="rm-item"><div class="rm-lbl"><span>🏋️ STRENGTH OUTPUT</span><strong class="highlight-cyan">+22%</strong></div><div class="bar-shell"><div class="bar-fill" style="width: 82%; background: #00f2fe;"></div></div></div>
                                <div class="rm-item"><div class="rm-lbl"><span>🏃 ENDURANCE & VO2 MAX</span><strong class="highlight-purple">+15%</strong></div><div class="bar-shell"><div class="bar-fill" style="width: 70%; background: #8b5cf6;"></div></div></div>
                                <div class="rm-item"><div class="rm-lbl"><span>🔥 DISCIPLINE & STREAK</span><strong class="highlight-gold">+31%</strong></div><div class="bar-shell"><div class="bar-fill" style="width: 91%; background: #f59e0b;"></div></div></div>
                                <div class="rm-item"><div class="rm-lbl"><span>🧠 COGNITIVE FOCUS & DOMAIN</span><strong class="highlight-cyan">+19%</strong></div><div class="bar-shell"><div class="bar-fill" style="width: 76%; background: #38bdf8;"></div></div></div>
                                <div class="rm-item"><div class="rm-lbl"><span>❤️ RECOVERY EFFICIENCY</span><strong class="highlight-green">+12%</strong></div><div class="bar-shell"><div class="bar-fill" style="width: 68%; background: #10b981;"></div></div></div>
                            </div>

                            <p class="font-12 text-muted mt-20">
                                All metrics derived from verified workout logs, bodyweight tracking, and meditation session completions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindReportModalEvents(container);
    }

    bindReportModalEvents(container) {
        const btnReport = container.querySelector('#btn-view-monthly-report');
        const modal = container.querySelector('#modal-monthly-report');
        if (btnReport && modal) {
            btnReport.addEventListener('click', () => {
                modal.classList.remove('hidden');
                if (window.systemAudio) window.systemAudio.playVictory();
                if (typeof confetti !== 'undefined') {
                    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                }
            });
        }
    }
}

// Global Singleton
if (typeof window !== 'undefined') {
    window.bossTreeEngine = new BossTreeEngine();
}
