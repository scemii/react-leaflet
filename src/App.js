import { useEffect, useMemo, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import geodepartement from "./geo-departement.json";
import georegion from "./geo-region.json";
import "./App.css";

function App() {
  const lightBlueOption = { color: "#6283FF" };
  const darkBlueOption = { color: "002D9C" };

  const [color, setColor] = useState(lightBlueOption);
  const [map, setMap] = useState("region");

  //helper pour inverser les coordonnée géographique (et oui...)
  function reverse(arr) {
    arr.forEach((element) => {
      element.forEach((tab) => {
        return [...tab.reverse()];
      });
    });
    return arr;
  }

  //helper pour changer le state région / département
  function handleChange(e) {
    setMap(e.target.value);
  }

  //callback pour le click handler sur une région. Je vous laisserai compléter ce qu'on veut faire: affichage modal ou autre
  const clickHandler = useMemo(
    () => ({
      click(e) {
        console.log("clicked", e);
      },
    }),
    []
  );



  //inversion des données géo au premier render
  useEffect(() => {
    georegion.features.map((e) => reverse(e.geometry.coordinates));
    geodepartement.features.map((e) => reverse(e.geometry.coordinates));
  }, []);

  //render conditionnel en fonction de la vue "region" ou "departement" sélectionnée
  return (
    <div className="App">
      <div className="left-container">
        <h2>Ciblage adressable</h2>
        <FormControl className="formControl">
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={map}
            onChange={handleChange}
          >
            <MenuItem value={"departement"}>Département</MenuItem>
            <MenuItem value={"region"}>Région</MenuItem>
          </Select>
        </FormControl>
      </div>
      {map === "region" ? (
        <div>
          <MapContainer
            center={[47.0, 2.0]}
            zoom={6}
            dragging={true}
            doubleClickZoom={false}
            scrollWheelZoom={true}
            attributionControl={false}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {georegion.features.map((e) => (
              <Polygon
                key={e.properties.code}
                pathOptions={color}
                positions={e.geometry.coordinates}
                eventHandlers={clickHandler}
              >
                <Tooltip sticky>
                  {e.properties.nom} - {e.properties.population}m d'individus
                </Tooltip>
              </Polygon>
            ))}
          </MapContainer>
        </div>
      ) : (
        <div>
          <MapContainer
            center={[47.0, 2.0]}
            zoom={6}
            dragging={true}
            doubleClickZoom={false}
            scrollWheelZoom={true}
            attributionControl={false}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {geodepartement.features.map((e) => (
              <Polygon
                key={e.properties.code}
                pathOptions={color}
                positions={e.geometry.coordinates}
                eventHandlers={clickHandler}
              >
                <Tooltip sticky>
                  {e.properties.nom} - {e.properties.population}K individus
                </Tooltip>
              </Polygon>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default App;
