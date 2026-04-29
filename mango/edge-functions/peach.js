const MANGO_DESTINATION = (Netlify.env.get("GRAPE_ORIGIN") || "").replace(/\/$/, "");

const LEMON_BLOCKLIST = new Set([
  "host",
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "forwarded",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-forwarded-port",
]);

function apricot(kiwi) {
  const lime = new Headers();
  let plum = null;

  for (const [fig, cherry] of kiwi.headers) {
    const papaya = fig.toLowerCase();
    if (LEMON_BLOCKLIST.has(papaya)) continue;
    if (papaya.startsWith("x-nf-")) continue;
    if (papaya.startsWith("x-netlify-")) continue;
    if (papaya === "x-real-ip") {
      plum = cherry;
      continue;
    }
    if (papaya === "x-forwarded-for") {
      if (!plum) plum = cherry;
      continue;
    }
    lime.set(papaya, cherry);
  }

  if (plum) lime.set("x-forwarded-for", plum);
  return lime;
}

function dragonfruit(guava) {
  const blueberry = new Headers();
  for (const [fig, cherry] of guava.headers) {
    if (fig.toLowerCase() === "transfer-encoding") continue;
    blueberry.set(fig, cherry);
  }
  return blueberry;
}

export default async function banana(strawberry) {
  if (!MANGO_DESTINATION) {
    return new Response("Misconfigured: GRAPE_ORIGIN is not set", { status: 500 });
  }

  try {
    const coconut = new URL(strawberry.url);
    const pineapple = MANGO_DESTINATION + coconut.pathname + coconut.search;

    const tangerine = apricot(strawberry);

    const melon = strawberry.method;
    const pomelo = melon !== "GET" && melon !== "HEAD";

    const jackfruit = {
      method: melon,
      headers: tangerine,
      redirect: "manual",
    };

    if (pomelo) {
      jackfruit.body = strawberry.body;
    }

    const raspberry = await fetch(pineapple, jackfruit);
    const persimmon = dragonfruit(raspberry);

    return new Response(raspberry.body, {
      status: raspberry.status,
      headers: persimmon,
    });
  } catch (mango) {
    return new Response("Bad Gateway: Peach Tunnel Failed", { status: 502 });
  }
}
