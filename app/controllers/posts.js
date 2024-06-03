const fs = require('fs');
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

const edit_post_get = (req, res) => {
    if (req.params.id) {
        Post.findOne({
            attributes: ['id', 'title', 'description', 'content'],
            where: {
                id: req.params.id,
                userId: req.session.user.id
            }
        })
        .then(post => {
            res.render('template', { title: 'Edit Post', active: 'posts', view: 'posts/edit', errors: {}, formData: {}, post })
        })
        .catch(err => console.log(err));
    } else {
        res.redirect('/posts');
    }
}

const edit_post_post = (req, res) => {
    const dataToUpdate = {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    };

    if (req.file !== undefined) {
        dataToUpdate.imagePath = req.file.filename;

        Post.findOne(
            {
                where: {
                    id: req.params.id,
                    userId: req.session.user.id
                }
            }
        )
        .then(post => {
            fs.unlink(`./storage/posts/${req.session.user.id}/${post.imagePath}`, err => {
                if (err) {
                    throw err;
                }
    
                console.log('File has been deleted');
            });
        })
        .catch(err => console.log(err));
    }

    Post.update(
        dataToUpdate,
        {
            where: {
                id: req.params.id,
                userId: req.session.user.id
            }
        }
    )
    .then(post => {
        res.redirect('/posts');
    })
    .catch(err => console.log(err));
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