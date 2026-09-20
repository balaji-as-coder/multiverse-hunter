/**
 * Hunter Commissary, Inventory & Real-Life Reward Store Engine
 * Manages item consumption, mystery box unboxing, and buying real-world treats with earned gold.
 */
class ShopEngine {
    constructor() {
        this.selectedSlotIndex = null;
        this.currentShopCategory = 'system-items';
        this.pendingLootItem = null;

        this.systemCatalog = [
            {
                id: 'shop_pot_hp',
                name: 'Superior Healing Elixir',
                type: 'consumable',
                icon: '🧪',
                cost: 150,
                desc: 'Instantly restores 100 HP.'
            },
            {
                id: 'shop_pot_fatigue',
                name: 'Stamina Restoration Tonic',
                type: 'consumable',
                icon: '⚡',
                cost: 200,
                desc: 'Instantly reduces Fatigue by 50%.'
            },
            {
                id: 'shop_box_blessed',
                name: 'Blessed Random Box',
                type: 'box',
                icon: '🎁',
                cost: 350,
                desc: 'Contains rare elixir or surprise rewards.'
            },
            {
                id: 'shop_dungeon_key',
                name: 'Dimensional Gate Key',
                type: 'key',
                icon: '🗝',
                cost: 100,
                desc: 'Unlocks Instant Dungeon Raid access.'
            }
        ];

        this.initEventListeners();
    }

