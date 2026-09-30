import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  redirect,
  RouterProvider,
} from "@tanstack/react-router"
import { parseAsString, useQueryState } from "nuqs"
import { NuqsAdapter } from "nuqs/adapters/tanstack-router"
import { createRoot } from "react-dom/client"

function SearchBox() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""))
  return (
    <>
      <input
        data-testid="search"
        value={search}
        onChange={(e) => void setSearch(e.target.value)}
        placeholder="search"
      />{" "}
      <Link to="/" data-testid="reset">
        Reset
      </Link>
    </>
  )
}

const rootRoute = createRootRoute({
  component: () => (
    <NuqsAdapter>
      <Outlet />
    </NuqsAdapter>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({
      to: "/items/$id",
      params: { id: "123" },
      search: { returnUrl: "https://example.com/some/path?foo=1&bar=2" },
    })
  },
})

const itemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/items/$id",
  component: SearchBox,
})

const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute, itemRoute]),
})

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />)

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
