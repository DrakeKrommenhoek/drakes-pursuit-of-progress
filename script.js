// ============================================
// DATA STRUCTURES & CONSTANTS
// ============================================

// Storage keys
const STORAGE_KEYS = {
    DAILY_LOGS: 'momentum_dailyLogs',
    WEEKLY_LOGS: 'momentum_weeklyLogs',
    SETTINGS: 'momentum_settings',
    STREAKS: 'momentum_streaks',
    LAST_ACCESS: 'momentum_lastAccess'
};

// Daily Bare Minimums Structure
const DAILY_HABITS_STRUCTURE = {
    brushTeethAM: { id: 'brushTeethAM', name: 'Brush teeth (AM)', type: 'simple', xpValue: 12.5 },
    brushTeethPM: { id: 'brushTeethPM', name: 'Brush teeth (PM)', type: 'simple', xpValue: 12.5 },
    beActive: {
        id: 'beActive',
        name: 'Be active today',
        type: 'with_note',
        xpValue: 12.5,
        note: { label: 'What did you do?', placeholder: 'e.g., Basketball, gym, long walk' }
    },
    reading: {
        id: 'reading',
        name: 'Reading for tomorrow',
        type: 'with_select_and_note',
        xpValue: 12.5,
        select: {
            label: 'Which class?',
            options: ['BUS 160', 'ECON 210', 'ECON 230', 'FIN 221', 'Other']
        },
        note: { label: 'Quick takeaway', placeholder: 'Key insight...' }
    },
    supplements: {
        id: 'supplements',
        name: 'Supplements taken',
        type: 'expandable',
        xpValue: 12.5,
        items: [
            { id: 'protein', name: 'Protein shake' },
            { id: 'vitamins', name: 'Vitamins' },
            { id: 'tyrosine', name: 'L-tyrosine' },
            { id: 'theanine', name: 'L-theanine' },
            { id: 'creatine', name: 'Creatine', optional: true }
        ]
    },
    water: {
        id: 'water',
        name: 'Water tracking',
        type: 'tracker',
        xpValue: 12.5,
        label: 'Ounces consumed'
    },
    caffeine: {
        id: 'caffeine',
        name: 'Caffeine tracking',
        type: 'tracker',
        xpValue: 12.5,
        label: 'mg consumed'
    }
};

// Night Routine Structure
const NIGHT_ROUTINE_STRUCTURE = {
    reflection: { id: 'reflection', label: 'Short reflection', required: true },
    gratitude: { id: 'gratitude', label: 'Gratitude (min 1 line)', required: true },
    tomorrowGoals: { id: 'tomorrowGoals', label: '1-3 goals for tomorrow', required: true },
    awareness: { id: 'awareness', label: '1 thing to be aware of', required: true },
    alarmSet: { id: 'alarmSet', label: 'Set alarm for tomorrow', required: false },
    wakeTime: { id: 'wakeTime', label: 'Wake time', required: false }
};

// Bonus Items
const BONUS_ITEMS_STRUCTURE = {
    business: {
        id: 'business',
        name: 'Build my app/business for 30 minutes',
        unlockedBy: 'reading',
        type: 'timer',
        xpValue: 15
    },
    sauna: {
        id: 'sauna',
        name: 'Sauna 30 minutes',
        unlockedBy: 'beActive',
        type: 'timer',
        xpValue: 15
    },
    meditation: {
        id: 'meditation',
        name: 'Meditation 10-30 minutes',
        unlockedBy: null,
        type: 'timer',
        xpValue: 20 // max value
    },
    readingBook: {
        id: 'readingBook',
        name: 'Read 5 pages (non-class book)',
        unlockedBy: null,
        type: 'simple',
        xpValue: 10
    }
};

// Weekly Todos Structure
const WEEKLY_TODOS_STRUCTURE = {
    businessMomentum: {
        id: 'businessMomentum',
        name: 'Business momentum',
        type: 'time_tracker',
        target: { min: 180, max: 300 },
        helpText: 'Examples: reading/learning for business, outreach to alumni, building in Claude Code'
    },
    relationships: [
        { id: 'sister', name: 'Check in with sister' },
        { id: 'mom', name: 'Check in with mom' },
        { id: 'dad', name: 'Check in with dad' },
        { id: 'van', name: 'Check in with best friend (Van)' },
        { id: 'newConnection', name: 'Meet someone new OR deepen a connection' },
        { id: 'compliment', name: 'Compliment someone' }
    ],
    skillGrowth: {
        id: 'skillGrowth',
        name: 'Learn or practice a new skill',
        type: 'dropdown_with_other',
        options: [
            'Learn a song on piano',
            'Write a poem',
            'Learn a study technique (meta-learning)',
            'Other'
        ]
    }
};

// Default Settings
const DEFAULT_SETTINGS = {
    waterGoal: 64,
    waterUnit: 'oz',
    caffeineUnit: 'mg',
    caffeineCap: 400,
    creatineEnabled: true,
    dailyResetTime: '03:00',
    completionThreshold: 75
};

// ============================================
// MOMENTUM TRACKER CLASS
// ============================================

class MomentumTracker {
    constructor() {
        this.settings = this.loadSettings();
        this.dailyLogs = this.loadDailyLogs();
        this.weeklyLogs = this.loadWeeklyLogs();
        this.streaks = this.loadStreaks();
        this.checkAndHandleReset();
    }

