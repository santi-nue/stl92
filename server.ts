// server.ts
import { serve } from "https://deno.land/std/http/server.ts";

const PORT = 8000;
const IMAGE_URL = "https://www.observatorioremoto.com/emadato/temperatura.jpg";

async function handleRequest(request: Request): Promise<Response> {
  if (request.url === "/image") {
    const response = await fetch(IMAGE_URL);
    const imageBlob = await response.blob();
    const imageArrayBuffer = await imageBlob.arrayBuffer();
    const imageUint8Array = new Uint8Array(imageArrayBuffer);

    return new Response(imageUint8Array, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": imageUint8Array.byteLength.toString(),
      },
    });
  }

  return new Response("Not Found", { status: 404 });
}

console.log(`Server running on http://localhost:${PORT}`);
await serve(handleRequest, { port: PORT });
