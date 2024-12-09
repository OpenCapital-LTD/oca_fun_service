import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'


const emojis = ['👍', '❤️', '😂', '😮', '😢', '👏', '🎉', '🚀']

export default function FloatingEmojis() {
  const [floatingEmojis, setFloatingEmojis] = useState([])

  const createFloatingEmoji = (emoji) => {
    const id = Date.now()
    const x = Math.random() * 100 // Random horizontal position (0-100%)
    setFloatingEmojis(prev => [...prev, { id, emoji, x }])

    // Remove emoji after animation completes
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id))
    }, 3000) // Match this with the animation duration
  }

  return (
    <div className="fixed inset-x-0 bottom-0 mb-4 flex justify-center items-end">
      <div className="bg-white rounded-full shadow-lg p-2 flex space-x-2">
        {emojis.map(emoji => (
          <button
            key={emoji}
            className="text-2xl hover:scale-125 transition-transform focus:outline-none"
            onClick={() => createFloatingEmoji(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {floatingEmojis.map(({ id, emoji, x }) => (
          <motion.div
            key={id}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -200, opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, times: [0, 0.1, 0.9, 1] }}
            className="absolute text-4xl pointer-events-none"
            style={{ left: `${x}%`, bottom: '100px' }}
          >
            {emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

