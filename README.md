# Node ninja

## Hvad laver programmet?

En Express server, der læser og skriver en tekstfil asynkront, logger alle HTTP requests med en EventEmitter og returnerer forståelige fejl.

## Planlægning før vi koder

Udkast som gruppen retter til. Skal vises til en anden studiegruppe, før vi koder.

| Spørgsmål | Gruppens beslutning |
|---|---|
| Hvilke filer skal projektet have? | `src/server.js`, `src/app.js`, `src/controllers/fileController.js`, `src/services/fileService.js`, `src/repositories/fileRepository.js`, `src/events/requestEmitter.js`, `src/events/requestLogger.js`, `src/middleware/` (requestEvents, notFound, errorHandler), `data/data.txt`, `scripts/simulate_clients.js`, `tests/`, `README.md` |
| Hvor håndteres routes? | `app.js` kobler URL og metode til controlleren (`app.get` og `app.post`). `notFound.js` giver 404 til alt andet. |
| Hvor anvendes async/await? | `fileRepository.js` (`fs.promises`), `fileService.js`, `fileController.js` og i `simulate_clients.js` |
| Hvor håndteres fejl? | try/catch i `fileController.js` (500 ved filfejl, 400 ved ugyldigt input). `errorHandler.js` fanger resten, fx ugyldig JSON. |
| Hvilket event skal udsendes? | `request` med `{ method, path }`, udsendt af `requestEvents.js` før alle routes, så også 404 logges. Listeneren ligger i `requestLogger.js` og kobles på emitteren i `server.js` |
| Hvad skal loggen indeholde? | Metode og path, fx `GET /read-file`. Timestamp er en udvidelse. |
| Hvordan vil I teste fejlforløbet? | Manuelt med curl eller Postman: omdøbe `data/data.txt` og kalde `/read-file` (forventer 500), POST uden `content` (400), `content` som tal (400), ugyldig JSON (400) og ukendt route (404). Automatisk med `node --test` og et fake repository. 10 requests med `scripts/simulate_clients.js`. Vi tester også de øvrige forløb fra opgaven: en gyldig POST opdaterer filen, og hver request udløser et log event. |

Vist til gruppe: Niklas og Jannicks gruppe

Dato: Vist 2. oktober 2026, svar modtaget 5. oktober 2026 kl. 09:47

Deres feedback: De syntes, planen så fornuftig ud, og anbefalede at tage AI i små trin. De foreslog at bruge eventet i selve loggeren, så man kan logge til både konsol og fil samtidig. De bad os uddybe, hvordan vi tester, og huske de øvrige forløb i opgaven. De ville droppe repository, og evt. middleware og routes, fordi det ikke er lært endnu, og fordi der kun er to endpoints.

Hvad vi ændrede efter feedback: Vi uddybede testplanen med, hvordan vi tester, og tilføjede flere fejlforløb. Vi tilføjer log til fil som udvidelse. Vi droppede routes mappen og kobler de to routes direkte i app.js, fordi der kun er to endpoints, og Router ikke er lært endnu. Vi beholdt de øvrige lag og repository, fordi vores issues er delt efter filer, og for at holde fs adskilt fra resten. Vi forklarer middleware for hinanden, før vi koder.

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