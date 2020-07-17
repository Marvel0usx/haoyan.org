import json
from PIL import Image

js = {}

with open("img.js", "r") as f:
    js = json.load(f)

for category in js:
    for item in js[category]:
        src = r"E:\\programming\\Front-end Dev\\harry-s-page" + item['src']
        img = Image.open(src)
        item["width"] = img.size[0]
        item["height"] = img.size[1]
        del img

with open("img.js", "w") as f:
    json.dump(js, f)