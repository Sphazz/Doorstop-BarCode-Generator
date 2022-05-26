const codes = getCodes();

var count = 5;
var min = 1;
var max = 6;
const defaults = [
	["10001", "Available", false, false],
	["10002", "Unavailable", false, false],
	["10003", "Inside", false, false],
	["10004", "Outside", false, false],
	["MDAwMDAwfDluNFdaMUkvdEJFb2N0VkxnMHZ2QWc9PQ==", "Escort", false, true],
	["10003", "Lunch", false, false]
]
function createInputs(count) {
	var inputContainer = document.getElementById("input-container");
	var outputContainer = document.getElementById("output-container");
	var input = document.getElementById("barcode-input-wrapper-1");
	var output = document.getElementById("barcode-canvas-wrapper-1");
	for (i = 2; i <= count; i++) {
		createOutput(i, outputContainer, output);
		createInput(i, inputContainer, input);
		if (i < count)
			inputContainer.append(document.createElement("hr"));
	}
}
createInputs(count);

function createInput(id, inputContainer, input) {
	var clone = input.cloneNode(true);
	clone.id = "barcode-input-wrapper-" + id;
	clone.setAttribute("targetId", id);
	clone.getElementsByTagName('label')[0].setAttribute("for", "barcode-input-" + id);
	clone.getElementsByTagName('label')[0].innerHTML = "Barcode #" + id;

	clone.getElementsByTagName('input')[0].id = "barcode-label-" + id;
	clone.getElementsByTagName('input')[0].setAttribute("name", "barcode-label-" + id);
	clone.getElementsByTagName('input')[0].value = defaults[id-1][1];
	addBarcodeInputLabelListener(clone.getElementsByTagName('input')[0]);
	
	clone.getElementsByTagName('input')[1].id = "barcode-input-" + id;
	clone.getElementsByTagName('input')[1].setAttribute("name", "barcode-input-" + id);
	clone.getElementsByTagName('input')[1].value = defaults[id-1][0];
	clone.getElementsByTagName('input')[1].disabled = defaults[id-1][1];

	clone.getElementsByTagName('select')[0].id = "barcode-select-" + id;
	clone.getElementsByTagName('select')[0].setAttribute("name", "barcode-select-" + id);
	clone.getElementsByTagName('select')[0].setAttribute("default", defaults[id-1][1]);
	addSelectEventListener(clone.getElementsByTagName('select')[0]);
	clone.getElementsByTagName('select')[0].value = defaults[id-1][0];
	clone.getElementsByTagName('select')[0].disabled = !defaults[id-1][1];

	clone.getElementsByTagName('input')[2].id = "barcode-input-checkbox-" + id;
	clone.getElementsByTagName('input')[2].setAttribute("name", "barcode-input-checkbox-" + id);
	clone.getElementsByTagName('input')[2].checked = defaults[id - 1][2];
	clone.getElementsByTagName('label')[1].setAttribute("for", "barcode-input-checkbox-" + id);
	addBarcodeInputToggleListener(clone.getElementsByTagName('input')[2], id)

	clone.getElementsByTagName('input')[3].id = "barcode-size-checkbox-" + id;
	clone.getElementsByTagName('input')[3].setAttribute("name", "barcode-size-checkbox-" + id);
	clone.getElementsByTagName('input')[3].checked = defaults[id-1][3];
	clone.getElementsByTagName('label')[2].setAttribute("for", "barcode-size-checkbox-" + id);
	addBarcodeSizeToggleListener(clone.getElementsByTagName('input')[3], id);

	inputContainer.appendChild(clone);
}

function createOutput(id, outputContainer, output) {
	var clone = output.cloneNode(true);
	clone.id = "barcode-canvas-wrapper-" + id;
	clone.getElementsByTagName('img')[0].id = "barcode-canvas-" + id;
	clone.getElementsByTagName('p')[0].id = "barcode-canvas-label-" + id;
	clone.getElementsByTagName('p')[0].innerHTML = defaults[id-1][1];

	if (defaults[id-1][3]) {
		clone.getElementsByTagName('img')[0].classList.add("barcode-canvas-large");
		clone.getElementsByTagName('p')[0].classList.add("barcode-canvas-label-large");
	} else {
		clone.getElementsByTagName('img')[0].classList.remove("barcode-canvas-large");
		clone.getElementsByTagName('p')[0].classList.remove("barcode-canvas-label-large");
	}

	outputContainer.appendChild(clone);
}

const barcodeSelect = document.querySelectorAll(".barcode-select");
const barcodeLabel = document.querySelectorAll(".barcode-label");
const barcodeInputToggle = document.querySelectorAll(".barcode-input-checkbox");
const barcodeSizeToggle = document.querySelectorAll(".barcode-size-checkbox");

function updateBarcodeLabel(data) {
	var targetId = data.closest(".barcode-container").getAttribute("targetId");
	document.getElementById("barcode-canvas-label-" + targetId).innerHTML = data.value;
}

function addBarcodeInputLabelListener(data) {
	data.addEventListener('input', function () {
		updateBarcodeLabel(data);
	});
}

function barcodeInputLabelListener() {
	barcodeLabel.forEach(function (data) {
		addBarcodeInputLabelListener(data);
	});
}
barcodeInputLabelListener(barcodeLabel);

function addBarcodeInputToggleListener(data, targetId) {
	data.addEventListener('change', (event) => {
		if (data.checked) {
			document.getElementById("barcode-input-" + targetId).removeAttribute("disabled");
			document.getElementById("barcode-select-" + targetId).setAttribute("disabled", "true");
		} else {
			document.getElementById("barcode-select-" + targetId).removeAttribute("disabled");
			document.getElementById("barcode-input-" + targetId).setAttribute("disabled", "true");
		}
	});
}

