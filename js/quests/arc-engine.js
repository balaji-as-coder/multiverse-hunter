/**
 * MULTIVERSE HUNTER — 30-DAY ARC & PROGRESSION HISTORY ENGINE
 * Generates rich adaptive 30-day chapters and archives historical arcs.
 * Never overwrites past data, maintaining complete 180-day transformation chronicles.
 */

class ArcEngine {
    constructor() {
        this.init();
    }

    init() {
        // Listeners for generating new arc or reviewing arc history
        document.addEventListener('click', (e) => {
            const btnNewArc = e.target.closest('#btn-start-next-arc');
            if (btnNewArc) {
                this.generateNextArc();
            }
        });
    }

    generateNextArc() {
        const s = window.systemState.data;
        const nextNum = (s.player.activeArcNumber || 1) + 1;
        const phase = s.player.activePhase || 'RECOMPOSITION';

        let arcTitle = `Chapter ${nextNum}: Evolution & Overload Arc (Days 1–30)`;
        if (nextNum === 2) arcTitle = 'Chapter 2: Structural Hypertrophy & V-Taper Expansion';
        else if (nextNum === 3) arcTitle = 'Chapter 3: Calisthenics Mastery & Metabolic Conditioning';
        else if (nextNum >= 4) arcTitle = `Chapter ${nextNum}: Transcendent Ascension Arc`;

        s.player.activeArcNumber = nextNum;
        s.player.activeArcName = arcTitle;
        s.player.arcDay = 1;

        const newArcRecord = {
            arcNumber: nextNum,
            title: arcTitle,
            phase: phase,
            status: 'active',
            startDate: new Date().toISOString().split('T')[0],
            completionRate: 0,
            xpEarned: 0,
            bodyDeltas: { weightDeltaKg: 0, waistDeltaCm: 0, pushupsDelta: 0 },
            highlights: 'New 30-Day Evolution Chapter initialized.'
        };

        if (!s.arcHistory) s.arcHistory = [];
        s.arcHistory.push(newArcRecord);

        // Advance phase if appropriate
        if (window.phaseEngine) window.phaseEngine.evaluateAutoTransition();

        window.systemState.gainTrackXp('disciplineXp', 500, `Launched ${arcTitle}`);
        window.systemState.save();

        if (window.systemAudio) window.systemAudio.playLevelUp();
        if (window.app) {
            window.app.showToast('NEW 30-DAY ARC LAUNCHED', `${arcTitle} is now active! (+500 Bonus XP)`);
            window.app.syncUI();
        }
    }
}

window.arcEngine = new ArcEngine();
