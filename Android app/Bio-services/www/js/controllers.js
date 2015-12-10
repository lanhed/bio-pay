angular.module('starter.controllers', ['ionic'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicNavBarDelegate) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  /*$ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
*/

  $scope.doLogout = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('ServicesCtrl', function($scope) {
  $scope.Services = [
    { title: 'Blockchain', id: 7, url: 'blockchainservice', icon: 'ion-social-bitcoin'  },
    { title: 'Url', id: 8, url: 'urlservice', icon: 'ion-earth'},
    { title: 'VCard', id: 9, url: 'vcardservice', icon: 'ion-person-add'},
    { title: 'Empty tag', id: 10, url: 'emptyservice', icon: 'ion-trash-a' },
    { title: 'Twitter', id: 16, url: 'twitterservice', icon: 'ion-social-twitter-outline'},
    { title: 'Skype', id: 11, url: 'skypeservice', icon: 'ion-social-skype-outline'},
    { title: 'Facebook', id: 12, url: 'fbservice', icon: 'ion-social-facebook'},
    { title: 'Google+', id: 13, url: 'googleservice', icon: 'ion-social-googleplus'},
    { title: 'Youtube', id: 14, url: 'youtubeservice', icon: 'ion-social-youtube'},
    { title: 'Linkedin', id: 15, url: 'linkedinservice', icon: 'ion-social-linkedin'},
  ];
})

.controller('ServiceCtrl', function($scope, $stateParams, $state) {
  console.log("stateParams.serviceId");
  switch ($stateParams.serviceId) {
    case '7':
      $state.go('app.blockchain');
      break;
    case '8':
      $state.go('app.urlservice');
      break;
    case '9':
      $state.go('app.vcardservice');
      break;
    case '10':
      $state.go('app.emptyservice');
      break;
    case '11':
      $state.go('app.skypeservice');
      break;
    case '12':
      $state.go('app.fbservice');
      break;
    case '13':
      $state.go('app.googleservice');
      break;
    case '14':
      $state.go('app.youtubeservice');
      break;
    case '15':
      $state.go('app.linkedinservice');
      break;
    case '16':
      $state.go('app.twitterservice');
      break;

  }
})

.controller('EntryCtrl', function ($scope, $state, nfcService, $ionicPopup, $ionicNavBarDelegate) {
  setTimeout(function(){$ionicNavBarDelegate.showBar(false);},10);

    $scope.tag = nfcService.tag;
    $scope.clear = function() {
        nfcService.clearTag();
    };

    //var tagId = $filter('bytesToHexString')(tag.id);
    //console.log(tagId);
/*
    if ($scope.tag.id)
    {
      $state.go('app.account');


    }*/
})


.controller('AccountCtrl', function ($scope, $state, nfcService, $ionicPopup, $ionicNavBarDelegate) {

    $scope.tag = nfcService.tag;
    $scope.clear = function() {
        nfcService.clearTag();
    };

    //var tagId = $filter('bytesToHexString')(tag.id);
    //console.log(tagId);
/*
    if ($scope.tag.id)
    {
      $state.go('app.account');


    }*/
})


.controller('logoutController', function ($scope, nfcService) {

        nfcService.clearTag();
})


.controller('BlockchainController', function($scope, $filter, $state, $ionicHistory, writeDialog, nfcService) {
    $scope.username = '';
    $scope.password = '';

    var publicKey =
      '-----BEGIN PUBLIC KEY-----\n' +
      'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALAuAVkF+BpQtsivA/Cdwn64xEDQxuHB\n' +
      '6zdB5/EVT4B2zeqZu4XO3zX+Ua2M641hGjqG0pcuovraVJLrFu0MFLMCAwEAAQ==\n' +
      '-----END PUBLIC KEY-----';

    var key = new NodeRSA(publicKey);

    $scope.onAddClick = function(username, password) {
      writeData(username, password);
    };

    function writeData(username, password) {
      // var username = $scope.username;
      // var password = $scope.password;


      writeDialog.open(function(tag) {
        var tagId = $filter('bytesToHexString')(tag.id);
        var data = encryptData(username, password, tagId);

        data = 'BTC:' + data;

        console.log(tagId);
        console.log(username, password);
        console.log(data);

        return ndef.textRecord(data);
      }, function(error, success) {
        if (!error) {
          // $state.go('app.entry');
          $ionicHistory.goBack(-2);
        }
      });
    }

    function encryptData(username, password, tagId) {
      var text = tagId + username + ',' + password;
      console.log(text);

      var encrypted = key.encrypt(text, 'base64');

      return encrypted;
    }
})

.controller('UrlServiceController', function($scope, $ionicHistory, $state, writeDialog) {
  $scope.onAddClick = function(url) {
    // writeData(url);
    writeData($('#url').val());
  };

  function writeData(url) {
    writeDialog.open(function(tag) {

      if (url.indexOf('http') === -1) {
        url = 'http://' + url;
      }

      return ndef.uriRecord(url);

    }, function(error, success) {
      if (!error) {
        // $state.go('app.entry');
        $ionicHistory.goBack(-2);
      }
    });
  }
})

.controller('TwitterServiceController', function($scope, $ionicHistory, $state, writeDialog) {
  $scope.onAddClick = function(Tweet) {
    // writeData(url);
    writeData($('#Tweet').val());
  };

  function writeData(url) {
    writeDialog.open(function(tag) {

      if (Tweet.indexOf('Tweet') === -1) {
        url = 'https://twitter.com/intent/follow?user_id=' + Tweet;
      }

      return ndef.uriRecord(url);

    }, function(error, success) {
      if (!error) {
        // $state.go('app.entry');
        $ionicHistory.goBack(-2);
      }
    });
  }
})

.controller('LinkedinServiceController', function($scope, $ionicHistory, $state, writeDialog) {
  $scope.onAddClick = function(Linkedin) {
    // writeData(url);
    writeData($('#LinkedinUser').val());
  };

  function writeData(url) {
    writeDialog.open(function(tag) {

      if (LinkedinUser.indexOf('LinkedinUser') === -1) {
        url = 'linkedin://profile/[' + Tweet + ']';
      }

      return ndef.textRecord(url);

    }, function(error, success) {
      if (!error) {
        // $state.go('app.entry');
        $ionicHistory.goBack(-2);
      }
    });
  }
})

.controller('VCardServiceController', function($scope, $ionicHistory, $state, writeDialog) {
  $scope.onAddClick = function() {
    writeData(
      $('#name').val(),
      $('#phone').val(),
      $('#email').val(),
      $('#website').val()
    );
  };

  function getVCard(name, phone, email, website) {
    var card =
      'BEGIN:VCARD\n' +
      'VERSION:2.1\n' +
      (!!name ? 'FN:' + name + '\n' : '') +
      (!!phone ? 'TEL;WORK:' + phone + '\n' : '') +
      (!!email ? 'EMAIL;WORK:' + email + '\n' : '') +
      (!!website ? 'URL:' + website + '\n' : '') +
      'END:VCARD';

    return card;
  }

  function writeData(name, phone, email, website) {
    writeDialog.open(function(tag) {
      var data = getVCard(name, phone, email, website);
      var record = ndef.mimeMediaRecord('text/x-vCard', nfc.stringToBytes(data));

      return record;
    }, function() {
      if (!error) {
        $ionicHistory.goBack(-2);
      }
    });
  }
})

.controller('EmptyServiceController', function($scope, $ionicHistory, $state, writeDialog) {
  $scope.onEmptyClick = function() {
    writeDialog.open(function(tag) {
      tag.ndefMessage = [];
      return ndef.emptyRecord();
    }, function(error, success) {
      if (!error) {
        // $state.go('app.entry');
        $ionicHistory.goBack(-2);
      }
    });
  };
})

.factory('nfcService', function ($state, $rootScope, $ionicPlatform) {
    var tag = {};

    $ionicPlatform.ready(function() {
        nfc.addNdefListener(function (nfcEvent) {
            console.log(nfcEvent.tag);

            $rootScope.$apply(function(){
                angular.copy(nfcEvent.tag, tag);
            });

            if (nfcEvent.tag.id)
            {
              $state.go('app.account');
            }


        }, function () {
            console.log("Listening for NDEF Tags.");
        }, function (reason) {
            alert("Error adding NFC Listener " + reason);
        });
    });

    function clearTag() {
      $rootScope.$apply(function() {
        angular.copy({}, this.tag);
      });
    }

    function write(record, callback) {
      var tagListener = function(nfcEvent) {
        nfc.removeNdefListener(tagListener);

        var tag = nfcEvent.tag;

        if (typeof record === 'function') {
          record = record(tag);
        }

        var ndefMessage = tag.ndefMessage || [];

        if (ndefMessage.length === 1 && ndefMessage[0].tnf === ndef.TNF_EMPTY) {
          ndefMessage = [];
        }

        // TODO: Check if record already exists

        ndefMessage.push(
          record
        );

        console.log(ndefMessage);

        nfc.write(ndefMessage, function() {
          console.log(arguments);
          clearTag();
          callback(null, 'success');
        }, function() {
          console.error(arguments);
          callback('error', null);
        });
      };

      nfc.addNdefListener(tagListener, function() {
        console.log('Waiting for NDEF tag for writing');
      }, function() {
        console.error('Couldnt attach listener for NDEF tags', arguments);
      });
    }

    return {
        tag: tag,
        write: write,

        clearTag: clearTag
    };
})

.factory('writeDialog', function(nfcService) {

  var markup = '' +
    '<div class="dialog">' +
      '<h2 class="header">Write to tag</h2>' +
      '<div class="error">Error when writing</div>' +
      '<div class="success">Success writing</div>' +
    '</div>';

  var $dialog = $(markup);

  return {
    open: function(message, callback) {
      $('body').append($dialog);
      $dialog.find('.error, .success').hide();

      nfcService.write(message, function(error, success) {
        if (error) {
          $dialog.find('.error').show();
        } else {
          $dialog.find('.success').show();
        }

        setTimeout(function() {
          $dialog.remove();
          callback(error, success);
        }, 2000);
      });
    }
  }
});
