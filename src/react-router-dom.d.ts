declare module 'react-router-dom' {
  type NavigateOptions = {
    replace?: boolean
    state?: Record<string, unknown> | null
  }

  type LocationLike = {
    pathname: string
    state?: Record<string, unknown> | null
  }

  export function useLocation(): LocationLike
  export function useNavigate(): (to: string, options?: NavigateOptions) => void
}
