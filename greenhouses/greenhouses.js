document.addEventListener("DOMContentLoaded", function() {
    var totalArea = localStorage.getItem('totalArea');
    var roundedTotalArea = parseFloat(totalArea).toFixed(2);
    var areaTotalElement = document.querySelector('.area_total');
    if (areaTotalElement) {
        areaTotalElement.innerText = roundedTotalArea;
    } else {
        console.error("Element with class 'area_total' not found.");
    }
    getGreenhouseSizes().then(sizes => {
        console.log('Greenhouse Sizes:', sizes);
    
        // Now you can update the table with the received sizes
        updateSizeColumn(sizes);
    });
});
async function getGreenhouseSize(greenhouseId) {
    try {
        const response = await fetch(`/get_greenhouse_info/${greenhouseId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
function getGreenhouseSizes() {
    // Assuming you have the list of greenhouse IDs, replace [1, 2, 3, 4, 5] with your actual IDs
    var allGreenhouses = [1, 2, 3, 4, 5];
    
    // Map each greenhouse ID to a promise returned by getGreenhouseSize
    var promises = allGreenhouses.map(greenhouseId => getGreenhouseSize(greenhouseId));

    // Use Promise.all to wait for all promises to resolve
    return Promise.all(promises);
    
}
function updateSizeColumn(sizes) {
    var distributionTable = document.querySelector('.distribution.crop_planning');
    // Update the Size column based on the received sizes
    sizes.forEach(function (size, index) {
        var row = distributionTable.rows[index + 1]; // +1, as the first row is the header
        if (row) {
            var sizeCell = row.cells[2]; // 2 - index of the Size column
            if (sizeCell) {
                sizeCell.textContent = (size.size).toFixed(2); // Update the value in the cell
            }
        }
    });
}

function toggleSelection(element) {
    var selectCell = element.closest('.select-cell');
    selectCell.classList.toggle('selected');
}
function confirmChoice() {
    var selectedRows = document.querySelectorAll('.select-cell.selected');
    var selectedGreenhouses = [];

    selectedRows.forEach(function (row) {
        var greenhouseId = row.closest('tr').querySelector('td:first-child').innerText;
        selectedGreenhouses.push(greenhouseId);
    });

    // Зберегти вибрані обрані парникові на іншій сторінці (наприклад, в localStorage або через AJAX)
    localStorage.setItem('selectedGreenhouses', JSON.stringify(selectedGreenhouses));

    // Перейти на іншу сторінку
    window.location.href = '../dashboard/dashboard.html';
}

function clearChoice() {
    var selectedCells = document.querySelectorAll('.select-cell.selected');
    selectedCells.forEach(function (cell) {
        cell.classList.remove('selected');
    });
}

