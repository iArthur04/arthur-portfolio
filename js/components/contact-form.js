// Smart Contact Form with AI-powered suggestions
class SmartContactForm {
    constructor() {
        this.formData = {
            name: '',
            email: '',
            message: '',
            subject: ''
        };
        this.aiSuggestions = {
            subjects: [
                'AI Collaboration',
                'Project Inquiry',
                'Speaking Opportunity',
                'Partnership',
                'Mentorship',
                'Investment'
            ],
            messages: [
                "I'm impressed by your AI journey and would love to collaborate!",
                "I have a project idea that could use your AI expertise.",
                "Would you be interested in speaking at our tech event?",
                "I'd love to discuss potential partnership opportunities.",
                "I'm looking for a mentor in AI development - would you be open to that?"
            ]
        };
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="contact-form-container">
                <form id="smartContactForm" class="contact-form">
                    <div class="form-group">
                        <label for="contactName">Your Name</label>
                        <input type="text" id="contactName" 
                               placeholder="John Doe" required>
                        <div class="form-hint">💡 This helps me know who I'm talking to</div>
                    </div>

                    <div class="form-group">
                        <label for="contactEmail">Email Address</label>
                        <input type="email" id="contactEmail" 
                               placeholder="john@example.com" required>
                        <div class="form-hint">📧 I'll reply within 24 hours</div>
                    </div>

                    <div class="form-group">
                        <label for="contactSubject">Subject</label>
                        <div class="subject-selector">
                            <input type="text" id="contactSubject" 
                                   placeholder="What's this about?" required>
                            <div class="suggestion-chips">
                                ${this.aiSuggestions.subjects.map(s => `
                                    <span class="chip" data-subject="${s}">${s}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="contactMessage">Your Message</label>
                        <textarea id="contactMessage" 
                                  placeholder="Write your message here..."
                                  rows="5" required></textarea>
                        <div class="message-ai-hint">
                            <span class="ai-badge">🤖 AI Suggestion</span>
                            <button type="button" id="aiSuggestionBtn" class="btn-sm">
                                Get AI Suggestion
                            </button>
                        </div>
                        <div id="aiSuggestionBox" class="ai-suggestion-box hidden">
                            <p class="suggestion-text"></p>
                            <button type="button" id="useSuggestionBtn" class="btn-sm">
                                Use This
                            </button>
                        </div>
                    </div>

                    <div class="form-footer">
                        <div class="form-status">
                            <span id="formStatus"></span>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i> Send Message
                        </button>
                    </div>
                </form>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById('smartContactForm');
        const subjectInput = document.getElementById('contactSubject');
        const messageTextarea = document.getElementById('contactMessage');
        const aiSuggestionBtn = document.getElementById('aiSuggestionBtn');
        const useSuggestionBtn = document.getElementById('useSuggestionBtn');
        const suggestionBox = document.getElementById('aiSuggestionBox');

        // Subject chips
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                subjectInput.value = chip.dataset.subject;
                // Highlight selected chip
                document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
                chip.classList.add('selected');
            });
        });

        // AI Suggestion
        aiSuggestionBtn?.addEventListener('click', () => {
            const randomSuggestion = this.aiSuggestions.messages[
                Math.floor(Math.random() * this.aiSuggestions.messages.length)
            ];
            
            const suggestionText = suggestionBox.querySelector('.suggestion-text');
            suggestionText.textContent = randomSuggestion;
            suggestionBox.classList.remove('hidden');
            
            // Animate in
            suggestionBox.style.opacity = '0';
            setTimeout(() => {
                suggestionBox.style.opacity = '1';
            }, 100);
        });

        // Use Suggestion
        useSuggestionBtn?.addEventListener('click', () => {
            const suggestionText = suggestionBox.querySelector('.suggestion-text');
            messageTextarea.value = suggestionText.textContent;
            suggestionBox.classList.add('hidden');
            
            // Show feedback
            const status = document.getElementById('formStatus');
            status.textContent = '✅ AI suggestion applied!';
            status.style.color = '#10B981';
            setTimeout(() => {
                status.textContent = '';
            }, 3000);
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                subject: document.getElementById('contactSubject').value,
                message: document.getElementById('contactMessage').value
            };

            const status = document.getElementById('formStatus');
            const submitBtn = form.querySelector('button[type="submit"]');

            // Validate
            if (!formData.name || !formData.email || !formData.message) {
                status.textContent = '⚠️ Please fill in all required fields';
                status.style.color = '#EF4444';
                return;
            }

            // Simulate sending (we'll add real email later)
            status.textContent = '📤 Sending your message...';
            status.style.color = '#6C63FF';
            submitBtn.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Success!
            status.textContent = '✅ Message sent successfully! I\'ll get back to you soon!';
            status.style.color = '#10B981';
            submitBtn.disabled = false;
            
            // Reset form after 3 seconds
            setTimeout(() => {
                form.reset();
                status.textContent = '';
                document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
            }, 3000);
        });

        // Real-time character counter
        messageTextarea?.addEventListener('input', () => {
            const count = messageTextarea.value.length;
            const hint = messageTextarea.parentElement.querySelector('.form-hint');
            if (hint) {
                hint.textContent = `📝 ${count} characters (minimum 10)`;
                hint.style.color = count < 10 ? '#EF4444' : '#6B7280';
            }
        });
    }
}

export default SmartContactForm;