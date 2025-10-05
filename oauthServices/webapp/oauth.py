import os
import json

from flask import Blueprint, jsonify, request, redirect
from dotenv import load_dotenv
import requests
from oauthlib.oauth2 import WebApplicationClient

from .db import get_db

load_dotenv()

oauth = Blueprint("oauth", __name__)

# get the env variables
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"

client = WebApplicationClient(GOOGLE_CLIENT_ID)


@oauth.route("login/google", methods=["GET", "POST"])
def google_login():
    """
    login user via Google Oauth
    """
    try:
        # get the google endpoint to hit for oauth login
        google_provider_cfg = requests.get(GOOGLE_DISCOVERY_URL).json()
        authorization_endpoint = google_provider_cfg["authorization_endpoint"]

        # build the requests for google login
        # and define the scopes to retrive user profiles
        request_uri = client.prepare_request_uri(
            authorization_endpoint,
            redirect_uri=request.base_url + "/callback",
            scope=["openid", "email", "profile"],
        )
        # response = jsonify(code=500, status="error", message="Internals are nice")
        return redirect(request_uri)
    except Exception as e:
        message = f"Oops! Looks like an error occurred during login with google: {e}"
        return (
            jsonify(
                code=500,
                status="Internal server error",
                message=message,
                data=e,
                metadata=None,
            ),
            500,
        )

    # db = get_db()
    # # users = db.execute(".tables")
    # users = db.execute("SELECT * FROM oauth_users WHERE is_deleted=0;").fetchall()
    # print(users)
    # print(GOOGLE_CLIENT_ID)


@oauth.route("login/google/callback", methods=["GET", "POST"])
def authorize_google():
    """
    user gives client(the app) authorization to use their data from
    google(the server) for registering/logging in in app
    """
    try:
        code = request.args.get("code")

        # get endpoint to hit for google tokens
        google_provider_cfg = requests.get(GOOGLE_DISCOVERY_URL).json()
        token_endpoint = google_provider_cfg["token_endpoint"]

        # prepare and send the request to get the tokens
        token_url, headers, body = client.prepare_token_request(
            token_endpoint,
            authorization_response=request.url,
            redirect_url=request.base_url,
            code=code,
        )
        token_response = requests.post(
            token_url,
            headers=headers,
            data=body,
            auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
        )

        # parse the tokens
        client.parse_request_body_response(json.dumps(token_response.json()))

        # with token, find URL from google with users profile info
        # including their Google profile image and email
        userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
        uri, headers, body = client.add_token(userinfo_endpoint)
        userinfo_response = requests.get(uri, headers=headers, data=body)

        # check if the users email account is verified as this
        # if so, you've verified/authorized their email through Google!
        if userinfo_response.json().get("email_verified"):
            unique_id = userinfo_response.json()["sub"]
            users_email = userinfo_response.json()["email"]
            users_picture = userinfo_response.json()["picture"]
            users_name = userinfo_response.json()["given_name"]
        else:
            message = "Oh no! It looks like your email is not available or not verified by Google."
            return (
                jsonify(
                    code=404,
                    status="error",
                    message=message,
                    data=userinfo_response.json().get("email_verified"),
                    metadata=None,
                ),
                404,
            )

        # check is user exists in db
        db = get_db()
        users = db.execute(
            # MUST place , after last value, else bindings error
            "SELECT * FROM oauth_users WHERE email=? AND is_deleted=0;",
            (users_email,),
        ).fetchone()
        # if not create user in db with this info
        if not users:
            # MUST place , after last value, else bindings error
            db.execute(
                "INSERT INTO oauth_users(id,username,email,profile_pic) VALUES(?,?,?,?);",
                (
                    unique_id,
                    users_name,
                    users_email,
                    users_picture,
                ),
            )
            db.commit()

        message = (
            f"Congratulations {users_name}! You have successfuly logged in with google"
        )
        return (
            jsonify(
                code=201,
                status="success",
                message=message,
                data={"id": unique_id, "username": users_name, "email": users_email},
                metadata=None,
            ),
            201,
        )
    except Exception as e:
        message = f"Oops! An error occurred: {e}"
        return (
            jsonify(
                code=500,
                status="error",
                message=message,
                data=None,
                metadata=None,
            ),
            500,
        )
