import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      console.error('No prompt provided')
      return NextResponse.json(
        { success: false, message: 'Prompt is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.NEXT_PUBLIC_API_KEY
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

    if (!apiKey || !baseUrl) {
      console.error('Missing environment variables:', { 
        hasApiKey: !!apiKey, 
        hasBaseUrl: !!baseUrl 
      })
      throw new Error('API configuration is missing')
    }

    const requestBody = {
      prompt: prompt.trim(),
      model: 'flux-dev',
      n: 1,
      size: '512x512',
      response_format: 'url'
    }

    console.log('Making API request:', {
      url: `${baseUrl}/images/generations`,
      prompt: requestBody.prompt,
      model: requestBody.model
    })

    const response = await fetch(`${baseUrl}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    const responseData = await response.json()
    console.log('API Response:', {
      status: response.status,
      data: responseData,
      headers: Object.fromEntries(response.headers.entries())
    })

    if (!response.ok) {
      throw new Error(responseData.message || responseData.error || `API responded with status ${response.status}`)
    }

    const imageUrl = responseData.data?.[0]?.url || 
                    responseData.data?.data?.[0]?.url ||
                    responseData.data?.data?.[0]?.b64_json

    if (!imageUrl) {
      console.error('Invalid API response structure:', JSON.stringify(responseData, null, 2))
      throw new Error('No image URL in API response')
    }

    console.log('Successfully generated image:', { imageUrl })

    return NextResponse.json({ 
      success: true,
      imageUrl,
      message: 'Image generated successfully'
    })
  } catch (error) {
    console.error('Error in image generation:', error instanceof Error ? {
      message: error.message,
      stack: error.stack
    } : error)
    
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate image',
        error: error instanceof Error ? error.stack : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
