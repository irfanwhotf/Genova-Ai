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
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setImageUrl(null)

      console.log('Starting image generation with prompt:', prompt)

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      console.log('Received response:', {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      })

      const responseText = await response.text()
      console.log('Response text:', responseText)

      let data
      try {
        data = JSON.parse(responseText)
        console.log('Parsed response data:', data)
      } catch (parseError) {
        console.error('Failed to parse response:', responseText, parseError)
        throw new Error('Invalid response from server')
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to generate image')
      }

      if (!data.imageUrl) {
        console.error('Missing image URL in response:', data)
        throw new Error('No image URL in response')
      }

      console.log('Successfully received image URL:', data.imageUrl)
      setImageUrl(data.imageUrl)
    } catch (error) {
      console.error('Error generating image:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate image')
      setImageUrl(null)
    } finally {
      setLoading(false)
    }
  }

  const downloadImage = async () => {
    if (!imageUrl) return
    
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `genova-ai-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
      setError('Failed to download image')
    }
  }

  return (
    <>
      <Navbar />
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800 relative">
          <button
            onClick={() => setError(null)}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="font-medium">Error generating image:</div>
          <div className="mt-1">{error}</div>
          <div className="mt-2 text-xs">
            Please check the browser console for more details.
          </div>
        </div>
      )}
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <div className="relative bg-gray-900 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                    <span className="block">Transform your ideas into</span>
                    <span className="block text-green-400">stunning images with AI</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Create beautiful, unique images with our state-of-the-art AI image generation technology.
                    Just describe what you want to see, and watch the magic happen.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <button
                        onClick={() => document.getElementById('generate-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-400 md:py-4 md:text-lg md:px-10"
                      >
                        Start Generating
                      </button>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>

        {/* Generate Section */}
        <div id="generate-section" className="py-12 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Generate Your Image
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto">
                Enter your prompt below and select your preferred model to generate an image.
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to generate..."
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-1 focus:ring-green-400 outline-none transition-all resize-none h-32"
                />
                
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-green-400 focus:ring-1 focus:ring-green-400 outline-none transition-all"
                >
                  <option value="Flux-Dev">Flux-Dev</option>
                </select>

                <button
                  onClick={generateImage}
                  disabled={loading}
                  className={`w-full px-6 py-3 rounded-lg bg-green-500 hover:bg-green-400 text-white font-medium transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Generating...' : 'Generate Image'}
                </button>

                {/* Result Section */}
                {imageUrl && (
                  <div className="mt-8 space-y-4">
                    <div className="relative aspect-square max-w-2xl mx-auto border-2 border-gray-700 rounded-lg overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={prompt}
                        fill
                        className="object-contain"
                        unoptimized
                        onError={(e) => {
                          console.error('Image loading error:', e)
                          setError('Failed to load the generated image')
                        }}
                      />
                    </div>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={downloadImage}
                        className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
                      >
                        Download Image
                      </button>
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
                      >
                        Open in New Tab
                      </a>
                    </div>
                    <p className="text-center text-gray-400 mt-4">
                      Prompt: {prompt}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
