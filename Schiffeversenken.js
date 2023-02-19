let schwierigkeitsgrad;
let schiffzähler = 0;
let schiffzählerGegner = 0;
let neueSchiffsposition;
let schussposition;
let schussfeldCompi;
let siegpunktePlayer = 0;
let siegpunkteComputer = 0;
let felder = [];
let umgebung = [];
let gegnerFelder = [];
let freieFelder = [];
let gegnerSchiffe = [];
let nochNichtBeschosseneFelder = [];
let counter = 0;
// Aufbau Koordinatensystem eigenes Feld, divs, event-listener, Felder
koordinatenSystem();
function koordinatenSystem() {
  for (let i=0; i<49; i++) {
    let planquadrat = document.createElement ("div");
    document.getElementById("koordinatensystem").appendChild(planquadrat);
    planquadrat.setAttribute("class", "planquadrat");
    planquadrat.setAttribute("id", i);

    felder[i] = {
    spalte: 0,
    zeile: 0,
    umgebungsinfo: 8,
    gesetztesSchiff: false,
    geblocktesFeld: false,
    schonBeschossen: false
    }
  }
  xyKoordinatenPlayer();
}

//x- und y- Koordinaten für eigenes Feld
function xyKoordinatenPlayer() {
  for (let ze = 0; ze < 7; ze++) {
    for (let sp = 0; sp < 7; sp++) {
      zeilensprung = ze * 7;
      felder[zeilensprung + sp].zeile = ze;
      felder[zeilensprung + sp].spalte = sp;
    }
    zeilensprung + 7;
  }
  umgebungsfelderInfo();
}

//Info über Umgebungsfelder für eigenes Feld
function umgebungsfelderInfo() {
  for (i=0; i<49; i++){
    if (felder[i].zeile == 0 || felder[i].zeile == 6) {
      felder[i].umgebungsinfo = felder[i].umgebungsinfo - 3
    }
    if (felder[i].spalte == 0 || felder[i].spalte == 6) {
      felder[i].umgebungsinfo = felder[i].umgebungsinfo - 3
    }
    if (i==0 || i==6 || i==42 || i==48) {
      felder[i].umgebungsinfo = felder[i].umgebungsinfo + 1
    }
  //console.log("feld: " + i + "Umgebung: " + felder[i].umgebungsinfo);
  }
  koordinatenSystemGegner();
}


// Aufbau Koordinatensystem Gegner
function koordinatenSystemGegner() {
  for (let i=0; i<49; i++) {
    let planquadrat = document.createElement ("div");
    document.getElementById("koordinatensystemGegner").appendChild(planquadrat);
    planquadrat.setAttribute("class", "planquadrat");
    planquadrat.setAttribute("id", "Gegner" + i);

    gegnerFelder[i] = {
    feldnummer: i,
    spalte: 0,
    zeile: 0,
    gesetztesSchiff: false,
    geblocktesFeld: false,
    schonBeschossen: false
    }
  }
  xyKoordinatenComputer();
}

//x- und y- Koordinaten für gegnerisches Feld

function xyKoordinatenComputer() {;
  for (let ze = 0; ze < 7; ze++) {
    for (let sp = 0; sp < 7; sp++) {
      zeilensprung = ze * 7;
      gegnerFelder[zeilensprung + sp].zeile = ze;
      gegnerFelder[zeilensprung + sp].spalte = sp;
    }
    zeilensprung + 7;
  }
  schwierigkeit();
}
// Buttons für Schwierigkeitsgrad
function schwierigkeit() {
  let element = document.createElement ("div");
  document.getElementById("navbar").appendChild(element);
  element.setAttribute("id", "buttonBar");
  let leicht = document.createElement ("button");
  document.getElementById("buttonBar").appendChild(leicht);
  leicht.setAttribute("id", "leicht");
  leicht.setAttribute("onclick", "modusLeicht()");
  leicht.setAttribute("class", "button");
  leicht.innerText="leicht";
  let mittel = document.createElement ("button");
  document.getElementById("buttonBar").appendChild(mittel);
  mittel.setAttribute("id", "mittel");
  mittel.setAttribute("onclick", "modusMittel()");
  mittel.setAttribute("class", "button");
  mittel.innerText="mittel";
  let schwer = document.createElement ("button");
  document.getElementById("buttonBar").appendChild(schwer);
  schwer.setAttribute("id", "schwer");
  schwer.setAttribute("onclick", "modusSchwer()");
  schwer.setAttribute("class", "button");
  schwer.innerText="schwer";
  let episch = document.createElement ("button");
  document.getElementById("buttonBar").appendChild(episch);
  episch.setAttribute("id", "episch");
  episch.setAttribute("onclick", "modusEpisch()");
  episch.setAttribute("class", "button");
  episch.innerText="episch";
}

