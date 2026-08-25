import { useEffect } from 'react';

export default function Seo({ title, description, canonical }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const setMeta = (selector, value, attr = 'content') => {
      if (!value) return;
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        if (selector.includes('property')) {
          tag.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '');
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', description);

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }
  }, [title, description, canonical]);

  return null;
}
