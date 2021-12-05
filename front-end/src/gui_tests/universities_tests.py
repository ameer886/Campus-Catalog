import unittest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import sys
from selenium.webdriver.common.by import By

URL = "https://www.campuscatalog.me/universities/"


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

    def testSort(self):
        self.driver.get(URL)
        self.driver.implicitly_wait(10)
        self.driver.find_element(By.XPATH, "/html/body/div/div[2]/div/div[2]/form/div[2]/div/input").click()
        self.driver.implicitly_wait(10)
        university = self.driver.find_element(By.XPATH, "/html/body/div/div[2]/div/div[1]/div[1]/div/a[1]/div/h2")

        assert university.text == "Adelphi University"

    def testFilter(self):
        self.driver.get(URL)
        self.driver.implicitly_wait(10)
        self.driver.find_element(By.XPATH, "/html/body/div/div[2]/div/div[2]/div/button").click()
        city_filter = self.driver.find_element(By.XPATH, "/html/body/div[2]/div[3]/div[1]/form/div/div/input")
        city_filter.send_keys("Austin")
        self.driver.find_element(By.XPATH, "/html/body/div[2]/div[2]/div/button").click()
        self.driver.implicitly_wait(10)

        university = self.driver.find_element(By.XPATH, "/html/body/div[1]/div[2]/div/div[1]/div[1]/div/a/div/h2")

        assert university.text == "The University of Texas at Austin"
        
    def testUniversityInstance(self):
        self.driver.get("https://www.campuscatalog.me/universities/100751/")
        self.driver.implicitly_wait(20)
        name = self.driver.find_element(By.CLASS_NAME, "University_Name__2p2Pf").text
        assert name == "The University of Alabama"
        address = self.driver.find_element(By.CLASS_NAME,
            "University_Location__2j2b-"
        ).text
        assert address == "Tuscaloosa, AL 35487-0100"


if __name__ == "__main__":
    PATH = sys.argv[1]
    unittest.main(argv=["first-arg-is-ignored"])
