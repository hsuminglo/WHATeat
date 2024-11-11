import json
import random

def generate_restaurant():
    restaurant_types = ["中式", "日式", "韓式", "義式", "美式", "泰式", "越式", "印度料理"]
    price_ranges = ["$", "$$", "$$$", "$$$$"]
    busyness_levels = ["低", "中", "高"]

    # Taipei coordinates
    lat = random.uniform(25.0, 25.1)
    lng = random.uniform(121.5, 121.6)

    return {
        "id": random.randint(1, 1000),
        "name": f"{random.choice(['好吃', '美味', '美好', '幸福', '快樂'])}{random.choice(['餐廳', '小館', '食堂', '廚房'])}",
        "image": f"https://source.unsplash.com/random/800x600/?restaurant,food&{random.randint(1, 1000)}",
        "travelTime": f"{random.randint(5, 60)}分鐘",
        "type": random.choice(restaurant_types),
        "priceRange": random.choice(price_ranges),
        "groupFriendly": random.choice([True, False]),
        "busyness": random.choice(busyness_levels),
        "recommendationScore": round(random.uniform(6, 10), 1),
        "latitude": lat,
        "longitude": lng
    }

if __name__ == "__main__":
    restaurant = generate_restaurant()
    print(json.dumps(restaurant, ensure_ascii=False, indent=2))