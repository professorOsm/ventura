export type Locale = 'en' | 'ur';

export interface Translations {
  nav: {
    home: string;
    about: string;
    skills: string;
    projects: string;
    aiLab: string;
    contact: string;
    presentation: string;
    assistant: string;
  };
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    ctaProjects: string;
    ctaWork: string;
    ctaConnect: string;
    ctaAskAI: string;
    ctaLab: string;
    ctaGithub: string;
    technologies: string;
    robotHint: string;
  };
  about: {
    badge: string;
    headline: string;
    description: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
    card4Title: string;
    card4Desc: string;
  };
  skills: {
    badge: string;
    headline: string;
    description: string;
  };
  projects: {
    badge: string;
    headline: string;
    description: string;
    ctaLab: string;
    viewCaseStudy: string;
    viewOnGithub: string;
    githubProfile: string;
  };
  aiLab: {
    badge: string;
    headline: string;
    description: string;
  };
  contact: {
    badge: string;
    headline: string;
    description: string;
    emailLabel: string;
    locationLabel: string;
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailInputLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    sendButton: string;
    sendingButton: string;
    successTitle: string;
    successDesc: string;
    sendAnother: string;
  };
  footer: {
    role: string;
    backToTop: string;
  };
}

export const translations: Record<Locale, Translations> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      aiLab: 'AI Lab',
      contact: 'Contact',
      presentation: 'Presentation Walkthrough',
      assistant: 'AI Assistant'
    },
    hero: {
      badge: 'LLM ENGINEER · AI SYSTEMS',
      headline: "Engineering Intelligence. Building What's Next.",
      subheadline: 'Exploring LLMs, retrieval-augmented generation, AI agents, and intelligent applications through practical engineering.',
      ctaWork: 'Explore My Work',
      ctaConnect: "Let's Connect",
      ctaAskAI: 'Ask Ventura AI',
      ctaProjects: 'Explore My Work',
      ctaLab: 'Explore AI Lab',
      ctaGithub: 'GitHub',
      technologies: 'Technologies:',
      robotHint: 'Click robot to consult Ventura AI'
    },
    about: {
      badge: '02. ABOUT & PHILOSOPHY',
      headline: 'Engineering Practical Intelligence',
      description: 'I specialize in designing, constructing, benchmarking, and shipping resilient LLM applications that solve genuine operational challenges with high fidelity and verified grounding.',
      card1Title: 'Engineering Focus',
      card1Desc: 'Deterministic tool boundaries, cross-encoder reranking, schema validation with Pydantic, and speculative inference.',
      card2Title: 'Agent Systems',
      card2Desc: 'Directed acyclic state machines in LangGraph, idempotent execution logs, and human-in-the-loop review checkpoints.',
      card3Title: 'Local & Edge AI',
      card3Desc: 'Quantized GGUF models on workstation hardware, vLLM continuous batching, and air-gapped on-premises security.',
      card4Title: 'Continuous MLOps',
      card4Desc: 'Ragas retrieval evaluation, synthetic adversarial regression testing in CI/CD, and real latency/token cost tracking.'
    },
    skills: {
      badge: '03. SKILLS & CAPABILITIES',
      headline: 'Technical Domains & Stack',
      description: 'Validated engineering skills organized into practical, production-oriented domains.'
    },
    projects: {
      badge: '04. GITHUB & OPEN SOURCE',
      headline: 'Open Source & Engineering Projects',
      description: 'Explore the code, architecture, and engineering decisions behind my work.',
      ctaLab: 'Test Systems in AI Lab',
      viewCaseStudy: 'Case Study',
      viewOnGithub: 'View on GitHub',
      githubProfile: 'View GitHub Profile'
    },
    aiLab: {
      badge: '05. AI LAB · FUNCTIONAL DEMONSTRATIONS',
      headline: 'Interactive AI Engineering Laboratory',
      description: 'Test real retrieval pipelines, autonomous agent tool dispatch traces, local quantization benchmarks, and model evaluation matrices.'
    },
    contact: {
      badge: '06. INITIATION & CONTACT',
      headline: "Let's Build Something Intelligent.",
      description: 'Available for principal LLM engineering, enterprise RAG architectural reviews, autonomous agent deployments, and AI system consulting.',
      emailLabel: 'Direct Email',
      locationLabel: 'Tokyo · San Francisco · Remote Worldwide',
      formTitle: 'Project Inquiry Form',
      nameLabel: 'Your Name / Organization',
      namePlaceholder: 'e.g. Elena Rostova / Neural Systems Lab',
      emailInputLabel: 'Email Address',
      emailPlaceholder: 'e.g. elena@neuralsystems.ai',
      messageLabel: 'Inquiry or System Goals',
      messagePlaceholder: 'Describe your retrieval pipeline, agent graph, or LLM engineering objective...',
      sendButton: 'Send Message',
      sendingButton: 'Transmitting...',
      successTitle: 'Message Transmitted',
      successDesc: 'Thank you. Your project inquiry has been received. I will review your requirements and follow up promptly.',
      sendAnother: 'Send another message'
    },
    footer: {
      role: 'LLM Engineer Portfolio',
      backToTop: 'Back to Top ↑'
    }
  },
  ur: {
    nav: {
      home: 'مرکزی صفحہ',
      about: 'تعارف',
      skills: 'مہارتیں',
      projects: 'منصوبے',
      aiLab: 'اے آئی لیب',
      contact: 'رابطہ',
      presentation: 'پریزنٹیشن گائیڈ',
      assistant: 'اے آئی اسسٹنٹ'
    },
    hero: {
      badge: 'ایل ایل ایم انجینئر · اے آئی سسٹمز',
      headline: 'انجینئرنگ ذہانت۔ مستقبل کی تعمیر۔',
      subheadline: 'ایل ایل ایمز، ریٹریول آگمنٹڈ جنریشن، اے آئی ایجنٹس، اور عملی ذہین ایپلیکیشنز کی جدید انجینئرنگ۔',
      ctaWork: 'میرا کام دیکھیں',
      ctaConnect: 'رابطہ قائم کریں',
      ctaAskAI: 'وینٹورا اے آئی سے پوچھیں',
      ctaProjects: 'میرا کام دیکھیں',
      ctaLab: 'اے آئی لیب آزمائیں',
      ctaGithub: 'گٹ ہب',
      technologies: 'اہم ٹیکنالوجیز:',
      robotHint: 'وینٹورا اے آئی سے بات کرنے کے لیے روبوٹ پر کلک کریں'
    },
    about: {
      badge: '۰۲. تعارف اور فلسفہ',
      headline: 'عملی ذہانت کی جدید انجینئرنگ',
      description: 'میں ایسے لچکدار اور قابلِ اعتماد ایل ایل ایم سسٹمز ڈیزائن کرنے کا ماہر ہوں جو حقیقی کاروباری چیلنجز کو اعلیٰ کارکردگی اور درستگی کے ساتھ حل کرتے ہیں۔',
      card1Title: 'انجینئرنگ کی بنیاد',
      card1Desc: 'مضبوط ٹول باؤنڈریز، کراس انکوڈر ری رینکنگ، اور پائیڈانٹک کے ساتھ اسکیما کی توثیق۔',
      card2Title: 'ایجنٹ سسٹمز',
      card2Desc: 'لینگ گراف میں ڈائریکٹڈ اسٹیٹ مشنری، محفوظ لاگز، اور انسانی جانچ کے فریم ورکس۔',
      card3Title: 'لوکل اور ایج اے آئی',
      card3Desc: 'ورک اسٹیشن ہارڈویئر پر کوانٹائزڈ ماڈلز، vLLM مسلسل بیچنگ، اور مکمل ڈیٹا پرائیویسی۔',
      card4Title: 'مسلسل ایم ایل اوپس',
      card4Desc: 'ریگاس ویلیوایشن، خودکار ریگریشن ٹیسٹنگ، اور لیٹنسی کی تفصیلی نگرانی۔'
    },
    skills: {
      badge: '۰۳. تکنیکی مہارتیں اور ڈومینز',
      headline: 'ٹیکنیکل اسٹیک اور صلاحیتیں',
      description: 'پروڈکشن کے لیے تیار کردہ اور تصدیق شدہ انجینئرنگ صلاحیتیں۔'
    },
    projects: {
      badge: '۰۴. گٹ ہب اور اوپن سورس',
      headline: 'اوپن سورس اور انجینئرنگ پروجیکٹس',
      description: 'میرے کام کے پیچھے کوڈ، فن تعمیر، اور انجینئرنگ فیصلوں کو دریافت کریں۔',
      ctaLab: 'اے آئی لیب میں جانچیں',
      viewCaseStudy: 'کیس اسٹڈی دیکھیں',
      viewOnGithub: 'گٹ ہب پر دیکھیں',
      githubProfile: 'گٹ ہب پروفائل دیکھیں'
    },
    aiLab: {
      badge: '۰۵. اے آئی لیب · لائیو ڈیموز',
      headline: 'انٹرایکٹو اے آئی انجینئرنگ لیبارٹری',
      description: 'حقیقی ریٹریول پائپ لائنز، ایجنٹ ٹول ایگزیکیوشن، اور ماڈل بینچ مارکس خود آزمائیں۔'
    },
    contact: {
      badge: '۰۶. رابطہ اور شروعات',
      headline: 'آئیے مل کر کچھ ذہین اور منفرد تخلیق کریں۔',
      description: 'پرنسپل ایل ایل ایم انجینئرنگ، انٹرپرائز آر اے جی جائزے، اور اے آئی کنسلٹنگ کے لیے دستیاب ہوں۔',
      emailLabel: 'براہ راست ای میل',
      locationLabel: 'ٹوکیو · سان فرانسسکو · عالمی ریموٹ',
      formTitle: 'پروجیکٹ انکوائری فارم',
      nameLabel: 'آپ کا نام یا ادارہ',
      namePlaceholder: 'مثال: علینہ رستووا / نیورل سسٹمز لیب',
      emailInputLabel: 'ای میل ایڈریس',
      emailPlaceholder: 'مثال: elena@neuralsystems.ai',
      messageLabel: 'پروجیکٹ کے اہداف اور ضروریات',
      messagePlaceholder: 'اپنے ریٹریول سسٹم، ایجنٹ گراف یا ایل ایل ایم ہدف کی تفصیل بیان کریں...',
      sendButton: 'پیغام بھیجیں',
      sendingButton: 'بھیجا جا رہا ہے...',
      successTitle: 'پیغام کامیابی سے موصول ہوا',
      successDesc: 'شکریہ! آپ کا پیغام موصول ہو چکا ہے۔ میں جلد تفصیلی جواب دوں گا۔',
      sendAnother: 'ایک اور پیغام بھیجیں'
    },
    footer: {
      role: 'ایل ایل ایم انجینئر پورٹ فولیو',
      backToTop: 'اوپر جائیں ↑'
    }
  }
};
