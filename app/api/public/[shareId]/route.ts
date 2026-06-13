import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 50;
const SHARE_ID_PATTERN = /^[a-z0-9-]{1,64}$/;

type FirestoreValue = {
  stringValue?: string;
  integerValue?: string;
};

type FirestoreDocument = {
  name?: string;
  fields?: Record<string, FirestoreValue>;
};

function getFirebaseRestConfig() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!projectId || !apiKey) {
    return null;
  }

  return {
    apiKey,
    documentsUrl: `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`,
  };
}

function readString(document: FirestoreDocument, field: string) {
  return document.fields?.[field]?.stringValue ?? "";
}

function readNumber(document: FirestoreDocument, field: string) {
  const value = document.fields?.[field]?.integerValue;
  return value ? Number(value) : 0;
}

function getDocumentId(document: FirestoreDocument) {
  return document.name?.split("/").pop() ?? "";
}

function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shareId: string }> },
) {
  const { shareId } = await context.params;

  if (!SHARE_ID_PATTERN.test(shareId)) {
    return withCors(NextResponse.json({ error: "Invalid share ID." }, { status: 400 }));
  }

  const firebase = getFirebaseRestConfig();
  if (!firebase) {
    return withCors(
      NextResponse.json({ error: "Firebase is not configured." }, { status: 503 }),
    );
  }

  const requestedLimit = Number(request.nextUrl.searchParams.get("limit") ?? DEFAULT_LIMIT);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(Math.trunc(requestedLimit), 1), MAX_LIMIT)
    : DEFAULT_LIMIT;
  const query = `key=${encodeURIComponent(firebase.apiKey)}`;
  const profileUrl = `${firebase.documentsUrl}/publicProfiles/${encodeURIComponent(shareId)}?${query}`;
  const whispersUrl =
    `${firebase.documentsUrl}/publicProfiles/${encodeURIComponent(shareId)}/whispers` +
    `?pageSize=${limit}&orderBy=${encodeURIComponent("createdAtMs desc")}&${query}`;

  try {
    const [profileResponse, whispersResponse] = await Promise.all([
      fetch(profileUrl, { cache: "no-store" }),
      fetch(whispersUrl, { cache: "no-store" }),
    ]);

    if (profileResponse.status === 404) {
      return withCors(NextResponse.json({ error: "Share not found." }, { status: 404 }));
    }

    if (!profileResponse.ok || !whispersResponse.ok) {
      return withCors(
        NextResponse.json({ error: "Failed to load public whispers." }, { status: 502 }),
      );
    }

    const profile = (await profileResponse.json()) as FirestoreDocument;
    const whispersPayload = (await whispersResponse.json()) as {
      documents?: FirestoreDocument[];
    };
    const whispers = (whispersPayload.documents ?? []).map((document) => ({
      id: getDocumentId(document),
      text: readString(document, "text"),
      createdAtMs: readNumber(document, "createdAtMs"),
      updatedAtMs: readNumber(document, "updatedAtMs"),
    }));

    const response = NextResponse.json({
      profile: {
        displayName: readString(profile, "displayName"),
        shareId,
      },
      whispers,
    });
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300",
    );
    return withCors(response);
  } catch {
    return withCors(
      NextResponse.json({ error: "Failed to load public whispers." }, { status: 502 }),
    );
  }
}
