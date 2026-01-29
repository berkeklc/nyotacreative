import { parse } from 'pg-connection-string';
import path from 'path';

export default ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');

  const connections = {
    mysql: {
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    },
    postgres: {}, // Handled dynamically below
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };

  // Special handling for Postgres to support Railway/Heroku URL style
  if (client === 'postgres') {
    const dbUrl = env('DATABASE_URL');
    console.log(`[DB-DEBUG] Configured for Postgres with URL.`);

    let connectionConfig: any = {};

    if (dbUrl) {
      try {
        const parsed = parse(dbUrl);
        console.log(`[DB-DEBUG] Parsed URL - Host: ${parsed.host}, DB: ${parsed.database}, User: ${parsed.user}`);

        // Railway internal connections MUST NOT have SSL enabled.
        // External connections (e.g. from local dev) MUST have SSL enabled.
        const isInternal = parsed.host && parsed.host.includes('railway.internal');
        const sslConfig = isInternal ? false : { rejectUnauthorized: false };

        console.log(`[DB-DEBUG] Host is ${isInternal ? 'INTERNAL' : 'EXTERNAL'}. SSL: ${JSON.stringify(sslConfig)}`);

        connectionConfig = {
          host: parsed.host,
          port: parsed.port ? parseInt(parsed.port) : 5432,
          database: parsed.database,
          user: parsed.user,
          password: parsed.password,
          ssl: sslConfig,
        };
      } catch (err: any) {
        console.error('[DB-DEBUG] Failed to parse DATABASE_URL:', err.message);
      }
    } else {
      // Fallback to individual env vars if no URL
      connectionConfig = {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: { rejectUnauthorized: false },
      };
    }

    return {
      connection: {
        client,
        connection: connectionConfig,
        pool: {
          min: 0,
          max: env.int('DATABASE_POOL_MAX', 10),
          acquireTimeoutMillis: 60000,
          createTimeoutMillis: 30000,
          idleTimeoutMillis: 30000,
          reapIntervalMillis: 1000,
          createRetryIntervalMillis: 100,
        },
        acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
      },
    };
  }

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
