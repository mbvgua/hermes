import sys
import subprocess

build_db_files = ["tables.sql", "stored-procedures.sql", "views.sql", "triggers.sql"]
complete_db_file = "db.sql"
drop_db_file = "drop-db.sql"


def remove_pending_file(remove_this):
    print("*=" * 17)
    print("")
    print(f"Found the {remove_this} file. Removing it...")
    rm_file = subprocess.run([f"rm {remove_this}"], shell=True, capture_output=True)
    if rm_file.returncode == 0:
        print("")
        print(f"Successfully removed the {remove_this} file!")
        print("")
    elif rm_file.returncode != 0:
        print("")
        print(f"An error occurred while removing the {remove_this} file: ")
        print(rm_file.stderr)


def build_db():
    print("*=" * 17)
    print("Now building the 'hermes' database...")
    # create the db.sql file with all sections on the db integrated
    for file in build_db_files:
        subprocess.run([f"cat {file}>>{complete_db_file}"], shell=True)
    # build the db
    db_process = subprocess.run(
        [f"mysql -u root -p <{complete_db_file}> output.tab"],
        shell=True,
        capture_output=True,
    )
    if db_process.returncode == 0:
        print("")
        print("Successfully setup the database. Happy hacking!")
        print("")
    elif db_process.returncode != 0:
        print("")
        print("An error occurred while setting up the database: ")
        print(db_process.stderr)
        print("")


def main():
    print("*=" * 17)
    try:
        print("")
        user_goal = "What would you like to do today?\n 1.Setup the database\n 2.Teardown the database\n 3.Query the database\n"
        print(f"{user_goal}")
        print("")
        goal = int(input("To proceed, please select one option (1/2/3): "))

        # user wants to setup the db
        if goal == 1:
            print("*=" * 17)
            print("")

            print(f"User selected option {goal}")
            current_files = subprocess.run(["ls"], capture_output=True, text=True)
            files = current_files.stdout.splitlines()
            print("")
            print("Current files in the directory are: ")
            for file in files:
                print(f"* {file}.")
            print("")

            confirm = "Y"
            while confirm != "N":
                # find the unique files present in the pwd
                current_files = set(build_db_files) & set(files)
                if current_files:
                    # if complete_db_file was already created, remove it
                    if complete_db_file in files:
                        remove_pending_file(complete_db_file)
                        build_db()
                        break
                    else:
                        build_db()
                        break

        # user wants to drop entire db
        elif goal == 2:
            print("*=" * 17)
            print("")
            print(f"User selected option {goal}")
            confirmation = input(
                "Are you sure you want to drop th entire database?(Y/n)"
            )
            if confirmation.upper() == "Y":
                print("Deleting the entire database. Hope you backed it up!?")
                db_process = subprocess.run(
                    [f"mysql -u root -p <{drop_db_file}> output.tab"],
                    shell=True,
                    capture_output=True,
                )
                if db_process.returncode == 0:
                    print("")
                    print("Successfully dropped the entire database!")
                elif db_process.returncode != 0:
                    print("")
                    print("An error occurred while dropping the database. Try again?")
                    sys.stderr.write(str(db_process.stderr))
                    sys.exit(db_process.returncode)
                else:
                    print("")
                    print(f"An error occurred: {db_process.stderr}")
            elif confirmation.upper() == "N":
                print("")
                print("Database cleanup avoided. Close call!")
            else:
                print("")
                print("Invalid choice. Please pick amongst the options provided!")
            print("")

        # user wants to interact with db directly
        elif goal == 3:
            print("*=" * 17)
            print("")
            print(f"User selected option {goal}")
            print("You are being directed to the mysql cli shell")
            # no capture_output, since that will wait for process to finish,
            # yet mysql is an interactive process
            db_process = subprocess.run(["mysql -u root -p"], shell=True)

        # user inputs an invalid input
        else:
            print("*=" * 17)
            print("")
            print("Invalid input. Please select amongst the choices given")
            print("")
    except ValueError as e:
        print("*=" * 17)
        print("")
        print("Invalid choice. Input must be a valid number!")


main()
