// workers-site/index.js
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

addEventListener('fetch', event => {
  event.respondWith(handle(event));
});

async function handle(event) {
  try {
    // Serve files from the `out/` bucket
    return await getAssetFromKV(event);
  } catch (err) {
    return new Response('Not found', { status: 404 });
  }
}
