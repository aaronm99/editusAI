import localFont from "next/font/local"

const arialBoldItalic = localFont({
  src: "../assets/fonts/Arial-Bold-Italic.ttf",
  adjustFontFallback: "Arial",
})

const arialBold = localFont({
  src: "../assets/fonts/Arial-Bold.ttf",
})

const helveticaBold = localFont({
  src: "../assets/fonts/Helvetica-Bold.ttf",
})

const komikaAxis = localFont({
  src: "../assets/fonts/Komika-Axis.ttf",
})

const merriweatherBold = localFont({
  src: "../assets/fonts/Merriweather-Bold.ttf",
})

const merriweatherBoldItalic = localFont({
  src: "../assets/fonts/Merriweather-Bold-Italic.ttf",
})

const montserratBold = localFont({
  src: "../assets/fonts/Montserrat-Bold.ttf",
})

const montserratBoldItalic = localFont({
  src: "../assets/fonts/Montserrat-Bold-Italic.ttf",
})

const proximaNovaBlack = localFont({
  src: "../assets/fonts/Proxima-Nova-Black.otf",
})

const proximaNovaBlackItalic = localFont({
  src: "../assets/fonts/Proxima-Nova-Black-Italic.otf",
})

const robotoBold = localFont({
  src: "../assets/fonts/Roboto-Bold.ttf",
})

const robotoBoldItalic = localFont({
  src: "../assets/fonts/Roboto-Bold-Italic.ttf",
})

const theBoldFont = localFont({
  src: "../assets/fonts/The-Bold-Font.ttf",
})

export const fonts = [
  {
    name: "Arial Bold Italic",
    value: arialBoldItalic,
  },
  {
    name: "Arial Bold",
    value: arialBold,
  },
  {
    name: "Helvetica Bold",
    value: helveticaBold,
  },
  {
    name: "Komika Axis",
    value: komikaAxis,
  },
  {
    name: "Merriweather Bold",
    value: merriweatherBold,
  },
  {
    name: "Merriweather Bold Italic",
    value: merriweatherBoldItalic,
  },
  {
    name: "Montserrat Bold",
    value: montserratBold,
  },
  {
    name: "Montserrat Bold Italic",
    value: montserratBoldItalic,
  },
  {
    name: "Proxima Nova Black",
    value: proximaNovaBlack,
  },
  {
    name: "Proxima Nova Black Italic",
    value: proximaNovaBlackItalic,
  },
  {
    name: "Roboto Bold",
    value: robotoBold,
  },
  {
    name: "Roboto Bold Italic",
    value: robotoBoldItalic,
  },
  {
    name: "The Bold Font",
    value: theBoldFont,
  },
]
