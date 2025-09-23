## Setup

To setup and run the application, you need to navigate to this parent directory first, then create and activate a virtual virtual environment:

```bash
$ python -m venv .venv
$ source .venv/bin/activate
```

Then you will install all the needed requirements located in the [`requirements.txt`](./requirements.txt) file:

```bash
(.venv) $ pip install -r requirements.txt
```

Finally you will first have to initialize the database, then run the application server:

```bash
(.venv) $ flask init-db
(.venv) $ python app.py
```
