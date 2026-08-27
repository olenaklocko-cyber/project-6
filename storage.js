// ===== STORAGE — робота з localStorage =====

var Storage = {
    // Отримати всі звички
    getHabits: function() {
        var data = localStorage.getItem('sportTracker_habits');
        return data ? JSON.parse(data) : [];
    },
    
    // Зберегти звички
    saveHabits: function(habits) {
        localStorage.setItem('sportTracker_habits', JSON.stringify(habits));
    },
    
    // Додати звичку
    addHabit: function(habit) {
        var habits = this.getHabits();
        habit.id = Date.now();
        habit.createdAt = new Date().toISOString();
        habits.push(habit);
        this.saveHabits(habits);
        return habit;
    },
    
    // Видалити звичку
    deleteHabit: function(id) {
        var habits = this.getHabits();
        habits = habits.filter(function(h) { return h.id !== id; });
        this.saveHabits(habits);
    },
    
    // Отримати відмітки за день
    getCompleted: function(date) {
        var data = localStorage.getItem('sportTracker_completed_' + date);
        return data ? JSON.parse(data) : [];
    },
    
    // Відмітити/зняти відмітку
    toggleCompleted: function(habitId, date) {
        var completed = this.getCompleted(date);
        var index = completed.indexOf(habitId);
        if (index === -1) {
            completed.push(habitId);
        } else {
            completed.splice(index, 1);
        }
        localStorage.setItem('sportTracker_completed_' + date, JSON.stringify(completed));
        return index === -1; // true = додано, false = видалено
    },
    
    // Отримати серію (streak) для звички
    getStreak: function(habitId) {
        var streak = 0;
        var today = new Date();
        for (var i = 0; i < 365; i++) {
            var d = new Date(today);
            d.setDate(d.getDate() - i);
            var dateStr = this.formatDate(d);
            var completed = this.getCompleted(dateStr);
            if (completed.indexOf(habitId) !== -1) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }
        return streak;
    },
    
    // Відсоток виконання за тиждень
    getWeekPercent: function(habitId) {
        var completed = 0;
        var today = new Date();
        for (var i = 0; i < 7; i++) {
            var d = new Date(today);
            d.setDate(d.getDate() - i);
            var dateStr = this.formatDate(d);
            var dayCompleted = this.getCompleted(dateStr);
            if (dayCompleted.indexOf(habitId) !== -1) {
                completed++;
            }
        }
        return Math.round((completed / 7) * 100);
    },
    
    // Відсоток виконання за місяць
    getMonthPercent: function(habitId) {
        var completed = 0;
        var today = new Date();
        for (var i = 0; i < 30; i++) {
            var d = new Date(today);
            d.setDate(d.getDate() - i);
            var dateStr = this.formatDate(d);
            var dayCompleted = this.getCompleted(dateStr);
            if (dayCompleted.indexOf(habitId) !== -1) {
                completed++;
            }
        }
        return Math.round((completed / 30) * 100);
    },
    
    // Дані для графіка по тижнях (останні 7 днів)
    getWeekChart: function() {
        var chart = [];
        var today = new Date();
        var dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        for (var i = 6; i >= 0; i--) {
            var d = new Date(today);
            d.setDate(d.getDate() - i);
            var dateStr = this.formatDate(d);
            var completed = this.getCompleted(dateStr).length;
            var habits = this.getHabits().length;
            chart.push({
                day: dayNames[d.getDay()],
                percent: habits > 0 ? Math.round((completed / habits) * 100) : 0
            });
        }
        return chart;
    },
    
    // Форматування дати
    formatDate: function(date) {
        return date.getFullYear() + '-' + 
               String(date.getMonth() + 1).padStart(2, '0') + '-' + 
               String(date.getDate()).padStart(2, '0');
    }
};
