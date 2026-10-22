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

// Real delivery zones sent by the owner on 2026-10-13.
export const ZONES: string[] = [
  "العيادات",
  "دوار الصناعة وما حولها",
  "حنينا والرشاد",
  "الكولا",
  "حي الأزايدة",
  "دوار الطيارة",
  "بعد الطيارة والمهندسين",
  "الخطابية",
  "المأمونية (وسطى، شرقية)",
  "النديم وما حولها",
  "المخيم",
  "ماعين",
  "مديرية الشرطة",
  "الحي الشرقي",
  "المجمع",
  "سوق الجمعة ودوار أبو ركبة",
  "المقبرة الإسلامية",
  "الفيصلية المسجد الكبير",
  "الفيصلية بعد المسجد الكبير",
  "التيم الأول",
  "التيم أبو شريف",
  "نتل",
  "حوارة",
  "جلول",
  "منشية ماعين",
  "منجا",
];

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
  return [
    "طلب جديد من ابشر",
    "النوع: " + label(CATEGORIES, o.category),
    "الطلب: " + o.details.trim(),
    "من: " + o.pickup.trim(),
    "المنطقة: " + o.zone,
    "العنوان: " + o.address.trim(),
    "الاسم: " + o.customerName.trim(),
    "الموبايل: " + o.phone.trim(),
    "الدفع: " + label(PAYMENT_METHODS, o.payment),
  ].join("\n");
}

export const whatsappLink = (text?: string) =>
  "https://wa.me/" + ACCOUNTS.whatsapp + (text ? "?text=" + encodeURIComponent(text) : "");
