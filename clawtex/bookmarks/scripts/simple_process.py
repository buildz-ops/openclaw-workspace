import json
import sys

def process_bookmarks(file_path):
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
            print(f"Read {len(data)} bookmarks from {file_path}")
            
            # Simple dedup
            seen = set()
            unique = []
            for item in data:
                if item['id'] not in seen:
                    unique.append(item)
                    seen.add(item['id'])
            
            # Save processed
            with open("clawtex/bookmarks/processed/bookmarks_clean.json", "w") as out:
                json.dump(unique, out, indent=2)
            print(f"Saved {len(unique)} unique bookmarks.")
            
    except Exception as e:
        print(f"Error processing file: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        process_bookmarks(sys.argv[1])
    else:
        print("Usage: python3 script.py <input_file>")
