# Projekt Filmo-Sfera z wykorzystaniem technologii Angular

***

## Żeby go urochomić trzeba zainstalować pare żeczy.

#### Na sam początek trzeba pobrać `node.js` 20.+ wersji.

Po zainstalowaniu musisz pobrać Angular globalnie, w terminalu `cmd` lub `powershell` trzeba za pomocą `npm`
wpisać `npm install -g @angular/cli`

Następnym krokiem będzie zainstalować zalezności.

W kożeni katalogu gdżie znajduje się `package.json` musisz otwożyć dowolny terminal i urochomić `npm i` to samo co i `npm install`.

Ten prjekt musi znajdować się w katalogu XAMPA `htdocs` poniewaz wszystkie zadania maja sciezke `http://localhost/angular-filmo-sfera-dev/src/backend/public/api.php/`

Na sam koniec żeby urochomić musisz wpisać w tym samym terminalu co `npm i`: `ng serve` wtedy frontend będzie dostępny na `http://localhost:4200`

### Dla frontendowej częsci to tyle.

***

### Dla php też są zależniści, w `composer.json`

Potszebny on jest dla tego zeby ręcznie nie pobierać zalezniisci.

Żeby ich pobrać trzeba w katalogu `backend` wpisać w terminalu `composer install`.

Zamieszczone tam sa `autoloader`, i `dotenv`

Zeby bylo to bardziej czytelnie mam to w kilku plikach np. middelwairy i controlery odzielnie.

Autoloadder automatycznie doje mozliwosć korzystznai z nazw przestreni.

Dotenv to plik bez nazwy `.env` jak np. `.gitignore`.

Za pomoca composera z tego pliku mozna stwozyć stale globalne np. DB_NAME=filmosfera.

