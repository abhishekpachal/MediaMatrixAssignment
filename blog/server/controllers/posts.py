from flask import request, g
from models.models import Post, User, Comment, db
from services.response import ResponseService
from services.utils import Utils
from middlewares.auth_decorator import require_jwt


@require_jwt
def create_post():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    user_id = g.user_id

    # Validate input
    if not title or not content:
        return ResponseService.create_response(400, 0, "Invalid Request")

    # Check for post length
    if len(title) < 5 or len(content) < 10:
        return ResponseService.create_response(400, 0, "Invalid Request")

    # Create post
    post = Post(title=title, content=content, user_id=user_id)
    db.session.add(post)
    db.session.commit()

    return ResponseService.create_response(201, 1, "Post Created", {"post_id": post.id})


def get_posts():
    # sort posts by created_on descending
    posts = Post.query.order_by(Post.created_on.desc()).all()

    post_set = []
    # get author name
    for post in posts:
        author = User.query.filter_by(id=post.user_id).first()
        if author:
            post.author_name = author.name
        else:
            post.author_name = "Unknown"
    # get post data
    for post in posts:
        post_set.append({
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "user_id": post.user_id,
            "comment_count": post.comment_count,
            "created_on": post.created_on.strftime("%Y-%m-%d %H:%M:%S"),
            "author_name": post.author_name
        })

    return ResponseService.create_response(200, 1, "", {"posts": post_set})


def get_post(post_id):
    post = Post.query.filter_by(id=post_id).first()
    if not post:
        return ResponseService.create_response(404, 0, "Post not found")
    # get author name
    author = User.query.filter_by(id=post.user_id).first()
    if author:
        post.author_name = author.name
    else:
        post.author_name = "Unknown"
    post_data = {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "user_id": post.user_id,
        "comment_count": post.comment_count,
        "author_name": post.author_name,
        "created_on": post.created_on.strftime("%Y-%m-%d %H:%M:%S")
    }
    return ResponseService.create_response(200, 1, "", {"post": post_data})


@require_jwt
def edit_post():
    data = request.get_json()
    post_id = data.get('post_id')
    title = data.get('title')
    content = data.get('content')

    # Validate input
    if not title or not content:
        return ResponseService.create_response(400, 0, "Invalid Request")

    # Check for post length
    if len(title) < 5 or len(content) < 10:
        return ResponseService.create_response(400, 0, "Invalid Request")

    post = Post.query.filter_by(id=post_id).first()
    if not post:
        return ResponseService.create_response(404, 0, "Post not found")

    post.title = title
    post.content = content
    post.modified_on = Utils.get_current_time()
    db.session.commit()

    return ResponseService.create_response(200, 1, "Post Updated", {"post_id": post.id})


@require_jwt
def delete_post():
    data = request.get_json()
    post_id = data.get('post_id')
    user_id = g.user_id
    # Check if post exists with user_id and post_id
    post = Post.query.filter_by(id=post_id, user_id=user_id).first()
    if not post:
        return ResponseService.create_response(404, 0, "Post not found")

    db.session.delete(post)
    db.session.commit()

    return ResponseService.create_response(200, 1, "Post Deleted", {"post_id": post.id})
