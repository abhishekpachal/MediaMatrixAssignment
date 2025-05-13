from flask import request
from models.models import User, db
from services.response import ResponseService
from services.utils import Utils
import jwt


def signup():
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')

    # Validate input
    if not email or not name or not password:
        return ResponseService.create_response(400, 0, "Invalid Request")

    # Check if email is valid
    if not Utils.is_valid_email(email):
        return ResponseService.create_response(400, 0, "Invalid email address")

    # Check if email already exists
    if User.query.filter_by(email=email).first():
        return ResponseService.create_response(400, 0, "Email already registered")

    # Check for passsword length
    if len(password) < 6:
        return ResponseService.create_response(400, 0, "Password must be minimum 6 characters long")

    # hash sha256 password
    hashed_password = Utils.sha256_hash(password)
    user = User(email=email, name=name, password=hashed_password)
    db.session.add(user)
    db.session.commit()

    return ResponseService.create_response(201, 1, "Registration Complete. Login Now", {"success": True})


def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Validate input
    if not email or not password:
        return ResponseService.create_response(400, 0, "Invalid Request")
    # Check if email is valid
    if not Utils.is_valid_email(email):
        return ResponseService.create_response(400, 0, "Invalid email address")
    # Check if user exists
    user = User.query.filter_by(email=email).first()
    if not user:
        return ResponseService.create_response(400, 0, "User not found")

    # Check password
    hashed_password = Utils.sha256_hash(password)
    if user.password != hashed_password:
        return ResponseService.create_response(400, 0, "Invalid password")

    # Generate JWT token
    token = Utils.generate_jwt(user.id)
    # Generate refresh token
    refresh_token = Utils.create_refresh_token(user.id)
    return ResponseService.create_response(200, 1, "Login successful", {"access_token": token, "refresh_token": refresh_token, "user": {"id": user.id, "name": user.name, "email": user.email}})


def refresh_token():
    # Check if token is present in headers
    token = request.headers.get("authorization")
    if not token:
        return ResponseService.create_response(status_code=401, status=0, msg="Token is required")
    try:
        # Decode the token
        payload = Utils.decode_token(token)
    except jwt.ExpiredSignatureError:
        return ResponseService.create_response(status_code=401, status=0, msg="Token expired")
    except jwt.InvalidTokenError:
        return ResponseService.create_response(status_code=401, status=0, msg="Invalid token")
    user_id = payload.get("sub")
    # generate new token
    new_token = Utils.generate_jwt(user_id)
    # generate new refresh token
    new_refresh_token = Utils.create_refresh_token(user_id)
    return ResponseService.create_response(status_code=200, status=1, response={"access_token": new_token, "refresh_token": new_refresh_token}, msg="")
