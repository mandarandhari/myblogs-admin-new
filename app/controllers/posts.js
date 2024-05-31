const Post = require("../models/post");

const posts_get = (req, res) => {
    Post.findAll({
        where: {
            userId: req.session.user.id
        }
    })
    .then(posts => {
        res.render('template', { title: 'Posts', active: 'posts', view: 'posts/list', posts });
    })
    .catch(err => console.log(err));
}

const post_get = () => {

}

const add_post_get = (req, res) => {
    res.render('template', { title: 'Add Post', active: 'posts', view: 'posts/add', errors: {}, formData: {} });
}

const add_post_post = (req, res) => {
    Post.create({
        userId: req.session.user.id,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        imagePath: req.file.filename
    })
    .then(post => {
        res.redirect('/posts');
    })
    .catch(err => {
        console.log(err);
    });
}

const edit_post_get = () => {

}

const edit_post_post = () => {

}

const delete_post_post = () => {

}

module.exports = {
    posts_get,
    post_get,
    add_post_get,
    add_post_post,
    edit_post_get,
    edit_post_post,
    delete_post_post
}