// Schwierigkeitsgrad festlegen
function modusLeicht() {
  schwierigkeitsgrad = 1;
  document.getElementById("mitteilung").innerText=("General, setzen Sie Ihre 9 Schiffe!");
  listener();
}
function modusMittel() {
  schwierigkeitsgrad = 2;
  document.getElementById("mitteilung").innerText=("General, setzen Sie Ihre 9 Schiffe!");
  listener();
}
function modusSchwer() {
  schwierigkeitsgrad = 3;
  document.getElementById("mitteilung").innerText=("General, setzen Sie Ihre 9 Schiffe!");
  listener();
}
function modusEpisch() {
  schwierigkeitsgrad = 4;
  document.getElementById("mitteilung").innerText=("General, setzen Sie Ihre 9 Schiffe!");
  listener();
}

function listener() {
  document.getElementById("buttonBar").remove();
  document.getElementById("player").style.color="white";
  document.getElementById("computer").style.color="white";
  document.getElementById("positionieren").style.color="white";
  document.getElementById("mitteilung").style.color="white";
  for (let i=0; i<49; i++) {
    let planquadrat = document.getElementById(i);
    planquadrat.addEventListener("mouseover", positionPrüfen);
    planquadrat.addEventListener("mouseout", positionPrüfenEnde);
    planquadrat.addEventListener("click", schiffSetzen);
  }
}

// Schiffe positionieren, eigenes Feld
function positionPrüfen() {
  neueSchiffsposition = this.getAttribute ("id")*1;
  if(felder[neueSchiffsposition].geblocktesFeld == true) {
    this.style.backgroundColor = "red";
  } else {
    this.style.backgroundColor = "lightgreen";
  }
}
function positionPrüfenEnde() {
  this.style.backgroundColor = "rgb(59, 24, 93)";
}
function schiffSetzen(){
  this.style.backgroundColor = "rgb(59, 24, 93)";
  neueSchiffsposition = this.getAttribute ("id")*1;
  if(felder[neueSchiffsposition].geblocktesFeld == false) {
    let neuesSchiff = document.createElement("img");
    neuesSchiff.setAttribute("id", "schiff" + neueSchiffsposition);
    neuesSchiff.setAttribute("src", "Schiffsrumpf.png");
    neuesSchiff.setAttribute("class", "image");
    this.appendChild(neuesSchiff);
    felder[neueSchiffsposition].gesetztesSchiff = true;
    schiffzähler = schiffzähler + 1;
    if (schiffzähler > 8) {endeSchiffeSetzen();} 
    umgebungBlocken();
  }
}

