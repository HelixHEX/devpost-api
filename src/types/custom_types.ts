import 'express'

declare module 'express' {
  interface Rquest {
    user?: User;
  }
}