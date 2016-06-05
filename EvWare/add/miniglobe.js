var miniMap = new L.Control.GlobeMiniMap({     
        land:'#669966',
        water:'#0077BE',
        marker:'#000000',
        topojsonSrc: 'world.json'
        }).addTo(map);