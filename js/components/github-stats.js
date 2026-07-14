// GitHub Stats Component - Shows your real-time activity
class GitHubStats {
    constructor(username = 'iArthur04') {
        this.username = username;
        this.apiBase = 'https://api.github.com';
        this.cache = new Map();
        this.cacheDuration = 5 * 60 * 1000; // 5 minutes
    }

    async fetchUserData() {
        try {
            // Check cache first
            const cacheKey = `user-${this.username}`;
            const cached = this.cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
                return cached.data;
            }

            const response = await fetch(`${this.apiBase}/users/${this.username}`);
            if (!response.ok) throw new Error('User not found');
            
            const data = await response.json();
            
            // Cache the data
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error('GitHub API Error:', error);
            return null;
        }
    }

    async fetchRepos() {
        try {
            const cacheKey = `repos-${this.username}`;
            const cached = this.cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
                return cached.data;
            }

            const response = await fetch(`${this.apiBase}/users/${this.username}/repos?sort=updated&per_page=6`);
            if (!response.ok) throw new Error('Repos not found');
            
            const data = await response.json();
            
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error('GitHub Repos Error:', error);
            return [];
        }
    }

    async fetchContributions() {
        // Using GitHub's GraphQL API for contribution data
        const query = `
            query($username: String!) {
                user(login: $username) {
                    contributionsCollection {
                        contributionCalendar {
                            totalContributions
                            weeks {
                                contributionDays {
                                    date
                                    contributionCount
                                }
                            }
                        }
                    }
                }
            }
        `;

        try {
            const response = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GITHUB_TOKEN}`, // We'll add this later
                },
                body: JSON.stringify({ query, variables: { username: this.username } })
            });

            const data = await response.json();
            return data.data.user.contributionsCollection.contributionCalendar;
        } catch (error) {
            console.error('Contributions Error:', error);
            return null;
        }
    }

    renderStats(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="github-stats-loading">
                <div class="loader"></div>
                <p>Fetching GitHub stats...</p>
            </div>
        `;

        Promise.all([this.fetchUserData(), this.fetchRepos()])
            .then(([userData, repos]) => {
                if (!userData) {
                    container.innerHTML = `
                        <div class="github-error">
                            <p>⚠️ Could not fetch GitHub data</p>
                            <button onclick="location.reload()">Try Again</button>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = `
                    <div class="github-stats">
                        <div class="stats-header">
                            <div class="user-info">
                                <img src="${userData.avatar_url}" alt="${userData.login}" class="avatar">
                                <div>
                                    <h3>${userData.name || userData.login}</h3>
                                    <p class="bio">${userData.bio || 'Building the future with AI'}</p>
                                </div>
                            </div>
                            <a href="${userData.html_url}" target="_blank" class="github-link">
                                <i class="fab fa-github"></i> View Profile
                            </a>
                        </div>
                        
                        <div class="stats-grid">
                            <div class="stat-card">
                                <i class="fas fa-code"></i>
                                <span class="stat-number">${userData.public_repos}</span>
                                <span class="stat-label">Repositories</span>
                            </div>
                            <div class="stat-card">
                                <i class="fas fa-users"></i>
                                <span class="stat-number">${userData.followers}</span>
                                <span class="stat-label">Followers</span>
                            </div>
                            <div class="stat-card">
                                <i class="fas fa-user-plus"></i>
                                <span class="stat-number">${userData.following}</span>
                                <span class="stat-label">Following</span>
                            </div>
                            <div class="stat-card">
                                <i class="fas fa-star"></i>
                                <span class="stat-number">${userData.public_repos > 0 ? '🌟' : '0'}</span>
                                <span class="stat-label">Stars</span>
                            </div>
                        </div>

                        <div class="repos-section">
                            <h4>Latest Projects</h4>
                            <div class="repos-grid">
                                ${repos.slice(0, 6).map(repo => `
                                    <div class="repo-card">
                                        <a href="${repo.html_url}" target="_blank">
                                            <h5>${repo.name}</h5>
                                            <p>${repo.description || 'No description'}</p>
                                            <div class="repo-meta">
                                                ${repo.language ? `<span class="language-dot"></span> ${repo.language}` : ''}
                                                <span>⭐ ${repo.stargazers_count}</span>
                                                <span>🔄 ${repo.forks_count}</span>
                                            </div>
                                        </a>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            })
            .catch(error => {
                container.innerHTML = `
                    <div class="github-error">
                        <p>⚠️ ${error.message}</p>
                    </div>
                `;
            });
    }
}

// Export for use
export default GitHubStats;