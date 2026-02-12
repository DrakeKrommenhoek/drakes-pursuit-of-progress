# 🎯 Habit Tracker Dashboard

A beautiful, interactive habit tracking dashboard that helps you build better habits with XP points, streaks, and celebrations!

## 🚀 How to Use

### Getting Started

1. **Open the dashboard:**
   - Double-click `index.html` to open it in your web browser
   - That's it! No installation needed.

2. **Your first day:**
   - You'll see 6 starter habits already set up
   - Click the checkboxes to mark habits as complete
   - Watch your progress bar fill up as you earn XP!

### Features Explained

#### ✅ Daily Checklist
- Check off habits as you complete them throughout the day
- Each habit is worth XP points (experience points)
- Progress bar shows your daily completion percentage
- Reach 80% to complete the day and build your streak!

#### 🔥 Streak Counter
- Complete a day (reach 80% XP) to start a streak
- Keep completing days to extend your streak
- Weekends don't break your streak by default
- Get celebration messages at 7-day and 30-day milestones!

#### 📅 Weekly View
- See your progress for Monday through Friday
- Days with ✓ means you reached 80% that day
- Toggle "Track Sat/Sun too" to include weekends
- Weekly total shows combined XP for the week

#### 📈 Monthly Stats
- **Days Completed:** How many days you reached 80%+
- **Total XP:** All experience points earned this month
- **Best Streak:** Your longest streak this month

#### 🎉 Celebrations
- Complete a day → Get an encouraging message!
- 7-day streak → Special celebration!
- 30-day streak → Hall of fame status!

### Managing Your Habits

#### Add a New Habit
1. Click the "+ Add New Habit" button
2. Enter the habit name (e.g., "Drink water")
3. Enter XP value (1-100)
4. Click "Save Habit"

**XP Tips:**
- Harder habits: 20-25 XP
- Medium habits: 15 XP
- Easy habits: 10 XP
- Keep daily total around 100 XP for easy math

#### Edit a Habit
1. Click the "Edit" button next to any habit
2. Change the name or XP value
3. Click "Save Habit"

#### Delete a Habit
1. Click the "Delete" button next to any habit
2. Confirm deletion
3. The habit is removed (but past data is preserved)

## 📊 Scoring System

### How XP Works
- Each habit has an XP value (you set this)
- When you check a habit, you earn its XP
- **Daily Total** = Sum of all checked habits
- **Daily Max** = Sum of all active habits

**Example:**
- You have 5 habits: 20, 15, 15, 25, 25 XP
- Daily max = 100 XP
- You complete 3 habits (20 + 15 + 25) = 60 XP
- Today's score: 60/100 (60%)

### Completion Rules
- A day is "complete" when you reach **80% or more** of max XP
- Complete days show a checkmark ✓
- Complete days count toward your streak
- Below 80% doesn't break your streak, but doesn't count as complete

### Streak Rules
1. ✅ Complete today (80%+) → Streak starts or continues
2. ❌ Miss a day (below 80%) → Streak resets to 0
3. 🎮 Weekends (default): Don't affect streak
4. 📅 Weekend tracking ON: Must complete weekends too

## 💾 Data Storage

- All your data is saved automatically in your browser
- Data persists even if you close the browser
- Works completely offline - no internet needed
- Private - nothing is sent to any server

**Clearing Data:**
If you want to start fresh, open your browser's Developer Tools (F12) and run:
```javascript
localStorage.clear()
```
Then refresh the page.

## 📱 Mobile Friendly

The dashboard works great on phones and tablets! The layout automatically adjusts to fit your screen size.

## 🎨 Customization Ideas

Want to customize? Here are some easy tweaks:

### Change Completion Threshold
In `script.js`, find:
```javascript
completionThreshold: 80
```
Change `80` to any number (e.g., `70` for easier, `90` for harder)

### Change Colors
In `styles.css`, look for color codes like:
- `#667eea` (purple) - Main color
- `#764ba2` (darker purple) - Gradient color
- `#4caf50` (green) - Completion color

Replace with your favorite colors!

### Adjust Streak Milestones
In `script.js`, find the `showCelebration` function and edit the messages or add new milestones.

## 🐛 Troubleshooting

**Progress bar not updating?**
- Make sure JavaScript is enabled in your browser
- Try refreshing the page (F5)

**Data disappeared?**
- Check if you cleared browser data/cookies
- Data is stored per browser, so switching browsers means starting fresh

**Checkboxes not working?**
- Make sure you're opening the HTML file directly (not viewing the code)
- Try a different browser (Chrome, Firefox, Edge)

## 📝 Tips for Success

1. **Start small:** Don't add too many habits at once
2. **Be realistic:** Set XP values that match actual difficulty
3. **Check daily:** Make it part of your morning or evening routine
4. **Celebrate wins:** Enjoy those celebration messages!
5. **Adjust as needed:** Edit habits that aren't working for you
6. **Track what matters:** Focus on habits that align with your goals

## 🎯 Example Habit Sets

### Morning Routine (100 XP total)
- Wake up at 6 AM (15 XP)
- Drink water (10 XP)
- Exercise 30 min (25 XP)
- Healthy breakfast (15 XP)
- Meditate (15 XP)
- Plan the day (10 XP)
- Make bed (10 XP)

### Productivity Focus (100 XP total)
- Deep work 2 hours (30 XP)
- No social media before noon (20 XP)
- Inbox zero (15 XP)
- Learn something new (15 XP)
- Review daily goals (10 XP)
- Clean workspace (10 XP)

### Health & Wellness (100 XP total)
- 10,000 steps (20 XP)
- Drink 8 glasses of water (15 XP)
- No junk food (25 XP)
- 7+ hours sleep (20 XP)
- Stretch/yoga (10 XP)
- Take vitamins (10 XP)

## 🌟 Enjoy Your Journey!

Building habits takes time. Be patient with yourself, celebrate small wins, and remember: consistency beats perfection!

You've got this! 💪
