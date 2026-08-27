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
        var completed = Storage.getCompleted(today);
        
        var html = '<div class="day-selector">' + this.renderDays() + '</div>';
        
        if (habits.length === 0) {
            html += '<div class="empty-state">' +
                '<div class="empty-icon">🏋️</div>' +
                '<h3>Почни свій спорт-шлях!</h3>' +
                '<p>Додай першу звичку на кнопці "Додати"</p>' +
                '</div>';
        } else {
            html += '<div class="habits-list">';
            for (var i = 0; i < habits.length; i++) {
                var h = habits[i];
                var isCompleted = completed.indexOf(h.id) !== -1;
                var streak = Storage.getStreak(h.id);
                html += '<div class="habit-card ' + (isCompleted ? 'completed' : '') + '" data-id="' + h.id + '">' +
                    '<div class="habit-icon">' + h.icon + '</div>' +
                    '<div class="habit-info">' +
                    '<div class="habit-name">' + h.name + '</div>' +
                    '<div class="habit-streak">🔥 ' + streak + ' днів поспіль</div>' +
                    '</div>' +
                    '<div class="habit-check">' + (isCompleted ? '✓' : '') + '</div>' +
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
    
    // Прив'язка кліків на звички
    bindHabits: function() {
        var self = this;
        document.querySelectorAll('.habit-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var id = parseInt(this.getAttribute('data-id'));
                var date = Storage.formatDate(self.selectedDate);
                Storage.toggleCompleted(id, date);
                self.renderHome();
                self.renderStats();
            });
        });
        
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
        var chart = Storage.getWeekChart();
        
        if (habits.length === 0) {
            container.innerHTML = '<div class="empty-state">' +
                '<div class="empty-icon">📊</div>' +
                '<h3>Поки немає даних</h3>' +
                '<p>Додай звички та починай тренуватися!</p>' +
                '</div>';
            return;
        }
        
        // Загальний відсоток за тиждень
        var totalWeek = 0;
        for (var i = 0; i < habits.length; i++) {
            totalWeek += Storage.getWeekPercent(habits[i].id);
        }
        var avgWeek = Math.round(totalWeek / habits.length);
        
        // Загальний відсоток за місяць
        var totalMonth = 0;
        for (var i = 0; i < habits.length; i++) {
            totalMonth += Storage.getMonthPercent(habits[i].id);
        }
        var avgMonth = Math.round(totalMonth / habits.length);
        
        // Найдовша серія
        var maxStreak = 0;
        for (var i = 0; i < habits.length; i++) {
            var streak = Storage.getStreak(habits[i].id);
            if (streak > maxStreak) maxStreak = streak;
        }
        
        var html = '<div class="stats-card">' +
            '<h3>Цей тиждень</h3>' +
            '<div class="stats-big-number">' + avgWeek + '%</div>' +
            '<div class="stats-label">виконання звичок</div>' +
            '</div>' +
            
            '<div class="stats-card">' +
            '<h3>Цей місяць</h3>' +
            '<div class="stats-big-number">' + avgMonth + '%</div>' +
            '<div class="stats-label">виконання звичок</div>' +
            '</div>' +
            
            '<div class="stats-card">' +
            '<h3>Найдовша серія</h3>' +
            '<div class="stats-big-number">🔥 ' + maxStreak + '</div>' +
            '<div class="stats-label">днів поспіль</div>' +
            '</div>' +
            
            '<div class="chart-container">' +
            '<h3>Останні 7 днів</h3>' +
            '<div class="chart">';
        
        var maxPercent = 0;
        for (var i = 0; i < chart.length; i++) {
            if (chart[i].percent > maxPercent) maxPercent = chart[i].percent;
        }
        
        for (var i = 0; i < chart.length; i++) {
            var barHeight = maxPercent > 0 ? (chart[i].percent / maxPercent) * 100 : 0;
            html += '<div class="chart-bar">' +
                '<div class="chart-fill" style="height: ' + Math.max(barHeight, 5) + '%"></div>' +
                '<div class="chart-label">' + chart[i].day + '</div>' +
                '</div>';
        }
        
        html += '</div></div>';
        
        // Звички по відсотках
        html += '<div class="chart-container"><h3>По звичках (тиждень)</h3>';
        for (var i = 0; i < habits.length; i++) {
            var percent = Storage.getWeekPercent(habits[i].id);
            html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">' +
                '<span style="font-size:24px;">' + habits[i].icon + '</span>' +
                '<div style="flex:1;">' +
                '<div style="font-size:14px;font-weight:700;margin-bottom:4px;">' + habits[i].name + '</div>' +
                '<div style="background:#e0e0e0;border-radius:6px;height:8px;overflow:hidden;">' +
                '<div style="background:linear-gradient(90deg,#667eea,#764ba2);height:100%;width:' + percent + '%;transition:width 0.5s ease;"></div>' +
                '</div>' +
                '</div>' +
                '<span style="font-weight:900;color:#667eea;">' + percent + '%</span>' +
                '</div>';
        }
        html += '</div>';
        
        // Кнопка видалення
        html += '<div class="chart-container"><h3>Керування</h3>';
        for (var i = 0; i < habits.length; i++) {
            html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #e0e0e0;">' +
                '<span>' + habits[i].icon + ' ' + habits[i].name + '</span>' +
                '<button class="btn-danger" onclick="Screens.deleteHabit(' + habits[i].id + ')">Видалити</button>' +
                '</div>';
        }
        html += '</div>';
        
        container.innerHTML = html;
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
        
        var html = '<div class="add-form">' +
            '<div class="form-group">' +
            '<label>Назва звички</label>' +
            '<input type="text" id="habitName" placeholder="Наприклад: Присідання">' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label>Обери іконку</label>' +
            '<div class="icon-picker" id="iconPicker">';
        
        for (var i = 0; i < icons.length; i++) {
            html += '<div class="icon-option' + (i === 0 ? ' selected' : '') + '" data-icon="' + icons[i] + '">' + icons[i] + '</div>';
        }
        
        html += '</div></div>' +
            '<button class="btn-primary" id="addHabitBtn">Додати звичку</button>' +
            '</div>';
        
        container.innerHTML = html;
        this.bindAddForm();
    },
    
    // Прив'язка форми
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
        
        document.getElementById('addHabitBtn').addEventListener('click', function() {
            var name = document.getElementById('habitName').value.trim();
            var icon = document.querySelector('.icon-option.selected').getAttribute('data-icon');
            
            if (!name) {
                alert('Введи назву звички!');
                return;
            }
            
            Storage.addHabit({ name: name, icon: icon });
            document.getElementById('habitName').value = '';
            self.switchScreen('home');
        });
    }
};
