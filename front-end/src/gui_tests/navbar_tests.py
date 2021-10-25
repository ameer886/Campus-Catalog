import unittest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import sys

URL = "https://www.campuscatalog.me/"

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
   
   def testHome(self):
      self.driver.get(URL)
      self.driver.implicitly_wait(10)
      self.driver.find_element_by_link_text('Campus Catalog').click()
      assert self.driver.title == "Campus Catalog"
      assert URL == self.driver.current_url
      text = self.driver.find_element_by_class_name('CampCatSplashPage_Title__1VpUg').text
      assert text == 'Campus Catalog'
   
   def testAbout(self):
      self.driver.get(URL)
      self.driver.implicitly_wait(10)
      self.driver.find_element_by_link_text('About').click()
      text = self.driver.find_element_by_class_name('AboutPage_Section__1c-dF').text
      assert text == 'Our Mission'

      self.driver.back()
      currentURL = self.driver.current_url
      assert currentURL == URL

   def testHousing(self):
      self.driver.get(URL)
      self.driver.implicitly_wait(10)
      self.driver.find_element_by_link_text('Housing').click()
      self.driver.implicitly_wait(30)
      text = self.driver.find_element_by_tag_name('h1').text
      assert text == 'Housing'

      self.driver.back()
      currentURL = self.driver.current_url
      assert currentURL == URL
   
   def testAmenities(self):
      self.driver.get(URL)
      self.driver.implicitly_wait(10)
      self.driver.find_element_by_link_text('Amenities').click()
      self.driver.implicitly_wait(30)
      text = self.driver.find_element_by_tag_name('h1').text
      assert text == 'Amenities'

      self.driver.back()
      currentURL = self.driver.current_url
      assert currentURL == URL

   def testUniversities(self):
      self.driver.get(URL)
      self.driver.implicitly_wait(10)
      self.driver.find_element_by_link_text('Universities').click()
      self.driver.implicitly_wait(30)
      text = self.driver.find_element_by_tag_name('h1').text
      assert text == 'Universities'

      self.driver.back()
      currentURL = self.driver.current_url
      assert currentURL == URL


if __name__ == "__main__":
    PATH = sys.argv[1]
    unittest.main(argv=['first-arg-is-ignored'])

