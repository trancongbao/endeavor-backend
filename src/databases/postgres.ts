import pgPromise from "pg-promise";
import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

export default pgPromise()({
  user: "postgres",
  host: "localhost",
  database: "endeavor",
  password: "postgres",
  port: 5432,
});