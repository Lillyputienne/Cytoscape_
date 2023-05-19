// Creation of variables for the different parameters given by the user.
var file_name = '';
document.querySelector('#json_input_file').addEventListener('input',function() {
  file_name = this.files[0].name.split(".")[0];
});

var log_ratio = '';
document.querySelector('#log_ratio').addEventListener('input', function() {
  log_ratio = this.value;
});

var p_value = '';
document.querySelector('#p_values').addEventListener('input', function() {
  p_value = this.value;
});

var abundance = '';
document.querySelector('#abundance').addEventListener('input', function() {
  abundance = this.value;  
});

var algo = '';
document.querySelector('#algorithm').addEventListener('input',function() {
  algo = this.value;
})


// JPEG Download
document.getElementById('jpeg').addEventListener('click', function () {
  var download_name = `${file_name}_${p_value}_${log_ratio}_${abundance}_${algo}.jpeg`;
  var elementToDownload = document.getElementById('graph');
  html2canvas(elementToDownload).then(function(canvas) {
    var link = document.createElement('a');
    link.download = download_name;
    link.href = canvas.toDataURL('image/jpeg',1);
    link.setAttribute('download', download_name);
    link.click();
  });
});

// PNG Download
document.getElementById('png').addEventListener('click', function () {
  var download_name = `${file_name}_${p_value}_${log_ratio}_${abundance}_${algo}.png`;
  var elementToDownload = document.getElementById('graph');
  html2canvas(elementToDownload).then(function(canvas) {
    var link = document.createElement('a');
    link.download = download_name;
    link.href = canvas.toDataURL('image/png',10);
    link.setAttribute('download', download_name);
    link.click();
  });
});

// JSON Download
document.getElementById('json').addEventListener('click', function () {
  var cy = window.cy;
  var download_name = `${file_name}_${p_value}_${log_ratio}_${abundance}_${algo}.json`

  if (cy) {
    var cyjs = cy.json();
    var cyjs_string = JSON.stringify(cyjs);
    const a = document.createElement("a");
    const file = new Blob([cyjs_string], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = download_name;
    a.click();
  }
});