// ===== STORAGE — блоки звичок =====

var Storage = {
    // Блоки звичок
    blocks: [
        {
            id: 'health',
            name: 'Базове здоров\'я',
            icon: '❤️',
            color: '#ff6b6b',
            habits: [
                { id: 2001, name: 'Водний баланс', description: 'Пити воду щогодини', icon: '💧', unit: 'літрів', goal: 2, isDefault: true },
                { id: 2002, name: 'Вітаміни', description: 'Приймати вітаміни', icon: '💊', unit: 'разів', goal: 1, isDefault: true },
                { id: 2003, name: 'Здоровий сон', description: 'Спати 7-8 годин', icon: '😴', unit: 'годин', goal: 8, isDefault: true }
            ]
        },
        {
            id: 'activity',
            name: 'Активність протягом дня',
            icon: '🏃',
            color: '#667eea',
            habits: [
                { id: 2004, name: 'Ранкова зарядка', description: 'Зарядка на 10 хвилин', icon: '🌅', unit: 'хвилин', goal: 10, isDefault: true },
                { id: 2005, name: 'Щоденна прогулянка', description: 'Прогулянка на свіжому повітрі', icon: '🚶', unit: 'хвилин', goal: 30, isDefault: true },
                { id: 2006, name: 'Кроки', description: 'Зробити 10 000 кроків', icon: '👣', unit: 'кроків', goal: 10000, isDefault: true },
                { id: 2007, name: 'Пробіжка', description: 'Бігати 20 хвилин', icon: '🏃', unit: 'хвилин', goal: 20, isDefault: true }
            ]
        },
        {
            id: 'strength',
            name: 'Силова база',
            icon: '💪',
            color: '#764ba2',
            habits: [
                { id: 2008, name: 'Присідання', description: 'З вагою тіла', icon: '🦵', unit: 'разів', goal: 50, isDefault: true },
                { id: 2009, name: 'Віджимання', description: 'Від підлоги', icon: '💪', unit: 'разів', goal: 20, isDefault: true },
                { id: 2010, name: 'Прес', description: 'Скручування', icon: '🏋️', unit: 'разів', goal: 30, isDefault: true }
            ]
        },
        {
            id: 'static',
            name: 'Статичні та відновлювальні',
            icon: '🧘',
            color: '#20c997',
            habits: [
                { id: 2011, name: 'Планка', description: 'Тримати планку', icon: '🤸', unit: 'хвилин', goal: 2, isDefault: true },
                { id: 2012, name: 'Розтяжка', description: 'Розтягувати м\'язи', icon: '🧘', unit: 'хвилин', goal: 10, isDefault: true },
                { id: 2013, name: 'Йога', description: 'Комплекс вправ', icon: '🕉️', unit: 'хвилин', goal: 15, isDefault: true },
                { id: 2014, name: 'Дихальна гімнастика', description: 'Або медитація', icon: '🕯️', unit: 'хвилин', goal: 10, isDefault: true }
            ]
        },
        {
            id: 'nutrition',
            name: 'Контроль харчування та ваги',
            icon: '🍎',
            color: '#ffa502',
            habits: [
                { id: 2015, name: 'Контроль ваги', description: 'Зважуватися вранці', icon: '⚖️', unit: 'разів', goal: 1, isDefault: true },
                { id: 2016, name: 'Без цукру', description: 'Не їсти солодке', icon: '🚫', unit: 'разів', goal: 1, isDefault: true },
                { id: 2017, name: 'Без фаст-фуду', description: 'Не їсти фаст-фуд', icon: '🍔', unit: 'разів', goal: 1, isDefault: true }
            ]
        }
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
    
    saveProfile: function(profile) {
        localStorage.setItem('sportTracker_profile', JSON.stringify(profile));
    },
    
    // Отримати всі звички (плоский список)
    getAllHabits: function() {
        var all = [];
        for (var i = 0; i < this.blocks.length; i++) {
            for (var j = 0; j < this.blocks[i].habits.length; j++) {
                all.push(this.blocks[i].habits[j]);
            }
        }
        var custom = this.getCustomHabits();
        return all.concat(custom);
    },
    
    // Отримати блоки
    getBlocks: function() {
        return this.blocks;
    },
    
    // Отримати користувацькі звички
    getCustomHabits: function() {
        var data = localStorage.getItem('sportTracker_habits');
        return data ? JSON.parse(data) : [];
    },
    
    saveCustomHabits: function(habits) {
        localStorage.setItem('sportTracker_habits', JSON.stringify(habits));
    },
    
    addHabit: function(habit) {
        var habits = this.getCustomHabits();
        habit.id = Date.now();
        habit.isDefault = false;
        habits.push(habit);
        this.saveCustomHabits(habits);
        return habit;
    },
    
    deleteHabit: function(id) {
        var habits = this.getCustomHabits();
        habits = habits.filter(function(h) { return h.id !== id; });
        this.saveCustomHabits(habits);
    },
    
    // Робота з лічильниками
    getCount: function(habitId, date) {
        var data = localStorage.getItem('sportTracker_count_' + habitId + '_' + date);
        return data ? parseInt(data) : 0;
    },
    
    setCount: function(habitId, date, count) {
        localStorage.setItem('sportTracker_count_' + habitId + '_' + date, count);
    },
    
    incrementCount: function(habitId, date, amount) {
        var current = this.getCount(habitId, date);
        var newCount = Math.max(0, current + amount);
        this.setCount(habitId, date, newCount);
        return newCount;
    },
    
    getWeekTotal: function(habitId) {
        var total = 0;
        var today = new Date();
        for (var i = 0; i < 7; i++) {
            var d = new Date(today);
            d.setDate(d.getDate() - i);
            total += this.getCount(habitId, this.formatDate(d));
        }
        return total;
    },
    
    getBlockProgress: function(blockId, date) {
        var block = null;
        for (var i = 0; i < this.blocks.length; i++) {
            if (this.blocks[i].id === blockId) {
                block = this.blocks[i];
                break;
            }
        }
        if (!block) return 0;
        
        var totalGoal = 0;
        var totalDone = 0;
        
        for (var i = 0; i < block.habits.length; i++) {
            var goal = block.habits[i].goal || 0;
            if (goal > 0) {
                totalGoal += goal;
                totalDone += Math.min(this.getCount(block.habits[i].id, date), goal);
            }
        }
        
        return totalGoal > 0 ? Math.round((totalDone / totalGoal) * 100) : 0;
    },
    
    getDayProgress: function(date) {
        var totalGoal = 0;
        var totalDone = 0;
        
        for (var b = 0; b < this.blocks.length; b++) {
            for (var i = 0; i < this.blocks[b].habits.length; i++) {
                var goal = this.blocks[b].habits[i].goal || 0;
                if (goal > 0) {
                    totalGoal += goal;
                    totalDone += Math.min(this.getCount(this.blocks[b].habits[i].id, date), goal);
                }
            }
        }
        
        return totalGoal > 0 ? Math.round((totalDone / totalGoal) * 100) : 0;
    },
    
    formatDate: function(date) {
        return date.getFullYear() + '-' + 
               String(date.getMonth() + 1).padStart(2, '0') + '-' + 
               String(date.getDate()).padStart(2, '0');
    },
    
    // Записи їжі
    addFoodEntry: function(entry) {
        var today = this.formatDate(new Date());
        var entries = JSON.parse(localStorage.getItem('food_' + today) || '[]');
        entries.push(entry);
        localStorage.setItem('food_' + today, JSON.stringify(entries));
    },
    
    getFoodEntries: function(date) {
        return JSON.parse(localStorage.getItem('food_' + date) || '[]');
    }
};
