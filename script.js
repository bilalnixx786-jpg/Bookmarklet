(() => {
  "use strict";

  const KEY = "__BNDA";
  window[KEY]?.close?.();

  // ========================================
  // 🎯 BRANDING
  // ========================================
  const BRAND = {
    title: "Base Glitch",
    subtitle: "POWERED BY BNDA CoDeX",
    poweredBy: "© BNDA CoDeX",
    telegramLabel: "📢 Telegram",
    telegramLink: "https://t.me/closewglitchapk",
    contactLabel: "💬 Admin",
    contactLink: "https://t.me/closewglitchapk",
  };

  // ---- Plot find ----
  let el = document.querySelector("canvas.layer.plot");
  let fiber, plot;
  while (el && !fiber) {
    const key = Object.getOwnPropertyNames(el).find(k => k.startsWith("__reactFiber$"));
    if (key) fiber = el[key];
    el = el.parentElement;
  }
  for (let i = 0; fiber && i < 30; i++, fiber = fiber.return) {
    if (fiber.stateNode?.plot?.pointsManager) { plot = fiber.stateNode.plot; break; }
  }
  if (!plot || typeof plot.drawElements !== "function") {
    return console.log("❌ Chart reference nahi mila");
  }

  const pm = plot.pointsManager;
  const original = plot.drawElements;
  const descriptor = Object.getOwnPropertyDescriptor(plot, "drawElements");

  if (descriptor && (!("value" in descriptor) || !descriptor.writable)) {
    return console.log("❌ Drawing method writable nahi hai");
  }

  // ========================================
  // 🎯 SETTINGS
  // ========================================
  const CFG = {
    delay: 1,
    targetMove: 1.5,
    holdTime: 8,
    pullbackMove: 0.05,
    totalTime: 20,
    speedUp: 2.5,
    speedDown: 2.5,
    pullbackSpeed: 1.5,
    glitch: 0.5,
    wick: 0.6,
  };

  // ========================================
  // 🎯 CHOTA POPUP
  // ========================================
  const box = document.createElement("div");
  box.id = "bnda-box";
  box.style.cssText = `
    position:fixed; top:80px; left:20px; z-index:2147483647;
    background:#1a1f3a; color:#e2e8f0;
    border:1.5px solid #ef4444; border-radius:8px;
    padding:8px 10px 10px; width:180px;
    box-sizing:border-box; font:11px system-ui;
    box-shadow:0 6px 20px #000a;
    user-select:none;
  `;

  // ========================================
  // 🎯 HEADER (DRAGGABLE)
  // ========================================
  const header = document.createElement("div");
  header.style.cssText = `
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:6px; padding-bottom:4px;
    border-bottom:1px solid #334155;
    cursor:move;
  `;

  const title = document.createElement("div");
  title.innerHTML = `
    <span style="color:#ef4444;font-size:11px;font-weight:800;letter-spacing:0.5px;">⏸ ${BRAND.title}</span>
  `;

  const closeBtn = document.createElement("span");
  closeBtn.textContent = "✖";
  closeBtn.style.cssText = "color:#64748b;font-size:11px;cursor:pointer;padding-left:6px;";
  closeBtn.onclick = (e) => { e.stopPropagation(); box.remove(); };

  header.appendChild(title);
  header.appendChild(closeBtn);
  box.appendChild(header);

  // ========================================
  // 🎯 DRAG SYSTEM
  // ========================================
  let dragging = false, dx = 0, dy = 0, dragStartX = 0, dragStartY = 0;

  const startDrag = (cx, cy) => {
    dragging = false;
    dragStartX = cx; dragStartY = cy;
    const r = box.getBoundingClientRect();
    dx = cx - r.left; dy = cy - r.top;

    const moveHandler = (e) => {
      const mx = e.clientX ?? e.touches?.[0]?.clientX;
      const my = e.clientY ?? e.touches?.[0]?.clientY;
      if (mx == null) return;
      const dist = Math.hypot(mx - dragStartX, my - dragStartY);
      if (dist > 5) dragging = true;
      if (dragging) {
        box.style.left = (mx - dx) + "px";
        box.style.top = (my - dy) + "px";
        box.style.right = "auto";
      }
    };

    const endHandler = () => {
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("touchmove", moveHandler);
      document.removeEventListener("mouseup", endHandler);
      document.removeEventListener("touchend", endHandler);
      setTimeout(() => dragging = false, 50);
    };

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("touchmove", moveHandler, {passive:false});
    document.addEventListener("mouseup", endHandler);
    document.addEventListener("touchend", endHandler);
  };

  header.addEventListener("mousedown", (e) => {
    if (e.target === closeBtn) return;
    startDrag(e.clientX, e.clientY);
  });
  header.addEventListener("touchstart", (e) => {
    if (e.target === closeBtn) return;
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  }, {passive:false});

  // ========================================
  // 🎯 DIRECTION SELECTOR (UP / DOWN)
  // ========================================
  const dirLabel = document.createElement("div");
  dirLabel.textContent = "TRADE DIRECTION";
  dirLabel.style.cssText = `
    font-size:8px; color:#64748b; font-weight:700;
    letter-spacing:1px; margin-bottom:4px; text-align:center;
  `;
  box.appendChild(dirLabel);

  const dirRow = document.createElement("div");
  dirRow.style.cssText = "display:flex; gap:5px; margin-bottom:8px;";

  const upBtn = document.createElement("button");
  upBtn.textContent = "▲ UP";
  upBtn.dataset.dir = "up";
  upBtn.style.cssText = `
    flex:1; padding:7px 4px; border-radius:5px;
    background:#334155; color:#94a3b8;
    border:1.5px solid #475569; cursor:pointer;
    font-size:10px; font-weight:800;
    transition: all 0.15s;
  `;

  const downBtn = document.createElement("button");
  downBtn.textContent = "▼ DOWN";
  downBtn.dataset.dir = "down";
  downBtn.style.cssText = `
    flex:1; padding:7px 4px; border-radius:5px;
    background:#334155; color:#94a3b8;
    border:1.5px solid #475569; cursor:pointer;
    font-size:10px; font-weight:800;
    transition: all 0.15s;
  `;

  let selectedDir = "up"; // default UP

  function updateDirButtons() {
    if (selectedDir === "up") {
      upBtn.style.background = "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)";
      upBtn.style.color = "#ffffff";
      upBtn.style.borderColor = "#22c55e";
      upBtn.style.boxShadow = "0 0 10px rgba(34,197,94,0.5)";

      downBtn.style.background = "#334155";
      downBtn.style.color = "#94a3b8";
      downBtn.style.borderColor = "#475569";
      downBtn.style.boxShadow = "none";
    } else {
      downBtn.style.background = "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
      downBtn.style.color = "#ffffff";
      downBtn.style.borderColor = "#ef4444";
      downBtn.style.boxShadow = "0 0 10px rgba(239,68,68,0.5)";

      upBtn.style.background = "#334155";
      upBtn.style.color = "#94a3b8";
      upBtn.style.borderColor = "#475569";
      upBtn.style.boxShadow = "none";
    }
  }

  upBtn.onclick = () => { selectedDir = "up"; updateDirButtons(); };
  downBtn.onclick = () => { selectedDir = "down"; updateDirButtons(); };

  dirRow.appendChild(upBtn);
  dirRow.appendChild(downBtn);
  box.appendChild(dirRow);
  updateDirButtons();

  // ========================================
  // 🎯 POWER INPUT
  // ========================================
  const powerLabel = document.createElement("div");
  powerLabel.textContent = "POWER (1-10)";
  powerLabel.style.cssText = `
    font-size:8px; color:#64748b; font-weight:700;
    letter-spacing:1px; margin-bottom:4px; text-align:center;
  `;
  box.appendChild(powerLabel);

  const inputRow = document.createElement("div");
  inputRow.style.cssText = "display:flex; gap:4px; margin-bottom:8px;";

  const inputField = document.createElement("input");
  inputField.type = "number";
  inputField.value = "7";
  inputField.min = "1";
  inputField.max = "10";
  inputField.style.cssText = `
    flex:1; background:#0f172a; border:1px solid #334155; border-radius:4px;
    padding:5px 6px; color:#fbbf24; font-size:12px; font-weight:700;
    outline:none; text-align:center; width:100%; box-sizing:border-box;
  `;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  minusBtn.style.cssText = `
    background:#334155; color:#e2e8f0; border:0; border-radius:4px;
    width:24px; cursor:pointer; font-size:14px; font-weight:700;
  `;
  minusBtn.onclick = () => {
    let v = Number(inputField.value) - 1;
    if (v < 1) v = 1;
    inputField.value = v;
  };

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  plusBtn.style.cssText = `
    background:#334155; color:#e2e8f0; border:0; border-radius:4px;
    width:24px; cursor:pointer; font-size:14px; font-weight:700;
  `;
  plusBtn.onclick = () => {
    let v = Number(inputField.value) + 1;
    if (v > 10) v = 10;
    inputField.value = v;
  };

  inputRow.appendChild(minusBtn);
  inputRow.appendChild(inputField);
  inputRow.appendChild(plusBtn);
  box.appendChild(inputRow);

  // ========================================
  // 🎯 ACTIVATE BUTTON
  // ========================================
  const activateBtn = document.createElement("button");
  activateBtn.textContent = "⚡ Activate Base Glitch";
  activateBtn.style.cssText = `
    width:100%; padding:9px 6px;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color:#ffffff; border:0; border-radius:5px;
    cursor:pointer; font-size:10px; font-weight:800;
    letter-spacing:0.3px;
    box-shadow: 0 3px 10px rgba(239, 68, 68, 0.4);
    transition: transform 0.15s;
  `;
  activateBtn.addEventListener("mousedown", () => activateBtn.style.transform = "scale(0.96)");
  activateBtn.addEventListener("mouseup", () => activateBtn.style.transform = "scale(1)");
  activateBtn.addEventListener("mouseleave", () => activateBtn.style.transform = "scale(1)");
  box.appendChild(activateBtn);

  // Status
  const statusBox = document.createElement("div");
  statusBox.id = "bnda-status";
  statusBox.style.cssText = `
    margin-top:6px; padding:4px 6px;
    background:#0f172a; border-radius:4px;
    font-size:9px; color:#22c55e; text-align:center;
    font-weight:700;
  `;
  statusBox.textContent = "▶ Ready — select dir";
  box.appendChild(statusBox);

  // Footer
  const footer = document.createElement("div");
  footer.innerHTML = BRAND.poweredBy;
  footer.style.cssText = `
    margin-top:6px; padding-top:4px;
    border-top:1px solid #334155;
    text-align:center; font-size:8px;
    color:#64748b; font-style:italic;
  `;
  box.appendChild(footer);

  function setStatus(text, color = "#22c55e") {
    const sb = document.getElementById("bnda-status");
    if (sb) { sb.textContent = text; sb.style.color = color; }
  }

  // ========================================
  // 🎯 ACTIVATE LOGIC — MANUAL DIRECTION
  // ========================================
  let active = null;

  activateBtn.addEventListener("click", () => {
    if (active) {
      setStatus("⚠️ Already active", "#fbbf24");
      return;
    }

    const lastCandle = pm.candles?.at(-1);
    if (!lastCandle) {
      setStatus("❌ No candle", "#ef4444");
      return;
    }

    // ✅ USER SELECTED DIRECTION USE KARO
    const isUp = selectedDir === "up";

    // Power input se depth calculate
    const power = Math.max(1, Math.min(10, Number(inputField.value) || 7));
    const depthMultiplier = 0.3 + (power * 0.15); // power 7 => 1.35, power 10 => 1.8

    console.log(`🎯 Activating — ${isUp ? "UP" : "DOWN"} deep (power: ${power})`);
    setStatus(`🚀 Pushing ${isUp ? "UP" : "DOWN"} deep...`, "#22c55e");

    const startPrice = lastCandle.exitValue;
    const moveAmount = startPrice * (CFG.targetMove / 100) * depthMultiplier;
    const pullbackAmount = startPrice * (CFG.pullbackMove / 100);
    const targetPrice = isUp ? startPrice + moveAmount : startPrice - moveAmount;
    const pullbackPrice = isUp ? targetPrice - pullbackAmount : targetPrice + pullbackAmount;

    const moveMs = CFG.totalTime * 1000 * 0.25;
    const holdMs = CFG.holdTime * 1000;
    const pullbackMs = CFG.totalTime * 1000 * 0.25;

    beginEffect(lastCandle, startPrice, targetPrice, pullbackPrice, isUp, moveMs, holdMs, pullbackMs);
  });

  document.body.appendChild(box);

  // ========================================
  // 🎯 EFFECT ENGINE
  // ========================================
  function beginEffect(candle, startPrice, targetPrice, pullbackPrice, isUp, moveMs, holdMs, pullbackMs) {
    active = {
      time: candle.time, startPrice, targetPrice, pullbackPrice,
      moveMs, holdMs, pullbackMs, totalMs: moveMs + holdMs + pullbackMs,
      start: performance.now(), isUp,
      speedUp: CFG.speedUp, speedDown: CFG.speedDown, pullbackSpeed: CFG.pullbackSpeed,
      glitchLevel: CFG.glitch, wickSize: CFG.wick,
      lastGlitchTime: 0, glitchOffset: 0,
      runningHigh: startPrice, runningLow: startPrice,
      phase: "move",
    };

    setTimeout(() => {
      if (active && active.phase === "move") {
        active.phase = "hold";
        setStatus(`⏸ Hold ${CFG.holdTime}s`, "#38bdf8");
      }
    }, moveMs);

    setTimeout(() => {
      if (active && active.phase === "hold") {
        active.phase = "pullback";
        setStatus(`📉 Pullback...`, "#ef4444");
      }
    }, moveMs + holdMs);

    setTimeout(() => {
      if (active) {
        active.phase = "done";
        setStatus(`✅ Trade Won!`, "#22c55e");
        active = null;
      }
    }, moveMs + holdMs + pullbackMs + 300);
  }

  function computePrice(a, now) {
    const elapsed = now - a.start;
    let basePrice;

    if (elapsed < a.moveMs) {
      const t = Math.min(elapsed / a.moveMs, 1);
      const curve = a.isUp ? a.speedUp : a.speedDown;
      const eased = 1 - Math.pow(1 - t, curve);
      basePrice = a.startPrice + (a.targetPrice - a.startPrice) * eased;
    } else if (elapsed < a.moveMs + a.holdMs) {
      basePrice = a.targetPrice;
    } else if (elapsed < a.moveMs + a.holdMs + a.pullbackMs) {
      const t = (elapsed - a.moveMs - a.holdMs) / a.pullbackMs;
      const eased = 1 - Math.pow(1 - t, a.pullbackSpeed);
      basePrice = a.targetPrice + (a.pullbackPrice - a.targetPrice) * eased;
    } else {
      basePrice = a.pullbackPrice;
    }

    if ((a.phase === "move" || a.phase === "pullback") && a.glitchLevel > 0) {
      if (now - a.lastGlitchTime > (40 + Math.random() * 60)) {
        a.lastGlitchTime = now;
        const range = Math.abs(a.targetPrice - a.startPrice) * 0.08 * a.glitchLevel;
        const isBig = Math.random() < 0.1;
        a.glitchOffset = isBig ? (Math.random() - 0.5) * range * 2.5 : (Math.random() - 0.5) * range;
      }
      a.glitchOffset *= 0.85;
    }

    const price = basePrice + a.glitchOffset;

    if (a.wickSize > 0) {
      const wickDelta = Math.abs(a.targetPrice - a.startPrice) * 0.04 * a.wickSize;
      const wickRandom = Math.random() * wickDelta;
      a.runningHigh = Math.max(a.runningHigh, price + wickRandom);
      a.runningLow = Math.min(a.runningLow, price - wickRandom);
    } else {
      a.runningHigh = Math.max(a.runningHigh, price);
      a.runningLow = Math.min(a.runningLow, price);
    }

    return price;
  }

  function wrapped(...args) {
    if (!active) return original.apply(this, args);
    const candle = pm.candles?.at(-1);
    if (!candle || candle.time !== active.time) { active = null; return original.apply(this, args); }

    const now = performance.now();
    const value = computePrice(active, now);
    candle.exitValue = value;
    candle.minValue = Math.min(candle.enterValue, active.runningLow);
    candle.maxValue = Math.max(candle.enterValue, active.runningHigh);
    pm.currentValue = value;
    pm.targetValue = value;

    try { if (typeof plot.calculateMinMax === "function") plot.calculateMinMax(); } catch(e) {}
    return original.apply(this, args);
  }

  function close() {
    active = null;
    if (plot.drawElements === wrapped) {
      if (descriptor) Object.defineProperty(plot, "drawElements", descriptor);
      else delete plot.drawElements;
    }
    box.remove();
    if (window[KEY]?.close === close) delete window[KEY];
    console.log("⏹ " + BRAND.title + " closed");
  }

  plot.drawElements = wrapped;
  window[KEY] = { close };

  console.log("✅ " + BRAND.title + " ready");
  console.log("▶ Direction select karo (UP/DOWN) → Activate dabao");
})();
