import { NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

export async function POST(req: Request) {
  try {
    const { prompt, size } = await req.json();
    const [width, height] = size.split('x').map(Number);

    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) {
      throw new Error('STABILITY_API_KEY is not set');
    }

    const formData = new FormData();
    formData.append('text_prompts[0][text]', prompt);
    formData.append('width', width.toString());
    formData.append('height', height.toString());
    formData.append('steps', '30');
    formData.append('cfg_scale', '7');

    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        responseType: 'arraybuffer',
      }
    );

    return new NextResponse(response.data, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error: any) {
    console.error('Error:', error);
    return new NextResponse(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: error.response?.status || 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}