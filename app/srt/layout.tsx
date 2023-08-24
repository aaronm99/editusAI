interface SrtProps {
  children?: React.ReactNode
}

export default function SrtLayout({ children }: SrtProps) {
  return (
    <div className="container mx-auto grid items-start gap-10 py-8">
      {children}
    </div>
  )
}
