# Per-store review and video API

Set **Theme settings → Review & Video API → Product reviews API URL** in the Shopify theme editor, then Save.

Example: https://api.autocaruniverse.cloud/api/products/premium_leather_seat_covers/reviews

Both review displays and video/photo galleries use this endpoint. Media URLs are read from each review; legacy filename-only media resolves relative to the configured API host and product slug. The endpoint must use HTTPS and the /api/products/<slug>/reviews format.

Shopify Liquid does not read a local .env file. This is a public theme setting, not a secret. To configure before uploading, set `current.product_reviews_api_url` in config/settings_data.json. Avoid overwriting that file when pushing subsequent shared-code updates to an existing store, so its saved settings stay intact.

For a new store: push the theme, set its endpoint in Theme Settings, save, and verify the product page. No JavaScript changes are required. Empty/invalid configuration disables API calls.
