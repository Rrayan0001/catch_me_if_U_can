"use strict";
class RunawayButton {
    constructor() {
        this.state = {
            attempts: 0,
            startTime: null,
            timerInterval: null,
            difficulty: 'hard',
            isGameActive: false
        };
        this.button = document.getElementById('runawayBtn');
        this.gameArea = document.getElementById('gameArea');
        this.attemptsDisplay = document.getElementById('attempts');
        this.timerDisplay = document.getElementById('timer');
        this.successMessage = document.getElementById('successMessage');
        this.finalAttemptsDisplay = document.getElementById('finalAttempts');
        this.finalTimeDisplay = document.getElementById('finalTime');
        this.resetBtn = document.getElementById('resetBtn');
        this.difficultyButtons = document.querySelectorAll('.difficulty-btn');
        this.init();
    }
    init() {
        this.button.addEventListener('mouseenter', () => this.handleButtonInteraction());
        this.button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleButtonInteraction();
        }, { passive: false });
        this.button.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
        this.button.addEventListener('click', (e) => this.handleButtonClick(e));
        this.resetBtn.addEventListener('click', () => this.resetGame());
    }
    handleButtonInteraction() {
        if (!this.state.isGameActive) {
            this.startGame();
        }
        this.state.attempts++;
        this.attemptsDisplay.textContent = this.state.attempts.toString();
        this.moveButton();
    }
    handleButtonClick(e) {
        e.stopPropagation();
        this.endGame(true);
    }
    startGame() {
        this.state.isGameActive = true;
        this.state.startTime = Date.now();
        this.state.timerInterval = window.setInterval(() => this.updateTimer(), 100);
    }
    updateTimer() {
        if (this.state.startTime) {
            const elapsed = Math.floor((Date.now() - this.state.startTime) / 1000);
            this.timerDisplay.textContent = `${elapsed}s`;
        }
    }
    moveButton() {
        const gameRect = this.gameArea.getBoundingClientRect();
        const buttonRect = this.button.getBoundingClientRect();
        let newX;
        let newY;
        // Add drifting class for smooth animation
        this.button.classList.add('drifting');
        switch (this.state.difficulty) {
            case 'easy':
                const offsetX = (Math.random() - 0.5) * 150;
                const offsetY = (Math.random() - 0.5) * 150;
                newX = Math.max(0, Math.min(gameRect.width - buttonRect.width, buttonRect.left - gameRect.left + offsetX));
                newY = Math.max(0, Math.min(gameRect.height - buttonRect.height, buttonRect.top - gameRect.top + offsetY));
                break;
            case 'medium':
                newX = Math.random() * (gameRect.width - buttonRect.width);
                newY = Math.random() * (gameRect.height / 2) + (gameRect.height / 4);
                break;
            case 'hard':
                newX = Math.random() * (gameRect.width - buttonRect.width);
                newY = Math.random() * (gameRect.height - buttonRect.height);
                break;
        }
        // Add slight rotation for drift effect
        const rotation = (Math.random() - 0.5) * 10;
        this.button.style.left = `${newX}px`;
        this.button.style.top = `${newY}px`;
        this.button.style.transform = `rotate(${rotation}deg)`;
    }
    getRandomPosition(buttonSize, containerSize, maxDistance) {
        const currentPos = Math.random() * (containerSize - buttonSize);
        const offset = (Math.random() - 0.5) * maxDistance;
        return Math.max(0, Math.min(containerSize - buttonSize, currentPos + offset));
    }
    endGame(success) {
        if (!this.state.isGameActive)
            return;
        this.state.isGameActive = false;
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
        }
        if (success) {
            const finalTime = this.timerDisplay.textContent;
            this.finalAttemptsDisplay.textContent = this.state.attempts.toString();
            this.finalTimeDisplay.textContent = finalTime || '0s';
            this.successMessage.classList.remove('hidden');
        }
    }
    resetGame() {
        this.state.attempts = 0;
        this.state.startTime = null;
        this.state.isGameActive = false;
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
        }
        this.attemptsDisplay.textContent = '0';
        this.timerDisplay.textContent = '0s';
        this.successMessage.classList.add('hidden');
        this.button.classList.remove('drifting');
        this.button.style.position = '';
        this.button.style.left = '';
        this.button.style.top = '';
        this.button.style.transform = '';
    }
}
// Initialize the game
new RunawayButton();
