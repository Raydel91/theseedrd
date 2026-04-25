import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "profile_photo_id" integer;
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'users_profile_photo_id_media_id_fk'
      ) THEN
        ALTER TABLE "users"
        ADD CONSTRAINT "users_profile_photo_id_media_id_fk"
        FOREIGN KEY ("profile_photo_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users"
    DROP CONSTRAINT IF EXISTS "users_profile_photo_id_media_id_fk";
  `)
  await db.execute(sql`
    ALTER TABLE "users"
    DROP COLUMN IF EXISTS "profile_photo_id";
  `)
}
