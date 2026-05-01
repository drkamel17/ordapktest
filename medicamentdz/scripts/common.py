import json
import os

class Json:
    @classmethod
    def save(cls, file_path, data):
        try:
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
                return True
        except Exception as e:
            print(f"Could not save to JSON file ! Error: {e}")
            return False


    @classmethod
    def read(cls, file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Could not read from JSON file ! Error: {e}")
            return {}