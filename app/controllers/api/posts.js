const fs = require('fs');
const Post = require('./../../models/post');

const posts = async (req, res) => {
    try {
        const posts = await Post.findAll({ where: { userId: req.userId } });

        posts.map(post => {
            post.imagePath = `${process.env.BASE_URL}/storage/posts/${req.userId}/${post.imagePath}`;

            return post;
        });

        res.status(200).json({
            status: true,
            data: posts,
            msg: !posts ? "No posts found" : ""
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: "Something went wrong"
        });
    }
}

const post = async (req, res) => {
    try {
        const post = await Post.findOne({ where: { userId: req.userId, id: req.params.id } });

        if (post) {
            post.imagePath = `${process.env.BASE_URL}/storage/posts/${req.userId}/${post.imagePath}`;
        }

        res.status(200).json({
            status: true,
            data: post,
            msg: !post ? "Post not found" : ''
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: "Something went wrong"
        });
    }
}

const addPost = async (req, res) => {
    const post = await Post.create({
        userId: req.userId,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        imagePath: req.file.filename
    });

    if (post) {
        res.status(200).json({
            status: true,
            data: {
                id: post.id
            },
            msg: 'Post created successfully'
        });
    } else {
        res.status(500).json({
            status: false,
            msg: 'An error occurred while creating post'
        });
    }
}

const editPost = async (req, res) => {
    const dataToUpdate = {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    };

    if (req.file !== undefined) {
        dataToUpdate.imagePath = req.file.filename;

        const post = await Post.findOne({
            where: {
                id: req.params.id,
                userId: req.userId
            }
        });

        const imagePath = `./storage/posts/${req.userId}/${post.imagePath}`;

        if (fs.existsSync(imagePath)) {
            fs.unlink((imagePath, err) => {
                if (err) {
                    throw err;
                }

                console.log("The file has been deleted");
            });
        }
    }

    const postUpdated = await Post.update(
        dataToUpdate,
        {
            where: {
                id: req.params.id,
                userId: req.userId
            }
        }
    );

    if (postUpdated) {
        res.status(200).json({
            status: true,
            msg: "Post updated"
        });
    } else {
        res.status(500).json({
            status: false,
            msg: "An error occurred while updating post"
        });
    }
}

const deletePost = async (req, res) => {
    const postDeleted = await Post.destroy({
        where: {
            id: req.params.id,
            userId: req.userId
        }
    });

    if (postDeleted) {
        res.status(200).json({
            status: true,
            msg: "Post deleted"
        });
    } else {
        res.status(500).json({
            status: false,
            msg: "An error occurred while deleting the post"
        });
    }
} 

module.exports = {
    posts,
    post,
    addPost,
    editPost,
    deletePost
}