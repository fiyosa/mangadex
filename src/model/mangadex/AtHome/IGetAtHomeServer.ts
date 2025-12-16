export type IGetAtHomeServer = {
  result: string
  baseUrl: string
  chapter: {
    hash: string
    data: Array<string>
    dataSaver: Array<string>
  }
}
