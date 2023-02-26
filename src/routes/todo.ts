import express, { Router } from "express";
import { createTodo, deleteTodo, getTodo, getTodos, lockTodo, unlockTodo, updateTodo } from "../controllers/todo";
import { authHandler } from "../middleware/auth";
import { todoBodyValidation } from "../middleware/todoBodyValidation";

const router: Router = express.Router();

router.route("/").get(getTodos);
router.route("/").post(createTodo);
router.route("/:id").get(getTodo).put(todoBodyValidation(), authHandler, updateTodo).delete(authHandler, deleteTodo);
router.route("/lock/:id").post(lockTodo).delete(unlockTodo);

module.exports = router;