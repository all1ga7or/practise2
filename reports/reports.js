function showPlacesForSowing() {
    // Make an Ajax request to get information about free greenhouses
    fetch('/get_free_greenhouses_info') // Update the route based on your server implementation
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(freeGreenhousesData => {
            // Вивести дані в таблицю
            var placesForSowingTableBody = document.getElementById('placesForSowingTable').getElementsByTagName('tbody')[0];
            placesForSowingTableBody.innerHTML = ''; // Очистити попередні дані
            for (var i=0; i < 5; i++){
                var row = placesForSowingTableBody.insertRow();
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                cell1.innerText = freeGreenhousesData[i].greenhouse_id;
                cell2.innerText = freeGreenhousesData[i].free_area.toFixed(2);
            }
            // Показати таблицю
            document.getElementById('placesForSowingTableContainer').style.display = 'block';
            document.getElementById('greenhousesForHarvestingTableContainer').style.display = 'none';
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
function filterUniqueCrops(cropsData) {
    // Use a map to store unique combinations of greenhouseId and plantName
    const uniqueCombinations = new Map();

    // Filter out duplicates based on the unique combination
    const filteredCrops = cropsData.filter(crop => {
        const combinationKey = `${crop.greenhouseId}_${crop.plantName}`;
        
        // If the combination is not in the map, add it and include the crop in the result
        if (!uniqueCombinations.has(combinationKey)) {
            uniqueCombinations.set(combinationKey, true);
            return true;
        }

        return false;
    });

    return filteredCrops;
}
function showGreenhousesForHarvesting() {
    // Make an Ajax request to get crop information for harvesting
    fetch('/get_crops_for_harvesting')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(cropsData => {
            // Display the data in the table
            const filteredCrops = filterUniqueCrops(cropsData);
            displayCropsForHarvestingTable(filteredCrops);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function displayCropsForHarvestingTable(cropsData) {
    // Display data in the table
    var greenhousesForHarvestingTableBody = document.getElementById('greenhousesForHarvestingTable').getElementsByTagName('tbody')[0];
    greenhousesForHarvestingTableBody.innerHTML = ''; // Clear previous data

    cropsData.forEach(function (crop) {
        var row = greenhousesForHarvestingTableBody.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerText = crop.greenhouseId;
        cell2.innerText = crop.plantName;
    });

    // Show the table
    document.getElementById('greenhousesForHarvestingTableContainer').style.display = 'block';
    document.getElementById('placesForSowingTableContainer').style.display = 'none';
}