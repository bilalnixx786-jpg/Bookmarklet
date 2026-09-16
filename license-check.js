// ============================================
// BNDA PREMIUM EXTENSION - LICENSE CHECK v2.0
// With Expiry Display in Popup
// ============================================

(function() {
    'use strict';
    
    // =========================================
    // CONFIGURATION
    // =========================================
    const CONFIG = {
        GITHUB_USER: 'bilalnixx786-jpg',
        REPO: 'Bookmarklet',
        WHATSAPP_CHANNEL: 'https://whatsapp.com/channel/0029Vb5nZxj7j6g3Rt4YR32m',
        WHATSAPP_SUPPORT: 'https://wa.me/923306363018',
        BRAND_NAME: 'BNDA Premium Extension',
        SCRIPT_URL: 'https://bilalnixx786-jpg.github.io/Bookmarklet/script.js'
    };
    
    if (window.__bndaLicenseChecked) return;
    window.__bndaLicenseChecked = true;
    
    // =========================================
    // HELPER - FORMAT DATE
    // =========================================
    function formatDate(timestamp) {
        if (!timestamp) return 'Never';
        const d = new Date(timestamp);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const mins = String(d.getMinutes()).padStart(2, '0');
        return day + '/' + month + '/' + year + ' ' + hours + ':' + mins;
    }
    
    // =========================================
    // HELPER - TIME REMAINING
    // =========================================
    function getTimeRemaining(expires) {
        if (!expires) return 'Lifetime';
        const now = Date.now();
        const diff = expires - now;
        if (diff <= 0) return 'Expired';
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (days > 0) return days + ' days ' + hours + ' hours';
        if (hours > 0) return hours + ' hours ' + mins + ' mins';
        return mins + ' minutes';
    }
    
    // =========================================
    // GET LICENSE KEY
    // =========================================
    function getLicenseKey() {
        const saved = localStorage.getItem('bnda_license_key');
        if (saved) return saved;
        const input = prompt('🔑 BNDA Premium Extension\n\nApna license key daalein:\n\nLicense nahi hai? WhatsApp channel join karein.', '');
        if (input) {
            localStorage.setItem('bnda_license_key', input.trim());
            return input.trim();
        }
        return null;
    }
    
    // =========================================
    // PREMIUM POPUP
    // =========================================
    function showPremiumPopup(errorType, userLicense, licenseInfo) {
        const existing = document.getElementById('bnda-premium-popup');
        if (existing) existing.remove();
        
        const messages = {
            'invalid': { icon: '🚫', title: 'Invalid License', subtitle: 'License key valid nahi hai', color: '#ff3e3e' },
            'expired': { icon: '⏰', title: 'License Expired', subtitle: 'Aapka license expire ho gaya hai', color: '#ff9800' },
            'disabled': { icon: '⛔', title: 'License Disabled', subtitle: 'Ye license block kar diya gaya hai', color: '#ff3e3e' },
            'missing': { icon: '🔐', title: 'License Required', subtitle: 'Koi license key nahi mili', color: '#667eea' },
            'network': { icon: '📡', title: 'Network Error', subtitle: 'Internet check karein', color: '#ff9800' }
        };
        
        const msg = messages[errorType] || messages.invalid;
        
        let licenseInfoHTML = '';
        if (licenseInfo) {
            const expiryDate = formatDate(licenseInfo.expires);
            const expiryStatus = licenseInfo.expires 
                ? (Date.now() > licenseInfo.expires ? 'EXPIRED' : 'ACTIVE')
                : 'LIFETIME';
            const expiryColor = expiryStatus === 'ACTIVE' ? '#0faf59' : expiryStatus === 'EXPIRED' ? '#ff3e3e' : '#667eea';
            
            licenseInfoHTML = `
                <div class="bnda-info">
                    <div class="bnda-info-row">
                        <span class="bnda-info-label">Owner</span>
                        <span class="bnda-info-value">${licenseInfo.owner || 'Unknown'}</span>
                    </div>
                    <div class="bnda-info-row">
                        <span class="bnda-info-label">License Status</span>
                        <span class="bnda-info-value" style="color:${expiryColor}">${expiryStatus}</span>
                    </div>
                    <div class="bnda-info-row">
                        <span class="bnda-info-label">Expiry Date</span>
                        <span class="bnda-info-value" style="color:${expiryColor}">${expiryDate}</span>
                    </div>
                    ${licenseInfo.note ? `
                    <div class="bnda-info-row">
                        <span class="bnda-info-label">Note</span>
                        <span class="bnda-info-value">${licenseInfo.note}</span>
                    </div>
                    ` : ''}
                </div>
            `;
        }
        
        const popup = document.createElement('div');
        popup.id = 'bnda-premium-popup';
        
        popup.innerHTML = `
        <style>
            #bnda-premium-popup {
                position: fixed; inset: 0;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(12px);
                z-index: 2147483647;
                display: flex; align-items: center; justify-content: center;
                padding: 20px; box-sizing: border-box;
                font-family: 'Segoe UI', system-ui, sans-serif;
                animation: bndaFadeIn 0.3s ease;
                overflow-y: auto;
            }
            @keyframes bndaFadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes bndaPopupIn {
                from { opacity: 0; transform: translateY(40px) scale(0.9); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes bndaPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            @keyframes bndaShine {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
            }
            @keyframes bndaGlow {
                0%, 100% { box-shadow: 0 0 20px rgba(255, 62, 62, 0.5); }
                50% { box-shadow: 0 0 40px rgba(255, 62, 62, 0.9); }
            }
            .bnda-box {
                width: 100%; max-width: 440px;
                background: linear-gradient(160deg, #0a0e1a, #131a2e, #0a0e1a);
                border-radius: 24px;
                border: 1px solid rgba(102, 126, 234, 0.3);
                box-shadow: 0 30px 100px rgba(0, 0, 0, 0.7), 0 0 60px rgba(102, 126, 234, 0.3);
                overflow: hidden;
                animation: bndaPopupIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                margin: auto;
            }
            .bnda-header {
                padding: 28px 24px 22px;
                text-align: center;
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
                border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            }
            .bnda-icon {
                font-size: 56px;
                margin-bottom: 12px;
                display: inline-block;
                animation: bndaPulse 2s ease-in-out infinite;
                filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.6));
            }
            .bnda-brand {
                font-size: 22px; font-weight: 900;
                margin: 0 0 6px 0;
                background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #667eea);
                background-size: 200% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: bndaShine 3s linear infinite;
            }
            .bnda-badge {
                display: inline-block;
                padding: 4px 12px;
                background: rgba(102, 126, 234, 0.15);
                border: 1px solid rgba(102, 126, 234, 0.3);
                border-radius: 999px;
                color: #a5b4fc;
                font-size: 10px; font-weight: 800;
                letter-spacing: 1px; margin-top: 4px;
            }
            .bnda-body { padding: 24px; }
            .bnda-error {
                background: ${msg.color}15;
                border: 1px solid ${msg.color}40;
                border-radius: 16px;
                padding: 18px;
                text-align: center;
                margin-bottom: 16px;
            }
            .bnda-error-icon { font-size: 42px; margin-bottom: 8px; }
            .bnda-error-title {
                color: ${msg.color};
                font-size: 18px; font-weight: 800;
                margin-bottom: 6px;
            }
            .bnda-error-sub {
                color: #9fb4d6;
                font-size: 13px; line-height: 1.5;
            }
            .bnda-warning {
                background: linear-gradient(135deg, rgba(255, 62, 62, 0.1), rgba(255, 152, 0, 0.1));
                border: 2px solid rgba(255, 62, 62, 0.4);
                border-radius: 14px;
                padding: 16px;
                margin-bottom: 16px;
                text-align: center;
                animation: bndaGlow 2s ease-in-out infinite;
            }
            .bnda-warning-title {
                color: #ff3e3e;
                font-size: 14px; font-weight: 900;
                letter-spacing: 1px;
                margin-bottom: 6px;
                text-transform: uppercase;
            }
            .bnda-warning-text {
                color: #ffcdd2;
                font-size: 12px; line-height: 1.5;
                font-weight: 600;
            }
            .bnda-info {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 14px;
                padding: 16px;
                margin-bottom: 16px;
            }
            .bnda-info-row {
                display: flex; align-items: center; justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }
            .bnda-info-row:last-child { border-bottom: 0; }
            .bnda-info-label { color: #8b98b2; font-size: 12px; font-weight: 600; }
            .bnda-info-value {
                color: #e0e7ff; font-size: 13px; font-weight: 700;
                font-family: 'Courier New', monospace;
                max-width: 60%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: right;
            }
            .bnda-cta {
                color: #e0e7ff;
                font-size: 13px; font-weight: 800;
                margin-bottom: 12px;
                text-align: center;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .bnda-btn {
                display: block; width: 100%;
                padding: 15px 20px;
                border-radius: 14px;
                font-size: 14px; font-weight: 800;
                text-decoration: none;
                text-align: center;
                margin-bottom: 10px;
                border: none;
                cursor: pointer;
                transition: all 0.25s ease;
                font-family: inherit;
                box-sizing: border-box;
            }
            .bnda-btn-channel {
                background: linear-gradient(135deg, #25D366, #128C7E);
                color: #fff;
                box-shadow: 0 6px 24px rgba(37, 211, 102, 0.4);
            }
            .bnda-btn-support {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: #fff;
                box-shadow: 0 6px 24px rgba(102, 126, 234, 0.4);
            }
            .bnda-btn-retry {
                background: rgba(255, 255, 255, 0.08);
                color: #a5b4fc;
                border: 1px solid rgba(102, 126, 234, 0.3);
            }
            .bnda-btn-close {
                background: transparent;
                color: #8b98b2;
                font-size: 12px;
                padding: 10px;
                margin-bottom: 0;
            }
            .bnda-divider {
                display: flex; align-items: center;
                margin: 14px 0;
                color: #6b7280;
                font-size: 11px; font-weight: 700;
            }
            .bnda-divider::before,
            .bnda-divider::after {
                content: ''; flex: 1; height: 1px;
                background: rgba(255, 255, 255, 0.08);
            }
            .bnda-divider span { padding: 0 12px; }
            .bnda-footer {
                text-align: center;
                padding: 16px 24px;
                border-top: 1px solid rgba(255, 255, 255, 0.05);
                color: #6b7280;
                font-size: 11px;
                background: rgba(0, 0, 0, 0.2);
            }
            .bnda-footer strong { color: #a5b4fc; }
        </style>
        
        <div class="bnda-box">
            <div class="bnda-header">
                <div class="bnda-icon">💎</div>
                <h2 class="bnda-brand">${CONFIG.BRAND_NAME}</h2>
                <div class="bnda-badge">🔐 PREMIUM EDITION</div>
            </div>
            
            <div class="bnda-body">
                <div class="bnda-error">
                    <div class="bnda-error-icon">${msg.icon}</div>
                    <div class="bnda-error-title">${msg.title}</div>
                    <div class="bnda-error-sub">${msg.subtitle}</div>
                </div>
                
                ${licenseInfoHTML}
                
                <div class="bnda-warning">
                    <div class="bnda-warning-title">⚠️ Warning</div>
                    <div class="bnda-warning-text">
                        Don't Buy Third Party!<br>
                        Sirf official channel se hi license lein.
                    </div>
                </div>
                
                <div class="bnda-info">
                    <div class="bnda-info-row">
                        <span class="bnda-info-label">Your License</span>
                        <span class="bnda-info-value">${userLicense ? userLicense.substring(0, 25) + (userLicense.length > 25 ? '...' : '') : 'Not Provided'}</span>
                    </div>
                    <div class="bnda-info-row">
                        <span class="bnda-info-label">Version</span>
                        <span class="bnda-info-value">v2.0 Premium</span>
                    </div>
                </div>
                
                <div class="bnda-cta">🔑 Get License Now</div>
                
                <a href="${CONFIG.WHATSAPP_CHANNEL}" target="_blank" class="bnda-btn bnda-btn-channel">
                    📢 Join Official WhatsApp Channel
                </a>
                
                <a href="${CONFIG.WHATSAPP_SUPPORT}?text=Hi, mujhe BNDA Premium Extension license chahiye" target="_blank" class="bnda-btn bnda-btn-support">
                    💬 Contact Support
                </a>
                
                <div class="bnda-divider"><span>OR</span></div>
                
                <button class="bnda-btn bnda-btn-retry" onclick="localStorage.removeItem('bnda_license_key'); location.reload();">
                    🔄 Enter Different License
                </button>
                
                <button class="bnda-btn bnda-btn-close" onclick="document.getElementById('bnda-premium-popup').remove()">
                    Close
                </button>
            </div>
            
            <div class="bnda-footer">
                ⭐ <strong>${CONFIG.BRAND_NAME}</strong><br>
                Powered by <strong>@BNDA</strong> • Do Not Share
            </div>
        </div>
        `;
        
        document.body.appendChild(popup);
    }
    
    // =========================================
    // SHOW WELCOME TOAST (for valid license)
    // =========================================
    function showWelcomeToast(license, isTrial) {
        const existing = document.getElementById('bnda-welcome-toast');
        if (existing) existing.remove();
        
        const expiryText = license.expires 
            ? formatDate(license.expires)
            : 'Lifetime';
        
        const remainingText = license.expires
            ? getTimeRemaining(license.expires)
            : 'Unlimited';
        
        const toast = document.createElement('div');
        toast.id = 'bnda-welcome-toast';
        
        toast.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #0faf59, #00c853);
                color: #fff;
                padding: 16px 20px;
                border-radius: 16px;
                box-shadow: 0 15px 50px rgba(15, 175, 89, 0.6);
                font-family: 'Segoe UI', sans-serif;
                font-size: 13px;
                font-weight: 700;
                max-width: 360px;
                position: relative;
            ">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <span style="font-size:24px;">✅</span>
                    <div>
                        <div style="font-size:15px;font-weight:900;">BNDA Premium Active</div>
                        <div style="font-size:11px;opacity:0.9;">${license.owner || 'User'}</div>
                    </div>
                    ${isTrial ? '<span style="margin-left:auto;background:rgba(255,255,255,0.25);padding:3px 8px;border-radius:8px;font-size:9px;font-weight:800;">TRIAL</span>' : ''}
                </div>
                <div style="background:rgba(0,0,0,0.2);border-radius:10px;padding:10px;font-size:11px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
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
            position: fixed; top: 20px; right: 20px;
            z-index: 2147483647;
            animation: bndaPopupIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 6000);
    }
    
    // =========================================
    // VALIDATE LICENSE
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
            
            console.log('✅ BNDA Premium Extension Loaded!');
        } catch (err) {
            console.error('❌ Failed:', err);
        }
    }
    
    // =========================================
    // MAIN
    // =========================================
    async function main() {
        console.log('🔐 BNDA Premium - Checking license...');
        
        const licenseKey = getLicenseKey();
        
        if (!licenseKey) {
            showPremiumPopup('missing', '', null);
            return;
        }
        
        const result = await validateLicense(licenseKey);
        
        if (!result.valid) {
            console.log('❌ Invalid:', result.reason);
            showPremiumPopup(result.reason, licenseKey, result.info);
            return;
        }
        
        console.log('✅ Valid! Owner:', result.license.owner);
        
        const isTrial = result.license.expires && (result.license.expires - Date.now()) < 86400000;
        
        showWelcomeToast(result.license, isTrial);
        
        await loadMainScript();
    }
    
    main();
})();