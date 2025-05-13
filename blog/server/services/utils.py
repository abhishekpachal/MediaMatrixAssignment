import hashlib
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
TOKEN_EXPIRATION = 60 
TOKEN_EXPIRATION_REFRESH = 24*60  

class Utils:
    # Password hashing function
    @staticmethod
    def sha256_hash(password):
        return hashlib.sha256(password.encode()).hexdigest()
    
    # Function to check if the email is valid
    @staticmethod
    def is_valid_email(email):
        import re
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        return re.match(email_regex, email) is not None
    
    @staticmethod
    def generate_jwt(user_id):
        expiration = datetime.now(
        ) + timedelta(minutes=TOKEN_EXPIRATION)
        payload = {"sub": user_id, "exp": expiration}
        refresh_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return refresh_token
    
    @staticmethod
    def decode_token(token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
        
    @staticmethod
    def create_refresh_token(user_id):
        expiration = datetime.now(
        ) + timedelta(minutes=TOKEN_EXPIRATION_REFRESH)
        payload = {"sub": user_id, "exp": expiration}
        refresh_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return refresh_token
    
    @staticmethod
    def get_current_time():
        return datetime.now()