// Umgebungsfelder blocken, eigenes Feld
function umgebungBlocken() {
  let xKoordinate = felder[neueSchiffsposition].spalte;
  let yKoordinate = felder[neueSchiffsposition].zeile;

  // Umgebung blocken bei Ecken, eigenes Feld
  if (xKoordinate == 0 && yKoordinate == 0) {
    umgebung = [0, 1, 7, 8];
    for (i = 0; i < umgebung.length; i++) {
      felder[umgebung[i]].geblocktesFeld = true;
    }
  return;
  }
  if (xKoordinate == 6 && yKoordinate == 0) {
    umgebung = [5, 6, 12, 13];
    for (i = 0; i < umgebung.length; i++) {
      felder[umgebung[i]].geblocktesFeld = true;
    }
  return;
  }
  if (xKoordinate == 0 && yKoordinate == 6) {
    umgebung = [35, 36, 42, 43];
    for (i = 0; i < umgebung.length; i++) {
      felder[umgebung[i]].geblocktesFeld = true;
    }
  return;
  }
  if (xKoordinate == 6 && yKoordinate == 6) {
    umgebung = [40, 41, 47, 48];
    for (i = 0; i < umgebung.length; i++) {
      felder[umgebung[i]].geblocktesFeld = true;
    }
  return;
  }

  // Umgebung blocken bei Ränder, eigenes Feld
  if (xKoordinate != 0 && xKoordinate != 6 && yKoordinate == 0) {
    umgebung = [neueSchiffsposition - 1, neueSchiffsposition, neueSchiffsposition +1, neueSchiffsposition + 6, neueSchiffsposition + 7, neueSchiffsposition + 8];
    for (i = 0; i < umgebung.length; i++) {
      felder[umgebung[i]].geblocktesFeld = true;
    }
  return;
  }
  if (xKoordinate != 0 && xKoordinate != 6 && yKoordinate == 6) {
    umgebung = [neueSchiffsposition - 1, neueSchiffsposition, neueSchiffsposition +1, neueSchiffsposition - 6, neueSchiffsposition - 7, neueSchiffsposition - 8];
    for (i = 0; i < umgebung.length; i++) {
      felder[umgebung[i]].geblocktesFeld = true;
    }
  return;
  }
  if (xKoordinate == 0 && yKoordinate != 0 && yKoordinate != 6) {
    umgebung = [neueSchiffsposition - 7, neueSchiffsposition, neueSchiffsposition + 7, neueSchiffsposition - 6, neueSchiffsposition + 1, neueSchiffsposition + 8];
    for (i = 0; i < umgebung.length; i++) {
      felder[umgebung[i]].geblocktesFeld = true;
    }
  return;
  }
  if (xKoordinate == 6 && yKoordinate != 0 && yKoordinate != 6) {
    umgebung = [neueSchiffsposition - 7, neueSchiffsposition, neueSchiffsposition + 7, neueSchiffsposition - 8, neueSchiffsposition - 1, neueSchiffsposition + 6];
    for (i = 0; i < umgebung.length; i++) {
      felder[umgebung[i]].geblocktesFeld = true;
    }
  return;
  }

  // Umgebung blocken bei Spielfeldmitte, eigenes Feld
  else {
    umgebung = [neueSchiffsposition - 8, neueSchiffsposition - 7, neueSchiffsposition - 6, neueSchiffsposition - 1, neueSchiffsposition, neueSchiffsposition + 1, neueSchiffsposition + 6, neueSchiffsposition + 7, neueSchiffsposition + 8];
    for (i = 0; i < umgebung.length; i++) {
      felder[umgebung[i]].geblocktesFeld = true;
    }
  }
}

function endeSchiffeSetzen() {
  for (let i = 0; i < 49; i++) {
    document.getElementById(i).removeEventListener("mouseover", positionPrüfen);
    document.getElementById(i).removeEventListener("mouseout", positionPrüfenEnde);
    document.getElementById(i).removeEventListener("click", schiffSetzen);
  }
  document.getElementById("mitteilung").innerText = ("die Schlacht beginnt...");
  document.getElementById("positionieren").style.color="blueviolet";
  document.getElementById("schießen").style.color="white";
  schiffeSetzenComputer()
}

// Schiffe positionieren, Computer-Feld
function schiffeSetzenComputer() {
  schiffzählerGegner = schiffzählerGegner + 1;
  freieFelder = [];
  for (i = 0; i < 49; i++) {
    if (gegnerFelder[i].geblocktesFeld == false) {
      freieFelder.push(i);
    }
  }
  neueSchiffsposition = freieFelder[Math.floor(Math.random()*freieFelder.length)];
  gegnerSchiffe.push(neueSchiffsposition);
  gegnerFelder[neueSchiffsposition].gesetztesSchiff = true;
  umgebungBlockenGegner();
}

