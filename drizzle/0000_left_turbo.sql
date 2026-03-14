CREATE TABLE `episodes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_id` integer,
	`title` text NOT NULL,
	`script` text,
	`audio_url` text,
	`storage_key` text,
	`status` text DEFAULT 'pending',
	`retry_count` integer DEFAULT 0,
	`last_error` text,
	`created_at` integer,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`type` text NOT NULL,
	`frequency` text DEFAULT 'daily',
	`last_checked_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`gemini_key` text,
	`openai_key` text,
	`elevenlabs_key` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);