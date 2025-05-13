from flask import request, g
from models.models import Comment, User, Post, db
from services.response import ResponseService
from services.utils import Utils
from middlewares.auth_decorator import require_jwt


@require_jwt
def create_comment():
    data = request.get_json()
    content = data.get('content')
    post_id = data.get('post_id')
    user_id = g.user_id

    # Validate input
    if not content or not post_id:
        return ResponseService.create_response(400, 0, "Invalid Request")

    # Check for comment length
    if len(content) < 5:
        return ResponseService.create_response(400, 0, "Minimum 5 characters")

    # Check if post exists
    post = Post.query.filter_by(id=post_id).first()
    if not post:
        return ResponseService.create_response(404, 0, "Post not found")

    # Create comment
    created_on = Utils.get_current_time()
    comment = Comment(content=content, post_id=post_id,
                      user_id=user_id, created_on=Utils.get_current_time())
    db.session.add(comment)
    db.session.commit()

    post.comment_count += 1
    db.session.commit()
    # Get author name
    author = User.query.filter_by(id=user_id).first()
    if author:
        comment.author_name = author.name
    else:
        comment.author_name = "Unknown"
    comment_data = {
        "id": comment.id,
        "content": comment.content,
        "post_id": comment.post_id,
        "user_id": comment.user_id,
        "author_name": comment.author_name,
        "created_on": created_on.strftime("%Y-%m-%d %H:%M:%S")
    }

    return ResponseService.create_response(201, 1, "Comment saved", {"comment": comment_data})


def get_comments(post_id):
    # Check if post exists
    post = Post.query.filter_by(id=post_id).first()
    if not post:
        return ResponseService.create_response(404, 0, "Post not found")

    # Get comments for the post
    comments = Comment.query.filter_by(post_id=post_id).all()

    comment_set = []
    for comment in comments:
        # get author name
        author = User.query.filter_by(id=comment.user_id).first()
        print(author)
        if author:
            comment.author_name = author.name
        else:
            comment.author_name = "Unknown"
        comment_set.append({
            "id": comment.id,
            "content": comment.content,
            "user_id": comment.user_id,
            "author_name": comment.author_name,
            "created_on": comment.created_on.strftime("%Y-%m-%d %H:%M:%S")
        })

    return ResponseService.create_response(200, 1, "", {"comments": comment_set})
