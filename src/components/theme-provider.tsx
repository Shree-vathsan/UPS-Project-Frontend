import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "night" | "system"
type ResolvedTheme = "light" | "dark" | "night"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    resolvedTheme: ResolvedTheme
    setTheme: (theme: Theme) => void
}

const getSystemTheme = (): "light" | "dark" => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

const initialState: ThemeProviderState = {
    theme: "system",
    resolvedTheme: "dark",
    setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = "night",
    storageKey = "codefamily-ui-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem(storageKey);
        return (saved as Theme) || defaultTheme;
    })

    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
        if (theme === "system") {
            return getSystemTheme()
        }
        return theme as ResolvedTheme
    })

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("theme-light", "theme-dark", "theme-night")

        if (theme === "system") {
            const systemTheme = getSystemTheme()
            setResolvedTheme(systemTheme)
            root.classList.add(`theme-${systemTheme}`)
            return
        }

        setResolvedTheme(theme as ResolvedTheme)
        if (theme === "light") {
            root.classList.add("theme-light")
        } else if (theme === "dark") {
            root.classList.add("theme-dark")
        } else if (theme === "night") {
            root.classList.add("theme-night")
        }
    }, [theme])

    // Listen for system theme changes when in system mode
    useEffect(() => {
        if (theme !== "system") return

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        const handleChange = (e: MediaQueryListEvent) => {
            const newTheme = e.matches ? "dark" : "light"
            setResolvedTheme(newTheme)
            const root = window.document.documentElement
            root.classList.remove("theme-light", "theme-dark", "theme-night")
            root.classList.add(`theme-${newTheme}`)
        }

        mediaQuery.addEventListener("change", handleChange)
        return () => mediaQuery.removeEventListener("change", handleChange)
    }, [theme])

    const value = {
        theme,
        resolvedTheme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        },
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
