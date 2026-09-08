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
        
        // === 1. ВЕЛИКИЙ БАНЕР КАМЕРИ (AI сканування) ===
        html += '<div class="ai-camera-banner" id="homeCameraBanner">' +
            '<div class="ai-camera-inner">' +
            '<div class="ai-camera-main" id="cameraMainBtn">' +
            '<div class="ai-camera-icon-wrap">' +
            '<div class="ai-camera-icon">📷</div>' +
            '<div class="ai-camera-icon-pulse"></div>' +
            '</div>' +
            '<div class="ai-camera-text">' +
            '<div class="ai-camera-title">Сфотографувати порцію</div>' +
            '<div class="ai-camera-subtitle">Зроби фото їжі для миттєвого AI-аналізу калорій</div>' +
            '</div>' +
            '</div>' +
            '<button class="ai-gallery-btn" id="homeGalleryBtn" title="Завантажити з галереї">🖼️</button>' +
            '</div>' +
            '</div>';
        
        // === 2. ВАГА + ПРОГРЕС ДНЯ (компактно) ===
        var genderEmoji = profile.gender === 'male' ? '👨' : '👩';
        var progress = Storage.getDayProgress(today);
        
        html += '<div class="weight-progress-strip">' +
            '<div class="weight-info">' +
            '<span class="weight-emoji">' + genderEmoji + '</span>' +
            '<span class="weight-value">' + profile.weight + ' кг</span>' +
            '<span class="weight-goal">' + profile.goal + '</span>' +
            '</div>' +
            '<div class="progress-circle" data-progress="' + progress + '">' +
            '<svg viewBox="0 0 36 36">' +
            '<path class="progress-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>' +
            '<path class="progress-fill" stroke-dasharray="' + progress + ', 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>' +
            '</svg>' +
            '<div class="progress-text">' + progress + '%</div>' +
            '</div>' +
            '</div>';
        
        // === 3. СЬОГОДНІШНІ ЗАПИСИ ЇЖІ ===
        var foodEntries = Storage.getFoodEntries(today);
        
        html += '<div class="home-food-section">' +
            '<div class="section-title">Сьогоднішні записи</div>';
        
        if (foodEntries.length === 0) {
            html += '<div class="home-empty-food">' +
                '<div class="home-empty-icon">🍽️</div>' +
                '<div class="home-empty-text">Ще немає записів</div>' +
                '<div class="home-empty-hint">Сфотографуй їжу!</div>' +
                '</div>';
        } else {
            html += '<div class="food-entries-list">';
            
            var totalCal = 0;
            for (var i = 0; i < foodEntries.length; i++) {
                var entry = foodEntries[i];
                totalCal += entry.calories || 0;
                
                html += '<div class="food-entry-item" data-index="' + i + '">' +
                    '<div class="food-entry-icon">🍽️</div>' +
                    '<div class="food-entry-info">' +
                    '<div class="food-entry-name">' + entry.name + '</div>' +
                    '<div class="food-entry-meta">' + entry.portion + ' · ' + entry.time + '</div>' +
                    '</div>' +
                    '<div class="food-entry-cal">' + entry.calories + ' ккал</div>' +
                    '<button class="food-entry-delete" data-index="' + i + '">✕</button>' +
                    '</div>';
            }
            
            html += '<div class="food-total-strip">' +
                '<span>Всього сьогодні:</span>' +
                '<span class="food-total-value">' + totalCal + ' ккал</span>' +
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
        
        // Банер камери (клік по всьому банеру)
        var homeCameraBanner = document.getElementById('homeCameraBanner');
        if (homeCameraBanner) {
            homeCameraBanner.addEventListener('click', function() {
                self.openCamera();
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
            '<div class="stats-today-title">Сьогоднішній прогрес</div>' +
            '</div>' +
            '<div class="stats-today-circle">' +
            '<svg viewBox="0 0 100 100">' +
            '<circle class="stats-circle-bg" cx="50" cy="50" r="45"/>' +
            '<circle class="stats-circle-fill" cx="50" cy="50" r="45" stroke-dasharray="' + (totalProgress * 2.83) + ' 283"/>' +
            '</svg>' +
            '<div class="stats-today-percent">' + totalProgress + '%</div>' +
            '</div>' +
            '<div class="stats-today-label">всього виконано</div>' +
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
                '<div class="stats-block-name">' + block.name + '</div>' +
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
                        '<div class="stats-habit-name">' + h.name + '</div>' +
                        '<div class="stats-habit-count">' + count + ' ' + (h.unit || 'разів') + 
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
            '<div class="stats-section-title">Активність за тиждень</div>' +
            '<div class="stats-calendar">';
        
        var dayNamesFull = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
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
            '<div class="profile-avatar">' +
            '<div class="profile-avatar-emoji">' + genderEmoji + '</div>' +
            '</div>' +
            '<div class="profile-name">Мій профіль</div>' +
            '<div class="profile-status">' + (activeDays > 0 ? '🔥 Активний ' + activeDays + ' днів' : 'Почни свій шлях!') + '</div>' +
            '</div>' +
            
            '<div class="profile-stats">' +
            '<div class="profile-stat-item">' +
            '<div class="profile-stat-number">' + profile.weight + '</div>' +
            '<div class="profile-stat-label">кг</div>' +
            '</div>' +
            '<div class="profile-stat-divider"></div>' +
            '<div class="profile-stat-item">' +
            '<div class="profile-stat-number">' + totalWeek + '</div>' +
            '<div class="profile-stat-label">за тиждень</div>' +
            '</div>' +
            '<div class="profile-stat-divider"></div>' +
            '<div class="profile-stat-item">' +
            '<div class="profile-stat-number">' + activeDays + '</div>' +
            '<div class="profile-stat-label">днів</div>' +
            '</div>' +
            '</div>' +
            
            '<div class="profile-goal-card">' +
            '<div class="profile-goal-icon">🎯</div>' +
            '<div class="profile-goal-info">' +
            '<div class="profile-goal-title">Моя мета</div>' +
            '<div class="profile-goal-text">' + profile.goal + '</div>' +
            '</div>' +
            '</div>' +
            
            '<div class="profile-settings">' +
            '<div class="profile-settings-title">Налаштування</div>' +
            
            '<div class="profile-setting-item">' +
            '<div class="profile-setting-icon">👤</div>' +
            '<div class="profile-setting-label">Стать</div>' +
            '<div class="gender-picker">' +
            '<div class="gender-option ' + (profile.gender === 'male' ? 'selected' : '') + '" data-gender="male">👨 Чоловік</div>' +
            '<div class="gender-option ' + (profile.gender === 'female' ? 'selected' : '') + '" data-gender="female">👩 Жінка</div>' +
            '</div>' +
            '</div>' +
            
            '<div class="profile-setting-item">' +
            '<div class="profile-setting-icon">⚖️</div>' +
            '<div class="profile-setting-label">Вага</div>' +
            '<input type="number" id="profileWeight" value="' + profile.weight + '" class="profile-input">' +
            '</div>' +
            
            '<div class="profile-setting-item">' +
            '<div class="profile-setting-icon">🎯</div>' +
            '<div class="profile-setting-label">Мета</div>' +
            '<input type="text" id="profileGoal" value="' + profile.goal + '" class="profile-input">' +
            '</div>' +
            
            '</div>' +
            
            '<button class="btn-primary btn-full" id="saveProfileBtn">Зберегти зміни</button>' +
            
            '<div class="profile-motivation">' +
            '<div class="motivation-emoji">💪</div>' +
            '<div class="motivation-text">Кожен крок наближає тебе до мети!</div>' +
            '</div>' +
            
            '</div>';
        
        container.innerHTML = html;
        this.bindProfileEvents();
    },
    
    bindProfileEvents: function() {
        var self = this;
        
        document.querySelectorAll('.gender-option').forEach(function(opt) {
            opt.addEventListener('click', function() {
                document.querySelectorAll('.gender-option').forEach(function(o) {
                    o.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        });
        
        document.getElementById('saveProfileBtn').addEventListener('click', function() {
            var gender = document.querySelector('.gender-option.selected').getAttribute('data-gender');
            var weight = parseInt(document.getElementById('profileWeight').value) || 60;
            var goal = document.getElementById('profileGoal').value.trim() || 'Здоров\'я та форма';
            
            Storage.saveProfile({ gender: gender, weight: weight, goal: goal });
            
            var btn = document.getElementById('saveProfileBtn');
            btn.textContent = '✓ Збережено!';
            btn.style.background = 'linear-gradient(135deg, #20c997, #17a589)';
            
            setTimeout(function() {
                btn.textContent = 'Зберегти зміни';
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
            '<button class="add-tab' + (this.addTab === 'nutrition' ? ' active' : '') + '" data-tab="nutrition">🍎 Харчування</button>' +
            '<button class="add-tab' + (this.addTab === 'exercises' ? ' active' : '') + '" data-tab="exercises">🏋️ Вправи</button>' +
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
            '<input type="text" id="exerciseSearch" placeholder="🔍 Знайти вправу..." autocomplete="off">' +
            '</div>' +
            
            // Категорії
            '<div class="food-categories" id="exerciseCategories">';
        
        for (var i = 0; i < categories.length; i++) {
            html += '<button class="food-category-btn" data-category="' + categories[i] + '">' + categories[i] + '</button>';
        }
        
        html += '</div>' +
            
            // Список вправ
            '<div class="food-list" id="exerciseListContainer"></div>' +
            
            // Кнопка "Своя вправа"
            '<div class="custom-food-btn-wrap">' +
            '<button class="custom-food-btn" id="customExerciseBtn">✍️ Своя вправа</button>' +
            '</div>' +
            
            // Форма ручного введення (прихована)
            '<div class="custom-food-form" id="customExerciseForm" style="display: none;">' +
            '<div class="form-group">' +
            '<label>Назва вправи</label>' +
            '<input type="text" id="customExerciseName" placeholder="Наприклад: Танці з собакою">' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>Калорії на хвилину</label>' +
            '<input type="number" id="customExerciseCalories" placeholder="Наприклад: 8">' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>Час (хвилини)</label>' +
            '<input type="number" id="customExerciseMinutes" placeholder="Наприклад: 30">' +
            '</div>' +
            
            '<div class="cal-result" id="customExerciseCalResult" style="display: none;">' +
            '<div class="cal-result-value" id="customExerciseCalResultValue">0</div>' +
            '<div class="cal-result-label">кілокалорій спалено</div>' +
            '</div>' +
            
            '<button class="btn-primary" id="addCustomExerciseBtn">Додати запис</button>' +
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
            '<input type="number" id="exerciseMinutes" placeholder="Скільки хвилин займалась">' +
            '</div>' +
            
            '<div class="cal-result" id="exerciseCalResult" style="display: none;">' +
            '<div class="cal-result-value" id="exerciseCalResultValue">0</div>' +
            '<div class="cal-result-label">кілокалорій спалено</div>' +
            '</div>' +
            
            '<button class="btn-primary" id="addExerciseBtn">Додати запис</button>' +
            '</div>' +
            
            '</div>';
        
        return html;
    },
    
    renderAddNutrition: function() {
        var categories = Storage.getFoodCategories();
        
        var html = '<div class="nutrition-section">' +
            
            // Пошук страви
            '<div class="food-search-box">' +
            '<input type="text" id="foodSearch" placeholder="🔍 Знайти страву..." autocomplete="off">' +
            '</div>' +
            
            // Категорії
            '<div class="food-categories" id="foodCategories">';
        
        for (var i = 0; i < categories.length; i++) {
            html += '<button class="food-category-btn" data-category="' + categories[i] + '">' + categories[i] + '</button>';
        }
        
        html += '</div>' +
            
            // Список страв
            '<div class="food-list" id="foodListContainer"></div>' +
            
            // Кнопка "Своя страва"
            '<div class="custom-food-btn-wrap">' +
            '<button class="custom-food-btn" id="customFoodBtn">✍️ Своя страва</button>' +
            '</div>' +
            
            // Форма ручного введення (прихована)
            '<div class="custom-food-form" id="customFoodForm" style="display: none;">' +
            '<div class="form-group">' +
            '<label>Назва страви</label>' +
            '<input type="text" id="customFoodName" placeholder="Наприклад: Жарена риба">' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>Калорії на 100г</label>' +
            '<input type="number" id="customFoodCalories" placeholder="Наприклад: 180">' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>Порція (грами)</label>' +
            '<input type="number" id="customFoodGrams" placeholder="Наприклад: 200">' +
            '</div>' +
            
            '<div class="cal-result" id="customCalResult" style="display: none;">' +
            '<div class="cal-result-value" id="customCalResultValue">0</div>' +
            '<div class="cal-result-label">кілокалорій</div>' +
            '</div>' +
            
            '<button class="btn-primary" id="addCustomFoodBtn">Додати запис</button>' +
            '</div>' +
            
            // Вибрана страва з бази
            '<div class="selected-food-section" id="selectedFoodSection" style="display: none;">' +
            '<div class="selected-food-header">' +
            '<span class="selected-food-icon" id="selectedFoodIcon"></span>' +
            '<span class="selected-food-name" id="selectedFoodName"></span>' +
            '<span class="selected-food-cal" id="selectedFoodCal"></span>' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>Порція (грами)</label>' +
            '<input type="number" id="portionGrams" placeholder="Введи кількість грамів">' +
            '</div>' +
            
            '<div class="cal-result" id="calResult" style="display: none;">' +
            '<div class="cal-result-value" id="calResultValue">0</div>' +
            '<div class="cal-result-label">кілокалорій</div>' +
            '</div>' +
            
            '<button class="btn-primary" id="addFoodBtn">Додати запис</button>' +
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
                    '<span class="food-item-name">' + foods[i].name + '</span>' +
                    '<span class="food-item-cal">' + foods[i].calories + ' ккал/100г</span>' +
                    '<span class="food-item-arrow">▼</span>' +
                    '</div>' +
                    '<div class="food-item-details">' +
                    '<div class="food-detail-row">' +
                    '<span class="food-detail-label">Калорії на 100г:</span>' +
                    '<span class="food-detail-value">' + foods[i].calories + ' ккал</span>' +
                    '</div>' +
                    '<div class="food-detail-row">' +
                    '<span class="food-detail-label">Категорія:</span>' +
                    '<span class="food-detail-value">' + foods[i].category + '</span>' +
                    '</div>' +
                    '<button class="food-item-select-btn" data-index="' + i + '" data-category="' + category + '">Обрати цю страву</button>' +
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
            document.getElementById('selectedFoodCal').textContent = food.calories + ' ккал/100г';
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
                    '<span class="food-item-name">' + results[i].name + '</span>' +
                    '<span class="food-item-cal">' + results[i].calories + ' ккал/100г</span>' +
                    '<span class="food-item-arrow">▼</span>' +
                    '</div>' +
                    '<div class="food-item-details">' +
                    '<div class="food-detail-row">' +
                    '<span class="food-detail-label">Калорії на 100г:</span>' +
                    '<span class="food-detail-value">' + results[i].calories + ' ккал</span>' +
                    '</div>' +
                    '<div class="food-detail-row">' +
                    '<span class="food-detail-label">Категорія:</span>' +
                    '<span class="food-detail-value">' + results[i].category + '</span>' +
                    '</div>' +
                    '<button class="food-item-select-btn" data-index="' + i + '">Обрати цю страву</button>' +
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
                alert('Спочатку обери страву з переліку!');
                return;
            }
            
            var grams = parseInt(document.getElementById('portionGrams').value) || 0;
            if (grams <= 0) {
                alert('Введи кількість грамів!');
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
            
            alert('Страву додано! ' + totalCal + ' ккал');
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
                alert('Введи кількість грамів!');
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
            
            alert('Страву додано! ' + totalCal + ' ккал');
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
                '<div class="food-entry-name">' + e.name + '</div>' +
                (e.portion ? '<div class="food-entry-portion">' + e.portion + '</div>' : '') +
                '</div>' +
                '<div class="food-entry-cal">' + (e.calories || '?') + ' ккал</div>' +
                '</div>';
        }
        
        html = '<div class="food-total">Всього сьогодні: <strong>' + totalCal + ' ккал</strong></div>' + html;
        container.innerHTML = html;
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
            '<div class="food-result-title">AI розпізнав страву</div>' +
            '</div>' +
            '<div class="food-result-body">' +
            '<div class="food-result-calories">' +
            '<div class="food-result-cal-number">' + data.totalCalories + '</div>' +
            '<div class="food-result-cal-label">ккал</div>' +
            '</div>' +
            '<div class="food-result-macros">' +
            '<div class="food-result-macro">' +
            '<div class="food-result-macro-value">' + (data.protein || 0) + 'г</div>' +
            '<div class="food-result-macro-label">Білок</div>' +
            '</div>' +
            '<div class="food-result-macro">' +
            '<div class="food-result-macro-value">' + (data.fat || 0) + 'г</div>' +
            '<div class="food-result-macro-label">Жири</div>' +
            '</div>' +
            '<div class="food-result-macro">' +
            '<div class="food-result-macro-value">' + (data.carbs || 0) + 'г</div>' +
            '<div class="food-result-macro-label">Вуглеводи</div>' +
            '</div>' +
            '</div>';
        
        // Назва страви (редагована)
        for (var i = 0; i < data.dishes.length; i++) {
            var dish = data.dishes[i];
            html += '<div class="food-result-dish">' +
                '<input type="text" class="food-result-dish-input" value="' + dish.name + '" data-index="' + i + '">' +
                '<div class="food-result-dish-cal">' + dish.calories + ' ккал</div>' +
                '</div>';
        }
        
        html += '</div>' +
            '<div class="food-result-footer">' +
            '<button class="food-result-save-btn" id="saveFoodResultBtn">💾 Зберегти ' + data.totalCalories + ' ккал</button>' +
            '<button class="food-result-close-btn" id="closeFoodResultBtn">✕ Закрити</button>' +
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
            
            Storage.addFoodEntry({
                name: names.join(' + '),
                calories: data.totalCalories,
                portion: 'з фото (AI)',
                time: new Date().toLocaleTimeString('uk-UA')
            });
            
            self.closeFoodResult();
            self.renderHome();
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
                '<span class="fallback-cal">' + f.cal + ' ккал</span>' +
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
            totalDiv.textContent = 'Обери страви';
            saveBtn.disabled = true;
        } else {
            totalDiv.innerHTML = 'Разом: <strong>' + total + ' ккал</strong>';
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
                    '<span class="food-item-name">' + exercises[i].name + '</span>' +
                    '<span class="food-item-cal">' + exercises[i].calories + ' ккал/хв</span>' +
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
            document.getElementById('selectedExerciseCal').textContent = exercise.calories + ' ккал/хв';
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
                    '<span class="food-item-name">' + results[i].name + '</span>' +
                    '<span class="food-item-cal">' + results[i].calories + ' ккал/хв</span>' +
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
                alert('Спочатку обери вправу з переліку!');
                return;
            }
            
            var minutes = parseInt(document.getElementById('exerciseMinutes').value) || 0;
            if (minutes <= 0) {
                alert('Введи кількість хвилин!');
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
            
            alert('Вправу додано! ' + totalCal + ' ккал спалено 🔥');
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
                alert('Введи кількість хвилин!');
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
            
            alert('Вправу додано! ' + totalCal + ' ккал спалено 🔥');
        });
    }
};
