import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_users_account_kind" AS ENUM('client', 'internal');
  CREATE TYPE "public"."enum_property_tags_tag_category" AS ENUM('general', 'style', 'location');
  CREATE TYPE "public"."enum_property_amenities_amenity_category" AS ENUM('exterior', 'community', 'interior', 'luxury');
  CREATE TYPE "public"."enum_properties_rd_division" AS ENUM('distrito-nacional__distrito-nacional-santo-domingo', 'azua__azua-de-compostela', 'azua__estebania', 'azua__guayabal', 'azua__las-charcas', 'azua__las-yayas-de-viajama', 'azua__padre-las-casas', 'azua__peralta', 'azua__pueblo-viejo', 'azua__sabana-yegua', 'azua__tabara-arriba', 'bahoruco__neiba', 'bahoruco__galvan', 'bahoruco__los-rios', 'bahoruco__tamayo', 'bahoruco__villa-jaragua', 'barahona__barahona-santa-cruz-de-barahona', 'barahona__cabral', 'barahona__el-penon', 'barahona__enriquillo', 'barahona__fundacion', 'barahona__jaquimeyes', 'barahona__la-cienaga', 'barahona__las-salinas', 'barahona__paraiso', 'barahona__polo', 'barahona__vicente-noble', 'dajabon__dajabon', 'dajabon__el-pino', 'dajabon__loma-de-cabrera', 'dajabon__partido', 'dajabon__restauracion', 'duarte__san-francisco-de-macoris', 'duarte__arenoso', 'duarte__castillo', 'duarte__eugenio-maria-de-hostos', 'duarte__las-guaranas', 'duarte__pimentel', 'duarte__villa-riva', 'el-seibo__el-seibo-santa-cruz-de-el-seibo', 'el-seibo__miches', 'elias-pina__comendador', 'elias-pina__banica', 'elias-pina__el-llano', 'elias-pina__hondo-valle', 'elias-pina__juan-santiago', 'elias-pina__pedro-santana', 'espaillat__moca', 'espaillat__cayetano-germosen', 'espaillat__gaspar-hernandez', 'espaillat__jamao-al-norte', 'hato-mayor__hato-mayor-del-rey', 'hato-mayor__el-valle', 'hato-mayor__sabana-de-la-mar', 'hermanas-mirabal__salcedo', 'hermanas-mirabal__tenares', 'hermanas-mirabal__villa-tapia', 'independencia__jimani', 'independencia__cristobal', 'independencia__duverge', 'independencia__la-descubierta', 'independencia__mella', 'independencia__postrer-rio', 'la-altagracia__higuey-salvaleon-de-higuey', 'la-altagracia__san-rafael-del-yuma', 'la-romana__la-romana', 'la-romana__guaymate', 'la-romana__villa-hermosa', 'la-vega__la-vega-concepcion-de-la-vega', 'la-vega__constanza', 'la-vega__jarabacoa', 'la-vega__jima-abajo', 'maria-trinidad-sanchez__nagua', 'maria-trinidad-sanchez__cabrera', 'maria-trinidad-sanchez__el-factor', 'maria-trinidad-sanchez__rio-san-juan', 'monsenor-nouel__bonao', 'monsenor-nouel__maimon', 'monsenor-nouel__piedra-blanca', 'monte-cristi__monte-cristi-san-fernando-de-monte-cristi', 'monte-cristi__castanuelas', 'monte-cristi__guayubin', 'monte-cristi__las-matas-de-santa-cruz', 'monte-cristi__pepillo-salcedo', 'monte-cristi__villa-vasquez', 'monte-plata__monte-plata', 'monte-plata__bayaguana', 'monte-plata__peralvillo', 'monte-plata__sabana-grande-de-boya', 'monte-plata__yamasa', 'pedernales__pedernales', 'pedernales__oviedo', 'peravia__bani', 'peravia__nizao', 'puerto-plata__puerto-plata', 'puerto-plata__altamira', 'puerto-plata__guananico', 'puerto-plata__imbert', 'puerto-plata__los-hidalgos', 'puerto-plata__luperon', 'puerto-plata__sosua', 'puerto-plata__villa-isabela', 'puerto-plata__villa-montellano', 'samana__samana-santa-barbara-de-samana', 'samana__las-terrenas', 'samana__sanchez', 'san-cristobal__san-cristobal', 'san-cristobal__bajos-de-haina', 'san-cristobal__cambita-garabitos', 'san-cristobal__los-cacaos', 'san-cristobal__sabana-grande-de-palenque', 'san-cristobal__san-gregorio-de-nigua', 'san-cristobal__villa-altagracia', 'san-cristobal__yaguate', 'san-jose-de-ocoa__san-jose-de-ocoa', 'san-jose-de-ocoa__rancho-arriba', 'san-jose-de-ocoa__sabana-larga', 'san-juan__san-juan-de-la-maguana', 'san-juan__bohechio', 'san-juan__el-cercado', 'san-juan__juan-de-herrera', 'san-juan__las-matas-de-farfan', 'san-juan__vallejuelo', 'san-pedro-de-macoris__san-pedro-de-macoris', 'san-pedro-de-macoris__consuelo', 'san-pedro-de-macoris__guayacanes', 'san-pedro-de-macoris__quisqueya', 'san-pedro-de-macoris__ramon-santana', 'san-pedro-de-macoris__san-jose-de-los-llanos', 'sanchez-ramirez__cotui', 'sanchez-ramirez__cevicos', 'sanchez-ramirez__fantino', 'sanchez-ramirez__la-mata', 'santiago__santiago-de-los-caballeros', 'santiago__bisono-navarrete', 'santiago__janico', 'santiago__licey-al-medio', 'santiago__punal', 'santiago__sabana-iglesia', 'santiago__san-jose-de-las-matas', 'santiago__tamboril', 'santiago__villa-gonzalez', 'santiago-rodriguez__san-ignacio-de-sabaneta', 'santiago-rodriguez__los-almacigos', 'santiago-rodriguez__moncion', 'santo-domingo__santo-domingo-este', 'santo-domingo__boca-chica', 'santo-domingo__los-alcarrizos', 'santo-domingo__pedro-brand', 'santo-domingo__san-antonio-de-guerra', 'santo-domingo__santo-domingo-norte', 'santo-domingo__santo-domingo-oeste', 'valverde__mao-santa-cruz-de-mao', 'valverde__esperanza', 'valverde__laguna-salada');
  CREATE TYPE "public"."enum_clients_case_stage" AS ENUM('intake', 'documentation', 'legal', 'housing', 'integration', 'completed');
  CREATE TYPE "public"."enum_referrals_status" AS ENUM('pending', 'qualified', 'paid', 'rejected');
  CREATE TYPE "public"."enum_consultation_messages_source" AS ENUM('public_form', 'client_portal');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"account_kind" "enum_users_account_kind" DEFAULT 'client' NOT NULL,
  	"is_staff" boolean DEFAULT false,
  	"is_admin" boolean DEFAULT false,
  	"referral_code" varchar,
  	"total_referral_earnings" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"photo_id" integer NOT NULL,
  	"bio" varchar,
  	"linkedin" varchar,
  	"instagram" varchar,
  	"whatsapp" varchar,
  	"facebook" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_name" varchar NOT NULL,
  	"photo_id" integer,
  	"quote" varchar NOT NULL,
  	"nationality" varchar,
  	"rating" numeric DEFAULT 5,
  	"featured" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "packages_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "packages_features_locales" (
  	"item" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "packages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"price" numeric NOT NULL,
  	"highlighted" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "packages_locales" (
  	"title" varchar NOT NULL,
  	"short_description" varchar,
  	"billing_note" varchar DEFAULT 'por caso',
  	"cta_label" varchar DEFAULT 'Solicitar',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "house_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "house_types_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "property_tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"tag_category" "enum_property_tags_tag_category" DEFAULT 'general' NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "property_tags_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "property_amenities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"amenity_category" "enum_property_amenities_amenity_category" DEFAULT 'exterior' NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "property_amenities_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "properties_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "properties" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"house_type_id" integer NOT NULL,
  	"rd_division" "enum_properties_rd_division" NOT NULL,
  	"price" numeric NOT NULL,
  	"beds" numeric DEFAULT 2,
  	"baths" numeric DEFAULT 2,
  	"sqm" numeric,
  	"cover_image_id" integer NOT NULL,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "properties_locales" (
  	"title" varchar NOT NULL,
  	"location" varchar NOT NULL,
  	"street_address" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "properties_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"property_tags_id" integer,
  	"property_amenities_id" integer
  );
  
  CREATE TABLE "blog_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog_posts_locales" (
  	"title" varchar NOT NULL,
  	"excerpt" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "clients_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"completed" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0
  );
  
  CREATE TABLE "clients_timeline_locales" (
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "clients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar,
  	"phone" varchar,
  	"portal_user_id" integer,
  	"case_stage" "enum_clients_case_stage" DEFAULT 'intake',
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "referrals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"referrer_id" integer NOT NULL,
  	"invitee_name" varchar NOT NULL,
  	"invitee_email" varchar,
  	"status" "enum_referrals_status" DEFAULT 'pending',
  	"commission_amount" numeric DEFAULT 0,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "consultation_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum_consultation_messages_source" NOT NULL,
  	"from_user_id" integer,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"subject" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"read_at" timestamp(3) with time zone,
  	"read_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "consultation_read_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"read_at" timestamp(3) with time zone NOT NULL,
  	"read_by_id" integer,
  	"source" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"team_members_id" integer,
  	"testimonials_id" integer,
  	"packages_id" integer,
  	"house_types_id" integer,
  	"property_tags_id" integer,
  	"property_amenities_id" integer,
  	"properties_id" integer,
  	"blog_posts_id" integer,
  	"clients_id" integer,
  	"referrals_id" integer,
  	"consultation_messages_id" integer,
  	"consultation_read_logs_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_email" varchar NOT NULL,
  	"whatsapp_phone" varchar DEFAULT '18095551234' NOT NULL,
  	"rnc" varchar,
  	"instagram_url" varchar,
  	"facebook_url" varchar,
  	"map_embed_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_config_locales" (
  	"address_line" varchar,
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"welcome_text" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "referral_settings_rules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "referral_settings_rules_locales" (
  	"rule" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "referral_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"commission_percent" numeric DEFAULT 10,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "referral_settings_locales" (
  	"headline" varchar,
  	"body" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "admin_registry" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"primary_admin_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "packages_features" ADD CONSTRAINT "packages_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "packages_features_locales" ADD CONSTRAINT "packages_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."packages_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "packages_locales" ADD CONSTRAINT "packages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "packages_locales" ADD CONSTRAINT "packages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "house_types_locales" ADD CONSTRAINT "house_types_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."house_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "property_tags_locales" ADD CONSTRAINT "property_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."property_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "property_amenities_locales" ADD CONSTRAINT "property_amenities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."property_amenities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_gallery" ADD CONSTRAINT "properties_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_gallery" ADD CONSTRAINT "properties_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties" ADD CONSTRAINT "properties_house_type_id_house_types_id_fk" FOREIGN KEY ("house_type_id") REFERENCES "public"."house_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties" ADD CONSTRAINT "properties_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_locales" ADD CONSTRAINT "properties_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_locales" ADD CONSTRAINT "properties_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_rels" ADD CONSTRAINT "properties_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_rels" ADD CONSTRAINT "properties_rels_property_tags_fk" FOREIGN KEY ("property_tags_id") REFERENCES "public"."property_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_rels" ADD CONSTRAINT "properties_rels_property_amenities_fk" FOREIGN KEY ("property_amenities_id") REFERENCES "public"."property_amenities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_locales" ADD CONSTRAINT "blog_posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts_locales" ADD CONSTRAINT "blog_posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients_timeline" ADD CONSTRAINT "clients_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients_timeline_locales" ADD CONSTRAINT "clients_timeline_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clients_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients" ADD CONSTRAINT "clients_portal_user_id_users_id_fk" FOREIGN KEY ("portal_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_id_users_id_fk" FOREIGN KEY ("referrer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "consultation_messages" ADD CONSTRAINT "consultation_messages_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "consultation_messages" ADD CONSTRAINT "consultation_messages_read_by_id_users_id_fk" FOREIGN KEY ("read_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "consultation_read_logs" ADD CONSTRAINT "consultation_read_logs_read_by_id_users_id_fk" FOREIGN KEY ("read_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_packages_fk" FOREIGN KEY ("packages_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_house_types_fk" FOREIGN KEY ("house_types_id") REFERENCES "public"."house_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_property_tags_fk" FOREIGN KEY ("property_tags_id") REFERENCES "public"."property_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_property_amenities_fk" FOREIGN KEY ("property_amenities_id") REFERENCES "public"."property_amenities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_properties_fk" FOREIGN KEY ("properties_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_referrals_fk" FOREIGN KEY ("referrals_id") REFERENCES "public"."referrals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consultation_messages_fk" FOREIGN KEY ("consultation_messages_id") REFERENCES "public"."consultation_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consultation_read_logs_fk" FOREIGN KEY ("consultation_read_logs_id") REFERENCES "public"."consultation_read_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config_locales" ADD CONSTRAINT "site_config_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_config_locales" ADD CONSTRAINT "site_config_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "referral_settings_rules" ADD CONSTRAINT "referral_settings_rules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."referral_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "referral_settings_rules_locales" ADD CONSTRAINT "referral_settings_rules_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."referral_settings_rules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "referral_settings_locales" ADD CONSTRAINT "referral_settings_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "referral_settings_locales" ADD CONSTRAINT "referral_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."referral_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admin_registry" ADD CONSTRAINT "admin_registry_primary_admin_id_users_id_fk" FOREIGN KEY ("primary_admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "users_referral_code_idx" ON "users" USING btree ("referral_code");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "team_members_photo_idx" ON "team_members" USING btree ("photo_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE INDEX "testimonials_photo_idx" ON "testimonials" USING btree ("photo_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "packages_features_order_idx" ON "packages_features" USING btree ("_order");
  CREATE INDEX "packages_features_parent_id_idx" ON "packages_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "packages_features_locales_locale_parent_id_unique" ON "packages_features_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "packages_slug_idx" ON "packages" USING btree ("slug");
  CREATE INDEX "packages_updated_at_idx" ON "packages" USING btree ("updated_at");
  CREATE INDEX "packages_created_at_idx" ON "packages" USING btree ("created_at");
  CREATE INDEX "packages_meta_meta_image_idx" ON "packages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "packages_locales_locale_parent_id_unique" ON "packages_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "house_types_slug_idx" ON "house_types" USING btree ("slug");
  CREATE INDEX "house_types_updated_at_idx" ON "house_types" USING btree ("updated_at");
  CREATE INDEX "house_types_created_at_idx" ON "house_types" USING btree ("created_at");
  CREATE UNIQUE INDEX "house_types_locales_locale_parent_id_unique" ON "house_types_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "property_tags_slug_idx" ON "property_tags" USING btree ("slug");
  CREATE INDEX "property_tags_updated_at_idx" ON "property_tags" USING btree ("updated_at");
  CREATE INDEX "property_tags_created_at_idx" ON "property_tags" USING btree ("created_at");
  CREATE UNIQUE INDEX "property_tags_locales_locale_parent_id_unique" ON "property_tags_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "property_amenities_slug_idx" ON "property_amenities" USING btree ("slug");
  CREATE INDEX "property_amenities_updated_at_idx" ON "property_amenities" USING btree ("updated_at");
  CREATE INDEX "property_amenities_created_at_idx" ON "property_amenities" USING btree ("created_at");
  CREATE UNIQUE INDEX "property_amenities_locales_locale_parent_id_unique" ON "property_amenities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "properties_gallery_order_idx" ON "properties_gallery" USING btree ("_order");
  CREATE INDEX "properties_gallery_parent_id_idx" ON "properties_gallery" USING btree ("_parent_id");
  CREATE INDEX "properties_gallery_image_idx" ON "properties_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "properties_slug_idx" ON "properties" USING btree ("slug");
  CREATE INDEX "properties_house_type_idx" ON "properties" USING btree ("house_type_id");
  CREATE INDEX "properties_cover_image_idx" ON "properties" USING btree ("cover_image_id");
  CREATE INDEX "properties_updated_at_idx" ON "properties" USING btree ("updated_at");
  CREATE INDEX "properties_created_at_idx" ON "properties" USING btree ("created_at");
  CREATE INDEX "properties_meta_meta_image_idx" ON "properties_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "properties_locales_locale_parent_id_unique" ON "properties_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "properties_rels_order_idx" ON "properties_rels" USING btree ("order");
  CREATE INDEX "properties_rels_parent_idx" ON "properties_rels" USING btree ("parent_id");
  CREATE INDEX "properties_rels_path_idx" ON "properties_rels" USING btree ("path");
  CREATE INDEX "properties_rels_property_tags_id_idx" ON "properties_rels" USING btree ("property_tags_id");
  CREATE INDEX "properties_rels_property_amenities_id_idx" ON "properties_rels" USING btree ("property_amenities_id");
  CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");
  CREATE INDEX "blog_posts_updated_at_idx" ON "blog_posts" USING btree ("updated_at");
  CREATE INDEX "blog_posts_created_at_idx" ON "blog_posts" USING btree ("created_at");
  CREATE INDEX "blog_posts_meta_meta_image_idx" ON "blog_posts_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "blog_posts_locales_locale_parent_id_unique" ON "blog_posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "clients_timeline_order_idx" ON "clients_timeline" USING btree ("_order");
  CREATE INDEX "clients_timeline_parent_id_idx" ON "clients_timeline" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "clients_timeline_locales_locale_parent_id_unique" ON "clients_timeline_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "clients_portal_user_idx" ON "clients" USING btree ("portal_user_id");
  CREATE INDEX "clients_updated_at_idx" ON "clients" USING btree ("updated_at");
  CREATE INDEX "clients_created_at_idx" ON "clients" USING btree ("created_at");
  CREATE INDEX "referrals_referrer_idx" ON "referrals" USING btree ("referrer_id");
  CREATE INDEX "referrals_updated_at_idx" ON "referrals" USING btree ("updated_at");
  CREATE INDEX "referrals_created_at_idx" ON "referrals" USING btree ("created_at");
  CREATE INDEX "consultation_messages_from_user_idx" ON "consultation_messages" USING btree ("from_user_id");
  CREATE INDEX "consultation_messages_read_by_idx" ON "consultation_messages" USING btree ("read_by_id");
  CREATE INDEX "consultation_messages_updated_at_idx" ON "consultation_messages" USING btree ("updated_at");
  CREATE INDEX "consultation_messages_created_at_idx" ON "consultation_messages" USING btree ("created_at");
  CREATE INDEX "consultation_read_logs_read_by_idx" ON "consultation_read_logs" USING btree ("read_by_id");
  CREATE INDEX "consultation_read_logs_updated_at_idx" ON "consultation_read_logs" USING btree ("updated_at");
  CREATE INDEX "consultation_read_logs_created_at_idx" ON "consultation_read_logs" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_packages_id_idx" ON "payload_locked_documents_rels" USING btree ("packages_id");
  CREATE INDEX "payload_locked_documents_rels_house_types_id_idx" ON "payload_locked_documents_rels" USING btree ("house_types_id");
  CREATE INDEX "payload_locked_documents_rels_property_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("property_tags_id");
  CREATE INDEX "payload_locked_documents_rels_property_amenities_id_idx" ON "payload_locked_documents_rels" USING btree ("property_amenities_id");
  CREATE INDEX "payload_locked_documents_rels_properties_id_idx" ON "payload_locked_documents_rels" USING btree ("properties_id");
  CREATE INDEX "payload_locked_documents_rels_blog_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_posts_id");
  CREATE INDEX "payload_locked_documents_rels_clients_id_idx" ON "payload_locked_documents_rels" USING btree ("clients_id");
  CREATE INDEX "payload_locked_documents_rels_referrals_id_idx" ON "payload_locked_documents_rels" USING btree ("referrals_id");
  CREATE INDEX "payload_locked_documents_rels_consultation_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("consultation_messages_id");
  CREATE INDEX "payload_locked_documents_rels_consultation_read_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("consultation_read_logs_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_config_meta_meta_image_idx" ON "site_config_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "site_config_locales_locale_parent_id_unique" ON "site_config_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "referral_settings_rules_order_idx" ON "referral_settings_rules" USING btree ("_order");
  CREATE INDEX "referral_settings_rules_parent_id_idx" ON "referral_settings_rules" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "referral_settings_rules_locales_locale_parent_id_unique" ON "referral_settings_rules_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "referral_settings_meta_meta_image_idx" ON "referral_settings_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "referral_settings_locales_locale_parent_id_unique" ON "referral_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "admin_registry_primary_admin_idx" ON "admin_registry" USING btree ("primary_admin_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "packages_features" CASCADE;
  DROP TABLE "packages_features_locales" CASCADE;
  DROP TABLE "packages" CASCADE;
  DROP TABLE "packages_locales" CASCADE;
  DROP TABLE "house_types" CASCADE;
  DROP TABLE "house_types_locales" CASCADE;
  DROP TABLE "property_tags" CASCADE;
  DROP TABLE "property_tags_locales" CASCADE;
  DROP TABLE "property_amenities" CASCADE;
  DROP TABLE "property_amenities_locales" CASCADE;
  DROP TABLE "properties_gallery" CASCADE;
  DROP TABLE "properties" CASCADE;
  DROP TABLE "properties_locales" CASCADE;
  DROP TABLE "properties_rels" CASCADE;
  DROP TABLE "blog_posts" CASCADE;
  DROP TABLE "blog_posts_locales" CASCADE;
  DROP TABLE "clients_timeline" CASCADE;
  DROP TABLE "clients_timeline_locales" CASCADE;
  DROP TABLE "clients" CASCADE;
  DROP TABLE "referrals" CASCADE;
  DROP TABLE "consultation_messages" CASCADE;
  DROP TABLE "consultation_read_logs" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_config" CASCADE;
  DROP TABLE "site_config_locales" CASCADE;
  DROP TABLE "referral_settings_rules" CASCADE;
  DROP TABLE "referral_settings_rules_locales" CASCADE;
  DROP TABLE "referral_settings" CASCADE;
  DROP TABLE "referral_settings_locales" CASCADE;
  DROP TABLE "admin_registry" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_account_kind";
  DROP TYPE "public"."enum_property_tags_tag_category";
  DROP TYPE "public"."enum_property_amenities_amenity_category";
  DROP TYPE "public"."enum_properties_rd_division";
  DROP TYPE "public"."enum_clients_case_stage";
  DROP TYPE "public"."enum_referrals_status";
  DROP TYPE "public"."enum_consultation_messages_source";`)
}
