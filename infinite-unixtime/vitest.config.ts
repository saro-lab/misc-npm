import { defineConfig } from 'vitest/config'


export default defineConfig({
    test: {
        testTimeout: 120000,
        disableConsoleIntercept: true,
        printConsoleTrace: true,
        dangerouslyIgnoreUnhandledErrors: true,
    },
})
