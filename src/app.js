import { ThemeManager } from './config/theme.js';
import { CONSTANTS } from './config/constants.js';
import { MoodTracker } from './features/mood/moodTracker.js';
import { Gamification } from './features/gamification/gamification.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Animations
    AOS.init({
        duration: 800,
        once: true
    });

    // Initialize core services
    ThemeManager.init();
    MoodTracker.init();
    
    // Setup Gamification & Profile listeners
    document.addEventListener('gamificationUpdated', (e) => {
        const { profile, streak } = e.detail;
        const streakEl = document.getElementById('streak-display');
        const levelEl = document.getElementById('level-display');
        if (streakEl) streakEl.textContent = streak;
        if (levelEl) levelEl.textContent = profile.level;
    });
    
    document.addEventListener('profileUpdated', (e) => {
        updateAvatarInitials();
    });

    // Initial UI update
    Gamification.updateUI();
    updateAvatarInitials();

    function updateAvatarInitials() {
        const profileStr = localStorage.getItem('mindmate_user');
        if (profileStr) {
            try {
                const profile = JSON.parse(profileStr);
                if (profile.name && profile.name.trim() !== '') {
                    const initials = profile.name.charAt(0).toUpperCase();
                    const avatarEls = document.querySelectorAll('#avatar-initial');
                    avatarEls.forEach(el => el.textContent = initials);
                }
            } catch (e) {}
        }
    }

    // Theme Toggle Listener
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = ThemeManager.toggleTheme();
            const icon = themeToggleBtn.querySelector('i');
            if (newTheme === 'dark') {
                icon.className = 'fa-solid fa-sun';
            } else {
                icon.className = 'fa-solid fa-moon';
            }
        });

        const currentTheme = document.documentElement.getAttribute('data-theme');
        const icon = themeToggleBtn.querySelector('i');
        if (currentTheme === 'dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }

    renderMoodSelector();
});

function renderMoodSelector() {
    const moodContainer = document.getElementById('mood-selector');
    if (!moodContainer) return;

    Object.entries(CONSTANTS.MOODS).forEach(([moodKey, mood]) => {
        const btn = document.createElement('button');
        btn.className = 'btn border rounded-pill px-3 py-2 d-flex flex-column align-items-center gap-1';
        btn.style.backgroundColor = 'var(--glass-bg)';
        btn.style.borderColor = 'var(--glass-border)';
        btn.style.color = 'var(--text-primary)';
        btn.innerHTML = `
            <span class="fs-3" aria-hidden="true">${mood.emoji}</span>
            <span class="small fw-semibold">${mood.label}</span>
        `;
        btn.setAttribute('aria-label', `Log mood as ${mood.label}`);
        
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = 'var(--glass-shadow)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'none';
            btn.style.boxShadow = 'none';
        });

        btn.addEventListener('click', () => {
            MoodTracker.logMood(moodKey);
            
            // Visual feedback
            btn.style.backgroundColor = mood.color;
            btn.style.color = '#fff';
            
            // Update Dashboard instantly
            updateDashboard();

            setTimeout(() => {
                btn.style.backgroundColor = 'var(--glass-bg)';
                btn.style.color = 'var(--text-primary)';
                alert('Mood logged successfully!');
            }, 500);
        });

        moodContainer.appendChild(btn);
    });
}

import { ScoringEngine } from './features/analytics/scoring.js';

let burnoutChartInstance = null;

function updateDashboard() {
    // Wellness Score
    const score = ScoringEngine.calculateWellnessScore();
    const risk = ScoringEngine.calculateBurnoutRisk();
    const riskCat = ScoringEngine.getRiskCategory(risk);

    const scoreCards = document.querySelectorAll('.display-4');
    if (scoreCards.length > 0) {
        scoreCards[0].textContent = score;
        const pb = document.querySelector('.progress-bar');
        if(pb) {
            pb.style.width = `${score}%`;
            if (score > 70) pb.className = 'progress-bar bg-success';
            else if (score > 40) pb.className = 'progress-bar bg-warning';
            else pb.className = 'progress-bar bg-danger';
        }
    }

    // Chart.js rendering
    renderBurnoutChart(risk, riskCat);
}

function renderBurnoutChart(risk, riskCat) {
    const chartContainer = document.querySelector('.col-12.col-lg-6 .d-flex.align-items-center.justify-content-center.bg-dark');
    if (!chartContainer) return;

    if (!burnoutChartInstance) {
        chartContainer.innerHTML = '<canvas id="burnoutChart"></canvas>';
        const ctx = document.getElementById('burnoutChart').getContext('2d');
        
        burnoutChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Current Risk', 'Safe Zone'],
                datasets: [{
                    data: [risk, 100 - risk],
                    backgroundColor: [riskCat.color, 'rgba(100,100,100,0.2)'],
                    borderWidth: 0,
                    cutout: '80%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            },
            plugins: [{
                id: 'textCenter',
                beforeDraw: function(chart) {
                    var width = chart.width,
                        height = chart.height,
                        ctx = chart.ctx;

                    ctx.restore();
                    var fontSize = (height / 114).toFixed(2);
                    ctx.font = "bold " + fontSize + "em Inter";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = riskCat.color;

                    var text = risk + "%",
                        textX = Math.round((width - ctx.measureText(text).width) / 2),
                        textY = height / 2;

                    ctx.fillText(text, textX, textY);
                    
                    ctx.font = "normal " + (fontSize*0.4).toFixed(2) + "em Inter";
                    ctx.fillStyle = "var(--text-secondary)";
                    var subText = riskCat.label,
                        subTextX = Math.round((width - ctx.measureText(subText).width) / 2),
                        subTextY = height / 2 + 25;
                    ctx.fillText(subText, subTextX, subTextY);
                    
                    ctx.save();
                }
            }]
        });
    } else {
        burnoutChartInstance.data.datasets[0].data = [risk, 100 - risk];
        burnoutChartInstance.data.datasets[0].backgroundColor[0] = riskCat.color;
        burnoutChartInstance.update();
    }
}

// Ensure dashboard updates on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateDashboard, 100);
});

