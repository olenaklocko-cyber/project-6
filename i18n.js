// Система перекладів (i18n)
var I18n = {
    currentLang: 'uk',
    
    translations: {
        uk: {
            // Загальне
            appTitle: 'Трекер «Мій ритм життя»',
            save: 'Зберегти',
            cancel: 'Скасувати',
            delete: 'Видалити',
            add: 'Додати',
            search: 'Пошук',
            loading: 'Завантаження...',
            
            // Навігація
            navHome: 'Головна',
            navStats: 'Статистика',
            navAdd: 'Додати',
            navProfile: 'Профіль',
            
            // Головна
            cameraTitle: 'Сфотографувати порцію',
            cameraSubtitle: 'Зроби фото їжі для миттєвого AI-аналізу калорій',
            galleryBtn: '🖼️',
            todayEntries: 'Сьогоднішні записи',
            noEntries: 'Ще немає записів',
            noEntriesHint: 'Сфотографуй їжу!',
            totalToday: 'Всього сьогодні:',
            remaining: 'Залишилось:',
            caloriesPerDay: 'ккал/день',
            kcal: 'ккал',
            aiRecognized: 'AI розпізнав страву',
            close: 'Закрити',
            selectFood: 'Обери страви',
            total: 'Разом',
            category: 'Категорія',
            selectThisFood: 'Обрати цю страву',
            
            // Категорії їжі
            catPorridge: 'Каші',
            catDairy: 'Молочні',
            catMeat: 'М\'ясо',
            catFish: 'Риба',
            catVegetables: 'Овочі',
            catFruits: 'Фрукти',
            catBakery: 'Випічка',
            catEggs: 'Яйця',
            catDrinks: 'Напої',
            catSweets: 'Солодощі',
            catNuts: 'Горіхи',
            catOils: 'Масла',
            catDishes: 'Страви',
            
            // Додавання їжі
            searchFood: '🔍 Знайти страву...',
            customFood: '✍️ Своя страва',
            customFoodName: 'Назва страви',
            customFoodNamePlaceholder: 'Наприклад: Жарена риба',
            customFoodCal: 'Калорії на 100г',
            customFoodCalPlaceholder: 'Наприклад: 180',
            customFoodGrams: 'Порція (грами)',
            customFoodGramsPlaceholder: 'Наприклад: 200',
            caloriesBurned: 'кілокалорій',
            addRecord: 'Додати запис',
            selectFoodFirst: 'Спочатку обери страву з переліку!',
            enterGrams: 'Введи кількість грамів!',
            foodAdded: 'Страву додано!',
            
            // Вправи
            searchExercise: '🔍 Знайти вправу...',
            customExercise: '✍️ Своя вправа',
            customExerciseName: 'Назва вправи',
            customExerciseNamePlaceholder: 'Наприклад: Танці з собакою',
            customExerciseCal: 'Калорії на хвилину',
            customExerciseCalPlaceholder: 'Наприклад: 8',
            customExerciseTime: 'Час (хвилини)',
            customExerciseTimePlaceholder: 'Скільки хвилин займалась',
            caloriesPerMinute: 'ккал/хв',
            selectExerciseFirst: 'Спочатку обери вправу з переліку!',
            enterMinutes: 'Введи кількість хвилин!',
            exerciseAdded: 'Вправу додано!',
            exerciseBurned: 'ккал спалено',
            
            // Статистика
            todayProgress: 'Сьогоднішній прогрес',
            totalCompleted: 'всього виконано',
            blockProgress: 'Прогрес по блоках',
            weeklyActivity: 'Активність за тиждень',
            
            // Категорії вправ
            exCatCardio: 'Кардіо',
            exCatStrength: 'Силові',
            exCatFlexibility: 'Розтяжка',
            exCatInterval: 'Інтервальні',
            exCatGames: 'Ігри',
            exCatHousehold: 'Побутові',
            exCatMartial: 'Єдиноборства',
            
            // Блоки статистики
            blockHealth: 'Базове здоров\'я',
            blockActivity: 'Активність протягом дня',
            blockStrength: 'Силова база',
            blockStatic: 'Статичні та відновлювальні',
            blockWater: 'Вода та харчування',
            blockSleep: 'Сон та відпочинок',
            blockMood: 'Настрій та думки',
            blockMorning: 'Ранкові звички',
            blockEvening: 'Вечірні звички',
            blockMind: 'Розум та натхнення',
            
            // Звички
            habitSleep78: 'Спати 7-8 годин',
            habitWater2L: 'Випити 2л води',
            habitWalk30: 'Прогулянка 30 хв',
            habitFruit: 'З\'їсти фрукт',
            habitVegies: 'З\'їсти овочі',
            habitActive10k: '10 000 кроків',
            habitNoSugar: 'Без цукру',
            habitNoFastFood: 'Без фастфуду',
            habitWalk: 'Прогулянка',
            habitMorningCharge: 'Зарядка на 10 хвилин',
            habitDailyWalk: 'Прогулянка на свіжому повітрі',
            habitSteps: 'Зробити 10 000 кроків',
            habitJog: 'Бігати 20 хвилин',
            habitSquats: 'З вагою тіла',
            habitPushups: 'Від підлоги',
            habitAbs: 'Скручування',
            habitMoodGood: 'Добрий',
            habitMoodNeutral: 'Нейтральний',
            habitMoodBad: 'Поганий',
            habitMeditate: '10 хвилин',
            habitRead: '10 сторінок',
            habitWater: 'Склянка води',
            habitVitamin: 'Вітаміни',
            habitTeaHerbal: 'Трав\'яний чай',
            habitCleanSpace: 'Чисте робоче місце',
            habitJournal: 'Щоденник',
            habitStretch: 'Розтяжка',
            habitRelax: 'Без гаджетів',
            habitGratitude: '3 речі за вдячністю',
            habitPlanDay: 'План на завтра',
            
            // Профіль
            myProfile: 'Мій профіль',
            activeDays: 'Активний',
            days: 'днів',
            startJourney: 'Почни свій шлях!',
            perWeek: 'за тиждень',
            weekTotal: 'за тиждень',
            myGoal: 'Моя мета',
            settings: 'Налаштування',
            gender: 'Стать',
            female: 'Жінка',
            male: 'Чоловік',
            woman: 'Жінка',
            man: 'Чоловік',
            weight: 'Вага',
            kg: 'кг',
            height: 'Зріст',
            cm: 'см',
            age: 'Вік',
            years: 'років',
            bmr: 'Базовий метаболізм',
            activityFactor: 'Коефіцієнт активності',
            goal: 'Мета',
            goalPlaceholder: 'Наприклад: Схуднути на 5 кг',
            goalHealth: 'Здоров\'я та форма',
            saveChanges: 'Зберегти зміни',
            saved: '✓ Збережено!',
            language: 'Мова',
            motivationText: 'Кожен крок наближає тебе до мети!',
            times: 'разів',
            
            // Дні тижня
            sun: 'Нд',
            mon: 'Пн',
            tue: 'Вт',
            wed: 'Ср',
            thu: 'Чт',
            fri: 'Пт',
            sat: 'Сб',
            
            // Місяці
            jan: 'січ',
            feb: 'лют',
            mar: 'бер',
            apr: 'кві',
            may: 'трав',
            jun: 'чер',
            jul: 'лип',
            aug: 'сер',
            sep: 'вер',
            oct: 'жов',
            nov: 'лис',
            dec: 'груд'
        },
        
        en: {
            // General
            appTitle: 'My Life Rhythm Tracker',
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            add: 'Add',
            search: 'Search',
            loading: 'Loading...',
            
            // Navigation
            navHome: 'Home',
            navStats: 'Statistics',
            navAdd: 'Add',
            navProfile: 'Profile',
            
            // Home
            cameraTitle: 'Scan a meal',
            cameraSubtitle: 'Take a photo for instant AI calorie analysis',
            galleryBtn: '🖼️',
            todayEntries: 'Today\'s entries',
            noEntries: 'No entries yet',
            noEntriesHint: 'Take a photo of your food!',
            totalToday: 'Total today:',
            remaining: 'Remaining:',
            caloriesPerDay: 'cal/day',
            kcal: 'kcal',
            aiRecognized: 'AI recognized the dish',
            close: 'Close',
            selectFood: 'Select dishes',
            total: 'Total',
            category: 'Category',
            selectThisFood: 'Select this food',
            
            // Food categories
            catPorridge: 'Porridge',
            catDairy: 'Dairy',
            catMeat: 'Meat',
            catFish: 'Fish',
            catVegetables: 'Vegetables',
            catFruits: 'Fruits',
            catBakery: 'Bakery',
            catEggs: 'Eggs',
            catDrinks: 'Drinks',
            catSweets: 'Sweets',
            catNuts: 'Nuts',
            catOils: 'Oils',
            catDishes: 'Dishes',
            
            // Adding food
            searchFood: '🔍 Search food...',
            customFood: '✍️ Custom food',
            customFoodName: 'Food name',
            customFoodNamePlaceholder: 'e.g. Grilled fish',
            customFoodCal: 'Calories per 100g',
            customFoodCalPlaceholder: 'e.g. 180',
            customFoodGrams: 'Portion (grams)',
            customFoodGramsPlaceholder: 'e.g. 200',
            caloriesBurned: 'kilocalories',
            addRecord: 'Add record',
            selectFoodFirst: 'Please select a food first!',
            enterGrams: 'Enter the amount in grams!',
            foodAdded: 'Food added!',
            
            // Exercises
            searchExercise: '🔍 Search exercise...',
            customExercise: '✍️ Custom exercise',
            customExerciseName: 'Exercise name',
            customExerciseNamePlaceholder: 'e.g. Dancing with dog',
            customExerciseCal: 'Calories per minute',
            customExerciseCalPlaceholder: 'e.g. 8',
            customExerciseTime: 'Duration (minutes)',
            customExerciseTimePlaceholder: 'How many minutes',
            caloriesPerMinute: 'cal/min',
            selectExerciseFirst: 'Please select an exercise first!',
            enterMinutes: 'Enter the duration in minutes!',
            exerciseAdded: 'Exercise added!',
            exerciseBurned: 'cal burned',
            
            // Statistics
            todayProgress: 'Today\'s progress',
            totalCompleted: 'completed',
            blockProgress: 'Progress by blocks',
            weeklyActivity: 'Weekly activity',
            
            // Exercise categories
            exCatCardio: 'Cardio',
            exCatStrength: 'Strength',
            exCatFlexibility: 'Flexibility',
            exCatInterval: 'Interval',
            exCatGames: 'Games',
            exCatHousehold: 'Household',
            exCatMartial: 'Martial Arts',
            
            // Statistics blocks
            blockHealth: 'Basic Health',
            blockActivity: 'Daily Activity',
            blockStrength: 'Strength Base',
            blockStatic: 'Static & Recovery',
            blockWater: 'Water & Nutrition',
            blockSleep: 'Sleep & Rest',
            blockMood: 'Mood & Thoughts',
            blockMorning: 'Morning Habits',
            blockEvening: 'Evening Habits',
            blockMind: 'Mind & Inspiration',
            
            // Звички
            habitSleep78: 'Спати 7-8 годин',
            habitWater2L: 'Випити 2л води',
            habitWalk30: 'Прогулянка 30 хв',
            habitFruit: 'З\'їсти фрукт',
            habitVegies: 'З\'їсти овочі',
            habitActive10k: '10 000 кроків',
            habitNoSugar: 'Без цукру',
            habitNoFastFood: 'Без фастфуду',
            habitWalk: 'Прогулянка',
            habitMorningCharge: 'Зарядка на 10 хвилин',
            habitDailyWalk: 'Прогулянка на свіжому повітрі',
            habitSteps: 'Зробити 10 000 кроків',
            habitJog: 'Бігати 20 хвилин',
            habitSquats: 'З вагою тіла',
            habitPushups: 'Від підлоги',
            habitAbs: 'Скручування',
            habitMoodGood: 'Добрий',
            habitMoodNeutral: 'Нейтральний',
            habitMoodBad: 'Поганий',
            habitMeditate: '10 хвилин',
            habitRead: '10 сторінок',
            habitWater: 'Склянка води',
            habitVitamin: 'Вітаміни',
            habitTeaHerbal: 'Трав\'яний чай',
            habitCleanSpace: 'Чисте робоче місце',
            habitJournal: 'Щоденник',
            habitStretch: 'Розтяжка',
            habitRelax: 'Без гаджетів',
            habitGratitude: '3 речі за вдячністю',
            habitPlanDay: 'План на завтра',
            
            // Profile
            myProfile: 'My Profile',
            activeDays: 'Active',
            days: 'days',
            startJourney: 'Start your journey!',
            perWeek: 'this week',
            weekTotal: 'this week',
            myGoal: 'My Goal',
            settings: 'Settings',
            gender: 'Gender',
            female: 'Woman',
            male: 'Man',
            woman: 'Woman',
            man: 'Man',
            weight: 'Weight',
            kg: 'kg',
            height: 'Height',
            cm: 'cm',
            age: 'Age',
            years: 'years',
            bmr: 'Basal Metabolic Rate',
            activityFactor: 'Activity Factor',
            goal: 'Goal',
            goalPlaceholder: 'e.g. Lose 5 kg',
            goalHealth: 'Health & fitness',
            saveChanges: 'Save changes',
            saved: '✓ Saved!',
            language: 'Language',
            motivationText: 'Every step brings you closer to your goal!',
            times: 'times',
            
            // Days of week
            sun: 'Sun',
            mon: 'Mon',
            tue: 'Tue',
            wed: 'Wed',
            thu: 'Thu',
            fri: 'Fri',
            sat: 'Sat',
            
            // Months
            jan: 'Jan',
            feb: 'Feb',
            mar: 'Mar',
            apr: 'Apr',
            may: 'May',
            jun: 'Jun',
            jul: 'Jul',
            aug: 'Aug',
            sep: 'Sep',
            oct: 'Oct',
            nov: 'Nov',
            dec: 'Dec'
        }
    },
    
    // Визначення мови пристрою
    detectLanguage: function() {
        var savedLang = localStorage.getItem('appLanguage');
        if (savedLang && (savedLang === 'uk' || savedLang === 'en')) {
            return savedLang;
        }
        
        var browserLang = navigator.language || navigator.userLanguage || '';
        browserLang = browserLang.toLowerCase();
        
        if (browserLang.indexOf('uk') !== -1 || browserLang.indexOf('ua') !== -1) {
            return 'uk';
        }
        return 'en';
    },
    
    // Ініціалізація
    init: function() {
        this.currentLang = this.detectLanguage();
        localStorage.setItem('appLanguage', this.currentLang);
    },
    
    // Отримати переклад
    t: function(key) {
        return this.translations[this.currentLang][key] || this.translations['uk'][key] || key;
    },
    
    // Змінити мову
    setLang: function(lang) {
        if (lang === 'uk' || lang === 'en') {
            this.currentLang = lang;
            localStorage.setItem('appLanguage', lang);
        }
    },
    
    // Отримати назву дня тижня
    getDayName: function(dayIndex) {
        var keys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        return this.t(keys[dayIndex]);
    },
    
    // Отримати назву місяця
    getMonthName: function(monthIndex) {
        var keys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        return this.t(keys[monthIndex]);
    }
};

// Автоматична ініціалізація
I18n.init();
