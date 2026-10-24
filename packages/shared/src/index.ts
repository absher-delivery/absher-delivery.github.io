// Shared business data and helpers for the Absher website and mobile app.

export const ACCOUNTS = {
  whatsapp: "962795350305",
  whatsappDisplay: "+962 79 535 0305",
  instagram: "https://instagram.com/absher.delivery_962",
  facebook: "https://www.facebook.com/share/1DM5xth5vP/",
} as const;

export type CategoryKey =
  | "restaurant"
  | "supermarket"
  | "produce"
  | "pharmacy"
  | "parcel"
  | "office";

export interface Category {
  key: CategoryKey;
  label: string;
  title: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { key: "restaurant", label: "مطعم", title: "مطاعم", description: "فطور، غدا، عشا، حلويات وقهوة" },
  { key: "supermarket", label: "سوبرماركت", title: "سوبرماركت", description: "أغراض البيت بدون ما تطلع" },
  { key: "produce", label: "خضار وفواكه", title: "خضار وفواكه", description: "طازة من الحسبة لمطبخك" },
  { key: "pharmacy", label: "صيدلية", title: "صيدليات", description: "أدوية وأغراض عناية" },
  { key: "parcel", label: "مشوار أو طرد", title: "مشاوير وطرود", description: "وصّل غرض من بيت لبيت" },
  { key: "office", label: "مكاتب", title: "مكاتب وشركات", description: "أوراق، معاملات، وطلبات الدوام" },
];

// Real delivery zones (sent by the owner 2026-10-13) with the delivery fee per zone in JOD.
// Fees come from the reference price list the owner shared on 2026-10-22; where a zone's
// fee depends on exactly where inside it, min and max differ and the site shows a range.
// Edit a number here and it changes on the website and the app together.
export interface Zone {
  name: string;
  min: number; // delivery fee in JOD, low end
  max: number; // delivery fee in JOD, high end (equals min for a fixed fee)
}

export const ZONES: Zone[] = [
  { name: "العيادات", min: 1, max: 1 },
  { name: "دوار الصناعة وما حولها", min: 1, max: 1 },
  { name: "حنينا والرشاد", min: 1, max: 1 },
  { name: "الكولا", min: 1.5, max: 1.5 },
  { name: "حي الأزايدة", min: 1, max: 1 },
  { name: "دوار الطيارة", min: 1, max: 1 },
  { name: "بعد الطيارة والمهندسين", min: 1.5, max: 1.5 },
  { name: "الخطابية", min: 2, max: 2 },
  { name: "المأمونية (وسطى، شرقية)", min: 2, max: 2 },
  { name: "النديم وما حولها", min: 1.5, max: 1.5 },
  { name: "المخيم", min: 1.5, max: 1.5 },
  { name: "ماعين", min: 3, max: 3 },
  { name: "مديرية الشرطة", min: 2, max: 2 },
  { name: "الحي الشرقي", min: 1, max: 1 },
  { name: "المجمع", min: 1, max: 1 },
  { name: "سوق الجمعة ودوار أبو ركبة", min: 1.5, max: 1.5 },
  { name: "المقبرة الإسلامية", min: 3, max: 3 },
  { name: "الفيصلية المسجد الكبير", min: 2, max: 2 },
  { name: "الفيصلية بعد المسجد الكبير", min: 2, max: 3 },
  { name: "التيم الأول", min: 1.5, max: 1.5 },
  { name: "التيم أبو شريف", min: 2, max: 2 },
  { name: "نتل", min: 4, max: 4 },
  { name: "حوارة", min: 3, max: 3 },
  { name: "جلول", min: 3, max: 3 },
  { name: "منشية ماعين", min: 4, max: 4 },
  { name: "منجا", min: 4, max: 4 },
];

export const ZONE_NAMES: string[] = ZONES.map((z) => z.name);

export const zoneByName = (name: string): Zone | undefined => ZONES.find((z) => z.name === name);

const money = (n: number) => n.toFixed(2);

