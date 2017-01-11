(function () {
  function setUpListeners($dropZone, $file, cb) {
    // Sets up the listeners

    // Listeners
    function handleFileSelect(evt) {
      var files = evt.target.files;
      var file = files[0];
      readFile(file, cb);
    }

    function handleFileSelectDrop(evt) {
      evt.preventDefault();
      var files = evt.dataTransfer.files;
      var file = files[0];
      readFile(file, cb);
    }

    function readFile(file, cb) {
      var reader = new FileReader();
      reader.onload = function (event) {
	cb(event.target.result);
      };
      reader.readAsText(file);
    }

    function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    // End Listeners

    $file.addEventListener('change', handleFileSelect, false);
    $dropZone.addEventListener('dragover', handleDragOver, false);
    $dropZone.addEventListener('drop', handleFileSelectDrop, false);
  }

  function createDropZone($element, cb) {
    if (!($element instanceof HTMLElement)) {
      throw (new Error("Please pass in the DOM object. Are you passing in the jQuery object instead?"));
    }
    var $dropZone = document.createElement('div');
    var $file = document.createElement('input');
    $file.type = 'file';

    $dropZone.class = "drop-zone";
    $file.class = "file";

    $dropZone.appendChild($file);
    $element.appendChild($dropZone); 

    setUpListeners($dropZone, $file, cb);

    return $dropZone;
  }

  function makeDropZone($dropZone, cb) {
    $dropZone.class = "drop-zone";
    setUpListeners($dropZone, $dropZone, cb);
  }

  // Expose the createDropZone method

  window.createDropZone = createDropZone;
  window.makeDropZone = makeDropZone;

})();

/*

-------------
EXAMPLE USAGE
--------------
createDropZone(document.querySelector('body'), function (data) {
  console.log(data);
});

*/

