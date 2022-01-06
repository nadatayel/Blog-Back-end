const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const asyncSign=promisify(jwt.sign);

const getFollowers = async (id) =>{
    const {followers}= await getOne(id)
    return User.find().where('_id').in(followers).exec();
}

const getFollowings = async (id) =>{
    const {followings}= await getOne(id)
    return User.find().where('_id').in(followings).exec();
}


const create = (user) => {
    return User.create(user);
}

const login = async ({ username, password }) => {

     const user = await User.findOne({ username }).exec();
    if (!user) {
        throw Error('UN_AUTHENTICATED');
    }
    const isVaildPass = user.validatePassword(password);
    if (!isVaildPass) {
        throw Error('UN_AUTHENTICATED');
    }
    const token = await asyncSign({
         username:user.username,
         id:user.id,
         }, 'SECRET_MUST_BE_COMPLEX', { expiresIn :'2d' });
      return { ...user.toJSON(), token };
    
};

const getAll = () => User.find({}).exec();

const editOne = (id, data) => User.findByIdAndUpdate(id, data, { new: true }).exec();

const getOne= (id) =>{
    return User.findById(id).exec();

}

const deleteOne=(id)=>{
    return User.findByIdAndDelete(id).exec();
    }

const follow=(userid,followedid)=>{

    const usser=User.findById(userid).exec()

    User.findByIdAndUpdate(userid,{$addToSet: {followings:followedid}},{new:true}).exec();

    User.findByIdAndUpdate(followedid,{$addToSet: {followers:userid}},{new:true}).exec();

    return usser;
}

const unfollow=(userid,followedid)=>{
    const usser=User.findById(userid).exec()
    
    User.findByIdAndUpdate(userid,{$pull: {followings:followedid}},{new:true}).exec();

    User.findByIdAndUpdate(followedid,{$pull: {followers:userid}},{new:true}).exec();

    return usser
}


module.exports = {
  create,
  login,
  getAll,
  getOne,
  editOne,
  deleteOne,
  follow,
  unfollow,
  getFollowers,
  getFollowings,
}