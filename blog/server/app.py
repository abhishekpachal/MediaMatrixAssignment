from flask import Flask
from config import Config
from models.models import db
from routes.users import user_bp
from routes.posts import post_bp
from routes.comments import comment_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app,
     supports_credentials=True,
     origins=["http://localhost:5173"],  # Frontend origin
     allow_headers=["Content-Type", "Authorization"])
app.config.from_object(Config)

db.init_app(app)

# Register Blueprints
app.register_blueprint(user_bp, url_prefix='/users')
app.register_blueprint(post_bp, url_prefix='/posts')
app.register_blueprint(comment_bp, url_prefix='/comments')


with app.app_context():
    db.create_all()


@app.route('/')
def index():
    return {"message": "Blog server is running!"}


if __name__ == '__main__':
    app.run(debug=True)
