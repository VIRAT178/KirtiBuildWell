const path = require('path')
const { spawnSync } = require('child_process')

const nodeModulesPath = path.join(process.cwd(), 'node_modules')
const executable = process.platform === 'win32' ? 'npx.cmd' : 'npx'

const result = spawnSync(executable, ['next', 'dev'], {
	stdio: 'inherit',
	env: {
		...process.env,
		NODE_PATH: nodeModulesPath,
	},
})

process.exit(result.status ?? 1)