    // ========== LOAD & SAVE ==========

    loadSettings() {
        const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    }

    saveSettings() {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    }

    loadDailyLogs() {
        const stored = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
        return stored ? JSON.parse(stored) : {};
    }

    saveDailyLogs() {
        localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(this.dailyLogs));
    }

    loadWeeklyLogs() {
        const stored = localStorage.getItem(STORAGE_KEYS.WEEKLY_LOGS);
        return stored ? JSON.parse(stored) : {};
    }

    saveWeeklyLogs() {
        localStorage.setItem(STORAGE_KEYS.WEEKLY_LOGS, JSON.stringify(this.weeklyLogs));
    }

    loadStreaks() {
        const stored = localStorage.getItem(STORAGE_KEYS.STREAKS);
        return stored ? JSON.parse(stored) : {
            greenDay: { current: 0, best: 0, lastDate: null },
            reading: { current: 0, best: 0, lastDate: null }
        };
    }

    saveStreaks() {
        localStorage.setItem(STORAGE_KEYS.STREAKS, JSON.stringify(this.streaks));
    }

    // ========== DATE UTILITIES ==========

    getTodayString() {
        const now = new Date();
        const resetHour = parseInt(this.settings.dailyResetTime.split(':')[0]); // Default: 3

        // If it's before reset time, we're still in "yesterday"
        if (now.getHours() < resetHour) {
            now.setDate(now.getDate() - 1);
        }

        // Return local date (not UTC) in YYYY-MM-DD format
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    getDateString(daysOffset = 0) {
        const now = new Date();
        const resetHour = parseInt(this.settings.dailyResetTime.split(':')[0]); // Default: 3

        // If it's before reset time, we're still in "yesterday"
        if (now.getHours() < resetHour) {
            now.setDate(now.getDate() - 1);
        }

        // Apply the offset
        now.setDate(now.getDate() + daysOffset);

        // Return local date (not UTC) in YYYY-MM-DD format
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    getCurrentWeekKey() {
        const now = new Date();
        const resetHour = parseInt(this.settings.dailyResetTime.split(':')[0]); // Default: 3

        // If it's before reset time, we're still in "yesterday"
        if (now.getHours() < resetHour) {
            now.setDate(now.getDate() - 1);
        }

        const dayOfWeek = now.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(now);
        monday.setDate(now.getDate() + mondayOffset);

        // Return local date (not UTC) in YYYY-MM-DD format
        const year = monday.getFullYear();
        const month = String(monday.getMonth() + 1).padStart(2, '0');
        const day = String(monday.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // ========== RESET LOGIC ==========

    checkAndHandleReset() {
        const now = new Date();
        const lastAccess = localStorage.getItem(STORAGE_KEYS.LAST_ACCESS);

        if (lastAccess) {
            const lastDate = new Date(lastAccess);
            // Check if we've crossed a reset boundary (3 AM)
            if (this.hasCrossedResetTime(lastDate, now)) {
                // Daily reset already handled by date-based logic
                // Just update streaks if needed
                this.checkStreakIntegrity();
            }
        }

        localStorage.setItem(STORAGE_KEYS.LAST_ACCESS, now.toISOString());
    }

    hasCrossedResetTime(from, to) {
        const resetHour = parseInt(this.settings.dailyResetTime.split(':')[0]);
        const fromDay = from.getDate();
        const toDay = to.getDate();
        const fromHour = from.getHours();
        const toHour = to.getHours();

        // Different days
        if (fromDay !== toDay) {
            // If we're past reset time on the new day, we've crossed
            if (toHour >= resetHour) return true;
            // If we were before reset on old day and now after on new day
            if (fromHour < resetHour && toHour >= resetHour) return true;
        }

        return false;
    }

    // ========== DAILY LOG MANAGEMENT ==========

    getDailyLog(date = null) {
        const dateKey = date || this.getTodayString();

        if (!this.dailyLogs[dateKey]) {
            this.dailyLogs[dateKey] = {
                date: dateKey,
                habits: {
                    brushTeethAM: { checked: false },
                    brushTeethPM: { checked: false },
                    beActive: { checked: false, note: '' },
                    reading: { checked: false, select: '', note: '' },
                    supplements: {
                        checked: false,
                        items: {
                            protein: false,
                            vitamins: false,
                            tyrosine: false,
                            theanine: false,
                            creatine: false
                        }
                    },
                    water: { value: 0 },
                    caffeine: { value: 0 }
                },
                nightRoutine: {
                    reflection: '',
                    gratitude: '',
                    tomorrowGoals: '',
                    awareness: '',
                    alarmSet: false,
                    wakeTime: ''
                },
                bonuses: {
                    business: { completed: false, minutes: 0 },
                    sauna: { completed: false, minutes: 0 },
                    meditation: { completed: false, minutes: 0 },
                    readingBook: { completed: false }
                }
            };
        }

        return this.dailyLogs[dateKey];
    }

    // ========== DAILY HABIT ACTIONS ==========

    toggleDailyHabit(habitId) {
        const log = this.getDailyLog();
        const habit = log.habits[habitId];

        if (!habit) return;

        if (habitId === 'water' || habitId === 'caffeine') {
            // Tracker types don't toggle, they have values
            return;
        } else if (habitId === 'supplements') {
            habit.checked = !habit.checked;
        } else {
            habit.checked = !habit.checked;
        }

        this.saveDailyLogs();
        this.updateDailyStats();
    }

    updateHabitData(habitId, data) {
        const log = this.getDailyLog();
        const habit = log.habits[habitId];

        if (!habit) return;

        Object.assign(habit, data);
        this.saveDailyLogs();
        this.updateDailyStats();
    }

    updateSupplementItem(itemId, checked) {
        const log = this.getDailyLog();
        log.habits.supplements.items[itemId] = checked;
        // Auto-check main supplements checkbox if any item is checked
        const anyChecked = Object.values(log.habits.supplements.items).some(v => v);
        log.habits.supplements.checked = anyChecked;
        this.saveDailyLogs();
        this.updateDailyStats();
    }

    updateWater(value) {
        const log = this.getDailyLog();
        log.habits.water.value = parseInt(value) || 0;
        this.saveDailyLogs();
        this.updateDailyStats();
    }

    updateCaffeine(value) {
        const log = this.getDailyLog();
        log.habits.caffeine.value = parseInt(value) || 0;
        this.saveDailyLogs();
        this.updateDailyStats();
    }

    // ========== NIGHT ROUTINE ==========

    updateNightRoutine(data) {
        const log = this.getDailyLog();
        Object.assign(log.nightRoutine, data);
        this.saveDailyLogs();
        this.updateDailyStats();
    }

    isNightRoutineComplete() {
        const log = this.getDailyLog();
        const nr = log.nightRoutine;
        // All required fields must have content
        return !!(nr.reflection && nr.gratitude && nr.tomorrowGoals && nr.awareness);
    }

    // ========== BONUS ITEMS ==========

    checkBonusUnlocked(bonusId) {
        const bonusStructure = BONUS_ITEMS_STRUCTURE[bonusId];
        if (!bonusStructure) return false;

        // If no unlock condition, always unlocked
        if (!bonusStructure.unlockedBy) return true;

        // Check if prerequisite is completed
        const log = this.getDailyLog();
        const prerequisite = log.habits[bonusStructure.unlockedBy];

        return prerequisite && prerequisite.checked;
    }

    toggleBonus(bonusId) {
        if (!this.checkBonusUnlocked(bonusId)) return;

        const log = this.getDailyLog();
        const bonus = log.bonuses[bonusId];

        if (bonus.hasOwnProperty('completed')) {
            bonus.completed = !bonus.completed;
        }

        this.saveDailyLogs();
        this.updateDailyStats();
    }

    updateBonusMinutes(bonusId, minutes) {
        if (!this.checkBonusUnlocked(bonusId)) return;

        const log = this.getDailyLog();
        const bonus = log.bonuses[bonusId];

        if (bonus.hasOwnProperty('minutes')) {
            bonus.minutes = parseInt(minutes) || 0;
            bonus.completed = bonus.minutes >= 10; // At least 10 minutes to count
        }

        this.saveDailyLogs();
        this.updateDailyStats();
    }

    // ========== DAILY STATS CALCULATION ==========

    calculateDailyCompletion(date = null) {
        const log = this.getDailyLog(date);
        let coreCompleted = 0;
        const coreTotal = 8; // 7 bare minimums + 1 night routine

        // Count completed core habits (7)
        if (log.habits.brushTeethAM.checked) coreCompleted++;
        if (log.habits.brushTeethPM.checked) coreCompleted++;
        if (log.habits.beActive.checked) coreCompleted++;
        if (log.habits.reading.checked) coreCompleted++;
        if (log.habits.supplements.checked) coreCompleted++;
        // Water counts if any amount entered
        if (log.habits.water.value > 0) coreCompleted++;
        // Caffeine counts if tracked (can be 0)
        if (log.habits.caffeine.value >= 0) coreCompleted++;

        // Night routine (all-or-nothing)
        if (this.isNightRoutineComplete()) coreCompleted++;

        // Calculate percentage
        const percentage = Math.round((coreCompleted / coreTotal) * 100);

        // Calculate core XP (100 base points)
        const coreXP = Math.round((coreCompleted / coreTotal) * 100);

        // Calculate bonus XP
        let bonusXP = 0;
        if (log.bonuses.business.completed) bonusXP += 15;
        if (log.bonuses.sauna.completed) bonusXP += 15;
        if (log.bonuses.meditation.completed) {
            // Scale based on minutes (10-30 min = 10-20 XP)
            const mins = Math.min(log.bonuses.meditation.minutes, 30);
            bonusXP += Math.round((mins / 30) * 20);
        }
        if (log.bonuses.readingBook.completed) bonusXP += 10;

        const totalXP = coreXP + bonusXP;

        return {
            coreCompleted,
            coreTotal,
            percentage,
            coreXP,
            bonusXP,
            totalXP,
            maxCoreXP: 100
        };
    }

    updateDailyStats() {
        const stats = this.calculateDailyCompletion();
        const wasComplete = this.getDailyLog().isComplete || false;
        const isComplete = stats.percentage >= this.settings.completionThreshold;

        this.getDailyLog().isComplete = isComplete;
        this.getDailyLog().percentage = stats.percentage;

        // Update streaks if day just completed
        if (!wasComplete && isComplete) {
            this.updateStreaks();
        }

        this.saveDailyLogs();
    }

    getProgressColor(percentage) {
        if (percentage < 50) return 'neutral';
        if (percentage < 75) return 'improving';
        if (percentage < 100) return 'success';
        return 'perfect';
    }

    // ========== STREAKS ==========

    updateStreaks() {
        const today = this.getTodayString();
        const yesterday = this.getDateString(-1);
        const log = this.getDailyLog();

        // Green day streak (75%+ completion)
        if (log.percentage >= this.settings.completionThreshold) {
            if (this.streaks.greenDay.lastDate === yesterday) {
                this.streaks.greenDay.current++;
            } else if (this.streaks.greenDay.lastDate !== today) {
                this.streaks.greenDay.current = 1;
            }
            this.streaks.greenDay.lastDate = today;

            if (this.streaks.greenDay.current > this.streaks.greenDay.best) {
                this.streaks.greenDay.best = this.streaks.greenDay.current;
            }
        }

        // Reading streak
        if (log.habits.reading.checked) {
            if (this.streaks.reading.lastDate === yesterday) {
                this.streaks.reading.current++;
            } else if (this.streaks.reading.lastDate !== today) {
                this.streaks.reading.current = 1;
            }
            this.streaks.reading.lastDate = today;

            if (this.streaks.reading.current > this.streaks.reading.best) {
                this.streaks.reading.best = this.streaks.reading.current;
            }
        }

        this.saveStreaks();
    }

    checkStreakIntegrity() {
        const today = this.getTodayString();
        const yesterday = this.getDateString(-1);

        // Check green day streak
        if (this.streaks.greenDay.lastDate && this.streaks.greenDay.lastDate < yesterday) {
            // Check if yesterday was completed
            const yesterdayLog = this.dailyLogs[yesterday];
            if (!yesterdayLog || !yesterdayLog.isComplete) {
                this.streaks.greenDay.current = 0;
            }
        }

        // Check reading streak
        if (this.streaks.reading.lastDate && this.streaks.reading.lastDate < yesterday) {
            const yesterdayLog = this.dailyLogs[yesterday];
            if (!yesterdayLog || !yesterdayLog.habits.reading.checked) {
                this.streaks.reading.current = 0;
            }
        }

        this.saveStreaks();
    }

    // ========== CALENDAR HEATMAP ==========

    getCalendarHeatmap() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

        const weeks = [];
        let week = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < startDayOfWeek; i++) {
            week.push({ date: null, percentage: 0, color: 'empty' });
        }

        // Add all days of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            const log = this.dailyLogs[dateString];
            const stats = log ? this.calculateDailyCompletion(dateString) : null;
            const percentage = stats ? stats.percentage : 0;
            const color = this.getProgressColor(percentage);
            const isToday = dateString === this.getTodayString();

            const hasStar = percentage >= 100;
            const hasDoubleStar = hasStar && stats && stats.bonusXP > 0;

            week.push({
                date: dateString,
                day: day,
                percentage,
                color,
                hasStar,
                hasDoubleStar,
                isToday
            });

            // Start new week after Saturday
            if (week.length === 7) {
                weeks.push(week);
                week = [];
            }
        }

        // Add remaining empty cells
        if (week.length > 0) {
            while (week.length < 7) {
                week.push({ date: null, percentage: 0, color: 'empty' });
            }
            weeks.push(week);
        }

        return {
            month: today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            weeks
        };
    }

    // ========== WEEKLY TODOS ==========

    getWeeklyLog() {
        const weekKey = this.getCurrentWeekKey();

        if (!this.weeklyLogs[weekKey]) {
            this.weeklyLogs[weekKey] = {
                weekStart: weekKey,
                businessMomentum: { minutes: 0 },
                relationships: {
                    sister: false,
                    mom: false,
                    dad: false,
                    van: false,
                    newConnection: false,
                    compliment: false
                },
                skillGrowth: {
                    completed: false,
                    selected: '',
                    customValue: ''
                }
            };
        }

        return this.weeklyLogs[weekKey];
    }

    updateBusinessMomentum(minutes) {
        const log = this.getWeeklyLog();
        log.businessMomentum.minutes = parseInt(minutes) || 0;
        this.saveWeeklyLogs();
    }

    toggleRelationship(relationshipId) {
        const log = this.getWeeklyLog();
        log.relationships[relationshipId] = !log.relationships[relationshipId];
        this.saveWeeklyLogs();
    }

    updateSkillGrowth(selected, customValue = '') {
        const log = this.getWeeklyLog();
        log.skillGrowth.selected = selected;
        log.skillGrowth.customValue = customValue;
        log.skillGrowth.completed = !!selected;
        this.saveWeeklyLogs();
    }
}

