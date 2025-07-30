export const logger = {
    info: (msg: string) => console.log(`ℹ️  ${msg}`),
    warn: (msg: string) => console.warn(`⚠️  ${msg}`),
    error: (msg: string) => console.error(`❌ ${msg}`),
    success: (msg: string) => console.log(`✅ ${msg}`)
  };
  