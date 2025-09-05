const upper = document.getElementById('upper');
const lower = document.getElementById('lower');
const number = document.getElementById('number');
const symbol = document.getElementById('symbol');
const noRepeat = document.getElementById('no-repeat');
const noSeq = document.getElementById('no-seq');
const excludeAmbig = document.getElementById('exclude-ambig');
const pronounceable = document.getElementById('pronounceable');
const passphrase = document.getElementById('passphrase');
const output = document.getElementById('output');
const lengthInput = document.getElementById('length');
const lengthVal = document.getElementById('length-val');
const strengthText = document.getElementById('strength-text');
const strengthBar = document.getElementById('strength-bar');
const copyBtn = document.getElementById('copy');
const snackbar = document.getElementById('snackbar');
const toggleAdvBtn = document.getElementById('toggle-advanced');
const advancedOptions = document.getElementById('advanced');

const includeInput = document.getElementById('include-chars');
const excludeInput = document.getElementById('exclude-chars');
const patternInput = document.getElementById('pattern');

const ambiguousChars = 'l1I0O';

// Syllables for pronounceable password
const syllables = [
  'ba', 'be', 'bi', 'bo', 'bu',
  'ca', 'ce', 'ci', 'co', 'cu',
  'da', 'de', 'di', 'do', 'du',
  'fa', 'fe', 'fi', 'fo', 'fu',
  'ga', 'ge', 'gi', 'go', 'gu',
  'ha', 'he', 'hi', 'ho', 'hu',
  'ja', 'je', 'ji', 'jo', 'ju',
  'ka', 'ke', 'ki', 'ko', 'ku',
  'la', 'le', 'li', 'lo', 'lu',
  'ma', 'me', 'mi', 'mo', 'mu',
  'na', 'ne', 'ni', 'no', 'nu',
  'pa', 'pe', 'pi', 'po', 'pu',
  'ra', 're', 'ri', 'ro', 'ru',
  'sa', 'se', 'si', 'so', 'su',
  'ta', 'te', 'ti', 'to', 'tu',
  'va', 've', 'vi', 'vo', 'vu',
  'za', 'ze', 'zi', 'zo', 'zu'
];

// Word list for passphrase
const wordList = [
  "correct", "horse", "battery", "staple", "apple", "orange", "banana",
  "house", "river", "mountain", "blue", "green", "red", "yellow",
  "quick", "brown", "fox", "lazy", "dog", "jumped", "over", "moon",
  "light", "shadow", "forest", "cloud", "storm", "stone", "ocean",
  "silent", "wild", "bright", "night", "star", "sun", "wind",
  "tree", "grass", "flower", "earth", "sky", "rain", "snow", "fire",
  "water", "rock", "hill", "valley", "path", "road", "bridge", "gate",
  "dream", "wish", "hope", "magic", "spell", "sword", "shield", "armor",
  "knight", "dragon", "castle", "king", "queen", "throne", "crown",
  "happy", "funny", "strange", "quiet", "brave", "lucky", "clever",
  "fast", "slow", "high", "low", "lightning", "thunder", "glow",
  "spark", "flash", "charm", "grape", "melon", "berry", "peach", "lemon",
  "panda", "zebra", "whale", "tiger", "lion", "koala", "eagle", "falcon",
  "music", "rhythm", "note", "sound", "voice", "echo", "vibe"
];

lengthInput.addEventListener('input', () => {
  lengthVal.textContent = lengthInput.value;
  lengthInput.setAttribute('aria-valuenow', lengthInput.value);
});

toggleAdvBtn.addEventListener('click', () => {
  const isShown = advancedOptions.style.display === 'block';
  advancedOptions.style.display = isShown ? 'none' : 'block';
  toggleAdvBtn.textContent = isShown ? '▼ Show Advanced Settings' : '▲ Hide Advanced Settings';
  toggleAdvBtn.setAttribute('aria-expanded', !isShown);
  advancedOptions.setAttribute('aria-hidden', isShown);
});

// Pronounceable disables other char toggles and advanced inputs except passphrase
pronounceable.addEventListener('change', () => {
  const disable = pronounceable.checked;
  upper.disabled = disable;
  lower.disabled = disable;
  number.disabled = disable;
  symbol.disabled = disable;
  passphrase.disabled = disable;
  includeInput.disabled = disable;
  excludeInput.disabled = disable;
  patternInput.disabled = disable;
  noRepeat.disabled = disable;
  noSeq.disabled = disable;
  excludeAmbig.disabled = disable;
});

