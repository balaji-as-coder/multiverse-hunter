/**
 * MULTIVERSE HUNTER — MASTER APPLICATION COORDINATOR (V3)
 * Full synchronization across 6-track XP, Multi-Levels (Body Level, Life Level, Hunter Level),
 * 8 Phases, Adaptive TDEE & Maintenance, Dynamic Hydration, What's Available Today meal generator,
 * Daily Hunter Journal, Plateau Detection Diagnostics, and Coaching Platform.
 */

class MasterApp {
    constructor() {
        this.init();
    }

    init() {
        this.bindGlobalEvents();
        this.syncUI();

        // Check if user is awakened; if not, open awakening protocol
        setTimeout(() => {
            if (!window.systemState.data.awakened) {
                if (window.onboardingWizard) {
                    window.onboardingWizard.openWizard(false);
                }
            }
        }, 500);

        this.startCountdownLoop();
    }

    bindGlobalEvents() {
        // Navigation Tab Switching (Desktop Sidebar & Mobile Drawer)
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                this.switchTab(targetTab);
                this.closeMobileNav();
            });
        });

        // Mobile Bottom Navigation Dock Items
        document.querySelectorAll('.mb-nav-item[data-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                this.switchTab(targetTab);
                this.closeMobileNav();
            });
        });

        // Mobile Nav Drawer Toggle Buttons
        const mobileNavToggle = document.getElementById('btn-mobile-nav-toggle');
        if (mobileNavToggle) {
            mobileNavToggle.addEventListener('click', () => this.toggleMobileNav());
        }

        const btnMobileMore = document.getElementById('btn-mobile-more-menu');
        if (btnMobileMore) {
            btnMobileMore.addEventListener('click', () => this.openMobileNav());
        }

        const btnCloseMobileNav = document.getElementById('btn-close-mobile-nav');
        if (btnCloseMobileNav) {
            btnCloseMobileNav.addEventListener('click', () => this.closeMobileNav());
        }

        const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
        if (mobileNavBackdrop) {
            mobileNavBackdrop.addEventListener('click', () => this.closeMobileNav());
        }

        // Close mobile drawer on Escape key or Resize to desktop
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeMobileNav();
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) this.closeMobileNav();
        });

        // Theme Mode Selector & Persistence (Token-Based data-theme + Class)
        const selectTheme = document.getElementById('select-theme-mode');
        if (selectTheme) {
            const savedTheme = localStorage.getItem('hunter_theme_mode') || 'theme-shadow';
            const themeKey = savedTheme.replace('theme-', '');
            selectTheme.value = savedTheme;
            document.documentElement.setAttribute('data-theme', themeKey);
            document.body.setAttribute('data-theme', themeKey);
            document.body.classList.remove('theme-shadow', 'theme-aura', 'theme-battle', 'theme-sage');
            document.body.classList.add(savedTheme);

            selectTheme.addEventListener('change', (e) => {
                const newTheme = e.target.value;
                const newKey = newTheme.replace('theme-', '');
                document.documentElement.setAttribute('data-theme', newKey);
                document.body.setAttribute('data-theme', newKey);
                document.body.classList.remove('theme-shadow', 'theme-aura', 'theme-battle', 'theme-sage');
                document.body.classList.add(newTheme);
                localStorage.setItem('hunter_theme_mode', newTheme);
                if (window.systemAudio) window.systemAudio.playClick();
                this.showToast('THEME ACTIVATED', `Switched visual aesthetic to ${e.target.options[e.target.selectedIndex].text}`);
            });
        }

        // Audio Toggle
        const audioBtn = document.getElementById('btn-audio-toggle');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                const isMuted = window.systemAudio ? window.systemAudio.toggleMute() : false;
                document.getElementById('audio-icon').innerText = isMuted ? '🔇' : '🔊';
                this.showToast('AUDIO SETTING', isMuted ? 'System SFX Muted' : 'System SFX Enabled');
            });
        }

        // Editable Hunter Name
        const nameInput = document.getElementById('input-player-name');
        if (nameInput) {
            nameInput.addEventListener('change', (e) => {
                window.systemState.data.player.name = e.target.value.trim() || 'Hunter';
                window.systemState.save();
                this.syncUI();
            });
        }

        // Stat Point Allocation Buttons (+ buttons)
        document.addEventListener('click', (e) => {
            const btnStat = e.target.closest('.btn-stat-add');
            if (btnStat) {
                const statKey = btnStat.dataset.stat;
                if (window.systemState.allocateStat(statKey)) {
                    if (window.systemAudio) window.systemAudio.playStatAdd();
                    if (window.particleEngine) window.particleEngine.spawnBurst(e.clientX, e.clientY, 15, '#00e5ff');
                    this.syncUI();
                }
            }
        });

        // Auto Assign Stats
        const btnAuto = document.getElementById('btn-auto-assign');
        if (btnAuto) {
            btnAuto.addEventListener('click', () => {
                window.systemState.autoAssignStats();
                if (window.systemAudio) window.systemAudio.playStatAdd();
                this.syncUI();
            });
        }

        // Modal Close Buttons
        document.querySelectorAll('.modal-close-x, .btn-close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.system-modal-backdrop');
                if (modal) modal.classList.add('hidden');
            });
        });

        // Water Logging Buttons
        const btnAddWater = document.getElementById('btn-add-water');
        if (btnAddWater) {
            btnAddWater.addEventListener('click', () => {
                const hyd = window.systemState.data.hydration;
                hyd.consumedLiters = Math.min(8.0, +(hyd.consumedLiters + 0.25).toFixed(2));
                if (hyd.consumedLiters >= hyd.configuredTargetLiters) {
                    window.systemState.gainTrackXp('recoveryXp', 50, 'Met Daily Hydration Goal');
                }
                window.systemState.save();
                if (window.systemAudio) window.systemAudio.playStatAdd();
                this.syncUI();
            });
        }

        const btnResetWater = document.getElementById('btn-reset-water');
        if (btnResetWater) {
            btnResetWater.addEventListener('click', () => {
                window.systemState.data.hydration.consumedLiters = 0;
                window.systemState.save();
                this.syncUI();
            });
        }

        // Realm Switching Buttons (Multiverse World Stage)
        document.addEventListener('click', (e) => {
            const btnRealm = e.target.closest('.btn-realm-pill');
            if (btnRealm && window.worldEngine) {
                document.querySelectorAll('.btn-realm-pill').forEach(b => b.classList.remove('active'));
                btnRealm.classList.add('active');
                window.worldEngine.switchRealm(btnRealm.dataset.realm);
            }
        });

        // Subscribe to State Changes
        window.systemState.subscribe(() => {
            this.syncUI();
        });
    }

    openMobileNav() {
        const nav = document.getElementById('system-nav');
        const backdrop = document.getElementById('mobile-nav-backdrop');
        const toggleBtn = document.getElementById('btn-mobile-nav-toggle');
        if (nav) nav.classList.add('mobile-open');
        if (backdrop) backdrop.classList.add('active');
        if (toggleBtn) toggleBtn.classList.add('active');
        document.body.classList.add('mobile-nav-locked');
    }

    closeMobileNav() {
        const nav = document.getElementById('system-nav');
        const backdrop = document.getElementById('mobile-nav-backdrop');
        const toggleBtn = document.getElementById('btn-mobile-nav-toggle');
        if (nav) nav.classList.remove('mobile-open');
        if (backdrop) backdrop.classList.remove('active');
        if (toggleBtn) toggleBtn.classList.remove('active');
        document.body.classList.remove('mobile-nav-locked');
    }

    toggleMobileNav() {
        const nav = document.getElementById('system-nav');
        if (nav && nav.classList.contains('mobile-open')) {
            this.closeMobileNav();
        } else {
            this.openMobileNav();
        }
    }

    switchTab(tabId) {
        // Sync Desktop Sidebar & Mobile Drawer items
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });

        // Sync Mobile Bottom Dock items
        document.querySelectorAll('.mb-nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });

        document.querySelectorAll('.tab-panel').forEach(panel => {
            const isActive = panel.id === tabId;
            panel.classList.toggle('active', isActive);
            if (isActive && typeof gsap !== 'undefined') {
                gsap.fromTo(panel, { opacity: 0, y: 12, scale: 0.995 }, { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: 'power2.out' });
            }
        });

        // Scroll to top of content on mobile tab change
        if (window.innerWidth <= 768) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        if (window.systemAudio) window.systemAudio.playClick();
        this.syncUI();
    }

    showToast(title, message) {
        const container = document.getElementById('system-toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'system-toast';
        toast.innerHTML = `
            <div class="toast-glow"></div>
            <div class="toast-icon">⚡</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-desc">${message}</div>
            </div>
        `;

        container.appendChild(toast);

        if (typeof gsap !== 'undefined') {
            gsap.fromTo(toast, { opacity: 0, x: 50, scale: 0.9 }, { opacity: 1, x: 0, scale: 1, duration: 0.35, ease: 'back.out(1.5)' });
        }

        setTimeout(() => {
            if (typeof gsap !== 'undefined') {
                gsap.to(toast, { opacity: 0, x: 30, scale: 0.9, duration: 0.3, onComplete: () => toast.remove() });
            } else {
                toast.classList.add('fade-out');
                setTimeout(() => toast.remove(), 400);
            }
        }, 3500);
    }

    startCountdownLoop() {
        setInterval(() => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setHours(24, 0, 0, 0);
            const diff = tomorrow - now;

            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            const el = document.getElementById('daily-countdown');
            if (el) {
                el.innerText = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    syncUI() {
        const s = window.systemState.data;
        if (!s) return;

        // 1. Top Header Elements
        const headerName = document.getElementById('header-player-name');
        if (headerName) headerName.innerText = s.player.name;

        const headerRank = document.getElementById('header-rank-badge');
        if (headerRank) {
            headerRank.innerText = `${s.player.rank}-RANK`;
            headerRank.className = `rank-badge rank-${s.player.rank.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
        }

        const headerLevel = document.getElementById('header-player-level');
        if (headerLevel) headerLevel.innerText = s.player.hunterLevel;

        // 1b. Hunter Profile & Data-Driven Avatar Evolution
        const avatarEvo = window.systemState.getAvatarEvolution ? window.systemState.getAvatarEvolution() : {
            stageKey: 'awakened',
            title: 'Awakened Initiate',
            auraColor: '#9ca3af',
            auraGlow: '0 0 12px rgba(156, 163, 175, 0.3)',
            avatarIcon: '👤',
            badgeText: 'STAGE I: AWAKENED'
        };

        const rankPill = document.getElementById('status-rank-pill');
        if (rankPill) {
            rankPill.innerText = `${s.player.rank}-RANK`;
            rankPill.className = `rank-indicator-overlay rank-${s.player.rank.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
        }

        const titleEl = document.getElementById('status-player-title');
        if (titleEl) titleEl.innerText = avatarEvo.title || s.player.title;

        const jobEl = document.getElementById('status-player-job');
        if (jobEl) jobEl.innerText = `Job: ${s.player.job || 'Hunter'}`;

        const stageBadge = document.getElementById('status-avatar-stage');
        if (stageBadge) {
            stageBadge.innerText = avatarEvo.badgeText;
            stageBadge.style.color = avatarEvo.auraColor;
        }

        const avatarAura = document.getElementById('hunter-avatar-aura');
        if (avatarAura) {
            avatarAura.style.boxShadow = avatarEvo.auraGlow;
            avatarAura.style.borderColor = avatarEvo.auraColor;
        }

        const avatarIcon = document.getElementById('hunter-avatar-icon');
        if (avatarIcon) {
            avatarIcon.innerText = avatarEvo.avatarIcon;
        }

        // 2. Multi-Level Badges (Body Level, Life Level, Hunter Level)
        if (document.getElementById('status-hunter-level')) document.getElementById('status-hunter-level').innerText = s.player.hunterLevel;
        if (document.getElementById('status-body-level')) document.getElementById('status-body-level').innerText = `Lv. ${s.player.bodyLevel}`;
        if (document.getElementById('status-life-level')) document.getElementById('status-life-level').innerText = `Lv. ${s.player.lifeLevel}`;
        if (document.getElementById('status-active-phase-badge')) document.getElementById('status-active-phase-badge').innerText = `PHASE: ${s.player.activePhase.replace('_', ' ')}`;

        // 3. 6 Independent XP Tracks
        const xpT = s.xpTracks;
        ['bodyXp', 'nutritionXp', 'recoveryXp', 'disciplineXp', 'mindXp', 'businessXp'].forEach(key => {
            const track = xpT[key];
            if (!track) return;
            const lvlEl = document.getElementById(`track-lvl-${key}`);
            const barEl = document.getElementById(`track-bar-${key}`);
            const txtEl = document.getElementById(`track-txt-${key}`);
            
            if (lvlEl) lvlEl.innerText = `Lv. ${track.level}`;
            const pct = Math.min(100, Math.round((track.current / Math.max(1, track.next)) * 100));
            if (barEl) barEl.style.width = `${pct}%`;
            if (txtEl) txtEl.innerText = `${track.current} / ${track.next} XP (${pct}%)`;
        });

        // 4. Vitals & Currencies
        const goldEl = document.getElementById('status-gold');
        if (goldEl) goldEl.innerText = s.player.gold;

        const crystalEl = document.getElementById('status-crystals');
        if (crystalEl) crystalEl.innerText = s.player.crystals;

        const fatigueBar = document.getElementById('status-fatigue-bar');
        const fatigueCur = document.getElementById('status-fatigue-cur');
        if (fatigueBar) fatigueBar.style.width = `${s.player.fatigue}%`;
        if (fatigueCur) fatigueCur.innerText = s.player.fatigue;

        const unallocated = document.getElementById('status-unallocated-pts');
        if (unallocated) unallocated.innerText = s.player.unallocatedPoints;

        // 5. 8 Attributes
        ['str', 'agi', 'vit', 'int', 'focus', 'will', 'energy', 'biz'].forEach(statKey => {
            const el = document.getElementById(`stat-val-${statKey}`);
            if (el) el.innerText = s.stats[statKey] || 10;
        });

        // 6. 8-Attribute Radar Chart
        if (window.radarChart) {
            window.radarChart.render(s.stats);
        }

        // 7. Recovery & Readiness Status
        const rec = s.recoveryMetrics;
        const readinessPill = document.getElementById('dashboard-readiness-pill');
        if (readinessPill) {
            readinessPill.innerText = `${rec.readinessState} READINESS`;
            readinessPill.className = `readiness-badge badge-${rec.readinessState.toLowerCase()}`;
        }

        const readinessMsg = document.getElementById('dashboard-readiness-msg');
        if (readinessMsg) readinessMsg.innerText = rec.readinessMessage;

        const healthScoreEl = document.getElementById('health-index-score');
        if (healthScoreEl) healthScoreEl.innerText = rec.healthIndex || 85;

        const healthBar = document.getElementById('health-index-bar');
        if (healthBar) healthBar.style.width = `${rec.healthIndex || 85}%`;

        // 8. Adaptive TDEE & Nutrition Engine
        const nut = s.nutrition;
        const tdee = s.tdeeModel;
        if (document.getElementById('nut-cal-cur')) document.getElementById('nut-cal-cur').innerText = nut.caloriesConsumed;
        if (document.getElementById('nut-cal-target')) document.getElementById('nut-cal-target').innerText = nut.caloriesTarget;
        if (document.getElementById('tdee-maintenance-val')) document.getElementById('tdee-maintenance-val').innerText = `${tdee.estimatedActualMaintenance} kcal`;
        if (document.getElementById('tdee-confidence-val')) document.getElementById('tdee-confidence-val').innerText = tdee.maintenanceConfidence;
        if (document.getElementById('tdee-rolling-weight')) document.getElementById('tdee-rolling-weight').innerText = `${tdee.rolling7DayAvgWeight} kg (${tdee.weeklyWeightDeltaKg} kg/wk)`;

        if (document.getElementById('nut-prot-cur')) document.getElementById('nut-prot-cur').innerText = `${nut.proteinConsumed}g`;
        if (document.getElementById('nut-prot-target')) document.getElementById('nut-prot-target').innerText = `${nut.proteinTarget}g`;

        // Hydration Widget
        const hyd = s.hydration;
        if (document.getElementById('nut-water-cur')) document.getElementById('nut-water-cur').innerText = `${hyd.consumedLiters}L`;
        if (document.getElementById('nut-water-target')) document.getElementById('nut-water-target').innerText = `${hyd.configuredTargetLiters}L`;
        if (document.getElementById('nut-water-bar')) {
            const wPct = Math.min(100, Math.round((hyd.consumedLiters / Math.max(1, hyd.configuredTargetLiters)) * 100));
            document.getElementById('nut-water-bar').style.width = `${wPct}%`;
        }

        // 9. Render Dynamic Lists
        this.renderNutritionMealsList();
        this.renderQuestsList();
        this.renderTrainingView();
        this.renderCalisthenicsTree();
        this.renderMultiverseView();
        this.renderClientsList();
        this.renderProgressView();
        this.renderJournalEntries();

        // 10. Hunter Status Centerpiece Dynamic Sync
        const hscName = document.getElementById('hsc-hunter-name');
        if (hscName) hscName.innerText = s.player.name.toUpperCase();
        const hscRank = document.getElementById('hsc-rank-badge');
        if (hscRank) hscRank.innerText = `${s.player.rank}-RANK`;

        // 11. Living World Hub & Hunter Evolution Chamber
        if (window.worldEngine) {
            window.worldEngine.renderCharacterWorldInteraction();
            const hccWorld = document.getElementById('hcc-world-name');
            if (hccWorld && window.worldEngine.realms[window.worldEngine.currentRealmId]) {
                hccWorld.innerText = window.worldEngine.realms[window.worldEngine.currentRealmId].name;
            }
            const hccMentor = document.getElementById('hcc-mentor-name');
            if (hccMentor && window.worldEngine.activeCharacter) {
                const rel = window.worldEngine.getRelationship(window.worldEngine.activeCharacter.id);
                hccMentor.innerText = `${window.worldEngine.activeCharacter.name} (Affinity ${rel.affinity}%)`;
            }
        }
        if (window.evolutionChamber) {
            window.evolutionChamber.renderChamber('evolution-chamber-container');
        }
        if (window.journeyEngine) {
            window.journeyEngine.renderJourneyPath('journey-flow-path-container');
        }
        if (window.skillTreeEngine) {
            if (window.skillTreeEngine.renderSkillTrees) {
                window.skillTreeEngine.renderSkillTrees('skill-tree-display-container');
            } else if (window.skillTreeEngine.renderSkillTree) {
                window.skillTreeEngine.renderSkillTree('skill-tree-display-container');
            }
        }
        if (window.bossTreeEngine) {
            window.bossTreeEngine.renderBossAndArcTree('boss-arc-tree-display-container');
        }
    }

    renderNutritionMealsList() {
        const container = document.getElementById('nutrition-meals-container');
        if (!container) return;

        const meals = window.systemState.data.nutrition.dailyMeals || [];
        container.innerHTML = '';

        if (meals.length === 0) {
            container.innerHTML = '<p class="text-muted">No meal plan loaded. Click "What\'s Available Today?" to generate a custom menu.</p>';
            return;
        }

        meals.forEach(meal => {
            const card = document.createElement('div');
            card.className = `meal-card ${meal.logged ? 'logged' : ''}`;
            
            let itemsHtml = '';
            meal.items.forEach(item => {
                itemsHtml += `
                    <div class="meal-item-row">
                        <div class="item-name-wrap">
                            <span class="item-name">${item.name}</span>
                            <span class="item-portion">(${item.serving || item.portion || '1 portion'})</span>
                        </div>
                        <div class="item-macros">
                            <span class="macro-prot">${item.protein}g P</span>
                            <span class="macro-cal">${item.cal} kcal</span>
                            <button class="btn-food-swap" data-meal-id="${meal.id}" data-item-id="${item.id}" title="Swap with closest nutritional match">🔄 SWAP</button>
                        </div>
                    </div>
                `;
            });

            card.innerHTML = `
                <div class="meal-header">
                    <div>
                        <h4 class="meal-title">${meal.name}</h4>
                        <span class="meal-time">${meal.time}</span>
                    </div>
                    <button class="btn-toggle-meal ${meal.logged ? 'btn-meal-done' : 'btn-primary-holo'}" data-meal-id="${meal.id}">
                        ${meal.logged ? '✓ LOGGED (+XP)' : 'LOG MEAL'}
                    </button>
                </div>
                <div class="meal-items-list">
                    ${itemsHtml}
                </div>
            `;
            container.appendChild(card);
        });
    }

    renderQuestsList() {
        const container = document.getElementById('daily-quests-container');
        if (!container) return;

        const s = window.systemState.data;
        const allQuests = [...s.quests.daily, ...s.quests.custom];
        container.innerHTML = '';

        allQuests.forEach(q => {
            const card = document.createElement('div');
            card.className = `quest-item-card ${q.completed ? 'completed' : ''}`;
            card.innerHTML = `
                <div class="quest-checkbox-col">
                    <button class="btn-complete-quest ${q.completed ? 'checked' : ''}" data-quest-id="${q.id}">
                        ${q.completed ? '✓' : ''}
                    </button>
                </div>
                <div class="quest-info-col">
                    <div class="quest-title-row">
                        <span class="quest-name">${q.title}</span>
                        <span class="quest-stat-badge stat-${q.stat}">+1 ${q.stat.toUpperCase()}</span>
                    </div>
                    <div class="quest-rewards">
                        <span class="reward-xp">+${q.xp} ${q.track ? q.track.replace('Xp', ' XP').toUpperCase() : 'XP'}</span>
                        <span class="reward-gold">+${q.gold} Gold</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    renderTrainingView() {
        const s = window.systemState.data;
        const schedContainer = document.getElementById('weekly-training-schedule');
        if (schedContainer && s.training.weeklySchedule) {
            schedContainer.innerHTML = '';
            s.training.weeklySchedule.forEach(item => {
                const row = document.createElement('div');
                row.className = `schedule-row ${item.status === 'completed' ? 'completed' : ''}`;
                row.innerHTML = `
                    <div class="sched-day">${item.day}</div>
                    <div class="sched-info">
                        <div class="sched-title">${item.title}</div>
                        <div class="sched-meta">${item.duration} | Focus: ${item.focus}</div>
                    </div>
                    <div class="sched-status">
                        ${item.status === 'completed' ? '<span class="status-done">CLEARED ✓</span>' : '<span class="status-pending">PENDING</span>'}
                    </div>
                `;
                schedContainer.appendChild(row);
            });
        }
    }

    renderCalisthenicsTree() {
        const container = document.getElementById('calisthenics-tree-container');
        if (!container || !window.calisthenicsEngine) return;

        const tree = window.calisthenicsEngine.treeData;
        container.innerHTML = '';

        ['push', 'pull', 'legs', 'core'].forEach(branchKey => {
            const branchList = tree[branchKey];
            const branchCol = document.createElement('div');
            branchCol.className = 'calisthenics-branch-col';

            let nodesHtml = '';
            branchList.forEach(node => {
                nodesHtml += `
                    <div class="calisthenics-node ${node.status}" data-branch="${branchKey}" data-tier="${node.tier}">
                        <div class="node-tier">TIER ${node.tier}</div>
                        <div class="node-name">${node.name}</div>
                        <div class="node-target">${node.repsTarget}</div>
                        <div class="node-status-badge">${node.status.toUpperCase()}</div>
                    </div>
                `;
            });

            branchCol.innerHTML = `
                <h4 class="branch-header">[ ${branchKey.toUpperCase()} LADDER ]</h4>
                <div class="branch-nodes-wrap">${nodesHtml}</div>
            `;
            container.appendChild(branchCol);
        });
    }

    renderMultiverseView() {
        if (window.multiverseEngine) {
            window.multiverseEngine.renderLegion();
            window.multiverseEngine.renderBossStages();
        }
    }

    renderClientsList() {
        const container = document.getElementById('clients-list-container');
        if (!container) return;

        const clients = window.systemState.clients || [];
        container.innerHTML = '';

        clients.forEach(c => {
            const card = document.createElement('div');
            card.className = 'client-summary-card';
            card.innerHTML = `
                <div class="client-head">
                    <div class="client-avatar">👤</div>
                    <div class="client-titles">
                        <h4 class="c-name">${c.name}</h4>
                        <span class="c-arc">Phase: ${c.activePhase || 'FOUNDATION'}</span>
                    </div>
                    <span class="c-status-badge">Active</span>
                </div>
                <div class="client-stats-grid">
                    <div><span>WEIGHT:</span> <strong>${c.weightKg}kg</strong></div>
                    <div><span>GOAL:</span> <strong>${c.physiqueArchetype.toUpperCase()}</strong></div>
                    <div><span>DIET:</span> <strong>${c.dietType.toUpperCase()} (${c.targetCalories || 2000} kcal)</strong></div>
                    <div><span>ADHERENCE:</span> <strong class="highlight-cyan">${c.adherenceRate}%</strong></div>
                </div>
                <button class="btn-secondary-holo btn-view-client btn-wide" data-client-id="${c.id}">VIEW FULL CLIENT DOSSIER</button>
            `;
            container.appendChild(card);
        });
    }

    renderProgressView() {
        const s = window.systemState.data;
        const arcContainer = document.getElementById('arc-history-container');
        if (arcContainer && s.arcHistory) {
            arcContainer.innerHTML = '';
            s.arcHistory.forEach(arc => {
                const div = document.createElement('div');
                div.className = 'arc-history-card';
                div.innerHTML = `
                    <div class="arc-h-head">
                        <span class="arc-num">CHAPTER ${arc.arcNumber}</span>
                        <h4 class="arc-t">${arc.title}</h4>
                        <span class="arc-phase-tag">[ ${arc.phase} ]</span>
                    </div>
                    <p class="arc-hl">${arc.highlights}</p>
                `;
                arcContainer.appendChild(div);
            });
        }
    }

    renderJournalEntries() {
        const container = document.getElementById('journal-entries-container');
        if (!container) return;

        const entries = window.systemState.data.journal?.entries || [];
        container.innerHTML = '';

        entries.forEach(e => {
            const card = document.createElement('div');
            card.className = 'journal-card';
            card.innerHTML = `
                <div class="j-head">
                    <span class="j-date">${e.date}</span>
                    <span class="j-energy">Energy: ${e.energyScore}/10</span>
                </div>
                <div class="j-checks">
                    <span>Workout: ${e.workoutCompleted ? '✓' : '✗'}</span>
                    <span>Nutrition: ${e.nutritionAdhered ? '✓' : '✗'}</span>
                    <span>Learning: ${e.learningCompleted ? '✓' : '✗'}</span>
                    <span>Business: ${e.businessCompleted ? '✓' : '✗'}</span>
                </div>
                <p class="j-lesson"><strong>Lesson:</strong> ${e.todayLesson}</p>
                <p class="j-priority"><strong>Tomorrow's Priority:</strong> ${e.tomorrowPriority}</p>
            `;
            container.appendChild(card);
        });
    }

    // ================= V3.1 ARCHITECTURAL ENHANCEMENTS =================

    openEvidenceInspector(filter = 'all') {
        const modal = document.getElementById('modal-evidence-inspector');
        if (!modal || !window.evidenceRegistry) return;

        let rules = [];
        if (filter === 'scientific') rules = window.evidenceRegistry.getScientificRules();
        else if (filter === 'heuristic') rules = window.evidenceRegistry.getHeuristics();
        else if (filter === 'gamification') rules = window.evidenceRegistry.getGameRules();
        else rules = window.evidenceRegistry.getAllRules();

        const container = document.getElementById('evidence-rules-container');
        if (container) {
            container.innerHTML = rules.map(r => `
                <div class="evidence-rule-card ${r.confidence === 'GAME_ONLY' ? 'border-game-layer' : 'border-science-layer'}">
                    <div class="erc-header">
                        <div class="erc-id highlight-cyan font-13 font-mono">${r.ruleId} (v${r.version || '1.0'})</div>
                        <span class="erc-badge pill-${r.confidence.toLowerCase()}">${r.confidence}</span>
                    </div>
                    <div class="erc-app-level font-11 text-muted mt-2">${r.applicationLevel} | Category: ${r.category.toUpperCase()}</div>
                    <div class="erc-source mt-8 font-12">
                        <span class="text-muted">Clinical Source / Guideline:</span><br/>
                        <strong class="text-white">${r.source}</strong>
                    </div>
                    <div class="erc-guidance mt-8 font-13 text-gray">
                        <span class="highlight-green">Guidance:</span> ${r.guidance}
                    </div>
                    ${r.formula ? `<div class="erc-formula font-11 font-mono mt-8 p-5 bg-dark-pill">📐 ${r.formula}</div>` : ''}
                    <div class="erc-meta font-10 text-muted mt-8">
                        Population: ${r.population} | Last Reviewed: ${r.lastReviewed}
                    </div>
                </div>
            `).join('');
        }

        modal.classList.remove('hidden');
        if (window.systemAudio) window.systemAudio.playClick();
    }

    openAuditTrailModal() {
        const modal = document.getElementById('modal-audit-trail');
        if (!modal) return;

        // Render Program Versions
        const vContainer = document.getElementById('program-versions-list');
        if (vContainer && window.programVersioning) {
            const history = window.programVersioning.getClientHistory('hunter_main');
            if (history.plans && history.plans.length > 0) {
                vContainer.innerHTML = history.plans.map(p => `
                    <div class="version-card">
                        <div class="version-badge font-mono">PLAN v${p.version}</div>
                        <div class="version-details">
                            <strong class="font-13 text-white">${p.phase} — ${p.trainingSplit}</strong>
                            <div class="font-11 text-muted mt-2">Target: ${p.targetCalories} kcal | ${p.proteinTarget}g Protein</div>
                            <div class="font-12 text-cyan mt-4"><em>Reason: ${p.reason}</em></div>
                            <span class="font-10 text-muted">${new Date(p.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                `).join('');
            } else {
                vContainer.innerHTML = '<p class="text-muted font-12">No plan versions archived yet.</p>';
            }
        }

        // Render Audit Logs
        const lContainer = document.getElementById('audit-trail-logs-list');
        if (lContainer && window.auditTrail) {
            const logs = window.auditTrail.getAllLogs();
            if (logs.length > 0) {
                lContainer.innerHTML = logs.map(l => `
                    <div class="audit-log-row">
                        <div class="al-time font-mono font-10 text-muted">${new Date(l.timestamp).toLocaleDateString()} ${new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div class="al-event font-mono font-11 highlight-cyan">${l.event}</div>
                        <div class="al-reason font-12 text-white">Reason: ${l.reason}</div>
                        <div class="al-action font-12 text-green">Action: ${l.actionTaken}</div>
                        <div class="al-actor font-10 text-muted uppercase">Actor: ${l.actor}</div>
                    </div>
                `).join('');
            } else {
                lContainer.innerHTML = '<p class="text-muted font-12">No audit logs recorded yet.</p>';
            }
        }

        modal.classList.remove('hidden');
        if (window.systemAudio) window.systemAudio.playClick();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.app = new MasterApp();

    // Bind User Role Selector
    const roleSelect = document.getElementById('select-user-role');
    if (roleSelect && window.systemState) {
        roleSelect.value = window.systemState.getUserRole();
        roleSelect.addEventListener('change', (e) => {
            window.systemState.setUserRole(e.target.value);
        });
    }

    // Bind Visual Theme Mode Selector (Shadow, Aura, Battle)
    const themeSelect = document.getElementById('select-theme-mode');
    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            document.body.className = `system-theme ${e.target.value}`;
            localStorage.setItem('HUNTER_THEME_MODE', e.target.value);
            if (window.systemAudio) window.systemAudio.playClick();
        });
        const savedTheme = localStorage.getItem('HUNTER_THEME_MODE') || 'theme-shadow';
        document.body.className = `system-theme ${savedTheme}`;
        themeSelect.value = savedTheme;
    }

    // Global listener for cinematic moments (Domain Expansion, Replay Awakening, Boss Raids)
    document.addEventListener('click', (e) => {
        const btnReplayAwakening = e.target.closest('#btn-replay-awakening');
        if (btnReplayAwakening && window.cinematicEngine) {
            window.cinematicEngine.playAwakeningSplash();
        }

        const btnDomainExpansion = e.target.closest('.btn-trigger-domain-expansion');
        if (btnDomainExpansion && window.cinematicEngine) {
            window.cinematicEngine.skillUnlock({
                mentor: btnDomainExpansion.dataset.mentor || 'Gojo Satoru',
                skillName: btnDomainExpansion.dataset.skill || 'UNLIMITED VOID',
                desc: 'Domain Expansion engaged. 90-min deep cognitive flow initialized.'
            });
        }
    });

    // Bind Evidence Inspector Trigger
    const btnOpenEvidence = document.getElementById('btn-open-evidence-inspector');
    if (btnOpenEvidence && window.app) {
        btnOpenEvidence.addEventListener('click', () => {
            window.app.openEvidenceInspector('all');
        });
    }

    // Bind Evidence Filter Tabs
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-evidence-filter');
        if (btn && window.app) {
            document.querySelectorAll('.btn-evidence-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            window.app.openEvidenceInspector(btn.dataset.filter);
        }
    });

    // Bind Audit Trail Trigger
    const btnOpenAudit = document.getElementById('btn-open-audit-trail');
    if (btnOpenAudit && window.app) {
        btnOpenAudit.addEventListener('click', () => {
            window.app.openAuditTrailModal();
        });
    }

    // Bind On-Demand Gojo Six Eyes Awakening Cinematic Replay
    const btnTriggerAwakening = document.getElementById('btn-trigger-awakening');
    if (btnTriggerAwakening) {
        btnTriggerAwakening.addEventListener('click', () => {
            if (window.cinematicEngine) {
                window.cinematicEngine.playAwakeningSplash();
            }
        });
    }
});


