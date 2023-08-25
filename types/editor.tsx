export type PageProps = {
  nextStep: () => void
  prevStep: () => void
}

export interface PageOneProps extends PageProps {
  file: File | undefined
  form: any
  isDragging: boolean
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void
  onClick: () => void
}

export interface PageTwoProps extends PageProps {
  file: File | undefined
  form: any
  isDragging: boolean
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void
  onClick: () => void
}

export interface PageThreeProps extends PageProps {
  form: any
  setScreenPosition: (e) => void
  screenPosition: number
}
export interface PageFourProps extends PageProps {
  form: any
  handleCallback: () => void
  screenPosition: number
  loading?: boolean
}

export type FontType = {
  family: string
  variants: string[]
  subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"]
  version: string
  lastModified: string
  files: {
    "100": string
    "200": string
    "300": string
    "500": string
    "600": string
    "700": string
    "800": string
    "900": string
    regular: string
    "100italic": string
  }
  category: string
  kind: string
  menu: string
}

export type SelectedFontProps = {
  family: string | null
  variants: string[]
}
