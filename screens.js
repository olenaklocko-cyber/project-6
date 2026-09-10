// ===== SCREENS — блоки звичок =====

var Screens = {
    currentScreen: 'home',
    selectedDate: new Date(),
    expandedBlock: null,
    
    // Ініціалізація
    init: function() {
        this.renderAll();
        this.bindNav();
    },
    
    // Навігація
    bindNav: function() {
        var self = this;
        document.querySelectorAll('.nav-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var screen = this.getAttribute('data-screen');
                self.switchScreen(screen);
            });
        });
    },
    
    switchScreen: function(name) {
        this.currentScreen = name;
        document.querySelectorAll('.screen').forEach(function(s) {
            s.classList.remove('active');
        });
        document.getElementById('screen-' + name).classList.add('active');
        document.querySelectorAll('.nav-btn').forEach(function(b) {
            b.classList.remove('active');
        });
        document.querySelector('[data-screen="' + name + '"]').classList.add('active');
        this.renderAll();
    },
    
    renderAll: function() {
        this.renderHome();
        this.renderStats();
        this.renderAdd();
        this.renderProfile();
    },
    
    // Отримати клас анімації для іконки
    getIconAnimation: function(icon) {
        var animations = {
            '❤️': 'icon-heart',
            '💧': 'icon-breathe',
            '💊': 'icon-breathe',
            '😴': 'icon-breathe',
            '🌅': 'icon-run',
            '🚶': 'icon-steps',
            '👣': 'icon-steps',
            '🏃': 'icon-run',
            '💪': 'icon-muscle',
            '🦵': 'icon-muscle',
            '🏋️': 'icon-muscle',
            '🤸': 'icon-breathe',
            '🧘': 'icon-breathe',
            '🕉️': 'icon-breathe',
            '🕯️': 'icon-breathe',
            '⚖️': 'icon-weight',
            '🚫': 'icon-forbidden',
            '🍔': 'icon-forbidden',
            '🍎': 'icon-apple'
        };
        return animations[icon] || '';
    },
    
    // ===== ГОЛОВНИЙ ЕКРАН =====
    renderHome: function() {
        var container = document.getElementById('screen-home');
        var profile = Storage.getProfile();
        var today = Storage.formatDate(this.selectedDate);
        
        var html = '';
        
        // === 1. КАРТКА AI-СКАНЕРА ===
        html += '<div class="ai-scanner-card" id="aiScannerCard">' +
            '<div class="scanner-main-btn">' +
            '<div class="scanner-ring-outer"></div>' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>' +
            '<circle cx="12" cy="13" r="4"></circle>' +
            '</svg>' +
            '</div>' +
            '<h2 class="scanner-title">AI-аналіз страви</h2>' +
            '<p class="scanner-subtitle">Натисни щоб сфотографувати або обрати з галереї</p>' +
            '</div>';
        
        // === 2. КІЛЬЦЕ КАЛОРІЙ + ВАГА ===
        var genderEmoji = profile.gender === 'male' ? '👨' : '👩';
        var progress = Storage.getDayProgress(today);
        var weight = profile.weight || 60;
        var height = profile.height || 170;
        var age = profile.age || 25;
        
        // Формула Mifflin-St Jeor (найточніша)
        var bmr;
        if (profile.gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        
        // Коефіцієнт активності (середній = 1.4 для сидячого способу життя)
        var activityFactor = 1.4;
        var dailyCalories = Math.round(bmr * activityFactor);
        var calorieDeficit = 500;
        var targetCalories = Math.max(dailyCalories - calorieDeficit, profile.gender === 'male' ? 1500 : 1200);
        
        // Отримуємо з'їдені калорії за сьогодні
        var foodEntries = Storage.getFoodEntries(today);
        var eatenCalories = 0;
        for (var i = 0; i < foodEntries.length; i++) {
            eatenCalories += foodEntries[i].calories || 0;
        }
        var remainingCalories = targetCalories - eatenCalories;
        
        // Розрахунок прогресу для кільця
        var progressPercent = Math.min(Math.round((eatenCalories / targetCalories) * 100), 100);
        var circumference = 502; // 2 * PI * 80
        var offset = circumference - (progressPercent / 100) * circumference;
        var isOver = eatenCalories > targetCalories;
        
        // Кільце калорій
        html += '<div class="calorie-ring-section">' +
            '<div class="calorie-ring-container">' +
            '<svg class="calorie-ring-svg" viewBox="0 0 180 180">' +
            '<defs>' +
            '<linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">' +
            (isOver ? 
                '<stop offset="0%" style="stop-color:#E53935;stop-opacity:1" />' +
                '<stop offset="100%" style="stop-color:#FF7043;stop-opacity:1" />' :
                '<stop offset="0%" style="stop-color:#81C784;stop-opacity:1" />' +
                '<stop offset="100%" style="stop-color:#4DD0E1;stop-opacity:1" />') +
            '</linearGradient>' +
            '</defs>' +
            '<circle class="calorie-ring-bg" cx="90" cy="90" r="80"/>' +
            '<circle class="calorie-ring-progress" cx="90" cy="90" r="80" style="stroke-dashoffset: ' + offset + '"/>' +
            '</svg>' +
            '<div class="calorie-ring-content">' +
            '<div class="calorie-ring-number ' + (isOver ? 'over' : '') + '">' + eatenCalories + '</div>' +
            '<div class="calorie-ring-unit">' + I18n.t('kcal') + '</div>' +
            '<div class="calorie-ring-remaining ' + (isOver ? 'over' : '') + '">' + 
            (isOver ? 'Перевищено: +' + (eatenCalories - targetCalories) : I18n.t('remaining') + ': ' + remainingCalories) + ' ' + I18n.t('kcal') + 
            '</div>' +
            '</div>' +
            '</div>' +
            
            // Віджет ваги
            '<div class="weight-widget">' +
            '<div class="weight-widget-emoji">⚖️</div>' +
            '<div class="weight-widget-value">' + weight + ' ' + I18n.t('kg') + '</div>' +
            '<div class="weight-widget-label">' + I18n.t('weight') + '</div>' +
            '</div>' +
            '</div>';
        
        // Розрахунок макронутрієнтів
        var totalProtein = 0, totalFat = 0, totalCarbs = 0;
        for (var i = 0; i < foodEntries.length; i++) {
            totalProtein += foodEntries[i].protein || 0;
            totalFat += foodEntries[i].fat || 0;
            totalCarbs += foodEntries[i].carbs || 0;
        }
        
        // Норми макронутрієнтів (білки: 2г на кг, жири: 1г на кг, вуглеводи: решта)
        var targetProtein = Math.round(weight * 2);
        var targetFat = Math.round(weight * 1);
        var targetCarbs = Math.round((targetCalories - (targetProtein * 4) - (targetFat * 9)) / 4);
        if (targetCarbs < 0) targetCarbs = 0;
        
        var proteinPercent = Math.min(Math.round((totalProtein / targetProtein) * 100), 100);
        var fatPercent = Math.min(Math.round((totalFat / targetFat) * 100), 100);
        var carbsPercent = Math.min(Math.round((totalCarbs / targetCarbs) * 100), 100);
        
        // Блок макронутрієнтів
        html += '<div class="macros-section">' +
            '<div class="macros-title">📊 Макронутрієнти за день</div>' +
            '<div class="macros-grid">' +
            
            // Білки
            '<div class="macro-item">' +
            '<div class="macro-icon">🥩</div>' +
            '<div class="macro-value">' + Math.round(totalProtein) + 'г</div>' +
            '<div class="macro-label">Білки</div>' +
            '<div class="macro-bar"><div class="macro-bar-fill protein" style="width: ' + proteinPercent + '%"></div></div>' +
            '<div class="macro-label">' + Math.round(totalProtein) + ' / ' + targetProtein + 'г</div>' +
            '</div>' +
            
            // Жири
            '<div class="macro-item">' +
            '<div class="macro-icon">🥑</div>' +
            '<div class="macro-value">' + Math.round(totalFat) + 'г</div>' +
            '<div class="macro-label">Жири</div>' +
            '<div class="macro-bar"><div class="macro-bar-fill fat" style="width: ' + fatPercent + '%"></div></div>' +
            '<div class="macro-label">' + Math.round(totalFat) + ' / ' + targetFat + 'г</div>' +
            '</div>' +
            
            // Вуглеводи
            '<div class="macro-item">' +
            '<div class="macro-icon">🍚</div>' +
            '<div class="macro-value">' + Math.round(totalCarbs) + 'г</div>' +
            '<div class="macro-label">Вуглеводи</div>' +
            '<div class="macro-bar"><div class="macro-bar-fill carbs" style="width: ' + carbsPercent + '%"></div></div>' +
            '<div class="macro-label">' + Math.round(totalCarbs) + ' / ' + targetCarbs + 'г</div>' +
            '</div>' +
            
            '</div>' +
            '</div>';
        
        // Інформація про розрахунок калорій
        html += '<div class="calorie-calc-info">' +
            '<div class="calc-info-row">' +
            '<span class="calc-info-label">' + I18n.t('bmr') + ':</span>' +
            '<span class="calc-info-value">' + Math.round(bmr) + ' ' + I18n.t('kcal') + '</span>' +
            '</div>' +
            '<div class="calc-info-row">' +
            '<span class="calc-info-label">' + I18n.t('dailyCalories') + ':</span>' +
            '<span class="calc-info-value">' + dailyCalories + ' ' + I18n.t('kcal') + '</span>' +
            '</div>' +
            '<div class="calc-info-row">' +
            '<span class="calc-info-label">' + I18n.t('deficit') + ':</span>' +
            '<span class="calc-info-value">-500 ' + I18n.t('kcal') + '</span>' +
            '</div>' +
            '</div>';
        
        // === 3. СЬОГОДНІШНІ ЗАПИСИ ЇЖІ ===
        
        html += '<div class="home-food-section">' +
            '<div class="section-title">' + I18n.t('todayEntries') + '</div>';
        
        if (foodEntries.length === 0) {
            html += '<div class="home-empty-food">' +
                '<div class="home-empty-icon">🍽️</div>' +
                '<div class="home-empty-text">' + I18n.t('noEntries') + '</div>' +
                '<div class="home-empty-hint">' + I18n.t('noEntriesHint') + '</div>' +
                '</div>';
        } else {
            html += '<div class="food-entries-list">';
            
            var totalCal = 0;
            var totalProtein = 0, totalFat = 0, totalCarbs = 0;
            for (var i = 0; i < foodEntries.length; i++) {
                var entry = foodEntries[i];
                totalCal += entry.calories || 0;
                totalProtein += entry.protein || 0;
                totalFat += entry.fat || 0;
                totalCarbs += entry.carbs || 0;
                
                var entryMacros = '';
                if (entry.protein || entry.fat || entry.carbs) {
                    entryMacros = '<div class="food-entry-macros">' +
                        '<span class="food-macro protein">Б: ' + Math.round(entry.protein || 0) + 'г</span>' +
                        '<span class="food-macro fat">Ж: ' + Math.round(entry.fat || 0) + 'г</span>' +
                        '<span class="food-macro carbs">В: ' + Math.round(entry.carbs || 0) + 'г</span>' +
                        '</div>';
                }
                
                var entryIcon = entry.photo ? 
                    '<div class="food-entry-thumb"><img src="' + entry.photo + '" alt="Їжа"></div>' : 
                    '<div class="food-entry-icon">🍽️</div>';
                
                html += '<div class="food-entry-item" data-index="' + i + '">' +
                    entryIcon +
                    '<div class="food-entry-info">' +
                    '<div class="food-entry-name">' + Storage.translateFoodName(entry.name) + '</div>' +
                    '<div class="food-entry-meta">' + entry.portion + ' · ' + entry.time + '</div>' +
                    entryMacros +
                    '</div>' +
                    '<div class="food-entry-cal">' + entry.calories + ' ' + I18n.t('kcal') + '</div>' +
                    '<button class="food-entry-delete" data-index="' + i + '">✕</button>' +
                    '</div>';
            }
            
            html += '<div class="food-total-strip">' +
                '<span>' + I18n.t('totalToday') + '</span>' +
                '<span class="food-total-value">' + totalCal + ' ' + I18n.t('kcal') + '</span>' +
                '</div>';
            
            html += '</div>';
        }
        
        html += '</div>';
        
        html += '</div>';
        
        container.innerHTML = html;
        this.bindHomeEvents();
    },
    
    // Прив'язка подій
    bindHomeEvents: function() {
        var self = this;
        
        // Кнопка камери (основна зона)
        var cameraMainBtn = document.getElementById('cameraMainBtn');
        if (cameraMainBtn) {
            cameraMainBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                self.openCamera();
            });
        }
        
        // Кнопка галереї
        var homeGalleryBtn = document.getElementById('homeGalleryBtn');
        if (homeGalleryBtn) {
            homeGalleryBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                self.openGallery();
            });
        }
        
        // Картка сканера (відкриває модалку вибору)
        var aiScannerCard = document.getElementById('aiScannerCard');
        if (aiScannerCard) {
            aiScannerCard.addEventListener('click', function() {
                self.showSourceModal();
            });
        }
        
        // Кнопки видалення страв
        document.querySelectorAll('.food-entry-delete').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var index = parseInt(this.getAttribute('data-index'));
                var date = Storage.formatDate(self.selectedDate);
                
                if (confirm('Видалити цю страву?')) {
                    Storage.deleteFoodEntry(date, index);
                    self.renderHome();
                }
            });
        });
    },
    
    // ===== СТАТИСТИКА =====
    renderStats: function() {
        var container = document.getElementById('screen-stats');
        var blocks = Storage.getBlocks();
        var today = Storage.formatDate(new Date());
        
        var html = '';
        
        // === 1. СЬОГОДНІШНІЙ ПРОГРЕС (кольоровий блок) ===
        var totalProgress = Storage.getDayProgress(today);
        
        html += '<div class="stats-today-card">' +
            '<div class="stats-today-header">' +
            '<div class="stats-today-emoji">📊</div>' +
            '<div class="stats-today-title">' + I18n.t('todayProgress') + '</div>' +
            '</div>' +
            '<div class="stats-today-circle">' +
            '<svg viewBox="0 0 100 100">' +
            '<circle class="stats-circle-bg" cx="50" cy="50" r="45"/>' +
            '<circle class="stats-circle-fill" cx="50" cy="50" r="45" stroke-dasharray="' + (totalProgress * 2.83) + ' 283"/>' +
            '</svg>' +
            '<div class="stats-today-percent">' + totalProgress + '%</div>' +
            '</div>' +
            '<div class="stats-today-label">' + I18n.t('totalCompleted') + '</div>' +
            '</div>';
        
        // === 2. РОЗГОРНУТІ БЛОКИ ЗІ ЗВИЧКАМИ ===
        html += '<div class="stats-blocks-section">';
        
        var colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4ecdc4', '#667eea'];
        
        for (var b = 0; b < blocks.length; b++) {
            var block = blocks[b];
            var blockProgress = Storage.getBlockProgress(block.id, today);
            var color = colors[b % colors.length];
            var isExpanded = this.expandedBlock === ('stats-' + block.id);
            
            html += '<div class="stats-block-item' + (isExpanded ? ' expanded' : '') + '" data-block="stats-' + block.id + '">' +
                '<div class="stats-block-header" data-block="stats-' + block.id + '">' +
                '<div class="stats-block-icon" style="background: ' + color + '20; color: ' + color + '">' + block.icon + '</div>' +
                '<div class="stats-block-info">' +
                '<div class="stats-block-name">' + I18n.t('block' + block.id.charAt(0).toUpperCase() + block.id.slice(1)) + '</div>' +
                '<div class="stats-block-bar">' +
                '<div class="stats-block-fill" style="width: ' + blockProgress + '%; background: ' + color + '"></div>' +
                '</div>' +
                '</div>' +
                '<div class="stats-block-percent" style="color: ' + color + '">' + blockProgress + '%</div>' +
                '<div class="stats-block-arrow">' + (isExpanded ? '▾' : '▸') + '</div>' +
                '</div>';
            
            // Розгорнутий вміст звичок
            if (isExpanded) {
                html += '<div class="stats-block-habits">';
                
                for (var i = 0; i < block.habits.length; i++) {
                    var h = block.habits[i];
                    var count = Storage.getCount(h.id, today);
                    var goal = h.goal || 0;
                    var goalPercent = goal > 0 ? Math.min(100, Math.round((count / goal) * 100)) : 0;
                    var isDistance = (h.unit === 'км' || h.unit === 'хвилин' || h.unit === 'годин' || h.unit === 'кроків' || h.unit === 'літрів');
                    
                    html += '<div class="stats-habit-row">' +
                        '<div class="stats-habit-icon">' + h.icon + '</div>' +
                        '<div class="stats-habit-info">' +
                        '<div class="stats-habit-name">' + I18n.t('habit' + h.id) + '</div>' +
                        '<div class="stats-habit-count">' + count + ' ' + (h.unit || I18n.t('times')) + 
                        (goal > 0 ? ' / ' + goal : '') + '</div>' +
                        '</div>';
                    
                    if (goal > 0) {
                        html += '<div class="stats-habit-progress">' +
                            '<div class="stats-habit-bar">' +
                            '<div class="stats-habit-bar-fill" style="width: ' + goalPercent + '%; background: ' + color + '"></div>' +
                            '</div>' +
                            '<div class="stats-habit-percent">' + goalPercent + '%</div>' +
                            '</div>';
                    }
                    
                    html += '<div class="stats-habit-actions">';
                    
                    if (isDistance) {
                        html += '<input type="number" class="stats-habit-input" data-id="' + h.id + '" placeholder="0 ' + (h.unit || '') + '">' +
                            '<button class="stats-habit-save" data-id="' + h.id + '" style="background: ' + color + '">✓</button>';
                    } else {
                        html += '<button class="stats-habit-btn minus" data-id="' + h.id + '">−</button>' +
                            '<div class="stats-habit-count editable" data-id="' + h.id + '" data-color="' + color + '">' + count + '</div>' +
                            '<button class="stats-habit-btn plus" data-id="' + h.id + '" style="background: ' + color + '">+</button>';
                    }
                    
                    html += '</div></div>';
                }
                
                html += '</div>';
            }
            
            html += '</div>';
        }
        
        html += '</div>';
        
        // === 3. АКТИВНІСТЬ ЗА ТИЖДЕНЬ (календар) ===
        html += '<div class="stats-week-section">' +
            '<div class="stats-section-title">' + I18n.t('weeklyActivity') + '</div>' +
            '<div class="stats-calendar">';
        
        var dayNamesFull = [I18n.t('sun'), I18n.t('mon'), I18n.t('tue'), I18n.t('wed'), I18n.t('thu'), I18n.t('fri'), I18n.t('sat')];
        var monthNames = ['січ', 'лют', 'бер', 'кві', 'трав', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'груд'];
        var weekData = [];
        
        for (var i = 6; i >= 0; i--) {
            var d = new Date();
            d.setDate(d.getDate() - i);
            var dateStr = Storage.formatDate(d);
            weekData.push({
                dayName: dayNamesFull[d.getDay()],
                dayNum: d.getDate(),
                month: monthNames[d.getMonth()],
                progress: Storage.getDayProgress(dateStr),
                isToday: i === 0
            });
        }
        
        var maxProgress = Math.max.apply(null, weekData.map(function(d) { return d.progress; }));
        if (maxProgress === 0) maxProgress = 100;
        
        for (var i = 0; i < weekData.length; i++) {
            var day = weekData[i];
            var barHeight = Math.max((day.progress / maxProgress) * 100, 8);
            var barColor = day.progress > 0 ? 'linear-gradient(180deg, #667eea, #764ba2)' : '#e0e0e0';
            
            html += '<div class="stats-day' + (day.isToday ? ' today' : '') + '">' +
                '<div class="stats-day-bar-wrap">' +
                '<div class="stats-day-bar" style="height: ' + barHeight + '%; background: ' + barColor + '"></div>' +
                '</div>' +
                '<div class="stats-day-info">' +
                '<div class="stats-day-num">' + day.dayNum + '</div>' +
                '<div class="stats-day-name">' + day.dayName + '</div>' +
                '</div>' +
                '<div class="stats-day-percent">' + day.progress + '%</div>' +
                '</div>';
        }
        
        html += '</div></div>';
        
        container.innerHTML = html;
        this.bindStatsEvents();
    },
    
    bindStatsEvents: function() {
        var self = this;
        
        // Розгортання/згортання блоків
        document.querySelectorAll('.stats-block-header').forEach(function(header) {
            header.addEventListener('click', function() {
                var blockId = this.getAttribute('data-block');
                self.expandedBlock = self.expandedBlock === blockId ? null : blockId;
                self.renderStats();
            });
        });
        
        // Кнопки +/-
        document.querySelectorAll('.stats-habit-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var id = parseInt(this.getAttribute('data-id'));
                var date = Storage.formatDate(new Date());
                var currentCount = Storage.getCount(id, date);
                var action = this.classList.contains('plus') ? 1 : -1;
                Storage.setCount(id, date, Math.max(0, currentCount + action));
                self.renderStats();
            });
        });
        
        // Редагування числа (натиснути на число щоб ввести вручну)
        document.querySelectorAll('.stats-habit-count.editable').forEach(function(el) {
            el.addEventListener('click', function(e) {
                e.stopPropagation();
                var id = parseInt(this.getAttribute('data-id'));
                var color = this.getAttribute('data-color');
                var currentCount = parseInt(this.textContent) || 0;
                
                var input = document.createElement('input');
                input.type = 'number';
                input.className = 'stats-habit-input';
                input.value = currentCount;
                input.style.borderColor = color;
                
                this.parentNode.replaceChild(input, this);
                input.focus();
                input.select();
                
                function saveValue() {
                    var value = parseInt(input.value) || 0;
                    var date = Storage.formatDate(new Date());
                    Storage.setCount(id, date, value);
                    self.renderStats();
                }
                
                input.addEventListener('blur', saveValue);
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        saveValue();
                    }
                });
            });
        });
        
        // Кнопки збереження (для дистанції)
        document.querySelectorAll('.stats-habit-save').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var id = parseInt(this.getAttribute('data-id'));
                var input = document.querySelector('.stats-habit-input[data-id="' + id + '"]');
                var value = parseInt(input.value) || 0;
                if (value > 0) {
                    var date = Storage.formatDate(new Date());
                    Storage.setCount(id, date, value);
                    self.renderStats();
                }
            });
        });
    },
    
    // ===== ПРОФІЛЬ =====
    renderProfile: function() {
        var container = document.getElementById('screen-profile');
        var profile = Storage.getProfile();
        var genderEmoji = profile.gender === 'male' ? '👨' : '👩';
        var profilePhoto = localStorage.getItem('profilePhoto');
        
        // Обчислюємо статистику
        var allHabits = Storage.getAllHabits();
        var totalWeek = 0;
        var activeDays = 0;
        
        for (var i = 0; i < allHabits.length; i++) {
            totalWeek += Storage.getWeekTotal(allHabits[i].id);
        }
        
        for (var d = 0; d < 7; d++) {
            var date = new Date();
            date.setDate(date.getDate() - d);
            var dateStr = Storage.formatDate(date);
            for (var i = 0; i < allHabits.length; i++) {
                if (Storage.getCount(allHabits[i].id, dateStr) > 0) {
                    activeDays++;
                    break;
                }
            }
        }
        
        var html = '<div class="profile-page">' +
            
            '<div class="profile-avatar-section">' +
            '<div class="profile-avatar" id="profileAvatarBtn">' +
            (profilePhoto ? 
                '<img src="' + profilePhoto + '" class="profile-avatar-img">' :
                '<div class="profile-avatar-emoji">' + genderEmoji + '</div>'
            ) +
            '<div class="profile-avatar-add">+</div>' +
            '</div>' +
            '<input type="file" id="profilePhotoInput" accept="image/*" style="display: none;">' +
            '<div class="profile-name">' + I18n.t('myProfile') + '</div>' +
            '<div class="profile-status">' + (activeDays > 0 ? '🔥 ' + I18n.t('active') + ' ' + activeDays + ' ' + I18n.t('days') : I18n.t('startJourney')) + '</div>' +
            '</div>' +
            
            '<div class="profile-stats">' +
            '<div class="profile-stat-item">' +
            '<div class="profile-stat-number">' + profile.weight + '</div>' +
            '<div class="profile-stat-label">' + I18n.t('kg') + '</div>' +
            '</div>' +
            '<div class="profile-stat-divider"></div>' +
            '<div class="profile-stat-item">' +
            '<div class="profile-stat-number">' + totalWeek + '</div>' +
            '<div class="profile-stat-label">' + I18n.t('perWeek') + '</div>' +
            '</div>' +
            '<div class="profile-stat-divider"></div>' +
            '<div class="profile-stat-item">' +
            '<div class="profile-stat-number">' + activeDays + '</div>' +
            '<div class="profile-stat-label">' + I18n.t('days') + '</div>' +
            '</div>' +
            '</div>' +
            
            '<div class="profile-goal-card">' +
            '<div class="profile-goal-icon">🎯</div>' +
            '<div class="profile-goal-info">' +
            '<div class="profile-goal-title">' + I18n.t('myGoal') + '</div>' +
            '<div class="profile-goal-text">' + profile.goal + '</div>' +
            '</div>' +
            '</div>' +
            
            '<div class="profile-settings">' +
            '<div class="profile-settings-title">' + I18n.t('settings') + '</div>' +
            
            '<div class="profile-setting-item">' +
            '<div class="profile-setting-icon">👤</div>' +
            '<div class="profile-setting-label">' + I18n.t('gender') + '</div>' +
            '<div class="gender-picker">' +
            '<div class="gender-option ' + (profile.gender === 'female' ? 'selected' : '') + '" data-gender="female">👩 ' + I18n.t('female') + '</div>' +
            '<div class="gender-option ' + (profile.gender === 'male' ? 'selected' : '') + '" data-gender="male">👨 ' + I18n.t('male') + '</div>' +
            '</div>' +
            '</div>' +
            
            '<div class="profile-setting-item">' +
            '<div class="profile-setting-icon">⚖️</div>' +
            '<div class="profile-setting-label">' + I18n.t('weight') + '</div>' +
            '<input type="number" id="profileWeight" value="' + profile.weight + '" class="profile-input" placeholder="60">' +
            '</div>' +
            
            '<div class="profile-setting-item">' +
            '<div class="profile-setting-icon">📏</div>' +
            '<div class="profile-setting-label">' + I18n.t('height') + '</div>' +
            '<input type="number" id="profileHeight" value="' + (profile.height || '') + '" class="profile-input" placeholder="170">' +
            '</div>' +
            
            '<div class="profile-setting-item">' +
            '<div class="profile-setting-icon">🎂</div>' +
            '<div class="profile-setting-label">' + I18n.t('age') + '</div>' +
            '<input type="number" id="profileAge" value="' + (profile.age || '') + '" class="profile-input" placeholder="25">' +
            '</div>' +
            
            '<div class="profile-setting-item">' +
            '<div class="profile-setting-icon">🎯</div>' +
            '<div class="profile-setting-label">' + I18n.t('goal') + '</div>' +
            '<input type="text" id="profileGoal" value="' + profile.goal + '" class="profile-input">' +
            '</div>' +
            
            '<div class="profile-setting-item">' +
            '<div class="profile-setting-icon">🌍</div>' +
            '<div class="profile-setting-label">' + I18n.t('language') + '</div>' +
            '<div class="language-picker">' +
            '<button class="lang-btn ' + (I18n.currentLang === 'uk' ? 'active' : '') + '" data-lang="uk">🇺🇦 Українська</button>' +
            '<button class="lang-btn ' + (I18n.currentLang === 'en' ? 'active' : '') + '" data-lang="en">🇬🇧 English</button>' +
            '</div>' +
            '</div>' +
            
            '</div>' +
            
            '<button class="btn-primary btn-full" id="saveProfileBtn">' + I18n.t('saveChanges') + '</button>' +
            
            '<div class="profile-motivation">' +
            '<div class="motivation-emoji">💪</div>' +
            '<div class="motivation-text">' + I18n.t('motivationText') + '</div>' +
            '</div>' +
            
            '</div>';
        
        container.innerHTML = html;
        this.bindProfileEvents();
    },
    
    bindProfileEvents: function() {
        var self = this;
        
        // Завантаження фото профілю
        var avatarBtn = document.getElementById('profileAvatarBtn');
        var photoInput = document.getElementById('profilePhotoInput');
        
        if (avatarBtn && photoInput) {
            avatarBtn.addEventListener('click', function() {
                photoInput.click();
            });
            
            photoInput.addEventListener('change', function(e) {
                var file = e.target.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function(event) {
                        localStorage.setItem('profilePhoto', event.target.result);
                        self.renderProfile();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        // Вибір статі
        document.querySelectorAll('.gender-option').forEach(function(opt) {
            opt.addEventListener('click', function() {
                document.querySelectorAll('.gender-option').forEach(function(o) {
                    o.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        });
        
        // Вибір мови
        document.querySelectorAll('.lang-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var lang = this.getAttribute('data-lang');
                I18n.setLang(lang);
                updatePageTranslations();
                self.renderProfile();
                self.renderHome();
                self.renderStats();
                self.renderAdd();
            });
        });
        
        // Збереження профілю
        document.getElementById('saveProfileBtn').addEventListener('click', function() {
            var gender = document.querySelector('.gender-option.selected').getAttribute('data-gender');
            var weight = parseInt(document.getElementById('profileWeight').value) || 60;
            var height = parseInt(document.getElementById('profileHeight').value) || 170;
            var age = parseInt(document.getElementById('profileAge').value) || 25;
            var goal = document.getElementById('profileGoal').value.trim() || I18n.t('goalHealth');
            
            Storage.saveProfile({ gender: gender, weight: weight, height: height, age: age, goal: goal });
            
            var btn = document.getElementById('saveProfileBtn');
            btn.textContent = '✓ ' + I18n.t('saved');
            btn.style.background = 'linear-gradient(135deg, #20c997, #17a589)';
            
            // Оновлюємо головну сторінку для перерахунку калорій
            self.renderHome();
            
            setTimeout(function() {
                btn.textContent = I18n.t('saveChanges');
                btn.style.background = '';
                self.renderProfile();
            }, 1500);
        });
    },
    
    // ===== ДОДАТИ =====
    addTab: 'nutrition',
    selectedFood: null,
    
    renderAdd: function() {
        var container = document.getElementById('screen-add');
        var self = this;
        
        var html = '<div class="add-form">' +
            '<div class="add-tabs">' +
            '<button class="add-tab' + (this.addTab === 'nutrition' ? ' active' : '') + '" data-tab="nutrition">' + I18n.t('tabNutrition') + '</button>' +
            '<button class="add-tab' + (this.addTab === 'exercises' ? ' active' : '') + '" data-tab="exercises">' + I18n.t('tabExercises') + '</button>' +
            '</div>';
        
        if (this.addTab === 'nutrition') {
            html += this.renderAddNutrition();
        } else {
            html += this.renderAddExercises();
        }
        
        html += '</div>';
        
        container.innerHTML = html;
        this.bindAddEvents();
    },
    
    renderAddExercises: function() {
        var categories = Storage.getExerciseCategories();
        
        var html = '<div class="nutrition-section">' +
            
            // Пошук вправи
            '<div class="food-search-box">' +
            '<input type="text" id="exerciseSearch" placeholder="' + I18n.t('searchExercise') + '" autocomplete="off">' +
            '</div>' +
            
            // Категорії
            '<div class="food-categories" id="exerciseCategories">';
        
        for (var i = 0; i < categories.length; i++) {
            html += '<button class="food-category-btn" data-category="' + categories[i].id + '">' + categories[i].name + '</button>';
        }
        
        html += '</div>' +
            
            // Список вправ
            '<div class="food-list" id="exerciseListContainer"></div>' +
            
            // Кнопка "Своя вправа"
            '<div class="custom-food-btn-wrap">' +
            '<button class="custom-food-btn" id="customExerciseBtn">' + I18n.t('customExercise') + '</button>' +
            '</div>' +
            
            // Форма ручного введення (прихована)
            '<div class="custom-food-form" id="customExerciseForm" style="display: none;">' +
            '<div class="form-group">' +
            '<label>' + I18n.t('customExerciseName') + '</label>' +
            '<input type="text" id="customExerciseName" placeholder="' + I18n.t('customExerciseNamePlaceholder') + '">' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>' + I18n.t('customExerciseCal') + '</label>' +
            '<input type="number" id="customExerciseCalories" placeholder="' + I18n.t('customExerciseCalPlaceholder') + '">' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>' + I18n.t('customExerciseTime') + '</label>' +
            '<input type="number" id="customExerciseMinutes" placeholder="' + I18n.t('customExerciseTimePlaceholder') + '">' +
            '</div>' +
            
            '<div class="cal-result" id="customExerciseCalResult" style="display: none;">' +
            '<div class="cal-result-value" id="customExerciseCalResultValue">0</div>' +
            '<div class="cal-result-label">' + I18n.t('exerciseBurned') + '</div>' +
            '</div>' +
            
            '<button class="btn-primary" id="addCustomExerciseBtn">' + I18n.t('addRecord') + '</button>' +
            '</div>' +
            
            // Вибрана вправа з бази
            '<div class="selected-food-section" id="selectedExerciseSection" style="display: none;">' +
            '<div class="selected-food-header">' +
            '<span class="selected-food-icon" id="selectedExerciseIcon"></span>' +
            '<span class="selected-food-name" id="selectedExerciseName"></span>' +
            '<span class="selected-food-cal" id="selectedExerciseCal"></span>' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>Час (хвилини)</label>' +
            '<input type="number" id="exerciseMinutes" placeholder="' + I18n.t('customExerciseTimePlaceholder') + '">' +
            '</div>' +
            
            '<div class="cal-result" id="exerciseCalResult" style="display: none;">' +
            '<div class="cal-result-value" id="exerciseCalResultValue">0</div>' +
            '<div class="cal-result-label">' + I18n.t('exerciseBurned') + '</div>' +
            '</div>' +
            
            '<button class="btn-primary" id="addExerciseBtn">' + I18n.t('addRecord') + '</button>' +
            '</div>' +
            
            '</div>';
        
        return html;
    },
    
    renderAddNutrition: function() {
        var categories = Storage.getFoodCategories();
        
        var html = '<div class="nutrition-section">' +
            
            // Пошук страви
            '<div class="food-search-box">' +
            '<input type="text" id="foodSearch" placeholder="' + I18n.t('searchFood') + '" autocomplete="off">' +
            '</div>' +
            
            // Категорії
            '<div class="food-categories" id="foodCategories">';
        
        for (var i = 0; i < categories.length; i++) {
            html += '<button class="food-category-btn" data-category="' + categories[i].id + '">' + categories[i].name + '</button>';
        }
        
        html += '</div>' +
            
            // Список страв
            '<div class="food-list" id="foodListContainer"></div>' +
            
            // Кнопка "Своя страва"
            '<div class="custom-food-btn-wrap">' +
            '<button class="custom-food-btn" id="customFoodBtn">' + I18n.t('customFood') + '</button>' +
            '</div>' +
            
            // Форма ручного введення (прихована)
            '<div class="custom-food-form" id="customFoodForm" style="display: none;">' +
            '<div class="form-group">' +
            '<label>' + I18n.t('customFoodName') + '</label>' +
            '<input type="text" id="customFoodName" placeholder="' + I18n.t('customFoodNamePlaceholder') + '">' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>' + I18n.t('customFoodCal') + '</label>' +
            '<input type="number" id="customFoodCalories" placeholder="' + I18n.t('customFoodCalPlaceholder') + '">' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>' + I18n.t('customFoodGrams') + '</label>' +
            '<input type="number" id="customFoodGrams" placeholder="' + I18n.t('customFoodGramsPlaceholder') + '">' +
            '</div>' +
            
            '<div class="cal-result" id="customCalResult" style="display: none;">' +
            '<div class="cal-result-value" id="customCalResultValue">0</div>' +
            '<div class="cal-result-label">' + I18n.t('caloriesBurned') + '</div>' +
            '</div>' +
            
            '<button class="btn-primary" id="addCustomFoodBtn">' + I18n.t('addRecord') + '</button>' +
            '</div>' +
            
            // Вибрана страва з бази
            '<div class="selected-food-section" id="selectedFoodSection" style="display: none;">' +
            '<div class="selected-food-header">' +
            '<span class="selected-food-icon" id="selectedFoodIcon"></span>' +
            '<span class="selected-food-name" id="selectedFoodName"></span>' +
            '<span class="selected-food-cal" id="selectedFoodCal"></span>' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>' + I18n.t('customFoodGrams') + '</label>' +
            '<input type="number" id="portionGrams" placeholder="' + I18n.t('customFoodGramsPlaceholder') + '">' +
            '</div>' +
            
            '<div class="cal-result" id="calResult" style="display: none;">' +
            '<div class="cal-result-value" id="calResultValue">0</div>' +
            '<div class="cal-result-label">' + I18n.t('caloriesBurned') + '</div>' +
            '</div>' +
            
            '<button class="btn-primary" id="addFoodBtn">' + I18n.t('addRecord') + '</button>' +
            '</div>' +
            
            '</div>';
        
        return html;
    },
    
    bindAddEvents: function() {
        var self = this;
        
        // Перемикач вкладок
        document.querySelectorAll('.add-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                self.addTab = this.getAttribute('data-tab');
                self.renderAdd();
            });
        });
        
        if (this.addTab === 'exercises') {
            this.bindAddForm();
        } else {
            this.bindNutritionEvents();
        }
    },
    
    bindNutritionEvents: function() {
        var self = this;
        var selectedFood = null;
        var expandedItem = null;
        
        // Показати страви за категорією
        function showFoodByCategory(category) {
            var foods = Storage.getFoodByCategory(category);
            var container = document.getElementById('foodListContainer');
            var html = '';
            
            for (var i = 0; i < foods.length; i++) {
                html += '<div class="food-item" data-index="' + i + '" data-category="' + category + '">' +
                    '<div class="food-item-header">' +
                    '<span class="food-item-icon">' + foods[i].icon + '</span>' +
                    '<span class="food-item-name">' + Storage.translateFoodName(foods[i].name) + '</span>' +
                    '<span class="food-item-cal">' + foods[i].calories + ' ' + I18n.t('kcal') + '/100г</span>' +
                    '<span class="food-item-arrow">▼</span>' +
                    '</div>' +
                    '<div class="food-item-details">' +
                    '<div class="food-detail-row">' +
                    '<span class="food-detail-label">' + I18n.t('customFoodCal') + ':</span>' +
                    '<span class="food-detail-value">' + foods[i].calories + ' ' + I18n.t('kcal') + '</span>' +
                    '</div>' +
                    '<div class="food-detail-row">' +
                    '<span class="food-detail-label">' + I18n.t('category') + ':</span>' +
                    '<span class="food-detail-value">' + foods[i].category + '</span>' +
                    '</div>' +
                    '<button class="food-item-select-btn" data-index="' + i + '" data-category="' + category + '">' + I18n.t('selectThisFood') + '</button>' +
                    '</div>' +
                    '</div>';
            }
            
            container.innerHTML = html;
            
            // Обробники для розгортання
            container.querySelectorAll('.food-item').forEach(function(item) {
                item.querySelector('.food-item-header').addEventListener('click', function(e) {
                    e.stopPropagation();
                    var wasExpanded = item.classList.contains('expanded');
                    
                    // Згортаємо всі
                    container.querySelectorAll('.food-item').forEach(function(el) {
                        el.classList.remove('expanded');
                    });
                    
                    // Розгортаємо якщо було згорнуте
                    if (!wasExpanded) {
                        item.classList.add('expanded');
                        expandedItem = item;
                    } else {
                        expandedItem = null;
                    }
                });
            });
            
            // Обробники для кнопок вибору
            container.querySelectorAll('.food-item-select-btn').forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var idx = parseInt(this.getAttribute('data-index'));
                    var cat = this.getAttribute('data-category');
                    var foods = Storage.getFoodByCategory(cat);
                    selectFood(foods[idx]);
                });
            });
        }
        
        // Вибір страви
        function selectFood(food) {
            selectedFood = food;
            
            // Ховаємо форму ручного введення
            document.getElementById('customFoodForm').style.display = 'none';
            document.getElementById('customFoodBtn').style.display = 'block';
            
            document.getElementById('selectedFoodSection').style.display = 'block';
            document.getElementById('selectedFoodIcon').textContent = food.icon;
            document.getElementById('selectedFoodName').textContent = food.name;
            document.getElementById('selectedFoodCal').textContent = food.calories + ' ' + I18n.t('kcal') + '/100г';
            document.getElementById('portionGrams').value = '';
            document.getElementById('calResult').style.display = 'none';
        }
        
        // Обчислення калорій (з бази)
        function calculateCalories() {
            if (!selectedFood) return;
            
            var grams = parseInt(document.getElementById('portionGrams').value) || 0;
            var totalCal = Math.round((selectedFood.calories / 100) * grams);
            
            if (grams > 0) {
                document.getElementById('calResult').style.display = 'block';
                document.getElementById('calResultValue').textContent = totalCal;
            } else {
                document.getElementById('calResult').style.display = 'none';
            }
        }
        
        // Обчислення калорій (своя страва)
        function calculateCustomCalories() {
            var calories = parseInt(document.getElementById('customFoodCalories').value) || 0;
            var grams = parseInt(document.getElementById('customFoodGrams').value) || 0;
            var totalCal = Math.round((calories / 100) * grams);
            
            if (calories > 0 && grams > 0) {
                document.getElementById('customCalResult').style.display = 'block';
                document.getElementById('customCalResultValue').textContent = totalCal;
            } else {
                document.getElementById('customCalResult').style.display = 'none';
            }
        }
        
        // Клік по категоріях
        document.querySelectorAll('#foodCategories .food-category-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('#foodCategories .food-category-btn').forEach(function(b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                
                // Ховаємо форму ручного введення
                document.getElementById('customFoodForm').style.display = 'none';
                document.getElementById('customFoodBtn').style.display = 'block';
                document.getElementById('selectedFoodSection').style.display = 'none';
                selectedFood = null;
                expandedItem = null;
                
                showFoodByCategory(this.getAttribute('data-category'));
            });
        });
        
        // Пошук страви
        document.getElementById('foodSearch').addEventListener('input', function() {
            var query = this.value.toLowerCase().trim();
            var container = document.getElementById('foodListContainer');
            
            if (query.length < 2) {
                container.innerHTML = '';
                return;
            }
            
            var results = Storage.searchFood(query);
            var html = '';
            
            for (var i = 0; i < results.length; i++) {
                html += '<div class="food-item" data-index="' + i + '">' +
                    '<div class="food-item-header">' +
                    '<span class="food-item-icon">' + results[i].icon + '</span>' +
                    '<span class="food-item-name">' + Storage.translateFoodName(results[i].name) + '</span>' +
                    '<span class="food-item-cal">' + results[i].calories + ' ' + I18n.t('kcal') + '/100г</span>' +
                    '<span class="food-item-arrow">▼</span>' +
                    '</div>' +
                    '<div class="food-item-details">' +
                    '<div class="food-detail-row">' +
                    '<span class="food-detail-label">' + I18n.t('customFoodCal') + ':</span>' +
                    '<span class="food-detail-value">' + results[i].calories + ' ' + I18n.t('kcal') + '</span>' +
                    '</div>' +
                    '<div class="food-detail-row">' +
                    '<span class="food-detail-label">' + I18n.t('category') + ':</span>' +
                    '<span class="food-detail-value">' + results[i].category + '</span>' +
                    '</div>' +
                    '<button class="food-item-select-btn" data-index="' + i + '">' + I18n.t('selectThisFood') + '</button>' +
                    '</div>' +
                    '</div>';
            }
            
            container.innerHTML = html;
            
            // Обробники для розгортання
            container.querySelectorAll('.food-item').forEach(function(item) {
                item.querySelector('.food-item-header').addEventListener('click', function(e) {
                    e.stopPropagation();
                    var wasExpanded = item.classList.contains('expanded');
                    
                    container.querySelectorAll('.food-item').forEach(function(el) {
                        el.classList.remove('expanded');
                    });
                    
                    if (!wasExpanded) {
                        item.classList.add('expanded');
                        expandedItem = item;
                    } else {
                        expandedItem = null;
                    }
                });
            });
            
            // Обробники для кнопок вибору
            container.querySelectorAll('.food-item-select-btn').forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var idx = parseInt(this.getAttribute('data-index'));
                    selectFood(results[idx]);
                });
            });
        });
        
        // Зміна порції
        document.getElementById('portionGrams').addEventListener('input', calculateCalories);
        
        // Додати страву з бази
        document.getElementById('addFoodBtn').addEventListener('click', function() {
            if (!selectedFood) {
                alert(I18n.t('selectFoodFirst'));
                return;
            }
            
            var grams = parseInt(document.getElementById('portionGrams').value) || 0;
            if (grams <= 0) {
                alert(I18n.t('enterGrams'));
                return;
            }
            
            var totalCal = Math.round((selectedFood.calories / 100) * grams);
            
            Storage.addFoodEntry({
                name: selectedFood.name,
                calories: totalCal,
                portion: grams + 'г',
                time: new Date().toLocaleTimeString('uk-UA')
            });
            
            // Очищаємо
            selectedFood = null;
            document.getElementById('selectedFoodSection').style.display = 'none';
            document.getElementById('foodSearch').value = '';
            document.getElementById('foodListContainer').innerHTML = '';
            document.querySelectorAll('#foodCategories .food-category-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            
            alert(I18n.t('foodAdded') + ' ' + totalCal + ' ' + I18n.t('kcal'));
        });
        
        // Кнопка "Своя страва"
        document.getElementById('customFoodBtn').addEventListener('click', function() {
            selectedFood = null;
            document.getElementById('selectedFoodSection').style.display = 'none';
            document.getElementById('customFoodBtn').style.display = 'none';
            document.getElementById('customFoodForm').style.display = 'block';
            document.getElementById('customFoodName').value = '';
            document.getElementById('customFoodCalories').value = '';
            document.getElementById('customFoodGrams').value = '';
            document.getElementById('customCalResult').style.display = 'none';
        });
        
        // Обчислення калорій для своєї страви
        document.getElementById('customFoodCalories').addEventListener('input', calculateCustomCalories);
        document.getElementById('customFoodGrams').addEventListener('input', calculateCustomCalories);
        
        // Додати свою страву
        document.getElementById('addCustomFoodBtn').addEventListener('click', function() {
            var name = document.getElementById('customFoodName').value.trim();
            var calories = parseInt(document.getElementById('customFoodCalories').value) || 0;
            var grams = parseInt(document.getElementById('customFoodGrams').value) || 0;
            
            if (!name) {
                alert('Введи назву страви!');
                return;
            }
            
            if (calories <= 0) {
                alert('Введи калорії на 100г!');
                return;
            }
            
            if (grams <= 0) {
                alert(I18n.t('enterGrams'));
                return;
            }
            
            var totalCal = Math.round((calories / 100) * grams);
            
            Storage.addFoodEntry({
                name: name,
                calories: totalCal,
                portion: grams + 'г',
                time: new Date().toLocaleTimeString('uk-UA')
            });
            
            // Очищаємо
            document.getElementById('customFoodForm').style.display = 'none';
            document.getElementById('customFoodBtn').style.display = 'block';
            document.getElementById('customFoodName').value = '';
            document.getElementById('customFoodCalories').value = '';
            document.getElementById('customFoodGrams').value = '';
            document.getElementById('customCalResult').style.display = 'none';
            document.getElementById('foodListContainer').innerHTML = '';
            document.querySelectorAll('#foodCategories .food-category-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            
            alert(I18n.t('foodAdded') + ' ' + totalCal + ' ' + I18n.t('kcal'));
        });
    },
    
    renderFoodHistory: function() {
        var container = document.getElementById('foodList');
        var today = Storage.formatDate(new Date());
        var entries = Storage.getFoodEntries(today);
        
        if (entries.length === 0) {
            container.innerHTML = '<div class="empty-food">Ще немає записів. Сфотографуй їжу або додай вручну!</div>';
            return;
        }
        
        var html = '';
        var totalCal = 0;
        
        for (var i = entries.length - 1; i >= 0; i--) {
            var e = entries[i];
            totalCal += e.calories || 0;
            html += '<div class="food-entry">' +
                '<div class="food-entry-time">' + e.time + '</div>' +
                '<div class="food-entry-info">' +
                '<div class="food-entry-name">' + Storage.translateFoodName(e.name) + '</div>' +
                (e.portion ? '<div class="food-entry-portion">' + e.portion + '</div>' : '') +
                '</div>' +
                '<div class="food-entry-cal">' + (e.calories || '?') + ' ' + I18n.t('kcal') + '</div>' +
                '</div>';
        }
        
        html = '<div class="food-total">' + I18n.t('totalToday') + ' <strong>' + totalCal + ' ' + I18n.t('kcal') + '</strong></div>' + html;
        container.innerHTML = html;
    },
    
    // Модалка вибору джерела фото
    showSourceModal: function() {
        var self = this;
        
        // Видаляємо попередню модалку
        var oldModal = document.getElementById('sourceModal');
        if (oldModal) oldModal.remove();
        
        var modal = document.createElement('div');
        modal.id = 'sourceModal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(5px);';
        
        var content = document.createElement('div');
        content.style.cssText = 'background:white;width:100%;max-width:400px;border-radius:24px 24px 0 0;padding:24px 24px 40px;animation:slideUp 0.3s ease;';
        
        content.innerHTML = 
            '<div style="width:40px;height:4px;background:#ddd;border-radius:2px;margin:0 auto 20px;"></div>' +
            '<div style="font-size:18px;font-weight:800;color:#2D1B69;text-align:center;margin-bottom:20px;">Обери джерело фото</div>' +
            '<div style="display:flex;gap:12px;">' +
            '<div id="modalCameraBtn" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:10px;padding:24px 16px;background:linear-gradient(145deg,#E2DBF7,#ECDFFB);border-radius:20px;cursor:pointer;transition:all 0.3s ease;">' +
            '<div style="width:60px;height:60px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.6);border-radius:50%;">' +
            '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5A4A7A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>' +
            '</div>' +
            '<div style="font-size:14px;font-weight:700;color:#3D2A6A;">📷 Камера</div>' +
            '</div>' +
            '<div id="modalGalleryBtn" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:10px;padding:24px 16px;background:linear-gradient(145deg,#E2DBF7,#ECDFFB);border-radius:20px;cursor:pointer;transition:all 0.3s ease;">' +
            '<div style="width:60px;height:60px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.6);border-radius:50%;">' +
            '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5A4A7A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>' +
            '</div>' +
            '<div style="font-size:14px;font-weight:700;color:#3D2A6A;">🖼️ Галерея</div>' +
            '</div>' +
            '</div>' +
            '<div id="modalCancelBtn" style="margin-top:16px;padding:16px;text-align:center;font-size:16px;font-weight:700;color:#999;cursor:pointer;">Скасувати</div>';
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Анімація появи
        var style = document.createElement('style');
        style.textContent = '@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}';
        document.head.appendChild(style);
        
        // Обробники
        document.getElementById('modalCameraBtn').onclick = function() {
            modal.remove();
            self.openCamera();
        };
        
        document.getElementById('modalGalleryBtn').onclick = function() {
            modal.remove();
            self.openGallery();
        };
        
        document.getElementById('modalCancelBtn').onclick = function() {
            modal.remove();
        };
        
        modal.onclick = function(e) {
            if (e.target === modal) modal.remove();
        };
    },
    
    openCamera: function() {
        this.showCustomCamera();
    },
    
    showCustomCamera: function() {
        var self = this;
        
        // Перевіряємо HTTPS (обов'язково для камери на iPhone)
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            alert('Для роботи камери потрібен HTTPS. Спробуйте завантажити фото з галереї.');
            self.openGallery();
            return;
        }
        
        var modal = document.createElement('div');
        modal.className = 'custom-camera';
        modal.id = 'customCamera';
        
        modal.innerHTML = '<video id="cameraVideo" autoplay playsinline></video>' +
            '<div class="camera-overlay">' +
            // Верхня панель
            '<div class="camera-top-bar">' +
            '<button class="camera-close-btn" id="cameraCloseBtn">✕</button>' +
            '<div class="camera-title-badge">📷 Камера</div>' +
            '<button class="camera-flash-btn" id="cameraFlashBtn">⚡</button>' +
            '</div>' +
            // Рамка для їжі
            '<div class="camera-frame-area">' +
            '<div class="camera-frame">' +
            '<div class="frame-corner frame-tl"></div>' +
            '<div class="frame-corner frame-tr"></div>' +
            '<div class="frame-corner frame-bl"></div>' +
            '<div class="frame-corner frame-br"></div>' +
            '</div>' +
            '<div class="camera-hint-text">📱 Наведи камеру на страву</div>' +
            '</div>' +
            // Нижня панель
            '<div class="camera-bottom-bar">' +
            '<div class="camera-zoom-options">' +
            '<button class="zoom-btn" data-zoom="1">1x</button>' +
            '<button class="zoom-btn active" data-zoom="2">2x</button>' +
            '<button class="zoom-btn" data-zoom="3">3x</button>' +
            '</div>' +
            '<div class="camera-controls">' +
            '<button class="camera-gallery-small" id="cameraGallerySmall">🖼️</button>' +
            '<button class="camera-shutter" id="cameraShutterBtn">' +
            '<div class="shutter-ring"></div>' +
            '<div class="shutter-center"></div>' +
            '</button>' +
            '<button class="camera-flip-btn" id="cameraFlipBtn">🔄</button>' +
            '</div>' +
            '<div class="camera-mode-label">ФОТО</div>' +
            '</div>' +
            '</div>' +
            '<canvas id="cameraCanvas" style="display:none;"></canvas>';
        
        document.body.appendChild(modal);
        
        setTimeout(function() {
            modal.classList.add('active');
        }, 10);
        
        self.startCameraStream('environment');
        
        // Закриття
        document.getElementById('cameraCloseBtn').addEventListener('click', function() {
            self.closeCustomCamera();
        });
        
        // Перемикання камери
        document.getElementById('cameraFlipBtn').addEventListener('click', function() {
            self.flipCamera();
        });
        
        // Кнопка галереї
        document.getElementById('cameraGallerySmall').addEventListener('click', function() {
            self.closeCustomCamera();
            self.openGallery();
        });
        
        // Кнопка зйомки
        document.getElementById('cameraShutterBtn').addEventListener('click', function() {
            self.capturePhoto();
        });
        
        // Зум
        document.querySelectorAll('.zoom-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.zoom-btn').forEach(function(b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                
                var zoomLevel = parseFloat(this.getAttribute('data-zoom'));
                self.setCameraZoom(zoomLevel);
            });
        });
    },
    
    setCameraZoom: function(zoom) {
        var self = this;
        var video = document.getElementById('cameraVideo');
        
        if (video && video.srcObject) {
            var track = video.srcObject.getVideoTracks()[0];
            if (track && track.getCapabilities) {
                var capabilities = track.getCapabilities();
                if (capabilities.zoom) {
                    var constraints = {
                        advanced: [{ zoom: Math.min(zoom, capabilities.zoom.max) }]
                    };
                    track.applyConstraints(constraints)
                        .then(function() {
                            console.log('Zoom set to:', zoom);
                        })
                        .catch(function(err) {
                            console.log('Zoom not supported:', err);
                        });
                }
            }
        }
    },
    
    startCameraStream: function(facingMode) {
        var self = this;
        var video = document.getElementById('cameraVideo');
        
        if (!video) return;
        
        if (self.currentStream) {
            self.currentStream.getTracks().forEach(function(track) {
                track.stop();
            });
        }
        
        // Перевіряємо підтримку
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.log('getUserMedia not supported, using fallback');
            self.closeCustomCamera();
            self.openCameraInput('environment');
            return;
        }
        
        var constraints = {
            video: {
                facingMode: facingMode,
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            },
            audio: false
        };
        
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                self.currentStream = stream;
                video.srcObject = stream;
                video.play();
            })
            .catch(function(err) {
                console.error('Camera error:', err);
                // Спробуємо без вказівки facingMode
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(function(stream) {
                        self.currentStream = stream;
                        video.srcObject = stream;
                        video.play();
                    })
                    .catch(function(err2) {
                        console.error('Camera fallback error:', err2);
                        self.closeCustomCamera();
                        self.openCameraInput('environment');
                    });
            });
    },
    
    flipCamera: function() {
        var self = this;
        self.currentFacingMode = self.currentFacingMode === 'environment' ? 'user' : 'environment';
        self.startCameraStream(self.currentFacingMode);
    },
    
    capturePhoto: function() {
        var self = this;
        var video = document.getElementById('cameraVideo');
        var canvas = document.getElementById('cameraCanvas');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob(function(blob) {
            var file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
            self.closeCustomCamera();
            self.processFoodPhoto(file);
        }, 'image/jpeg', 0.9);
    },
    
    closeCustomCamera: function() {
        var self = this;
        var modal = document.getElementById('customCamera');
        
        if (self.currentStream) {
            self.currentStream.getTracks().forEach(function(track) {
                track.stop();
            });
            self.currentStream = null;
        }
        
        if (modal) {
            modal.classList.remove('active');
            setTimeout(function() {
                modal.remove();
            }, 400);
        }
    },
    
    openGallery: function() {
        var self = this;
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = function(e) {
            var file = e.target.files[0];
            if (file) {
                self.processFoodPhoto(file);
            }
        };
        
        input.click();
    },
    
    openCameraInput: function(mode) {
        var self = this;
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        if (mode === 'environment') {
            input.capture = 'environment';
        }
        
        input.onchange = function(e) {
            var file = e.target.files[0];
            if (file) {
                self.processFoodPhoto(file);
            }
        };
        
        input.click();
    },
    
    processFoodPhoto: function(file) {
        var self = this;
        var reader = new FileReader();
        
        reader.onload = function(e) {
            // Зберігаємо фото для показу в модалці
            self.lastFoodPhoto = e.target.result;
            
            // Показуємо модалку завантаження
            self.showLoadingModal();
            
            self.analyzeFood(e.target.result);
        };
        
        reader.readAsDataURL(file);
    },
    
    showLoadingModal: function() {
        var modal = document.createElement('div');
        modal.className = 'food-result-modal';
        modal.id = 'foodResultModal';
        
        var photoHtml = '';
        if (this.lastFoodPhoto) {
            photoHtml = '<div class="loading-bg-photo"><img src="' + this.lastFoodPhoto + '" alt=""></div>';
        }
        
        modal.innerHTML = '<div class="loading-overlay">' +
            photoHtml +
            '<div class="loading-content">' +
            '<div class="loading-spinner-large"></div>' +
            '<div class="loading-text-large">🤖 AI аналізує їжу...</div>' +
            '</div>' +
            '</div>';
        
        document.body.appendChild(modal);
        
        setTimeout(function() {
            modal.classList.add('active');
        }, 10);
    },
    
    analyzeFood: function(imageBase64) {
        var self = this;
        
        var serverUrl = 'https://food-api-v2-git-main-olenka1.vercel.app/api/analyze';
        
        // Стискаємо зображення перед відправкою
        var img = new Image();
        img.onload = function() {
            var canvas = document.createElement('canvas');
            var maxSize = 800;
            var width = img.width;
            var height = img.height;
            
            if (width > height) {
                if (width > maxSize) {
                    height = Math.round(height * maxSize / width);
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = Math.round(width * maxSize / height);
                    height = maxSize;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            var compressedImage = canvas.toDataURL('image/jpeg', 0.85);
            
            console.log('Original size:', imageBase64.length);
            console.log('Compressed size:', compressedImage.length);
            
            fetch(serverUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: compressedImage })
            })
            .then(function(response) {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(function(data) {
                console.log('Server response:', data);
                
                // Закриваємо модалку завантаження
                self.closeFoodResult();
                
                if (data.success && data.dishes) {
                    self.showFoodResults(data);
                } else {
                    self.showQuickFallbackFullScreen(compressedImage);
                }
            })
            .catch(function(error) {
                console.error('Fetch error:', error);
                self.closeFoodResult();
                self.showQuickFallbackFullScreen(compressedImage);
            });
        };
        img.src = imageBase64;
    },
    
    showFoodResults: function(data) {
        var self = this;
        
        // Створюємо повноекранну модалку
        var modal = document.createElement('div');
        modal.className = 'food-result-modal';
        modal.id = 'foodResultModal';
        
        var html = '<div class="food-result-content">' +
            '<div class="food-result-header">' +
            '<div class="food-result-photo" id="resultPhoto"></div>' +
            '<div class="food-result-title">' + I18n.t('aiRecognized') + '</div>' +
            '</div>' +
            '<div class="food-result-body">' +
            '<div class="food-result-calories">' +
            '<div class="food-result-cal-number">' + data.totalCalories + '</div>' +
            '<div class="food-result-cal-label">' + I18n.t('kcal') + '</div>' +
            '</div>' +
            '<div class="food-result-macros">' +
            '<div class="food-result-macro">' +
            '<div class="food-result-macro-value">' + (data.protein || 0) + 'г</div>' +
            '<div class="food-result-macro-label">' + I18n.t('protein') + '</div>' +
            '</div>' +
            '<div class="food-result-macro">' +
            '<div class="food-result-macro-value">' + (data.fat || 0) + 'г</div>' +
            '<div class="food-result-macro-label">' + I18n.t('fat') + '</div>' +
            '</div>' +
            '<div class="food-result-macro">' +
            '<div class="food-result-macro-value">' + (data.carbs || 0) + 'г</div>' +
            '<div class="food-result-macro-label">' + I18n.t('carbs') + '</div>' +
            '</div>' +
            '</div>';
        
        // Назва страви (редагована)
        for (var i = 0; i < data.dishes.length; i++) {
            var dish = data.dishes[i];
            // Перекладаємо назву страви якщо потрібно
            var dishName = dish.name;
            if (I18n.currentLang === 'uk') {
                // Спочатку шукаємо в нашій карті перекладів
                var enToUk = Storage.getEnToUkTranslation(dish.name);
                if (enToUk) {
                    dishName = enToUk;
                } else {
                    // Якщо немає в карті - залишаємо англійську (користувач може відредагувати)
                    dishName = dish.name;
                }
            }
            html += '<div class="food-result-dish">' +
                '<input type="text" class="food-result-dish-input" value="' + dishName + '" data-index="' + i + '">' +
                '<div class="food-result-dish-cal">' + dish.calories + ' ' + I18n.t('kcal') + '</div>' +
                '</div>';
        }
        
        html += '</div>' +
            '<div class="food-result-footer">' +
            '<button class="food-result-save-btn" id="saveFoodResultBtn">💾 ' + I18n.t('save') + ' ' + data.totalCalories + ' ' + I18n.t('kcal') + '</button>' +
            '<button class="food-result-close-btn" id="closeFoodResultBtn">✕ ' + I18n.t('close') + '</button>' +
            '</div>' +
            '</div>';
        
        modal.innerHTML = html;
        document.body.appendChild(modal);
        
        // Додаємо збережене фото
        if (self.lastFoodPhoto) {
            document.getElementById('resultPhoto').innerHTML = '<img src="' + self.lastFoodPhoto + '" alt="Їжа">';
        }
        
        // Анімація появи
        setTimeout(function() {
            modal.classList.add('active');
        }, 10);
        
        // Збереження
        document.getElementById('saveFoodResultBtn').addEventListener('click', function() {
            var inputs = document.querySelectorAll('.food-result-dish-input');
            var names = [];
            inputs.forEach(function(input) {
                names.push(input.value);
            });
            
            // Створюємо міні-фото (thumbnail)
            var thumbnail = null;
            if (self.lastFoodPhoto) {
                var thumbCanvas = document.createElement('canvas');
                var thumbImg = new Image();
                thumbImg.onload = function() {
                    thumbCanvas.width = 80;
                    thumbCanvas.height = 80;
                    var ctx = thumbCanvas.getContext('2d');
                    // Обрізаємо по центру
                    var size = Math.min(thumbImg.width, thumbImg.height);
                    var sx = (thumbImg.width - size) / 2;
                    var sy = (thumbImg.height - size) / 2;
                    ctx.drawImage(thumbImg, sx, sy, size, size, 0, 0, 80, 80);
                    thumbnail = thumbCanvas.toDataURL('image/jpeg', 0.7);
                    
                    Storage.addFoodEntry({
                        name: names.join(' + '),
                        calories: data.totalCalories,
                        protein: data.protein || 0,
                        fat: data.fat || 0,
                        carbs: data.carbs || 0,
                        portion: 'з фото (AI)',
                        time: new Date().toLocaleTimeString('uk-UA'),
                        photo: thumbnail
                    });
                    
                    self.closeFoodResult();
                    self.renderHome();
                };
                thumbImg.src = self.lastFoodPhoto;
            } else {
                Storage.addFoodEntry({
                    name: names.join(' + '),
                    calories: data.totalCalories,
                    protein: data.protein || 0,
                    fat: data.fat || 0,
                    carbs: data.carbs || 0,
                    portion: 'з фото (AI)',
                    time: new Date().toLocaleTimeString('uk-UA')
                });
                
                self.closeFoodResult();
                self.renderHome();
            }
        });
        
        // Закриття
        document.getElementById('closeFoodResultBtn').addEventListener('click', function() {
            self.closeFoodResult();
        });
        
        // Закриття по фону
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                self.closeFoodResult();
            }
        });
    },
    
    closeFoodResult: function() {
        var modal = document.getElementById('foodResultModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(function() {
                modal.remove();
            }, 400);
        }
    },
    
    showQuickFallbackFullScreen: function(imageBase64) {
        var self = this;
        
        // Закриваємо попередню модалку
        self.closeFoodResult();
        
        // Створюємо повноекранну модалку
        var modal = document.createElement('div');
        modal.className = 'food-result-modal';
        modal.id = 'foodResultModal';
        
        var html = '<div class="food-result-content">' +
            '<div class="food-result-header">' +
            '<div class="food-result-photo" id="resultPhoto"></div>' +
            '<div class="food-result-title">AI не зміг розпізнати</div>' +
            '</div>' +
            '<div class="food-result-body">' +
            '<div class="fallback-search">' +
            '<input type="text" id="fallbackSearch" placeholder="🔍 Шукати страву...">' +
            '</div>' +
            '<div class="fallback-list" id="fallbackList"></div>' +
            '<div class="fallback-selected" id="fallbackSelected"></div>' +
            '</div>' +
            '<div class="food-result-footer">' +
            '<button class="food-result-save-btn" id="saveFallbackBtn" disabled>💾 Зберегти</button>' +
            '<button class="food-result-close-btn" id="closeFoodResultBtn">✕ Закрити</button>' +
            '</div>' +
            '</div>';
        
        modal.innerHTML = html;
        document.body.appendChild(modal);
        
        // Додаємо фото
        if (self.lastFoodPhoto) {
            document.getElementById('resultPhoto').innerHTML = '<img src="' + self.lastFoodPhoto + '" alt="Їжа">';
        }
        
        setTimeout(function() {
            modal.classList.add('active');
        }, 10);
        
        self.initFallbackList();
        
        // Закриття
        document.getElementById('closeFoodResultBtn').addEventListener('click', function() {
            self.closeFoodResult();
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                self.closeFoodResult();
            }
        });
    },
    
    showQuickFallback: function(imageBase64, container) {
        var self = this;
        
        var html = '<div class="fallback-section">' +
            '<div class="fallback-title">AI не зміг розпізнати. Обери сам:</div>' +
            '<div class="fallback-search">' +
            '<input type="text" id="fallbackSearch" placeholder="🔍 Шукати страву...">' +
            '</div>' +
            '<div class="fallback-list" id="fallbackList"></div>' +
            '<div class="fallback-selected" id="fallbackSelected"></div>' +
            '<div class="fallback-total" id="fallbackTotal">Обери страви</div>' +
            '<button class="btn-primary" id="saveFallbackBtn" disabled>💾 Зберегти</button>' +
            '</div>';
        
        container.insertAdjacentHTML('beforeend', html);
        
        self.initFallbackList();
    },
    
    initFallbackList: function() {
        var self = this;
        this.fallbackSelected = [];
        
        var foods = [
            { name: 'Сосиска', cal: 150, icon: '🌭' },
            { name: 'Помідор', cal: 18, icon: '🍅' },
            { name: 'Хліб', cal: 80, icon: '🍞' },
            { name: 'Сир', cal: 105, icon: '🧀' },
            { name: 'Масло', cal: 72, icon: '🧈' },
            { name: 'Яйце', cal: 78, icon: '🥚' },
            { name: 'Ковбаса', cal: 78, icon: '🥓' },
            { name: 'Огірок', cal: 15, icon: '🥒' },
            { name: 'Картопля', cal: 95, icon: '🥔' },
            { name: 'Морква', cal: 41, icon: '🥕' },
            { name: 'Курка', cal: 165, icon: '🍗' },
            { name: 'Рис', cal: 130, icon: '🍚' },
            { name: 'Макарони', cal: 130, icon: '🍝' },
            { name: 'Салат', cal: 20, icon: '🥗' },
            { name: 'Суп', cal: 50, icon: '🍲' },
            { name: 'Піца', cal: 266, icon: '🍕' },
            { name: 'Бургер', cal: 295, icon: '🍔' },
            { name: 'Сирники', cal: 180, icon: '🥞' },
            { name: 'Каша', cal: 100, icon: '🥣' },
            { name: 'Фрукти', cal: 50, icon: '🍎' },
            { name: 'Йогурт', cal: 60, icon: '🥛' },
            { name: 'Сік', cal: 45, icon: '🧃' },
            { name: 'Кава', cal: 5, icon: '☕' },
            { name: 'Чай', cal: 2, icon: '🍵' }
        ];
        
        var list = document.getElementById('fallbackList');
        var html = '';
        
        foods.forEach(function(f) {
            html += '<div class="fallback-item" data-name="' + f.name + '" data-cal="' + f.cal + '">' +
                '<span class="fallback-icon">' + f.icon + '</span>' +
                '<span class="fallback-name">' + f.name + '</span>' +
                '<span class="fallback-cal">' + f.cal + ' ' + I18n.t('kcal') + '</span>' +
                '</div>';
        });
        
        list.innerHTML = html;
        
        document.querySelectorAll('.fallback-item').forEach(function(item) {
            item.addEventListener('click', function() {
                var name = this.getAttribute('data-name');
                var cal = parseInt(this.getAttribute('data-cal'));
                self.toggleFallbackItem(name, cal);
            });
        });
        
        document.getElementById('fallbackSearch').addEventListener('input', function() {
            var query = this.value.toLowerCase();
            document.querySelectorAll('.fallback-item').forEach(function(item) {
                var name = item.getAttribute('data-name').toLowerCase();
                item.style.display = name.indexOf(query) > -1 ? 'flex' : 'none';
            });
        });
        
        document.getElementById('saveFallbackBtn').addEventListener('click', function() {
            if (self.fallbackSelected.length === 0) return;
            
            var total = self.fallbackSelected.reduce(function(sum, f) { return sum + f.cal; }, 0);
            var names = self.fallbackSelected.map(function(f) { return f.name; }).join(' + ');
            
            Storage.addFoodEntry({
                name: names,
                calories: total,
                portion: 'з фото',
                time: new Date().toLocaleTimeString('uk-UA')
            });
            
            this.textContent = '✓ Збережено!';
            setTimeout(function() {
                var preview = document.getElementById('photoPreview');
                if (preview) preview.remove();
                self.renderFoodHistory();
            }, 1000);
        });
    },
    
    toggleFallbackItem: function(name, cal) {
        var index = this.fallbackSelected.findIndex(function(f) { return f.name === name; });
        
        if (index > -1) {
            this.fallbackSelected.splice(index, 1);
        } else {
            this.fallbackSelected.push({ name: name, cal: cal });
        }
        
        var total = this.fallbackSelected.reduce(function(sum, f) { return sum + f.cal; }, 0);
        var totalDiv = document.getElementById('fallbackTotal');
        var saveBtn = document.getElementById('saveFallbackBtn');
        
        if (this.fallbackSelected.length === 0) {
            totalDiv.textContent = I18n.t('selectFood');
            saveBtn.disabled = true;
        } else {
            totalDiv.innerHTML = I18n.t('total') + ': <strong>' + total + ' ' + I18n.t('kcal') + '</strong>';
            saveBtn.disabled = false;
        }
        
        document.querySelectorAll('.fallback-item').forEach(function(item) {
            var itemName = item.getAttribute('data-name');
            var isSelected = this.fallbackSelected.some(function(f) { return f.name === itemName; });
            item.classList.toggle('selected', isSelected);
        }.bind(this));
    },
    
    bindAddForm: function() {
        var self = this;
        var selectedExercise = null;
        
        // Показати вправи за категорією
        function showExercisesByCategory(category) {
            var exercises = Storage.getExercisesByCategory(category);
            var container = document.getElementById('exerciseListContainer');
            var html = '';
            
            for (var i = 0; i < exercises.length; i++) {
                html += '<div class="food-item" data-index="' + i + '" data-category="' + category + '">' +
                    '<span class="food-item-icon">' + exercises[i].icon + '</span>' +
                    '<span class="food-item-name">' + Storage.translateExerciseName(exercises[i].name) + '</span>' +
                    '<span class="food-item-cal">' + exercises[i].calories + ' ' + I18n.t('kcal') + '/хв</span>' +
                    '</div>';
            }
            
            container.innerHTML = html;
            
            container.querySelectorAll('.food-item').forEach(function(item) {
                item.addEventListener('click', function() {
                    var idx = parseInt(this.getAttribute('data-index'));
                    var cat = this.getAttribute('data-category');
                    var exercises = Storage.getExercisesByCategory(cat);
                    selectExercise(exercises[idx]);
                });
            });
        }
        
        // Вибір вправи
        function selectExercise(exercise) {
            selectedExercise = exercise;
            
            // Ховаємо форму ручного введення
            document.getElementById('customExerciseForm').style.display = 'none';
            document.getElementById('customExerciseBtn').style.display = 'block';
            
            document.getElementById('selectedExerciseSection').style.display = 'block';
            document.getElementById('selectedExerciseIcon').textContent = exercise.icon;
            document.getElementById('selectedExerciseName').textContent = exercise.name;
            document.getElementById('selectedExerciseCal').textContent = exercise.calories + ' ' + I18n.t('kcal') + '/хв';
            document.getElementById('exerciseMinutes').value = '';
            document.getElementById('exerciseCalResult').style.display = 'none';
        }
        
        // Обчислення калорій (з бази)
        function calculateCalories() {
            if (!selectedExercise) return;
            
            var minutes = parseInt(document.getElementById('exerciseMinutes').value) || 0;
            var totalCal = Math.round(selectedExercise.calories * minutes);
            
            if (minutes > 0) {
                document.getElementById('exerciseCalResult').style.display = 'block';
                document.getElementById('exerciseCalResultValue').textContent = totalCal;
            } else {
                document.getElementById('exerciseCalResult').style.display = 'none';
            }
        }
        
        // Обчислення калорій (своя вправа)
        function calculateCustomExerciseCalories() {
            var calories = parseInt(document.getElementById('customExerciseCalories').value) || 0;
            var minutes = parseInt(document.getElementById('customExerciseMinutes').value) || 0;
            var totalCal = Math.round(calories * minutes);
            
            if (calories > 0 && minutes > 0) {
                document.getElementById('customExerciseCalResult').style.display = 'block';
                document.getElementById('customExerciseCalResultValue').textContent = totalCal;
            } else {
                document.getElementById('customExerciseCalResult').style.display = 'none';
            }
        }
        
        // Клік по категоріях
        document.querySelectorAll('#exerciseCategories .food-category-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('#exerciseCategories .food-category-btn').forEach(function(b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                
                // Ховаємо форму ручного введення
                document.getElementById('customExerciseForm').style.display = 'none';
                document.getElementById('customExerciseBtn').style.display = 'block';
                document.getElementById('selectedExerciseSection').style.display = 'none';
                selectedExercise = null;
                
                showExercisesByCategory(this.getAttribute('data-category'));
            });
        });
        
        // Пошук вправи
        document.getElementById('exerciseSearch').addEventListener('input', function() {
            var query = this.value.toLowerCase().trim();
            var container = document.getElementById('exerciseListContainer');
            
            if (query.length < 2) {
                container.innerHTML = '';
                return;
            }
            
            var results = Storage.searchExercises(query);
            var html = '';
            
            for (var i = 0; i < results.length; i++) {
                html += '<div class="food-item" data-index="' + i + '">' +
                    '<span class="food-item-icon">' + results[i].icon + '</span>' +
                    '<span class="food-item-name">' + Storage.translateExerciseName(results[i].name) + '</span>' +
                    '<span class="food-item-cal">' + results[i].calories + ' ' + I18n.t('kcal') + '/хв</span>' +
                    '</div>';
            }
            
            container.innerHTML = html;
            
            container.querySelectorAll('.food-item').forEach(function(item) {
                item.addEventListener('click', function() {
                    var idx = parseInt(this.getAttribute('data-index'));
                    selectExercise(results[idx]);
                });
            });
        });
        
        // Зміна часу
        document.getElementById('exerciseMinutes').addEventListener('input', calculateCalories);
        
        // Додати вправу з бази
        document.getElementById('addExerciseBtn').addEventListener('click', function() {
            if (!selectedExercise) {
                alert(I18n.t('selectExerciseFirst'));
                return;
            }
            
            var minutes = parseInt(document.getElementById('exerciseMinutes').value) || 0;
            if (minutes <= 0) {
                alert(I18n.t('enterMinutes'));
                return;
            }
            
            var totalCal = Math.round(selectedExercise.calories * minutes);
            
            // Зберігаємо вправу
            var today = Storage.formatDate(new Date());
            var exercises = JSON.parse(localStorage.getItem('exercises_' + today) || '[]');
            exercises.push({
                name: selectedExercise.name,
                icon: selectedExercise.icon,
                calories: totalCal,
                minutes: minutes,
                time: new Date().toLocaleTimeString('uk-UA')
            });
            localStorage.setItem('exercises_' + today, JSON.stringify(exercises));
            
            // Очищаємо
            selectedExercise = null;
            document.getElementById('selectedExerciseSection').style.display = 'none';
            document.getElementById('exerciseSearch').value = '';
            document.getElementById('exerciseListContainer').innerHTML = '';
            document.querySelectorAll('#exerciseCategories .food-category-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            
            alert(I18n.t('exerciseAdded') + ' ' + totalCal + ' ' + I18n.t('kcal') + ' 🔥');
        });
        
        // Кнопка "Своя вправа"
        document.getElementById('customExerciseBtn').addEventListener('click', function() {
            selectedExercise = null;
            document.getElementById('selectedExerciseSection').style.display = 'none';
            document.getElementById('customExerciseBtn').style.display = 'none';
            document.getElementById('customExerciseForm').style.display = 'block';
            document.getElementById('customExerciseName').value = '';
            document.getElementById('customExerciseCalories').value = '';
            document.getElementById('customExerciseMinutes').value = '';
            document.getElementById('customExerciseCalResult').style.display = 'none';
        });
        
        // Обчислення калорій для своєї вправи
        document.getElementById('customExerciseCalories').addEventListener('input', calculateCustomExerciseCalories);
        document.getElementById('customExerciseMinutes').addEventListener('input', calculateCustomExerciseCalories);
        
        // Додати свою вправу
        document.getElementById('addCustomExerciseBtn').addEventListener('click', function() {
            var name = document.getElementById('customExerciseName').value.trim();
            var calories = parseInt(document.getElementById('customExerciseCalories').value) || 0;
            var minutes = parseInt(document.getElementById('customExerciseMinutes').value) || 0;
            
            if (!name) {
                alert('Введи назву вправи!');
                return;
            }
            
            if (calories <= 0) {
                alert('Введи калорії на хвилину!');
                return;
            }
            
            if (minutes <= 0) {
                alert(I18n.t('enterMinutes'));
                return;
            }
            
            var totalCal = Math.round(calories * minutes);
            
            // Зберігаємо вправу
            var today = Storage.formatDate(new Date());
            var exercises = JSON.parse(localStorage.getItem('exercises_' + today) || '[]');
            exercises.push({
                name: name,
                icon: '💪',
                calories: totalCal,
                minutes: minutes,
                time: new Date().toLocaleTimeString('uk-UA')
            });
            localStorage.setItem('exercises_' + today, JSON.stringify(exercises));
            
            // Очищаємо
            document.getElementById('customExerciseForm').style.display = 'none';
            document.getElementById('customExerciseBtn').style.display = 'block';
            document.getElementById('customExerciseName').value = '';
            document.getElementById('customExerciseCalories').value = '';
            document.getElementById('customExerciseMinutes').value = '';
            document.getElementById('customExerciseCalResult').style.display = 'none';
            document.getElementById('exerciseListContainer').innerHTML = '';
            document.querySelectorAll('#exerciseCategories .food-category-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            
            alert(I18n.t('exerciseAdded') + ' ' + totalCal + ' ' + I18n.t('kcal') + ' 🔥');
        });
    }
};
