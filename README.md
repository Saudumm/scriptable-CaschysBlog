# scriptable-CaschysBlog
iOS Scriptable Widget für News von Caschys Blog

## Voraussetzung:

Scriptable für iOS: [Link](https://apps.apple.com/de/app/scriptable/id1405459188)

## Konfiguration:

1. Skript zu Scriptable hinzufügen
2. Widget auf Homescreen erstellen und Script auswählen
3. Wer möchte, kann die Hintergrundfarbe (oder sogar einen Farbverlauf) direkt im Code anpassen. Der entprechende Teil wurde im Code kommentiert/beschrieben.

Das Widget kann für die verschiedenen Größen angepasst werden. Dazu lange auf das Widget drücken und "Widget bearbeiten" auswählen.

![](https://github.com/Saudumm/scriptable-CaschysBlog/blob/main/widget-config.jpeg)

### Widget Parameter

- Beispiel: small|https://www.stadt-bremerhaven.de|Caschys Blog|background.jpg
- Parameter Reihenfolge: widget size, site url, site name, background image
- Parameter müssen durch | getrennt sein
- Man kann auch Parameter weglassen, zum Beispiel das Hintergrundbild: small|https://www.stadt-bremerhaven.de|Caschys Blog
- Man kann auch nur "small", "medium" oder "large" als Parameter setzen
- Nicht gesetzte Parameter werden im Code durch die Standard Config genutzt

## Beispiele:
![](https://github.com/Saudumm/scriptable-CaschysBlog/blob/main/widget-examples.jpeg)

Links oben: Mittleres Widget mit Standardkonfiguration "small"

Links unten: Kleines Widget mit Standardkonfiguration "small"

Rechts oben: Mittleres Widget mit Konfiguration "medium"

Rechts unten: Großes Widget mit Konfiguration "large"
