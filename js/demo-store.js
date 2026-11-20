(() => {
  "use strict";

  const DEMO_EMAIL = "teste@gmail.com";
  const DEMO_PASSWORD = "teste";
  const USERS_KEY = "ttfit.local.users.v1";
  const PROFILE_PREFIX = "ttfit.local.profile.";
  const SESSION_KEY = "ttfit.local.session.v1";
  const REMEMBER_KEY = "ttfit.local.remembered-email.v1";
  const PASSWORD_ITERATIONS = 100000;

  const DEMO_PROFILE = Object.freeze({
    name: "Camila Nunes",
    weight: 68.4,
    heightCm: 166,
    age: 28,
    focus: "Perda de peso",
    activity: "Moderada",
    exerciseDays: 4
  });

  function readStorage(storage, key) {
    try {
      return storage ? storage.getItem(key) : null;
    } catch (_error) {
      return null;
    }
  }

  function writeStorage(storage, key, value) {
    if (!storage) throw new Error("O armazenamento local não está disponível neste navegador.");
    try {
      storage.setItem(key, value);
    } catch (_error) {
      throw new Error("Não foi possível salvar os dados neste navegador. Verifique as permissões de armazenamento.");
    }
  }

  function removeStorage(storage, key) {
    try {
      if (storage) storage.removeItem(key);
    } catch (_error) {
      // A sessão continua sendo apenas demonstrativa se o navegador bloquear o armazenamento.
    }
  }

  function readJson(storage, key, fallback) {
    const raw = readStorage(storage, key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (_error) {
      return fallback;
    }
  }

  function readUsers() {
    const users = readJson(globalThis.localStorage, USERS_KEY, []);
    return Array.isArray(users) ? users : [];
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLocaleLowerCase("pt-BR");
  }

  function profileKey(email) {
    return PROFILE_PREFIX + normalizeEmail(email);
  }

  function initialProfile(name) {
    return {
      name: name || DEMO_PROFILE.name,
      weight: DEMO_PROFILE.weight,
      heightCm: DEMO_PROFILE.heightCm,
      age: DEMO_PROFILE.age,
      focus: DEMO_PROFILE.focus,
      activity: DEMO_PROFILE.activity,
      exerciseDays: DEMO_PROFILE.exerciseDays
    };
  }

  function cleanProfile(profile, fallbackName) {
    const focusOptions = ["Perda de peso", "Ganho de massa", "Manutenção"];
    const activityOptions = ["Leve", "Moderada", "Intensa"];
    const focus = String(profile.focus || DEMO_PROFILE.focus);
    const activity = String(profile.activity || DEMO_PROFILE.activity);
    return {
      name: String(profile.name || fallbackName || DEMO_PROFILE.name).trim().slice(0, 60),
      weight: Number(profile.weight),
      heightCm: Number(profile.heightCm),
      age: Number(profile.age),
      focus: focusOptions.includes(focus) ? focus : DEMO_PROFILE.focus,
      activity: activityOptions.includes(activity) ? activity : DEMO_PROFILE.activity,
      exerciseDays: Math.min(7, Math.max(0, Number(profile.exerciseDays) || 0))
    };
  }

  function currentEmail() {
    const activeEmail = readStorage(globalThis.sessionStorage, SESSION_KEY);
    if (activeEmail) return normalizeEmail(activeEmail);
    return normalizeEmail(readStorage(globalThis.localStorage, REMEMBER_KEY));
  }

  function setSession(email, remember) {
    const normalized = normalizeEmail(email);
    writeStorage(globalThis.sessionStorage, SESSION_KEY, normalized);
    if (remember) {
      writeStorage(globalThis.localStorage, REMEMBER_KEY, normalized);
    } else {
      removeStorage(globalThis.localStorage, REMEMBER_KEY);
    }
  }

  function getProfile(email) {
    const normalized = normalizeEmail(email);
    if (normalized === DEMO_EMAIL) {
      const saved = readJson(globalThis.localStorage, profileKey(normalized), null);
      return cleanProfile(saved || DEMO_PROFILE, DEMO_PROFILE.name);
    }
    const user = readUsers().find((item) => item.email === normalized);
    return cleanProfile(user && user.profile ? user.profile : initialProfile(user && user.name), user && user.name);
  }

  function getCurrentUser() {
    const email = currentEmail();
    if (!email) return null;
    if (email === DEMO_EMAIL) {
      const profile = getProfile(email);
      return { email, name: profile.name, isDemo: true };
    }
    const user = readUsers().find((item) => item.email === email);
    if (!user) {
      removeStorage(globalThis.sessionStorage, SESSION_KEY);
      removeStorage(globalThis.localStorage, REMEMBER_KEY);
      return null;
    }
    const profile = getProfile(email);
    return { email, name: profile.name || user.name, isDemo: false };
  }

  function saveProfile(email, profile) {
    const normalized = normalizeEmail(email);
    const cleaned = cleanProfile(profile, profile.name);
    if (normalized === DEMO_EMAIL) {
      writeStorage(globalThis.localStorage, profileKey(normalized), JSON.stringify(cleaned));
      return cleaned;
    }
    const users = readUsers();
    const index = users.findIndex((item) => item.email === normalized);
    if (index < 0) throw new Error("Não encontramos este perfil neste navegador.");
    users[index] = { ...users[index], name: cleaned.name, profile: cleaned };
    writeStorage(globalThis.localStorage, USERS_KEY, JSON.stringify(users));
    return cleaned;
  }

  function bytesToBase64(bytes) {
    let binary = "";
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return globalThis.btoa(binary);
  }

  function base64ToBytes(value) {
    return Uint8Array.from(globalThis.atob(value), (character) => character.charCodeAt(0));
  }

  async function hashPassword(password, saltBytes) {
    if (!globalThis.crypto || !globalThis.crypto.subtle) {
      throw new Error("Este navegador não oferece a proteção necessária para o cadastro local. Use a conta de apresentação.");
    }
    const key = await globalThis.crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const bits = await globalThis.crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: saltBytes, iterations: PASSWORD_ITERATIONS, hash: "SHA-256" },
      key,
      256
    );
    return new Uint8Array(bits);
  }

  async function signIn(email, password, remember) {
    const normalized = normalizeEmail(email);
    if (normalized === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setSession(normalized, remember);
      return { ok: true, isDemo: true };
    }

    const user = readUsers().find((item) => item.email === normalized);
    if (!user || !user.passwordSalt || !user.passwordHash) {
      return { ok: false, message: "E-mail ou senha não correspondem a uma conta deste navegador." };
    }

    try {
      const salt = base64ToBytes(user.passwordSalt);
      const candidate = bytesToBase64(await hashPassword(password, salt));
      if (candidate !== user.passwordHash) {
        return { ok: false, message: "E-mail ou senha não correspondem a uma conta deste navegador." };
      }
      setSession(normalized, remember);
      return { ok: true, isDemo: false };
    } catch (error) {
      return { ok: false, message: error.message || "Não foi possível validar o acesso neste navegador." };
    }
  }

  async function register(account) {
    const email = normalizeEmail(account.email);
    if (email === DEMO_EMAIL || readUsers().some((item) => item.email === email)) {
      return { ok: false, message: "Já existe um perfil local com este e-mail." };
    }
    if (!globalThis.crypto || !globalThis.crypto.subtle || !globalThis.crypto.getRandomValues) {
      return { ok: false, message: "Este navegador não oferece a proteção necessária para o cadastro local. Use a conta de apresentação." };
    }

    const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
    const passwordHash = bytesToBase64(await hashPassword(account.password, salt));
    const profile = cleanProfile(account.profile, account.name);
    const users = readUsers();
    users.push({
      email,
      name: profile.name,
      passwordSalt: bytesToBase64(salt),
      passwordHash,
      profile
    });
    writeStorage(globalThis.localStorage, USERS_KEY, JSON.stringify(users));
    setSession(email, false);
    return { ok: true, isDemo: false };
  }

  function logout() {
    removeStorage(globalThis.sessionStorage, SESSION_KEY);
    removeStorage(globalThis.localStorage, REMEMBER_KEY);
  }

  globalThis.TTFITDemoStore = Object.freeze({
    demoEmail: DEMO_EMAIL,
    demoPassword: DEMO_PASSWORD,
    signIn,
    register,
    getCurrentUser,
    getProfile,
    saveProfile,
    logout
  });
})();
