'use server'

import * as winston from 'winston'
import * as path from 'path'

const createLogger = (transports: winston.transport[]) => {
  return winston.createLogger({
    format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
    transports: transports,
  })
}

export const getFileLogger = async () => {
  const fileTransport = new winston.transports.File({
    filename: path.resolve('./logs/next.log'),
    format: winston.format.combine(
      winston.format.printf((info) => {
        const message = typeof info.message === 'object' ? JSON.stringify(info.message, null, 2) : info.message
        return `${info.timestamp} ${info.level}: ${message}`
      })
    ),
  })
  return createLogger([fileTransport])
}

export const getConsoleLogger = async () => {
  const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf((info) => {
        const message = typeof info.message === 'object' ? JSON.stringify(info.message, null, 2) : info.message
        return `${info.timestamp} ${info.level}: ${message}`
      })
    ),
  })
  return createLogger([consoleTransport])
}
