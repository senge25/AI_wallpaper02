'use client'

import React, { useState } from 'react'
import Image from 'next/image'

const styles: Record<string, string> = {
  anime: "anime style, vibrant colors, 2D animation, kawaii characters,",
  realistic: "hyper-realistic style, detailed textures, natural lighting,",
  pixel: "pixel art style, 8-bit graphics, retro gaming aesthetic,",
}

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('')
  const [size, setSize] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateWallpaper = async () => {
    if (!prompt || !style || !size) {
      setError('请填写所有字段')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/wallpaper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${styles[style]}${prompt}`,
          size,
          style,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const imageUrl = URL.createObjectURL(blob)
        setImage(imageUrl)
      } else {
        const errorData = await response.json()
        setError(`生成壁纸时出错: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error:', error)
      setError('生成壁纸时发生错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-gray-600">AI 壁纸生成器</h1>
        <p className="text-gray-600 mb-6">使用您自己的文本或主题创建个性化壁纸。</p>
        
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">内容</label>
          <textarea
            id="content"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="输入您的文本或主题"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
            rows={4}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">风格</label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
          >
            <option value="">选择风格</option>
            <option value="anime" className="text-gray-600">动漫</option>
            <option value="realistic" className="text-gray-600">写实</option>
            <option value="pixel" className="text-gray-600">像素艺术</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="resolution" className="block text-sm font-medium text-gray-700 mb-2">分辨率</label>
          <select
            id="resolution"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
          >
            <option value="">选择分辨率</option>
            <option value="1152x896" className="text-gray-600">1152x896</option>
            <option value="1344x768" className="text-gray-600">1344x768</option>
            <option value="1024x1024" className="text-gray-600">1024x1024</option>
          </select>
        </div>
        
        {error && (
          <div className="mb-4 text-red-500">{error}</div>
        )}
        
        <button
          onClick={generateWallpaper}
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          {loading ? '生成中...' : '生成'}
        </button>
        
        {image && (
          <div className="mt-6">
            <img src={image} alt="生成的壁纸" className="rounded-lg max-w-full h-auto" />
            <a
              href={image}
              download="ai-wallpaper.png"
              className="mt-4 inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              下载
            </a>
          </div>
        )}
      </div>
    </div>
  )
}