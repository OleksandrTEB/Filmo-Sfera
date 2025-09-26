# Projekt Filmo-Sfera z wykorzystaniem technologii Angular

***

## Żeby go urochomić trzeba zainstalować pare żeczy.

#### Na sam początek trzeba pobrać `node.js` 20.+ wersji.

Po zainstalowaniu musisz pobrać Angular globalnie, w terminalu `cmd` lub `powershell` trzeba za pomocą `npm`
wpisać `npm install -g @angular/cli`,

jeżeli wystąpia bląd to trzeba wpisać do powershell `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
`.

To żadanie pozwoli kożystać z pakietów `npm`

Następnym krokiem będzie zainstalować zalezności.

W katalogu `Front` znajduje się `package.json` musisz otwożyć dowolny terminal i urochomić `npm i` skrót od
`npm install`.

Ten prjekt musi znajdować się w katalogu XAMPA `htdocs` poniewaz wszystkie zadania maja sciezke
`http://localhost/Filmo-Sfera/Back/public/api.php/`

Na sam koniec żeby urochomić musisz wpisać w tym samym terminalu co `npm i`: `ng serve` wtedy frontend będzie dostępny
na `http://localhost:4200`

### Dla frontendowej częsci to tyle.

***

### Dla php też są zależniści, w `composer.json`

Z tej strony pobież composer [Przejdź](https://getcomposer.org/download/).

Potszebny on jest dla tego zeby ręcznie nie pobierać zalezniisci.

Żeby ich pobrać trzeba w katalogu `Back` wpisać w terminalu `composer update`.