// Umgebungsfelder blocken, Computer-Feld
function umgebungBlockenGegner() {
  let xKoordinateGegner = gegnerFelder[neueSchiffsposition].spalte;
  let yKoordinateGegner = gegnerFelder[neueSchiffsposition].zeile;

  // Umgebung blocken bei Ecken, Computer-Feld
  if (xKoordinateGegner == 0 && yKoordinateGegner == 0) {
    umgebung = [0, 1, 7, 8];
    for (i = 0; i < umgebung.length; i++) {
      gegnerFelder[umgebung[i]].geblocktesFeld = true;
    }
    if (schiffzählerGegner > 8) {
      schießenPlayer();
    } else {
      schiffeSetzenComputer();
    }
  return;
  }
  if (xKoordinateGegner == 6 && yKoordinateGegner == 0) {
    umgebung = [5, 6, 12, 13];
    for (i = 0; i < umgebung.length; i++) {
      gegnerFelder[umgebung[i]].geblocktesFeld = true;
    }
    if (schiffzählerGegner > 8) {
      schießenPlayer();
    } else {
      schiffeSetzenComputer();
    }
  return;
  }
  if (xKoordinateGegner == 0 && yKoordinateGegner == 6) {
    umgebung = [35, 36, 42, 43];
    for (i = 0; i < umgebung.length; i++) {
      gegnerFelder[umgebung[i]].geblocktesFeld = true;
    }
    if (schiffzählerGegner > 8) {
      schießenPlayer();
    } else {
      schiffeSetzenComputer();
    }
  return;
  }
  if (xKoordinateGegner == 6 && yKoordinateGegner == 6) {
    umgebung = [40, 41, 47, 48];
    for (i = 0; i < umgebung.length; i++) {
      gegnerFelder[umgebung[i]].geblocktesFeld = true;
    }
    if (schiffzählerGegner > 8) {
      schießenPlayer();
    } else {
      schiffeSetzenComputer();
    }
  return;
  }

  // Umgebung blocken bei Ränder, Computer-Feld
  if (xKoordinateGegner != 0 && xKoordinateGegner != 6 && yKoordinateGegner == 0) {
    umgebung = [neueSchiffsposition - 1, neueSchiffsposition, neueSchiffsposition +1, neueSchiffsposition + 6, neueSchiffsposition + 7, neueSchiffsposition + 8];
    for (i = 0; i < umgebung.length; i++) {
      gegnerFelder[umgebung[i]].geblocktesFeld = true;
    }
    if (schiffzählerGegner > 8) {
      schießenPlayer();
    } else {
      schiffeSetzenComputer();
    }
  return;
  }
  if (xKoordinateGegner != 0 && xKoordinateGegner != 6 && yKoordinateGegner == 6) {
    umgebung = [neueSchiffsposition - 1, neueSchiffsposition, neueSchiffsposition +1, neueSchiffsposition - 6, neueSchiffsposition - 7, neueSchiffsposition - 8];
    for (i = 0; i < umgebung.length; i++) {
      gegnerFelder[umgebung[i]].geblocktesFeld = true;
    }
    if (schiffzählerGegner > 8) {
      schießenPlayer();
    } else {
      schiffeSetzenComputer();
    }
  return;
  }
  if (xKoordinateGegner == 0 && yKoordinateGegner != 0 && yKoordinateGegner != 6) {
    umgebung = [neueSchiffsposition - 7, neueSchiffsposition, neueSchiffsposition + 7, neueSchiffsposition - 6, neueSchiffsposition + 1, neueSchiffsposition + 8];
    for (i = 0; i < umgebung.length; i++) {
      gegnerFelder[umgebung[i]].geblocktesFeld = true;
    }
    if (schiffzählerGegner > 8) {
      schießenPlayer();
    } else {
      schiffeSetzenComputer();
    }
  return;
  }
  if (xKoordinateGegner == 6 && yKoordinateGegner != 0 && yKoordinateGegner != 6) {
    umgebung = [neueSchiffsposition - 7, neueSchiffsposition, neueSchiffsposition + 7, neueSchiffsposition - 8, neueSchiffsposition - 1, neueSchiffsposition + 6];
    for (i = 0; i < umgebung.length; i++) {
      gegnerFelder[umgebung[i]].geblocktesFeld = true;
    }if (schiffzählerGegner > 8) {
      schießenPlayer();
    } else {
      schiffeSetzenComputer();
    }
  return;
  }

  // Umgebung blocken bei Spielfeldmitte, Computer-Feld
  else {
    umgebung = [neueSchiffsposition - 8, neueSchiffsposition - 7, neueSchiffsposition - 6, neueSchiffsposition - 1, neueSchiffsposition, neueSchiffsposition + 1, neueSchiffsposition + 6, neueSchiffsposition + 7, neueSchiffsposition + 8];
    for (i = 0; i < umgebung.length; i++) {
      gegnerFelder[umgebung[i]].geblocktesFeld = true;
    }
  }
    if (schiffzählerGegner > 8) {
      schießenPlayer();
    } else {
      schiffeSetzenComputer();
    }
    return;
}

// Beginn der Ballerei
function schießenPlayer() {
  for (let i=0; i<49; i++) {
    let planquadrat = document.getElementById("Gegner" + i);
    planquadrat.addEventListener("mouseover", schussfeldHover)
    planquadrat.addEventListener("mouseout", schussfeldHoverEnde)
    planquadrat.addEventListener("click", schussPrüfen)
  }
}