// "1.00 د" for a fixed fee, "2.00 - 3.00 د" for a range.
export function deliveryFeeText(zoneName: string): string {
  const z = zoneByName(zoneName);
  if (!z) return "";
  return (z.min === z.max ? money(z.min) : money(z.min) + " - " + money(z.max)) + " د";
}

// Merchants directory: every shop Absher delivers from, grouped by category.
// Each merchant has its own page (logo + menu), so merchants here map 1:1 to pages.
// NOTE: seeded with a few real Madaba names as a starting point — the full, accurate
// directory is filled either from the Google Places API (needs a key) or as merchants
// register. Add a merchant here and its page is generated automatically.
export type MerchantCategory = "restaurant" | "pharmacy" | "supermarket" | "produce" | "other";

export const MERCHANT_CATEGORIES: { key: MerchantCategory; label: string }[] = [
  { key: "restaurant", label: "مطاعم" },
  { key: "pharmacy", label: "صيدليات" },
  { key: "supermarket", label: "سوبرماركت" },
  { key: "produce", label: "خضار وفواكه" },
  { key: "other", label: "محلات أخرى" },
];

// What order category a merchant maps to when the customer orders from it.
export const MERCHANT_TO_ORDER: Record<MerchantCategory, CategoryKey> = {
  restaurant: "restaurant",
  pharmacy: "pharmacy",
  supermarket: "supermarket",
  produce: "produce",
  other: "parcel",
};

export interface MenuItem {
  name: string;
  price?: number; // JOD
  desc?: string;
}

export interface Merchant {
  slug: string; // used in the page URL /m/<slug>
  name: string;
  category: MerchantCategory;
  kind: string; // short descriptor
  area?: string;
  phone?: string;
  logo?: string; // image path or URL; falls back to the Absher mark
  menu?: MenuItem[];
}

// Real Madaba restaurants Absher works with (list from Ayham, 2026-10-24).
// Only names are confirmed; menus, logos, areas and phones get added as each shop sends them.
export const MERCHANTS: Merchant[] = [
  { slug: "al-qarya", name: "القرية", category: "restaurant", kind: "مطعم" },
  { slug: "al-ghouta", name: "الغوطة", category: "restaurant", kind: "مطعم" },
  { slug: "mr-shawarma", name: "مستر شاورما", category: "restaurant", kind: "شاورما" },
  { slug: "zawiya", name: "زاوية", category: "restaurant", kind: "مطعم" },
  { slug: "mcdonalds", name: "ماكدونالدز", category: "restaurant", kind: "برغر ووجبات سريعة" },
  { slug: "sheroti", name: "شيروتي", category: "restaurant", kind: "مطعم" },
  { slug: "al-madaniya", name: "المدنية", category: "restaurant", kind: "مطعم" },
  { slug: "batmoun", name: "بتمون", category: "restaurant", kind: "مطعم" },
  { slug: "ahl-al-khair", name: "أهل الخير", category: "restaurant", kind: "مطعم" },
  { slug: "madrid", name: "مدريد", category: "restaurant", kind: "مطعم" },
  { slug: "fresco", name: "فريسكو", category: "restaurant", kind: "مطعم" },
  { slug: "al-qaisar", name: "القيصر", category: "restaurant", kind: "مطعم" },
  { slug: "dukkan-lahmeh", name: "دكان لحمة فحم وصاج", category: "restaurant", kind: "مشاوي فحم وصاج" },
  { slug: "js-supermarket", name: "جي جيز سوبرماركت", category: "supermarket", kind: "سوبرماركت وأغراض بيت", area: "طريق المطار" },
  { slug: "hyper-max", name: "هايبر ماكس", category: "supermarket", kind: "هايبرماركت", area: "مادبا" },
];

export const merchantBySlug = (slug: string): Merchant | undefined => MERCHANTS.find((m) => m.slug === slug);

export const merchantsByCategory = (c: MerchantCategory): Merchant[] => MERCHANTS.filter((m) => m.category === c);

export type PaymentMethod = "cash" | "cliq" | "wallet";

