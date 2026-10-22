"use client";

import { CATEGORIES, type CategoryKey } from "@absher/shared";
import { PICK_CATEGORY } from "./OrderComposer";

const ICONS: Record<CategoryKey, React.ReactNode> = {
  restaurant: <path d="M4 3v8a3 3 0 0 0 6 0V3M7 3v18M17 3c-2 2-3 5-3 8h3v10" />,
  supermarket: (
    <>
      <path d="M3 4h2l2.4 11h10.2L20 7H6.2" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </>
  ),
  produce: (
    <>
      <path d="M12 7c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7Z" />
      <path d="M12 7c0-2 1-4 3-4M12 7c-1-2-3-3-5-3" />
    </>
  ),
  pharmacy: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M12 10v7M8.5 13.5h7" />
    </>
  ),
  parcel: (
    <>
      <path d="M3 8l9-5 9 5v8l-9 5-9-5Z" />
      <path d="M3 8l9 5 9-5M12 13v8" />
    </>
  ),
  office: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M8 7h2M14 7h2M8 11h2M14 11h2M10 21v-4h4v4" />
    </>
  ),
};

export default function CategoryCards() {
  function pick(key: CategoryKey) {
    window.dispatchEvent(new CustomEvent(PICK_CATEGORY, { detail: key }));
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
    document.getElementById("order-details")?.focus({ preventScroll: true });
  }

  return (
    <div className="cats">
      {CATEGORIES.map((c) => (
        <button key={c.key} className="cat" type="button" onClick={() => pick(c.key)}>
          <svg viewBox="0 0 24 24">{ICONS[c.key]}</svg>
          <b>{c.title}</b>
          <small>{c.description}</small>
        </button>
      ))}
    </div>
  );
}
