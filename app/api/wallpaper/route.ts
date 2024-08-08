import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { prompt, size, style } = await req.json();
    const [width, height] = size.split('x').map(Number);

    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) {
      throw new Error('STABILITY_API_KEY 未设置');
    }

    const apiEndpoint = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

    const response = await axios.post(
      apiEndpoint,
      {
        text_prompts: [
          { text: prompt, weight: 1 },
          { text: 'blurry, bad', weight: -1 }
        ],
        cfg_scale: 7,
        clip_guidance_preset: 'FAST_BLUE',
        height: height,
        width: width,
        samples: 1,
        steps: 30,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const image = response.data.artifacts[0].base64;
    const buffer = Buffer.from(image, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error: any) {
    console.error('错误:', error);
    let errorMessage = '内部服务器错误';
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
      statusCode = error.response?.status || 500;
      console.error('API 响应:', error.response?.data);
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}