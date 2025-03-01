import logger from "./Logger/logger"

export class Exeption extends Error {
  code: number
  constructor(code: number, message: string) {
    super(message)
    this.code = code
    logger.error('gotError: ' + message)
  }
}