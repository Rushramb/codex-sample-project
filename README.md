# Interactive Web Map - Regio Rijnmond

An interactive, full-screen web map application showcasing the Regio Rijnmond area with advanced features including 3D-style markers, drag-and-drop functionality, and intelligent search.

## Features

### Core Functionality
- **Full-Screen Interactive Map**: Seamless, responsive map interface that fills the entire viewport
- **OpenStreetMap Integration**: Google Maps-like visual style using OSM tile layers
- **Centered on Regio Rijnmond**: Default view centered at 51.9°N, 4.3°E with zoom level 11
- **12 Pre-configured Locations**: Including Rotterdam landmarks, Schiedam, Vlaardingen, and more

### Enhanced Interactivity
- **3D-Style Custom Icons**: Each location features a unique, color-coded 3D pin marker with Font Awesome icons
  - 11 different icon types (train, bridge, tower, shopping, zoo, building, museum, city, water, beach, airport)
  - Smooth hover animations with scale and shadow effects
  - Color-coded by category for easy visual identification

- **Drag & Drop Markers**: All markers are fully draggable
  - Click and drag any marker to reposition it on the map
  - Real-time coordinate updates displayed in popup
  - Automatic popup refresh with new coordinates after drag
  - Console logging of position changes for debugging

- **Advanced Search**: Intelligent search panel with live filtering
  - Search by location name, description, or category
  - Real-time results as you type
  - Click any result to fly to that location with smooth animation
  - Displays matching locations with their icons and categories
  - Auto-clear on outside click

### Visual Enhancements
- **Category Legend**: Collapsible panel showing all location categories
  - Color-coded icons for each category
  - Location count per category
  - Toggle visibility with click

- **Enhanced Popups**: Rich information display on marker click
  - Location name with matching icon
  - Category badge
  - Full description
  - Precise coordinates (4 decimal places)
  - Drag instruction hint

- **Info Panel**: Helpful tips for using the map features

## Quick Start

1. **Open the application**: Simply open `index.html` in a modern web browser
2. **Explore the map**: Pan, zoom, and click on markers to discover locations
3. **Search locations**: Use the search box to quickly find specific places
4. **Drag markers**: Click and drag any marker to reposition it
5. **View legend**: Check the categories panel to see location types
6. **Customize locations**: Edit `locations.json` to add your own points of interest

## File Structure

```
.
├── index.html          # Main application with all interactive features
├── locations.json      # JSON data file with location information
└── README.md          # This file
```

## Adding Custom Locations

Edit `locations.json` to add your own locations. Each location requires:

```json
{
    "latitude": 51.9225,
    "longitude": 4.47917,
    "name": "Location Name",
    "description": "Detailed description of the location",
    "icon": "train",
    "category": "transportation",
    "color": "#e74c3c"
}
```

### Available Icon Types
- `train` - Railway/train stations
- `bridge` - Bridges and similar structures
- `tower` - Towers and tall buildings
- `shopping` - Shopping centers and markets
- `zoo` - Zoos and animal parks
- `building` - General buildings and architecture
- `museum` - Museums and cultural sites
- `city` - City centers and districts
- `water` - Lakes, rivers, and water features
- `beach` - Beaches and coastal areas
- `airport` - Airports and aviation facilities

### Color Scheme
Use hex color codes for marker colors. Examples:
- Red: `#e74c3c` (transportation)
- Blue: `#3498db` (landmarks, water)
- Purple: `#9b59b6` (towers)
- Orange: `#f39c12` (shopping)
- Green: `#2ecc71` (entertainment)
- Teal: `#16a085` (culture)
- Gray: `#34495e`, `#7f8c8d` (cities)
- Yellow: `#f1c40f` (nature, beaches)

## Technologies Used

- **Leaflet.js v1.9.4**: Open-source JavaScript library for interactive maps
- **OpenStreetMap**: Free, editable map tiles
- **Font Awesome 6.4.0**: Icon library for 3D-style markers
- **Vanilla JavaScript**: No frameworks required
- **CSS3**: Advanced styling with 3D effects, animations, and responsive design

## Interactive Features in Detail

### Drag & Drop
- All markers are draggable by default
- Drag events are logged to console
- Coordinates update automatically after repositioning
- Smooth autopan when dragging near map edges

### Search Functionality
- Real-time filtering across names, descriptions, and categories
- Results display instantly as you type
- Click any result to smoothly fly to that location
- Search clears automatically when clicking outside the panel

### 3D Marker Effects
- Custom teardrop-shaped markers with rotation
- Multiple shadow layers for depth effect
- Hover animations with scale transformation
- Inset shadows for realistic 3D appearance
- Icon rotation compensation for perfect orientation

### Legend System
- Automatically generated from location data
- Groups locations by category
- Shows count per category
- Collapsible for space management

## Browser Compatibility

Compatible with all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires JavaScript enabled and support for:
- ES6+ features (async/await, arrow functions, template literals)
- CSS3 transforms and animations
- Fetch API

## Included Locations

The application comes pre-loaded with 12 notable locations in Regio Rijnmond:

| Location | Category | Icon |
|----------|----------|------|
| Rotterdam Central Station | Transportation | Train |
| Erasmus Bridge | Landmark | Bridge |
| Euromast | Landmark | Tower |
| Markthal Rotterdam | Shopping | Shopping Cart |
| Rotterdam Zoo | Entertainment | Paw |
| Cube Houses | Landmark | Building |
| Schiedam Windmill Museum | Culture | Landmark |
| Vlaardingen City Center | City | City |
| Capelle aan den IJssel | City | City |
| Kralingse Plas | Nature | Water |
| Hoek van Holland | Nature | Beach |
| Rotterdam The Hague Airport | Transportation | Plane |

## Development Notes

### Coordinate System
- Uses standard WGS84 coordinates (latitude/longitude)
- Latitude: North-South position (-90 to +90)
- Longitude: East-West position (-180 to +180)
- Displayed with 4 decimal precision (~11 meter accuracy)

### Performance
- All 12 locations load instantly
- Search filtering is real-time with no lag
- Smooth animations using CSS transitions
- Efficient marker rendering with Leaflet's optimization

### Accessibility
- High contrast colors for visibility
- Clear visual feedback on hover and interaction
- Informative popups with structured content
- Keyboard navigation support (via browser defaults)

## License

Open source - feel free to modify and use for your projects.
