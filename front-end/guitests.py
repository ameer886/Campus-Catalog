import os
from sys import platform

if __name__ == "__main__":
    # Use chromedriver based on OS
    if platform == "win32":
        PATH = "./front-end/src/gui_tests/chromedriver.exe"
    elif platform == "linux":
        PATH = "./front-end/src/gui_tests/chromedriver_linux"
    else:
        print("Unsupported OS")
        exit(-1)

    os.system("python3 ./front-end/src/gui_tests/navbar_tests.py " + PATH)
    os.system("python3 ./front-end/src/gui_tests/about_tests.py " + PATH)
    os.system("python3 ./front-end/src/gui_tests/amenities_tests.py " + PATH)
    os.system("python3 ./front-end/src/gui_tests/housing_tests.py " + PATH)
    os.system("python3 ./front-end/src/gui_tests/universities_tests.py " + PATH)
