import mongoose from "mongoose";

const pubs = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    maxLenght: 50,
    minLenght: 1,
  },
  description: {
    type: String,
    maxLenght: 250,
    minLenght: 1,
    default: ""
  },
  image: {
    type: String,
    default: "",
  },
  yt: {
    type: String,
    default: ""
  },
  audio: {
    type: String,
    default: ""
  },
  comments: [
    {
      author: String,
      avatar: String,
      msg: {
        type: String,
        required: true,
        minLenght: 1,
        maxLenght: 250,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: { type: Date, default: Date.now },
  favourite: [{
    count: {
      type: Number,
      default: 0
    },
    author: {
      type: String,
      required: true
    }
  }],
  likes: [{
    count: {
      type: Number,
      default: 0
    },
    author: {
      type: String,
      required: true
    }
  }]
});

const Pubs = mongoose.models.pubs || mongoose.model("pubs", pubs);

export default Pubs;
