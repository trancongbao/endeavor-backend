import "scope-extensions-js";
import endeavorDB from "../databases/endeavorDB";
import { WordTable } from "../databases/endeavorDB";
import { Insertable, Updateable } from "kysely";

export function createWord(word: Insertable<WordTable>) {
  return endeavorDB.insertInto("word").values(word).returningAll().executeTakeFirstOrThrow();
}

export function readWord({ id }: { id: number }) {
  return endeavorDB.selectFrom("word").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}

export function updateWord(word: Updateable<WordTable>) {
  return endeavorDB.updateTable("word").where("id", "=", word.id!!).set(word).returningAll().executeTakeFirstOrThrow();
}

export function deleteWord({ id }: { id: number }) {
  return endeavorDB.deleteFrom("word").where("id", "=", id).returningAll().executeTakeFirstOrThrow();
}

export function findWord() {}