import { integer, pgEnum, pgTable, timestamp, varchar, type AnyPgColumn } from "drizzle-orm/pg-core";


export const statusEnum = pgEnum("status",["up", "down", "unknown"]);

export const user = pgTable("user",{
    id : integer().primaryKey().generatedAlwaysAsIdentity(),
    name : varchar({length:30}).notNull(),
    email : varchar({length:30}).unique().notNull(),
    password : varchar({length:30}).unique().notNull()
})

export const website = pgTable("website",{
    id : integer().primaryKey().generatedAlwaysAsIdentity(),
    url : varchar({length:300}).notNull(),
    user_id : integer().references(()=>user.id).notNull(),
    time_added : timestamp().defaultNow().notNull(),
    status : statusEnum().default("unknown")
})
