import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plane, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/alerts")({
  head: () => ({
    meta: [
      { title: "My alerts 我的通知 — Flight Price Notifier 機價通知" },
      { name: "description", content: "Manage your flight price alerts from Taipei." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AlertsPage,
});

const DESTINATIONS = [
  { code: "TYO", city: "東京 Tokyo" },
  { code: "KIX", city: "大阪 Osaka" },
  { code: "ICN", city: "首爾 Seoul" },
  { code: "BKK", city: "曼谷 Bangkok" },
  { code: "SIN", city: "新加坡 Singapore" },
  { code: "HKG", city: "香港 Hong Kong" },
  { code: "OKA", city: "沖繩 Okinawa" },
  { code: "MNL", city: "馬尼拉 Manila" },
  { code: "CEB", city: "宿霧 Cebu" },
  { code: "FUK", city: "福岡 Fukuoka" },
  { code: "CTS", city: "札幌 Sapporo" },
  { code: "PUS", city: "釜山 Busan" },
];

interface PriceAlert {
  id: string;
  user_id: string;
  origin: string;
  destination: string;
  destination_city: string;
  target_price: number;
  last_seen_price: number | null;
  active: boolean;
  created_at: string;
}

const fmt = (n: number) => `NT$ ${n.toLocaleString("en-US")}`;

function AlertsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [destination, setDestination] = useState("TYO");
  const [targetPrice, setTargetPrice] = useState("");

  const alertsQuery = useQuery({
    queryKey: ["price-alerts"],
    queryFn: async (): Promise<PriceAlert[]> => {
      const { data, error } = await supabase
        .from("price_alerts" as never)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as PriceAlert[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const price = parseInt(targetPrice.replace(/[^0-9]/g, ""), 10);
      if (!price || price <= 0) throw new Error("Enter a target price in NT$ 請輸入目標價");
      const dest = DESTINATIONS.find((d) => d.code === destination)!;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase.from("price_alerts" as never).insert({
        user_id: user.id,
        origin: "TPE",
        destination: dest.code,
        destination_city: dest.city,
        target_price: price,
      } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      setTargetPrice("");
      queryClient.invalidateQueries({ queryKey: ["price-alerts"] });
      toast.success("Alert created 已加入追蹤 ✈");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to add alert"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("price_alerts" as never).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["price-alerts"] }),
    onError: () => toast.error("Failed to delete"),
  });

  const toggleMutation = useMutation({
    mutationFn: async (alert: PriceAlert) => {
      const { error } = await supabase
        .from("price_alerts" as never)
        .update({ active: !alert.active } as never)
        .eq("id", alert.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["price-alerts"] }),
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const alerts = alertsQuery.data ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <span className="font-display text-lg leading-none">✈</span>
            </div>
            <div className="leading-none">
              <p className="font-display text-[15px] font-semibold">Flight Price Notifier</p>
              <p className="font-mono text-[11px] text-muted-foreground">機價通知</p>
            </div>
          </Link>
          <button
            onClick={handleSignOut}
            className="rounded-full bg-sky/25 px-4 py-2 text-sm font-semibold ring-1 ring-sky/40 transition hover:bg-sky/40"
          >
            Sign out / 登出
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="animate-slide">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">My alerts 我的通知</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Watching for your perfect fare 正在幫你等價
          </h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            We email you the moment a fare drops to or below your target price.
          </p>
        </div>

        {/* New alert form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addMutation.mutate();
          }}
          className="mt-8 grid animate-slide gap-4 rounded-[28px] bg-white/90 p-6 ring-1 ring-border [animation-delay:80ms] sm:grid-cols-[1fr_1fr_auto] sm:items-end"
        >
          <div>
            <label htmlFor="dest" className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
              Destination 目的地 (from TPE 桃園)
            </label>
            <select
              id="dest"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-ring"
            >
              {DESTINATIONS.map((d) => (
                <option key={d.code} value={d.code}>
                  TPE → {d.code} · {d.city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="target" className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
              Target price 目標價 (NT$)
            </label>
            <input
              id="target"
              inputMode="numeric"
              placeholder="e.g. 8000"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-2.5 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            <Plus className="size-4" /> Watch this route 開始追蹤
          </button>
        </form>

        {/* Alerts list */}
        <div className="mt-8 space-y-4">
          {alertsQuery.isLoading && (
            <div className="rounded-3xl bg-white/70 p-8 text-center text-sm font-semibold text-muted-foreground ring-1 ring-border">
              Loading your alerts…
            </div>
          )}

          {alertsQuery.isError && (
            <div className="rounded-3xl bg-blossom/60 p-8 text-center text-sm font-semibold text-accent ring-1 ring-accent/20">
              Couldn't load alerts. Please refresh.
            </div>
          )}

          {!alertsQuery.isLoading && !alertsQuery.isError && alerts.length === 0 && (
            <div className="rounded-[28px] bg-mint/60 p-10 text-center ring-1 ring-primary/20">
              <Plane className="mx-auto size-8 animate-bob text-primary" />
              <p className="mt-3 font-display text-lg font-semibold">No alerts yet 還沒有通知</p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                Set your first route above — we'll email you when the fare drops below your target.
              </p>
            </div>
          )}

          {alerts.map((a, i) => (
            <div
              key={a.id}
              className={`flex animate-slide flex-wrap items-center justify-between gap-4 rounded-3xl bg-white/90 p-5 ring-1 ring-border transition hover:-translate-y-0.5 hover:shadow-lg ${
                a.active ? "" : "opacity-60"
              }`}
              style={{ animationDelay: `${120 + i * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="grid size-11 place-items-center rounded-2xl bg-mint text-primary">
                  <Plane className="size-5" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold">
                    {a.origin} → {a.destination} <span className="text-sm text-muted-foreground">{a.destination_city}</span>
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    Round trip · {a.active ? "watching 追蹤中" : "paused 已暫停"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="text-right">
                  <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">Target 目標價</p>
                  <p className="font-mono text-xl font-medium text-accent">{fmt(a.target_price)}</p>
                </div>
                <button
                  onClick={() => toggleMutation.mutate(a)}
                  className="rounded-full bg-mint px-3.5 py-1.5 text-xs font-bold text-primary ring-1 ring-primary/20 transition hover:brightness-95"
                >
                  {a.active ? "Pause 暫停" : "Resume 繼續"}
                </button>
                <button
                  onClick={() => deleteMutation.mutate(a.id)}
                  aria-label="Delete alert"
                  className="grid size-9 place-items-center rounded-full bg-blossom text-accent ring-1 ring-accent/20 transition hover:brightness-95"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
