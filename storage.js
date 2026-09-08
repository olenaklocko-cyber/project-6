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
    },
    
    deleteFoodEntry: function(date, index) {
        var entries = JSON.parse(localStorage.getItem('food_' + date) || '[]');
        if (index >= 0 && index < entries.length) {
            entries.splice(index, 1);
            localStorage.setItem('food_' + date, JSON.stringify(entries));
        }
    },
    
    // База страв з калорійністю на 100г
    foodDatabase: [
        // === Каші ===
        { name: 'Вівсяна каша', calories: 68, icon: '🥣', category: 'Каші' },
        { name: 'Рисова каша', calories: 130, icon: '🍚', category: 'Каші' },
        { name: 'Гречана каша', calories: 110, icon: '🥘', category: 'Каші' },
        { name: 'Пшоняна каша', calories: 90, icon: '🥣', category: 'Каші' },
        { name: 'Манна каша', calories: 100, icon: '🥣', category: 'Каші' },
        
        // === Молочні ===
        { name: 'Кефір 1%', calories: 40, icon: '🥛', category: 'Молочні' },
        { name: 'Йогурт натуральний', calories: 60, icon: '🥛', category: 'Молочні' },
        { name: 'Сир творожний', calories: 120, icon: '🧀', category: 'Молочні' },
        { name: 'Молоко 2.5%', calories: 52, icon: '🥛', category: 'Молочні' },
        { name: 'Сметана 15%', calories: 162, icon: '🥣', category: 'Молочні' },
        { name: 'Сир твердий', calories: 350, icon: '🧀', category: 'Молочні' },
        
        // === М'ясо ===
        { name: 'Куряча грудка', calories: 165, icon: '🍗', category: 'М\'ясо' },
        { name: 'Куряче стегно', calories: 209, icon: '🍗', category: 'М\'ясо' },
        { name: 'Яловичина', calories: 250, icon: '🥩', category: 'М\'ясо' },
        { name: 'Свинина нежирна', calories: 242, icon: '🥩', category: 'М\'ясо' },
        { name: 'Індичка', calories: 189, icon: '🦃', category: 'М\'ясо' },
        { name: 'Ковбаса варена', calories: 260, icon: '🌭', category: 'М\'ясо' },
        
        // === Риба ===
        { name: 'Лосось', calories: 208, icon: '🐟', category: 'Риба' },
        { name: 'Тунець', calories: 184, icon: '🐟', category: 'Риба' },
        { name: 'Тріска', calories: 82, icon: '🐟', category: 'Риба' },
        { name: 'Минтай', calories: 72, icon: '🐟', category: 'Риба' },
        { name: 'Скумбрія', calories: 262, icon: '🐟', category: 'Риба' },
        
        // === Овочі ===
        { name: 'Помідор', calories: 18, icon: '🍅', category: 'Овочі' },
        { name: 'Огірок', calories: 15, icon: '🥒', category: 'Овочі' },
        { name: 'Капуста', calories: 25, icon: '🥬', category: 'Овочі' },
        { name: 'Морква', calories: 41, icon: '🥕', category: 'Овочі' },
        { name: 'Буряк', calories: 43, icon: '🥕', category: 'Овочі' },
        { name: 'Картопля', calories: 77, icon: '🥔', category: 'Овочі' },
        { name: 'Брокколі', calories: 34, icon: '🥦', category: 'Овочі' },
        { name: 'Перець болгарський', calories: 27, icon: '🫑', category: 'Овочі' },
        { name: 'Цибуля', calories: 40, icon: '🧅', category: 'Овочі' },
        
        // === Фрукти ===
        { name: 'Яблуко', calories: 52, icon: '🍎', category: 'Фрукти' },
        { name: 'Банан', calories: 89, icon: '🍌', category: 'Фрукти' },
        { name: 'Апельсин', calories: 47, icon: '🍊', category: 'Фрукти' },
        { name: 'Виноград', calories: 69, icon: '🍇', category: 'Фрукти' },
        { name: 'Кавун', calories: 30, icon: '🍉', category: 'Фрукти' },
        { name: 'Полуниця', calories: 33, icon: '🍓', category: 'Фрукти' },
        { name: 'Груша', calories: 57, icon: '🍐', category: 'Фрукти' },
        { name: 'Персик', calories: 39, icon: '🍑', category: 'Фрукти' },
        
        // === Випічка ===
        { name: 'Хліб білий', calories: 265, icon: '🍞', category: 'Випічка' },
        { name: 'Хліб чорний', calories: 200, icon: '🍞', category: 'Випічка' },
        { name: 'Булочка', calories: 350, icon: '🥐', category: 'Випічка' },
        { name: 'Печиво', calories: 466, icon: '🍪', category: 'Випічка' },
        { name: 'Білий хліб тостовий', calories: 260, icon: '🍞', category: 'Випічка' },
        
        // === Яйця та сніданки ===
        { name: 'Яйце куряче', calories: 155, icon: '🥚', category: 'Яйця' },
        { name: 'Омлет з 2 яєць', calories: 154, icon: '🍳', category: 'Яйця' },
        { name: 'Яєчня', calories: 196, icon: '🍳', category: 'Яйця' },
        { name: 'Сирники', calories: 183, icon: '🥞', category: 'Яйця' },
        
        // === Напої ===
        { name: 'Сік апельсиновий', calories: 45, icon: '🍊', category: 'Напої' },
        { name: 'Чай без цукру', calories: 1, icon: '🍵', category: 'Напої' },
        { name: 'Кава без цукру', calories: 2, icon: '☕', category: 'Напої' },
        { name: 'Кава з молоком', calories: 50, icon: '☕', category: 'Напої' },
        { name: 'Какао', calories: 100, icon: '☕', category: 'Напої' },
        
        // === Солодощі ===
        { name: 'Шоколад молочний', calories: 535, icon: '🍫', category: 'Солодощі' },
        { name: 'Шоколад чорний', calories: 546, icon: '🍫', category: 'Солодощі' },
        { name: 'Цукерки', calories: 394, icon: '🍬', category: 'Солодощі' },
        { name: 'Мед', calories: 304, icon: '🍯', category: 'Солодощі' },
        { name: 'Варення', calories: 270, icon: '🍓', category: 'Солодощі' },
        
        // === Горіхи ===
        { name: 'Волоський горіх', calories: 654, icon: '🥜', category: 'Горіхи' },
        { name: 'Миндаль', calories: 579, icon: '🥜', category: 'Горіхи' },
        { name: 'Арахіс', calories: 567, icon: '🥜', category: 'Горіхи' },
        { name: 'Кеш\'ю', calories: 553, icon: '🥜', category: 'Горіхи' },
        
        // === Масла та соуси ===
        { name: 'Олія соняшникова', calories: 884, icon: '🫒', category: 'Масла' },
        { name: 'Оливкова олія', calories: 884, icon: '🫒', category: 'Масла' },
        { name: 'Масло вершкове', calories: 717, icon: '🧈', category: 'Масла' },
        { name: 'Майонез', calories: 680, icon: '🥄', category: 'Масла' },
        
        // === Страви ===
        { name: 'Борщ', calories: 49, icon: '🍲', category: 'Страви' },
        { name: 'Суп курячий', calories: 54, icon: '🍲', category: 'Страви' },
        { name: 'Плов', calories: 150, icon: '🥘', category: 'Страви' },
        { name: 'Паста варена', calories: 131, icon: '🍝', category: 'Страви' },
        { name: 'Піца', calories: 266, icon: '🍕', category: 'Страви' },
        { name: 'Бургер', calories: 295, icon: '🍔', category: 'Страви' },
        { name: 'Салат олів\'є', calories: 197, icon: '🥗', category: 'Страви' },
        { name: 'Вінегрет', calories: 102, icon: '🥗', category: 'Страви' },
        { name: 'Млинці', calories: 227, icon: '🥞', category: 'Страви' },
        { name: 'Вареники', calories: 210, icon: '🥟', category: 'Страви' },
        { name: 'Холодець', calories: 141, icon: '🍖', category: 'Страви' }
    ],
    
    getFoodCategories: function() {
        var categories = [];
        for (var i = 0; i < this.foodDatabase.length; i++) {
            var cat = this.foodDatabase[i].category;
            if (categories.indexOf(cat) === -1) {
                categories.push(cat);
            }
        }
        return categories;
    },
    
    getFoodByCategory: function(category) {
        return this.foodDatabase.filter(function(f) {
            return f.category === category;
        });
    },
    
    searchFood: function(query) {
        var q = query.toLowerCase();
        return this.foodDatabase.filter(function(f) {
            return f.name.toLowerCase().indexOf(q) !== -1;
        });
    },
    
    // База вправ з калоріями на хвилину (для ваги 60кг)
    exerciseDatabase: [
        // === Кардіо ===
        { name: 'Біг', calories: 11, icon: '🏃', category: 'Кардіо' },
        { name: 'Ходьба швидка', calories: 6, icon: '🚶', category: 'Кардіо' },
        { name: 'Ходьба повільна', calories: 3.5, icon: '🚶', category: 'Кардіо' },
        { name: 'Велосипед', calories: 8, icon: '🚴', category: 'Кардіо' },
        { name: 'Плавання', calories: 9, icon: '🏊', category: 'Кардіо' },
        { name: 'Стрибки на скакалці', calories: 12, icon: '🤸', category: 'Кардіо' },
        { name: 'Бігова доріжка', calories: 10, icon: '🏃', category: 'Кардіо' },
        { name: 'Еліпс', calories: 8, icon: '🚴', category: 'Кардіо' },
        { name: 'Сходинки', calories: 7, icon: '🚶', category: 'Кардіо' },
        { name: 'Танці', calories: 6, icon: '💃', category: 'Кардіо' },
        { name: 'Аеробіка', calories: 8, icon: '🤸', category: 'Кардіо' },
        { name: 'Скакалка', calories: 12, icon: '🤸', category: 'Кардіо' },
        { name: 'Біг на місці', calories: 10, icon: '🏃', category: 'Кардіо' },
        { name: 'Веслування', calories: 10, icon: '🚣', category: 'Кардіо' },
        { name: 'Гребний тренажер', calories: 9, icon: '🚣', category: 'Кардіо' },
        
        // === Силові ===
        { name: 'Присідання', calories: 7, icon: '💪', category: 'Силові' },
        { name: 'Випади', calories: 7, icon: '💪', category: 'Силові' },
        { name: 'Підтягування', calories: 9, icon: '💪', category: 'Силові' },
        { name: 'Віджимання', calories: 8, icon: '💪', category: 'Силові' },
        { name: 'Планка', calories: 5, icon: '💪', category: 'Силові' },
        { name: 'Жим лежачи', calories: 6, icon: '💪', category: 'Силові' },
        { name: 'Тяга вниз', calories: 6, icon: '💪', category: 'Силові' },
        { name: 'Розгинання рук', calories: 5, icon: '💪', category: 'Силові' },
        { name: 'Згинання рук', calories: 5, icon: '💪', category: 'Силові' },
        { name: 'Підйом ніг', calories: 5, icon: '💪', category: 'Силові' },
        { name: 'Скручування', calories: 5, icon: '💪', category: 'Силові' },
        { name: 'Махи ногами', calories: 5, icon: '💪', category: 'Силові' },
        { name: 'Жим ногами', calories: 7, icon: '💪', category: 'Силові' },
        { name: 'Тяга штанги', calories: 7, icon: '💪', category: 'Силові' },
        { name: 'Станова тяга', calories: 8, icon: '💪', category: 'Силові' },
        
        // === Розтяжка ===
        { name: 'Йога', calories: 4, icon: '🧘', category: 'Розтяжка' },
        { name: 'Пілатес', calories: 5, icon: '🧘', category: 'Розтяжка' },
        { name: 'Розтяжка', calories: 3, icon: '🧘', category: 'Розтяжка' },
        { name: 'Медитація', calories: 2, icon: '🧘', category: 'Розтяжка' },
        { name: 'Тай-чі', calories: 4, icon: '🧘', category: 'Розтяжка' },
        { name: 'Статичні вправи', calories: 3, icon: '🧘', category: 'Розтяжка' },
        { name: 'Баланс', calories: 3, icon: '🧘', category: 'Розтяжка' },
        
        // === Інтервальні ===
        { name: 'HIIT', calories: 14, icon: '🔥', category: 'Інтервальні' },
        { name: 'Табата', calories: 15, icon: '🔥', category: 'Інтервальні' },
        { name: 'Кросфіт', calories: 13, icon: '🔥', category: 'Інтервальні' },
        { name: 'Бурпі', calories: 12, icon: '🔥', category: 'Інтервальні' },
        { name: 'Джампінг джек', calories: 10, icon: '🔥', category: 'Інтервальні' },
        { name: 'Mountain climbers', calories: 11, icon: '🔥', category: 'Інтервальні' },
        { name: 'Біг по сходах', calories: 12, icon: '🔥', category: 'Інтервальні' },
        { name: 'Спринти', calories: 14, icon: '🔥', category: 'Інтервальні' },
        
        // === Спортивні ігри ===
        { name: 'Футбол', calories: 9, icon: '⚽', category: 'Ігри' },
        { name: 'Баскетбол', calories: 9, icon: '🏀', category: 'Ігри' },
        { name: 'Волейбол', calories: 7, icon: '🏐', category: 'Ігри' },
        { name: 'Теніс', calories: 8, icon: '🎾', category: 'Ігри' },
        { name: 'Бадмінтон', calories: 7, icon: '🏸', category: 'Ігри' },
        { name: 'Настільний теніс', calories: 5, icon: '🏓', category: 'Ігри' },
        { name: 'Боулінг', calories: 4, icon: '🎳', category: 'Ігри' },
        { name: 'Більярд', calories: 3, icon: '🎱', category: 'Ігри' },
        
        // === Побутові ===
        { name: 'Прибирання', calories: 4, icon: '🧹', category: 'Побутові' },
        { name: 'Миття підлоги', calories: 5, icon: '🧹', category: 'Побутові' },
        { name: 'Прасування', calories: 3, icon: '👔', category: 'Побутові' },
        { name: 'Миття вікон', calories: 4, icon: '🪟', category: 'Побутові' },
        { name: 'Садівництво', calories: 5, icon: '🌱', category: 'Побутові' },
        { name: 'Копання', calories: 7, icon: '🌱', category: 'Побутові' },
        { name: 'Ходьба з собакою', calories: 4, icon: '🐕', category: 'Побутові' },
        { name: 'Гра з дітьми', calories: 5, icon: '👶', category: 'Побутові' },
        { name: 'Підйом по сходах', calories: 8, icon: '🚶', category: 'Побутові' },
        { name: 'Перенесення речей', calories: 6, icon: '📦', category: 'Побутові' },
        
        // === Єдиноборства ===
        { name: 'Бокс', calories: 11, icon: '🥊', category: 'Єдиноборства' },
        { name: 'Кікбоксинг', calories: 12, icon: '🥊', category: 'Єдиноборства' },
        { name: 'ММА', calories: 13, icon: '🥊', category: 'Єдиноборства' },
        { name: 'Карате', calories: 8, icon: '🥋', category: 'Єдиноборства' },
        { name: 'Дзюдо', calories: 9, icon: '🥋', category: 'Єдиноборства' },
        { name: 'Тхеквондо', calories: 9, icon: '🥋', category: 'Єдиноборства' },
        { name: 'Фехтування', calories: 8, icon: '🤺', category: 'Єдиноборства' },
        { name: 'Йога гаряча', calories: 7, icon: '🧘', category: 'Єдиноборства' }
    ],
    
    getExerciseCategories: function() {
        var categories = [];
        for (var i = 0; i < this.exerciseDatabase.length; i++) {
            var cat = this.exerciseDatabase[i].category;
            if (categories.indexOf(cat) === -1) {
                categories.push(cat);
            }
        }
        return categories;
    },
    
    getExercisesByCategory: function(category) {
        return this.exerciseDatabase.filter(function(e) {
            return e.category === category;
        });
    },
    
    searchExercises: function(query) {
        var q = query.toLowerCase();
        return this.exerciseDatabase.filter(function(e) {
            return e.name.toLowerCase().indexOf(q) !== -1;
        });
    }
};
