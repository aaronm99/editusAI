import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export function formatFileSize(sizeInBytes) {
  if (sizeInBytes >= Math.pow(1024, 3)) {
    return `${(sizeInBytes / Math.pow(1024, 3)).toFixed(2)} GB`
  } else {
    return `${(sizeInBytes / Math.pow(1024, 2)).toFixed(2)} MB`
  }
}
