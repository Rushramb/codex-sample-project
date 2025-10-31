# Interactive Web Map - Regio Rijnmond

An interactive, full-screen web map application showcasing the Regio Rijnmond area using Leaflet.js and OpenStreetMap.

## Features

- **Full-Screen Interactive Map**: Seamless, responsive map interface that fills the entire viewport
- **OpenStreetMap Integration**: Google Maps-like visual style using OSM tile layers
- **Centered on Regio Rijnmond**: Default view centered at 51.9°N, 4.3°E with zoom level 11
- **Custom Location Markers**: Dynamic markers loaded from JSON data file
- **Interactive Popups**: Click any marker to view location name and description
- **12 Pre-configured Locations**: Including Rotterdam landmarks, Schiedam, Vlaardingen, and more

## Quick Start

1. **Open the application**: Simply open `index.html` in a modern web browser
2. **Explore the map**: Pan, zoom, and click on markers to discover locations
3. **Customize locations**: Edit `locations.json` to add your own points of interest

## File Structure

```
.
├── index.html          # Main application file with Leaflet.js integration
├── locations.json      # JSON data file containing location information
└── README.md          # This file
```

## Adding Custom Locations

Edit `locations.json` to add your own locations. Each location requires:

```json
{
    "latitude": 51.9225,
    "longitude": 4.47917,
    "name": "Location Name",
    "description": "Detailed description of the location"
}
```

## Technologies Used

- **Leaflet.js v1.9.4**: Open-source JavaScript library for interactive maps
- **OpenStreetMap**: Free, editable map tiles
- **Vanilla JavaScript**: No frameworks required
- **CSS3**: Full-screen responsive design

## Browser Compatibility

Compatible with all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Included Locations

The application comes pre-loaded with 12 notable locations in Regio Rijnmond:
- Rotterdam Central Station
- Erasmus Bridge
- Euromast
- Markthal Rotterdam
- Rotterdam Zoo (Diergaarde Blijdorp)
- Cube Houses
- Schiedam Windmill Museum
- Vlaardingen City Center
- Capelle aan den IJssel
- Kralingse Plas
- Hoek van Holland
- Rotterdam The Hague Airport

## License

Open source - feel free to modify and use for your projects.
