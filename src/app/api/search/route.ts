import OpenAI from 'openai';
import { GET as fetchItemsFunction } from '../items/route'; // Import the GET function
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const ALLOWED_IP = process.env.ALLOWED_IP;

// Function to get the client IP address
const getClientIp = (req: NextRequest) => {
  const xForwardedFor = req.headers.get('x-forwarded-for');
  console.log(`xForwardedFor: ${JSON.stringify(req.headers)}`);
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map(ip => ip.trim());
    return ips[0]; // Return the first IP in the list
  }
  return req.ip;
};

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  console.log(`Client IP: ${clientIp}`);

  // Validate the client IP address
  if (clientIp !== ALLOWED_IP) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { query } = await request.json();

    // console.log(`Searching for item: ${query}`);

    // Fetch items using the imported fetchItemsFunction directly
    const itemsResponse = await fetchItemsFunction();
    const items = await itemsResponse.json();
    // console.log(`itemsResponse from dataset: ${JSON.stringify(items)}`);

    const prompt = `Find the item "${query}" in the following dataset:\n\n${JSON.stringify(items)}\n\nIf found, include its details including location.`;

    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
    });

    const result = aiResponse.choices[0].message.content;
    // const result = {1:1}; // test

    return new NextResponse(JSON.stringify({ result }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new NextResponse('Error searching for item', { status: 500 });
  }
}
