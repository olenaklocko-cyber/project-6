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
            '<label>Назва страви</label>' +
            '<input type="text" id="foodName" placeholder="Почни вводити назву..." autocomplete="off">' +
            '<div class="food-suggestions" id="foodSuggestions"></div>' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>Калорії (ккал)</label>' +
            '<input type="number" id="foodCalories" placeholder="Автоматично або введи">' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>Кількість (порція)</label>' +
            '<input type="text" id="foodPortion" placeholder="Наприклад: 1 тарілка, 200г">' +
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
        
        // База продуктів з калоріями (на 100г)
        this.foodDB = [
            { name: 'Вареники', calories: 210, portion: '1 тарілка (300г)', total: 630 },
            { name: 'Вареники з картоплею', calories: 210, portion: '1 тарілка (300г)', total: 630 },
            { name: 'Вареники з вишнями', calories: 200, portion: '1 тарілка (250г)', total: 500 },
            { name: 'Вареники з м\'ясом', calories: 220, portion: '1 тарілка (300г)', total: 660 },
            { name: 'Вареники з сиром', calories: 195, portion: '1 тарілка (300г)', total: 585 },
            { name: 'Вареники з капустою', calories: 185, portion: '1 тарілка (300г)', total: 555 },
            { name: 'Вареники з картоплею та грибами', calories: 200, portion: '1 тарілка (300г)', total: 600 },
            { name: 'Борщ', calories: 50, portion: '1 тарілка (350г)', total: 175 },
            { name: 'Щі', calories: 45, portion: '1 тарілка (350г)', total: 158 },
            { name: 'Картопляне пюре', calories: 95, portion: '1 порція (200г)', total: 190 },
            { name: 'Каша гречана', calories: 132, portion: '1 порція (200г)', total: 264 },
            { name: 'Каша рисова', calories: 130, portion: '1 порція (200г)', total: 260 },
            { name: 'Каша вівсяна', calories: 88, portion: '1 порція (250г)', total: 220 },
            { name: 'Молочна каша', calories: 100, portion: '1 порція (250г)', total: 250 },
            { name: 'Котлета куряча', calories: 190, portion: '1 штука (100г)', total: 190 },
            { name: 'Котлета свиняча', calories: 250, portion: '1 штука (100г)', total: 250 },
            { name: 'Риба смажена', calories: 220, portion: '1 порція (150г)', total: 330 },
            { name: 'Риба запечена', calories: 160, portion: '1 порція (150г)', total: 240 },
            { name: 'Суп курячий', calories: 45, portion: '1 тарілка (350г)', total: 158 },
            { name: 'Суп гороховий', calories: 60, portion: '1 тарілка (350г)', total: 210 },
            { name: 'Борщ український', calories: 55, portion: '1 тарілка (350г)', total: 193 },
            { name: 'Салат Олів\'є', calories: 150, portion: '1 порція (200г)', total: 300 },
            { name: 'Салат з капусти', calories: 30, portion: '1 порція (150г)', total: 45 },
            { name: 'Омлет', calories: 155, portion: '1 штука (200г)', total: 310 },
            { name: 'Яйце варене', calories: 155, portion: '1 штука', total: 155 },
            { name: 'Хліб білий', calories: 265, portion: '1 скибка (30г)', total: 80 },
            { name: 'Хліб чорний', calories: 210, portion: '1 скибка (30г)', total: 63 },
            { name: 'Макарони', calories: 130, portion: '1 порція (200г)', total: 260 },
            { name: 'Паста з соусом', calories: 150, portion: '1 порція (250г)', total: 375 },
            { name: 'Бутерброд з маслом', calories: 280, portion: '1 штука', total: 280 },
            { name: 'Бутерброд з сиром', calories: 300, portion: '1 штука', total: 300 },
            { name: 'Сир творожний', calories: 120, portion: '1 порція (200г)', total: 240 },
            { name: 'Йогурт', calories: 60, portion: '1 упаковка (200г)', total: 120 },
            { name: 'Молоко', calories: 42, portion: '1 склянка (250мл)', total: 105 },
            { name: 'Кефір', calories: 40, portion: '1 склянка (250мл)', total: 100 },
            { name: 'Сметана', calories: 200, portion: '2 столові ложки (30г)', total: 60 },
            { name: 'Масло вершкове', calories: 720, portion: '1 чайна ложка (10г)', total: 72 },
            { name: 'Сир твердий', calories: 350, portion: '1 скибка (30г)', total: 105 },
            { name: 'Ковбаса', calories: 260, portion: '1 скибка (30г)', total: 78 },
            { name: 'Шинка', calories: 145, portion: '1 скибка (30г)', total: 44 },
            { name: 'Курка смажена', calories: 240, portion: '1 порція (150г)', total: 360 },
            { name: 'Курка запечена', calories: 180, portion: '1 порція (150г)', total: 270 },
            { name: 'Стейк яловичий', calories: 270, portion: '1 порція (150г)', total: 405 },
            { name: 'Печінка', calories: 140, portion: '1 порція (150г)', total: 210 },
            { name: 'Горохова каша', calories: 110, portion: '1 порція (200г)', total: 220 },
            { name: 'Боби', calories: 110, portion: '1 порція (200г)', total: 220 },
            { name: 'Квасоля', calories: 100, portion: '1 порція (200г)', total: 200 },
            { name: 'Нут', calories: 160, portion: '1 порція (200г)', total: 320 },
            { name: 'Сочевиця', calories: 115, portion: '1 порція (200г)', total: 230 },
            { name: 'Печено картопля', calories: 95, portion: '1 штука (150г)', total: 143 },
            { name: 'Фрі', calories: 310, portion: '1 порція (100г)', total: 310 },
            { name: 'Піца', calories: 266, portion: '1 скибка (100г)', total: 266 },
            { name: 'Бургер', calories: 295, portion: '1 штука (150г)', total: 443 },
            { name: 'Хот-дог', calories: 290, portion: '1 штука', total: 290 },
            { name: 'Сосиски', calories: 270, portion: '2 штуки (100г)', total: 270 },
            { name: 'Бекон', calories: 540, portion: '2 скибки (30г)', total: 162 },
            { name: 'Сало', calories: 800, portion: '1 скибка (20г)', total: 160 },
            { name: 'Шашлик', calories: 250, portion: '1 порція (150г)', total: 375 },
            { name: 'Пельмені', calories: 200, portion: '1 порція (250г)', total: 500 },
            { name: 'Манти', calories: 210, portion: '1 порція (250г)', total: 525 },
            { name: 'Хінкалі', calories: 200, portion: '1 штука (80г)', total: 160 },
            { name: 'Лагман', calories: 120, portion: '1 тарілка (350г)', total: 420 },
            { name: 'Плов', calories: 150, portion: '1 порція (300г)', total: 450 },
            { name: 'Плов з куркою', calories: 145, portion: '1 порція (300г)', total: 435 },
            { name: 'Плов з м\'ясом', calories: 160, portion: '1 порція (300г)', total: 480 },
            { name: 'Голубці', calories: 130, portion: '2 штуки (200г)', total: 260 },
            { name: 'Голубці у томаті', calories: 140, portion: '2 штуки (200г)', total: 280 },
            { name: 'Рулети з м\'ясом', calories: 180, portion: '2 штуки (200г)', total: 360 },
            { name: 'Запіканка', calories: 110, portion: '1 порція (200г)', total: 220 },
            { name: 'Запіканка з сиру', calories: 130, portion: '1 порція (200г)', total: 260 },
            { name: 'Млинці', calories: 230, portion: '2 штуки', total: 460 },
            { name: 'Млинці з начинкою', calories: 280, portion: '2 штуки', total: 560 },
            { name: 'Млинці з м\'ясом', calories: 300, portion: '2 штуки', total: 600 },
            { name: 'Млинці з сиром', calories: 270, portion: '2 штуки', total: 540 },
            { name: 'Млинці з варенням', calories: 260, portion: '2 штуки', total: 520 },
            { name: 'Вафлі', calories: 320, portion: '2 штуки', total: 640 },
            { name: 'Пончик', calories: 350, portion: '1 штука', total: 350 },
            { name: 'Торт', calories: 350, portion: '1 штука (100г)', total: 350 },
            { name: 'Тістечко', calories: 380, portion: '1 штука (80г)', total: 304 },
            { name: 'Цукерки', calories: 400, portion: '3 штуки (30г)', total: 120 },
            { name: 'Шоколад', calories: 540, portion: '1 скибка (20г)', total: 108 },
            { name: 'Морозиво', calories: 200, portion: '1 порція (100г)', total: 200 },
            { name: 'Печиво', calories: 480, portion: '3 штуки (30г)', total: 144 },
            { name: 'Сухарики', calories: 380, portion: '1 порція (30г)', total: 114 },
            { name: 'Чіпси', calories: 530, portion: '1 порція (30г)', total: 159 },
            { name: 'Попкорн', calories: 380, portion: '1 порція (30г)', total: 114 },
            { name: 'Горіхи', calories: 600, portion: '1 жменя (30г)', total: 180 },
            { name: 'Мигдаль', calories: 580, portion: '1 жменя (30г)', total: 174 },
            { name: 'Кеш\'ю', calories: 570, portion: '1 жменя (30г)', total: 171 },
            { name: 'Арахіс', calories: 570, portion: '1 жменя (30г)', total: 171 },
            { name: 'Ізюм', calories: 300, portion: '1 жменя (30г)', total: 90 },
            { name: 'Курага', calories: 280, portion: '1 жменя (30г)', total: 84 },
            { name: 'Чорнослив', calories: 240, portion: '1 жменя (30г)', total: 72 },
            { name: 'Банан', calories: 95, portion: '1 штука (120г)', total: 114 },
            { name: 'Яблуко', calories: 52, portion: '1 штука (150г)', total: 78 },
            { name: 'Апельсин', calories: 43, portion: '1 штука (150г)', total: 65 },
            { name: 'Груша', calories: 57, portion: '1 штука (150г)', total: 86 },
            { name: 'Виноград', calories: 69, portion: '1 порція (100г)', total: 69 },
            { name: 'Кавун', calories: 30, portion: '1 порція (200г)', total: 60 },
            { name: 'Диня', calories: 35, portion: '1 порція (200г)', total: 70 },
            { name: 'Полуниця', calories: 33, portion: '1 порція (150г)', total: 50 },
            { name: 'Вишня', calories: 50, portion: '1 порція (150г)', total: 75 },
            { name: 'Слива', calories: 45, portion: '1 штука (50г)', total: 23 },
            { name: 'Персик', calories: 40, portion: '1 штука (150г)', total: 60 },
            { name: 'Манго', calories: 60, portion: '1 штука (150г)', total: 90 },
            { name: 'Ківі', calories: 61, portion: '1 штука (75г)', total: 46 },
            { name: 'Ананас', calories: 50, portion: '1 порція (100г)', total: 50 },
            { name: 'Грейпфрут', calories: 42, portion: '1 штука (150г)', total: 63 },
            { name: 'Лимон', calories: 29, portion: '1 штука (60г)', total: 17 },
            { name: 'Виноградний сік', calories: 60, portion: '1 склянка (200мл)', total: 120 },
            { name: 'Апельсиновий сік', calories: 45, portion: '1 склянка (200мл)', total: 90 },
            { name: 'Кола', calories: 42, portion: '1 склянка (330мл)', total: 139 },
            { name: 'Пепсі', calories: 43, portion: '1 склянка (330мл)', total: 142 },
            { name: 'Спрайт', calories: 40, portion: '1 склянка (330мл)', total: 132 },
            { name: 'Чай з цукром', calories: 35, portion: '1 чашка (200мл)', total: 70 },
            { name: 'Кава з молоком', calories: 25, portion: '1 чашка (200мл)', total: 50 },
            { name: 'Какао', calories: 45, portion: '1 чашка (200мл)', total: 90 },
            { name: 'Пиво', calories: 43, portion: '1 пляшка (500мл)', total: 215 },
            { name: 'Вино червоне', calories: 85, portion: '1 келих (150мл)', total: 128 },
            { name: 'Вино біле', calories: 80, portion: '1 келих (150мл)', total: 120 },
            { name: 'Водка', calories: 235, portion: '1 порція (50мл)', total: 118 },
            { name: 'Коньяк', calories: 240, portion: '1 порція (50мл)', total: 120 },
            { name: 'Олія соняшникова', calories: 899, portion: '1 столова ложка (15мл)', total: 135 },
            { name: 'Олія оливкова', calories: 884, portion: '1 столова ложка (15мл)', total: 133 },
            { name: 'Майонез', calories: 680, portion: '1 столова ложка (15мл)', total: 102 },
            { name: 'Кетчуп', calories: 110, portion: '1 столова ложка (15мл)', total: 17 },
            { name: 'Гірчиця', calories: 66, portion: '1 чайна ложка (5мл)', total: 3 },
            { name: 'Соєвий соус', calories: 53, portion: '1 столова ложка (15мл)', total: 8 },
            { name: 'Цукор', calories: 387, portion: '1 чайна ложка (5г)', total: 19 },
            { name: 'Мед', calories: 304, portion: '1 столова ложка (20г)', total: 61 },
            { name: 'Варення', calories: 270, portion: '1 столова ложка (20г)', total: 54 },
            { name: 'Шоколадний соус', calories: 450, portion: '1 столова ложка (15мл)', total: 68 },
            { name: 'Ванільний цукор', calories: 399, portion: '1 пакетик (10г)', total: 4 },
            { name: 'Борошно', calories: 364, portion: '1 склянка (120г)', total: 437 },
            { name: 'Крохмаль', calories: 380, portion: '1 столова ложка (10г)', total: 4 },
            { name: 'Какао порошок', calories: 228, portion: '1 столова ложка (5г)', total: 11 },
            { name: 'Розпушувач', calories: 50, portion: '1 чайна ложка (5г)', total: 3 },
            { name: 'Дріжджі', calories: 105, portion: '1 пакетик (7г)', total: 7 },
            { name: 'Сіль', calories: 0, portion: 'за смаком', total: 0 },
            { name: 'Перець чорний', calories: 251, portion: 'за смаком', total: 2 },
            { name: 'Петрушка', calories: 36, portion: '1 пучок (10г)', total: 4 },
            { name: 'Кріп', calories: 40, portion: '1 пучок (10г)', total: 4 },
            { name: 'Базилік', calories: 23, portion: '5 листків (5г)', total: 1 },
            { name: 'Часник', calories: 149, portion: '1 зубчик (3г)', total: 4 },
            { name: 'Цибуля', calories: 40, portion: '1 штука (100г)', total: 40 },
            { name: 'Морква', calories: 41, portion: '1 штука (100г)', total: 41 },
            { name: 'Буряк', calories: 43, portion: '1 штука (100г)', total: 43 },
            { name: 'Капуста', calories: 25, portion: '1 порція (150г)', total: 38 },
            { name: 'Огірок', calories: 15, portion: '1 штука (100г)', total: 15 },
            { name: 'Помідор', calories: 18, portion: '1 штука (100г)', total: 18 },
            { name: 'Болгарський перець', calories: 27, portion: '1 штука (150г)', total: 41 },
            { name: 'Баклажан', calories: 25, portion: '1 штука (100г)', total: 25 },
            { name: 'Кабачок', calories: 17, portion: '1 штука (100г)', total: 17 },
            { name: 'Гриби', calories: 22, portion: '1 порція (100г)', total: 22 },
            { name: 'Кукурудза', calories: 86, portion: '1 качан (150г)', total: 129 },
            { name: 'Горох', calories: 81, portion: '1 порція (100г)', total: 81 },
            { name: 'Шпинат', calories: 23, portion: '1 порція (100г)', total: 23 },
            { name: 'Авокадо', calories: 160, portion: '1 штука (100г)', total: 160 },
            { name: 'Оливки', calories: 115, portion: '10 штук (30г)', total: 35 },
            { name: 'Каперси', calories: 23, portion: '1 столова ложка (10г)', total: 2 },
            { name: 'Морська капуста', calories: 20, portion: '1 порція (100г)', total: 20 },
            { name: 'Тунець (консерви)', calories: 130, portion: '1 банка (100г)', total: 130 },
            { name: 'Сардини (консерви)', calories: 200, portion: '1 банка (100г)', total: 200 },
            { name: 'Шпроти', calories: 350, portion: '1 банка (100г)', total: 350 },
            { name: 'Креветки', calories: 95, portion: '1 порція (100г)', total: 95 },
            { name: 'Кальмар', calories: 75, portion: '1 порція (100г)', total: 75 },
            { name: 'Крабові палички', calories: 130, portion: '1 порція (50г)', total: 65 },
            { name: 'Ікра червона', calories: 230, portion: '1 столова ложка (15г)', total: 35 },
            { name: 'Ікра чорна', calories: 250, portion: '1 столова ложка (15г)', total: 38 },
            { name: 'М\'ясний бульйон', calories: 15, portion: '1 тарілка (350мл)', total: 53 },
            { name: 'Овочевий бульйон', calories: 10, portion: '1 тарілка (350мл)', total: 35 },
            { name: 'Грибний бульйон', calories: 12, portion: '1 тарілка (350мл)', total: 42 }
        ];
        
        // Кнопка камери
        document.getElementById('cameraBtn').addEventListener('click', function() {
            self.openCamera();
        });
        
        // Автозаповнення
        var foodNameInput = document.getElementById('foodName');
        var suggestionsDiv = document.getElementById('foodSuggestions');
        
        foodNameInput.addEventListener('input', function() {
            var query = this.value.toLowerCase().trim();
            suggestionsDiv.innerHTML = '';
            
            if (query.length < 2) return;
            
            var matches = self.foodDB.filter(function(f) {
                return f.name.toLowerCase().indexOf(query) !== -1;
            }).slice(0, 5);
            
            matches.forEach(function(food) {
                var div = document.createElement('div');
                div.className = 'food-suggestion-item';
                div.innerHTML = '<span class="suggestion-name">' + food.name + '</span>' +
                    '<span class="suggestion-cal">' + food.calories + ' ккал/100г</span>';
                div.addEventListener('click', function() {
                    foodNameInput.value = food.name;
                    document.getElementById('foodCalories').value = food.total;
                    document.getElementById('foodPortion').value = food.portion;
                    suggestionsDiv.innerHTML = '';
                });
                suggestionsDiv.appendChild(div);
            });
        });
        
        // Додати їжу вручну
        document.getElementById('addFoodBtn').addEventListener('click', function() {
            var name = document.getElementById('foodName').value.trim();
            var calories = parseInt(document.getElementById('foodCalories').value) || 0;
            var portion = document.getElementById('foodPortion').value.trim();
            
            if (!name) {
                alert('Введи назву страви!');
                return;
            }
            
            Storage.addFoodEntry({ name: name, calories: calories, portion: portion, time: new Date().toLocaleTimeString('uk-UA') });
            document.getElementById('foodName').value = '';
            document.getElementById('foodCalories').value = '';
            document.getElementById('foodPortion').value = '';
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
        var modal = document.createElement('div');
        modal.className = 'photo-modal';
        modal.innerHTML = '<div class="photo-modal-content">' +
            '<div class="photo-modal-title">Обери джерело фото</div>' +
            '<button class="photo-modal-btn" id="photoTakeBtn">' +
            '<span class="photo-modal-icon">📸</span>' +
            '<span>Зробити фото</span>' +
            '</button>' +
            '<button class="photo-modal-btn" id="photoGalleryBtn">' +
            '<span class="photo-modal-icon">🖼️</span>' +
            '<span>Обрати з галереї</span>' +
            '</button>' +
            '<button class="photo-modal-cancel" id="photoCancelBtn">Скасувати</button>' +
            '</div>';
        
        document.body.appendChild(modal);
        
        var self = this;
        
        document.getElementById('photoTakeBtn').addEventListener('click', function() {
            modal.remove();
            self.openCameraInput('environment');
        });
        
        document.getElementById('photoGalleryBtn').addEventListener('click', function() {
            modal.remove();
            self.openCameraInput('user');
        });
        
        document.getElementById('photoCancelBtn').addEventListener('click', function() {
            modal.remove();
        });
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
            var photoPreview = document.getElementById('photoPreview');
            if (!photoPreview) {
                var container = document.querySelector('.nutrition-section');
                var previewDiv = document.createElement('div');
                previewDiv.id = 'photoPreview';
                previewDiv.className = 'photo-preview';
                container.insertBefore(previewDiv, container.firstChild);
                photoPreview = document.getElementById('photoPreview');
            }
            
            // Показуємо фото та швидкий вибір
            photoPreview.innerHTML = '<div class="photo-preview-card">' +
                '<img src="' + e.target.result + '" alt="Їжа" class="photo-preview-img">' +
                '<div class="quick-add-section">' +
                '<div class="quick-add-title">Що на фото?</div>' +
                '<input type="text" class="quick-search" id="quickSearch" placeholder="🔍 Шукати страву...">' +
                '<div class="quick-categories" id="quickCategories">' +
                '<button class="quick-cat active" data-cat="all">Все</button>' +
                '<button class="quick-cat" data-cat="popular">⭐ Популярне</button>' +
                '<button class="quick-cat" data-cat="breakfast">🌅 Сніданок</button>' +
                '<button class="quick-cat" data-cat="lunch">🍽️ Обід</button>' +
                '<button class="quick-cat" data-cat="dinner">🌙 Вечеря</button>' +
                '<button class="quick-cat" data-cat="snacks">🍿 Перекуси</button>' +
                '</div>' +
                '<div class="quick-food-list" id="quickFoodList"></div>' +
                '<div class="quick-selected" id="quickSelected"></div>' +
                '<div class="quick-total" id="quickTotal">Обери страви</div>' +
                '<button class="btn-primary" id="saveQuickBtn" disabled>💾 Зберегти</button>' +
                '</div>' +
                '</div>';
            
            self.initQuickAdd();
        };
        
        reader.readAsDataURL(file);
    },
    
    initQuickAdd: function() {
        var self = this;
        this.selectedFoods = [];
        
        // Велика база страв
        this.allFoods = [
            // Популярне
            { name: 'Вареники', cal: 210, cat: 'popular', icon: '🥟' },
            { name: 'Борщ', cal: 50, cat: 'popular', icon: '🍲' },
            { name: 'Плов', cal: 150, cat: 'popular', icon: '🍛' },
            { name: 'Котлета', cal: 190, cat: 'popular', icon: '🥩' },
            { name: 'Піца', cal: 266, cat: 'popular', icon: '🍕' },
            { name: 'Бургер', cal: 295, cat: 'popular', icon: '🍔' },
            { name: 'Суши', cal: 200, cat: 'popular', icon: '🍣' },
            { name: 'Макарони', cal: 130, cat: 'popular', icon: '🍝' },
            
            // Сніданок
            { name: 'Каша вівсяна', cal: 88, cat: 'breakfast', icon: '🥣' },
            { name: 'Каша гречана', cal: 132, cat: 'breakfast', icon: '🥣' },
            { name: 'Каша рисова', cal: 130, cat: 'breakfast', icon: '🥣' },
            { name: 'Омлет', cal: 155, cat: 'breakfast', icon: '🥚' },
            { name: 'Яйце варене', cal: 78, cat: 'breakfast', icon: '🥚' },
            { name: 'Бутерброд з маслом', cal: 280, cat: 'breakfast', icon: '🍞' },
            { name: 'Бутерброд з сиром', cal: 300, cat: 'breakfast', icon: '🧀' },
            { name: 'Млинці', cal: 230, cat: 'breakfast', icon: '🥞' },
            { name: 'Сирники', cal: 180, cat: 'breakfast', icon: '🥞' },
            { name: 'Тост', cal: 120, cat: 'breakfast', icon: '🍞' },
            { name: 'Вафлі', cal: 320, cat: 'breakfast', icon: '🧇' },
            { name: 'Смузі', cal: 120, cat: 'breakfast', icon: '🥤' },
            
            // Обід
            { name: 'Суп курячий', cal: 45, cat: 'lunch', icon: '🍲' },
            { name: 'Суп гороховий', cal: 60, cat: 'lunch', icon: '🍲' },
            { name: 'Борщ', cal: 50, cat: 'lunch', icon: '🍲' },
            { name: 'Щі', cal: 45, cat: 'lunch', icon: '🍲' },
            { name: 'Солянка', cal: 65, cat: 'lunch', icon: '🍲' },
            { name: 'Картопляне пюре', cal: 95, cat: 'lunch', icon: '🥔' },
            { name: 'Рис', cal: 130, cat: 'lunch', icon: '🍚' },
            { name: 'Гречка', cal: 132, cat: 'lunch', icon: '🥣' },
            { name: 'Курка смажена', cal: 240, cat: 'lunch', icon: '🍗' },
            { name: 'Курка запечена', cal: 180, cat: 'lunch', icon: '🍗' },
            { name: 'Риба смажена', cal: 220, cat: 'lunch', icon: '🐟' },
            { name: 'Риба запечена', cal: 160, cat: 'lunch', icon: '🐟' },
            { name: 'Стейк', cal: 270, cat: 'lunch', icon: '🥩' },
            { name: 'Вареники', cal: 210, cat: 'lunch', icon: '🥟' },
            { name: 'Пельмені', cal: 200, cat: 'lunch', icon: '🥟' },
            { name: 'Голубці', cal: 130, cat: 'lunch', icon: '🥬' },
            { name: 'Плов', cal: 150, cat: 'lunch', icon: '🍛' },
            { name: 'Лагман', cal: 120, cat: 'lunch', icon: '🍜' },
            { name: 'Харчо', cal: 70, cat: 'lunch', icon: '🍲' },
            { name: 'Салат Олів\'є', cal: 150, cat: 'lunch', icon: '🥗' },
            { name: 'Салат Цезар', cal: 180, cat: 'lunch', icon: '🥗' },
            { name: 'Салат з капусти', cal: 30, cat: 'lunch', icon: '🥗' },
            
            // Вечеря
            { name: 'Запіканка', cal: 110, cat: 'dinner', icon: '🥧' },
            { name: 'Запіканка з сиру', cal: 130, cat: 'dinner', icon: '🥧' },
            { name: 'Млинці з м\'ясом', cal: 300, cat: 'dinner', icon: '🥞' },
            { name: 'Млинці з сиром', cal: 270, cat: 'dinner', icon: '🥞' },
            { name: 'Млинці з варенням', cal: 260, cat: 'dinner', icon: '🥞' },
            { name: 'Котлета куряча', cal: 190, cat: 'dinner', icon: '🥩' },
            { name: 'Котлета свиняча', cal: 250, cat: 'dinner', icon: '🥩' },
            { name: 'Тефтелі', cal: 200, cat: 'dinner', icon: '🥩' },
            { name: 'Рулети з м\'ясом', cal: 180, cat: 'dinner', icon: '🥩' },
            { name: 'Рибні котлети', cal: 180, cat: 'dinner', icon: '🐟' },
            { name: 'Омлет з овочами', cal: 140, cat: 'dinner', icon: '🥚' },
            { name: 'Яйця пашот', cal: 120, cat: 'dinner', icon: '🥚' },
            
            // Перекуси
            { name: 'Сирники', cal: 180, cat: 'snacks', icon: '🥞' },
            { name: 'Йогурт', cal: 60, cat: 'snacks', icon: '🥛' },
            { name: 'Сир творожний', cal: 120, cat: 'snacks', icon: '🧀' },
            { name: 'Сир', cal: 350, cat: 'snacks', icon: '🧀' },
            { name: 'Фрукти', cal: 50, cat: 'snacks', icon: '🍎' },
            { name: 'Банан', cal: 95, cat: 'snacks', icon: '🍌' },
            { name: 'Яблуко', cal: 52, cat: 'snacks', icon: '🍎' },
            { name: 'Виноград', cal: 69, cat: 'snacks', icon: '🍇' },
            { name: 'Горіхи', cal: 600, cat: 'snacks', icon: '🥜' },
            { name: 'Цукерки', cal: 400, cat: 'snacks', icon: '🍬' },
            { name: 'Шоколад', cal: 540, cat: 'snacks', icon: '🍫' },
            { name: 'Печиво', cal: 480, cat: 'snacks', icon: '🍪' },
            { name: 'Морозиво', cal: 200, cat: 'snacks', icon: '🍦' },
            { name: 'Попкорн', cal: 380, cat: 'snacks', icon: '🍿' },
            { name: 'Чіпси', cal: 530, cat: 'snacks', icon: '🍟' },
            { name: 'Хліб', cal: 265, cat: 'snacks', icon: '🍞' },
            { name: 'Сухарики', cal: 380, cat: 'snacks', icon: '🍞' },
            { name: 'Сосиска', cal: 150, cat: 'snacks', icon: '🌭' },
            { name: 'Ковбаса', cal: 260, cat: 'snacks', icon: '🥓' },
            { name: 'Помідор', cal: 18, cat: 'snacks', icon: '🍅' },
            { name: 'Огірок', cal: 15, cat: 'snacks', icon: '🥒' },
            { name: 'Морква', cal: 41, cat: 'snacks', icon: '🥕' },
            { name: 'Капуста', cal: 25, cat: 'snacks', icon: '🥬' },
            { name: 'Картопля', cal: 95, cat: 'snacks', icon: '🥔' },
            { name: 'Кукурудза', cal: 86, cat: 'snacks', icon: '🌽' },
            
            // Напої
            { name: 'Чай', cal: 2, cat: 'snacks', icon: '🍵' },
            { name: 'Кава', cal: 5, cat: 'snacks', icon: '☕' },
            { name: 'Кава з молоком', cal: 25, cat: 'snacks', icon: '☕' },
            { name: 'Какао', cal: 45, cat: 'snacks', icon: '☕' },
            { name: 'Сік', cal: 45, cat: 'snacks', icon: '🧃' },
            { name: 'Компот', cal: 40, cat: 'snacks', icon: '🥤' },
            { name: 'Кефір', cal: 40, cat: 'snacks', icon: '🥛' },
            { name: 'Молоко', cal: 42, cat: 'snacks', icon: '🥛' }
        ];
        
        this.renderFoodList(this.allFoods);
        this.bindQuickEvents();
    },
    
    renderFoodList: function(foods) {
        var container = document.getElementById('quickFoodList');
        var html = '';
        
        for (var i = 0; i < foods.length; i++) {
            var f = foods[i];
            var isSelected = this.selectedFoods.some(function(s) { return s.name === f.name; });
            html += '<div class="quick-item' + (isSelected ? ' selected' : '') + '" data-name="' + f.name + '" data-cal="' + f.cal + '">' +
                '<span class="quick-item-icon">' + f.icon + '</span>' +
                '<span class="quick-item-name">' + f.name + '</span>' +
                '<span class="quick-item-cal">' + f.cal + ' ккал</span>' +
                '</div>';
        }
        
        container.innerHTML = html;
        
        var self = this;
        document.querySelectorAll('.quick-item').forEach(function(item) {
            item.addEventListener('click', function() {
                var name = this.getAttribute('data-name');
                var cal = parseInt(this.getAttribute('data-cal'));
                self.toggleFood(name, cal);
            });
        });
    },
    
    toggleFood: function(name, cal) {
        var index = this.selectedFoods.findIndex(function(f) { return f.name === name; });
        
        if (index > -1) {
            this.selectedFoods.splice(index, 1);
        } else {
            this.selectedFoods.push({ name: name, cal: cal });
        }
        
        this.updateSelectedUI();
    },
    
    updateSelectedUI: function() {
        var self = this;
        var selectedDiv = document.getElementById('quickSelected');
        var totalDiv = document.getElementById('quickTotal');
        var saveBtn = document.getElementById('saveQuickBtn');
        
        if (this.selectedFoods.length === 0) {
            selectedDiv.innerHTML = '';
            totalDiv.textContent = 'Обери страви';
            saveBtn.disabled = true;
            return;
        }
        
        var html = '';
        var total = 0;
        
        this.selectedFoods.forEach(function(f) {
            total += f.cal;
            html += '<div class="quick-tag">' + f.name + ' (' + f.cal + ' ккал) <span class="quick-tag-remove" data-name="' + f.name + '">✕</span></div>';
        });
        
        selectedDiv.innerHTML = html;
        totalDiv.innerHTML = 'Разом: <strong>' + total + ' ккал</strong>';
        saveBtn.disabled = false;
        
        // Обробник видалення
        document.querySelectorAll('.quick-tag-remove').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var name = this.getAttribute('data-name');
                self.selectedFoods = self.selectedFoods.filter(function(f) { return f.name !== name; });
                self.updateSelectedUI();
                self.renderFoodList(self.currentFoods || self.allFoods);
            });
        });
        
        // Оновлюємо виділення в списку
        this.renderFoodList(this.currentFoods || this.allFoods);
    },
    
    bindQuickEvents: function() {
        var self = this;
        
        // Пошук
        document.getElementById('quickSearch').addEventListener('input', function() {
            var query = this.value.toLowerCase().trim();
            if (query.length === 0) {
                self.renderFoodList(self.currentFoods || self.allFoods);
                return;
            }
            var filtered = self.allFoods.filter(function(f) {
                return f.name.toLowerCase().indexOf(query) !== -1;
            });
            self.renderFoodList(filtered);
        });
        
        // Категорії
        document.querySelectorAll('.quick-cat').forEach(function(cat) {
            cat.addEventListener('click', function() {
                document.querySelectorAll('.quick-cat').forEach(function(c) { c.classList.remove('active'); });
                this.classList.add('active');
                
                var category = this.getAttribute('data-cat');
                if (category === 'all') {
                    self.currentFoods = self.allFoods;
                } else if (category === 'popular') {
                    self.currentFoods = self.allFoods.filter(function(f) { return f.cat === 'popular'; });
                } else {
                    self.currentFoods = self.allFoods.filter(function(f) { return f.cat === category; });
                }
                self.renderFoodList(self.currentFoods);
            });
        });
        
        // Збереження
        document.getElementById('saveQuickBtn').addEventListener('click', function() {
            if (self.selectedFoods.length === 0) return;
            
            var total = self.selectedFoods.reduce(function(sum, f) { return sum + f.cal; }, 0);
            var names = self.selectedFoods.map(function(f) { return f.name; }).join(' + ');
            
            Storage.addFoodEntry({
                name: names,
                calories: total,
                portion: 'з фото',
                time: new Date().toLocaleTimeString('uk-UA')
            });
            
            this.textContent = '✓ Збережено!';
            this.style.background = 'linear-gradient(135deg, #20c997, #17a589)';
            
            setTimeout(function() {
                var preview = document.getElementById('photoPreview');
                if (preview) preview.remove();
                self.renderFoodHistory();
            }, 1000);
        });
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
