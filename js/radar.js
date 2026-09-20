/**
 * MULTIVERSE HUNTER — 8-ATTRIBUTE SYSTEM STAT SPIDER / RADAR CHART
 * Renders dynamic SVG polygon for STR, AGI, VIT, INT, FOCUS, WILL, ENERGY, BIZ.
 */

class RadarChart {
    constructor() {
        this.statusContainer = document.getElementById('status-radar-container');
        this.analyticsContainer = document.getElementById('analytics-radar-container');
        this.statsKeys = ['str', 'agi', 'vit', 'int', 'focus', 'will', 'energy', 'biz'];
        this.labels = ['STR', 'AGI', 'VIT', 'INT', 'FOCUS', 'WILL', 'ENERGY', 'BIZ'];
    }

    render(stats) {
        if (!this.statusContainer) this.statusContainer = document.getElementById('status-radar-container');
        if (!this.analyticsContainer) this.analyticsContainer = document.getElementById('analytics-radar-container');

        const svgHTML = this.generateSVG(stats, 260, 240);
        if (this.statusContainer) this.statusContainer.innerHTML = svgHTML;
        if (this.analyticsContainer) this.analyticsContainer.innerHTML = svgHTML;
    }

    generateSVG(stats, width = 260, height = 240) {
        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.min(cx, cy) - 34;
        const totalSides = this.statsKeys.length;
        const angleStep = (Math.PI * 2) / totalSides;
        const startAngle = -Math.PI / 2;

        const maxVal = Math.max(20, ...Object.values(stats || {})) * 1.15;

        // Background Web Circles / Polygons
        let webPolygons = '';
        for (let level = 1; level <= 4; level++) {
            const r = (radius / 4) * level;
            let points = [];
            for (let i = 0; i < totalSides; i++) {
                const angle = startAngle + (i * angleStep);
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);
                points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
            }
            webPolygons += `<polygon points="${points.join(' ')}" class="radar-grid-polygon" stroke="rgba(0,229,255,0.2)" fill="none" stroke-width="1" />`;
        }

        // Axis lines & Labels
        let axisLines = '';
        let labelElements = '';
        for (let i = 0; i < totalSides; i++) {
            const angle = startAngle + (i * angleStep);
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            axisLines += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(0,229,255,0.25)" stroke-dasharray="2,2" />`;

            const labelDist = radius + 20;
            const lx = cx + labelDist * Math.cos(angle);
            const ly = cy + labelDist * Math.sin(angle) + 4;
            const key = this.statsKeys[i];
            const val = stats ? (stats[key] || 10) : 10;

            labelElements += `
                <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" fill="#00e5ff" font-size="9" font-family="'Orbitron', sans-serif" text-anchor="middle">${this.labels[i]}</text>
                <text x="${lx.toFixed(1)}" y="${(ly + 9).toFixed(1)}" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">${val}</text>
            `;
        }

        // Player Stats Polygon & Nodes
        let statPoints = [];
        let statNodes = '';
        for (let i = 0; i < totalSides; i++) {
            const key = this.statsKeys[i];
            const val = stats ? (stats[key] || 10) : 10;
            const normalized = Math.min(1, Math.max(0.18, val / maxVal));
            const r = radius * normalized;
            const angle = startAngle + (i * angleStep);
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);

            statPoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
            statNodes += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="#00e5ff" stroke="#ffffff" stroke-width="1.5" />`;
        }

        return `
            <svg class="radar-svg" viewBox="0 0 ${width} ${height}" style="width: 100%; max-width: ${width}px; height: auto;">
                ${webPolygons}
                ${axisLines}
                <polygon points="${statPoints.join(' ')}" fill="rgba(0, 229, 255, 0.25)" stroke="#00e5ff" stroke-width="2" />
                ${statNodes}
                ${labelElements}
            </svg>
        `;
    }
}

window.radarChart = new RadarChart();
