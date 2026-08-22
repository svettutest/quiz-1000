"""Прогон квиза в WebKit на 390px со скриншотом каждого экрана."""

import os
from playwright.sync_api import sync_playwright

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "screenshots")
URL = "http://localhost:3005/quiz-1000/"
os.makedirs(OUT, exist_ok=True)


def shot(page, name, full=False):
    page.wait_for_timeout(2300)
    page.screenshot(path=os.path.join(OUT, name + ".png"), full_page=full)
    print("shot", name)


def click_text(page, text):
    page.get_by_text(text, exact=True).first.click()
    page.wait_for_timeout(700)


with sync_playwright() as p:
    browser = p.webkit.launch()
    page = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_timeout(3500)
    # оверлей дев-режима сидит в левом нижнем углу и перехватывает клики по кнопке
    page.add_style_tag(content="nextjs-portal{display:none!important;pointer-events:none!important}")

    shot(page, "01-intro")
    click_text(page, "Показать мой путь")

    shot(page, "02-ai")
    click_text(page, "Иногда пользуюсь ChatGPT")

    shot(page, "03-money")
    click_text(page, "Нет, но хочу")

    shot(page, "04-skills")
    click_text(page, "Дизайн")
    click_text(page, "Сайты")
    shot(page, "04b-skills-selected")
    click_text(page, "Дальше")

    shot(page, "05-barrier", full=True)
    click_text(page, "Дальше")

    shot(page, "06-commit1")
    click_text(page, "Да")

    shot(page, "07-direction", full=True)
    click_text(page, "AI-лендинги")

    shot(page, "08-time")
    click_text(page, "2-3 часа в день")

    shot(page, "08b-goal")
    click_text(page, "$3,000")

    shot(page, "09-aha-price", full=True)
    click_text(page, "Показать математику")

    shot(page, "10-aha-math", full=True)
    click_text(page, "Дальше")

    shot(page, "11-commit2")
    click_text(page, "Да, хочу попробовать")

    page.wait_for_timeout(700)
    shot(page, "12-building")
    page.wait_for_timeout(3500)

    shot(page, "13-result", full=True)

    # свайп витрины на вторую карточку
    rail = page.locator(".rail")
    box = rail.bounding_box()
    page.mouse.move(box["x"] + box["width"] * 0.8, box["y"] + 120)
    page.mouse.down()
    page.mouse.move(box["x"] + box["width"] * 0.15, box["y"] + 120, steps=18)
    page.mouse.up()
    page.wait_for_timeout(1100)
    shot(page, "13b-result-card2")

    page.get_by_text("Что отделяет меня от", exact=False).first.click()
    page.wait_for_timeout(900)
    shot(page, "14-path", full=True)
    click_text(page, "Дальше")

    shot(page, "15-program", full=True)
    click_text(page, "Дальше")

    shot(page, "16-platform", full=True)
    click_text(page, "Посмотреть направления")

    shot(page, "17-tracks", full=True)

    browser.close()
    print("done")
