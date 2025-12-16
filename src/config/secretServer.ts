const secretServer = {
  API_URL_COMIC_ART: `${process.env.NEXT_API_URL_COMIC_ART ?? 'https://comick.art'}`,
  API_URL_COMIC_DEV: `${process.env.NEXT_API_URL_COMIC_DEV ?? 'https://api.mangadex.org'}`,
  API_URL_MANGADEX: `${process.env.NEXT_API_URL_MANGADEX ?? 'https://api.mangadex.org'}`,
}

export default secretServer