function schussfeldHover() {
  let schussfeld = this.getAttribute ("id");
  let reg = /\d+/;
  schussposition = parseInt(schussfeld.match(reg));
  if(gegnerFelder[schussposition].schonBeschossen == true) {
    this.style.backgroundColor = "red";
  } else {
    this.style.backgroundColor = "lightgreen";
  }
}
function schussfeldHoverEnde() {
  this.style.backgroundColor = "rgb(59, 24, 93)";
}
function schussPrüfen() {
  this.style.backgroundColor = "rgb(59, 24, 93)";
  let schussfeld = this.getAttribute ("id");
  let reg = /\d+/;
  schussposition = parseInt(schussfeld.match(reg));
  //console.log("schussposition" + schussposition);
  if(gegnerFelder[schussposition].schonBeschossen == true) {
    this.style.backgroundColor = "red";
    document.getElementById("mitteilung").innerText=("General, dieses Feld haben wir bereits beschossen!");
    setTimeout(schießenPlayer, 500);
  } else {
    schussSetzen();
  }
}
function schussSetzen() {
  if(gegnerFelder[schussposition].gesetztesSchiff == true) {
    gegnerFelder[schussposition].schonBeschossen = true;
    let treffer = document.createElement("img");
    treffer.setAttribute("src", "Schiffsrumpf.png");
    treffer.setAttribute("class", "imageTreffer");
    document.getElementById("Gegner" + schussposition).appendChild(treffer);
    document.getElementById("mitteilung").innerText=("Treffer!");
    siegpunktePlayer = siegpunktePlayer + 1;
    if (siegpunktePlayer > 8) {
      siegerPlayer();
    }
  } else {
    gegnerFelder[schussposition].schonBeschossen = true;
    let verfehlt = document.createElement("img");
    verfehlt.setAttribute("src", "daneben.webp");
    verfehlt.setAttribute("class", "image");
    document.getElementById("Gegner" + schussposition).appendChild(verfehlt);
    document.getElementById("mitteilung").innerText=("Leider daneben!");
  }
  for (let i=0; i<49; i++) {
    let planquadrat = document.getElementById("Gegner" + i);
    planquadrat.removeEventListener("mouseover", schussfeldHover);
    planquadrat.removeEventListener("mouseout", schussfeldHoverEnde);
    planquadrat.removeEventListener("click", schussPrüfen);
  }
  setTimeout(schießenComputer, 500);

}

// Computer schießt
function schießenComputer() {
  nochNichtBeschosseneFelder = [];
  for (let i = 0; i < 49; i++) {
    //console.log("Feld: " + i, felder[i].umgebungsinfo);

    if (felder[i].schonBeschossen == false) {
      nochNichtBeschosseneFelder.push(i);
    }
  }

if (schwierigkeitsgrad > 2) {
  schussfeldUmgebung();
} else {
  schussfeldCompi = nochNichtBeschosseneFelder[Math.floor(Math.random()*nochNichtBeschosseneFelder.length)];
}
  //console.log("nochNichtBeschosseneFelder: " + nochNichtBeschosseneFelder);
  //console.log("schussfeldCompi: " + schussfeldCompi);
  console.log("weiter gehts");
  if(felder[schussfeldCompi].gesetztesSchiff == true) {
    document.getElementById("schiff" + schussfeldCompi).setAttribute("class", "imageTreffer");
    document.getElementById("mitteilung").innerText=("General, eines unserer Schiffe wurde versenkt !");
    felder[schussfeldCompi].schonBeschossen = true;
    siegpunkteComputer = siegpunkteComputer + 1;
    if (siegpunkteComputer > 8) {
    siegerComputer()
    }
  } else {
    let verfehlt = document.createElement("img");
    verfehlt.setAttribute("src", "daneben.webp");
    verfehlt.setAttribute("class", "image");
    document.getElementById(schussfeldCompi).appendChild(verfehlt);
    felder[schussfeldCompi].schonBeschossen = true;
    document.getElementById("mitteilung").innerText=("General, wir wurden beschossen !");
    setTimeout(schießenPlayer, 500);
  }
  if (schwierigkeitsgrad>1 && felder[schussfeldCompi].gesetztesSchiff == true) {
    schussfelderBlocken();
  }
  setTimeout(schießenPlayer, 500);
}

