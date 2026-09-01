import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flight Price Notifier 機價通知 — 設定航線與目標價，機票降價就通知你" },
      {
        name: "description",
        content:
          "Set a route and a target price — we email you the moment the fare drops. 台北出發熱門航線的機票降價通知。",
      },
      { property: "og:title", content: "Flight Price Notifier 機價通知" },
      {
        property: "og:description",
        content: "Set a route and a target price — we email you the moment the fare drops.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const ROUTES = [
  { to: "TYO", city: "東京", was: "NT$ 12,400", now: "NT$ 9,800", target: "NT$ 10,000", badge: "▼ 21% this week", hot: true },
  { to: "KIX", city: "大阪", was: "NT$ 11,800", now: "NT$ 10,200", target: "NT$ 10,500", badge: "▼ 14% this week", hot: true },
  { to: "ICN", city: "首爾", was: "NT$ 9,600", now: "NT$ 6,900", target: "NT$ 7,500", badge: "▼ 28% this week", hot: false },
  { to: "BKK", city: "曼谷", was: "NT$ 13,200", now: "NT$ 11,500", target: "NT$ 12,000", badge: "▼ 13% this week", hot: true },
];

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground animate-bob">
        <span className="font-display text-lg leading-none">✈</span>
      </div>
      <div className="leading-none">
        <p className="font-display text-[15px] font-semibold text-foreground">Flight Price Notifier</p>
        <p className="font-mono text-[11px] text-muted-foreground">機價通知</p>
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo />
          <Link
            to="/auth"
            className="rounded-full bg-sky/25 px-4 py-2 text-sm font-semibold text-foreground ring-1 ring-sky/40 transition hover:bg-sky/40"
          >
            Sign in / 登入
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute -top-10 -right-14 size-72 rounded-full bg-blossom/70 blur-2xl" />
          <div className="absolute top-28 -left-16 size-64 rounded-full bg-mint blur-2xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
            <div className="animate-slide">
              <span className="inline-flex items-center gap-2 rounded-full bg-mint px-3 py-1.5 text-xs font-semibold text-primary ring-1 ring-primary/20">
                <span className="size-2 animate-bob rounded-full bg-primary" /> Now watching 12 routes from TPE 桃園
              </span>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-balance text-foreground md:text-[3.25rem]">
                設定航線與目標價，
                <br className="hidden md:block" />
                機票降價就通知你
              </h1>
              <p className="mt-4 max-w-[40ch] text-lg font-medium text-pretty text-muted-foreground">
                Set a route and a target price — we email you the moment the fare drops.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/auth"
                  className="rounded-2xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
                >
                  Sign in / 登入
                </Link>
                <span className="text-sm font-semibold text-muted-foreground">已有 8,400+ 旅客在等價</span>
              </div>
            </div>

            <div className="relative animate-slide [animation-delay:120ms]">
              <div className="rounded-[28px] bg-white/90 p-5 ring-1 ring-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-lg font-semibold text-foreground">TPE → TYO 東京</p>
                    <p className="font-mono text-xs text-muted-foreground">Round trip · any date</p>
                  </div>
                  <span className="rounded-full bg-blossom px-3 py-1 text-xs font-bold text-accent">▼ 21%</span>
                </div>
                <div className="mt-4 flex items-end gap-3">
                  <span className="font-mono text-sm text-muted-foreground line-through">NT$ 12,400</span>
                  <span className="animate-flip font-mono text-3xl font-medium text-foreground [animation-delay:200ms]">
                    NT$ 9,800
                  </span>
                </div>
                <div className="relative mt-1 h-2 w-full overflow-hidden rounded-full bg-mint">
                  <div className="absolute inset-y-0 left-0 w-[80%] animate-wiggle rounded-full bg-primary" />
                  <div className="absolute top-1/2 left-[80%] -ml-2 size-4 -translate-y-1/2 rounded-full bg-sun ring-2 ring-white" />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Your target 你的目標價</span>
                  <span className="font-mono text-accent">NT$ 10,000</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 animate-pop rounded-2xl bg-white/95 px-4 py-3 shadow-lg ring-1 ring-border [animation-delay:350ms]">
                <p className="text-[11px] font-bold tracking-wide text-primary uppercase">Fare dropped 降價!</p>
                <p className="text-xs font-semibold text-foreground">We emailed you just now ✉</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-5 py-12">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">How it works · 使用方式</p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              { n: "1", bg: "bg-mint/60", ring: "ring-primary/20", text: "text-primary", title: "Set your route 設定航線", body: "Pick any city you fly out of 桃園 (TPE).", delay: "60ms" },
              { n: "2", bg: "bg-blossom/60", ring: "ring-accent/20", text: "text-accent", title: "Set a target 設定目標價", body: "Tell us the price that feels like a deal.", delay: "140ms" },
              { n: "3", bg: "bg-mint/60", ring: "ring-primary/20", text: "text-primary", title: "Get the email 收到通知", body: "We ping you the instant it drops below your line.", delay: "220ms" },
            ].map((s) => (
              <div key={s.n} className={`rounded-3xl ${s.bg} animate-slide p-6`} style={{ animationDelay: s.delay }}>
                <span className={`grid size-10 place-items-center rounded-full bg-white font-display font-semibold ${s.text} ring-1 ${s.ring}`}>
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1 text-sm font-medium text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Popular routes */}
        <section className="mx-auto max-w-6xl px-5 py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Popular from Taipei</p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">熱門航線 · 價格示例</h2>
            </div>
            <span className="hidden text-sm font-semibold text-muted-foreground sm:inline">Example fares 示例價格</span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROUTES.map((r) => (
              <div
                key={r.to}
                className="group rounded-3xl bg-white/90 p-5 ring-1 ring-border transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky/10"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl text-foreground">TPE → {r.to}</span>
                  <span className="text-xs font-bold text-muted-foreground">{r.city}</span>
                </div>
                <p className="mt-3 font-mono text-sm text-muted-foreground line-through">{r.was}</p>
                <p className="font-mono text-2xl font-medium text-primary">{r.now}</p>
                <div className="mt-3 flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Target 目標價</span>
                  <span className="font-mono text-accent">{r.target}</span>
                </div>
                <span
                  className={`mt-4 inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    r.hot ? "bg-mint text-primary" : "bg-blossom text-accent"
                  }`}
                >
                  {r.badge}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing + FAQ */}
        <section className="mx-auto max-w-6xl px-5 py-12">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[28px] bg-sky/15 p-7 ring-1 ring-sky/25">
              <p className="font-mono text-xs tracking-widest text-sky uppercase">Pricing 定價</p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">
                Start free, upgrade when you fly more
              </h3>
              <ul className="mt-4 space-y-2 text-sm font-semibold text-foreground">
                <li className="flex gap-2"><span className="text-primary">•</span> 2 routes + unlimited fare alerts 免費</li>
                <li className="flex gap-2"><span className="text-primary">•</span> Unlimited routes + price-history graphs 無上限</li>
                <li className="flex gap-2"><span className="text-primary">•</span> NT$ 120 / month · cancel anytime</li>
              </ul>
              <Link
                to="/auth"
                className="mt-5 inline-block rounded-2xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:-translate-y-0.5"
              >
                Sign in / 登入
              </Link>
            </div>
            <div className="rounded-[28px] bg-white/90 p-7 ring-1 ring-border">
              <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">FAQ 常見問題</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="font-display font-semibold text-foreground">How often do you check prices?</p>
                  <p className="text-sm font-medium text-muted-foreground">
                    We re-scan every 30 minutes, so a drop never slips past you.
                  </p>
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">Do you fly for me?</p>
                  <p className="text-sm font-medium text-muted-foreground">
                    No — we only watch and notify. Booking happens on the airline's site.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-8 border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-10 md:flex-row md:items-center">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <span className="font-display text-lg">✈</span>
            </div>
            <div className="leading-tight">
              <p className="font-display font-semibold text-foreground">Flight Price Notifier</p>
              <p className="text-xs font-medium text-muted-foreground">機價通知 · fare-drop alerts from 桃園</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-muted-foreground">
            <a href="#how" className="transition hover:text-foreground">How it works</a>
            <a href="#routes" className="transition hover:text-foreground">Popular routes</a>
            <a href="#pricing" className="transition hover:text-foreground">Pricing</a>
            <Link to="/auth" className="transition hover:text-foreground">Sign in / 登入</Link>
          </nav>
          <p className="text-xs font-medium text-muted-foreground">© 2026 Flight Price Notifier. Made for deal-hunters.</p>
        </div>
      </footer>
    </div>
  );
}
