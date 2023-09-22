<div align="center">
    <img src="./ekstra/img/musicbase-header.png" style="width: 100%;"> 
</div>

# SQL og databaser

I dette projekt har vi lavet et program bestående af to programmer, et backend og [frontend program](). I backend programmet tilgåes der en MySQL database, hvor det gøres muligt at kunne manipulere 3 overordnet tabeller. Tabellerne er det overordnet databefinder sig er en albums, artists og tracks tabel. Det er muligt i de tre tabeller at kunne foretage de 4 CRUD funktioner `Create, Read, Update, Delete`.

Det er så muligt i vores [frontend program]() få dataen fra databasen gennem backend og vise det. I frontend kan du så søge på både albums, artists & tracks. Hvis du vil vide mere omkring de forskellige tabeller, kan du hover musen og et element og få hvis, hvad det indeholder.

## Installation af backend

For at clone projektet så du selv kan arbejde med det, så er det vigtig at du har [git](https://git-scm.com/downloads), inden du starter. Når du har det kan du følge guiden nedenfor:

1. Åben din terminal, enten `powershell` eller dit fortrukende valg.

2. Naviger til den mappe, hvor du gerne vil gemme projektet ved hjælp af `cd`-kommandoen. For eksempel:

```bash
cd din/målmappe
```

3. Når du er i den mappe som projektet skal placeres, så skal du bruge følgende kommando til at clone projektet fra GitHub:

```bash
git clone https://github.com/JonLundby/music-base-backend-jmmp.git
```

4. Du har nu clonet projektet. Hvis du ønsker at køre det clonet program kan du gøre følgende

```bash
cd /music-base-backend-jmmp
```

5. `Optional` hvis du anvender VS code som dit kode program, så kan du bruge komandoen `code .` i terminalen. Den vil så åbne den mappe hvor du befinder dig i VS code. **Får at kunne gøre dette er det dog vigtigt at din 'Path:' er sat rigtigt**. I skulle dog gerne være blevet gjort da du installeret VS code.

## Installation af nødvendige packages

EFter

```bash
npm i cors express mysql2 dotenv
```

## Benyttelse af backend

Efter du nu har fået downloaded de nødvendige packages, så er du klar til at kunne køre node backend app'en lokalt.

#### Opsætning af dotenv

Udover bare at installer et par node packages, så skal du også lave `dotenv` fil. Til at gøre dette kan du skrive følgende i din terminal:

```bash
touch .env
```

Den nye fil du har lavet skal du bruge til at kunne connecte til den brugte database til projektet. For at kunne gøre dette skal du sætte følgende værdier ind:

```javaScript
MYSQL_HOST=Database url
MYSQL_DATABASE=Den valgte database fil
MYSQL_PASSWORD=kodeord til databasen
MYSQL_USER=navn på bruger
MYSQL_PORT=3306
SERVER_PORT=3333
```

Du skulle gerne nu kunne forbinde til databasen.

### Kør program

For at gøre dette skal du igen åbne terminalen i vs code. Du kan nu bruge to scripts til at køre det lokalt. Hvis du ønsker at stoppe programmet for at køre, så kan du benytte `ctrl+c` til at stoppe programmet.

#### npm start

-   Det første script du kan bruge er `start`. Ved at bruge denne så køre du app.js en enkelt gang. Hvilket betyder at hvis du foretager ændring eller programmet støder på et problem, så vil du blive nød til at køre scriptet igen for at programmet starter igen. Kommandoen til scriptet ser således ud:

```bash
npm start
```

#### npm run watch

-   Det andet script du kan benytte er `watch`. Ved at bruge dette så vil app'en blive ved med at blive kørt, selv efter at der enten sker en ændring eller programmet er stødt på et problem. Du vil dog stadig blive nød til at køre scriptet igen, hvis programmet helt crasher. Kommandoen ser således ud:

```bash
npm run watch
```

## Slutning

**Tillykke du har nu clonet og kan køre backend programmet! 🎉**
