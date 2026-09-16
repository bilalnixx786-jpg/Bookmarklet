// ============================================
// BNDA PREMIUM EXTENSION v5.0
// Device Lock + Inline Errors + Input Popup
// ============================================

(function() {
    'use strict';
    
    // =========================================
    // CONFIG
    // =========================================
    const CONFIG = {
        GITHUB_USER: 'bilalnixx786-jpg',
        REPO: 'Bookmarklet',
        WHATSAPP_CHANNEL: 'https://whatsapp.com/channel/0029Vb5nZxj7j6g3Rt4YR32m',
        WHATSAPP_NUMBER: '923306363018',
        BRAND_NAME: 'BNDA Premium',
        SCRIPT_URL: 'https://bilalnixx786-jpg.github.io/Bookmarklet/script.js'
    };
    
    const WA_MESSAGE = 'Hello! I want to get this BNDA Premium Extension.%0A%0A%F0%9F%93%8B Extension Types Available:%0A%0A%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%0A%F0%9F%94%B9 Type 1: Bookmarklet Version%0A   %E2%80%A2 Works on Any Device %26 Browser%0A   %E2%80%A2 Price: %2430%0A%0A%F0%9F%94%B9 Type 2: Extension Version%0A   %E2%80%A2 With Refresh Protection %F0%9F%9B%A1%EF%B8%8F%0A   %E2%80%A2 Works on Any Device%0A   %E2%80%A2 Price: %2460%0A%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%E2%94%81%0A%0APlease share the details to proceed.%0AThank you!';
    
    const WA_LINK = 'https://wa.me/' + CONFIG.WHATSAPP_NUMBER + '?text=' + WA_MESSAGE;
    
    if (window.__bndaLicenseChecked) return;
    window.__bndaLicenseChecked = true;
    
    // =========================================
    // DEVICE ID (Unique per browser)
    // =========================================
    function getDeviceId() {
        let id = localStorage.getItem('bnda_device_id');
        if (id) return id;
        
        const nav = window.navigator;
        const scr = window.screen;
        const fp = [
            nav.userAgent || '',
            nav.language || '',
            nav.platform || '',
            scr.width || 0,
            scr.height || 0,
            scr.colorDepth || 0,
            new Date().getTimezoneOffset(),
            Math.random().toString(36).substring(2, 15)
        ].join('|');
        
        let hash = 0;
        for (let i = 0; i < fp.length; i++) {
            const c = fp.charCodeAt(i);
            hash = ((hash << 5) - hash) + c;
            hash = hash & hash;
        }
        
        id = 'DEV_' + Math.abs(hash).toString(36).toUpperCase() + '_' + Date.now().toString(36);
        localStorage.setItem('bnda_device_id', id);
        return id;
    }
    
    // =========================================
    // PIANO MUSIC (Low Volume)
    // =========================================
    function playPianoSound() {
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return;
            const ctx = new AC();
            const now = ctx.currentTime;
            [
                { f: 523.25, t: 0.0, d: 0.15 },
                { f: 659.25, t: 0.15, d: 0.15 },
                { f: 783.99, t: 0.30, d: 0.20 },
                { f: 1046.50, t: 0.50, d: 0.30 }
            ].forEach(n => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.type = 'sine';
                o.frequency.value = n.f;
                g.gain.setValueAtTime(0, now + n.t);
                g.gain.linearRampToValueAtTime(0.08, now + n.t + 0.02);
                g.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
                o.connect(g);
                g.connect(ctx.destination);
                o.start(now + n.t);
                o.stop(now + n.t + n.d);
            });
            setTimeout(() => { try { ctx.close(); } catch(e){} }, 2000);
        } catch(e) {}
    }
    
    // =========================================
    // FORMAT DATE
    // =========================================
    function formatDate(ts) {
        if (!ts) return 'Lifetime';
        const d = new Date(ts);
        return String(d.getDate()).padStart(2,'0') + '/' +
               String(d.getMonth()+1).padStart(2,'0') + '/' +
               d.getFullYear() + ' ' +
               String(d.getHours()).padStart(2,'0') + ':' +
               String(d.getMinutes()).padStart(2,'0');
    }
    
    function getTimeRemaining(exp) {
        if (!exp) return 'Lifetime';
        const diff = exp - Date.now();
        if (diff <= 0) return 'Expired';
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        if (d > 0) return d + 'd ' + h + 'h';
        if (h > 0) return h + 'h ' + m + 'm';
        if (m > 0) return m + 'm ' + s + 's';
        return s + 's';
    }
    
    // =========================================
    // LICENSE INPUT POPUP (with inline error)
    // =========================================
    function showLicenseInput(errorMessage, prefillKey) {
        return new Promise((resolve) => {
            const existing = document.getElementById('bnda-input-popup');
            if (existing) existing.remove();
            
            const input = document.createElement('div');
            input.id = 'bnda-input-popup';
            
            const errorHTML = errorMessage 
                ? '<div class="bnda-input-error">🚫 ' + errorMessage + '</div>' 
                : '';
            
            const prefill = prefillKey || '';
            
            input.innerHTML = `
            <style>
                #bnda-input-popup {
                    position: fixed !important; inset: 0 !important;
                    background: rgba(0, 0, 0, 0.75) !important;
                    backdrop-filter: blur(10px) !important;
                    z-index: 2147483647 !important;
                    display: flex !important; align-items: center !important; justify-content: center !important;
                    padding: 16px !important;
                    font-family: 'Segoe UI', system-ui, sans-serif !important;
                    animation: bndaIn 0.3s ease !important;
                    overflow-y: auto !important; box-sizing: border-box !important;
                }
                @keyframes bndaIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes bndaSlide {
                    from { opacity: 0; transform: translateY(30px) scale(0.9); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes bndaGlow2 {
                    0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.5), 0 20px 60px rgba(0, 0, 0, 0.5); }
                    50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.8), 0 20px 60px rgba(0, 0, 0, 0.5); }
                }
                @keyframes bndaShake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-8px); }
                    75% { transform: translateX(8px); }
                }
                .bnda-input-box {
                    width: 100% !important; max-width: 360px !important;
                    background: linear-gradient(160deg, #0a0e1a, #131a2e) !important;
                    border: 1px solid rgba(102, 126, 234, 0.4) !important;
                    border-radius: 20px !important;
                    padding: 22px 20px !important;
                    text-align: center !important;
                    animation: bndaSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), bndaGlow2 3s ease-in-out infinite !important;
                    position: relative !important;
                    overflow: hidden !important;
                    margin: auto !important;
                }
                .bnda-input-box::before {
                    content: '' !important; position: absolute !important;
                    top: -50% !important; left: -50% !important;
                    width: 200% !important; height: 200% !important;
                    background: radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%) !important;
                    pointer-events: none !important;
                }
                .bnda-input-icon {
                    font-size: 40px !important; margin-bottom: 6px !important;
                    display: inline-block !important;
                    position: relative !important; z-index: 2 !important;
                }
                .bnda-input-title {
                    font-size: 16px !important; font-weight: 900 !important;
                    color: #a5b4fc !important; margin-bottom: 4px !important;
                    position: relative !important; z-index: 2 !important;
                }
                .bnda-input-sub {
                    font-size: 11px !important; color: #8b98b2 !important;
                    margin-bottom: 14px !important;
                    position: relative !important; z-index: 2 !important;
                }
                .bnda-input-error {
                    background: rgba(255, 62, 62, 0.12) !important;
                    border: 1px solid rgba(255, 62, 62, 0.4) !important;
                    border-radius: 10px !important;
                    padding: 10px 12px !important;
                    color: #ff6b6b !important;
                    font-size: 12px !important;
                    font-weight: 700 !important;
                    margin-bottom: 12px !important;
                    position: relative !important; z-index: 2 !important;
                    animation: bndaShake 0.5s ease !important;
                }
                .bnda-input-field {
                    width: 100% !important; padding: 14px 16px !important;
                    background: rgba(0, 0, 0, 0.4) !important;
                    border: 2px solid rgba(102, 126, 234, 0.3) !important;
                    border-radius: 12px !important;
                    color: #fff !important; font-size: 14px !important;
                    font-family: 'Courier New', monospace !important;
                    text-align: center !important; letter-spacing: 1px !important;
                    outline: none !important; box-sizing: border-box !important;
                    margin-bottom: 12px !important; transition: all 0.3s !important;
                    position: relative !important; z-index: 2 !important;
                }
                .bnda-input-field:focus {
                    border-color: #667eea !important;
                    box-shadow: 0 0 20px rgba(102, 126, 234, 0.4) !important;
                }
                .bnda-input-field::placeholder {
                    color: #4b5563 !important; letter-spacing: 0 !important;
                }
                .bnda-input-btn {
                    width: 100% !important; padding: 13px !important;
                    border: 0 !important; border-radius: 12px !important;
                    background: linear-gradient(135deg, #667eea, #764ba2) !important;
                    color: #fff !important; font-size: 14px !important; font-weight: 800 !important;
                    cursor: pointer !important; font-family: inherit !important;
                    transition: all 0.25s !important;
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
                    position: relative !important; z-index: 2 !important;
                    margin-bottom: 8px !important;
                }
                .bnda-input-btn:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.6) !important;
                }
                .bnda-input-cancel {
                    width: 100% !important;
                    padding: 10px !important;
                    border: 0 !important; border-radius: 10px !important;
                    background: transparent !important;
                    color: #6b7280 !important; font-size: 12px !important;
                    cursor: pointer !important; font-family: inherit !important;
                    position: relative !important; z-index: 2 !important;
                    margin-bottom: 14px !important;
                }
                .bnda-input-cancel:hover { color: #a5b4fc !important; }
                .bnda-input-sep {
                    display: flex !important; align-items: center !important;
                    margin: 8px 0 14px !important;
                    color: #4b5563 !important;
                    font-size: 10px !important; font-weight: 700 !important;
                    position: relative !important; z-index: 2 !important;
                }
                .bnda-input-sep::before,
                .bnda-input-sep::after {
                    content: '' !important; flex: 1 !important; height: 1px !important;
                    background: rgba(255, 255, 255, 0.08) !important;
                }
                .bnda-input-sep span { padding: 0 10px !important; letter-spacing: 1px !important; }
                .bnda-input-links {
                    display: flex !important;
                    gap: 8px !important;
                    position: relative !important; z-index: 2 !important;
                }
                .bnda-link-btn {
                    flex: 1 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 5px !important;
                    padding: 11px 8px !important;
                    border-radius: 11px !important;
                    font-size: 11px !important;
                    font-weight: 800 !important;
                    text-decoration: none !important;
                    text-align: center !important;
                    transition: all 0.25s !important;
                    box-sizing: border-box !important;
                    line-height: 1.2 !important;
                }
                .bnda-link-channel {
                    background: linear-gradient(135deg, #25D366, #128C7E) !important;
                    color: #fff !important;
                    box-shadow: 0 4px 16px rgba(37, 211, 102, 0.35) !important;
                }
                .bnda-link-channel:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 8px 24px rgba(37, 211, 102, 0.55) !important;
                }
                .bnda-link-support {
                    background: linear-gradient(135deg, #667eea, #764ba2) !important;
                    color: #fff !important;
                    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.35) !important;
                }
                .bnda-link-support:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.55) !important;
                }
                .bnda-device-lock {
                    font-size: 9px !important;
                    color: #6b7280 !important;
                    margin-top: 10px !important;
                    padding-top: 10px !important;
                    border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
                    position: relative !important; z-index: 2 !important;
                }
            </style>
            <div class="bnda-input-box">
                <div class="bnda-input-icon">🔑</div>
                <div class="bnda-input-title">BNDA Premium Extension</div>
                <div class="bnda-input-sub">Apna license key daalein</div>
                ${errorHTML}
                <input 
                    type="text" 
                    id="bnda-license-input" 
                    class="bnda-input-field" 
                    placeholder="QX-XXXX-000"
                    autocomplete="off"
                    spellcheck="false"
                    value="${prefill}"
                />
                <button class="bnda-input-btn" id="bnda-submit">✅ Activate</button>
                <button class="bnda-input-cancel" id="bnda-cancel">Cancel</button>
                
                <div class="bnda-input-sep"><span>NO LICENSE?</span></div>
                
                <div class="bnda-input-links">
                    <a href="${CONFIG.WHATSAPP_CHANNEL}" target="_blank" class="bnda-link-btn bnda-link-channel">
                        📢 Join Channel
                    </a>
                    <a href="${WA_LINK}" target="_blank" class="bnda-link-btn bnda-link-support">
                        💬 Get License
                    </a>
                </div>
                
                <div class="bnda-device-lock">
                    🔐 1 Key = 1 Device Only
                </div>
            </div>
            `;
            
            document.body.appendChild(input);
            
            const inputField = document.getElementById('bnda-license-input');
            const submitBtn = document.getElementById('bnda-submit');
            const cancelBtn = document.getElementById('bnda-cancel');
            
            setTimeout(() => inputField.focus(), 100);
            
            function submit() {
                const val = inputField.value.trim();
                if (val) {
                    input.remove();
                    resolve(val);
                } else {
                    inputField.style.borderColor = '#ff3e3e';
                    setTimeout(() => { inputField.style.borderColor = ''; }, 500);
                }
            }
            
            function cancel() {
                input.remove();
                resolve(null);
            }
            
            submitBtn.addEventListener('click', submit);
            cancelBtn.addEventListener('click', cancel);
            inputField.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') submit();
                if (e.key === 'Escape') cancel();
            });
        });
    }
    
    // =========================================
    // SUCCESS TOAST
    // =========================================
    function showSuccessToast(license) {
        const existing = document.getElementById('bnda-success-toast');
        if (existing) existing.remove();
        
        playPianoSound();
        
        const expiryText = license.expires ? formatDate(license.expires) : 'Lifetime';
        const remainingText = license.expires ? getTimeRemaining(license.expires) : 'Unlimited';
        
        const toast = document.createElement('div');
        toast.id = 'bnda-success-toast';
        
        toast.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #0faf59, #00c853);
                color: #fff; padding: 12px 16px; border-radius: 14px;
                box-shadow: 0 12px 40px rgba(15, 175, 89, 0.5);
                font-family: 'Segoe UI', sans-serif;
                font-size: 12px; font-weight: 700;
                max-width: 300px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            ">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                    <span style="font-size:20px;">✅</span>
                    <div>
                        <div style="font-size:13px;font-weight:900;">Activated!</div>
                        <div style="font-size:10px;opacity:0.9;">${license.owner || 'User'}</div>
                    </div>
                </div>
                <div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:8px;font-size:10px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
                        <span style="opacity:0.85;">Expires:</span>
                        <span style="font-weight:800;">${expiryText}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;">
                        <span style="opacity:0.85;">Remaining:</span>
                        <span style="font-weight:800;">${remainingText}</span>
                    </div>
                </div>
            </div>
        `;
        
        toast.style.cssText = `
            position: fixed; top: 16px; right: 16px;
            z-index: 2147483647;
            animation: bndaSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }
    
    // =========================================
    // VALIDATE WITH DEVICE LOCK
    // =========================================
    async function validateLicense(licenseKey) {
        try {
            const url = 'https://' + CONFIG.GITHUB_USER + '.github.io/' + CONFIG.REPO + '/licenses.json?v=' + Date.now();
            const response = await fetch(url);
            if (!response.ok) return { valid: false, reason: 'network', info: null };
            
            const licenses = await response.json();
            const license = licenses[licenseKey];
            
            if (!license) return { valid: false, reason: 'invalid', info: null };
            if (license.active === false) return { valid: false, reason: 'disabled', info: license };
            if (license.expires && Date.now() > license.expires) return { valid: false, reason: 'expired', info: license };
            
            // =========================================
            // DEVICE LOCK CHECK (1 key = 1 device)
            // =========================================
            const currentDeviceId = getDeviceId();
            const savedDeviceId = localStorage.getItem('bnda_locked_device_' + licenseKey);
            
            if (!savedDeviceId) {
                // First time using this key → lock to this device
                localStorage.setItem('bnda_locked_device_' + licenseKey, currentDeviceId);
                console.log('🔐 Key locked to this device');
            } else if (savedDeviceId !== currentDeviceId) {
                // Different device → BLOCK
                return { valid: false, reason: 'device_locked', info: license };
            }
            
            return { valid: true, license: license };
        } catch (err) {
            return { valid: false, reason: 'network', info: null };
        }
    }
    
    // =========================================
    // LOAD MAIN SCRIPT
    // =========================================
    async function loadMainScript() {
        try {
            const url = CONFIG.SCRIPT_URL + '?v=' + Date.now();
            const response = await fetch(url);
            if (!response.ok) throw new Error('Script load failed');
            
            const code = await response.text();
            const script = document.createElement('script');
            script.textContent = code;
            document.documentElement.appendChild(script);
            script.remove();
            console.log('✅ BNDA Premium Loaded!');
        } catch (err) {
            console.error('❌ Failed:', err);
        }
    }
    
    // =========================================
    // MAIN - Loop until valid
    // =========================================
    async function main() {
        console.log('🔐 BNDA Premium - Checking...');
        console.log('📱 Device ID:', getDeviceId());
        
        let licenseKey = localStorage.getItem('bnda_license_key');
        let errorMessage = null;
        let attemptedKey = '';
        
        // LOOP: Jab tak valid key na mile
        while (true) {
            if (!licenseKey) {
                licenseKey = await showLicenseInput(errorMessage, attemptedKey);
                
                if (!licenseKey) {
                    // User cancel kiya
                    return;
                }
                
                attemptedKey = licenseKey;
            }
            
            const result = await validateLicense(licenseKey);
            
            // Valid → aage badho
            if (result.valid) {
                console.log('✅ Valid! Owner:', result.license.owner);
                localStorage.setItem('bnda_license_key', licenseKey);
                showSuccessToast(result.license);
                await loadMainScript();
                return;
            }
            
            // Invalid cases
            console.log('❌ Invalid:', result.reason);
            
            // Device locked → special message
            if (result.reason === 'device_locked') {
                errorMessage = 'This key is already locked to another device';
                localStorage.removeItem('bnda_license_key');
                licenseKey = null;
                continue;
            }
            
            // Network error → error message
            if (result.reason === 'network') {
                errorMessage = 'Network error - Please check internet';
                licenseKey = null;
                continue;
            }
            
            // Invalid / Expired / Disabled
            const errorMessages = {
                'invalid': 'Invalid License Key',
                'expired': 'License Expired - Please renew',
                'disabled': 'License Disabled - Contact support'
            };
            
            errorMessage = errorMessages[result.reason] || 'Invalid License Key';
            localStorage.removeItem('bnda_license_key');
            licenseKey = null;
        }
    }
    
    main();
})();