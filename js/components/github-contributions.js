// GitHub Contribution Graph - Using server proxy
class GitHubContributions {
    constructor(username = 'iArthur04') {
        this.username = username;
        this.container = null;
        this.data = null;
        console.log('📊 GitHubContributions initialized for:', username);
    }

    async fetchContributions() {
        try {
            console.log('🔄 Fetching contributions for:', this.username);
            
            // Use our server proxy
            const response = await fetch(`/api/github/contributions/${this.username}`);
            
            if (!response.ok) {
                console.error('❌ Contributions fetch failed:', response.status);
                return this.generateMockData();
            }
            
            const data = await response.json();
            console.log('✅ Contributions received:', Object.keys(data).length, 'days');
            return data;
        } catch (error) {
            console.error('❌ Contribution fetch error:', error);
            return this.generateMockData();
        }
    }

    generateMockData() {
        console.log('📊 Generating mock contribution data');
        const data = {};
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 365);

        for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const dayOfWeek = d.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const baseCount = isWeekend ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 10);
            data[dateStr] = Math.random() > 0.3 ? baseCount : 0;
        }
        return data;
    }

    render(containerId) {
        console.log('🎨 Rendering contributions to:', containerId);
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('❌ Container not found:', containerId);
            return;
        }

        this.container.innerHTML = `
            <div class="contributions-container">
                <div class="contributions-header">
                    <div>
                        <h3>📊 Contribution Graph</h3>
                        <p class="contributions-subtitle">
                            ${new Date().getFullYear()} - Daily coding activity
                        </p>
                    </div>
                    <div class="contributions-legend">
                        <span>Less</span>
                        <div class="legend-colors">
                            <span class="legend-color" style="background: var(--bg-secondary)"></span>
                            <span class="legend-color" style="background: #9BE9A8"></span>
                            <span class="legend-color" style="background: #40C463"></span>
                            <span class="legend-color" style="background: #30A14E"></span>
                            <span class="legend-color" style="background: #216E39"></span>
                        </div>
                        <span>More</span>
                    </div>
                </div>
                <div id="contributionGrid" class="contribution-grid"></div>
                <div class="contributions-footer">
                    <span id="totalContributions">Loading...</span>
                </div>
            </div>
        `;

        this.loadContributions();
    }

    async loadContributions() {
        console.log('🔄 Loading contributions...');
        const data = await this.fetchContributions();
        this.renderGrid(data);
    }

    renderGrid(data) {
        console.log('🎨 Rendering contribution grid...');
        const grid = document.getElementById('contributionGrid');
        if (!grid) {
            console.error('❌ Grid element not found');
            return;
        }

        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 364);

        while (startDate.getDay() !== 0) {
            startDate.setDate(startDate.getDate() - 1);
        }

        const currentDate = new Date(startDate);
        let totalContributions = 0;
        let activeDays = 0;

        for (let week = 0; week < 53; week++) {
            const weekDiv = document.createElement('div');
            weekDiv.className = 'week-row';

            for (let day = 0; day < 7; day++) {
                const dateStr = currentDate.toISOString().split('T')[0];
                const count = data[dateStr] || 0;
                
                if (count > 0) {
                    totalContributions += count;
                    activeDays++;
                }

                const dayDiv = document.createElement('div');
                dayDiv.className = 'day-cell';
                dayDiv.dataset.count = count;
                dayDiv.dataset.date = dateStr;
                
                if (count === 0) {
                    dayDiv.style.background = 'var(--bg-secondary)';
                } else if (count < 3) {
                    dayDiv.style.background = '#9BE9A8';
                } else if (count < 6) {
                    dayDiv.style.background = '#40C463';
                } else if (count < 10) {
                    dayDiv.style.background = '#30A14E';
                } else {
                    dayDiv.style.background = '#216E39';
                }

                dayDiv.title = `${dateStr}: ${count} contributions`;
                dayDiv.addEventListener('click', () => {
                    this.showDayDetails(dateStr, count);
                });

                weekDiv.appendChild(dayDiv);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            grid.appendChild(weekDiv);
        }

        const footer = document.getElementById('totalContributions');
        if (footer) {
            footer.textContent = `⭐ ${totalContributions} contributions in ${activeDays} active days`;
            console.log(`📊 Total: ${totalContributions} contributions, ${activeDays} active days`);
        }
        
        console.log('✅ Contribution grid rendered!');
    }

    showDayDetails(date, count) {
        const tooltip = document.createElement('div');
        tooltip.className = 'day-tooltip';
        tooltip.innerHTML = `
            <strong>${date}</strong><br>
            ${count} contributions
        `;
        tooltip.style.cssText = `
            position: fixed;
            background: var(--bg-card);
            color: var(--text-primary);
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid var(--border-color);
            font-size: 0.85rem;
            box-shadow: 0 4px 20px var(--shadow-color);
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -100%);
            margin-top: -10px;
        `;

        const event = window.event;
        if (event) {
            tooltip.style.left = event.clientX + 'px';
            tooltip.style.top = event.clientY + 'px';
        }

        document.body.appendChild(tooltip);
        setTimeout(() => tooltip.remove(), 2000);
    }
}

export default GitHubContributions;