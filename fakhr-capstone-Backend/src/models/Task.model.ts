import mongoose, { Document, Schema } from "mongoose";

export type TaskStatus = "pending" | "completed" | "skipped";

export interface ITask extends Document {
  carePathId: mongoose.Types.ObjectId;
  week: number;
  title: string;
  description: string;
  instructions?: string;
  expectedOutcome?: string;
  category?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  frequency?: string;

  status: TaskStatus;
  completedAt?: Date;
  dueDate?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    carePathId: { type: Schema.Types.ObjectId, ref: "CarePath", required: true },
    week: { type: Number, required: true, min: 1 },

    title: { type: String, required: true },
    description: { type: String, required: true },
    instructions: { type: String },
    expectedOutcome: { type: String },
    category: { type: String },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"] },
    frequency: { type: String },

    status: {
      type: String,
      enum: ["pending", "completed", "skipped"],
      default: "pending",
    },
    completedAt: { type: Date },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

TaskSchema.index({ carePathId: 1, week: 1 });
TaskSchema.index({ status: 1 });

export default mongoose.model<ITask>("Task", TaskSchema);
