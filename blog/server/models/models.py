from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# User model for storing user information


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    created_on = db.Column(
        db.DateTime, default=datetime.now, nullable=False)

# Post model for storing blog posts


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)

    created_on = db.Column(
        db.DateTime, default=datetime.now, nullable=False)
    modified_on = db.Column(
        db.DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    comment_count = db.Column(db.Integer, default=0)

# Comment model for storing comments on posts


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)

    created_on = db.Column(
        db.DateTime, default=datetime.now, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
