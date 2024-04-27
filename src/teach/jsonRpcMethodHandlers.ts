import "scope-extensions-js";
import { JSONRPCServer } from "json-rpc-2.0";
import { createWord, readWord, updateWord, deleteWord, findWord } from "./wordMethods";
import { createLesson, readLesson, updateLesson, deleteLesson } from "./lessonMethods";
import { createCard, readCard, updateCard, deleteCard } from "./cardMethods";

export default new JSONRPCServer().apply(function () {
  //Lesson
  this.addMethod("createLesson", createLesson);
  this.addMethod("readLesson", readLesson);
  this.addMethod("updateLesson", updateLesson);
  this.addMethod("deleteLesson", deleteLesson);

  //Card
  this.addMethod("createCard", createCard);
  this.addMethod("readCard", readCard);
  this.addMethod("updateCard", updateCard);
  this.addMethod("deleteCard", deleteCard);

  //Word
  this.addMethod("createWord", createWord);
  this.addMethod("readWord", readWord);
  this.addMethod("updateWord", updateWord);
  this.addMethod("deleteWord", deleteWord);
  this.addMethod("findWord", findWord);
});
