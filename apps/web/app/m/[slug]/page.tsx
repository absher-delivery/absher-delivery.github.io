import Link from "next/link";
import { notFound } from "next/navigation";
import { MERCHANTS, merchantBySlug, whatsappLink } from "@absher/shared";
import { asset } from "@/lib/asset";

// One static page per merchant (static export needs the full list up front).
export function generateStaticParams() {
  return MERCHANTS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = merchantBySlug(slug);
  return { title: m ? `${m.name} — ابشر` : "ابشر مادبا" };
}

export default async function MerchantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = merchantBySlug(slug);
  if (!m) notFound();

  const logo = m.logo || asset("/logo.jpg");
  const waText = `مرحبا ابشر، بدي أطلب من ${m.name}:\n`;

  return (
    <main className="merchant">
      <div className="wrap">
        <Link className="back" href="/#restaurants">
          ← رجوع للمحلات
        </Link>

        <header className="m-head">
          <img src={logo} alt={`شعار ${m.name}`} />
          <div>
            <h1>{m.name}</h1>
            <p className="m-kind">{m.kind}</p>
            {m.area && <span className="rest-area">{m.area}</span>}
          </div>
        </header>

        {m.menu && m.menu.length > 0 ? (
          <div className="menu">
            <h2>المنيو</h2>
            {m.menu.map((it) => (
              <div key={it.name} className="menu-item">
                <div>
                  <b>{it.name}</b>
                  {it.desc && <small>{it.desc}</small>}
                </div>
                <div className="menu-right">
                  {typeof it.price === "number" && <span className="price">{it.price.toFixed(2)} د</span>}
                  <a
                    className="btn btn-wa"
                    href={whatsappLink(waText + "- " + it.name)}
                    target="_blank"
                    rel="noopener"
                  >
                    اطلب
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="note menu-empty">
            المنيو لسا ما انضاف لهذا المحل. تقدر تطلب عادي واكتب طلبك، أو إذا هذا محلك سجّله لنضيفلك المنيو.
          </p>
        )}

        <div className="m-actions">
          <a className="btn btn-wa" href={whatsappLink(waText)} target="_blank" rel="noopener">
            اطلب من {m.name} عبر واتساب
          </a>
          <Link className="btn btn-ink" href={`/?from=${m.slug}#order`}>
            اطلب من الموقع
          </Link>
        </div>
      </div>
    </main>
  );
}
