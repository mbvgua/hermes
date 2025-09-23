from flask import Blueprint, jsonify
from .db import get_db

oauth = Blueprint("oauth", __name__)


@oauth.route("/get-users", methods=["GET", "POST"])
def get_users():
    """
    get all users who created accounts with oauth database
    """
    db = get_db()
    # users = db.execute(".tables")
    users = db.execute("SELECT * FROM oauth_users WHERE is_deleted=0;").fetchall()
    print(users)
    response = jsonify(
        code=500,
        status="error",
        message="Internals are nice"
    )
    return response
