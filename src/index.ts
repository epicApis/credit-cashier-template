import { renderHtml } from "./renderHtml";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Root: show first 3 rows (original behavior)
    if (request.method === "GET" && pathname === "/") {
      const stmt = env.DB.prepare("SELECT hex(Hash), Credit, hex(Migration), hex(Privilege) FROM Stock LIMIT 3");
      const { results } = await stmt.all();

      return new Response(renderHtml(JSON.stringify(results, null, 2)), {
        headers: { "content-type": "text/html" },
      });
    }

    // Add credit: GET /add?hash=...&credit=...
    if (request.method === "GET" && pathname === "/add") {
      const hash = url.searchParams.get("hash");
      const creditStr = url.searchParams.get("credit");

      if (!hash || !creditStr) {
        return new Response("Missing 'hash' or 'credit' query parameter", { status: 400 });
      }

      if (!/^[0-9a-fA-F]+$/.test(hash)) {
        return new Response("Invalid 'hash' (must be hex)", { status: 400 });
      }

      if (!/^-?\d+$/.test(creditStr)) {
        return new Response("Invalid 'credit' (must be integer)", { status: 400 });
      }

      const credit = parseInt(creditStr, 10);

      const stmt = env.DB.prepare(
        "UPDATE Stock SET Credit = Credit + ? WHERE upper(hex(Hash)) = upper(?)"
      );
      const bound = stmt.bind(credit, hash);
      const result = await bound.run();
      const changes = result?.meta?.changes ?? 0;

      return new Response(JSON.stringify({ updatedRows: changes }), {
        headers: { "content-type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
