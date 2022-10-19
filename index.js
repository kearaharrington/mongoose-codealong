const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Post = require('./models/post');
const User = require('./models/user');
const { Comment } = require('./models/comment');

// mongo setup
const mongoDb = 'mongodb://127.0.0.1/mongoose-demo';
mongoose.connect(mongoDb, {useNewUrlParser: true});

const db = mongoose.connection;

db.once('open', () => {
    console.log(`Connected to MongoDB at ${db.host}:${db.port}`);
});

db.on('error', (error) => {
    console.error(`Database error:\n${error}`);
});

// express setup
app.use(express.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    res.json({
        message: 'Welcome to our API'
    })

});


 // ================ USERS ROUTES ========================

 // find all users
app.get('/users',(req,res) => {
    User.find({})
    .then(users => {
        console.log('All users', users);
        res.json({users: users});
    })
    .catch(error => {
        console.log('error', error);
        res.json({ message: 'please try again later' });
    })
});

  // Find by email
// app.get('/findByEmail/:email', (req, res) => {
//     User.find({ email: req.params.email }, (err, user) => {
//         if (err) return res.send(err);
//         res.send(user);
//     });
// });

// find one user (by email)
app.get('/users/:email', (req, res) => {
    console.log('find user by', req.params.email)
    User.findOne({
        email: req.params.email
    })
    .then(user => {
        console.log('Here is the user', user.name);
        res.json({ user: user });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

// create one user
app.post('/users', (req, res) => {
    User.create({
        name: req.body.name,
        email: req.body.email,
        meta: {
            age: req.body.age,
            website: req.body.website
        }
    })
    .then(user => {
        console.log('New user =>>', user);
        res.json({ user: user });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});

// edit one user (by email)
app.put('/users/:email', (req, res) => {
    console.log('route is being on PUT')
    User.findOne({ email: req.params.email })
    .then(foundUser => {
        console.log('User found', foundUser);
        User.findOneAndUpdate({ email: req.params.email }, 
        { 
            name: req.body.name ? req.body.name : foundUser.name,
            email: req.body.email ? req.body.email : foundUser.email,
            meta: {
                age: req.body.age ? req.body.age : foundUser.age,
                website: req.body.website ? req.body.website : foundUser.website
            }
        })
        .then(user => {
            console.log('User was updated', user);
            res.redirect(`/users/${req.params.email}`)
        })
        .catch(error => {
            console.log('error', error) 
            res.json({ message: "Error ocurred, please try again" })
        })
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    })
    
});

// delete one user (by email)
app.delete('/users/:email', (req, res) => {
    User.findOneAndRemove({ email: req.params.email })
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.email} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});

 // ================ POSTS ROUTES ========================

 // find all posts
 app.get('/posts', (req, res) => {
    Post.find({})
    .then(posts => {
        console.log('All posts', posts);
        res.json({ posts: posts });
    })
    .catch(error => { 
        console.log('error', error) 
    });
});

//find one post (by title)
app.get('/posts/:title', (req, res) => {
    console.log('find post by', req.params.title)
    Post.findOne({
        title: req.params.title
    })
    .then(post => {
        console.log('Here is the [post]', post);
        res.json({ post: post });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

// create one
app.post('/posts', (req, res) => {
    Post.create({
        title: req.body.title,
        body: req.body.body
    })
    .then(post => {
        console.log('New post =>>', post);
        res.json({ post: post });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});

// update one (by title) -- console log not working for updated info
app.put('/posts/:title', (req, res) => {
    console.log('route is being on PUT')
    Post.findOne({ title: req.params.title })
    .then(foundPost => {
        console.log('Post found', foundPost);
        Post.findOneAndUpdate({ title: req.params.title }, 
        { 
            title: req.body.title ? req.body.title : foundPost.title,
            body: req.body.body ? req.body.body : foundPost.body
        })
        .then(post => {
            console.log('Post was updated', post);
            res.redirect(`/posts/${req.params.title}`)
        })
        .catch(error => {
            console.log('error', error) 
            res.json({ message: "Error ocurred, please try again" })
        })
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    })
    
});

// delete one (by title)
app.delete('/posts/:title', (req, res) => {
    Post.findOneAndRemove({ title: req.params.title })
    .then(response => {
        console.log('This was deleted', response);
        res.json({ message: `${req.params.title} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});

// ================ COMMENTS ROUTES ========================

// find all comments
app.get('/comments', (req, res) => {
    Comment.find({})
    .then(comments => {
        console.log('All comments', comments);
        res.json({ comments: comments });
    })
    .catch(error => { 
        console.log('error', error) 
    });
});

// find one comment by header
app.get('/comments/:header', (req, res) => {
    console.log('find header by', req.params.header)
    Comment.findOne({
        header: req.params.header
    })
    .then(comment => {
        console.log('Here is the [comment]', comment);
        res.json({ comment: comment });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

// create one comment
app.post('/comments', (req, res) => {
    Comment.create({
        header: req.body.header,
        content: req.body.content,
        date: new Date()
    })
    .then(comment => {
        console.log('New comment =>>', comment);
        res.json({ comment: comment });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});

// update one comment by header -- console log not working for updated info
app.put('/comments/:title', (req, res) => {
    console.log('route is being on PUT')
    Comment.findOne({ header: req.params.header })
    .then(foundComment => {
        console.log('Comment found', foundComment);
        Comment.findOneAndUpdate({ header: req.params.header }, 
        { 
            header: req.body.header ? req.body.header : foundComment.header,
            content: req.body.content ? req.body.content : foundComment.content
        })
        .then(comment => {
            console.log('Comment was updated', comment);
            res.redirect(`/comments/${req.params.header}`)
        })
        .catch(error => {
            console.log('error', error) 
            res.json({ message: "Error ocurred, please try again" })
        })
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    })
    
});

// delete one comment by header
app.delete('/comments/:header', (req, res) => {
    Comment.findOneAndRemove({ header: req.params.header })
    .then(response => {
        console.log('This was deleted', response);
        res.json({ message: `${req.params.header} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});

// creating a simple post document in the post collection
// Post.create({
//     content: 'Amazing post...'
// });

// const post = new Post({ title: "Cat", body: "Yeehaw! Sandos!" });

// post.comments.push({ header: 'My comment', content: "What!?"  });

// post.save((err) => {
//     if (!err) console.log('Success!');
// });

// // Post.findById(post._id, (err, post) => {
// //     if (!err) {
// //         post.comments.id(subId).remove();
// //         post.save(function (err) {
// //             // do something
// //         });
// //         console.log(post);
// //     }
// // });

// // create a new user called Chris
// const chris = new User({
//     name: 'Doug',
//     email: 'newTest@test.com',
//     meta: {
//         age: 27,
//         website: 'http://chris.me'
//     }
// });

// chris.save((error) => {
//     if (error) return console.log(error);
//     console.log('User Created!');
// });

// User.create({
//     name: 'created using Create()',
//     email: 'tester3@gmail.com'
// })

// const newUser = User({
//     name: 'created using User and Save()',
//     email: 'tester2@gmail.com'
// });

// .save gives you more control over when the record is created. .create is asynchronous. .save is a better habit (more control)

// // save the user
// newUser.save(function(err) {
//     if (err) return console.log(err);
//     console.log('User created!');
// });


// // Find All
// app.get('/findAll', (req, res) => {
//     User.find({}, (err, users) => {
//         if (err) return res.send(`Failed to find record, mongodb error ${err}`);
//         res.send(users);
//     });
// })
  
//   // Find only one user
// app.get('/findOne', (req, res) => {
//     User.findOne({}, (err, user) => {
//         if (err) return res.send(err);
//         res.send(user);
//       });
// })

  
//   // Find by id
// app.get('/findById/:id', (req, res) => {
//     User.findById(req.params.id, function(err, user) {
//         if (err) return res.send(err);
//         res.send(user);
//     });
// })

// app.post('/updateOneByName/:name', (req, res) => {
//     User.updateOne({ name: req.params.name }, { meta: { age: 26 } }, (err, user) => {
//         if (err) console.log(err);
//         console.log(user);
//       });
// });

// User.updateOne({name: 'Robert'}, {
//     meta: {
//         age: 47
//     }
// }, (err, updateOutcome) => {
//     if (err) return console.log(err);
//     console.log(`updated user: ${updateOutcome.matchedCount} : ${updateOutcome.modifiedCount}`);
// })

// User.findOneAndUpdate({name: 'Robert'}, {
//     meta: {
//         age: 61,
//         website: 'somethingNew.com'
//     }
// }, (error, user) => {
//     if(error) return console.log(error);
//     console.log(user);
// })

// app.post('/updateAllByName/:name', (req, res) => {
//     User.updateMany({ name: req.params.name }, { meta: { age: 26 } }, (err, user) => {
//         if (err) console.log(err);
//         console.log(user);
//       });
// });

// app.delete('/deleteByName/:name', (req,res) => {
//     User.findOneAndRemove({ name: req.params.name }, function(err) {
//         if (err) console.log(err);
//         console.log('User deleted!');
//     });
// })

// //below deletes all Roberts
// User.remove({name: 'Robert'}, (err) => {
//     if (err) return console.log(err);
//     console.log('user record deleted');
// })

// // finds one Chris and deletes that record.
// User.findOneAndRemove({name: 'Chris'}, (err, user) => {
//     if (err) return console.log(err);
//     console.log(user);
// })

// app.delete('/deleteAllByName/:name', (req,res) => {
//     User.remove({ name: req.params.name }, function(err) {
//         if (err) console.log(err);
//         console.log('Users deleted!');
//     });
// })

// // Post schema with association to comments
// const newPost = new Post({
//     title: 'our first post',
//     body: 'some body text for our post'
// })

// // this doesn't get added to the comment schema bc it's embedded in the post schema
// newPost.comments.push({
//     header: 'our first comment',
//     content: 'this is our comment'
// })

// newPost.save(function(err) {
//     if (err) return console.log(err);
//     console.log('created post')
// })

// const refPost = new Post({
//     title: 'tester try with comment empty',
//     body: 'tester of post with ref comments'
// });

// const refComment = new Comment({
//     header: 'header refcomment tester',
//     content: 'content refComment tester'
// });

// refComment.save();

// refPost.comments.push(refComment);
// refPost.save();

// // find all comments son a post by ref
// Post.findOne({title: 'our first post'}, (err, post) => {
//     Post.findById(post._id).populate('comments').exec((err, post) => {
//         console.log(post);
//     });
// });

// // unsure if below works - Joel will update his code on github
// Post.findOne({title: 'our first post'}, (err, post) => {
//     console.log(post);
//     Comment.find({_id: post.refComments[0]}, (err,comment) => {
//         console.log(comment);
//     })
// })

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`App running on port: ${PORT}`)
});