// Passphrase disables other char toggles and advanced inputs except pronounceable
passphrase.addEventListener('change', () => {
  const disable = passphrase.checked;
  upper.disabled = disable;
  lower.disabled = disable;
  number.disabled = disable;
  symbol.disabled = disable;
  pronounceable.disabled = disable;
  includeInput.disabled = disable;
  excludeInput.disabled = disable;
  patternInput.disabled = disable;
  noRepeat.disabled = disable;
  noSeq.disabled = disable;
  excludeAmbig.disabled = disable;
});

// Automatically regenerate password on any change
const generatorControls = document.querySelector('.generator');

if (generatorControls) {
  generatorControls.addEventListener('input', () => {
    generatePassword();
  });

  generatorControls.addEventListener('change', () => {
    generatePassword();
  });
}

// Copy button event
copyBtn.addEventListener('click', () => {
  if (!output.value) {
    showSnackbar('Generate a password first!');
    return;
  }

  navigator.clipboard.writeText(output.value).then(() => {
    // Change icon to ✅
    copyBtn.textContent = '✅';         // change to green tick
    copyBtn.disabled = true;           // disable the button
    copyBtn.classList.add('copied');   // optional: add a class for green background or styling
    showSnackbar('Password copied!');
  }).catch(() => {
    showSnackbar('Clipboard failed. Please copy manually.');
  });
});

function showSnackbar(message) {
  snackbar.textContent = message;
  snackbar.classList.add('show');

  setTimeout(() => {
    copyBtn.textContent = '📋';
    copyBtn.disabled = false;
    copyBtn.classList.remove('copied');
    snackbar.classList.remove('show');
  }, 3000);
}

function generatePassword() {
  const length = Math.min(parseInt(lengthInput.value, 10), 65);

  // Passphrase mode
  if (passphrase.checked) {
    const passphraseValue = generatePassphrase(length);
    updatePasswordOutput(passphraseValue);
    evaluateStrength(passphraseValue);
    return;
  }

  // Pattern mode
  if (patternInput.value.trim()) {
    const pwd = generatePatternPassword(patternInput.value.trim(), length);
    updatePasswordOutput(pwd);
    evaluateStrength(pwd);
    return;
  }

  // Pronounceable mode
  if (pronounceable.checked) {
    const pwd = generatePronounceable(length);
    updatePasswordOutput(pwd);
    evaluateStrength(pwd);
    return;
  }

  // Normal char pool mode
  let charPool = '';
  if (upper.checked) charPool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lower.checked) charPool += 'abcdefghijklmnopqrstuvwxyz';
  if (number.checked) charPool += '0123456789';
  if (symbol.checked) charPool += '!@#$%^&*()-_=+[]{}|;:,.<>?/`~';

  if (!charPool) {
    updatePasswordOutput('');
    strengthText.textContent = 'Please select at least one character type.';
    strengthBar.style.width = '0%';
    return;
  }

  // Exclude ambiguous chars
  if (excludeAmbig.checked) {
    charPool = charPool.split('').filter(c => !ambiguousChars.includes(c)).join('');
  }

  // Handle include/exclude chars
  const includeStr = includeInput.value || '';
  const excludeStr = excludeInput.value || '';
  const excludeSet = new Set(excludeStr.split(''));

  // Exclude chars removed from charPool
  charPool = charPool.split('').filter(c => !excludeSet.has(c)).join('');

  // Include chars filtered by exclusion (exclude has priority)
  const filteredIncludeStr = includeStr.split('').filter(c => !excludeSet.has(c)).join('');

  if (!charPool && filteredIncludeStr.length === 0) {
    updatePasswordOutput('');
    strengthText.textContent = 'Character pool empty after exclusions.';
    strengthBar.style.width = '0%';
    return;
  }

  // Start building password
  let password = '';
  let attempts = 0;
  const maxAttempts = length * 50;

  while (password.length < length && attempts < maxAttempts) {
    let char = charPool[Math.floor(Math.random() * charPool.length)];

    // noRepeat check
    if (noRepeat.checked && password.includes(char)) {
      attempts++;
      continue;
    }

    // noSeq check (detect if last 2 chars + new char are sequential)
    if (noSeq.checked && password.length >= 2) {
      const lastTwo = password.slice(-2);
      const seqForward = lastTwo + char;
      const seqBackward = char + lastTwo;

      if (isSequential(seqForward) || isSequential(seqBackward)) {
        attempts++;
        continue;
      }
    }

    password += char;
    attempts++;
  }

  // If password too short due to strict rules fallback
  if (password.length < length) {
    password = fallbackPassword(length, charPool);
  }

  // Insert included chars at random positions (if any)
  if (filteredIncludeStr.length > 0) {
    password = insertIncludeChars(password, filteredIncludeStr, length);
  }

  updatePasswordOutput(password.slice(0, length));
  evaluateStrength(password.slice(0, length));
}

