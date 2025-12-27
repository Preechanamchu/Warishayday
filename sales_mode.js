// Logic for Sales Mode Toggle (Locking and Switching)

// Initialize functionality when the DOM is fully loaded or when appropriate
function initSalesModeToggle() {
    const container = document.getElementById('sales-mode-container');
    const toggle = document.getElementById('sales-mode-toggle');
    const lockOverlay = document.getElementById('mode-lock-overlay');
    const options = document.querySelectorAll('.mode-option');

    // Default State: Locked
    let isLocked = true;
    lockOverlay.style.display = 'flex'; // Ensure locked initially

    // Handle Double Click to Unlock/Lock
    // We add the listener to the container so double clicking anywhere on the widget works
    container.addEventListener('dblclick', () => {
        isLocked = !isLocked;
        if (isLocked) {
            lockOverlay.style.display = 'flex';
            Notify.info('ล็อค', 'ตัวเลือกโหมดการขายถูกล็อคแล้ว');
        } else {
            lockOverlay.style.display = 'none';
            Notify.success('ปลดล็อค', 'คุณสามารถเปลี่ยนโหมดการขายได้แล้ว');
        }
    });

    // Handle Option Click (Change Mode)
    options.forEach(option => {
        option.addEventListener('click', () => {
            if (isLocked) {
                // Shake effect or feedback that it's locked
                container.classList.add('shake-animation');
                setTimeout(() => container.classList.remove('shake-animation'), 500);
                return;
            }

            // Remove active class from all
            options.forEach(opt => opt.classList.remove('active'));
            // Add active to clicked
            option.classList.add('active');

            // Update AppData
            const value = option.dataset.value;
            appData.shopSettings.salesMode = value; // Assuming this property exists or we create it

            // Log and notify
            addLog('Sales Mode Changed', `Mode set to: ${value === 'tens' ? 'ขายหลัก 10' : 'ขายเป็นเศษ'}`);
            Notify.success('บันทึกสำเร็จ', `เปลี่ยนเป็นโหมด: ${value === 'tens' ? 'ขายหลัก 10' : 'ขายเป็นเศษ'}`);

            // Save state
            saveState();
        });
    });

    // Initialize UI based on saved data
    const savedMode = appData.shopSettings.salesMode || 'tens';
    options.forEach(opt => {
        if (opt.dataset.value === savedMode) {
            opt.classList.add('active');
        } else {
            opt.classList.remove('active');
        }
    });
}

// Add shake animation style dynamically if not present
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}
.shake-animation {
  animation: shake 0.3s ease-in-out;
}
`;
document.head.appendChild(style);

// Call init function - this should be called where other inits happen or after DOM load
// Since I can't easily append to the big init function in script.js without finding the right spot,
// I will expose this function globally and call it from the main script.
window.initSalesModeToggle = initSalesModeToggle;
