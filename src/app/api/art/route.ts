const MET_SEARCH = "https://collectionapi.metmuseum.org/public/collection/v1/search";
const MET_OBJECT = "https://collectionapi.metmuseum.org/public/collection/v1/objects";

const QUERIES = ["Christian", "Madonna", "Crucifixion", "religious", "saint", "Virgin"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const seed = searchParams.get("seed") ?? String(Date.now());
  const query = QUERIES[hash(seed) % QUERIES.length];

  try {
    const searchRes = await fetch(
      `${MET_SEARCH}?q=${encodeURIComponent(query)}&hasImages=true`,
      { next: { revalidate: 3600 } }
    );
    const searchData = (await searchRes.json()) as { objectIDs?: number[]; total?: number };
    const ids = searchData.objectIDs ?? [];
    if (ids.length === 0) return Response.json({ imageUrl: null, title: null });

    const index = hash(seed + "2") % ids.length;
    const objectRes = await fetch(`${MET_OBJECT}/${ids[index]}`);
    const obj = (await objectRes.json()) as {
      primaryImage?: string;
      title?: string;
      objectID?: number;
    };
    if (!obj.primaryImage) return Response.json({ imageUrl: null, title: obj.title ?? null });
    return Response.json({
      imageUrl: obj.primaryImage,
      title: obj.title ?? null,
      objectID: obj.objectID,
    });
  } catch (e) {
    console.error("MET API error", e);
    return Response.json({ imageUrl: null, title: null }, { status: 500 });
  }
}

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
