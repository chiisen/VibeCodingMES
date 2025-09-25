// MES 製造執行系統 - 主要JavaScript功能

// 全域變數
let refreshInterval = null;
let notificationQueue = [];

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    startAutoRefresh();
});

// 初始化頁面
function initializePage() {
    // 添加載入動畫
    addLoadingAnimations();

    // 初始化工具提示
    initializeTooltips();

    // 設置響應式表格
    setupResponsiveTables();

    // 初始化通知系統
    initializeNotifications();
}

// 設置事件監聽器
function setupEventListeners() {
    // 導航欄活動狀態
    setupActiveNavigation();

    // 表單驗證
    setupFormValidation();

    // 按鈕點擊效果
    setupButtonEffects();
}

// 設置活動導航
function setupActiveNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// 設置表單驗證
function setupFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                return false;
            }
        });
    });
}

// 表單驗證
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, '此欄位為必填');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });

    return isValid;
}

// 顯示欄位錯誤
function showFieldError(field, message) {
    clearFieldError(field);

    field.classList.add('is-invalid');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;

    field.parentNode.appendChild(errorDiv);
}

// 清除欄位錯誤
function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// 設置按鈕效果
function setupButtonEffects() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 添加點擊動畫
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// 初始化工具提示
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// 設置響應式表格
function setupResponsiveTables() {
    const tables = document.querySelectorAll('.table-responsive');

    tables.forEach(table => {
        table.addEventListener('scroll', function() {
            // 添加滾動陰影效果
            if (this.scrollLeft > 0) {
                this.classList.add('scrolled-left');
            } else {
                this.classList.remove('scrolled-left');
            }
        });
    });
}

// 初始化通知系統
function initializeNotifications() {
    // 創建通知容器
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }
}

// 開始自動刷新
function startAutoRefresh() {
    // 每30秒刷新一次數據
    refreshInterval = setInterval(() => {
        if (document.hasFocus()) {
            refreshCurrentPage();
        }
    }, 30000);
}

// 停止自動刷新
function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}

// 刷新當前頁面
function refreshCurrentPage() {
    const currentPath = window.location.pathname;

    if (currentPath === '/') {
        refreshDashboard();
    } else if (currentPath === '/production') {
        refreshProductionData();
    } else if (currentPath === '/quality') {
        refreshQualityData();
    } else if (currentPath === '/equipment') {
        refreshEquipmentData();
    }
}

// 刷新儀表板數據
function refreshDashboard() {
    fetch('/api/dashboard-stats')
        .then(response => response.json())
        .then(data => {
            updateDashboardStats(data);
        })
        .catch(error => {
            console.error('Error refreshing dashboard:', error);
        });
}

// 更新儀表板統計
function updateDashboardStats(stats) {
    // 更新生產統計
    if (stats.production) {
        updateElement('production-total', stats.production.total);
        updateElement('production-in-progress', stats.production.in_progress);
        updateElement('production-completion-rate', stats.production.completion_rate + '%');
    }

    // 更新品質統計
    if (stats.quality) {
        updateElement('quality-total', stats.quality.total);
        updateElement('quality-qualified', stats.quality.qualified);
        updateElement('quality-qualification-rate', stats.quality.qualification_rate + '%');
    }

    // 更新設備統計
    if (stats.equipment) {
        updateElement('equipment-total', stats.equipment.total);
        updateElement('equipment-running', stats.equipment.running);
        updateElement('equipment-maintenance', stats.equipment.maintenance);
    }
}

// 刷新生產數據
function refreshProductionData() {
    fetch('/api/production-stats')
        .then(response => response.json())
        .then(data => {
            updateProductionStats(data);
        })
        .catch(error => {
            console.error('Error refreshing production data:', error);
        });
}

// 更新生產統計
function updateProductionStats(stats) {
    updateElement('total-tasks', stats.total);
    updateElement('completed-tasks', stats.completed);
    updateElement('running-count', stats.running);
    updateElement('paused-count', stats.paused);
    updateElement('pending-count', stats.pending);
    updateElement('completion-rate', stats.completion_rate + '%');
    updateElement('completion-progress', stats.completion_rate);
}

// 刷新品質數據
function refreshQualityData() {
    fetch('/api/quality-stats')
        .then(response => response.json())
        .then(data => {
            updateQualityStats(data);
        })
        .catch(error => {
            console.error('Error refreshing quality data:', error);
        });
}

// 更新品質統計
function updateQualityStats(stats) {
    updateElement('quality-total', stats.total);
    updateElement('quality-qualified', stats.qualified);
    updateElement('quality-unqualified', stats.unqualified);
    updateElement('quality-qualification-rate', stats.qualification_rate + '%');
}

// 刷新設備數據
function refreshEquipmentData() {
    fetch('/api/equipment-stats')
        .then(response => response.json())
        .then(data => {
            updateEquipmentStats(data);
        })
        .catch(error => {
            console.error('Error refreshing equipment data:', error);
        });
}

// 更新設備統計
function updateEquipmentStats(stats) {
    updateElement('running-count', stats.running);
    updateElement('maintenance-count', stats.maintenance);
    updateElement('standby-count', stats.standby);
}

// 更新元素內容
function updateElement(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = content;
    }
}

// 添加載入動畫
function addLoadingAnimations() {
    const cards = document.querySelectorAll('.card');

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// 顯示通知
function showNotification(message, type = 'info', duration = 3000) {
    const notification = {
        id: Date.now(),
        message: message,
        type: type,
        duration: duration
    };

    notificationQueue.push(notification);
    processNotificationQueue();
}

// 處理通知隊列
function processNotificationQueue() {
    if (notificationQueue.length === 0) return;

    const notification = notificationQueue.shift();
    displayNotification(notification);
}

// 顯示通知
function displayNotification(notification) {
    const container = document.getElementById('notification-container');

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${notification.type} alert-dismissible fade show mb-2`;
    alertDiv.innerHTML = `
        ${notification.message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    container.appendChild(alertDiv);

    // 自動關閉
    setTimeout(() => {
        alertDiv.remove();
        processNotificationQueue();
    }, notification.duration);
}

// 格式化日期
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('zh-TW') + ' ' + d.toLocaleTimeString('zh-TW');
}

// 格式化數字
function formatNumber(num) {
    return new Intl.NumberFormat('zh-TW').format(num);
}

// 格式化百分比
function formatPercentage(value, decimals = 1) {
    return (value * 100).toFixed(decimals) + '%';
}

// 防抖函數
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 節流函數
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 頁面可見性API
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopAutoRefresh();
    } else {
        startAutoRefresh();
    }
});

// 窗口大小改變處理
window.addEventListener('resize', debounce(function() {
    // 響應式調整
    adjustLayoutForScreenSize();
}, 250));

// 調整佈局
function adjustLayoutForScreenSize() {
    const width = window.innerWidth;

    if (width < 768) {
        // 移動設備調整
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
}

// 錯誤處理
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showNotification('發生錯誤，請刷新頁面重試', 'danger');
});

// 未處理的Promise錯誤
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    showNotification('操作失敗，請重試', 'danger');
});

// 導出函數供其他腳本使用
window.MES = {
    showNotification: showNotification,
    formatDate: formatDate,
    formatNumber: formatNumber,
    formatPercentage: formatPercentage,
    debounce: debounce,
    throttle: throttle,
    refreshCurrentPage: refreshCurrentPage
};
