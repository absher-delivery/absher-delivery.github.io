"use client";

import { useEffect, useRef, useState } from "react";
import { assistantAnswer, type CategoryKey } from "@absher/shared";
import { PREFILL_ORDER, type Prefill } from "./OrderComposer";

interface Msg {
  from: "bot" | "me";
  text: string;
  picks?: string[];
  category?: CategoryKey;
}

const HELLO: Msg = {
  from: "bot",
  text: "مرحبا! أنا مساعد ابشر 🤖 قلّي شو نفسك تاكل أو شو ناقص البيت، وأنا بساعدك تطلب.",
  picks: ["شاورما", "برجر", "دجاج", "مش عارف شو بدي"],
};

export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([HELLO]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  function ask(input: string) {
    const q = input.trim();
    if (!q) return;
    const a = assistantAnswer(q);
    setMsgs((m) => [...m, { from: "me", text: q }, { from: "bot", text: a.text, picks: a.picks, category: a.category }]);
    setText("");
  }

  // A pick either prefills the order (when it reads like a real item) or asks again.
  function choose(pick: string, category?: CategoryKey) {
    const looksLikeItem = pick.length > 6 || /[+\d]/.test(pick);
    if (category && looksLikeItem) {
      const detail: Prefill = { category, details: pick };
      window.dispatchEvent(new CustomEvent(PREFILL_ORDER, { detail }));
      setMsgs((m) => [...m, { from: "bot", text: "تمام 👍 عبّيتلك الطلب فوق، كمّل عنوانك واضغط ابعت." }]);
      document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
      document.getElementById("order-details")?.focus({ preventScroll: true });
      setOpen(false);
      return;
    }
    ask(pick);
  }

  return (
    <>
      <button
        className="asst-fab"
        type="button"
        aria-label="مساعد ابشر"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "✕" : "🤖"}
      </button>

      {open && (
        <div className="asst" role="dialog" aria-label="مساعد ابشر">
          <div className="asst-head">
            <span>مساعد ابشر</span>
            <button type="button" aria-label="إغلاق" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>
          <div className="asst-body">
            {msgs.map((m, i) => (
              <div key={i} className={"asst-row " + m.from}>
                <div className="bubble">{m.text}</div>
                {m.picks && m.picks.length > 0 && (
                  <div className="asst-picks">
                    {m.picks.map((p) => (
                      <button key={p} type="button" onClick={() => choose(p, m.category)}>
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form
            className="asst-input"
            onSubmit={(e) => {
              e.preventDefault();
              ask(text);
            }}
          >
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="اكتب شو بدك..." aria-label="رسالتك" />
            <button type="submit" aria-label="إرسال">
              ↑
            </button>
          </form>
        </div>
      )}
    </>
  );
}
