import commander from 'commander'
import { upsetWord, showAllWord, deleteWord, getWordRandomly } from './common'
import { importFile } from './import'

const handleError = (err: Error) => {
  process.stderr.write(err.stack)
  process.exit(1)
}

const normalExit = () => process.exit(0)

const buildAction = (fn: any) =>
  (...args: any[]) =>
    fn(...args).then(normalExit).catch(handleError)

const commands: any = [
  ['set <word> <description>', upsetWord],
  ['del <word>', deleteWord],
  ['list', showAllWord],
  ['import <filename>', importFile],
  ['rand', getWordRandomly],
]

commands
  .map(([desc, fn]) =>
    commander
      .command(desc)
      .action(buildAction(fn)))

commander.parse()