export const PAYMENT_METHODS: { key: PaymentMethod; label: string }[] = [
  { key: "cash", label: "كاش عند الاستلام" },
  { key: "cliq", label: "كليك CliQ" },
  { key: "wallet", label: "محفظة إلكترونية" },
];

export type OrderStatus =
  | "new"
  | "confirmed"
  | "picked_up"
  | "on_the_way"
  | "delivered"
  | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "طلب جديد",
  confirmed: "تم التأكيد",
  picked_up: "الكابتن استلم الطلب",
  on_the_way: "بالطريق",
  delivered: "وصل",
  cancelled: "ملغي",
};

export interface OrderDraft {
  category: CategoryKey;
  details: string;
  pickup: string;
  zone: string;
  address: string;
  customerName: string;
  phone: string;
  payment: PaymentMethod;
}

const label = <T extends { key: string; label: string }>(list: T[], key: string) =>
  list.find((x) => x.key === key)?.label ?? key;

export function buildOrderMessage(o: OrderDraft): string {
  const fee = deliveryFeeText(o.zone);
  return [
    "طلب جديد من ابشر",
    "النوع: " + label(CATEGORIES, o.category),
    "الطلب: " + o.details.trim(),
    "من: " + o.pickup.trim(),
    "المنطقة: " + o.zone,
    fee ? "رسوم التوصيل: " + fee : "",
    "العنوان: " + o.address.trim(),
    "الاسم: " + o.customerName.trim(),
    "الموبايل: " + o.phone.trim(),
    "الدفع: " + label(PAYMENT_METHODS, o.payment),
  ]
    .filter(Boolean)
    .join("\n");
}

export const whatsappLink = (text?: string) =>
  "https://wa.me/" + ACCOUNTS.whatsapp + (text ? "?text=" + encodeURIComponent(text) : "");

// --- Order assistant ---------------------------------------------------------
// A lightweight, offline helper that reads what the customer feels like and
// suggests what to order, then prefills the order form. It runs fully in the
// browser (no server, no API key), so it understands keywords rather than free
// conversation. A true AI assistant can be added later behind a small backend.

export interface Suggestion {
  keywords: string[];
  category: CategoryKey;
  reply: string;
  picks: string[]; // tappable ideas that prefill the "شو بدك؟" field
}