// ineffiziente Schussfelder blocken, (Schwierigkeitsgrad "mittel")
function schussfelderBlocken() {
  let xKoordinate = felder[schussfeldCompi].spalte;
  let yKoordinate = felder[schussfeldCompi].zeile;

  // Umgebung blocken bei Ecken, eigenes Feld
  if (xKoordinate == 0 && yKoordinate == 0) {
    umgebung = [0, 1, 7, 8];
    for (i = 0; i < umgebung.length; i++) {
      felder[umgebung[i]].schonBeschossen = true;
    }
  return;
  }
  if (xKoordinate == 6 && yKoordinate == 0) {
    umgebung = [5, 6, 12, 13];
    for (i = 0; i < umgebung.length; i++) {
      felder[umgebung[i]].schonBeschossen = true;
    }
  return;
  }
  if (xKoordinate == 0 && yKoordinate == 6) {
    umgebung = [35, 36, 42, 43];
    for (i = 0; i < umgebung.length; i++) {
      felder[umgebung[i]].schonBeschossen = true;
    }
  return;
  }
  if (xKoordinate == 6 && yKoordinate == 6) {
    umgebung = [40, 41, 47, 48];
    for (i = 0; i < umgebung.length; i++) {
      felder[umgebung[i]].schonBeschossen = true;
    }
  return;
  }

  // Umgebung blocken bei Ränder, eigenes Feld
  if (xKoordinate != 0 && xKoordinate != 6 && yKoordinate == 0) {
    umgebung = [schussfeldCompi - 1, schussfeldCompi, schussfeldCompi +1, schussfeldCompi + 6, schussfeldCompi + 7, schussfeldCompi + 8];
    for (i = 0; i < umgebung.length; i++) {
      felder[umgebung[i]].schonBeschossen = true;
    }
  return;
  }
  if (xKoordinate != 0 && xKoordinate != 6 && yKoordinate == 6) {
    umgebung = [schussfeldCompi - 1, schussfeldCompi, schussfeldCompi +1, schussfeldCompi - 6, schussfeldCompi - 7, schussfeldCompi - 8];
    for (i = 0; i < umgebung.length; i++) {
      felder[umgebung[i]].schonBeschossen = true;
    }
  return;
  }
  if (xKoordinate == 0 && yKoordinate != 0 && yKoordinate != 6) {
    umgebung = [schussfeldCompi - 7, schussfeldCompi, schussfeldCompi + 7, schussfeldCompi - 6, schussfeldCompi + 1, schussfeldCompi + 8];
    for (i = 0; i < umgebung.length; i++) {
      felder[umgebung[i]].schonBeschossen = true;
    }
  return;
  }
  if (xKoordinate == 6 && yKoordinate != 0 && yKoordinate != 6) {
    umgebung = [schussfeldCompi - 7, schussfeldCompi, schussfeldCompi + 7, schussfeldCompi - 8, schussfeldCompi - 1, schussfeldCompi + 6];
    for (i = 0; i < umgebung.length; i++) {
      felder[umgebung[i]].schonBeschossen = true;
    }
  return;
  }

  // Umgebung blocken bei Spielfeldmitte, eigenes Feld
  else {
    umgebung = [schussfeldCompi - 8, schussfeldCompi - 7, schussfeldCompi - 6, schussfeldCompi - 1, schussfeldCompi, schussfeldCompi + 1, schussfeldCompi + 6, schussfeldCompi + 7, schussfeldCompi + 8];
    for (i = 0; i < umgebung.length; i++) {
      felder[umgebung[i]].schonBeschossen = true;
    }
  }
}

