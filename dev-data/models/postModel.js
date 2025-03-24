const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      default: 'usama-bit137',
    },
    title: {
      type: String,
      required: [true, 'A post requires text content.'],
    },
    bodyText: {
      type: String,
      required: [true, 'A post requires text content.'],
    },
    creationDate: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
    },
    comments: [
      {
        username: { type: String },
        comment: { type: String },
      },
    ],
    icon: {
      type: String,
    },
    images: {
      type: [String],
    },
    edittedAt: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
