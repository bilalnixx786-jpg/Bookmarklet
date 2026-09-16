(function() {
    'use strict';
    
    if (window.__qxLoaderActive) {
        console.log('Already loaded');
        return;
    }
    window.__qxLoaderActive = true;
    
    const SCRIPT_URL = 'https://bilalnixx786-jpg.github.io/Bookmarklet/script.js?v=' + Date.now();
    
    console.log('Loading Quotex Panel...');
    
    fetch(SCRIPT_URL)
        .then(function(r) { return r.text(); })
        .then(function(code) {
            try {
                const script = document.createElement('script');
                script.textContent = code;
                document.documentElement.appendChild(script);
                script.remove();
                console.log('Loaded successfully!');
            } catch (e) {
                console.error('Error:', e);
                eval(code);
            }
        })
        .catch(function(err) {
            console.error('Failed:', err);
            alert('Load failed');
        });
})();
