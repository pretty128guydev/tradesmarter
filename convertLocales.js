/**
 * This file converts all .po to .po.json
 */
const fs = require('fs')
const execSync = require('child_process').execSync;

const main = () => {
    const locales = fs.readdirSync('translations/');
    const commands = locales.map((locale) => `npx ttag po2json translations/${locale} > src/core/translations/${locale}.json`)
    commands.forEach((command) => {
        console.log('Running: ', command)
        code = execSync(command);
    })
    process.exit(0);
}

main()