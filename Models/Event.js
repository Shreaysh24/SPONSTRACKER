import mongoose, { Schema, model, models } from "mongoose";

export const Eventschema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Conference", "Workshop", "Webinar", "Meetup"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    stage: {
      type: String,
      enum: ["Opened", "Hoocked", "Locked", "Closed"],
      required: true,
    },
    videoUrl: {
      type: String,
      required: false,
    },
    controls: {
      type: Boolean,
      default: false,
    },
    transformation: {
      height: { type: Number },
      width: { type: Number },
      quality: { type: Number },
    },
  },
  { timestamps: true }
);

// Prevent model overwrite in dev
export const Event = models.Event || model("Event", Eventschema);
