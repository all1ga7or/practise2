document.addEventListener("DOMContentLoaded", function() {
    var totalArea = localStorage.getItem('totalArea');
    var roundedTotalArea = parseFloat(totalArea).toFixed(2);
    var areaTotalElement = document.querySelector('.area_total');
    if (areaTotalElement) {
        areaTotalElement.innerText = roundedTotalArea;
    } else {
        console.error("Element with class 'area_total' not found.");
    }
    var selectedPlants = JSON.parse(localStorage.getItem('selectedPlants'));

    selectedPlants.forEach(function(plant) {
        addRow(plant.name, plant.quantity);
    });
    selectedPlants.forEach(function(plant) {
        addHorizontalCell(plant.name, plant.quantity);
    });
});
function toggleSelection(element) {
    var selectCell = element.closest('.select-cell');
    selectCell.classList.toggle('selected');
}
function addRow(plantName, plantQuantity) {
    var table = document.getElementById("plantingTable").getElementsByTagName('tbody')[0];

    var newRow = table.insertRow();

    var cell1 = newRow.insertCell(0);
    cell1.innerHTML = plantName;

    var cell2 = newRow.insertCell(1);
    cell2.innerHTML = plantQuantity;

    var cell3 = newRow.insertCell(2);
    var inputElement = document.createElement('input');
    inputElement.className = "quantity_for_greenhouse";
    inputElement.type = "number";
    inputElement.addEventListener('input', function() {
        var value = parseInt(this.value);
        var maxValue = parseInt(cell2.innerHTML);
        if (value < 0) {
            this.value = "0";
        } 
        if (value > maxValue) {
            this.value = maxValue; // Обмежуємо введене значення
        }
    });
    cell3.appendChild(inputElement);

    var cell4 = newRow.insertCell(3);
    cell4.innerHTML = '<div onclick="toggleSelection(this)"><svg width="48" height="36" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.8542 35.5L0.229187 18.875L4.38544 14.7188L16.8542 27.1875L43.6146 0.427124L47.7709 4.58337L16.8542 35.5Z" fill="white"/></svg></div>';
    cell4.setAttribute('class', 'select-cell');
}
function addHorizontalCell(plantName, plantQuantity){
    var horizontalTable = document.getElementById('horizontal-table');
    var horizontalCell = document.createElement('div');
    horizontalCell.className = 'horizontalCell';
    var name = document.createElement('div');
    name.textContent = plantName;
    name.className = 'name';
    var quantity = document.createElement('div');
    quantity.textContent = plantQuantity;
    quantity.className = 'quantity';
    var horizontalLine = document.createElement('span');
    horizontalLine.className = 'horizontal_line';
    var line1 = document.createElement('div');
    line1.className = 'line line1';
    var line2 = document.createElement('div');
    line2.className = 'line';
    var line3 = document.createElement('div');
    line3.className = 'line line3';
    var th1 = document.createElement('div');
    th1.className = 'th';
    th1.innerText = 'Available'
    var th2 = document.createElement('div');
    th2.className = 'th';
    th2.innerText = 'Enter quantity for greenhouse:'
    var toggle = document.createElement('div');
    toggle.className = 'select-cell';
    toggle.innerHTML='<div onclick="toggleSelection(this)"><svg width="48" height="36" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.8542 35.5L0.229187 18.875L4.38544 14.7188L16.8542 27.1875L43.6146 0.427124L47.7709 4.58337L16.8542 35.5Z" fill="white"/></svg></div>';
    var inputElement = document.createElement('input');
    inputElement.className = "quantity_for_greenhouse";
    inputElement.type = "number";
    inputElement.addEventListener('input', function() {
        var value = parseInt(this.value);
        var maxValue = quantity.textContent;
        if (value < 0) {
            this.value = "0";
        } 
        if (value > maxValue) {
            this.value = maxValue; // Обмежуємо введене значення
        }
    });
    line1.appendChild(th1);
    line1.appendChild(quantity);
    line2.appendChild(th2);
    line3.appendChild(inputElement);
    line3.appendChild(toggle);
    horizontalCell.appendChild(name);
    horizontalCell.appendChild(horizontalLine);
    horizontalCell.appendChild(line1);
    horizontalCell.appendChild(line2);
    horizontalCell.appendChild(line3);
    horizontalTable.appendChild(horizontalCell);
}
function updatePlants(selectedPlants) {
    selectedPlants.forEach(function (plant) {
        var plantName = plant.name;
        var plantQuantity = plant.quantity;

        // Update the quantity in the table
        var quantityCell = document.querySelector(`#greenhouse1Table td:contains(${plantName}) + td`);
        if (quantityCell) {
            quantityCell.innerText = plantQuantity;
        }

        // Update the quantity in selectedPlants
        var selectedPlantIndex = selectedPlants.findIndex(p => p.name === plantName);
        if (selectedPlantIndex !== -1) {
            selectedPlants[selectedPlantIndex].quantity = plantQuantity;
        }
    });
}
function createTable(containerId) {
    var table = document.createElement('table');
    table.id = containerId + 'Table2';
    document.getElementById(containerId).appendChild(table);
}

