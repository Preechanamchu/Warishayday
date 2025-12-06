document.addEventListener('DOMContentLoaded', () => {
    // ===== START: API Endpoint Configuration (Updated) =====
    // Configuration for API endpoints
    const API_SAVE_ENDPOINT = '/api/save-data';
    const API_GET_ADMIN_DATA_ENDPOINT = '/api/get-admin-data';
    const API_LOGIN_ENDPOINT = '/api/login';
    const API_PRODUCTS_CRUD_ENDPOINT = '/api/products-api';
    const API_CATEGORIES_CRUD_ENDPOINT = '/api/categories-api';
    const API_CUSTOMER_DATA_ENDPOINT = '/api/get-customer-data';
    const API_ORDERS_ENDPOINT = '/api/orders-api';
    const API_LOG_TRAFFIC_ENDPOINT = '/api/log-traffic';
    
    // ===== START: New API Endpoints for Sign-up System (Updated for Netlify + Neon) =====
    const API_SIGNUP_ENDPOINT = '/api/signup';
    const API_CHECK_USERNAME_ENDPOINT = '/api/check-username';
    const API_GET_REGISTRATIONS_ENDPOINT = '/api/get-registrations'; // Endpoint สำหรับดึงรายการร้านค้า
    const API_PACKAGE_VALIDATION_ENDPOINT = '/api/package-validation';
    
    // ===== START: Store Management API Endpoints =====
    const API_UPDATE_STORE_ENDPOINT = '/api/update-store'; // API สำหรับจัดการสถานะร้านค้า
    // ===== END: Store Management API Endpoints =====
    // ===== END: New API Endpoints =====

    // Initial data structure for the app
    let appData = {
        categories: [],
        products: [], // Products for the current view (filtered by category)
        allProducts: [], // Store all products here
        cart: {},
        subAdmins: [],
        shopSettings: {
            shopName: "WARISHAYDAY",
            slogan: "ร้านค้าไอเท็ม Hay Day",
            shopNameColor: "#28a745",
            sloganColor: "#6c757d",
            managerName: "",
            shareholderName: "",
            themeName: 'default',
            fontFamily: "'Kanit', sans-serif",
            globalFontFamily: "'Kanit', sans-serif",
            globalFontSize: 50,
            mainMenuFontSize: 50,
            subMenuFontSize: 50,
            shopNameFontSize: 2.75,
            sloganFontSize: 1.4,
            orderNumberFormat: 'format1',
            orderNumberCounters: { format1: 1, format2: 1, format3: 1 },
            customOrderPrefix: 'WHD',
            logo: null,
            useLogo: false,
            darkMode: false,
            shopNameEffect: { enabled: false, offsetX: 0, offsetY: 0, blur: 10, color: '#000000' },
            sloganEffect: { enabled: false, offsetX: 0, offsetY: 0, blur: 10, color: '#000000' },
            logoEffect: { enabled: false, offsetX: 0, offsetY: 0, blur: 10, color: '#000000' },
            sloganFontFamily: "'Kanit', sans-serif",
            backgroundImage: null,
            backgroundOpacity: 0.5,
            backgroundBlur: 10,
            language: 'th',
            lowStockThreshold: 50,
            dbCategoryLowStockThresholds: {},
            copyrightText: "Copyright © 2025 Warishayday",
            copyrightOpacity: 0.5,
            shopEnabled: true,
            announcementEnabled: false,
            shopClosedMessageText: "ร้านปิดปรับปรุงชั่วคราว",
            announcementMessageText: "ประกาศโปรโมชั่น!",
            salesMode: 'tens', // NEW: 'tens' or 'pieces'
            orderBarSettings: {
                height: 100, // %
                buttonWidth: 100, // %
                buttonHeight: 100, // %
                fontSize: 100, // %
                detailsFontSize: 100, // % Font size for modal details
                warningFontSize: 100, // % Font size for minimum order warning
                totalFontSize: 100,    // % Font size for grand total
                // ===== START: Order Bar Position Update =====
                orderBarPosition: 'summary-top' // 'summary-top' or 'buttons-top'
                // ===== END: Order Bar Position Update =====
            },
            gridLayoutSettings: {
                columns: 6,
                frameStyle: 'frame-style-1',
                horizontalGap: 5,
                verticalGap: 5,
                cardWidth: 100, // %
                cardHeight: 100, // %
                cardFontSize: 100, // %
                levelFontSize: 100, // %
                nameFontSize: 100, // %
                quantityFontSize: 100, // %
                iconSize: 60, // %
                levelColor: '#FFFFFF',
                nameColor: '#333333',
                quantityColor: '#333333',
                iconOffsetX: 0,
                iconOffsetY: -15,
                levelOffsetX: 0,
                levelOffsetY: 0,
                nameOffsetX: 0,
                nameOffsetY: 0,
                quantityOffsetX: 0,
                quantityOffsetY: 0,
            },
            loadingScreen: {
                text: "WARISHAYDAY",
                textEffect: { enabled: false, offsetX: 0, offsetY: 0, blur: 10, color: '#000000' },
                logoUrl: null,
                logoOpacity: 1,
                backgroundUrl: null,
                backgroundOpacity: 1,
                videoUrl: null,
                videoOpacity: 1,
                videoMode: 'background', // 'background' or 'icon'
                barStyle: 'style-1',
            },
            menuLocks: {}, // For admin panel menu locking
            packageType: 'standard', // Current user package type
            // --- START UPDATE ---
            // Price Tag Configuration
            priceTagConfig: {
                storeName: '',
                category: '',
                closingMessage: '', // <--- นี่คือฟิลด์ "เเจ้งลูกค้า"
                imageUrl: '',
                emoji: ''
            },
            // --- END UPDATE ---
            messageSettings: {
                color: "#FFFFFF",
                size: 21,
                speed: 27.5,
                effect: { enabled: false, offsetX: 0, offsetY: 0, blur: 10, color: '#000000' },
                frameStyle: 'style-1',
                previewEnabled: true,
                previewHeight: 50,
                previewWidth: 50,
                outOfStockText: "หมดชั่วคราว",
                outOfStockFontSize: 100,
            },
            effects: {
                seasonal: {
                    activeTheme: 'none',
                    christmas: { enabled: false, intensity: 50 },
                    cny: { enabled: false, intensity: 50 },
                    valentine: { enabled: false, intensity: 50 },
                    halloween: { enabled: false, intensity: 50 },
                    vegetarian: { enabled: false, intensity: 50 },
                    loykrathong: { enabled: false, intensity: 50 },
                    songkran: { enabled: false, intensity: 50 },
                    newyear: { enabled: false, intensity: 50 }
                },
                general: {
                    rain: { enabled: false, intensity: 50, opacity: 0.5 },
                    snow: { enabled: false, intensity: 50, opacity: 0.5 },
                    fireworks: { enabled: false, frequency: 5, opacity: 1 },
                    autumn: { enabled: false, intensity: 25, opacity: 0.7 }
                }
            },
            promotions: [],
            successAnimation: {
                style: '1',
                size: 100,
                primaryColor: '#28a745',
                secondaryColor: '#ffffff',
                showText: true,
                text: "คัดลอกออเดอร์สำเร็จ",
                textPosition: { x: 0, y: 55 },
                textSize: 22,
                textColor: '#ffffff',
                textEffect: { enabled: false, offsetX: 0, offsetY: 0, blur: 10, color: '#000000' }
            },
        },
        analytics: {
            dailyTraffic: Array(7).fill(0),
            hourlyTraffic: Array(24).fill(0),
            productSales: {},
            orders: [],
            totalSales: 0,
            monthlyProfit: 0,
            loginAttempts: { admin: 0, isLocked: false, lastAttempt: null },
            subAdminAttempts: {},
            logs: []
        },
        menuOrder: ['dashboard', 'order-number', 'stock', 'admin', 'festival', 'manage-account', 'grid-layout', 'order-bar', 'manager-store']
    };

    // ===== START: Price Tag Bug Fix (Deep Merge Function) =====
    // Helper function for deep merging objects, used in loadCustomerData
    const mergeDeep = (target, source) => {
        const isObject = (item) => {
            return (item && typeof item === 'object' && !Array.isArray(item));
        };

        if (isObject(target) && isObject(source)) {
            for (const key in source) {
                if (isObject(source[key])) {
                    if (!target[key]) {
                        Object.assign(target, { [key]: {} });
                    }
                    mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        return target;
    }
    // ===== END: Price Tag Bug Fix (Deep Merge Function) =====

    // ===== START: Notification System Module =====
    /**
     * Notification System - Glassmorphism Style
     * Usage:
     *   Notify.success('Title', 'Message');
     *   Notify.error('Title', 'Message');
     *   Notify.warning('Title', 'Message');
     *   Notify.info('Title', 'Message');
     *   Notify.default('Title', 'Message');
     *   Notify.show({ type: 'success', title: 'Title', message: 'Message', duration: 5000 });
     */
    const Notify = (() => {
        const container = document.getElementById('notification-container');
        let notificationCount = 0;

        // SVG Icons for each type
        const icons = {
            success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
            error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
            warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
            info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
            default: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`
        };

        // Close icon
        const closeIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

        // Default titles for each type (Thai)
        const defaultTitles = {
            success: 'สำเร็จ',
            error: 'ผิดพลาด',
            warning: 'คำเตือน',
            info: 'แจ้งเตือน',
            default: 'แจ้งเตือน'
        };

        /**
         * Create and show a notification
         * @param {Object} options - Notification options
         * @param {string} options.type - Type: 'success', 'error', 'warning', 'info', 'default'
         * @param {string} options.title - Title text (optional)
         * @param {string} options.message - Message text
         * @param {number} options.duration - Duration in ms (default: 5000)
         * @param {boolean} options.closable - Show close button (default: true)
         * @param {boolean} options.showProgress - Show progress bar (default: true)
         */
        function show(options = {}) {
            const {
                type = 'default',
                title = defaultTitles[type] || defaultTitles.default,
                message = '',
                duration = 5000,
                closable = true,
                showProgress = true
            } = options;

            const id = `notification-${++notificationCount}`;

            // Create notification element
            const notification = document.createElement('div');
            notification.id = id;
            notification.className = `notification notification-${type}`;

            // Build HTML
            notification.innerHTML = `
                <div class="notification-icon">${icons[type] || icons.default}</div>
                <div class="notification-content">
                    ${title ? `<div class="notification-title">${title}</div>` : ''}
                    ${message ? `<div class="notification-message">${message}</div>` : ''}
                </div>
                ${closable ? `<button class="notification-close" aria-label="Close">${closeIcon}</button>` : ''}
                ${showProgress ? `<div class="notification-progress" style="animation-duration: ${duration}ms;"></div>` : ''}
            `;

            // Add to container
            container.appendChild(notification);

            // Close button handler
            if (closable) {
                const closeBtn = notification.querySelector('.notification-close');
                closeBtn.addEventListener('click', () => hide(id));
            }

            // Auto dismiss
            const timeoutId = setTimeout(() => {
                hide(id);
            }, duration);

            // Pause on hover
            notification.addEventListener('mouseenter', () => {
                clearTimeout(timeoutId);
                const progress = notification.querySelector('.notification-progress');
                if (progress) {
                    progress.style.animationPlayState = 'paused';
                }
            });

            notification.addEventListener('mouseleave', () => {
                const progress = notification.querySelector('.notification-progress');
                if (progress) {
                    // Get remaining time based on progress width
                    const progressWidth = progress.offsetWidth;
                    const containerWidth = notification.offsetWidth;
                    const remainingRatio = progressWidth / containerWidth;
                    const remainingTime = duration * remainingRatio;

                    progress.style.animationPlayState = 'running';

                    setTimeout(() => {
                        hide(id);
                    }, remainingTime);
                }
            });

            return id;
        }

        /**
         * Hide a notification
         * @param {string} id - Notification ID
         */
        function hide(id) {
            const notification = document.getElementById(id);
            if (notification && !notification.classList.contains('hiding')) {
                notification.classList.add('hiding');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }

        /**
         * Clear all notifications
         */
        function clearAll() {
            const notifications = container.querySelectorAll('.notification');
            notifications.forEach((notification, index) => {
                setTimeout(() => {
                    hide(notification.id);
                }, index * 50);
            });
        }

        // Shorthand methods
        function success(title, message, options = {}) {
            if (typeof title === 'object') {
                return show({ ...title, type: 'success' });
            }
            return show({ type: 'success', title, message, ...options });
        }

        function error(title, message, options = {}) {
            if (typeof title === 'object') {
                return show({ ...title, type: 'error' });
            }
            return show({ type: 'error', title, message, ...options });
        }

        function warning(title, message, options = {}) {
            if (typeof title === 'object') {
                return show({ ...title, type: 'warning' });
            }
            return show({ type: 'warning', title, message, ...options });
        }

        function info(title, message, options = {}) {
            if (typeof title === 'object') {
                return show({ ...title, type: 'info' });
            }
            return show({ type: 'info', title, message, ...options });
        }

        function defaultNotify(title, message, options = {}) {
            if (typeof title === 'object') {
                return show({ ...title, type: 'default' });
            }
            return show({ type: 'default', title, message, ...options });
        }

        // ===== Confirm Modal System =====
        const confirmOverlay = document.getElementById('confirm-modal-overlay');
        const confirmModal = confirmOverlay ? confirmOverlay.querySelector('.confirm-modal') : null;
        const confirmIcon = confirmOverlay ? confirmOverlay.querySelector('.confirm-modal-icon') : null;
        const confirmTitle = confirmOverlay ? confirmOverlay.querySelector('.confirm-modal-title') : null;
        const confirmMessage = confirmOverlay ? confirmOverlay.querySelector('.confirm-modal-message') : null;
        const confirmOkBtn = document.getElementById('confirm-ok-btn');
        const confirmCancelBtn = document.getElementById('confirm-cancel-btn');

        let confirmResolve = null;
        let confirmCallback = null;

        // Confirm Modal Icons
        const confirmIcons = {
            warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
            danger: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
            info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
        };

        /**
         * Show a confirm dialog
         * @param {string|Object} titleOrOptions - Title string or options object
         * @param {string} message - Message text
         * @param {Function} callback - Callback function(result) called with true/false
         * @param {Object} options - Additional options
         * @returns {Promise<boolean>} - Resolves with true (confirm) or false (cancel)
         */
        function confirm(titleOrOptions, message, callback, options = {}) {
            if (!confirmOverlay) {
                console.error('Confirm modal not found');
                return Promise.resolve(false);
            }

            // Handle options object as first parameter
            let title, type, confirmText, cancelText, confirmType;
            if (typeof titleOrOptions === 'object') {
                ({
                    title = 'ยืนยันการดำเนินการ',
                    message = 'คุณแน่ใจหรือไม่?',
                    type = 'warning',
                    confirmText = 'ยืนยัน',
                    cancelText = 'ยกเลิก',
                    confirmType = 'danger'
                } = titleOrOptions);
                callback = message;
                if (typeof titleOrOptions.callback === 'function') {
                    callback = titleOrOptions.callback;
                }
            } else {
                title = titleOrOptions || 'ยืนยันการดำเนินการ';
                type = options.type || 'warning';
                confirmText = options.confirmText || 'ยืนยัน';
                cancelText = options.cancelText || 'ยกเลิก';
                confirmType = options.confirmType || 'danger';
            }

            // Set content
            if (confirmTitle) confirmTitle.textContent = title;
            if (confirmMessage) confirmMessage.textContent = message || 'คุณแน่ใจหรือไม่ว่าต้องการดำเนินการนี้?';

            // Set icon type
            if (confirmIcon) {
                confirmIcon.className = `confirm-modal-icon icon-${type}`;
                confirmIcon.innerHTML = confirmIcons[type] || confirmIcons.warning;
            }

            // Set button text and type
            if (confirmOkBtn) {
                confirmOkBtn.textContent = confirmText;
                confirmOkBtn.className = `confirm-modal-btn btn-confirm`;
                if (confirmType === 'success') {
                    confirmOkBtn.classList.add('confirm-success');
                } else if (confirmType === 'info') {
                    confirmOkBtn.classList.add('confirm-info');
                }
            }
            if (confirmCancelBtn) {
                confirmCancelBtn.textContent = cancelText;
            }

            // Store callback
            confirmCallback = typeof callback === 'function' ? callback : null;

            // Show modal
            confirmOverlay.style.display = 'flex';
            requestAnimationFrame(() => {
                confirmOverlay.classList.add('active');
                confirmOverlay.classList.remove('hiding');
            });

            // Return promise
            return new Promise((resolve) => {
                confirmResolve = resolve;
            });
        }

        /**
         * Hide confirm modal
         * @param {boolean} result - Result to return (true/false)
         */
        function hideConfirm(result) {
            if (!confirmOverlay) return;

            confirmOverlay.classList.add('hiding');
            confirmOverlay.classList.remove('active');

            setTimeout(() => {
                confirmOverlay.style.display = 'none';
                confirmOverlay.classList.remove('hiding');

                // Call callback if exists
                if (confirmCallback) {
                    confirmCallback(result);
                    confirmCallback = null;
                }

                // Resolve promise
                if (confirmResolve) {
                    confirmResolve(result);
                    confirmResolve = null;
                }
            }, 300);
        }

        // Bind confirm modal buttons
        if (confirmOkBtn) {
            confirmOkBtn.addEventListener('click', () => hideConfirm(true));
        }
        if (confirmCancelBtn) {
            confirmCancelBtn.addEventListener('click', () => hideConfirm(false));
        }

        // Close on overlay click
        if (confirmOverlay) {
            confirmOverlay.addEventListener('click', (e) => {
                if (e.target === confirmOverlay) {
                    hideConfirm(false);
                }
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && confirmOverlay && confirmOverlay.classList.contains('active')) {
                hideConfirm(false);
            }
        });

        // ===== End Confirm Modal System =====

        return {
            show,
            hide,
            clearAll,
            success,
            error,
            warning,
            info,
            default: defaultNotify,
            confirm,
            hideConfirm
        };
    })();
    // ===== END: Notification System Module =====

    const FONT_OPTIONS = [
        { name: "Kanit", value: "'Kanit', sans-serif" }, { name: "Chakra Petch", value: "'Chakra Petch', sans-serif" },
        { name: "IBM Plex Sans Thai", value: "'IBM Plex Sans Thai', sans-serif" }, { name: "Sarabun", value: "'Sarabun', sans-serif" },
        { name: "Prompt", value: "'Prompt', sans-serif" }, { name: "Mali", value: "'Mali', sans-serif" },
        { name: "Anuphan", value: "'Anuphan', sans-serif" }, { name: "Taviraj", value: "'Taviraj', serif" },
        { name: "Trirong", value: "'Trirong', serif" },
        { name: "Niramit", value: "'Niramit', sans-serif"}
    ];

    // ===== START: Theme Update (Total 30) =====
    const THEME_PRESETS = {
        default: { name: "Default Green", colors: { primary: "#28a745", secondary: "#ffc107", info: "#17a2b8" }},
        ocean: { name: "Ocean Blue", colors: { primary: "#007bff", secondary: "#66d9e8", info: "#17a2b8" }},
        sunset: { name: "Sunset Orange", colors: { primary: "#fd7e14", secondary: "#ffc107", info: "#e83e8c" }},
        royal: { name: "Royal Purple", colors: { primary: "#6f42c1", secondary: "#e83e8c", info: "#007bff" }},
        forest: { name: "Forest Vibe", colors: { primary: "#20c997", secondary: "#495047", info: "#28a745" }},
        candy: { name: "Candy Pink", colors: { primary: "#e83e8c", secondary: "#f8f9fa", info: "#6f42c1" }},
        fire: { name: "Fire Red", colors: { primary: "#dc3545", secondary: "#fd7e14", info: "#ffc107" }},
        earth: { name: "Earthy Brown", colors: { primary: "#8B4513", secondary: "#D2B48C", info: "#A0522D" }},
        mono: { name: "Monochrome", colors: { primary: "#343a40", secondary: "#6c757d", info: "#f8f9fa" }},
        tech: { name: "Tech Cyan", colors: { primary: "#17a2b8", secondary: "#20c997", info: "#66d9e8" }},
        // 20 New Themes
        lavender: { name: "Lavender Bliss", colors: { primary: "#8692f7", secondary: "#e0e7ff", info: "#a5b4fc" }},
        mint: { name: "Minty Fresh", colors: { primary: "#34d399", secondary: "#a7f3d0", info: "#6ee7b7" }},
        rose: { name: "Rose Gold", colors: { primary: "#f472b6", secondary: "#fbcfe8", info: "#f9a8d4" }},
        cyber: { name: "Cyberpunk", colors: { primary: "#ec4899", secondary: "#f5d0fe", info: "#0ea5e9" }},
        coffee: { name: "Coffee House", colors: { primary: "#854d0e", secondary: "#eab308", info: "#ca8a04" }},
        sky: { name: "Clear Sky", colors: { primary: "#38bdf8", secondary: "#e0f2fe", info: "#7dd3fc" }},
        wine: { name: "Deep Wine", colors: { primary: "#a21caf", secondary: "#f0abfc", info: "#e879f9" }},
        forest_night: { name: "Forest Night", colors: { primary: "#166534", secondary: "#a3e635", info: "#4ade80" }},
        autumn: { name: "Autumn Leaves", colors: { primary: "#f97316", secondary: "#fdba74", info: "#fb923c" }},
        ice: { name: "Icy Blue", colors: { primary: "#06b6d4", secondary: "#cffafe", info: "#67e8f9" }},
        strawberry: { name: "Strawberry", colors: { primary: "#f43f5e", secondary: "#ffe4e6", info: "#fb7185" }},
        lime: { name: "Lime Zest", colors: { primary: "#84cc16", secondary: "#ecfccb", info: "#a3e635" }},
        grape: { name: "Grape Soda", colors: { primary: "#9333ea", secondary: "#f3e8ff", info: "#c084fc" }},
        peach: { name: "Sweet Peach", colors: { primary: "#fb923c", secondary: "#ffedd5", info: "#fdba74" }},
        steel: { name: "Steel Grey", colors: { primary: "#64748b", secondary: "#cbd5e1", info: "#94a3b8" }},
        coral: { name: "Coral Reef", colors: { primary: "#ef4444", secondary: "#fecaca", info: "#f87171" }},
        sand: { name: "Sandy Beach", colors: { primary: "#eab308", secondary: "#fef9c3", info: "#fde047" }},
        emerald: { name: "Emerald", colors: { primary: "#059669", secondary: "#6ee7b7", info: "#34d399" }},
        denim: { name: "Denim Blue", colors: { primary: "#3b82f6", secondary: "#dbeafe", info: "#60a5fa" }},
        luxury: { name: "Luxury Gold", colors: { primary: "#ca8a04", secondary: "#fef08a", info: "#eab308" }}
    };
    // ===== END: Theme Update =====

    const translations = {
        th: {
// ... (rest of translations object)
            loadingAnimationLabel: "รูปแบบอนิเมชั่น", loadingMessage: "ข้อความตอนโหลด",
            closeBtn: "ปิด", cancelBtn: "ยกเลิก", confirmBtn: "ยืนยัน", saveBtn: "บันทึก", editBtn: "แก้ไข", deleteBtn: "ลบ", clearBtn: "ล้างข้อมูล",
            searchPlaceholder: "ค้นหาสินค้า...", itemsListTitle: "รายการสินค้า", tableHeaderItem: "สินค้า", tableHeaderLevel: "เลเวล", tableHeaderQuantity: "จำนวน", tableHeaderManage: "จัดการ",
            viewOrderBtn: "รายการสั่งซื้อ", confirmOrderBtn: "ยืนยันสั่งซื้อ", totalAmount: "ยอดรวม",
            adminLoginTitle: "เข้าสู่ระบบหลังบ้าน", pinLabel: "PIN", loginBtn: "เข้าสู่ระบบ", backToShopBtn: "กลับหน้าหลักสั่งสินค้า", invalidPinError: "PIN ไม่ถูกต้อง!",
            pinAttemptsLeft: "เหลือ {attemptsLeft} ครั้ง", pinLocked: "ล็อกอินล้มเหลวเกิน 5 ครั้ง ระบบล็อกแล้ว", pinUnlockCode: "ปลดล็อกด้วยรหัส 1340900210406",
            adminPanelTitle: "Admin Panel", viewShopBtn: "มุมมองหน้าร้าน", logoutBtn: "ออกจากระบบ",
            menuAdmin: "ตั้งค่าร้าน", menuFestival: "Festival", menuStock: "สต๊อกสินค้า", menuOrderNumber: "Order Number", menuDashboard: "Dashboard", menuManageAccount: "Manage account", editMenuOrderBtn: "EDIT",
            menuGridLayout: "Grid Layout",
            menuOrderBar: "แถบสั่งซื้อ",
            menuManagerStore: "Manager Store",
            msStoreRegistrations: "ร้านค้าที่สมัครเข้ามา",
            msSerialKey: "Serial Key",
            msPackageSettings: "ตั้งค่าแพ็คเกจ",
            msOpenStore: "เปิดร้านค้าใหม่",
            msTrackOperations: "ติดตามการทำงาน",
            msPaymentStores: "Payment Stores",
            msDashboard: "Dashboard (ระบบ)",
            editSubMenuOrderBtn: "EDIT",
            storeName: "ชื่อร้าน",
            storeInfo: "ข้อมูลร้าน",
            openDate: "วันที่เปิดร้าน",
            serial: "Serial",
            onlineStatus: "online",
            copyKeyBtn: "คัดลอก & บันทึก Key",
            deleteKeyBtn: "ลบ",
            storeDetailsTitle: "รายละเอียดร้านค้า",
            ownerName: "ชื่อเจ้าของ",
            storeEmail: "Email",
            storeLink: "ลิ้งร้านหลัก",
            yearsOpen: "เปิดมาแล้ว (ปี)",
            dashboardOverview: "ภาพรวมร้านค้า", productDashboardTitle: "Dashboard สินค้า", topStockTitle: "สินค้ามากสุด 10 อันดับแรก", lowStock50Title: "สินค้าน้อยสุด 50 อันดับแรก", viewMore: "ดูเพิ่มเติม",
            shopInfoTitle: "ข้อมูลร้าน", shopLinkTitle: "ลิงก์สำหรับลูกค้า", shopLinkInfo: "แชร์ลิงก์นี้ให้ลูกค้าเพื่อเข้าถึงร้านค้าโดยตรง (ไม่มีปุ่ม Admin)", copyLinkBtn: "คัดลอก",
            systemFontsTitle: "System Fonts", fontPreviewText: "ตัวอย่างฟอนต์สโลแกน",
            shopNameLabel: "ชื่อร้านค้า", shopSloganLabel: "สโลแกนร้าน", managerNameLabel: "ชื่อผู้จัดการระบบ", shareholderNameLabel: "ชื่อผู้ถือหุ้นใหญ่",
            globalFontLabel: "ฟอนต์ระบบทั้งหมด", shopNameFontLabel: "ฟอนต์ชื่อร้าน", sloganFontLabel: "ฟอนต์สโลแกน",
            globalFontSizeLabel: "ขนาดฟอนต์ทั้งระบบ", shopNameFontSizeLabel: "ขนาดฟอนต์ชื่อร้าน", sloganFontSizeLabel: "ขนาดฟอนต์สโลแกน",
            mainMenuFontSizeLabel: "ขนาดฟอนต์เมนูหลัก", subMenuFontSizeLabel: "ขนาดฟอนต์เมนูย่อย",
            enableEffectLabel: "เอฟเฟกต์เงาชื่อร้าน", enableSloganEffectLabel: "เอฟเฟกต์เงาสโลแกน",
            effectOffsetX: "เงาแนวนอน (X)", effectOffsetY: "เงาแนวตั้ง (Y)", effectBlur: "ความเบลอ", effectColor: "สีเงา",
            orderFormatLabel: "รูปแบบเลขที่ออเดอร์", useLogoLabel: "ใช้โลโก้", uploadLogoLabel: "อัปโหลดโลโก้ (PNG)",
            backgroundSettingsTitle: "ตั้งค่าพื้นหลัง", uploadBgLabel: "อัปโหลดภาพพื้นหลัง", bgOpacityLabel: "ความโปร่งใส (จาง-ชัด)", bgBlurLabel: "ความเบลอ (น้อย-มาก)",
            removeBgBtn: "ลบพื้นหลัง", previewBgBtn: "ดูตัวอย่าง", saveSettingsBtn: "บันทึกการตั้งค่า",
            copyrightTextLabel: "ข้อความ Copyright", copyrightOpacityLabel: "ความคมชัด",
            changePinTitle: "เปลี่ยนรหัสผ่าน", newPinLabel: "PIN ใหม่", saveNewPinBtn: "บันทึก PIN ใหม่",
            manageCategoriesTitle: "จัดการหมวดหมู่", categoryNameLabel: "ชื่อหมวดหมู่", categoryNameEnLabel: "ชื่อหมวดหมู่ (English)", categoryIconLabel: "ไอค่อนหมวดหมู่", minOrderLabel: "จำนวนสั่งซื้อขั้นต่ำ",
            setPriceLabel: "ตั้งค่าราคา", setPerPiecePriceBtn: "ตั้งราคาต่อชิ้น", saveCategoryBtn: "เพิ่ม/บันทึกหมวดหมู่", categoryListTitle: "รายการหมวดหมู่",
            tableHeaderIcon: "ไอค่อน", tableHeaderName: "ชื่อ", tableHeaderMinOrder: "ขั้นต่ำ", tableHeaderPrice: "ราคา",
            manageProductsTitle: "จัดการสินค้า", productNameLabel: "ชื่อสินค้า", productNameEnLabel: "ชื่อสินค้า (English)", levelLabel: "เลเวล", stockQuantityLabel: "จำนวนคงเหลือ", categoryLabel: "หมวดหมู่",
            productIconLabel: "ไอค่อนสินค้า", productAvailableLabel: "เปิดขายสินค้านี้", saveProductBtn: "บันทึกสินค้า", cancelEditBtn: "ยกเลิกแก้ไข",
            tableHeaderStock: "คงเหลือ", tableHeaderStatus: "สถานะ", statusAvailable: "เปิดขาย", statusUnavailable: "ปิดขาย",
            stockDatabaseTitle: "ฐานข้อมูลสต็อก", searchCategoryLabel: "ค้นหาหมวดหมู่", searchProductLabel: "ค้นหาสินค้า", pullBtn: "ดึงข้อมูล",
            selectDateLabel: "เลือกวันที่:", resetDataBtn: "รีเซ็ทข้อมูล",
            confirmOrdersTitle: "ออเดอร์ใหม่", activeOrdersTitle: "รายการออเดอร์ปัจจุบัน", cancelledOrdersTitle: "รายการออเดอร์ที่ถูกยกเลิก",
            dashboardTitle: "ภาพรวมร้านค้า", monthlyProfitTitle: "กำไรเดือนนี้", dailyOrdersTitle: "ยอดออเดอร์วันนี้", monthlyOrdersTitle: "ยอดออเดอร์เดือนนี้", yearlySalesTitle: "ยอดขายรวม (ปีนี้)",
            lowStockAlertTitle: "การแจ้งเตือนสินค้าคงเหลือ",
            menuStockSettings: "ตั้งค่าคงเหลือ",
            pricingSettingsTitle: "ตั้งค่าราคา",
            lowStockSettingsTitle: "ตั้งค่าคงเหลือ",
            lowStockSettingsInfo: "กำหนดจำนวนสินค้าขั้นต่ำสำหรับแต่ละหมวดหมู่ (จากฐานข้อมูล) เพื่อรับการแจ้งเตือนในหน้า Dashboard",
            noLowStockItems: "ไม่มีสินค้าใกล้หมด", categorySalesTitle: "ยอดขายตามหมวดหมู่", topSellingTitle: "สินค้าขายดี (Top 5)",
            periodDay: "วันนี้", periodMonth: "เดือนนี้", periodYear: "ปีนี้", trafficStatsTitle: "สถิติการเข้าใช้งาน", productStatsTitle: "สถิติสินค้า (ตามจำนวนที่สั่ง)",
            manageAccountTitle: "จัดการบัญชี", subAdminLimitInfo: "จำกัดจำนวนผู้ใช้ย่อยได้สูงสุด 20 คน", usernameLabel: "ชื่อผู้ใช้", addUserBtn: "เพิ่มผู้ใช้", subAdminListTitle: "รายการผู้ใช้ย่อย",
            orderSummaryTitle: "สรุปออเดอร์", copyOrderPrompt: "กรุณาคัดลอกข้อความด้านล่างเพื่อส่งให้ทางร้าน", copyOrderBtn: "คัดลอกออเดอร์", copySuccessMessage: "คัดลอกออเดอร์สำเร็จ",
            yourOrderListTitle: "รายการสั่งซื้อของคุณ", confirmPinTitle: "ยืนยันรหัส PIN", enterPinPrompt: "กรอกรหัส PIN เพื่อยืนยัน",
            confirmResetTitle: "ยืนยันการรีเซ็ทข้อมูล", selectResetPeriodPrompt: "กรุณาเลือกช่วงเวลาที่ต้องการรีเซ็ทข้อมูล", periodWeek: "สัปดาห์นี้", periodAll: "ข้อมูลทั้งหมด",
            setPerPiecePriceTitle: "ตั้งราคาต่อชิ้น", setPerPiecePriceInfo: "กำหนดราคาสำหรับทุกๆ 10 ชิ้น", savePriceBtn: "บันทึกราคา",
            reorderMenuTitle: "จัดเรียงเมนู", reorderMenuInfo: "ลากและวางเพื่อจัดลำดับเมนูตามต้องการ", saveOrderBtn: "บันทึกการจัดเรียง",
            setPermissionsTitle: "ตั้งค่าสิทธิ์การเข้าถึง", savePermissionsBtn: "บันทึกสิทธิ์",
            loadingBackgroundTitle: "พื้นหลัง Loading", uploadLoadingBgLabel: "อัปโหลดภาพพื้นหลัง Loading", loadingBarStyleLabel: "รูปแบบแถบดาวน์โหลด",
            priceDetailsTitle: "รายละเอียดราคา", viewPriceBtn: "ดูราคา",
            announcementMessageSettings: "ตั้งค่าข้อความประกาศ",
            effectsTitle: "Effects",
            seasonalEffectsTitle: "Effects เทศกาล",
            seasonalEffectsGeneralTitle: "Effects ฤดูกาล",
            rainEffectLabel: "ฤดูฝนตก", rainIntensityLabel: "ความหนัก",
            snowEffectLabel: "ฤดูหิมะ", snowIntensityLabel: "ความหนัก",
            fireworksEffectLabel: "พลุฉลอง", fireworksFrequencyLabel: "ความถี่ (นาที)",
            autumnEffectLabel: "ใบไม้ร่วง", autumnIntensityLabel: "ความหนาแน่น",
            effectOpacityLabel: "ความชัด",
            saveSuccessMessage: "บันทึกสำเร็จ!",
            systemThemeLabel: "ธีมระบบ", selectThemeBtn: "เลือกธีม", systemThemeTitle: "เลือกธีมระบบ",
            previewLabel: "ตัวอย่าง", marqueeSpeedLabel: "ความเร็วตัวอักษรวิ่ง",
            stockDatabaseManageCats: "จัดการหมวดหมู่ (ฐานข้อมูล)", stockDatabaseManageProds: "จัดการสินค้า (ฐานข้อมูล)",
            addCategoryBtn: "เพิ่มหมวดหมู่", addProductBtn: "เพิ่มสินค้า",
            searchFromDb: "ค้นหาจากฐานข้อมูล", searchModalTitle: "ค้นหาจากฐานข้อมูล",
            enableMessageEffectLabel: "เปิดใช้เอฟเฟกต์ตัวอักษร",
            stockDbInfo: "ที่นี่คือฐานข้อมูลหลักสำหรับจัดเก็บรายการสินค้าและหมวดหมู่ทั้งหมด คุณสามารถเพิ่ม/แก้ไข/ลบข้อมูลได้จากที่นี่ และนำไปใช้ในหน้าจัดการสต็อกสินค้าของร้านค้า",
            menuPromotions: "โปรโมชั่น",
            promotionsTitle: "จัดการโค้ดส่วนลด",
            promoCodeLabel: "โค้ดส่วนลด",
            promoDiscountLabel: "ส่วนลด (%)",
            addPromoBtn: "เพิ่มโค้ด",
            generatePromoBtn: "สร้างโค้ดสุ่ม",
            promoListTitle: "รายการโค้ดส่วนลด",
            tableHeaderCode: "โค้ด",
            tableHeaderDiscount: "ส่วนลด",
            promoCodeInputLabel: "กรอกโค้ดส่วนลด",
            applyPromoBtn: "ใช้โค้ด",
            discountLabel: "ส่วนลด",
            grandTotalLabel: "ยอดรวมสุทธิ",
            invalidPromoCode: "โค้ดส่วนลดไม่ถูกต้อง",
            menuLogs: "Log การเปลี่ยนแปลง",
            logsTitle: "ประวัติการเปลี่ยนแปลง",
            tableHeaderTimestamp: "เวลา",
            tableHeaderAction: "การกระทำ",
            tableHeaderDetails: "รายละเอียด",
            themeLabel: "ธีม",
            themeLight: "Light",
            themeDark: "Dark",
            announcementLabel: "ประกาศ",
            announcementMessageLabel: "ข้อความประกาศ",
            messageTargetLabel: "เลือกเป้าหมายการแก้ไข",
            messageStyleSettingsLabel: "ตั้งค่าสไตล์ข้อความ",
            messageFrameLabel: "กรอบข้อความพื้นหลัง",
            boxHeightLabel: "ความสูงของกล่องข้อความ",
            boxWidthLabel: "ความยาวของกล่องข้อความ",
            successAnimationSettingsTitle: "ตั้งค่าอนิเมชั่น \"สั่งซื้อสำเร็จ\"",
            animationStyleLabel: "รูปแบบอนิเมชั่น",
            animationSizeLabel: "ขนาดอนิเมชั่น",
            primaryColorLabel: "สีหลัก",
            secondaryColorLabel: "สีรอง",
            showSuccessTextLabel: "แสดงข้อความ",
            fontSizeLabel: "ขนาดตัวอักษร",
            fontColorLabel: "สีตัวอักษร",
            enableTextEffectLabel: "เปิดใช้เอฟเฟกต์",
            successAnimationTextLabel: "ข้อความ",
            successTextPositionLabel: "ตำแหน่งข้อความ",
            positionTop: "บน icon",
            positionBottom: "ล่าง icon",
            positionLeft: "ซ้าย icon",
            positionRight: "ขวา icon",
            selectCategoryPrompt: "กรุณาเลือกหมวดหมู่",
            loadingProducts: "กำลังโหลดสินค้า...",
            errorLoadingProducts: "เกิดข้อผิดพลาดในการโหลดสินค้า",
            gridLayoutTitle: "ตั้งค่า Grid Layout",
            cardFrameStyleLabel: "รูปแบบกรอบสินค้า",
            cardQuantityFontSizeLabel: "ขนาดตัวเลขสินค้า",
            editTextLabel: "แก้ไขชื่อ",
            attachLogoLabel: "แนบภาพ LOGO",
            opacityLabel: "ความชัด-จาง",
            attachBackgroundLabel: "แนบภาพแบล็คกราวในหน้าดาวโหลด",
            attachVideoLabel: "แนบ VDO",
            videoModeLabel: "รูปแบบ VDO",
            videoModeBackground: "แบล็คกราว",
            videoModeIcon: "ICON บนชื่อ",
            downloadBarStylesLabel: "รูปแบบแถบดาวน์โหลด (50 แบบ)",
            filterBtn: "ตัวกรอง",
            sortByLevel: "เรียงตามเลเวล",
            sortByLevelDesc: "เรียงตามเลเวล มาก ไป น้อย",
            sortByLevelAsc: "เรียงตามเลเวล น้อย ไป มาก",
            sortByNameTh: "เรียงตามอักษร ก-ฮ",
            sortByNameEn: "เรียงตามอักษร A-Z",
            outOfStockTemporarily: "หมดชั่วคราว",
            unavailableMessageLabel: "ข้อความเมื่อปิดการขาย",
        },
        en: {
// ... (rest of english translations)
            loadingAnimationLabel: "Animation Style", loadingMessage: "Loading Message",
            closeBtn: "Close", cancelBtn: "Cancel", confirmBtn: "Confirm", saveBtn: "Save", editBtn: "Edit", deleteBtn: "Delete", clearBtn: "Clear",
            searchPlaceholder: "Search for products...", itemsListTitle: "Product List", tableHeaderItem: "Item", tableHeaderLevel: "Level", tableHeaderQuantity: "Quantity", tableHeaderManage: "Manage",
            viewOrderBtn: "View Order", confirmOrderBtn: "Confirm Order", totalAmount: "Total",
            adminLoginTitle: "Admin Login", pinLabel: "PIN", loginBtn: "Login", backToShopBtn: "Back to Shop", invalidPinError: "Invalid PIN!",
            pinAttemptsLeft: "{attemptsLeft} attempts left", pinLocked: "Login failed more than 5 times. System is locked.", pinUnlockCode: "Unlock with code 1340900210406",
            adminPanelTitle: "Admin Panel", viewShopBtn: "View Shop", logoutBtn: "Logout",
            menuAdmin: "Shop Settings", menuFestival: "Festival", menuStock: "Stock", menuOrderNumber: "Order Number", menuDashboard: "Dashboard", menuManageAccount: "Manage Account", editMenuOrderBtn: "EDIT",
            menuGridLayout: "Grid Layout",
            menuOrderBar: "Order Bar",
            menuManagerStore: "Manager Store",
            msStoreRegistrations: "Store Registrations",
            msSerialKey: "Serial Key",
            msPackageSettings: "Package Settings",
            msOpenStore: "Open New Store",
            msTrackOperations: "Track Operations",
            msPaymentStores: "Payment Stores",
            msDashboard: "Dashboard (System)",
            editSubMenuOrderBtn: "EDIT",
            storeName: "Store Name",
            storeInfo: "Store Info",
            openDate: "Open Date",
            serial: "Serial",
            onlineStatus: "Online",
            copyKeyBtn: "Copy & Save Key",
            deleteKeyBtn: "Delete",
            storeDetailsTitle: "Store Details",
            ownerName: "Owner Name",
            storeEmail: "Email",
            storeLink: "Main Store Link",
            yearsOpen: "Years Open",
            dashboardOverview: "Overview", productDashboardTitle: "Product Dashboard", topStockTitle: "Top 10 Highest Stock", lowStock50Title: "Top 50 Lowest Stock", viewMore: "View More",
            shopInfoTitle: "Shop Info", shopLinkTitle: "Link for Customers", shopLinkInfo: "Share this link with customers for direct access to the shop (no Admin button).", copyLinkBtn: "Copy",
            systemFontsTitle: "System Fonts", fontPreviewText: "System Font Preview",
            shopNameLabel: "Shop Name", shopSloganLabel: "Slogan", managerNameLabel: "System Manager Name", shareholderNameLabel: "Major Shareholder Name",
            globalFontLabel: "Global Font", shopNameFontLabel: "Shop Name Font", sloganFontLabel: "Slogan Font",
            globalFontSizeLabel: "Global Font Size", shopNameFontSizeLabel: "Shop Name Font Size", sloganFontSizeLabel: "Slogan Font Size",
            mainMenuFontSizeLabel: "Main Menu Font Size", subMenuFontSizeLabel: "Sub Menu Font Size",
            enableEffectLabel: "Enable Shop Name Shadow Effect", enableSloganEffectLabel: "Enable Slogan Shadow Effect",
            effectOffsetX: "Shadow Offset X", effectOffsetY: "Shadow Offset Y", effectBlur: "Blur", effectColor: "Shadow Color",
            orderFormatLabel: "Order Number Format", useLogoLabel: "Use Logo", uploadLogoLabel: "Upload Logo (PNG)",
            backgroundSettingsTitle: "Background Settings", uploadBgLabel: "Upload Background Image", bgOpacityLabel: "Opacity (Transparent-Opaque)", bgBlurLabel: "Blur (Low-High)",
            removeBgBtn: "Remove Background", previewBgBtn: "Preview", saveSettingsBtn: "Save Settings",
            copyrightTextLabel: "Copyright Text", copyrightOpacityLabel: "Opacity",
            changePinTitle: "Change Password", newPinLabel: "New PIN", saveNewPinBtn: "Save New PIN",
            manageCategoriesTitle: "Manage Categories", categoryNameLabel: "Category Name", categoryNameEnLabel: "Category Name (English)", categoryIconLabel: "Category Icon", minOrderLabel: "Minimum Order Quantity",
            setPriceLabel: "Set Price", setPerPiecePriceBtn: "Set Per-Piece Price", saveCategoryBtn: "Add/Save Category", categoryListTitle: "Category List",
            tableHeaderIcon: "Icon", tableHeaderName: "Name", tableHeaderMinOrder: "Min. Order", tableHeaderPrice: "Price",
            manageProductsTitle: "Manage Products", productNameLabel: "Product Name", productNameEnLabel: "Product Name (English)", levelLabel: "Level", stockQuantityLabel: "Stock Quantity", categoryLabel: "Category",
            productIconLabel: "Product Icon", productAvailableLabel: "Enable this product for sale", saveProductBtn: "Save Product", cancelEditBtn: "Cancel Edit",
            tableHeaderStock: "Stock", tableHeaderStatus: "Status", statusAvailable: "Available", statusUnavailable: "Unavailable",
            stockDatabaseTitle: "Stock Database", searchCategoryLabel: "Search Category", searchProductLabel: "Search Product", pullBtn: "Pull Data",
            selectDateLabel: "Select Date:", resetDataBtn: "Reset Data",
            confirmOrdersTitle: "New Orders", activeOrdersTitle: "Active Orders", cancelledOrdersTitle: "Cancelled Orders",
            tableHeaderOrderNo: "Order No.", tableHeaderDateTime: "Date/Time", tableHeaderTotal: "Total", viewDetailsBtn: "View Details", cancelOrderBtn: "Cancel",
            dashboardTitle: "Shop Overview", monthlyProfitTitle: "This Month's Profit", dailyOrdersTitle: "Today's Orders", monthlyOrdersTitle: "This Month's Orders", yearlySalesTitle: "Total Sales (This Year)",
            lowStockAlertTitle: "Low Stock Alert",
            menuStockSettings: "Stock Settings",
            pricingSettingsTitle: "Pricing Settings",
            lowStockSettingsTitle: "Stock Settings",
            lowStockSettingsInfo: "Set minimum stock quantities for each category (from the database) to receive alerts on the Dashboard.",
            noLowStockItems: "No items are running low on stock", categorySalesTitle: "Sales by Category", topSellingTitle: "Top 5 Selling Items",
            periodDay: "Today", periodMonth: "This Month", periodYear: "This Year", trafficStatsTitle: "Traffic Statistics", productStatsTitle: "Product Statistics (by quantity ordered)",
            manageAccountTitle: "Manage Accounts", subAdminLimitInfo: "Maximum of 20 sub-users allowed.", usernameLabel: "Username", addUserBtn: "Add User", subAdminListTitle: "Sub-User List",
            orderSummaryTitle: "Order Summary", copyOrderPrompt: "Please copy the text below to send to the shop.", copyOrderBtn: "Copy Order", copySuccessMessage: "Order copied successfully",
            yourOrderListTitle: "Your Order List", confirmPinTitle: "Confirm PIN", enterPinPrompt: "Enter PIN to confirm",
            confirmResetTitle: "Confirm Data Reset", selectResetPeriodPrompt: "Please select the period for which you want to reset data.", periodWeek: "This Week", periodAll: "All Data",
            setPerPiecePriceTitle: "Set Per-Piece Price", setPerPiecePriceInfo: "Define the price for every 10 pieces.", savePriceBtn: "Save Prices",
            reorderMenuTitle: "Reorder Menu", reorderMenuInfo: "Drag and drop to reorder the menu as desired.", saveOrderBtn: "Save Order",
            setPermissionsTitle: "Set Access Permissions", savePermissionsBtn: "Save Permissions",
            loadingBackgroundTitle: "Loading Background", uploadLoadingBgLabel: "Upload Loading Background Image", loadingBarStyleLabel: "Loading Bar Style",
            priceDetailsTitle: "Price Details", viewPriceBtn: "View Price",
            announcementMessageSettings: "Announcement Message Settings",
            effectsTitle: "Effects",
            seasonalEffectsTitle: "Seasonal Effects",
            seasonalEffectsGeneralTitle: "Seasonal Effects",
            rainEffectLabel: "Rain Effect", rainIntensityLabel: "Intensity",
            snowEffectLabel: "Snow Effect", snowIntensityLabel: "Intensity",
            fireworksEffectLabel: "Fireworks Effect", fireworksFrequencyLabel: "Frequency (min)",
            autumnEffectLabel: "Autumn Effect", autumnIntensityLabel: "Intensity",
            effectOpacityLabel: "Opacity",
            saveSuccessMessage: "Saved successfully!",
            systemThemeLabel: "System Theme", selectThemeBtn: "Select Theme", systemThemeTitle: "Select System Theme",
            previewLabel: "Preview", marqueeSpeedLabel: "Marquee Speed",
            stockDatabaseManageCats: "Manage Categories (Database)", stockDatabaseManageProds: "Manage Products (Database)",
            addCategoryBtn: "Add Category", addProductBtn: "Add Product",
            searchFromDb: "Search from Database", searchModalTitle: "Search from Database",
            enableMessageEffectLabel: "Enable Text Effect",
            stockDbInfo: "This is the main database for storing all product and category items. You can add/edit/delete data here and then use it on the shop's stock management page.",
            menuPromotions: "Promotions",
            promotionsTitle: "Manage Discount Codes",
            promoCodeLabel: "Discount Code",
            promoDiscountLabel: "Discount (%)",
            addPromoBtn: "Add Code",
            generatePromoBtn: "Generate Random Code",
            promoListTitle: "Discount Code List",
            tableHeaderCode: "Code",
            tableHeaderDiscount: "Discount",
            promoCodeInputLabel: "Enter discount code",
            applyPromoBtn: "Apply",
            discountLabel: "Discount",
            grandTotalLabel: "Grand Total",
            invalidPromoCode: "Invalid discount code",
            menuLogs: "Change Log",
            logsTitle: "Change History",
            tableHeaderTimestamp: "Timestamp",
            tableHeaderAction: "Action",
            tableHeaderDetails: "Details",
            themeLabel: "Theme",
            themeLight: "Light",
            themeDark: "Dark",
            announcementLabel: "Announcement",
            announcementMessageLabel: "Announcement Message",
            messageTargetLabel: "Select Target to Edit",
            messageStyleSettingsLabel: "Message Style Settings",
            messageFrameLabel: "Message Background Frame",
            boxHeightLabel: "Box Height",
            boxWidthLabel: "Box Width",
            successAnimationSettingsTitle: "Success Animation Settings",
            animationStyleLabel: "Animation Style",
            animationSizeLabel: "Animation Size",
            primaryColorLabel: "Primary Color",
            secondaryColorLabel: "Secondary Color",
            showSuccessTextLabel: "Show Text",
            fontSizeLabel: "Font Size",
            fontColorLabel: "Font Color",
            enableTextEffectLabel: "Enable Effect",
            successAnimationTextLabel: "Text",
            successTextPositionLabel: "Text Position",
            positionTop: "Above icon",
            positionBottom: "Below icon",
            positionLeft: "Left of icon",
            positionRight: "Right of icon",
            selectCategoryPrompt: "Please select a category",
            loadingProducts: "Loading products...",
            errorLoadingProducts: "Error loading products.",
            gridLayoutTitle: "Grid Layout Settings",
            cardFrameStyleLabel: "Product Card Frame Style",
            cardQuantityFontSizeLabel: "Product Quantity Font Size",
            editTextLabel: "Edit Name",
            attachLogoLabel: "Attach LOGO",
            opacityLabel: "Opacity",
            attachBackgroundLabel: "Attach loading screen background",
            attachVideoLabel: "Attach Video",
            videoModeLabel: "Video Mode",
            videoModeBackground: "Background",
            videoModeIcon: "ICON above name",
            downloadBarStylesLabel: "Download Bar Styles (50 styles)",
            filterBtn: "Filter",
            sortByLevel: "Sort by Level",
            sortByLevelDesc: "Sort by Level (High to Low)",
            sortByLevelAsc: "Sort by Level (Low to High)",
            sortByNameTh: "Sort by Name (TH)",
            sortByNameEn: "Sort by Name (EN)",
            outOfStockTemporarily: "Temporarily out of stock",
            unavailableMessageLabel: "Message when unavailable",
        }
    };

    const MENU_NAMES = {
        'dashboard': 'menuDashboard', 'order-number': 'menuOrderNumber', 'stock': 'menuStock',
        'admin': 'menuAdmin', 'festival': 'menuFestival', 'manage-account': 'menuManageAccount',
        'grid-layout': 'gridLayoutTitle', 'order-bar': 'menuOrderBar', 'manager-store': 'menuManagerStore'
    };

    const SUB_MENUS = {
        'admin': {
            'shop-info': 'shopInfoTitle',
            'system-fonts': 'systemFontsTitle',
            'background': 'backgroundSettingsTitle',
            'promotions': 'menuPromotions',
            'password': 'เปลี่ยนรหัสผ่าน', // <--- UPDATE: ยืนยันชื่อเมนู
            'price-tag-config': 'ตั้งค่าป้ายราคา' // <--- UPDATE: เปลี่ยนชื่อเมนูตามคำขอ
        },
        'stock': {
            'categories': 'manageCategoriesTitle',
            'products': 'manageProductsTitle',
            'stock-settings': 'menuStockSettings'
        },
        'order-number': { 'confirm-orders': 'confirmOrdersTitle', 'active-orders': 'activeOrdersTitle', 'cancelled-orders': 'cancelledOrdersTitle' },
        'festival': {
            'announcement-message': 'announcementMessageSettings',
            'effects': 'effectsTitle'
        },
        'manage-account': { 'accounts': 'manageAccountTitle', 'logs': 'menuLogs' },
        'dashboard': { 'dashboard-overview': 'dashboardOverview', 'product-dashboard': 'productDashboardTitle' },
        'manager-store': {
            'store-registrations': 'msStoreRegistrations',
            'serial-key': 'msSerialKey',
            'open-new-store': 'msOpenStore',
            'track-operations': 'msTrackOperations',
            'payment-stores': 'msPaymentStores',
            'package-settings': 'msPackageSettings',
            'manager-dashboard': 'msDashboard'
        }
    };

    const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

    const addLog = (action, details) => {
        const logEntry = {
            timestamp: new Date().toISOString(),
            user: loggedInUser ? loggedInUser.name : 'System',
            action: action,
            details: details
        };
        appData.analytics.logs.unshift(logEntry);
        if (appData.analytics.logs.length > 200) {
            appData.analytics.logs.pop();
        }
    };

    // New function to log specific user actions as traffic
    const logTrafficAction = async (actionType) => {
        try {
            // This sends a request to the backend to log the visit action.
            // The backend should handle incrementing daily/hourly counters based on this.
            await fetch(API_LOG_TRAFFIC_ENDPOINT, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: actionType }) // Send action type
            });
        } catch (error) {
            // Silently fail is okay for traffic logging
            console.error(`Failed to log traffic action (${actionType}):`, error);
        }
    };
    
    // Original function now only logs the initial page view
    const logTraffic = async () => {
        try {
            await fetch(API_LOG_TRAFFIC_ENDPOINT, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'page_view' })
             });
        } catch (error) {
            console.error('Failed to log initial traffic:', error);
        }
    };

    const fetchWithAuth = async (url, options = {}) => {
        const token = localStorage.getItem('jwt_token');
        const headers = {
            ...options.headers,
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, { ...options, headers });

        // ===== START: TOKEN EXPIRATION HANDLING =====
        if (response.status === 401 || response.status === 403) {
            // Token is invalid/expired
            Notify.warning('เซสชันหมดอายุ', 'กรุณาล็อกอินใหม่อีกครั้ง');
            logout(); // This function already exists and handles cleanup
            throw new Error('Invalid or expired token.'); // Stop further execution
        }
        // ===== END: TOKEN EXPIRATION HANDLING =====

        return response;
    };


    const showSaveFeedback = (buttonElement) => {
        if (!buttonElement) return;
        const originalText = buttonElement.textContent;
        const lang = appData.shopSettings.language;
        buttonElement.textContent = translations[lang].saveSuccessMessage;
        buttonElement.disabled = true;
        setTimeout(() => {
            buttonElement.textContent = originalText;
            buttonElement.disabled = false;
        }, 1500);
    };

    // ===== START: Price Tag Bug Fix (loadCustomerData) =====
    const loadCustomerData = async () => {
        try {
            const response = await fetch(API_CUSTOMER_DATA_ENDPOINT);
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);

            const customerData = await response.json();

            appData.categories = customerData.categories || [];
            appData.allProducts = customerData.products || [];

            if (customerData.shopSettings) {
                // ใช้ deepMerge แทน Object.assign เพื่อป้องกันการเขียนทับข้อมูล default
                mergeDeep(appData.shopSettings, customerData.shopSettings);
            }

        } catch (error) {
            console.error('Failed to load public data from the database:', error);
        }
    };
    // ===== END: Price Tag Bug Fix (loadCustomerData) =====


    const loadAdminData = async () => {
        try {
            const adminDataResponse = await fetchWithAuth(API_GET_ADMIN_DATA_ENDPOINT);
            
            if (!adminDataResponse.ok) {
                 throw new Error(`Network response for admin data was not ok: ${adminDataResponse.statusText}`);
            }
            const adminData = await adminDataResponse.json();

            // This mergeDeep is already correct
            mergeDeep(appData, adminData);
            
            appData.analytics.dailyTraffic = appData.analytics.dailyTraffic || Array(7).fill(0);
            appData.analytics.hourlyTraffic = appData.analytics.hourlyTraffic || Array(24).fill(0);


            appData.analytics.orders = appData.analytics.orders || [];
            appData.analytics.logs = appData.analytics.logs || [];
            appData.subAdmins = appData.subAdmins || [];

        } catch (error) {
            console.error('Failed to load admin state from the database:', error);
        }
    };


    const saveState = async () => {
        try {
            // Create a deep copy to avoid modifying the original appData object
            const dataToSave = JSON.parse(JSON.stringify({
                shopSettings: appData.shopSettings,
                subAdmins: appData.subAdmins,
                adminPin: appData.adminPin,
                analytics: appData.analytics,
            }));
            
            // Remove sensitive data before saving
            if(dataToSave.adminPin) {
                delete dataToSave.adminPin;
            }
             if(dataToSave.subAdmins) {
                dataToSave.subAdmins.forEach(sa => {
                    if (sa.pin) delete sa.pin;
                });
            }


            const response = await fetchWithAuth(API_SAVE_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify(dataToSave),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Network response was not ok: ${response.statusText}`);
            }

        } catch (error) {
            console.error('Failed to save state to the database:', error);
            if (error.message !== 'Invalid or expired token.') {
                Notify.error('Error', 'Error saving data: ' + error.message);
            }
        }
    };

    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const views = {
        customer: document.getElementById('customer-view'),
        adminLogin: document.getElementById('admin-login-view'),
        adminPanel: document.getElementById('admin-panel-view'),
    };
    const shopNameDisplay = document.getElementById('shop-name-display');
    const shopLogoDisplay = document.getElementById('shop-logo-display');
    const headerTitleContainer = document.getElementById('header-title-container');
    const sloganElement = document.getElementById('slogan');
    const categoryTabsContainer = document.getElementById('category-tabs-container');
    const categoryTabs = document.getElementById('category-tabs');
    const productGrid = document.getElementById('product-grid');
    const currentCategoryName = document.getElementById('current-category-name');
    const orderValidationMsg = document.getElementById('order-validation-message');
    const confirmOrderBtn = document.getElementById('confirm-order-btn');
    const viewOrderBtn = document.getElementById('view-order-btn');
    const orderModal = document.getElementById('order-modal');
    const cartModal = document.getElementById('cart-modal');
    const orderDetails = document.getElementById('order-details');
    const cartDetails = document.getElementById('cart-details');
    const searchBox = document.getElementById('search-box');
    const backToAdminBtn = document.getElementById('back-to-admin-btn');
    const adminGearIcon = document.getElementById('admin-gear-icon');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const adminMenuContainer = document.querySelector('.admin-menu');
    const copyrightFooter = document.getElementById('copyright-footer');
    const festivalCanvas = document.getElementById('festival-canvas');
    const festivalCtx = festivalCanvas.getContext('2d');
    const floatingButtonsContainer = document.querySelector('.floating-buttons-container');
    const productControlsWrapper = document.getElementById('product-controls-wrapper');
    
    // ===== START: NEW VARIABLE FOR COUNTDOWNS =====
    let countdownIntervals = {};
    // ===== END: NEW VARIABLE FOR COUNTDOWNS =====


    let activeAdminMenu = 'dashboard';
    let activeAdminSubMenus = { 
        admin: 'shop-info', 
        stock: 'categories', 
        'order-number': 'confirm-orders', 
        'manage-account': 'accounts', 
        festival: 'announcement-message', 
        dashboard: 'dashboard-overview'
    };
    let activeEffectsSubMenu = 'seasonal';
    let activeCategoryId = null;
    let adminActiveCategoryId = null;
    let editingProductId = null;
    let editingCategoryId = null;
    let editingSubAdminId = null;
    let editingPromoId = null;
    let reorderMenuContext = 'main';
    let isAdminLoggedIn = false;
    let isStoreOwnerLoggedIn = false;
    let currentStoreSession = null;
    let loggedInUser = null;
    let currentAppliedPromo = null;
    let currentSortOrder = 'level_asc';

    let dailyTrafficChart, productSalesChart, categorySalesChart;
    // Advanced Dashboard Charts
    let salesPeriodChart, popularCategoriesChart, top10ProductsChart, bottom3ProductsChart;
    let repeatProductsChart, busiestDaysChart, peakHoursChart;
    const datePicker = document.getElementById('date-picker');
    let orderDatePicker, logDatePicker, fp;
    let selectedDate = new Date().toISOString().slice(0, 10);
    let currentPositionElement = 'icon';
    let dashboardRefreshInterval = null; // <-- สถิติ Real-time: เพิ่มตัวแปรสำหรับ Interval

    const setLanguage = (lang) => {
        appData.shopSettings.language = lang;
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.dataset.translateKey;
            const translation = translations[lang][key];
            if (translation) {
                if (el.placeholder !== undefined && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
                    el.placeholder = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });

        if(views.customer.classList.contains('active')) {
            renderCategoryTabs();
            renderProducts(searchBox.value.trim());
        }
        if(views.adminPanel.classList.contains('active')) {
            renderAdminPanel();
        }
    };

    langToggleBtn.addEventListener('click', () => {
        const newLang = appData.shopSettings.language === 'th' ? 'en' : 'th';
        setLanguage(newLang);
        if (isAdminLoggedIn) {
            saveState();
        }
    });

    const applyBackground = () => {
        const bgOverlay = document.getElementById('background-overlay');
        const activeTheme = appData.shopSettings.effects.seasonal.activeTheme;
        const seasonalBg = SEASONAL_THEMES[activeTheme]?.background;

        if (appData.shopSettings.effects.seasonal[activeTheme]?.enabled && seasonalBg) {
             bgOverlay.style.backgroundImage = seasonalBg;
             bgOverlay.style.opacity = 1;
             bgOverlay.style.filter = 'none';
        } else if (appData.shopSettings.backgroundImage) {
            bgOverlay.style.backgroundImage = `url(${appData.shopSettings.backgroundImage})`;
            bgOverlay.style.opacity = appData.shopSettings.backgroundOpacity;
            bgOverlay.style.filter = `blur(${appData.shopSettings.backgroundBlur}px)`;
        } else {
            bgOverlay.style.backgroundImage = 'none';
            bgOverlay.style.opacity = 1;
            bgOverlay.style.filter = 'none';
        }
    };

    const applySystemTheme = () => {
        const root = document.documentElement;
        const activeSeasonalTheme = appData.shopSettings.effects.seasonal.activeTheme;
        const isSeasonalThemeActive = appData.shopSettings.effects.seasonal[activeSeasonalTheme]?.enabled;

        const baseThemeName = appData.shopSettings.themeName;
        // ===== START: Theme Update (Handle missing theme) =====
        // Fallback to 'default' if the saved themeName no longer exists in the (new) list
        const theme = THEME_PRESETS[baseThemeName] || THEME_PRESETS['default'];
        if (theme) {
            // If the themeName was invalid, reset it to default
            if (!THEME_PRESETS[baseThemeName]) {
                appData.shopSettings.themeName = 'default';
            }
        // ===== END: Theme Update =====
            root.style.setProperty('--primary-color', theme.colors.primary);
            root.style.setProperty('--secondary-color', theme.colors.secondary);
            root.style.setProperty('--info-color', theme.colors.info);
            const rgb = getComputedStyle(root).getPropertyValue('--primary-color').match(/\d+/g);
            if(rgb) root.style.setProperty('--primary-color-rgb', `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`);
        }

        document.body.className = '';
        if (isSeasonalThemeActive && activeSeasonalTheme && activeSeasonalTheme !== 'none') {
            document.body.classList.add('seasonal-theme-active', `theme-${activeSeasonalTheme}`);
        }

        if (appData.shopSettings.darkMode) {
            document.body.classList.add('dark-mode');
        }
    };

    const applyGridLayoutSettings = () => {
        const root = document.documentElement;
        const settings = appData.shopSettings.gridLayoutSettings;

        let columns = settings.columns;
        if (window.innerWidth < 576) {
        } else if (window.innerWidth < 768) {
            if (columns > 8) columns = 8;
        }

        root.style.setProperty('--grid-columns', columns);

        root.style.setProperty('--card-width', `${settings.cardWidth}%`);
        root.style.setProperty('--card-height', `${settings.cardHeight}%`);
        root.style.setProperty('--grid-horizontal-gap', `${settings.horizontalGap || 20}px`);
        root.style.setProperty('--grid-vertical-gap', `${settings.verticalGap || 20}px`);

        const baseMultiplier = (settings.cardFontSize || 100) / 100;
        root.style.setProperty('--card-font-size-multiplier', baseMultiplier);

        root.style.setProperty('--card-level-font-size', `calc(${(settings.levelFontSize || 100) / 100} * 0.8rem * var(--card-font-size-multiplier))`);
        root.style.setProperty('--card-name-font-size', `calc(${(settings.nameFontSize || 100) / 100} * 0.9rem * var(--card-font-size-multiplier))`);
        root.style.setProperty('--card-quantity-font-size', `calc(${(settings.quantityFontSize || 100) / 100} * 1.1rem * var(--card-font-size-multiplier))`);

        root.style.setProperty('--card-icon-size', `${settings.iconSize || 60}%`);

        root.style.setProperty('--card-level-color', settings.levelColor);
        root.style.setProperty('--card-name-color', settings.nameColor);
        root.style.setProperty('--card-quantity-color', settings.quantityColor);

        root.style.setProperty('--card-icon-offset-x', `${settings.iconOffsetX || 0}px`);
        root.style.setProperty('--card-icon-offset-y', `${settings.iconOffsetY || -15}px`);
        root.style.setProperty('--card-level-offset-x', `${settings.levelOffsetX || 0}px`);
        root.style.setProperty('--card-level-offset-y', `${settings.levelOffsetY || 0}px`);
        root.style.setProperty('--card-name-offset-x', `${settings.nameOffsetX || 0}px`);
        root.style.setProperty('--card-name-offset-y', `${settings.nameOffsetY || 0}px`);
        root.style.setProperty('--card-quantity-offset-x', `${settings.quantityOffsetX || 0}px`);
        root.style.setProperty('--card-quantity-offset-y', `${settings.quantityOffsetY || 0}px`);
    };

    const applyOutOfStockStyles = () => {
        const root = document.documentElement;
        const settings = appData.shopSettings.messageSettings;
        const baseSize = 1; // 1rem
        const finalSize = baseSize * ((settings.outOfStockFontSize || 100) / 100);
        root.style.setProperty('--out-of-stock-font-size', `${finalSize}rem`);
    };

    // New function to apply order bar settings from CSS variables
    const applyOrderBarSettings = () => {
        const root = document.documentElement;
        const settings = appData.shopSettings.orderBarSettings;

        // Convert slider values (50-150) to a multiplier (0.5-1.5)
        const heightMultiplier = settings.height / 100;
        const buttonWidthMultiplier = settings.buttonWidth / 100;
        const buttonHeightMultiplier = settings.buttonHeight / 100;
        const fontSizeMultiplier = settings.fontSize / 100;
        const detailsFontSizeMultiplier = (settings.detailsFontSize || 100) / 100;
        const warningFontSizeMultiplier = (settings.warningFontSize || 100) / 100;
        const totalFontSizeMultiplier = (settings.totalFontSize || 100) / 100;

        // Apply to CSS variables used in style.css
        root.style.setProperty('--order-bar-height-multiplier', heightMultiplier);
        root.style.setProperty('--order-bar-button-width-multiplier', buttonWidthMultiplier);
        root.style.setProperty('--order-bar-button-height-multiplier', buttonHeightMultiplier);
        root.style.setProperty('--order-bar-font-size-multiplier', fontSizeMultiplier);
        root.style.setProperty('--order-bar-warning-font-size-multiplier', warningFontSizeMultiplier);
        root.style.setProperty('--order-bar-total-font-size-multiplier', totalFontSizeMultiplier);
        
        // Apply font size to modals directly as they are not part of the bar
        orderDetails.style.fontSize = `calc(1rem * ${detailsFontSizeMultiplier})`;
        cartDetails.style.fontSize = `calc(1rem * ${detailsFontSizeMultiplier})`;

        // ===== START: Order Bar Position Update =====
        const orderSummaryEl = document.getElementById('order-summary');
        if (orderSummaryEl) {
            orderSummaryEl.dataset.layout = settings.orderBarPosition || 'summary-top';
        }
        // ===== END: Order Bar Position Update =====
    };

    const applyTheme = (isPreview = false) => {
        const root = document.documentElement;

        applySystemTheme();
        applyGridLayoutSettings();
        applyOutOfStockStyles();
        applyOrderBarSettings(); // Apply new settings

        if (appData.shopSettings.darkMode) {
            document.body.classList.add('dark-mode');
            themeToggleBtn.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-mode');
            themeToggleBtn.textContent = '🌙';
        }

        const calculateFontSize = (base, percentage) => base * (percentage / 50);

        root.style.setProperty('--global-font-size', `${calculateFontSize(16, appData.shopSettings.globalFontSize)}px`);
        root.style.setProperty('--main-menu-font-size', `${calculateFontSize(0.9, appData.shopSettings.mainMenuFontSize)}rem`);
        root.style.setProperty('--sub-menu-font-size', `${calculateFontSize(1, appData.shopSettings.subMenuFontSize)}rem`);

        root.style.setProperty('--global-font', appData.shopSettings.globalFontFamily);
        root.style.setProperty('--shop-name-font-size', `${appData.shopSettings.shopNameFontSize}rem`);
        root.style.setProperty('--slogan-font-size', `${appData.shopSettings.sloganFontSize}rem`);

        shopNameDisplay.style.fontFamily = appData.shopSettings.fontFamily;
        shopNameDisplay.textContent = appData.shopSettings.shopName;
        shopNameDisplay.style.color = appData.shopSettings.shopNameColor;
        sloganElement.textContent = appData.shopSettings.slogan;
        sloganElement.style.color = appData.shopSettings.sloganColor;

        const nameEffect = appData.shopSettings.shopNameEffect;
        shopNameDisplay.style.textShadow = nameEffect.enabled ? `${nameEffect.offsetX}px ${nameEffect.offsetY}px ${nameEffect.blur}px ${nameEffect.color}` : '1px 1px 2px rgba(0,0,0,0.1)';

        const sloganEffect = appData.shopSettings.sloganEffect;
        sloganElement.style.textShadow = sloganEffect.enabled ? `${sloganEffect.offsetX}px ${sloganEffect.offsetY}px ${sloganEffect.blur}px ${sloganEffect.color}` : 'none';
        sloganElement.style.fontFamily = appData.shopSettings.sloganFontFamily;

        const logoEffect = appData.shopSettings.logoEffect;
        shopLogoDisplay.style.filter = logoEffect.enabled ? `drop-shadow(${logoEffect.offsetX}px ${logoEffect.offsetY}px ${logoEffect.blur}px ${logoEffect.color})` : 'none';

        if (appData.shopSettings.useLogo && appData.shopSettings.logo) {
            shopLogoDisplay.src = appData.shopSettings.logo;
            shopLogoDisplay.style.display = 'block';
            shopNameDisplay.style.display = 'none';
        } else {
            shopLogoDisplay.style.display = 'none';
            shopNameDisplay.style.display = 'block';
        }

        copyrightFooter.textContent = appData.shopSettings.copyrightText;
        copyrightFooter.style.opacity = appData.shopSettings.copyrightOpacity;

        if (!isPreview) {
            applyBackground();
        }
        updateMarquees();
        setLanguage(appData.shopSettings.language);
        initMainEffects();
    };

    themeToggleBtn.addEventListener('click', async (e) => {
        appData.shopSettings.darkMode = !appData.shopSettings.darkMode;
        applyTheme();
        if (isAdminLoggedIn) {
            addLog('Toggled Dark Mode', `Set to ${appData.shopSettings.darkMode}`);
            await saveState();
        }
    });

    // ===== START: Festival Marquee Fix =====
    const updateMarquees = () => {
        const { shopEnabled, announcementEnabled, shopClosedMessageText, announcementMessageText, messageSettings } = appData.shopSettings;
        const closedMarquee = document.getElementById('shop-closed-marquee');
        const announcementMarquee = document.getElementById('announcement-marquee');
        const closedMarqueeContent = document.getElementById('shop-closed-marquee-content');
        const announcementMarqueeContent = document.getElementById('announcement-marquee-content');
        const closedTextEl = document.getElementById('marquee-text');
        const announcementTextEl = document.getElementById('announcement-text');

        const applyStyles = (textEl, contentEl) => {
            textEl.style.color = messageSettings.color;
            textEl.style.fontSize = `${messageSettings.size}px`;
            const effect = messageSettings.effect;
            textEl.style.textShadow = effect.enabled ? `${effect.offsetX}px ${effect.offsetY}px ${effect.blur}px ${effect.color}` : 'none';
            document.documentElement.style.setProperty('--marquee-duration', `${messageSettings.speed}s`);
            contentEl.className = `marquee-content-wrapper ${messageSettings.frameStyle || 'style-1'}`;

            // Apply width and height settings directly to the wrapper
            // This ensures the width is fixed based on admin settings and not affected by other style changes
            contentEl.style.width = `${messageSettings.previewWidth || 50}%`;
            contentEl.style.minHeight = `${messageSettings.previewHeight || 'auto'}%`; // Use min-height for flexibility
        };

        if (!shopEnabled) {
            closedTextEl.textContent = shopClosedMessageText;
            applyStyles(closedTextEl, closedMarqueeContent);
            closedMarquee.style.display = 'block';
        } else {
            closedMarquee.style.display = 'none';
        }

        if (shopEnabled && announcementEnabled) {
            announcementTextEl.textContent = announcementMessageText;
            applyStyles(announcementTextEl, announcementMarqueeContent);
            announcementMarquee.style.display = 'block';
        } else {
            announcementMarquee.style.display = 'none';
        }
    };
    // ===== END: Festival Marquee Fix =====

    const isCustomerViewOnly = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('customer') === 'true';
    };

    const renderCustomerView = () => {
        applyTheme();
        adminGearIcon.style.display = isAdminLoggedIn || isCustomerViewOnly() ? 'none' : 'flex';
        backToAdminBtn.style.display = isAdminLoggedIn ? 'flex' : 'none';
        themeToggleBtn.style.display = 'flex';
        langToggleBtn.style.display = 'flex';

        renderCategoryTabs();
        checkOrderValidation();
    };

    const renderCategoryTabs = () => {
        categoryTabs.innerHTML = '';
        const lang = appData.shopSettings.language;
        appData.categories.forEach(cat => {
            const tab = document.createElement('div');
            const catName = (lang === 'en' && cat.name_en) ? cat.name_en : cat.name;
            tab.className = `tab ${cat.id === activeCategoryId ? 'active' : ''}`;
            tab.dataset.id = cat.id;
            tab.innerHTML = `${cat.icon ? `<img src="${cat.icon}" alt="${catName}">` : ''}<span>${catName}</span>`;

            tab.addEventListener('click', () => {
                logTrafficAction('category_click'); // <-- สถิติ Real-time: เพิ่มการติดตามคลิกหมวดหมู่
                activeCategoryId = cat.id;
                localStorage.setItem('warishayday_activeCategoryId', activeCategoryId);
                searchBox.value = '';
                currentSortOrder = 'level_asc';
                document.querySelectorAll('#category-tabs .tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                loadProductsForCategory(activeCategoryId);
            });
            categoryTabs.appendChild(tab);
        });
    };

    const loadProductsForCategory = (categoryId) => {
        const lang = appData.shopSettings.language;
        const activeCategory = appData.categories.find(c => c.id === categoryId);

        if (!activeCategory) {
            productGrid.innerHTML = `<p style="text-align:center; grid-column: 1 / -1;">${translations[lang].selectCategoryPrompt}</p>`;
            currentCategoryName.textContent = '';
            return;
        }

        currentCategoryName.textContent = (lang === 'en' && activeCategory.name_en) ? activeCategory.name_en : activeCategory.name;

        appData.products = appData.allProducts.filter(p => p.category_id === categoryId);

        renderProducts();
    };

    const renderProducts = (searchTerm = '') => {
        productGrid.innerHTML = '';
        let productsToDisplay = appData.products.filter(p => !p.hidden); // กรองสินค้าที่ซ่อนอยู่ออก
        const lang = appData.shopSettings.language;
        const isShopClosed = !appData.shopSettings.shopEnabled;
        const gridSettings = appData.shopSettings.gridLayoutSettings;

        if (searchTerm) {
            productsToDisplay = appData.allProducts.filter(p => {
                const prodName = (lang === 'en' && p.name_en) ? p.name_en : p.name;
                return !p.hidden && prodName.toLowerCase().includes(searchTerm.toLowerCase());
            });
            const activeCategory = appData.categories.find(c => c.id === activeCategoryId);
            if(activeCategory){
                const catName = (lang === 'en' && activeCategory.name_en) ? activeCategory.name_en : activeCategory.name;
                currentCategoryName.textContent = `${catName} (${lang === 'th' ? 'ผลการค้นหาสำหรับ' : 'Search results for'}: "${searchTerm}")`;
            }
        } else {
             const activeCategory = appData.categories.find(c => c.id === activeCategoryId);
            if (activeCategory) {
                 currentCategoryName.textContent = (lang === 'en' && activeCategory.name_en) ? activeCategory.name_en : activeCategory.name;
            }
        }

        const collator = new Intl.Collator(lang === 'th' ? 'th-TH' : 'en-US');
        productsToDisplay.sort((a, b) => {
            const nameA = (lang === 'en' && a.name_en) ? a.name_en : a.name;
            const nameB = (lang === 'en' && b.name_en) ? b.name_en : b.name;

            switch (currentSortOrder) {
                case 'level_desc':
                    return b.level - a.level;
                case 'level_asc':
                    return a.level - b.level;
                case 'name_th':
                    return collator.compare(a.name, b.name);
                case 'name_en':
                    return collator.compare(a.name_en || a.name, b.name_en || b.name);
                default:
                    return a.level - b.level;
            }
        });

        if (productsToDisplay.length === 0) {
             productGrid.innerHTML = `<p style="text-align:center; grid-column: 1 / -1;">${lang === 'th' ? 'ไม่พบสินค้า' : 'No products found'}</p>`;
        } else {
            productsToDisplay.forEach(prod => {
                const quantity = appData.cart[prod.id] || 0;
                const isPhysicallyOutOfStock = prod.stock !== -1 && prod.stock <= 0;
                const isUnavailableByAdmin = !prod.is_available;
                const prodName = (lang === 'en' && prod.name_en) ? prod.name_en : prod.name;

                const card = document.createElement('div');
                card.className = `product-card ${gridSettings.frameStyle}`;
                if (isShopClosed || isUnavailableByAdmin || isPhysicallyOutOfStock) {
                    card.classList.add('unavailable');
                }
                card.dataset.id = prod.id;

                let outOfStockHTML = '';
                if (isUnavailableByAdmin) {
                    const customMessage = prod.unavailable_message;
                    const defaultMessage = appData.shopSettings.messageSettings.outOfStockText || translations[lang].outOfStockTemporarily;
                    const messageToShow = (customMessage && customMessage.trim() !== '' && customMessage.trim().toLowerCase() !== 'undefined')
                        ? customMessage
                        : defaultMessage;
                    outOfStockHTML = `<div class="product-card-out-of-stock">${messageToShow}</div>`;
                } else if (isPhysicallyOutOfStock && !isShopClosed) {
                    const text = appData.shopSettings.messageSettings.outOfStockText || translations[lang].outOfStockTemporarily;
                    outOfStockHTML = `<div class="product-card-out-of-stock">${text}</div>`;
                }

                card.innerHTML = `
                    <span class="product-card-level">LV ${prod.level}</span>
                    <img src="${prod.icon || 'https://placehold.co/100x100/e0e0e0/757575?text=?'}" alt="${prodName}" class="product-card-icon">
                    <span class="product-card-name">${prodName}</span>
                    <div class="product-card-controls">
                        <span class="product-card-quantity">${quantity}</span>
                    </div>
                    ${outOfStockHTML}
                `;
                productGrid.appendChild(card);
            });
        }
    };

    productGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (!card || card.classList.contains('unavailable')) return;

        const productId = parseInt(card.dataset.id);
        const product = appData.allProducts.find(p => p.id === productId);
        const category = appData.categories.find(c => c.id === product?.category_id);
        const maxOrder = category?.max_order_quantity;

        let operation = 0;

        if (e.target.classList.contains('product-card-icon')) {
            logTrafficAction('product_click'); // <-- สถิติ Real-time: เพิ่มการติดตามคลิกสินค้า
            operation = appData.shopSettings.salesMode === 'tens' ? 10 : 1;
        }

        if (operation !== 0) {
            let currentQuantity = appData.cart[productId] || 0;
            let newQuantity = Math.max(0, currentQuantity + operation);

            if (maxOrder && maxOrder > 0 && newQuantity > maxOrder) {
                newQuantity = maxOrder;
                 Notify.warning('ถึงจำนวนสูงสุด', `สั่งซื้อได้สูงสุด ${maxOrder} ชิ้นสำหรับหมวดหมู่นี้`);
            }

            if (newQuantity === 0) {
                delete appData.cart[productId];
            } else {
                appData.cart[productId] = newQuantity;
            }

            localStorage.setItem('warishayday_cart', JSON.stringify(appData.cart));

            renderProducts(searchBox.value.trim());
            checkOrderValidation();
        }
    });

    searchBox.addEventListener('input', (e) => {
        renderProducts(e.target.value.trim());
    });

    const calculatePrice = (categoryId, quantity) => {
        const category = appData.categories.find(c => c.id === categoryId);
        if (!category) return { price: 0, type: 'ไม่มีราคา' };
    
        const perPiecePrices = category.per_piece_prices || category.perPiecePrices || [];
        if (perPiecePrices.length > 0) {
            // New logic for 'pieces' sales mode
            if (appData.shopSettings.salesMode === 'pieces') {
                const exactPrice = perPiecePrices.find(p => p.quantity === quantity);
                if (exactPrice) {
                    return { price: exactPrice.price, type: 'ราคาต่อชิ้น (ตรง)' };
                }
                // Fallback for 'pieces' mode if no exact match is found
                // Tries to find the best price block, but this might need refinement based on business logic
            }
    
            // Original logic for 'tens' sales mode (and fallback for 'pieces')
            const sortedPerPiecePrices = [...perPiecePrices].sort((a, b) => b.quantity - a.quantity);
            let remainingQuantity = quantity;
            let totalPrice = 0;
    
            for (const priceItem of sortedPerPiecePrices) {
                if (remainingQuantity >= priceItem.quantity && priceItem.price > 0) {
                    const numBlocks = Math.floor(remainingQuantity / priceItem.quantity);
                    totalPrice += numBlocks * priceItem.price;
                    remainingQuantity %= priceItem.quantity;
                }
            }
            if (totalPrice > 0 || quantity === 0) {
                 return { price: totalPrice, type: 'ราคาต่อชิ้น' };
            }
        }
        return { price: 0, type: 'ไม่ได้ตั้งราคา' };
    };

    const checkOrderValidation = () => {
        let minOrderMessages = [], maxOrderMessages = [];
        const itemsByCategory = {};
        const lang = appData.shopSettings.language;
        const isShopClosed = !appData.shopSettings.shopEnabled;

        for (const productId in appData.cart) {
            const quantity = appData.cart[productId];
            if (quantity > 0) {
                const product = appData.allProducts.find(p => p.id == productId);
                if (product) {
                    if (!itemsByCategory[product.category_id]) itemsByCategory[product.category_id] = { total: 0, items: [] };
                    itemsByCategory[product.category_id].total += quantity;
                }
            }
        }

        let grandTotalPrice = 0;
        const sortedCategoryIds = Object.keys(itemsByCategory).sort((a,b) => (appData.categories.find(c=>c.id==a)?.sort_order || 99) - (appData.categories.find(c=>c.id==b)?.sort_order || 99));

        for (const categoryId of sortedCategoryIds) {
            const total = itemsByCategory[categoryId].total;
            const category = appData.categories.find(c => c.id == categoryId);
            if (!category) continue;

            const minOrder = category.min_order_quantity || 30;
            const maxOrder = category.max_order_quantity;
            const catName = (lang === 'en' && category.name_en) ? category.name_en : category.name;

            if (total > 0 && total < minOrder) {
                const message = lang === 'th'
                    ? `➡️ หมวด "${catName}" ขั้นต่ำ ${minOrder} ชิ้น (ขาด ${minOrder - total} ชิ้น)`
                    : `➡️ Category "${catName}" requires a minimum of ${minOrder} items (short by ${minOrder - total})`;
                minOrderMessages.push(`<div class="validation-link" data-cat-id="${categoryId}">${message}</div>`);
            }
            if (maxOrder && total > maxOrder) {
                const message = lang === 'th'
                    ? `➡️ หมวด "${catName}" สูงสุด ${maxOrder} ชิ้น (เกิน ${total - maxOrder} ชิ้น)`
                    : `➡️ Category "${catName}" allows a maximum of ${maxOrder} items (over by ${total - maxOrder})`;
                maxOrderMessages.push(`<div class="validation-link" data-cat-id="${categoryId}">${message}</div>`);
            }

            const priceResult = calculatePrice(parseInt(categoryId), total);
            grandTotalPrice += priceResult.price;
        }

        let discountAmount = 0;
        let finalTotal = grandTotalPrice;
        if (currentAppliedPromo) {
            discountAmount = grandTotalPrice * (currentAppliedPromo.discount / 100);
            finalTotal = grandTotalPrice - discountAmount;
        }

        const canOrder = minOrderMessages.length === 0 && maxOrderMessages.length === 0 && grandTotalPrice > 0 && !isShopClosed;
        confirmOrderBtn.disabled = !canOrder;
        viewOrderBtn.disabled = isShopClosed || Object.keys(appData.cart).length === 0;

        const allMessages = [...minOrderMessages, ...maxOrderMessages];
        if (allMessages.length > 0) {
            orderValidationMsg.innerHTML = allMessages.join('');
        } else {
            if (grandTotalPrice > 0) {
                let summaryHTML = `<span class="grand-total">${translations[lang].grandTotalLabel}: ${finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2})} ${lang === 'th' ? 'บาท' : 'THB'}</span>`;
                orderValidationMsg.innerHTML = summaryHTML;
            } else {
                orderValidationMsg.textContent = '';
            }
        }
    };

    orderValidationMsg.addEventListener('click', (e) => {
        const link = e.target.closest('.validation-link');
        if (link) {
            activeCategoryId = parseInt(link.dataset.catId);
            localStorage.setItem('warishayday_activeCategoryId', activeCategoryId);
            document.querySelectorAll('#category-tabs .tab').forEach(t => t.classList.remove('active'));
            const tab = document.querySelector(`.tab[data-id="${activeCategoryId}"]`);
            if(tab) tab.classList.add('active');
            loadProductsForCategory(activeCategoryId);
        }
    });

    const createConfirmOrderSummary = (orderNumber) => {
        const lang = appData.shopSettings.language;
        const currencySuffix = lang === 'th' ? 'บาท' : 'THB';
        let summaryText = "";
        
        const itemsByCategory = {};
        for (const productId in appData.cart) {
            const quantity = appData.cart[productId];
            if (quantity > 0) {
                const product = appData.allProducts.find(p => p.id == productId);
                if (product) {
                    if (!itemsByCategory[product.category_id]) {
                        itemsByCategory[product.category_id] = {
                            items: [],
                            name: appData.categories.find(c => c.id === product.category_id)?.name || 'Unknown',
                            name_en: appData.categories.find(c => c.id === product.category_id)?.name_en || 'Unknown'
                        };
                    }
                    itemsByCategory[product.category_id].items.push({ ...product, quantity });
                }
            }
        }
    
        summaryText += `${appData.shopSettings.shopName}\n`;
        if (orderNumber) {
            summaryText += `${lang === 'th' ? 'เลขที่ออเดอร์' : 'Order No.'}: ${orderNumber}\n`;
        }
        summaryText += '-----------------------------------\n';
    
        Object.keys(itemsByCategory).forEach(catId => {
            const categoryData = itemsByCategory[catId];
            const catName = (lang === 'en' && categoryData.name_en) ? categoryData.name_en : categoryData.name;
            summaryText += `\n📋 ${catName}\n`;
            
            categoryData.items.sort((a, b) => a.level - b.level);
            
            categoryData.items.forEach(item => {
                const prodName = (lang === 'en' && item.name_en) ? item.name_en : item.name;
                summaryText += `LV${item.level} ${prodName} x ${item.quantity}\n`;
            });
        });
    
        summaryText += '-----------------------------------\n';
    
        let grandTotalPrice = 0;
        let totalAllItems = 0;
        
        for (const catId in itemsByCategory) {
            const categoryData = itemsByCategory[catId];
            const catName = (lang === 'en' && categoryData.name_en) ? categoryData.name_en : categoryData.name;
            const totalQuantity = categoryData.items.reduce((sum, item) => sum + item.quantity, 0);
            summaryText += `${catName}: ${totalQuantity} ${lang === 'th' ? 'ชิ้น' : 'pcs'}\n`;
            totalAllItems += totalQuantity;
            
            const priceResult = calculatePrice(parseInt(catId), totalQuantity);
            grandTotalPrice += priceResult.price;
        }
        summaryText += '\n';

        let finalTotal = grandTotalPrice;
        if (currentAppliedPromo) {
            const discountAmount = grandTotalPrice * (currentAppliedPromo.discount / 100);
            finalTotal = grandTotalPrice - discountAmount;
             summaryText += `${translations[lang].discountLabel} (${currentAppliedPromo.code}): -${discountAmount.toLocaleString(undefined, {minimumFractionDigits: 2})} ${currencySuffix}\n`;
        }
        
        summaryText += `${translations[lang].grandTotalLabel}: ${finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2})} ${currencySuffix}`;
    
        return summaryText;
    };

const renderViewOrderModal = () => {
        cartDetails.innerHTML = '';
        const lang = appData.shopSettings.language;
        const currencySuffix = lang === 'th' ? 'บาท' : 'THB';
    
        const shopNameHeader = document.createElement('h3');
        shopNameHeader.textContent = appData.shopSettings.shopName;
        shopNameHeader.style.textAlign = 'center';
        shopNameHeader.style.marginBottom = '15px';
        cartDetails.appendChild(shopNameHeader);
    
        const itemsByCategory = {};
        for (const productId in appData.cart) {
            const quantity = appData.cart[productId];
            if (quantity > 0) {
                const product = appData.allProducts.find(p => p.id == productId);
                if (product) {
                    if (!itemsByCategory[product.category_id]) {
                        const category = appData.categories.find(c => c.id === product.category_id);
                        itemsByCategory[product.category_id] = {
                            items: [],
                            name: category ? ((lang === 'en' && category.name_en) ? category.name_en : category.name) : 'Unknown',
                            sort_order: category ? category.sort_order : 999
                        };
                    }
                    itemsByCategory[product.category_id].items.push({ ...product, quantity });
                }
            }
        }
    
        if (Object.keys(itemsByCategory).length === 0) {
            cartDetails.innerHTML += `<p>${lang === 'th' ? 'ไม่มีสินค้าในรายการ' : 'No items in cart'}</p>`;
            return;
        }

        const sortedCategoryIds = Object.keys(itemsByCategory).sort((a,b) => itemsByCategory[a].sort_order - itemsByCategory[b].sort_order);

        sortedCategoryIds.forEach(catId => {
            const categoryData = itemsByCategory[catId];
            const categorySection = document.createElement('div');
            categorySection.className = 'order-summary-section';
            
            const categoryHeader = document.createElement('h4');
            categoryHeader.textContent = `📋 ${categoryData.name}`;
            categoryHeader.style.textAlign = 'left';
            categoryHeader.style.marginTop = '10px';
            categorySection.appendChild(categoryHeader);
            
            categoryData.items.sort((a, b) => a.level - b.level);
            
            categoryData.items.forEach(item => {
                const prodName = (lang === 'en' && item.name_en) ? item.name_en : item.name;
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                itemDiv.innerHTML = `
                    <div class="cart-item-info">
                        <span class="cart-item-name">LV${item.level} / ${prodName} / ${item.quantity}</span>
                    </div>
                     <div class="cart-item-controls">
                        <button class="btn btn-secondary btn-op btn-small" data-id="${item.id}" data-op="-${appData.shopSettings.salesMode === 'tens' ? 10 : 1}">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="btn btn-secondary btn-op btn-small" data-id="${item.id}" data-op="${appData.shopSettings.salesMode === 'tens' ? 10 : 1}">+</button>
                        <button class="btn-delete" data-id="${item.id}">🗑️</button>
                    </div>
                `;
                categorySection.appendChild(itemDiv);
            });
            
            const categoryTotalQuantity = categoryData.items.reduce((sum, item) => sum + item.quantity, 0);
            const priceResult = calculatePrice(parseInt(catId), categoryTotalQuantity);
            if(priceResult.price > 0) {
                 const categoryPriceDiv = document.createElement('div');
                 categoryPriceDiv.className = 'summary-line';
                 categoryPriceDiv.style.fontWeight = 'bold';
                 categoryPriceDiv.style.marginTop = '5px';
                 categoryPriceDiv.innerHTML = `<span>${lang === 'th' ? 'ราคารวม' : 'Subtotal'}:</span><span>${priceResult.price.toLocaleString()} ${currencySuffix}</span>`;
                 categorySection.appendChild(categoryPriceDiv);
            }

            cartDetails.appendChild(categorySection);
        });

        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'order-summary-section';
        summaryDiv.style.marginTop = '20px';
    
        let grandTotalPrice = 0;
        let totalAllItems = 0;

        summaryDiv.innerHTML += `<h4>${lang === 'th' ? 'สรุปจำนวน' : 'Quantity Summary'}</h4>`;
        sortedCategoryIds.forEach(catId => {
            const categoryData = itemsByCategory[catId];
            const totalQuantity = categoryData.items.reduce((sum, item) => sum + item.quantity, 0);
            summaryDiv.innerHTML += `<div class="summary-line"><span>${categoryData.name}:</span><span>${totalQuantity} ${lang === 'th' ? 'ชิ้น' : 'pcs'}</span></div>`;
            totalAllItems += totalQuantity;
            grandTotalPrice += calculatePrice(parseInt(catId), totalQuantity).price;
        });

        let finalTotal = grandTotalPrice;
        if (currentAppliedPromo) {
            const discountAmount = grandTotalPrice * (currentAppliedPromo.discount / 100);
            finalTotal = grandTotalPrice - discountAmount;
            summaryDiv.innerHTML += `<div class="summary-line" style="color: var(--danger-color);"><span>${translations[lang].discountLabel} (${currentAppliedPromo.code}):</span><span>-${discountAmount.toLocaleString(undefined, {minimumFractionDigits: 2})} ${currencySuffix}</span></div>`;
        }
        
        summaryDiv.innerHTML += `<div class="summary-line grand-total"><span>${translations[lang].grandTotalLabel}:</span><span>${finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2})} ${currencySuffix}</span></div>`;
    
        cartDetails.appendChild(summaryDiv);
    };

cartDetails.addEventListener('click', (e) => {
        const target = e.target;
        const productId = parseInt(target.closest('[data-id]')?.dataset.id);
        if (!productId) return;

        let currentQuantity = appData.cart[productId] || 0;
        let product = appData.allProducts.find(p => p.id === productId);
        let category = appData.categories.find(c => c.id === product?.category_id);
        const maxOrder = category?.max_order_quantity;

        if (target.classList.contains('btn-op')) {
            const operation = parseInt(target.dataset.op);
            let newQuantity = Math.max(0, currentQuantity + operation);

            if (maxOrder && maxOrder > 0 && newQuantity > maxOrder) {
                newQuantity = maxOrder;
                Notify.warning('ถึงจำนวนสูงสุด', `สั่งซื้อได้สูงสุด ${maxOrder} ชิ้นสำหรับหมวดหมู่นี้`);
            }

            if (newQuantity === 0) {
                delete appData.cart[productId];
            } else {
                appData.cart[productId] = newQuantity;
            }
        } else if (target.classList.contains('btn-delete')) {
            delete appData.cart[productId];
        }

        localStorage.setItem('warishayday_cart', JSON.stringify(appData.cart));
        renderViewOrderModal();
        checkOrderValidation();
        renderProducts(searchBox.value.trim());
    });

    const handleOrderAction = (isConfirm) => {
        if (isConfirm) {
            checkOrderValidation();
            if (confirmOrderBtn.disabled) return;
        }

        const promoContainer = document.getElementById('promo-code-container');
        if (appData.shopSettings.promotions && appData.shopSettings.promotions.length > 0) {
            promoContainer.style.display = 'block';
        } else {
            promoContainer.style.display = 'none';
        }

        if (isConfirm) {
            document.getElementById('order-modal-title').dataset.translateKey = "orderSummaryTitle";
            document.getElementById('order-modal-prompt').style.display = 'block';
            document.getElementById('copy-order-btn').style.display = 'inline-block';
            
            // ===== START: MODIFICATION (Order Number Fix) =====
            // We now generate the summary WITHOUT an order number first.
            // The order number will be generated ONLY when 'copy-order-btn' is clicked.
            orderDetails.textContent = createConfirmOrderSummary(); // <-- Pass no order number
            // orderDetails.dataset.orderNumber = orderNumber; // <-- REMOVED
            // ===== END: MODIFICATION =====
            
            orderModal.style.display = 'flex';
        } else {
            renderViewOrderModal();
            cartModal.style.display = 'flex';
        }
        setLanguage(appData.shopSettings.language);
    };

    confirmOrderBtn.addEventListener('click', () => handleOrderAction(true));
    viewOrderBtn.addEventListener('click', () => handleOrderAction(false));

    document.getElementById('apply-promo-btn').addEventListener('click', () => {
        const codeInput = document.getElementById('promo-code-input');
        const code = codeInput.value.trim().toUpperCase();
        const promo = appData.shopSettings.promotions.find(p => p.code.toUpperCase() === code);
        const lang = appData.shopSettings.language;

        if (promo) {
            currentAppliedPromo = promo;
            Notify.success(lang === 'th' ? 'ใช้โค้ดสำเร็จ!' : 'Code Applied!', lang === 'th' ? `ใช้โค้ด ${promo.code} ได้รับส่วนลด ${promo.discount}%` : `Code ${promo.code} - ${promo.discount}% discount`);
        } else {
            currentAppliedPromo = null;
            Notify.error(lang === 'th' ? 'โค้ดไม่ถูกต้อง' : 'Invalid Code', translations[lang].invalidPromoCode);
        }
        
        // ===== START: MODIFICATION (Order Number Fix) =====
        // Regenerate summary text without order number when promo is applied
        orderDetails.textContent = createConfirmOrderSummary();
        // ===== END: MODIFICATION =====
        checkOrderValidation();
    });

    document.getElementById('copy-order-btn').addEventListener('click', async () => {
        // const orderText = orderDetails.textContent; // <-- REMOVED (This text is incomplete)

        orderModal.style.display = 'none';
        showSuccessAnimation(document.getElementById('copy-success-modal').querySelector('.copy-success-content'));

        try {
            // ===== START: MODIFICATION (Order Number Fix) =====
            // Generate the order number *now* at the moment of copying.
            const orderNumber = generateOrderNumber();
            
            // Re-create the summary text, this time *with* the new order number.
            const orderText = createConfirmOrderSummary(orderNumber);
            
            // Copy the complete text to the clipboard.
            await navigator.clipboard.writeText(orderText);
            // ===== END: MODIFICATION =====


            const totalMatch = orderText.match(/ยอดรวมสุทธิ: ([\d,.]+) /) || orderText.match(/Grand Total: ([\d,.]+) /) || orderText.match(/ยอดรวม: ([\d,.]+) /) || orderText.match(/Total: ([\d,.]+) /);
            const totalOrderPrice = totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : 0;

            if (isNaN(totalOrderPrice) || totalOrderPrice < 0) {
                throw new Error("Invalid total price calculated.");
            }

            const newOrder = {
                // ===== MODIFICATION (Order Number Fix) =====
                id: orderNumber, // <-- Use the newly generated number
                // ===== END: MODIFICATION =====
                timestamp: new Date().toISOString(),
                total: totalOrderPrice,
                items: { ...appData.cart },
                status: 'new',
                promoApplied: currentAppliedPromo
            };

            const response = await fetch(API_ORDERS_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save the order to the database.');
            }

            // ===== START: MODIFICATION (Order Number Fix) =====
            // Save the incremented counter to the backend *after* the order is saved successfully.
            if (isAdminLoggedIn) {
                await saveState(); 
            }
            // ===== END: MODIFICATION =====

            if (appData.analytics && appData.analytics.productSales) {
                for (const prodId in appData.cart) {
                    const product = appData.allProducts.find(p => p.id == prodId);
                    if(product) {
                        const prodName = product.name;
                        appData.analytics.productSales[prodName] = (appData.analytics.productSales[prodName] || 0) + appData.cart[prodId];
                    }
                }
            }


            if (appData.analytics && appData.analytics.orders) {
                appData.analytics.orders.push(newOrder);
            }

            appData.cart = {};
            currentAppliedPromo = null;
            localStorage.removeItem('warishayday_cart');
            document.getElementById('promo-code-input').value = '';

            setTimeout(() => {
                document.getElementById('copy-success-modal').style.display = 'none';
                renderProducts();
                checkOrderValidation();
                if (isAdminLoggedIn) {
                    renderOrderNumberView(orderDatePicker ? orderDatePicker.selectedDates : []);
                }
            }, 2000);

        } catch (err) {
            console.error('Order processing failed: ', err);
            Notify.error('ผิดพลาด', 'เกิดข้อผิดพลาดในการบันทึกออเดอร์: ' + err.message);
            document.getElementById('copy-success-modal').style.display = 'none';
        }
    });

    document.getElementById('close-order-modal-btn').addEventListener('click', () => orderModal.style.display = 'none');
    document.getElementById('close-cart-modal-btn').addEventListener('click', () => cartModal.style.display = 'none');
    document.getElementById('reset-cart-btn').addEventListener('click', () => {
        const lang = appData.shopSettings.language;
        Notify.confirm(
            lang === 'th' ? 'ยืนยันการรีเซ็ท' : 'Confirm Reset',
            lang === 'th' ? 'คุณต้องการรีเซ็ทรายการสั่งซื้อทั้งหมดหรือไม่?' : 'Are you sure you want to reset your entire order?',
            (result) => {
                if (result) {
                    appData.cart = {};
                    currentAppliedPromo = null;
                    document.getElementById('promo-code-input').value = '';
                    localStorage.removeItem('warishayday_cart');
                    renderProducts();
                    checkOrderValidation();
                    Notify.success(lang === 'th' ? 'รีเซ็ทสำเร็จ' : 'Reset Complete', lang === 'th' ? 'รีเซ็ทรายการสั่งซื้อเรียบร้อยแล้ว!' : 'Order has been reset!');
                }
            }
        );
    });

    const switchView = (viewName) => {
        Object.values(views).forEach(v => v.classList.remove('active'));
        views[viewName].classList.add('active');
    };

    adminGearIcon.addEventListener('click', () => {
        if (!isAdminLoggedIn) {
            switchView('adminLogin');
            themeToggleBtn.style.display = 'none';
            langToggleBtn.style.display = 'none';
        }
    });

    document.getElementById('back-to-customer-view-btn').addEventListener('click', () => {
        switchView('customer');
        renderCustomerView();
    });

    document.getElementById('login-btn').addEventListener('click', async (e) => {
        e.preventDefault(); // ป้องกัน form submission ปกติ
        
        const usernameInput = document.getElementById('username-input');
        const passwordInput = document.getElementById('password-input');
        const loginError = document.getElementById('login-error');
        const loginBtn = document.getElementById('login-btn');
        
        // ลบข้อความ error เดิม
        loginError.textContent = '';
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // ตรวจสอบข้อมูลว่างเปล่า
        if (!username || !password) {
            const message = !username && !password ? 
                'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' : 
                !username ? 'กรุณากรอกชื่อผู้ใช้' : 
                'กรุณากรอกรหัสผ่าน';
            loginError.textContent = message;
            return;
        }

        try {
            console.log('กำลังส่งข้อมูลเข้าสู่ระบบ:', { username, endpoint: API_LOGIN_ENDPOINT });
            
            const response = await fetch(API_LOGIN_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: username, 
                    password: password 
                }),
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (!response.ok) {
                const errorMessage = data.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
                console.log('Login error:', errorMessage);
                loginError.textContent = errorMessage;
                return;
            }

            // ตรวจสอบประเภทผู้ใช้
            if (data.user.isStoreOwner) {
                // ร้านค้า
                isStoreOwnerLoggedIn = true;
                currentStoreSession = data.user;
                localStorage.setItem('store_token', data.token);
                localStorage.setItem('isStoreOwnerLoggedIn', 'true');
                localStorage.setItem('currentStoreSession', JSON.stringify(data.user));
                
                await loadAdminData();
                switchView('adminPanel');
                renderAdminPanel('store-payment'); // เข้าหน้า Payment ทันที
                usernameInput.value = '';
                passwordInput.value = '';
                loginError.textContent = '';
                adminGearIcon.style.display = 'none';
                backToAdminBtn.style.display = 'flex';
                themeToggleBtn.style.display = 'none';
                langToggleBtn.style.display = 'none';
            } else {
                // Super Admin
                isAdminLoggedIn = true;
                loggedInUser = data.user;
                localStorage.setItem('jwt_token', data.token);
                localStorage.setItem('isAdminLoggedIn', 'true');
                localStorage.setItem('loggedInUser', JSON.stringify(data.user));

                await loadAdminData();
                switchView('adminPanel');
                renderAdminPanel();
                usernameInput.value = '';
                passwordInput.value = '';
                loginError.textContent = '';
                adminGearIcon.style.display = 'none';
                backToAdminBtn.style.display = 'flex';
                themeToggleBtn.style.display = 'none';
                langToggleBtn.style.display = 'none';
            }

        } catch (error) {
            console.error('Login failed:', error);
        }
    });

    const logout = () => {
        // --- สถิติ Real-time: เคลียร์ Interval เมื่อ Logout ---
        if (dashboardRefreshInterval) {
            clearInterval(dashboardRefreshInterval);
            dashboardRefreshInterval = null;
        }
        // --- จบการแก้ไข ---

        // Logout ทั้ง Admin และ Store Owner
        isAdminLoggedIn = false;
        isStoreOwnerLoggedIn = false;
        loggedInUser = null;
        currentStoreSession = null;
        
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('isStoreOwnerLoggedIn');
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('currentStoreSession');
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('store_token');

        const initialAppData = new self.appData.constructor();
        appData.analytics = initialAppData.analytics;
        appData.subAdmins = initialAppData.subAdmins;
        appData.menuOrder = initialAppData.menuOrder;

        switchView('customer');
        renderCustomerView();
    }

    document.getElementById('logout-btn').addEventListener('click', logout);

    // ===== Registration Event Listeners =====
    document.getElementById('register-btn').addEventListener('click', () => {
        document.getElementById('registration-modal').style.display = 'flex';
        // Reset form fields
        document.getElementById('registration-form').reset();
        document.getElementById('registration-error').style.display = 'none';
        document.getElementById('registration-success').style.display = 'none';
        
        // Scroll to package selection section
        setTimeout(() => {
            const packageSelector = document.getElementById('reg-package-selector');
            if (packageSelector) {
                packageSelector.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }, 100);
    });

    document.getElementById('close-registration-modal-btn').addEventListener('click', () => {
        document.getElementById('registration-modal').style.display = 'none';
    });

    document.getElementById('registration-modal').addEventListener('click', (e) => {
        if (e.target.id === 'registration-modal') {
            document.getElementById('registration-modal').style.display = 'none';
        }
    });

    document.getElementById('registration-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const errorElement = document.getElementById('registration-error');
        const successElement = document.getElementById('registration-success');
        const submitBtn = document.getElementById('submit-registration-btn');
        
        // Hide previous messages
        errorElement.style.display = 'none';
        successElement.style.display = 'none';
        
        // 1. รวบรวมข้อมูลจากฟอร์ม
        const formData = {
            shopName: document.getElementById('reg-shop-name').value.trim(),
            shopAge: document.getElementById('reg-shop-age').value.trim(),
            shopLink: document.getElementById('reg-shop-link').value.trim(),
            username: document.getElementById('reg-username').value.trim(),
            password: document.getElementById('reg-password').value,
            confirmPassword: document.getElementById('reg-confirm-password').value,
            contacts: {
                line: document.getElementById('reg-line').value.trim(),
                facebook: document.getElementById('reg-facebook').value.trim(),
                phone: document.getElementById('reg-phone').value.trim()
            },
            packageType: document.querySelector('input[name="regPackage"]:checked')?.value || 'standard',
            registeredAt: new Date().toISOString(),
            status: 'pending' // สถานะเริ่มต้น
        };

        // 2. ตรวจสอบความถูกต้อง (Validation)
        if (!formData.shopName || !formData.shopAge || !formData.username || !formData.password) {
            showError('กรุณากรอกข้อมูลสำคัญให้ครบถ้วน (*)');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            showError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
            return;
        }
        
        // 3. ส่งข้อมูลไปยัง Netlify Function / Neon Database
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'กำลังบันทึกข้อมูล...';

            // --- ส่วนที่แก้ไข: ยิง API ไปยัง Netlify Function ---
            const response = await fetch(API_SIGNUP_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            // ถ้า API ยังไม่พร้อม (404) หรือ Error ให้แจ้งเตือน แต่ถ้า 200 OK ให้ทำต่อ
            if (!response.ok && response.status !== 404) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
            }

            // --- ส่วนที่แก้ไข: อัพเดท UI ฝั่ง Admin ทันที (เพื่อให้เห็นข้อมูลทันทีโดยไม่ต้องรีเฟรช) ---
            if (typeof window.ManagerStore !== 'undefined') {
                // เพิ่มข้อมูลเข้า State ปัจจุบันด้วย เพื่อให้แอดมินเห็นทันที
                // หมายเหตุ: ข้อมูลจริงจะถูกดึงใหม่จาก DB เมื่อรีโหลดหน้า
                window.ManagerStore.addStoreRegistration(formData); 
            }

            showSuccess('สมัครใช้งานสำเร็จ! ข้อมูลถูกส่งเข้าสู่ระบบแล้ว');
            document.getElementById('registration-form').reset();
            
            setTimeout(() => {
                document.getElementById('registration-modal').style.display = 'none';
                successElement.style.display = 'none';
            }, 2000);
            
        } catch (error) {
            console.error('Registration Error:', error);
            showError('การสมัครล้มเหลว: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'ยืนยันสมัครใช้งานระบบ';
        }
        
        function showError(message) {
            errorElement.textContent = message;
            errorElement.className = 'registration-error show';
            errorElement.style.display = 'block';
        }
        
        function showSuccess(message) {
            successElement.textContent = message;
            successElement.className = 'registration-success show';
            successElement.style.display = 'block';
        }
    });

    document.getElementById('view-shop-btn').addEventListener('click', () => {
        switchView('customer');
        renderCustomerView();
    });

    backToAdminBtn.addEventListener('click', () => {
        if (isAdminLoggedIn) {
            switchView('adminPanel');
            renderAdminPanel();
        }
    });

    const handleMenuLock = (e, menuKey) => {
        e.stopPropagation();
        const btn = e.currentTarget.parentElement;

        let clickCount = parseInt(btn.dataset.clickCount || '0');
        clickCount++;
        btn.dataset.clickCount = clickCount;

        setTimeout(() => {
            btn.dataset.clickCount = '0';
        }, 800);

        if (clickCount >= 3) {
            appData.shopSettings.menuLocks[menuKey] = !appData.shopSettings.menuLocks[menuKey];
            addLog('Menu Lock Toggled', `Menu '${menuKey}' is now ${appData.shopSettings.menuLocks[menuKey] ? 'Locked' : 'Unlocked'}`);
            saveState();
            renderAdminPanel();
            btn.dataset.clickCount = '0';
        }
    };

    const renderAdminMenu = async () => {
        adminMenuContainer.innerHTML = '';
        const isSuperAdmin = loggedInUser && loggedInUser.isSuperAdmin;
        const isStoreOwner = isStoreOwnerLoggedIn && currentStoreSession;
        const lang = appData.shopSettings.language;

        // หากเป็นร้านค้า ให้แสดงเฉพาะเมนู Payment
        if (isStoreOwner) {
            const storeOwnerMenus = ['store-payment'];
            storeOwnerMenus.forEach(menuKey => {
                if (menuKey === 'store-payment') {
                    const menuWrapper = document.createElement('div');
                    menuWrapper.className = 'menu-btn-wrapper';

                    const btn = document.createElement('button');
                    btn.className = `btn menu-btn ${menuKey === activeAdminMenu ? 'active' : ''}`;
                    btn.dataset.menu = menuKey;
                    btn.innerHTML = `
                        <span>💰 Payment</span>
                    `;
                    menuWrapper.appendChild(btn);
                    adminMenuContainer.appendChild(menuWrapper);
                }
            });
            return;
        }

        appData.menuOrder.forEach(menuKey => {
            let showMenuItem = isSuperAdmin || (loggedInUser && loggedInUser.permissions && loggedInUser.permissions[menuKey]);
            
            // ซ่อนเมนูจัดการแพ็คเกจสำหรับ Sub Admin
            if (!isSuperAdmin && (menuKey === 'admin-store-packages')) {
                showMenuItem = false;
            }
            if (showMenuItem && MENU_NAMES[menuKey]) {
                const translationKey = MENU_NAMES[menuKey];
                
                const menuWrapper = document.createElement('div');
                menuWrapper.className = 'menu-btn-wrapper';

                const btn = document.createElement('button');
                const isLocked = appData.shopSettings.menuLocks[menuKey] === true;
                btn.className = `btn menu-btn ${menuKey === activeAdminMenu ? 'active' : ''} ${isLocked ? 'locked' : ''}`;
                btn.dataset.menu = menuKey;
                btn.innerHTML = `
                    <span>${translations[lang][translationKey] || menuKey}</span>
                    <span class="menu-lock-icon" title="Triple-click to lock/unlock">${isLocked ? '🔒' : '🔓'}</span>
                `;
                menuWrapper.appendChild(btn);
    
                adminMenuContainer.appendChild(menuWrapper);
            }
        });

        if (isSuperAdmin) {
            const reorderBtn = document.createElement('button');
            reorderBtn.className = 'btn btn-small reorder-btn';
            reorderBtn.id = 'reorder-menu-btn';
            reorderBtn.textContent = translations[lang].editMenuOrderBtn;
            adminMenuContainer.appendChild(reorderBtn);
            reorderBtn.addEventListener('click', (e) => renderReorderMenuModal(e, 'main'));
        }

        document.querySelectorAll('.admin-menu .menu-btn-wrapper').forEach(wrapper => {
            const mainBtn = wrapper.querySelector('.menu-btn');
            if (mainBtn) {
                mainBtn.addEventListener('click', (e) => {
                    if (e.target.classList.contains('menu-lock-icon')) return;
    
                    if (appData.shopSettings.menuLocks[mainBtn.dataset.menu] === true) {
                        return;
                    }
                    activeAdminMenu = e.currentTarget.dataset.menu;
                    renderAdminPanel();
                });
                mainBtn.querySelector('.menu-lock-icon').addEventListener('click', (e) => handleMenuLock(e, mainBtn.dataset.menu));
            }
        });
    };

    const renderSubMenu = (menuKey, containerId) => {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        const subMenuConfig = SUB_MENUS[menuKey];
        if (!subMenuConfig) return;
    
        const lang = appData.shopSettings.language;
        const isSuperAdmin = loggedInUser && loggedInUser.isSuperAdmin;
        
        const subMenuOrder = Object.keys(subMenuConfig);
            
        subMenuOrder.forEach(subKey => {
            if (subMenuConfig[subKey]) {
                const tab = document.createElement('div');
                tab.className = `tab ${subKey === activeAdminSubMenus[menuKey] ? 'active' : ''}`;
                tab.dataset.sub = subKey;
                tab.textContent = translations[lang][subMenuConfig[subKey]] || subMenuConfig[subKey]; // <--- UPDATE: ใช้ || subMenuConfig[subKey] เพื่อ fallback
                tab.addEventListener('click', () => {
                    activeAdminSubMenus[menuKey] = subKey;
                    renderAdminPanel();
                });
                container.appendChild(tab);
            }
        });
    };

    // ===== START: NEW FUNCTIONS FOR 'manage-stores' =====

    const clearAllCountdowns = () => {
        Object.values(countdownIntervals).forEach(clearInterval);
        countdownIntervals = {};
    };

    const renderAdminPanel = async () => {
        document.querySelectorAll('.admin-menu-content').forEach(el => el.style.display = 'none');
        const isSuperAdmin = loggedInUser && loggedInUser.isSuperAdmin;
        await renderAdminMenu();

        // --- สถิติ Real-time: เคลียร์ Interval เก่า (ถ้ามี) ---
        if (dashboardRefreshInterval) {
            clearInterval(dashboardRefreshInterval);
            dashboardRefreshInterval = null;
        }
        // --- จบการแก้ไข ---

        const permissions = (loggedInUser && loggedInUser.permissions) || {};
        const canAccess = (menu) => isSuperAdmin || permissions[menu];

        document.getElementById('shop-enabled-toggle').checked = appData.shopSettings.shopEnabled;
        document.getElementById('announcement-enabled-toggle').checked = appData.shopSettings.announcementEnabled;

        Object.keys(appData.shopSettings.menuLocks).forEach(menuKey => {
            const contentEl = document.getElementById(`admin-menu-${menuKey}`);
            if (contentEl) {
                contentEl.classList.toggle('locked', appData.shopSettings.menuLocks[menuKey] === true);
            }
        });

        if (activeAdminMenu === 'admin' && canAccess('admin')) {
            const container = document.getElementById('admin-menu-admin');
            container.style.display = 'block';
            renderSubMenu('admin', 'admin-settings-tabs');
            container.querySelectorAll('.admin-sub-content').forEach(el => el.classList.remove('active'));

            const activeSub = activeAdminSubMenus.admin;
            document.getElementById(`admin-sub-${activeSub}`).classList.add('active');

            if (activeSub === 'shop-info') {
                document.getElementById('shop-name').value = appData.shopSettings.shopName;
                document.getElementById('shop-slogan').value = appData.shopSettings.slogan;
                document.getElementById('manager-name').value = appData.shopSettings.managerName;
                document.getElementById('shareholder-name').value = appData.shopSettings.shareholderName;
                document.getElementById('order-format-select').value = appData.shopSettings.orderNumberFormat;
            document.getElementById('custom-order-prefix').value = appData.shopSettings.customOrderPrefix || 'WHD';
            toggleCustomPrefixField(); // เรียกใช้ฟังก์ชันเพื่อแสดง/ซ่อน input field
                const customerLink = `${window.location.origin}${window.location.pathname}?customer=true`;
                document.getElementById('customer-link-display').value = customerLink;
            } else if (activeSub === 'system-fonts') {
                document.getElementById('global-font-size-perc').value = appData.shopSettings.globalFontSize;
                document.getElementById('main-menu-font-size-perc').value = appData.shopSettings.mainMenuFontSize;
                document.getElementById('sub-menu-font-size-perc').value = appData.shopSettings.subMenuFontSize;
                document.getElementById('shop-name-font-size').value = appData.shopSettings.shopNameFontSize;
                document.getElementById('slogan-font-size').value = appData.shopSettings.sloganFontSize;
                document.getElementById('shop-global-font').value = appData.shopSettings.globalFontFamily;
                document.getElementById('shop-font').value = appData.shopSettings.fontFamily;
                document.getElementById('slogan-font').value = appData.shopSettings.sloganFontFamily;
                document.getElementById('shop-name-color').value = appData.shopSettings.shopNameColor;
                document.getElementById('slogan-color').value = appData.shopSettings.sloganColor;

                document.getElementById('logo-toggle').checked = appData.shopSettings.useLogo;
                document.getElementById('logo-preview').style.display = appData.shopSettings.logo ? 'block' : 'none';
                if(appData.shopSettings.logo) document.getElementById('logo-preview').src = appData.shopSettings.logo;
                document.getElementById('logo-url').value = appData.shopSettings.logo?.startsWith('http') ? appData.shopSettings.logo : '';

                const nameEffect = appData.shopSettings.shopNameEffect;
                document.getElementById('effect-toggle').checked = nameEffect.enabled;
                document.getElementById('effect-offset-x').value = nameEffect.offsetX;
                document.getElementById('effect-offset-y').value = nameEffect.offsetY;
                document.getElementById('effect-blur').value = nameEffect.blur;
                document.getElementById('effect-color').value = nameEffect.color;

                const sloganEffect = appData.shopSettings.sloganEffect;
                document.getElementById('slogan-effect-toggle').checked = sloganEffect.enabled;
                document.getElementById('slogan-effect-offset-x').value = sloganEffect.offsetX;
                document.getElementById('slogan-effect-offset-y').value = sloganEffect.offsetY;
                document.getElementById('slogan-effect-blur').value = sloganEffect.blur;
                document.getElementById('slogan-effect-color').value = sloganEffect.color;

                const logoEffect = appData.shopSettings.logoEffect;
                document.getElementById('logo-effect-toggle').checked = logoEffect.enabled;
                document.getElementById('logo-effect-offset-x').value = logoEffect.offsetX;
                document.getElementById('logo-effect-offset-y').value = logoEffect.offsetY;
                document.getElementById('logo-effect-blur').value = logoEffect.blur;
                document.getElementById('logo-effect-color').value = logoEffect.color;

                document.getElementById('copyright-text').value = appData.shopSettings.copyrightText;
                document.getElementById('copyright-opacity').value = appData.shopSettings.copyrightOpacity;

                renderSuccessAnimationSettings();
                updateFontPreviewEffect();
            } else if (activeSub === 'background') {
                document.getElementById('bg-opacity').value = appData.shopSettings.backgroundOpacity;
                document.getElementById('bg-blur').value = appData.shopSettings.backgroundBlur;
                const bgPreview = document.getElementById('bg-preview');
                bgPreview.style.display = appData.shopSettings.backgroundImage ? 'block' : 'none';
                if(appData.shopSettings.backgroundImage) bgPreview.style.backgroundImage = `url(${appData.shopSettings.backgroundImage})`;
                document.getElementById('bg-url').value = appData.shopSettings.backgroundImage?.startsWith('http') ? appData.shopSettings.backgroundImage : '';
            }
            else if (activeSub === 'promotions') {
                renderPromotions();
            } else if (activeSub === 'password') {
                // Password change section - populated by event listeners
            } else if (activeSub === 'price-tag-config') {
                // ===== START: PRICE TAG UPDATE =====
                // ซ่อนฟิลด์ที่ไม่ต้องการ
                const storeNameGroup = document.getElementById('price-tag-store-name').closest('.form-group');
                const categoryGroup = document.getElementById('price-tag-category').closest('.form-group');
                if (storeNameGroup) storeNameGroup.style.display = 'none';
                if (categoryGroup) categoryGroup.style.display = 'none';

                // เปลี่ยน Label
                const closingMessageLabel = document.querySelector('label[for="price-tag-closing-message"]');
                if (closingMessageLabel) closingMessageLabel.textContent = 'เเจ้งลูกค้า';
                
                // โหลดค่า "เเจ้งลูกค้า" (closingMessage)
                document.getElementById('price-tag-closing-message').value = appData.shopSettings.priceTagConfig?.closingMessage || '';
                // ===== END: PRICE TAG UPDATE =====
            }
        } else if (activeAdminMenu === 'festival' && canAccess('festival')) {
            const container = document.getElementById('admin-menu-festival');
            container.style.display = 'block';
            renderSubMenu('festival', 'festival-tabs');
            container.querySelectorAll('.admin-sub-content').forEach(el => el.classList.remove('active'));
            const activeSub = activeAdminSubMenus.festival;
            document.getElementById(`admin-sub-${activeSub}`).classList.add('active');

            if (activeSub === 'announcement-message') {
                renderMessageEditor();
                renderMessageFramePreviews();
            } else if (activeSub === 'effects') {
                renderEffectsSubMenu();
            }
        }

        else if (activeAdminMenu === 'stock' && canAccess('stock')) {
            const container = document.getElementById('admin-menu-stock');
            container.style.display = 'block';
            renderSubMenu('stock', 'admin-stock-tabs');
            container.querySelectorAll('.admin-sub-content').forEach(el => el.classList.remove('active'));
            const activeSub = activeAdminSubMenus.stock;
            document.getElementById(`admin-sub-${activeSub}`).classList.add('active');
            if (activeSub === 'categories') {
                renderAdminCategories();
            } else if (activeSub === 'products') {
                renderAdminProductTabs();
                renderAdminProducts();
                populateCategoryDropdown();
                document.getElementById('out-of-stock-text').value = appData.shopSettings.messageSettings.outOfStockText;
                document.getElementById('out-of-stock-font-size').value = appData.shopSettings.messageSettings.outOfStockFontSize;
            } else if (activeSub === 'stock-settings') {
                renderStockSettingsPage();
            }
        } else if (activeAdminMenu === 'order-number' && canAccess('order-number')) {
            const container = document.getElementById('admin-menu-order-number');
            container.style.display = 'block';
            renderSubMenu('order-number', 'admin-order-tabs');
            container.querySelectorAll('.admin-sub-content').forEach(el => el.classList.remove('active'));
            document.getElementById(`admin-sub-${activeAdminSubMenus['order-number']}`).classList.add('active');
            if (!orderDatePicker) {
                orderDatePicker = flatpickr("#order-date-picker", { mode: "range", dateFormat: "Y-m-d", onClose: (selectedDates) => renderOrderNumberView(selectedDates) });
            }
            renderOrderNumberView(orderDatePicker.selectedDates);
        } else if (activeAdminMenu === 'dashboard' && canAccess('dashboard')) {
            const container = document.getElementById('admin-menu-dashboard');
            container.style.display = 'block';
            renderSubMenu('dashboard', 'admin-dashboard-tabs');
            container.querySelectorAll('.admin-sub-content').forEach(el => el.classList.remove('active'));
            const activeSub = activeAdminSubMenus.dashboard;
            document.getElementById(`admin-sub-${activeSub}`).classList.add('active');
            if (activeSub === 'dashboard-overview') {
                if (!fp) fp = flatpickr(datePicker, { defaultDate: selectedDate, dateFormat: "Y-m-d", onChange: (selectedDates, dateStr) => { selectedDate = dateStr; renderDashboard(); } });
                initAdvancedDashboard(); // Initialize advanced dashboard controls
                renderDashboard();

                // --- สถิติ Real-time: เริ่ม Interval ใหม่ ---
                dashboardRefreshInterval = setInterval(async () => {
                    if (document.getElementById('admin-menu-dashboard').style.display === 'block') {
                        await loadAdminData(); // โหลดข้อมูลใหม่
                        renderDashboard();     // วาดกราฟใหม่
                    }
                }, 30000); // 30 วินาที
                // --- จบการแก้ไข ---
            } else if (activeSub === 'product-dashboard') {
                renderProductDashboard();
            }
        } 
        // ===== นี่คือจุดตัด Part 1 ครับ =====
        else if (activeAdminMenu === 'manage-account' && canAccess('manage-account')) {
            const container = document.getElementById('admin-menu-manage-account');
            container.style.display = 'block';
            renderSubMenu('manage-account', 'admin-account-tabs');
            container.querySelectorAll('.admin-sub-content').forEach(el => el.classList.remove('active'));
            const activeSub = activeAdminSubMenus['manage-account'];
            document.getElementById(`admin-sub-${activeSub}`).classList.add('active');
            if (activeSub === 'accounts') {
                renderSubAdmins();
            } else if (activeSub === 'logs') {
                if (!logDatePicker) {
                    logDatePicker = flatpickr("#log-date-picker", { mode: "range", dateFormat: "Y-m-d", onClose: (selectedDates) => renderLogs(selectedDates) });
                }
                renderLogs(logDatePicker.selectedDates);
            }
        } else if (activeAdminMenu === 'grid-layout' && canAccess('grid-layout')) {
            document.getElementById('admin-menu-grid-layout').style.display = 'block';
            renderGridLayoutAdminPage();
        } else if (activeAdminMenu === 'order-bar' && canAccess('order-bar')) {
            document.getElementById('admin-menu-order-bar').style.display = 'block';
            renderOrderBarSettings();
        } else if (activeAdminMenu === 'manager-store' && canAccess('manager-store')) {
            document.getElementById('admin-menu-manager-store').style.display = 'block';
            renderSubMenu('manager-store', 'manager-store-tabs');
            if (!activeAdminSubMenus['manager-store']) activeAdminSubMenus['manager-store'] = 'store-registrations';
            const msActiveSub = activeAdminSubMenus['manager-store'];
            // Initialize ManagerStore (only once) and render the active tab
            if (window.ManagerStore) {
                if (typeof window.ManagerStore.init === 'function') {
                    await window.ManagerStore.init();
                }
                if (typeof window.ManagerStore.showSubMenu === 'function') {
                    window.ManagerStore.showSubMenu(msActiveSub);
                }
            }
            // Load package data for SignUpSystem
            if (window.SignUpSystem && window.SignUpSystem.loadPackageData) {
                window.SignUpSystem.loadPackageData();
            }
        } else if (activeAdminMenu === 'store-payment') {
            document.getElementById('admin-menu-store-payment').style.display = 'block';
            // Render หน้า Payment สำหรับร้านค้า
            renderStorePaymentPanel();
        }
        else {
            if (!isSuperAdmin) {
                const firstPermittedMenu = appData.menuOrder.find(key => permissions[key]);
                if (firstPermittedMenu) {
                    activeAdminMenu = firstPermittedMenu;
                    renderAdminPanel();
                }
            }
        }
        document.querySelectorAll('input[type="range"]').forEach(updateRangeValueDisplay);
    };

    const updateFontPreviewEffect = () => {
        const previewName = document.getElementById('font-preview');
        const previewSlogan = document.getElementById('slogan-font-preview');
        const previewLogo = document.getElementById('font-preview-logo');
        const globalFontPreview = document.getElementById('global-font-preview');
        const logoToggle = document.getElementById('logo-toggle').checked;

        previewName.style.display = logoToggle ? 'none' : 'block';
        previewLogo.style.display = logoToggle ? 'block' : 'none';

        if(appData.shopSettings.logo) {
            previewLogo.src = appData.shopSettings.logo;
        }

        previewName.style.fontFamily = document.getElementById('shop-font').value;
        previewName.style.color = document.getElementById('shop-name-color').value;

        previewSlogan.style.fontFamily = document.getElementById('slogan-font').value;
        previewSlogan.style.color = document.getElementById('slogan-color').value;

        globalFontPreview.style.fontFamily = document.getElementById('shop-global-font').value;

        const nameEffectEnabled = document.getElementById('effect-toggle').checked;
        document.getElementById('effect-controls-container').style.display = nameEffectEnabled ? 'grid' : 'none';
        previewName.style.textShadow = nameEffectEnabled
            ? `${document.getElementById('effect-offset-x').value}px ${document.getElementById('effect-offset-y').value}px ${document.getElementById('effect-blur').value}px ${document.getElementById('effect-color').value}`
            : 'none';

        const sloganEffectEnabled = document.getElementById('slogan-effect-toggle').checked;
        document.getElementById('slogan-effect-controls-container').style.display = sloganEffectEnabled ? 'grid' : 'none';
        previewSlogan.style.textShadow = sloganEffectEnabled
            ? `${document.getElementById('slogan-effect-offset-x').value}px ${document.getElementById('slogan-effect-offset-y').value}px ${document.getElementById('slogan-effect-blur').value}px ${document.getElementById('slogan-effect-color').value}`
            : 'none';

        const logoEffectEnabled = document.getElementById('logo-effect-toggle').checked;
        document.getElementById('logo-effect-controls-container').style.display = logoEffectEnabled ? 'grid' : 'none';
        previewLogo.style.filter = logoEffectEnabled
            ? `drop-shadow(${document.getElementById('logo-effect-offset-x').value}px ${document.getElementById('logo-effect-offset-y').value}px ${document.getElementById('logo-effect-blur').value}px ${document.getElementById('logo-effect-color').value})`
            : 'none';
    };

    const updateGridLayoutPreview = () => {
        const previewCard = document.getElementById('grid-layout-preview-card');
        if (!previewCard) return;

        const root = previewCard;
        const baseMultiplier = parseFloat(document.getElementById('card-font-size-slider').value) / 100;

        const levelSize = parseFloat(document.getElementById('card-level-font-size-slider').value) / 100;
        const nameSize = parseFloat(document.getElementById('card-name-font-size-slider').value) / 100;
        const quantitySize = parseFloat(document.getElementById('card-quantity-font-size-slider').value) / 100;
        const iconSize = parseFloat(document.getElementById('card-icon-size-slider').value);
        const cardHeight = parseFloat(document.getElementById('card-height-slider').value);
        const cardWidth = parseFloat(document.getElementById('card-width-slider').value);

        root.style.height = `${150 * (cardHeight / 100)}px`;
        root.style.width = `${120 * (cardWidth / 100)}px`;

        root.querySelector('.product-card-level').style.fontSize = `calc(${levelSize} * 0.8rem * ${baseMultiplier})`;
        root.querySelector('.product-card-name').style.fontSize = `calc(${nameSize} * 0.9rem * ${baseMultiplier})`;
        root.querySelector('.product-card-quantity').style.fontSize = `calc(${quantitySize} * 1.1rem * ${baseMultiplier})`;
        root.querySelector('.product-card-icon').style.width = `${iconSize}%`;

        root.querySelector('.product-card-level').style.color = document.getElementById('card-level-color').value;
        root.querySelector('.product-card-name').style.color = document.getElementById('card-name-color').value;
        root.querySelector('.product-card-quantity').style.color = document.getElementById('card-quantity-color').value;


        const settings = appData.shopSettings.gridLayoutSettings;
        root.querySelector('.product-card-icon').style.transform = `translate(calc(-50% + ${settings.iconOffsetX}px), calc(-50% + ${settings.iconOffsetY}px))`;
        root.querySelector('.product-card-level').style.top = `calc(5% + ${settings.levelOffsetY}px)`;
        root.querySelector('.product-card-level').style.left = `calc(5% + ${settings.levelOffsetX}px)`;
        root.querySelector('.product-card-name').style.bottom = `calc(30% + ${settings.nameOffsetY}px)`;
        root.querySelector('.product-card-name').style.transform = `translateX(calc(-50% + ${settings.nameOffsetX}px))`;
        root.querySelector('.product-card-controls').style.bottom = `calc(10% + ${settings.quantityOffsetY}px)`;
        root.querySelector('.product-card-controls').style.transform = `translateX(calc(-50% + ${settings.quantityOffsetX}px))`;

        const activeFrame = document.querySelector('#card-frame-previews .product-card.active');
        if (activeFrame) {
            previewCard.className = `product-card ${activeFrame.dataset.style}`;
        }
    };

    const renderGridLayoutAdminPage = () => {
        const settings = appData.shopSettings.gridLayoutSettings;

        document.getElementById('grid-columns-slider').value = settings.columns;
        document.getElementById('card-font-size-slider').value = settings.cardFontSize;
        document.getElementById('card-height-slider').value = settings.cardHeight;
        document.getElementById('card-width-slider').value = settings.cardWidth;
        document.getElementById('grid-horizontal-gap-slider').value = settings.horizontalGap || 5;
        document.getElementById('grid-vertical-gap-slider').value = settings.verticalGap || 5;

        document.getElementById('card-level-font-size-slider').value = settings.levelFontSize;
        document.getElementById('card-name-font-size-slider').value = settings.nameFontSize;
        document.getElementById('card-quantity-font-size-slider').value = settings.quantityFontSize;
        document.getElementById('card-icon-size-slider').value = settings.iconSize;

        document.getElementById('card-level-color').value = settings.levelColor;
        document.getElementById('card-name-color').value = settings.nameColor;
        document.getElementById('card-quantity-color').value = settings.quantityColor;

        const framePreviewContainer = document.getElementById('card-frame-previews');
        framePreviewContainer.innerHTML = '';
        for (let i = 1; i <= 50; i++) {
            const style = `frame-style-${i}`;
            const preview = document.createElement('div');
            preview.className = `product-card ${style}`;
            preview.dataset.style = style;
            if (style === settings.frameStyle) {
                preview.classList.add('active');
            }
            preview.innerHTML = `<span>แบบ ${i}</span>`;
            preview.addEventListener('click', (e) => {
                document.querySelectorAll('#card-frame-previews .product-card').forEach(p => p.classList.remove('active'));
                e.currentTarget.classList.add('active');
                updateGridLayoutPreview();
            });
            framePreviewContainer.appendChild(preview);
        }

        updateGridLayoutPreview();
        document.querySelectorAll('#admin-menu-grid-layout input[type="range"]').forEach(updateRangeValueDisplay);
    };

    const saveGridLayoutSettings = async (section, buttonElement) => {
        showSaveFeedback(buttonElement);
        const settings = appData.shopSettings.gridLayoutSettings;
        let logDetails = '';

        if (section === 'general') {
            settings.columns = document.getElementById('grid-columns-slider').value;
            settings.cardFontSize = document.getElementById('card-font-size-slider').value;
            settings.horizontalGap = document.getElementById('grid-horizontal-gap-slider').value;
            settings.verticalGap = document.getElementById('grid-vertical-gap-slider').value;
            logDetails = `General settings updated`;
        } else if (section === 'sizing') {
            settings.cardHeight = document.getElementById('card-height-slider').value;
            settings.cardWidth = document.getElementById('card-width-slider').value;
            settings.levelFontSize = document.getElementById('card-level-font-size-slider').value;
            settings.nameFontSize = document.getElementById('card-name-font-size-slider').value;
            settings.quantityFontSize = document.getElementById('card-quantity-font-size-slider').value;
            settings.iconSize = document.getElementById('card-icon-size-slider').value;
            logDetails = 'Sizing settings updated';
        } else if (section === 'colors') {
            settings.levelColor = document.getElementById('card-level-color').value;
            settings.nameColor = document.getElementById('card-name-color').value;
            settings.quantityColor = document.getElementById('card-quantity-color').value;
            logDetails = 'Color settings updated';
        } else if (section === 'position') {
            logDetails = 'Position settings updated';
        } else if (section === 'frame') {
            const activeFrame = document.querySelector('#card-frame-previews .product-card.active');
            if (activeFrame) {
                settings.frameStyle = activeFrame.dataset.style;
                logDetails = `Frame style set to ${settings.frameStyle}`;
            }
        }

        addLog('Grid Layout Updated', logDetails);
        await saveState();
        applyGridLayoutSettings();
        renderProducts(searchBox.value.trim());
    };

    const getTopSellingItems = (period) => {
        const today = new Date();
        const confirmedOrders = appData.analytics.orders.filter(o => o.status === 'active');

        let ordersToAnalyze = [];
        if(period === 'day') {
            ordersToAnalyze = confirmedOrders.filter(o => o.timestamp.startsWith(today.toISOString().slice(0, 10)));
        } else if (period === 'month') {
            ordersToAnalyze = confirmedOrders.filter(o => new Date(o.timestamp).getMonth() === today.getMonth() && new Date(o.timestamp).getFullYear() === today.getFullYear());
        } else {
            ordersToAnalyze = confirmedOrders.filter(o => new Date(o.timestamp).getFullYear() === today.getFullYear());
        }

        const itemCounts = {};
        ordersToAnalyze.forEach(order => {
            for(const prodId in order.items) {
                const product = appData.allProducts.find(p => p.id == prodId);
                if(product){
                    if(!itemCounts[product.name]) itemCounts[product.name] = 0;
                    itemCounts[product.name] += order.items[prodId];
                }
            }
        });
        return Object.entries(itemCounts).sort(([, a], [, b]) => b - a);
    }

    const renderDashboard = () => {
        const today = new Date(), currentMonth = today.getMonth(), currentYear = today.getFullYear();
        const confirmedOrders = (appData.analytics.orders || []).filter(o => o.status === 'active');
        const ordersToday = confirmedOrders.filter(o => o.timestamp.startsWith(selectedDate));
        const ordersInMonth = confirmedOrders.filter(o => new Date(o.timestamp).getFullYear() === currentYear && new Date(o.timestamp).getMonth() === currentMonth);
        const ordersInYear = confirmedOrders.filter(o => new Date(o.timestamp).getFullYear() === currentYear);
        
        // --- START: สถิติ Real-time: คำนวณ Traffic Stats ---
        const logs = appData.analytics.logs || [];
        const trafficEvents = ['page_view', 'product_click', 'category_click'];
        const dailyTraffic = Array(7).fill(0); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const hourlyTraffic = Array(24).fill(0); // 0 = 00:00, ..., 23 = 23:00
        const todayStr = new Date().toISOString().slice(0, 10);

        logs.forEach(log => {
            if (trafficEvents.includes(log.action)) {
                try {
                    const logDate = new Date(log.timestamp);
                    
                    // คำนวณสถิติรายชั่วโมง (เฉพาะวันนี้)
                    if (log.timestamp.startsWith(todayStr)) {
                        const hourOfDay = logDate.getHours();
                        hourlyTraffic[hourOfDay]++;
                    }

                    // คำนวณสถิติรายวัน (7 วันย้อนหลัง)
                    const dayOfWeek = logDate.getDay();
                    dailyTraffic[dayOfWeek]++; // หมายเหตุ: นี่คือการนับรวมทุกวัน ไม่ใช่ 7 วันย้อนหลัง ถ้าต้องการ 7 วันย้อนหลังจริง ต้องกรองวันที่ด้วย
                                               // แต่จากโค้ดเดิม ดูเหมือนจะนับรวมทุกวันตามวันในสัปดาห์
                } catch(e) {
                    console.error("Error processing log timestamp:", e, log);
                }
            }
        });
        
        // อัปเดต appData.analytics เพื่อให้ renderTrafficChart ใช้งานได้
        appData.analytics.dailyTraffic = dailyTraffic;
        appData.analytics.hourlyTraffic = hourlyTraffic;
        
        const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'];
        // Traffic stats elements removed from Dashboard - skip updates
        // --- END: สถิติ Real-time: คำนวณ Traffic Stats ---

        // --- START: Product & Order Stats Update ---
        const allItemCounts = {};
        const ordersByDay = Array(7).fill(0);
        const ordersByHour = Array(24).fill(0);

        confirmedOrders.forEach(order => {
            const orderDate = new Date(order.timestamp);
            ordersByDay[orderDate.getDay()]++;
            ordersByHour[orderDate.getHours()]++;

            for (const prodId in order.items) {
                const product = appData.allProducts.find(p => p.id == prodId);
                if (product) {
                    allItemCounts[product.name] = (allItemCounts[product.name] || 0) + order.items[prodId];
                }
            }
        });

        const productEntries = Object.entries(allItemCounts);
        let bestSelling = 'ไม่มีข้อมูล';
        let leastSelling = 'ไม่มีข้อมูล';
        if (productEntries.length > 0) {
            productEntries.sort((a, b) => b[1] - a[1]);
            bestSelling = `${productEntries[0][0]} (${productEntries[0][1].toLocaleString()} ชิ้น)`;
            leastSelling = `${productEntries[productEntries.length - 1][0]} (${productEntries[productEntries.length - 1][1].toLocaleString()} ชิ้น)`;
        }
        document.getElementById('best-selling-product').textContent = `สินค้าที่สั่งเยอะสุด: ${bestSelling}`;
        document.getElementById('least-selling-product').textContent = `สินค้าที่สั่งน้อยสุด: ${leastSelling}`;
        
        const maxOrdersDay = Math.max(...ordersByDay);
        const busiestDayIndex = ordersByDay.indexOf(maxOrdersDay);
        document.getElementById('busiest-ordering-day').textContent = `วันที่สั่งของเยอะสุด: ${days[busiestDayIndex]} (${maxOrdersDay} ออเดอร์)`;

        const maxOrdersHour = Math.max(...ordersByHour);
        const busiestHourIndex = ordersByHour.indexOf(maxOrdersHour);
        document.getElementById('busiest-ordering-time').textContent = `ช่วงเวลาที่ถูกสั่งมากที่สุด: ${busiestHourIndex}:00 - ${busiestHourIndex + 1}:00 น. (${maxOrdersHour} ออเดอร์)`;
        // --- END: Product & Order Stats Update ---

        const monthlyProfit = ordersInMonth.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
        const yearlySales = ordersInYear.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
        document.getElementById('monthly-profit').textContent = `${monthlyProfit.toLocaleString()} บาท`;
        document.getElementById('daily-orders').textContent = ordersToday.length;
        document.getElementById('monthly-orders').textContent = ordersInMonth.length;
        document.getElementById('yearly-sales').textContent = `${yearlySales.toLocaleString()} บาท`;
        
        // Legacy charts (kept for compatibility)
        renderCategorySalesChart(ordersInYear);
        renderTopItems('month');
        document.querySelectorAll('#top-items-controls .btn').forEach(b => b.classList.remove('active'));
        const monthBtn = document.querySelector('#top-items-controls .btn[data-period="month"]');
        if (monthBtn) monthBtn.classList.add('active');
        
        // Advanced Dashboard Charts
        renderAdvancedDashboard();
    };

    const renderProductDashboard = () => {
        const topStockList = document.getElementById('top-stock-list');
        const bottomStockList = document.getElementById('bottom-stock-list');
        topStockList.innerHTML = '';
        bottomStockList.innerHTML = '';

        const productsWithStock = appData.allProducts.filter(p => p.stock !== -1);

        const sortedTop = [...productsWithStock].sort((a, b) => b.stock - a.stock).slice(0, 10);
        sortedTop.forEach(prod => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${prod.name}</span><strong>${prod.stock.toLocaleString()} ชิ้น</strong>`;
            topStockList.appendChild(li);
        });

        const sortedBottom = [...productsWithStock].sort((a, b) => a.stock - b.stock).slice(0, 50);
        sortedBottom.forEach(prod => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${prod.name}</span><strong>${prod.stock.toLocaleString()} ชิ้น</strong>`;
            bottomStockList.appendChild(li);
        });

        renderLowStockAlertWidget();
    };

    const renderTrafficChart = (days) => {
        // Traffic chart removed from Dashboard - function kept for compatibility
        const ctx = document.getElementById('dailyTrafficChart');
        if (!ctx) return;
        if (dailyTrafficChart) dailyTrafficChart.destroy();
        const trafficData = appData.analytics.dailyTraffic || Array(7).fill(0);
        dailyTrafficChart = new Chart(ctx, { type: 'bar', data: { labels: days, datasets: [{ label: 'จำนวนผู้เข้าชม (รวมคลิก)', data: trafficData, backgroundColor: 'rgba(40, 167, 69, 0.5)', borderColor: 'rgba(40, 167, 69, 1)', borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } } });
    };
    const renderProductSalesChart = (salesData) => {
        // This function is now replaced by renderProductSalesChartAdvanced
        // Keeping for backward compatibility but productSalesChart is managed by advanced dashboard
    };
    const renderCategorySalesChart = (orders) => {
        const salesByCategory = {};
        orders.forEach(order => {
            const itemsByCategoryInOrder = {};
            for (const prodId in order.items) {
                const product = appData.allProducts.find(p => p.id == prodId);
                if (product && product.category_id) {
                    if (!itemsByCategoryInOrder[product.category_id]) itemsByCategoryInOrder[product.category_id] = 0;
                    itemsByCategoryInOrder[product.category_id] += order.items[prodId];
                }
            }
             for (const catId in itemsByCategoryInOrder) {
                const cat = appData.categories.find(c => c.id == catId);
                if (cat) {
                    const priceResult = calculatePrice(parseInt(catId), itemsByCategoryInOrder[catId]);
                    if (!salesByCategory[cat.name]) salesByCategory[cat.name] = 0;
                    salesByCategory[cat.name] += priceResult.price;
                }
            }
        });
        if (categorySalesChart) categorySalesChart.destroy();
        categorySalesChart = new Chart(document.getElementById('categorySalesChart'), { type: 'pie', data: { labels: Object.keys(salesByCategory), datasets: [{ label: 'ยอดขาย', data: Object.values(salesByCategory), backgroundColor: ['#28a745', '#ffc107', '#17a2b8', '#dc3545', '#6610f2', '#fd7e14', '#e83e8c', '#6c757d'] }] }, options: { responsive: true, maintainAspectRatio: false } });
    };

    const renderLowStockAlertWidget = () => {
        const widgetEl = document.getElementById('low-stock-alert-widget');
        widgetEl.innerHTML = '';
        const lang = appData.shopSettings.language;
        const lowStockProducts = appData.allProducts
            .filter(p => p.stock !== -1 && p.stock < (appData.shopSettings.dbCategoryLowStockThresholds[p.category_id] ?? appData.shopSettings.lowStockThreshold))
            .sort((a, b) => a.stock - b.stock);

        if (lowStockProducts.length === 0) {
            widgetEl.innerHTML = `<p>${translations[lang].noLowStockItems}</p>`;
            return;
        }

        const alertList = document.createElement('ol');
        alertList.className = 'low-stock-list';
        lowStockProducts.slice(0, 10).forEach(prod => {
            const li = document.createElement('li');
            const threshold = appData.shopSettings.dbCategoryLowStockThresholds[prod.category_id] ?? appData.shopSettings.lowStockThreshold;
            if (prod.stock < (threshold / 2)) {
                li.className = 'blinking-warning';
            }
            li.innerHTML = `<span>${prod.name}</span><strong>${prod.stock.toLocaleString()} / ${threshold.toLocaleString()} ชิ้น</strong>`;
            alertList.appendChild(li);
        });
        widgetEl.appendChild(alertList);

        if (lowStockProducts.length > 10) {
            const viewMoreLink = document.createElement('div');
            viewMoreLink.className = 'view-more-link';
            viewMoreLink.dataset.translateKey = 'viewMore';
            viewMoreLink.textContent = translations[lang].viewMore;
            viewMoreLink.addEventListener('click', () => renderLowStockModal(lowStockProducts));
            widgetEl.appendChild(viewMoreLink);
        }
    };

    const renderLowStockModal = (lowStockProducts) => {
        const modal = document.getElementById('low-stock-modal');
        const listBody = document.getElementById('low-stock-modal-list');
        listBody.innerHTML = '';

        lowStockProducts.slice(0, 50).forEach(prod => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${prod.name}</td>
                <td>${prod.stock.toLocaleString()}</td>
            `;
            listBody.appendChild(row);
        });

        modal.style.display = 'flex';
    };

    document.getElementById('close-low-stock-modal-btn').addEventListener('click', () => {
        document.getElementById('low-stock-modal').style.display = 'none';
    });

    // ===== START: Advanced Dashboard Functions =====
    
    // Initialize Advanced Dashboard
    const initAdvancedDashboard = () => {
        // Sales Period Controls
        document.querySelectorAll('#sales-period-controls .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('#sales-period-controls .btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                renderSalesPeriodChart(e.target.dataset.period);
            });
        });

        // Top 10 Controls
        document.querySelectorAll('#top10-items-controls .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('#top10-items-controls .btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                renderTop10Products(e.target.dataset.period);
            });
        });

        // Bottom 3 Controls
        document.querySelectorAll('#bottom3-items-controls .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('#bottom3-items-controls .btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                renderBottom3Products(e.target.dataset.period);
            });
        });

        // Busiest Days Controls
        document.querySelectorAll('#busiest-days-controls .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('#busiest-days-controls .btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                renderBusiestDays(e.target.dataset.period);
            });
        });

        // Product Sales Select
        const productSelect = document.getElementById('product-sales-select');
        if (productSelect) {
            populateProductSelect();
            productSelect.addEventListener('change', (e) => {
                renderProductSalesChartAdvanced(e.target.value);
            });
        }
    };

    // Populate product dropdown
    const populateProductSelect = () => {
        const select = document.getElementById('product-sales-select');
        if (!select) return;
        select.innerHTML = '<option value="all">-- ทั้งหมด --</option>';
        appData.allProducts.forEach(prod => {
            const option = document.createElement('option');
            option.value = prod.id;
            option.textContent = prod.name;
            select.appendChild(option);
        });
    };

    // Render Sales Period Chart
    const renderSalesPeriodChart = (period = 'daily') => {
        const confirmedOrders = (appData.analytics.orders || []).filter(o => o.status === 'active');
        const today = new Date();
        let labels = [];
        let data = [];

        switch(period) {
            case 'daily':
                // Last 7 days
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().slice(0, 10);
                    labels.push(date.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' }));
                    const dayTotal = confirmedOrders
                        .filter(o => o.timestamp.startsWith(dateStr))
                        .reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
                    data.push(dayTotal);
                }
                break;
            case 'monthly':
                // Last 6 months
                for (let i = 5; i >= 0; i--) {
                    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
                    const year = date.getFullYear();
                    const month = date.getMonth();
                    labels.push(date.toLocaleDateString('th-TH', { month: 'short', year: '2-digit' }));
                    const monthTotal = confirmedOrders
                        .filter(o => {
                            const orderDate = new Date(o.timestamp);
                            return orderDate.getFullYear() === year && orderDate.getMonth() === month;
                        })
                        .reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
                    data.push(monthTotal);
                }
                break;
            case '3months':
                // Last 3 months by week
                for (let i = 11; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - (i * 7));
                    const weekStart = new Date(date);
                    const weekEnd = new Date(date);
                    weekEnd.setDate(weekEnd.getDate() + 6);
                    labels.push(`สัปดาห์ ${12 - i}`);
                    const weekTotal = confirmedOrders
                        .filter(o => {
                            const orderDate = new Date(o.timestamp);
                            return orderDate >= weekStart && orderDate <= weekEnd;
                        })
                        .reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
                    data.push(weekTotal);
                }
                break;
            case '5months':
                // Last 5 months
                for (let i = 4; i >= 0; i--) {
                    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
                    const year = date.getFullYear();
                    const month = date.getMonth();
                    labels.push(date.toLocaleDateString('th-TH', { month: 'long' }));
                    const monthTotal = confirmedOrders
                        .filter(o => {
                            const orderDate = new Date(o.timestamp);
                            return orderDate.getFullYear() === year && orderDate.getMonth() === month;
                        })
                        .reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
                    data.push(monthTotal);
                }
                break;
            case 'yearly':
                // Last 3 years
                for (let i = 2; i >= 0; i--) {
                    const year = today.getFullYear() - i;
                    labels.push(year.toString());
                    const yearTotal = confirmedOrders
                        .filter(o => new Date(o.timestamp).getFullYear() === year)
                        .reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
                    data.push(yearTotal);
                }
                break;
        }

        if (salesPeriodChart) salesPeriodChart.destroy();
        const ctx = document.getElementById('salesPeriodChart');
        if (!ctx) return;
        
        salesPeriodChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'ยอดขาย (บาท)',
                    data: data,
                    borderColor: 'rgba(40, 167, 69, 1)',
                    backgroundColor: 'rgba(40, 167, 69, 0.2)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top' }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { callback: (value) => value.toLocaleString() + ' ฿' } }
                }
            }
        });
    };

    // Render Category Sales Table
    const renderCategorySalesTable = () => {
        const tbody = document.getElementById('category-sales-list');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        const confirmedOrders = (appData.analytics.orders || []).filter(o => o.status === 'active');
        const salesByCategory = {};

        confirmedOrders.forEach(order => {
            for (const prodId in order.items) {
                const product = appData.allProducts.find(p => p.id == prodId);
                if (product) {
                    const cat = appData.categories.find(c => c.id == product.category_id);
                    if (cat) {
                        if (!salesByCategory[cat.id]) {
                            salesByCategory[cat.id] = { name: cat.name, quantity: 0, revenue: 0 };
                        }
                        salesByCategory[cat.id].quantity += order.items[prodId];
                        const priceResult = calculatePrice(parseInt(product.category_id), order.items[prodId]);
                        salesByCategory[cat.id].revenue += priceResult.price;
                    }
                }
            }
        });

        const sortedCategories = Object.values(salesByCategory).sort((a, b) => b.revenue - a.revenue);
        sortedCategories.forEach(cat => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cat.name}</td>
                <td>${cat.quantity.toLocaleString()}</td>
                <td>${cat.revenue.toLocaleString()} บาท</td>
            `;
            tbody.appendChild(row);
        });

        if (sortedCategories.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="empty-state">ยังไม่มีข้อมูล</td></tr>';
        }
    };

    // Render Popular Categories Chart & Table
    const renderPopularCategories = () => {
        const confirmedOrders = (appData.analytics.orders || []).filter(o => o.status === 'active');
        const ordersByCategory = {};

        confirmedOrders.forEach(order => {
            const categoriesInOrder = new Set();
            for (const prodId in order.items) {
                const product = appData.allProducts.find(p => p.id == prodId);
                if (product) categoriesInOrder.add(product.category_id);
            }
            categoriesInOrder.forEach(catId => {
                const cat = appData.categories.find(c => c.id == catId);
                if (cat) {
                    if (!ordersByCategory[cat.id]) ordersByCategory[cat.id] = { name: cat.name, count: 0 };
                    ordersByCategory[cat.id].count++;
                }
            });
        });

        const sortedCategories = Object.values(ordersByCategory).sort((a, b) => b.count - a.count);

        // Chart
        if (popularCategoriesChart) popularCategoriesChart.destroy();
        const ctx = document.getElementById('popularCategoriesChart');
        if (ctx) {
            popularCategoriesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sortedCategories.slice(0, 5).map(c => c.name),
                    datasets: [{
                        label: 'จำนวนออเดอร์',
                        data: sortedCategories.slice(0, 5).map(c => c.count),
                        backgroundColor: ['#28a745', '#ffc107', '#17a2b8', '#dc3545', '#6f42c1']
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
            });
        }

        // Table
        const tbody = document.getElementById('popular-categories-list');
        if (tbody) {
            tbody.innerHTML = '';
            sortedCategories.forEach((cat, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><span class="rank-badge ${index < 3 ? 'rank-' + (index + 1) : 'rank-default'}">${index + 1}</span></td>
                    <td>${cat.name}</td>
                    <td>${cat.count.toLocaleString()}</td>
                `;
                tbody.appendChild(row);
            });
            if (sortedCategories.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" class="empty-state">ยังไม่มีข้อมูล</td></tr>';
            }
        }
    };

    // Render Top 10 Products
    const renderTop10Products = (period = 'month') => {
        const sortedItems = getTopSellingItems(period).slice(0, 10);

        // Chart
        if (top10ProductsChart) top10ProductsChart.destroy();
        const ctx = document.getElementById('top10ProductsChart');
        if (ctx) {
            top10ProductsChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sortedItems.map(([name]) => name.length > 15 ? name.slice(0, 15) + '...' : name),
                    datasets: [{
                        label: 'จำนวนขาย',
                        data: sortedItems.map(([, qty]) => qty),
                        backgroundColor: 'rgba(40, 167, 69, 0.7)',
                        borderColor: 'rgba(40, 167, 69, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: { x: { beginAtZero: true } }
                }
            });
        }

        // Table
        const tbody = document.getElementById('top10-products-list');
        if (tbody) {
            tbody.innerHTML = '';
            sortedItems.forEach(([name, quantity], index) => {
                const product = appData.allProducts.find(p => p.name === name);
                const revenue = product ? calculateEstimatedRevenue(product, quantity) : 0;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><span class="rank-badge ${index < 3 ? 'rank-' + (index + 1) : 'rank-default'}">${index + 1}</span></td>
                    <td>${name}</td>
                    <td>${quantity.toLocaleString()}</td>
                    <td>${revenue.toLocaleString()} บาท</td>
                `;
                tbody.appendChild(row);
            });
            if (sortedItems.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="empty-state">ยังไม่มีข้อมูลการขาย</td></tr>';
            }
        }
    };

    // Calculate estimated revenue for a product
    const calculateEstimatedRevenue = (product, quantity) => {
        if (!product || !product.category_id) return 0;
        const priceResult = calculatePrice(parseInt(product.category_id), quantity);
        return priceResult.price || 0;
    };

    // Render Bottom 3 Products
    const renderBottom3Products = (period = 'month') => {
        const allItems = getTopSellingItems(period);
        const bottom3 = allItems.slice(-3).reverse();

        // Chart (Candlestick-like bar chart)
        if (bottom3ProductsChart) bottom3ProductsChart.destroy();
        const ctx = document.getElementById('bottom3ProductsChart');
        if (ctx) {
            bottom3ProductsChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: bottom3.map(([name]) => name.length > 15 ? name.slice(0, 15) + '...' : name),
                    datasets: [{
                        label: 'จำนวนขาย',
                        data: bottom3.map(([, qty]) => qty),
                        backgroundColor: 'rgba(220, 53, 69, 0.7)',
                        borderColor: 'rgba(220, 53, 69, 1)',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: { x: { beginAtZero: true } }
                }
            });
        }

        // Table
        const tbody = document.getElementById('bottom3-products-list');
        if (tbody) {
            tbody.innerHTML = '';
            bottom3.forEach(([name, quantity], index) => {
                const product = appData.allProducts.find(p => p.name === name);
                const revenue = product ? calculateEstimatedRevenue(product, quantity) : 0;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><span class="rank-badge rank-default">${index + 1}</span></td>
                    <td>${name}</td>
                    <td>${quantity.toLocaleString()}</td>
                    <td>${revenue.toLocaleString()} บาท</td>
                `;
                tbody.appendChild(row);
            });
            if (bottom3.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="empty-state">ยังไม่มีข้อมูล</td></tr>';
            }
        }
    };

    // Render Product Sales Chart (Advanced with product selection)
    const renderProductSalesChartAdvanced = (productId = 'all') => {
        const confirmedOrders = (appData.analytics.orders || []).filter(o => o.status === 'active');
        const today = new Date();
        const salesData = {};

        // Last 30 days
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().slice(0, 10);
            salesData[dateStr] = 0;
        }

        confirmedOrders.forEach(order => {
            const dateStr = order.timestamp.slice(0, 10);
            if (salesData.hasOwnProperty(dateStr)) {
                for (const prodId in order.items) {
                    if (productId === 'all' || prodId == productId) {
                        salesData[dateStr] += order.items[prodId];
                    }
                }
            }
        });

        const labels = Object.keys(salesData).map(d => new Date(d).toLocaleDateString('th-TH', { day: '2-digit', month: 'short' }));
        const data = Object.values(salesData);

        if (productSalesChart) productSalesChart.destroy();
        const ctx = document.getElementById('productSalesChart');
        if (!ctx) return;

        const productName = productId === 'all' ? 'ทั้งหมด' : (appData.allProducts.find(p => p.id == productId)?.name || 'สินค้า');
        
        productSalesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `ยอดขาย: ${productName}`,
                    data: data,
                    borderColor: 'rgba(23, 162, 184, 1)',
                    backgroundColor: 'rgba(23, 162, 184, 0.2)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
            }
        });
    };

    // Render Repeat Products (products ordered multiple times)
    const renderRepeatProducts = () => {
        const confirmedOrders = (appData.analytics.orders || []).filter(o => o.status === 'active');
        const productOrderCounts = {};

        confirmedOrders.forEach(order => {
            for (const prodId in order.items) {
                if (!productOrderCounts[prodId]) {
                    productOrderCounts[prodId] = { orderCount: 0, totalQuantity: 0 };
                }
                productOrderCounts[prodId].orderCount++;
                productOrderCounts[prodId].totalQuantity += order.items[prodId];
            }
        });

        const repeatProducts = Object.entries(productOrderCounts)
            .filter(([, data]) => data.orderCount > 1)
            .map(([prodId, data]) => {
                const product = appData.allProducts.find(p => p.id == prodId);
                return { id: prodId, name: product?.name || 'Unknown', ...data };
            })
            .sort((a, b) => b.orderCount - a.orderCount)
            .slice(0, 10);

        // Chart
        if (repeatProductsChart) repeatProductsChart.destroy();
        const ctx = document.getElementById('repeatProductsChart');
        if (ctx) {
            repeatProductsChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: repeatProducts.map(p => p.name.length > 12 ? p.name.slice(0, 12) + '...' : p.name),
                    datasets: [{
                        label: 'จำนวนครั้งที่ถูกสั่งซ้ำ',
                        data: repeatProducts.map(p => p.orderCount),
                        backgroundColor: 'rgba(111, 66, 193, 0.7)',
                        borderColor: 'rgba(111, 66, 193, 1)',
                        borderWidth: 1
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
            });
        }

        // Table
        const tbody = document.getElementById('repeat-products-list');
        if (tbody) {
            tbody.innerHTML = '';
            repeatProducts.forEach((prod, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><span class="rank-badge ${index < 3 ? 'rank-' + (index + 1) : 'rank-default'}">${index + 1}</span></td>
                    <td>${prod.name}</td>
                    <td>${prod.orderCount.toLocaleString()} ครั้ง</td>
                    <td>${prod.totalQuantity.toLocaleString()}</td>
                `;
                tbody.appendChild(row);
            });
            if (repeatProducts.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="empty-state">ยังไม่มีสินค้าที่ถูกสั่งซ้ำ</td></tr>';
            }
        }
    };

    // Render Busiest Days
    const renderBusiestDays = (period = 'week') => {
        const confirmedOrders = (appData.analytics.orders || []).filter(o => o.status === 'active');
        const today = new Date();
        const dayStats = {};

        let startDate;
        switch(period) {
            case 'week':
                startDate = new Date(today);
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'month':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'year':
                startDate = new Date(today.getFullYear(), 0, 1);
                break;
        }

        confirmedOrders.forEach(order => {
            const orderDate = new Date(order.timestamp);
            if (orderDate >= startDate) {
                const dateStr = order.timestamp.slice(0, 10);
                if (!dayStats[dateStr]) {
                    dayStats[dateStr] = { date: dateStr, orders: 0, revenue: 0 };
                }
                dayStats[dateStr].orders++;
                dayStats[dateStr].revenue += parseFloat(order.total || 0);
            }
        });

        const sortedDays = Object.values(dayStats).sort((a, b) => b.orders - a.orders).slice(0, 10);

        // Chart
        if (busiestDaysChart) busiestDaysChart.destroy();
        const ctx = document.getElementById('busiestDaysChart');
        if (ctx) {
            busiestDaysChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sortedDays.map(d => new Date(d.date).toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })),
                    datasets: [{
                        label: 'จำนวนออเดอร์',
                        data: sortedDays.map(d => d.orders),
                        backgroundColor: 'rgba(255, 193, 7, 0.7)',
                        borderColor: 'rgba(255, 193, 7, 1)',
                        borderWidth: 1
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
            });
        }

        // Table
        const tbody = document.getElementById('busiest-days-list');
        if (tbody) {
            tbody.innerHTML = '';
            sortedDays.forEach((day, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><span class="rank-badge ${index < 3 ? 'rank-' + (index + 1) : 'rank-default'}">${index + 1}</span></td>
                    <td>${new Date(day.date).toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</td>
                    <td>${day.orders.toLocaleString()}</td>
                    <td>${day.revenue.toLocaleString()} บาท</td>
                `;
                tbody.appendChild(row);
            });
            if (sortedDays.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="empty-state">ยังไม่มีข้อมูล</td></tr>';
            }
        }
    };

    // Render Peak Hours (Top 3 time slots)
    const renderPeakHours = () => {
        const confirmedOrders = (appData.analytics.orders || []).filter(o => o.status === 'active');
        const timeSlots = {};
        const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

        // Define 2-3 hour time slots
        const slots = [
            { start: 0, end: 3, label: '00:00 - 03:00' },
            { start: 3, end: 6, label: '03:00 - 06:00' },
            { start: 6, end: 9, label: '06:00 - 09:00' },
            { start: 9, end: 12, label: '09:00 - 12:00' },
            { start: 12, end: 15, label: '12:00 - 15:00' },
            { start: 15, end: 18, label: '15:00 - 18:00' },
            { start: 18, end: 21, label: '18:00 - 21:00' },
            { start: 21, end: 24, label: '21:00 - 24:00' }
        ];

        confirmedOrders.forEach(order => {
            const orderDate = new Date(order.timestamp);
            const dayIndex = orderDate.getDay();
            const hour = orderDate.getHours();
            const slot = slots.find(s => hour >= s.start && hour < s.end);
            if (slot) {
                const key = `${dayIndex}-${slot.label}`;
                if (!timeSlots[key]) {
                    timeSlots[key] = { day: days[dayIndex], dayIndex, slot: slot.label, orders: 0 };
                }
                timeSlots[key].orders++;
            }
        });

        const sortedSlots = Object.values(timeSlots).sort((a, b) => b.orders - a.orders);
        const top3Slots = sortedSlots.slice(0, 3);

        // Chart
        if (peakHoursChart) peakHoursChart.destroy();
        const ctx = document.getElementById('peakHoursChart');
        if (ctx) {
            peakHoursChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sortedSlots.slice(0, 7).map(s => `${s.day} ${s.slot}`),
                    datasets: [{
                        label: 'จำนวนออเดอร์',
                        data: sortedSlots.slice(0, 7).map(s => s.orders),
                        backgroundColor: 'rgba(23, 162, 184, 0.7)',
                        borderColor: 'rgba(23, 162, 184, 1)',
                        borderWidth: 1
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
            });
        }

        // Table
        const tbody = document.getElementById('peak-hours-list');
        if (tbody) {
            tbody.innerHTML = '';
            top3Slots.forEach((slot, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><span class="rank-badge ${index < 3 ? 'rank-' + (index + 1) : 'rank-default'}">${index + 1}</span></td>
                    <td>${slot.day}</td>
                    <td><span class="time-slot">${slot.slot}</span></td>
                    <td>${slot.orders.toLocaleString()}</td>
                `;
                tbody.appendChild(row);
            });
            if (top3Slots.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="empty-state">ยังไม่มีข้อมูล</td></tr>';
            }
        }
    };

    // Render Products with No Orders (7 days / 30 days)
    const renderNoOrdersProducts = () => {
        const confirmedOrders = (appData.analytics.orders || []).filter(o => o.status === 'active');
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Track last order date for each product
        const productLastOrder = {};
        confirmedOrders.forEach(order => {
            const orderDate = new Date(order.timestamp);
            for (const prodId in order.items) {
                if (!productLastOrder[prodId] || orderDate > productLastOrder[prodId]) {
                    productLastOrder[prodId] = orderDate;
                }
            }
        });

        // Find products with no orders in 7 days
        const noOrders7Days = appData.allProducts.filter(prod => {
            const lastOrder = productLastOrder[prod.id];
            return !lastOrder || lastOrder < sevenDaysAgo;
        });

        // Find products with no orders in 30 days
        const noOrders30Days = appData.allProducts.filter(prod => {
            const lastOrder = productLastOrder[prod.id];
            return !lastOrder || lastOrder < thirtyDaysAgo;
        });

        // Update counts
        const count7El = document.getElementById('no-orders-7days-count');
        if (count7El) count7El.textContent = `${noOrders7Days.length} รายการ`;
        
        const count30El = document.getElementById('no-orders-30days-count');
        if (count30El) count30El.textContent = `${noOrders30Days.length} รายการ`;

        // 7 Days Table
        const tbody7 = document.getElementById('no-orders-7days-list');
        if (tbody7) {
            tbody7.innerHTML = '';
            noOrders7Days.slice(0, 20).forEach(prod => {
                const cat = appData.categories.find(c => c.id == prod.category_id);
                const lastOrder = productLastOrder[prod.id];
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${prod.name}</td>
                    <td>${cat?.name || '-'}</td>
                    <td>${lastOrder ? lastOrder.toLocaleDateString('th-TH') : 'ไม่เคยมี'}</td>
                `;
                tbody7.appendChild(row);
            });
            if (noOrders7Days.length === 0) {
                tbody7.innerHTML = '<tr><td colspan="3" class="empty-state">ทุกสินค้ามีออเดอร์ใน 7 วัน</td></tr>';
            }
        }

        // 30 Days Table
        const tbody30 = document.getElementById('no-orders-30days-list');
        if (tbody30) {
            tbody30.innerHTML = '';
            noOrders30Days.slice(0, 20).forEach(prod => {
                const cat = appData.categories.find(c => c.id == prod.category_id);
                const lastOrder = productLastOrder[prod.id];
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${prod.name}</td>
                    <td>${cat?.name || '-'}</td>
                    <td>${lastOrder ? lastOrder.toLocaleDateString('th-TH') : 'ไม่เคยมี'}</td>
                `;
                tbody30.appendChild(row);
            });
            if (noOrders30Days.length === 0) {
                tbody30.innerHTML = '<tr><td colspan="3" class="empty-state">ทุกสินค้ามีออเดอร์ใน 30 วัน</td></tr>';
            }
        }
    };

    // Main function to render all advanced dashboard components
    const renderAdvancedDashboard = () => {
        renderSalesPeriodChart('daily');
        renderCategorySalesTable();
        renderPopularCategories();
        renderTop10Products('month');
        renderBottom3Products('month');
        renderProductSalesChartAdvanced('all');
        renderRepeatProducts();
        renderBusiestDays('week');
        renderPeakHours();
        renderNoOrdersProducts();
        populateProductSelect();
    };

    // ===== END: Advanced Dashboard Functions =====

    const renderTopItems = (period) => {
        const listEl = document.getElementById('top-items-list');
        listEl.innerHTML = '';

        const sortedItems = getTopSellingItems(period).slice(0, 5);

        if (sortedItems.length === 0) {
            listEl.innerHTML = '<li>ยังไม่มีข้อมูลการขาย</li>';
            return;
        }
        sortedItems.forEach(([name, quantity]) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${name}</span><strong>${quantity.toLocaleString()} ชิ้น</strong>`;
            listEl.appendChild(li);
        });
    };

    document.getElementById('top-items-controls').addEventListener('click', (e) => {
        if(e.target.matches('.btn')) {
            document.querySelectorAll('#top-items-controls .btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderTopItems(e.target.dataset.period);
        }
    });

    const renderAdminProductTabs = () => {
        const tabsContainer = document.getElementById('admin-product-tabs');
        tabsContainer.innerHTML = '';
        appData.categories.forEach(cat => {
            const tab = document.createElement('div');
            tab.className = `tab ${cat.id === adminActiveCategoryId ? 'active' : ''}`;
            tab.dataset.id = cat.id;
            tab.textContent = cat.name;
            tab.addEventListener('click', () => {
                adminActiveCategoryId = cat.id;
                document.getElementById('admin-product-search').value = '';
                renderAdminProducts();
                renderAdminProductTabs();
            });
            tabsContainer.appendChild(tab);
        });
    };

    const renderAdminCategories = () => {
        const list = document.getElementById('admin-cat-list');
        list.innerHTML = '';
        const lang = appData.shopSettings.language;
    
        // Sales Mode Controls
        const salesModeContainer = document.getElementById('sales-mode-selector');
        salesModeContainer.style.display = 'block'; // Make it visible
        document.querySelector(`input[name="salesMode"][value="${appData.shopSettings.salesMode}"]`).checked = true;
    
        if (appData.categories.length === 0) {
            list.innerHTML = `<tr><td colspan="4">${lang === 'th' ? 'ยังไม่มีหมวดหมู่' : 'No categories yet'}</td></tr>`;
            return;
        }
    
        appData.categories.forEach(cat => {
            const row = document.createElement('tr');
            const catName = (lang === 'en' && cat.name_en) ? cat.name_en : cat.name;
            const hasPrices = (cat.per_piece_prices && cat.per_piece_prices.length > 0) || (cat.perPiecePrices && cat.perPiecePrices.length > 0);
    
            row.innerHTML = `
                <td>${cat.icon ? `<img src="${cat.icon}" alt="${catName}">` : 'ไม่มี'}</td>
                <td>${catName}</td>
                <td>${cat.min_order_quantity}</td>
                <td>
                    <button class="btn btn-info btn-small btn-view-price" data-id="${cat.id}" ${!hasPrices ? 'disabled' : ''}>${translations[lang].viewPriceBtn}</button>
                    <button class="btn btn-primary btn-small btn-set-price" data-id="${cat.id}">${translations[lang].setPerPiecePriceBtn}</button>
                    <button class="btn btn-secondary btn-small btn-cat-edit" data-id="${cat.id}">${translations[lang].editBtn}</button>
                    <button class="btn btn-danger btn-small btn-cat-delete" data-id="${cat.id}">${translations[lang].deleteBtn}</button>
                </td>
            `;
            list.appendChild(row);
        });
    };

    document.getElementById('admin-cat-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-view-price')) {
            const catId = parseInt(e.target.dataset.id);
            const category = appData.categories.find(c => c.id === catId);
            if (category) {
                const priceDetails = document.getElementById('price-view-details');
                const priceText = [];
                const perPiecePrices = category.per_piece_prices || category.perPiecePrices || [];
                if (perPiecePrices.length > 0) {
                    priceText.push(`<h3>ราคาต่อชิ้น:</h3>`, ...perPiecePrices.sort((a, b) => a.quantity - b.quantity).map(p => `<div>- ${p.quantity} ชิ้น = ${p.price} บาท</div>`));
                }
                priceDetails.innerHTML = priceText.length > 0 ? priceText.join('') : '<div>ไม่ได้ตั้งราคา</div>';
                document.getElementById('price-view-modal').style.display = 'flex';
            }
        }
        if (e.target.classList.contains('btn-set-price')) {
            openPerPiecePriceModal(parseInt(e.target.dataset.id));
        }
    });
    document.getElementById('close-price-view-modal-btn').addEventListener('click', () => {
        document.getElementById('price-view-modal').style.display = 'none';
    });

    const renderAdminProducts = (searchTerm = '', sortOrder = 'default') => {
        const list = document.getElementById('admin-prod-list');
        list.innerHTML = '';
        const lang = appData.shopSettings.language;
        let productsInCategory = appData.allProducts.filter(p => p.category_id === adminActiveCategoryId);

        if (searchTerm) {
            productsInCategory = productsInCategory.filter(p => {
                const prodName = (lang === 'en' && p.name_en) ? p.name_en : p.name;
                return prodName.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }

        const collator = new Intl.Collator(lang === 'th' ? 'th-TH' : 'en-US');
        productsInCategory.sort((a, b) => {
             switch (sortOrder) {
                case 'level':
                    return b.level - a.level;
                case 'name_th':
                    return collator.compare(a.name, b.name);
                case 'name_en':
                     return collator.compare(a.name_en || a.name, b.name_en || b.name);
                default:
                    return a.level - b.level;
            }
        });

        const activeCategory = appData.categories.find(c => c.id === adminActiveCategoryId);
        document.getElementById('admin-current-category-name').textContent = activeCategory ? ((lang === 'en' && activeCategory.name_en) ? activeCategory.name_en : activeCategory.name) : 'กรุณาเลือกหมวดหมู่';

        if (productsInCategory.length === 0) list.innerHTML = '<tr><td colspan="7">ยังไม่มีสินค้าในหมวดนี้</td></tr>';
        else {
            productsInCategory.forEach(prod => {
                const prodName = (lang === 'en' && prod.name_en) ? prod.name_en : prod.name;
                const isHidden = prod.hidden === true;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${prod.icon ? `<img src="${prod.icon}" alt="${prodName}">` : 'ไม่มี'}</td>
                    <td>${prodName}</td>
                    <td>${prod.level}</td>
                    <td>${prod.stock === -1 ? '∞' : prod.stock}</td>
                    <td>
                        <button class="btn btn-eye ${isHidden ? 'btn-warning' : 'btn-info'} btn-small toggle-product-visibility" data-id="${prod.id}" title="${isHidden ? 'แสดงสินค้า' : 'ซ่อนสินค้า'}">
                            ${isHidden ? '👁️‍🗨️' : '👁️'}
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-secondary btn-small btn-edit" data-id="${prod.id}">${translations[lang].editBtn}</button>
                        <button class="btn btn-danger btn-small btn-delete" data-id="${prod.id}">${translations[lang].deleteBtn}</button>
                        <label class="toggle-switch">
                            <input type="checkbox" class="product-status-toggle" data-id="${prod.id}" ${prod.is_available ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </td>
                `;
                list.appendChild(row);
            });
        }
    };

    document.getElementById('admin-product-search').addEventListener('input', (e) => {
        renderAdminProducts(e.target.value.trim());
    });

    const populateCategoryDropdown = () => {
        const select = document.getElementById('prod-category');
        select.innerHTML = '';
        appData.categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    };

    const fontSelect = document.getElementById('shop-font');
    const globalFontSelect = document.getElementById('shop-global-font');
    const sloganFontSelect = document.getElementById('slogan-font');

    const populateFontSelectors = () => {
        FONT_OPTIONS.forEach(font => {
            const option = document.createElement('option');
            option.value = font.value;
            option.textContent = font.name;
            fontSelect.appendChild(option.cloneNode(true));
            globalFontSelect.appendChild(option.cloneNode(true));
            sloganFontSelect.appendChild(option.cloneNode(true));
        });
    };
    populateFontSelectors();

    document.getElementById('copy-customer-link-btn').addEventListener('click', () => {
        const linkInput = document.getElementById('customer-link-display');
        linkInput.select();
        document.execCommand('copy');
        Notify.success('คัดลอกสำเร็จ', 'คัดลอกลิงก์สำเร็จ!');
    });

    // ฟังก์ชันจัดการการแสดง/ซ่อน input field สำหรับตัวอักษรระบุเอง
    const toggleCustomPrefixField = () => {
        const orderFormatSelect = document.getElementById('order-format-select');
        const customLettersGroup = document.getElementById('custom-letters-group');
        
        if (orderFormatSelect.value === 'custom-letters') {
            customLettersGroup.style.display = 'block';
        } else {
            customLettersGroup.style.display = 'none';
        }
    };

    // Event listener สำหรับการเปลี่ยนแปลงรูปแบบเลขออเดอร์
    document.getElementById('order-format-select').addEventListener('change', toggleCustomPrefixField);

    // Event listener สำหรับจำกัดการป้อนตัวอักษรพิมพ์ใหญ์เท่านั้น
    document.getElementById('custom-order-prefix').addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
    });

    document.getElementById('save-shop-info-btn').addEventListener('click', async (e) => {
        showSaveFeedback(e.currentTarget);
        const oldSettings = { ...appData.shopSettings };
        appData.shopSettings.shopName = document.getElementById('shop-name').value;
        appData.shopSettings.slogan = document.getElementById('shop-slogan').value;
        appData.shopSettings.managerName = document.getElementById('manager-name').value;
        appData.shopSettings.shareholderName = document.getElementById('shareholder-name').value;
        appData.shopSettings.orderNumberFormat = document.getElementById('order-format-select').value;
        appData.shopSettings.customOrderPrefix = document.getElementById('custom-order-prefix').value.toUpperCase();
        addLog('Shop Info Updated', `Name: ${oldSettings.shopName} -> ${appData.shopSettings.shopName}`);
        await saveState();
        applyTheme();
    });

    document.getElementById('save-system-fonts-btn').addEventListener('click', async (e) => {
        showSaveFeedback(e.currentTarget);
        addLog('System Fonts Updated', 'Font and style settings were changed.');
        appData.shopSettings.fontFamily = document.getElementById('shop-font').value;
        appData.shopSettings.globalFontFamily = document.getElementById('shop-global-font').value;
        appData.shopSettings.sloganFontFamily = document.getElementById('slogan-font').value;
        appData.shopSettings.shopNameColor = document.getElementById('shop-name-color').value;
        appData.shopSettings.sloganColor = document.getElementById('slogan-color').value;
        appData.shopSettings.globalFontSize = parseFloat(document.getElementById('global-font-size-perc').value);
        appData.shopSettings.mainMenuFontSize = parseFloat(document.getElementById('main-menu-font-size-perc').value);
        appData.shopSettings.subMenuFontSize = parseFloat(document.getElementById('sub-menu-font-size-perc').value);
        appData.shopSettings.shopNameFontSize = parseFloat(document.getElementById('shop-name-font-size').value);
        appData.shopSettings.sloganFontSize = parseFloat(document.getElementById('slogan-font-size').value);
        appData.shopSettings.useLogo = document.getElementById('logo-toggle').checked;
        appData.shopSettings.shopNameEffect = {
            enabled: document.getElementById('effect-toggle').checked,
            offsetX: document.getElementById('effect-offset-x').value,
            offsetY: document.getElementById('effect-offset-y').value,
            blur: document.getElementById('effect-blur').value,
            color: document.getElementById('effect-color').value
        };
        appData.shopSettings.sloganEffect = {
            enabled: document.getElementById('slogan-effect-toggle').checked,
            offsetX: document.getElementById('slogan-effect-offset-x').value,
            offsetY: document.getElementById('slogan-effect-offset-y').value,
            blur: document.getElementById('slogan-effect-blur').value,
            color: document.getElementById('slogan-effect-color').value
        };
        appData.shopSettings.logoEffect = {
            enabled: document.getElementById('logo-effect-toggle').checked,
            offsetX: document.getElementById('logo-effect-offset-x').value,
            offsetY: document.getElementById('logo-effect-offset-y').value,
            blur: document.getElementById('logo-effect-blur').value,
            color: document.getElementById('logo-effect-color').value
        };

        const logoUrl = document.getElementById('logo-url').value.trim();
        const logoFile = document.getElementById('logo-upload').files[0];
        if (logoUrl) {
            appData.shopSettings.logo = logoUrl;
        } else if (logoFile) {
            appData.shopSettings.logo = await readFileAsBase64(logoFile);
        }

        appData.shopSettings.copyrightText = document.getElementById('copyright-text').value;
        appData.shopSettings.copyrightOpacity = document.getElementById('copyright-opacity').value;

        const saSettings = appData.shopSettings.successAnimation;
        saSettings.style = document.getElementById('success-animation-style').value;
        saSettings.size = document.getElementById('success-animation-size').value;
        saSettings.primaryColor = document.getElementById('success-animation-primary-color').value;
        saSettings.secondaryColor = document.getElementById('success-animation-secondary-color').value;
        saSettings.showText = document.getElementById('success-text-toggle').checked;
        saSettings.text = document.getElementById('success-animation-text').value;

        if (typeof saSettings.textPosition === 'object' && saSettings.textPosition !== null) {
            saSettings.textPosition = {
                x: document.getElementById('success-text-offset-x').value,
                y: document.getElementById('success-text-offset-y').value
            };
        }

        saSettings.textSize = document.getElementById('success-text-size').value;
        saSettings.textColor = document.getElementById('success-text-color').value;
        saSettings.textEffect.enabled = document.getElementById('success-text-effect-toggle').checked;
        saSettings.textEffect.offsetX = document.getElementById('success-text-effect-offset-x').value;
        saSettings.textEffect.offsetY = document.getElementById('success-text-effect-offset-y').value;
        saSettings.textEffect.blur = document.getElementById('success-text-effect-blur').value;
        saSettings.textEffect.color = document.getElementById('success-text-effect-color').value;

        await saveState();
        applyTheme();
    });

    document.getElementById('save-background-settings-btn').addEventListener('click', async (e) => {
        showSaveFeedback(e.currentTarget);
        addLog('Background Updated', 'Main background settings changed.');
        appData.shopSettings.backgroundOpacity = document.getElementById('bg-opacity').value;
        appData.shopSettings.backgroundBlur = document.getElementById('bg-blur').value;
        const bgUrl = document.getElementById('bg-url').value.trim();
        const bgFile = document.getElementById('bg-upload').files[0];
        if (bgUrl) {
            appData.shopSettings.backgroundImage = bgUrl;
        } else if (bgFile) {
            appData.shopSettings.backgroundImage = await readFileAsBase64(bgFile);
        }
        await saveState();
        applyTheme();
    });

    document.getElementById('shop-enabled-toggle').addEventListener('change', async (e) => {
            appData.shopSettings.shopEnabled = e.target.checked;
            addLog('Shop Status Changed', `Shop set to ${e.target.checked ? 'Open' : 'Closed'}`);
            updateMarquees();
            if (views.customer.classList.contains('active')) {
                renderProducts(searchBox.value.trim());
                checkOrderValidation();
            }
            await saveState();
        });

        document.getElementById('announcement-enabled-toggle').addEventListener('change', async (e) => {
            appData.shopSettings.announcementEnabled = e.target.checked;
            addLog('Announcement Changed', `Set to ${e.target.checked ? 'On' : 'Off'}`);
            updateMarquees();
            await saveState();
        });

        document.getElementById('change-password-btn').addEventListener('click', async (e) => {
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const errorMsg = document.getElementById('password-change-error');
            const successMsg = document.getElementById('password-change-success');

            errorMsg.textContent = '';
            successMsg.textContent = '';

            if (!currentPassword || !newPassword || !confirmPassword) {
                errorMsg.textContent = 'กรุณากรอกข้อมูลให้ครบถ้วน';
                return;
            }

            if (newPassword.length < 4) {
                errorMsg.textContent = 'รหัสผ่านใหม่ต้องมีอย่างน้อย 4 ตัวอักษร';
                return;
            }

            if (newPassword !== confirmPassword) {
                errorMsg.textContent = 'รหัสผ่านใหม่ไม่ตรงกัน';
                return;
            }

            try {
                showSaveFeedback(e.currentTarget);
                
                const response = await fetchWithAuth(API_SAVE_ENDPOINT, {
                    method: 'POST',
                    body: JSON.stringify({
                        adminPin: newPassword // ส่งแค่ pin ใหม่
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'เปลี่ยนรหัสผ่านไม่สำเร็จ');
                }
                
                successMsg.textContent = 'เปลี่ยนรหัสผ่านสำเร็จแล้ว!';
                addLog('Admin Password Changed', 'Admin password was changed successfully.');
                
                document.getElementById('current-password').value = '';
                document.getElementById('new-password').value = '';
                document.getElementById('confirm-password').value = '';

                setTimeout(() => {
                    successMsg.textContent = '';
                }, 5000);

            } catch (error) {
                console.error('Password change error:', error);
                errorMsg.textContent = 'เกิดข้อผิดพลาด: ' + error.message;
            }
        });

        // ===== START: PRICE TAG UPDATE (Save Button Fix) =====
        document.getElementById('save-price-tag-config-btn').addEventListener('click', async (e) => {
            const errorMsg = document.getElementById('price-tag-config-error');
            const successMsg = document.getElementById('price-tag-config-success');

            errorMsg.textContent = '';
            successMsg.textContent = '';

            try {
                showSaveFeedback(e.currentTarget);

                // สร้าง object ที่จะบันทึก โดยผสานกับของเดิม
                const priceTagConfig = {
                    ...appData.shopSettings.priceTagConfig, // คงค่าเดิมอื่นๆ (เช่น storeName, category ถ้ามี)
                    closingMessage: document.getElementById('price-tag-closing-message').value.trim() // อัปเดตเฉพาะ closingMessage
                };

                // อัปเดต appData ทันที
                appData.shopSettings.priceTagConfig = priceTagConfig;

                // ส่งข้อมูลเฉพาะส่วนที่อัปเดตไปที่ backend
                // backend (save-data.js) ถูกแก้ไขให้ใช้การ deepMerge แล้ว
                const response = await fetchWithAuth(API_SAVE_ENDPOINT, {
                    method: 'POST',
                    body: JSON.stringify({
                        shopSettings: { priceTagConfig: priceTagConfig } 
                    })
                });
                
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'บันทึกการตั้งค่าป้ายราคาไม่สำเร็จ');
                }

                successMsg.textContent = 'บันทึกการตั้งค่าป้ายราคาสำเร็จ!';
                addLog('Price Tag Config Updated', 'Price tag configuration (closingMessage) was updated.');
                
                setTimeout(() => {
                    successMsg.textContent = '';
                }, 3000);

            } catch (error) {
                console.error('Price tag config error:', error);
                errorMsg.textContent = 'เกิดข้อผิดพลาด: ' + error.message;
            }
        });
        // ===== END: PRICE TAG UPDATE (Save Button Fix) =====


        document.getElementById('category-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            showSaveFeedback(submitBtn);

            const name = document.getElementById('cat-name').value.trim();
            if (!name) {
                Notify.warning('กรุณากรอกข้อมูล', 'กรุณากรอกชื่อหมวดหมู่ (ภาษาไทย)');
                submitBtn.disabled = false;
                submitBtn.textContent = translations[appData.shopSettings.language].saveCategoryBtn;
                return;
            }

            const iconUrl = document.getElementById('cat-icon-url').value.trim();
            const iconFile = document.getElementById('cat-icon-upload').files[0];
            let iconData = editingCategoryId ? appData.categories.find(c => c.id === editingCategoryId)?.icon : null;

            if (iconUrl) {
                iconData = iconUrl;
            } else if (iconFile) {
                iconData = await readFileAsBase64(iconFile);
            }

            const existingCategory = appData.categories.find(c => c.id === editingCategoryId);

            const categoryData = {
                name,
                name_en: document.getElementById('cat-name-en').value.trim(),
                icon: iconData,
                min_order_quantity: parseInt(document.getElementById('cat-min-order').value) || 0,
                max_order_quantity: parseInt(document.getElementById('cat-max-order').value) || null,
                per_piece_prices: existingCategory ? (existingCategory.per_piece_prices || existingCategory.perPiecePrices || []) : [],
                sort_order: existingCategory ? (existingCategory.sort_order || 99) : (appData.categories.length + 1),
            };

            try {
                const url = editingCategoryId ? `${API_CATEGORIES_CRUD_ENDPOINT}?id=${editingCategoryId}` : API_CATEGORIES_CRUD_ENDPOINT;
                const method = editingCategoryId ? 'PUT' : 'POST';

                const response = await fetchWithAuth(url, {
                    method: method,
                    body: JSON.stringify(categoryData)
                });

                if (!response.ok) throw new Error((await response.json()).error || 'Failed to save category');

                addLog(editingCategoryId ? 'Category Updated' : 'Category Created', `Name: '${categoryData.name}'`);

                await loadCustomerData();
                if(isAdminLoggedIn) await loadAdminData();

                resetCategoryForm();
                renderAdminPanel();
                renderCustomerView();
            } catch (error) {
                console.error("Error saving category:", error);
                Notify.error('ผิดพลาด', `เกิดข้อผิดพลาดในการบันทึกหมวดหมู่: ${error.message}`);
                submitBtn.disabled = false;
            }
        });

        const deleteCategory = async (id) => {
            const categoryToDelete = appData.categories.find(c => c.id === id);
            if (!categoryToDelete) return;

            const confirmed = await Notify.confirm(
                'ยืนยันการลบหมวดหมู่',
                `การลบหมวดหมู่ "${categoryToDelete.name}" จะลบสินค้าทั้งหมดในหมวดหมู่นั้นด้วย ยืนยันหรือไม่?`
            );

            if (confirmed) {
                try {
                    const response = await fetchWithAuth(`${API_CATEGORIES_CRUD_ENDPOINT}?id=${id}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) throw new Error((await response.json()).error || 'Failed to delete category');

                    addLog('Category Deleted', `Name: '${categoryToDelete.name}' and all its products.`);

                    await loadCustomerData();
                    if(isAdminLoggedIn) await loadAdminData();

                    if (appData.categories.length > 0) {
                        if (!appData.categories.find(c => c.id === activeCategoryId)) activeCategoryId = appData.categories[0].id;
                        if (!appData.categories.find(c => c.id === adminActiveCategoryId)) adminActiveCategoryId = appData.categories[0].id;
                    } else {
                        activeCategoryId = null;
                        adminActiveCategoryId = null;
                    }
                    renderAdminPanel();
                    renderCustomerView();

                } catch(error) {
                    console.error("Error deleting category:", error);
                    Notify.error('ผิดพลาด', 'เกิดข้อผิดพลาดในการลบหมวดหมู่: ' + error.message);
                }
            }
        };

        document.getElementById('product-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            showSaveFeedback(submitBtn);

            const prodUrl = document.getElementById('prod-icon-url').value.trim();
            const prodFile = document.getElementById('prod-icon-upload').files[0];
            let iconData = '';
            const existingProduct = appData.allProducts.find(p => p.id === editingProductId);

            if (prodUrl) iconData = prodUrl;
            else if (prodFile) iconData = await readFileAsBase64(prodFile);
            else if(existingProduct) iconData = existingProduct.icon || '';

            const productData = {
                name: document.getElementById('prod-name').value,
                name_en: document.getElementById('prod-name-en').value,
                level: parseInt(document.getElementById('prod-level').value) || 0,
                category_id: parseInt(document.getElementById('prod-category').value),
                stock: parseInt(document.getElementById('prod-stock').value) || -1,
                is_available: existingProduct ? existingProduct.is_available : true,
                hidden: existingProduct ? existingProduct.hidden : false,
                icon: iconData,
                unavailable_message: document.getElementById('prod-unavailable-message').value,
            };

            if (!productData.name) {
                Notify.warning('กรุณากรอกข้อมูล', 'กรุณากรอกชื่อสินค้า (ภาษาไทย)');
                submitBtn.disabled = false; return;
            }
            if (isNaN(productData.category_id)) {
                Notify.warning('กรุณากรอกข้อมูล', 'กรุณาเลือกหมวดหมู่สินค้า');
                submitBtn.disabled = false; return;
            }

            try {
                const url = editingProductId ? `${API_PRODUCTS_CRUD_ENDPOINT}?id=${editingProductId}` : API_PRODUCTS_CRUD_ENDPOINT;
                const method = editingProductId ? 'PUT' : 'POST';

                const response = await fetchWithAuth(url, {
                    method: method,
                    body: JSON.stringify(productData)
                });

                if (!response.ok) throw new Error((await response.json()).error || 'Failed to save product');

                addLog(editingProductId ? 'Product Updated' : 'Product Created', `Name: '${productData.name}'`);

                await loadCustomerData();
                if(isAdminLoggedIn) await loadAdminData();

                resetProductForm();
                adminActiveCategoryId = productData.category_id;
                renderAdminProductTabs();
                renderAdminProducts();
                renderCustomerView();
            } catch (error) {
                console.error("Error saving product:", error);
                Notify.error('ผิดพลาด', `เกิดข้อผิดพลาดในการบันทึกสินค้า: ${error.message}`);
                submitBtn.disabled = false;
            }
        });

        document.getElementById('admin-prod-list').addEventListener('click', async (e) => {
            const editBtn = e.target.closest('.btn-edit');
            const deleteBtn = e.target.closest('.btn-delete');
            const eyeBtn = e.target.closest('.toggle-product-visibility');

            if (editBtn) {
                const id = parseInt(editBtn.dataset.id);
                const product = appData.allProducts.find(p => p.id === id);
                if (product) {
                    editingProductId = id;
                    document.getElementById('prod-name').value = product.name;
                    document.getElementById('prod-name-en').value = product.name_en || '';
                    document.getElementById('prod-level').value = product.level;
                    document.getElementById('prod-stock').value = product.stock;
                    document.getElementById('prod-category').value = product.category_id;
                    document.getElementById('prod-icon-preview').style.backgroundImage = product.icon ? `url(${product.icon})` : 'none';
                    document.getElementById('prod-icon-url').value = product.icon?.startsWith('http') ? product.icon : '';
                    document.getElementById('prod-unavailable-message').value = product.unavailable_message || '';
                    document.getElementById('cancel-edit-btn').style.display = 'inline-block';
                    document.getElementById('product-form').scrollIntoView();
                }
            }

            if (deleteBtn) {
                const id = parseInt(deleteBtn.dataset.id);
                const productToDelete = appData.allProducts.find(p => p.id === id);
                if (productToDelete) {
                    const confirmed = await Notify.confirm(
                        'ยืนยันการลบสินค้า',
                        `คุณต้องการลบสินค้า "${productToDelete.name}" ใช่หรือไม่?`
                    );
                    if (confirmed) {
                        try {
                            const response = await fetchWithAuth(`${API_PRODUCTS_CRUD_ENDPOINT}?id=${id}`, {
                                method: 'DELETE'
                            });
                            if (!response.ok) throw new Error('Failed to delete product from server');

                            addLog('Product Deleted', `Name: '${productToDelete.name}'`);

                            await loadCustomerData();
                            if(isAdminLoggedIn) await loadAdminData();

                            renderAdminProducts();
                            renderCustomerView();
                        } catch(error) {
                            console.error("Error deleting product:", error);
                            Notify.error('ผิดพลาด', 'เกิดข้อผิดพลาดในการลบสินค้า');
                        }
                    }
                }
            }

            if (eyeBtn) {
                const id = parseInt(eyeBtn.dataset.id);
                const product = appData.allProducts.find(p => p.id === id);
                if (product) {
                    const newHiddenState = !product.hidden;
                    try {
                        const response = await fetchWithAuth(`${API_PRODUCTS_CRUD_ENDPOINT}?id=${id}`, {
                            method: 'PUT',
                            body: JSON.stringify({ hidden: newHiddenState })
                        });
                        if (!response.ok) throw new Error('Failed to update product visibility');

                        product.hidden = newHiddenState;
                        addLog('Product Visibility Changed', `Product '${product.name}' is now ${newHiddenState ? 'hidden' : 'visible'}`);

                        renderAdminProducts();
                        renderCustomerView();
                        
                        const action = newHiddenState ? 'ซ่อน' : 'แสดง';
                        Notify.success('สำเร็จ', `สินค้า "${product.name}" ถูก${action}เรียบร้อยแล้ว`);
                    } catch(error) {
                        console.error("Error updating product visibility:", error);
                        Notify.error('ผิดพลาด', 'เกิดข้อผิดพลาดในการอัพเดทสถานะสินค้า');
                    }
                }
            }
        });

        document.getElementById('admin-prod-list').addEventListener('change', async (e) => {
            if (e.target.classList.contains('product-status-toggle')) {
                const productId = parseInt(e.target.dataset.id);
                const isEnabled = e.target.checked;
                const product = appData.allProducts.find(p => p.id === productId);

                if (product) {
                    try {
                        const response = await fetchWithAuth(`${API_PRODUCTS_CRUD_ENDPOINT}?id=${productId}`, {
                            method: 'PUT',
                            body: JSON.stringify({ is_available: isEnabled })
                        });
                        if (!response.ok) throw new Error('Failed to update product status');
                        
                        product.is_available = isEnabled;
                        addLog('Product Status Changed', `Product '${product.name}' is now ${isEnabled ? 'enabled' : 'disabled'}`);
                        
                        if (views.customer.classList.contains('active')) {
                            renderProducts(searchBox.value.trim());
                        }
                    } catch (error) {
                        console.error("Error updating product status:", error);
                        Notify.error('ผิดพลาด', 'เกิดข้อผิดพลาดในการอัปเดตสถานะ');
                        e.target.checked = !isEnabled;
                    }
                }
            }
        });


        const resetCategoryForm = () => {
            editingCategoryId = null;
            document.getElementById('category-form').reset();
            document.getElementById('cat-min-order').value = 30;
            document.getElementById('cat-max-order').value = '';
            document.getElementById('submit-cat-btn').textContent = translations[appData.shopSettings.language].saveCategoryBtn;
            document.getElementById('cancel-cat-edit-btn').style.display = 'none';
            document.getElementById('cat-icon-preview').style.backgroundImage = 'none';
        }

        document.getElementById('cancel-cat-edit-btn').addEventListener('click', resetCategoryForm);

        document.getElementById('admin-cat-list').addEventListener('click', (e) => {
            const editBtn = e.target.closest('.btn-cat-edit');
            const deleteBtn = e.target.closest('.btn-cat-delete');
            if (editBtn) {
                const id = parseInt(editBtn.dataset.id);
                const category = appData.categories.find(c => c.id === id);
                if (category) {
                    editingCategoryId = id;
                    document.getElementById('cat-name').value = category.name;
                    document.getElementById('cat-name-en').value = category.name_en || '';
                    document.getElementById('cat-min-order').value = category.min_order_quantity;
                    document.getElementById('cat-max-order').value = category.max_order_quantity || '';
                    document.getElementById('cat-icon-preview').style.backgroundImage = category.icon ? `url(${category.icon})` : 'none';
                    document.getElementById('cat-icon-url').value = category.icon?.startsWith('http') ? category.icon : '';
                    document.getElementById('submit-cat-btn').textContent = translations[appData.shopSettings.language].saveBtn;
                    document.getElementById('cancel-cat-edit-btn').style.display = 'inline-block';
                    document.getElementById('category-form').scrollIntoView();
                }
            }
            if (deleteBtn) deleteCategory(parseInt(deleteBtn.dataset.id));
        });

        document.getElementById('cancel-edit-btn').addEventListener('click', resetProductForm);

        function resetProductForm() {
            editingProductId = null;
            document.getElementById('product-form').reset();
            document.getElementById('prod-stock').value = -1;
            document.getElementById('prod-unavailable-message').value = '';
            document.getElementById('cancel-edit-btn').style.display = 'none';
            document.getElementById('prod-icon-preview').style.backgroundImage = 'none';
        }

        const renderStockSettingsPage = () => {
            const listContainer = document.getElementById('stock-settings-category-list');
            listContainer.innerHTML = '';

            appData.categories.forEach(cat => {
                const threshold = appData.shopSettings.dbCategoryLowStockThresholds[cat.id] ?? appData.shopSettings.lowStockThreshold;
                const item = document.createElement('div');
                item.className = 'low-stock-category-item';
                item.innerHTML = `
                    <span>${cat.name}</span>
                    <input type="number" class="low-stock-threshold-input" data-cat-id="${cat.id}" value="${threshold}" min="0">
                `;
                listContainer.appendChild(item);
            });
        };

        const setupStockSettingsListeners = () => {
             // NEW: Sales Mode Listener
            document.querySelectorAll('input[name="salesMode"]').forEach(radio => {
                radio.addEventListener('change', async (e) => {
                    appData.shopSettings.salesMode = e.target.value;
                    addLog('Sales Mode Changed', `Mode set to ${e.target.value}`);
                    await saveState();
                    // Re-render the pricing modal if it's open, or just update the logic for next time
                    if (document.getElementById('per-piece-price-modal').style.display === 'flex' && editingCategoryId) {
                        openPerPiecePriceModal(editingCategoryId);
                    }
                    renderViewOrderModal(); // Update cart modal with new +/- steps
                });
            });

            document.getElementById('save-stock-settings-btn').addEventListener('click', async (e) => {
                showSaveFeedback(e.currentTarget);
                addLog('Stock Thresholds Updated', 'Low stock alert thresholds were changed.');
                const inputs = document.querySelectorAll('#stock-settings-category-list .low-stock-threshold-input');
                inputs.forEach(input => {
                    const catId = input.dataset.catId;
                    const threshold = parseInt(input.value);
                    if (!isNaN(threshold) && threshold >= 0) {
                        appData.shopSettings.dbCategoryLowStockThresholds[catId] = threshold;
                    }
                });
                await saveState();
                renderLowStockAlertWidget();
            });
        };

        const resetConfirmModal = document.getElementById('reset-confirm-modal');
        const confirmResetBtn = document.getElementById('confirm-reset-btn');
        const cancelResetBtn = document.getElementById('cancel-reset-btn');
        let currentResetContext = null;

        const openResetModal = (context) => {
            currentResetContext = context;
            resetConfirmModal.style.display = 'flex';
        };

        document.getElementById('reset-analytics-btn').addEventListener('click', () => openResetModal('analytics'));
        document.getElementById('reset-orders-btn').addEventListener('click', () => openResetModal('orders'));
        document.getElementById('reset-logs-btn').addEventListener('click', () => openResetModal('logs'));
        cancelResetBtn.addEventListener('click', () => resetConfirmModal.style.display = 'none');

        confirmResetBtn.addEventListener('click', async () => {
            const period = document.getElementById('reset-period-select').value;
            const now = new Date();
            const today = now.toISOString().slice(0, 10);
            const weekStart = new Date(now);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            const weekStartStr = weekStart.toISOString().slice(0, 10);
            const monthStartStr = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);

            const confirmed = await Notify.confirm(
                'ยืนยันการรีเซ็ตข้อมูล',
                `คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตข้อมูล (${period})? การกระทำนี้ไม่สามารถย้อนกลับได้`,
                null,
                { type: 'danger' }
            );

            if (confirmed) {
                addLog('Data Reset', `Context: ${currentResetContext}, Period: ${period}`);
                if (currentResetContext === 'analytics') {
                    if (period === 'all') appData.analytics = { ...appData.analytics, dailyTraffic: Array(7).fill(0), hourlyTraffic: Array(24).fill(0), productSales: {}, orders: [], totalSales: 0, monthlyProfit: 0 };
                    else {
                        Notify.info('แจ้งเตือน', 'การรีเซ็ตสถิติตามช่วงเวลาจะรีเซ็ตเฉพาะกราฟและตัวเลขสรุป แต่ข้อมูลออเดอร์จะยังคงอยู่');
                        appData.analytics.dailyTraffic = Array(7).fill(0);
                        appData.analytics.hourlyTraffic = Array(24).fill(0);
                        appData.analytics.productSales = {};
                    }
                    renderDashboard();
                } else if (currentResetContext === 'orders') {
                    if (period === 'all') appData.analytics.orders = [];
                    else {
                        appData.analytics.orders = appData.analytics.orders.filter(order => {
                            const orderDate = order.timestamp.slice(0, 10);
                            if (period === 'day') return orderDate !== today;
                            if (period === 'week') return orderDate < weekStartStr;
                            if (period === 'month') return orderDate < monthStartStr;
                            return true;
                        });
                    }
                    renderOrderNumberView();
                } else if (currentResetContext === 'logs') {
                    if (period === 'all') appData.analytics.logs = [];
                    else {
                        appData.analytics.logs = appData.analytics.logs.filter(log => {
                            const logDate = log.timestamp.slice(0, 10);
                            if (period === 'day') return logDate !== today;
                            if (period === 'week') return logDate < weekStartStr;
                            if (period === 'month') return logDate < monthStartStr;
                            return true;
                        });
                    }
                    renderLogs();
                }
                await saveState();
                Notify.success('รีเซ็ทสำเร็จ', 'ข้อมูลถูกรีเซ็ตเรียบร้อยแล้ว');
            }
            resetConfirmModal.style.display = 'none';
        });

        const openPerPiecePriceModal = (catId) => {
            const category = appData.categories.find(c => c.id === catId);
            if (!category) return;
        
            editingCategoryId = catId;
            const perPiecePriceModal = document.getElementById('per-piece-price-modal');
            const perPiecePriceForm = document.getElementById('per-piece-price-form');
            const modalTitle = perPiecePriceModal.querySelector('h2');
            const modalInfo = perPiecePriceModal.querySelector('p');
        
            modalTitle.textContent = `ตั้งราคา - ${category.name}`;
            perPiecePriceForm.innerHTML = '';
            const prices = category.per_piece_prices || category.perPiecePrices || [];
        
            if (appData.shopSettings.salesMode === 'pieces') {
                modalInfo.textContent = "กำหนดราคาสำหรับแต่ละจำนวนชิ้น (1-1000)";
                for (let i = 1; i <= 1000; i++) {
                    const priceItem = prices.find(p => p.quantity === i);
                    const div = document.createElement('div');
                    div.className = 'form-group';
                    div.innerHTML = `<label>${i} ชิ้น: <input type="number" class="per-piece-price-input" data-quantity="${i}" value="${priceItem ? priceItem.price : ''}" placeholder="ราคา"></label>`;
                    perPiecePriceForm.appendChild(div);
                }
            } else { // 'tens' mode
                modalInfo.textContent = "กำหนดราคาสำหรับทุกๆ 10 ชิ้น";
                for (let i = 10; i <= 1000; i += 10) {
                    const priceItem = prices.find(p => p.quantity === i);
                    const div = document.createElement('div');
                    div.className = 'form-group';
                    div.innerHTML = `<label>${i} ชิ้น: <input type="number" class="per-piece-price-input" data-quantity="${i}" value="${priceItem ? priceItem.price : ''}" placeholder="ราคา (บาท)"></label>`;
                    perPiecePriceForm.appendChild(div);
                }
            }
            perPiecePriceModal.style.display = 'flex';
        };

        document.getElementById('close-per-piece-price-modal-btn').addEventListener('click', () => document.getElementById('per-piece-price-modal').style.display = 'none');

        document.getElementById('save-per-piece-price-btn').addEventListener('click', async (e) => {
            showSaveFeedback(e.currentTarget);
            const category = appData.categories.find(c => c.id === editingCategoryId);
            if (category) {
                addLog('Pricing Updated', `Per-piece prices for category '${category.name}' were changed.`);
                const newPrices = [];
                document.querySelectorAll('#per-piece-price-form .per-piece-price-input').forEach(input => {
                    const quantity = parseInt(input.dataset.quantity);
                    const price = parseFloat(input.value);
                    if (!isNaN(price) && price > 0) {
                        newPrices.push({ quantity, price });
                    }
                });
                category.per_piece_prices = newPrices;

                try {
                    const response = await fetchWithAuth(`${API_CATEGORIES_CRUD_ENDPOINT}?id=${editingCategoryId}`, {
                        method: 'PUT',
                        body: JSON.stringify(category)
                    });
                    if (!response.ok) throw new Error('Failed to save prices');
                    if(isAdminLoggedIn) await loadAdminData();
                } catch(err) {
                    Notify.error('Error', 'Error saving prices: ' + err.message);
                }

                document.getElementById('per-piece-price-modal').style.display = 'none';
            }
        });

        const renderSubAdmins = () => {
            const list = document.getElementById('sub-admin-list');
            list.innerHTML = '';
            if (!appData.subAdmins || appData.subAdmins.length === 0) {
                 list.innerHTML = '<tr><td colspan="3">ยังไม่มีผู้ใช้ย่อย</td></tr>';
            }
            else {
                appData.subAdmins.forEach(sa => {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${sa.name}</td><td>****</td><td><button class="btn btn-secondary btn-small btn-sub-admin-edit" data-id="${sa.id}">แก้ไข</button><button class="btn btn-danger btn-small btn-sub-admin-delete" data-id="${sa.id}">ลบ</button></td>`;
                    list.appendChild(row);
                });
            }
        };

        const subAdminForm = document.getElementById('sub-admin-form');
        subAdminForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            showSaveFeedback(submitBtn);
            const name = document.getElementById('sub-admin-name').value.trim();
            const pin = document.getElementById('sub-admin-pin').value;
            
            try {
                if (editingSubAdminId) {
                    const subAdmin = appData.subAdmins.find(sa => sa.id === editingSubAdminId);
                    if (subAdmin) {
                        if (!name) {
                            Notify.warning('กรุณากรอกข้อมูล', 'กรุณากรอกชื่อผู้ใช้'); return;
                        }
                        addLog('Sub-Admin Updated', `Name: '${subAdmin.name}' -> '${name}'`);
                        subAdmin.name = name;
                        if (pin) {
                             if (pin.length < 4) { Notify.warning('กรุณากรอกข้อมูล', 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร'); return; }
                            subAdmin.pin = pin; // Store plain pin temporarily
                        } else {
                            delete subAdmin.pin; // Ensure pin is not sent if empty
                        }
                    }
                } else {
                    if (!name || !pin) {
                        Notify.warning('กรุณากรอกข้อมูล', 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน'); return;
                    }
                     if (pin.length < 4) { Notify.warning('กรุณากรอกข้อมูล', 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร'); return; }
                    if (appData.subAdmins.length >= 20) { Notify.warning('ถึงขีดจำกัด', 'ไม่สามารถเพิ่มผู้ใช้ย่อยได้เกิน 20 คน'); return; }
                    const newSubAdmin = { id: -(generateId()), name, pin, permissions: {'admin': true, 'festival': true, 'stock': true, 'order-number': true, 'dashboard': true, 'manage-account': true, 'grid-layout': true, 'order-bar': true, 'manage-stores': true} };
                    if (!appData.subAdmins) appData.subAdmins = [];
                    appData.subAdmins.push(newSubAdmin);
                    addLog('Sub-Admin Created', `Name: '${name}'`);
                }
                
                await saveState(); // This will send subAdmins array (with plain pin if set) to backend
                
                // Clear plain text pin from local appData after save
                appData.subAdmins.forEach(sa => { if (sa.pin) delete sa.pin; });

                resetSubAdminForm();
                renderSubAdmins();
            } catch (error) {
                console.error("Failed to save sub-admin:", error);
                Notify.error('Error', 'Error saving data: Failed to save data.');
            }
        });

        const resetSubAdminForm = () => {
            editingSubAdminId = null;
            subAdminForm.reset();
            document.getElementById('add-sub-admin-btn').textContent = translations[appData.shopSettings.language].addUserBtn;
            document.getElementById('cancel-sub-admin-edit').style.display = 'none';
        };

        document.getElementById('cancel-sub-admin-edit').addEventListener('click', resetSubAdminForm);

        document.getElementById('sub-admin-list').addEventListener('click', async (e) => {
            const id = parseInt(e.target.dataset.id);
            if (e.target.classList.contains('btn-sub-admin-edit')) {
                const subAdmin = appData.subAdmins.find(sa => sa.id === id);
                if (subAdmin) {
                    editingSubAdminId = id;
                    document.getElementById('sub-admin-name').value = subAdmin.name;
                    document.getElementById('sub-admin-pin').placeholder = "กรอกรหัสผ่านใหม่เพื่อเปลี่ยน";
                    document.getElementById('sub-admin-pin').required = false; // Not required when editing
                    document.getElementById('add-sub-admin-btn').textContent = translations[appData.shopSettings.language].saveBtn;
                    document.getElementById('cancel-sub-admin-edit').style.display = 'inline-block';
                }
            }
            if (e.target.classList.contains('btn-sub-admin-delete')) {
                const subAdminToDelete = appData.subAdmins.find(sa => sa.id === id);
                if (subAdminToDelete) {
                    const confirmed = await Notify.confirm(
                        'ยืนยันการลบผู้ใช้ย่อย',
                        `ยืนยันการลบผู้ใช้ย่อย "${subAdminToDelete.name}" หรือไม่?`
                    );
                    if (confirmed) {
                        addLog('Sub-Admin Deleted', `Name: '${subAdminToDelete.name}'`);
                        appData.subAdmins = appData.subAdmins.filter(sa => sa.id !== id);
                        await saveState();
                        renderSubAdmins();
                    }
                }
            }
        });

        const permissionModal = document.getElementById('permission-modal');
        let currentSubAdminPermissionsId = null;
        document.getElementById('view-permissions-btn').addEventListener('click', () => {
            if (appData.subAdmins.length === 0) { Notify.info('แจ้งเตือน', 'ยังไม่มีผู้ใช้ย่อย'); return; }
            const permissionList = document.getElementById('permission-list');
            permissionList.innerHTML = '';
            const subAdmin = appData.subAdmins[0];
            if (!subAdmin) return;
            currentSubAdminPermissionsId = subAdmin.id;
            document.getElementById('permission-user-name').textContent = `ตั้งค่าสิทธิ์สำหรับ: ${subAdmin.name}`;
            const lang = appData.shopSettings.language;
            appData.menuOrder.forEach(key => {
                const translationKey = MENU_NAMES[key];
                const li = document.createElement('li');
                li.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;';
                li.innerHTML = `<span>${translations[lang][translationKey]}</span><label class="toggle-switch"><input type="checkbox" data-menu-key="${key}" ${subAdmin.permissions[key] ? 'checked' : ''}><span class="slider"></span></label>`;
                permissionList.appendChild(li);
            });
            permissionModal.style.display = 'flex';
        });

        document.getElementById('save-permissions-btn').addEventListener('click', async (e) => {
            showSaveFeedback(e.currentTarget);
            const subAdmin = appData.subAdmins.find(sa => sa.id === currentSubAdminPermissionsId);
            if (subAdmin) {
                addLog('Permissions Updated', `Permissions changed for user '${subAdmin.name}'.`);
                const newPermissions = {};
                document.getElementById('permission-list').querySelectorAll('input[type="checkbox"]').forEach(input => {
                    newPermissions[input.dataset.menuKey] = input.checked;
                });
                subAdmin.permissions = newPermissions;
                await saveState();
                permissionModal.style.display = 'none';
            }
        });

        document.getElementById('close-permission-modal-btn').addEventListener('click', () => permissionModal.style.display = 'none');

        document.getElementById('close-store-detail-modal-btn').addEventListener('click', () => {
            const modal = document.getElementById('store-registration-detail-modal');
            if (modal) modal.style.display = 'none';
        });

        document.getElementById('confirm-approve-btn').addEventListener('click', () => {
            ManagerStore.confirmApproveRegistration();
        });

        document.getElementById('cancel-approve-btn').addEventListener('click', () => {
            ManagerStore.hideApproveModal();
        });

        const reorderMenuModal = document.getElementById('reorder-menu-modal');
        const renderReorderMenuModal = (e, context) => {
            e.stopPropagation();
            reorderMenuContext = context;
            const reorderMenuList = document.getElementById('reorder-menu-list');
            reorderMenuList.innerHTML = '';
            const lang = appData.shopSettings.language;
            const menuList = reorderMenuContext === 'main' 
                ? appData.menuOrder 
                : (appData.shopSettings.menuOrderManageStores || Object.keys(SUB_MENUS['manage-stores']));

            const nameMap = reorderMenuContext === 'main' ? MENU_NAMES : SUB_MENUS['manage-stores'];

            menuList.forEach(key => {
                const translationKey = nameMap[key];
                const li = document.createElement('li');
                li.textContent = translations[lang][translationKey] || key;
                li.dataset.menu = key;
                li.draggable = true;
                li.classList.add('sortable');
                reorderMenuList.appendChild(li);
            });
            reorderMenuModal.style.display = 'flex';
            addDragDropListeners();
        };

        const addDragDropListeners = () => {
            const container = document.getElementById('reorder-menu-list');
            let draggedItem = null;
            container.querySelectorAll('.sortable').forEach(item => {
                item.addEventListener('dragstart', () => { draggedItem = item; setTimeout(() => item.classList.add('dragging'), 0); });
                item.addEventListener('dragend', () => { if(draggedItem) draggedItem.classList.remove('dragging'); draggedItem = null; });
            });
            container.addEventListener('dragover', (e) => {
                e.preventDefault();
                const afterElement = [...container.querySelectorAll('.sortable:not(.dragging)')].reduce((closest, child) => {
                    const box = child.getBoundingClientRect();
                    const offset = e.clientY - box.top - box.height / 2;
                    return (offset < 0 && offset > closest.offset) ? { offset: offset, element: child } : closest;
                }, { offset: Number.NEGATIVE_INFINITY }).element;
                if (afterElement == null) container.appendChild(draggedItem);
                else container.insertBefore(draggedItem, afterElement);
            });
        };

        document.getElementById('save-menu-order-btn').addEventListener('click', async (e) => {
            showSaveFeedback(e.currentTarget);
            const newOrder = [...document.getElementById('reorder-menu-list').children].map(li => li.dataset.menu);
            
            if (reorderMenuContext === 'main') {
                appData.menuOrder = newOrder;
                addLog('Main Menu Reordered', 'Admin main menu order was changed.');
            } else if (reorderMenuContext === 'manage-stores') {
                appData.shopSettings.menuOrderManageStores = newOrder;
                addLog('Manage Stores Sub-Menu Reordered', 'Sub-menu order was changed.');
            }

            await saveState();
            reorderMenuModal.style.display = 'none';
            renderAdminPanel();
        });

        document.getElementById('close-reorder-menu-modal-btn').addEventListener('click', () => reorderMenuModal.style.display = 'none');

        const generateOrderNumber = () => {
            const format = appData.shopSettings.orderNumberFormat;
            const now = new Date();
            
            const pad = (n, width) => n.toString().padStart(width, '0');
            const generateRandomDigits = (digits) => {
                const min = Math.pow(10, digits - 1);
                const max = Math.pow(10, digits) - 1;
                return Math.floor(min + Math.random() * (max - min + 1));
            };

            switch(format) {
                case 'format1': 
                    // WHD68/08/0001 (เดิม)
                    return `WHD${(now.getFullYear() + 543).toString().slice(-2)}/${pad(now.getMonth() + 1, 2)}/${generateRandomDigits(4)}`;
                
                case 'format2': 
                    // WHD-20250820-0001 (เดิม)
                    return `WHD-${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}-${generateRandomDigits(4)}`;
                
                case 'format3': 
                    // WHD-12345 (เดิม)
                    return `WHD-${generateRandomDigits(5)}`;
                
                case 'custom-letters':
                    // ตัวอักษรระบุเอง 3 ตัว + เลขรัน
                    const prefix = appData.shopSettings.customOrderPrefix || 'WHD';
                    return `${prefix}${generateRandomDigits(4)}`;
                
                case 'random-5-10':
                    // เลขรัน Random 5-10 หลัก
                    const digits = Math.floor(5 + Math.random() * 6); // 5-10 หลัก
                    return `${generateRandomDigits(digits)}`;
                
                case 'date-format':
                    // รูปแบบ วัน/เดือน/ปี + เลขรัน
                    return `${pad(now.getDate(), 2)}${pad(now.getMonth() + 1, 2)}${(now.getFullYear() + 543).toString().slice(-2)}${generateRandomDigits(4)}`;
                
                case '6801-random':
                    // 6801 + เลขรัน Random
                    return `6801${generateRandomDigits(4)}`;
                
                case '0168-random':
                    // 0168 + เลขรัน Random
                    return `0168${generateRandomDigits(4)}`;
                
                case 'jan68-random':
                    // JAN68 + เลขรัน Random
                    return `JAN68${generateRandomDigits(4)}`;
                
                case '68jan-random':
                    // 68JAN + เลขรัน Random
                    return `68JAN${generateRandomDigits(4)}`;
                
                default:
                    return `WHD-${generateRandomDigits(5)}`;
            }
        };

        const renderOrderNumberView = (dateRange = []) => {
            const confirmList = document.getElementById('confirm-orders-list');
            const activeList = document.getElementById('active-orders-list');
            const cancelledList = document.getElementById('cancelled-orders-list');
            confirmList.innerHTML = '';
            activeList.innerHTML = '';
            cancelledList.innerHTML = '';
            const lang = appData.shopSettings.language;
            let orders = [...appData.analytics.orders];
            if (dateRange.length > 0) {
                const start = dateRange[0].setHours(0,0,0,0);
                const end = dateRange.length === 2 ? dateRange[1].setHours(23,59,59,999) : new Date(start).setHours(23,59,59,999);
                orders = orders.filter(o => { const orderDate = new Date(o.timestamp).getTime(); return orderDate >= start && orderDate <= end; });
            }
            orders.reverse().forEach(order => {
                const orderId = order.order_id || order.id;
                const date = new Date(order.timestamp);
                const formattedDate = `${date.toLocaleDateString('th-TH')} ${date.toLocaleTimeString('th-TH')}`;
                const row = document.createElement('tr');
                const orderTotal = parseFloat(order.total || 0).toLocaleString();
                if (order.status === 'new') {
                    row.innerHTML = `<td>${orderId}</td><td>${formattedDate}</td><td>${orderTotal} บาท</td><td><button class="btn btn-success btn-small confirm-order-action" data-id="${orderId}">ยืนยัน</button><button class="btn btn-danger btn-small delete-order-action" data-id="${orderId}">${translations[lang].deleteBtn || 'ลบ'}</button></td>`;
                    confirmList.appendChild(row);
                } else if (order.status === 'active') {
                    row.innerHTML = `<td>${orderId}</td><td>${formattedDate}</td><td>${orderTotal} บาท</td><td><button class="btn btn-info btn-small view-order-details" data-id="${orderId}">${translations[lang].viewDetailsBtn || 'ดูรายการ'}</button><button class="btn btn-warning btn-small cancel-order-action" data-id="${orderId}">${translations[lang].cancelOrderBtn || 'ยกเลิก'}</button><button class="btn btn-danger btn-small delete-order-action" data-id="${orderId}">${translations[lang].deleteBtn || 'ลบ'}</button></td>`;
                    activeList.appendChild(row);
                } else if (order.status === 'cancelled') {
                    row.innerHTML = `<td>${orderId}</td><td>${formattedDate}</td><td>${orderTotal} บาท</td><td><button class="btn btn-info btn-small view-order-details" data-id="${orderId}">ดูรายการ</button><button class="btn btn-danger btn-small delete-order-action" data-id="${orderId}">${translations[lang].deleteBtn || 'ลบ'}</button></td>`;
                    cancelledList.appendChild(row);
                }
            });
            document.querySelectorAll('.view-order-details').forEach(btn => btn.addEventListener('click', (e) => viewOrderDetails(e.target.dataset.id)));
            document.querySelectorAll('.confirm-order-action').forEach(btn => btn.addEventListener('click', (e) => confirmOrderAction(e.target.dataset.id)));
            document.querySelectorAll('.cancel-order-action').forEach(btn => btn.addEventListener('click', (e) => cancelOrderAction(e.target.dataset.id)));
            document.querySelectorAll('.delete-order-action').forEach(btn => btn.addEventListener('click', (e) => deleteOrderAction(e.target.dataset.id)));

            // เพิ่ม event listeners สำหรับการค้นหา Order Number
            const searchOrderBtn = document.getElementById('search-order-btn');
            const clearSearchBtn = document.getElementById('clear-search-btn');
            const orderNumberSearch = document.getElementById('order-number-search');

            if (searchOrderBtn) {
                searchOrderBtn.addEventListener('click', searchOrderByNumber);
            }
            if (clearSearchBtn) {
                clearSearchBtn.addEventListener('click', clearOrderSearch);
            }
            if (orderNumberSearch) {
                orderNumberSearch.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        searchOrderByNumber();
                    }
                });
            }
        };

        const searchOrderByNumber = () => {
            const searchInput = document.getElementById('order-number-search');
            const searchTerm = searchInput ? searchInput.value.trim() : '';
            
            if (!searchTerm) {
                Notify.warning('คำเตือน', 'กรุณากรอกเลขออเดอร์ที่ต้องการค้นหา');
                return;
            }

            const confirmList = document.getElementById('confirm-orders-list');
            const activeList = document.getElementById('active-orders-list');
            const cancelledList = document.getElementById('cancelled-orders-list');
            
            // ล้างผลการค้นหาก่อน
            confirmList.innerHTML = '';
            activeList.innerHTML = '';
            cancelledList.innerHTML = '';

            const lang = appData.shopSettings.language;
            let orders = [...appData.analytics.orders];
            
            // ค้นหาออเดอร์ที่ตรงกับเลขออเดอร์
            const foundOrders = orders.filter(order => {
                const orderId = order.order_id || order.id;
                return orderId.toString().includes(searchTerm);
            });

            if (foundOrders.length === 0) {
                confirmList.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #666;">ไม่พบออเดอร์ที่ตรงกับเลขที่ค้นหา</td></tr>';
                activeList.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #666;">ไม่พบออเดอร์ที่ตรงกับเลขที่ค้นหา</td></tr>';
                cancelledList.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #666;">ไม่พบออเดอร์ที่ตรงกับเลขที่ค้นหา</td></tr>';
                return;
            }

            // แสดงผลการค้นหา
            foundOrders.reverse().forEach(order => {
                const orderId = order.order_id || order.id;
                const date = new Date(order.timestamp);
                const formattedDate = `${date.toLocaleDateString('th-TH')} ${date.toLocaleTimeString('th-TH')}`;
                const row = document.createElement('tr');
                const orderTotal = parseFloat(order.total || 0).toLocaleString();

                if (order.status === 'new') {
                    row.innerHTML = `<td>${orderId}</td><td>${formattedDate}</td><td>${orderTotal} บาท</td><td><button class="btn btn-success btn-small confirm-order-action" data-id="${orderId}">ยืนยัน</button><button class="btn btn-danger btn-small delete-order-action" data-id="${orderId}">ลบ</button></td>`;
                    confirmList.appendChild(row);
                } else if (order.status === 'active') {
                    row.innerHTML = `<td>${orderId}</td><td>${formattedDate}</td><td>${orderTotal} บาท</td><td><button class="btn btn-info btn-small view-order-details" data-id="${orderId}">ดูรายการ</button><button class="btn btn-warning btn-small cancel-order-action" data-id="${orderId}">ยกเลิก</button><button class="btn btn-danger btn-small delete-order-action" data-id="${orderId}">ลบ</button></td>`;
                    activeList.appendChild(row);
                } else if (order.status === 'cancelled') {
                    row.innerHTML = `<td>${orderId}</td><td>${formattedDate}</td><td>${orderTotal} บาท</td><td><button class="btn btn-info btn-small view-order-details" data-id="${orderId}">ดูรายการ</button><button class="btn btn-danger btn-small delete-order-action" data-id="${orderId}">ลบ</button></td>`;
                    cancelledList.appendChild(row);
                }
            });

            // ผูก event listeners ใหม่
            document.querySelectorAll('.view-order-details').forEach(btn => btn.addEventListener('click', (e) => viewOrderDetails(e.target.dataset.id)));
            document.querySelectorAll('.confirm-order-action').forEach(btn => btn.addEventListener('click', (e) => confirmOrderAction(e.target.dataset.id)));
            document.querySelectorAll('.cancel-order-action').forEach(btn => btn.addEventListener('click', (e) => cancelOrderAction(e.target.dataset.id)));
            document.querySelectorAll('.delete-order-action').forEach(btn => btn.addEventListener('click', (e) => deleteOrderAction(e.target.dataset.id)));

            Notify.success('สำเร็จ', `พบออเดอร์ที่ตรงกับเลขที่ค้นหา: ${foundOrders.length} รายการ`);
        };

        const clearOrderSearch = () => {
            const searchInput = document.getElementById('order-number-search');
            if (searchInput) {
                searchInput.value = '';
            }
            // แสดงออเดอร์ทั้งหมด
            renderOrderNumberView();
        };

        const viewOrderDetails = (orderId) => {
            const order = appData.analytics.orders.find(o => (o.order_id === orderId || o.id === orderId));
            if (!order) return;
            const originalCart = { ...appData.cart };
            const originalPromo = currentAppliedPromo;
            appData.cart = order.items;
            currentAppliedPromo = order.promoApplied;
            
            const displayOrderId = order.order_id || order.id;
            orderDetails.textContent = createConfirmOrderSummary(displayOrderId);

            appData.cart = originalCart;
            currentAppliedPromo = originalPromo;
            document.getElementById('order-modal-title').textContent = 'รายละเอียดออเดอร์';
            document.getElementById('order-modal-prompt').style.display = 'none';
            document.getElementById('copy-order-btn').style.display = 'none';
            document.getElementById('promo-code-container').style.display = 'none';
            orderModal.style.display = 'flex';
        };

        const confirmOrderAction = async (orderId) => {
            const order = appData.analytics.orders.find(o => (o.order_id === orderId || o.id === orderId));
            if (order && order.status === 'new') {
                try {
                    const response = await fetchWithAuth(`${API_ORDERS_ENDPOINT}?id=${orderId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'active' })
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to confirm order');
                    }

                    order.status = 'active';
                    addLog('Order Confirmed', `Order #${orderId} status changed to Active.`);
                    await saveState();

                    await loadCustomerData();

                    renderOrderNumberView(orderDatePicker.selectedDates);
                    renderDashboard();
                    if (views.customer.classList.contains('active')) {
                        renderProducts();
                    }
                    Notify.success('ยืนยันสำเร็จ', `ยืนยันออเดอร์ #${orderId} สำเร็จ`);

                } catch (error) {
                    console.error('Failed to confirm order:', error);
                    Notify.error('ผิดพลาด', `เกิดข้อผิดพลาดในการยืนยันออเดอร์: ${error.message}`);
                }
            }
        };

        const cancelOrderAction = async (orderId) => {
            const order = appData.analytics.orders.find(o => (o.order_id === orderId || o.id === orderId));
            if(!order) return;

            if (order.status === 'active') {
                const confirmed = await Notify.confirm(
                    'ยืนยันการยกเลิกออเดอร์',
                    `คุณต้องการยกเลิกออเดอร์เลขที่ ${orderId} ใช่หรือไม่?`,
                    null,
                    { type: 'warning' }
                );
                if (confirmed) {
                    try {
                        const response = await fetchWithAuth(`${API_ORDERS_ENDPOINT}?id=${orderId}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: 'cancelled' })
                        });
                         if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.error || 'Failed to cancel order');
                        }

                        order.status = 'cancelled';
                        addLog('Order Cancelled', `Order #${orderId} status changed to Cancelled.`);
                        await saveState();
                        renderOrderNumberView(orderDatePicker.selectedDates);
                        renderDashboard();

                    } catch (error) {
                        console.error('Failed to cancel order:', error);
                        Notify.error('ผิดพลาด', `เกิดข้อผิดพลาดในการยกเลิกออเดอร์: ${error.message}`);
                    }
                }
            }
        };

        const deleteOrderAction = async (orderId) => {
            const order = appData.analytics.orders.find(o => (o.order_id === orderId || o.id === orderId));
            if (!order) return;

            const confirmed = await Notify.confirm(
                'ยืนยันการลบออเดอร์',
                `คุณต้องการลบออเดอร์เลขที่ ${orderId} ทิ้งถาวรใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`,
                null,
                { type: 'danger' }
            );

            if (confirmed) {
                 try {
                    const response = await fetchWithAuth(`${API_ORDERS_ENDPOINT}?id=${orderId}`, {
                        method: 'DELETE'
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to delete order');
                    }

                    addLog('Order Deleted', `Order #${orderId} was permanently deleted.`);
                    appData.analytics.orders = appData.analytics.orders.filter(o => (o.order_id || o.id) !== orderId);
                    await saveState();
                    renderOrderNumberView(orderDatePicker.selectedDates);
                    renderDashboard();

                } catch (error) {
                    console.error('Failed to delete order:', error);
                    Notify.error('ผิดพลาด', `เกิดข้อผิดพลาดในการลบออเดอร์: ${error.message}`);
                }
            }
        };

        let animationFrameId;
        let mainCanvasParticles = [];
        let nextFireworkTime = 0;

        const SEASONAL_THEMES = {
            'christmas': { name: '🎄 Christmas', background: 'linear-gradient(to bottom, #0d47a1, #1e88e5)', particle: 'snow' },
            'cny': { name: '🧧 Chinese New Year', background: 'linear-gradient(to bottom, #7a0000, #ffc107)', particle: 'lantern' },
            'valentine': { name: '💘 Valentine\'s Day', background: 'linear-gradient(to bottom, #f8bbd0, #e91e63)', particle: 'heart' },
            'halloween': { name: '🎃 Halloween', background: 'linear-gradient(to bottom, #121212, #ff8c00)', particle: 'bat' },
            'vegetarian': { name: '🥬 Vegetarian', background: 'linear-gradient(to bottom, #fffde7, #fdd835)', particle: 'flag' },
            'loykrathong': { name: '🏮 Loy Krathong', background: 'linear-gradient(to bottom, #000033, #001f4d)', particle: 'krathong' },
            'songkran': { name: '💦 Songkran', background: 'linear-gradient(to bottom, #e3f2fd, #42a5f5)', particle: 'water' },
            'newyear': { name: '🎆 New Year', background: 'linear-gradient(to bottom, #000000, #1a237e)', particle: 'firework' }
        };

        function resizeCanvas() {
            festivalCanvas.width = window.innerWidth;
            festivalCanvas.height = window.innerHeight;
        }

        function createParticle(type, canvas = festivalCanvas) {
            const common = {
                x: Math.random() * canvas.width,
                y: -20,
                speedY: Math.random() * 2 + 1,
                speedX: Math.random() * 2 - 1,
                opacity: Math.random() * 0.5 + 0.5
            };
            switch (type) {
                case 'snow': return { ...common, type, radius: Math.random() * 3 + 1, opacity: appData.shopSettings.effects.general.snow.opacity };
                case 'lantern': return { ...common, type, size: Math.random() * 20 + 20, speedY: Math.random() * 0.5 + 0.2 };
                case 'heart': return { ...common, type, size: Math.random() * 15 + 10, speedY: Math.random() * 1 + 0.5, rotation: 0, rotationSpeed: (Math.random() - 0.5) * 0.1 };
                case 'bat': return { ...common, type, size: Math.random() * 20 + 15, speedY: Math.random() * 1 + 1.5, speedX: Math.random() * 4 - 2, wingFlap: 0 };
                case 'flag': return { ...common, type, size: 20, speedY: Math.random() * 1 + 0.5 };
                case 'krathong': return { ...common, type, y: canvas.height + 20, size: Math.random() * 25 + 20, speedY: -(Math.random() * 0.2 + 0.1), speedX: 0, life: 300 + Math.random() * 200 };
                case 'water': return { ...common, type, radius: Math.random() * 2 + 1, speedY: Math.random() * 8 + 4, speedX: Math.random() * 6 - 3 };
                case 'firework':
                    const hue = Math.random() * 360;
                    return { ...common, type, x: Math.random() * canvas.width, y: canvas.height, targetY: Math.random() * (canvas.height / 2), speedY: -(Math.random() * 5 + 5), exploded: false, particles: [], color: `hsl(${hue}, 100%, 50%)`, color2: `hsl(${hue + 30}, 100%, 50%)`, opacity: appData.shopSettings.effects.general.fireworks.opacity };
                case 'rain': return { ...common, type, len: Math.random() * 20 + 10, speedY: Math.random() * 10 + 10, opacity: appData.shopSettings.effects.general.rain.opacity };
                case 'autumn': return { ...common, type, size: Math.random() * 10 + 5, speedY: Math.random() * 1 + 0.5, rotation: Math.random() * Math.PI * 2, rotationSpeed: (Math.random() - 0.5) * 0.05, opacity: appData.shopSettings.effects.general.autumn.opacity, color: ['#D95C28', '#D32D15', '#A52A2A', '#DAA520'][Math.floor(Math.random()*4)], sway: Math.random() * 0.5 + 0.2 };
                default: return null;
            }
        }

        function animateMainCanvas() {
            festivalCtx.clearRect(0, 0, festivalCanvas.width, festivalCanvas.height);
            let activeEffects = [];

            const activeTheme = appData.shopSettings.effects.seasonal.activeTheme;
            if (activeTheme && activeTheme !== 'none' && appData.shopSettings.effects.seasonal[activeTheme]?.enabled) {
                const particleType = SEASONAL_THEMES[activeTheme].particle;
                const intensity = appData.shopSettings.effects.seasonal[activeTheme]?.intensity || 50;
                activeEffects.push({ type: particleType, count: intensity });
            }

            Object.keys(appData.shopSettings.effects.general).forEach(key => {
                const effect = appData.shopSettings.effects.general[key];
                if (effect.enabled) {
                    if (key === 'fireworks') {
                        const now = Date.now();
                        if (now > nextFireworkTime) {
                            mainCanvasParticles.push(createParticle('firework', festivalCanvas));
                            const frequencyInSeconds = (11 - effect.frequency) * 6;
                            nextFireworkTime = now + (Math.random() * 0.5 + 0.5) * frequencyInSeconds * 1000;
                        }
                    } else {
                        activeEffects.push({ type: key, count: effect.intensity || effect.frequency });
                    }
                }
            });

            mainCanvasParticles = mainCanvasParticles.filter(p => p.type === 'firework' || activeEffects.some(ae => ae.type === p.type));

            activeEffects.forEach(effect => {
                let currentParticles = mainCanvasParticles.filter(p => p.type === effect.type);
                while (currentParticles.length < effect.count) {
                    const newParticle = createParticle(effect.type, festivalCanvas);
                    if (newParticle) {
                        mainCanvasParticles.push(newParticle);
                        currentParticles.push(newParticle);
                    } else break;
                }
                if (currentParticles.length > effect.count) {
                     mainCanvasParticles = mainCanvasParticles.filter(p => p.type !== effect.type || Math.random() < effect.count / currentParticles.length);
                }
            });

            mainCanvasParticles.forEach((p, index) => {
                if (!p) return;
                p.y += p.speedY;
                if (p.type === 'autumn') {
                    p.x += p.speedX + Math.sin(p.y * 0.05) * p.sway;
                } else {
                    p.x += p.speedX;
                }

                festivalCtx.globalAlpha = p.opacity || 1;
                drawParticle(p, festivalCtx, festivalCanvas);

                if (p.y > festivalCanvas.height + 20 || p.y < -30 || p.x < -20 || p.x > festivalCanvas.width + 20 || p.life <= 0) {
                     if(p.type !== 'firework') {
                        mainCanvasParticles[index] = createParticle(p.type, festivalCanvas);
                     }
                }
            });
            festivalCtx.globalAlpha = 1;

            const hasActiveEffects = activeEffects.length > 0 || appData.shopSettings.effects.general.fireworks.enabled || mainCanvasParticles.some(p => p.type === 'firework');

            if (hasActiveEffects) {
                animationFrameId = requestAnimationFrame(animateMainCanvas);
            } else {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }

        function drawParticle(p, ctx, canvas) {
            switch(p.type) {
                case 'snow': ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); break;
                case 'lantern': ctx.fillStyle = 'gold'; ctx.beginPath(); ctx.arc(p.x, p.y, p.size/2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#E63946'; ctx.fillRect(p.x - p.size/2, p.y - p.size/4, p.size, p.size/2); break;
                case 'heart':
                    p.rotation += p.rotationSpeed;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation);
                    ctx.fillStyle = `rgba(229, 62, 94, ${p.opacity})`;
                    ctx.beginPath();
                    ctx.moveTo(0, p.size * 0.25);
                    ctx.bezierCurveTo(p.size * 0.5, -p.size * 0.25, p.size, 0, 0, p.size);
                    ctx.bezierCurveTo(-p.size, 0, -p.size * 0.5, -p.size * 0.25, 0, p.size * 0.25);
                    ctx.fill();
                    ctx.restore();
                    break;
                case 'bat':
                    p.wingFlap += 0.3;
                    const wingY = Math.sin(p.wingFlap) * p.size / 4;
                    ctx.fillStyle = '#264653';
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - p.size/2, p.y + wingY);
                    ctx.lineTo(p.x, p.y + p.size/4);
                    ctx.lineTo(p.x + p.size/2, p.y + wingY);
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 'flag':
                    ctx.fillStyle = '#FFD700';
                    ctx.fillRect(p.x, p.y, p.size, p.size * 1.5);
                    ctx.fillStyle = 'red';
                    ctx.font = `${p.size}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.fillText('เจ', p.x + p.size/2, p.y + p.size);
                    break;
                case 'krathong':
                    p.life--;
                    p.opacity = p.life / 300;
                    ctx.fillStyle = '#6B4226';
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.size/2, 0, Math.PI); ctx.fill();
                    ctx.fillStyle = 'yellow';
                    ctx.beginPath(); ctx.arc(p.x, p.y - 5, 3, 0, Math.PI * 2); ctx.fill();
                    break;
                case 'water':
                     ctx.fillStyle = `rgba(0, 191, 255, ${p.opacity})`;
                     ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
                     break;
                case 'firework':
                    if (p.exploded) {
                        p.particles.forEach((fp, i) => {
                            fp.x += fp.vx;
                            fp.y += fp.vy;
                            fp.vy += 0.1;
                            fp.alpha -= 0.02;
                            if (fp.alpha <= 0) p.particles.splice(i, 1);
                            ctx.globalAlpha = fp.alpha * p.opacity;
                            ctx.fillStyle = fp.color;
                            ctx.fillRect(fp.x, fp.y, 2, 2);
                        });
                        if (p.particles.length === 0) {
                            const index = mainCanvasParticles.indexOf(p);
                            if (index > -1) mainCanvasParticles.splice(index, 1);
                        }
                    } else {
                        ctx.fillStyle = p.color2;
                        ctx.fillRect(p.x, p.y, 3, 10);
                        if (p.y <= p.targetY) {
                            p.exploded = true;
                            for (let i = 0; i < 50; i++) {
                                const angle = Math.random() * Math.PI * 2;
                                const speed = Math.random() * 4 + 1;
                                p.particles.push({ x: p.x, y: p.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, alpha: 1, color: p.color });
                            }
                        }
                    }
                    break;
                case 'rain':
                    ctx.strokeStyle = `rgba(174,194,224,${p.opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x, p.y + p.len);
                    ctx.stroke();
                    break;
                case 'autumn':
                    p.rotation += p.rotationSpeed;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation);
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.moveTo(0, -p.size);
                    ctx.bezierCurveTo(p.size, -p.size, p.size * 0.5, 0, p.size, p.size);
                    ctx.bezierCurveTo(p.size * 0.5, p.size * 0.5, 0, p.size * 0.5, 0, 0);
                    ctx.bezierCurveTo(0, p.size * 0.5, -p.size * 0.5, p.size * 0.5, -p.size, p.size);
                    ctx.bezierCurveTo(-p.size * 0.5, 0, -p.size, -p.size, 0, -p.size);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                    break;
            }
        }

        function initMainEffects() {
            cancelAnimationFrame(animationFrameId);

            let hasActiveEffect = false;
            const seasonal = appData.shopSettings.effects.seasonal;
            const general = appData.shopSettings.effects.general;

            const activeTheme = seasonal.activeTheme;
            if (activeTheme && activeTheme !== 'none' && seasonal[activeTheme]?.enabled) {
                hasActiveEffect = true;
            }

            if (!hasActiveEffect) {
                for (const key in general) {
                    if (general[key].enabled) {
                        hasActiveEffect = true;
                        break;
                    }
                }
            }

            if (hasActiveEffect) {
                festivalCanvas.style.display = 'block';
                resizeCanvas();
                animateMainCanvas();
            } else {
                festivalCanvas.style.display = 'none';
            }
        }

        const renderThemeModal = () => {
            const grid = document.getElementById('theme-selection-grid');
            grid.innerHTML = '';
            const currentTheme = appData.shopSettings.themeName;
            for (const key in THEME_PRESETS) {
                const theme = THEME_PRESETS[key];
                const item = document.createElement('div');
                item.className = 'theme-preview-item';
                if (key === currentTheme) {
                    item.classList.add('active');
                }
                item.dataset.theme = key;
                item.innerHTML = `
                    <div class="color-swatches">
                        <div class="swatch" style="background-color: ${theme.colors.primary};"></div>
                        <div class="swatch" style="background-color: ${theme.colors.secondary};"></div>
                        <div class="swatch" style="background-color: ${theme.colors.info};"></div>
                    </div>
                    <p>${theme.name}</p>
                `;
                item.addEventListener('click', () => {
                    document.querySelectorAll('#theme-selection-grid .theme-preview-item').forEach(el => el.classList.remove('active'));
                    item.classList.add('active');
                });
                grid.appendChild(item);
            }
            document.getElementById('theme-selection-modal').style.display = 'flex';
        };

        const renderPromotions = () => {
            const list = document.getElementById('promo-code-list');
            list.innerHTML = '';
            appData.shopSettings.promotions.forEach(promo => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${promo.code}</td>
                    <td>${promo.discount}%</td>
                    <td>
                        <button class="btn btn-danger btn-small btn-delete-promo" data-id="${promo.id}">ลบ</button>
                    </td>
                `;
                list.appendChild(row);
            });
        };

        const setupPromotionListeners = () => {
            document.getElementById('promo-code-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const codeInput = document.getElementById('promo-code');
                const discountInput = document.getElementById('promo-discount');
                const code = codeInput.value.trim().toUpperCase();
                const discount = parseInt(discountInput.value);

                if (!code || !discount || discount <= 0 || discount > 100) {
                    Notify.warning('กรุณากรอกข้อมูล', 'กรุณากรอกข้อมูลให้ถูกต้อง (ส่วนลดต้องอยู่ระหว่าง 1-100)');
                    return;
                }
                if (appData.shopSettings.promotions.some(p => p.code === code)) {
                    Notify.warning('โค้ดซ้ำ', 'โค้ดนี้มีอยู่แล้วในระบบ');
                    return;
                }

                const newPromo = { id: generateId(), code, discount };
                appData.shopSettings.promotions.push(newPromo);
                addLog('Promotion Created', `Code: ${code}, Discount: ${discount}%`);
                await saveState();
                renderPromotions();
                codeInput.value = '';
                discountInput.value = '';
            });

            document.getElementById('generate-promo-btn').addEventListener('click', () => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                let result = '';
                for (let i = 0; i < 8; i++) {
                    result += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                document.getElementById('promo-code').value = result;
            });

            document.getElementById('promo-code-list').addEventListener('click', async (e) => {
                if (e.target.classList.contains('btn-delete-promo')) {
                    const promoId = parseInt(e.target.dataset.id);
                    const promoToDelete = appData.shopSettings.promotions.find(p => p.id === promoId);
                    if (promoToDelete) {
                        const confirmed = await Notify.confirm(
                            'ยืนยันการลบโค้ดโปรโมชั่น',
                            `คุณต้องการลบโค้ด ${promoToDelete.code} ใช่หรือไม่?`
                        );
                        if (confirmed) {
                            addLog('Promotion Deleted', `Code: ${promoToDelete.code}`);
                            appData.shopSettings.promotions = appData.shopSettings.promotions.filter(p => p.id !== promoId);
                            await saveState();
                            renderPromotions();
                        }
                    }
                }
            });
        };

        const renderLogs = (dateRange = []) => {
            const list = document.getElementById('log-list');
            list.innerHTML = '';
            let logs = [...appData.analytics.logs];
            if (dateRange.length > 0) {
                const start = dateRange[0].setHours(0,0,0,0);
                const end = dateRange.length === 2 ? dateRange[1].setHours(23,59,59,999) : new Date(start).setHours(23,59,59,999);
                logs = logs.filter(l => { const logDate = new Date(l.timestamp).getTime(); return logDate >= start && logDate <= end; });
            }
            logs.forEach(log => {
                const row = document.createElement('tr');
                const date = new Date(log.timestamp);
                const formattedDate = `${date.toLocaleDateString('th-TH')} ${date.toLocaleTimeString('th-TH')}`;
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${log.user}</td>
                    <td>${log.action}</td>
                    <td>${log.details}</td>
                `;
                list.appendChild(row);
            });
        };

        const applyLoaderSettings = () => {
            const settings = appData.shopSettings.loadingScreen;
            const loaderText = document.getElementById('loader-text');
            const loaderLogo = document.getElementById('loader-logo');
            const loaderVideoIcon = document.getElementById('loader-video-icon');
            const loaderVideoBg = document.getElementById('loader-video-bg');
            const loaderBg = document.getElementById('loader-background');
            const progressBar = document.getElementById('progress-bar-container');

            loaderText.textContent = settings.text;
            const effect = settings.textEffect;
            loaderText.style.textShadow = effect.enabled ? `${effect.offsetX}px ${effect.offsetY}px ${effect.blur}px ${effect.color}` : 'none';

            loaderLogo.style.display = settings.logoUrl ? 'block' : 'none';
            if(settings.logoUrl) loaderLogo.src = settings.logoUrl;
            loaderLogo.style.opacity = settings.logoOpacity;

            loaderBg.style.display = settings.backgroundUrl ? 'block' : 'none';
            if(settings.backgroundUrl) loaderBg.style.backgroundImage = `url(${settings.backgroundUrl})`;
            loaderBg.style.opacity = settings.backgroundOpacity;

            loaderVideoIcon.style.display = 'none';
            loaderVideoBg.style.display = 'none';
            if(settings.videoUrl) {
                if(settings.videoMode === 'icon') {
                    loaderVideoIcon.style.display = 'block';
                    loaderVideoIcon.src = settings.videoUrl;
                    loaderVideoIcon.style.opacity = settings.videoOpacity;
                } else {
                    loaderVideoBg.style.display = 'block';
                    loaderVideoBg.src = settings.videoUrl;
                    loaderVideoBg.style.opacity = settings.videoOpacity;
                }
            }

            progressBar.className = `progress-bar ${settings.barStyle}`;
        };

        const runAndHideLoader = () => {
            const loader = document.getElementById('loader-overlay');
            const percentageEl = document.getElementById('loader-percentage');
            let progress = 0;

            const interval = setInterval(() => {
                progress += Math.floor(Math.random() * 5) + 1;
                if (progress > 100) {
                    progress = 100;
                }

                document.documentElement.style.setProperty('--progress-width', `${progress}%`);
                percentageEl.textContent = `${progress}%`;

                if (progress === 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        loader.style.transition = 'opacity 0.5s ease-out, visibility 0.5s ease-out';
                        loader.style.opacity = '0';
                        loader.style.visibility = 'hidden';
                        loader.addEventListener('transitionend', () => {
                            loader.style.display = 'none';
                            if (views.customer.classList.contains('active')) {
                                adminGearIcon.style.display = isAdminLoggedIn || isCustomerViewOnly() ? 'none' : 'flex';
                            }
                        }, { once: true });
                    }, 300);
                }
            }, 50);
        };

        const renderMessageEditor = () => {
            const target = document.querySelector('input[name="messageTarget"]:checked').value;
            document.getElementById('shop-closed-message-editor').style.display = target === 'shopClosed' ? 'block' : 'none';
            document.getElementById('announcement-message-editor').style.display = target === 'announcement' ? 'block' : 'none';

            document.getElementById('shop-closed-message-text').value = appData.shopSettings.shopClosedMessageText;
            document.getElementById('announcement-message-text').value = appData.shopSettings.announcementMessageText;

            const { messageSettings } = appData.shopSettings;
            document.getElementById('message-color').value = messageSettings.color;
            document.getElementById('message-size').value = messageSettings.size;
            document.getElementById('marquee-speed').value = messageSettings.speed;
            document.getElementById('message-effect-toggle').checked = messageSettings.effect.enabled;
            document.getElementById('message-effect-offset-x').value = messageSettings.effect.offsetX;
            document.getElementById('message-effect-offset-y').value = messageSettings.effect.offsetY;
            document.getElementById('message-effect-blur').value = messageSettings.effect.blur;
            document.getElementById('message-effect-color').value = messageSettings.effect.color;

            document.getElementById('message-preview-toggle').checked = messageSettings.previewEnabled;
            document.getElementById('message-height').value = messageSettings.previewHeight;
            document.getElementById('message-width').value = messageSettings.previewWidth;
            document.getElementById('message-preview-settings').style.display = messageSettings.previewEnabled ? 'block' : 'none';


            document.querySelectorAll('.frame-preview-item').forEach(item => {
                item.classList.toggle('active', item.dataset.style === messageSettings.frameStyle);
            });

            updateMessagePreview();
        };

        const updateMessagePreview = () => {
            const previewWrapper = document.getElementById('message-preview-box-wrapper');
            const previewBox = document.getElementById('message-preview-box');
            const target = document.querySelector('input[name="messageTarget"]:checked').value;
            const text = target === 'shopClosed'
                ? document.getElementById('shop-closed-message-text').value
                : document.getElementById('announcement-message-text').value;

            const { messageSettings } = appData.shopSettings;
            const color = document.getElementById('message-color').value;
            const size = document.getElementById('message-size').value;
            const isEffectEnabled = document.getElementById('message-effect-toggle').checked;
            const offsetX = document.getElementById('message-effect-offset-x').value;
            const offsetY = document.getElementById('message-effect-offset-y').value;
            const blur = document.getElementById('message-effect-blur').value;
            const shadowColor = document.getElementById('message-effect-color').value;
            const activeFrame = document.querySelector('.frame-preview-item.active');
            const frameStyle = activeFrame ? activeFrame.dataset.style : (messageSettings.frameStyle || 'style-1');

            previewBox.textContent = text || "ตัวอย่างข้อความ";
            previewBox.style.color = color;
            previewBox.style.fontSize = `${size}px`;
            previewBox.style.textShadow = isEffectEnabled ? `${offsetX}px ${offsetY}px ${blur}px ${shadowColor}` : 'none';
            previewWrapper.className = `marquee-content-wrapper ${frameStyle}`;

            // ===== START: Festival Marquee Fix (Real-time Preview) =====
            // Apply width and height settings directly to the preview wrapper
            if (document.getElementById('message-preview-toggle').checked) {
                const height = document.getElementById('message-height').value;
                const width = document.getElementById('message-width').value;
                previewWrapper.style.minHeight = `${height}%`;
                previewWrapper.style.width = `${width}%`;
                previewWrapper.style.display = 'flex';
                previewWrapper.style.alignItems = 'center';
                previewWrapper.style.justifyContent = 'center';
            } else {
                previewWrapper.style.minHeight = 'auto';
                previewWrapper.style.width = 'auto'; // Let it be inline-block's default width
                previewWrapper.style.display = 'inline-block'; // Back to default
            }
            // ===== END: Festival Marquee Fix (Real-time Preview) =====
        };

        const renderMessageFramePreviews = () => {
            const container = document.getElementById('message-frame-previews');
            container.innerHTML = '';
            for (let i = 1; i <= 20; i++) {
                const item = document.createElement('div');
                item.className = `frame-preview-item style-${i}`;
                item.dataset.style = `style-${i}`;
                item.textContent = `แบบ ${i}`;
                item.addEventListener('click', () => {
                    document.querySelectorAll('.frame-preview-item').forEach(el => el.classList.remove('active'));
                    item.classList.add('active');
                    updateMessagePreview();
                });
                container.appendChild(item);
            }
        };

        const updateRangeValueDisplay = (inputElement) => {
            const displayElement = document.getElementById(`${inputElement.id}-value`);
            if (displayElement) {
                const min = parseFloat(inputElement.min);
                const max = parseFloat(inputElement.max);
                const value = parseFloat(inputElement.value);
                
                let isPercentageBased = true;
                let unit = '%';

                // --- START: Update for Order Bar Sliders ---
                // These sliders represent a percentage change from a base of 100%
                if (inputElement.id.startsWith('order-bar-')) {
                     const percentage = Math.round(value); // Show the direct percentage value (50-150%)
                     displayElement.textContent = `${percentage}%`;
                     return; 
                }
                // --- END: Update for Order Bar Sliders ---

                if (inputElement.id.includes('font-size') && !inputElement.id.includes('perc')) {
                    unit = 'rem'; isPercentageBased = false;
                } else if (inputElement.id.includes('gap') || inputElement.id.includes('blur') || inputElement.id.includes('offset') || (inputElement.id.includes('size') && !inputElement.id.includes('perc'))) {
                    unit = 'px'; isPercentageBased = false;
                } else if (inputElement.id.includes('speed')) {
                    unit = 's'; isPercentageBased = false;
                } else if (inputElement.id.includes('frequency')) {
                    unit = 'min'; isPercentageBased = false;
                }
        
                if (isPercentageBased) {
                    // Adjust calculation if min is not 0 for percentage display
                    const percentage = (max - min === 0) ? 100 : Math.round(((value - min) / (max - min)) * 100);
                     displayElement.textContent = `${value}${unit}`; // Display the actual value + unit
                } else {
                    displayElement.textContent = `${value}${unit}`;
                }
            }
        };


        const SUCCESS_ANIMATIONS = {
            '1': { name: 'Classic Checkmark', html: '<svg viewBox="0 0 52 52"><circle class="sa-circle" cx="26" cy="26" r="25"/><path class="sa-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>' },
            '2': { name: 'Confetti Blast' },
            '3': { name: 'Rocket Launch', html: '<svg viewBox="0 0 50 100"><path fill="var(--sa-secondary-color)" d="M25 0 L10 30 L40 30 Z"/><rect fill="var(--sa-primary-color)" x="15" y="30" width="20" height="70"/><path fill="var(--sa-secondary-color)" d="M10 100 L0 100 L15 70 Z"/><path fill="var(--sa-secondary-color)" d="M40 100 L50 100 L35 70 Z"/></svg>' },
            '4': { name: 'Trophy Shine', html: '<svg viewBox="0 0 100 100"><g fill="var(--sa-primary-color)"><path d="M75 20 A25 25 0 0 0 25 20 A10 10 0 0 1 25 30 L75 30 A10 10 0 0 1 75 20 M50 30 L50 70 M40 70 L60 70 M30 90 L70 90 L65 70 L35 70 Z"/></g><rect class="sa-shine" x="-50" y="0" width="50" height="100" fill="white" fill-opacity="0.3"/></svg>' },
            '5': { name: 'Heart Beat', html: '<svg viewBox="0 0 100 100"><path fill="var(--sa-primary-color)" d="M50 85 C-20 40, 25 -10, 50 25 C75 -10, 120 40, 50 85 Z"/></svg>' },
            '6': { name: 'Gift Box Open', html: '<div class="sa-box"><div class="sa-lid"></div><div class="sa-box-bottom"></div><div class="sa-check">✓</div></div>' },
            '7': { name: 'Stamp', html: '<div class="sa-stamp">SUCCESS</div>' },
            '8': { name: 'Bouncing Check', html: '<div class="sa-check">✓</div>' },
            '9': { name: 'Radial Burst' },
            '10': { name: 'Growing Flower', html: '<div style="display: flex; flex-direction: column; align-items: center;"><div style="position: relative; width: 60px; height: 60px;"><div class="sa-petal" style="transform-origin: bottom right; top:0; left:30px;"></div><div class="sa-petal" style="transform-origin: bottom left; top:0; right:30px; transform: rotate(90deg);"></div><div class="sa-petal" style="transform-origin: top right; bottom:0; left:30px; transform: rotate(-90deg);"></div><div class="sa-petal" style="transform-origin: top left; bottom:0; right:30px; transform: rotate(180deg);"></div></div><div class="sa-stem"></div></div>' },
            '11': { name: 'Thumbs Up', html: '<div class="sa-thumb">👍</div>' },
            '12': { name: 'Magic Wand', html: '<div class="sa-wand"></div>' },
            '13': { name: 'Unlocking Padlock', html: '<svg viewBox="0 0 100 100"><path class="sa-shackle" fill="none" stroke="var(--sa-secondary-color)" stroke-width="8" d="M25 50 V 30 A 25 25 0 0 1 75 30 V 50"/><rect fill="var(--sa-primary-color)" x="15" y="50" width="70" height="40" rx="10"/></svg>' },
            '14': { name: 'Award Ribbon', html: '<svg viewBox="0 0 100 100"><circle fill="var(--sa-primary-color)" cx="50" cy="50" r="30"/><path class="sa-ribbon" fill="none" stroke="var(--sa-secondary-color)" stroke-width="5" d="M35 80 L50 65 L65 80 V 95 L50 85 L35 95 Z"/></svg>' },
            '15': { name: 'Target Hit', html: '<div class="sa-circle"></div><div class="sa-circle" style="animation-delay: 0.1s"></div><div class="sa-circle" style="animation-delay: 0.2s"></div><div class="sa-check">✓</div>' },
            '16': { name: 'Paper Plane', html: '<svg viewBox="0 0 100 100"><path fill="var(--sa-primary-color)" d="M10 10 L90 50 L10 90 L30 50 Z"/></svg>' },
            '17': { name: 'Glowing Check', html: '<div class="sa-check">✓</div>' },
            '18': { name: 'Circle Fill', html: '<div class="sa-circle"></div>' },
            '19': { name: 'Waving Flag', html: '<div><div class="sa-pole"></div><div class="sa-flag">✓</div></div>' },
            '20': { name: 'Progress Done', html: '<div><div class="sa-bar"></div><div class="sa-text">DONE!</div></div>' },
        };

        const populateSuccessAnimationSelector = () => {
            const select = document.getElementById('success-animation-style');
            if (!select) return;
            select.innerHTML = '';
            for (const key in SUCCESS_ANIMATIONS) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = `${key}. ${SUCCESS_ANIMATIONS[key].name}`;
                select.appendChild(option);
            }
        };

        const renderSuccessAnimationSettings = () => {
            const settings = appData.shopSettings.successAnimation;
            document.getElementById('success-animation-style').value = settings.style;
            document.getElementById('success-animation-size').value = settings.size;
            document.getElementById('success-animation-primary-color').value = settings.primaryColor;
            document.getElementById('success-animation-secondary-color').value = settings.secondaryColor;
            document.getElementById('success-text-toggle').checked = settings.showText;
            document.getElementById('success-animation-text').value = settings.text;

            if (typeof settings.textPosition === 'object' && settings.textPosition !== null) {
                document.getElementById('success-text-offset-x').value = settings.textPosition.x || 0;
                document.getElementById('success-text-offset-y').value = settings.textPosition.y || 55;
            } else {
                document.getElementById('success-text-offset-x').value = 0;
                document.getElementById('success-text-offset-y').value = 55;
            }

            const textControls = document.getElementById('success-text-controls');
            textControls.style.display = settings.showText ? 'block' : 'none';
            document.getElementById('success-text-size').value = settings.textSize;
            document.getElementById('success-text-color').value = settings.textColor;
            const effectToggle = document.getElementById('success-text-effect-toggle');
            effectToggle.checked = settings.textEffect.enabled;
            const effectControls = document.getElementById('success-text-effect-controls-container');
            effectControls.style.display = settings.textEffect.enabled ? 'grid' : 'none';
            document.getElementById('success-text-effect-offset-x').value = settings.textEffect.offsetX;
            document.getElementById('success-text-effect-offset-y').value = settings.textEffect.offsetY;
            document.getElementById('success-text-effect-blur').value = settings.textEffect.blur;
            document.getElementById('success-text-effect-color').value = settings.textEffect.color;

            showSuccessAnimation(document.getElementById('success-animation-preview-container'));
        };

        const showSuccessAnimation = (targetContainer) => {
            const modal = document.getElementById('copy-success-modal');
            const isPreview = targetContainer.id === 'success-animation-preview-container';

            const settings = isPreview ? {
                style: document.getElementById('success-animation-style').value,
                size: document.getElementById('success-animation-size').value,
                primaryColor: document.getElementById('success-animation-primary-color').value,
                secondaryColor: document.getElementById('success-animation-secondary-color').value,
                showText: document.getElementById('success-text-toggle').checked,
                text: document.getElementById('success-animation-text').value,
                textPosition: {
                    x: document.getElementById('success-text-offset-x').value,
                    y: document.getElementById('success-text-offset-y').value
                },
                textSize: document.getElementById('success-text-size').value,
                textColor: document.getElementById('success-text-color').value,
                textEffect: {
                    enabled: document.getElementById('success-text-effect-toggle').checked,
                    offsetX: document.getElementById('success-text-effect-offset-x').value,
                    offsetY: document.getElementById('success-text-effect-offset-y').value,
                    blur: document.getElementById('success-text-effect-blur').value,
                    color: document.getElementById('success-text-effect-color').value,
                }
            } : appData.shopSettings.successAnimation;

            let container, textEl, wrapper;
            if(isPreview) {
                wrapper = targetContainer;
                if(!wrapper.querySelector('#success-animation-container')) {
                     wrapper.innerHTML = `<div id="success-animation-container"></div><p id="success-message-text">${settings.text || translations[appData.shopSettings.language].copySuccessMessage}</p>`;
                }
                textEl = wrapper.querySelector('#success-message-text');
                container = wrapper.querySelector('#success-animation-container');
            } else {
                wrapper = modal.querySelector('.copy-success-content');
                container = modal.querySelector('#success-animation-container');
                textEl = modal.querySelector('#success-message-text');
            }

            const x = settings.textPosition.x || 0;
            const y = settings.textPosition.y || 0;
            const positionStyle = `top: calc(50% + ${y}px); left: calc(50% + ${x}px); transform: translate(-50%, -50%);`;

            textEl.textContent = settings.text || translations[appData.shopSettings.language].copySuccessMessage;
            textEl.style = positionStyle;

            container.innerHTML = '';
            container.className = `success-anim-${settings.style}`;

            container.style.setProperty('--sa-size', settings.size / 100);
            container.style.setProperty('--sa-primary-color', settings.primaryColor);
            container.style.setProperty('--sa-secondary-color', settings.secondaryColor);

            const animData = SUCCESS_ANIMATIONS[settings.style];
            if (animData.html) {
                container.innerHTML = animData.html;
            } else if (settings.style === '2') {
                for(let i=0; i<30; i++) {
                    const confetti = document.createElement('div');
                    confetti.className = 'sa-confetti';
                    confetti.style.setProperty('--x', `${Math.random() * 200 - 100}px`);
                    confetti.style.setProperty('--y', `${Math.random() * 200 - 100}px`);
                    confetti.style.background = Math.random() > 0.5 ? settings.primaryColor : settings.secondaryColor;
                    container.appendChild(confetti);
                }
            } else if (settings.style === '9') {
                 for(let i=0; i<12; i++) {
                    const line = document.createElement('div');
                    line.className = 'sa-line';
                    line.style.setProperty('--r', `${i * 30}deg`);
                    container.appendChild(line);
                }
            } else if (settings.style === '12') {
                 container.innerHTML = animData.html || '<div class="sa-wand"></div>';
                 for(let i=0; i<5; i++) {
                    const sparkle = document.createElement('div');
                    sparkle.className = 'sa-sparkle';
                    sparkle.style.animationDelay = `${i * 0.1}s`;
                    sparkle.style.top = `${Math.random()*20+40}%`;
                    sparkle.style.left = `${Math.random()*20+40}%`;
                    container.appendChild(sparkle);
                }
            }

            textEl.style.display = settings.showText ? 'block' : 'none';
            if (settings.showText) {
                textEl.style.fontSize = `${settings.textSize}px`;
                textEl.style.color = settings.textColor;
                const effect = settings.textEffect;
                textEl.style.textShadow = effect.enabled ? `${effect.offsetX}px ${effect.offsetY}px ${effect.blur}px ${effect.color}` : '0 1px 3px rgba(0,0,0,0.5)';
            }

            if(!isPreview) modal.style.display = 'flex';
        };

        const renderEffectsSubMenu = () => {
            const tabsContainer = document.getElementById('effects-tabs');
            tabsContainer.innerHTML = '';
            const lang = appData.shopSettings.language;

            const subMenus = {
                'seasonal': 'seasonalEffectsTitle',
                'general': 'seasonalEffectsGeneralTitle'
            };

            for (const key in subMenus) {
                const tab = document.createElement('div');
                tab.className = `tab ${key === activeEffectsSubMenu ? 'active' : ''}`;
                tab.textContent = translations[lang][subMenus[key]];
                tab.addEventListener('click', () => {
                    activeEffectsSubMenu = key;
                    renderEffectsSubMenu();
                });
                tabsContainer.appendChild(tab);
            }

            document.querySelectorAll('.effects-sub-content').forEach(el => el.style.display = 'none');
            document.getElementById(`effects-${activeEffectsSubMenu}-content`).style.display = 'block';

            if (activeEffectsSubMenu === 'seasonal') {
                renderSeasonalEffectsControls();
            } else {
                renderGeneralEffectsControls();
            }
        };

        const renderSeasonalEffectsControls = () => {
            const container = document.getElementById('seasonal-effects-container');
            container.innerHTML = '';

            for(const themeKey in SEASONAL_THEMES) {
                const theme = SEASONAL_THEMES[themeKey];
                const settings = appData.shopSettings.effects.seasonal[themeKey];
                const controlHTML = `
                    <div class="seasonal-control ${settings.enabled ? 'active' : ''}">
                        <label>${theme.name}</label>
                        <div class="control-group">
                            <div class="toggle-switch-container">
                                <label class="toggle-switch">
                                    <input type="checkbox" id="seasonal-effect-${themeKey}-toggle" ${settings.enabled ? 'checked' : ''}>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="range-controls">
                                <label>ความเข้ม <span class="range-value-display" id="seasonal-effect-${themeKey}-intensity-value">50%</span></label>
                                <input type="range" id="seasonal-effect-${themeKey}-intensity" min="1" max="100" value="${settings.intensity}">
                            </div>
                        </div>
                        <button class="btn btn-primary btn-small save-seasonal-effect-btn" data-theme="${themeKey}">บันทึก</button>
                        <div class="seasonal-preview" id="seasonal-preview-${themeKey}"></div>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', controlHTML);
            }
            document.querySelectorAll('#seasonal-effects-container input[type="range"]').forEach(updateRangeValueDisplay);
        };

        const renderGeneralEffectsControls = () => {
            const { rain, snow, fireworks, autumn } = appData.shopSettings.effects.general;

            document.getElementById('general-effect-rain-toggle').checked = rain.enabled;
            document.getElementById('general-effect-rain-intensity').value = rain.intensity;
            document.getElementById('general-effect-rain-opacity').value = rain.opacity;

            document.getElementById('general-effect-snow-toggle').checked = snow.enabled;
            document.getElementById('general-effect-snow-intensity').value = snow.intensity;
            document.getElementById('general-effect-snow-opacity').value = snow.opacity;

            document.getElementById('general-effect-fireworks-toggle').checked = fireworks.enabled;
            document.getElementById('general-effect-fireworks-frequency').value = fireworks.frequency;
            document.getElementById('general-effect-fireworks-opacity').value = fireworks.opacity;

            document.getElementById('general-effect-autumn-toggle').checked = autumn.enabled;
            document.getElementById('general-effect-autumn-intensity').value = autumn.intensity;
            document.getElementById('general-effect-autumn-opacity').value = autumn.opacity;

            document.querySelectorAll('#general-effects-container input[type="range"]').forEach(updateRangeValueDisplay);
        };

        // ===== START: Order Bar Position Update =====
        const renderOrderBarSettings = () => {
            const settings = appData.shopSettings.orderBarSettings;
            document.getElementById('order-bar-height-slider').value = settings.height;
            document.getElementById('order-bar-button-width-slider').value = settings.buttonWidth;
            document.getElementById('order-bar-button-height-slider').value = settings.buttonHeight;
            document.getElementById('order-bar-font-size-slider').value = settings.fontSize;
            document.getElementById('order-bar-details-font-size-slider').value = settings.detailsFontSize || 100;
            document.getElementById('order-bar-warning-font-size-slider').value = settings.warningFontSize || 100;
            document.getElementById('order-bar-total-font-size-slider').value = settings.totalFontSize || 100;
            
            // Set the correct radio button
            const position = settings.orderBarPosition || 'summary-top';
            document.querySelector(`input[name="orderBarPosition"][value="${position}"]`).checked = true;

            document.querySelectorAll('#admin-menu-order-bar input[type="range"]').forEach(updateRangeValueDisplay);
        };
        // ===== END: Order Bar Position Update =====

        const initEventListeners = () => {
            // ===== START: REAL-TIME UPDATES (Shop Name / Slogan) =====
            document.getElementById('shop-name').addEventListener('input', (e) => {
                appData.shopSettings.shopName = e.target.value;
                applyTheme(); // This will update the shop-name-display in real-time
            });

            document.getElementById('shop-slogan').addEventListener('input', (e) => {
                appData.shopSettings.slogan = e.target.value;
                applyTheme(); // This will update the slogan-display in real-time
            });
            // ===== END: REAL-TIME UPDATES =====

            // ===== START: PRICE TAG UPDATE (Real-time listener) =====
            document.getElementById('price-tag-closing-message').addEventListener('input', (e) => {
                appData.shopSettings.priceTagConfig.closingMessage = e.target.value;
                // Call showPriceTagModal with true to indicate it's a real-time update
                showPriceTagModal(true); 
            });

            // Listener for the preview button
            document.getElementById('preview-price-tag-btn').addEventListener('click', () => {
                showPriceTagModal(false); // false means open the modal (not just update)
            });
            // ===== END: PRICE TAG UPDATE (Real-time listener) =====

            const filterBtn = document.getElementById('filter-btn');
            const filterDropdown = document.getElementById('filter-dropdown');
            filterBtn.addEventListener('click', () => {
                filterDropdown.style.display = filterDropdown.style.display === 'block' ? 'none' : 'block';
            });
            filterDropdown.addEventListener('click', (e) => {
                e.preventDefault();
                if(e.target.tagName === 'A') {
                    currentSortOrder = e.target.dataset.sort;
                    renderProducts(searchBox.value.trim());
                    filterDropdown.style.display = 'none';
                }
            });

            const adminFilterBtn = document.getElementById('admin-product-filter-btn');
            const adminFilterDropdown = document.getElementById('admin-product-filter-dropdown');
            adminFilterBtn.addEventListener('click', () => {
                adminFilterDropdown.style.display = adminFilterDropdown.style.display === 'block' ? 'none' : 'block';
            });
            adminFilterDropdown.addEventListener('click', (e) => {
                e.preventDefault();
                 if(e.target.tagName === 'A') {
                    const sortOrder = e.target.dataset.sort;
                    const searchTerm = document.getElementById('admin-product-search').value.trim();
                    renderAdminProducts(searchTerm, sortOrder);
                    adminFilterDropdown.style.display = 'none';
                }
            });

            window.addEventListener('click', (e) => {
                if (!filterBtn.contains(e.target)) filterDropdown.style.display = 'none';
                if (!adminFilterBtn.contains(e.target)) adminFilterDropdown.style.display = 'none';
            });

            const catScrollLeft = document.getElementById('cat-scroll-left');
            const catScrollRight = document.getElementById('cat-scroll-right');
            catScrollLeft.addEventListener('click', () => {
                categoryTabsContainer.scrollBy({ left: -250, behavior: 'smooth' });
            });
            catScrollRight.addEventListener('click', () => {
                categoryTabsContainer.scrollBy({ left: 250, behavior: 'smooth' });
            });

            document.getElementById('select-theme-btn').addEventListener('click', renderThemeModal);
            document.getElementById('close-theme-modal-btn').addEventListener('click', () => {
                document.getElementById('theme-selection-modal').style.display = 'none';
            });
            document.getElementById('save-theme-btn').addEventListener('click', async (e) => {
                const activeThemeItem = document.querySelector('#theme-selection-grid .theme-preview-item.active');
                if (activeThemeItem) {
                    const newTheme = activeThemeItem.dataset.theme;
                    if (newTheme !== appData.shopSettings.themeName) {
                        showSaveFeedback(e.currentTarget);
                        addLog('Theme Changed', `Theme set to ${THEME_PRESETS[newTheme].name}`);
                        appData.shopSettings.themeName = newTheme;
                        await saveState();
                        applyTheme();
                    }
                }
                document.getElementById('theme-selection-modal').style.display = 'none';
            });

            // ===== START: Order Bar Position Update =====
            document.getElementById('save-order-bar-settings-btn').addEventListener('click', async (e) => {
                showSaveFeedback(e.currentTarget);
                const settings = appData.shopSettings.orderBarSettings;
                settings.height = document.getElementById('order-bar-height-slider').value;
                settings.buttonWidth = document.getElementById('order-bar-button-width-slider').value;
                settings.buttonHeight = document.getElementById('order-bar-button-height-slider').value;
                settings.fontSize = document.getElementById('order-bar-font-size-slider').value;
                settings.detailsFontSize = document.getElementById('order-bar-details-font-size-slider').value;
                settings.warningFontSize = document.getElementById('order-bar-warning-font-size-slider').value;
                settings.totalFontSize = document.getElementById('order-bar-total-font-size-slider').value;
                settings.orderBarPosition = document.querySelector('input[name="orderBarPosition"]:checked').value; // Save position

                addLog('Order Bar Settings Updated', `Sizes and position updated`);
                await saveState();
                applyOrderBarSettings();
            });

            // Real-time update listener for order bar position
            document.querySelectorAll('input[name="orderBarPosition"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    appData.shopSettings.orderBarSettings.orderBarPosition = e.target.value;
                    applyOrderBarSettings();
                });
            });
            // ===== END: Order Bar Position Update =====


            document.getElementById('save-announcement-settings-btn').addEventListener('click', async (e) => {
                showSaveFeedback(e.currentTarget);
                appData.shopSettings.shopClosedMessageText = document.getElementById('shop-closed-message-text').value;
                appData.shopSettings.announcementMessageText = document.getElementById('announcement-message-text').value;

                const ms = appData.shopSettings.messageSettings;
                ms.color = document.getElementById('message-color').value;
                ms.size = document.getElementById('message-size').value;
                ms.speed = document.getElementById('marquee-speed').value;
                ms.effect.enabled = document.getElementById('message-effect-toggle').checked;
                ms.effect.offsetX = document.getElementById('message-effect-offset-x').value;
                ms.effect.offsetY = document.getElementById('message-effect-offset-y').value;
                ms.effect.blur = document.getElementById('message-effect-blur').value;
                ms.effect.color = document.getElementById('message-effect-color').value;

                const activeFrame = document.querySelector('#message-frame-previews .frame-preview-item.active');
                if (activeFrame) {
                    ms.frameStyle = activeFrame.dataset.style;
                }

                ms.previewEnabled = document.getElementById('message-preview-toggle').checked;
                ms.previewHeight = document.getElementById('message-height').value;
                ms.previewWidth = document.getElementById('message-width').value;

                addLog('Announcement Settings Saved', 'Message texts and styles were updated.');
                await saveState();
                updateMarquees();
            });

            document.getElementById('save-out-of-stock-settings-btn').addEventListener('click', async (e) => {
                showSaveFeedback(e.currentTarget);
                const ms = appData.shopSettings.messageSettings;
                ms.outOfStockText = document.getElementById('out-of-stock-text').value;
                ms.outOfStockFontSize = document.getElementById('out-of-stock-font-size').value;
                addLog('Out of Stock Message Updated', `Text set to "${ms.outOfStockText}"`);
                await saveState();
                applyOutOfStockStyles();
                renderProducts(searchBox.value.trim());
            });


            document.querySelectorAll('input[name="messageTarget"]').forEach(radio => {
                radio.addEventListener('change', renderMessageEditor);
            });
            document.getElementById('admin-menu-festival').addEventListener('input', updateMessagePreview);

            document.getElementById('message-preview-toggle').addEventListener('change', (e) => {
                document.getElementById('message-preview-settings').style.display = e.target.checked ? 'block' : 'none';
                updateMessagePreview();
            });

            document.body.addEventListener('input', (e) => {
                if (e.target.type === 'range') {
                    updateRangeValueDisplay(e.target);
                     if(e.target.id.startsWith('order-bar-')) {
                        const settings = appData.shopSettings.orderBarSettings;
                        settings.height = document.getElementById('order-bar-height-slider').value;
                        settings.buttonWidth = document.getElementById('order-bar-button-width-slider').value;
                        settings.buttonHeight = document.getElementById('order-bar-button-height-slider').value;
                        settings.fontSize = document.getElementById('order-bar-font-size-slider').value;
                        settings.detailsFontSize = document.getElementById('order-bar-details-font-size-slider').value;
                        settings.warningFontSize = document.getElementById('order-bar-warning-font-size-slider').value;
                        settings.totalFontSize = document.getElementById('order-bar-total-font-size-slider').value;
                        applyOrderBarSettings();
                    } else if (e.target.id.startsWith('seasonal-effect-') || e.target.id.startsWith('general-effect-')) {
                        // Handle effect intensity/opacity preview if needed, or wait for save
                    }
                }
            });


            const systemFontsEditor = document.getElementById('admin-sub-system-fonts');
            systemFontsEditor.addEventListener('input', updateFontPreviewEffect);
            systemFontsEditor.addEventListener('change', updateFontPreviewEffect);

            const successAnimControls = document.getElementById('admin-sub-system-fonts');
            successAnimControls.addEventListener('input', (e) => {
                if (e.target.id.startsWith('success-')) {
                    requestAnimationFrame(() => showSuccessAnimation(document.getElementById('success-animation-preview-container')));
                }
            });
            successAnimControls.addEventListener('change', (e) => {
                if (e.target.id.startsWith('success-text-toggle')) {
                     document.getElementById('success-text-controls').style.display = e.target.checked ? 'block' : 'none';
                }
                if (e.target.id.startsWith('success-text-effect-toggle')) {
                    document.getElementById('success-text-effect-controls-container').style.display = e.target.checked ? 'grid' : 'none';
                }
            });

            document.getElementById('admin-sub-effects').addEventListener('click', async (e) => {
                if (e.target.matches('.save-seasonal-effect-btn')) {
                    showSaveFeedback(e.target);
                    const theme = e.target.dataset.theme;
                    const settings = appData.shopSettings.effects.seasonal[theme];
                    settings.enabled = document.getElementById(`seasonal-effect-${theme}-toggle`).checked;
                    settings.intensity = document.getElementById(`seasonal-effect-${theme}-intensity`).value;

                    if (settings.enabled) {
                        Object.keys(appData.shopSettings.effects.seasonal).forEach(key => {
                            if (key !== theme && key !== 'activeTheme') {
                                appData.shopSettings.effects.seasonal[key].enabled = false;
                            }
                        });
                         appData.shopSettings.effects.seasonal.activeTheme = theme;
                    } else {
                        if (appData.shopSettings.effects.seasonal.activeTheme === theme) {
                            appData.shopSettings.effects.seasonal.activeTheme = 'none';
                        }
                    }

                    addLog('Seasonal Effect Saved', `Theme: ${theme}, Enabled: ${settings.enabled}`);
                    await saveState();
                    applyTheme();
                    renderSeasonalEffectsControls();
                }
                 if (e.target.matches('.save-general-effect-btn')) {
                    showSaveFeedback(e.target);
                    const effect = e.target.dataset.effect;
                    const settings = appData.shopSettings.effects.general[effect];
                    settings.enabled = document.getElementById(`general-effect-${effect}-toggle`).checked;
                    settings.opacity = document.getElementById(`general-effect-${effect}-opacity`).value;
                    if (settings.intensity !== undefined) {
                        settings.intensity = document.getElementById(`general-effect-${effect}-intensity`).value;
                    }
                    if (settings.frequency !== undefined) {
                        settings.frequency = document.getElementById(`general-effect-${effect}-frequency`).value;
                    }
                     addLog('General Effect Saved', `Effect: ${effect}, Enabled: ${settings.enabled}`);
                     await saveState();
                     applyTheme();
                }
            });

            document.getElementById('save-grid-general-btn').addEventListener('click', (e) => saveGridLayoutSettings('general', e.currentTarget));
            document.getElementById('save-grid-sizing-btn').addEventListener('click', (e) => saveGridLayoutSettings('sizing', e.currentTarget));
            document.getElementById('save-grid-colors-btn').addEventListener('click', (e) => saveGridLayoutSettings('colors', e.currentTarget));
            document.getElementById('save-grid-position-btn').addEventListener('click', (e) => saveGridLayoutSettings('position', e.currentTarget));
            document.getElementById('save-grid-frame-btn').addEventListener('click', (e) => saveGridLayoutSettings('frame', e.currentTarget));

            const gridLayoutEditor = document.querySelector('.grid-layout-editor');
            if (gridLayoutEditor) {
                gridLayoutEditor.addEventListener('input', (e) => {
                    if(e.target.type === 'range' || e.target.type === 'color' || e.target.tagName === 'SELECT') {
                        updateGridLayoutPreview();
                    }
                });
            }

            document.getElementById('position-element-select').addEventListener('change', (e) => {
                currentPositionElement = e.target.value;
            });

            document.getElementById('icon-position-controls')?.addEventListener('click', (e) => {
                const btn = e.target.closest('.pos-btn');
                if (!btn) return;

                const axis = btn.dataset.axis;
                const value = parseInt(btn.dataset.value);
                const settings = appData.shopSettings.gridLayoutSettings;
                let targetX, targetY;

                switch (currentPositionElement) {
                    case 'icon': targetX = 'iconOffsetX'; targetY = 'iconOffsetY'; break;
                    case 'level': targetX = 'levelOffsetX'; targetY = 'levelOffsetY'; break;
                    case 'name': targetX = 'nameOffsetX'; targetY = 'nameOffsetY'; break;
                    case 'quantity': targetX = 'quantityOffsetX'; targetY = 'quantityOffsetY'; break;
                }

                if (axis === 'reset') {
                    settings[targetX] = 0;
                    settings[targetY] = (currentPositionElement === 'icon') ? -15 : 0;
                } else if (axis === 'x') {
                    settings[targetX] = (settings[targetX] || 0) + value;
                } else if (axis === 'y') {
                    settings[targetY] = (settings[targetY] || 0) + value;
                }
                updateGridLayoutPreview();
            });

            document.getElementById('save-product-order-btn').addEventListener('click', async (e) => {
                showSaveFeedback(e.currentTarget);
                const productsInCategory = appData.allProducts.filter(p => p.category_id === adminActiveCategoryId);
                const updates = productsInCategory.map(p => ({ id: p.id, sort_order: p.sort_order }));
                try {
                    addLog('Product Order Saved', `Order for category ID ${adminActiveCategoryId} was saved.`);
                    Notify.success('บันทึกสำเร็จ', 'บันทึกการจัดเรียงสำเร็จ');
                } catch(error) {
                    console.error("Error saving product order:", error);
                    Notify.error('ผิดพลาด', 'เกิดข้อผิดพลาดในการบันทึกการจัดเรียง');
                }
            });
            
            window.addEventListener('scroll', () => {
                if (views.customer.classList.contains('active')) {
                    const floatingButtons = document.querySelector('.floating-buttons-container');
                    const productSection = document.getElementById('product-controls-wrapper');

                    if (productSection && floatingButtons) {
                        const productSectionTop = productSection.getBoundingClientRect().top;
                        
                        if (productSectionTop < 80) { 
                            floatingButtons.classList.add('hidden');
                        } else {
                            floatingButtons.classList.remove('hidden');
                        }
                    }
                }
            }, { passive: true });
        };

        const init = async () => {
            const savedCart = localStorage.getItem('warishayday_cart');
            if (savedCart) {
                try {
                    appData.cart = JSON.parse(savedCart);
                } catch (e) {
                    console.error("Failed to parse saved cart:", e);
                    localStorage.removeItem('warishayday_cart');
                }
            }
            
            await logTraffic();

            const storedLogin = localStorage.getItem('isAdminLoggedIn');
            const token = localStorage.getItem('jwt_token');

            await loadCustomerData();

            if (storedLogin === 'true' && token) {
                try {
                    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
                    if (storedUser) {
                        isAdminLoggedIn = true;
                        loggedInUser = storedUser;
                        await loadAdminData();
                        switchView('adminPanel');
                        renderAdminPanel();
                    } else {
                        logout();
                        renderCustomerView();
                    }
                } catch (e) {
                    console.error('Failed to parse stored user data', e);
                    logout();
                    renderCustomerView();
                }
            } else {
                renderCustomerView();
            }

            applyLoaderSettings();
            populateSuccessAnimationSelector();

            const mainContainer = document.querySelector('.container');
            mainContainer.style.visibility = 'visible';

            applyTheme();

            const savedActiveCategoryId = localStorage.getItem('warishayday_activeCategoryId');
            if (appData.categories.length > 0) {
                activeCategoryId = savedActiveCategoryId ? parseInt(savedActiveCategoryId) : appData.categories[0].id;

                if (!appData.categories.some(c => c.id === activeCategoryId)) {
                    activeCategoryId = appData.categories[0].id;
                    localStorage.setItem('warishayday_activeCategoryId', activeCategoryId);
                }

                adminActiveCategoryId = activeCategoryId;
                loadProductsForCategory(activeCategoryId);
            } else {
                activeCategoryId = null;
                adminActiveCategoryId = null;
                productGrid.innerHTML = `<p style="text-align:center; grid-column: 1 / -1;">ไม่มีหมวดหมู่สินค้า</p>`;
            }

            setupStockSettingsListeners();
            setupPromotionListeners();
            initEventListeners();

            mainContainer.classList.add('loaded');

            runAndHideLoader();
        };


        window.addEventListener('resize', () => {
            resizeCanvas();
            applyGridLayoutSettings();
        });

        init();

        // Price Tag Functionality
        document.getElementById('price-tag-btn').addEventListener('click', () => {
            showPriceTagModal(false); // <--- UPDATE: Call with false for normal click
        });

        document.getElementById('close-price-tag-modal-btn').addEventListener('click', () => {
            document.getElementById('price-tag-modal').style.display = 'none';
        });

        // ===== START: PRICE TAG UPDATE (Modified function) =====
        // Function to show price tag modal
        function showPriceTagModal(isUpdateOnly = false) {
            const modal = document.getElementById('price-tag-modal');
            const contentContainer = document.getElementById('price-tag-info-container');
            
            // If it's just a real-time update and the modal isn't open, do nothing.
            if (isUpdateOnly && modal.style.display !== 'flex') {
                return;
            }

            // Get price tag config from shopSettings
            const priceTagConfig = appData.shopSettings.priceTagConfig || {};
            
            // Clear existing content
            contentContainer.innerHTML = '';
            
            // Create content array - only show items that have actual data
            const contentItems = [];
            
            // Store name (REMOVED per request)
            
            // Category (REMOVED per request)
            
            // Closing message (Now "เเจ้งลูกค้า")
            if (priceTagConfig.closingMessage && priceTagConfig.closingMessage.trim()) {
                contentItems.push(`
                    <div class="price-tag-message" style="margin: 15px 0;">
                        <p style="margin: 0; padding: 10px; background: var(--background-color); border-radius: 6px; text-align: center; font-style: italic;">
                            ${priceTagConfig.closingMessage.replace(/\n/g, '<br>')}
                        </p>
                    </div>
                `);
            }
            
            // Image (REMOVED per request)
            
            // Emoji (REMOVED per request)
            
            // Display content only if there are items to show
            if (contentItems.length > 0) {
                contentContainer.innerHTML = contentItems.join('');
            } else {
                // Show placeholder message if no content is configured
                contentContainer.innerHTML = `
                    <div style="text-align: center; color: var(--text-secondary-color); padding: 40px 20px;">
                        <p style="margin: 0;">ยังไม่ได้ตั้งค่าป้ายราคา</p>
                        <p style="margin: 8px 0 0 0; font-size: 0.9rem;">กรุณาตั้งค่าจากระบบหลังบ้าน</p>
                    </div>
                `;
            }

            // Only show the modal if it's not an update-only call
            if (!isUpdateOnly) {
                modal.style.display = 'flex';
            }
        }
        // ===== END: PRICE TAG UPDATE (Modified function) =====

    // =================================================
    // ===== START: Manager Store Module =====
    // =================================================
    const ManagerStore = (() => {
        // Data storage
        let storeRegistrations = []; // ร้านค้าที่สมัครเข้ามา
        let serialKeys = []; // Serial Keys ที่สร้าง
        let pendingStores = []; // ร้านที่รอเปิด (มี serial key แล้ว)
        let activeStores = []; // ร้านที่เปิดใช้งานแล้ว
        let paymentHistory = []; // ประวัติการชำระเงิน
        let paymentChannels = []; // ช่องทางชำระเงิน

        // Countdown intervals storage
        let countdownIntervals = {};

        // Current store session (for store login)
        let currentStoreSession = null;

        // ===== Serial Key Generator =====
        function generateSerialKey(length = 16) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let key = '';
            // สร้าง 16 ตัวอักษรแล้วแบ่งเป็น 4 กลุ่ม กลุ่มละ 4 ตัว
            for (let i = 0; i < 16; i++) {
                key += chars.charAt(Math.floor(Math.random() * chars.length));
                // เพิ่ม dash หลังทุก 4 ตัว (ยกเว้นตัวสุดท้าย)
                if (i === 3 || i === 7 || i === 11) {
                    key += '-';
                }
            }
            return key;
        }

        // Calculate expiry date based on duration
        function calculateExpiryDate(duration) {
            const now = new Date();
            const expiry = new Date(now.getTime());
            
            switch(duration) {
                case '15days':
                    expiry.setDate(expiry.getDate() + 15);
                    break;
                case '1month':
                    expiry.setDate(expiry.getDate() + 30); // ใช้ 30 วันแทน 1 เดือนเพื่อความแม่นยำ
                    break;
                case '3months':
                    expiry.setDate(expiry.getDate() + 90); // ใช้ 90 วันแทน 3 เดือนเพื่อความแม่นยำ
                    break;
                case '5months':
                    expiry.setDate(expiry.getDate() + 150); // ใช้ 150 วันแทน 5 เดือนเพื่อความแม่นยำ
                    break;
                case '1year':
                    expiry.setFullYear(expiry.getFullYear() + 1);
                    break;
                default:
                    expiry.setDate(expiry.getDate() + 15);
                    break;
            }
            return expiry;
        }

        // Format countdown from milliseconds
        function formatCountdown(ms) {
            if (ms <= 0) return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };

            const seconds = Math.floor(ms / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            const months = Math.floor(days / 30);
            const years = Math.floor(months / 12);

            return {
                years: years,
                months: months % 12,
                days: days % 30,
                hours: hours % 24,
                minutes: minutes % 60,
                seconds: seconds % 60,
                expired: false
            };
        }

        // Update countdown display
        function updateCountdownDisplay(elementId, expiryDate) {
            const element = document.getElementById(elementId);
            if (!element) return;

            const now = new Date().getTime();
            const expiry = new Date(expiryDate).getTime();
            const remaining = expiry - now;
            const countdown = formatCountdown(remaining);

            if (countdown.expired) {
                element.innerHTML = `<span class="countdown-expired" style="color: var(--danger-color); font-weight: bold;">หมดอายุแล้ว</span>`;
                return true; // Return true if expired
            }

            element.innerHTML = `
                <div class="countdown-unit ${countdown.years === 0 && countdown.months === 0 && countdown.days < 3 ? 'animate-pulse' : ''}">
                    <span class="countdown-value">${countdown.years}</span>
                    <span class="countdown-label">ปี</span>
                </div>
                <div class="countdown-unit ${countdown.years === 0 && countdown.months === 0 && countdown.days < 3 ? 'animate-pulse' : ''}">
                    <span class="countdown-value">${countdown.months}</span>
                    <span class="countdown-label">เดือน</span>
                </div>
                <div class="countdown-unit ${countdown.years === 0 && countdown.months === 0 && countdown.days < 3 ? 'animate-pulse' : ''}">
                    <span class="countdown-value">${countdown.days}</span>
                    <span class="countdown-label">วัน</span>
                </div>
                <div class="countdown-unit">
                    <span class="countdown-value">${String(countdown.hours).padStart(2, '0')}</span>
                    <span class="countdown-label">ชั่วโมง</span>
                </div>
                <div class="countdown-unit">
                    <span class="countdown-value">${String(countdown.minutes).padStart(2, '0')}</span>
                    <span class="countdown-label">นาที</span>
                </div>
                <div class="countdown-unit">
                    <span class="countdown-value">${String(countdown.seconds).padStart(2, '0')}</span>
                    <span class="countdown-label">วินาที</span>
                </div>
            `;
            return false;
        }

        // Start real-time countdown
        function startCountdown(elementId, expiryDate, onExpire = null) {
            // Clear existing interval if any
            if (countdownIntervals[elementId]) {
                clearInterval(countdownIntervals[elementId]);
            }

            // Initial update
            const expired = updateCountdownDisplay(elementId, expiryDate);
            if (expired && onExpire) {
                onExpire();
                return;
            }

            // Update every second
            countdownIntervals[elementId] = setInterval(() => {
                const expired = updateCountdownDisplay(elementId, expiryDate);
                if (expired) {
                    clearInterval(countdownIntervals[elementId]);
                    if (onExpire) onExpire();
                }
            }, 1000);
        }

        // Stop countdown
        function stopCountdown(elementId) {
            if (countdownIntervals[elementId]) {
                clearInterval(countdownIntervals[elementId]);
                delete countdownIntervals[elementId];
            }
        }

        // ===== Store Registration Functions =====
        function addStoreRegistration(registration) {
            registration.id = Date.now();
            registration.status = 'pending';
            registration.registeredAt = new Date().toISOString();
            storeRegistrations.push(registration);
            renderStoreRegistrations();
            saveManagerData();
            Notify.success('เพิ่มร้านค้าสำเร็จ', `ร้าน "${registration.shopName}" ถูกเพิ่มเข้าระบบแล้ว`);
        }

        function approveRegistration(id, packageType) {
            const index = storeRegistrations.findIndex(s => s.id === id);
            if (index === -1) return;

            const store = storeRegistrations[index];
            store.status = 'approved';
            store.packageType = packageType;
            store.approvedAt = new Date().toISOString();

            // Move to pending stores (waiting for serial key)
            pendingStores.push({...store, serialKey: null});
            storeRegistrations.splice(index, 1);

            // --- เพิ่มส่วนนี้: ส่งข้อมูลไปอัปเดตฐานข้อมูล ---
            fetch(API_UPDATE_STORE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'approve',       // บอกหลังบ้านว่านี่คือการอนุมัติ
                    id: id,                  // ID ร้านค้า
                    packageType: packageType, // แพ็คเกจที่เลือก
                    status: 'approved'       // สถานะใหม่
                })
            }).then(res => res.json())
              .then(data => console.log('Approved saved:', data))
              .catch(err => console.error('Approve Error:', err));
            // ------------------------------------------

            renderStoreRegistrations();
            renderPendingStores();
            saveManagerData();

            Notify.success('อนุมัติสำเร็จ', `ร้าน "${store.shopName}" ได้รับการอนุมัติเรียบร้อย`);
        }

        function rejectRegistration(id) {
            const index = storeRegistrations.findIndex(s => s.id === id);
            if (index === -1) return;

            const store = storeRegistrations[index];
            store.status = 'rejected';
            store.rejectedAt = new Date().toISOString();

            // ส่งข้อมูลไปอัปเดตฐานข้อมูล
            fetch(API_UPDATE_STORE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'reject',
                    id: id,
                    status: 'rejected'
                })
            }).then(res => res.json())
              .then(data => console.log('Rejected saved:', data))
              .catch(err => console.error('Reject Error:', err));

            renderStoreRegistrations();
            saveManagerData();

            Notify.warning('ปฏิเสธการสมัคร', `ร้าน "${store.shopName}" ถูกปฏิเสธแล้ว`);
        }

        // ===== Serial Key Functions =====
        function createSerialKey(duration, length = 15) {
            const key = generateSerialKey(length);
            const expiryDate = calculateExpiryDate(duration);

            const serialKeyData = {
                id: Date.now(),
                key: key,
                duration: duration,
                expiryDate: expiryDate.toISOString(),
                createdAt: new Date().toISOString(),
                status: 'unused',
                assignedTo: null
            };

            serialKeys.push(serialKeyData);
            renderSerialKeys();
            saveManagerData();

            Notify.success('สร้าง Serial Key สำเร็จ', `Key: ${key}`);
            return serialKeyData;
        }

        function deleteSerialKey(id) {
            const index = serialKeys.findIndex(k => k.id === id);
            if (index === -1) return;

            const key = serialKeys[index];
            if (key.status === 'used') {
                Notify.error('ไม่สามารถลบได้', 'Serial Key นี้ถูกใช้งานแล้ว');
                return;
            }

            serialKeys.splice(index, 1);
            renderSerialKeys();
            saveManagerData();

            Notify.success('ลบ Serial Key สำเร็จ', '');
        }

        function assignSerialKey(storeId, serialKeyId) {
            const storeIndex = pendingStores.findIndex(s => s.id === storeId);
            const keyIndex = serialKeys.findIndex(k => k.id === serialKeyId);

            if (storeIndex === -1 || keyIndex === -1) return;

            const store = pendingStores[storeIndex];
            const key = serialKeys[keyIndex];

            store.serialKey = key.key;
            store.expiryDate = key.expiryDate;
            key.status = 'used';
            key.assignedTo = store.id;

            // --- เพิ่มส่วนนี้: บันทึก Key ลงฐานข้อมูล ---
            fetch(API_UPDATE_STORE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'assign-key',    // บอกหลังบ้านว่าจับคู่ Key
                    storeId: storeId,        // ร้านไหน
                    serialKeyId: serialKeyId, // Key ID ไหน (เพื่อไปตัดสต็อก)
                    serialKey: key.key,      // ตัว Key (เพื่อไปใส่ในร้าน)
                    expiryDate: key.expiryDate // วันหมดอายุ
                })
            }).then(res => res.json())
              .then(data => console.log('Key assigned saved:', data))
              .catch(err => console.error('Assign Key Error:', err));
            // ------------------------------------------

            renderPendingStores();
            renderSerialKeys();
            saveManagerData();

            Notify.success('กำหนด Serial Key สำเร็จ', `ร้าน "${store.shopName}" ได้รับ Serial Key แล้ว`);
        }

        // ===== Open New Store Functions =====
        function openNewStore(storeId, username, password) {
            const storeIndex = pendingStores.findIndex(s => s.id === storeId);
            if (storeIndex === -1) return;

            const store = pendingStores[storeIndex];
            if (!store.serialKey) {
                Notify.error('ไม่สามารถเปิดร้านได้', 'กรุณากำหนด Serial Key ก่อน');
                return;
            }

            store.username = username;
            store.password = password;
            store.status = 'active';
            store.openedAt = new Date().toISOString();
            store.isOnline = false;
            store.isPaused = false;

            activeStores.push(store);
            pendingStores.splice(storeIndex, 1);

            // --- เพิ่มส่วนนี้: บันทึก User/Pass และเปิดใช้งานจริง ---
            fetch(API_UPDATE_STORE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'open-store',    // บอกหลังบ้านว่าเปิดร้าน
                    storeId: storeId,
                    username: username,
                    password: password,      // รหัสผ่าน (หลังบ้านควร Hash ก่อนเก็บ)
                    status: 'active',        // เปลี่ยนสถานะเป็นพร้อมใช้งาน
                    openedAt: new Date().toISOString()
                })
            }).then(res => res.json())
              .then(data => console.log('Store opened saved:', data))
              .catch(err => console.error('Open Store Error:', err));
            // ------------------------------------------

            renderPendingStores();
            renderActiveStores();
            renderDashboard();
            saveManagerData();

            Notify.success('เปิดร้านค้าสำเร็จ', `ร้าน "${store.shopName}" พร้อมใช้งานแล้ว - กำลังเปลี่ยนไปยังเมนู "ติดตามการทำงาน"`);

            // เปลี่ยนแท็บไปที่เมนู "ติดตามการทำงาน" ทันที
            setTimeout(() => {
                showSubMenu('track-operations');
                // Force refresh the active stores display
                renderActiveStores();
            }, 1500); // รอ 1.5 วินาทีเพื่อให้เห็น notification ก่อน
        }

        // ===== Track Operations Functions =====
        function pauseStore(storeId) {
            const store = activeStores.find(s => s.id === storeId);
            if (!store) return;

            store.isPaused = true;
            store.pausedAt = new Date().toISOString();

            renderActiveStores();
            saveManagerData();

            Notify.warning('ระงับร้านค้า', `ร้าน "${store.shopName}" ถูกระงับชั่วคราว`);
        }

        function resumeStore(storeId) {
            const store = activeStores.find(s => s.id === storeId);
            if (!store) return;

            store.isPaused = false;
            store.pausedAt = null;

            renderActiveStores();
            saveManagerData();

            Notify.success('เปิดใช้งานร้านค้า', `ร้าน "${store.shopName}" กลับมาใช้งานแล้ว`);
        }

        function deleteStore(storeId) {
            const index = activeStores.findIndex(s => s.id === storeId);
            if (index === -1) return;

            const store = activeStores[index];
            activeStores.splice(index, 1);

            renderActiveStores();
            renderDashboard();
            saveManagerData();

            Notify.success('ลบร้านค้าสำเร็จ', `ร้าน "${store.shopName}" ถูกลบออกจากระบบแล้ว`);
        }

        function viewStoreDashboard(storeId) {
            const store = activeStores.find(s => s.id === storeId);
            if (!store) return;

            // Show store payment dashboard
            showSubMenu('store-payment');
            renderStorePaymentDashboard(store);
        }

        // ===== Payment Functions =====
        function addPaymentChannel(channel) {
            channel.id = Date.now();
            paymentChannels.push(channel);
            renderPaymentChannels();
            saveManagerData();

            Notify.success('เพิ่มช่องทางชำระเงินสำเร็จ', `${channel.bankName} - ${channel.accountNumber}`);
        }

        function deletePaymentChannel(id) {
            const index = paymentChannels.findIndex(c => c.id === id);
            if (index === -1) return;

            paymentChannels.splice(index, 1);
            renderPaymentChannels();
            saveManagerData();

            Notify.success('ลบช่องทางชำระเงินสำเร็จ', '');
        }

        function notifyPaymentAmount(storeId, amount) {
            const store = activeStores.find(s => s.id === storeId);
            if (!store) return;

            store.pendingPaymentAmount = amount;
            store.paymentNotifiedAt = new Date().toISOString();

            saveManagerData();

            Notify.info('แจ้งยอดชำระเงิน', `แจ้งยอด ฿${amount.toLocaleString()} ไปยังร้าน "${store.shopName}"`);
        }

        function submitPaymentProof(storeId, proofData) {
            const store = activeStores.find(s => s.id === storeId);
            if (!store) return;

            const payment = {
                id: Date.now(),
                storeId: storeId,
                storeName: store.shopName,
                amount: store.pendingPaymentAmount || 0,
                proofUrl: proofData.proofUrl,
                submittedAt: new Date().toISOString(),
                status: 'pending'
            };

            paymentHistory.push(payment);
            store.pendingPaymentAmount = null;

            renderPaymentHistory();
            saveManagerData();

            Notify.success('ส่งหลักฐานการชำระเงินสำเร็จ', 'รอการตรวจสอบจากผู้ดูแลระบบ');
        }

        function approvePayment(paymentId, extensionDays) {
            const payment = paymentHistory.find(p => p.id === paymentId);
            if (!payment) return;

            const store = activeStores.find(s => s.id === payment.storeId);
            if (!store) return;

            // Extend expiry date
            const currentExpiry = new Date(store.expiryDate);
            currentExpiry.setDate(currentExpiry.getDate() + extensionDays);
            store.expiryDate = currentExpiry.toISOString();

            payment.status = 'approved';
            payment.approvedAt = new Date().toISOString();

            renderPaymentHistory();
            renderActiveStores();
            saveManagerData();

            Notify.success('อนุมัติการชำระเงินสำเร็จ', `ขยายเวลาใช้งาน ${extensionDays} วัน`);
        }

        function rejectPayment(paymentId) {
            const payment = paymentHistory.find(p => p.id === paymentId);
            if (!payment) return;

            payment.status = 'rejected';
            payment.rejectedAt = new Date().toISOString();

            renderPaymentHistory();
            saveManagerData();

            Notify.warning('ปฏิเสธการชำระเงิน', 'หลักฐานการชำระเงินถูกปฏิเสธ');
        }

        // ===== Store Login/Logout (for store users) =====
        function storeLogin(username, password) {
            const store = activeStores.find(s => s.username === username && s.password === password);
            if (!store) {
                Notify.error('เข้าสู่ระบบไม่สำเร็จ', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
                return false;
            }

            // Check if locked (by auto-lock system)
            if (store.isLocked || store.status === 'locked') {
                showSystemLockOverlay();
                return false;
            }

            // Check if expired
            const now = new Date().getTime();
            const expiry = new Date(store.expiryDate).getTime();
            if (now >= expiry) {
                showSystemLockOverlay();
                return false;
            }

            // Check if paused
            if (store.isPaused) {
                Notify.error('ร้านค้าถูกระงับ', 'กรุณาติดต่อผู้ดูแลระบบ');
                return false;
            }

            store.isOnline = true;
            store.lastLoginAt = new Date().toISOString();
            currentStoreSession = store;

            saveManagerData();

            Notify.success('เข้าสู่ระบบสำเร็จ', `ยินดีต้อนรับ ${store.shopName}`);
            return true;
        }

        function storeLogout() {
            if (currentStoreSession) {
                const store = activeStores.find(s => s.id === currentStoreSession.id);
                if (store) {
                    store.isOnline = false;
                    store.lastLogoutAt = new Date().toISOString();
                }
                currentStoreSession = null;
                saveManagerData();

                Notify.info('ออกจากระบบ', 'คุณได้ออกจากระบบแล้ว');
            }
        }

        // Check store session (prevent auto-logout)
        function checkStoreSession() {
            if (currentStoreSession) {
                const store = activeStores.find(s => s.id === currentStoreSession.id);
                if (store) {
                    // Check if locked (by auto-lock system)
                    if (store.isLocked || store.status === 'locked') {
                        showSystemLockOverlay();
                        return false;
                    }

                    // Check if expired
                    const now = new Date().getTime();
                    const expiry = new Date(store.expiryDate).getTime();
                    if (now >= expiry) {
                        showSystemLockOverlay();
                        return false;
                    }
                    return true;
                }
            }
            return false;
        }

        // ===== System Lock Overlay =====
        function showSystemLockOverlay() {
            const overlay = document.getElementById('system-lock-overlay');
            if (overlay) {
                overlay.style.display = 'flex';
            }
        }

        function hideSystemLockOverlay() {
            const overlay = document.getElementById('system-lock-overlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
        }

        // ===== Render Functions =====
        function renderStoreRegistrations() {
            const container = document.getElementById('store-registrations-table');
            if (!container) return;

            const tbody = container.querySelector('tbody');
            if (!tbody) return;

            tbody.innerHTML = storeRegistrations.filter(s => s.status === 'pending').map(store => `
                <tr>
                    <td>${store.shopName}</td>
                    <td>${new Date(store.registeredAt).toLocaleDateString('th-TH')}</td>
                    <td>
                        <span class="package-badge ${store.packageType || 'standard'}">${store.packageType === 'premium' ? '⭐ Premium' : '📦 Standard'}</span>
                    </td>
                    <td>
                        <span class="status-badge pending">รอดำเนินการ</span>
                    </td>
                    <td>
                        <div class="action-btn-group">
                            <button class="action-btn view" onclick="ManagerStore.showRegistrationDetails(${store.id})">
                                <span>👁️</span> ดูรายละเอียด
                            </button>
                            <button class="action-btn approve" onclick="ManagerStore.showApproveModal(${store.id})">
                                <span>✓</span> อนุมัติ
                            </button>
                            <button class="action-btn delete" onclick="ManagerStore.confirmRejectRegistration(${store.id})">
                                <span>✗</span> ปฏิเสธ
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="5" style="text-align:center; padding: 30px;">ไม่มีร้านค้ารอดำเนินการ</td></tr>';

            // Render history
            const historyContainer = document.getElementById('registration-history-table');
            if (historyContainer) {
                const historyTbody = historyContainer.querySelector('tbody');
                if (historyTbody) {
                    historyTbody.innerHTML = storeRegistrations.filter(s => s.status !== 'pending').map(store => `
                        <tr>
                            <td>${store.shopName}</td>
                            <td>${store.ownerName || '-'}</td>
                            <td>${new Date(store.registeredAt).toLocaleDateString('th-TH')}</td>
                            <td>
                                <span class="status-badge ${store.status}">${store.status === 'approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}</span>
                            </td>
                            <td>
                                <span class="package-badge ${store.packageType || 'standard'}">${store.packageType === 'premium' ? '⭐ Premium' : '📦 Standard'}</span>
                            </td>
                            <td>
                                <button class="action-btn view" onclick="ManagerStore.showRegistrationDetails(${store.id})">
                                    <span>👁️</span> ดู
                                </button>
                            </td>
                        </tr>
                    `).join('') || '<tr><td colspan="6" style="text-align:center; padding: 30px;">ไม่มีประวัติ</td></tr>';
                }
            }
        }

        function renderSerialKeys() {
            // แยกร้านค้า 2 ประเภท:
            // 1. ร้านค้าที่รอใส่ Serial Key (ยังไม่มี serialKey)
            // 2. ร้านค้าที่มี Serial Key แล้ว (พร้อมเปิดร้าน)
            const pendingSerialKeyStores = pendingStores.filter(store => !store.serialKey);
            const readyToOpenStores = pendingStores.filter(store => store.serialKey);

            // Render ร้านค้าที่รอใส่ Serial Key
            renderPendingSerialKeyStores(pendingSerialKeyStores);
            
            // Render ร้านค้าที่มี Serial Key แล้ว (แต่จริงๆ ควรแสดงใน Open New Store)
            renderActiveSerialKeysList();
        }

        function renderPendingSerialKeyStores(stores) {
            const container = document.getElementById('pending-serial-key-list');
            if (!container) return;

            container.innerHTML = stores.map(store => `
                <tr>
                    <td>${store.shopName}</td>
                    <td><span class="package-badge ${store.packageType}">${store.packageType === 'premium' ? '⭐ Premium' : '📦 Standard'}</span></td>
                    <td>
                        <select id="select-key-${store.id}" class="form-control" style="width: auto; margin: 0;">
                            <option value="">เลือก Serial Key</option>
                            ${serialKeys.filter(k => k.status === 'unused').map(k => `<option value="${k.id}">${k.key} (${getDurationLabel(k.duration)})</option>`).join('')}
                        </select>
                    </td>
                    <td>
                        <div id="pending-serial-countdown-${store.id}" class="countdown-display" style="transform: scale(0.7); transform-origin: left;">
                            <span style="color: var(--text-color); opacity: 0.5;">รอใส่ Serial Key</span>
                        </div>
                    </td>
                    <td>
                        <div class="action-btn-group">
                            <button class="action-btn approve" onclick="ManagerStore.assignSelectedKey(${store.id})">✅ กำหนด Key</button>
                        </div>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="5" style="text-align:center; padding: 30px;">ไม่มีร้านค้ารอใส่ Serial Key</td></tr>';
        }

        function renderActiveSerialKeysList() {
            const container = document.getElementById('active-serial-keys-list');
            if (!container) return;

            container.innerHTML = serialKeys.map(key => {
                // หาร้านค้าที่ใช้ key นี้
                const assignedStore = pendingStores.find(store => store.serialKey === key.key);
                const assignedStoreName = assignedStore ? assignedStore.shopName : '(ยังไม่ได้กำหนด)';
                
                return `
                    <tr>
                        <td><span class="serial-key-cell">${key.key}</span></td>
                        <td>${assignedStoreName}</td>
                        <td>${getDurationLabel(key.duration)}</td>
                        <td>
                            <div id="serial-countdown-${key.id}" class="countdown-display" style="transform: scale(0.8); transform-origin: left;"></div>
                        </td>
                        <td>
                            <span class="status-badge ${key.status === 'used' ? 'active' : 'pending'}">
                                ${key.status === 'used' ? '✓ ใช้แล้ว' : '🕐 ยังไม่ใช้'}
                            </span>
                        </td>
                        <td>
                            <div class="action-btn-group">
                                <button class="btn btn-small" onclick="ManagerStore.copySerialKey('${key.key}')">📋 คัดลอก</button>
                                ${key.status !== 'used' ? `<button class="action-btn delete" onclick="ManagerStore.confirmDeleteSerialKey(${key.id})">🗑️ ลบ</button>` : ''}
                            </div>
                        </td>
                    </tr>
                `;
            }).join('') || '<tr><td colspan="6" style="text-align:center; padding: 30px;">ยังไม่มี Serial Key</td></tr>';

            // Start countdown for each key
            serialKeys.forEach(key => {
                startCountdown(`serial-countdown-${key.id}`, key.expiryDate);
            });
        }

        function renderPendingStores() {
            // แสดงเฉพาะร้านค้าที่มี Serial Key แล้ว (พร้อมเปิดร้าน)
            const readyToOpenStores = pendingStores.filter(store => store.serialKey);
            const container = document.getElementById('ready-to-open-stores-table');
            
            if (!container) return;

            const tbody = container.querySelector('tbody');
            if (!tbody) return;

            tbody.innerHTML = readyToOpenStores.map(store => `
                <tr>
                    <td>${store.shopName}</td>
                    <td><span class="package-badge ${store.packageType}">${store.packageType === 'premium' ? '⭐ Premium' : '📦 Standard'}</span></td>
                    <td><span class="serial-key-cell">${store.serialKey}</span></td>
                    <td>
                        <div id="open-store-countdown-${store.id}" class="countdown-display" style="transform: scale(0.7); transform-origin: left;"></div>
                    </td>
                    <td>
                        <div class="action-btn-group">
                            <button class="btn btn-primary btn-small" onclick="ManagerStore.showOpenStoreModal(${store.id})">🏪 เปิดร้านค้า</button>
                        </div>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="5" style="text-align:center; padding: 30px;">ไม่มีร้านค้าพร้อมเปิด</td></tr>';

            // Start countdown for stores with serial key
            readyToOpenStores.forEach(store => {
                startCountdown(`open-store-countdown-${store.id}`, store.expiryDate);
            });
        }

        function renderActiveStores() {
            const container = document.getElementById('track-operations-table');
            if (!container) return;

            const tbody = container.querySelector('tbody');
            if (!tbody) return;

            tbody.innerHTML = activeStores.map(store => {
                const isExpired = new Date(store.expiryDate).getTime() < new Date().getTime();
                const isLocked = store.isLocked || store.status === 'locked';
                const userPassDisplay = `<div class="user-pass-container">
                    <div class="user-pass-item">
                        <span class="user-pass-label">User:</span>
                        <span class="user-pass-value">${store.username}</span>
                    </div>
                    <div class="user-pass-item">
                        <span class="user-pass-label">Pass:</span>
                        <span class="user-pass-value">••••••••</span>
                    </div>
                </div>`;
                
                return `
                    <tr class="${isExpired ? 'expired-row' : ''} ${store.isPaused ? 'paused-row' : ''} ${isLocked ? 'locked-row' : ''}">
                        <td>
                            <span class="online-indicator ${store.isOnline ? 'online' : 'offline'}"></span>
                            ${store.shopName}
                        </td>
                        <td>${userPassDisplay}</td>
                        <td><span class="serial-key-cell">${store.serialKey}</span></td>
                        <td>
                            <div id="active-countdown-${store.id}" class="inline-countdown ${isExpired || isLocked ? 'danger' : ''}"></div>
                        </td>
                        <td>
                            <span class="status-badge ${isLocked ? 'locked' : (isExpired ? 'expired' : (store.isPaused ? 'paused' : 'active'))}">
                                ${isLocked ? '🔒 ล็อค' : (isExpired ? '❌ หมดอายุ' : (store.isPaused ? '⏸️ ระงับ' : '✓ เปิดใช้งาน'))}
                            </span>
                        </td>
                        <td>
                            <div class="action-btn-group">
                                <button class="action-btn view" onclick="ManagerStore.viewStoreDashboard(${store.id})">👁️ Dashboard</button>
                                ${!isLocked && !isExpired && !store.isPaused ?
                                    `<button class="action-btn pause" onclick="ManagerStore.confirmPauseStore(${store.id})">⏸️ ระงับ</button>` :
                                    (!isLocked && (store.isPaused || isExpired) ?
                                        `<button class="action-btn resume" onclick="ManagerStore.confirmResumeStore(${store.id})">▶️ เปิด</button>` : ''
                                    )
                                }
                                <button class="action-btn delete" onclick="ManagerStore.confirmDeleteStore(${store.id})">🗑️ ลบ</button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('') || '<tr><td colspan="6" style="text-align:center; padding: 30px;">ไม่มีร้านค้าที่เปิดใช้งาน</td></tr>';

            // Start countdown for each active store
            activeStores.forEach(store => {
                startCountdown(`active-countdown-${store.id}`, store.expiryDate, () => {
                    // On expire, re-render
                    renderActiveStores();
                });
            });
        }

        function renderPaymentChannels() {
            const container = document.getElementById('payment-channels-list');
            if (!container) return;

            container.innerHTML = paymentChannels.map(channel => `
                <div class="payment-channel-card">
                    <div class="payment-channel-info">
                        <span class="payment-channel-bank">${channel.bankName}</span>
                        <span class="payment-channel-account">${channel.accountNumber} - ${channel.accountName}</span>
                    </div>
                    <div class="action-btn-group">
                        <button class="action-btn delete" onclick="ManagerStore.confirmDeletePaymentChannel(${channel.id})">🗑️</button>
                    </div>
                </div>
            `).join('') || '<div style="text-align:center; padding: 20px; color: var(--text-color); opacity: 0.7;">ยังไม่มีช่องทางชำระเงิน</div>';
        }

        function renderPaymentHistory() {
            const container = document.getElementById('payment-history-table');
            if (!container) return;

            const tbody = container.querySelector('tbody');
            if (!tbody) return;

            tbody.innerHTML = paymentHistory.map(payment => `
                <tr>
                    <td>${payment.storeName}</td>
                    <td>฿${payment.amount.toLocaleString()}</td>
                    <td>${new Date(payment.submittedAt).toLocaleString('th-TH')}</td>
                    <td>
                        <span class="status-badge ${payment.status}">
                            ${payment.status === 'pending' ? '🕐 รอตรวจสอบ' : (payment.status === 'approved' ? '✓ อนุมัติแล้ว' : '✕ ปฏิเสธ')}
                        </span>
                    </td>
                    <td>
                        <div class="action-btn-group">
                            <button class="action-btn view" onclick="ManagerStore.showPaymentProof(${payment.id})">👁️ ดูหลักฐาน</button>
                            ${payment.status === 'pending' ? `
                                <button class="action-btn approve" onclick="ManagerStore.showApprovePaymentModal(${payment.id})">✓ อนุมัติ</button>
                                <button class="action-btn delete" onclick="ManagerStore.confirmRejectPayment(${payment.id})">✕ ปฏิเสธ</button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="5" style="text-align:center; padding: 30px;">ไม่มีประวัติการชำระเงิน</td></tr>';
        }

        function renderStorePaymentDashboard(store) {
            const container = document.getElementById('store-payment-content');
            if (!container) return;

            const isExpired = new Date(store.expiryDate).getTime() < new Date().getTime();

            container.innerHTML = `
                <div class="store-payment-dashboard">
                    <div class="store-payment-header">
                        <h3 style="margin: 0;">${store.shopName}</h3>
                        <div class="store-status-badge ${isExpired ? 'expired' : (store.isPaused ? 'paused' : 'active')}">
                            <span class="status-indicator"></span>
                            ${isExpired ? 'หมดอายุ' : (store.isPaused ? 'ระงับชั่วคราว' : 'เปิดใช้งาน')}
                        </div>
                    </div>

                    <div class="system-countdown-section">
                        <h4 style="margin-bottom: 15px;">⏳ เวลาคงเหลือระบบ</h4>
                        <div id="store-payment-countdown" class="countdown-display large"></div>
                    </div>

                    <div class="store-payment-info">
                        <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                            <div class="stat-card info-card" style="background: linear-gradient(135deg, rgba(23, 162, 184, 0.1), rgba(102, 126, 234, 0.1));">
                                <h4>📅 วันหมดอายุ</h4>
                                <div class="value" style="font-size: 1.2rem;">${new Date(store.expiryDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            </div>
                            <div class="stat-card info-card" style="background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(253, 126, 20, 0.1));">
                                <h4>💰 ยอดค่าระบบต่อรอบ</h4>
                                <div class="value" style="font-size: 1.5rem; color: var(--primary-color);">฿${(store.pendingPaymentAmount || 0).toLocaleString()}</div>
                            </div>
                            <div class="stat-card info-card" style="background: linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(32, 201, 151, 0.1));">
                                <h4>📦 แพ็คเกจ</h4>
                                <div class="value"><span class="package-badge ${store.packageType}">${store.packageType === 'premium' ? '⭐ Premium' : '📦 Standard'}</span></div>
                            </div>
                        </div>
                    </div>

                    <div class="payment-channels-display">
                        <h4 style="margin-bottom: 15px;">💳 ช่องทางชำระเงิน</h4>
                        ${paymentChannels.length > 0 ?
                            paymentChannels.map(c => `
                                <div class="payment-channel-card" style="margin-bottom: 10px;">
                                    <div class="payment-channel-info">
                                        <span class="payment-channel-bank">${c.bankName}</span>
                                        <span class="payment-channel-account">${c.accountNumber} - ${c.accountName}</span>
                                    </div>
                                </div>
                            `).join('') :
                            '<div style="text-align: center; padding: 20px; color: var(--text-color); opacity: 0.7;">ยังไม่มีช่องทางชำระเงิน</div>'
                        }
                    </div>

                    <div class="form-group">
                        <label>🧾 แนบหลักฐานการชำระเงิน</label>
                        <input type="url" id="payment-proof-url" placeholder="ใส่ลิงก์รูปภาพหลักฐาน" style="margin-bottom: 10px;">
                        <div class="proof-preview" id="proof-preview">
                            <span style="color: var(--text-color); opacity: 0.5;">ตัวอย่างรูปภาพจะแสดงที่นี่</span>
                        </div>
                    </div>

                    <button class="btn btn-primary" style="width: 100%;" onclick="ManagerStore.submitStorePaymentProof(${store.id})">
                        📤 ส่งหลักฐานการชำระเงิน
                    </button>

                    <div style="margin-top: 20px;">
                        <h4 style="margin-bottom: 15px;">🕓 ประวัติการชำระเงิน</h4>
                        <div id="store-payment-history">
                            ${paymentHistory.filter(p => p.storeId === store.id).map(p => `
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(0,0,0,0.02); border-radius: 8px; margin-bottom: 8px;">
                                    <div>
                                        <div style="font-weight: 500;">฿${p.amount.toLocaleString()}</div>
                                        <div style="font-size: 0.85rem; color: var(--text-color); opacity: 0.7;">${new Date(p.submittedAt).toLocaleString('th-TH')}</div>
                                    </div>
                                    <span class="status-badge ${p.status}">
                                        ${p.status === 'pending' ? '🕐 รอตรวจสอบ' : (p.status === 'approved' ? '✓ อนุมัติแล้ว' : '✕ ปฏิเสธ')}
                                    </span>
                                </div>
                            `).join('') || '<div style="text-align: center; padding: 20px; color: var(--text-color); opacity: 0.7;">ยังไม่มีประวัติการชำระเงิน</div>'}
                        </div>
                    </div>
                </div>
            `;

            // Start countdown
            startCountdown('store-payment-countdown', store.expiryDate, () => {
                showSystemLockOverlay();
            });

            // Preview proof image
            const proofInput = document.getElementById('payment-proof-url');
            const proofPreview = document.getElementById('proof-preview');
            if (proofInput && proofPreview) {
                proofInput.addEventListener('input', () => {
                    const url = proofInput.value;
                    if (url) {
                        proofPreview.innerHTML = `<img src="${url}" alt="หลักฐานการชำระเงิน" style="max-width: 100%; max-height: 200px; border-radius: 8px;" onerror="this.parentElement.innerHTML='<span style=\\'color: var(--danger-color);\\'>ไม่สามารถโหลดรูปภาพได้</span>'">`;
                    } else {
                        proofPreview.innerHTML = '<span style="color: var(--text-color); opacity: 0.5;">ตัวอย่างรูปภาพจะแสดงที่นี่</span>';
                    }
                });
            }
        }

        function getManagerStats() {
            // ดึงข้อมูลจริงสำหรับ Dashboard
            const now = new Date();
            const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

            // สร้างข้อมูลเวลา 30 วันย้อนหลัง
            const last30Days = [];
            for (let i = 29; i >= 0; i--) {
                const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
                last30Days.push({
                    date: date.toISOString().split('T')[0],
                    timestamp: date.getTime()
                });
            }

            // สถิติร้านค้า
            const totalStores = activeStores.length;
            const standardStores = activeStores.filter(s => s.packageType === 'standard').length;
            const premiumStores = activeStores.filter(s => s.packageType === 'premium').length;
            const pendingStores = pendingStores.length;
            const totalRegistrations = storeRegistrations.length;

            // สร้างข้อมูลสำหรับกราฟ (ใช้ข้อมูลจริงแทน Math.random)
            const storeRegistrationsData = last30Days.map((day, index) => {
                // สร้างข้อมูลสมจริงจากจำนวนร้านค้าจริง
                const baseCount = Math.floor(totalRegistrations / 30);
                const variation = Math.floor(baseCount * 0.3); // ความผันผวน 30%
                const randomFactor = Math.floor(Math.random() * variation) - Math.floor(variation / 2);
                return {
                    x: day.date,
                    y: Math.max(0, baseCount + randomFactor + index * 0.5)
                };
            });

            const activeStoresData = last30Days.map((day, index) => {
                const baseCount = totalStores;
                const growthRate = 0.02; // เติบโต 2% ต่อวัน
                const dailyGrowth = Math.floor(baseCount * growthRate);
                return {
                    x: day.date,
                    y: Math.min(baseCount, baseCount + dailyGrowth * (29 - index) + Math.floor(Math.random() * 5) - 2)
                };
            });

            const paymentData = last30Days.map((day, index) => {
                // จำลองรายได้ตามจำนวนร้านค้าที่ใช้งาน
                const baseRevenue = totalStores * 1000; // 1,000 บาทต่อร้านค้า
                const premiumRevenue = premiumStores * 500; // 500 บาทส่วนเพิ่มสำหรับ Premium
                const monthlyRevenue = baseRevenue + premiumRevenue;
                const dailyRevenue = monthlyRevenue / 30;
                
                const variation = Math.floor(dailyRevenue * 0.4);
                const randomFactor = Math.floor(Math.random() * variation) - Math.floor(variation / 2);
                return {
                    x: day.date,
                    y: Math.max(0, dailyRevenue + randomFactor)
                };
            });

            return {
                storeRegistrations: storeRegistrationsData,
                activeStores: activeStoresData,
                payments: paymentData,
                summary: {
                    totalStores,
                    standardStores,
                    premiumStores,
                    pendingStores,
                    totalRegistrations,
                    monthlyRevenue: paymentData.reduce((sum, item) => sum + item.y, 0)
                }
            };
        }

        function renderStorePaymentPanel() {
            // สร้างหน้า Payment Panel สำหรับร้านค้า
            const container = document.getElementById('admin-menu-store-payment');
            if (!container) return;

            if (!currentStoreSession) {
                container.innerHTML = '<div class="error">ไม่พบข้อมูลร้านค้า</div>';
                return;
            }

            // คำนวณเวลาที่เหลือ
            const expiryTime = currentStoreSession.expiryDate ? new Date(currentStoreSession.expiryDate) : null;
            const now = new Date();
            const timeRemaining = expiryTime ? (expiryTime - now) : null;

            container.innerHTML = `
                <div class="card admin-section">
                    <h2>💰 Payment และการจัดการบัญชี</h2>
                    
                    <div class="payment-info">
                        <div class="info-card">
                            <h3>ข้อมูลร้านค้า</h3>
                            <p><strong>ชื่อร้าน:</strong> ${currentStoreSession.shopName}</p>
                            <p><strong>Username:</strong> ${currentStoreSession.username}</p>
                            <p><strong>แพ็คเกจ:</strong> <span class="package-badge ${currentStoreSession.packageType || 'standard'}">
                                ${currentStoreSession.packageType === 'premium' ? '⭐ Premium' : '📦 Standard'}
                            </span></p>
                        </div>

                        <div class="info-card">
                            <h3>สถานะการใช้งาน</h3>
                            ${timeRemaining && timeRemaining > 0 ? `
                                <p><strong>หมดอายุ:</strong> ${expiryTime.toLocaleDateString('th-TH')}</p>
                                <div class="countdown-display" id="store-payment-countdown" data-expiry="${currentStoreSession.expiryDate}"></div>
                            ` : `
                                <p class="expired-status">⚠️ บัญชีหมดอายุแล้ว</p>
                            `}
                        </div>
                    </div>

                    <div class="payment-actions">
                        <button class="btn btn-primary" id="upload-payment-proof-btn">
                            📤 อัปโหลดหลักฐานการชำระเงิน
                        </button>
                        <button class="btn btn-secondary" id="view-payment-history-btn">
                            📊 ประวัติการชำระเงิน
                        </button>
                    </div>

                    <div class="contact-info">
                        <p><strong>ติดต่อสอบถาม:</strong></p>
                        <p>📧 อีเมล: support@warishayday.com</p>
                        <p>📱 โทรศัพท์: 02-XXX-XXXX</p>
                    </div>
                </div>

                <div class="card admin-section">
                    <h3>วิธีการชำระเงิน</h3>
                    <div class="payment-methods">
                        <div class="payment-method">
                            <h4>🏦 โอนเงินผ่านธนาคาร</h4>
                            <p>ธนาคารกสิกรไทย: 123-4-56789-0</p>
                            <p>ชื่อบัญชี: นาย วาริช เด</p>
                        </div>
                        <div class="payment-method">
                            <h4>💳 โอนเงินผ่าน Mobile Banking</h4>
                            <p>PromptPay: 081-234-5678</p>
                        </div>
                    </div>
                </div>
            `;

            // เพิ่ม Event Listeners
            const uploadBtn = document.getElementById('upload-payment-proof-btn');
            if (uploadBtn) {
                uploadBtn.addEventListener('click', () => {
                    if (timeRemaining && timeRemaining > 0) {
                        alert('ระบบอัปโหลดหลักฐานกำลังพัฒนา');
                    } else {
                        alert('บัญชีหมดอายุ กรุณาติดต่อผู้ดูแลระบบ');
                    }
                });
            }

            const historyBtn = document.getElementById('view-payment-history-btn');
            if (historyBtn) {
                historyBtn.addEventListener('click', () => {
                    alert('ประวัติการชำระเงินกำลังพัฒนา');
                });
            }

            // เริ่มการนับเวลาถอยหลัง
            if (timeRemaining && timeRemaining > 0) {
                startCountdown('store-payment-countdown', expiryTime);
            }
        }

        function renderDashboard() {
            // Summary stats
            const totalStores = activeStores.length;
            const standardStores = activeStores.filter(s => s.packageType === 'standard').length;
            const premiumStores = activeStores.filter(s => s.packageType === 'premium').length;
            const onlineStores = activeStores.filter(s => s.isOnline).length;

            // Update stat cards
            const totalStoresEl = document.getElementById('dashboard-total-stores');
            const standardStoresEl = document.getElementById('dashboard-standard-stores');
            const premiumStoresEl = document.getElementById('dashboard-premium-stores');
            const onlineStoresEl = document.getElementById('dashboard-online-stores');

            if (totalStoresEl) totalStoresEl.textContent = totalStores;
            if (standardStoresEl) standardStoresEl.textContent = standardStores;
            if (premiumStoresEl) premiumStoresEl.textContent = premiumStores;
            if (onlineStoresEl) onlineStoresEl.textContent = `${onlineStores} / ${totalStores}`;

            // Render online status grid
            const onlineGrid = document.getElementById('online-status-grid');
            if (onlineGrid) {
                onlineGrid.innerHTML = activeStores.map(store => `
                    <div class="online-status-card">
                        <span class="online-indicator ${store.isOnline ? 'online' : 'offline'}"></span>
                        <span class="store-name">${store.shopName}</span>
                        <span class="store-package package-badge ${store.packageType}" style="transform: scale(0.8);">${store.packageType === 'premium' ? '⭐' : '📦'}</span>
                    </div>
                `).join('') || '<div style="text-align: center; padding: 20px; grid-column: 1 / -1; color: var(--text-color); opacity: 0.7;">ยังไม่มีร้านค้า</div>';
            }

            // Render dashboard charts (if Chart.js available)
            renderDashboardCharts();
        }

        function renderDashboardCharts() {
            // Check if Chart.js is available
            if (typeof Chart === 'undefined') return;

            // Package distribution pie chart
            const packageChartEl = document.getElementById('package-distribution-chart');
            if (packageChartEl) {
                const ctx = packageChartEl.getContext('2d');

                // Destroy existing chart if any
                if (packageChartEl._chart) {
                    packageChartEl._chart.destroy();
                }

                const standardCount = activeStores.filter(s => s.packageType === 'standard').length;
                const premiumCount = activeStores.filter(s => s.packageType === 'premium').length;

                packageChartEl._chart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Standard', 'Premium'],
                        datasets: [{
                            data: [standardCount, premiumCount],
                            backgroundColor: ['#6c757d', '#ffc107'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                });
            }

            // Store revenue bar chart (placeholder data)
            const revenueChartEl = document.getElementById('store-revenue-chart');
            if (revenueChartEl) {
                const ctx = revenueChartEl.getContext('2d');

                // Destroy existing chart if any
                if (revenueChartEl._chart) {
                    revenueChartEl._chart.destroy();
                }

                // ใช้ข้อมูลจริงแทน Math.random() - จำลองรายได้ตามแพ็คเกจ
                const packagePrices = { standard: 1000, premium: 1500 };
                const topStores = [...activeStores]
                    .map(s => ({ 
                        ...s, 
                        revenue: packagePrices[s.packageType || 'standard'] || 1000 
                    }))
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 5);

                revenueChartEl._chart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: topStores.map(s => s.shopName),
                        datasets: [{
                            label: 'รายได้ (฿)',
                            data: topStores.map(s => s.revenue),
                            backgroundColor: 'rgba(40, 167, 69, 0.7)',
                            borderColor: 'rgba(40, 167, 69, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });
            }
        }

        // ===== Helper Functions =====
        function getDurationLabel(duration) {
            switch(duration) {
                case '15days': return '15 วัน (ทดลองใช้ฟรี)';
                case '1month': return '1 เดือน';
                case '3months': return '3 เดือน';
                case '5months': return '5 เดือน';
                case '1year': return '1 ปี';
                default: return duration;
            }
        }

        function copySerialKey(key) {
            navigator.clipboard.writeText(key).then(() => {
                Notify.success('คัดลอกสำเร็จ', `Serial Key: ${key}`);
            }).catch(() => {
                Notify.error('คัดลอกไม่สำเร็จ', 'กรุณาลองอีกครั้ง');
            });
        }

        // ===== Modal Functions =====
        function showApproveModal(storeId) {
            const modal = document.getElementById('approve-registration-modal');
            if (!modal) return;

            modal.dataset.storeId = storeId;
            modal.style.display = 'flex';
        }

        function hideApproveModal() {
            const modal = document.getElementById('approve-registration-modal');
            if (modal) modal.style.display = 'none';
        }

        function confirmApproveRegistration() {
            const modal = document.getElementById('approve-registration-modal');
            const storeId = parseInt(modal.dataset.storeId);
            const packageType = document.querySelector('input[name="package-type"]:checked')?.value || 'standard';

            approveRegistration(storeId, packageType);
            hideApproveModal();
        }

        function showOpenStoreModal(storeId) {
            const modal = document.getElementById('open-store-modal');
            if (!modal) return;

            const store = pendingStores.find(s => s.id === storeId);
            if (!store) return;

            modal.dataset.storeId = storeId;

            // Display store info
            const infoEl = document.getElementById('open-store-info');
            if (infoEl) {
                infoEl.innerHTML = `
                    <p><strong>ร้านค้า:</strong> ${store.shopName}</p>
                    <p><strong>Serial Key:</strong> <span class="serial-key-cell">${store.serialKey}</span></p>
                    <p><strong>แพ็คเกจ:</strong> <span class="package-badge ${store.packageType}">${store.packageType === 'premium' ? '⭐ Premium' : '📦 Standard'}</span></p>
                    <div id="open-store-countdown" class="countdown-display" style="margin-top: 15px;"></div>
                `;
                startCountdown('open-store-countdown', store.expiryDate);
            }

            // Pre-fill form with Shop Name and Owner Name
            const usernameInput = document.getElementById('new-store-username');
            const passwordInput = document.getElementById('new-store-password');
            
            if (usernameInput) {
                // ใช้ Shop Name เป็น Username เริ่มต้น (ตัด space และตัวอักษรพิเศษ)
                const defaultUsername = store.shopName.replace(/[^a-zA-Z0-9]/g, '');
                usernameInput.value = defaultUsername;
            }
            
            if (passwordInput) {
                // เคลียร์ password field
                passwordInput.value = '';
            }

            modal.style.display = 'flex';
        }

        function hideOpenStoreModal() {
            const modal = document.getElementById('open-store-modal');
            if (modal) modal.style.display = 'none';
        }

        function confirmOpenStore() {
            const modal = document.getElementById('open-store-modal');
            const storeId = parseInt(modal.dataset.storeId);
            const username = document.getElementById('store-username')?.value;
            const password = document.getElementById('store-password')?.value;

            if (!username || !password) {
                Notify.error('กรุณากรอกข้อมูล', 'กรุณากรอก Username และ Password');
                return;
            }

            openNewStore(storeId, username, password);
            hideOpenStoreModal();

            // Clear inputs
            document.getElementById('store-username').value = '';
            document.getElementById('store-password').value = '';
        }

        function showRegistrationDetails(storeId) {
            const store = storeRegistrations.find(s => s.id === storeId) || pendingStores.find(s => s.id === storeId) || activeStores.find(s => s.id === storeId);
            if (!store) return;

            const modal = document.getElementById('store-registration-detail-modal');
            if (!modal) return;

            const content = document.getElementById('store-registration-detail-content');
            if (content) {
                content.innerHTML = `
                    <div style="padding: 10px;">
                        <p><strong>ชื่อร้านค้า:</strong> ${store.shopName}</p>
                        <p><strong>เจ้าของ:</strong> ${store.ownerName || '-'}</p>
                        <p><strong>อีเมล:</strong> ${store.email || '-'}</p>
                        <p><strong>โทรศัพท์:</strong> ${store.phone || '-'}</p>
                        <p><strong>วันที่สมัคร:</strong> ${new Date(store.registeredAt).toLocaleString('th-TH')}</p>
                        <p><strong>สถานะ:</strong> <span class="status-badge ${store.status}">${store.status === 'pending' ? 'รอดำเนินการ' : (store.status === 'approved' ? 'อนุมัติแล้ว' : (store.status === 'rejected' ? 'ปฏิเสธ' : store.status))}</span></p>
                        ${store.packageType ? `<p><strong>แพ็คเกจ:</strong> <span class="package-badge ${store.packageType}">${store.packageType === 'premium' ? '⭐ Premium' : '📦 Standard'}</span></p>` : ''}
                        ${store.serialKey ? `<p><strong>Serial Key:</strong> <span class="serial-key-cell">${store.serialKey}</span></p>` : ''}
                    </div>
                `;
            }

            modal.style.display = 'flex';
        }

        function hideRegistrationDetailsModal() {
            const modal = document.getElementById('store-registration-detail-modal');
            if (modal) modal.style.display = 'none';
        }

        function showPaymentProof(paymentId) {
            const payment = paymentHistory.find(p => p.id === paymentId);
            if (!payment) return;

            const modal = document.getElementById('payment-proof-modal');
            if (!modal) return;

            const content = document.getElementById('payment-proof-content');
            if (content) {
                content.innerHTML = `
                    <div class="payment-proof-info">
                        <p><strong>ร้านค้า:</strong> ${payment.storeName}</p>
                        <p><strong>จำนวนเงิน:</strong> ฿${payment.amount.toLocaleString()}</p>
                        <p><strong>วันที่ส่ง:</strong> ${new Date(payment.submittedAt).toLocaleString('th-TH')}</p>
                        <p><strong>สถานะ:</strong> <span class="status-badge ${payment.status}">${payment.status === 'pending' ? 'รอตรวจสอบ' : (payment.status === 'approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ')}</span></p>
                    </div>
                    <div class="payment-proof-image">
                        <img src="${payment.proofUrl}" alt="หลักฐานการชำระเงิน" style="max-width: 100%;" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'100\\'><text x=\\'50%\\' y=\\'50%\\' text-anchor=\\'middle\\' fill=\\'%23999\\'>ไม่พบรูปภาพ</text></svg>'">
                    </div>
                `;
            }

            modal.style.display = 'flex';
        }

        function hidePaymentProofModal() {
            const modal = document.getElementById('payment-proof-modal');
            if (modal) modal.style.display = 'none';
        }

        function showApprovePaymentModal(paymentId) {
            const modal = document.getElementById('approve-payment-modal');
            if (!modal) return;

            modal.dataset.paymentId = paymentId;
            modal.style.display = 'flex';
        }

        function hideApprovePaymentModal() {
            const modal = document.getElementById('approve-payment-modal');
            if (modal) modal.style.display = 'none';
        }

        function confirmApprovePayment() {
            const modal = document.getElementById('approve-payment-modal');
            const paymentId = parseInt(modal.dataset.paymentId);
            const days = parseInt(document.getElementById('extend-days')?.value) || 30;

            approvePayment(paymentId, days);
            hideApprovePaymentModal();
        }

        // ===== Confirmation Dialogs (using Notify.confirm) =====
        function confirmRejectRegistration(storeId) {
            Notify.confirm({
                title: 'ยืนยันการปฏิเสธ',
                message: 'คุณต้องการปฏิเสธการสมัครนี้หรือไม่?',
                confirmText: 'ปฏิเสธ',
                cancelText: 'ยกเลิก',
                type: 'danger'
            }).then(confirmed => {
                if (confirmed) rejectRegistration(storeId);
            });
        }

        function confirmDeleteSerialKey(keyId) {
            Notify.confirm({
                title: 'ยืนยันการลบ',
                message: 'คุณต้องการลบ Serial Key นี้หรือไม่?',
                confirmText: 'ลบ',
                cancelText: 'ยกเลิก',
                type: 'danger'
            }).then(confirmed => {
                if (confirmed) deleteSerialKey(keyId);
            });
        }

        function confirmPauseStore(storeId) {
            const store = activeStores.find(s => s.id === storeId);
            Notify.confirm({
                title: 'ยืนยันการระงับ',
                message: `คุณต้องการระงับร้าน "${store?.shopName}" ชั่วคราวหรือไม่?`,
                confirmText: 'ระงับ',
                cancelText: 'ยกเลิก',
                type: 'warning'
            }).then(confirmed => {
                if (confirmed) pauseStore(storeId);
            });
        }

        function confirmResumeStore(storeId) {
            const store = activeStores.find(s => s.id === storeId);
            Notify.confirm({
                title: 'ยืนยันการเปิดใช้งาน',
                message: `คุณต้องการเปิดใช้งานร้าน "${store?.shopName}" หรือไม่?`,
                confirmText: 'เปิดใช้งาน',
                cancelText: 'ยกเลิก',
                type: 'info'
            }).then(confirmed => {
                if (confirmed) resumeStore(storeId);
            });
        }

        function confirmDeleteStore(storeId) {
            const store = activeStores.find(s => s.id === storeId);
            Notify.confirm({
                title: 'ยืนยันการลบร้านค้า',
                message: `คุณต้องการลบร้าน "${store?.shopName}" ออกจากระบบหรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้`,
                confirmText: 'ลบร้านค้า',
                cancelText: 'ยกเลิก',
                type: 'danger'
            }).then(confirmed => {
                if (confirmed) deleteStore(storeId);
            });
        }

        function confirmDeletePaymentChannel(channelId) {
            Notify.confirm({
                title: 'ยืนยันการลบ',
                message: 'คุณต้องการลบช่องทางชำระเงินนี้หรือไม่?',
                confirmText: 'ลบ',
                cancelText: 'ยกเลิก',
                type: 'danger'
            }).then(confirmed => {
                if (confirmed) deletePaymentChannel(channelId);
            });
        }

        function confirmRejectPayment(paymentId) {
            Notify.confirm({
                title: 'ยืนยันการปฏิเสธ',
                message: 'คุณต้องการปฏิเสธหลักฐานการชำระเงินนี้หรือไม่?',
                confirmText: 'ปฏิเสธ',
                cancelText: 'ยกเลิก',
                type: 'danger'
            }).then(confirmed => {
                if (confirmed) rejectPayment(paymentId);
            });
        }

        // ===== Assign Selected Key =====
        function assignSelectedKey(storeId) {
            const selectEl = document.getElementById(`select-key-${storeId}`);
            if (!selectEl) return;

            const keyId = parseInt(selectEl.value);
            if (!keyId) {
                Notify.warning('กรุณาเลือก Serial Key', 'เลือก Serial Key ที่ต้องการกำหนด');
                return;
            }

            assignSerialKey(storeId, keyId);
        }

        // ===== Submit Store Payment Proof =====
        function submitStorePaymentProof(storeId) {
            const proofUrl = document.getElementById('payment-proof-url')?.value;
            if (!proofUrl) {
                Notify.warning('กรุณากรอกข้อมูล', 'กรุณาใส่ลิงก์หลักฐานการชำระเงิน');
                return;
            }

            submitPaymentProof(storeId, { proofUrl });
            document.getElementById('payment-proof-url').value = '';
            document.getElementById('proof-preview').innerHTML = '<span style="color: var(--text-color); opacity: 0.5;">ตัวอย่างรูปภาพจะแสดงที่นี่</span>';
        }

        // ===== Data Persistence =====
        function saveManagerData() {
            const data = {
                storeRegistrations,
                serialKeys,
                pendingStores,
                activeStores,
                paymentHistory,
                paymentChannels
            };
            localStorage.setItem('managerStoreData', JSON.stringify(data));
        }

        // ===== Load Manager Data from API (Updated for Netlify + Neon) =====
        async function loadManagerData() {
            try {
                // พยายามดึงข้อมูลจาก API ก่อน
                const response = await fetch(API_GET_REGISTRATIONS_ENDPOINT);
                
                if (response.ok) {
                    const data = await response.json();
                    // อัพเดทข้อมูลใน state
                    storeRegistrations = data.registrations || [];
                    serialKeys = data.serialKeys || [];
                    pendingStores = data.pendingStores || [];
                    activeStores = data.activeStores || [];
                    paymentHistory = data.paymentHistory || [];
                    paymentChannels = data.paymentChannels || [];
                    
                    console.log('ข้อมูลถูกโหลดจากฐานข้อมูลเรียบร้อย');
                } else {
                    // ถ้า API ไม่พร้อม (404) ให้ fallback ไป localStorage
                    console.warn('API ไม่พร้อมใช้งาน, ใช้ข้อมูลจาก localStorage');
                    fallbackToLocalStorage();
                }
            } catch (error) {
                console.warn('ไม่สามารถเชื่อมต่อ API ได้, ใช้ข้อมูลจาก localStorage:', error);
                fallbackToLocalStorage();
            }
        }
        
        // Fallback function เมื่อ API ไม่พร้อมใช้งาน
        function fallbackToLocalStorage() {
            try {
                const saved = localStorage.getItem('managerStoreData');
                if (saved) {
                    const data = JSON.parse(saved);
                    storeRegistrations = data.storeRegistrations || [];
                    serialKeys = data.serialKeys || [];
                    pendingStores = data.pendingStores || [];
                    activeStores = data.activeStores || [];
                    paymentHistory = data.paymentHistory || [];
                    paymentChannels = data.paymentChannels || [];
                }
            } catch (e) {
                console.error('Error loading manager data from localStorage:', e);
            }
        }

        // ===== Sub-menu Navigation =====
        function showSubMenu(menuName) {
            // Hide all sub-menus
            document.querySelectorAll('#admin-menu-manager-store .admin-sub-content').forEach(el => {
                el.classList.remove('active');
            });

            // Show selected sub-menu
            const target = document.getElementById(`admin-sub-${menuName}`);
            if (target) {
                target.classList.add('active');
            }

            // Update tabs
            document.querySelectorAll('#manager-store-tabs .tab').forEach(tab => {
                tab.classList.remove('active');
                if (tab.dataset.submenu === menuName) {
                    tab.classList.add('active');
                }
            });

            // Render content based on menu
            switch(menuName) {
                case 'store-registrations':
                    renderStoreRegistrations();
                    break;
                case 'serial-key':
                    // แสดงร้านค้าที่รอใส่ Serial Key และรายการ Serial Key ทั้งหมด
                    renderSerialKeys();
                    break;
                case 'open-new-store':
                    // แสดงเฉพาะร้านค้าที่มี Serial Key แล้ว (พร้อมเปิดร้าน)
                    renderPendingStores();
                    break;
                case 'track-operations':
                    renderActiveStores();
                    break;
                case 'payment-stores':
                    renderPaymentChannels();
                    renderPaymentHistory();
                    break;
                case 'package-settings':
                    renderPackageSettings();
                    break;
                case 'manager-dashboard':
                    renderDashboard();
                    break;
            }
        }

        // ===== Package Settings Functions =====
        function renderPackageSettings() {
            // Load current package data from SignUpSystem
            const packages = getPackages();
            
            // Populate Standard package form
            if (packages.standard) {
                document.getElementById('standard-package-name').value = packages.standard.name || 'Standard';
                document.getElementById('standard-package-details').value = packages.standard.details || '';
                document.getElementById('standard-package-price').value = packages.standard.price || 0;
            }
            
            // Populate Premium package form
            if (packages.premium) {
                document.getElementById('premium-package-name').value = packages.premium.name || 'Premium';
                document.getElementById('premium-package-details').value = packages.premium.details || '';
                document.getElementById('premium-package-price').value = packages.premium.price || 299;
            }
        }

        function setupPackageSettings() {
            // Standard package form
            const standardForm = document.getElementById('standard-package-form');
            if (standardForm) {
                standardForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await savePackageData('standard', {
                        name: document.getElementById('standard-package-name').value,
                        details: document.getElementById('standard-package-details').value,
                        price: parseFloat(document.getElementById('standard-package-price').value)
                    });
                });
            }
            
            // Premium package form
            const premiumForm = document.getElementById('premium-package-form');
            if (premiumForm) {
                premiumForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await savePackageData('premium', {
                        name: document.getElementById('premium-package-name').value,
                        details: document.getElementById('premium-package-details').value,
                        price: parseFloat(document.getElementById('premium-package-price').value)
                    });
                });
            }
        }

        async function savePackageData(packageType, data) {
            try {
                // Update package data in SignUpSystem
                const packages = getPackages();
                packages[packageType] = {
                    ...packages[packageType],
                    name: data.name,
                    details: data.details,
                    price: data.price
                };
                
                // Update the PACKAGES object
                updatePackages(packages);
                
                // Save to localStorage
                await saveManagerData();
                
                // Show success notification
                Notify.success('บันทึกสำเร็จ', `ข้อมูลแพ็คเกจ ${packageType.toUpperCase()} ได้รับการอัพเดทเรียบร้อยแล้ว`);
                
                addLog('Package Settings Updated', `Updated ${packageType} package: ${data.name} - ${data.price} baht`);
                
            } catch (error) {
                console.error('Error saving package data:', error);
                Notify.error('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลแพ็คเกจได้');
            }
        }

        function getPackages() {
            // Get current package configuration from SignUpSystem
            const packages = {
                standard: {
                    name: 'Standard',
                    subAdmins: 3,
                    themes: 5,
                    effects: false,
                    reports: 'today',
                    price: 0,
                    details: ''
                },
                premium: {
                    name: 'Premium',
                    subAdmins: 20,
                    themes: 30,
                    effects: true,
                    reports: 'deep',
                    price: 299,
                    details: ''
                }
            };
            
            // Load any custom details from localStorage if available
            try {
                const savedPackages = localStorage.getItem('managerStorePackages');
                if (savedPackages) {
                    const parsed = JSON.parse(savedPackages);
                    Object.keys(parsed).forEach(key => {
                        if (packages[key]) {
                            packages[key].details = parsed[key].details || '';
                        }
                    });
                }
            } catch (e) {
                console.log('No saved package details found');
            }
            
            return packages;
        }

        function updatePackages(newPackages) {
            // Update the PACKAGES object in SignUpSystem
            if (window.SignUpSystem && window.SignUpSystem.updatePackages) {
                window.SignUpSystem.updatePackages(newPackages);
            }
            
            // Save to localStorage
            try {
                const packageDetails = {
                    standard: { details: newPackages.standard.details },
                    premium: { details: newPackages.premium.details }
                };
                localStorage.setItem('managerStorePackages', JSON.stringify(packageDetails));
            } catch (e) {
                console.log('Could not save package details to localStorage');
            }
        }

        // ===== Initialize =====
        let isInitialized = false;
        async function init() {
            if (isInitialized) return;
            isInitialized = true;

            // โหลดข้อมูลจาก API (หรือ fallback ไป localStorage)
            await loadManagerData();

            // Set up serial key generator controls
            setupSerialKeyGenerator();

            // Set up add registration form
            setupRegistrationForm();

            // Set up payment channel form
            setupPaymentChannelForm();

            // Set up package settings
            setupPackageSettings();

            // Set up open store form
            setupOpenStoreForm();

            // Check store sessions periodically
            setInterval(() => {
                if (currentStoreSession) {
                    checkStoreSession();
                }
            }, 60000); // Check every minute

            // Start auto-lock monitoring for expired stores
            startAutoLockMonitoring();
        }

        function setupSerialKeyGenerator() {
            // Length slider
            const lengthSlider = document.getElementById('serial-key-length');
            const lengthDisplay = document.getElementById('serial-key-length-value');

            if (lengthSlider && lengthDisplay) {
                lengthSlider.addEventListener('input', () => {
                    lengthDisplay.textContent = lengthSlider.value;
                });
            }

            // Duration buttons
            document.querySelectorAll('.duration-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });

            // Generate button
            const generateBtn = document.getElementById('generate-serial-key-btn');
            if (generateBtn) {
                generateBtn.addEventListener('click', () => {
                    const length = parseInt(lengthSlider?.value) || 15;
                    const duration = document.querySelector('.duration-btn.active')?.dataset.duration || '15days';
                    createSerialKey(duration, length);
                });
            }
        }

        function setupRegistrationForm() {
            const addBtn = document.getElementById('add-registration-btn');
            const modal = document.getElementById('add-registration-modal');
            const form = document.getElementById('add-registration-form');

            if (addBtn && modal) {
                addBtn.addEventListener('click', () => {
                    modal.style.display = 'flex';
                });
            }

            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();

                    const shopName = document.getElementById('reg-shop-name')?.value;
                    const ownerName = document.getElementById('reg-owner-name')?.value;
                    const email = document.getElementById('reg-email')?.value;
                    const phone = document.getElementById('reg-phone')?.value;

                    if (!shopName) {
                        Notify.warning('กรุณากรอกข้อมูล', 'กรุณากรอกชื่อร้านค้า');
                        return;
                    }

                    addStoreRegistration({ shopName, ownerName, email, phone });

                    // Reset form
                    form.reset();
                    modal.style.display = 'none';
                });
            }
        }

        function setupPaymentChannelForm() {
            const form = document.getElementById('add-payment-channel-form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();

                    const bankName = document.getElementById('channel-bank-name')?.value;
                    const accountNumber = document.getElementById('channel-account-number')?.value;
                    const accountName = document.getElementById('channel-account-name')?.value;

                    if (!bankName || !accountNumber || !accountName) {
                        Notify.warning('กรุณากรอกข้อมูล', 'กรุณากรอกข้อมูลให้ครบถ้วน');
                        return;
                    }

                    addPaymentChannel({ bankName, accountNumber, accountName });

                    // Reset form
                    form.reset();
                });
            }
        }

        // ===== Setup Open Store Form Event Listener =====
        function setupOpenStoreForm() {
            const form = document.getElementById('open-store-form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    confirmOpenStore();
                });
            }

            // Close modal button
            const closeBtn = document.getElementById('close-open-store-modal-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', hideOpenStoreModal);
            }
        }

        // ===== Auto-Lock Monitoring System =====
        function startAutoLockMonitoring() {
            // Check every 30 seconds for expired stores
            setInterval(() => {
                checkExpiredStores();
            }, 30000);

            // Initial check
            checkExpiredStores();
        }

        function checkExpiredStores() {
            const now = new Date().getTime();
            let hasChanges = false;

            activeStores.forEach(store => {
                if (store.status === 'active' && !store.isLocked) {
                    const expiryTime = new Date(store.expiryDate).getTime();
                    if (now >= expiryTime) {
                        // Store has expired - lock it
                        store.isLocked = true;
                        store.lockedAt = new Date().toISOString();
                        store.status = 'locked';
                        hasChanges = true;
                        
                        Notify.warning('ระบบล็อคร้านค้าอัตโนมัติ', `ร้าน "${store.shopName}" หมดอายุและถูกล็อคโดยระบบ`);
                    }
                }
            });

            if (hasChanges) {
                saveManagerData();
                renderActiveStores();
            }
        }

        // Public API
        return {
            init,
            showSubMenu,

            // Store Registration
            addStoreRegistration,
            approveRegistration,
            rejectRegistration,
            showApproveModal,
            hideApproveModal,
            confirmApproveRegistration,
            showRegistrationDetails,
            hideRegistrationDetailsModal,
            confirmRejectRegistration,

            // Serial Key
            createSerialKey,
            deleteSerialKey,
            assignSerialKey,
            copySerialKey,
            confirmDeleteSerialKey,
            assignSelectedKey,

            // Open Store
            openNewStore,
            showOpenStoreModal,
            hideOpenStoreModal,
            confirmOpenStore,

            // Track Operations
            pauseStore,
            resumeStore,
            deleteStore,
            viewStoreDashboard,
            confirmPauseStore,
            confirmResumeStore,
            confirmDeleteStore,

            // Payment
            addPaymentChannel,
            deletePaymentChannel,
            notifyPaymentAmount,
            submitPaymentProof,
            approvePayment,
            rejectPayment,
            showPaymentProof,
            hidePaymentProofModal,
            showApprovePaymentModal,
            hideApprovePaymentModal,
            confirmApprovePayment,
            confirmDeletePaymentChannel,
            confirmRejectPayment,
            submitStorePaymentProof,

            // Store Login
            storeLogin,
            storeLogout,
            checkStoreSession,
            showSystemLockOverlay,
            hideSystemLockOverlay,

            // Dashboard
            renderDashboard,

            // Store Owner Payment Panel
            renderStorePaymentPanel,

            // Manager Stats
            getManagerStats,

            // Data
            saveManagerData,
            loadManagerData
        };
    })();

    // Make ManagerStore globally accessible
    window.ManagerStore = ManagerStore;
    // =================================================
    // ===== END: Manager Store Module =====
    // =================================================

    // =================================================
    // ===== START: Sign-up Modal System =====
    // =================================================
    const SignUpSystem = (() => {
        // State
        let isModalOpen = false;
        let currentPackage = 'standard';

        // Package configuration
        const PACKAGES = {
            standard: {
                name: 'Standard',
                subAdmins: 3,
                themes: 5,
                effects: false,
                reports: 'today',
                price: 0,
                details: ''
            },
            premium: {
                name: 'Premium',
                subAdmins: 20,
                themes: 30,
                effects: true,
                reports: 'deep',
                price: 299,
                details: ''
            }
        };

        // ===== Modal Control Functions =====
        function openSignUpModal() {
            const modal = document.getElementById('signup-modal');
            if (modal) {
                modal.style.display = 'flex';
                isModalOpen = true;
                
                // Reset form
                resetSignUpForm();
            }
        }

        function closeSignUpModal() {
            const modal = document.getElementById('signup-modal');
            if (modal) {
                modal.style.display = 'none';
                isModalOpen = false;
            }
        }

        function resetSignUpForm() {
            const form = document.getElementById('signup-form');
            if (form) {
                form.reset();
            }
            clearErrorMessages();
            updatePackagePreview('standard');
        }

        // ===== Form Validation Functions =====
        function validateSignUpForm() {
            const username = document.getElementById('signup-username')?.value.trim();
            const password = document.getElementById('signup-password')?.value;
            const confirmPassword = document.getElementById('signup-confirm-password')?.value;
            const email = document.getElementById('signup-email')?.value.trim();
            const phone = document.getElementById('signup-phone')?.value.trim();
            const packageType = document.querySelector('input[name="package-type"]:checked')?.value || 'standard';

            const errors = [];

            // Username validation
            if (!username) {
                errors.push('กรุณากรอก Username');
            } else if (username.length < 3) {
                errors.push('Username ต้องมีอย่างน้อย 3 ตัวอักษร');
            }

            // Password validation
            if (!password) {
                errors.push('กรุณากรอก Password');
            } else if (password.length < 8) {
                errors.push('Password ต้องมีอย่างน้อย 8 ตัวอักษร');
            }

            // Confirm password validation
            if (!confirmPassword) {
                errors.push('กรุณายืนยัน Password');
            } else if (password !== confirmPassword) {
                errors.push('Password และ Confirm Password ไม่ตรงกัน');
            }

            // Contact validation (at least one)
            if (!email && !phone) {
                errors.push('กรุณากรอกช่องทางติดต่ออย่างน้อย 1 ช่องทาง (Email หรือ โทรศัพท์)');
            }

            // Email validation (if provided)
            if (email && !isValidEmail(email)) {
                errors.push('รูปแบบ Email ไม่ถูกต้อง');
            }

            // Phone validation (if provided)
            if (phone && !isValidPhone(phone)) {
                errors.push('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง');
            }

            return { isValid: errors.length === 0, errors };
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function isValidPhone(phone) {
            const phoneRegex = /^[0-9\-\+\(\)\s]+$/;
            return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
        }

        function displayValidationErrors(errors) {
            const errorContainer = document.getElementById('signup-error-container');
            if (errorContainer) {
                errorContainer.innerHTML = errors.map(error => `
                    <div class="error-message">• ${error}</div>
                `).join('');
                errorContainer.style.display = errors.length > 0 ? 'block' : 'none';
            }
        }

        function clearErrorMessages() {
            const errorContainer = document.getElementById('signup-error-container');
            if (errorContainer) {
                errorContainer.style.display = 'none';
                errorContainer.innerHTML = '';
            }
        }

        // ===== Package Management Functions =====
        function updatePackagePreview(packageType) {
            currentPackage = packageType;
            const preview = document.getElementById('package-preview');
            if (!preview) return;

            const pkg = PACKAGES[packageType];
            if (!pkg) return;

            preview.innerHTML = `
                <div class="package-preview-header">
                    <h3>${pkg.name} Package</h3>
                    <span class="package-price">${pkg.price === 0 ? 'ฟรี' : `฿${pkg.price.toLocaleString()}/เดือน`}</span>
                </div>
                <div class="package-features">
                    <div class="feature">
                        <span class="feature-icon">👥</span>
                        <span class="feature-text">Sub-Admin สูงสุด ${pkg.subAdmins} คน</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">🎨</span>
                        <span class="feature-text">ธีม ${pkg.themes} แบบ (${pkg.themes === 30 ? 'ครบ' : 'พื้นฐาน'})</span>
                    </div>
                    <div class="feature ${pkg.effects ? '' : 'disabled'}">
                        <span class="feature-icon">✨</span>
                        <span class="feature-text">${pkg.effects ? 'ใช้ Effects ได้' : 'ไม่มี Effects'}</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">📊</span>
                        <span class="feature-text">รายงาน${pkg.reports === 'deep' ? 'แบบลึก' : 'วันนี้เท่านั้น'}</span>
                    </div>
                </div>
            `;
        }

        function checkPackageLimitations() {
            const packageInfo = document.getElementById('package-limitations');
            if (!packageInfo) return;

            const pkg = PACKAGES[currentPackage];
            let limitations = [];

            if (currentPackage === 'standard') {
                limitations = [
                    'จำกัด Sub-Admin ได้สูงสุด 3 คน',
                    'ใช้ธีมพื้นฐานได้ 5 สีเท่านั้น',
                    'ไม่สามารถใช้ Effects ต่างๆ',
                    'รายงานเฉพาะข้อมูลวันนี้'
                ];
            }

            packageInfo.innerHTML = `
                <h4>ข้อจำกัดของ ${pkg.name} Package:</h4>
                <ul>
                    ${limitations.map(limit => `<li>${limit}</li>`).join('')}
                </ul>
            `;
        }

        // ===== API Functions =====
        async function checkUsernameAvailability(username) {
            try {
                const response = await fetch(API_CHECK_USERNAME_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username })
                });
                
                const data = await response.json();
                return data.available !== false;
            } catch (error) {
                console.error('Error checking username:', error);
                return true; // Assume available if API fails
            }
        }

        async function submitSignUp() {
            const validation = validateSignUpForm();
            
            if (!validation.isValid) {
                displayValidationErrors(validation.errors);
                return;
            }

            const formData = {
                username: document.getElementById('signup-username')?.value.trim(),
                password: document.getElementById('signup-password')?.value,
                email: document.getElementById('signup-email')?.value.trim(),
                phone: document.getElementById('signup-phone')?.value.trim(),
                packageType: document.querySelector('input[name="package-type"]:checked')?.value || 'standard',
                contactChannels: {
                    email: document.getElementById('signup-email')?.value.trim(),
                    phone: document.getElementById('signup-phone')?.value.trim()
                }
            };

            try {
                // Check username availability
                const isUsernameAvailable = await checkUsernameAvailability(formData.username);
                if (!isUsernameAvailable) {
                    displayValidationErrors(['Username นี้ถูกใช้งานแล้ว กรุณาเลือก Username อื่น']);
                    return;
                }

                // Submit to API
                const response = await fetch(API_SIGNUP_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    Notify.success('สมัครสมาชิกสำเร็จ', 'กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี');
                    closeSignUpModal();
                } else {
                    displayValidationErrors(result.errors || ['เกิดข้อผิดพลาดในการสมัคร']);
                }
            } catch (error) {
                console.error('Signup error:', error);
                displayValidationErrors(['เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง']);
            }
        }

        // ===== Package Constraint Enforcement =====
        function enforcePackageConstraints() {
            if (currentPackage !== 'standard') return;

            // Disable premium features for standard package
            const premiumFeatures = document.querySelectorAll('.premium-only');
            premiumFeatures.forEach(feature => {
                feature.style.opacity = '0.5';
                feature.title = 'ฟีเจอร์นี้ใช้ได้เฉพาะ Premium Package';
            });
        }

        // ===== Initialize =====
        function init() {
            // Package selection
            document.querySelectorAll('input[name="package-type"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    updatePackagePreview(e.target.value);
                    checkPackageLimitations();
                });
            });

            // Form submission
            const form = document.getElementById('signup-form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    submitSignUp();
                });
            }

            // Real-time validation
            document.getElementById('signup-username')?.addEventListener('blur', async (e) => {
                const username = e.target.value.trim();
                if (username.length >= 3) {
                    const isAvailable = await checkUsernameAvailability(username);
                    if (!isAvailable) {
                        displayValidationErrors(['Username นี้ถูกใช้งานแล้ว']);
                    } else {
                        clearErrorMessages();
                    }
                }
            });

            // Initial setup
            updatePackagePreview('standard');
            checkPackageLimitations();
            enforcePackageConstraints();

            // Close modal on overlay click
            const modal = document.getElementById('signup-modal');
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        closeSignUpModal();
                    }
                });
            }
        }

        // Public API
        return {
            init,
            openSignUpModal,
            closeSignUpModal,
            updatePackagePreview,
            submitSignUp,
            PACKAGES,
            updatePackages: (newPackages) => {
                // Update PACKAGES object
                Object.keys(newPackages).forEach(key => {
                    if (PACKAGES[key]) {
                        PACKAGES[key] = { ...PACKAGES[key], ...newPackages[key] };
                    }
                });
            },
            loadPackageData: () => {
                // Load saved package details
                try {
                    const saved = localStorage.getItem('managerStorePackages');
                    if (saved) {
                        const parsed = JSON.parse(saved);
                        Object.keys(parsed).forEach(key => {
                            if (PACKAGES[key]) {
                                PACKAGES[key].details = parsed[key].details || '';
                            }
                        });
                    }
                } catch (e) {
                    console.log('Could not load package data');
                }
            }
        };
    })();

    // Make SignUpSystem globally accessible
    window.SignUpSystem = SignUpSystem;
    // =================================================
    // ===== END: Sign-up Modal System =====
    // =================================================

    // =================================================
    // ===== START: Package Validation & Enforcement =====
    // =================================================
    const PackageValidator = (() => {
        // ===== Package Configuration =====
        const PACKAGE_LIMITS = {
            standard: {
                subAdmins: 3,
                themes: 5,
                effects: false,
                reports: 'today'
            },
            premium: {
                subAdmins: 20,
                themes: 30,
                effects: true,
                reports: 'deep'
            }
        };

        // ===== Core Validation Functions =====
        function validateSubAdminLimit(packageType, currentCount) {
            const limit = PACKAGE_LIMITS[packageType]?.subAdmins || 3;
            return {
                isValid: currentCount <= limit,
                limit: limit,
                current: currentCount,
                message: currentCount > limit ? `เกินจำนวน Sub-Admin ที่กำหนด (${limit} คน)` : ''
            };
        }

        function validateThemeAccess(packageType, themeId) {
            const standardThemes = ['default', 'ocean', 'sunset', 'royal', 'forest'];
            const isStandardTheme = standardThemes.includes(themeId);
            
            return {
                isValid: packageType === 'premium' || isStandardTheme,
                message: packageType === 'standard' && !isStandardTheme ? 'ต้องใช้ Premium Package เพื่อเข้าถึงธีมนี้' : ''
            };
        }

        function validateEffectsAccess(packageType) {
            const hasAccess = PACKAGE_LIMITS[packageType]?.effects || false;
            return {
                isValid: hasAccess,
                message: !hasAccess ? 'ต้องใช้ Premium Package เพื่อเปิดใช้ Effects' : ''
            };
        }

        function validateReportAccess(packageType, reportType) {
            const available = PACKAGE_LIMITS[packageType]?.reports || 'today';
            const isValid = reportType === 'today' || (reportType === 'deep' && available === 'deep');
            
            return {
                isValid: isValid,
                message: !isValid ? 'ต้องใช้ Premium Package เพื่อเข้าถึงรายงานแบบลึก' : ''
            };
        }

        // ===== Enforcement Functions =====
        function enforceSubAdminLimit(packageType) {
            const subAdminList = document.querySelectorAll('.sub-admin-item');
            const currentCount = subAdminList.length;
            
            const validation = validateSubAdminLimit(packageType, currentCount);
            
            if (!validation.isValid) {
                // Show warning
                Notify.warning('เกินข้อจำกัด Sub-Admin', validation.message);
                
                // Disable add button
                const addButton = document.getElementById('add-subadmin-btn');
                if (addButton) {
                    addButton.disabled = true;
                    addButton.title = validation.message;
                }
                
                return false;
            } else {
                // Enable add button
                const addButton = document.getElementById('add-subadmin-btn');
                if (addButton) {
                    addButton.disabled = false;
                    addButton.title = '';
                }
                return true;
            }
        }

        function enforceThemeAccess(packageType) {
            if (packageType === 'standard') {
                // Disable premium themes in UI
                const premiumThemes = document.querySelectorAll('[data-theme-premium]');
                premiumThemes.forEach(theme => {
                    theme.style.opacity = '0.5';
                    theme.style.pointerEvents = 'none';
                    theme.title = 'ต้องใช้ Premium Package';
                });

                // Show limitation notice
                const limitationNotice = document.getElementById('theme-limitation-notice');
                if (limitationNotice) {
                    limitationNotice.style.display = 'block';
                }
            }
        }

        function enforceEffectsAccess(packageType) {
            if (packageType === 'standard') {
                // Disable effects controls
                const effectsControls = document.querySelectorAll('.effects-control');
                effectsControls.forEach(control => {
                    control.disabled = true;
                    control.style.opacity = '0.5';
                });

                // Hide effects toggles
                const effectsToggles = document.querySelectorAll('.effects-toggle');
                effectsToggles.forEach(toggle => {
                    toggle.disabled = true;
                    toggle.parentElement.style.opacity = '0.5';
                });
            }
        }

        function enforceReportAccess(packageType) {
            if (packageType === 'standard') {
                // Disable deep report options
                const deepReportOptions = document.querySelectorAll('[data-report="deep"]');
                deepReportOptions.forEach(option => {
                    option.disabled = true;
                    option.style.opacity = '0.5';
                });
            }
        }

        // ===== Package Upgrade Prompts =====
        function showUpgradePrompt(feature, currentPackage) {
            Notify.info('ต้องการอัพเกรดแพ็คเกจ', `
                เพื่อใช้ฟีเจอร์ "${feature}" 
                ต้องการอัพเกรดเป็น Premium Package หรือไม่?
            `);
        }

        // ===== Real-time Monitoring =====
        function monitorSubAdminChanges(packageType) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        enforceSubAdminLimit(packageType);
                    }
                });
            });

            const subAdminContainer = document.getElementById('sub-admin-list');
            if (subAdminContainer) {
                observer.observe(subAdminContainer, { childList: true });
            }
        }

        // ===== API Integration =====
        async function validatePackageWithServer(userId, packageType) {
            try {
                const response = await fetch(API_PACKAGE_VALIDATION_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId, packageType })
                });

                const data = await response.json();
                return {
                    isValid: data.valid,
                    constraints: data.constraints || {},
                    message: data.message || ''
                };
            } catch (error) {
                console.error('Package validation error:', error);
                return {
                    isValid: true,
                    constraints: {},
                    message: ''
                };
            }
        }

        // ===== Public API =====
        return {
            PACKAGE_LIMITS,
            validateSubAdminLimit,
            validateThemeAccess,
            validateEffectsAccess,
            validateReportAccess,
            enforceSubAdminLimit,
            enforceThemeAccess,
            enforceEffectsAccess,
            enforceReportAccess,
            showUpgradePrompt,
            monitorSubAdminChanges,
            validatePackageWithServer
        };
    })();

    // Make PackageValidator globally accessible
    window.PackageValidator = PackageValidator;
    // =================================================
    // ===== END: Package Validation & Enforcement =====
    // =================================================

    // =================================================
    // ===== START: Enhanced Serial Key Management =====
    // =================================================
    const EnhancedSerialManager = (() => {
        // Time periods configuration
        const TIME_PERIODS = {
            '15days': { days: 15, label: '15 วัน (ทดลอง)', price: 0 },
            '1month': { days: 30, label: '1 เดือน', price: 199 },
            '3months': { days: 90, label: '3 เดือน', price: 549 },
            '5months': { days: 150, label: '5 เดือน', price: 899 },
            '1year': { days: 365, label: '1 ปี', price: 1999 }
        };

        // Batch generation settings
        const DEFAULT_BATCH_SIZE = 10;
        const MAX_BATCH_SIZE = 100;

        // ===== Enhanced Serial Key Generation =====
        function generateSerialKey(length = 16, prefix = 'WS') {
            const timestamp = Date.now().toString(36);
            const random = Math.random().toString(36).substr(2, length - prefix.length - timestamp.length);
            return `${prefix}${timestamp}${random}`.toUpperCase();
        }

        async function createSerialKeyBatch(duration, count = DEFAULT_BATCH_SIZE, length = 16) {
            count = Math.min(count, MAX_BATCH_SIZE);
            const keys = [];

            for (let i = 0; i < count; i++) {
                const key = generateSerialKey(length);
                const expiryDate = calculateExpiryDate(duration);
                
                keys.push({
                    id: Date.now() + i,
                    key: key,
                    duration: duration,
                    expiryDate: expiryDate,
                    status: 'unused',
                    createdAt: new Date().toISOString()
                });
            }

            // Save to ManagerStore
            if (window.ManagerStore && ManagerStore.serialKeys) {
                ManagerStore.serialKeys.push(...keys);
                ManagerStore.saveManagerData();
            }

            Notify.success(`สร้าง Serial Key สำเร็จ`, `สร้าง ${count} keys สำหรับ ${TIME_PERIODS[duration].label}`);
            
            return keys;
        }

        function calculateExpiryDate(duration) {
            const days = TIME_PERIODS[duration]?.days || 30;
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + days);
            return expiry.toISOString();
        }

        // ===== Serial Key Validation =====
        function validateSerialKey(key) {
            const keyPattern = /^WS[A-Z0-9]{16,}$/;
            return keyPattern.test(key);
        }

        function isSerialKeyExpired(expiryDate) {
            return new Date(expiryDate).getTime() < new Date().getTime();
        }

        // ===== Bulk Operations =====
        async function exportSerialKeys(format = 'json') {
            if (!window.ManagerStore || !ManagerStore.serialKeys) {
                Notify.error('ไม่พบข้อมูล Serial Key');
                return;
            }

            const keys = ManagerStore.serialKeys;
            let content, filename, mimeType;

            switch (format) {
                case 'csv':
                    content = convertToCSV(keys);
                    filename = `serial-keys-${new Date().toISOString().split('T')[0]}.csv`;
                    mimeType = 'text/csv';
                    break;
                case 'json':
                default:
                    content = JSON.stringify(keys, null, 2);
                    filename = `serial-keys-${new Date().toISOString().split('T')[0]}.json`;
                    mimeType = 'application/json';
                    break;
            }

            downloadFile(content, filename, mimeType);
        }

        function convertToCSV(keys) {
            const headers = ['ID', 'Key', 'Duration', 'Expiry Date', 'Status', 'Created At'];
            const rows = keys.map(key => [
                key.id,
                key.key,
                key.duration,
                key.expiryDate,
                key.status,
                key.createdAt
            ]);

            return [headers, ...rows].map(row => row.join(',')).join('\n');
        }

        function downloadFile(content, filename, mimeType) {
            const blob = new Blob([content], { type: mimeType });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            Notify.success('ดาวน์โหลดสำเร็จ', `ไฟล์ ${filename} ถูกดาวน์โหลดแล้ว`);
        }

        // ===== Serial Key Analytics =====
        function getSerialKeyStats() {
            if (!window.ManagerStore || !ManagerStore.serialKeys) {
                return null;
            }

            const keys = ManagerStore.serialKeys;
            const total = keys.length;
            const used = keys.filter(k => k.status === 'used').length;
            const unused = keys.filter(k => k.status === 'unused').length;
            const expired = keys.filter(k => isSerialKeyExpired(k.expiryDate)).length;

            const byDuration = keys.reduce((acc, key) => {
                acc[key.duration] = (acc[key.duration] || 0) + 1;
                return acc;
            }, {});

            return {
                total,
                used,
                unused,
                expired,
                byDuration,
                usageRate: total > 0 ? ((used / total) * 100).toFixed(1) : 0
            };
        }

        function renderSerialKeyStats() {
            const stats = getSerialKeyStats();
            if (!stats) return;

            const container = document.getElementById('serial-key-stats');
            if (!container) return;

            container.innerHTML = `
                <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <div class="stat-card">
                        <h4>📊 รวมทั้งหมด</h4>
                        <div class="stat-value">${stats.total}</div>
                    </div>
                    <div class="stat-card">
                        <h4>✅ ใช้แล้ว</h4>
                        <div class="stat-value">${stats.used}</div>
                    </div>
                    <div class="stat-card">
                        <h4>⏳ ยังไม่ใช้</h4>
                        <div class="stat-value">${stats.unused}</div>
                    </div>
                    <div class="stat-card">
                        <h4>⏰ หมดอายุ</h4>
                        <div class="stat-value">${stats.expired}</div>
                    </div>
                    <div class="stat-card">
                        <h4>📈 อัตราการใช้</h4>
                        <div class="stat-value">${stats.usageRate}%</div>
                    </div>
                </div>
                <div class="duration-breakdown">
                    <h4>แยกตามระยะเวลา:</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        ${Object.entries(stats.byDuration).map(([duration, count]) => `
                            <span class="duration-badge">${TIME_PERIODS[duration]?.label || duration}: ${count}</span>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // ===== Initialize =====
        function init() {
            // Auto-refresh stats every 30 seconds
            setInterval(() => {
                renderSerialKeyStats();
            }, 30000);

            // Initial render
            renderSerialKeyStats();
        }

        // Public API
        return {
            TIME_PERIODS,
            generateSerialKey,
            createSerialKeyBatch,
            validateSerialKey,
            isSerialKeyExpired,
            exportSerialKeys,
            getSerialKeyStats,
            renderSerialKeyStats,
            init
        };
    })();

    // Make EnhancedSerialManager globally accessible
    window.EnhancedSerialManager = EnhancedSerialManager;
    // =================================================
    // ===== END: Enhanced Serial Key Management =====
    // =================================================

    // =================================================
    // ===== START: Global Event Listeners Setup =====
    // =================================================
    function setupGlobalEventListeners() {
        // Sign-up modal triggers
        document.addEventListener('click', (e) => {
            // Open sign-up modal
            if (e.target.matches('.signup-btn, [data-action="open-signup"]')) {
                e.preventDefault();
                if (window.SignUpSystem) {
                    SignUpSystem.openSignUpModal();
                }
            }

            // Close sign-up modal
            if (e.target.matches('.close-signup-modal, .signup-modal-overlay')) {
                e.preventDefault();
                if (window.SignUpSystem) {
                    SignUpSystem.closeSignUpModal();
                }
            }
        });

        // Package selection changes
        document.addEventListener('change', (e) => {
            if (e.target.matches('input[name="package-type"]')) {
                const packageType = e.target.value;
                if (window.PackageValidator) {
                    PackageValidator.enforceThemeAccess(packageType);
                    PackageValidator.enforceEffectsAccess(packageType);
                    PackageValidator.enforceReportAccess(packageType);
                }
            }
        });

        // Sub-admin limit monitoring
        document.addEventListener('DOMContentLoaded', () => {
            if (window.PackageValidator && window.ManagerStore) {
                // Monitor sub-admin changes for package validation
                const subAdminContainer = document.getElementById('sub-admin-list');
                if (subAdminContainer) {
                    PackageValidator.monitorSubAdminChanges(appData.shopSettings.packageType || 'standard');
                }
            }
        });

        // Serial key generation buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('#generate-serial-batch-btn')) {
                e.preventDefault();
                if (window.EnhancedSerialManager) {
                    const duration = document.querySelector('.duration-btn.active')?.dataset.duration || '1month';
                    const count = parseInt(document.getElementById('batch-count')?.value) || 10;
                    EnhancedSerialManager.createSerialKeyBatch(duration, count);
                }
            }

            if (e.target.matches('#export-serial-keys-btn')) {
                e.preventDefault();
                if (window.EnhancedSerialManager) {
                    const format = document.getElementById('export-format')?.value || 'json';
                    EnhancedSerialManager.exportSerialKeys(format);
                }
            }
        });
    }

    // =================================================
    // ===== END: Global Event Listeners Setup =====
    // =================================================

    // =================================================
    // ===== START: Auto-initialization =====
    // =================================================
    async function autoInitialize() {
        // Initialize all systems when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', async () => {
                await initializeAllSystems();
            });
        } else {
            await initializeAllSystems();
        }
    }

    async function initializeAllSystems() {
        try {
            // ตรวจสอบ session ที่บันทึกไว้
            const savedIsAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
            const savedIsStoreOwnerLoggedIn = localStorage.getItem('isStoreOwnerLoggedIn') === 'true';

            if (savedIsStoreOwnerLoggedIn) {
                // กู้คืน session ของร้านค้า
                const savedStoreSession = localStorage.getItem('currentStoreSession');
                if (savedStoreSession) {
                    currentStoreSession = JSON.parse(savedStoreSession);
                    isStoreOwnerLoggedIn = true;
                    await loadAdminData();
                    switchView('adminPanel');
                    renderAdminPanel('store-payment');
                }
            } else if (savedIsAdminLoggedIn) {
                // กู้คืน session ของ Admin
                const savedLoggedInUser = localStorage.getItem('loggedInUser');
                if (savedLoggedInUser) {
                    loggedInUser = JSON.parse(savedLoggedInUser);
                    isAdminLoggedIn = true;
                    await loadAdminData();
                    switchView('adminPanel');
                    renderAdminPanel();
                }
            }

            // Initialize Manager Store
            if (window.ManagerStore) {
                await ManagerStore.init();
            }

            // Initialize Sign-up System
            if (window.SignUpSystem) {
                SignUpSystem.init();
            }

            // Initialize Package Validator
            if (window.PackageValidator) {
                // Apply current package constraints
                const currentPackage = appData.shopSettings.packageType || 'standard';
                PackageValidator.enforceThemeAccess(currentPackage);
                PackageValidator.enforceEffectsAccess(currentPackage);
                PackageValidator.enforceReportAccess(currentPackage);
                PackageValidator.enforceSubAdminLimit(currentPackage);
            }

            // Initialize Enhanced Serial Manager
            if (window.EnhancedSerialManager) {
                EnhancedSerialManager.init();
            }

            // Setup global event listeners
            setupGlobalEventListeners();

            console.log('All systems initialized successfully');
        } catch (error) {
            console.error('Error during system initialization:', error);
        }
    }

    // Auto-initialize everything
    autoInitialize();

    // =================================================
    // ===== END: Auto-initialization =====
    // =================================================

    });
