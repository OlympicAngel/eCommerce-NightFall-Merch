import { defineStyleConfig, extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
    initialColorMode: 'dark',
    direction: "rtl",
    fonts: {
        heading: '"Secular One", sans-serif'
    },
    components: {
        ...defaultScheme(["Button", "Checkbox", "Badge", "Spinner", "Tag", "Checkbox", "Switch", "Slider", "Table", "Popover", "CloseButton", "DrawerCloseButton"], {
            Button: defineStyleConfig({
                variants: {
                    solid: {
                        letterSpacing: "0.03em",
                        color: "white",
                        borderRadius: "0.3em",
                        fontSize: "1.5em",
                        textShadow: "0.09em 0.14em 0 rgba(0,0,0,0.45),0.04em 0.05em 0.3em rgba(0,0,0,0.5) ",
                        boxShadow: "inset 0 -1.25em 0 -1em rgba(0,0,0,0.4)",
                        _hover: {
                            filter: "brightness(1.1)"
                        },
                        _active: {
                            boxShadow: "inset 0 -.95em 0 -1em rgba(0,0,0,0.4)",
                            transform: 'translateY(0.1em)',
                        }
                    },
                    ghost: {
                        fontSize: "1.5em",
                        fontWeight: "900",
                        bg: "blackWhite.200",
                    }
                }
            }),
            Card: defineStyleConfig({
                defaultProps: {
                    variant: "filled"
                },
                variants: {
                    filled: {
                        container: {
                            backgroundColor: "cardBg",
                            boxShadow: "2xl",
                            transition: "box-shadow 0.3s ease-in-out, outline 0.4s",
                            outline: "0.2em solid",
                            margin: "0.2em",
                            outlineColor: "high.purple",
                            borderRadius: "0.3em",
                            m: "auto",
                            p: ["0.5em", "1em"],
                            w: ["calc(100% - 0.5em)", "calc(100% - 1em)", "100%"],
                        },
                        header: {
                            color: "high.blue",
                            textShadow: "0.05em 0.1em 0.2em rgba(0,0,0,0.2)"
                        }
                    }
                }
            })
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

            blackWhite: {
                default: "black",
                _dark: "white",
                200: {
                    default: "rgba(0,0,0,0.15)",
                    _dark: "rgba(255,255,255,0.05)",
                }
            },

            high: {
                blue: {
                    default: "#3580cb",
                    _dark: "#85ddff"
                },
                purple: {
                    default: "#7734c6",
                    _dark: "#8f3eef"
                },
                red: {
                    default: "red.300",
                    _dark: "red.200"
                },
                green: {
                    default: "green.500",
                    _dark: "green.200"
                }
            },

            cardBg: {
                default: "white",
                _dark: "hsl(295 22% 7% / 1)"
            },

            red: {
                50: "#ffe6e6",
                100: "#ff9999",
                200: "#ff0000",
                300: "#ff4d4d",
                400: "#ff4d4d",
                500: "#cc0000",
                600: "#b30000",
                700: "#990000",
                800: "#800000",
                900: "#660000",
            },
            green: {
                50: "#f9ffe5",
                100: "#d8f5a2",
                200: "#9de13b",
                300: "#85e047",
                400: "#5ddc1f",
                500: "#3fc307",
                600: "#36a700",
                700: "#2c8500",
                800: "#226300",
                900: "#173c00",
            },
            blue: {
                50: "#e6f7ff",
                100: "#99ddff",
                200: "#007acc",
                300: "#0099ff",
                400: "#007acc",
                500: "#0374c9",
                600: "#004d80",
                700: "#003966",
                800: "#002d4d",
                900: "#002233",
            },
            orange: {
                50: "#fff2e6",
                100: "#ffd6b3",
                200: "#ff8533",
                300: "#ff8533",
                400: "#e67300",
                500: "#cc6600",
                600: "#b35900",
                700: "#994d00",
                800: "#804000",
                900: "#663300",
            },
            yellow: {
                50: "#ffffcc",
                100: "#ffff99",
                200: "#eccb1f",
                300: "#dbc400",
                400: "#ffcc00",
                500: "#ffcc00",
                600: "#e6b800",
                700: "#cca300",
                800: "#b38f00",
                900: "#996600",
            },
            pink: {
                50: "#ffe6f2",
                100: "#ff99cc",
                200: "#ff4da6",
                300: "#ff0080",
                400: "#e60073",
                500: "#cc0066",
                600: "#b30059",
                700: "#99004d",
                800: "#800040",
                900: "#660033",
            },
            purple: {
                trans: "rgb(119 52 198 / 52%)",
                50: "#f7eaff",
                100: "#e0b2ff",
                200: "#8f3eef",
                300: "#ad4dff",
                400: "#9400ff",
                500: "#8000e6",
                600: "#6600b3",
                700: "#4c0080",
                800: "#33004d",
                900: "#19001a",
            },
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
            obj[key].defaultProps.colorScheme = "purple"
    })
    return obj
}