function fillCropsTable(containerId, cropsData) {
    var table = document.getElementById(containerId + 'Table2');
    table.setAttribute('class', 'crop_planning');

    var headerRow = table.insertRow();
    var nameHeader = document.createElement('th');
    var statusHeader = document.createElement('th');
    headerRow.appendChild(nameHeader);
    headerRow.appendChild(statusHeader);
    nameHeader.innerHTML = 'Name';
    statusHeader.innerHTML = 'Status';


    cropsData.forEach(function (crop) {
        var plantName = crop.name;
        var status = crop.status;
        var row = table.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell2Span = document.createElement('span');
        if(crop.status == 'SOWN'){
            cell2Span.className= "sown";
        }else if(crop.status == 'SPROUT'){
            cell2Span.className= "sprout";
        } else if(crop.status == 'GROWING'){
            cell2Span.className= "growing";
        } else if(crop.status == 'BLOOMS'){
            cell2Span.className= "blooms";
        } else if(crop.status == 'FRUIT'){
            cell2Span.className= "fruit";
        } 
        cell1.innerHTML = plantName;
        cell2Span.innerHTML = status;
        cell2.appendChild(cell2Span);
    });
}
function deleteCropsFromServer(containerId, rowsToDelete) {
    var greenhouseId = containerId.match(/\d+/)[0];
    rowsToDelete.forEach(function (index) {
        // Отримати ідентифікатор рослини з даних рядка
        var plantName = document.getElementById(containerId + 'Table2').rows[index].cells[0].innerText;
        // Відправити запит на сервер для видалення запису про рослину
        fetch('/delete_crop/' + greenhouseId + '/' + plantName, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Crop deleted from server');
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });
}

function addButtons(containerId, freespaceElement1, freespaceElement2) {
    var addButton = document.createElement('button');
    addButton.className = 'add_button oswald';
    addButton.textContent = 'Add';
    addButton.addEventListener('click', function () {
        var selectedPlants = JSON.parse(localStorage.getItem('selectedPlants1'));
        addPlantsToCrops(containerId + 'Buttons1' , selectedPlants);
        updateFreespace(containerId, freespaceElement1, freespaceElement2, selectedPlants);
        movePlantsBetweenTables(containerId);
        updateTableQuantities(selectedPlants);
        clearChoice();
    });
    document.getElementById(containerId + 'Buttons1' ).appendChild(addButton);
    var harvestButton = document.createElement('button');
    harvestButton.className = 'harvest_button oswald';
    harvestButton.textContent = 'Harvest';
    harvestButton.addEventListener('click', function () {
        // Отримати таблицю Crops
        var greenhouseId = containerId.match(/\d+/)[0];
        var cropsTable = document.getElementById(containerId + 'Table2');
        var rows = cropsTable.querySelectorAll('tr:not(:first-child):not(:nth-child(2))');
        var freespaceElement1 = document.getElementById(containerId+'Table').querySelector('span.greenhouse_freespace');
        var freespaceElement2 = cropsTable.querySelector('span.greenhouse_freespace');
        var freeSpace = parseFloat(freespaceElement2.innerText);
        // Масив для зберігання індексів рядків, які слід видалити
        var rowsToDelete = [];
        // Переглянути кожен рядок таблиці
        rows.forEach(function (row, index) {
            // Отримати статус рядка (SOWN або FRUIT)
            var status = row.querySelector('td:last-child').innerText;
            var plantName = row.querySelector('td:first-child').innerText;

            // Якщо статус - FRUIT, додати індекс рядка в масив
            if (status === 'FRUIT') {
                rowsToDelete.push(index+2);
                fetch('/get_crops_info/' + greenhouseId)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(cropsData => {
                        var filteredCropsData = cropsData.filter(crop => crop.status === status && crop.name === plantName);
                        if (filteredCropsData.length > 0) {
                            var firstRecord = filteredCropsData[0];
                            var deletedPlantSize = firstRecord.plant_size;
                            var deletedPlantCount = firstRecord.count;
                            freeSpace += deletedPlantCount*deletedPlantSize;
                            freespaceElement1.innerText = freeSpace;
                            freespaceElement2.innerText = freeSpace;
                            console.log('First record:', firstRecord);
                        }
                        fetch('/update_greenhouse_size', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                greenhouseId: greenhouseId,
                                newSize: freeSpace,
                            }),
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                return response.json();
                            })
                            .then(updateResponse => {
                                console.log('Greenhouse size updated:', updateResponse);
                            })
                            .catch(error => {
                                console.error('There was a problem with the fetch operation:', error);
                            });
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                });
            }
        });
        
        deleteCropsFromServer(containerId, rowsToDelete);
        // Видалити вибрані рядки в зворотньому порядку, щоб уникнути зміни індексів під час видалення
        for (var i = rowsToDelete.length - 1; i >= 0; i--) {
            cropsTable.deleteRow(rowsToDelete[i]);
        }
       
    });
    var onOffDiv2 = document.createElement('div');
    onOffDiv2.className = 'on_off';
    var launchCheckbox2 = document.createElement('input');
    launchCheckbox2.type = 'checkbox';
    launchCheckbox2.id = 'launch_button_' + containerId + 'Buttons2';
    launchCheckbox2.className = 'launch_button';
    launchCheckbox2.addEventListener('change', function () {
        if (launchCheckbox2.checked) {
            startTimer(containerId);
        } else {

            stopTimer(containerId);
        }
    });
    var launchLabel2 = document.createElement('label');
    launchLabel2.htmlFor = 'launch_button_'+ containerId + 'Buttons2';
    var img12 = document.createElement('img');
    img12.src = 'img/button_launch.png';
    var img22 = document.createElement('img');
    img22.src = 'img/button_launch (1).png';
    var img32 = document.createElement('img');
    img32.src = 'img/button_launch (2).png';
    launchLabel2.appendChild(img12);
    launchLabel2.appendChild(img22);
    launchLabel2.appendChild(img32);
    onOffDiv2.appendChild(launchCheckbox2);
    onOffDiv2.appendChild(launchLabel2);
    document.getElementById(containerId + 'Buttons2').appendChild(harvestButton);
    document.getElementById(containerId + 'Buttons2').appendChild(onOffDiv2);
}
function addPlantsToCrops(containerId, selectedPlants) {
    // Отримує greenhouseId з containerId
    var greenhouseId = containerId.match(/\d+/)[0];

    // Використовуйте selectedPlants та greenhouseId для отримання необхідної інформації
    selectedPlants.forEach(function (plant) {
        fetch('/add_plant_to_crops', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                greenhouseId: greenhouseId,
                plantName: plant.name,
                quantity: plant.quantity,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(cropData => {
                console.log('Plant added to Crops:', cropData);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });
}

// Переносить рослини з першої таблиці в другу
function movePlantsBetweenTables(containerId) {
    // Отримує таблиці
    var sourceTable = document.getElementById(containerId + 'Table');
    var destinationTable = document.getElementById(containerId + 'Table2');
    var sourceTableContainer = document.querySelectorAll('.greenhouseTable-container');
    var tablesContainer = document.querySelectorAll('.greenhouse');
    var lastRow = destinationTable.rows[destinationTable.rows.length - 1];
    // Змінює стиль границь двох нижніх комірок останнього рядка
    lastRow.cells[0].style.borderBottomLeftRadius = '0';
    lastRow.cells[lastRow.cells.length - 1].style.borderBottomRightRadius = '0';
    // Переносить рядки з першої таблиці в другу
    for (var i = 2; i < sourceTable.rows.length; i++) {
        var row = sourceTable.rows[i].cloneNode(true);
        destinationTable.appendChild(row);
    }
    sourceTableContainer.forEach(function (container) {
        container.style.display = "none";
    });
    tablesContainer.forEach(function (tableCont) {
        tableCont.style.justifyContent='center';
    });
}

function updateFreespace(containerId, freespaceElement1, freespaceElement2, selectedPlants) {
    // Використовуйте selectedPlants для визначення, скільки місця займають рослини
    var spaceOccupied = 0;
    selectedPlants.forEach(function (plant) {
        fetch('/get_plant_info_byName/' + plant.name)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(plantDataResponse => {
                if ('size' in plantDataResponse) {
                    spaceOccupied += plantDataResponse.size * plant.quantity;
                } else {
                    console.error('Size property not found in the plant data');
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });
    var greenhouseId = containerId.match(/\d+/)[0];
    // Оновлює freespaceElement з оновленим значенням вільного місця
    fetch('/get_greenhouse_info/' + greenhouseId)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(greenhouseData => {
            if ('size' in greenhouseData) {
                var freespace = freespaceElement1.innerText - spaceOccupied;
                freespaceElement1.innerText = freespace;
                freespaceElement2.innerText = freespace;
                // Update Greenhouse.size on the server
                fetch('/update_greenhouse_size', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        greenhouseId: greenhouseId,
                        newSize: freespace,
                    }),
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(updateResponse => {
                        console.log('Greenhouse size updated:', updateResponse);
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                    });
            } else {
                console.error('Size property not found in the greenhouse data');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
    });
}
function updateTableQuantities(selectedPlants) {
    selectedPlants.forEach(function (plant) {
        var plantName = plant.name;
        var plantQuantity = plant.quantity;
        var bigTable = document.getElementById('plantingTable');
        if(!(bigTable.style.display !== "none")){
        // Find the corresponding cell in the table and update its content
            var rows = document.querySelectorAll('#plantingTable tr td:last-child.selected');
            rows.forEach(function (cell) {
                var row = cell.closest('tr');
                var cellName = row.querySelector('td:first-child').innerText;

                // Check if the plantName matches and update the quantity
                if (cellName === plantName) {
                    var quantityCell = row.querySelector('td:nth-child(2)');
                    var quantity = parseInt(quantityCell.innerText, 10);

                    if (!isNaN(quantity)) {
                        var newPlantQuantity = quantity - plantQuantity;

                        // Update the quantity in the same row
                        quantityCell.innerText = newPlantQuantity;

                        // Update the selectedPlants array
                        var plantIndex = selectedPlants.findIndex(function (selectedPlant) {
                            return selectedPlant.name === plantName;
                        });

                        // Update localStorage with the modified selectedPlants
                        if (plantIndex !== -1) {
                            selectedPlants[plantIndex].quantity = newPlantQuantity;

                            // Check if the new quantity is 0, and remove the plant from localStorage
                            if (newPlantQuantity === 0) {
                                var storedPlants = JSON.parse(localStorage.getItem('selectedPlants')) || [];
                                var storedPlantIndex = storedPlants.findIndex(function (storedPlant) {
                                    return storedPlant.name === plantName;
                                });

                                if (storedPlantIndex !== -1) {
                                    storedPlants.splice(storedPlantIndex, 1); // Remove the plant from the array
                                    localStorage.setItem('selectedPlants', JSON.stringify(storedPlants));
                                }
                            }
                        }
                    }
                }
            });
        } else{
            var horizontalCells = document.querySelectorAll('.horizontalCell');
            horizontalCells.forEach(function(cell) {
                var isSelected = cell.querySelector('.select-cell.selected');
            
                if (isSelected) {
                    var plantName = cell.querySelector('.name').textContent;
                    var plantQuantityElement = cell.querySelector('input.quantity_for_greenhouse');
                    var quantityCell = cell.querySelector('.quantity');
                    var quantity = parseInt(quantityCell.innerText, 10);
                    if (plantQuantityElement && plantQuantityElement.value > 0) {
                        var plantQuantity = plantQuantityElement.value;
                        var newPlantQuantity = quantity - plantQuantity;

                        // Update the quantity in the same row
                        quantityCell.innerText = newPlantQuantity;

                        // Update the selectedPlants array
                        var plantIndex = selectedPlants.findIndex(function (selectedPlant) {
                            return selectedPlant.name === plantName;
                        });

                        // Update localStorage with the modified selectedPlants
                        if (plantIndex !== -1) {
                            selectedPlants[plantIndex].quantity = newPlantQuantity;

                            // Check if the new quantity is 0, and remove the plant from localStorage
                            if (newPlantQuantity === 0) {
                                var storedPlants = JSON.parse(localStorage.getItem('selectedPlants')) || [];
                                var storedPlantIndex = storedPlants.findIndex(function (storedPlant) {
                                    return storedPlant.name === plantName;
                                });

                                if (storedPlantIndex !== -1) {
                                    storedPlants.splice(storedPlantIndex, 1); // Remove the plant from the array
                                    localStorage.setItem('selectedPlants', JSON.stringify(storedPlants));
                                }
                            }
                        }
                    } else {
                        console.error("Element with class 'quantity_for_greenhouse' not found in a row.");
                    }
                }
            });
        }
    });
}
function startTimer(containerId) {
    var greenhouseId = containerId.match(/\d+/)[0];
    // Fetch crop information from the server
    fetch('/get_crops_info/' + greenhouseId) // Adjust the endpoint based on your server implementation
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(cropsInfo => {
            cropsInfo.forEach(cropInfo => {
                var plantId = cropInfo.plant_id;
                var plantStatus = cropInfo.status;
                fetch('/get_plant_info_byID/' + plantId)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(info => {
                    var statusTime = 0;
                    if(plantStatus == 'SPROUT'){
                        statusTime = info.maturity_time * 2/5;
                    } else if(plantStatus == 'GROWING'){
                        statusTime = info.maturity_time * 3/5;
                    }else if(plantStatus == 'BLOOMS'){
                        statusTime = info.maturity_time * 4/5;
                    }else if(plantStatus == 'FRUIT'){
                        statusTime = info.maturity_time * 5/5;
                    }
                    var maturityTime = info.maturity_time - statusTime;
                    var timerKey = containerId + '_' + info.name;
                    var storedTime = parseFloat(localStorage.getItem(timerKey)) || maturityTime;
                    createTimer(containerId, info.name, storedTime, plantStatus);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
            });
        })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    }); 
          
}

function createTimer(containerId, plantName, initialMaturityTime, status) {
    var table = document.getElementById(containerId + 'Table2');
    var rows = table.querySelectorAll('tr');

    // Find the row that corresponds to the plantId
    var targetRow;
    rows.forEach(row => {
        var cell = row.querySelector('td:first-child');
        if (cell && cell.textContent === plantName) {
            targetRow = row;
        }
    });

    if (targetRow) {
        // Check if timer already exists in the row
        var timerElement = targetRow.querySelector('.timer');
        if (!timerElement) {
            // Create a timer element if it doesn't exist
            timerElement = document.createElement('div');
            timerElement.className = 'timer';
            // Append the timer to the last cell in the row
            targetRow.querySelector('td:last-child span').appendChild(timerElement);
        }

        // Run the timer for the specific plant in its row
        runTimer(containerId, plantName, initialMaturityTime, timerElement, status);
    } else {
        console.error('Row not found for plantName:', plantName);
    }
}

var intervalIds = {};

// Зупинка таймера
function stopTimer(containerId) {
    // Отримати всі ідентифікатори інтервалів для даного контейнера
    var ids = intervalIds[containerId];

    // Перевірити, чи є ідентифікатори інтервалів
    if (ids) {
        // Зупинити кожен інтервал за його ідентифікатором
        ids.forEach(function (id) {
            clearInterval(id);
        });

        // Очистіть ідентифікатори інтервалів для даного контейнера
        intervalIds[containerId] = [];
    }
}
function runTimer(containerId, plantName, initialMaturityTime, timerElement, status) {
    var currentTime = initialMaturityTime;
    var table = document.getElementById(containerId + "Table2");
    var maturityUpdateInterval = Math.round(initialMaturityTime / 4);
    if(status == 'SPROUT'){
        maturityUpdateInterval = Math.round(initialMaturityTime / 3);
    } else if(status == 'GROWING'){
        maturityUpdateInterval = Math.round(initialMaturityTime / 2);
    }else if(status == 'BLOOMS'){
        maturityUpdateInterval = Math.round(initialMaturityTime);
    }
    intervalIds[containerId] = intervalIds[containerId] || [];
    var intervalId = setInterval(function () {
        currentTime--; // Decrease the time
        
        // Optionally, you can check if the timer reached zero and take actions
        if (currentTime <= 0) {
            clearInterval(intervalId);
            timerElement.innerText='';
        }

        // Update the timer element with the current time
        timerElement.innerText = formatTime(currentTime);

        // Check if it's time to update the status
        if (currentTime % maturityUpdateInterval === 0) {
            updateStatusOnTimer(plantName, table);
        }
        var timerKey = containerId + '_' + plantName;
        localStorage.setItem(timerKey, currentTime);
    }, 1000);
    intervalIds[containerId].push(intervalId);
}

function updateStatusOnTimer(plantName, table) {
    fetch('/get_plant_info_byName/' + plantName)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(plantInfo => {
            var rows = table.querySelectorAll('tr');
            var targetRow;

            // Iterate through each row and find the one with the matching plant name
            rows.forEach(row => {
                var nameCell = row.querySelector('td:first-child');
                if (nameCell && nameCell.textContent === plantName) {
                    targetRow = row;
                }
            });

            if (targetRow) {
                // Check if the timer element exists

                // Update the status
                var statusCell = targetRow.querySelector('td:last-child span');
                var currentStatus = statusCell.textContent;
                var statusMap = {
                    'SOWN': 'SPROUT',
                    'SPROUT': 'GROWING',
                    'GROWING': 'BLOOMS',
                    'BLOOMS': 'FRUIT',
                };
                var classMap = {
                    'SPROUT': 'sprout',
                    'GROWING': 'growing',
                    'BLOOMS': 'blooms',
                    'FRUIT': 'fruit',
                };
                var newStatus = statusMap[currentStatus];
                if (newStatus) {
                    statusCell.textContent = newStatus;
                    statusCell.className = classMap[newStatus];
                    // Call the function to update status on the server
                    updateStatusOnServer(plantInfo.id, currentStatus, newStatus);
                }
            } else {
                console.error('Row not found for plant name:', plantInfo.name);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


function formatTime(seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    var remainingSeconds = seconds % 60;

    return `${hours}:${minutes}:${remainingSeconds}`;
}
function updateStatusOnServer(plantId, oldStatus, newStatus) {
    fetch('/update_crop_status/'+ plantId + '/' + oldStatus, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newStatus }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Status updated on the server:', data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}


function confirmChoice() {
    if(document.querySelector('.add_chosen')){
        document.querySelector('.add_chosen').classList.remove('add_chosen');  
    }
    var sourceTableContainer = document.querySelectorAll('div.greenhouseTable-container');
    document.querySelectorAll('div.greenhouse').forEach(function(element) {
        element.style.display = 'flex';
        element.style.justifyContent='space-beetwen';
    });
    sourceTableContainer.forEach(function (container) {
        container.style.display = "flex";
    });
    var selectedRows = document.querySelectorAll('.select-cell.selected');
    var selectedPlants1 = [];

    if (selectedRows.length > 0) {
        selectedRows.forEach(function (row) {
            var bigTable = document.getElementById('plantingTable');
            if(!(bigTable.style.display !== "none")){
                var plantName = row.closest('tr').querySelector('td:first-child').innerText;
                var plantQuantityElement = row.closest('tr').querySelector('td:nth-child(3) input.quantity_for_greenhouse');
    
                if (plantQuantityElement && plantQuantityElement.value>0) {
                    var plantQuantity = plantQuantityElement.value;
                    selectedPlants1.push({ name: plantName, quantity: plantQuantity });
                } else {
                    console.error("Element with class 'quantity_for_greenhouse' not found in a row.");
                }
            } else {
                var horizontalCells = document.querySelectorAll('.horizontalCell');
                horizontalCells.forEach(function(cell) {
                    var isSelected = cell.querySelector('.select-cell.selected');
                
                    if (isSelected) {
                        var plantName = cell.querySelector('.name').textContent;
                        var plantQuantityElement = cell.querySelector('input.quantity_for_greenhouse');
                
                        if (plantQuantityElement && plantQuantityElement.value > 0) {
                            var plantQuantity = plantQuantityElement.value;
                            selectedPlants1.push({ name: plantName, quantity: plantQuantity });
                        } else {
                            console.error("Element with class 'quantity_for_greenhouse' not found in a row.");
                        }
                    }
                });
            }
           
        });
        console.log(selectedPlants1);
    } else {
        console.error("No rows with class 'select-cell selected' found.");
    }
    localStorage.setItem('selectedPlants1', JSON.stringify(selectedPlants1));
    var selectedGreenhouses = JSON.parse(localStorage.getItem('selectedGreenhouses'));
    var allGreenhouses = [1,2,3,4,5];
    // Пройтися по кожній вибраній теплиці
    allGreenhouses.forEach(function (greenhouseId, index) {
        fetch('/get_greenhouse_info/' + greenhouseId)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(greenhouseData => {
                // Check if 'size' property exists in the response
                if ('size' in greenhouseData) {
                    var freespace = greenhouseData.size;

                    // Створити таблицю для кожної теплиці
                    var tableId = 'greenhouse' + (index + 1) + 'Table';
                    var table = document.getElementById(tableId);
                    table.setAttribute('class', 'crop_planning')
                    table.innerHTML = '';

                    var row1 = table.insertRow();
                    var nameHeader = document.createElement('th');
                    var infoHeader = document.createElement('th');
                    row1.appendChild(infoHeader);
                    infoHeader.setAttribute('colspan', '2');
                    infoHeader.innerHTML = 'ID ' + greenhouseId + '<br> free space: <span class="greenhouse_freespace"></span> sq.m';

                    var row2 = table.insertRow();
                    nameHeader.innerHTML = 'Name';
                    row2.appendChild(nameHeader);
                    var statusHeader = document.createElement('th');
                    statusHeader.innerHTML = 'Status';
                    row2.appendChild(statusHeader);
                    
                    selectedPlants1.forEach(function (plant) {
                        fetch('/get_plant_info_byName/' + plant.name)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                return response.json();
                            })
                            .then(plantDataResponse => {
                                if ('size' in plantDataResponse) {
                                    var plantSize = plantDataResponse.size;
                                    var plantRow = table.insertRow();
                                    var plantCell1 = plantRow.insertCell(0);
                                    var plantCell2 = plantRow.insertCell(1);
                                    var plantCell2Span = document.createElement('span');
                                    plantCell2.appendChild(plantCell2Span);
                                    plantCell1.innerHTML = plantDataResponse.name;
                                    plantCell2Span.innerHTML = 'SOWN';
                                    console.log('Plant Size:', plantSize);
                                } else {
                                    console.error('Size property not found in the plant data');
                                }
                            })
                            .catch(error => {
                                console.error('There was a problem with the fetch operation:', error);
                            });
                    });

                    var freespaceElement = row1.querySelector('.greenhouse_freespace');
                    
                    console.log('Free space:', freespace);
                    var table2 = document.getElementById('greenhouse' + (index + 1) + 'Table2');
                    if (!selectedGreenhouses.includes(greenhouseId.toString())) {
                        var tableContainer = document.querySelector('.greenhouse' + greenhouseId + 'Table-container')
                        var tablesContainer = document.querySelector('#greenhouse' + greenhouseId)
                        tableContainer.style.display = 'none';
                        tablesContainer.style.justifyContent = 'flex-end';
                    }
                    if(table2.innerHTML === ''){
                        var headerRow2 = table2.insertRow();
                        headerRow2.appendChild(infoHeader.cloneNode(true));
                        
                        // Отримати дані з сервера для таблиці Crops та заповнити другу таблицю
                        fetch('/get_crops_info/' + greenhouseId)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                return response.json();
                            })
                            .then(cropsData => {
                                var totalSize = 0;
                                var uniqueCropsData = cropsData.filter((crop, index, self) => 
                                    index === self.findIndex((t) => (
                                        t.id === crop.id
                                    ))
                                );
                                uniqueCropsData.forEach(function (crop) {
                                    totalSize += crop.count * crop.plant_size; 
                                });
                                freespace -= totalSize;
                                freespaceElement.innerText = freespace;  
                                headerRow2.querySelector('.greenhouse_freespace').innerText = freespace;
                                fillCropsTable('greenhouse' + (index + 1), uniqueCropsData);
                                addButtons('greenhouse' + (index + 1), freespaceElement, headerRow2.querySelector('.greenhouse_freespace'));
                                headerRow2.querySelector('.greenhouse_freespace').innerText = freespaceElement.innerText;
                            })
                            .catch(error => {
                                console.error('There was a problem with the fetch operation:', error);
                        });
                    }
                } else {
                    console.error('Size property not found in the greenhouse data');
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            }
        );
    });
}
function clearChoice() {
    var selectedCells = document.querySelectorAll('.select-cell.selected');
    var inputFields = document.querySelectorAll('input.quantity_for_greenhouse');
    selectedCells.forEach(function (cell) {
        cell.classList.remove('selected');
    });
    inputFields.forEach(function (field) {
        field.value= '';
    });
}
