return {
    "situationTitle": "Бүгінгі жағдай",
    "date": now.strftime("%d.%m.%Y"),
    "level": random.choice(["Жеңіл деңгей", "Орташа деңгей", "Қиын деңгей"]),

    "senderName": service["name"],
    "senderEmail": f"support@{link.replace('https://', '').split('/')[0]}",
    "time": now.strftime("%H:%M"),

    "title": title,
    "body": full_text,
    "link": link,
    "footer": service["name"] + " қауіпсіздік қызметі",

    "correct": "check_url",

    "explanation": [
        "Жіберуші email мекенжайы күмәнді.",
        "Сілтеме ресми сайтқа ұқсамайды.",
        "Хатта шұғыл әрекет жасауға қысым бар.",
        "Жеке деректерді растауды сұрайды."
    ],

    "advice": [
        "Сілтемені бірден баспаңыз.",
        "URL мекенжайын мұқият тексеріңіз.",
        "Ресми сайтқа браузер арқылы өзіңіз кіріңіз.",
        "Күмән болса, ересек адамнан немесе маманнан сұраңыз."
    ]
}