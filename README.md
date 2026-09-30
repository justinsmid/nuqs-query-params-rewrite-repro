# nuqs TanStack Router adapter corrupts other query params containing `//`

`npm install && npm run dev`, open `/` (redirects to the URL below). `node repro.mjs` automates it (needs Chrome at /usr/bin/google-chrome).

1. Open `/items/123?returnUrl=https%3A%2F%2Fexample.com%2Fsome%2Fpath%3Ffoo%3D1%26bar%3D2`
2. Type in the `useQueryState("search")` input.
3. URL becomes `...?returnUrl=https:/example.com/some/path?foo=1%26bar=2&search=test` (`//` collapsed to `/`).

Cause: the adapter calls `navigate({ to: pathname + renderQueryString(search) })`, so the query
string goes through router-core's `resolvePathWithBase`, which runs `cleanPath` (`/\/{2,}/g -> "/"`).

Versions: nuqs 2.10.1, @tanstack/react-router 1.170.40 (router-core 1.171.33).
