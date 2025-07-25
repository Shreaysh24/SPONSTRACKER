import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  content: String,
  participants: {
    type: [String],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Message || mongoose.model("Message", messageSchema);
