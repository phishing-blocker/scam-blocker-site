/**
 * 福利厚生コードの引き換え（/redeem）で使う、クライアント側の部品。
 * 契約: resolver の docs/welfare-redeem.md（4.2 check、3 章 正規化）。
 * コードはログ・計測・外部送信に使わない（check 以外へ送らない）。
 * web repo の src/lib/redeem.ts と同じ振る舞い（同一ホストの相対パス固定）。
 */

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/** 全角を半角にし、大文字化し、空白・ハイフン類を除く（resolver と同じ規則）。 */
export function normalizeCode(raw: string): string {
  return raw
    .normalize("NFKC")
    .toUpperCase()
    .replace(/[\s\-‐-―−ー－]/g, "");
}

/** 12 文字で、使う文字だけなら XXXX-XXXX-XXXX の形にして返す。違えば null。 */
export function formatCode(raw: string): string | null {
  const c = normalizeCode(raw);
  if (c.length !== 12) return null;
  for (const ch of c) if (!ALPHABET.includes(ch)) return null;
  return `${c.slice(0, 4)}-${c.slice(4, 8)}-${c.slice(8)}`;
}

export type CheckResult =
  | { ok: true; campaignName: string; grantDays: number }
  | { ok: false; status: number; error: string; message: string; retryAfter?: number };

/** POST /api/welfare/redeem/check。権利は付かない・使用回数は減らない。 */
export async function checkCode(code: string): Promise<CheckResult> {
  try {
    const res = await fetch("/api/welfare/redeem/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
      cache: "no-store",
      referrerPolicy: "no-referrer",
    });
    const body = (await res.json().catch(() => null)) as Record<string, unknown> | null;
    if (res.ok && body && body.valid === true) {
      const campaign = body.campaign as { name?: unknown } | undefined;
      const days = Number(body.grantDays);
      if (typeof campaign?.name === "string" && Number.isFinite(days) && days > 0) {
        return { ok: true, campaignName: campaign.name, grantDays: days };
      }
    }
    const retry = Number(res.headers.get("Retry-After"));
    return {
      ok: false,
      status: res.status,
      error: typeof body?.error === "string" ? body.error : "unknown",
      message: typeof body?.message === "string" ? body.message : "確認できませんでした。",
      retryAfter: Number.isFinite(retry) && retry > 0 ? retry : undefined,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      error: "network",
      message: "通信できませんでした。電波のよいところで、もう一度お試しください。",
    };
  }
}
