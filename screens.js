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
            
            photoPreview.innerHTML = '<div class="photo-preview-card">' +
                '<img src="' + e.target.result + '" alt="Їжа" class="photo-preview-img">' +
                '<div class="photo-loading" id="photoLoading">' +
                '<div class="loading-spinner"></div>' +
                '<div class="loading-text">🤖 AI аналізує їжу...</div>' +
                '<div class="loading-subtext">Зачекай 2-3 секунди</div>' +
                '</div>' +
                '<div class="photo-preview-actions">' +
                '<button class="photo-preview-btn" id="photoRetakeBtn">📸 Нове фото</button>' +
                '</div>' +
                '</div>';
            
            document.getElementById('photoRetakeBtn').addEventListener('click', function() {
                self.openCamera();
            });
            
            self.analyzeWithAI(e.target.result);
        };
        
        reader.readAsDataURL(file);
    },
    
    analyzeWithAI: function(imageBase64) {
        var self = this;
        var loading = document.getElementById('photoLoading');
        var actionsDiv = document.querySelector('.photo-preview-actions');
        
        var apiKey = '16749e13b0msh437c9c685ba695bp10d553jsn871fbf3b2535';
        
        // Конвертуємо в JPEG та зменшуємо розмір
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = new Image();
        
        img.onload = function() {
            var maxSize = 600;
            var width = img.width;
            var height = img.height;
            
            if (width > maxSize || height > maxSize) {
                if (width > height) {
                    height = Math.round((height * maxSize) / width);
                    width = maxSize;
                } else {
                    width = Math.round((width * maxSize) / height);
                    height = maxSize;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            var compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            var base64Data = compressedBase64.split(',')[1];
            
            // Використовуємо CORS-проксі
            var proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://caloai.p.rapidapi.com/v1/');
            
            fetch(proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': apiKey,
                    'X-RapidAPI-Host': 'caloai.p.rapidapi.com'
                },
                body: JSON.stringify({ image: base64Data })
            })
            .then(function(response) {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(function(data) {
                console.log('AI Response:', data);
                loading.style.display = 'none';
                
                if (data.error) {
                    loading.innerHTML = '<div class="loading-error">❌ ' + data.error + '</div>';
                } else {
                    self.showAIResults(data, actionsDiv);
                }
            })
            .catch(function(error) {
                console.error('Error:', error);
                // Якщо проксі не працює — пробуємо інший
                var proxy2 = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://caloai.p.rapidapi.com/v1/');
                
                fetch(proxy2, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RapidAPI-Key': apiKey,
                        'X-RapidAPI-Host': 'caloai.p.rapidapi.com'
                    },
                    body: JSON.stringify({ image: base64Data })
                })
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    loading.style.display = 'none';
                    if (data.error) {
                        loading.innerHTML = '<div class="loading-error">❌ ' + data.error + '</div>';
                    } else {
                        self.showAIResults(data, actionsDiv);
                    }
                })
                .catch(function(err) {
                    loading.innerHTML = '<div class="loading-error">❌ AI тимчасово недоступний. Спробуй пізніше.</div>';
                });
            });
        };
        
        img.src = imageBase64;
    },
    
    showAIResults: function(data, container) {
        var self = this;
        
        var resultsHTML = '<div class="ai-results">';
        
        var calories = data.calories || 0;
        var proteins = data.proteins || 0;
        var fats = data.fats || 0;
        var carbs = data.carbs || 0;
        var dishes = data.detected_dishes || [];
        
        if (calories > 0 || dishes.length > 0) {
            resultsHTML += '<div class="ai-total">' +
                '<div class="ai-total-cal">' + Math.round(calories) + ' ккал</div>' +
                '<div class="ai-total-macros">' +
                '<span>Білки: ' + Math.round(proteins) + 'г</span>' +
                '<span>Жири: ' + Math.round(fats) + 'г</span>' +
                '<span>Вуглеводи: ' + Math.round(carbs) + 'г</span>' +
                '</div>' +
                '</div>';
            
            if (dishes.length > 0) {
                resultsHTML += '<div class="ai-dishes-title">Що AI побачив:</div>';
                resultsHTML += '<div class="ai-dishes">';
                for (var i = 0; i < dishes.length; i++) {
                    var dish = dishes[i];
                    resultsHTML += '<div class="ai-dish">' +
                        '<div class="ai-dish-name">' + dish.name + '</div>' +
                        '<div class="ai-dish-info">' +
                        '<span class="ai-dish-weight">' + dish.weight_g + 'г</span>' +
                        '<span class="ai-dish-cal">' + Math.round(dish.calories) + ' ккал</span>' +
                        '</div>' +
                        '</div>';
                }
                resultsHTML += '</div>';
            }
            
            resultsHTML += '<button class="btn-primary" id="saveAIResultBtn">💾 Зберегти в журнал</button>';
        } else {
            resultsHTML += '<div class="ai-no-result">😔 AI не зміг розпізнати. Спробуй інше фото.</div>';
        }
        
        resultsHTML += '</div>';
        
        container.insertAdjacentHTML('beforeend', resultsHTML);
        
        if (calories > 0 || dishes.length > 0) {
            document.getElementById('saveAIResultBtn').addEventListener('click', function() {
                var portion = dishes.map(function(d) {
                    return d.name + ' (' + d.weight_g + 'г)';
                }).join(', ');
                
                Storage.addFoodEntry({
                    name: dishes.length > 0 ? dishes.map(function(d) { return d.name; }).join(' + ') : 'Їжа',
                    calories: Math.round(calories),
                    portion: portion || 'фото',
                    time: new Date().toLocaleTimeString('uk-UA'),
                    ai: true
                });
                
                this.textContent = '✓ Збережено!';
                this.style.background = 'linear-gradient(135deg, #20c997, #17a589)';
                
                setTimeout(function() {
                    var preview = document.getElementById('photoPreview');
                    if (preview) preview.remove();
                    self.renderFoodHistory();
                }, 1000);
            });
        }
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
