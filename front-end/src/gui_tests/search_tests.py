import unittest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import sys

URL = "https://www.campuscatalog.me/"


class Test(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        chrome_options = Options()
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-extensions")
        cls.driver = webdriver.Chrome(PATH, options=chrome_options)
        cls.driver.get(URL)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def testSearch(self):
        self.driver.get(URL + "search/q=Austin")
        self.driver.implicitly_wait(10)

        assert (
            self.driver.find_element(
                By.XPATH, "/html/body/div/div[2]/div[2]/div[1]/div[1]/div/a/u/div"
            ).text
            == "Austin Chase Apartments"
        )
        assert (
            self.driver.find_element(
                By.XPATH, "/html/body/div/div[2]/div[2]/div[2]/div[1]/div/a/u/div"
            ).text
            == "Riverland Community College"
        )
        assert (
            self.driver.find_element(
                By.XPATH, "/html/body/div/div[2]/div[2]/div[3]/div[1]/div/a/u/div"
            ).text
            == "Elephant Room"
        )


if __name__ == "__main__":
    PATH = sys.argv[1]
    unittest.main(argv=["first-arg-is-ignored"])
