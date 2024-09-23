import React from 'react'
import fs from 'fs'
import path from 'path'

export async function readDirectoryContents(directoryPath: string) {
  const directory = path.join(process.cwd(), 'public', directoryPath)
  try {
    const files = await fs.promises.readdir(directory)
    const filteredFiles = files.filter((file) => file !== '.DS_Store')
    return filteredFiles
  } catch (error) {
    console.error(`Error reading directory: ${directoryPath}`, error)
    return []
  }
}
