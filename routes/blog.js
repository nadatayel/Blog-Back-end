const express = require('express');
const { getAll, create, getOne, editOne, deleteOne, getOneSearch, getbyAuthor, createComment,getComments,getUserBlogs } = require('../controllers/blog');
const router = express.Router();
const multer = require('multer');



//get all blogs
router.get('/', async (req, res, next) => {
  const { user: { id } } = req;
  try {
    const blogs = await getAll({ userId: id });
    res.json(blogs);
  } catch (e) {
    next(e);
  }
});


//saving images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploadedImages/');

  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});
//store only images
const filterFile = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg ') {
    cb(null, true);
  } else {
    cb(null, false);
  }

}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: filterFile
});

//post new blog
router.post('/add', upload.single('blogImage'), async (req, res, next) => {
  const { body, file, user: { id, username,userImage } } = req;
  body.blogImage = file?.path;
  try {
    const blog = await create({ ...body, userId: id, author: username , authorImage:userImage });
    res.json(blog);
  } catch (e) {
    next(e);
  }
});
// post comment
router.post('/comment/:blogId', async (req, res, next) => {
  const { body, user: { id, username, userImage }, params: { blogId } } = req;
  console.log(body)
  try {
    const comment = await createComment({ ...body, authorId: id, authorImg: userImage, authorName: username }, blogId)
    res.json(comment);
  } catch (e) {
    next(e);

  }
});

// show comments
router.get('/blogs/comments/:id', async (req, res, next) => {
  const { params: { id } } = req;
  try {
    const comments = await getComments(id);
    res.json(comments);
  } catch (e) {
    next(e);
  }
});

// show blog
router.get('/:id', async (req, res, next) => {
  const { params: { id } } = req;
  try {
    const blog = await getOne(id);
    res.json(blog);
  } catch (e) {
    next(e);
  }
});
//search by title
router.get('/title/:title', async (req, res, next) => {
  const { params: { title } } = req;
  try {
    const blog = await getOneSearch(title);
    res.json(blog);
  } catch (e) {
    next(e);
  }
});
//search by author
router.get('/author/:author', async (req, res, next) => {
  const { params: { author } } = req;
  try {
    const blog = await getbyAuthor(author);
    res.json(blog);
  } catch (e) {
    next(e);
  }
});

//delete blog
router.delete('/:id', async (req, res, next) => {
  const { params: { id } } = req;

  try {
    const blog = await deleteOne(id);
    res.json(blog);
  } catch (e) {
    next(e);
  }
});

//edit blog
router.patch('/edit/:id', async (req, res, next) => {
  const { params: { id }, body } = req;
  try {
    const blog = await editOne(id, body);
    res.json(blog);
  } catch (e) {
    next(e);
  }
});

//userdata
router.get('/userBlogs/:id', async (req, res, next) => {
  const { params:  {id}  } = req;
  try {
    const blogs = await getUserBlogs(id);
    res.json(blogs);
  } catch (e) {
    next(e);
  }
});


module.exports = router;