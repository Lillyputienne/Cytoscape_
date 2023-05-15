document.getElementById('jpeg').addEventListener('click', function () {
    var elementToDownload = document.getElementById('graph');
    html2canvas(elementToDownload).then(function(canvas) {
      var link = document.createElement('a');
      link.download = 'mon-fichier.jpeg';
      link.href = canvas.toDataURL('image/jpeg',1);
      link.setAttribute('download', 'mon-fichier.jpeg');
      link.click();
    });
});

document.getElementById('png').addEventListener('click', function () {
    var elementToDownload = document.getElementById('graph');
    html2canvas(elementToDownload).then(function(canvas) {
      var link = document.createElement('a');
      link.download = 'mon-fichier.png';
      link.href = canvas.toDataURL('image/png',10);
      link.setAttribute('download', 'mon-fichier.png');
      link.click();
    });
});