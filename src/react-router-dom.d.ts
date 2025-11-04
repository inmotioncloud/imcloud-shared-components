declare module 'react-router-dom' {
  type NavigateOptions = {
    replace?: boolean
    state?: Record<string, unknown> | null
  }

  type LocationLike = {
    hash?: string
    pathname: string
    search?: string
    state?: Record<string, unknown> | null
  }

  export function useLocation(): LocationLike
  export function useNavigate(): (to: string, options?: NavigateOptions) => void
}
