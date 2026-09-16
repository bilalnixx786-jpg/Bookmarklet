// ============================================
// BNDA PREMIUM EXTENSION v4.1
// Device Lock + Input Buttons
// ============================================

(function() {
    'use strict';
    
    const CONFIG = {
        GITHUB_USER: 'bilalnixx786-jpg',
        REPO: 'Bookmarklet',
        WHATSAPP_CHANNEL: 'https://whatsapp.com/channel/0029Vb5nZxj7j6g3Rt4YR32m',
        WHATSAPP_NUMBER: '923306363018',
        BRAND_NAME: 'BNDA Premium',
        SCRIPT_URL: 'https://bilalnixx786-jpg.github.io/Bookmarklet/script.js'
    };
    
    if (window.__bndaLicenseChecked) return;
    window.__bndaLicenseChecked = true;
    
    // =========================================
    // DEVICE ID
    // =========================================
    function getDeviceId() {
        let deviceId = localStorage.getItem('bnda_device_id');
        if (deviceId) return deviceId;
        
        const nav = window.navigator;
        const scr = window.screen;
        const fingerprint = [
            nav.userAgent || '',
            nav.language || '',
            nav.platform || '',
            scr.width || 0,
            scr.height || 0,
            new Date().getTimezoneOffset(),
            Math.random().toString(36).substring(2, 15)
        ].join('|');
        
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            const c = fingerprint.charCodeAt(i);
            hash = ((hash << 5) - hash) + c;
            hash = hash & hash;
        }
        
        deviceId = 'DEV_' + Math.abs(hash).toString(36).toUpperCase() + '_' + Date.now().toString(36);
        localStorage.setItem('bnda_device_id', deviceId);
        return deviceId;
    }
    
    // =========================================
    // PIANO MUSIC
    // =========================================
    function playPianoSound() {
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return;
            const ctx = new AC();
            const now = ctx.currentTime;
            const notes = [
                { f: 523.25, t: 0.0, d: 0.15 },
                { f: 659.25, t: 0.15, d: 0.15 },
                { f: 783.99, t: 0.30, d: 0.20 },
                { f: 1046.50, t: 0.50, d: 0.30 }
            ];
            notes.forEach(n => {
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
    // FORMAT
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
        const days = Math.floor(diff / 86400000);
        const hrs = Math.floor((diff % 86400000) / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        if (days > 0) return days + 'd ' + hrs + 'h';
        if (hrs > 0) return hrs + 'h ' + mins + 'm';
        if (mins > 0) return mins + 'm ' + secs + 's';
        return secs + 's';
    }
    
    // =========================================
    // LICENSE INPUT POPUP (with buttons)
    // =========================================
    function showLicenseInput() {
        return new Promise((resolve) => {
            const existing = document.getElementById('bnda-input-popup');
            if (existing) existing.remove();
            
            const input = document.createElement('div');
            input.id = 'bnda-input-popup';
            
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
            </style>
            <div class="bnda-input-box">
                <div class="bnda-input-icon">🔑</div>
                <div class="bnda-input-title">BNDA Premium Extension</div>
                <div class="bnda-input-sub">Apna license key daalein</div>
                <input 
                    type="text" 
                    id="bnda-license-input" 
                    class="bnda-input-field" 
                    placeholder="QX-XXXX-000"
                    autocomplete="off"
                    spellcheck="false"
                />
                <button class="bnda-input-btn" id="bnda-submit">✅ Activate</button>
                <button class="bnda-input-cancel" id="bnda-cancel">Cancel</button>
                
                <div class="bnda-input-sep"><span>LICENSE NAHI?</span></div>
                
                <div class="bnda-input-links">
                    <a href="${CONFIG.WHATSAPP_CHANNEL}" target="_blank" class="bnda-link-btn bnda-link-channel">
                        📢 Join Channel
                    </a>
                    <a href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=Hi%2C%20mujhe%20BNDA%20Premium%20Extension%20ka%20license%20chahiye" target="_blank" class="bnda-link-btn bnda-link-support">
                        💬 Get License
                    </a>
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
    // PREMIUM ERROR POPUP
    // =========================================
    function showPremiumPopup(errorType, userLicense, licenseInfo) {
        const existing = document.getElementById('bnda-premium-popup');
        if (existing) existing.remove();
        
        playPianoSound();
        
        const messages = {
            'invalid': { icon: '🚫', title: 'Invalid License', subtitle: 'Key valid nahi hai', color: '#ff3e3e' },
            'expired': { icon: '⏰', title: 'License Expired', subtitle: 'Aapka license expire ho gaya', color: '#ff9800' },
            'disabled': { icon: '⛔', title: 'License Disabled', subtitle: 'Ye license block hai', color: '#ff3e3e' },
            'network': { icon: '📡', title: 'Network Error', subtitle: 'Internet check karein', color: '#ff9800' },
            'missing': { icon: '🔐', title: 'License Required', subtitle: 'Koi license key nahi mili', color: '#667eea' },
            'device_locked': { icon: '🔒', title: 'Key Already In Use', subtitle: 'Ye key doosre device pe active hai', color: '#ff3e3e' }
        };
        
        const msg = messages[errorType] || messages.invalid;
        
        let infoHTML = '';
        if (licenseInfo) {
            const expiryDate = formatDate(licenseInfo.expires);
            const status = licenseInfo.expires 
                ? (Date.now() > licenseInfo.expires ? 'EXPIRED' : 'ACTIVE')
                : 'LIFETIME';
            const color = status === 'ACTIVE' ? '#0faf59' : '#ff3e3e';
            
            infoHTML = `
                <div class="bnda-popup-info">
                    <div class="bnda-popup-info-row">
                        <span>Owner:</span>
                        <b>${licenseInfo.owner || 'Unknown'}</b>
                    </div>
                    <div class="bnda-popup-info-row">
                        <span>Status:</span>
                        <b style="color:${color}">${status}</b>
                    </div>
                    <div class="bnda-popup-info-row">
                        <span>Expiry:</span>
                        <b style="color:${color}">${expiryDate}</b>
                    </div>
                </div>
            `;
        }
        
        const popup = document.createElement('div');
        popup.id = 'bnda-premium-popup';
        
        popup.innerHTML = `
        <style>
            #bnda-premium-popup {
                position: fixed !important; inset: 0 !important;
                background: rgba(0, 0, 0, 0.8) !important;
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
            @keyframes bndaPulse2 {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.08); }
            }
            @keyframes bndaShine2 {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
            }
            @keyframes bndaWarnGlow {
                0%, 100% { box-shadow: 0 0 15px rgba(255, 62, 62, 0.4); }
                50% { box-shadow: 0 0 30px rgba(255, 62, 62, 0.7); }
            }
            .bnda-popup-box {
                width: 100% !important; max-width: 340px !important;
                background: linear-gradient(160deg, #0a0e1a, #131a2e) !important;
                border: 1px solid rgba(102, 126, 234, 0.3) !important;
                border-radius: 20px !important;
                padding: 20px !important;
                text-align: center !important;
                animation: bndaSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
                box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7), 0 0 40px rgba(102, 126, 234, 0.2) !important;
                margin: auto !important;
                position: relative !important;
            }
            .bnda-popup-brand {
                font-size: 15px !important; font-weight: 900 !important;
                background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #667eea) !important;
                background-size: 200% auto !important;
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
                background-clip: text !important;
                animation: bndaShine2 3s linear infinite !important;
                margin-bottom: 14px !important; letter-spacing: 0.5px !important;
            }
            .bnda-popup-error {
                background: ${msg.color}15 !important;
                border: 1px solid ${msg.color}40 !important;
                border-radius: 14px !important;
                padding: 14px 12px !important;
                margin-bottom: 12px !important;
            }
            .bnda-popup-error-icon {
                font-size: 32px !important; margin-bottom: 4px !important;
                display: block !important;
                animation: bndaPulse2 2s ease-in-out infinite !important;
            }
            .bnda-popup-error-title {
                color: ${msg.color} !important;
                font-size: 15px !important; font-weight: 900 !important;
                margin-bottom: 3px !important;
            }
            .bnda-popup-error-sub {
                color: #9fb4d6 !important; font-size: 11px !important;
            }
            .bnda-popup-warning {
                background: linear-gradient(135deg, rgba(255, 62, 62, 0.12), rgba(255, 152, 0, 0.08)) !important;
                border: 1.5px solid rgba(255, 62, 62, 0.35) !important;
                border-radius: 12px !important;
                padding: 12px !important;
                margin-bottom: 12px !important;
                animation: bndaWarnGlow 2s ease-in-out infinite !important;
            }
            .bnda-popup-warning-title {
                color: #ff3e3e !important;
                font-size: 11px !important; font-weight: 900 !important;
                letter-spacing: 0.5px !important;
                margin-bottom: 4px !important;
                text-transform: uppercase !important;
            }
            .bnda-popup-warning-text {
                color: #ffcdd2 !important; font-size: 10px !important;
                line-height: 1.4 !important; font-weight: 600 !important;
            }
            .bnda-popup-info {
                background: rgba(255, 255, 255, 0.03) !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
                border-radius: 12px !important;
                padding: 12px !important;
                margin-bottom: 12px !important;
                text-align: left !important;
            }
            .bnda-popup-info-row {
                display: flex !important; justify-content: space-between !important;
                align-items: center !important; padding: 5px 0 !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
                font-size: 11px !important;
            }
            .bnda-popup-info-row:last-child { border-bottom: 0 !important; }
            .bnda-popup-info-row span { color: #8b98b2 !important; font-weight: 600 !important; }
            .bnda-popup-info-row b {
                color: #e0e7ff !important;
                font-family: 'Courier New', monospace !important;
                font-size: 11px !important;
            }
            .bnda-popup-btn {
                display: block !important; width: 100% !important;
                padding: 12px !important; border-radius: 12px !important;
                font-size: 12px !important; font-weight: 800 !important;
                text-decoration: none !important; text-align: center !important;
                margin-bottom: 8px !important; border: none !important;
                cursor: pointer !important; transition: all 0.25s !important;
                font-family: inherit !important; box-sizing: border-box !important;
            }
            .bnda-popup-btn-channel {
                background: linear-gradient(135deg, #25D366, #128C7E) !important;
                color: #fff !important;
                box-shadow: 0 4px 16px rgba(37, 211, 102, 0.35) !important;
            }
            .bnda-popup-btn-support {
                background: linear-gradient(135deg, #667eea, #764ba2) !important;
                color: #fff !important;
                box-shadow: 0 4px 16px rgba(102, 126, 234, 0.35) !important;
            }
            .bnda-popup-btn-cancel {
                background: transparent !important;
                color: #6b7280 !important;
                font-size: 11px !important;
                padding: 8px !important; margin-bottom: 0 !important;
            }
            .bnda-popup-footer {
                margin-top: 12px !important; padding-top: 10px !important;
                border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
                color: #4b5563 !important; font-size: 9px !important; font-weight: 600 !important;
            }
            .bnda-popup-footer b { color: #a5b4fc !important; }
        </style>
        
        <div class="bnda-popup-box">
            <div class="bnda-popup-brand">💎 ${CONFIG.BRAND_NAME}</div>
            
            <div class="bnda-popup-error">
                <span class="bnda-popup-error-icon">${msg.icon}</span>
                <div class="bnda-popup-error-title">${msg.title}</div>
                <div class="bnda-popup-error-sub">${msg.subtitle}</div>
            </div>
            
            ${infoHTML}
            
            <div class="bnda-popup-warning">
                <div class="bnda-popup-warning-title">⚠️ Warning</div>
                <div class="bnda-popup-warning-text">Don't Buy Third Party!</div>
            </div>
            
            <a href="${CONFIG.WHATSAPP_CHANNEL}" target="_blank" class="bnda-popup-btn bnda-popup-btn-channel">
                📢 Join WhatsApp Channel
            </a>
            
            <a href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=Hi%2C%20mujhe%20BNDA%20Premium%20Extension%20ka%20license%20chahiye" target="_blank" class="bnda-popup-btn bnda-popup-btn-support">
                💬 Contact on WhatsApp
            </a>
            
            <button class="bnda-popup-btn bnda-popup-btn-cancel" onclick="localStorage.removeItem('bnda_license_key'); document.getElementById('bnda-premium-popup').remove();">
                Close
            </button>
            
            <div class="bnda-popup-footer">
                ⭐ Powered by <b>@BNDA</b> • Do Not Share
            </div>
        </div>
        `;
        
        document.body.appendChild(popup);
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
    // VALIDATE
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
            
            // DEVICE LOCK
            const currentDeviceId = getDeviceId();
            const savedDeviceId = localStorage.getItem('bnda_locked_device_' + licenseKey);
            
            if (!savedDeviceId) {
                localStorage.setItem('bnda_locked_device_' + licenseKey, currentDeviceId);
                console.log('🔒 Locked to device');
            } else if (savedDeviceId !== currentDeviceId) {
                return { valid: false, reason: 'device_locked', info: license };
            }
            
            return { valid: true, license: license };
        } catch (err) {
            return { valid: false, reason: 'network', info: null };
        }
    }
    
    // =========================================
    // LOAD SCRIPT
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
    // MAIN
    // =========================================
    async function main() {
        console.log('🔐 BNDA Premium - Checking...');
        console.log('📱 Device:', getDeviceId());
        
        let licenseKey = localStorage.getItem('bnda_license_key');
        
        if (!licenseKey) {
            licenseKey = await showLicenseInput();
            if (!licenseKey) {
                showPremiumPopup('missing', '', null);
                return;
            }
            localStorage.setItem('bnda_license_key', licenseKey);
        }
        
        const result = await validateLicense(licenseKey);
        
        if (!result.valid) {
            console.log('❌ Invalid:', result.reason);
            localStorage.removeItem('bnda_license_key');
            showPremiumPopup(result.reason, licenseKey, result.info);
            return;
        }
        
        console.log('✅ Valid!');
        showSuccessToast(result.license);
        await loadMainScript();
    }
    
    main();
})();