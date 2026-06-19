import { useState, useEffect, useCallback } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
// Replace with your Supabase project URL and anon key
const SUPABASE_URL = "https://swsjfeshfzpelmoebpbq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable__fXWbJvongvFb3asfqaAxQ_Mizv3CFs";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Blocked temp email domains (partial list)
const BLOCKED_DOMAINS = [
  "mailinator.com","tempmail.com","guerrillamail.com","10minutemail.com",
  "throwaway.email","yopmail.com","sharklasers.com","guerrillamailblock.com",
  "trashmail.com","dispostable.com","fakeinbox.com","maildrop.cc",
  "spamgourmet.com","spamgourmet.net","spamgourmet.org","tempr.email",
  "discard.email","mailnull.com","spamspot.com","spam4.me"
];

// ─── TRANSLATIONS ──────────────────────────────────────────────────────────────
const T = {
  en: {
    brand: "LetterDrop",
    tagline: "Cover letters that get replies",
    heroSub: "Fill your profile once. Generate tailored cover letters in seconds.",
    getStarted: "Get started free",
    signIn: "Sign in",
    signUp: "Sign up",
    signOut: "Sign out",
    email: "Email",
    password: "Password",
    name: "Full name",
    noAccount: "No account?",
    hasAccount: "Already have one?",
    verifyNotice: "Check your email to confirm your account.",
    profile: "My profile",
    generate: "Generate",
    history: "History",
    save: "Save",
    saving: "Saving...",
    saved: "Saved ✓",
    currentRole: "Current role / title",
    experience: "Experience summary",
    skills: "Key skills",
    education: "Education",
    profileHint: "Fill this in once — we'll use it for every letter.",
    jobTitle: "Job title",
    company: "Company name",
    extraNotes: "Extra notes (optional)",
    generateBtn: "Generate cover letter",
    generating: "Generating...",
    freeLeft: (n) => `${n} free letter${n !== 1 ? "s" : ""} remaining`,
    noFreeLeft: "No free letters left",
    copyBtn: "Copy",
    copied: "Copied!",
    historyEmpty: "No letters yet. Generate your first one!",
    deleteBtn: "Delete",
    plan_free: "Free",
    plan_single: "$4 / letter",
    plan_pro: "$9 / month",
    upgradeTitle: "Upgrade your plan",
    upgradeSub: "You've used your 2 free letters.",
    tempEmailBlocked: "Temporary email addresses are not allowed.",
    emailVerifyRequired: "Please verify your email before continuing.",
    profileIncomplete: "Complete your profile first.",
    errorOccurred: "Something went wrong. Try again.",
    lang: "Language",
    settings: "Settings",
    balance: "Balance",
    yourBalance: "Your balance",
    buyCredits: "Buy letters",
    subscribe: "Subscribe",
    theme: "Appearance",
    themeAuto: "Auto",
    themeLight: "Light",
    themeDark: "Dark",
    referralTitle: "Invite friends, get free letters",
    referralDesc: "Share your code — you both get 3 bonus letters when they sign up.",
    copyCode: "Copy code",
    faqTitle: "FAQ",
    contactTitle: "Contact",
    faq1q: "How does LetterDrop work?",
    faq1a: "Fill in your profile once with your experience and skills. Then enter a job title and company, and we generate a tailored cover letter using AI.",
    faq2q: "What happens after my free letters run out?",
    faq2a: "You can buy a letter pack or subscribe to the Pro plan for unlimited letters.",
    faq3q: "Can I edit a generated letter?",
    faq3a: "Yes — copy the text and edit it anywhere. We recommend a quick personal pass before sending.",
    faq4q: "Is my data safe?",
    faq4a: "Your profile and letters are private and only visible to you.",
    pack5: "5 letters", pack15: "15 letters", pack50: "50 letters",
    proPlan: "Pro — Unlimited",
    perMonth: "/ month",
  },
  ru: {
    brand: "LetterDrop",
    tagline: "Сопроводительные письма, на которые отвечают",
    heroSub: "Заполни профиль один раз. Генерируй письма под любую вакансию за секунды.",
    getStarted: "Начать бесплатно",
    signIn: "Войти",
    signUp: "Зарегистрироваться",
    signOut: "Выйти",
    email: "Email",
    password: "Пароль",
    name: "Полное имя",
    noAccount: "Нет аккаунта?",
    hasAccount: "Уже есть аккаунт?",
    verifyNotice: "Проверь почту и подтверди аккаунт.",
    profile: "Мой профиль",
    generate: "Генерация",
    history: "История",
    save: "Сохранить",
    saving: "Сохраняю...",
    saved: "Сохранено ✓",
    currentRole: "Текущая должность",
    experience: "Опыт работы",
    skills: "Ключевые навыки",
    education: "Образование",
    profileHint: "Заполни один раз — используем для каждого письма.",
    jobTitle: "Название вакансии",
    company: "Компания",
    extraNotes: "Доп. заметки (необязательно)",
    generateBtn: "Сгенерировать письмо",
    generating: "Генерирую...",
    freeLeft: (n) => `Осталось ${n} бесплатных писем`,
    noFreeLeft: "Бесплатные письма закончились",
    copyBtn: "Копировать",
    copied: "Скопировано!",
    historyEmpty: "Писем пока нет. Создай первое!",
    deleteBtn: "Удалить",
    plan_free: "Бесплатно",
    plan_single: "$4 за письмо",
    plan_pro: "$9 в месяц",
    upgradeTitle: "Улучши план",
    upgradeSub: "Ты использовал 2 бесплатных письма.",
    tempEmailBlocked: "Временные email-адреса не разрешены.",
    emailVerifyRequired: "Подтверди email перед продолжением.",
    profileIncomplete: "Сначала заполни профиль.",
    errorOccurred: "Что-то пошло не так. Попробуй снова.",
    lang: "Язык",
    settings: "Настройки",
    balance: "Баланс",
    yourBalance: "Твой баланс",
    buyCredits: "Купить письма",
    subscribe: "Оформить подписку",
    theme: "Оформление",
    themeAuto: "Авто",
    themeLight: "Светлая",
    themeDark: "Тёмная",
    referralTitle: "Приглашай друзей, получай письма бесплатно",
    referralDesc: "Поделись кодом — вы оба получите по 3 бонусных письма после регистрации друга.",
    copyCode: "Копировать код",
    faqTitle: "Частые вопросы",
    contactTitle: "Связаться с нами",
    faq1q: "Как работает LetterDrop?",
    faq1a: "Заполни профиль один раз — укажи опыт и навыки. Затем введи название вакансии и компанию, и мы сгенерируем письмо под них с помощью ИИ.",
    faq2q: "Что будет, когда закончатся бесплатные письма?",
    faq2a: "Можно купить пакет писем или оформить подписку Pro для безлимитной генерации.",
    faq3q: "Можно ли редактировать сгенерированное письмо?",
    faq3a: "Да — скопируй текст и отредактируй где угодно. Рекомендуем добавить личные штрихи перед отправкой.",
    faq4q: "Безопасны ли мои данные?",
    faq4a: "Твой профиль и письма приватны и видны только тебе.",
    pack5: "5 писем", pack15: "15 писем", pack50: "50 писем",
    proPlan: "Pro — Безлимит",
    perMonth: "/ месяц",
  },
  kz: {
    brand: "LetterDrop",
    tagline: "Жауап алатын мотивациялық хаттар",
    heroSub: "Профильді бір рет толтыр. Хаттарды секундта жаса.",
    getStarted: "Тегін бастау",
    signIn: "Кіру",
    signUp: "Тіркелу",
    signOut: "Шығу",
    email: "Email",
    password: "Құпия сөз",
    name: "Толық аты",
    noAccount: "Тіркелмедіңіз бе?",
    hasAccount: "Тіркелгені бар ма?",
    verifyNotice: "Аккаунтты растау үшін поштаңызды тексеріңіз.",
    profile: "Менің профилім",
    generate: "Жасау",
    history: "Тарих",
    save: "Сақтау",
    saving: "Сақталуда...",
    saved: "Сақталды ✓",
    currentRole: "Ағымдағы лауазым",
    experience: "Жұмыс тәжірибесі",
    skills: "Негізгі дағдылар",
    education: "Білім",
    profileHint: "Бір рет толтыр — әр хатта қолданамыз.",
    jobTitle: "Лауазым атауы",
    company: "Компания",
    extraNotes: "Қосымша ескертпелер (міндетті емес)",
    generateBtn: "Хат жасау",
    generating: "Жасалуда...",
    freeLeft: (n) => `${n} тегін хат қалды`,
    noFreeLeft: "Тегін хаттар бітті",
    copyBtn: "Көшіру",
    copied: "Көшірілді!",
    historyEmpty: "Хаттар жоқ. Бірінші хатты жаса!",
    deleteBtn: "Жою",
    plan_free: "Тегін",
    plan_single: "$4 / хат",
    plan_pro: "$9 / ай",
    upgradeTitle: "Жоспарды жаңарт",
    upgradeSub: "2 тегін хатты пайдаландыңыз.",
    tempEmailBlocked: "Уақытша email мекенжайларына рұқсат жоқ.",
    emailVerifyRequired: "Жалғастырмас бұрын emailді растаңыз.",
    profileIncomplete: "Алдымен профильді толтырыңыз.",
    errorOccurred: "Бірдеңе дұрыс болмады. Қайталаңыз.",
    lang: "Тіл",
    settings: "Параметрлер",
    balance: "Баланс",
    yourBalance: "Сіздің балансыңыз",
    buyCredits: "Хаттар сатып алу",
    subscribe: "Жазылу",
    theme: "Сыртқы түрі",
    themeAuto: "Авто",
    themeLight: "Жарық",
    themeDark: "Қараңғы",
    referralTitle: "Достарды шақыр, тегін хаттар ал",
    referralDesc: "Кодыңды бөліс — дос тіркелгенде екеуің де 3 бонустық хат аласыңдар.",
    copyCode: "Кодты көшіру",
    faqTitle: "Жиі қойылатын сұрақтар",
    contactTitle: "Байланыс",
    faq1q: "LetterDrop қалай жұмыс істейді?",
    faq1a: "Профильді бір рет толтыр — тәжірибең мен дағдыларыңды көрсет. Содан соң лауазым мен компанияны енгіз, біз ИИ көмегімен хат жасаймыз.",
    faq2q: "Тегін хаттар бітсе не болады?",
    faq2a: "Хаттар топтамасын сатып алуға немесе шексіз генерация үшін Pro жазылымын рәсімдеуге болады.",
    faq3q: "Жасалған хатты өңдеуге бола ма?",
    faq3a: "Иә — мәтінді көшіріп, кез келген жерде өңде. Жіберер алдында жеке штрихтар қосуды ұсынамыз.",
    faq4q: "Менің деректерім қауіпсіз бе?",
    faq4a: "Сенің профилің мен хаттарың жеке және тек саған көрінеді.",
    pack5: "5 хат", pack15: "15 хат", pack50: "50 хат",
    proPlan: "Pro — Шексіз",
    perMonth: "/ ай",
  }
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Inter:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0D0D0D; --paper: #F7F5F0; --accent: #C8F135;
    --mid: #6B6B6B; --border: #E0DDD7; --white: #FFFFFF;
    --danger: #E53E3E; --success: #38A169;
  }
  [data-theme="dark"] {
    --ink: #F2F2F0; --paper: #131313; --accent: #C8F135;
    --mid: #9A9A9A; --border: #2A2A2A; --white: #1C1C1C;
    --danger: #FF6B6B; --success: #4ADE80;
  }
  html { font-size: 16px; }
  body { background: var(--paper); color: var(--ink); font-family: 'Inter', sans-serif; line-height: 1.5; min-height: 100vh; transition: background 0.2s, color 0.2s; }

  /* NAV */
  .nav { display:flex; justify-content:space-between; align-items:center; padding:16px 40px; border-bottom:1px solid var(--border); background:var(--paper); position:sticky; top:0; z-index:100; }
  .nav-logo { font-family:'Syne',sans-serif; font-weight:800; font-size:1.15rem; letter-spacing:-0.03em; }
  .nav-logo span { background:var(--accent); padding:1px 5px; }
  .nav-right { display:flex; align-items:center; gap:12px; }
  .nav-lang { display:flex; gap:4px; }
  .lang-btn { background:none; border:1px solid var(--border); padding:4px 8px; font-size:0.75rem; cursor:pointer; font-family:'Inter',sans-serif; color:var(--mid); transition:all 0.15s; }
  .lang-btn.active { background:var(--ink); color:var(--white); border-color:var(--ink); }

  /* BUTTONS */
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:10px 20px; font-size:0.875rem; font-weight:500; cursor:pointer; font-family:'Inter',sans-serif; transition:all 0.15s; border:none; }
  .btn-primary { background:var(--ink); color:var(--white); }
  .btn-primary:hover { background:#333; }
  .btn-primary:disabled { opacity:0.5; cursor:not-allowed; }
  .btn-ghost { background:transparent; color:var(--ink); border:1.5px solid var(--border); }
  .btn-ghost:hover { border-color:var(--ink); }
  .btn-accent { background:var(--accent); color:var(--ink); font-weight:600; }
  .btn-accent:hover { opacity:0.85; }
  .btn-accent:disabled { opacity:0.5; cursor:not-allowed; }
  .btn-danger { background:transparent; color:var(--danger); border:1px solid var(--danger); padding:6px 12px; font-size:0.78rem; }
  .btn-sm { padding:6px 14px; font-size:0.8rem; }

  /* LAYOUT */
  .page { max-width:1100px; margin:0 auto; padding:48px 40px; }
  .page-narrow { max-width:560px; margin:0 auto; padding:80px 24px; }

  /* HERO */
  .hero { text-align:center; padding:100px 24px 80px; border-bottom:1px solid var(--border); }
  .hero-tag { display:inline-block; font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--mid); margin-bottom:20px; }
  .hero h1 { font-family:'Syne',sans-serif; font-weight:800; font-size:clamp(2.2rem,5vw,4rem); letter-spacing:-0.04em; line-height:1.05; margin-bottom:20px; }
  .hero h1 em { font-style:normal; background:var(--accent); padding:0 4px; }
  .hero p { font-size:1.05rem; color:var(--mid); max-width:440px; margin:0 auto 36px; line-height:1.7; }
  .hero-actions { display:flex; justify-content:center; gap:12px; flex-wrap:wrap; }

  /* AUTH */
  .auth-card { background:var(--white); border:1px solid var(--border); padding:40px; }
  .auth-card h2 { font-family:'Syne',sans-serif; font-weight:800; font-size:1.5rem; letter-spacing:-0.03em; margin-bottom:28px; }
  .form-group { margin-bottom:16px; }
  .form-group label { display:block; font-size:0.8rem; font-weight:500; color:var(--mid); margin-bottom:6px; text-transform:uppercase; letter-spacing:0.05em; }
  .form-input { width:100%; padding:11px 14px; font-size:0.9rem; border:1px solid var(--border); background:var(--paper); font-family:'Inter',sans-serif; color:var(--ink); outline:none; transition:border-color 0.2s; }
  .form-input:focus { border-color:var(--ink); }
  .form-input::placeholder { color:#aaa; }
  .auth-switch { margin-top:20px; font-size:0.85rem; color:var(--mid); }
  .auth-switch button { background:none; border:none; color:var(--ink); font-weight:600; cursor:pointer; text-decoration:underline; font-family:'Inter',sans-serif; }
  .notice { padding:12px 16px; font-size:0.85rem; margin-bottom:16px; }
  .notice-info { background:#EBF8FF; color:#2B6CB0; border:1px solid #BEE3F8; }
  .notice-error { background:#FFF5F5; color:var(--danger); border:1px solid #FED7D7; }
  .notice-success { background:#F0FFF4; color:var(--success); border:1px solid #C6F6D5; }

  /* TABS */
  .tabs { display:flex; border-bottom:1px solid var(--border); margin-bottom:36px; }
  .tab { padding:12px 24px; font-size:0.875rem; font-weight:500; cursor:pointer; background:none; border:none; border-bottom:2px solid transparent; color:var(--mid); font-family:'Inter',sans-serif; transition:all 0.15s; margin-bottom:-1px; }
  .tab.active { color:var(--ink); border-bottom-color:var(--ink); }

  /* PROFILE */
  .profile-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .form-group.full { grid-column:1/-1; }
  .form-textarea { width:100%; padding:11px 14px; font-size:0.9rem; border:1px solid var(--border); background:var(--paper); font-family:'Inter',sans-serif; color:var(--ink); outline:none; resize:vertical; min-height:100px; transition:border-color 0.2s; }
  .form-textarea:focus { border-color:var(--ink); }
  .profile-hint { font-size:0.8rem; color:var(--mid); margin-bottom:24px; padding:12px 16px; border-left:3px solid var(--accent); background:var(--white); }
  .save-row { display:flex; align-items:center; gap:12px; margin-top:24px; }

  /* GENERATE */
  .gen-layout { display:grid; grid-template-columns:1fr 1fr; gap:32px; align-items:start; }
  .gen-form { background:var(--white); border:1px solid var(--border); padding:28px; }
  .gen-form h3 { font-family:'Syne',sans-serif; font-weight:700; font-size:1.1rem; margin-bottom:20px; }
  .free-badge { display:inline-block; background:var(--accent); color:var(--ink); font-size:0.72rem; font-weight:700; padding:3px 8px; margin-bottom:16px; }
  .no-free-badge { display:inline-block; background:#FFF5F5; color:var(--danger); border:1px solid #FED7D7; font-size:0.72rem; font-weight:600; padding:3px 8px; margin-bottom:16px; }
  .gen-output { background:var(--white); border:1px solid var(--border); padding:28px; min-height:300px; }
  .gen-output h3 { font-family:'Syne',sans-serif; font-weight:700; font-size:1.1rem; margin-bottom:16px; }
  .output-text { font-size:0.875rem; line-height:1.8; color:var(--ink); white-space:pre-wrap; }
  .output-empty { color:var(--mid); font-size:0.875rem; }
  .output-actions { display:flex; gap:8px; margin-top:16px; padding-top:16px; border-top:1px solid var(--border); }
  .typing-cursor { display:inline-block; width:2px; height:14px; background:var(--ink); margin-left:1px; animation:blink 0.8s infinite; vertical-align:middle; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

  /* HISTORY */
  .history-list { display:flex; flex-direction:column; gap:16px; }
  .history-card { background:var(--white); border:1px solid var(--border); padding:24px; }
  .history-meta { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; }
  .history-title { font-family:'Syne',sans-serif; font-weight:700; font-size:1rem; }
  .history-date { font-size:0.75rem; color:var(--mid); }
  .history-company { font-size:0.8rem; color:var(--mid); margin-bottom:10px; }
  .history-preview { font-size:0.82rem; color:var(--mid); line-height:1.6; white-space:pre-wrap; max-height:80px; overflow:hidden; position:relative; }
  .history-preview::after { content:''; position:absolute; bottom:0; left:0; right:0; height:30px; background:linear-gradient(transparent, var(--white)); }
  .history-actions { display:flex; gap:8px; margin-top:12px; }

  /* UPGRADE */
  .upgrade-banner { background:var(--ink); color:var(--paper); padding:32px; margin-bottom:32px; }
  .upgrade-banner h3 { font-family:'Syne',sans-serif; font-weight:800; font-size:1.3rem; margin-bottom:8px; }
  .upgrade-banner p { font-size:0.875rem; color:var(--mid); margin-bottom:20px; }
  .upgrade-plans { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .upgrade-plan { border:1px solid #333; padding:20px; cursor:pointer; transition:border-color 0.2s; }
  .upgrade-plan:hover { border-color:var(--accent); }
  .upgrade-plan .price { font-family:'Syne',sans-serif; font-weight:800; font-size:1.6rem; color:var(--paper); }
  .upgrade-plan .desc { font-size:0.78rem; color:#888; margin-top:4px; }

  /* BALANCE */
  .balance-bar { display:flex; align-items:center; justify-content:space-between; background:var(--white); border:1px solid var(--border); padding:18px 24px; margin-bottom:24px; }
  .balance-amount { font-family:'Syne',sans-serif; font-weight:800; font-size:1.6rem; letter-spacing:-0.02em; }
  .balance-label { font-size:0.72rem; letter-spacing:0.08em; text-transform:uppercase; color:var(--mid); margin-bottom:4px; }
  .balance-plan-badge { display:inline-block; background:var(--accent); color:var(--ink); font-size:0.7rem; font-weight:700; padding:3px 10px; margin-left:10px; vertical-align:middle; }

  /* SETTINGS */
  .settings-section { background:var(--white); border:1px solid var(--border); padding:28px; margin-bottom:24px; }
  .settings-section h3 { font-family:'Syne',sans-serif; font-weight:700; font-size:1.05rem; margin-bottom:18px; }
  .settings-row { display:flex; align-items:center; justify-content:space-between; padding:14px 0; border-bottom:1px solid var(--border); }
  .settings-row:last-child { border-bottom:none; }
  .settings-row-label { font-size:0.875rem; }
  .settings-row-desc { font-size:0.78rem; color:var(--mid); margin-top:2px; }

  .theme-toggle { display:flex; border:1px solid var(--border); }
  .theme-toggle button { padding:7px 14px; font-size:0.78rem; background:none; border:none; cursor:pointer; color:var(--mid); font-family:'Inter',sans-serif; border-right:1px solid var(--border); transition:all 0.15s; }
  .theme-toggle button:last-child { border-right:none; }
  .theme-toggle button.active { background:var(--ink); color:var(--paper); }

  .pricing-cards { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-top:16px; }
  .pricing-card { border:1px solid var(--border); padding:20px; text-align:center; cursor:pointer; transition:border-color 0.2s; }
  .pricing-card:hover { border-color:var(--ink); }
  .pricing-card .count { font-family:'Syne',sans-serif; font-weight:800; font-size:1.3rem; }
  .pricing-card .price { font-size:1.5rem; font-weight:700; font-family:'Syne',sans-serif; margin:6px 0; }
  .pricing-card .per { font-size:0.7rem; color:var(--mid); }
  .pricing-card.subscription { background:var(--ink); color:var(--paper); border-color:var(--ink); }
  .pricing-card.subscription .per { color:var(--mid); }

  .referral-box { background:var(--paper); border:1px dashed var(--border); padding:18px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
  .referral-code { font-family:'Syne',sans-serif; font-weight:700; font-size:1rem; letter-spacing:0.05em; }

  .faq-item { border-bottom:1px solid var(--border); padding:16px 0; }
  .faq-item:last-child { border-bottom:none; }
  .faq-q { font-size:0.9rem; font-weight:600; cursor:pointer; display:flex; justify-content:space-between; align-items:center; }
  .faq-a { font-size:0.85rem; color:var(--mid); margin-top:10px; line-height:1.7; }

  .contact-row { display:flex; align-items:center; gap:10px; font-size:0.875rem; padding:10px 0; }
  .contact-row a { color:var(--ink); text-decoration:underline; }

  @media (max-width:768px) {
    .nav { padding:12px 16px; }
    .page { padding:32px 16px; }
    .hero { padding:60px 16px 48px; }
    .gen-layout { grid-template-columns:1fr; }
    .profile-grid { grid-template-columns:1fr; }
    .upgrade-plans { grid-template-columns:1fr; }
    .pricing-cards { grid-template-columns:1fr 1fr; }
    .balance-bar { flex-direction:column; align-items:flex-start; gap:12px; }
  }
`;

// ─── UTILS ────────────────────────────────────────────────────────────────────
function isBlockedEmail(email) {
  const domain = email.split("@")[1]?.toLowerCase();
  return BLOCKED_DOMAINS.includes(domain);
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Nav({ user, lang, setLang, onSignOut, t }) {
  return (
    <nav className="nav">
      <div className="nav-logo">Letter<span>Drop</span></div>
      <div className="nav-right">
        <div className="nav-lang">
          {["en","ru","kz"].map(l => (
            <button key={l} className={`lang-btn${lang===l?" active":""}`} onClick={()=>setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        {user && (
          <button className="btn btn-ghost btn-sm" onClick={onSignOut}>{t.signOut}</button>
        )}
      </div>
    </nav>
  );
}

function Hero({ t, onGetStarted }) {
  return (
    <div className="hero">
      <span className="hero-tag">AI-powered · 30 sec</span>
      <h1>{t.tagline.split(" ").map((w,i) => i===2 ? <em key={i}>{w} </em> : w+" ")}</h1>
      <p>{t.heroSub}</p>
      <div className="hero-actions">
        <button className="btn btn-primary" onClick={()=>onGetStarted("signup")}>{t.getStarted}</button>
        <button className="btn btn-ghost" onClick={()=>onGetStarted("signin")}>{t.signIn}</button>
      </div>
    </div>
  );
}

function AuthForm({ mode, setMode, onAuth, t }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit() {
    setError(""); setNotice("");
    if (isBlockedEmail(email)) { setError(t.tempEmailBlocked); return; }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error: e } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name } }
        });
        if (e) throw e;
        setNotice(t.verifyNotice);
      } else {
        const { error: e } = await supabase.auth.signInWithPassword({ email, password });
        if (e) throw e;
        onAuth();
      }
    } catch(e) {
      setError(e.message);
    }
    setLoading(false);
  }

  return (
    <div className="page-narrow">
      <div className="auth-card">
        <h2>{mode === "signup" ? t.signUp : t.signIn}</h2>
        {error && <div className="notice notice-error">{error}</div>}
        {notice && <div className="notice notice-success">{notice}</div>}
        {mode === "signup" && (
          <div className="form-group">
            <label>{t.name}</label>
            <input className="form-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Alex Johnson" />
          </div>
        )}
        <div className="form-group">
          <label>{t.email}</label>
          <input className="form-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" />
        </div>
        <div className="form-group">
          <label>{t.password}</label>
          <div style={{position:"relative"}}>
            <input className="form-input" type={showPassword ? "text" : "password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleSubmit()} style={{paddingRight:"44px"}} />
            <button type="button" onClick={()=>setShowPassword(p=>!p)} style={{position:"absolute",right:"10px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",padding:"4px",color:"var(--mid)",fontSize:"0.9rem"}} aria-label="Toggle password visibility">
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        <button className="btn btn-primary" style={{width:"100%",padding:"14px"}} onClick={handleSubmit} disabled={loading}>
          {loading ? "..." : mode==="signup" ? t.signUp : t.signIn}
        </button>
        <div className="auth-switch">
          {mode==="signup" ? t.hasAccount : t.noAccount}{" "}
          <button onClick={()=>setMode(mode==="signup"?"signin":"signup")}>
            {mode==="signup" ? t.signIn : t.signUp}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ user, t }) {
  const [form, setForm] = useState({ full_name:"", current_role:"", experience:"", skills:"", education:"" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) setForm({ full_name: data.full_name||"", current_role: data.current_role||"", experience: data.experience||"", skills: data.skills||"", education: data.education||"" });
    }
    load();
  }, [user.id]);

  async function save() {
    setStatus("saving");
    await supabase.from("profiles").upsert({ id: user.id, ...form, updated_at: new Date().toISOString() });
    setStatus("saved");
    setTimeout(()=>setStatus(""),2000);
  }

  const f = (k) => ({ value: form[k], onChange: e => setForm(p=>({...p,[k]:e.target.value})) });

  return (
    <div>
      <div className="profile-hint">{t.profileHint}</div>
      <div className="profile-grid">
        <div className="form-group">
          <label>{t.name}</label>
          <input className="form-input" placeholder="Alex Johnson" {...f("full_name")} />
        </div>
        <div className="form-group">
          <label>{t.currentRole}</label>
          <input className="form-input" placeholder="Frontend Developer" {...f("current_role")} />
        </div>
        <div className="form-group full">
          <label>{t.experience}</label>
          <textarea className="form-textarea" placeholder="5 years in web development, worked at..." {...f("experience")} />
        </div>
        <div className="form-group full">
          <label>{t.skills}</label>
          <textarea className="form-textarea" style={{minHeight:"70px"}} placeholder="React, TypeScript, Node.js, SQL..." {...f("skills")} />
        </div>
        <div className="form-group full">
          <label>{t.education}</label>
          <input className="form-input" placeholder="B.Sc. Computer Science, MIT, 2019" {...f("education")} />
        </div>
      </div>
      <div className="save-row">
        <button className="btn btn-primary" onClick={save} disabled={status==="saving"}>
          {status==="saving" ? t.saving : t.save}
        </button>
        {status==="saved" && <span style={{color:"var(--success)",fontSize:"0.85rem"}}>{t.saved}</span>}
      </div>
    </div>
  );
}

function GenerateTab({ user, lang, t }) {
  const [profile, setProfile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [freeLeft, setFreeLeft] = useState(2);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(p);
      const { count } = await supabase.from("letters").select("id", {count:"exact"}).eq("user_id", user.id);
      setFreeLeft(Math.max(0, 2 - (count||0)));
    }
    load();
  }, [user.id]);

  async function generate() {
    if (!profile?.experience && !profile?.skills) { setError(t.profileIncomplete); return; }
    if (!jobTitle || !company) return;
    setLoading(true); setError(""); setOutput("");

    const langLabel = { en: "English", ru: "Russian", kz: "Kazakh" }[lang];
    const prompt = `Write a professional, concise cover letter in ${langLabel}.

Applicant profile:
- Name: ${profile.full_name || "the applicant"}
- Current role: ${profile.current_role || "N/A"}
- Experience: ${profile.experience}
- Skills: ${profile.skills}
- Education: ${profile.education || "N/A"}

Applying for: ${jobTitle} at ${company}
${notes ? `Additional notes: ${notes}` : ""}

Instructions:
- Write in first person
- Under 220 words
- Sound human, confident, specific
- Tailor to the company and role
- Do not include subject line or salutation — start with the opening paragraph
- Language: ${langLabel}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000, messages:[{role:"user",content:prompt}] })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || t.errorOccurred;

      // Typewriter
      let i = 0;
      const timer = setInterval(() => {
        setOutput(text.slice(0, i));
        i += 3;
        if (i > text.length) { setOutput(text); clearInterval(timer); }
      }, 16);

      // Save to history
      await supabase.from("letters").insert({ user_id: user.id, job_title: jobTitle, company, content: text, created_at: new Date().toISOString() });
      // Log as transaction even though free — for balance history visibility
      await supabase.from("transactions").insert({ user_id: user.id, type: "free_letter", amount: 0, description: `${jobTitle} @ ${company}` });
      setFreeLeft(p => Math.max(0, p-1));
    } catch(e) {
      setError(t.errorOccurred);
    }
    setLoading(false);
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  }

  const canGenerate = freeLeft > 0; // TODO: or has paid plan

  return (
    <div>
      {!canGenerate && (
        <div className="upgrade-banner">
          <h3>{t.upgradeTitle}</h3>
          <p>{t.upgradeSub}</p>
          <div className="upgrade-plans">
            <div className="upgrade-plan">
              <div className="price">{t.plan_single}</div>
              <div className="desc">1 letter</div>
            </div>
            <div className="upgrade-plan">
              <div className="price">{t.plan_pro}</div>
              <div className="desc">Unlimited</div>
            </div>
          </div>
        </div>
      )}
      <div className="gen-layout">
        <div className="gen-form">
          <h3>{t.generate}</h3>
          {canGenerate
            ? <div className="free-badge">{t.freeLeft(freeLeft)}</div>
            : <div className="no-free-badge">{t.noFreeLeft}</div>
          }
          {error && <div className="notice notice-error" style={{marginBottom:12}}>{error}</div>}
          <div className="form-group">
            <label>{t.jobTitle}</label>
            <input className="form-input" value={jobTitle} onChange={e=>setJobTitle(e.target.value)} placeholder="Product Designer" />
          </div>
          <div className="form-group">
            <label>{t.company}</label>
            <input className="form-input" value={company} onChange={e=>setCompany(e.target.value)} placeholder="Figma" />
          </div>
          <div className="form-group">
            <label>{t.extraNotes}</label>
            <textarea className="form-textarea" style={{minHeight:"70px"}} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="I saw this role on LinkedIn..." />
          </div>
          <button className="btn btn-accent" style={{width:"100%",padding:"14px"}} onClick={generate} disabled={loading||!canGenerate||!jobTitle||!company}>
            {loading ? t.generating : t.generateBtn}
          </button>
        </div>

        <div className="gen-output">
          <h3>Cover letter</h3>
          {output
            ? <>
                <div className="output-text">{output}{loading && <span className="typing-cursor"/>}</div>
                {!loading && (
                  <div className="output-actions">
                    <button className="btn btn-ghost btn-sm" onClick={copy}>{copied ? t.copied : t.copyBtn}</button>
                  </div>
                )}
              </>
            : <div className="output-empty">{t.historyEmpty.split("!")[0]}...</div>
          }
        </div>
      </div>
    </div>
  );
}

function HistoryTab({ user, t }) {
  const [letters, setLetters] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("letters").select("*").eq("user_id", user.id).order("created_at", {ascending:false});
      setLetters(data||[]);
    }
    load();
  }, [user.id]);

  async function del(id) {
    await supabase.from("letters").delete().eq("id", id);
    setLetters(p=>p.filter(l=>l.id!==id));
  }

  function copy(id, text) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(()=>setCopied(null),2000);
  }

  if (!letters.length) return <div style={{color:"var(--mid)",fontSize:"0.9rem"}}>{t.historyEmpty}</div>;

  return (
    <div className="history-list">
      {letters.map(l => (
        <div key={l.id} className="history-card">
          <div className="history-meta">
            <div>
              <div className="history-title">{l.job_title}</div>
              <div className="history-company">{l.company}</div>
            </div>
            <div className="history-date">{new Date(l.created_at).toLocaleDateString()}</div>
          </div>
          <div className="history-preview" style={expanded===l.id?{maxHeight:"none"}:{}}>
            {l.content}
          </div>
          <div className="history-actions">
            <button className="btn btn-ghost btn-sm" onClick={()=>setExpanded(expanded===l.id?null:l.id)}>
              {expanded===l.id?"↑":"↓"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={()=>copy(l.id,l.content)}>
              {copied===l.id ? t.copied : t.copyBtn}
            </button>
            <button className="btn btn-danger" onClick={()=>del(l.id)}>{t.deleteBtn}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SettingsTab({ user, profile, onProfileUpdate, theme, setTheme, t }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [copied, setCopied] = useState(false);

  async function changeTheme(value) {
    setTheme(value);
    await supabase.from("profiles").upsert({ id: user.id, theme_preference: value, updated_at: new Date().toISOString() });
  }

  function copyReferral() {
    const code = profile?.referral_code || "";
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  }

  const faqs = [
    [t.faq1q, t.faq1a],
    [t.faq2q, t.faq2a],
    [t.faq3q, t.faq3a],
    [t.faq4q, t.faq4a],
  ];

  return (
    <div>
      {/* Balance & Plan */}
      <div className="settings-section">
        <h3>{t.balance}</h3>
        <div className="balance-bar">
          <div>
            <div className="balance-label">{t.yourBalance}</div>
            <div className="balance-amount">
              ${(profile?.balance || 0).toFixed(2)}
              {profile?.plan === "pro" && <span className="balance-plan-badge">{t.proPlan}</span>}
            </div>
          </div>
        </div>
        <div className="pricing-cards">
          <div className="pricing-card">
            <div className="count">{t.pack5}</div>
            <div className="price">$4</div>
            <div className="per">$0.80 / letter</div>
          </div>
          <div className="pricing-card">
            <div className="count">{t.pack15}</div>
            <div className="price">$10</div>
            <div className="per">$0.67 / letter</div>
          </div>
          <div className="pricing-card">
            <div className="count">{t.pack50}</div>
            <div className="price">$25</div>
            <div className="per">$0.50 / letter</div>
          </div>
          <div className="pricing-card subscription">
            <div className="count">{t.proPlan}</div>
            <div className="price">$9</div>
            <div className="per">{t.perMonth}</div>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="settings-section">
        <h3>{t.theme}</h3>
        <div className="settings-row">
          <div className="settings-row-label">{t.theme}</div>
          <div className="theme-toggle">
            {[["auto",t.themeAuto],["light",t.themeLight],["dark",t.themeDark]].map(([k,v]) => (
              <button key={k} className={theme===k?"active":""} onClick={()=>changeTheme(k)}>{v}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Referral */}
      <div className="settings-section">
        <h3>{t.referralTitle}</h3>
        <p style={{fontSize:"0.85rem", color:"var(--mid)", marginBottom:"16px"}}>{t.referralDesc}</p>
        <div className="referral-box">
          <span className="referral-code">{profile?.referral_code || "—"}</span>
          <button className="btn btn-primary btn-sm" onClick={copyReferral}>{copied ? t.copied : t.copyCode}</button>
        </div>
      </div>

      {/* FAQ */}
      <div className="settings-section">
        <h3>{t.faqTitle}</h3>
        {faqs.map(([q,a], i) => (
          <div className="faq-item" key={i}>
            <div className="faq-q" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
              {q} <span>{openFaq===i ? "−" : "+"}</span>
            </div>
            {openFaq===i && <div className="faq-a">{a}</div>}
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="settings-section">
        <h3>{t.contactTitle}</h3>
        <div className="contact-row">✉️ <a href="mailto:support@letterdrop.app">support@letterdrop.app</a></div>
        <div className="contact-row">💬 <a href="https://t.me/letterdrop" target="_blank" rel="noreferrer">@letterdrop</a></div>
      </div>
    </div>
  );
}

function Dashboard({ user, lang, theme, setTheme, t }) {
  const [tab, setTab] = useState("generate");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
    }
    load();
  }, [user.id, tab]);

  return (
    <div className="page">
      <div className="tabs">
        {[["generate", t.generate], ["profile", t.profile], ["history", t.history], ["settings", t.settings]].map(([k,v]) => (
          <button key={k} className={`tab${tab===k?" active":""}`} onClick={()=>setTab(k)}>{v}</button>
        ))}
      </div>
      {tab === "profile" && <ProfileTab user={user} t={t} />}
      {tab === "generate" && <GenerateTab user={user} lang={lang} t={t} />}
      {tab === "history" && <HistoryTab user={user} t={t} />}
      {tab === "settings" && <SettingsTab user={user} profile={profile} theme={theme} setTheme={setTheme} t={t} />}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("ru");
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("hero"); // hero | signin | signup | dash
  const [authMode, setAuthMode] = useState("signup");
  const [theme, setTheme] = useState("auto");
  const t = T[lang];

  // Resolve "auto" theme based on system preference
  const resolvedTheme = theme === "auto"
    ? (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (theme !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => document.documentElement.setAttribute("data-theme", mq.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  useEffect(() => {
    supabase.auth.getSession().then(({data:{session}}) => {
      if (session?.user) {
        setUser(session.user);
        setScreen("dash");
        loadThemePreference(session.user.id);
      }
    });
    const { data:{subscription} } = supabase.auth.onAuthStateChange((_,session) => {
      if (session?.user) {
        setUser(session.user);
        setScreen("dash");
        loadThemePreference(session.user.id);
      } else {
        setUser(null);
        setScreen("hero");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadThemePreference(userId) {
    const { data } = await supabase.from("profiles").select("theme_preference").eq("id", userId).single();
    if (data?.theme_preference) setTheme(data.theme_preference);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  function goAuth(mode) {
    setAuthMode(mode);
    setScreen("auth");
  }

  return (
    <>
      <style>{styles}</style>
      <Nav user={user} lang={lang} setLang={setLang} onSignOut={signOut} t={t} />
      {screen === "hero" && <Hero t={t} onGetStarted={goAuth} />}
      {screen === "auth" && (
        <AuthForm mode={authMode} setMode={setAuthMode} onAuth={()=>setScreen("dash")} t={t} />
      )}
      {screen === "dash" && user && <Dashboard user={user} lang={lang} theme={theme} setTheme={setTheme} t={t} />}
    </>
  );
}
