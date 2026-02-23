CREATE TABLE IF NOT EXISTS "categories" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "icon" text,
  "color_token" text,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_archived" integer DEFAULT 0 NOT NULL,
  "created_at" integer NOT NULL,
  "updated_at" integer NOT NULL,
  "deleted_at" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expenses" (
  "id" text PRIMARY KEY NOT NULL,
  "amount_minor" integer NOT NULL,
  "currency" text DEFAULT 'USD' NOT NULL,
  "category_id" text NOT NULL,
  "occurred_at" integer NOT NULL,
  "note" text,
  "merchant" text,
  "payment_method" text,
  "created_at" integer NOT NULL,
  "updated_at" integer NOT NULL,
  "deleted_at" integer,
  FOREIGN KEY ("category_id") REFERENCES "categories"("id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_expenses_occurred_at" ON "expenses" ("occurred_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_expenses_category_id" ON "expenses" ("category_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_expenses_deleted_at" ON "expenses" ("deleted_at");
