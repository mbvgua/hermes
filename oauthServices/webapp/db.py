# python standard libs
import sqlite3

# 3rd party libs
from flask import current_app, g
from flask.cli import with_appcontext
import click

# local imports


def get_db():
    """
    returns a database connection. either returning an existing one
    or establishing a new one
    """

    # g -> provides a global namespace you use as temp storage when user
    # makes a request. Each request has its own g object, that resets at the
    # end of the request.
    if "db" not in g:
        # connect to db in .env file with sqlite3
        g.db = sqlite3.connect(
            current_app.config["DATABASE"],
            detect_types=sqlite3.PARSE_DECLTYPES,
        )
        # interact with db columns by their names. Like a dictionary
        g.db.row_factory = sqlite3.Row

    return g.db


def close_db(e=None):
    """
    close the db connection.
    e -> Error. Though not used, it allows for error handling
    """
    # retrieve and remove db connection fom the "g" object. This
    # means any active connections are closes eventually
    # NOTE: 1 over express: I have to manually connect then later 
    # connection.release() everytime
    db = g.pop("db", None)

    if db is not None:
        db.close()


def init_app(app):
    """
    core logic for db initialization
    add init_db_command() as a CLI command with click
    """
    # close db when app context closes. the app context in flask is 
    # created in each request.
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)


@click.command("init-db")
def init_db_command():
    db = get_db()

    # read and execute commands from "db.sql" file, creating
    # tables and setting up the schema
    with current_app.open_resource("database/db.sql") as f:
        db.executescript(f.read().decode("utf-8"))

    click.echo("You successfully initialized the database")