// effizientere Auswahl der Schussfelder, (Schwierigkeitsgrad "schwer")
function schussfeldUmgebung() {
  console.log("schwerischwer");
  console.log("nochNichtBeschosseneFelder" + nochNichtBeschosseneFelder); 
  for (let i = 0; i < nochNichtBeschosseneFelder.length; i++) {
    let xKoordinate = felder[nochNichtBeschosseneFelder[i]].spalte;
    let yKoordinate = felder[nochNichtBeschosseneFelder[i]].zeile;

    // Umgebungsinfo klären  bei Schuss in Ecken
    if (nochNichtBeschosseneFelder[i] == 0) {
      umgebung = [1, 7, 8];
      for (k = 0; k < umgebung.length; k++) {
        if (felder[umgebung[k]].schonBeschossen == true) {
          felder[0].umgebungsinfo = felder[0].umgebungsinfo - 1;
        }
      }

    }
    if (nochNichtBeschosseneFelder[i] == 6) {
      umgebung = [5, 12, 13];
      for (k = 0; k < umgebung.length; k++) {
        if (felder[umgebung[k]].schonBeschossen == true) {
          felder[6].umgebungsinfo = felder[6].umgebungsinfo - 1;
        }
      }

    }
    if (nochNichtBeschosseneFelder[i] == 42) {
      umgebung = [35, 36, 43];
      for (k = 0; k < umgebung.length; k++) {
        if (felder[umgebung[k]].schonBeschossen == true) {
          felder[42].umgebungsinfo = felder[42].umgebungsinfo - 1;
        }
      }
    }
    if (nochNichtBeschosseneFelder[i] == 48) {
      umgebung = [40, 41, 47];
      for (k = 0; k < umgebung.length; k++) {
        if (felder[umgebung[k]].schonBeschossen == true) {
          felder[48].umgebungsinfo = felder[48].umgebungsinfo - 1;
        }
      }
    }
  
    // Umgebungsinfo klären  bei Schuss an Ränder
    if (xKoordinate != 0 && xKoordinate != 6 && yKoordinate == 0) {
      umgebung = [nochNichtBeschosseneFelder[i]-1, nochNichtBeschosseneFelder[i]+1, nochNichtBeschosseneFelder[i]+6, nochNichtBeschosseneFelder[i]+7, nochNichtBeschosseneFelder[i]+8];
      for (k = 0; k < umgebung.length; k++) {
        if (felder[umgebung[k]].schonBeschossen == true) {
          felder[nochNichtBeschosseneFelder[i]].umgebungsinfo = felder[nochNichtBeschosseneFelder[i]].umgebungsinfo - 1;
        }
      }
    }
    if (xKoordinate != 0 && xKoordinate != 6 && yKoordinate == 6) {
      umgebung = [nochNichtBeschosseneFelder[i]-1, nochNichtBeschosseneFelder[i]+1, nochNichtBeschosseneFelder[i]-6, nochNichtBeschosseneFelder[i]-7, nochNichtBeschosseneFelder[i]-8];
      for (k = 0; k < umgebung.length; k++) {
        if (felder[umgebung[k]].schonBeschossen == true) {
          felder[nochNichtBeschosseneFelder[i]].umgebungsinfo = felder[nochNichtBeschosseneFelder[i]].umgebungsinfo - 1;
        }
      }
    }
    if (xKoordinate == 0 && yKoordinate != 0 && yKoordinate != 6) {
      umgebung = [nochNichtBeschosseneFelder[i]-7, nochNichtBeschosseneFelder[i]+7, nochNichtBeschosseneFelder[i]-6, nochNichtBeschosseneFelder[i]+1, nochNichtBeschosseneFelder[i]+8];
      for (k = 0; k < umgebung.length; k++) {
        if (felder[umgebung[k]].schonBeschossen == true) {
          felder[nochNichtBeschosseneFelder[i]].umgebungsinfo = felder[nochNichtBeschosseneFelder[i]].umgebungsinfo - 1;
        }
      }
    }
    if (xKoordinate == 6 && yKoordinate != 0 && yKoordinate != 6) {
      umgebung = [nochNichtBeschosseneFelder[i]-7, nochNichtBeschosseneFelder[i]+7, nochNichtBeschosseneFelder[i]-8, nochNichtBeschosseneFelder[i]-1, nochNichtBeschosseneFelder[i]+6];
      for (k = 0; k < umgebung.length; k++) {
        if (felder[umgebung[k]].schonBeschossen == true) {
          felder[nochNichtBeschosseneFelder[i]].umgebungsinfo = felder[nochNichtBeschosseneFelder[i]].umgebungsinfo - 1;
        }
      }
    }
  
    //     // Umgebungsinfo klären  bei Schuss an Spielfeldmitte
    
    if (xKoordinate != 0 && xKoordinate != 6 && yKoordinate != 0 && yKoordinate != 6) {
      umgebung = [nochNichtBeschosseneFelder[i]-8, nochNichtBeschosseneFelder[i]-7, nochNichtBeschosseneFelder[i]-6, nochNichtBeschosseneFelder[i]-1, nochNichtBeschosseneFelder[i]+1, nochNichtBeschosseneFelder[i]+6, nochNichtBeschosseneFelder[i]+7, nochNichtBeschosseneFelder[i]+8];
      for (k = 0; k < umgebung.length; k++) {
        if (felder[umgebung[k]].schonBeschossen == true) {
          felder[nochNichtBeschosseneFelder[i]].umgebungsinfo = felder[nochNichtBeschosseneFelder[i]].umgebungsinfo - 1;
        }
      }
    }
  }
  for (let i = 0; i < 49; i++) {
    console.log("Feld: " + i, felder[i].umgebungsinfo);
  }
  schussfeldAuswahl();
}

