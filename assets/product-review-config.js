// Public per-store configuration supplied by Shopify Theme Settings.
(() => {
  const endpoint = String(window.productReviewsApiUrl || '').trim().replace(/\/+$/, '');
  let url;
  try { url = new URL(endpoint); } catch { return; }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) return;
  const match = url.pathname.match(/^\/api\/products\/([a-z0-9_-]+)\/reviews$/);
  if (!match) return;
  window.productReviewConfig = {
    endpoint,
    mediaUrl(media, type) {
      if (!media) return '';
      const value = media.url || (media.filename ? `/uploads/products/${match[1]}/${type}/${encodeURIComponent(media.filename)}` : '');
      if (!value) return '';
      try {
        const target = new URL(value, url.origin);
        return target.protocol === 'https:' ? target.href.replace(/"/g, '%22') : '';
      } catch { return ''; }
    }
  };
})();
