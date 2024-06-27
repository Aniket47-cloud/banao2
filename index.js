const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const MernModel = require('./models/Mern.js');
const Post= require('./models/PostModel.js')
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/Mern");

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    MernModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json("Success");
                } else {
                    res.json("The password is incorrect");
                }
            } else {
                res.json("No record Found");
            }
        })
        .catch(err => res.json(err));
});

app.post('/register', (req, res) => {
    MernModel.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.json(err));
});

app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    MernModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                console.log('User not found');
                return res.json({ Status: "User not found" });
            }

            const token = crypto.randomBytes(20).toString('hex');

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save().then(() => {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'gupta.aniket120168@gmail.com',
                        pass: 'zyzj bdcv eqqf lfzp',
                    },
                });

                const mailOptions = {
                    to: user.email,
                    from: 'passwordreset@demo.com',
                    subject: 'Password Reset',
                    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                        `http://localhost:5173/reset-password/${token}\n\n` +
                        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('There was an error: ', error);
                        return res.json({ Status: "Error sending email", error: error });
                    } else {
                        console.log('Recovery email sent');
                        return res.status(200).json('Recovery email sent');
                    }
                });
            }).catch(err => {
                console.error('Error saving user:', err);
                return res.json({ Status: "Error saving user" });
            });
        })
        .catch(err => {
            console.error('Error finding user:', err);
            return res.json({ Status: "Error finding user" });
        });
});

app.post('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.json({ Status: "Password is required" });
    }

    MernModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    }).then(user => {
        if (!user) {
            return res.json({ Status: "Password reset token is invalid or has expired" });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.json(err);
            }

            user.password = password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save()
                .then(() => res.json("Password has been reset"))
                .catch(err => res.json(err));
        });
    }).catch(err => res.json(err));
});
app.post('/posts', (req, res) => {
    const post = new Post(req.body);
    post.save()
        .then(post => res.json(post))
        .catch(err => res.json(err));
});

app.get('/posts', (req, res) => {
    Post.find().populate('comments')
        .then(posts => res.json(posts))
        .catch(err => res.json(err));
});

app.get('/posts/:id', (req, res) => {
    Post.findById(req.params.id).populate('comments')
        .then(post => res.json(post))
        .catch(err => res.json(err));
});


app.put('/posts/:id', (req, res) => {
    Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(post => res.json(post))
        .catch(err => res.json(err));
});

app.delete('/posts/:id', (req, res) => {
    Post.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: 'Post deleted' }))
        .catch(err => res.json(err));
});

app.post('/posts/:id/like', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            post.likes += 1;
            return post.save();
        })
        .then(post => res.json(post))
        .catch(err => res.json(err));
});

app.post('/posts/:id/dislike', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            post.dislikes += 1;
            return post.save();
        })
        .then(post => res.json(post))
        .catch(err => res.json(err));
});

app.post('/posts/:id/comments', (req, res) => {
    const { content } = req.body;
    Post.findById(req.params.id)
        .then(post => {
            const newComment = { content, postId: req.params.id };
            post.comments.push(newComment);
            return post.save();
        })
        .then(post => res.json(post))
        .catch(err => res.json(err));
});


app.listen(5000, () => {
    console.log("Server is running");
});
