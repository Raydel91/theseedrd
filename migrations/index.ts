import * as migration_20260422_221947_pg_baseline from './20260422_221947_pg_baseline';
import * as migration_20260425_231500_add_site_config_currency_rate from './20260425_231500_add_site_config_currency_rate';
import * as migration_20260425_233500_users_profile_photo from './20260425_233500_users_profile_photo';

export const migrations = [
  {
    up: migration_20260422_221947_pg_baseline.up,
    down: migration_20260422_221947_pg_baseline.down,
    name: '20260422_221947_pg_baseline'
  },
  {
    up: migration_20260425_231500_add_site_config_currency_rate.up,
    down: migration_20260425_231500_add_site_config_currency_rate.down,
    name: '20260425_231500_add_site_config_currency_rate'
  },
  {
    up: migration_20260425_233500_users_profile_photo.up,
    down: migration_20260425_233500_users_profile_photo.down,
    name: '20260425_233500_users_profile_photo'
  },
];
