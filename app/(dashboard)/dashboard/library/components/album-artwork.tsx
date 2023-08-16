import Image from "next/image"

import { cn } from "@/lib/utils"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { Album } from "../data/albums"

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  album: Album
  aspectRatio?: "portrait" | "square"
  width?: number
  height?: number
}

export function AlbumArtwork({
  album,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: AlbumArtworkProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="cursor-pointer overflow-hidden rounded-md">
            <Image
              src={album.cover}
              alt={album.name}
              width={width}
              height={height}
              className={cn(
                "aspect-video h-auto w-auto object-cover transition-all hover:scale-105"
              )}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40 ">
          <ContextMenuItem className="cursor-pointer">
            Add to Favourites
          </ContextMenuItem>
          <ContextMenuItem className="cursor-pointer text-red-500">
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{album.name}</h3>
        <p className="text-xs text-muted-foreground">{album.artist}</p>
      </div>
    </div>
  )
}
