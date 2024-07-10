/**
 * This file converts all .po to .po.json
 */
const fs = require('fs')
const execSync = require('child_process').execSync

const main = () => {
  const locales = fs.readdirSync('translations/')
  const commands = locales.map(
    (locale) => `npx ttag update translations/${locale} src`
  )
  commands.forEach((command) => {
    console.log('Running: ', command)
    execSync(command)
  })
  process.exit(0)
}

main()
