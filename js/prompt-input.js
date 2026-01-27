/**
 * CEO Lab - Prompt Input Component
 * Handles the AI assistant chat interface
 */

class PromptInput {
    constructor() {
        this.textarea = document.getElementById('promptTextarea');
        this.sendBtn = document.getElementById('sendBtn');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.fileInput = document.getElementById('fileInput');
        this.filePreview = document.getElementById('filePreview');
        this.recordingIndicator = document.getElementById('recordingIndicator');

        this.isRecording = false;
        this.recordingTimer = null;
        this.recordingTime = 0;
        this.currentMode = null;
        this.attachedFiles = [];

        this.init();
    }

    init() {
        if (!this.textarea || !this.sendBtn) return;

        // Auto-resize textarea
        this.textarea.addEventListener('input', () => this.autoResize());

        // Send on Enter (Shift+Enter for new line)
        this.textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });

        // Send button click
        this.sendBtn.addEventListener('click', () => this.handleSendClick());

        // Upload button
        this.uploadBtn?.addEventListener('click', () => this.fileInput?.click());

        // File input change
        this.fileInput?.addEventListener('change', (e) => this.handleFileUpload(e));

        // Mode toggles
        const modeBtns = document.querySelectorAll('.prompt-mode-btn');
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.toggleMode(btn.dataset.mode));
        });

        // Drag and drop
        this.setupDragAndDrop();

        // Paste image
        document.addEventListener('paste', (e) => this.handlePaste(e));

        // Update button states
        this.textarea.addEventListener('input', () => this.updateButtonStates());
        this.updateButtonStates();
    }

    autoResize() {
        this.textarea.style.height = 'auto';
        this.textarea.style.height = Math.min(this.textarea.scrollHeight, 200) + 'px';
    }

    handleSendClick() {
        if (this.isRecording) {
            this.stopRecording();
        } else if (this.hasContent()) {
            this.handleSend();
        } else {
            this.startRecording();
        }
    }

    hasContent() {
        return this.textarea.value.trim() !== '' || this.attachedFiles.length > 0;
    }

    handleSend() {
        const message = this.textarea.value.trim();

        if (!message && this.attachedFiles.length === 0) return;

        // Format message with mode prefix
        let formattedMessage = message;
        if (this.currentMode) {
            const modePrefixes = {
                'search': '[Search] ',
                'think': '[Think] ',
                'canvas': '[Canvas] '
            };
            formattedMessage = modePrefixes[this.currentMode] + message;
        }

        // Here you would send the message to your backend
        console.log('Sending message:', formattedMessage);
        console.log('Attached files:', this.attachedFiles);

        // Show user feedback
        this.showMessageSent(formattedMessage);

        // Clear input
        this.textarea.value = '';
        this.attachedFiles = [];
        this.filePreview.style.display = 'none';
        this.filePreview.innerHTML = '';
        this.autoResize();
        this.updateButtonStates();
    }

    showMessageSent(message) {
        // Create a temporary feedback element
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(127, 171, 200, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 1000;
            animation: fadeInOut 2s ease-in-out;
        `;
        feedback.textContent = 'Message sent!';
        document.body.appendChild(feedback);

        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 2000);
    }

    toggleMode(mode) {
        const btn = document.querySelector(`[data-mode="${mode}"]`);
        if (!btn) return;

        if (this.currentMode === mode) {
            // Deactivate current mode
            this.currentMode = null;
            btn.classList.remove('active');
        } else {
            // Deactivate all modes
            document.querySelectorAll('.prompt-mode-btn').forEach(b => b.classList.remove('active'));
            // Activate new mode
            this.currentMode = mode;
            btn.classList.add('active');
        }

        this.updatePlaceholder();
    }

    updatePlaceholder() {
        const placeholders = {
            'search': 'Search the web for leadership insights...',
            'think': 'Ask me to think deeply about your challenge...',
            'canvas': 'Create a framework or visual on canvas...',
            'default': 'Ask about your leadership growth, request an assessment, or explore frameworks...'
        };

        this.textarea.placeholder = placeholders[this.currentMode] || placeholders.default;
    }

    handleFileUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Only image files are supported');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        this.addFile(file);
    }

    addFile(file) {
        this.attachedFiles = [file]; // Only one file at a time

        const reader = new FileReader();
        reader.onload = (e) => {
            this.showFilePreview(e.target.result, file.name);
        };
        reader.readAsDataURL(file);

        this.updateButtonStates();
    }

    showFilePreview(dataUrl, fileName) {
        this.filePreview.innerHTML = '';
        this.filePreview.style.display = 'flex';

        const preview = document.createElement('div');
        preview.className = 'prompt-file-preview';
        preview.innerHTML = `
            <img src="${dataUrl}" alt="${fileName}" />
            <button class="prompt-file-remove" title="Remove image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        preview.querySelector('.prompt-file-remove').addEventListener('click', () => {
            this.attachedFiles = [];
            this.filePreview.style.display = 'none';
            this.filePreview.innerHTML = '';
            this.updateButtonStates();
        });

        this.filePreview.appendChild(preview);
    }

    setupDragAndDrop() {
        const promptBox = document.getElementById('promptBox');
        if (!promptBox) return;

        promptBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            promptBox.style.borderColor = 'rgba(127, 171, 200, 0.5)';
        });

        promptBox.addEventListener('dragleave', (e) => {
            e.preventDefault();
            promptBox.style.borderColor = '';
        });

        promptBox.addEventListener('drop', (e) => {
            e.preventDefault();
            promptBox.style.borderColor = '';

            const files = Array.from(e.dataTransfer.files);
            const imageFile = files.find(f => f.type.startsWith('image/'));

            if (imageFile) {
                this.addFile(imageFile);
            }
        });
    }

    handlePaste(e) {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    e.preventDefault();
                    this.addFile(file);
                    break;
                }
            }
        }
    }

    startRecording() {
        this.isRecording = true;
        this.recordingTime = 0;

        this.textarea.classList.add('hidden');
        this.recordingIndicator.classList.add('active');
        this.recordingIndicator.style.display = 'flex';

        this.recordingTimer = setInterval(() => {
            this.recordingTime++;
            this.updateRecordingTime();
        }, 1000);

        this.updateButtonStates();

        // Here you would start actual audio recording
        console.log('Recording started');
    }

    stopRecording() {
        this.isRecording = false;

        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
        }

        this.textarea.classList.remove('hidden');
        this.recordingIndicator.classList.remove('active');

        setTimeout(() => {
            this.recordingIndicator.style.display = 'none';
        }, 300);

        this.updateButtonStates();

        // Here you would stop actual audio recording and send it
        console.log(`Recording stopped after ${this.recordingTime} seconds`);

        if (this.recordingTime > 0) {
            this.showMessageSent(`Voice message (${this.recordingTime}s)`);
        }

        this.recordingTime = 0;
    }

    updateRecordingTime() {
        const timeDisplay = this.recordingIndicator.querySelector('.recording-time');
        if (timeDisplay) {
            const mins = Math.floor(this.recordingTime / 60);
            const secs = this.recordingTime % 60;
            timeDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    updateButtonStates() {
        const hasContent = this.hasContent();

        // Update send button appearance
        if (this.isRecording) {
            this.sendBtn.classList.remove('has-content');
            this.sendBtn.classList.add('recording');
            this.sendBtn.querySelector('.send-icon').style.display = 'none';
            this.sendBtn.querySelector('.mic-icon').style.display = 'none';
            this.sendBtn.querySelector('.stop-icon').style.display = 'block';
        } else if (hasContent) {
            this.sendBtn.classList.add('has-content');
            this.sendBtn.classList.remove('recording');
            this.sendBtn.querySelector('.send-icon').style.display = 'block';
            this.sendBtn.querySelector('.mic-icon').style.display = 'none';
            this.sendBtn.querySelector('.stop-icon').style.display = 'none';
        } else {
            this.sendBtn.classList.remove('has-content', 'recording');
            this.sendBtn.querySelector('.send-icon').style.display = 'none';
            this.sendBtn.querySelector('.mic-icon').style.display = 'block';
            this.sendBtn.querySelector('.stop-icon').style.display = 'none';
        }
    }
}

// Add fade in/out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
        15% { opacity: 1; transform: translateX(-50%) translateY(0); }
        85% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PromptInput());
} else {
    new PromptInput();
}
