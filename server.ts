import { parse } from "https://deno.land/std@0.181.0/encoding/csv.ts";
import { Zip } from "https://deno.land/x/zipjs/mod.ts";

interface Airline {
  code: string;
  name: string;
  alias: string;
  iata: string;
  icao: string;
  callsign: string;
  country: string;
}

async function processAirlines(): Promise<Uint8Array> {
  const zip = new Zip();
  const data = await Deno.readTextFile('airlines.csv');
  const result = await parse(data, {
    skipFirstRow: false,
    columns: ['code', 'name', 'alias', 'iata', 'icao', 'callsign', 'country'],
  }) as Airline[];

  for (const airline of result) {
    const imageUrl = `https://cdn.airnavradar.com/airlines/sq/${airline.code}.png`;
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const imageData = await response.arrayBuffer();
        zip.addFile(`${airline.code}.png`, new Uint8Array(imageData));
        console.log(`Added ${airline.code}.png to ZIP`);
      } else {
        console.log(`Failed to fetch image for ${airline.code}. Status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error fetching image for ${airline.code}:`, error);
    }
  }

  return await zip.generateAsync({ type: 'uint8array' });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'GET') {
    try {
      console.log("Processing airlines and generating ZIP...");
      const zipData = await processAirlines();
      console.log("ZIP file generated successfully");
      
      return new Response(zipData, {
        status: 200,
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": "attachment; filename=all.zip"
        }
      });
    } catch (error) {
      console.error("Error processing airlines:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  } else {
    return new Response("Method Not Allowed", { status: 405 });
  }
});



