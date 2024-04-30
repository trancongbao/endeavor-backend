import "scope-extensions-js";
import {endeavorDB} from "../databases/endeavorDB";
import {Card} from "../databases/endeavorDB";
import {Insertable, Updateable} from "kysely";

export function createCard(card: Insertable<Card>) {
    return endeavorDB.insertInto("card").values(card).returningAll().executeTakeFirstOrThrow();
}

export function readCard({id}: { id: number }) {
    return endeavorDB.selectFrom("card").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}

export function updateCard(card: Updateable<Card>) {
    return endeavorDB.updateTable("card").where("id", "=", card.id!!).set(card).returningAll().executeTakeFirstOrThrow();
}

export function deleteCard({id}: { id: number }) {
    return endeavorDB.deleteFrom("card").where("id", "=", id).returningAll().executeTakeFirstOrThrow();
}
