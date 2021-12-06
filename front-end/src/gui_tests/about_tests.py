import unittest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import sys

URL = "https://www.campuscatalog.me/about/"


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

    def testAboutInformation(self):
        self.driver.get(URL)
        self.driver.implicitly_wait(20)
        assert self.driver.title == "Campus Catalog"
        title = self.driver.find_element(By.CLASS_NAME, "AboutPage_Title__2srkJ").text
        assert title == "About"
        subheaders = [
            "Our Mission",
            "Why Use Our Website?",
            "Us",
            "Our Codebase",
            "Our Tools",
            "Our APIs",
        ]
        elems = self.driver.find_elements(By.CLASS_NAME, "AboutPage_Section__1c-dF")
        assert [x.text for x in elems] == subheaders

    def testCodebaseLinks(self):
        self.driver.get(URL)
        self.driver.implicitly_wait(30)

        link = self.driver.find_element(
            By.LINK_TEXT, "Our GitLab repository"
        ).get_attribute("href")
        assert link == "https://gitlab.com/RG8452/campus-catalog/"

        link = self.driver.find_element(By.LINK_TEXT, "Our Postman docs").get_attribute(
            "href"
        )
        assert link == "https://documenter.getpostman.com/view/17627995/UUy3A7Rd"


if __name__ == "__main__":
    PATH = sys.argv[1]
    unittest.main(argv=["first-arg-is-ignored"])
