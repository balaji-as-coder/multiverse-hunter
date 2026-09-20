/**
 * MULTIVERSE HUNTER — WEAKNESS-BASED CHARACTER ROTATION ENGINE (V3.1)
 * Analyzes the user's real-time training & habit data to dynamically assign
 * mentors that specifically attack their current biological or psychological weaknesses.
 */

class WeaknessRotationEngine {
    constructor() {
        this.mentorRoster = {
            'discipline': [
                { id: 'might_guy', name: 'Might Guy', focus: 'Dynamic Energy & Habit Consistency', quote: 'Youth is about burning with passion!' },
                { id: 'rock_lee', name: 'Rock Lee', focus: 'Bodyweight Volume & Hard Work', quote: 'A drop of sweat is worth more than a sea of talent.' },
                { id: 'asta', name: 'Asta', focus: 'High-Effort Anaerobic Grit', quote: 'My magic is never giving up!' },
                { id: 'saitama', name: 'Saitama', focus: 'Daily 100% Habit Lock', quote: '100 push-ups, 100 sit-ups, 100 squats, 10km run!' }
            ],
            'strength': [
                { id: 'zoro', name: 'Roronoa Zoro', focus: 'Heavy Progressive Overload', quote: 'Three swords are useless if your body cannot carry them.' },
                { id: 'goku', name: 'Son Goku', focus: 'Lifting PR Progression & Limit Breaking', quote: 'Power comes in response to a need, not a desire.' },
                { id: 'vegeta', name: 'Vegeta', focus: 'Volume Capacity & Saiyan Pride', quote: 'Surpass your limits every single day!' },
                { id: 'toji', name: 'Toji Fushiguro', focus: 'Pure Calisthenics Mastery & Raw Tension', quote: 'My physical body is absolute.' }
            ],
            'mind': [
                { id: 'gojo', name: 'Satoru Gojo', focus: 'Cognitive Flow & Void Meditation', quote: 'Throughout heaven and earth, you alone are the main character.' },
                { id: 'urahara', name: 'Kisuke Urahara', focus: 'Systematic Macro Calibration & Tactics', quote: 'There is nothing but fear in a warrior who does not think.' },
                { id: 'kakashi', name: 'Kakashi Hatake', focus: 'Micro-Periodization & Journaling', quote: 'The next generation will always surpass the previous one.' }
            ],
            'recovery': [
                { id: 'giyu', name: 'Giyu Tomioka', focus: 'Dead Calm Parasympathetic Reset', quote: 'Dead Calm.' },
                { id: 'bang', name: 'Silver Fang (Bang)', focus: 'Joint Mobility & Flow State', quote: 'Flow like water, strike like stone.' }
            ]
        };
    }

    /**
     * Identifies the current weakest progression domain from system state
     */
    evaluateWeakness() {
        const s = window.systemState ? window.systemState.data : null;
        if (!s) return 'discipline';

        const tracks = s.xpTracks || {};
        const discXp = tracks.disciplineXp ? tracks.disciplineXp.total : 0;
        const bodyXp = tracks.bodyXp ? tracks.bodyXp.total : 0;
        const mindXp = tracks.mindXp ? tracks.mindXp.total : 0;
        const recXp = tracks.recoveryXp ? tracks.recoveryXp.total : 0;

        const scores = [
            { domain: 'discipline', score: discXp },
            { domain: 'strength', score: bodyXp },
            { domain: 'mind', score: mindXp },
            { domain: 'recovery', score: recXp }
        ];

        scores.sort((a, b) => a.score - b.score);
        return scores[0].domain;
    }

    /**
     * Recommends the optimal mentor matching the detected weakness
     */
    getRecommendedMentor() {
        const weakness = this.evaluateWeakness();
        const pool = this.mentorRoster[weakness] || this.mentorRoster['discipline'];
        return pool[Math.floor(Math.random() * pool.length)];
    }
}

// Global Singleton
if (typeof window !== 'undefined') {
    window.weaknessRotationEngine = new WeaknessRotationEngine();
}
