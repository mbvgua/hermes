# python standard libraries
import os

# 3rd party libs
from flask import Flask
from dotenv import load_dotenv

# local imports

load_dotenv()


def create_app():
    """
    main function that sets up the application
    """
    app = Flask(__name__)
    # Interesting way to put it:
    # https://realpython.com/flask-database/#hide-your-secrets
    app.config.from_prefixed_env()

    print(f"Current Environment: {os.getenv('ENVIRONMENT')}")
    print(f"Using database: {app.config.get('DATABASE')}")

    return app
