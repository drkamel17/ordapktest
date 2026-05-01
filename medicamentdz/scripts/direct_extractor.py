import string
import requests as rq
from bs4 import BeautifulSoup
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from scripts.common import Json
from scripts.med import MedInfoExtractor
from scripts.lab import LabInfoExtractor


class DirectMedExtractor:
    site_url = "https://pharmnet-dz.com/"
    letters = list(string.ascii_uppercase)

    @classmethod
    def extract_nb_pages(cls, letter):
        letter_link = "{}{}{}".format(cls.site_url, 'alphabet.aspx?char=', letter)
        res = rq.get(letter_link)
        if res.status_code == 200:
            soup = BeautifulSoup(res.content, "lxml")
            return len(soup.select('a.btn.btn-xs.btn-warning')) + 1
        return 0

    @classmethod
    def extract_page_med_links(cls, letter, page):
        links = []
        letter_link = "{}{}{}".format(cls.site_url, 'alphabet.aspx?char=', letter)
        res = rq.get('{}&p={}'.format(letter_link, page))
        if res.status_code == 200:
            soup = BeautifulSoup(res.content, 'lxml')
            med_items = soup.select('[scope="row"] > td:nth-of-type(1) > a:nth-of-type(1)')
            for med in med_items:
                links += ['{}{}'.format(cls.site_url, med['href'])]
        return links

    @classmethod
    def extract_all(cls, save_path=None):
        meds = {letter: [] for letter in cls.letters}
        
        for letter in cls.letters:
            nb_pages = cls.extract_nb_pages(letter)
            print(f"Letter {letter}: {nb_pages} pages")
            
            for page in range(1, nb_pages + 1):
                print(f"Letter {letter} | Page [{page}/{nb_pages}]", end="\r")
                links = cls.extract_page_med_links(letter, page)
                
                for i, link in enumerate(links):
                    try:
                        print(f"Letter {letter} | Page {page} | Med [{i+1}/{len(links)}]", end="\r")
                        med = MedInfoExtractor.scrap_med_page(link)
                        if med:
                            if 'lab' in med and 'link' in med['lab']:
                                LabInfoExtractor.extract(med['lab'])
                            meds[letter].append(med)
                    except Exception as e:
                        print(f"Error: {link}")
                
                if save_path:
                    Json.save(save_path, meds)
                    print(f"Letter {letter} | Saved")
        
        return meds


if __name__ == "__main__":
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    MED_INFOS_DB = os.path.join(BASE_DIR, 'data', 'meds.json')
    
    print(f"Saving to: {MED_INFOS_DB}")
    print("Extracting all medications directly...")
    DirectMedExtractor.extract_all(save_path=MED_INFOS_DB)
    print("Done!")
