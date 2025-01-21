import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  console.warn('API Route Environment:', {
    nodeEnv: process.env.NODE_ENV,
    hasApiKey: !!process.env.NEXT_PUBLIC_API_KEY,
    hasBaseUrl: !!process.env.NEXT_PUBLIC_API_BASE_URL,
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL
  })

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
        hasBaseUrl: !!baseUrl,
        baseUrl: baseUrl
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

    console.warn('Making API request:', {
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
    }).catch(error => {
      console.error('Fetch error:', {
        message: error.message,
        cause: error.cause,
        stack: error.stack
      })
      throw error
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText
      })
      let errorMessage = 'API request failed'
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorData.error || `API responded with status ${response.status}`
      } catch (_parseError) {
        errorMessage = `API error: ${errorText}`
      }
      throw new Error(errorMessage)
    }

    const responseData = await response.json()
    console.warn('API Success Response:', {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data: responseData
    })

    const imageUrl = responseData.data?.[0]?.url || 
                    responseData.data?.data?.[0]?.url ||
                    responseData.data?.data?.[0]?.b64_json

    if (!imageUrl) {
      console.error('Invalid API response structure:', JSON.stringify(responseData, null, 2))
      throw new Error('No image URL in API response')
    }

    console.warn('Successfully generated image:', { imageUrl })

    return NextResponse.json({ 
      success: true,
      imageUrl,
      message: 'Image generated successfully'
    })
  } catch (error) {
    console.error('Error in image generation:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    })
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Failed to generate image',
        error: error.stack || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
