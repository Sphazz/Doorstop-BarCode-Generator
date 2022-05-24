const barcodeInput = document.querySelectorAll(".barcode-input");
const barcodeSelect = document.querySelectorAll(".barcode-select");
const barcodeLabel = document.querySelectorAll(".barcode-label");
const barcodeInputToggle = document.querySelectorAll(".barcode-input-checkbox");
const barcodeSizeToggle = document.querySelectorAll(".barcode-size-checkbox");

const codes = getCodes();

function updateBarcodeLabel(data) {
	var targetId = data.getAttribute("targetId");
	document.getElementById("barcode-canvas-label-" + targetId).innerHTML = data.value;
}

function barcodeInputLabelListener() {
	barcodeLabel.forEach(function (data) {
		data.addEventListener('input', function () {
			updateBarcodeLabel(data);
		});
	});
}
barcodeInputLabelListener(barcodeLabel);

function barcodeInputToggleListener(barcodeInputToggle) {
	barcodeInputToggle.forEach(function (data) {
		var targetId = data.getAttribute("targetId");
		data.addEventListener('change', (event) => {
			if (data.checked) {
				document.getElementById("barcode-input-" + targetId).removeAttribute("disabled");
				document.getElementById("barcode-select-" + targetId).setAttribute("disabled", "true");
			} else {
				document.getElementById("barcode-select-" + targetId).removeAttribute("disabled");
				document.getElementById("barcode-input-" + targetId).setAttribute("disabled", "true");
			}
		});
	});
}
barcodeInputToggleListener(barcodeInputToggle);

function barcodeSizeToggleListener(barcodeSizeToggle) {
	barcodeSizeToggle.forEach(function (data) {
		var targetId = data.getAttribute("targetId");
		data.addEventListener('change', (event) => {
			if (data.checked) {
				document.getElementById("barcode-canvas-" + targetId).classList.add("barcode-canvas-large");
				document.getElementById("barcode-canvas-label-" + targetId).classList.add("barcode-canvas-label-large");
			} else {
				document.getElementById("barcode-canvas-" + targetId).classList.remove("barcode-canvas-large");
				document.getElementById("barcode-canvas-label-" + targetId).classList.remove("barcode-canvas-label-large");
			}
		});
	});
}
barcodeSizeToggleListener(barcodeSizeToggle);

function updateLabelFromSelect(data) {
	var targetId = data.getAttribute("targetId");
	var selectText = data.options[data.selectedIndex].text;
	document.getElementById("barcode-label-" + targetId).value = selectText;
	document.getElementById("barcode-canvas-label-" + targetId).innerHTML = selectText;
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
		data.addEventListener('change', (event) => {
			generateBarcode(data);
			updateLabelFromSelect(data);
		});
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

function generateBarcodes(barcodeInput) {
	barcodeInput.forEach(function (data) {
		if (!data.disabled)
			generateBarcode(data);
	});
}

function generateBarcode(data) {
	var targetId = data.getAttribute("targetId");
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
	generateBarcodes(barcodeInput);
}

generateBarcodes(barcodeInput);