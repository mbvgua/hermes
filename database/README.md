# Database

A relational database schema was used, i.e [`MySql`](https://www.mysql.com/). It comprises of the following main sections:

- [Tables](./tables.sql)
- [Stored Procedures](./stored-procedures.sql)
- [Views](./views.sql)
- [Triggers](./triggers.sql)

## Setup

To setup the database instantly with the use of a script, you will need to have [`Python`](https://www.python.org/downloads/) installed on your device. Then:

```bash
    python setup.py
```

You will be prompted for your password, and if correct the database will automatically be created/deleted.

> [!NOTE]
>
> The recommended `python` version to have is `python 3.1*` and above. I built the script using `python 3.13` hence older versions of python might have some unforeseen edge cases.
>
> You also need to have `mysql-cli` installed. Do not confuse this with the `MySql Work Bench` application, as they are not the same. The latter cannot be run from the terminal and is a GUI app. Installing the former ensures an easier workflow.
