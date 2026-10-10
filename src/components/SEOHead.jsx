import { useEffect } from 'react'

export default function SEOHead({
  title = "Yohannes Bayeh — Frontend Developer",
  description = "Crafting fast, polished web interfaces. Frontend Developer based in Bahir Dar, Ethiopia.",
  image = "https://yohannes-bayeh.vercel.app/yohannes.png",
  url = "https://yohannes-bayeh.vercel.app/",
}) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title

    // Helper to update or create <meta> tags dynamically
    const updateMetaTag = (selector, attrName, attrVal, content) => {
      if (!content) return
      let el = document.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attrName, attrVal)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    // Helper to update canonical link
    const updateCanonicalLink = (href) => {
      if (!href) return
      let el = document.querySelector('link[rel="canonical"]')
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', 'canonical')
        document.head.appendChild(el)
      }
      el.setAttribute('href', href)
    }

    // 2. Standard Meta Tags
    updateMetaTag('meta[name="description"]', 'name', 'description', description)

    // 3. Open Graph Tags (WhatsApp, Telegram, LinkedIn, Facebook)
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', title)
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', description)
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', image)
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', url)

    // 4. Twitter / X Tags
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    updateMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', image)

    // 5. Canonical Link
    updateCanonicalLink(url)
  }, [title, description, image, url])

  return null
}
