import pgPromise from "pg-promise"
import { Pool, Client } from 'pg'

export {pg, pgp}

const pgp = pgPromise()({
    host: "localhost",
    port: 5432,
    database: "postgres_db",
    user: "postgres_user",
    password: "postgres_password"
})

const pg = new Pool({
    host: "localhost",
    port: 5432,
    database: "postgres_db",
    user: "postgres_user",
    password: "postgres_password"
})