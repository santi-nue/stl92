import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  if (req.url === "/") {
    const imageUrl = "https://www.observatorioremoto.com/emadato/temperatura.jpg";
    const response = await fetch(imageUrl);
    const imageData = await response.arrayBuffer();
    return new Response(imageData, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  }
  return new Response("Not found", { status: 404 });
});
