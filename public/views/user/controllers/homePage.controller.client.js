(function() {

    angular
        .module("WebDevMusicApp")
        .run(function($rootScope, $uibModalStack) {
        $uibModalStack.dismissAll();
    })
    .controller("HomePageController",HomePageController);

    function HomePageController ($scope,EventService ,$sce,UserService ,$routeParams ,MusicService,$timeout,playListService,$location) {
        var vm = this;
        vm.searchNearByEvents = searchNearByEvents;
        vm.userId = $routeParams.uid ;
        vm.createplayList = createplayList ;
        vm.deleteplayList = deleteplayList ;
        vm.editProfile = editProfile ;
        vm.error = null;
        vm.getTrsustedURL = getTrsustedURL;


        function init() {
           // searchNearByEvents();
           // searchAllPlaylists();
            getUserDetails ();
            getMusicUpdates();
            findAllPlayList();

        }
        init();

        function getUserDetails() {
            var promise = UserService.findUserById(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    vm.user = result.data;
                    vm.error = null;
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                    vm.error = "Some Error Occurred!! Please try again!";
                });
        }

        function getMusicUpdates() {
            var promise = MusicService.getMusicUpdates();
            promise.success(function (response) {

                if (response.status=='ok') {
                    vm.musicArticles = response.articles;
                    console.log(vm.musicArticles);
                  //  geenerateNewsWidget();
                }else {
                    vm.musicArticles = null;
                }
            }).error(function (err) {
                vm.musicArticles = null;
            });
        }
        function findAllPlayList() {
            var promise = UserService.findAllplayList(vm.userId);
            promise.success(function (user) {
                vm.playLists = user.playList ;
                console.log(vm.playLists);

            })
            promise.error(function (err) {
                console.log("some error occured " + err);
                vm.playLists = null ;
            })
        }

        function editProfile() {
            $location.url("/user/editProfile/"+vm.userId);
        }

        function closeModal() {
            $('.modal').modal('hide');
        }
        function deleteplayList(playList) {
            var promise = playListService.deleteplayList(playList);
            promise.success(function(playList) {
                if(playList){
                    init();
                }
            })
            promise.error(function (err) {
                vm.error = "PlayList Not found";
            })
        }
        
        function createplayList() {
            vm.playlist.playListOwner =  vm.userId;
            var promise = playListService.createplayList(vm.playlist);
            promise.success(function(playlist) {
                if(playlist){
                    closeModal();
                    vm.playlist = {};
                    $timeout(function () {
                        // probably will handle the redirection to the
                        // album default page
                        init();
                    }, 250);
                }
            })
            promise.error(function (err) {
                vm.error = "User Not found";
            })
        }

        function searchNearByEvents() {
            console.log('searchNearByEvents');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var cord = {
                        latitude : position.coords.latitude,
                        longitude : position.coords.longitude
                    };
                    var inputFilter = {
                        cords : cord
                    }
                    callSearchEventService(inputFilter);

                }, function (error) {
                    console.log(error);
                    callSearchEventService(null);
                });
            } else {
                console.log('Geolocation is not supported by this browser.');
                callSearchEventService(null);
                return null;
            }
        }
        function callSearchEventService(inputFilter) {
            var promise =  EventService.searchNearByEvents(inputFilter);
            promise.success(function (response) {
                console.log(response);
                vm.events = response.events;

            }).error(function (error) {
                console.log(error);
            });
        }

        function getTrsustedURL (url) {
           return  $sce.trustAsResourceUrl(url);
        }
    }

})();