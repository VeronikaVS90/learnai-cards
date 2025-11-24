/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    SESSION_MAX_AGE_DAYS?: string;
  }
}
