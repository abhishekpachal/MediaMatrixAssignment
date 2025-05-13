from flask import Blueprint
from controllers.posts import create_post, get_posts, get_post, edit_post, delete_post

post_bp = Blueprint('post_bp', __name__)
post_bp.route('/create', methods=['POST'])(create_post)
post_bp.route('/posts', methods=['GET'])(get_posts)
post_bp.route('/post/<int:post_id>', methods=['GET'])(get_post)
post_bp.route('/edit', methods=['POST'])(edit_post)
post_bp.route('/delete', methods=['POST'])(delete_post)
