let wichtelListe = [];

function addPerson() {
  const nameInput = document.getElementById("name");
  const darfNichtZiehenInput = document.getElementById("darfNichtZiehen");

  const name = nameInput.value.trim();
  const darfNichtZiehen = darfNichtZiehenInput.value
    .split(",")
    .map((item) => item.trim());

  if (name !== "") {
    wichtelListe.push({ name, darfNichtZiehen });
    nameInput.value = "";
    darfNichtZiehenInput.value = "";
    updateTable();
    updateURL();
  }
}

function updateTable() {
  const table = document.getElementById("wichtelTable");
  table.innerHTML = ""; // Clear table content

  const header = table.createTHead();
  const headerRow = header.insertRow();
  headerRow.insertCell().appendChild(document.createTextNode("Name"));
  headerRow
    .insertCell()
    .appendChild(document.createTextNode("Darf nicht ziehen"));
  headerRow.insertCell(); // Empty cell for delete button

  const body = table.createTBody();
  wichtelListe.forEach((person, index) => {
    const newRow = body.insertRow();
    newRow.insertCell().appendChild(document.createTextNode(person.name));
    const notAllowed = newRow.insertCell();
    notAllowed.appendChild(
      document.createTextNode(person.darfNichtZiehen.join(", "))
    );
    notAllowed.classList.add("notAllowedList");

    const deleteCell = newRow.insertCell();
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "X";
    deleteButton.addEventListener("click", () => deletePerson(index)); // Call deletePerson with index
    deleteCell.appendChild(deleteButton);
  });
}

function deletePerson(index) {
  wichtelListe.splice(index, 1);
  updateTable();
  updateURL();
}

// Funktion, um die Ziehung der Wichtel durchzuführen
function zieheWichtel() {
  const ergebnisDiv = document.getElementById("ergebnis");
  ergebnisDiv.innerHTML = ""; // Leere das Ergebnis-Div, bevor du das Ergebnis anzeigst

  const ziehungen = [];
  wichtelListe.forEach((person) => {
    let moeglicheWichtel = wichtelListe.filter(
      (wichtel) =>
        wichtel.name !== person.name &&
        !person.darfNichtZiehen.includes(wichtel.name) &&
        !ziehungen.includes(wichtel.name)
    );

    if (moeglicheWichtel.length > 0) {
      const randomIndex = Math.floor(Math.random() * moeglicheWichtel.length);
      const gezogenerWichtel = moeglicheWichtel[randomIndex].name;
      ziehungen.push(gezogenerWichtel);
      ergebnisDiv.innerHTML += `<p>${person.name} bewichtelt ${gezogenerWichtel}!</p>`;
    } else {
      ergebnisDiv.innerHTML =
        "<p>Die Einschränkungen führen zu keiner möglichen Ziehung. Versuchen Sie es nochmal!</p>";
      return;
    }
  });
  updateURL();
}

function loadConfiguration(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result;
    try {
      wichtelListe = JSON.parse(content);
      updateTable();
      console.log("Konfiguration geladen:", wichtelListe); // Hier prüfen, ob die Konfiguration geladen wurde
    } catch (error) {
      alert("Ungültiges Dateiformat.");
      console.error(error);
    }
  };
  reader.readAsText(file);
}

function updateURL() {
  const params = new URLSearchParams();
  params.set("config", JSON.stringify(wichtelListe));
  const newURL = window.location.href.split("?")[0] + "?" + params.toString();
  window.history.replaceState({}, "", newURL);
  console.log("URL wurde aktualisiert:", newURL); // Hier prüfen, ob die URL aktualisiert wurde
}

function loadFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const configParam = urlParams.get("config");
  if (configParam) {
    try {
      wichtelListe = JSON.parse(configParam);
      updateTable();
      console.log("Konfiguration aus URL geladen:", wichtelListe); // Hier prüfen, ob die Konfiguration aus der URL geladen wurde
    } catch (error) {
      console.error(error);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("addButton").addEventListener("click", addPerson);
  document
    .getElementById("ziehenButton")
    .addEventListener("click", zieheWichtel);
  // Beim Laden der Seite Konfiguration aus URL laden
  loadFromURL();
});
