import { NextResponse } from 'next/server'

interface ImageData {
  url?: string
  b64_json?: string
}

interface ApiResponseData {
  data?: ImageData[]
}

interface ApiResponse {
  data?: ImageData[] | ApiResponseData
}

interface RequestBody {
  prompt?: string
}

export async function POST(request: Request) {
  try {
    // Log request headers
    console.warn('API Request Headers:', Object.fromEntries(request.headers.entries()))

    // Validate environment variables first
    const apiKey = process.env.NEXT_PUBLIC_API_KEY
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

    if (!apiKey || !baseUrl) {
      console.error('Missing environment variables:', { 
        hasApiKey: !!apiKey, 
        hasBaseUrl: !!baseUrl
      })
      return NextResponse.json(
        { success: false, message: 'API configuration is missing' },
        { status: 500 }
      )
    }

    // Parse request body
    let prompt: string
    let body: RequestBody
    try {
      body = await request.json()
      console.warn('Request body:', body)
      prompt = body.prompt?.trim() ?? ''
    } catch (_parseError) {
      console.error('Failed to parse request body')
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      )
    }

    if (!prompt) {
      console.error('Missing prompt in request:', body)
      return NextResponse.json(
        { success: false, message: 'Prompt is required' },
        { status: 400 }
      )
    }

    console.warn('Making API request:', {
      url: `${baseUrl}/images/generations`,
      prompt,
      apiKeyLength: apiKey.length
    })

    // Make API request
    const response = await fetch(`${baseUrl}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        model: 'flux-dev',
        n: 1,
        size: '512x512',
        response_format: 'url'
      }),
    })

    console.warn('External API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })

    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText
      })

      let errorMessage: string
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorData.error || `API error: ${response.status}`
      } catch {
        errorMessage = `API error: ${response.status} - ${errorText.slice(0, 100)}`
      }

      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: response.status }
      )
    }

    // Parse successful response
    let responseData: ApiResponse
    let responseText: string
    try {
      responseText = await response.text()
      console.warn('Raw API response:', responseText)
      responseData = JSON.parse(responseText)
      console.warn('Parsed API response:', responseData)
    } catch (_jsonError) {
      console.error('Failed to parse API response:', responseText)
      return NextResponse.json(
        { success: false, message: 'Invalid response from API' },
        { status: 500 }
      )
    }

    // Extract image URL with proper type checking
    let imageUrl: string | undefined
    
    if (Array.isArray(responseData.data)) {
      imageUrl = responseData.data[0]?.url || responseData.data[0]?.b64_json
    } else if (responseData.data?.data && Array.isArray(responseData.data.data)) {
      imageUrl = responseData.data.data[0]?.url || responseData.data.data[0]?.b64_json
    }

    if (!imageUrl) {
      console.error('Invalid API response structure:', responseData)
      return NextResponse.json(
        { success: false, message: 'No image URL in API response' },
        { status: 500 }
      )
    }

    console.warn('Successfully generated image URL:', imageUrl)
    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'Image generated successfully'
    })

  } catch (error) {
    console.error('Unhandled error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}
