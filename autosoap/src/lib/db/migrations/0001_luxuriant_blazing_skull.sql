CREATE TABLE IF NOT EXISTS "notes" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
