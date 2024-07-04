import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { fetchItems } from '../../../services/itemService'; // Import the service

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const ALLOWED_IP = process.env.ALLOWED_IP;
const DEV_IP = process.env.DEV_IP;

// Function to get the client IP address
const getClientIp = (req: NextRequest) => {
  const xForwardedFor = req.headers.get('x-forwarded-for');
  // console.log(`xForwardedFor: ${JSON.stringify(req.headers)}`);
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map(ip => ip.trim());
    return ips[0]; // Return the first IP in the list
  }
  return req.ip;
};

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  // console.log(`Client IP: ${clientIp}`);

  // Validate the client IP address
  if (clientIp !== ALLOWED_IP && clientIp !== DEV_IP) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { query } = await request.json();
    
    // Fetch items using the service
    const items = await fetchItems();
    const itemsString = JSON.stringify(items);
    // console.log(`items from dataset: ${itemsString}`); // test response [{"id":1,"name":"TestItem","locationid":1,"quantity":0,"inotherobject":false,"otherobjectid":0},{"id":2,"name":"addItem","locationid":null,"quantity":0,"inotherobject":false,"otherobjectid":null}]
    const prompt = `Find the item "${query}" in the following dataset:\n\n${itemsString}\n\nIf found, include its details including location.`;

    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
    });

    const result = aiResponse.choices[0].message.content;
    // const result = {1:1}; // skip call openai to test
    console.log(`Result: ${result}`);

    return new NextResponse(JSON.stringify({ result }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new NextResponse('Error searching for item', { status: 500 });
  }
}
