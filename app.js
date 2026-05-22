// ═══════════════════════════════════════════════════
// 黄牛记账 - 共享应用核心
// 被 index.html（记账页）和 analysis.html（分析页）共同加载
// ═══════════════════════════════════════════════════

// ── 全局常量 ──
const TAGS = {
  expense: ['🍜 餐饮','🛒 购物','🚌 交通','🎬 娱乐','🏥 医疗','🎓 教育',
            '🏠 住房','👕 服装','💄 美容','📱 数码','💪 运动','🎁 礼品','💡 水电','📮 其他'],
  income:  ['💼 工资','💰 奖金','📦 兼职','🏦 理财','🎲 收益','🎁 礼收','💹 投资','📮 其他'],
};

const RECORD_ICONS = {
  '餐饮':'🍜','购物':'🛒','交通':'🚌','娱乐':'🎬','医疗':'🏥','教育':'🎓',
  '住房':'🏠','服装':'👕','美容':'💄','数码':'📱','运动':'💪','礼品':'🎁',
  '水电':'💡','工资':'💼','奖金':'💰','兼职':'📦','理财':'🏦','收益':'🎲',
  '礼收':'🎁','投资':'💹','其他':'📮',
};

const STORAGE_KEY    = 'huangniu_records_v2';
const APIKEY_STORAGE = 'huangniu_deepseek_key';
const DS_API_URL     = 'https://api.deepseek.com/chat/completions';

// ── 全局状态（两个页面共享，数据通过 localStorage 持久化）──
let records = [];

// ── 数据层 ──
function loadRecords() {
  try { records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { records = []; }
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function getApiKey() {
  // 优先读取浏览器本地存储（通过设置 UI 保存，安全不泄露）
  var localKey = localStorage.getItem(APIKEY_STORAGE);
  if (localKey && localKey.trim()) return localKey.trim();
  // 降级：兼容 config.js 中可能遗留的旧配置（不推荐）
  return (window.HUANGNIU_CONFIG?.deepseekApiKey || '').trim();
}

function setApiKey(k) {
  if (k) localStorage.setItem(APIKEY_STORAGE, k.trim());
  else localStorage.removeItem(APIKEY_STORAGE);
}

// ── 工具函数 ──
function showToast(msg, duration) {
  if (duration === undefined) duration = 2200;
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, duration);
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showHint(id, text) {
  var el = document.getElementById(id);
  if (!el) return;
  if (text) { el.textContent = text; el.classList.add('show'); }
  else el.classList.remove('show');
}

// ── 设置面板 ──
function updateApiStatusUI() {
  var localKey  = localStorage.getItem(APIKEY_STORAGE) || '';
  var configKey = (window.HUANGNIU_CONFIG?.deepseekApiKey || '').trim();
  var key       = localKey || configKey;
  var dot       = document.getElementById('apiStatusDot');
  var text      = document.getElementById('apiStatusText');
  if (!dot || !text) return;
  if (key) {
    dot.className  = 'status-dot ok';
    var source     = localKey ? '浏览器本地存储' : 'config.js 文件';
    text.textContent = '已配置 API Key（' + source + '，' + key.slice(0,6) + '\u2026' + key.slice(-4) + '），AI 解析已启用';
    var apiInput = document.getElementById('apiKeyInput');
    if (apiInput) apiInput.value = key;
  } else {
    dot.className  = 'status-dot empty';
    text.textContent = '未配置 DeepSeek API Key。请在此处输入 Key 并点击保存，或参考 config.example.js。';
  }
}

function updateAiBadge(active) {
  var badge = document.getElementById('aiBadge');
  if (!badge) return;
  if (active === undefined) active = !!getApiKey();
  badge.className = active ? 'ai-badge' : 'ai-badge inactive';
  badge.textContent = active ? '✦ AI' : '✦ AI';
}

// ── 抽屉（共享）──
function openDrawer(id, title) {
  if (id === 'entryDrawer' && title) {
    var titleEl = document.getElementById('drawerTitle');
    if (titleEl) titleEl.textContent = title;
  }
  var backdrop = document.getElementById('drawerBackdrop');
  if (backdrop) backdrop.classList.add('open');
  var drawer = document.getElementById(id);
  if (drawer) drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAllDrawers() {
  var backdrop = document.getElementById('drawerBackdrop');
  if (backdrop) backdrop.classList.remove('open');
  var drawers = document.querySelectorAll('.drawer');
  for (var i = 0; i < drawers.length; i++) {
    drawers[i].classList.remove('open');
  }
  document.body.style.overflow = '';
}

function closeDrawer(id) {
  var drawer = document.getElementById(id);
  if (drawer) drawer.classList.remove('open');
  var drawers = document.querySelectorAll('.drawer');
  var anyOpen = false;
  for (var i = 0; i < drawers.length; i++) {
    if (drawers[i].classList.contains('open')) { anyOpen = true; break; }
  }
  if (!anyOpen) {
    var backdrop = document.getElementById('drawerBackdrop');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ── 初始化共享组件（Header 设置按钮 + 设置抽屉事件）──
function initSharedComponents() {
  // 设置按钮（⚙）
  var settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', function () {
      openDrawer('settingsDrawer', '设置');
    });
  }

  // 设置抽屉关闭
  var settingsClose = document.getElementById('settingsClose');
  if (settingsClose) {
    settingsClose.addEventListener('click', function () {
      closeDrawer('settingsDrawer');
    });
  }

  // API Key 显示/隐藏
  var apiKeyToggle = document.getElementById('apiKeyToggle');
  if (apiKeyToggle) {
    apiKeyToggle.addEventListener('click', function () {
      var inp = document.getElementById('apiKeyInput');
      if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
    });
  }

  // 保存设置
  var btnSaveSettings = document.getElementById('btnSaveSettings');
  if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', function () {
      var inp = document.getElementById('apiKeyInput');
      var k = inp ? inp.value.trim() : '';
      setApiKey(k);
      updateApiStatusUI();
      updateAiBadge(!!k);
      showToast(k ? 'API Key 已保存，AI 解析已启用 \u2713' : '已清除 API Key');
      closeDrawer('settingsDrawer');
    });
  }

  // 抽屉遮罩点击关闭
  var backdrop = document.getElementById('drawerBackdrop');
  if (backdrop) {
    backdrop.addEventListener('click', function () {
      // 调用页面自定义的 onBackdropClick（如果存在）
      if (typeof onBackdropClick === 'function') {
        onBackdropClick();
      } else {
        closeAllDrawers();
      }
    });
  }
}
