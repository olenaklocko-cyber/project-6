// ===== APP — головний файл =====

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація перекладів
    I18n.init();
    
    // Оновлюємо заголовок додатку
    document.getElementById('appTitle').textContent = I18n.t('appTitle');
    document.title = I18n.t('appTitle');
    
    // Оновлюємо навігацію
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        el.textContent = I18n.t(key);
    });
    
    // Ініціалізація екранів
    Screens.init();
});

// Функція оновлення всіх перекладів на сторінці
function updatePageTranslations() {
    document.getElementById('appTitle').textContent = I18n.t('appTitle');
    document.title = I18n.t('appTitle');
    
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        el.textContent = I18n.t(key);
    });
}
