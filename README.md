# Node ninja

## Hvad laver programmet?

En Express server, der læser og skriver en tekstfil asynkront, logger alle HTTP requests med en EventEmitter og returnerer forståelige fejl.

## Planlægning før vi koder

Udkast som gruppen retter til. Skal vises til en anden studiegruppe, før vi koder.

| Spørgsmål | Gruppens beslutning |
|---|---|
| Hvilke filer skal projektet have? | `src/server.js`, `src/app.js`, `src/routes/fileRoutes.js`, `src/controllers/fileController.js`, `src/services/fileService.js`, `src/repositories/fileRepository.js`, `src/events/requestEmitter.js`, `src/events/requestLogger.js`, `src/middleware/` (requestEvents, notFound, errorHandler), `data/data.txt`, `scripts/simulate_clients.js`, `tests/`, `README.md` |
| Hvor håndteres routes? | `fileRoutes.js` kobler URL og metode til controlleren. `notFound.js` giver 404 til alt andet. |
| Hvor anvendes async/await? | `fileRepository.js` (`fs.promises`), `fileService.js`, `fileController.js` og i `simulate_clients.js` |
| Hvor håndteres fejl? | try/catch i `fileController.js` (500 ved filfejl, 400 ved ugyldigt input). `errorHandler.js` fanger resten, fx ugyldig JSON. |
| Hvilket event skal udsendes? | `request` med `{ method, path }`, udsendt af `requestEvents.js` før alle routes, så også 404 logges. Listeneren ligger i `requestLogger.js` og kobles på emitteren i `server.js` |
| Hvad skal loggen indeholde? | Metode og path, fx `GET /read-file`. Timestamp er en udvidelse. |
| Hvordan vil I teste fejlforløbet? | Omdøbe `data/data.txt` og kalde `/read-file` (forventer 500). POST uden `content` (forventer 400). Ukendt route (forventer 404). |

Vist til gruppe:

Dato:

Deres feedback:

Hvad vi ændrede efter feedback:

## Endpoints

| Metode | Endpoint | Funktion |
|---|---|---|
| GET | `/read-file` | Læser fil |
| POST | `/write-file` | Skriver til fil |

## Asynkronitet

Hvad sker der i Node.js, mens serveren venter på en filoperation? (Skrives med egne ord.)

## EventEmitter

Hvilket event bruger vi, og hvornår bliver det udsendt? (Skrives med egne ord.)

## Test

1. Hvordan vi testede succes:
2. Hvordan vi fremkaldte en fejl:
3. Hvordan vi testede flere requests:

## AI-brug

Ét konkret eksempel:

1. Hvad bad vi agenten om?
2. Hvad foreslog eller ændrede agenten?
3. Hvad kontrollerede vi?
4. Accepterede, ændrede eller afviste vi forslaget?

## Afslutning

Den vigtigste forskel mellem den måde, vi håndterede samtidighed på i vores Java-server, og den måde Node.js-serveren arbejder på, er