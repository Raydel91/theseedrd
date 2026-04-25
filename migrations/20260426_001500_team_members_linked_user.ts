import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "team_members"
    ADD COLUMN IF NOT EXISTS "linked_user_id" integer;
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'team_members_linked_user_id_users_id_fk'
      ) THEN
        ALTER TABLE "team_members"
        ADD CONSTRAINT "team_members_linked_user_id_users_id_fk"
        FOREIGN KEY ("linked_user_id") REFERENCES "public"."users"("id")
        ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "team_members_linked_user_idx"
    ON "team_members" USING btree ("linked_user_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "team_members_linked_user_idx";
  `)
  await db.execute(sql`
    ALTER TABLE "team_members"
    DROP CONSTRAINT IF EXISTS "team_members_linked_user_id_users_id_fk";
  `)
  await db.execute(sql`
    ALTER TABLE "team_members"
    DROP COLUMN IF EXISTS "linked_user_id";
  `)
}
