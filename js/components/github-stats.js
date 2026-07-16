// GitHub Stats Component - Using server proxy
class GitHubStats {
    constructor(username = 'iArthur04') {
        this.username = username;
        this.cache = new Map();
        this.cacheDuration = 5 * 60 * 1000; // 5 minutes
        console.log('📊 GitHubStats initialized for:', username);
    }

    async fetchUserData() {
        try {
            console.log('🔄 Fetching user data for:', this.username);
            
            const cacheKey = `user-${this.username}`;
            const cached = this.cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
                console.log('📦 Using cached user data');
                return cached.data;
            }

            // Use our server proxy instead of direct GitHub API
            const response = await fetch(`/api/github/user/${this.username}`);
            
            if (!response.ok) {
                console.error('❌ User fetch failed:', response.status);
                return null;
            }
            
            const data = await response.json();
            console.log('✅ User data received:', data.login);
            
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error('❌ GitHub API Error:', error);
            return null;
        }
    }

    async fetchRepos() {
        try {
            console.log('🔄 Fetching repos for:', this.username);
            
            const cacheKey = `repos-${this.username}`;
            const cached = this.cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
                console.log('📦 Using cached repo data');
                return cached.data;
            }

            // Use our server proxy
            const response = await fetch(`/api/github/repos/${this.username}`);
            
            if (!response.ok) {
                console.error('❌ Repos fetch failed:', response.status);
                return [];
            }
            
            const data = await response.json();
            console.log(`✅ ${data.length} repos received`);
            
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error('❌ GitHub Repos Error:', error);
            return [];
        }
    }

    render(containerId) {
        console.log('🎨 Rendering GitHub stats to:', containerId);
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('❌ Container not found:', containerId);
            return;
        }

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
                            <p style="font-size: 0.8rem; margin-top: 0.5rem;">
                                ${this.username} might not exist or GitHub API is rate-limited
                            </p>
                            <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">
                                Try Again
                            </button>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = `
                    <div class="github-stats">
                        <div class="stats-header">
                            <div class="user-info">
                                <img src="${userData.avatar_url}" alt="${userData.login}" class="avatar" 
                                     onerror="this.src='https://via.placeholder.com/60'">
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
                                <span class="stat-number">${userData.public_repos > 0 ? '⭐' : '0'}</span>
                                <span class="stat-label">Stars</span>
                            </div>
                        </div>

                        <div class="repos-section">
                            <h4>📁 Latest Projects</h4>
                            <div class="repos-grid">
                                ${repos.length > 0 ? repos.slice(0, 6).map(repo => `
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
                                `).join('') : `
                                    <div class="repo-card" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                                        <p>No public repositories yet 🚀</p>
                                        <p style="font-size: 0.85rem; color: var(--text-muted);">
                                            Start building and they'll appear here!
                                        </p>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                `;
                console.log('✅ GitHub stats rendered!');
            })
            .catch(error => {
                console.error('❌ GitHub render error:', error);
                container.innerHTML = `
                    <div class="github-error">
                        <p>⚠️ ${error.message}</p>
                        <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">
                            Try Again
                        </button>
                    </div>
                `;
            });
    }
}

export default GitHubStats;