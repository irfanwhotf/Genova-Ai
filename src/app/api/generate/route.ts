import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { success: false, message: 'Prompt is required' },
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

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || errorData.error || `API responded with status ${response.status}`)
    }

    const responseData = await response.json()
    console.log('API Response:', {
      status: response.status,
      data: responseData,
    })

    // Extract image URL from the nested response structure
    const imageUrl = responseData.data?.[0]?.url || 
                    responseData.data?.data?.[0]?.url ||
                    responseData.data?.data?.[0]?.b64_json

    if (!imageUrl) {
      console.error('Response structure:', JSON.stringify(responseData, null, 2))
      throw new Error('No image URL in API response')
    }

    return NextResponse.json({ 
      success: true,
      imageUrl,
      message: 'Image generated successfully'
    })
  } catch (error) {
    console.error('Error details:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate image',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
