"use client"

import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"

const DynamicMap = dynamic(() => import("./MapViewClient"), { ssr: false })

export default function MapView({ onLocationSelect, issues }) {
  return <DynamicMap onLocationSelect={onLocationSelect} issues={issues} />
}
