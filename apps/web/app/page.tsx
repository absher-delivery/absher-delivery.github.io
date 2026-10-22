import { ACCOUNTS, ZONES, deliveryFeeText, whatsappLink } from "@absher/shared";
import OrderComposer from "@/components/OrderComposer";
import CategoryCards from "@/components/CategoryCards";
import Directory from "@/components/Directory";
import Assistant from "@/components/Assistant";
import { asset } from "@/lib/asset";

const LOGO = asset("/logo.jpg");

export default function Home() {
  return (
    <>
      <header className="top">
        <div className="wrap">
          <a className="brand" href="#top">
            <img src={LOGO} alt="" />
            <b>ابشر</b>
          </a>
          <nav aria-label="القائمة">
            <a href="#order">اطلب</a>
            <a href="#cats">الأقسام</a>
            <a href="#restaurants">المحلات</a>
            <a href="#partners">للمطاعم والمتاجر</a>
            <a href="#couriers">انضم كابتن</a>
            <a href="#app">التطبيق</a>
          </nav>
          <a className="btn btn-ink" href="#order">
            اطلب هلأ
          </a>
        </div>
      </header>

      <Assistant />

      <div className="hero" id="top">
        <div className="wrap">
          <div>
            <h1>
              بدك إشي بمادبا؟<span>قول ابشر، وبوصلك لباب البيت.</span>
            </h1>
            <p className="lead">
              أكل من مطعمك المفضل، أغراض السوبرماركت، خضرة الحسبة، دوا من الصيدلية، أو ورقة لازم توصل مكتب. أي إشي، من أي
              مكان بمادبا.
            </p>
            <div className="ctas">
              <a className="btn btn-ink" href="#order">
                اكتب طلبك
              </a>
              <a className="btn btn-ghost" href="#partners">
                سجّل مطعمك أو متجرك
              </a>
            </div>
            <div className="zones">
              <a href="#zones">
                <span>بنوصل لـ {ZONES.length} منطقة بمادبا وحواليها، شوف المناطق</span>
              </a>
            </div>
          </div>
          <div className="stamp">
            <img src={LOGO} alt="شعار ابشر لخدمات التوصيل" />
            <div className="badge">من الباب للباب</div>
          </div>
        </div>
      </div>

      <main>
        <div className="wrap" id="order">
          <OrderComposer />
        </div>

        <section id="cats">
          <div className="wrap">
            <div className="section-head">
              <h2>كل اللي بتحتاجه، بقسم واحد</h2>
              <p>اختار القسم وبتعبّى الطلب لحالها فوق.</p>
            </div>
            <CategoryCards />
          </div>
        </section>

        <section id="restaurants" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <h2>دليل محلات مادبا</h2>
              <p>مطاعم، صيدليات، سوبرماركت، خضار وأكثر. اضغط على المحل تشوف صفحته والمنيو. محلك مش موجود؟ سجّله.</p>
            </div>
            <Directory />
          </div>
        </section>

        <section id="zones" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <h2>مناطق التوصيل وأسعارها</h2>
              <p>السعر حسب المنطقة. منطقتك مش موجودة؟ ابعتلنا على واتساب ومنشوف.</p>
            </div>
            <div className="zone-list">
              {ZONES.map((z) => (
                <span key={z.name}>
                  {z.name}
                  <b>{deliveryFeeText(z.name)}</b>
                </span>
              ))}
            </div>
          </div>
        </section>

        <section style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <h2>كيف بتشتغل ابشر؟</h2>
            </div>
            <div className="steps">
              <div className="step">
                <h3>اطلب</h3>
                <p>من الموقع أو التطبيق أو واتساب. اكتب شو بدك ومن وين.</p>
              </div>
              <div className="step">
                <h3>بنأكد معك</h3>
                <p>بنرد عليك بالسعر ووقت الوصول قبل ما الكابتن يتحرك.</p>
              </div>
              <div className="step">
                <h3>بيوصلك</h3>
                <p>الكابتن بجيبلك الطلب لباب البيت، وبتدفع كاش أو كليك.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="partners" style={{ paddingTop: 0 }}>
          <div className="wrap split">
            <div className="panel dark">
              <span className="tag" style={{ alignSelf: "flex-start" }}>
                للمطاعم والمتاجر
              </span>
              <h2>خلّي محلك يوصل لكل بيت بمادبا</h2>
              <ul>
                <li>بدون ما تشغّل سواق أو تشتري سيارة.</li>
                <li>صفحة لمحلك على موقع وتطبيق ابشر.</li>
                <li>نصورلك منتجاتك وننزلها على صفحاتنا.</li>
                <li>تقرير أسبوعي بعدد الطلبات والمبيعات.</li>
              </ul>
              <a className="btn" href={whatsappLink("مرحبا ابشر، بدي أسجل محلي معكم.")} target="_blank" rel="noopener">
                سجّل محلك
              </a>
            </div>
            <div className="panel light" id="couriers">
              <span className="tag" style={{ alignSelf: "flex-start" }}>
                انضم كابتن
              </span>
              <h2>عندك موتور أو سيارة؟ اشتغل مع ابشر</h2>
              <ul>
                <li>دوام مرن، صباحي أو مسائي.</li>
                <li>دخل على كل توصيلة.</li>
                <li>طلبات من مادبا وحواليها.</li>
              </ul>
              <a
                className="btn btn-ink"
                href={whatsappLink("مرحبا ابشر، بدي أشتغل كابتن توصيل معكم.")}
                target="_blank"
                rel="noopener"
              >
                قدّم طلب
              </a>
            </div>
          </div>
        </section>

        <section id="app" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="app">
              <div>
                <span className="tag" style={{ background: "rgba(28,23,6,.12)", color: "var(--on-yellow)" }}>
                  قريباً
                </span>
                <h2 style={{ marginTop: 8 }}>تطبيق ابشر على أندرويد وآيفون</h2>
                <ul>
                  <li>تتبع الكابتن على الخريطة لحظة بلحظة.</li>
                  <li>عناوينك محفوظة، وإعادة الطلب بكبسة.</li>
                  <li>نقاط وخصومات للزباين الدايمين.</li>
                  <li>إشعار أول ما يطلع الطلب ولما يوصل.</li>
                </ul>
              </div>
              <div className="phone" aria-hidden="true">
                <div className="scr">
                  <b>ابشر</b>
                  <div className="bar" />
                  <div className="bar s" />
                  <div className="bar" />
                  <div className="track">الكابتن بالطريق، 12 دقيقة</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div>
            <a className="brand" href="#top" style={{ color: "#FFDB34" }}>
              <img src={LOGO} alt="" />
              <b>ابشر</b>
            </a>
            <p style={{ marginTop: 10 }}>ابشر لخدمات التوصيل، مادبا، الأردن. بنوصل كل إشي.</p>
            <p className="note" style={{ marginTop: 6 }}>
              <bdi dir="ltr">{ACCOUNTS.whatsappDisplay}</bdi>
            </p>
          </div>
          <div>
            <p style={{ marginBottom: 10, fontWeight: 700 }}>تابعنا وتواصل معنا</p>
            <div className="socials">
              <a href={whatsappLink()} target="_blank" rel="noopener">
                واتساب
              </a>
              <a href={ACCOUNTS.instagram} target="_blank" rel="noopener">
                إنستغرام
              </a>
              <a href={ACCOUNTS.facebook} target="_blank" rel="noopener">
                فيسبوك
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
