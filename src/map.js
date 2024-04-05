import React, { useEffect, useState } from "react";
import { YMaps, Map, Placemark, ZoomControl } from "react-yandex-maps";
import { NavbarCard } from "./navbar";
import arr from './test'
import { useLocation, useNavigate } from "react-router-dom";
const sock = new WebSocket("ws://204.12.199.7:9999/ws");

export function YandexMap() {
  const use_location = useLocation();
  const navigate = useNavigate();
  const [location, setLocation] = useState({
    latitude: 41.471574,
    longitude: 69.263856,
  });
 
  //web socket get set and close open states

  sock.onopen = function (event) {
    console.log("connection successful");
    sock.send("get data");
  };

  sock.onmessage = function (event) {
    console.log(typeof(event.data));
    const data=JSON.parse(event.data);
    console.log(data);
    let newData={
      longitude:data.data.positionLongitude,
      latitude:data.data.positionLatitude
    }
    setLocation(newData);
  };

  sock.onclose = function (event) {
    console.log("connection closed");
  };

  return (
    <div>
      <NavbarCard />
      <div style={{ width: "100%", height: "91.5vh" }}>
        <YMaps query={{ apikey: "b8342b76-6034-4d0a-be8b-20e125a532b9" }}>
          <Map
            defaultState={{
              center: [41.471574, 69.263856],
              zoom: 11,
              controls: [],
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <Placemark
              geometry={[location.latitude, location.longitude]}
              properties={{
                balloonContent: "eta balloon",
              }}
              options={{
                iconLayout: "default#image",
                iconImageHref:
                "https://freepngimg.com/thumb/car/75694-bird's-eye-car-top-view,plan-view-icon.png",
                iconImageSize: [35, 30],
                iconImageOffset: [-20, -40],
              }}
            />
          </Map>
        </YMaps>
      </div>
    </div>
  );
}
