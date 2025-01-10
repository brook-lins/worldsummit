// Wrap everything in window.onload
window.onload = function() {
    const presentationBtn = document.createElement('button');
    presentationBtn.id = 'presentationBtn';
    presentationBtn.textContent = 'Present';
    document.querySelector('#controls div').appendChild(presentationBtn);

    console.log('Globe.gl available:', typeof Globe !== 'undefined');
    console.log('countriesData available:', typeof countriesData !== 'undefined');

    // Get DOM elements
    const globeContainer = document.getElementById('globeViz');
    const countrySelect = document.getElementById('countrySelect');
    const visitBtn = document.getElementById('visitBtn');
    const roamingBtn = document.getElementById('roamingBtn');

    // Track current location
    let currentLocation = {
        lat: countriesData["WHQ"].lat,
        lng: countriesData["WHQ"].lng
    };

    // Initialize the Globe
    const myGlobe = Globe({ waitForGlobeReady: true })
        .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
        .htmlElementsData([])
        .htmlElement(d => {
            const el = document.createElement('div');
            el.style.position = 'absolute';
            el.style.pointerEvents = 'none';
            el.style.background = 'rgba(0, 0, 0, 0.8)';
            el.style.color = 'white';
            el.style.padding = '10px';
            el.style.borderRadius = '8px';
            el.style.transform = 'translate(-50%, -100%)';
            el.style.marginTop = '-30px';
            el.style.minWidth = '150px';
            el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            
            el.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                    <img src="branch-icon.png" style="width: 20px; height: 20px;">
                    <span style="flex-grow: 1; font-weight: bold;">${d.name || d.id}</span>
                    <div style="width: 10px; height: 10px; background: #00ff00; border-radius: 50%;"></div>
                </div>
                <div style="text-align: center;">
                    <img src="Ai-summit-logo.png" style="width: 30px; height: 30px;">
                </div>
                <div style="position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%);">
                    <div style="
                        width: 0;
                        height: 0;
                        border-left: 10px solid transparent;
                        border-right: 10px solid transparent;
                        border-top: 30px solid #000;
                        position: relative;
                        transform-style: preserve-3d;
                        transform: perspective(100px) rotateX(-20deg);
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    "></div>
                </div>
            `;
            
            return el;
        })
        .arcsData([])
        .arcColor(() => '#ffff00')
        .arcDashLength(0.4)
        .arcDashGap(0.2)
        .arcDashAnimateTime(1500)
        .arcStroke(1)
        .width(globeContainer.offsetWidth)
        .height(globeContainer.offsetHeight);

    // Mount globe
    myGlobe(globeContainer);

    // Move the countries initialization to the top after DOM elements
    const countries = countryOrder;  // Use our predefined order
    let currentCountryIndex = countries.indexOf("WHQ");

    // Add countries to dropdown
    countrySelect.innerHTML = '<option value="">Select a country...</option>';
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });

    // Set WHQ as default in dropdown
    countrySelect.value = "WHQ";

    // Initialize markers array with WHQ
    let markers = [{
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        id: 'whq',
        name: 'WHQ'
    }];
    myGlobe.htmlElementsData(markers);

    // Add visit button functionality
    visitBtn.addEventListener('click', () => {
        const selectedCountry = countrySelect.value;
        if (selectedCountry && countriesData[selectedCountry]) {
            const coords = countriesData[selectedCountry];
            
            // Zoom in closer to the selected location
            myGlobe.pointOfView({
                lat: coords.lat,
                lng: coords.lng,
                altitude: 1.0  // Lower altitude means closer zoom (default was 2.5)
            }, 1000);

            if (window.syncPresentationGlobe) {
                window.syncPresentationGlobe({
                    lat: coords.lat,
                    lng: coords.lng,
                    altitude: 1.0
                });
            }
        }
    });

    // Modify the country selection handler to use normal zoom level
    countrySelect.addEventListener('change', (e) => {
        const country = e.target.value;
        if (country && countriesData[country]) {
            // Update current index
            currentCountryIndex = countries.indexOf(country);
            
            const targetCoords = countriesData[country];
            
            // Create arc from current location to new location
            const arc = {
                startLat: currentLocation.lat,
                startLng: currentLocation.lng,
                endLat: targetCoords.lat,
                endLng: targetCoords.lng
            };

            // Update arcs
            const currentArcs = myGlobe.arcsData();
            myGlobe.arcsData([...currentArcs, arc]);
            
            // Add new marker to existing markers
            markers.push({
                lat: targetCoords.lat,
                lng: targetCoords.lng,
                id: country.toLowerCase().replace(/\s+/g, '-'),
                name: country
            });
            myGlobe.htmlElementsData(markers);

            // Update current location
            currentLocation = targetCoords;

            // Animate to selected country (normal zoom level)
            myGlobe.pointOfView({
                lat: targetCoords.lat,
                lng: targetCoords.lng,
                altitude: 2.5
            }, 1000);

            if (window.syncPresentationGlobe) {
                window.syncPresentationGlobe({
                    lat: targetCoords.lat,
                    lng: targetCoords.lng,
                    altitude: 2.5
                });
            }
        }
    });

    // Add hover effect for the visit button
    visitBtn.addEventListener('mouseover', () => {
        visitBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        visitBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    });
    
    visitBtn.addEventListener('mouseout', () => {
        visitBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        visitBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        myGlobe
            .width(globeContainer.offsetWidth)
            .height(globeContainer.offsetHeight);
    });

    // Set initial point of view to WHQ
    myGlobe.pointOfView({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        altitude: 2.5
    });

    let isRoaming = false;
    let rotationInterval;

    // Add roaming functionality
    roamingBtn.addEventListener('click', () => {
        isRoaming = !isRoaming;
        
        if (isRoaming) {
            // Update button appearance
            roamingBtn.style.background = 'rgba(0, 255, 0, 0.2)';
            roamingBtn.style.borderColor = 'rgba(0, 255, 0, 0.3)';
            
            // Zoom out
            myGlobe.pointOfView({
                lat: 0,
                lng: 0,
                altitude: 2.5
            }, 1000);

            // Start rotation
            let currentLng = 0;
            rotationInterval = setInterval(() => {
                currentLng += 0.5;
                myGlobe.pointOfView({
                    lat: 5,
                    lng: currentLng,
                    altitude: 2.5
                });
            }, 50);
        } else {
            // Reset button appearance
            roamingBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            roamingBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            
            // Stop rotation
            clearInterval(rotationInterval);
        }
    });

    // Add roaming button hover effects
    roamingBtn.addEventListener('mouseover', () => {
        if (!isRoaming) {
            roamingBtn.style.background = 'rgba(255, 255, 255, 0.2)';
            roamingBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }
    });
    
    roamingBtn.addEventListener('mouseout', () => {
        if (!isRoaming) {
            roamingBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            roamingBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }
    });

    // Stop roaming when a country is selected
    countrySelect.addEventListener('change', (e) => {
        if (isRoaming) {
            isRoaming = false;
            clearInterval(rotationInterval);
            roamingBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            roamingBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }
        // ... rest of the existing change handler code
    });

    // Stop roaming when visit button is clicked
    visitBtn.addEventListener('click', () => {
        if (isRoaming) {
            isRoaming = false;
            clearInterval(rotationInterval);
            roamingBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            roamingBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }
        // ... rest of the existing visit handler code
    });

    // Clean up on window unload
    window.addEventListener('unload', () => {
        if (rotationInterval) {
            clearInterval(rotationInterval);
        }
    });

    // Add presentation functionality
    presentationBtn.addEventListener('click', () => {
        try {
            // Create a new window
            const presentationWindow = window.open('', '_blank', 
                'width=800,height=600,menubar=no,toolbar=no,location=no,status=no'
            );

            if (!presentationWindow) {
                alert('Pop-up was blocked. Please allow pop-ups for this site.');
                return;
            }

            // Write the content directly
            presentationWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Globe Presentation</title>
                    <script src="https://unpkg.com/globe.gl"></script>
                    <style>
                        body { 
                            margin: 0; 
                            padding: 0; 
                            overflow: hidden;
                            background: #000011;
                        }
                        #presentationGlobe {
                            width: 100vw;
                            height: 100vh;
                        }
                    </style>
                </head>
                <body>
                    <div id="presentationGlobe"></div>
                    <script>
                        const presentationGlobe = Globe()
                            .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
                            .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
                            .width(window.innerWidth)
                            .height(window.innerHeight);

                        document.getElementById('presentationGlobe').appendChild(presentationGlobe.renderer().domElement);

                        window.addEventListener('resize', () => {
                            presentationGlobe
                                .width(window.innerWidth)
                                .height(window.innerHeight);
                        });

                        // Sync with main globe
                        window.syncWithMain = (coords) => {
                            presentationGlobe.pointOfView(coords, 1000);
                        };

                        // Request fullscreen
                        document.documentElement.requestFullscreen().catch(console.error);
                    </script>
                </body>
                </html>
            `);

            // Close the document
            presentationWindow.document.close();

            // Set up sync function in main window
            window.syncPresentationGlobe = (coords) => {
                if (presentationWindow && !presentationWindow.closed) {
                    presentationWindow.syncWithMain(coords);
                }
            };

            // Initial sync
            window.syncPresentationGlobe({
                lat: currentLocation.lat,
                lng: currentLocation.lng,
                altitude: 2.5
            });

        } catch (err) {
            console.error('Error setting up presentation:', err);
            alert('Unable to start presentation mode. Please check if pop-ups are allowed.');
        }
    });

    // Add the keyboard navigation function
    function goToNextCountry() {
        currentCountryIndex = (currentCountryIndex + 1) % countries.length;
        const nextCountry = countries[currentCountryIndex];
        
        // Update dropdown selection
        countrySelect.value = nextCountry;
        
        // Trigger the change event to use existing navigation logic
        const changeEvent = new Event('change');
        countrySelect.dispatchEvent(changeEvent);
    }

    // Add keyboard listener
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault(); // Prevent page scroll
            goToNextCountry();
        }
    });
}; 