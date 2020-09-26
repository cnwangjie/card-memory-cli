import Redis from 'ioredis'
import _ from 'lodash'
import { eq, negate } from 'lodash/fp'

const getConn = () => {
  return new Redis()
}

const storage = {
  delete: async (key: string) => {
    const conn = getConn()
    return conn.del(key)
  },

  set: async (key: string, value: any) => {
    const conn = getConn()
    return conn.set(key, JSON.stringify(value))
  },

  get: async (key: string) => {
    const conn = getConn()
    const value = await conn.get(key)
    return JSON.parse(value)
  },
}

export const upsetWord = async (word: string, description: string) => {
  const wordList = await getWordList()
  await storage.set('wordList', _.union([...wordList, word]))
  return storage.set('word:' + word, { word, description })
}

export const deleteWord = async (word: string) => {
  const wordList = await getWordList()
  await storage.set('wordList', wordList.filter(negate(eq(word))))
  return storage.delete('word:' + word)
}

export const getWordList = async (): Promise<string[]> => {
  const wordList = await storage.get('wordList')
  if (!wordList) return []
  if (_.isObject(wordList)) return Object.values(wordList)
  return wordList
}

const stringifyItem = ({ word, description }) => word + ' ' + description

export const showAllWord = async () => {
  const wordList = await getWordList()
  const words = await Promise.all(wordList.map(getWord))
  console.log(words.map(stringifyItem).join('\n'))
}

export const getWord = async (word: string) => {
  return storage.get('word:' + word)
}

export const getWordRandomly = async () => {
  const wordList = await getWordList()
  const word = wordList[Math.random() * wordList.length << 0]
  const item = await getWord(word)
  console.log(stringifyItem(item))
}
