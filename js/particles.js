/**
 * MULTIVERSE HUNTER — ADVANCED PARTICLE & FX ENGINE (V3.1)
 * Features:
 * - Dynamic Holographic Stardust & Rising Shadow Monarch Mana Flames
 * - Interactive Mouse Mana Trails & Electric Arc Connections
 * - Shockwave Explosions on Level-Up, Quest Clear & Boss Hits
 * - Floating Combat & XP Number Animations
 * - Canvas-Confetti Integration
 */

class ParticleEngine {
    constructor() {
        this.ambientCanvas = document.getElementById('ambient-canvas');
        this.fxCanvas = document.getElementById('fx-canvas');
        this.ambientCtx = this.ambientCanvas ? this.ambientCanvas.getContext('2d') : null;
        this.fxCtx = this.fxCanvas ? this.fxCanvas.getContext('2d') : null;

        this.ambientParticles = [];
        this.fxParticles = [];
        this.shockwaves = [];
        this.floatingTexts = [];
        this.mouseTrails = [];

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouseX = this.width / 2;
        this.mouseY = this.height / 2;

        this.intensityMode = 'NORMAL'; // 'NORMAL' | 'FOCUS' | 'WORKOUT' | 'LEVEL_UP' | 'BOSS_VICTORY'
        this.baseParticleCount = 28; // Controlled, minimal stardust

        this.init();
    }

