import mongoose from 'mongoose';
import { format } from 'date-fns';

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},
{ timestamps: true });

postSchema
.virtual('timestamp')
.get(function() {
  return format(this.createdAt, 'Pp')
});

export default mongoose.model('Post', postSchema);
