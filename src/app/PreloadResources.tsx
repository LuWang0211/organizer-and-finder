"use client";

import ReactDOM from "react-dom"

export function PreloadResources() {
    ReactDOM.preload('/assets/texture/background.png', { as: 'image' })
    ReactDOM.preload('/assets/texture/grid.png', { as: 'image' })
   
    return null
}
  