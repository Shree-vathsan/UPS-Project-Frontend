import { createContext, useContext, useEffect, useState } from "react"

type Theme = "black-beige" | "light" | "dark" | "night" | "light-pallete" | "system"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = "black-beige",
    storageKey = "codefamily-ui-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    )

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("theme-light", "theme-dark", "theme-night", "theme-light-pallete", "black-beige")

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"

            root.classList.add(`theme-${systemTheme}`)
            return
        }

        if (theme === "light") {
            root.classList.add("theme-light")
        } else if (theme === "dark") {
            root.classList.add("theme-dark")
        } else if (theme === "night") {
            root.classList.add("theme-night")
        } else if (theme === "light-pallete") {
            root.classList.add("theme-light-pallete")
        }
        // black-beige is the default in CSS, so no class needed
    }, [theme])

    const value = {
        theme,
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
