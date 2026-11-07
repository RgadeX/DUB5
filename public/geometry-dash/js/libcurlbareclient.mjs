import { libcurl } from "/libcurljs/libcurl_full.mjs";
var libcurlClient = Object.freeze({
  wasm: "/libcurljs/libcurl.wasm",
  defaultConnections: [30, 24, 3],
  transientCurlError:
    /error code (?:18|35|52|55|56|92)\b|Failure when receiving data|Server returned nothing|SSL connect error|Stream error|Recv failure/i,
  blockedRequestHeaders: new Set([
    "connection",
    "content-length",
    "host",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "proxy-connection",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
  ]),
  defaultRequestHeaders: [
    [
      "accept",
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    ],
    [
      "accept-language",
      navigator.languages?.length ? navigator.languages.join(",") : "en-US,en;q=0.9",
    ],
  ],
});
export default class LibcurlBareClient {
  ready = false;
  session = null;
  constructor(options) {
    this.wisp = options.wisp ?? options.websocket;
    this.transport = options.transport;
    this.proxy = options.proxy;
    this.connections = options.connections || libcurlClient.defaultConnections;
    if (!this.wisp.endsWith("/")) {
      throw new TypeError("use ws://");
    }
    if (!this.wisp.startsWith("ws://") && !this.wisp.startsWith("wss://")) {
      throw new TypeError("use ws://");
    }
    if (typeof options.proxy === "string" || options.proxy instanceof String) {
      const protocol = new URL(options.proxy).protocol;
      if (!["socks5h:", "socks5:", "socks4a:", "http:"].includes(protocol)) {
        throw new TypeError("use ws://");
      }
    }
  }
  async init() {
    if (this.ready && this.session) {
      return;
    }
    if (this.transport) {
      libcurl.transport = this.transport;
    }
    await libcurl.load_wasm(libcurlClient.wasm);
    libcurl.set_websocket(this.wisp);
    this.session = this.createSession();
    this.ready = true;
  }
  createSession() {
    const session = new libcurl.HTTPSession({
      proxy: this.proxy,
    });
    if (this.connections) {
      session.set_connections(...this.connections);
    }
    return session;
  }
  resetSession() {
    try {
      this.session?.close?.();
    } catch {}
    this.session = this.createSession();
  }
  async meta() {}
  normalizeHeaders(headers, remote, method) {
    const pairs = Array.isArray(headers)
      ? headers
      : headers instanceof Headers
        ? [...headers.entries()]
        : Object.entries(headers || {});
    const cleanPairs = [];
    const seenHeaders = new Set();
    for (const entry of pairs) {
      if (!Array.isArray(entry) || entry.length < 2) continue;
      const name = String(entry[0] || "")
        .trim()
        .toLowerCase();
      if (!name || libcurlClient.blockedRequestHeaders.has(name)) continue;
      if (name.startsWith(":") || name.startsWith("sec-") || name.startsWith("proxy-")) continue;
      const value = Array.isArray(entry[1]) ? entry[1].join(", ") : entry[1];
      const cleanValue = String(value ?? "").replace(/[^\x09\x20-\x7e\x80-\xff]/g, "");
      if (!cleanValue) continue;
      cleanPairs.push([name, cleanValue]);
      seenHeaders.add(name);
    }
    for (const [name, value] of libcurlClient.defaultRequestHeaders) {
      if (!seenHeaders.has(name)) cleanPairs.push([name, value]);
    }
    return cleanPairs;
  }
  getFallbackResponse(remote) {
    return null;
  }
  shouldRetryRequest(error, method) {
    const methodName = String(method || "GET").toUpperCase();
    return (
      ["GET", "HEAD", "OPTIONS"].includes(methodName) &&
      libcurlClient.transientCurlError.test(String(error?.message || error || ""))
    );
  }
  normalizeResponseHeaderPairs(headers) {
    if (!headers) {
      return [];
    }
    const parseHeaderLine = (line) => {
      const header = String(line || "").trim();
      if (!header || /^HTTP\/\d(?:\.\d)?\s+/i.test(header)) return null;
      const colonIndex = header.indexOf(":");
      const commaIndex = header.indexOf(",");
      const separatorIndex =
        colonIndex === -1
          ? commaIndex
          : commaIndex === -1
            ? colonIndex
            : Math.min(colonIndex, commaIndex);
      if (separatorIndex <= 0) return null;
      const name = header.slice(0, separatorIndex).trim();
      const value = header.slice(separatorIndex + 1).trim();
      return name && value ? [name, value] : null;
    };
    if (Array.isArray(headers)) {
      return headers
        .map((entry) => {
          if (Array.isArray(entry)) {
            if (
              entry.length >= 2 &&
              !String(entry[0]).includes(":") &&
              !String(entry[0]).includes(",")
            ) {
              const name = String(entry[0]).trim();
              const value = String(entry.slice(1).join(",")).trim();
              return name && value ? [name, value] : null;
            }
            return parseHeaderLine(entry.join(","));
          }
          return parseHeaderLine(entry);
        })
        .filter((entry) => entry?.[0]);
    }
    return Object.entries(headers).map(([key, value]) => [key, String(value)]);
  }
  async request(remote, method, body, headers, signal) {
    const fallbackResponse = this.getFallbackResponse(remote);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    const requestOptions = {
      method,
      headers: this.normalizeHeaders(headers, remote, method),
      body,
      redirect: "manual",
      signal,
    };
    let payload;
    try {
      payload = await this.session.fetch(remote.href, requestOptions);
    } catch {
      if (!this.shouldRetryRequest(error, method)) throw error;
      this.resetSession();
      payload = await this.session.fetch(remote.href, requestOptions);
    }
    const responseHeaders = this.normalizeResponseHeaderPairs(
      payload.raw_headers ?? payload.headers,
    );
    return {
      body: payload.body,
      headers: responseHeaders,
      status: payload.status,
      statusText: payload.statusText,
    };
  }
  connect(url, protocols, requestHeaders, onopen, onmessage, onclose, onerror) {
    const socket = new libcurl.WebSocket(url.toString(), protocols, {
      headers: requestHeaders,
    });
    socket.binaryType = "arraybuffer";
    socket.onopen = () => {
      onopen("");
    };
    socket.onclose = (event) => {
      onclose(event.code, event.reason);
    };
    socket.onerror = () => {
      onerror("");
    };
    socket.onmessage = (event) => {
      onmessage(event.data);
    };
    return [
      (data) => {
        socket.send(data);
      },
      (code, reason) => {
        socket.close(code, reason);
      },
    ];
  }
}