    setIntensity(mode) {
        this.intensityMode = mode;
        if (mode === 'NORMAL') this.baseParticleCount = 28;
        else if (mode === 'FOCUS') this.baseParticleCount = 18; // Very subtle for deep work
        else if (mode === 'WORKOUT') this.baseParticleCount = 38;
        else if (mode === 'LEVEL_UP' || mode === 'BOSS_VICTORY') this.baseParticleCount = 65;

        // Adjust ambient particle pool
        while (this.ambientParticles.length > this.baseParticleCount) {
            this.ambientParticles.pop();
        }
        while (this.ambientParticles.length < this.baseParticleCount) {
            this.ambientParticles.push(this.createAmbientParticle());
        }
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Track mouse position for interactive mana aura
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            if (this.intensityMode !== 'FOCUS') {
                this.spawnMouseTrail(e.clientX, e.clientY);
            }
        });

        // Spawn ambient stardust & mana flames
        for (let i = 0; i < this.baseParticleCount; i++) {
            this.ambientParticles.push(this.createAmbientParticle());
        }

        this.animate();
    }

    getThemeColors() {
        if (document.body.classList.contains('theme-battle')) {
            return ['#ff3366', '#f59e0b', '#ef4444', '#fecdd3'];
        } else if (document.body.classList.contains('theme-aura')) {
            return ['#00f2fe', '#38bdf8', '#0284c7', '#e0f2fe'];
        } else if (document.body.classList.contains('theme-sage')) {
            return ['#10b981', '#6ee7b7', '#059669', '#d1fae5'];
        }
        // Default Shadow Monarch
        return ['#8b5cf6', '#00e5ff', '#a78bfa', '#f3f4f6'];
    }

    createAmbientParticle() {
        const isManaFlame = Math.random() > 0.75;
        const colors = this.getThemeColors();
        const color = this.intensityMode === 'FOCUS' ? colors[1] : colors[Math.floor(Math.random() * colors.length)];
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            size: Math.random() * (isManaFlame ? 2.5 : 1.5) + 0.5,
            speedX: (Math.random() - 0.5) * 0.25,
            speedY: isManaFlame ? (-Math.random() * 0.5 - 0.2) : (-Math.random() * 0.2 - 0.05),
            opacity: Math.random() * 0.4 + 0.15,
            maxOpacity: Math.random() * 0.5 + 0.2,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            pulseDir: 1,
            isManaFlame,
            color: color
        };
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        if (this.ambientCanvas) {
            this.ambientCanvas.width = this.width;
            this.ambientCanvas.height = this.height;
        }
        if (this.fxCanvas) {
            this.fxCanvas.width = this.width;
            this.fxCanvas.height = this.height;
        }
    }

    spawnMouseTrail(x, y) {
        if (Math.random() > 0.5) return; // Rate limit for performance
        this.mouseTrails.push({
            x: x + (Math.random() - 0.5) * 8,
            y: y + (Math.random() - 0.5) * 8,
            size: Math.random() * 3 + 1.5,
            alpha: 0.8,
            decay: 0.04,
            color: Math.random() > 0.5 ? '#00e5ff' : '#9d4edd'
        });
    }

    spawnBurst(x, y, count = 35, color = '#00e5ff') {
        const posX = x || this.width / 2;
        const posY = y || this.height / 2;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 7 + 2;
            this.fxParticles.push({
                x: posX,
                y: posY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 4 + 2,
                alpha: 1,
                decay: Math.random() * 0.025 + 0.015,
                color: color,
                hasGravity: Math.random() > 0.3
            });
        }

        // Also trigger expanding shockwave ring
        this.spawnShockwave(posX, posY, color);
    }

    spawnShockwave(x, y, color = '#00e5ff') {
        this.shockwaves.push({
            x: x || this.width / 2,
            y: y || this.height / 2,
            radius: 5,
            maxRadius: Math.min(this.width, this.height) * 0.25,
            growth: 7,
            alpha: 0.8,
            decay: 0.03,
            color: color
        });
    }

    spawnFloatingText(text, x, y, color = '#00e5ff') {
        this.floatingTexts.push({
            text: text,
            x: x || this.width / 2,
            y: y || this.height / 2,
            vy: -1.8,
            alpha: 1.0,
            decay: 0.018,
            color: color
        });
    }

    triggerCelebrationConfetti() {
        if (typeof confetti === 'function') {
            // Dual cannon confetti burst
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { x: 0.2, y: 0.6 },
                colors: ['#00e5ff', '#a855f7', '#fbbf24', '#ffffff']
            });
            setTimeout(() => {
                confetti({
                    particleCount: 80,
                    spread: 70,
                    origin: { x: 0.8, y: 0.6 },
                    colors: ['#00e5ff', '#a855f7', '#10b981', '#38bdf8']
                });
            }, 250);
        } else {
            // Fallback particle fireworks
            this.spawnBurst(this.width * 0.3, this.height * 0.4, 50, '#00e5ff');
            this.spawnBurst(this.width * 0.7, this.height * 0.4, 50, '#a855f7');
        }
    }

    animate() {
        // 1. Draw Ambient Particles & Connective Mana Constellations
        if (this.ambientCtx) {
            this.ambientCtx.clearRect(0, 0, this.width, this.height);

            const len = this.ambientParticles.length;
            for (let i = 0; i < len; i++) {
                const p = this.ambientParticles[i];
                p.x += p.speedX;
                p.y += p.speedY;

                // Pulsing opacity
                p.opacity += p.pulseSpeed * p.pulseDir;
                if (p.opacity > p.maxOpacity || p.opacity < 0.15) {
                    p.pulseDir *= -1;
                }

                if (p.y < -10) p.y = this.height + 10;
                if (p.x < -10) p.x = this.width + 10;
                if (p.x > this.width + 10) p.x = -10;

                // Draw Particle Glow
                this.ambientCtx.beginPath();
                this.ambientCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ambientCtx.fillStyle = p.color;
                this.ambientCtx.globalAlpha = Math.max(0, p.opacity);
                this.ambientCtx.shadowBlur = p.isManaFlame ? 12 : 6;
                this.ambientCtx.shadowColor = p.color;
                this.ambientCtx.fill();

                // Draw Connective Web to nearby particles (Constellation effect)
                for (let j = i + 1; j < len; j++) {
                    const p2 = this.ambientParticles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 85) {
                        this.ambientCtx.beginPath();
                        this.ambientCtx.moveTo(p.x, p.y);
                        this.ambientCtx.lineTo(p2.x, p2.y);
                        this.ambientCtx.strokeStyle = p.color;
                        this.ambientCtx.globalAlpha = (1 - dist / 85) * 0.12;
                        this.ambientCtx.lineWidth = 0.6;
                        this.ambientCtx.stroke();
                    }
                }
            }
        }

        // 2. Draw Dynamic FX Particles, Shockwaves, and Floating Texts
        if (this.fxCtx) {
            this.fxCtx.clearRect(0, 0, this.width, this.height);

            // Mouse trails
            for (let i = this.mouseTrails.length - 1; i >= 0; i--) {
                const m = this.mouseTrails[i];
                m.alpha -= m.decay;
                m.size = Math.max(0.2, m.size - 0.05);

                if (m.alpha <= 0) {
                    this.mouseTrails.splice(i, 1);
                    continue;
                }

                this.fxCtx.beginPath();
                this.fxCtx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
                this.fxCtx.fillStyle = m.color;
                this.fxCtx.globalAlpha = m.alpha;
                this.fxCtx.shadowBlur = 8;
                this.fxCtx.shadowColor = m.color;
                this.fxCtx.fill();
            }

            // Shockwave rings
            for (let i = this.shockwaves.length - 1; i >= 0; i--) {
                const sw = this.shockwaves[i];
                sw.radius += sw.growth;
                sw.alpha -= sw.decay;

                if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
                    this.shockwaves.splice(i, 1);
                    continue;
                }

                this.fxCtx.beginPath();
                this.fxCtx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
                this.fxCtx.strokeStyle = sw.color;
                this.fxCtx.globalAlpha = sw.alpha;
                this.fxCtx.lineWidth = Math.max(1, 4 * sw.alpha);
                this.fxCtx.shadowBlur = 15;
                this.fxCtx.shadowColor = sw.color;
                this.fxCtx.stroke();
            }

            // FX Particles
            for (let i = this.fxParticles.length - 1; i >= 0; i--) {
                const p = this.fxParticles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.hasGravity) p.vy += 0.15; // Gravity
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    this.fxParticles.splice(i, 1);
                    continue;
                }

                this.fxCtx.beginPath();
                this.fxCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.fxCtx.fillStyle = p.color;
                this.fxCtx.globalAlpha = p.alpha;
                this.fxCtx.shadowBlur = 12;
                this.fxCtx.shadowColor = p.color;
                this.fxCtx.fill();
            }

            // Floating Numbers & Text
            for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
                const ft = this.floatingTexts[i];
                ft.y += ft.vy;
                ft.alpha -= ft.decay;

                if (ft.alpha <= 0) {
                    this.floatingTexts.splice(i, 1);
                    continue;
                }

                this.fxCtx.font = 'bold 15px "Orbitron", sans-serif';
                this.fxCtx.fillStyle = ft.color;
                this.fxCtx.globalAlpha = ft.alpha;
                this.fxCtx.shadowBlur = 8;
                this.fxCtx.shadowColor = ft.color;
                this.fxCtx.fillText(ft.text, ft.x, ft.y);
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

if (typeof window !== 'undefined') {
    window.particleEngine = new ParticleEngine();
}
