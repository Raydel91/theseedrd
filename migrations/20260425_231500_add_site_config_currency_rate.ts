import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_config"
    ADD COLUMN IF NOT EXISTS "property_usd_to_dop_rate" numeric DEFAULT 60;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_config"
    DROP COLUMN IF EXISTS "property_usd_to_dop_rate";
  `)
}
