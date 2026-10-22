"use client";

import { useMemo, useState } from "react";
import { RESTAURANTS } from "@absher/shared";
import { PREFILL_ORDER, type Prefill } from "./OrderComposer";

// Clicking a restaurant fills the order form with it as the pickup place.
function order(name: string) {
  const detail: Prefill = { category: "restaurant", pickup: name };
  window.dispatchEvent(new CustomEvent(PREFILL_ORDER, { detail }));
  document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  document.getElementById("order-details")?.focus({ preventScroll: true });
}

export default function Restaurants() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const t = q.trim();
    if (!t) return RESTAURANTS;
    return RESTAURANTS.filter((r) => (r.name + " " + r.kind + " " + (r.area ?? "")).includes(t));
  }, [q]);

  return (
    <>
      <input
        className="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="دوّر على مطعم أو نوع أكل..."
        aria-label="ابحث عن مطعم"
      />
      {list.length === 0 ? (
        <p className="note" style={{ marginTop: 12 }}>
          ما لقينا مطعم بهالاسم. جرّب كلمة ثانية، أو اكتب طلبك عالطول من فوق.
        </p>
      ) : (
        <div className="rest-list">
          {list.map((r) => (
            <button key={r.name} className="rest" type="button" onClick={() => order(r.name)}>
              <b>{r.name}</b>
              <small>{r.kind}</small>
              {r.area && <span className="rest-area">{r.area}</span>}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
