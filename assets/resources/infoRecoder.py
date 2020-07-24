res = {
    "nature": [],
    "city": [],
    "landscape": [],
    "recent": []
}

def r():
    for i in range(1, 100):
        t = str(input(f"image: h ({i}), input the type <n/c/l/r>: "))
        while(t not in ('n', 'c', 'l', 'r')):
            t = str(input(f"image: h ({i}), input the type <n/c/l/r>: "))
        while(True):
            try:
                l_digit = int(input("year: "))
                if l_digit == 0:
                    year = 2020
                else:
                    year = int(f"201{l_digit}")
            except Exception:
                continue
            else:
                break
        title = ""
        description = ""
        if t == "n":
            d = res["nature"]
        elif t == "c":
            d = res["city"]
        elif t == "l":
            d = res["landscape"]
        elif t == "r":
            d = res["recent"]

        d.append({"src": rf"/assets/images/img ({i}).jpg",
                  "year": year,
                  "title": title,
                  "description": description,
                  "gps": []
                  })
            
    import json
    with open("img.json", "w") as f:
        json.dump(res, f)

r()