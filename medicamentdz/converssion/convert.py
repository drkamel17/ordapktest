import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from scripts.common import Json


def convert_meds_format(input_file, output_file):
    print(f"Reading: {input_file}")
    
    data = Json.read(input_file)
    
    if not data:
        print("Failed to read input file!")
        return False
    
    print(f"Found {sum(len(meds) for meds in data.values())} medications")
    
    print(f"Saving to: {output_file}")
    Json.save(output_file, data)
    
    print("Conversion done!")
    return True


if __name__ == "__main__":
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    
    input_file = os.path.join(BASE_DIR, 'data', 'medsold.json')
    output_file = os.path.join(BASE_DIR, 'data', 'meds.json')
    
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    if len(sys.argv) > 2:
        output_file = sys.argv[2]
    
    print("=" * 50)
    print("Conversion medsold.json -> meds.json")
    print("=" * 50)
    
    if not os.path.exists(input_file):
        print(f"Input file not found: {input_file}")
        print("\nUsage:")
        print("  python convert.py              (default: medsold.json -> meds.json)")
        print("  python convert.py input.json   (convert specific file)")
        print("  python convert.py input.json output.json")
    else:
        convert_meds_format(input_file, output_file)
