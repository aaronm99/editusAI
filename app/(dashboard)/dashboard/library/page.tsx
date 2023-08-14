import { Metadata } from "next"
import Image from "next/image"

import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { AlbumArtwork } from "./components/album-artwork"
import { PodcastEmptyPlaceholder } from "./components/podcast-empty-placeholder"
import { madeForYouAlbums } from "./data/albums"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Music App",
  description: "Example music app using the components.",
}

export default function MusicPage() {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/music-light.png"
          width={1280}
          height={1114}
          alt="Music"
          className="block dark:hidden"
        />
        <Image
          src="/examples/music-dark.png"
          width={1280}
          height={1114}
          alt="Music"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden md:block">
        <div className="">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <div className="col-span-3 lg:col-span-4">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="all" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList>
                        <TabsTrigger value="all" className="relative">
                          All Videos
                        </TabsTrigger>
                        <TabsTrigger value="favourites">Favourites</TabsTrigger>
                        <TabsTrigger value="new">New</TabsTrigger>
                      </TabsList>
                      <div className="ml-auto mr-4">
                        <Button>
                          {/* <PlusCircledIcon className="mr-2 h-4 w-4" /> */}
                          Add videos
                        </Button>
                      </div>
                    </div>
                    <TabsContent
                      value="all"
                      className="border-none p-0 outline-none"
                    >
                      <div className="mt-6 space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Library
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          A library of videos for your use.
                        </p>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex flex-wrap pb-4">
                        {madeForYouAlbums.map((album) => (
                          <AlbumArtwork
                            key={album.name}
                            album={album}
                            className="mr-6 mt-3 w-[244px]"
                            aspectRatio="square"
                            width={450}
                            height={250}
                          />
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent
                      value="favourites"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            New Episodes
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Your favorite podcasts. Updated daily.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <PodcastEmptyPlaceholder />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
