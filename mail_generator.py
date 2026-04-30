import random
from datetime import datetime, timedelta

services = [
    {
        "name": "Kaspi Bank",
        "real_domain": "kaspi.kz",
        "logo": "https://kaspi.kz/favicon.ico",
        "type": "bank",
    },
    {
        "name": "Halyk Bank",
        "real_domain": "halykbank.kz",
        "logo": "https://halykbank.kz/favicon.ico",
        "type": "bank",
    },
    {
        "name": "Jusan Bank",
        "real_domain": "jusan.kz",
        "logo": "https://jusan.kz/favicon.ico",
        "type": "bank",
    },
    {
        "name": "Tele2",
        "real_domain": "tele2.kz",
        "logo": "https://tele2.kz/favicon.ico",
        "type": "mobile",
    },
    {
        "name": "Beeline",
        "real_domain": "beeline.kz",
        "logo": "https://beeline.kz/favicon.ico",
        "type": "mobile",
    },
    {
        "name": "eGov",
        "real_domain": "egov.kz",
        "logo": "https://egov.kz/favicon.ico",
        "type": "gov",
    },
]

fake_domains = [
    "secure-login.xyz",
    "verify-account.site",
    "login-protect.net",
    "account-verify.online",
    "auth-confirm.xyz",
    "secure-kz.site",
    "client-check.net",
]

levels = ["Жеңіл деңгей", "Орташа деңгей", "Қиын деңгей"]

phishing_titles = [
    "Картаңыз уақытша бұғатталды",
    "Аккаунтыңыз тексеруді қажет етеді",
    "Күмәнді әрекет анықталды",
    "Шотыңыз уақытша тоқтатылды",
    "Қауіпсіздік тексерісі қажет",
]

safe_titles = [
    "Қауіпсіздік туралы ақпарат",
    "Жүйелік хабарлама",
    "Қызмет туралы хабарлама",
    "Жаңарту туралы ақпарат",
    "Аккаунт бойынша ескерту",
]

phishing_messages = [
    "Қауіпсіздік жүйесі сіздің аккаунтыңызда күмәнді әрекет анықтады.",
    "Сіздің шотыңызға белгісіз құрылғыдан кіру әрекеті байқалды.",
    "Жүйе деректеріңізді қорғау үшін аккаунтыңызды уақытша шектеді.",
    "Төлем әрекеті күмәнді болып көрінді.",
    "Аккаунтыңызды растау қажет.",
]

safe_messages = [
    "Сіздің аккаунтыңыз бойынша жоспарлы жүйелік хабарлама жіберілді.",
    "Қызмет көрсету шарттары бойынша ақпарат жаңартылды.",
    "Қауіпсіздік баптауларын ресми сайттан тексере аласыз.",
    "Жеке кабинетте жаңа ақпарат қолжетімді.",
    "Бұл тек ақпараттық хабарлама, жеке деректер сұралмайды.",
]

urgencies = [
    "24 сағат ішінде растаңыз.",
    "Дереу әрекет жасаңыз.",
    "Қазір тексермесеңіз аккаунт жабылады.",
    "Шұғыл түрде растау қажет.",
]

safe_endings = [
    "Толық ақпаратты ресми сайттан көре аласыз.",
    "Жеке деректерді енгізу талап етілмейді.",
    "Бұл хабарлама тек ақпарат беру мақсатында жіберілді.",
    "Қосымша ақпарат қажет болса, ресми сайтқа кіріңіз.",
]

def get_kz_time():
    return datetime.utcnow() + timedelta(hours=5)

def make_fake_link(service):
    base = service["name"].lower().split()[0]
    fake = random.choice(fake_domains)
    return f"https://{base}-{fake}/verify"

def make_safe_link(service):
    return f"https://{service['real_domain']}"

