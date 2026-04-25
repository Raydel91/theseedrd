import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "team_members"
    ADD COLUMN IF NOT EXISTS "published" boolean DEFAULT true;
  `)

  await db.execute(sql`
    UPDATE "team_members"
    SET "published" = true
    WHERE "published" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "team_members"
    DROP COLUMN IF EXISTS "published";
  `)
}
