const blogs_get = () => {

}

const blog_get = () => {

}

const add_blog_get = (req, res) => {
    res.render('template', { title: 'Add Post', active: 'posts', view: 'blogs/add' });
}

const add_blog_post = () => {

}

const edit_blog_get = () => {

}

const edit_blog_post = () => {

}

const delete_blog_post = () => {

}

module.exports = {
    blogs_get,
    blog_get,
    add_blog_get,
    add_blog_post,
    edit_blog_get,
    edit_blog_post,
    delete_blog_post
}