export const SUGGESTIONS: Suggestion[] = [
  {
    keywords: ["شاورما", "شاورمة", "عربي", "صاج"],
    category: "restaurant",
    reply: "الشاورما دايماً فكرة صح 😋 شو بتحب؟",
    picks: ["2 شاورما عربي + بطاطا + بيبسي", "شاورما دجاج صحن", "ساندويش شاورما لحمة"],
  },
  {
    keywords: ["برجر", "همبرجر", "برغر", "burger"],
    category: "restaurant",
    reply: "برجر؟ تمام، في كم خيار حلو:",
    picks: ["برجر دجاج + بطاطا", "برجر لحمة دبل + جبنة", "وجبة برجر عائلية"],
  },
  {
    keywords: ["دجاج", "بروست", "فراخ", "كنتاكي", "زنجر"],
    category: "restaurant",
    reply: "دجاج ومقرمش؟ جرّب هاي:",
    picks: ["بروست دجاج 8 قطع", "زنجر ساندويش", "دجاج مشوي كامل + أرز"],
  },
  {
    keywords: ["بيتزا", "pizza", "ايطالي", "إيطالي"],
    category: "restaurant",
    reply: "بيتزا؟ قلّي الحجم وبنظبطها:",
    picks: ["بيتزا خضار وسط", "بيتزا دجاج كبيرة", "بيتزا مشكّل فاميلي"],
  },
  {
    keywords: ["فطور", "مناقيش", "منقوشة", "زعتر", "لبنة", "صباح"],
    category: "restaurant",
    reply: "فطور الصبح؟ 🌞 شو رايك:",
    picks: ["مناقيش زعتر + جبنة", "فطور حمص وفول", "لبنة وزيتون وشاي"],
  },
  {
    keywords: ["منسف", "أكل بيتي", "اكل بيتي", "مقلوبة", "محشي", "مسخن"],
    category: "restaurant",
    reply: "أكل بيت على أصوله 🍚:",
    picks: ["منسف لحمة", "مقلوبة دجاج", "محاشي مشكّل"],
  },
  {
    keywords: ["حلو", "حلويات", "كنافة", "كنافه", "بقلاوة", "آيس كريم", "ايس كريم", "كيك"],
    category: "restaurant",
    reply: "شي حلو بعد الأكل؟ 🍮:",
    picks: ["كنافة نابلسية", "قطعة كيك شوكولاتة", "آيس كريم عائلي"],
  },
  {
    keywords: ["قهوة", "كوفي", "اسبريسو", "لاتيه", "كابتشينو", "شاي", "مشروب"],
    category: "restaurant",
    reply: "قهوة تنعش؟ ☕:",
    picks: ["قهوة مختصة لاتيه", "كابتشينو كبير", "قهوة عربية + ماء"],
  },
  {
    keywords: ["سوبرماركت", "اغراض", "أغراض", "بقالة", "دكان", "ماء", "مي", "غاز"],
    category: "supermarket",
    reply: "أغراض البيت بنجيبها 🛒 اكتب اللي ناقصك:",
    picks: ["خبز + بيض + حليب", "ربطة ماء + مناديل", "أغراض سندويش للمدرسة"],
  },
  {
    keywords: ["خضار", "خضرة", "فواكه", "فاكهة", "حسبة", "بندورة"],
    category: "produce",
    reply: "خضرة وفواكه طازة من الحسبة 🥬:",
    picks: ["خضار سلطة (بندورة، خيار، بقدونس)", "كيلو تفاح + موز", "خضار طبخ أسبوعي"],
  },
  {
    keywords: ["دوا", "دواء", "صيدلية", "صيدليه", "بنادول", "حبوب", "وصفة"],
    category: "pharmacy",
    reply: "من الصيدلية؟ 💊 اكتب الدوا أو صوّرلي الوصفة بالواتساب:",
    picks: ["بنادول + فيتامين سي", "أغراض عناية بالطفل", "كمامات ومعقم"],
  },
  {
    keywords: ["مشوار", "طرد", "توصيل", "غرض", "أوراق", "مكتب", "معاملة"],
    category: "parcel",
    reply: "مشوار أو طرد؟ 📦 قلّي من وين لوين:",
    picks: ["طرد من محل لبيت", "أوراق لمكتب حكومي", "غرض نسيته عند حدا"],
  },
];

export interface AssistantReply {
  text: string;
  category?: CategoryKey;
  picks: string[];
}

const POPULAR: AssistantReply = {
  text: "ولا يهمك، هاي أكثر إشي الناس بتطلبه بمادبا — اختار وبعبّيلك الطلب:",
  picks: ["شاورما عربي", "برجر دجاج", "بيتزا", "أغراض سوبرماركت"],
};

// Reads the customer's text and returns what to say plus tappable ideas.
export function assistantAnswer(input: string): AssistantReply {
  const t = (input || "").trim();
  if (!t) return { text: "مرحبا! أنا مساعد ابشر 🤖 شو نفسك تاكل أو شو بدك نجيبلك؟", picks: [] };

  if (/^(مرحبا|اهلا|أهلا|السلام|هاي|hi|hello|مساء|صباح)/i.test(t)) {
    return { text: "أهلين فيك! 😊 قلّي شو نفسك، أو شو ناقص البيت، وأنا بساعدك تطلب.", picks: [] };
  }

  const hit = SUGGESTIONS.find((s) => s.keywords.some((k) => t.includes(k)));
  if (hit) return { text: hit.reply, category: hit.category, picks: hit.picks };

  if (/(مش عارف|ما بعرف|شو في|اقترح|قترح|جوعان|جعان|نفسي|وجع)/.test(t)) return POPULAR;

  return {
    text: "ما زبطت أفهمها بالظبط 🤔 بس بقدر أساعدك — اختار إشي من هدول أو اكتب نوع الأكل:",
    picks: ["شاورما", "برجر", "دجاج", "بيتزا", "أغراض سوبرماركت"],
  };
}
