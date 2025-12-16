export const getImageCover = (manga_id: string, path: any) => {
  return `https://mangadex.org/covers/${manga_id}/${path}`
}

export const getImageChapter = (hash: string, path: any) => {
  return `https://cmdxd98sb0x3yprd.mangadex.network/data/${hash}/${path}`
}
