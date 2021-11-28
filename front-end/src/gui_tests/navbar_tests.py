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

    def testHome(self):
        self.driver.get(URL)
        self.driver.implicitly_wait(10)
        self.driver.find_element(By.LINK_TEXT,"Campus Catalog").click()
        assert self.driver.title == "Campus Catalog"
        assert URL == self.driver.current_url
        text = self.driver.find_element(By.CLASS_NAME,
            "CampCatSplashPage_Title__1VpUg"
        ).text
        assert text == "Campus Catalog"

    def testAbout(self):
        self.driver.get(URL)
        self.driver.implicitly_wait(10)
        self.driver.find_element(By.LINK_TEXT,"About").click()
        text = self.driver.find_element(By.CLASS_NAME,"AboutPage_Section__1c-dF").text
        assert text == "Our Mission"

        self.driver.back()
        currentURL = self.driver.current_url
        assert currentURL == URL

    def testHousing(self):
        self.driver.get(URL)
        self.driver.implicitly_wait(10)
        self.driver.find_element(By.LINK_TEXT,"Housing").click()
        self.driver.implicitly_wait(30)
        text = self.driver.find_element(By.TAG_NAME,"h1").text
        assert text == "Housing"

        self.driver.back()
        currentURL = self.driver.current_url
        assert currentURL == URL

    def testAmenities(self):
        self.driver.get(URL)
        self.driver.implicitly_wait(10)
        self.driver.find_element(By.LINK_TEXT, "Amenities").click()
        self.driver.implicitly_wait(30)
        text = self.driver.find_element(By.TAG_NAME, "h1").text
        assert text == "Amenities"

        self.driver.back()
        currentURL = self.driver.current_url
        assert currentURL == URL

    def testUniversities(self):
        self.driver.get(URL)
        self.driver.implicitly_wait(10)
        self.driver.find_element(By.LINK_TEXT, "Universities").click()
        self.driver.implicitly_wait(30)
        text = self.driver.find_element(By.TAG_NAME, "h1").text
        assert text == "Universities"

        self.driver.back()
        currentURL = self.driver.current_url
        assert currentURL == URL

    def testSearch(self):
        self.driver.get(URL)
        self.driver.implicitly_wait(10)
        search_box = self.driver.find_element(By.XPATH, "/html/body/div/div[1]/nav/form/div/input")
        search_box.send_keys("Austin")
        self.driver.find_element(By.CLASS_NAME, "OurNavbar_searchButton__TnmJN btn btn-info").click()

        assert self.driver.current_url == "https://www.campuscatalog.me/search/q=Austin/"
        assert self.driver.find_element(By.XPATH, "/html/body/div/div[2]/h1[1]").text == "SEARCH RESULTS"
        assert self.driver.find_element(By.XPATH, "/html/body/div/div[2]/h2").text == "Austin"



if __name__ == "__main__":
    PATH = sys.argv[1]
    unittest.main(argv=["first-arg-is-ignored"])
