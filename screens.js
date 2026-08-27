// ===== SCREENS — переиспользуемые екрани =====

var Screens = {
    currentScreen: 'home',
    selectedDate: new Date(),
    
    // Ініціалізація екранів
    init: function() {
        this.renderAll();
        this.bindNav();
    },
    
    // Прив'язка навігації
    bindNav: function() {
        var self = this;
        document.querySelectorAll('.nav-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var screen = this.getAttribute('data-screen');
                self.switchScreen(screen);
            });
        });
    },
    
    // Перемикання екрану
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
    
    // Рендер всіх екранів
    renderAll: function() {
        this.renderHome();
        this.renderStats();
        this.renderAdd();
    },
    
    // ===== ГОЛОВНИЙ ЕКРАН =====
    renderHome: function() {
        var container = document.getElementById('screen-home');
        var habits = Storage.getHabits();
        var today = Storage.formatDate(this.selectedDate);
        var summary = Storage.getTodaySummary();
        
        // Загальний підсумок за сьогодні
        var html = '<div class="today-summary">' +
            '<div class="summary-card main">' +
            '<div class="summary-icon">🎯</div>' +
            '<div class="summary-number">' + summary.total + '</div>' +
            '<div class="summary-label">всього сьогодні</div>' +
            '</div>' +
            '</div>';
        
        // Календар
        html += '<div class="day-selector">' + this.renderDays() + '</div>';
        
        // Список звичок з лічильниками
        if (habits.length === 0) {
            html += '<div class="empty-state">' +
                '<div class="empty-icon">🏋️</div>' +
                '<h3>Почни свій спорт-шлях!</h3>' +
                '<p>Додай першу звичку на кнопці "Додати"</p>' +
                '</div>';
        } else {
            html += '<div class="section-title">Мої тренування</div>';
            html += '<div class="habits-list">';
            
            for (var i = 0; i < habits.length; i++) {
                var h = habits[i];
                var count = Storage.getCount(h.id, today);
                var weekTotal = Storage.getWeekTotal(h.id);
                var goal = h.goal || 0;
                var goalPercent = goal > 0 ? Math.min(100, Math.round((count / goal) * 100)) : 0;
                
                html += '<div class="habit-card" data-id="' + h.id + '">' +
                    '<div class="habit-icon">' + h.icon + '</div>' +
                    '<div class="habit-info">' +
                    '<div class="habit-name">' + h.name + '</div>' +
                    '<div class="habit-week">Цей тиждень: ' + weekTotal + ' ' + (h.unit || 'разів') + '</div>' +
                    (goal > 0 ? '<div class="habit-goal">Мета: ' + goal + ' ' + (h.unit || 'разів') + ' (' + goalPercent + '%)</div>' : '') +
                    '</div>' +
                    '<div class="habit-counter">' +
                    '<button class="counter-btn minus" data-id="' + h.id + '" data-action="minus">−</button>' +
                    '<div class="counter-value">' + count + '</div>' +
                    '<button class="counter-btn plus" data-id="' + h.id + '" data-action="plus">+</button>' +
                    '</div>' +
                    '</div>';
            }
            
            html += '</div>';
        }
        
        container.innerHTML = html;
        this.bindHabits();
    },
    
    // Дні тижня
    renderDays: function() {
        var html = '';
        var today = new Date();
        var dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        
        for (var i = 6; i >= 0; i--) {
            var d = new Date(today);
            d.setDate(d.getDate() - i);
            var dateStr = Storage.formatDate(d);
            var isToday = i === 0;
            var isSelected = Storage.formatDate(this.selectedDate) === dateStr;
            
            html += '<div class="day-btn ' + (isToday ? 'today' : '') + (isSelected ? ' selected' : '') + '" data-date="' + dateStr + '">' +
                '<div class="day-name">' + dayNames[d.getDay()] + '</div>' +
                '<div class="day-num">' + d.getDate() + '</div>' +
                '</div>';
        }
        return html;
    },
    
    // Прив'язка кліків
    bindHabits: function() {
        var self = this;
        
        // Кнопки +/-
        document.querySelectorAll('.counter-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var id = parseInt(this.getAttribute('data-id'));
                var action = this.getAttribute('data-action');
                var date = Storage.formatDate(self.selectedDate);
                var amount = action === 'plus' ? 1 : -1;
                Storage.incrementCount(id, date, amount);
                self.renderHome();
            });
        });
        
        // Вибір днів
        document.querySelectorAll('.day-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var date = this.getAttribute('data-date');
                self.selectedDate = new Date(date);
                self.renderHome();
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
                '<p>Додай звички та починай тренуватися!</p>' +
                '</div>';
            return;
        }
        
        // Загальна статистика за тиждень
        var totalWeek = 0;
        var totalMonth = 0;
        var maxWeek = 0;
        var bestHabit = habits[0];
        
        for (var i = 0; i < habits.length; i++) {
            var weekTotal = Storage.getWeekTotal(habits[i].id);
            var monthTotal = Storage.getMonthTotal(habits[i].id);
            totalWeek += weekTotal;
            totalMonth += monthTotal;
            
            if (weekTotal > maxWeek) {
                maxWeek = weekTotal;
                bestHabit = habits[i];
            }
        }
        
        var html = '<div class="stats-grid">' +
            '<div class="stats-card">' +
            '<h3>Цей тиждень</h3>' +
            '<div class="stats-big-number">' + totalWeek + '</div>' +
            '<div class="stats-label">всього повторень</div>' +
            '</div>' +
            
            '<div class="stats-card">' +
            '<h3>Цей місяць</h3>' +
            '<div class="stats-big-number">' + totalMonth + '</div>' +
            '<div class="stats-label">всього повторень</div>' +
            '</div>' +
            
            '<div class="stats-card">' +
            '<h3>Краща звичка</h3>' +
            '<div class="stats-big-number">' + bestHabit.icon + '</div>' +
            '<div class="stats-label">' + bestHabit.name + '</div>' +
            '</div>' +
            
            '<div class="stats-card">' +
            '<h3>Активних днів</h3>' +
            '<div class="stats-big-number">' + this.getActiveDays() + '</div>' +
            '<div class="stats-label">за тиждень</div>' +
            '</div>' +
            '</div>';
        
        // Графік по звичках
        html += '<div class="chart-container">' +
            '<h3>Прогрес по звичках (тиждень)</h3>';
        
        for (var i = 0; i < habits.length; i++) {
            var weekTotal = Storage.getWeekTotal(habits[i].id);
            var maxPossible = Math.max(weekTotal, 1);
            
            html += '<div class="habit-progress">' +
                '<div class="habit-progress-icon">' + habits[i].icon + '</div>' +
                '<div class="habit-progress-info">' +
                '<div class="habit-progress-name">' + habits[i].name + '</div>' +
                '<div class="progress-bar">' +
                '<div class="progress-fill" style="width: ' + Math.min(100, (weekTotal / (maxPossible * 1.2)) * 100) + '%"></div>' +
                '</div>' +
                '</div>' +
                '<div class="habit-progress-count">' + weekTotal + ' ' + (habits[i].unit || 'разів') + '</div>' +
                '</div>';
        }
        
        html += '</div>';
        
        // Детальна статистика по кожній звичці
        html += '<div class="chart-container">' +
            '<h3>Деталі по днях</h3>';
        
        for (var i = 0; i < habits.length; i++) {
            var chart = Storage.getWeekChart(habits[i].id);
            var maxCount = 0;
            for (var j = 0; j < chart.length; j++) {
                if (chart[j].count > maxCount) maxCount = chart[j].count;
            }
            
            html += '<div class="habit-detail">' +
                '<div class="habit-detail-header">' +
                '<span class="habit-detail-icon">' + habits[i].icon + '</span>' +
                '<span class="habit-detail-name">' + habits[i].name + '</span>' +
                '</div>' +
                '<div class="mini-chart">';
            
            for (var j = 0; j < chart.length; j++) {
                var height = maxCount > 0 ? (chart[j].count / maxCount) * 100 : 0;
                html += '<div class="mini-bar">' +
                    '<div class="mini-fill" style="height: ' + Math.max(height, 5) + '%"></div>' +
                    '<div class="mini-label">' + chart[j].day + '</div>' +
                    '</div>';
            }
            
            html += '</div></div>';
        }
        
        html += '</div>';
        
        // Керування
        html += '<div class="chart-container">' +
            '<h3>Керування</h3>';
        
        for (var i = 0; i < habits.length; i++) {
            html += '<div class="habit-progress">' +
                '<div class="habit-progress-icon">' + habits[i].icon + '</div>' +
                '<div class="habit-progress-info">' +
                '<div class="habit-progress-name">' + habits[i].name + '</div>' +
                '</div>' +
                '<button class="btn-danger" onclick="Screens.deleteHabit(' + habits[i].id + ')">Видалити</button>' +
                '</div>';
        }
        
        html += '</div>';
        
        container.innerHTML = html;
    },
    
    // Активні дні за тиждень
    getActiveDays: function() {
        var days = 0;
        var today = new Date();
        for (var i = 0; i < 7; i++) {
            var d = new Date(today);
            d.setDate(d.getDate() - i);
            var dateStr = Storage.formatDate(d);
            var summary = Storage.getTodaySummary();
            if (summary.total > 0) days++;
        }
        return days;
    },
    
    // Видалити звичку
    deleteHabit: function(id) {
        if (confirm('Видалити цю звичку?')) {
            Storage.deleteHabit(id);
            this.renderAll();
        }
    },
    
    // ===== ЕКРАН ДОДАВАННЯ =====
    renderAdd: function() {
        var container = document.getElementById('screen-add');
        var icons = ['⚽', '🏀', '🎾', '🏃', '💪', '🧘', '🚴', '🏊', '🤸', '🏋️', '🥊', '⛷️'];
        var units = ['разів', 'хвилин', 'км', 'підходів', 'повторень', 'кг'];
        
        var html = '<div class="add-form">' +
            '<div class="form-group">' +
            '<label>Назва вправи</label>' +
            '<input type="text" id="habitName" placeholder="Наприклад: Присідання">' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>Одиниці вимірювання</label>' +
            '<div class="unit-picker" id="unitPicker">';
        
        for (var i = 0; i < units.length; i++) {
            html += '<div class="unit-option' + (i === 0 ? ' selected' : '') + '" data-unit="' + units[i] + '">' + units[i] + '</div>';
        }
        
        html += '</div></div>' +
            
            '<div class="form-group">' +
            '<label>Мета на день (опціонально)</label>' +
            '<input type="number" id="habitGoal" placeholder="Наприклад: 50">' +
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
    
    // Прив'язка форми
    bindAddForm: function() {
        var self = this;
        
        // Вибір іконки
        document.querySelectorAll('.icon-option').forEach(function(opt) {
            opt.addEventListener('click', function() {
                document.querySelectorAll('.icon-option').forEach(function(o) {
                    o.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        });
        
        // Вибір одиниць
        document.querySelectorAll('.unit-option').forEach(function(opt) {
            opt.addEventListener('click', function() {
                document.querySelectorAll('.unit-option').forEach(function(o) {
                    o.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        });
        
        // Додавання
        document.getElementById('addHabitBtn').addEventListener('click', function() {
            var name = document.getElementById('habitName').value.trim();
            var icon = document.querySelector('.icon-option.selected').getAttribute('data-icon');
            var unit = document.querySelector('.unit-option.selected').getAttribute('data-unit');
            var goal = parseInt(document.getElementById('habitGoal').value) || 0;
            
            if (!name) {
                alert('Введи назву вправи!');
                return;
            }
            
            Storage.addHabit({ name: name, icon: icon, unit: unit, goal: goal });
            document.getElementById('habitName').value = '';
            document.getElementById('habitGoal').value = '';
            self.switchScreen('home');
        });
    }
};
