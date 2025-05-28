/// <reference types="vite/client" />

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.json' {
  const value: any;
  export default value;
}
