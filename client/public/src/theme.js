import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
    initialColorMode: 'dark',
    direction: "rtl",
    fonts: {
        heading: '"Secular One", sans-serif'
    },
    components: {
        ...defaultScheme(["Button", "Checkbox"], {
            Button: {
                variants: {
                    solid: {
                        letterSpacing: "0.03em",
                        color: "white",
                        borderRadius: "0.15em",
                        fontSize: "1.5em",
                        textShadow: "0.08em 0.12em 0 rgba(0,0,0,0.4)",
                        boxShadow: "inset 0 -1.25em 0 -1em rgba(0,0,0,0.4)",
                        _hover: {
                            filter: "brightness(1.1)"
                        },
                        _active: {
                            boxShadow: "inset 0 -1em 0 -1em rgba(0,0,0,0.4)",
                            transform: 'translateY(0.1em)',
                        }
                    }
                }
            }
        }),
    },
    styles: {
        global: (props) => ({
            body: {
                background: mode("linear-gradient(to top, #7e7a99, #b5ddfb)",
                    "linear-gradient(to top,#283E51,#0A2342)")(props),
                backgroundColor: mode("#b5ddfb", "#283E51")(props),
                backgroundSize: "100% 100vh"
            }
        })
    },
    semanticTokens: {
        colors: {
            bg: {
                default: "#fbf6ff",
                _dark: "#130e18"
            },
            high: {
                blue: {

                    default: "#3580cb",
                    _dark: "#85ddff"
                },
                purple: {
                    default: "#7734c6",
                    _dark: "#8f3eef"
                }
            },
            uiPurple: {
                100: "high.purple",
                200: "high.purple",
                300: "high.purple",
                400: "high.purple",
                500: "high.purple",
                700: "high.purple",
                800: "high.purple",
                900: "high.purple",
            }
        }
    }
})

export default theme

function defaultScheme(arr = [], config) {
    let obj = config || {}
    arr.forEach(key => {
        if (!obj[key])
            obj[key] = {};
        if (!obj[key].defaultProps)
            obj[key].defaultProps = {}
        if (!obj[key].defaultProps.colorScheme)
            obj[key].defaultProps.colorScheme = "uiPurple"
    })
    return obj
}