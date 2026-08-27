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
    
    // Отримати кількість за день
    getCount: function(habitId, date) {
        var data = localStorage.getItem('sportTracker_count_' + habitId + '_' + date);
        return data ? parseInt(data) : 0;
    },
    
    // Встановити кількість
    setCount: function(habitId, date, count) {
        localStorage.setItem('sportTracker_count_' + habitId + '_' + date, count);
    },
    
    // Збільшити кількість
    incrementCount: function(habitId, date, amount) {
        var current = this.getCount(habitId, date);
        var newCount = Math.max(0, current + amount);
        this.setCount(habitId, date, newCount);
        return newCount;
    },
    
    // Загальна кількість за тиждень
    getWeekTotal: function(habitId) {
        var total = 0;
        var today = new Date();
        for (var i = 0; i < 7; i++) {
            var d = new Date(today);
            d.setDate(d.getDate() - i);
            var dateStr = this.formatDate(d);
            total += this.getCount(habitId, dateStr);
        }
        return total;
    },
    
    // Загальна кількість за місяць
    getMonthTotal: function(habitId) {
        var total = 0;
        var today = new Date();
        for (var i = 0; i < 30; i++) {
            var d = new Date(today);
            d.setDate(d.getDate() - i);
            var dateStr = this.formatDate(d);
            total += this.getCount(habitId, dateStr);
        }
        return total;
    },
    
    // Середня кількість за день (тиждень)
    getWeekAvg: function(habitId) {
        var total = this.getWeekTotal(habitId);
        return Math.round(total / 7 * 10) / 10;
    },
    
    // Дні з активністю за тиждень
    getWeekActiveDays: function(habitId) {
        var days = 0;
        var today = new Date();
        for (var i = 0; i < 7; i++) {
            var d = new Date(today);
            d.setDate(d.getDate() - i);
            var dateStr = this.formatDate(d);
            if (this.getCount(habitId, dateStr) > 0) {
                days++;
            }
        }
        return days;
    },
    
    // Дані для графіка по тижнях (останні 7 днів)
    getWeekChart: function(habitId) {
        var chart = [];
        var today = new Date();
        var dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        for (var i = 6; i >= 0; i--) {
            var d = new Date(today);
            d.setDate(d.getDate() - i);
            var dateStr = this.formatDate(d);
            chart.push({
                day: dayNames[d.getDay()],
                count: this.getCount(habitId, dateStr)
            });
        }
        return chart;
    },
    
    // Загальна статистика за сьогодні
    getTodaySummary: function() {
        var habits = this.getHabits();
        var today = this.formatDate(new Date());
        var summary = {
            total: 0,
            habits: []
        };
        
        for (var i = 0; i < habits.length; i++) {
            var count = this.getCount(habits[i].id, today);
            summary.total += count;
            summary.habits.push({
                id: habits[i].id,
                name: habits[i].name,
                icon: habits[i].icon,
                count: count,
                goal: habits[i].goal || 0
            });
        }
        
        return summary;
    },
    
    // Форматування дати
    formatDate: function(date) {
        return date.getFullYear() + '-' + 
               String(date.getMonth() + 1).padStart(2, '0') + '-' + 
               String(date.getDate()).padStart(2, '0');
    }
};
