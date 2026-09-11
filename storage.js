// ===== STORAGE — блоки звичок =====

var Storage = {
    // Переклади назв їжі
    foodNames: {
        'uk': {
            'Вівсяна каша': 'Вівсяна каша',
            'Рисова каша': 'Рисова каша',
            'Гречана каша': 'Гречана каша',
            'Пшоняна каша': 'Пшоняна каша',
            'Манна каша': 'Манна каша',
            'Кефір 1%': 'Кефір 1%',
            'Йогурт натуральний': 'Йогурт натуральний',
            'Сир творожний': 'Сир творожний',
            'Молоко 2.5%': 'Молоко 2.5%',
            'Сметана 15%': 'Сметана 15%',
            'Сир твердий': 'Сир твердий',
            'Куряча грудка': 'Куряча грудка',
            'Куряче стегно': 'Куряче стегно',
            'Яловичина': 'Яловичина',
            'Свинина нежирна': 'Свинина нежирна',
            'Індичка': 'Індичка',
            'Ковбаса варена': 'Ковбаса варена',
            'Лосось': 'Лосось',
            'Тунець': 'Тунець',
            'Тріска': 'Тріска',
            'Минтай': 'Минтай',
            'Сьомга': 'Сьомга',
            'Креветки': 'Креветки',
            'Картопля': 'Картопля',
            'Морква': 'Морква',
            'Буряк': 'Буряк',
            'Капуста': 'Капуста',
            'Огірок': 'Огірок',
            'Помідор': 'Помідор',
            'Яблуко': 'Яблуко',
            'Банан': 'Банан',
            'Апельсин': 'Апельсин',
            'Виноград': 'Виноград',
            'Кавун': 'Кавун',
            'Полуниця': 'Полуниця',
            'Груша': 'Груша',
            'Персик': 'Персик',
            'Хліб білий': 'Хліб білий',
            'Хліб чорний': 'Хліб чорний',
            'Батон': 'Батон',
            'Булочка': 'Булочка',
            'Печиво': 'Печиво',
            'Білий хліб тостовий': 'Білий хліб тостовий',
            'Яйце': 'Яйце',
            'Яйце куряче': 'Яйце куряче',
            'Омлет з 2 яєць': 'Омлет з 2 яєць',
            'Яєчня': 'Яєчня',
            'Сирники': 'Сирники',
            'Чай': 'Чай',
            'Кава': 'Кава',
            'Сік': 'Сік',
            'Сік апельсиновий': 'Сік апельсиновий',
            'Чай без цукру': 'Чай без цукру',
            'Кава без цукру': 'Кава без цукру',
            'Кава з молоком': 'Кава з молоком',
            'Какао': 'Какао',
            'Шоколад': 'Шоколад',
            'Шоколад молочний': 'Шоколад молочний',
            'Шоколад чорний': 'Шоколад чорний',
            'Цукерки': 'Цукерки',
            'Мед': 'Мед',
            'Варення': 'Варення',
            'Горіхи': 'Горіхи',
            'Волоський горіх': 'Волоський горіх',
            'Миндаль': 'Миндаль',
            'Арахіс': 'Арахіс',
            'Кеш\'ю': 'Кеш\'ю',
            'Масло': 'Масло',
            'Олія': 'Олія',
            'Олія соняшникова': 'Олія соняшникова',
            'Оливкова олія': 'Оливкова олія',
            'Масло вершкове': 'Масло вершкове',
            'Майонез': 'Майонез',
            'Борщ': 'Борщ',
            'Суп': 'Суп',
            'Суп курячий': 'Суп курячий',
            'Плов': 'Плов',
            'Пельмені': 'Пельмені',
            'Вареники': 'Вареники',
            'Гречка з м\'ясом': 'Гречка з м\'ясом',
            'Рис з куркою': 'Рис з куркою',
            'Паста': 'Паста',
            'Паста варена': 'Паста варена',
            'Піца': 'Піца',
            'Бургер': 'Бургер',
            'Салат': 'Салат',
            'Салат олів\'є': 'Салат олів\'є',
            'Вінегрет': 'Вінегрет',
            'Млинці': 'Млинці',
            'Холодець': 'Холодець'
        },
        'en': {
            'Вівсяна каша': 'Oatmeal',
            'Рисова каша': 'Rice porridge',
            'Гречана каша': 'Buckwheat porridge',
            'Пшоняна каша': 'Millet porridge',
            'Манна каша': 'Semolina porridge',
            'Кефір 1%': 'Kefir 1%',
            'Йогурт натуральний': 'Natural yogurt',
            'Сир творожний': 'Cottage cheese',
            'Молоко 2.5%': 'Milk 2.5%',
            'Сметана 15%': 'Sour cream 15%',
            'Сир твердий': 'Hard cheese',
            'Куряча грудка': 'Chicken breast',
            'Куряче стегно': 'Chicken thigh',
            'Яловичина': 'Beef',
            'Свинина нежирна': 'Lean pork',
            'Індичка': 'Turkey',
            'Ковбаса варена': 'Boiled sausage',
            'Лосось': 'Salmon',
            'Тунець': 'Tuna',
            'Тріска': 'Cod',
            'Минтай': 'Pollock',
            'Сьомга': 'Pink salmon',
            'Креветки': 'Shrimp',
            'Картопля': 'Potato',
            'Морква': 'Carrot',
            'Буряк': 'Beetroot',
            'Капуста': 'Cabbage',
            'Огірок': 'Cucumber',
            'Помідор': 'Tomato',
            'Яблуко': 'Apple',
            'Банан': 'Banana',
            'Апельсин': 'Orange',
            'Виноград': 'Grape',
            'Кавун': 'Watermelon',
            'Полуниця': 'Strawberry',
            'Груша': 'Pear',
            'Персик': 'Peach',
            'Хліб білий': 'White bread',
            'Хліб чорний': 'Brown bread',
            'Батон': 'Baguette',
            'Булочка': 'Bun',
            'Печиво': 'Cookies',
            'Білий хліб тостовий': 'White toast bread',
            'Яйце': 'Egg',
            'Яйце куряче': 'Chicken egg',
            'Омлет з 2 яєць': 'Omelette (2 eggs)',
            'Яєчня': 'Fried eggs',
            'Сирники': 'Cottage cheese pancakes',
            'Чай': 'Tea',
            'Кава': 'Coffee',
            'Сік': 'Juice',
            'Сік апельсиновий': 'Orange juice',
            'Чай без цукру': 'Tea without sugar',
            'Кава без цукру': 'Coffee without sugar',
            'Кава з молоком': 'Coffee with milk',
            'Какао': 'Cocoa',
            'Шоколад': 'Chocolate',
            'Шоколад молочний': 'Milk chocolate',
            'Шоколад чорний': 'Dark chocolate',
            'Цукерки': 'Candy',
            'Мед': 'Honey',
            'Варення': 'Jam',
            'Горіхи': 'Nuts',
            'Волоський горіх': 'Walnut',
            'Миндаль': 'Almond',
            'Арахіс': 'Peanut',
            'Кеш\'ю': 'Cashew',
            'Масло': 'Butter',
            'Олія': 'Oil',
            'Олія соняшникова': 'Sunflower oil',
            'Оливкова олія': 'Olive oil',
            'Масло вершкове': 'Butter',
            'Майонез': 'Mayonnaise',
            'Борщ': 'Borscht',
            'Суп': 'Soup',
            'Суп курячий': 'Chicken soup',
            'Плов': 'Pilaf',
            'Пельмені': 'Dumplings',
            'Вареники': 'Varenyky',
            'Гречка з м\'ясом': 'Buckwheat with meat',
            'Рис з куркою': 'Rice with chicken',
            'Паста': 'Pasta',
            'Паста варена': 'Boiled pasta',
            'Піца': 'Pizza',
            'Бургер': 'Burger',
            'Салат': 'Salad',
            'Салат олів\'є': 'Olivier salad',
            'Вінегрет': 'Vinaigrette salad',
            'Млинці': 'Pancakes',
            'Холодець': 'Aspic'
        }
    },
    
    // Функція перекладу назви їжі
    translateFoodName: function(name) {
        var lang = I18n.currentLang || 'uk';
        return this.foodNames[lang][name] || name;
    },
    
    // Переклади назв вправ
    exerciseNames: {
        'uk': {
            'Біг': 'Біг',
            'Ходьба швидка': 'Ходьба швидка',
            'Ходьба повільна': 'Ходьба повільна',
            'Велосипед': 'Велосипед',
            'Плавання': 'Плавання',
            'Стрибки на скакалці': 'Стрибки на скакалці',
            'Бігова доріжка': 'Бігова доріжка',
            'Еліпс': 'Еліпс',
            'Сходинки': 'Сходинки',
            'Танці': 'Танці',
            'Аеробіка': 'Аеробіка',
            'Скакалка': 'Скакалка',
            'Біг на місці': 'Біг на місці',
            'Веслування': 'Веслування',
            'Гребний тренажер': 'Гребний тренажер',
            'Присідання': 'Присідання',
            'Випади': 'Випади',
            'Підтягування': 'Підтягування',
            'Віджимання': 'Віджимання',
            'Планка': 'Планка',
            'Жим лежачи': 'Жим лежачи',
            'Тяга вниз': 'Тяга вниз',
            'Розгинання рук': 'Розгинання рук',
            'Згинання рук': 'Згинання рук',
            'Підйом ніг': 'Підйом ніг',
            'Скручування': 'Скручування',
            'Махи ногами': 'Махи ногами',
            'Жим ногами': 'Жим ногами',
            'Тяга штанги': 'Тяга штанги',
            'Станова тяга': 'Станова тяга',
            'Йога': 'Йога',
            'Пілатес': 'Пілатес',
            'Розтяжка': 'Розтяжка',
            'Медитація': 'Медитація',
            'Тай-чі': 'Тай-чі',
            'Статичні вправи': 'Статичні вправи',
            'Баланс': 'Баланс',
            'HIIT': 'HIIT',
            'Табата': 'Табата',
            'Кросфіт': 'Кросфіт',
            'Бурпі': 'Бурпі',
            'Джампінг джек': 'Джампінг джек',
            'Mountain climbers': 'Mountain climbers',
            'Біг по сходах': 'Біг по сходах',
            'Спринти': 'Спринти',
            'Футбол': 'Футбол',
            'Баскетбол': 'Баскетбол',
            'Волейбол': 'Волейбол',
            'Теніс': 'Теніс',
            'Бадмінтон': 'Бадмінтон',
            'Настільний теніс': 'Настільний теніс',
            'Боулінг': 'Боулінг',
            'Більярд': 'Більярд',
            'Прибирання': 'Прибирання',
            'Миття підлоги': 'Миття підлоги',
            'Прасування': 'Прасування',
            'Миття вікон': 'Миття вікон',
            'Садівництво': 'Садівництво',
            'Копання': 'Копання',
            'Ходьба з собакою': 'Ходьба з собакою',
            'Гра з дітьми': 'Гра з дітьми',
            'Підйом по сходах': 'Підйом по сходах',
            'Перенесення речей': 'Перенесення речей',
            'Бокс': 'Бокс',
            'Кікбоксинг': 'Кікбоксинг',
            'ММА': 'ММА',
            'Карате': 'Карате',
            'Дзюдо': 'Дзюдо',
            'Тхеквондо': 'Тхеквондо',
            'Фехтування': 'Фехтування',
            'Йога гаряча': 'Йога гаряча'
        },
        'en': {
            'Біг': 'Running',
            'Ходьба швидка': 'Brisk walking',
            'Ходьба повільна': 'Slow walking',
            'Велосипед': 'Cycling',
            'Плавання': 'Swimming',
            'Стрибки на скакалці': 'Jump rope',
            'Бігова доріжка': 'Treadmill',
            'Еліпс': 'Elliptical',
            'Сходинки': 'Stairs',
            'Танці': 'Dancing',
            'Аеробіка': 'Aerobics',
            'Скакалка': 'Jump rope',
            'Біг на місці': 'Running in place',
            'Веслування': 'Rowing',
            'Гребний тренажер': 'Rowing machine',
            'Присідання': 'Squats',
            'Випади': 'Lunges',
            'Підтягування': 'Pull-ups',
            'Віджимання': 'Push-ups',
            'Планка': 'Plank',
            'Жим лежачи': 'Bench press',
            'Тяга вниз': 'Lat pulldown',
            'Розгинання рук': 'Tricep extensions',
            'Згинання рук': 'Bicep curls',
            'Підйом ніг': 'Leg raises',
            'Скручування': 'Crunches',
            'Махи ногами': 'Leg swings',
            'Жим ногами': 'Leg press',
            'Тяга штанги': 'Barbell row',
            'Станова тяга': 'Deadlift',
            'Йога': 'Yoga',
            'Пілатес': 'Pilates',
            'Розтяжка': 'Stretching',
            'Медитація': 'Meditation',
            'Тай-чі': 'Tai chi',
            'Статичні вправи': 'Static exercises',
            'Баланс': 'Balance',
            'HIIT': 'HIIT',
            'Табата': 'Tabata',
            'Кросфіт': 'CrossFit',
            'Бурпі': 'Burpees',
            'Джампінг джек': 'Jumping jacks',
            'Mountain climbers': 'Mountain climbers',
            'Біг по сходах': 'Stair running',
            'Спринти': 'Sprints',
            'Футбол': 'Football',
            'Баскетбол': 'Basketball',
            'Волейбол': 'Volleyball',
            'Теніс': 'Tennis',
            'Бадмінтон': 'Badminton',
            'Настільний теніс': 'Table tennis',
            'Боулінг': 'Bowling',
            'Більярд': 'Billiards',
            'Прибирання': 'Cleaning',
            'Миття підлоги': 'Mopping',
            'Прасування': 'Ironing',
            'Миття вікон': 'Window cleaning',
            'Садівництво': 'Gardening',
            'Копання': 'Digging',
            'Ходьба з собакою': 'Walking the dog',
            'Гра з дітьми': 'Playing with kids',
            'Підйом по сходах': 'Climbing stairs',
            'Перенесення речей': 'Carrying things',
            'Бокс': 'Boxing',
            'Кікбоксинг': 'Kickboxing',
            'ММА': 'MMA',
            'Карате': 'Karate',
            'Дзюдо': 'Judo',
            'Тхеквондо': 'Taekwondo',
            'Фехтування': 'Fencing',
            'Йога гаряча': 'Hot yoga'
        }
    },
    
    // Функція перекладу назви вправи
    translateExerciseName: function(name) {
        var lang = I18n.currentLang || 'uk';
        return this.exerciseNames[lang][name] || name;
    },
    
    // Функція перекладу з англійської на українську (для AI результатів)
    getEnToUkTranslation: function(enName) {
        var enToUkMap = {
            'Oatmeal': 'Вівсяна каша',
            'Rice porridge': 'Рисова каша',
            'Buckwheat porridge': 'Гречана каша',
            'Millet porridge': 'Пшоняна каша',
            'Semolina porridge': 'Манна каша',
            'Kefir 1%': 'Кефір 1%',
            'Natural yogurt': 'Йогурт натуральний',
            'Cottage cheese': 'Сир творожний',
            'Milk 2.5%': 'Молоко 2.5%',
            'Sour cream 15%': 'Сметана 15%',
            'Hard cheese': 'Сир твердий',
            'Chicken breast': 'Куряча грудка',
            'Chicken thigh': 'Куряче стегно',
            'Beef': 'Яловичина',
            'Lean pork': 'Свинина нежирна',
            'Turkey': 'Індичка',
            'Boiled sausage': 'Ковбаса варена',
            'Salmon': 'Лосось',
            'Tuna': 'Тунець',
            'Cod': 'Тріска',
            'Pollock': 'Минтай',
            'Pink salmon': 'Сьомга',
            'Shrimp': 'Креветки',
            'Potato': 'Картопля',
            'Carrot': 'Морква',
            'Beetroot': 'Буряк',
            'Cabbage': 'Капуста',
            'Cucumber': 'Огірок',
            'Tomato': 'Помідор',
            'Apple': 'Яблуко',
            'Banana': 'Банан',
            'Orange': 'Апельсин',
            'Grape': 'Виноград',
            'Watermelon': 'Кавун',
            'Strawberry': 'Полуниця',
            'Pear': 'Груша',
            'Peach': 'Персик',
            'White bread': 'Хліб білий',
            'Brown bread': 'Хліб чорний',
            'Baguette': 'Батон',
            'Bun': 'Булочка',
            'Cookies': 'Печиво',
            'Egg': 'Яйце',
            'Chicken egg': 'Яйце куряче',
            'Omelette (2 eggs)': 'Омлет з 2 яєць',
            'Fried eggs': 'Яєчня',
            'Cottage cheese pancakes': 'Сирники',
            'Tea': 'Чай',
            'Coffee': 'Кава',
            'Juice': 'Сік',
            'Orange juice': 'Сік апельсиновий',
            'Tea without sugar': 'Чай без цукру',
            'Coffee without sugar': 'Кава без цукру',
            'Coffee with milk': 'Кава з молоком',
            'Cocoa': 'Какао',
            'Chocolate': 'Шоколад',
            'Milk chocolate': 'Шоколад молочний',
            'Dark chocolate': 'Шоколад чорний',
            'Candy': 'Цукерки',
            'Honey': 'Мед',
            'Jam': 'Варення',
            'Nuts': 'Горіхи',
            'Walnut': 'Волоський горіх',
            'Almond': 'Миндаль',
            'Peanut': 'Арахіс',
            'Cashew': 'Кеш\'ю',
            'Butter': 'Масло',
            'Oil': 'Олія',
            'Sunflower oil': 'Олія соняшникова',
            'Olive oil': 'Оливкова олія',
            'Mayonnaise': 'Майонез',
            'Borscht': 'Борщ',
            'Soup': 'Суп',
            'Chicken soup': 'Суп курячий',
            'Pilaf': 'Плов',
            'Dumplings': 'Пельмені',
            'Varenyky': 'Вареники',
            'Buckwheat with meat': 'Гречка з м\'ясом',
            'Rice with chicken': 'Рис з куркою',
            'Pasta': 'Паста',
            'Pizza': 'Піца',
            'Burger': 'Бургер',
            'Salad': 'Салат',
            'Olivier salad': 'Салат олів\'є',
            'Vinaigrette salad': 'Вінегрет',
            'Pancakes': 'Млинці',
            'Aspic': 'Холодець',
            'Unbaked Pigs in a Blanket': 'Тістечка з сосискою',
            'Pigs in a Blanket': 'Тістечка з сосискою',
            'Hot dog': 'Хот-дог',
            'Sandwich': 'Бутерброд',
            'Toast': 'Тост',
            'Pancakes': 'Млинці',
            'Waffles': 'Вафлі',
            'Cereal': 'Мюслі',
            'Granola': 'Гранола',
            'Yogurt': 'Йогурт',
            'Smoothie': 'Смузі',
            'Milkshake': 'Молочний коктейль',
            'Ice cream': 'Морозиво',
            'Cake': 'Торт',
            'Pie': 'Пиріг',
            'Muffin': 'Маффін',
            'Donut': 'Пончик',
            'Croissant': 'Круасан',
            'Bagel': 'Бейгл',
            'Pretzel': 'Брецель',
            'Nachos': 'Начос',
            'French fries': 'Картопля фрі',
            'Onion rings': 'Кільця цибулі',
            'Chicken wings': 'Крильця курки',
            'Chicken nuggets': 'Нагетси',
            'Fish and chips': 'Риба з картоплею',
            'Tacos': 'Тако',
            'Burrito': 'Буріто',
            'Quesadilla': 'Кесаділья',
            'Sushi': 'Суші',
            'Ramen': 'Рамен',
            'Fried rice': 'Смажений рис',
            'Noodles': 'Локшина',
            'Spring rolls': 'Летючі рулети',
            'Dim sum': 'Дім сам',
            'Curry': 'Каррі',
            'Stew': 'Тушковане м\'ясо',
            'Meatballs': 'Котлети',
            'Steak': 'Стейк',
            'Pork chop': 'Свинина на грилі',
            'Roast chicken': 'Запечена курка',
            'Grilled salmon': 'Лосось на грилі',
            'Fried shrimp': 'Смажені креветки',
            'Caesar salad': 'Салат Цезар',
            'Greek salad': 'Грецький салат',
            'Caprese salad': 'Салат Капрезе',
            'Coleslaw': 'Коул-слоу',
            'Fruit salad': 'Фруктовий салат',
            'Tomato soup': 'Томатний суп',
            'Mushroom soup': 'Грибний суп',
            'Chicken noodle soup': 'Курячий суп з локшиною',
            'Minestrone': 'Мінестроне',
            'Chili': 'Чилі',
            'Tofu': 'Тофу',
            'Hummus': 'Хумус',
            'Guacamole': 'Гуакамоле',
            'Salsa': 'Сальса',
            'Pesto': 'Песто',
            'Honey': 'Мед',
            'Maple syrup': 'Кленовий сироп',
            'Jam': 'Варення',
            'Peanut butter': 'Арахісова паста',
            'Nutella': 'Нутелла',
            'Cream cheese': 'Крем-сир',
            'Sour cream': 'Сметана',
            'Yogurt': 'Йогурт',
            'Milk': 'Молоко',
            'Orange juice': 'Апельсиновий сік',
            'Apple juice': 'Яблучний сік',
            'Grape juice': 'Виноградний сік',
            'Lemonade': 'Лимонад',
            'Iced tea': 'Холодний чай',
            'Beer': 'Пиво',
            'Wine': 'Вино',
            'Cocktail': 'Коктейль',
            'Espresso': 'Еспресо',
            'Cappuccino': 'Капучіно',
            'Latte': 'Латте',
            'Mocha': 'Мокко',
            'Hot chocolate': 'Гарячий шоколад',
            'Green tea': 'Зелений чай',
            'Black tea': 'Чорний чай',
            'Herbal tea': 'Трав\'яний чай'
        };
        return enToUkMap[enName] || null;
    },
    
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
            height: 170,
            age: 25,
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
        { name: 'Вівсяна каша', calories: 68, icon: '🥣', category: 'Каші', protein: 2.4, fat: 1.4, carbs: 12 },
        { name: 'Рисова каша', calories: 130, icon: '🍚', category: 'Каші', protein: 2.7, fat: 0.3, carbs: 28 },
        { name: 'Гречана каша', calories: 110, icon: '🥘', category: 'Каші', protein: 4.2, fat: 1.1, carbs: 21 },
        { name: 'Пшоняна каша', calories: 90, icon: '🥣', category: 'Каші', protein: 3.1, fat: 0.4, carbs: 18 },
        { name: 'Манна каша', calories: 100, icon: '🥣', category: 'Каші', protein: 3, fat: 0.4, carbs: 21 },
        
        // === Молочні ===
        { name: 'Кефір 1%', calories: 40, icon: '🥛', category: 'Молочні', protein: 3, fat: 1, carbs: 4 },
        { name: 'Йогурт натуральний', calories: 60, icon: '🥛', category: 'Молочні', protein: 4, fat: 1.5, carbs: 6 },
        { name: 'Сир творожний', calories: 120, icon: '🧀', category: 'Молочні', protein: 16, fat: 5, carbs: 3 },
        { name: 'Молоко 2.5%', calories: 52, icon: '🥛', category: 'Молочні', protein: 2.8, fat: 2.5, carbs: 4.7 },
        { name: 'Сметана 15%', calories: 162, icon: '🥣', category: 'Молочні', protein: 2.6, fat: 15, carbs: 3 },
        { name: 'Сир твердий', calories: 350, icon: '🧀', category: 'Молочні', protein: 25, fat: 27, carbs: 1.3 },
        
        // === М'ясо ===
        { name: 'Куряча грудка', calories: 165, icon: '🍗', category: 'М\'ясо', protein: 31, fat: 3.6, carbs: 0 },
        { name: 'Куряче стегно', calories: 209, icon: '🍗', category: 'М\'ясо', protein: 26, fat: 10.9, carbs: 0 },
        { name: 'Яловичина', calories: 250, icon: '🥩', category: 'М\'ясо', protein: 26, fat: 15, carbs: 0 },
        { name: 'Свинина нежирна', calories: 242, icon: '🥩', category: 'М\'ясо', protein: 27, fat: 14, carbs: 0 },
        { name: 'Індичка', calories: 189, icon: '🦃', category: 'М\'ясо', protein: 29, fat: 7, carbs: 0 },
        { name: 'Ковбаса варена', calories: 260, icon: '🌭', category: 'М\'ясо', protein: 12, fat: 22, carbs: 2 },
        
        // === Риба ===
        { name: 'Лосось', calories: 208, icon: '🐟', category: 'Риба', protein: 20, fat: 13, carbs: 0 },
        { name: 'Тунець', calories: 184, icon: '🐟', category: 'Риба', protein: 30, fat: 6, carbs: 0 },
        { name: 'Тріска', calories: 82, icon: '🐟', category: 'Риба', protein: 18, fat: 0.7, carbs: 0 },
        { name: 'Минтай', calories: 72, icon: '🐟', category: 'Риба', protein: 15.8, fat: 0.9, carbs: 0 },
        { name: 'Скумбрія', calories: 262, icon: '🐟', category: 'Риба', protein: 24, fat: 18, carbs: 0 },
        
        // === Овочі ===
        { name: 'Помідор', calories: 18, icon: '🍅', category: 'Овочі', protein: 0.9, fat: 0.2, carbs: 3.9 },
        { name: 'Огірок', calories: 15, icon: '🥒', category: 'Овочі', protein: 0.7, fat: 0.1, carbs: 3.6 },
        { name: 'Капуста', calories: 25, icon: '🥬', category: 'Овочі', protein: 1.3, fat: 0.1, carbs: 5.8 },
        { name: 'Морква', calories: 41, icon: '🥕', category: 'Овочі', protein: 0.9, fat: 0.2, carbs: 9.6 },
        { name: 'Буряк', calories: 43, icon: '🥕', category: 'Овочі', protein: 1.6, fat: 0.2, carbs: 9.6 },
        { name: 'Картопля', calories: 77, icon: '🥔', category: 'Овочі', protein: 2, fat: 0.1, carbs: 17 },
        { name: 'Брокколі', calories: 34, icon: '🥦', category: 'Овочі', protein: 2.8, fat: 0.4, carbs: 7 },
        { name: 'Перець болгарський', calories: 27, icon: '🫑', category: 'Овочі', protein: 1, fat: 0.2, carbs: 6 },
        { name: 'Цибуля', calories: 40, icon: '🧅', category: 'Овочі', protein: 1.1, fat: 0.1, carbs: 9.3 },
        
        // === Фрукти ===
        { name: 'Яблуко', calories: 52, icon: '🍎', category: 'Фрукти', protein: 0.3, fat: 0.2, carbs: 14 },
        { name: 'Банан', calories: 89, icon: '🍌', category: 'Фрукти', protein: 1.1, fat: 0.3, carbs: 23 },
        { name: 'Апельсин', calories: 47, icon: '🍊', category: 'Фрукти', protein: 0.9, fat: 0.1, carbs: 12 },
        { name: 'Виноград', calories: 69, icon: '🍇', category: 'Фрукти', protein: 0.7, fat: 0.2, carbs: 18 },
        { name: 'Кавун', calories: 30, icon: '🍉', category: 'Фрукти', protein: 0.6, fat: 0.2, carbs: 7.6 },
        { name: 'Полуниця', calories: 33, icon: '🍓', category: 'Фрукти', protein: 0.7, fat: 0.3, carbs: 7.7 },
        { name: 'Груша', calories: 57, icon: '🍐', category: 'Фрукти', protein: 0.4, fat: 0.1, carbs: 15 },
        { name: 'Персик', calories: 39, icon: '🍑', category: 'Фрукти', protein: 0.9, fat: 0.3, carbs: 9.5 },
        
        // === Випічка ===
        { name: 'Хліб білий', calories: 265, icon: '🍞', category: 'Випічка', protein: 9, fat: 3.2, carbs: 49 },
        { name: 'Хліб чорний', calories: 200, icon: '🍞', category: 'Випічка', protein: 7, fat: 1, carbs: 40 },
        { name: 'Булочка', calories: 350, icon: '🥐', category: 'Випічка', protein: 8, fat: 12, carbs: 52 },
        { name: 'Печиво', calories: 466, icon: '🍪', category: 'Випічка', protein: 5, fat: 20, carbs: 65 },
        { name: 'Білий хліб тостовий', calories: 260, icon: '🍞', category: 'Випічка', protein: 9, fat: 3, carbs: 48 },
        
        // === Яйця та сніданки ===
        { name: 'Яйце куряче', calories: 155, icon: '🥚', category: 'Яйця', protein: 13, fat: 11, carbs: 1.1 },
        { name: 'Омлет з 2 яєць', calories: 154, icon: '🍳', category: 'Яйця', protein: 11, fat: 11, carbs: 0.7 },
        { name: 'Яєчня', calories: 196, icon: '🍳', category: 'Яйця', protein: 14, fat: 15, carbs: 1.2 },
        { name: 'Сирники', calories: 183, icon: '🥞', category: 'Яйця', protein: 18, fat: 10, carbs: 7 },
        
        // === Напої ===
        { name: 'Сік апельсиновий', calories: 45, icon: '🍊', category: 'Напої', protein: 0.7, fat: 0.2, carbs: 10 },
        { name: 'Чай без цукру', calories: 1, icon: '🍵', category: 'Напої', protein: 0, fat: 0, carbs: 0.3 },
        { name: 'Кава без цукру', calories: 2, icon: '☕', category: 'Напої', protein: 0.1, fat: 0, carbs: 0.3 },
        { name: 'Кава з молоком', calories: 50, icon: '☕', category: 'Напої', protein: 2, fat: 2, carbs: 5 },
        { name: 'Какао', calories: 100, icon: '☕', category: 'Напої', protein: 3, fat: 2, carbs: 15 },
        
        // === Солодощі ===
        { name: 'Шоколад молочний', calories: 535, icon: '🍫', category: 'Солодощі', protein: 8, fat: 30, carbs: 59 },
        { name: 'Шоколад чорний', calories: 546, icon: '🍫', category: 'Солодощі', protein: 7, fat: 43, carbs: 46 },
        { name: 'Цукерки', calories: 394, icon: '🍬', category: 'Солодощі', protein: 4, fat: 10, carbs: 75 },
        { name: 'Мед', calories: 304, icon: '🍯', category: 'Солодощі', protein: 0.3, fat: 0, carbs: 82 },
        { name: 'Варення', calories: 270, icon: '🍓', category: 'Солодощі', protein: 0.5, fat: 0.1, carbs: 68 },
        
        // === Горіхи ===
        { name: 'Волоський горіх', calories: 654, icon: '🥜', category: 'Горіхи', protein: 15, fat: 65, carbs: 14 },
        { name: 'Миндаль', calories: 579, icon: '🥜', category: 'Горіхи', protein: 21, fat: 50, carbs: 22 },
        { name: 'Арахіс', calories: 567, icon: '🥜', category: 'Горіхи', protein: 26, fat: 49, carbs: 16 },
        { name: 'Кеш\'ю', calories: 553, icon: '🥜', category: 'Горіхи', protein: 18, fat: 44, carbs: 30 },
        
        // === Масла та соуси ===
        { name: 'Олія соняшникова', calories: 884, icon: '🫒', category: 'Масла', protein: 0, fat: 100, carbs: 0 },
        { name: 'Оливкова олія', calories: 884, icon: '🫒', category: 'Масла', protein: 0, fat: 100, carbs: 0 },
        { name: 'Масло вершкове', calories: 717, icon: '🧈', category: 'Масла', protein: 0.9, fat: 81, carbs: 0.1 },
        { name: 'Майонез', calories: 680, icon: '🥄', category: 'Масла', protein: 1, fat: 75, carbs: 3 },
        
        // === Страви ===
        { name: 'Борщ', calories: 49, icon: '🍲', category: 'Страви', protein: 1.1, fat: 2.2, carbs: 6.7 },
        { name: 'Суп курячий', calories: 54, icon: '🍲', category: 'Страви', protein: 4, fat: 2, carbs: 5 },
        { name: 'Плов', calories: 150, icon: '🥘', category: 'Страви', protein: 8, fat: 5, carbs: 18 },
        { name: 'Паста варена', calories: 131, icon: '🍝', category: 'Страви', protein: 5, fat: 1.1, carbs: 25 },
        { name: 'Піца', calories: 266, icon: '🍕', category: 'Страви', protein: 11, fat: 10, carbs: 33 },
        { name: 'Бургер', calories: 295, icon: '🍔', category: 'Страви', protein: 17, fat: 14, carbs: 24 },
        { name: 'Салат олів\'є', calories: 197, icon: '🥗', category: 'Страви', protein: 7, fat: 15, carbs: 10 },
        { name: 'Вінегрет', calories: 102, icon: '🥗', category: 'Страви', protein: 1.5, fat: 7, carbs: 9 },
        { name: 'Млинці', calories: 227, icon: '🥞', category: 'Страви', protein: 6, fat: 12, carbs: 23 },
        { name: 'Вареники', calories: 210, icon: '🥟', category: 'Страви', protein: 7, fat: 8, carbs: 28 },
        { name: 'Холодець', calories: 141, icon: '🍖', category: 'Страви', protein: 12, fat: 10, carbs: 1 },
        
        // === Морепродукти ===
        { name: 'Креветки', calories: 99, icon: '🦐', category: 'Морепродукти', protein: 24, fat: 0.3, carbs: 0.2 },
        { name: 'Кальмар', calories: 92, icon: '🦑', category: 'Морепродукти', protein: 18, fat: 1.4, carbs: 1.5 },
        { name: 'Краб', calories: 97, icon: '🦀', category: 'Морепродукти', protein: 19, fat: 1, carbs: 0 },
        { name: 'Мідії', calories: 86, icon: '🦪', category: 'Морепродукти', protein: 12, fat: 3, carbs: 4 },
        { name: 'Устриці', calories: 68, icon: '🦪', category: 'Морепродукти', protein: 7, fat: 2, carbs: 4 },
        { name: 'Гарбузове насіння', calories: 559, icon: '🎃', category: 'Горіхи', protein: 30, fat: 49, carbs: 11 },
        { name: 'Соняшникове насіння', calories: 584, icon: '🌻', category: 'Горіхи', protein: 21, fat: 51, carbs: 20 }
    ],
    
    getFoodCategories: function() {
        var categories = [];
        var categoryMap = {
            'Каші': 'catPorridge',
            'Молочні': 'catDairy',
            'М\'ясо': 'catMeat',
            'Риба': 'catFish',
            'Овочі': 'catVegetables',
            'Фрукти': 'catFruits',
            'Випічка': 'catBakery',
            'Яйця': 'catEggs',
            'Напої': 'catDrinks',
            'Солодощі': 'catSweets',
            'Горіхи': 'catNuts',
            'Масла': 'catOils',
            'Страви': 'catDishes',
            'Морепродукти': 'catSeafood'
        };
        
        for (var i = 0; i < this.foodDatabase.length; i++) {
            var cat = this.foodDatabase[i].category;
            if (categories.indexOf(cat) === -1) {
                categories.push(cat);
            }
        }
        
        // Повертаємо перекладені назви
        return categories.map(function(cat) {
            return {
                id: cat,
                name: I18n.t(categoryMap[cat]) || cat
            };
        });
    },
    
    getFoodByCategory: function(categoryId) {
        return this.foodDatabase.filter(function(f) {
            return f.category === categoryId;
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
        var categoryMap = {
            'Кардіо': 'exCatCardio',
            'Силові': 'exCatStrength',
            'Розтяжка': 'exCatFlexibility',
            'Інтервальні': 'exCatInterval',
            'Ігри': 'exCatGames',
            'Побутові': 'exCatHousehold',
            'Єдиноборства': 'exCatMartial'
        };
        
        for (var i = 0; i < this.exerciseDatabase.length; i++) {
            var cat = this.exerciseDatabase[i].category;
            if (categories.indexOf(cat) === -1) {
                categories.push(cat);
            }
        }
        
        // Повертаємо перекладені назви
        return categories.map(function(cat) {
            return {
                id: cat,
                name: I18n.t(categoryMap[cat]) || cat
            };
        });
    },
    
    getExercisesByCategory: function(categoryId) {
        return this.exerciseDatabase.filter(function(e) {
            return e.category === categoryId;
        });
    },
    
    searchExercises: function(query) {
        var q = query.toLowerCase();
        return this.exerciseDatabase.filter(function(e) {
            return e.name.toLowerCase().indexOf(q) !== -1;
        });
    }
};
