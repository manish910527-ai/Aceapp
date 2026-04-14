const APP_KEYS = {
  users: 'ace_users_v2',
  content: 'ace_content_v2',
  session: 'ace_session_v2',
  unlocked: 'ace_unlocked_v2'
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function seedData() {
  const users = readJSON(APP_KEYS.users, null);
  if (!users) {
    writeJSON(APP_KEYS.users, [
      { name: 'Admin', mobile: '9999999999', password: 'admin123', role: 'admin' }
    ]);
  }

  const content = readJSON(APP_KEYS.content, null);
  if (!content) {
    writeJSON(APP_KEYS.content, [
      {
        id: crypto.randomUUID(),
        type: 'test',
        title: 'Math Mock Test 1',
        access: 'free',
        price: 0,
        questions: [
          { q: '25 + 17 = ?', options: ['32', '42', '52', '41'], answer: 1 },
          { q: '9 x 8 = ?', options: ['72', '81', '64', '69'], answer: 0 }
        ]
      },
      {
        id: crypto.randomUUID(),
        type: 'video',
        title: 'Percentage Basics',
        access: 'free',
        price: 0,
        url: 'https://www.youtube.com/watch?v=QJtqk2A2Wg8'
      },
      {
        id: crypto.randomUUID(),
        type: 'pdf',
        title: 'Reasoning Notes',
        access: 'paid',
        price: 49,
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      }
    ]);
  }
}

function getUsers() { return readJSON(APP_KEYS.users, []); }
function getContent() { return readJSON(APP_KEYS.content, []); }
function setContent(items) { writeJSON(APP_KEYS.content, items); }

function getSession() { return readJSON(APP_KEYS.session, null); }
function setSession(data) { writeJSON(APP_KEYS.session, data); }
function logout() { localStorage.removeItem(APP_KEYS.session); window.location.href = 'login.html'; }

function ensureAuth(allowAdmin = false) {
  seedData();
  const session = getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  if (allowAdmin && session.role !== 'admin') {
    alert('Admin access only');
    window.location.href = 'dashboard.html';
    return null;
  }
  return session;
}

function isUnlocked(itemId) {
  const unlocked = readJSON(APP_KEYS.unlocked, {});
  return unlocked[itemId] === true;
}

function unlockItem(itemId) {
  const unlocked = readJSON(APP_KEYS.unlocked, {});
  unlocked[itemId] = true;
  writeJSON(APP_KEYS.unlocked, unlocked);
}

function requirePaymentOrOpen(item, openCb) {
  if (item.access === 'free' || isUnlocked(item.id)) {
    openCb();
    return;
  }
  localStorage.setItem('selectedItemId', item.id);
  localStorage.setItem('selectedItemName', item.title);
  localStorage.setItem('selectedItemPrice', String(item.price || 0));
  window.location.href = 'payment.html';
}

seedData();
