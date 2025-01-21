import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { message: 'Prompt is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.NEXT_PUBLIC_API_KEY
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

    if (!apiKey || !baseUrl) {
      throw new Error('API configuration is missing')
    }

    console.log('Making API request with:', {
      url: `${baseUrl}/images/generations`,
      prompt,
    })

    const response = await fetch(`${baseUrl}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        model: 'flux-dev',
        n: 1,
        size: '512x512',
        response_format: 'url'
      }),
    })

    const responseData = await response.json()
    console.log('API Response:', {
      status: response.status,
      data: responseData,
      fullData: JSON.stringify(responseData, null, 2)
    })

    if (!response.ok) {
      throw new Error(responseData.message || responseData.error || 'Failed to generate image')
    }

    // Extract image URL from the nested response structure
    const imageUrl = responseData.data?.[0]?.url || 
                    responseData.data?.data?.[0]?.url ||
                    responseData.data?.data?.[0]?.b64_json

    console.log('Extracted image URL:', imageUrl)

    if (!imageUrl) {
      console.error('Response structure:', JSON.stringify(responseData, null, 2))
      throw new Error('No image URL in API response')
    }

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Error details:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    )
  }
}