function isSequential(str) {
  if (str.length < 3) return false;

  for (let i = 0; i < str.length - 2; i++) {
    let a = str.charCodeAt(i);
    let b = str.charCodeAt(i + 1);
    let c = str.charCodeAt(i + 2);
    if (b === a + 1 && c === b + 1) return true;
    if (b === a - 1 && c === b - 1) return true;
  }
  return false;
}

function fallbackPassword(len, pool) {
  let pwd = '';
  while (pwd.length < len) {
    pwd += pool[Math.floor(Math.random() * pool.length)];
  }
  return pwd;
}

function insertIncludeChars(password, includeChars, maxLength) {
  // Insert each char at a random position
  let pwdArr = password.split('');
  for (const char of includeChars) {
    let pos = Math.floor(Math.random() * (pwdArr.length + 1));
    pwdArr.splice(pos, 0, char);
  }
  // Trim if longer than maxLength
  if (pwdArr.length > maxLength) {
    pwdArr = pwdArr.slice(0, maxLength);
  }
  return pwdArr.join('');
}

// Pattern generator: L=letter, N=number, S=symbol, !=any char from pool, others literal
function generatePatternPassword(pattern, maxLength) {
  const letterPool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberPool = '0123456789';
  const symbolPool = '!@#$%^&*()-_=+[]{}|;:,.<>?/`~';
  const anyPool = letterPool + numberPool + symbolPool;

  let result = '';
  for (let i = 0; i < maxLength && i < pattern.length; i++) {
    const ch = pattern[i];
    let char = '';
    switch (ch) {
      case 'L':
        char = letterPool[Math.floor(Math.random() * letterPool.length)];
        break;
      case 'N':
        char = numberPool[Math.floor(Math.random() * numberPool.length)];
        break;
      case 'S':
        char = symbolPool[Math.floor(Math.random() * symbolPool.length)];
        break;
      case '!':
        char = anyPool[Math.floor(Math.random() * anyPool.length)];
        break;
      default:
        char = ch; // literal
    }
    result += char;
  }
  return result;
}

// Pronounceable password generator using syllables
function generatePronounceable(len) {
  let pwd = '';
  while (pwd.length < len) {
    const syll = syllables[Math.floor(Math.random() * syllables.length)];
    pwd += syll;
  }
  return pwd.slice(0, len);
}

// Passphrase generator - random words separated by space or dash
function generatePassphrase(wordCount) {
  let words = [];
  const count = Math.min(wordCount, 12); // limit max words to avoid very long passphrases
  for (let i = 0; i < count; i++) {
    const word = wordList[Math.floor(Math.random() * wordList.length)];
    words.push(word);
  }
  return words.join('-');
}

// Simple password strength estimator (based on length & variety)
function evaluateStrength(pwd) {
  if (!pwd) {
    strengthText.textContent = '';
    strengthBar.style.width = '0%';
    return;
  }
  let score = 0;
  if (pwd.length >= 8) score += 25;
  if (pwd.length >= 12) score += 25;
  if (/[A-Z]/.test(pwd)) score += 15;
  if (/[a-z]/.test(pwd)) score += 15;
  if (/[0-9]/.test(pwd)) score += 15;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 15;

  score = Math.min(score, 100);
  strengthBar.style.width = score + '%';

  if (score < 40) {
    strengthText.textContent = 'Weak';
    strengthBar.style.backgroundColor = '#e74c3c'; // red
  } else if (score < 70) {
    strengthText.textContent = 'Medium';
    strengthBar.style.backgroundColor = '#f1c40f'; // yellow
  } else {
    strengthText.textContent = 'Strong';
    strengthBar.style.backgroundColor = '#2ecc71'; // green
  }

  strengthText.textContent = 'Password Strength: ' + strengthText.textContent;

}

// Initial setup
lengthVal.textContent = lengthInput.value;
lengthInput.setAttribute('aria-valuenow', lengthInput.value);

document.querySelectorAll('.faq-item button').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    answer.style.display = expanded ? 'none' : 'block';
    answer.setAttribute('aria-hidden', expanded);
  });
});

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
// Load saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
}
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

function autoResizeTextarea(el) {
  el.style.height = 'auto'; // Reset height
  el.style.height = el.scrollHeight + 'px'; // Set new height
}

// Example: after generating a password
function updatePasswordOutput(pwd) {
  output.value = pwd;
  autoResizeTextarea(output);
}
