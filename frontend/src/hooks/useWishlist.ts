import { useState, useEffect, useCallback } from 'react'

const KEY = 'arohak_wishlist'

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
  })

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(wishlist)) } catch {}
  }, [wishlist])

  const toggle = useCallback((courseId: string) => {
    setWishlist(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    )
  }, [])

  const isWishlisted = useCallback((courseId: string) => wishlist.includes(courseId), [wishlist])

  return { wishlist, toggle, isWishlisted }
}
