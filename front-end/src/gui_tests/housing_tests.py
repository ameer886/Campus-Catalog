import unittest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import sys

URL = "https://www.campuscatalog.me/housing/"

class Test(unittest.TestCase):
   @classmethod
   def setUpClass(cls):
      chrome_options = Options()
      chrome_options.add_argument('--no-sandbox')
      chrome_options.add_argument('--headless')
      chrome_options.add_argument('--disable-dev-shm-usage')
      chrome_options.add_argument("--disable-extensions")
      cls.driver = webdriver.Chrome(PATH, options=chrome_options)
      cls.driver.get(URL)

   @classmethod
   def tearDownClass(cls):
      cls.driver.quit()
   
   def testHousingInstance(self):
      self.driver.get('https://www.campuscatalog.me/housing/d2qz44k2/')
      self.driver.implicitly_wait(20)
      name = self.driver.find_element_by_class_name('Apartment_Name__Qv9vF').text
      assert name == 'Gather Oxford'
      address = self.driver.find_element_by_class_name('Apartment_Location__1Vfrq').text
      assert address == 'Oxford, 207 Hathorn Rd'

if __name__ == "__main__":
   PATH = sys.argv[1]
   unittest.main(argv=['first-arg-is-ignored'])