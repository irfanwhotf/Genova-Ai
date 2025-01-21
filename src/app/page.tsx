'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-green-400">GenovaAI</span>
        </div>
        <div className="hidden md:block">
          <div className="ml-10 flex items-baseline space-x-4">
            <Link href="/" className="text-white hover:text-green-400 px-3 py-2">Home</Link>
            <Link href="/about" className="text-white hover:text-green-400 px-3 py-2">About</Link>
            <Link href="/contact" className="text-white hover:text-green-400 px-3 py-2">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  </nav>
)

const Footer = () => (
  <footer className="bg-gray-900 text-white py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p> 2025 GenovaAI. All rights reserved.</p>
        </div>
        <div className="flex space-x-6">
          <Link href="https://twitter.com" className="hover:text-green-400">Twitter</Link>
          <Link href="https://github.com" className="hover:text-green-400">GitHub</Link>
          <Link href="https://linkedin.com" className="hover:text-green-400">LinkedIn</Link>
        </div>
      </div>
    </div>
  </footer>
)

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('Flux-Dev')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateImage = async () => {
    try {
      setLoading(true)
      setError(null)
      setImageUrl(null)

      console.warn('Starting image generation with prompt:', prompt)

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      console.warn('Response status:', response.status)
      console.warn('Response headers:', Object.fromEntries(response.headers.entries()))

      const responseText = await response.text()
      console.warn('Raw response:', responseText)

      let data
      try {
        data = JSON.parse(responseText)
        console.warn('Parsed response:', data)
      } catch (parseError: unknown) {
        const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parse error'
        console.error('Failed to parse response:', {
          text: responseText,
          error: errorMessage
        })
        throw new Error(`Invalid response from server: ${errorMessage}`)
      }

      if (!response.ok || !data.success) {
        console.error('API Error:', {
          status: response.status,
          data
        })
        throw new Error(data.message || `API error: ${response.status}`)
      }

      if (!data.imageUrl) {
        console.error('Missing image URL:', data)
        throw new Error('No image URL in response')
      }

      console.warn('Setting image URL:', data.imageUrl)
      setImageUrl(data.imageUrl)
    } catch (error: unknown) {
      const errorDetails = error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : { error }

      console.error('Error details:', errorDetails)
      setError(error instanceof Error ? error.message : 'Failed to generate image')
      setImageUrl(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    generateImage()
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                Generate AI Images
              </h2>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-red-400 mb-1">Error Occurred</h3>
                      <p className="text-white">{error}</p>
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="ml-4 text-red-400 hover:text-red-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="prompt" className="sr-only">
                    Image Prompt
                  </label>
                  <textarea
                    id="prompt"
                    name="prompt"
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your image prompt here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className={`w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                    loading || !prompt.trim()
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Generating Image...
                    </>
                  ) : (
                    'Generate Image'
                  )}
                </button>
              </form>

              {/* Loading State */}
              {loading && (
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-gray-700 rounded-lg">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-white">Please wait, generating your image...</span>
                  </div>
                </div>
              )}

              {/* Image Display */}
              <div className="mt-8 flex justify-center">
                {imageUrl ? (
                  <div className="relative group">
                    <Image
                      src={imageUrl}
                      alt="Generated image"
                      width={512}
                      height={512}
                      className="rounded-lg shadow-2xl transition-all duration-300 group-hover:shadow-blue-500/25"
                      priority
                      onError={() => {
                        console.error('Failed to load image')
                        setError('Failed to load the generated image. Please try again.')
                      }}
                    />
                    <button
                      onClick={() => window.open(imageUrl, '_blank')}
                      className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      View Full Size
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
