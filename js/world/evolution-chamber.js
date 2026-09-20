/**
 * MULTIVERSE HUNTER — HUNTER EVOLUTION CHAMBER (V3.1)
 * Synchronizes real biological measurements and training history
 * with the visual avatar progression stages across Month 1, 2, 3, 6, 12+.
 */

class EvolutionChamberEngine {
    constructor() {
        this.stages = [
            {
                month: 1,
                stageKey: 'awakened',
                title: 'STAGE I: AWAKENED HUNTER',
                rank: 'E-Rank Initiate',
                avatarIcon: '👤',
                auraGlow: '0 0 15px rgba(156, 163, 175, 0.4)',
                color: '#9ca3af',
                reqMetrics: 'Baseline Calibration, 7-Day Adherence > 70%',
                realMetricsSummary: 'Weight: Baseline | Push-ups: 10-15 | Plank: 45s'
            },
            {
                month: 2,
                stageKey: 'foundation',
                title: 'STAGE II: FOUNDATION HUNTER',
                rank: 'D-Rank Awakened',
                avatarIcon: '🛡️',
                auraGlow: '0 0 20px rgba(34, 197, 94, 0.5)',
                color: '#22c55e',
                reqMetrics: 'Body Level 5+, Consistent Sleep & Hydration Locked',
                realMetricsSummary: 'Waist: -2cm | Deadlift: 1.0x BW | Push-ups: 25 strict'
            },
            {
                month: 3,
                stageKey: 'evolved',
                title: 'STAGE III: EVOLVED HUNTER',
                rank: 'C-Rank Striker',
                avatarIcon: '⚔️',
                auraGlow: '0 0 25px rgba(56, 189, 248, 0.6)',
                color: '#38bdf8',
                reqMetrics: 'Body Level 10+, Progressive Overload Week-over-Week',
                realMetricsSummary: 'Waist: -4cm | Pull-ups: 8 strict | 5km: < 28 mins'
            },
            {
                month: 6,
                stageKey: 'elite',
                title: 'STAGE IV: ELITE COMMANDER',
                rank: 'B/A-Rank Elite',
                avatarIcon: '⚡',
                auraGlow: '0 0 30px rgba(0, 242, 254, 0.7)',
                color: '#00f2fe',
                reqMetrics: 'Body Level 20+, Calisthenics Tier 3 Mastery',
                realMetricsSummary: 'Bench: 1.25x BW | Deadlift: 1.75x BW | Muscle-ups: 3-5'
            },
            {
                month: 12,
                stageKey: 'monarch',
                title: 'STAGE V: SHADOW MONARCH',
                rank: 'S-Rank Sovereign',
                avatarIcon: '👑',
                auraGlow: '0 0 40px rgba(139, 92, 246, 0.85)',
                color: '#8b5cf6',
                reqMetrics: 'Body Level 35+, Peak Physical Work Capacity & Void Focus',
                realMetricsSummary: 'Peak Composition | Deadlift: 2.0x+ BW | 100% Habit Lock'
            }
        ];
    }

    renderChamber(containerId = 'evolution-chamber-container') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const s = window.systemState ? window.systemState.data : null;
        const currentEvo = window.systemState ? window.systemState.getAvatarEvolution() : { stageKey: 'awakened' };
        const p = s ? s.player : { hunterLevel: 1, bodyLevel: 1, rank: 'E' };
        const perf = s ? (s.performanceMetrics || {}) : {};

        const timelineHtml = this.stages.map(st => {
            const isCurrent = st.stageKey === currentEvo.stageKey;
            return `
                <div class="hec-stage-card ${isCurrent ? 'current-active-evo' : ''}" style="border-color: ${isCurrent ? st.color : 'rgba(255,255,255,0.08)'}">
                    <div class="hec-card-top">
                        <span class="hec-month-badge" style="background: ${st.color}22; color: ${st.color}">MONTH ${st.month}</span>
                        ${isCurrent ? '<span class="hec-active-tag highlight-cyan">★ CURRENT VESSEL</span>' : ''}
                    </div>
                    <div class="hec-avatar-preview mt-10" style="box-shadow: ${st.auraGlow}">
                        ${st.avatarIcon}
                    </div>
                    <h4 class="hec-stage-title mt-8" style="color: ${st.color}">${st.title}</h4>
                    <div class="hec-rank-tag font-11 text-muted">${st.rank}</div>
                    <div class="hec-divider mt-10"></div>
                    <div class="hec-real-metrics mt-10">
                        <span class="hec-metric-lbl">REAL BIOLOGY & STRENGTH:</span>
                        <p class="hec-metric-val font-11">${st.realMetricsSummary}</p>
                    </div>
                    <div class="hec-reqs mt-8 font-10 text-muted">
                        🔒 ${st.reqMetrics}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="evolution-chamber-wrapper">
                <div class="hec-banner">
                    <div class="hec-banner-left">
                        <span class="hec-tag highlight-violet">🧬 BIOMETRIC & VESSEL SYNCHRONIZATION</span>
                        <h2 class="hec-heading">HUNTER EVOLUTION CHAMBER</h2>
                        <p class="hec-desc font-12 text-muted">
                            Your anime avatar’s form is not arbitrary—it directly materializes your real-world lifting PRs, body composition, sleep metrics, and calisthenics ladders.
                        </p>
                    </div>
                    <div class="hec-current-telemetry">
                        <div class="hct-item">
                            <span class="hct-lbl">BODY LEVEL</span>
                            <strong class="highlight-green">Lv. ${p.bodyLevel || 1}</strong>
                        </div>
                        <div class="hct-item">
                            <span class="hct-lbl">HUNTER RANK</span>
                            <strong class="highlight-gold">${p.rank}-RANK</strong>
                        </div>
                        <div class="hct-item">
                            <span class="hct-lbl">CURRENT VESSEL</span>
                            <strong style="color: ${currentEvo.auraColor}">${currentEvo.badgeText}</strong>
                        </div>
                    </div>
                </div>

                <div class="hec-timeline-grid mt-20">
                    ${timelineHtml}
                </div>
            </div>
        `;
    }
}

// Global Singleton
if (typeof window !== 'undefined') {
    window.evolutionChamber = new EvolutionChamberEngine();
}
