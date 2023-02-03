let schiffzähler = 0;
let schiffzählerGegner = 0;
let neueSchiffsposition;
let schussposition;
let siegpunktePlayer = 0;
let siegpunkteComputer = 0;
let felder = [];
let umgebung = [];
let gegnerFelder = [];
let freieFelder = [];
let gegnerSchiffe = [];
let nochNichtBeschosseneFelder = [];

// Aufbau Koordinatensystem eigenes Feld, divs, event-listener, Felder
koordinatenSystem();
function koordinatenSystem() {
  for (let i=0; i<49; i++) {
    let planquadrat = document.createElement ("div");
    document.getElementById("koordinatensystem").appendChild(planquadrat);
    planquadrat.setAttribute("class", "planquadrat");
    planquadrat.setAttribute("id", i);
    planquadrat.addEventListener("mouseover", positionPrüfen);
    planquadrat.addEventListener("mouseout", positionPrüfenEnde);
    planquadrat.addEventListener("click", schiffSetzen);

    felder[i] = {
    spalte: 0,
    zeile: 0,
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
  console.log(gegnerSchiffe);
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
  console.log("schussposition" + schussposition);
  if(gegnerFelder[schussposition].schonBeschossen == true) {
    this.style.backgroundColor = "red";
    document.getElementById("mitteilung").innerText=("General, dieses Feld haben wir bereits beschossen!");
    setTimeout(schießenPlayer, 1000);
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
  setTimeout(schießenComputer,1000);

}
function schießenComputer() {
  nochNichtBeschosseneFelder = [];
  for (let i = 0; i < 49; i++) {
    if (felder[i].schonBeschossen == false){
      nochNichtBeschosseneFelder.push(i)
    }
  }
  schussfeldCompi = nochNichtBeschosseneFelder[Math.floor(Math.random()*nochNichtBeschosseneFelder.length)];
  
  if(felder[schussfeldCompi].gesetztesSchiff == true) {
    felder[schussfeldCompi].schonBeschossen = true;
    document.getElementById("schiff" + schussfeldCompi).setAttribute("class", "imageTreffer");
    document.getElementById("mitteilung").innerText=("General, eines unserer Schiffe wurde versenkt !");
    siegpunkteComputer = siegpunkteComputer + 1;
    if (siegpunkteComputer > 8) {
    siegerComputer()
    }
    setTimeout(schießenPlayer,1000);

  } else {
    let verfehlt = document.createElement("img");
    verfehlt.setAttribute("src", "daneben.webp");
    verfehlt.setAttribute("class", "image");
    document.getElementById(schussfeldCompi).appendChild(verfehlt);
    felder[schussfeldCompi].schonBeschossen = true;
    document.getElementById("mitteilung").innerText=("General, wir wurden beschossen !");
    setTimeout(schießenPlayer,1000);
  }
}
function siegerPlayer() {
  document.getElementById("mitteilung").innerText=("General, wir haben die Schlacht gewonnen !");
  let btn = document.createElement ("button");
  document.getElementById("navbar").appendChild(btn);
  btn.setAttribute("id", "button");
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
  btn.setAttribute("id", "button");
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
  let child = document.getElementById("button");
  parent.removeChild(child);
  
  koordinatenSystem();
}