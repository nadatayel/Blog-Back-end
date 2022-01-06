const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var dateFormat = require("dateformat");

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 550,
    },
    body: {
        type: String,
        maxlength: 1000,
        required: true,
    },
    blogImage:
    {
        type: String,
        
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    authorImage: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    author: {
        type: String
    },
    comments: [{
        body: {
            type:String
        },
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        authorImg:String,
        authorName:String,

    }],

});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
