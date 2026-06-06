import { StorageService } from '../../core/storage.js';
import { CONSTANTS } from '../../config/constants.js';

export const FocusTimer = {
    timerInterval: null,
    timeLeft: 0,
    totalTime: 0,
    currentMode: 'POMODORO',
    isRunning: false,
    isBreak: false,
    
    // Callbacks for UI updates
    onTick: null,
    onComplete: null,
    onModeChange: null,

    init(tickCallback, completeCallback, modeChangeCallback) {
        this.onTick = tickCallback;
        this.onComplete = completeCallback;
        this.onModeChange = modeChangeCallback;
        this.setMode('POMODORO');
    },

    setMode(modeKey) {
        if (!CONSTANTS.SETTINGS.FOCUS_MODES[modeKey]) return;
        
        this.currentMode = modeKey;
        this.isBreak = false;
        const modeSettings = CONSTANTS.SETTINGS.FOCUS_MODES[modeKey];
        this.totalTime = modeSettings.work * 60;
        this.timeLeft = this.totalTime;
        
        this.stop();
        if (this.onModeChange) this.onModeChange(modeKey, this.isBreak);
        if (this.onTick) this.onTick(this.timeLeft, this.totalTime);
    },

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.timerInterval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                if (this.onTick) this.onTick(this.timeLeft, this.totalTime);
            } else {
                this.handleSessionComplete();
            }
        }, 1000);
    },

    pause() {
        if (!this.isRunning) return;
        this.isRunning = false;
        clearInterval(this.timerInterval);
    },

    stop() {
        this.isRunning = false;
        clearInterval(this.timerInterval);
        const modeSettings = CONSTANTS.SETTINGS.FOCUS_MODES[this.currentMode];
        this.totalTime = (this.isBreak ? modeSettings.break : modeSettings.work) * 60;
        this.timeLeft = this.totalTime;
        if (this.onTick) this.onTick(this.timeLeft, this.totalTime);
    },

    handleSessionComplete() {
        this.stop();
        const modeSettings = CONSTANTS.SETTINGS.FOCUS_MODES[this.currentMode];
        
        if (!this.isBreak) {
            // Save completed work session
            this.saveSession();
            // Switch to break
            this.isBreak = true;
            this.totalTime = modeSettings.break * 60;
        } else {
            // Break is over, back to work
            this.isBreak = false;
            this.totalTime = modeSettings.work * 60;
        }
        
        this.timeLeft = this.totalTime;
        if (this.onModeChange) this.onModeChange(this.currentMode, this.isBreak);
        if (this.onComplete) this.onComplete(this.isBreak);
    },

    saveSession() {
        const history = StorageService.getItem(CONSTANTS.STORAGE_KEYS.FOCUS_SESSIONS, []);
        const modeSettings = CONSTANTS.SETTINGS.FOCUS_MODES[this.currentMode];
        history.push({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            mode: this.currentMode,
            duration: modeSettings.work
        });
        StorageService.setItem(CONSTANTS.STORAGE_KEYS.FOCUS_SESSIONS, history);
    },

    formatTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }
};
