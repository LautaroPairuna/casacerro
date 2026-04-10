import { NextResponse } from "next/server";

export const revalidate = 86400; // 24 horas

type GoogleReview = {
  rating: number;
  authorAttribution: { displayName: string };
  relativePublishTimeDescription: string;
  text?: { text: string };
};

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || apiKey === "TU_API_KEY_AQUI" || !placeId || placeId === "TU_PLACE_ID_AQUI") {
    return NextResponse.json({ reviews: [] }, { status: 200 });
  }

  const res = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "reviews",
      },
      next: { revalidate: 86400 },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ reviews: [] }, { status: 200 });
  }

  const data = await res.json();
  const raw: GoogleReview[] = data.reviews ?? [];

  const reviews = raw
    .filter((r) => r.text?.text)
    .map((r, i) => ({
      id: i + 1,
      platform: "google" as const,
      score: r.rating,
      author: r.authorAttribution.displayName,
      date: r.relativePublishTimeDescription,
      text: r.text!.text,
    }));

  return NextResponse.json({ reviews });
}
