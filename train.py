import random
from datetime import datetime, timedelta

# ===== УНИКАЛДЫЛЫҚ =====
used_links = set()

def load_used():
    try:
        with open("used_links.txt", "r") as f:
            for line in f:
                used_links.add(line.strip())
    except:
        pass

def save_used(link):
    with open("used_links.txt", "a") as f:
        f.write(link + "\n")
# файлдан бұрынғы сілтемелерді жүктеу
load_used()

# ===== ДЕРЕКТЕР =====
services = [
    {"name": "Kaspi Bank", "domain": "kaspi.kz", "type": "bank"},
    {"name": "Halyk Bank", "domain": "halykbank.kz", "type": "bank"},
    {"name": "Jusan Bank", "domain": "jusan.kz", "type": "bank"},
    {"name": "ForteBank", "domain": "forte.kz", "type": "bank"},
    
    {"name": "Beeline", "domain": "beeline.kz", "type": "mobile"},
    {"name": "Kcell", "domain": "kcell.kz", "type": "mobile"},
    {"name": "Tele2", "domain": "tele2.kz", "type": "mobile"},
    
    {"name": "Kaspi Shop", "domain": "kaspi.kz/shop", "type": "shop"},
    {"name": "Wildberries", "domain": "wildberries.kz", "type": "shop"},
    {"name": "OLX", "domain": "olx.kz", "type": "shop"},
    
    {"name": "eGov", "domain": "egov.kz", "type": "gov"},
    {"name": "GOV.KZ", "domain": "gov.kz", "type": "gov"}
]

fake_domains = [
    "secure-login.xyz",
    "verify-account.site",
    "login-protect.net",
    "security-check.kz",
    "account-verify.online",
    "secure-kz.site",
    "auth-confirm.xyz"
]

actions = [
    "Сіздің аккаунтыңыз бұғатталды",
    "Күмәнді әрекет анықталды",
    "Шотыңыз уақытша тоқтатылды",
    "Төлем қабылданбады",
    "Аккаунт тексеруді қажет етеді",
    "Қауіпсіздік тексерісі қажет"
]

urgency = [
    "24 сағат ішінде растаңыз",
    "Дереу әрекет жасаңыз",
    "Қазір тексермесеңіз аккаунт жабылады",
    "Шұғыл түрде растау қажет"
]

messages = [
    "Қауіпсіздік жүйесі күмәнді әрекет анықтады.",
    "Сіздің аккаунтыңызға белгісіз құрылғы кірді.",
    "Жүйе сіздің деректеріңізді қорғау үшін уақытша шектеу қойды.",
    "Аккаунт қауіпсіздігі үшін тексеру қажет."
]
intros = [
    "Құрметті қолданушы,",
    "Сәлеметсіз бе,",
    "Назар аударыңыз,",
    "Қауіпсіздік хабарламасы:",
    "Маңызды ақпарат:"
]

endings = [
    "Егер бұл сіз болмасаңыз, дереу тексеріңіз.",
    "Бұл әрекетті растау қажет.",
    "Қауіпсіздік үшін тексеру ұсынылады.",
    "Деректеріңізді қорғау үшін әрекет жасаңыз.",
    "Кешіктірмей тексеріңіз."
]
# ===== ЛИНК ГЕНЕРАЦИЯ =====
def generate_unique_link(service):
    fake = random.choice(fake_domains)
    base = service["name"].lower().split()[0]
    return f"https://{base}-{fake}/verify"
    
def get_kz_time():
    return datetime.utcnow() + timedelta(hours=5)
    
# ===== НЕГІЗГІ ГЕНЕРАЦИЯ =====
def generate_message():
    service = random.choice(services)

    title = random.choice(actions)
    msg = random.choice(messages)
    urgent = random.choice(urgency)

    link = generate_unique_link(service)
    intro = random.choice(intros)
    ending = random.choice(endings)
    full_text = f"{intro} {msg} {urgent}. {ending}"

    # ✅ МЫНДА ЖАЗЫЛАДЫ
    now = get_kz_time()

    return {
        "service": service["name"],
        "email": f"support@{link.replace('https://','').split('/')[0]}",
        "title": title,
        "text": f"{msg} {urgent}",
        "link": link,
        "time": now.strftime("%H:%M"),
        "date": now.strftime("%d.%m.%Y"),
        "type": service["type"]
    }

# ===== ТЕСТ =====
if __name__ == "__main__":
    for _ in range(10):
        print(generate_message())
