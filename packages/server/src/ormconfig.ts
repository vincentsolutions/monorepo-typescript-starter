import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'backend_root',
    password: 'root',
    database: 'monorepo',
    entities: [
        __dirname + '/**/*.entity{.ts,.js}',
        // __dirname + '/**/*.repository{.ts,.js}'
    ],
    // @ts-ignore
    autoloadEntities: true,
    synchronize: false,
    migrationsRun: true,
    logging: true,
    logger: 'file',
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {
        migrationsDir: 'src/migrations'
    }
}

export = config;