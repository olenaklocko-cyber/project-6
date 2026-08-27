// ===== STORAGE — робота з localStorage =====

var Storage = {
    // Стандартні звички (не видаляються)
    defaultHabits: [
        { id: 1001, name: 'Присідання', description: 'Щоденна вправа для ніг', icon: '💪', unit: 'разів', goal: 50, isDefault: true },
        { id: 1002, name: 'Ранкова гімнастика', description: 'Зарядка на 10 хвилин', icon: '🧘', unit: 'хвилин', goal: 10, isDefault: true },
        { id: 1003, name: 'Прогулянка', description: 'Кроки на свіжому повітрі', icon: '🚶', unit: 'хвилин', goal: 30, isDefault: true },
        { id: 1004, name: 'Підтягування', description: 'Вправа для рук', icon: '🏋️', unit: 'разів', goal: 10, isDefault: true },
        { id: 1005, name: 'Планка', description: 'Вправа для преса', icon: '🤸', unit: 'хвилин', goal: 2, isDefault: true }
    ],
    
    // Отримати профіль
    getProfile: function() {
        var data = localStorage.getItem('sportTracker_profile');
        return data ? JSON.parse(data) : {
            gender: 'female',
            weight: 60,
            goal: 'Здоров\'я та форма'
        };
    },
    
    // Зберегти профіль
    saveProfile: function(profile) {
        localStorage.setItem('sportTracker_profile', JSON.stringify(profile));
    },
    
    // Отримати всі звички (стандартні + користувацькі)
    getHabits: function() {
        var custom = localStorage.getItem('sportTracker_habits');
        var customHabits = custom ? JSON.parse(custom) : [];
        return this.defaultHabits.concat(customHabits);
    },
    
    // Отримати тільки користувацькі звички
    getCustomHabits: function() {
        var data = localStorage.getItem('sportTracker_habits');
        return data ? JSON.parse(data) : [];
    },
    
    // Зберегти користувацькі звички
    saveCustomHabits: function(habits) {
        localStorage.setItem('sportTracker_habits', JSON.stringify(habits));
    },
    
    // Додати звичку
    addHabit: function(habit) {
        var habits = this.getCustomHabits();
        habit.id = Date.now();
        habit.createdAt = new Date().toISOString();
        habit.isDefault = false;
        habits.push(habit);
        this.saveCustomHabits(habits);
        return habit;
    },
    
    // Видалити звичку (тільки користувацькі)
    deleteHabit: function(id) {
        if (id >= 1000) return; // Стандартні не видаляються
        var habits = this.getCustomHabits();
        habits = habits.filter(function(h) { return h.id !== id; });
        this.saveCustomHabits(habits);
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
    
    // Кількість днів з активністю за місяць
    getMonthActiveDays: function(habitId) {
        var days = 0;
        var today = new Date();
        for (var i = 0; i < 30; i++) {
            var d = new Date(today);
            d.setDate(d.getDate() - i);
            var dateStr = this.formatDate(d);
            if (this.getCount(habitId, dateStr) > 0) {
                days++;
            }
        }
        return days;
    },
    
    // Дані для графіка по тижнях
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
    
    // Форматування дати
    formatDate: function(date) {
        return date.getFullYear() + '-' + 
               String(date.getMonth() + 1).padStart(2, '0') + '-' + 
               String(date.getDate()).padStart(2, '0');
    }
};
