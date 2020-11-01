# scriptable-CaschysBlog
iOS Scriptable Widget für News von Caschys Blog (stadt-bremerhaven.de)

## Voraussetzung:

Scriptable für iOS: [Link](https://apps.apple.com/de/app/scriptable/id1405459188)

# Changelog

- v1.0 - Erster Upload
- v1.1 - Fix für Anzeige von Datum und Uhrzeit je nach Systemsprache
- v1.2 - Widget kann jetzt mit Parametern angepasst werden, sogar mit Hintergrundbildern! (Siehe Code Kommentare für weitere Infos)
- v1.3 - Bugfix für URLs mit Sonderzeichen
- v1.4 - Eigene Hintergrundbilder für alle Widget Größen
- v1.5 - Code gewaltig aufgeräut, neue Beschreibungen für die Anpassung des Widgets
- v1.5.1 - Fix für die Anzeige des Datums
- v1.5.2 - Twitter Link hinzugefügt

---

_Falls mir jemand einen Kaffee ausgeben möchte 😊: https://ko-fi.com/saudumm_

---

## Konfiguration:

1. Skript zu Scriptable hinzufügen
2. Widget auf Homescreen erstellen und Script auswählen
3. Wer möchte, kann die Hintergrundfarbe (oder sogar einen Farbverlauf) direkt im Code anpassen. Der entprechende Teil wurde im Code kommentiert/beschrieben. Hintergrundbilder sind auch möglich.

Man kann auch das Layout und den Hintergrund des Widgets anpassen. Einfach lange auf das Widget drücken und "Widget bearbeiten" auswählen.

![widget-config](https://github.com/Saudumm/scriptable-CaschysBlog/blob/main/widgetConfig.jpeg)

### Widget parameters
 - Beispiel: small|https://www.stadt-bremerhaven.de|Caschys Blog|image-name.jpg
- Parameter Reihenfolge: widget size, site url, site name, background image
- Parameter müssen durch | getrennt sein
- Man kann auch Parameter weglassen, zum Beispiel das Hintergrundbild: small|https://www.stadt-bremerhaven.de|Caschys Blog
- Man kann auch nur "small", "medium" oder "large" als Parameter setzen
- Nicht gesetzte Parameter werden im Code durch die Standard Config genutzt

## Beispiele:

![widget-examples](https://github.com/Saudumm/scriptable-CaschysBlog/blob/main/widgetExamples.jpeg)

- Oben Links: Kleines Widget mit Standard Parameter
- Oben Mitte:  Kleines Widget mit Standard Parameter und Hintergrundbild
- Oben Rechts: Mittleres Widget mit Parameter "medium"
- Mitte Links: Mittleres Widget mit Standard Parameter "small"
- Unten Links: Mittleres Widget mit Parameter "medium" und Hintergrundbild
- Unten Rechts: Großes Widget mit Parameter "large" und Hintergrundbild
