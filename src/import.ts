import { promises } from 'fs'
import path from 'path'
import { upsetWord } from './common'

const { readFile } = promises

export const importFile = async (filename: string) => {
  const filePath = path.resolve(process.cwd(), filename)
  const data = await readFile(filePath)
  const value = data.toString()
  for (const line of value.split('\n')) {
    if (!line) continue
    const [word, ...description] = line.split(' ')
    if (!word) continue
    await upsetWord(word, description.join(' '))
  }
}
