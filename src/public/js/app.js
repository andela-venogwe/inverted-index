const app = angular.module('Index', ['ngMaterial', 'ngMdIcons']);
const appIndex = new utils();
const uploaded = [];
const fileNames = [];
const inputArea = document.getElementById('upload-input');
const selectArea  = document.getElementById('selected-files');
const uploadButton = document.getElementById('upload');
const uploadDone = document.getElementById('upload-done');
const uploadFailed = document.getElementById('upload-failed');
const uploadProgress = document.getElementById('progress');
const cheating = document.getElementById('cheating');

app.controller('InvertedIndexController', invertedIndexController);

function invertedIndexController($scope, $mdSidenav, $mdDialog, $mdToast, $document) {
  $scope.toggleLeft = buildToggler('left');
  $scope.customFullscreen = false;
  $scope.isOpenRight = openRight;
  $scope.showUploadBox = uploadBox;
  $scope.closeDialog = dialogClose;
  $scope.select = selectJson;
  $scope.fileSelect = jsonChoose;
  $scope.upload = uploadJson;
  $scope.menu = uploaded;
  $scope.createIndex = createIndex;
  $scope.reference = appIndex.reference;
  $scope.uploadedFileContents = appIndex.docFiles;
  $scope.search = searchIndex;
  $scope.currentDocs = [];
  $scope.autoComplete = autoComplete;
  
  

  // menu toggler
  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    }
  }
  
  // check open menu on page load
  function openRight(){
      return $mdSidenav('right').isOpen();
  };

  // upload file dialog box
  function uploadBox($event) {
    $mdDialog.show({
      contentElement: '#myDialog',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose: false,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    });
    uploadButton.disabled = true;
  };

  // close dialog box
  function dialogClose() {
    selectArea.innerHTML = '';
    inputArea.value = '';
    uploadButton.disabled = true
    uploadDone.style.display = 'none';
    uploadFailed.style.display = 'none';
    $mdDialog.hide();
  };
  
  // select json files for upload
  function selectJson(){
    inputArea.click();
    uploadButton.disabled = true;
    uploadDone.style.display = 'none';
    uploadFailed.style.display = 'none';
  }

  //monitor input change
  function jsonChoose(){
    let validity = [];
    cheating.style.display = 'none';
    $scope.files = inputArea.files;
    $scope.fileKeys = Object.keys($scope.files).filter(function(key){
      return key !== 'length';
    });
    
    // document.getElementById('selected-files').innerHTML = '';
    $scope.filesSelected = $scope.fileKeys.map(function(file) {
      return $scope.files[file]['name'];
    });
    
    selectArea.innerHTML = '';
    new Promise((resolve, reject) => {
      $scope.filesSelected.forEach((item, index) => {
        let fileSize = $scope.files[index]['size'];
        let color = '';
        let message = '';
        item.endsWith('.json') ? 
        (fileSize > 0 ? 
          (fileNames.indexOf(item) !== -1 ? 
            (color = 'bad', message = 'file already uploaded') :
            (color = 'good', message = 'valid file')
          )
           : 
          (color = 'bad', message = 'empty json file')
        ) :
        (fileSize > 0 ? 
          (color = 'bad', message = 'invalid file')
          :
          (color = 'bad', message = 'empty invalid file')
        );
        validity.push(message);
        fileNames.push(item);
        uploadButton.disabled = true;
        selectArea.innerHTML += `<md-list-item><p> ${item} 
        <span class="message ${color}"> ${message}</span></p></md-list-item>`;
        console.log(fileNames);
      });
      resolve(validity);
    }).then(() => {
      console.log(validity)
      if (validity.indexOf('invalid file') != -1 || 
        validity.indexOf('empty invalid file') != -1 ||
        validity.indexOf('empty json file') != -1 || 
        validity.indexOf('file already uploaded') != -1) {
        $scope.canUpload = false;
        selectArea.innerHTML += `<p style="text-align: center; color: #3004e0">
        please select non-empty JSON file(s)</p>`;
      } else {
        uploadButton.disabled = false;
        $scope.canUpload = true;
      }
    });
  }

  // upload json file(s) function
  function uploadJson(e){
    if($scope.canUpload ){
      uploadButton.disabled = true;
      // create a FormData object which will be sent as the data payload in the
      // AJAX request
      const files = $(this).get(0).files;
      const formData = new FormData();

      // loop through all the selected files and add them to the formData object
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // add the files to formData object for the data payload
        formData.append('uploads[]', file, file.name);
      }

      // do ajax file upload
      $.ajax({
        url: '/upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        data: formData,
        enctype: 'multipart/form-data',
        success: function(data){
          setTimeout(() => {
            $scope.isLoading = false;
            uploadProgress.style.display = 'none';
            uploadDone.style.display = 'block';
            $scope.toggleLeft();
            $scope.canUpload = false;
          }, 5000);
          
          for (file of files){
            uploaded.push({
              title: file['name'],
              icon: 'cloud_done',
              getindex: 'GET INDEX',
              createindex: 'CREATE INDEX',
            });
          }
          inputArea.value = '';
          selectArea.innerHTML = '';
        },
        xhr: function() {
          // create an XMLHttpRequest
          const xhr = new XMLHttpRequest();
          $scope.isLoading = true;
          return xhr;
        }
      });
    }
    else {
      inputArea.value = '';
      selectArea.innerHTML = '';
      cheating.style.display = 'block';
    }
  } // end upload
   
  // show message on create index or get index
  const showMessage = (messageType) => {
    let message = '';
    messageType == 'get' ? (message = 'View Populated with index!') :
    (message = 'Index Has Been Created!');
    $mdToast.show(
      $mdToast.simple()
        .textContent(message)
        .position('left')
        .hideDelay(3000)
    );
  };

  // show get index message
  $scope.showGetIndexMessage = showMessage;

  // show create index message
  $scope.showCreateIndexMessage = showMessage;

  //create index function
  function createIndex(b){
    const docName = utils.formatFileName(b);
    appIndex.createIndex(b);
    setTimeout(() => {
      $scope.title = docName;
      $scope.headers = Object.keys(appIndex.docFiles[docName]);
      $scope.words = appIndex.reference[docName];
      $scope.currentDocs.push(docName);
      $scope.autocompleteOptions = appIndex.words;
    }, 100)
  }  

  //search index function
  function searchIndex(b){
    $scope.searchResults = appIndex.searchIndex(b);
  } 
  
  // autocomplete search input
  function autoComplete(string){
    $scope.hidethis = false;
    const output = [];
    angular.forEach($scope.autocompleteOptions, (word) => {
      if(word.toLowerCase().indexOf(string.toLowerCase()) >= 0){  
        output.push(word);  
      } 
    });
    $scope.filterWords = output; 
    $scope.fillTextbox = function(string){  
      $scope.word = string;  
      $scope.hidethis = true;  
    } 
  }
}

function themeMaterial($mdThemingProvider) {
  var customBlueMap =     $mdThemingProvider.extendPalette('light-blue', {
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50'],
    '500': 'rgb(16,108,200)',
    '50': 'ffffff'
  });
  $mdThemingProvider.definePalette('customBlue', customBlueMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('customBlue', {
      'default': '500',
      'hue-1': '50'
    })
    .accentPalette('pink');
  $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
}

app.config(themeMaterial);