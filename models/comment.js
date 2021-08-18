import mongoose from 'mongoose';
import { format } from 'date-fns';

const commentSchema = mongoose.Schema({
  body: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
},
{ timestamps: true });

commentSchema
.virtual('timestamp')
.get(function() {
  return format(this.createdAt, 'Pp')
});

export default mongoose.model('Comment', commentSchema);
