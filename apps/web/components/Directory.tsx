"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MERCHANTS, MERCHANT_CATEGORIES, type MerchantCategory } from "@absher/shared";
import { whatsappLink } from "@absher/shared";

type Tab = MerchantCategory | "all";

export default function Directory() {
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const t = q.trim();
    return MERCHANTS.filter((m) => {
      if (tab !== "all" && m.category !== tab) return false;
      if (!t) return true;
      return (m.name + " " + m.kind + " " + (m.area ?? "")).includes(t);
    });
  }, [tab, q]);

  return (
    <>
      <div className="tabs" role="tablist" aria-label="أقسام المحلات">
        <button type="button" aria-selected={tab === "all"} onClick={() => setTab("all")}>
          الكل
        </button>
        {MERCHANT_CATEGORIES.map((c) => (
          <button key={c.key} type="button" aria-selected={tab === c.key} onClick={() => setTab(c.key)}>
            {c.label}
          </button>
        ))}
      </div>

      <input
        className="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="دوّر على محل أو نوع..."
        aria-label="ابحث عن محل"
      />

      {list.length === 0 ? (
        <div className="empty">
          <p>لسا ما في محلات بهالقسم. محلك؟ سجّله ويصير إله صفحة بمنيو.</p>
          <a
            className="btn btn-ink"
            href={whatsappLink("مرحبا ابشر، بدي أسجل محلي معكم وأضيف المنيو.")}
            target="_blank"
            rel="noopener"
          >
            سجّل محلك
          </a>
        </div>
      ) : (
        <div className="rest-list">
          {list.map((m) => (
            <Link key={m.slug} className="rest" href={`/m/${m.slug}`}>
              <b>{m.name}</b>
              <small>{m.kind}</small>
              {m.area && <span className="rest-area">{m.area}</span>}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
