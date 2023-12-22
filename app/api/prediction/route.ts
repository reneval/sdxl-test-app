export async function POST(request: Request) {
  const req = await request.json()
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: "2b017d9b67edd2ee1401238df49d75da53c523f36e363881e057f5dc3ed3c5b2",
      input: { ...req }
    })
  });

  if (response.status !== 201) {
    let error = await response.json();
    return new Response(JSON.stringify({ detail: error.detail }), {
      status: 500
    });
  }

  const prediction = await response.json();
  return new Response(JSON.stringify(prediction), {
    status: 201
  });
}
