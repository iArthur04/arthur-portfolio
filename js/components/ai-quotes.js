// AI Quote Generator - Debug Version
class AIQuoteGenerator {
    constructor() {
        console.log('🔧 AIQuoteGenerator constructor called');
        this.quotes = [
            { text: "The best way to predict the future is to build it.", author: "Alan Kay" },
            { text: "Every expert was once a beginner.", author: "Unknown" },
            { text: "Code is poetry in motion.", author: "Arthur" },
            { text: "AI is the new electricity.", author: "Andrew Ng" },
            { text: "Your limitation—it's only your imagination.", author: "Unknown" },
            { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
            { text: "Great things never come from comfort zones.", author: "Unknown" },
            { text: "Dream big. Work hard. Stay focused.", author: "Unknown" },
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
            { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
            { text: "The future is already here — it's just not very evenly distributed.", author: "William Gibson" },
            { text: "Artificial intelligence is the new electricity.", author: "Andrew Ng" }
                ];
        console.log('📚 Quotes loaded:', this.quotes.length);
    }

    async generateQuote() {
        console.log('🔄 Generating quote...');
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        const quote = this.quotes[randomIndex];
        console.log('✅ Quote generated:', quote);
        return quote;
    }

    async generateAIQuote(topic = 'AI and innovation') {
        console.log('🤖 Generating AI quote with topic:', topic);
        return this.generateQuote();
    }

    getFallbackQuote() {
        return this.quotes[Math.floor(Math.random() * this.quotes.length)];
    }

    render(containerId) {
        console.log('🎨 Rendering AI Quote to:', containerId);
        const container = document.getElementById(containerId);
        console.log('📦 Container found?', container);
        
        if (!container) {
            console.error('❌ Container not found! ID:', containerId);
            return;
        }

        container.innerHTML = `
            <div class="ai-quote-container">
                <div class="quote-display">
                    <div class="quote-icon">
                        <i class="fas fa-quote-left"></i>
                    </div>
                    <p class="quote-text" id="quoteText">
                        Loading wisdom...
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

        console.log('✅ HTML rendered');

        // Load initial quote
        this.updateQuote();

        // Setup event listeners
        const newBtn = document.getElementById('newQuoteBtn');
        const shareBtn = document.getElementById('shareQuoteBtn');
        
        console.log('🔘 New Quote button:', newBtn);
        console.log('🔘 Share button:', shareBtn);

        if (newBtn) {
            newBtn.addEventListener('click', () => {
                console.log('🔄 New quote button clicked');
                this.updateQuote();
            });
        } else {
            console.error('❌ New Quote button not found!');
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                console.log('📤 Share button clicked');
                this.shareQuote();
            });
        } else {
            console.error('❌ Share button not found!');
        }
    }

    async updateQuote() {
        console.log('🔄 Updating quote...');
        const quoteText = document.getElementById('quoteText');
        const quoteAuthor = document.getElementById('quoteAuthor');
        
        console.log('📝 Quote text element:', quoteText);
        console.log('📝 Quote author element:', quoteAuthor);
        
        if (!quoteText || !quoteAuthor) {
            console.error('❌ Quote elements not found!');
            return;
        }

        quoteText.textContent = '🤔 Generating AI insights...';
        quoteAuthor.textContent = '';

        try {
            const quote = await this.generateQuote();
            console.log('📖 Got quote:', quote);
            
            // Animate the quote change
            quoteText.style.opacity = '0';
            setTimeout(() => {
                quoteText.textContent = quote.text;
                quoteAuthor.textContent = `— ${quote.author}`;
                quoteText.style.opacity = '1';
                console.log('✅ Quote displayed!');
            }, 300);
        } catch (error) {
            console.error('❌ Error in updateQuote:', error);
            const fallback = this.getFallbackQuote();
            quoteText.textContent = fallback.text;
            quoteAuthor.textContent = `— ${fallback.author}`;
        }
    }

    shareQuote() {
        console.log('📤 Sharing quote...');
        const quoteText = document.getElementById('quoteText');
        const quoteAuthor = document.getElementById('quoteAuthor');
        
        if (!quoteText || !quoteAuthor) return;

        const shareText = `"${quoteText.textContent}" — ${quoteAuthor.textContent}`;
        console.log('📝 Share text:', shareText);
        
        if (navigator.share) {
            navigator.share({
                title: 'AI Generated Wisdom',
                text: shareText,
                url: window.location.href
            }).catch(() => {});
        } else {
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