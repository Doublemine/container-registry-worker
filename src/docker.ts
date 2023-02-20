import HTML from './docker.html';

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const originalHost = request.headers.get("host");
    const registryHost = "registry-1.docker.io";

    if (path.startsWith("/v2/")) {
      const headers = new Headers(request.headers);
      headers.set("host", registryHost);

      const registryUrl = `https://${registryHost}${path}`;
      const registryRequest = new Request(registryUrl, {
        method: request.method,
        headers: headers,
        body: request.body,
        redirect: "manual",
      });

      const registryResponse = await fetch(registryRequest);

      const responseHeaders = new Headers(registryResponse.headers);
      responseHeaders.set("access-control-allow-origin", originalHost as string);
      responseHeaders.set("access-control-allow-headers", "Authorization");
      return new Response(registryResponse.body, {
        status: registryResponse.status,
        statusText: registryResponse.statusText,
        headers: responseHeaders,
      });
    } else {
      return new Response(HTML.replace(/{{host}}/g, originalHost as string), {
        status: 200,
        headers: {
          "content-type": "text/html"
        }
      });
    }
  }
}