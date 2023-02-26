import mongoose, { Schema } from "mongoose";

const todoSchema: Schema = new mongoose.Schema(
    {
        name: {
            type: mongoose.Schema.Types.String,
            required: [true, "Please add a name"]
        },
        description: {
            type: mongoose.Schema.Types.String,
            required: [true, "Please add a description"]
        },
        isCompleted: {
            type: mongoose.Schema.Types.Boolean,
            default: false
        },
        isInEdit: {
            type: mongoose.Schema.Types.Boolean,
            default: false
        },
        editingClient: {
            type: mongoose.Schema.Types.String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export const todoModel = mongoose.model("Todo", todoSchema);