export type IGetCoverById = {
  result: string
  response: string
  data: {
    id: string
    type: string
    attributes: {
      volume: string
      fileName: string
      description: string
      locale: string
      version: number
      createdAt: string
      updatedAt: string
    }
    relationships: Array<{
      id: string
      type: string
      related: string
      attributes: {}
    }>
  }
}
