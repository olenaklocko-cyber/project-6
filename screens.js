// ===== SCREENS — персоналізація та календар =====

var Screens = {
    currentScreen: 'home',
    selectedDate: new Date(),
    calendarMonth: new Date().getMonth(),
    calendarYear: new Date().getFullYear(),
    
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
        var habits = Storage.getHabits();
        var profile = Storage.getProfile();
        var today = Storage.formatDate(this.selectedDate);
        
        // Профіль користувача
        var genderEmoji = profile.gender === 'male' ? '👨' : '👩';
        var html = '<div class="profile-bar">' +
            '<span class="profile-gender">' + genderEmoji + '</span>' +
            '<span class="profile-weight">' + profile.weight + ' кг</span>' +
            '<span class="profile-goal">' + profile.goal + '</span>' +
            '</div>';
        
        // Календар на місяць
        html += this.renderCalendar();
        
        // Прогрес-бар дня
        var progress = this.getDayProgress(today);
        html += '<div class="day-progress">' +
            '<div class="day-progress-text">Мій прогрес сьогодні: <strong>' + progress.percent + '%</strong></div>' +
            '<div class="day-progress-bar">' +
            '<div class="day-progress-fill" style="width: ' + progress.percent + '%"></div>' +
            '</div>' +
            '</div>';
        
        // Список вправ
        if (habits.length === 0) {
            html += '<div class="empty-state">' +
                '<div class="empty-icon">🏋️</div>' +
                '<h3>Додай свою першу вправу!</h3>' +
                '<p>Натисни "Додати" внизу</p>' +
                '</div>';
        } else {
            html += '<div class="habits-list">';
            
            for (var i = 0; i < habits.length; i++) {
                var h = habits[i];
                var count = Storage.getCount(h.id, today);
                var goal = h.goal || 0;
                var goalPercent = goal > 0 ? Math.min(100, Math.round((count / goal) * 100)) : 0;
                var isDistance = (h.unit === 'км' || h.unit === 'хвилин');
                
                html += '<div class="habit-card" data-id="' + h.id + '">' +
                    '<div class="habit-header">' +
                    '<div class="habit-icon">' + h.icon + '</div>' +
                    '<div class="habit-info">' +
                    '<div class="habit-name">' + h.name + '</div>' +
                    (h.description ? '<div class="habit-desc">' + h.description + '</div>' : '') +
                    '<div class="habit-count">' + count + ' ' + (h.unit || 'разів') + 
                    (goal > 0 ? ' з ' + goal : '') + '</div>' +
                    '</div>' +
                    '</div>';
                
                // Прогрес-бар на картці
                if (goal > 0) {
                    html += '<div class="habit-progress-mini">' +
                        '<div class="habit-progress-mini-bar">' +
                        '<div class="habit-progress-mini-fill" style="width: ' + goalPercent + '%"></div>' +
                        '</div>' +
                        '<div class="habit-progress-mini-text">' + goalPercent + '%</div>' +
                        '</div>';
                }
                
                // Елементи трекінгу
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
    
    // Календар на місяць
    renderCalendar: function() {
        var self = this;
        var monthNames = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
                         'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
        var dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        
        var firstDay = new Date(this.calendarYear, this.calendarMonth, 1);
        var lastDay = new Date(this.calendarYear, this.calendarMonth + 1, 0);
        var startDay = firstDay.getDay();
        var daysInMonth = lastDay.getDate();
        var today = new Date();
        
        var html = '<div class="calendar">' +
            '<div class="calendar-header">' +
            '<button class="calendar-nav" id="calPrev">◀</button>' +
            '<div class="calendar-title">' + monthNames[this.calendarMonth] + ' ' + this.calendarYear + '</div>' +
            '<button class="calendar-nav" id="calNext">▶</button>' +
            '</div>' +
            '<div class="calendar-days-header">';
        
        for (var i = 0; i < 7; i++) {
            html += '<div class="calendar-day-name">' + dayNames[i] + '</div>';
        }
        
        html += '</div><div class="calendar-grid">';
        
        // Порожні клітинки перед першим днем
        for (var i = 0; i < startDay; i++) {
            html += '<div class="calendar-cell empty"></div>';
        }
        
        // Дні місяця
        for (var d = 1; d <= daysInMonth; d++) {
            var date = new Date(this.calendarYear, this.calendarMonth, d);
            var dateStr = Storage.formatDate(date);
            var isToday = (date.toDateString() === today.toDateString());
            var isSelected = (dateStr === Storage.formatDate(this.selectedDate));
            var hasActivity = this.dayHasActivity(dateStr);
            
            var classes = 'calendar-cell';
            if (isToday) classes += ' today';
            if (isSelected) classes += ' selected';
            if (hasActivity) classes += ' active';
            
            html += '<div class="' + classes + '" data-date="' + dateStr + '">' + d + '</div>';
        }
        
        html += '</div></div>';
        
        return html;
    },
    
    // Перевірка активності дня
    dayHasActivity: function(dateStr) {
        var habits = Storage.getHabits();
        for (var i = 0; i < habits.length; i++) {
            if (Storage.getCount(habits[i].id, dateStr) > 0) {
                return true;
            }
        }
        return false;
    },
    
    // Прогрес дня
    getDayProgress: function(date) {
        var habits = Storage.getHabits();
        var totalGoal = 0;
        var totalDone = 0;
        
        for (var i = 0; i < habits.length; i++) {
            var goal = habits[i].goal || 0;
            if (goal > 0) {
                totalGoal += goal;
                totalDone += Math.min(Storage.getCount(habits[i].id, date), goal);
            }
        }
        
        return {
            percent: totalGoal > 0 ? Math.round((totalDone / totalGoal) * 100) : 0
        };
    },
    
    // Прив'язка подій
    bindHomeEvents: function() {
        var self = this;
        
        // Навігація календаря
        var calPrev = document.getElementById('calPrev');
        var calNext = document.getElementById('calNext');
        
        if (calPrev) {
            calPrev.addEventListener('click', function() {
                self.calendarMonth--;
                if (self.calendarMonth < 0) {
                    self.calendarMonth = 11;
                    self.calendarYear--;
                }
                self.renderHome();
            });
        }
        
        if (calNext) {
            calNext.addEventListener('click', function() {
                self.calendarMonth++;
                if (self.calendarMonth > 11) {
                    self.calendarMonth = 0;
                    self.calendarYear++;
                }
                self.renderHome();
            });
        }
        
        // Вибір днів
        document.querySelectorAll('.calendar-cell:not(.empty)').forEach(function(cell) {
            cell.addEventListener('click', function() {
                var date = this.getAttribute('data-date');
                self.selectedDate = new Date(date);
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
        
        // Enter в полі введення
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
        var habits = Storage.getHabits();
        
        if (habits.length === 0) {
            container.innerHTML = '<div class="empty-state">' +
                '<div class="empty-icon">📊</div>' +
                '<h3>Поки немає даних</h3>' +
                '<p>Додай вправи та починай тренуватися!</p>' +
                '</div>';
            return;
        }
        
        var weekStats = this.getWeekStats(habits);
        
        var html = '<div class="stats-grid">' +
            '<div class="stats-card">' +
            '<h3>Цей тиждень</h3>' +
            '<div class="stats-big-number">' + weekStats.total + '</div>' +
            '<div class="stats-label">всього</div>' +
            '</div>' +
            
            '<div class="stats-card">' +
            '<h3>Активних днів</h3>' +
            '<div class="stats-big-number">' + weekStats.activeDays + '</div>' +
            '<div class="stats-label">з 7 днів</div>' +
            '</div>' +
            
            '<div class="stats-card">' +
            '<h3>Вправ</h3>' +
            '<div class="stats-big-number">' + habits.length + '</div>' +
            '<div class="stats-label">відстежується</div>' +
            '</div>' +
            
            '<div class="stats-card">' +
            '<h3>Сьогодні</h3>' +
            '<div class="stats-big-number">' + weekStats.today + '</div>' +
            '<div class="stats-label">всього</div>' +
            '</div>' +
            '</div>';
        
        // Розподіл по типах
        html += '<div class="chart-container">' +
            '<h3>Розподіл за тиждень</h3>';
        
        for (var i = 0; i < habits.length; i++) {
            var weekTotal = Storage.getWeekTotal(habits[i].id);
            var maxPossible = Math.max(weekTotal, 1);
            
            html += '<div class="habit-stat-row">' +
                '<div class="habit-stat-icon">' + habits[i].icon + '</div>' +
                '<div class="habit-stat-info">' +
                '<div class="habit-stat-name">' + habits[i].name + '</div>' +
                '<div class="habit-stat-bar">' +
                '<div class="habit-stat-fill" style="width: ' + Math.min(100, (weekTotal / (maxPossible * 1.2)) * 100) + '%"></div>' +
                '</div>' +
                '</div>' +
                '<div class="habit-stat-count">' + weekTotal + ' ' + (habits[i].unit || 'разів') + '</div>' +
                '</div>';
        }
        
        html += '</div>';
        
        // Графік по днях
        html += '<div class="chart-container">' +
            '<h3>Активність по днях</h3>' +
            '<div class="week-chart">';
        
        var weekDays = this.getWeekActivity(habits);
        var maxDay = Math.max.apply(null, weekDays.map(function(d) { return d.total; }));
        
        for (var i = 0; i < weekDays.length; i++) {
            var height = maxDay > 0 ? (weekDays[i].total / maxDay) * 100 : 0;
            html += '<div class="week-bar">' +
                '<div class="week-fill" style="height: ' + Math.max(height, 5) + '%"></div>' +
                '<div class="week-label">' + weekDays[i].day + '</div>' +
                '</div>';
        }
        
        html += '</div></div>';
        
        // Керування
        html += '<div class="chart-container">' +
            '<h3>Керування вправами</h3>';
        
        for (var i = 0; i < habits.length; i++) {
            html += '<div class="manage-row">' +
                '<span class="manage-icon">' + habits[i].icon + '</span>' +
                '<div class="manage-info">' +
                '<span class="manage-name">' + habits[i].name + '</span>' +
                (habits[i].description ? '<span class="manage-desc">' + habits[i].description + '</span>' : '') +
                '</div>' +
                '<button class="btn-danger" onclick="Screens.deleteHabit(' + habits[i].id + ')">Видалити</button>' +
                '</div>';
        }
        
        html += '</div>';
        
        container.innerHTML = html;
    },
    
    getWeekStats: function(habits) {
        var total = 0;
        var activeDays = {};
        var today = Storage.formatDate(new Date());
        var todayTotal = 0;
        
        for (var i = 0; i < habits.length; i++) {
            total += Storage.getWeekTotal(habits[i].id);
            todayTotal += Storage.getCount(habits[i].id, today);
        }
        
        for (var d = 0; d < 7; d++) {
            var date = new Date();
            date.setDate(date.getDate() - d);
            var dateStr = Storage.formatDate(date);
            for (var i = 0; i < habits.length; i++) {
                if (Storage.getCount(habits[i].id, dateStr) > 0) {
                    activeDays[dateStr] = true;
                }
            }
        }
        
        return {
            total: total,
            activeDays: Object.keys(activeDays).length,
            today: todayTotal
        };
    },
    
    getWeekActivity: function(habits) {
        var result = [];
        var today = new Date();
        var dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        
        for (var i = 6; i >= 0; i--) {
            var d = new Date(today);
            d.setDate(d.getDate() - i);
            var dateStr = Storage.formatDate(d);
            var total = 0;
            
            for (var j = 0; j < habits.length; j++) {
                total += Storage.getCount(habits[j].id, dateStr);
            }
            
            result.push({
                day: dayNames[d.getDay()],
                total: total
            });
        }
        
        return result;
    },
    
    deleteHabit: function(id) {
        if (confirm('Видалити цю вправу?')) {
            Storage.deleteHabit(id);
            this.renderAll();
        }
    },
    
    // ===== ЕКРАН ПРОФІЛЮ =====
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
    
    // ===== ЕКРАН ДОДАВАННЯ =====
    renderAdd: function() {
        var container = document.getElementById('screen-add');
        var icons = ['⚽', '🏀', '🎾', '🏃', '💪', '🧘', '🚴', '🏊', '🤸', '🏋️', '🥊', '⛷️'];
        var units = ['разів', 'хвилин', 'км', 'підходів', 'кг'];
        
        var html = '<div class="add-form">' +
            '<div class="form-group">' +
            '<label>Назва вправи</label>' +
            '<input type="text" id="habitName" placeholder="Наприклад: Присідання">' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>Опис (опціонально)</label>' +
            '<input type="text" id="habitDesc" placeholder="Наприклад: З вагою тіла">' +
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
