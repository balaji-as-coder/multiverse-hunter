/**
 * MULTIVERSE HUNTER — COACHING PLATFORM CLIENT MANAGER MODULE
 */
class ClientManagerModule {
    constructor() {
        this.init();
    }

    init() {
        const btnToggle = document.getElementById('btn-toggle-app-mode');
        if (btnToggle) {
            btnToggle.addEventListener('click', () => this.toggleMode());
        }

        const btnAdd = document.getElementById('btn-open-add-client');
        if (btnAdd) {
            btnAdd.addEventListener('click', () => {
                document.getElementById('modal-add-client')?.classList.remove('hidden');
            });
        }

        const formAdd = document.getElementById('form-add-client');
        if (formAdd) {
            formAdd.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNewClient();
            });
        }

        document.addEventListener('click', (e) => {
            const btnView = e.target.closest('.btn-view-client');
            if (btnView) {
                const cId = btnView.dataset.clientId;
                this.viewClient(cId);
            }
        });
    }

    toggleMode() {
        const s = window.systemState;
        if (s.currentMode === 'my_hunter') {
            s.currentMode = 'coach_clients';
            if (window.app) window.app.switchTab('clients-tab');
        } else {
            s.currentMode = 'my_hunter';
            if (window.app) window.app.switchTab('status-tab');
        }

        const btn = document.getElementById('btn-toggle-app-mode');
        const isCoach = s.currentMode === 'coach_clients';
        if (btn) {
            btn.innerHTML = isCoach ? '👥 <strong>COACH MODE</strong> (Switch to My Hunter)' : '👤 <strong>MY HUNTER</strong> (Switch to Coach Mode)';
            btn.classList.toggle('active-coach', isCoach);
        }

        if (window.systemAudio) window.systemAudio.playClick();
        if (window.app) window.app.syncUI();
    }

    addNewClient() {
        const name = document.getElementById('client-name')?.value.trim();
        const age = parseInt(document.getElementById('client-age')?.value) || 28;
        const sex = document.getElementById('client-sex')?.value || 'male';
        const height = parseFloat(document.getElementById('client-height')?.value) || 175;
        const weight = parseFloat(document.getElementById('client-weight')?.value) || 80;
        const targetWeight = parseFloat(document.getElementById('client-target-weight')?.value) || 72;

        if (!name) return;

        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        bmr = (sex === 'female') ? (bmr - 161) : (bmr + 5);
        const tdee = Math.round(bmr * 1.45);
        const calTarget = Math.round(tdee - 300);
        const protTarget = Math.round(weight * 1.8);

        const newClient = {
            id: 'client_' + Date.now(),
            name,
            age,
            sex,
            heightCm: height,
            weightKg: weight,
            targetWeightKg: targetWeight,
            dietType: 'veg',
            activePhase: 'FOUNDATION',
            physiqueArchetype: 'vtaper',
            targetCalories: calTarget,
            proteinTarget: protTarget,
            adherenceRate: 92
        };

        window.systemState.clients.push(newClient);
        window.systemState.saveClients();

        document.getElementById('modal-add-client')?.classList.add('hidden');
        document.getElementById('form-add-client')?.reset();

        if (window.systemAudio) window.systemAudio.playStatAdd();
        if (window.app) {
            window.app.showToast('CLIENT REGISTERED', `Onboarded client: ${name}`);
            window.app.syncUI();
        }
    }

    viewClient(clientId) {
        const client = window.systemState.clients.find(c => c.id === clientId);
        if (!client) return;

        const modal = document.getElementById('modal-client-details');
        if (!modal) return;

        const contentEl = document.getElementById('client-details-content');
        if (contentEl) {
            contentEl.innerHTML = `
                <div class="client-modal-card">
                    <div class="client-modal-header">
                        <h3>${client.name} <span class="client-badge">Active</span></h3>
                        <p class="client-meta">${client.age} yrs | ${client.sex.toUpperCase()} | ${client.heightCm} cm | ${client.weightKg} kg (Target: ${client.targetWeightKg} kg)</p>
                    </div>
                    <div class="client-plan-grid mt-15">
                        <div class="cp-card"><span class="cp-label">ACTIVE PHASE</span><span class="cp-val highlight-cyan">${client.activePhase}</span></div>
                        <div class="cp-card"><span class="cp-label">CALORIE / PROTEIN</span><span class="cp-val highlight-green">${client.targetCalories} kcal / ${client.proteinTarget}g P</span></div>
                        <div class="cp-card"><span class="cp-label">ADHERENCE RATE</span><strong class="highlight-purple">${client.adherenceRate}%</strong></div>
                    </div>
                </div>
            `;
        }

        modal.classList.remove('hidden');
        if (window.systemAudio) window.systemAudio.playClick();
    }
}

window.clientManager = new ClientManagerModule();
