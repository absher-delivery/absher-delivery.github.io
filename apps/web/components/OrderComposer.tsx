"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ACCOUNTS,
  CATEGORIES,
  PAYMENT_METHODS,
  ZONES,
  buildOrderMessage,
  whatsappLink,
  type CategoryKey,
  type OrderDraft,
} from "@absher/shared";
import { supabase } from "@/lib/supabase";

const EMPTY: OrderDraft = {
  category: "restaurant",
  details: "",
  pickup: "",
  zone: ZONES[0],
  address: "",
  customerName: "",
  phone: "",
  payment: "cash",
};

// Category cards elsewhere on the page pick a category through this event.
export const PICK_CATEGORY = "absher:pick-category";

export default function OrderComposer() {
  const [order, setOrder] = useState<OrderDraft>(EMPTY);
  const [toast, setToast] = useState("");
  const message = useMemo(() => buildOrderMessage(order), [order]);
  const set = <K extends keyof OrderDraft>(k: K, v: OrderDraft[K]) => setOrder((o) => ({ ...o, [k]: v }));

  useEffect(() => {
    const onPick = (e: Event) => set("category", (e as CustomEvent<CategoryKey>).detail);
    window.addEventListener(PICK_CATEGORY, onPick);
    return () => window.removeEventListener(PICK_CATEGORY, onPick);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  async function send() {
    if (supabase) {
      // Best effort: WhatsApp stays the source of truth until the dashboard is live.
      await supabase.from("orders").insert({
        category: order.category,
        details: order.details,
        pickup: order.pickup,
        zone: order.zone,
        address: order.address,
        customer_name: order.customerName,
        phone: order.phone,
        payment: order.payment,
        source: "web",
      });
    }
  }

  function copy() {
    navigator.clipboard.writeText(message).then(
      () => setToast("انسخ الطلب، الصقه بواتساب ابشر"),
      () => setToast("ما زبط النسخ، انسخه يدوي"),
    );
  }

  return (
    <div className="composer">
      <div>
        <h2>اطلب أي إشي</h2>
        <p className="note">عبّي الطلب، وبنبعته جاهز على واتساب ابشر.</p>
        <div className="fields">
          <div>
            <span className="note">نوع الطلب</span>
            <div className="chips" role="group" aria-label="نوع الطلب">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  aria-pressed={order.category === c.key}
                  onClick={() => set("category", c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <label>
            شو بدك؟
            <textarea
              id="order-details"
              value={order.details}
              placeholder="2 شاورما عربي + 1 بطاطا كبيرة + 2 بيبسي"
              onChange={(e) => set("details", e.target.value)}
            />
          </label>
          <div className="row">
            <label>
              من وين؟
              <input value={order.pickup} placeholder="أي مطعم شاورما قريب" onChange={(e) => set("pickup", e.target.value)} />
            </label>
            <label>
              المنطقة
              <select value={order.zone} onChange={(e) => set("zone", e.target.value)}>
                {ZONES.map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            العنوان بالتفصيل
            <input value={order.address} placeholder="قرب دوار ...، عمارة ...، الطابق الثاني" onChange={(e) => set("address", e.target.value)} />
          </label>
          <div className="row">
            <label>
              الاسم
              <input value={order.customerName} autoComplete="name" onChange={(e) => set("customerName", e.target.value)} />
            </label>
            <label>
              رقم الموبايل
              <input value={order.phone} inputMode="tel" autoComplete="tel" placeholder="079xxxxxxx" onChange={(e) => set("phone", e.target.value)} />
            </label>
          </div>
          <label>
            الدفع
            <select value={order.payment} onChange={(e) => set("payment", e.target.value as OrderDraft["payment"])}>
              {PAYMENT_METHODS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="receipt" aria-live="polite">
        <span className="tag">رسالة الطلب</span>
        <pre>{message}</pre>
        <div className="actions">
          <a className="btn btn-wa" href={whatsappLink(message)} target="_blank" rel="noopener" onClick={send}>
            ابعت على واتساب
          </a>
          <button className="btn btn-ghost" type="button" onClick={copy}>
            انسخ الطلب
          </button>
        </div>
        <p className="note">
          واتساب ابشر: <bdi dir="ltr">{ACCOUNTS.whatsappDisplay}</bdi>
        </p>
      </div>
      <div className="toast" hidden={!toast}>
        {toast}
      </div>
    </div>
  );
}
