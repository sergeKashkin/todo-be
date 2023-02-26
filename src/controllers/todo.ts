import { Request, Response } from "express";
import { validationResult } from "express-validator/src/validation-result";
import { todoModel } from "../models/todo";
const asyncHandler = require("express-async-handler");

// For cimplicity all of the handlers implemented inside the controller and not in the designated service

export const getTodos = asyncHandler(async (req: Request, res: Response) => {
  try {
    const todos = await todoModel.find();
    res.status(200).json(todos);
  } catch (e) {
    throw e;
  }
});

export const getTodo = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const todo = await todoModel.findById(req.params.id);

      if (!todo) {
        res.status(404);
        throw new Error(`A todo with id ${req.params.id} was not found`);
      } else {
        return res.status(200).json(todo);
      }
    } catch (e) {
      throw e;
    }
  }
);

export const createTodo = asyncHandler(
    async (req: Request<any, any, {name: string, description: string}>, res: Response) => {
      try {
        if (!req.body.name) {
            res.status(400);
            throw new Error("Please add a todo title");
        }
        const todo = await todoModel.create({
            name: req.body.name,
            description: req.body.description
        });

        res.status(200).json(todo);
      } catch (e) {
        throw e;
      }
    }
);

export const deleteTodo = asyncHandler(
    async (req: Request<{id: string}>, res: Response) => {
      try {
        if (!req.params.id) {
            res.status(400);
            throw new Error("Please provide an id of the task to delete");
        }
        if (!req.headers.authorization) {
            res.status(403);
            throw new Error("Unauthorized");
        }
        const todoToDelete = await todoModel.findById(req.params.id);

        if (!todoToDelete) {
            res.status(200).json(req.params.id);
        }
        else if (todoToDelete.editingClient && todoToDelete.editingClient !== req.headers.authorization) {
            res.status(403);
            throw new Error("Unauthorized");
        }
        else {
            await todoToDelete.remove();
            res.status(200).json(req.params.id);
        }

      } catch (e) {
        throw e;
      }
    }
);

export const lockTodo = asyncHandler(
    async (req: Request<{id: string}>, res: Response) => {
      try {
        if (!req.params.id) {
            res.status(400);
            throw new Error("Please provide an id of the task to update");
        }

        const todoToLock = await todoModel.findById(req.params.id);

        if (!todoToLock) {
            res.status(404);
            throw new Error(`A todo with id ${req.params.id} was not found`);
        }
        else if (todoToLock.editingClient && !(todoToLock.editingClient === req.headers.authorization)) {
            res.status(409);
            throw new Error("This object is in edit by someone else");
        }
        else {
            let updatedTodo = await todoModel.findByIdAndUpdate(
                req.params.id,
                {
                    editingClient: req.headers.authorization
                },
                {new: true}
            )
            res.status(200).json(updatedTodo);
        }

      } catch (e) {
        throw e;
      }
    }
);

export const unlockTodo = asyncHandler(
    async (req: Request<{id: string}>, res: Response) => {
      try {
        if (!req.params.id) {
            res.status(400);
            throw new Error("Please provide an id of the task to update");
        }

        const todoToUnLock = await todoModel.findById(req.params.id);

        if (!todoToUnLock) {
            res.status(404);
            throw new Error(`A todo with id ${req.params.id} was not found`);
        }
        else if (todoToUnLock.editingClient && !(todoToUnLock.editingClient === req.headers.authorization)) {
            res.status(409);
            throw new Error("This object is in edit by someone else");
        }
        else {
            let updatedTodo = await todoModel.findByIdAndUpdate(
                req.params.id,
                {
                    editingClient: null
                },
                {new: true}
            )
            res.status(200).json(updatedTodo);
        }

      } catch (e) {
        throw e;
      }
    }
);

export const updateTodo = asyncHandler(
    //TODO: implement lock
    async (req: Request<{id: string}, any, {name: string, description: string, isCompleted: boolean, isInEdit: boolean}>, res: Response) => {
      try {
        if (!req.params.id) {
            res.status(400);
            throw new Error("Please provide an id of the task to update");
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400);
            throw new Error("Please provide all required fields: [name, description, isEditing, isCompleted]");
        }
        const todoToUpdate = await todoModel.findById(req.params.id);

        if (!todoToUpdate) {
            res.status(404);
            throw new Error(`A todo with id ${req.params.id} was not found`);
        }
        else if (todoToUpdate.editingClient && !(todoToUpdate.editingClient === req.headers.authorization)) {
          res.status(409);
          throw new Error("This object is in edit by someone else");
        }
        else {
            let updatedTodo = await todoModel.findByIdAndUpdate(
                req.params.id,
                {
                    name: req.body.name, 
                    description: req.body.description, 
                    isCompleted: req.body.isCompleted, 
                    isInEdit: req.body.isInEdit  
                },
                {new: true}
            )
            res.status(200).json(updatedTodo);
        }

      } catch (e) {
        throw e;
      }
    }
);
  