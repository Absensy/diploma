'use client'
import React from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

export default function Maps() {
  const defaultState = {
    center: [53.659082, 23.838170],
    zoom: 13,
  };

  return (
    <YMaps>
      <Map defaultState={defaultState} width="600px" height="308px">
        <Placemark geometry={[53.659082, 23.838170]} />
      </Map>
    </YMaps>
  );
}