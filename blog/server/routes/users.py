from flask import Blueprint
from controllers.users import signup, login, refresh_token

user_bp = Blueprint('user_bp', __name__)
user_bp.route('/signup', methods=['POST'])(signup)
user_bp.route('/login', methods=['POST'])(login)
user_bp.route('/refresh-token', methods=['POST'])(refresh_token)
