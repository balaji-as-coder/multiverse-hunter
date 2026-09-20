/**
 * MULTIVERSE HUNTER — COACH PLATFORM & CLIENT MANAGER
 * Allows toggling between Personal Hunter Mode ("My Hunter")
 * and Coaching / Multi-Client Mode ("Hunter Clients").
 * Enables coaches to create client assessments, view personalized plans,
 * track adherence rates, and manage progression arcs.
 */

class ClientManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Mode Switcher in Header (My Hunter vs Coach Clients)
        const btnModeToggle = document.getElementById('btn-toggle-app-mode');
        if (btnModeToggle) {
            btnModeToggle.addEventListener('click', () => {
                this.toggleMode();
            });
        }

        // Add Client Button
        const btnAddClient = document.getElementById('btn-open-add-client');
        if (btnAddClient) {
            btnAddClient.addEventListener('click', () => {
                document.getElementById('modal-add-client')?.classList.remove('hidden');
            });
        }

        const btnCloseAddClient = document.getElementById('btn-close-client-modal');
        if (btnCloseAddClient) {
            btnCloseAddClient.addEventListener('click', () => {
                document.getElementById('modal-add-client')?.classList.add('hidden');
            });
        }

        const formAddClient = document.getElementById('form-add-client');
        if (formAddClient) {
            formAddClient.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNewClient();
            });
        }

        // Event delegation for client actions
        document.addEventListener('click', (e) => {
            const btnViewClient = e.target.closest('.btn-view-client');
            if (btnViewClient) {
                const clientId = btnViewClient.dataset.clientId;
                this.viewClientDetails(clientId);
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

        this.updateModeIndicator();
        if (window.systemAudio) window.systemAudio.playClick();
        if (window.app) window.app.syncUI();
    }

    updateModeIndicator() {
        const btn = document.getElementById('btn-toggle-app-mode');
        const isCoach = window.systemState.currentMode === 'coach_clients';
        if (btn) {
            btn.innerHTML = isCoach ? '👥 <strong>COACH MODE</strong> (Switch to My Hunter)' : '👤 <strong>MY HUNTER</strong> (Switch to Coach Mode)';
            btn.classList.toggle('active-coach', isCoach);
        }
    }

    addNewClient() {
        const name = document.getElementById('client-name')?.value.trim();
        const age = parseInt(document.getElementById('client-age')?.value) || 28;
        const sex = document.getElementById('client-sex')?.value || 'male';
        const height = parseFloat(document.getElementById('client-height')?.value) || 175;
        const weight = parseFloat(document.getElementById('client-weight')?.value) || 80;
        const targetWeight = parseFloat(document.getElementById('client-target-weight')?.value) || 72;
        const diet = document.getElementById('client-diet')?.value || 'veg';
        const realm = document.getElementById('client-realm')?.value || 'home';
        const arch = document.getElementById('client-archetype')?.value || 'vtaper';
        const notes = document.getElementById('client-notes')?.value || 'New Hunter Onboarded';

        if (!name) return;

        // Calculate tailored calories
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
            waistCm: Math.round(weight * 1.05),
            dietType: diet,
            mealFrequency: 3,
            fitnessLevel: 'beginner',
            trainingRealms: [realm],
            homeEquipment: ['dumbbells', 'bodyweight'],
            physiqueArchetype: arch,
            caloriesTarget: calTarget,
            proteinTarget: protTarget,
            status: 'Active (Week 1)',
            healthIndex: 78,
            currentArc: 'Awakening Arc (Days 1–7)',
            adherenceRate: 92,
            notes
        };

        window.systemState.clients.push(newClient);
        window.systemState.saveClients();

        document.getElementById('modal-add-client')?.classList.add('hidden');
        document.getElementById('form-add-client')?.reset();

        if (window.systemAudio) window.systemAudio.playStatAdd();
        if (window.app) {
            window.app.showToast('CLIENT REGISTERED', `Onboarded new Hunter client: ${name}`);
            window.app.syncUI();
        }
    }

    viewClientDetails(clientId) {
        const client = window.systemState.clients.find(c => c.id === clientId);
        if (!client) return;

        const modal = document.getElementById('modal-client-details');
        if (!modal) return;

        const contentEl = document.getElementById('client-details-content');
        if (contentEl) {
            contentEl.innerHTML = `
                <div class="client-modal-card">
                    <div class="client-modal-header">
                        <h3>${client.name} <span class="client-badge">${client.status}</span></h3>
                        <p class="client-meta">${client.age} yrs | ${client.sex.toUpperCase()} | ${client.heightCm} cm | ${client.weightKg} kg (Target: ${client.targetWeightKg} kg)</p>
                    </div>

                    <div class="client-plan-grid">
                        <div class="cp-card">
                            <span class="cp-label">PRIMARY ARCHETYPE</span>
                            <span class="cp-val highlight-cyan">${client.physiqueArchetype.toUpperCase()}</span>
                        </div>
                        <div class="cp-card">
                            <span class="cp-label">CALORIE / PROTEIN</span>
                            <span class="cp-val highlight-green">${client.caloriesTarget} kcal / ${client.proteinTarget}g P</span>
                        </div>
                        <div class="cp-card">
                            <span class="cp-label">TRAINING REALM</span>
                            <span class="cp-val">${client.trainingRealms.join(' + ').toUpperCase()}</span>
                        </div>
                        <div class="cp-card">
                            <span class="cp-label">HEALTH INDEX</span>
                            <span class="cp-val highlight-purple">${client.healthIndex} / 100</span>
                        </div>
                    </div>

                    <div class="client-notes-box">
                        <strong>COACH DIRECTIVE & NOTES:</strong>
                        <p>${client.notes}</p>
                    </div>
                </div>
            `;
        }

        modal.classList.remove('hidden');
        if (window.systemAudio) window.systemAudio.playClick();
    }
}

// Global Client Manager instance
window.clientManager = new ClientManager();
