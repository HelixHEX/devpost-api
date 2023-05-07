declare namespace NodeJs {
  export interface ProcessEnv {
    TOKEN_SECRET: string;
    DATABASE_URL: string;
    PORT?: string;
  }
}