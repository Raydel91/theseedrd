import * as migration_20260422_221947_pg_baseline from './20260422_221947_pg_baseline';

export const migrations = [
  {
    up: migration_20260422_221947_pg_baseline.up,
    down: migration_20260422_221947_pg_baseline.down,
    name: '20260422_221947_pg_baseline'
  },
];
