import * as migration_20260422_221947_pg_baseline from './20260422_221947_pg_baseline';
import * as migration_20260425_231500_add_site_config_currency_rate from './20260425_231500_add_site_config_currency_rate';
import * as migration_20260425_233500_users_profile_photo from './20260425_233500_users_profile_photo';
import * as migration_20260425_235800_team_members_published from './20260425_235800_team_members_published';
import * as migration_20260426_001500_team_members_linked_user from './20260426_001500_team_members_linked_user';

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
  {
    up: migration_20260425_235800_team_members_published.up,
    down: migration_20260425_235800_team_members_published.down,
    name: '20260425_235800_team_members_published'
  },
  {
    up: migration_20260426_001500_team_members_linked_user.up,
    down: migration_20260426_001500_team_members_linked_user.down,
    name: '20260426_001500_team_members_linked_user'
  },
];