    initEventListeners() {
        // Buy Real-Life Reward from shop
        document.addEventListener('click', (e) => {
            const btnBuy = e.target.closest('.btn-buy-reward');
            if (btnBuy) {
                const cost = parseInt(btnBuy.dataset.cost) || 400;
                const s = window.systemState.data;
                if (s.player.gold < cost) {
                    if (window.app) window.app.showToast('INSUFFICIENT GOLD', `You need ${cost} Gold earned from quests! (Current: ${s.player.gold})`);
                    if (window.systemAudio) window.systemAudio.playPenaltyAlert();
                    return;
                }
                s.player.gold -= cost;
                window.systemState.save();
                if (window.systemAudio) window.systemAudio.playLevelUp();
                if (window.app) {
                    window.app.showToast('REWARD UNLOCKED 🎁', `Purchased reward for ${cost} Gold! Enjoy your real-world treat.`);
                    window.app.syncUI();
                }
            }
        });

        // Shop category switch
        document.querySelectorAll('.shop-pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                document.querySelectorAll('.shop-pill').forEach(p => p.classList.remove('active'));
                e.target.classList.add('active');
                this.currentShopCategory = e.target.dataset.shopCat;
                this.renderShop();
            });
        });

        // Create Real-Life Reward Modal
        const btnOpenCreate = document.getElementById('btn-create-reward-modal');
        const modalCreate = document.getElementById('modal-create-reward');
        const btnClose = document.getElementById('btn-close-reward-modal');
        const btnCancel = document.getElementById('btn-cancel-reward');
        const formCreate = document.getElementById('form-create-reward');

        if (btnOpenCreate) {
            btnOpenCreate.addEventListener('click', () => {
                modalCreate.classList.remove('hidden');
                window.systemAudio.playClick();
            });
        }

        [btnClose, btnCancel].forEach(b => {
            if (b) b.addEventListener('click', () => modalCreate.classList.add('hidden'));
        });

        if (formCreate) {
            formCreate.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createRealLifeReward();
                modalCreate.classList.add('hidden');
                formCreate.reset();
            });
        }

        // Lootbox open events
        const btnOpenLoot = document.getElementById('btn-open-lootbox');
        const btnCollectLoot = document.getElementById('btn-collect-loot');
        const boxVisual = document.getElementById('mystery-box-visual');

        if (btnOpenLoot) {
            btnOpenLoot.addEventListener('click', () => this.unboxMysteryBox());
        }
        if (boxVisual) {
            boxVisual.addEventListener('click', () => this.unboxMysteryBox());
        }
        if (btnCollectLoot) {
            btnCollectLoot.addEventListener('click', () => this.collectLoot());
        }
    }

    renderInventory() {
        const container = document.getElementById('inventory-slots-grid');
        const slotsUsedEl = document.getElementById('inv-slots-used');
        if (!container) return;

        const totalSlots = 30;
        const items = window.systemState.data.inventory;
        if (slotsUsedEl) slotsUsedEl.innerText = items.length;

        let html = '';
        for (let i = 0; i < totalSlots; i++) {
            const item = items[i];
            const isSelected = this.selectedSlotIndex === i;
            if (item) {
                html += `
                    <div class="inv-slot ${isSelected ? 'selected' : ''}" onclick="window.shopEngine.selectSlot(${i})">
                        <span>${item.icon}</span>
                        ${item.qty > 1 ? `<span class="slot-qty">x${item.qty}</span>` : ''}
                    </div>
                `;
            } else {
                html += `<div class="inv-slot empty" onclick="window.shopEngine.selectSlot(${i})"></div>`;
            }
        }
        container.innerHTML = html;
        this.renderInspectCard();
    }

    selectSlot(index) {
        this.selectedSlotIndex = index;
        window.systemAudio.playClick();
        this.renderInventory();
    }

    renderInspectCard() {
        const inspectCard = document.getElementById('inv-item-inspect');
        if (!inspectCard) return;

        if (this.selectedSlotIndex === null || !window.systemState.data.inventory[this.selectedSlotIndex]) {
            inspectCard.innerHTML = `
                <div class="inspect-placeholder">
                    <span class="icon-empty">⬡</span>
                    <p>Select an item in your inventory to inspect or use it.</p>
                </div>
            `;
            return;
        }

        const item = window.systemState.data.inventory[this.selectedSlotIndex];
        inspectCard.innerHTML = `
            <div style="text-align: center; margin-bottom: 12px;">
                <div style="font-size: 48px; margin-bottom: 6px;">${item.icon}</div>
                <h3 style="font-family: var(--font-heading); color: #fff; font-size: 16px;">${item.name}</h3>
                <div style="font-size: 11px; color: var(--cyan-glow); font-family: var(--font-system);">Type: ${item.type.toUpperCase()} | Qty: ${item.qty}</div>
            </div>
            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px; text-align: center;">${item.desc}</p>
            <button class="btn-primary-holo btn-wide" onclick="window.shopEngine.useSelectedItem()">
                ${item.type === 'box' ? 'OPEN MYSTERY BOX' : 'USE ITEM'}
            </button>
        `;
    }

    useSelectedItem() {
        if (this.selectedSlotIndex === null) return;
        const item = window.systemState.data.inventory[this.selectedSlotIndex];
        if (!item) return;

        if (item.type === 'box') {
            this.triggerLootBoxModal(item);
            return;
        }

        if (item.id.includes('hp')) {
            window.systemState.data.player.hpCurrent = Math.min(window.systemState.getMaxHp(), window.systemState.data.player.hpCurrent + 50);
            window.app.showToast('ITEM CONSUMED', '+50 HP Restored!');
        } else if (item.id.includes('fatigue')) {
            window.systemState.data.player.fatigue = Math.max(0, window.systemState.data.player.fatigue - 50);
            window.app.showToast('ITEM CONSUMED', 'Fatigue reduced by 50%!');
        } else {
            window.app.showToast('ITEM USED', `${item.name} activated.`);
        }

        item.qty -= 1;
        if (item.qty <= 0) {
            window.systemState.data.inventory.splice(this.selectedSlotIndex, 1);
            this.selectedSlotIndex = null;
        }

        window.systemAudio.playStatAdd();
        window.systemState.save();
        this.renderInventory();
    }

    triggerLootBoxModal(boxItem) {
        this.pendingLootItem = boxItem;
        const modal = document.getElementById('modal-lootbox');
        document.getElementById('loot-reward-reveal').classList.add('hidden');
        document.getElementById('btn-open-lootbox').classList.remove('hidden');
        document.getElementById('btn-collect-loot').classList.add('hidden');
        document.getElementById('loot-box-status').innerText = 'Tap the box to break the seal and extract contents...';
        modal.classList.remove('hidden');
        window.systemAudio.playNotification();
    }

    unboxMysteryBox() {
        const potentialDrops = [
            { name: 'Superior Healing Elixir', icon: '🧪', desc: 'Restores 100% HP.', type: 'consumable' },
            { name: 'Pure Mana Crystal Bundle', icon: '💎', desc: '+25 Mana Crystals.', action: () => { window.systemState.data.player.crystals += 25; } },
            { name: 'Hunter Gold Cache', icon: '🪙', desc: '+500 Gold added to pouch.', action: () => { window.systemState.data.player.gold += 500; } },
            { name: 'Dimensional Gate Key', icon: '🗝', desc: 'Rare instant dungeon key.', type: 'key' }
        ];

        const drop = potentialDrops[Math.floor(Math.random() * potentialDrops.length)];
        this.pendingReward = drop;

        document.getElementById('revealed-item-icon').innerText = drop.icon;
        document.getElementById('revealed-item-name').innerText = drop.name;
        document.getElementById('revealed-item-desc').innerText = drop.desc;
        document.getElementById('loot-reward-reveal').classList.remove('hidden');
        document.getElementById('btn-open-lootbox').classList.add('hidden');
        document.getElementById('btn-collect-loot').classList.remove('hidden');
        document.getElementById('loot-box-status').innerText = 'SEAL BROKEN! Item extracted successfully.';

        window.systemAudio.playLevelUp();
        window.particleEngine.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 45, '#00e5ff');
    }

    collectLoot() {
        if (this.pendingLootItem) {
            this.pendingLootItem.qty -= 1;
            if (this.pendingLootItem.qty <= 0) {
                window.systemState.data.inventory = window.systemState.data.inventory.filter(i => i !== this.pendingLootItem);
            }
        }

        if (this.pendingReward) {
            if (this.pendingReward.action) {
                this.pendingReward.action();
            } else {
                window.systemState.data.inventory.push({
                    id: 'drop_' + Date.now(),
                    name: this.pendingReward.name,
                    type: this.pendingReward.type,
                    icon: this.pendingReward.icon,
                    qty: 1,
                    desc: this.pendingReward.desc
                });
            }
            window.systemState.logEvent(`Extracted from Blessed Box: ${this.pendingReward.name}`);
            window.systemState.save();
        }

        document.getElementById('modal-lootbox').classList.add('hidden');
        this.selectedSlotIndex = null;
        this.renderInventory();
    }

    renderShop() {
        const container = document.getElementById('shop-catalog-grid');
        if (!container) return;

        if (this.currentShopCategory === 'system-items') {
            container.innerHTML = this.systemCatalog.map(item => `
                <div class="shop-card">
                    <div class="shop-card-top">
                        <span class="shop-item-icon">${item.icon}</span>
                        <div>
                            <div class="shop-item-name">${item.name}</div>
                            <div class="shop-item-desc">${item.desc}</div>
                        </div>
                    </div>
                    <div class="shop-card-bottom">
                        <span class="shop-price">🪙 ${item.cost} Gold</span>
                        <button class="btn-primary-holo btn-sm" onclick="window.shopEngine.buySystemItem('${item.id}')">BUY</button>
                    </div>
                </div>
            `).join('');
        } else {
            const rewards = window.systemState.data.realRewards;
            if (rewards.length === 0) {
                container.innerHTML = `<div class="inspect-placeholder" style="grid-column: 1/-1; padding: 30px;"><p>No custom real-life rewards yet. Click "+ CREATE REAL-LIFE REWARD" above to add guilt-free perks!</p></div>`;
                return;
            }

            container.innerHTML = rewards.map(r => `
                <div class="shop-card">
                    <div class="shop-card-top">
                        <span class="shop-item-icon">${r.icon || '🎁'}</span>
                        <div>
                            <div class="shop-item-name">${r.title}</div>
                            <div class="shop-item-desc">${r.desc || 'Enjoy your real-world reward.'}</div>
                        </div>
                    </div>
                    <div class="shop-card-bottom">
                        <span class="shop-price">🪙 ${r.cost} Gold</span>
                        <button class="btn-primary-holo btn-sm" onclick="window.shopEngine.redeemRealReward('${r.id}')">REDEEM PERK</button>
                    </div>
                </div>
            `).join('');
        }
    }

    buySystemItem(itemId) {
        const item = this.systemCatalog.find(i => i.id === itemId);
        if (!item) return;

        if (window.systemState.data.player.gold < item.cost) {
            window.app.showToast('INSUFFICIENT GOLD', 'Complete more quests or gate raids to earn gold.');
            return;
        }

        window.systemState.data.player.gold -= item.cost;
        
        // Add to inventory
        const existing = window.systemState.data.inventory.find(i => i.id === item.id);
        if (existing) {
            existing.qty += 1;
        } else {
            window.systemState.data.inventory.push({
                id: item.id,
                name: item.name,
                type: item.type,
                icon: item.icon,
                qty: 1,
                desc: item.desc
            });
        }

        window.systemState.logEvent(`Purchased ${item.name} for ${item.cost} Gold`);
        window.systemState.save();
        window.systemAudio.playStatAdd();
        window.app.showToast('PURCHASE SUCCESSFUL', `${item.name} added to inventory.`);
        this.renderInventory();
    }

    createRealLifeReward() {
        const title = document.getElementById('reward-input-title').value.trim();
        const cost = parseInt(document.getElementById('reward-input-cost').value);
        const icon = document.getElementById('reward-input-icon').value.trim() || '🎁';
        const desc = document.getElementById('reward-input-desc').value.trim();

        window.systemState.data.realRewards.unshift({
            id: 'rw_' + Date.now(),
            title,
            cost,
            icon,
            desc
        });

        window.systemState.save();
        window.systemAudio.playNotification();
        window.app.showToast('REWARD ADDED', `"${title}" is now available in your store.`);
        this.renderShop();
    }

    redeemRealReward(rewardId) {
        const reward = window.systemState.data.realRewards.find(r => r.id === rewardId);
        if (!reward) return;

        if (window.systemState.data.player.gold < reward.cost) {
            window.app.showToast('INSUFFICIENT GOLD', `You need ${reward.cost} gold to redeem "${reward.title}".`);
            return;
        }

        window.systemState.data.player.gold -= reward.cost;
        window.systemState.logEvent(`Redeemed Real-Life Reward: ${reward.title}`);
        window.systemState.save();

        window.systemAudio.playLevelUp();
        window.particleEngine.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 40, '#fbbf24');
        window.app.showToast('REWARD REDEEMED!', `Enjoy your well-earned "${reward.title}" in the real world!`);
    }
}

window.shopEngine = new ShopEngine();
