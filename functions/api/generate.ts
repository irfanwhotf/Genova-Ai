export const onRequestPost: PagesFunction = async (context) => {
  try {
    const request = context.request;
    const { prompt } = await request.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ message: 'Prompt is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const apiKey = context.env.NEXT_PUBLIC_API_KEY;
    const baseUrl = context.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiKey || !baseUrl) {
      throw new Error('API configuration is missing');
    }

    console.log('Making API request with:', {
      url: `${baseUrl}/images/generations`,
      prompt,
    });

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
    });

    const responseData = await response.json();
    console.log('API Response:', {
      status: response.status,
      data: responseData,
    });

    if (!response.ok) {
      throw new Error(responseData.message || responseData.error || 'Failed to generate image');
    }

    const imageUrl = responseData.data?.[0]?.url || 
                    responseData.data?.data?.[0]?.url ||
                    responseData.data?.data?.[0]?.b64_json;

    if (!imageUrl) {
      throw new Error('No image URL in API response');
    }

    return new Response(
      JSON.stringify({ imageUrl }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error details:', error);
    return new Response(
      JSON.stringify({ 
        message: error instanceof Error ? error.message : 'Failed to generate image'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
