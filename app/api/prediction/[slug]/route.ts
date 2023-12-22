export const revalidate = 0
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const requestId = params.slug;
  const response = await fetch(
    "https://api.replicate.com/v1/predictions/" + requestId,
    {
      headers: {
        Authorization: `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
  if (response.status !== 200) {
    let error = await response.json();
    return new Response(JSON.stringify({ detail: error.detail }), {
      status: 500
    });
  }
  const prediction = await response.json();
  return new Response(JSON.stringify(prediction), {
    status: 200
  });
}