// ============================================
// UI CONTROLLER
// ============================================

class UIController {
    constructor(tracker) {
        this.tracker = tracker;
        this.currentTab = 'daily';
        this.initEventListeners();
        this.render();
    }

    initEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Settings button
        const settingsBtn = document.getElementById('btnSettings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettingsModal());
        }

        // Close modals
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('show');
            });
        });

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });
    }

    switchTab(tabName) {
        this.currentTab = tabName;

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.dataset.tab === tabName);
        });

        // Render appropriate content
        if (tabName === 'daily') {
            this.renderDaily();
        } else if (tabName === 'weekly') {
            this.renderWeekly();
        }
    }

    render() {
        this.renderDaily();
        this.renderWeekly();
    }

    renderDaily() {
        this.renderDate();
        this.renderProgress();
        this.renderDailyHabits();
        this.renderNightRoutine();
        this.renderBonuses();
        this.renderCalendarHeatmap();
    }

    renderDate() {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateEl = document.getElementById('currentDate');
        if (dateEl) {
            dateEl.textContent = today.toLocaleDateString('en-US', options);
        }
    }

    renderProgress() {
        const stats = this.tracker.calculateDailyCompletion();
        const color = this.tracker.getProgressColor(stats.percentage);

        // Update progress bar
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = stats.percentage + '%';
            progressBar.className = 'progress-bar ' + color;
        }

        // Update progress section background
        const progressSection = document.querySelector('.progress-section');
        if (progressSection) {
            progressSection.className = 'progress-section ' + color;
        }

        // Update XP text
        document.getElementById('totalXP').textContent = stats.totalXP;
        document.getElementById('maxXP').textContent = stats.maxCoreXP;
        document.getElementById('percentage').textContent = Math.min(stats.percentage, 100);

        // Show bonus XP if any
        const bonusXPEl = document.getElementById('bonusXPNote');
        if (bonusXPEl) {
            if (stats.bonusXP > 0) {
                bonusXPEl.textContent = `(includes ${stats.bonusXP} bonus XP)`;
                bonusXPEl.style.display = 'block';
            } else {
                bonusXPEl.style.display = 'none';
            }
        }

        // Update stars
        const starEl = document.getElementById('progressStar');
        if (starEl) {
            if (stats.percentage >= 100 && stats.bonusXP > 0) {
                starEl.textContent = '⭐⭐';
                starEl.style.display = 'inline';
            } else if (stats.percentage >= 100) {
                starEl.textContent = '⭐';
                starEl.style.display = 'inline';
            } else {
                starEl.style.display = 'none';
            }
        }

        // Update streaks
        document.getElementById('greenStreak').textContent = this.tracker.streaks.greenDay.current;
        document.getElementById('readingStreak').textContent = this.tracker.streaks.reading.current;
    }

    renderDailyHabits() {
        const log = this.tracker.getDailyLog();
        const habitsList = document.getElementById('dailyHabitsList');

        if (!habitsList) return;

        let html = '';

        // Brush teeth AM
        html += this.renderSimpleHabit('brushTeethAM', log.habits.brushTeethAM.checked);

        // Brush teeth PM
        html += this.renderSimpleHabit('brushTeethPM', log.habits.brushTeethPM.checked);

        // Be active
        html += this.renderHabitWithNote('beActive', log.habits.beActive.checked, log.habits.beActive.note);

        // Reading
        html += this.renderHabitWithSelectAndNote('reading', log.habits.reading.checked,
            log.habits.reading.select, log.habits.reading.note);

        // Supplements
        html += this.renderExpandableHabit('supplements', log.habits.supplements);

        // Water tracker
        html += this.renderWaterTracker(log.habits.water.value);

        // Caffeine tracker
        html += this.renderCaffeineTracker(log.habits.caffeine.value);

        habitsList.innerHTML = html;

        // Attach event listeners after rendering
        this.attachHabitListeners();
    }

    renderSimpleHabit(habitId, checked) {
        const structure = DAILY_HABITS_STRUCTURE[habitId];
        return `
            <div class="habit-item ${checked ? 'completed' : ''}" data-habit-id="${habitId}">
                <input type="checkbox" class="habit-checkbox" ${checked ? 'checked' : ''}>
                <span class="habit-name">${structure.name}</span>
            </div>
        `;
    }

    renderHabitWithNote(habitId, checked, noteValue) {
        const structure = DAILY_HABITS_STRUCTURE[habitId];
        return `
            <div class="habit-item ${checked ? 'completed' : ''}" data-habit-id="${habitId}">
                <div class="habit-main">
                    <input type="checkbox" class="habit-checkbox" ${checked ? 'checked' : ''}>
                    <span class="habit-name">${structure.name}</span>
                </div>
                <input type="text"
                       class="habit-note"
                       placeholder="${structure.note.placeholder}"
                       value="${noteValue || ''}"
                       data-field="note">
            </div>
        `;
    }

    renderHabitWithSelectAndNote(habitId, checked, selectValue, noteValue) {
        const structure = DAILY_HABITS_STRUCTURE[habitId];
        return `
            <div class="habit-item ${checked ? 'completed' : ''}" data-habit-id="${habitId}">
                <div class="habit-main">
                    <input type="checkbox" class="habit-checkbox" ${checked ? 'checked' : ''}>
                    <span class="habit-name">${structure.name}</span>
                </div>
                <select class="habit-select" data-field="select">
                    <option value="">Select class...</option>
                    ${structure.select.options.map(opt =>
            `<option value="${opt}" ${selectValue === opt ? 'selected' : ''}>${opt}</option>`
        ).join('')}
                </select>
                <input type="text"
                       class="habit-note"
                       placeholder="${structure.note.placeholder}"
                       value="${noteValue || ''}"
                       data-field="note">
            </div>
        `;
    }

    renderExpandableHabit(habitId, habitData) {
        const structure = DAILY_HABITS_STRUCTURE[habitId];
        const showCreatine = this.tracker.settings.creatineEnabled;

        return `
            <div class="habit-item ${habitData.checked ? 'completed' : ''}" data-habit-id="${habitId}">
                <div class="habit-main">
                    <input type="checkbox" class="habit-checkbox" ${habitData.checked ? 'checked' : ''}>
                    <span class="habit-name">${structure.name}</span>
                    <button class="expand-btn" data-expanded="false">▼</button>
                </div>
                <div class="expandable-content" style="display: none;">
                    ${structure.items.map(item => {
            if (item.id === 'creatine' && !showCreatine) return '';
            return `
                            <label class="supplement-item">
                                <input type="checkbox"
                                       data-supplement="${item.id}"
                                       ${habitData.items[item.id] ? 'checked' : ''}>
                                ${item.name}
                            </label>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    }

    renderWaterTracker(value) {
        const unit = this.tracker.settings.waterUnit;
        const goal = this.tracker.settings.waterGoal;
        const percentage = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;

        return `
            <div class="habit-item tracker-item" data-habit-id="water">
                <div class="tracker-main">
                    <span class="habit-name">💧 Water tracking</span>
                    <input type="number"
                           class="tracker-input"
                           value="${value}"
                           min="0"
                           placeholder="0">
                    <span class="tracker-unit">${unit}</span>
                </div>
                ${goal > 0 ? `
                    <div class="tracker-progress">
                        <div class="tracker-progress-bar" style="width: ${percentage}%"></div>
                    </div>
                    <div class="tracker-goal">Goal: ${goal} ${unit}</div>
                ` : ''}
            </div>
        `;
    }

    renderCaffeineTracker(value) {
        const unit = this.tracker.settings.caffeineUnit;
        const cap = this.tracker.settings.caffeineCap;
        const overCap = cap > 0 && value > cap;

        return `
            <div class="habit-item tracker-item ${overCap ? 'warning' : ''}" data-habit-id="caffeine">
                <div class="tracker-main">
                    <span class="habit-name">☕ Caffeine tracking</span>
                    <input type="number"
                           class="tracker-input"
                           value="${value}"
                           min="0"
                           placeholder="0">
                    <span class="tracker-unit">${unit}</span>
                </div>
                ${overCap ? `
                    <div class="warning-text">⚠️ Over recommended limit (${cap} ${unit})</div>
                ` : ''}
                ${cap > 0 && !overCap ? `
                    <div class="tracker-goal">${value}/${cap} ${unit}</div>
                ` : ''}
            </div>
        `;
    }

    attachHabitListeners() {
        // Simple checkboxes
        document.querySelectorAll('.habit-item:not([data-habit-id="supplements"]) .habit-checkbox').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const habitId = e.target.closest('.habit-item').dataset.habitId;
                this.tracker.toggleDailyHabit(habitId);
                this.renderDaily();
            });
        });

        // Habit notes and selects
        document.querySelectorAll('.habit-note, .habit-select').forEach(input => {
            input.addEventListener('change', (e) => {
                const habitItem = e.target.closest('.habit-item');
                const habitId = habitItem.dataset.habitId;
                const field = e.target.dataset.field;
                const value = e.target.value;

                const log = this.tracker.getDailyLog();
                log.habits[habitId][field] = value;
                this.tracker.saveDailyLogs();
            });
        });

        // Supplements expand button
        document.querySelectorAll('.expand-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const habitItem = e.target.closest('.habit-item');
                const content = habitItem.querySelector('.expandable-content');
                const isExpanded = e.target.dataset.expanded === 'true';

                if (isExpanded) {
                    content.style.display = 'none';
                    e.target.textContent = '▼';
                    e.target.dataset.expanded = 'false';
                } else {
                    content.style.display = 'block';
                    e.target.textContent = '▲';
                    e.target.dataset.expanded = 'true';
                }
            });
        });

        // Supplement items
        document.querySelectorAll('[data-supplement]').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const itemId = e.target.dataset.supplement;
                this.tracker.updateSupplementItem(itemId, e.target.checked);
                this.renderDaily();
            });
        });

        // Supplements main checkbox
        document.querySelector('[data-habit-id="supplements"] .habit-checkbox')?.addEventListener('change', (e) => {
            this.tracker.toggleDailyHabit('supplements');
            this.renderDaily();
        });

        // Water tracker
        const waterInput = document.querySelector('[data-habit-id="water"] .tracker-input');
        if (waterInput) {
            waterInput.addEventListener('change', (e) => {
                this.tracker.updateWater(e.target.value);
                this.renderDaily();
            });
        }

        // Caffeine tracker
        const caffeineInput = document.querySelector('[data-habit-id="caffeine"] .tracker-input');
        if (caffeineInput) {
            caffeineInput.addEventListener('change', (e) => {
                this.tracker.updateCaffeine(e.target.value);
                this.renderDaily();
            });
        }
    }

    renderNightRoutine() {
        const log = this.tracker.getDailyLog();
        const nr = log.nightRoutine;
        const isComplete = this.tracker.isNightRoutineComplete();

        const form = document.getElementById('nightRoutineForm');
        if (!form) return;

        form.innerHTML = `
            <div class="night-routine-header ${isComplete ? 'completed' : ''}">
                <h3>🌙 Night Log ${isComplete ? '✓' : ''}</h3>
                <p class="night-routine-note">All fields required to count toward daily progress</p>
            </div>

            <div class="form-group">
                <label>Short reflection *</label>
                <textarea id="nrReflection" rows="2" required>${nr.reflection}</textarea>
            </div>

            <div class="form-group">
                <label>Gratitude (min 1 line) *</label>
                <textarea id="nrGratitude" rows="2" required>${nr.gratitude}</textarea>
            </div>

            <div class="form-group">
                <label>1-3 goals for tomorrow *</label>
                <textarea id="nrGoals" rows="2" required>${nr.tomorrowGoals}</textarea>
            </div>

            <div class="form-group">
                <label>1 thing to be aware of *</label>
                <textarea id="nrAwareness" rows="2" required>${nr.awareness}</textarea>
            </div>

            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="nrAlarm" ${nr.alarmSet ? 'checked' : ''}>
                    Set alarm for tomorrow
                </label>
            </div>

            <div class="form-group">
                <label>Wake time (optional)</label>
                <input type="time" id="nrWakeTime" value="${nr.wakeTime}">
            </div>

            <button type="button" class="btn-primary" id="saveNightRoutine">Save Night Routine</button>
        `;

        // Attach save listener
        document.getElementById('saveNightRoutine')?.addEventListener('click', () => {
            this.tracker.updateNightRoutine({
                reflection: document.getElementById('nrReflection').value,
                gratitude: document.getElementById('nrGratitude').value,
                tomorrowGoals: document.getElementById('nrGoals').value,
                awareness: document.getElementById('nrAwareness').value,
                alarmSet: document.getElementById('nrAlarm').checked,
                wakeTime: document.getElementById('nrWakeTime').value
            });
            this.renderDaily();
            this.showMessage('Night routine saved! ✨');
        });
    }

    renderBonuses() {
        const log = this.tracker.getDailyLog();
        const bonusesList = document.getElementById('bonusesList');

        if (!bonusesList) return;

        let html = '';

        Object.entries(BONUS_ITEMS_STRUCTURE).forEach(([bonusId, structure]) => {
            const isUnlocked = this.tracker.checkBonusUnlocked(bonusId);
            const bonusData = log.bonuses[bonusId];

            if (!isUnlocked) {
                const prereq = DAILY_HABITS_STRUCTURE[structure.unlockedBy];
                html += `
                    <div class="bonus-item locked">
                        <span class="bonus-name">🔒 ${structure.name}</span>
                        <div class="unlock-hint">Unlocks when you complete: ${prereq.name}</div>
                    </div>
                `;
            } else {
                if (structure.type === 'timer') {
                    html += `
                        <div class="bonus-item ${bonusData.completed ? 'completed' : ''}">
                            <div class="bonus-main">
                                <input type="checkbox"
                                       class="bonus-checkbox"
                                       ${bonusData.completed ? 'checked' : ''}
                                       disabled>
                                <span class="bonus-name">${structure.name}</span>
                            </div>
                            <input type="number"
                                   class="bonus-timer"
                                   data-bonus="${bonusId}"
                                   value="${bonusData.minutes}"
                                   min="0"
                                   placeholder="Minutes">
                            <span class="bonus-xp">+${structure.xpValue} XP</span>
                        </div>
                    `;
                } else {
                    html += `
                        <div class="bonus-item ${bonusData.completed ? 'completed' : ''}" data-bonus="${bonusId}">
                            <input type="checkbox"
                                   class="bonus-checkbox"
                                   ${bonusData.completed ? 'checked' : ''}>
                            <span class="bonus-name">${structure.name}</span>
                            <span class="bonus-xp">+${structure.xpValue} XP</span>
                        </div>
                    `;
                }
            }
        });

        bonusesList.innerHTML = html;

        // Attach bonus listeners
        document.querySelectorAll('.bonus-item:not(.locked) .bonus-checkbox').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const bonusId = e.target.closest('.bonus-item').dataset.bonus;
                if (bonusId) {
                    this.tracker.toggleBonus(bonusId);
                    this.renderDaily();
                }
            });
        });

        document.querySelectorAll('.bonus-timer').forEach(input => {
            input.addEventListener('change', (e) => {
                const bonusId = e.target.dataset.bonus;
                this.tracker.updateBonusMinutes(bonusId, e.target.value);
                this.renderDaily();
            });
        });
    }

    renderCalendarHeatmap() {
        const heatmap = this.tracker.getCalendarHeatmap();
        const container = document.getElementById('calendarHeatmap');

        if (!container) return;

        let html = `<h3>${heatmap.month}</h3>`;
        html += '<div class="calendar-heatmap">';

        // Day labels
        html += '<div class="calendar-row">';
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            html += `<div class="calendar-day-label">${day}</div>`;
        });
        html += '</div>';

        // Days
        heatmap.weeks.forEach(week => {
            html += '<div class="calendar-row">';
            week.forEach(day => {
                if (day.date) {
                    html += `
                        <div class="calendar-day ${day.color} ${day.isToday ? 'today' : ''}"
                             title="${day.date}: ${day.percentage}%">
                            <span class="day-number">${day.day}</span>
                            ${day.hasDoubleStar ? '<span class="star">⭐⭐</span>' :
                            day.hasStar ? '<span class="star">⭐</span>' : ''}
                        </div>
                    `;
                } else {
                    html += '<div class="calendar-day empty"></div>';
                }
            });
            html += '</div>';
        });

        html += '</div>';

        container.innerHTML = html;
    }

    renderWeekly() {
        this.renderBusinessMomentum();
        this.renderRelationships();
        this.renderSkillGrowth();
    }

    renderBusinessMomentum() {
        const log = this.tracker.getWeeklyLog();
        const minutes = log.businessMomentum.minutes;
        const target = WEEKLY_TODOS_STRUCTURE.businessMomentum.target;
        const percentage = Math.min((minutes / target.max) * 100, 100);
        const isComplete = minutes >= target.min;
        const isBonus = minutes >= target.max;

        const container = document.getElementById('businessMomentum');
        if (!container) return;

        container.innerHTML = `
            <h3>💼 Business Momentum</h3>
            <p class="help-text">${WEEKLY_TODOS_STRUCTURE.businessMomentum.helpText}</p>

            <div class="business-input">
                <label>Total minutes this week:</label>
                <input type="number"
                       id="businessMinutes"
                       value="${minutes}"
                       min="0"
                       placeholder="0">
            </div>

            <div class="business-progress">
                <div class="progress-bar-container">
                    <div class="progress-bar ${isComplete ? 'success' : ''}"
                         style="width: ${percentage}%"></div>
                </div>
                <div class="business-status">
                    ${minutes}/${target.min}-${target.max} minutes
                    ${isBonus ? ' 🎉 Bonus reached!' : isComplete ? ' ✓ Target reached!' : ''}
                </div>
            </div>
        `;

        document.getElementById('businessMinutes')?.addEventListener('change', (e) => {
            this.tracker.updateBusinessMomentum(e.target.value);
            this.renderWeekly();
        });
    }

    renderRelationships() {
        const log = this.tracker.getWeeklyLog();
        const container = document.getElementById('relationships');

        if (!container) return;

        let html = '<h3>💬 Relationship Check-ins</h3><div class="relationship-list">';

        WEEKLY_TODOS_STRUCTURE.relationships.forEach(rel => {
            const checked = log.relationships[rel.id];
            html += `
                <label class="relationship-item ${checked ? 'completed' : ''}">
                    <input type="checkbox"
                           data-relationship="${rel.id}"
                           ${checked ? 'checked' : ''}>
                    ${rel.name}
                </label>
            `;
        });

        html += '</div>';
        container.innerHTML = html;

        document.querySelectorAll('[data-relationship]').forEach(cb => {
            cb.addEventListener('change', (e) => {
                this.tracker.toggleRelationship(e.target.dataset.relationship);
                this.renderWeekly();
            });
        });
    }

    renderSkillGrowth() {
        const log = this.tracker.getWeeklyLog();
        const container = document.getElementById('skillGrowth');

        if (!container) return;

        container.innerHTML = `
            <h3>🎯 Skill Growth</h3>
            <p class="help-text">Choose one skill to learn or practice this week</p>

            <select id="skillSelect">
                <option value="">Select a skill...</option>
                ${WEEKLY_TODOS_STRUCTURE.skillGrowth.options.map(opt =>
            `<option value="${opt}" ${log.skillGrowth.selected === opt ? 'selected' : ''}>${opt}</option>`
        ).join('')}
            </select>

            ${log.skillGrowth.selected === 'Other' ? `
                <input type="text"
                       id="skillCustom"
                       placeholder="Describe your skill..."
                       value="${log.skillGrowth.customValue}">
            ` : ''}

            ${log.skillGrowth.completed ? '<div class="skill-complete">✓ Skill selected!</div>' : ''}
        `;

        document.getElementById('skillSelect')?.addEventListener('change', (e) => {
            const value = e.target.value;
            this.tracker.updateSkillGrowth(value, '');
            this.renderWeekly();
        });

        document.getElementById('skillCustom')?.addEventListener('change', (e) => {
            this.tracker.updateSkillGrowth('Other', e.target.value);
        });
    }

    showSettingsModal() {
        const modal = document.getElementById('settingsModal');

        // Populate current settings
        document.getElementById('settingsWaterGoal').value = this.tracker.settings.waterGoal;
        document.getElementById('settingsWaterUnit').value = this.tracker.settings.waterUnit;
        document.getElementById('settingsCaffeineUnit').value = this.tracker.settings.caffeineUnit;
        document.getElementById('settingsCaffeineCap').value = this.tracker.settings.caffeineCap || '';
        document.getElementById('settingsCreatine').checked = this.tracker.settings.creatineEnabled;
        document.getElementById('settingsResetTime').value = this.tracker.settings.dailyResetTime;

        modal.classList.add('show');

        // Remove existing listeners to avoid duplicates
        const form = document.getElementById('settingsForm');
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);

        // Add save listener
        document.getElementById('settingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });

        // Add cancel listener
        document.getElementById('cancelSettings').addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    saveSettings() {
        const settings = {
            waterGoal: parseInt(document.getElementById('settingsWaterGoal').value) || 64,
            waterUnit: document.getElementById('settingsWaterUnit').value,
            caffeineUnit: document.getElementById('settingsCaffeineUnit').value,
            caffeineCap: parseInt(document.getElementById('settingsCaffeineCap').value) || 0,
            creatineEnabled: document.getElementById('settingsCreatine').checked,
            dailyResetTime: document.getElementById('settingsResetTime').value,
            completionThreshold: this.tracker.settings.completionThreshold
        };

        this.tracker.settings = settings;
        this.tracker.saveSettings();

        document.getElementById('settingsModal').classList.remove('show');
        this.renderDaily(); // Re-render to apply new settings
        this.showMessage('Settings saved! ⚙️');
    }

    showMessage(message) {
        // Simple toast message
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}

// ============================================
// INITIALIZE APP
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const tracker = new MomentumTracker();
    window.tracker = tracker; // For debugging
    const ui = new UIController(tracker);
    window.ui = ui; // For debugging
});
