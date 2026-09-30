import { spawn } from "node:child_process"
import { chromium } from "playwright-core"

const PORT = 5299
const returnUrl = "https://example.com/some/path?foo=1&bar=2"
const start = `http://localhost:${PORT}/`

const server = spawn("./node_modules/.bin/vite", ["--port", String(PORT), "--strictPort"], {
  stdio: "ignore",
})
await new Promise((r) => setTimeout(r, 3000))

const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome" })
const page = await browser.newPage()
await page.goto(start)
await page.getByTestId("search").fill("test")
await page.waitForTimeout(500)

console.log("BEFORE:", start, "(redirects to the returnUrl page)")
console.log("AFTER: ", page.url())
console.log("returnUrl preserved:", new URL(page.url()).searchParams.get("returnUrl") === returnUrl)

await page.getByTestId("reset").click()
await page.waitForTimeout(500)
console.log("AFTER RESET:", page.url(), "| input:", JSON.stringify(await page.getByTestId("search").inputValue()))

await browser.close()
server.kill()
process.exit(0)