def generate_phishing_task(service, now):
    title = random.choice(phishing_titles)
    message = random.choice(phishing_messages)
    urgency = random.choice(urgencies)
    link = make_fake_link(service)

    body = f"""Құрметті клиент!

{message}

Деректеріңізді растау үшін төмендегі сілтемеге өтіңіз.

{urgency}"""

    options = [
        {"key": "click_link", "text": "Сілтемеге өтемін"},
        {"key": "check_url", "text": "URL мекенжайын тексеремін"},
        {"key": "ignore", "text": "Хатты елемеймін"},
        {"key": "ask_adult", "text": "Досымнан немесе ата-анамнан сұраймын"},
    ]

    correct = "check_url"

    return {
        "situationTitle": "Бүгінгі жағдай",
        "date": now.strftime("%d.%m.%Y"),
        "level": random.choice(levels),
        "type": "phishing",

        "logo": service["logo"],
        "senderName": service["name"],
        "senderEmail": "support@" + link.replace("https://", "").split("/")[0],
        "time": now.strftime("%H:%M"),

        "title": title,
        "body": body,
        "link": link,
        "footer": service["name"] + " қауіпсіздік қызметі",

        "options": options,
        "correct": correct,

        "explanation": [
            "Бұл хат күмәнді, себебі сілтеме ресми доменге ұқсамайды.",
            "Хатта қолданушыны асықтыру бар.",
            "Жеке деректерді растауды сұрайды.",
            "Жіберуші email мекенжайы ресми емес.",
        ],
        "advice": [
            "Сілтемені бірден баспаңыз.",
            "Алдымен URL мекенжайын тексеріңіз.",
            "Ресми сайтқа браузер арқылы өзіңіз кіріңіз.",
            "Күмән болса, ересек адамнан немесе маманнан сұраңыз.",
        ],
    }

def generate_safe_task(service, now):
    title = random.choice(safe_titles)
    message = random.choice(safe_messages)
    ending = random.choice(safe_endings)
    link = make_safe_link(service)

    body = f"""Сәлеметсіз бе!

{message}

{ending}"""

    options = [
        {"key": "click_link", "text": "Сілтемеге өтемін"},
        {"key": "check_url", "text": "URL мекенжайын тексеремін"},
        {"key": "ignore", "text": "Хатты елемеймін"},
        {"key": "ask_adult", "text": "Досымнан немесе ата-анамнан сұраймын"},
    ]

    correct = "click_link"

    return {
        "situationTitle": "Бүгінгі жағдай",
        "date": now.strftime("%d.%m.%Y"),
        "level": random.choice(levels),
        "type": "safe",

        "logo": service["logo"],
        "senderName": service["name"],
        "senderEmail": "support@" + service["real_domain"],
        "time": now.strftime("%H:%M"),

        "title": title,
        "body": body,
        "link": link,
        "footer": service["name"] + " қызметі",

        "options": options,
        "correct": correct,

        "explanation": [
            "Бұл хат қауіпсіз болуы мүмкін, себебі сілтеме ресми доменге апарады.",
            "Жіберуші email мекенжайы ресми доменге сәйкес.",
            "Хатта құпиясөз немесе карта деректері сұралмайды.",
            "Шұғыл қысым көрсету жоқ.",
        ],
        "advice": [
            "Сілтемені ашпас бұрын доменді тексеріңіз.",
            "Ресми сайт екеніне көз жеткізіңіз.",
            "Жеке деректер сұралса, абай болыңыз.",
            "Күмән болса, ресми қосымша арқылы тексеріңіз.",
        ],
    }

def generate_one_task(index=0):
    now = get_kz_time() + timedelta(minutes=index * 7)
    service = random.choice(services)

    mail_type = random.choice(["phishing", "safe"])

    if mail_type == "phishing":
        return generate_phishing_task(service, now)
    else:
        return generate_safe_task(service, now)

def generate_daily_mail_tasks(count=5):
    tasks = []
    used_keys = set()

    while len(tasks) < count:
        task = generate_one_task(len(tasks))
        key = task["senderName"] + task["title"] + task["body"] + task["link"]

        if key in used_keys:
            continue

        used_keys.add(key)
        tasks.append(task)

    return tasks
