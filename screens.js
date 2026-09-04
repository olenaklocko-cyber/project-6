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
        var blocks = Storage.getBlocks();
        
        // Профіль
        var genderEmoji = profile.gender === 'male' ? '👨' : '👩';
        var html = '<div class="profile-bar">' +
            '<span class="profile-gender">' + genderEmoji + '</span>' +
            '<span class="profile-weight">' + profile.weight + ' кг</span>' +
            '<span class="profile-goal">' + profile.goal + '</span>' +
            '</div>';
        
        // Прогрес
        var progress = Storage.getDayProgress(today);
        html += '<div class="day-progress">' +
            '<div class="day-progress-text">Мій прогрес сьогодні: <strong>' + progress + '%</strong></div>' +
            '<div class="day-progress-bar">' +
            '<div class="day-progress-fill" style="width: ' + progress + '%"></div>' +
            '</div>' +
            '</div>';
        
        // Блоки
        html += '<div class="blocks-grid">';
        
        for (var b = 0; b < blocks.length; b++) {
            var block = blocks[b];
            var blockProgress = Storage.getBlockProgress(block.id, today);
            var isExpanded = this.expandedBlock === block.id;
            
            html += '<div class="block' + (isExpanded ? ' expanded' : '') + '" data-block="' + block.id + '" style="border-color: ' + block.color + '">' +
                '<div class="block-header">' +
                '<div class="block-icon ' + this.getIconAnimation(block.icon) + '" style="background: linear-gradient(135deg, ' + block.color + ', ' + block.color + 'cc)">' + block.icon + '</div>' +
                '<div class="block-info">' +
                '<div class="block-name">' + block.name + '</div>' +
                '<div class="block-progress-text">' + blockProgress + '%</div>' +
                '</div>' +
                '</div>' +
                '<div class="block-progress-bar">' +
                '<div class="block-progress-fill" style="width: ' + blockProgress + '%; background: linear-gradient(90deg, ' + block.color + ', ' + block.color + 'cc)"></div>' +
                '</div>';
            
            if (isExpanded) {
                html += '<div class="block-habits">';
                
                for (var i = 0; i < block.habits.length; i++) {
                    var h = block.habits[i];
                    var count = Storage.getCount(h.id, today);
                    var goal = h.goal || 0;
                    var goalPercent = goal > 0 ? Math.min(100, Math.round((count / goal) * 100)) : 0;
                    var isDistance = (h.unit === 'км' || h.unit === 'хвилин' || h.unit === 'годин' || h.unit === 'кроків' || h.unit === 'літрів');
                    
                    html += '<div class="habit-card" data-id="' + h.id + '">' +
                        '<div class="habit-header">' +
                        '<div class="habit-icon">' + h.icon + '</div>' +
                        '<div class="habit-info">' +
                        '<div class="habit-name">' + h.name + '</div>' +
                        '<div class="habit-desc">' + h.description + '</div>' +
                        '<div class="habit-count">' + count + ' ' + (h.unit || 'разів') + 
                        (goal > 0 ? ' / ' + goal : '') + '</div>' +
                        '</div>' +
                        '</div>';
                    
                    if (goal > 0) {
                        html += '<div class="habit-progress-mini">' +
                            '<div class="habit-progress-mini-bar">' +
                            '<div class="habit-progress-mini-fill" style="width: ' + goalPercent + '%; background: ' + block.color + '"></div>' +
                            '</div>' +
                            '<div class="habit-progress-mini-text">' + goalPercent + '%</div>' +
                            '</div>';
                    }
                    
                    html += '<div class="habit-actions">';
                    
                    if (isDistance) {
                        html += '<div class="input-group">' +
                            '<input type="number" class="track-input" data-id="' + h.id + '" placeholder="0 ' + (h.unit || '') + '">' +
                            '<button class="btn-record" data-id="' + h.id + '" style="background: ' + block.color + '">Записати</button>' +
                            '</div>';
                    } else {
                        html += '<div class="counter-group">' +
                            '<button class="counter-btn minus" data-id="' + h.id + '">−</button>' +
                            '<div class="counter-value">' + count + '</div>' +
                            '<button class="counter-btn plus" data-id="' + h.id + '" style="background: ' + block.color + '">+1</button>' +
                            '<button class="counter-btn plus-10" data-id="' + h.id + '" style="background: ' + block.color + '">+10</button>' +
                            '</div>';
                    }
                    
                    html += '</div></div>';
                }
                
                html += '</div>';
            }
            
            html += '</div>';
        }
        
        html += '</div>';
        
        // Користувацькі звички
        var customHabits = Storage.getCustomHabits();
        
        if (customHabits.length > 0) {
            html += '<div class="section-header" style="margin-top: 20px;">' +
                '<div class="section-title">⭐ Мої додаткові звички</div>' +
                '</div>';
            
            html += '<div class="habits-list">';
            
            for (var i = 0; i < customHabits.length; i++) {
                var h = customHabits[i];
                var count = Storage.getCount(h.id, today);
                var goal = h.goal || 0;
                var goalPercent = goal > 0 ? Math.min(100, Math.round((count / goal) * 100)) : 0;
                var isDistance = (h.unit === 'км' || h.unit === 'хвилин' || h.unit === 'годин');
                
                html += '<div class="habit-card custom" data-id="' + h.id + '">' +
                    '<div class="habit-header">' +
                    '<div class="habit-icon">' + h.icon + '</div>' +
                    '<div class="habit-info">' +
                    '<div class="habit-name">' + h.name + '</div>' +
                    (h.description ? '<div class="habit-desc">' + h.description + '</div>' : '') +
                    '<div class="habit-count">' + count + ' ' + (h.unit || 'разів') + 
                    (goal > 0 ? ' / ' + goal : '') + '</div>' +
                    '</div>' +
                    '</div>';
                
                if (goal > 0) {
                    html += '<div class="habit-progress-mini">' +
                        '<div class="habit-progress-mini-bar">' +
                        '<div class="habit-progress-mini-fill" style="width: ' + goalPercent + '%"></div>' +
                        '</div>' +
                        '<div class="habit-progress-mini-text">' + goalPercent + '%</div>' +
                        '</div>';
                }
                
                html += '<div class="habit-actions">';
                
                if (isDistance) {
                    html += '<div class="input-group">' +
                        '<input type="number" class="track-input" data-id="' + h.id + '" placeholder="0 ' + (h.unit || '') + '">' +
                        '<button class="btn-record" data-id="' + h.id + '">Записати</button>' +
                        '</div>';
                } else {
                    html += '<div class="counter-group">' +
                        '<button class="counter-btn minus" data-id="' + h.id + '">−</button>' +
                        '<div class="counter-value">' + count + '</div>' +
                        '<button class="counter-btn plus" data-id="' + h.id + '">+1</button>' +
                        '<button class="counter-btn plus-10" data-id="' + h.id + '">+10</button>' +
                        '</div>';
                }
                
                html += '</div></div>';
            }
            
            html += '</div>';
        }
        
        container.innerHTML = html;
        this.bindHomeEvents();
    },
    
    // Прив'язка подій
    bindHomeEvents: function() {
        var self = this;
        
        // Розгортання блоків
        document.querySelectorAll('.block').forEach(function(block) {
            block.addEventListener('click', function() {
                var blockId = this.getAttribute('data-block');
                self.expandedBlock = self.expandedBlock === blockId ? null : blockId;
                self.renderHome();
            });
        });
        
        // Кнопки +/-
        document.querySelectorAll('.counter-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = parseInt(this.getAttribute('data-id'));
                var date = Storage.formatDate(self.selectedDate);
                var action = this.classList.contains('plus') ? 1 : 
                             this.classList.contains('plus-10') ? 10 : -1;
                Storage.incrementCount(id, date, action);
                self.renderHome();
            });
        });
        
        // Кнопки "Записати"
        document.querySelectorAll('.btn-record').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = parseInt(this.getAttribute('data-id'));
                var input = document.querySelector('.track-input[data-id="' + id + '"]');
                var value = parseInt(input.value) || 0;
                if (value > 0) {
                    var date = Storage.formatDate(self.selectedDate);
                    Storage.setCount(id, date, value);
                    self.renderHome();
                }
            });
        });
        
        // Enter в полі
        document.querySelectorAll('.track-input').forEach(function(input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    var id = parseInt(this.getAttribute('data-id'));
                    var value = parseInt(this.value) || 0;
                    if (value > 0) {
                        var date = Storage.formatDate(self.selectedDate);
                        Storage.setCount(id, date, value);
                        self.renderHome();
                    }
                }
            });
        });
    },
    
    // ===== СТАТИСТИКА =====
    renderStats: function() {
        var container = document.getElementById('screen-stats');
        var blocks = Storage.getBlocks();
        var today = Storage.formatDate(new Date());
        
        var html = '<div class="stats-grid">';
        
        // Загальний прогрес
        var totalProgress = Storage.getDayProgress(today);
        html += '<div class="stats-card">' +
            '<h3>Сьогодні</h3>' +
            '<div class="stats-big-number">' + totalProgress + '%</div>' +
            '<div class="stats-label">всього виконано</div>' +
            '</div>';
        
        // Кількість блоків
        html += '<div class="stats-card">' +
            '<h3>Блоків</h3>' +
            '<div class="stats-big-number">' + blocks.length + '</div>' +
            '<div class="stats-label">відстежується</div>' +
            '</div>';
        
        html += '</div>';
        
        // Прогрес по блоках
        html += '<div class="chart-container">' +
            '<h3>Прогрес по блоках</h3>';
        
        for (var b = 0; b < blocks.length; b++) {
            var block = blocks[b];
            var blockProgress = Storage.getBlockProgress(block.id, today);
            
            html += '<div class="habit-stat-row">' +
                '<div class="habit-stat-icon" style="background: ' + block.color + '20">' + block.icon + '</div>' +
                '<div class="habit-stat-info">' +
                '<div class="habit-stat-name">' + block.name + '</div>' +
                '<div class="habit-stat-bar">' +
                '<div class="habit-stat-fill" style="width: ' + blockProgress + '%; background: ' + block.color + '"></div>' +
                '</div>' +
                '</div>' +
                '<div class="habit-stat-count">' + blockProgress + '%</div>' +
                '</div>';
        }
        
        html += '</div>';
        
        // Графік по днях
        html += '<div class="chart-container">' +
            '<h3>Активність за тиждень</h3>' +
            '<div class="week-chart">';
        
        var dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        var weekData = [];
        
        for (var i = 6; i >= 0; i--) {
            var d = new Date();
            d.setDate(d.getDate() - i);
            var dateStr = Storage.formatDate(d);
            weekData.push({
                day: dayNames[d.getDay()],
                progress: Storage.getDayProgress(dateStr)
            });
        }
        
        var maxProgress = Math.max.apply(null, weekData.map(function(d) { return d.progress; }));
        
        for (var i = 0; i < weekData.length; i++) {
            var height = maxProgress > 0 ? (weekData[i].progress / maxProgress) * 100 : 0;
            html += '<div class="week-bar">' +
                '<div class="week-fill" style="height: ' + Math.max(height, 5) + '%"></div>' +
                '<div class="week-label">' + weekData[i].day + '</div>' +
                '</div>';
        }
        
        html += '</div></div>';
        
        container.innerHTML = html;
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
    addTab: 'exercises',
    
    renderAdd: function() {
        var container = document.getElementById('screen-add');
        var self = this;
        
        var html = '<div class="add-form">' +
            '<div class="add-tabs">' +
            '<button class="add-tab' + (this.addTab === 'exercises' ? ' active' : '') + '" data-tab="exercises">🏋️ Вправи</button>' +
            '<button class="add-tab' + (this.addTab === 'nutrition' ? ' active' : '') + '" data-tab="nutrition">🍎 Харчування</button>' +
            '</div>';
        
        if (this.addTab === 'exercises') {
            html += this.renderAddExercises();
        } else {
            html += this.renderAddNutrition();
        }
        
        html += '</div>';
        
        container.innerHTML = html;
        this.bindAddEvents();
    },
    
    renderAddExercises: function() {
        var icons = ['⚽', '🏀', '🎾', '🏃', '💪', '🧘', '🚴', '🏊', '🤸', '🏋️', '🥊', '⛷️'];
        var units = ['разів', 'хвилин', 'км', 'підходів', 'кг'];
        
        var html = '<div class="form-group">' +
            '<label>Назва вправи</label>' +
            '<input type="text" id="habitName" placeholder="Наприклад: Йога">' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>Опис (опціонально)</label>' +
            '<input type="text" id="habitDesc" placeholder="Наприклад: Ранкові вправи">' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>Одиниці вимірювання</label>' +
            '<div class="unit-picker" id="unitPicker">';
        
        for (var i = 0; i < units.length; i++) {
            html += '<div class="unit-option' + (i === 0 ? ' selected' : '') + '" data-unit="' + units[i] + '">' + units[i] + '</div>';
        }
        
        html += '</div></div>' +
            
            '<div class="form-group">' +
            '<label>Мета на день</label>' +
            '<input type="number" id="habitGoal" placeholder="Наприклад: 50 разів">' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>Обери іконку</label>' +
            '<div class="icon-picker" id="iconPicker">';
        
        for (var i = 0; i < icons.length; i++) {
            html += '<div class="icon-option' + (i === 0 ? ' selected' : '') + '" data-icon="' + icons[i] + '">' + icons[i] + '</div>';
        }
        
        html += '</div></div>' +
            '<button class="btn-primary" id="addHabitBtn">Додати вправу</button>';
        
        return html;
    },
    
    renderAddNutrition: function() {
        var html = '<div class="nutrition-section">' +
            '<div class="camera-btn-container">' +
            '<button class="camera-btn" id="cameraBtn">' +
            '<div class="camera-icon">📸</div>' +
            '<div class="camera-text">Сфотографувати порцію</div>' +
            '<div class="camera-hint">Зроби фото їжі для аналізу калорій</div>' +
            '</button>' +
            '</div>' +
            
            '<div class="nutrition-manual" id="nutritionManual">' +
            '<div class="form-group">' +
            '<label>Або введи вручну</label>' +
            '<input type="text" id="foodName" placeholder="Назва страви">' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>Калорії</label>' +
            '<input type="number" id="foodCalories" placeholder="Калорії">' +
            '</div>' +
            
            '<button class="btn-primary" id="addFoodBtn">Додати запис</button>' +
            '</div>' +
            
            '<div class="food-history" id="foodHistory">' +
            '<div class="section-title">Сьогоднішні записи</div>' +
            '<div id="foodList"></div>' +
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
        
        // Кнопка камери
        document.getElementById('cameraBtn').addEventListener('click', function() {
            self.openCamera();
        });
        
        // Додати їжу вручну
        document.getElementById('addFoodBtn').addEventListener('click', function() {
            var name = document.getElementById('foodName').value.trim();
            var calories = parseInt(document.getElementById('foodCalories').value) || 0;
            
            if (!name) {
                alert('Введи назву страви!');
                return;
            }
            
            Storage.addFoodEntry({ name: name, calories: calories, time: new Date().toLocaleTimeString('uk-UA') });
            document.getElementById('foodName').value = '';
            document.getElementById('foodCalories').value = '';
            self.renderFoodHistory();
        });
        
        this.renderFoodHistory();
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
                '<div class="food-entry-name">' + e.name + '</div>' +
                '<div class="food-entry-cal">' + (e.calories || '?') + ' ккал</div>' +
                '</div>';
        }
        
        html = '<div class="food-total">Всього: <strong>' + totalCal + ' ккал</strong></div>' + html;
        container.innerHTML = html;
    },
    
    openCamera: function() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        
        input.onchange = function(e) {
            var file = e.target.files[0];
            if (file) {
                alert('📸 Фото отримано! Функція аналізу їжі буде додана пізніше.');
            }
        };
        
        input.click();
    },
    
    bindAddForm: function() {
        var self = this;
        
        document.querySelectorAll('.icon-option').forEach(function(opt) {
            opt.addEventListener('click', function() {
                document.querySelectorAll('.icon-option').forEach(function(o) {
                    o.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        });
        
        var goalInput = document.getElementById('habitGoal');
        var placeholders = {
            'разів': 'Наприклад: 50 разів',
            'хвилин': 'Наприклад: 30 хвилин',
            'км': 'Наприклад: 5 км',
            'підходів': 'Наприклад: 3 підходи',
            'кг': 'Наприклад: 20 кг'
        };
        
        document.querySelectorAll('.unit-option').forEach(function(opt) {
            opt.addEventListener('click', function() {
                document.querySelectorAll('.unit-option').forEach(function(o) {
                    o.classList.remove('selected');
                });
                this.classList.add('selected');
                var unit = this.getAttribute('data-unit');
                goalInput.placeholder = placeholders[unit] || 'Мета на день';
            });
        });
        
        document.getElementById('addHabitBtn').addEventListener('click', function() {
            var name = document.getElementById('habitName').value.trim();
            var desc = document.getElementById('habitDesc').value.trim();
            var icon = document.querySelector('.icon-option.selected').getAttribute('data-icon');
            var unit = document.querySelector('.unit-option.selected').getAttribute('data-unit');
            var goal = parseInt(document.getElementById('habitGoal').value) || 0;
            
            if (!name) {
                alert('Введи назву вправи!');
                return;
            }
            
            Storage.addHabit({ name: name, description: desc, icon: icon, unit: unit, goal: goal });
            document.getElementById('habitName').value = '';
            document.getElementById('habitDesc').value = '';
            document.getElementById('habitGoal').value = '';
            self.switchScreen('home');
        });
    }
};
