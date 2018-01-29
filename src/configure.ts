export type It = (name: string, fn: ItFunction) => void
export type ItFunction = (done?: () => void) => Promise<void> | void

export type Describe = (name: string, fn: DescribeFunction) => void
export type DescribeFunction = () => Promise<void> | void

export interface ConfigureOptions {
    it: It,
    itOnly?: It,
    describe: Describe,
    describeOnly: Describe
}

declare var global: any
// Shamelessly adapted from https://github.com/purposeindustries/window-or-global
const globalOrWindow = (typeof self === "object" && self.self === self && self) ||
  (typeof global === "object" && global.global === global && global)

export const configuration: ConfigureOptions = {
    it: (globalOrWindow as any).it,
    describe: (globalOrWindow as any).describe,
    describeOnly: (globalOrWindow as any).describe.only,
    itOnly: (globalOrWindow as any).it.only,
}

export function configure(options: ConfigureOptions) {
    Object.assign(configuration, options)
}
