import path from "path"
import react from "@vitejs/plugin-react"
import type { IncomingMessage, ServerResponse } from "node:http"
import { defineConfig, loadEnv, type Plugin } from "vite"
import { inspectAttr } from 'plugin-inspect-react-code'
import {
  uploadDocumentPayload,
  UploadDocumentError,
  type UploadDocumentPayload,
} from "./api/upload-document-core"

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify(body))
}

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = ""
    req.setEncoding("utf8")
    req.on("data", (chunk) => {
      body += chunk
    })
    req.on("end", () => {
      if (!body) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(body) as unknown)
      } catch {
        reject(new UploadDocumentError(400, "Request body must be valid JSON"))
      }
    })
    req.on("error", reject)
  })
}

function localApiPlugin(mode: string): Plugin {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    name: "pnp-local-api",
    configureServer(server) {
      server.middlewares.use("/api/upload-document", async (req, res) => {
        if (req.method !== "POST") {
          sendJson(res, 405, { error: "Method not allowed" })
          return
        }

        try {
          const payload = (await readJsonBody(req)) as UploadDocumentPayload
          const result = await uploadDocumentPayload(payload, env)
          sendJson(res, 200, result)
        } catch (err) {
          if (err instanceof UploadDocumentError) {
            sendJson(res, err.status, { error: err.message })
            return
          }
          console.error("Local upload API error:", err)
          sendJson(res, 500, { error: "Upload failed" })
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [localApiPlugin(mode), inspectAttr(), react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
