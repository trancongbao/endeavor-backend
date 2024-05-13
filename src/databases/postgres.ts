import pgPromise from "pg-promise"
import {Pool} from 'pg'

export {pg, pgp}

//Ref: https://node-postgres.com/features/connecting#environment-variables
const pg = new Pool()

const pgp = pgPromise()({
    host: "localhost",
    port: 5432,
    database: "postgres_db",
    user: "postgres_user",
    password: "postgres_password"
})
