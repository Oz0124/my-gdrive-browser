/* global MyLib */

var MyLib = MyLib || {};

MyLib.GDriveBrowser = (function() {

	// Your Client ID can be retrieved from your project in the Google
    // Developer Console, https://console.developers.google.com
    // var CLIENT_ID = 'your google drive api Client id';
    var CLIENT_ID = '398030873994-a5llde5b923ahktl54iv0r36lhk34en1.apps.googleusercontent.com';

    var SCOPES = ['https://www.googleapis.com/auth/drive'];

    /**
      * Check if current user has authorized this application.
      */
    var _checkAuth = function (callback) {
    	gapi.auth.authorize({
            client_id: CLIENT_ID,
            scope: SCOPES,
            immediate: true
        }, callback);

    }

    /**
      * Initiate auth flow in response to user clicking authorize button.
      *
      * @param {Event} event Button click event.
      */
    var _handleAuthClick = function (callback) {

        gapi.auth.authorize(
          	{client_id: CLIENT_ID, scope: SCOPES, immediate: false},
          	callback);
        return false;
    }

    /**
      * Load Drive API client library.
      */
    var _loadDriveApi = function (callback) {
        return gapi.client.load('drive', 'v2', callback);
    }

    /**
      * Print files.
      */
    var _listFiles = function (parameters, callback) {
    	var request = gapi.client.request({
	        'path': '/drive/v2/files',
	        'method': 'GET',
	        'params': parameters
	    });
        //var request = window.gapi.client.drive.files.list(Parameters);
        request.execute(callback);
    }

    /**
      *
      */
    var _getUserInfo = function (callback) {
        gapi.client.load('drive', 'v2', function() {
            var fields = "name,user";
            var request = gapi.client.drive.about.get();
            request.execute(callback);
        });
    }

    // 
    var _loadRootFolders = function (callback) {

        var request = gapi.client.drive.about.get();
        request.execute(function(resp) {
            gapi.client.load('drive', 'v2', function() {
                var query = "'" + resp.rootFolderId + "' in parents and trashed != true";
                var fields = "items(explicitlyTrashed,ownerNames,lastModifyingUserName,modifiedDate,webContentLink,alternateLink,fileExtension,fileSize,iconLink,id,imageMediaMetadata,indexableText,mimeType,thumbnailLink,title)";
                var request = gapi.client.drive.files.list({q: query, fields: fields});
                request.execute(callback);
            });
        });      
    }
    
    var _loadSubFolders = function (folderId ,callback) {

        var request = gapi.client.drive.about.get();
        request.execute(function(resp) {
            gapi.client.load('drive', 'v2', function() {
                var query = "'" + folderId + "' in parents and trashed != true";
                var fields = "items(explicitlyTrashed,ownerNames,lastModifyingUserName,modifiedDate,webContentLink,alternateLink,fileExtension,fileSize,iconLink,id,imageMediaMetadata,indexableText,mimeType,thumbnailLink,title)";
                var request = gapi.client.drive.files.list({q: query, fields: fields});
                request.execute(callback);
            });
        });      
    }

    var _loadShareWithMeFolders = function (callback) {

        var request = gapi.client.drive.about.get();
        request.execute(function(resp) {
            gapi.client.load('drive', 'v2', function() {
                var query = "sharedWithMe = true";
                var fields = "items(sharedWithMeDate,explicitlyTrashed,ownerNames,lastModifyingUserName,modifiedDate,webContentLink,alternateLink,fileExtension,fileSize,iconLink,id,imageMediaMetadata,indexableText,mimeType,thumbnailLink,title)";
                var request = gapi.client.drive.files.list({q: query, fields: fields});
                request.execute(callback);
            });
        });      
    }

    var _loadTrashedFiles = function (callback) {
        var request = gapi.client.drive.about.get();
        request.execute(function(resp) {
            gapi.client.load('drive', 'v2', function() {
                var query = "trashed = true";
                var fields = "items(sharedWithMeDate,explicitlyTrashed,ownerNames,lastModifyingUserName,modifiedDate,webContentLink,alternateLink,fileExtension,fileSize,iconLink,id,imageMediaMetadata,indexableText,mimeType,thumbnailLink,title)";
                var request = gapi.client.drive.files.list({q: query, fields: fields});
                request.execute(callback);
            });
        });      
    }
             
    var _getRootFolderId = function (callback) {
        var request = gapi.client.drive.about.get();
        request.execute(function(resp) {
            callback(resp);
        });
    }

    // 
    var _deleteFile = function (fileId, callback) {
        var request = gapi.client.drive.files.delete({
            'fileId': fileId
        });
        request.execute(callback);
    }

    /**
      * Move a file or folder to the trash.
      *
      * @param {String} fileId ID of the file to trash.
      */
    var _trashFile = function (fileId, callback) {
        var request = gapi.client.drive.files.trash({
            'fileId': fileId
        });
        request.execute(callback);
    }
    
    /**
     * Restore a file from the trash.
     *
     * @param {String} fileId ID of the file to restore.
     */
    var _restoreFile = function (fileId, callback) {
        var request = gapi.client.drive.files.untrash({
            'fileId': fileId
        });
        request.execute(callback);
    }

    /**
     * Update an existing file's and folder's metadata and content.
     * 
     * 
     * @param {String} fileId ID of the file to update.
     * @param {Object} fileMetadata existing Drive file's metadata.
     * @param {File} fileData File object to read data from.
     * @param {Function} callback Callback function to call when the request is complete.
     */
    var _updateFile = function (fileId, fileMetadata, fileData, callback) {
      
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        var reader = new FileReader();
        reader.readAsBinaryString(fileData);
        reader.onload = function(e) {
            var contentType = fileData.type || 'application/octet-stream';
            // Updating the metadata is optional and you can instead use the value from drive.files.get.
            var base64Data = btoa(reader.result);
            var multipartRequestBody =
                delimiter +
                'Content-Type: application/json\r\n\r\n' +
                JSON.stringify(fileMetadata) +
                delimiter +
                'Content-Type: ' + contentType + '\r\n' +
                'Content-Transfer-Encoding: base64\r\n' +
                '\r\n' +
                base64Data +
                close_delim;

            var request = gapi.client.request({
                'path': '/upload/drive/v2/files/' + fileId,
                'method': 'PUT',
                'params': {'uploadType': 'multipart', 'alt': 'json'},
                'headers': {
                  'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
                },
                'body': multipartRequestBody});
            if (!callback) {
              callback = function(file) {
                console.log(file)
              };
            }
            request.execute(callback);
        }
    }

    /**
     * Update an existing file's and folder's metadata without content.
     *
     * @param {String} fileId ID of the file to update.
     * @param {Object} fileMetadata existing Drive file's metadata.
     * @param {Function} callback Callback function to call when the request is complete.
     */
    var _updateFileMetadata = function (fileId, fileMetadata, callback) {
      
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        var contentType = fileMetadata.mimeType || 'application/octet-stream';
        // Updating the metadata is optional and you can instead use the value from drive.files.get.
        var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(fileMetadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            "" +
            close_delim;

        var request = gapi.client.request({
            'path': '/upload/drive/v2/files/' + fileId,
            'method': 'PUT',
            'params': {'uploadType': 'multipart', 'alt': 'json'},
            'headers': {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody});
        if (!callback) {
            callback = function(file) {
                console.log(file)
            };
        }
        request.execute(callback);
      
    }

    /**
     * Insert a file into a folder.
     *
     * @param {String} folderId ID of the folder to insert the file into.
     * @param {String} fileId ID of the file to insert.
     */
    var _insertFileIntoFolder = function (folderId, fileName, callback) {
        data = new Object();
        data.title = fileName;
        data.parents = [{"id": folderId}];
        data.mimeType = "application/vnd.google-apps.folder";
        gapi.client.drive.files.insert({'resource': data}).execute(callback);
    }

    /**
     * Insert new file.
     *
     * @param {File} fileData File object to read data from.
     * @param {Function} callback Function to call when the request is complete.
     */
    var _insertFile = function (folderId, fileData, callback) {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        var reader = new FileReader();
        reader.readAsBinaryString(fileData);
        reader.onload = function(e) {
            var contentType = fileData.type || 'application/octet-stream';
            var metadata = {
              'title': fileData.name,
              'mimeType': contentType,
              'parents': [{
                id: folderId
              }]
            };

            var base64Data = btoa(reader.result);
            var multipartRequestBody =
                delimiter +
                'Content-Type: application/json\r\n\r\n' +
                JSON.stringify(metadata) +
                delimiter +
                'Content-Type: ' + contentType + '\r\n' +
                'Content-Transfer-Encoding: base64\r\n' +
                '\r\n' +
                base64Data +
                close_delim;

            var request = gapi.client.request({
                'path': '/upload/drive/v2/files',
                'method': 'POST',
                'params': {'uploadType': 'multipart'},
                'headers': {
                  'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
                },
                'body': multipartRequestBody});
            if (!callback) {
                callback = function(file) {
                    console.log(file)
                };
            }
            request.execute(callback);
        }
    }
          
    return {
		checkAuth: _checkAuth,
		handleAuthClick: _handleAuthClick,
		loadDriveApi: _loadDriveApi,
		listFiles: _listFiles,
        getUserInfo: _getUserInfo,
        loadSubFolders: _loadSubFolders,
        loadRootFolders: _loadRootFolders,
        getRootFolderId: _getRootFolderId,
        loadShareWithMeFolders: _loadShareWithMeFolders,
        deleteFile: _deleteFile,
        trashFile: _trashFile,
        updateFile: _updateFile,
        insertFile: _insertFile,
        updateFileMetadata: _updateFileMetadata,
        loadTrashedFiles: _loadTrashedFiles,
        restoreFile: _restoreFile,
        insertFileIntoFolder: _insertFileIntoFolder
	};

}());

function onload () {
  
}