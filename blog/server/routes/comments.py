from flask import Blueprint
from controllers.comments import create_comment, get_comments

comment_bp = Blueprint('comment_bp', __name__)
comment_bp.route('/comment', methods=['POST'])(create_comment)
comment_bp.route('/comments/<int:post_id>', methods=['GET'])(get_comments)