function schussfeldAuswahl() {
  let infomengen = [];
  let schussfeldFavoriten = [];
  for (let i = 0; i < nochNichtBeschosseneFelder.length; i++) {
    infomengen.push(felder[nochNichtBeschosseneFelder[i]].umgebungsinfo);
  }
  infomengen.sort();

  console.log("sortierte infomengen" + infomengen);
  let maximum = infomengen[infomengen.length-1];
  console.log("maximum: " + maximum);
  for (let i = 0; i < nochNichtBeschosseneFelder.length; i++) {
    if (felder[nochNichtBeschosseneFelder[i]].umgebungsinfo == maximum) {
      schussfeldFavoriten.push(nochNichtBeschosseneFelder[i]);
    }
  }
  console.log("schussfeldFavoriten : " + schussfeldFavoriten);
  schussfeldCompi = schussfeldFavoriten[Math.floor(Math.random()*schussfeldFavoriten.length)];
  
  // zusätzlicher Schwierigkeitsgrad: 2x garantierte Treffer
  counter = counter +1;
  let treffer = [];

  if(schwierigkeitsgrad == 4){
    if (counter % 3 == 0  && siegpunkteComputer/counter < 1/3) { 
      if(felder[schussfeldCompi].gesetztesSchiff == false) {
        for(i=0; i<nochNichtBeschosseneFelder.length; i++) {
          if (felder[nochNichtBeschosseneFelder[i]].gesetztesSchiff == true) {
            treffer.push(nochNichtBeschosseneFelder[i]);
          }
        }
      schussfeldCompi = treffer[Math.floor(Math.random()*treffer.length)];
      }
    }
  } else {
    if (counter % 4 == 0  && siegpunkteComputer/counter < 1/4) { 
      if(felder[schussfeldCompi].gesetztesSchiff == false) {
        for(i=0; i<nochNichtBeschosseneFelder.length; i++) {
          if (felder[nochNichtBeschosseneFelder[i]].gesetztesSchiff == true) {
            treffer.push(nochNichtBeschosseneFelder[i]);
          }
        }
      schussfeldCompi = treffer[Math.floor(Math.random()*treffer.length)];
      }
    }
  }

  // Reset der umgebungsinfo-Felder
  for (let i=0; i<49; i++) {
    felder[i].umgebungsinfo = 8;
  }
  for (i=0; i<49; i++){
    if (felder[i].zeile == 0 || felder[i].zeile == 6) {
      felder[i].umgebungsinfo = felder[i].umgebungsinfo - 3
    }
    if (felder[i].spalte == 0 || felder[i].spalte == 6) {
      felder[i].umgebungsinfo = felder[i].umgebungsinfo - 3
    }
    if (i==0 || i==6 || i==42 || i==48) {
      felder[i].umgebungsinfo = felder[i].umgebungsinfo + 1
    }
  //console.log("feld: " + i + "Umgebung: " + felder[i].umgebungsinfo);
  }

  //console.log(maximum);
  console.log("schussfeldCompi: " + schussfeldCompi);
  console.log("umgebungsinfo schussfeldCompi: " + felder[schussfeldCompi].umgebungsinfo);

}



function siegerPlayer() {
  document.getElementById("mitteilung").innerText=("General, wir haben die Schlacht gewonnen !");
  let btn = document.createElement ("button");
  document.getElementById("navbar").appendChild(btn);
  btn.setAttribute("id", "buttonNewGame");
  btn.setAttribute("class", "button");
  btn.innerText="new game";
  btn.addEventListener("click", newGame);
  for (let i=0; i<49; i++) {
    let planquadrat = document.getElementById("Gegner" + i);
    planquadrat.removeEventListener("mouseover", schussfeldHover);
    planquadrat.removeEventListener("mouseout", schussfeldHoverEnde);
    planquadrat.removeEventListener("click", schussPrüfen);
  }

  wait ();
}
function siegerComputer() {
  document.getElementById("mitteilung").innerText=("General, wir haben die Schlacht verloren !");
  let btn = document.createElement ("button");
  document.getElementById("navbar").appendChild(btn);
  btn.setAttribute("id", "buttonNewGame");
  btn.setAttribute("class", "button");
  btn.innerText="new game";
  btn.addEventListener("click", newGame);
  wait ();
}

function wait() {
  while (siegpunktePlayer > 8 || siegpunkteComputer > 8) {
    wait();
  }
}
function newGame () {
  schiffzähler = 0;
  schiffzählerGegner = 0;
  siegpunktePlayer = 0;
  siegpunkteComputer = 0;
  felder = [];
  umgebung = [];
  gegnerFelder = [];
  freieFelder = [];
  gegnerSchiffe = [];
  nochNichtBeschosseneFelder = [];
  document.getElementById("koordinatensystem").innerHTML=("");
  document.getElementById("koordinatensystemGegner").innerHTML=("");
  document.getElementById("mitteilung").innerText = ("General, setze deine 9 Schiffe !");
  document.getElementById("schießen").style.color="blueviolet";
  document.getElementById("positionieren").style.color="white";
  let parent = document.getElementById("navbar");
  let child = document.getElementById("buttonNewGame");
  parent.removeChild(child);
  
  koordinatenSystem();
}