function barcodeInputToggleListener(barcodeInputToggle) {
	barcodeInputToggle.forEach(function (data) {
		var targetId = data.closest(".barcode-container").getAttribute("targetId");
		addBarcodeInputToggleListener(data, targetId);
	});
}
barcodeInputToggleListener(barcodeInputToggle);

function addBarcodeSizeToggleListener(data, targetId) {
	data.addEventListener('change', (event) => {
		if (data.checked) {
			document.getElementById("barcode-canvas-" + targetId).classList.add("barcode-canvas-large");
			document.getElementById("barcode-canvas-label-" + targetId).classList.add("barcode-canvas-label-large");
		} else {
			document.getElementById("barcode-canvas-" + targetId).classList.remove("barcode-canvas-large");
			document.getElementById("barcode-canvas-label-" + targetId).classList.remove("barcode-canvas-label-large");
		}
	});
}

function barcodeSizeToggleListener(barcodeSizeToggle) {
	barcodeSizeToggle.forEach(function (data) {
		var targetId = data.closest(".barcode-container").getAttribute("targetId");
		addBarcodeSizeToggleListener(data, targetId);
	});
}
barcodeSizeToggleListener(barcodeSizeToggle);

function updateLabelFromSelect(data) {
	var targetId = data.closest(".barcode-container").getAttribute("targetId");
	var selectText = data.options[data.selectedIndex].text;
	document.getElementById("barcode-label-" + targetId).value = selectText;
	document.getElementById("barcode-canvas-label-" + targetId).innerHTML = selectText;
}

function addSelectEventListener(data) {
	data.addEventListener('change', (event) => {
		generateBarcode(data);
		updateLabelFromSelect(data);
	});
}

function populateSelect(arr, select, typeValue) {
	select.forEach(function (data) {
		var selectOutput = "";
		var selected = data.getAttribute("default");
		for (var key in arr[typeValue]) {
			selectOutput += '<option value="' + arr[typeValue][key].code + '"';
			if (arr[typeValue][key].name == selected)
				selectOutput += ' selected';
			selectOutput += '>' + arr[typeValue][key].name + '</option>';
		}
		data.innerHTML = selectOutput;
		addSelectEventListener(data);
	});
}
populateSelect(codes, barcodeSelect, "General");

function printBarcodes() {
	var divContents = document.getElementById("output-container").innerHTML;
	var a = window.open('', '', 'height=600, width=600');
	a.document.write('<html><title>Doorstop Barcode Generator - Print</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel = "preconnect" href = "https://fonts.gstatic.com" crossorigin >	<link href="https://fonts.googleapis.com/css2?family=Teko:wght@500&display=swap" rel="stylesheet"><link rel="stylesheet" href="css/print.css?version=0.2" media="all"><body><div id="output-container">');
	a.document.write(divContents);
	a.document.write('</body></html>');
	a.document.close();
	setTimeout(function () { a.print(); }, 400);
}

document.querySelector("#print-barcodes").onclick = function () {
	printBarcodes();
}

document.querySelector("#add-barcode").onclick = function () {
	if (count == max)
		return;

	if (count == min)
		document.querySelector("#remove-barcode").removeAttribute("disabled");

	var inputContainer = document.getElementById("input-container");
	var outputContainer = document.getElementById("output-container");
	var input = document.getElementById("barcode-input-wrapper-1");
	var output = document.getElementById("barcode-canvas-wrapper-1");
	
	count++;

	inputContainer.append(document.createElement("hr"));

	createOutput(count, outputContainer, output);
	createInput(count, inputContainer, input);

	if (!document.getElementById("barcode-input-" + count).disabled)
		generateBarcode(document.getElementById("barcode-input-" + count));
	else if (!document.getElementById("barcode-select-" + count).disabled)
		generateBarcode(document.getElementById("barcode-select-" + count));

	if (count == max)
		document.querySelector("#add-barcode").setAttribute("disabled", "true");
}

document.querySelector("#remove-barcode").onclick = function () {
	if (count == min)
		return;
	
	document.getElementById("barcode-input-wrapper-" + count).remove();
	document.getElementById("barcode-canvas-wrapper-" + count).remove();

	if (count == max)
		document.querySelector("#add-barcode").removeAttribute("disabled");

	count--;

	document.querySelector('#input-container hr:last-child').remove();

	if (count == min)
		document.querySelector("#remove-barcode").setAttribute("disabled", "true");
}

function generateBarcodes(barcodeInput) {
	var barcodeInput = document.querySelectorAll(".barcode-input");
	barcodeInput.forEach(function (data) {
		if (!data.disabled)
			generateBarcode(data);
	});
}

function generateBarcode(data) {
	var targetId = data.closest(".barcode-container").getAttribute("targetId");
	let canvas = document.createElement('canvas');
	try {
		// The return value is the canvas element
		if (targetId != null) {
			bwipjs.toCanvas(canvas, {
				bcid: 'datamatrix',
				text: data.value,
				scaleX: 2,
				height: 10,
				width: 10,
				includetext: false,
				textxalign: 'center',
			});
			document.getElementById("barcode-canvas-" + targetId).src = canvas.toDataURL('image/png');
		}
	} catch (e) {
		console.log(e);
	}
}

document.querySelector("#generate-barcodes").onclick = function () {
	var barcodeInput = document.querySelectorAll(".barcode-input");
	generateBarcodes(barcodeInput);
}

generateBarcodes();