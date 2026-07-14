// AI Quote Generator - Uses OpenAI to generate motivational quotes
class AIQuoteGenerator {
    constructor() {
        this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
        this.cache = new Map();
        this.cacheDuration = 10 * 60 * 1000; // 10 minutes
        this.quotes = [
            "The best way to predict the future is to build it.",
            "Every expert was once a beginner.",
            "Code is poetry in motion.",
            "AI is the new electricity.",
            "Your limitation—it's only your imagination.",
            "Push yourself, because no one else is going to do it for you.",
            "Great things never come from comfort zones.",
            "Dream big. Work hard. Stay focused."
        ];
    }

    // Fallback quotes if API fails
    getFallbackQuote() {
        return this.quotes[Math.floor(Math.random() * this.quotes.length)];
    }

    async generateQuote(topic = 'coding and AI') {
        try {
            // Check cache first
            const cacheKey = `quote-${topic}`;
            const cached = this.cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
                return cached.data;
            }

            // For now, since we're just starting, use a free API
            // Later we'll upgrade to OpenAI
            const response = await fetch('https://api.quotable.io/random');
            if (!response.ok) throw new Error('Quote API failed');
            
            const data = await response.json();
            
            const quote = {
                text: data.content,
                author: data.author,
                source: 'quotable.io'
            };

            // Cache the quote
            this.cache.set(cacheKey, {
                data: quote,
                timestamp: Date.now()
            });

            return quote;
        } catch (error) {
            console.error('Quote Error:', error);
            return {
                text: this.getFallbackQuote(),
                author: 'AI Arthur',
                source: 'fallback'
            };
        }
    }

    async generateAIQuote(topic = 'AI and innovation') {
        // This will use OpenAI when you get your API key
        // For now, we'll use a template system
        const templates = [
            `In the journey of ${topic}, every line of code writes your future.`,
            `The ${topic} revolution is not coming - it's already here, and you're part of it.`,
            `Building ${topic} is like sculpting the future, one algorithm at a time.`,
            `${topic} is the canvas, and your code is the masterpiece.`
        ];
        
        return {
            text: templates[Math.floor(Math.random() * templates.length)],
            author: 'AI Arthur',
            source: 'inspired'
        };
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="ai-quote-container">
                <div class="quote-display">
                    <div class="quote-icon">
                        <i class="fas fa-quote-left"></i>
                    </div>
                    <p class="quote-text" id="quoteText">
                        Loading wisdom from the AI universe...
                    </p>
                    <p class="quote-author" id="quoteAuthor"></p>
                </div>
                <div class="quote-controls">
                    <button id="newQuoteBtn" class="btn btn-primary">
                        <i class="fas fa-sync-alt"></i> New Insight
                    </button>
                    <button id="shareQuoteBtn" class="btn btn-secondary">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                </div>
                <div class="quote-tags">
                    <span class="tag">#AI</span>
                    <span class="tag">#Coding</span>
                    <span class="tag">#Innovation</span>
                </div>
            </div>
        `;

        // Load initial quote
        this.updateQuote();

        // Setup event listeners
        document.getElementById('newQuoteBtn').addEventListener('click', () => {
            this.updateQuote();
        });

        document.getElementById('shareQuoteBtn').addEventListener('click', () => {
            this.shareQuote();
        });
    }

    async updateQuote() {
        const quoteText = document.getElementById('quoteText');
        const quoteAuthor = document.getElementById('quoteAuthor');
        
        if (!quoteText || !quoteAuthor) return;

        quoteText.textContent = '🤔 Generating AI insights...';
        quoteAuthor.textContent = '';

        try {
            const quote = await this.generateAIQuote();
            
            // Animate the quote change
            quoteText.style.opacity = '0';
            setTimeout(() => {
                quoteText.textContent = quote.text;
                quoteAuthor.textContent = `— ${quote.author}`;
                quoteText.style.opacity = '1';
            }, 300);
        } catch (error) {
            quoteText.textContent = this.getFallbackQuote();
            quoteAuthor.textContent = '— AI Arthur';
        }
    }

    shareQuote() {
        const quoteText = document.getElementById('quoteText');
        const quoteAuthor = document.getElementById('quoteAuthor');
        
        if (!quoteText || !quoteAuthor) return;

        const shareText = `"${quoteText.textContent}" — ${quoteAuthor.textContent}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'AI Generated Wisdom',
                text: shareText,
                url: window.location.href
            }).catch(() => {});
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                const btn = document.getElementById('shareQuoteBtn');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);
            });
        }
    }
}

export default AIQuoteGenerator;