import { integer, pgTable, varchar } from "drizzle-orm/pg-core";


export const userTable = pgTable("users",{
    id : integer().primaryKey().generatedAlwaysAsIdentity(),
    name : varchar({length:30}).notNull(),
    email : varchar({length:30}).unique().notNull(),
    password : varchar({length:30}).unique().notNull(),
    
})

export const website = pgTable("websites",{
    id : integer().primaryKey().generatedAlwaysAsIdentity(),
    url : varchar({length:300}).notNull(),
    userId : integer()
})