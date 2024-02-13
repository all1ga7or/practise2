
function plus(button) {
    var row = button.parentNode.parentNode;
    var quantitySpan = row.querySelector('.quantity');
    var currentQuantity = parseInt(quantitySpan.innerText);
    currentQuantity++;
    quantitySpan.innerText = currentQuantity;
}

function minus(button) {
    var row = button.parentNode.parentNode;
    var quantitySpan = row.querySelector('.quantity');
    var currentQuantity = parseInt(quantitySpan.innerText);
    if (currentQuantity > 0) {
        currentQuantity--;
        quantitySpan.innerText = currentQuantity;
    } else {
        alert('Кількість не може бути менше 0');
    }
}
function confirmPlan() {
    var selectedPlants = [];
    var rows = document.querySelectorAll('.crop_planning tr');
    var totalArea = 0;
    rows.forEach(function (row) {
        var occupiedArea = parseFloat(row.cells[2].innerText);
        var quantityElement = row.querySelector('.quantity');
        if (quantityElement) {
            var quantity = parseInt(quantityElement.innerText);
            totalArea += occupiedArea * quantity;
            if (quantity > 0) {
                var plantName = row.querySelector('td:first-child').textContent;
                selectedPlants.push({ name: plantName, quantity: quantity });
            }
        } else {
            console.error("Quantity element not found in a row.");
        }
    });
    localStorage.setItem('selectedPlants', JSON.stringify(selectedPlants));
    localStorage.setItem('totalArea', totalArea);
    location.href = "../greenhouses/greenhouses.html";
}

function clearPlan() {
    var quantities = document.querySelectorAll('.quantity');
    quantities.forEach(function (quantity) {
        quantity.innerText = '0';
    });
}
