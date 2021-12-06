import unittest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import sys

URL = "https://www.campuscatalog.me/housing/"


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
        self.driver.find_element(
            By.XPATH, "/html/body/div/div[2]/div/table/thead/tr/th[1]"
        ).click()
        self.driver.implicitly_wait(10)
        housing = self.driver.find_element(
            By.XPATH, "/html/body/div/div[2]/div/table/tbody/tr[1]/td[1]/a"
        )

        assert housing.text == "05 Buckhead"

    def testFilter(self):
        self.driver.get(URL)
        self.driver.implicitly_wait(10)
        self.driver.find_element(
            By.XPATH, "/html/body/div/div[2]/div/div[1]/div/div/button"
        ).click()
        city_filter = self.driver.find_element(
            By.XPATH, "/html/body/div[2]/div[3]/div[2]/form/div/div/input"
        )
        city_filter.send_keys("Austin")
        self.driver.find_element(
            By.XPATH, "/html/body/div[2]/div[2]/div/button"
        ).click()
        self.driver.implicitly_wait(10)

        housing = self.driver.find_element(
            By.XPATH, "/html/body/div/div[2]/div/table/tbody/tr[1]/td[1]/a"
        )

        assert housing.text == "Rhythm"

    def testHousingInstance(self):
        self.driver.get("https://www.campuscatalog.me/housing/d2qz44k2/")
        self.driver.implicitly_wait(20)
        name = self.driver.find_element(By.CLASS_NAME, "Apartment_Name__Qv9vF").text
        assert name == "Gather Oxford"
        address = self.driver.find_element(
            By.CLASS_NAME, "Apartment_Location__1Vfrq"
        ).text
        assert address == "Oxford, 207 Hathorn Rd"


if __name__ == "__main__":
    PATH = sys.argv[1]
    unittest.main(argv=["first-arg-is-ignored"])
