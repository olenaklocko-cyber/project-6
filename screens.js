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
                '<div class="block-icon" style="background: linear-gradient(135deg, ' + block.color + ', ' + block.color + 'cc)">' + block.icon + '</div>' +
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
        
        var html = '<div class="add-form">' +
            '<div class="form-group">' +
            '<label>Стать</label>' +
            '<div class="gender-picker">' +
            '<div class="gender-option ' + (profile.gender === 'male' ? 'selected' : '') + '" data-gender="male">👨 Чоловік</div>' +
            '<div class="gender-option ' + (profile.gender === 'female' ? 'selected' : '') + '" data-gender="female">👩 Жінка</div>' +
            '</div>' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>Вага (кг)</label>' +
            '<input type="number" id="profileWeight" value="' + profile.weight + '" placeholder="60">' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>Бажана мета</label>' +
            '<input type="text" id="profileGoal" value="' + profile.goal + '" placeholder="Наприклад: Здоров\'я та форма">' +
            '</div>' +
            
            '<button class="btn-primary" id="saveProfileBtn">Зберегти профіль</button>' +
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
            alert('Профіль збережено!');
            self.switchScreen('home');
        });
    },
    
    // ===== ДОДАТИ =====
    renderAdd: function() {
        var container = document.getElementById('screen-add');
        var icons = ['⚽', '🏀', '🎾', '🏃', '💪', '🧘', '🚴', '🏊', '🤸', '🏋️', '🥊', '⛷️'];
        var units = ['разів', 'хвилин', 'км', 'підходів', 'кг'];
        
        var html = '<div class="add-form">' +
            '<div class="form-group">' +
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
            '<button class="btn-primary" id="addHabitBtn">Додати вправу</button>' +
            '</div>';
        
        container.innerHTML = html;
        this.bindAddForm();
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
