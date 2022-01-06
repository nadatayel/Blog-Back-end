const Blog = require('../models/blog');


const getAll = (query) => {
  return Blog.find(query).sort([['createdAt',-1]]).exec();

}

const getUserBlogs=(id)=>{
return Blog.find({userId:id}).exec();
} 
const getallHome = () => Blog.find({}).exec();

const getOne = (id) => {
  return Blog.findById(id).exec();

}
const getOneSearch = (title) => {
  return Blog.find({ title: title }).exec();

}

const getbyAuthor = (author) => {
  return Blog.find({author:author}).exec();
}

const create = (blog) => {
  return Blog.create(blog);
}

const editOne = (id, body) => {
  return Blog.findByIdAndUpdate(id, body, { new: true }).exec();
}


const deleteOne = (id) => {
  return Blog.findByIdAndDelete(id).exec();
}

const createComment=(comment,blogId)=>{
  console.log(comment)
  return  Blog.findByIdAndUpdate(blogId,{$push:{comments:comment}}).exec();
 
}

const getComments = async (id) =>{
  const {comments}= await getOne(id)
  return Blog.find().where('id').in(comments).exec();
}



module.exports = {
  getAll,
  getOne,
  create,
  editOne,
  deleteOne,
  getOneSearch,
  getallHome,
  getbyAuthor,
  createComment,
  getComments,
  getUserBlogs
  
}