export async function POST(request: Request) {
  const requestJson = await request.json();

  const decode = (encoded: string) => {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8"));
  };

  const { header: encodedHeader, payload: encodedPayload } = requestJson;

  const headerData = decode(encodedHeader);
  const event = decode(encodedPayload);

  return Response.json({ headerData, event });
}