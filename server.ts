// server.ts
const IMAGE_URL = "https://www.observatorioremoto.com/emadato/temperatura.jpg";

Deno.serve(async (req: Request) => {
  if (req.url === "/image") {
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

  return new Response("Not any thing Found there", { status: 404 });
});

