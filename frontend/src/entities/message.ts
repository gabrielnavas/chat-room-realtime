export enum MessageKind {
  Client = 'client',
  Server = 'server'
}

export type Message = {
  id: string
  name: string
  text: string
  kind: MessageKind
}