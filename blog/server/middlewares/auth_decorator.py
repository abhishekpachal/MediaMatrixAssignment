from functools import wraps
from flask import request, jsonify, g
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"


def require_jwt(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({
                "status_code": 403,
                "status": 0,
                "msg": "Forbidden"
            }), 403

        token = token.replace("Bearer ", "")
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            if user_id is None:
                return jsonify({
                    "status_code": 401,
                    "status": 0,
                    "msg": "Unauthorized"
                }), 401
            g.user_id = user_id
        except jwt.ExpiredSignatureError:
            return jsonify({
                "status_code": 401,
                "status": 0,
                "msg": "Token expired"
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                "status_code": 401,
                "status": 0,
                "msg": "Invalid token"
            }), 401
        except Exception:
            return jsonify({
                "status_code": 401,
                "status": 0,
                "msg": "Unauthorized"
            }), 401

        return func(*args, **kwargs)

    return wrapper


