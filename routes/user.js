const express = require('express');
const { create, login, getAll, getOne, editOne, deleteOne, follow, unfollow, getFollowers, getFollowings } = require('../controllers/user');
const router = express.Router();
const authMiddleware = require('../middlewares/authentication');
const app = express();
const multer = require('multer');



//saving images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './userImages/');
  
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

  router.post('/register', upload.single('userImage'), async (req, res, next) => {
    const { body, file} = req;
    body.userImage = file?.path;
    try {
      const user = await create({ ...body});
      res.json(user);
    } catch (e) {
      next(e);
    }
  });
//new user
/* router.post('/register',upload.single('userImage') ,async (req, res, next) => {
    const { body } = req;
    try {
        const user = await create(body);
        res.json(user);
    } catch (e) {
        next(e);
    }
}); */

//login 
router.post('/login', async (req, res, next) => {
    const { body } = req;
    try {
        const user = await login(body);
        res.json(user);
    } catch (e) {
        next(e);
    }

});

//show all users
router.get('/', async (req, res, next) => {
    try {
        const users = await getAll();
        res.json(users);
    } catch (e) {
        next(e);
    }
});

//select user by id 
router.get('/:id', async (req, res, next) => {
    const { params: { id } } = req;
    try {
        const users = await getOne(id);
        res.json(users);
    } catch (e) {
        next(e);
    }

});

//get followers
router.get('/followers/:id', async (req, res, next) => {
    const { params: { id } } = req;
    try {
        const users = await getFollowers(id);
        res.json(users);
    } catch (e) {
        next(e);
    }
})
//get followings
router.get('/followings/:id', async (req, res, next) => {
    const { params: { id } } = req;
    try {
        const users = await getFollowings(id);
        res.json(users);
    } catch (e) {
        next(e);
    }
})

//edit user by id 
router.patch('/edit/:id', async (req, res, next) => {
    const { params: { id }, body } = req;
    try {
        const users = await editOne(id, body);
        res.json(users);
    } catch (e) {
        next(e);
    }
});

//delete user by id 
router.delete('/:id', async (req, res, next) => {
    const { params: { id } } = req;
    try {
        const users = await deleteOne(id);
        res.json(users);
    } catch (e) {
        next(e);
    }
});

//follow user
router.post('/follow/:userid', authMiddleware, async (req, res, next) => {
    let { user: { id }, params: { userid } } = req;
    try {
        const user = await follow(id, userid);
        res.json(user);
    }
    catch (e) {
        next(e);

    }
})

//unfollow user
router.post('/unfollow/:userid', authMiddleware, async (req, res, next) => {
    let { user: { id }, params: { userid } } = req;
    try {
        const user = await unfollow(id, userid);
        res.json(user);
    }
    catch (e) {
        next(e);

    }
})


module.exports = router;