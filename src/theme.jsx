// src/theme.jsx
import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50:  "#C5C6C7",  // light gray
      100: "#66FCF1",  // vivid cyan
      200: "#45A29E",  // teal
      300: "#1F2833",  // charcoal
      400: "#0B0C10",  // near-black
    },
  },
  styles: {
    global: (props) => ({
      "html, body": {
        bg: props.colorMode === "dark" ? "brand.300" : "brand.50",
        color: props.colorMode === "dark" ? "brand.50"  : "brand.300",
        lineHeight: "tall",
      },
      a: {
        color: props.colorMode === "dark" ? "brand.100" : "brand.200",
      },
      // make disabled buttons a bit dimmer
      "button[disabled]": {
        opacity: 0.6,
      },
    }),
  },
  components: {
    Button: {
      variants: {
        solid: (props) => ({
          bg: props.colorMode === "dark" ? "brand.200" : "brand.100",
          color: props.colorMode === "dark" ? "brand.300" : "brand.400",
          _hover: {
            bg: props.colorMode === "dark" ? "brand.100" : "brand.200",
          },
        }),
        outline: (props) => ({
          borderColor: props.colorMode === "dark" ? "brand.50"  : "brand.200",
          color:       props.colorMode === "dark" ? "brand.50"  : "brand.200",
          _hover: {
            bg: props.colorMode === "dark" ? "brand.300" : "brand.50",
          },
        }),
      },
      defaultProps: {
        colorScheme: "brand",
      },
    },
    Badge: {
      baseStyle: {
        textTransform: "uppercase",
        borderRadius: "full",
      },
    },
  },
})

export default theme
