(function() {

    angular
        .module("WebDevMusicApp")
        .controller("EventOrgController",EventOrgController);

    function EventOrgController ($location,EventService,currentUser,UserService ,$routeParams,StaticDataService ,$timeout) {

        var vm = this;
        vm.userId = currentUser._id;
        vm.error = null;
        vm.success = null;
        vm.events = null;
        vm.noEventsFound = null;
        vm.editMode = false;
        vm.deleteEvent = deleteEvent;
        vm.createNewEvent = createNewEvent;
        vm.closeModal = closeModal;
        vm.editEvent = editEvent;
        vm.updateEvent = updateEvent;
        vm.createMode = createMode;
        vm.selectEventToDelete = selectEventToDelete;
        vm.logout = logout ;
        function init() {

            getUserDetails ();
            getAllEventsOfUser();

        }
        init();

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/landingPage');
                });
        }

        function deleteEvent() {

            if (vm.event) {
                var promise = EventService.deleteEvent(vm.event);
                promise.success(function (response) {
                        if (response && response==='OK') {
                            vm.success = "Event deleted successfully";
                            vm.error= null;
                            $timeout(function () {
                                closeModal();
                                vm.success = null;
                                getAllEventsOfUser ();
                            }, 550);
                        }
                        else {
                        vm.error= "Some error occurred";
                        vm.success = null;
                    }
                }).error(function (err) {
                    vm.error = "Some Error Occurred!!";
                });
            }
            else {
                vm.error = "Some Error Occurred";
            }
        }

        function selectEventToDelete(selectedEvent) {
            vm.event = angular.copy(selectedEvent);
            vm.event.startDate = new Date(vm.event.startDate);
            vm.event.endDate = new Date(vm.event.endDate);
        }
        function closeModal() {
            vm.error = null;
            vm.success = null;
            vm.noEventsFound = null;
            vm.event = null;
            $('.modal').modal('hide');
        }

        function editEvent (selectedEvent) {
            vm.editMode = true;
            vm.event = angular.copy(selectedEvent);
            vm.event.startDate = new Date(vm.event.startDate);
            vm.event.endDate = new Date(vm.event.endDate);

        }
        function createMode (selectedEvent) {
            vm.editMode = false;


        }
        function updateEvent() {
            if (vm.event) {

                var startDate = new Date(vm.event.startDate);
                var endDate   = new Date(vm.event.endDate);
                var today = new Date();
                console.log(startDate < today);

                if (startDate > endDate){
                    vm.error= 'Start Date cannot occur after end Date';
                    return;
                }
                else if (startDate < today || endDate < today) {
                    vm.error= "Start date or End Date cannot be before Current Date";
                    return;
                }
                var promise = EventService.updateEvent(vm.event);
                promise.success(function (response) {
                    if (response) {
                        if (response.status === "OK" && response.data) {
                            vm.success = "Event updated successfully";
                            vm.error= null;

                            $timeout(function () {
                                closeModal();
                                getAllEventsOfUser ();
                            }, 550);
                        }
                        else {
                            if (response.description) {
                                vm.error= response.description;
                            }else {
                                vm.error = "Some error occurred";
                            }
                            vm.success = null;
                        }
                    }
                    else {
                        vm.error= "Some error occurred";
                        vm.success = null;
                    }
                }).error(function (err) {
                    vm.error = "Some Error Occurred!!";
                });;
            }
            else {
                vm.error = "Some Error Occurred";
            }
        }

        function createNewEvent() {

            if (vm.event) {
                var startDate = new Date(vm.event.startDate);
                var endDate   = new Date(vm.event.endDate);
                var today = new Date();
                console.log(startDate < today);

                if (startDate > endDate){
                    vm.error= 'Start Date cannot occur after end Date';
                    return;
                }
                else if (startDate < today || endDate < today) {
                    vm.error= "Start date or End Date cannot be before Current Date";
                    return;
                }
                    //call create Service
                    var promise = EventService.createEvent(vm.event,vm.userId);
                    promise.success(function (response) {
                        if (response) {
                            if (response.status === "OK") {
                                vm.success = "Event created successfully";
                                vm.error= null;


                                $timeout(function () {
                                    closeModal();
                                    getAllEventsOfUser ();
                                }, 550);
                            }
                            else {
                                vm.error= response.description;
                                vm.success = null;
                            }
                        }
                        else {
                            vm.error= "Some error occurred";
                            vm.success = null;
                        }
                    }).error(function (err) {
                        vm.error = "Some Error Occurred!!";
                    });


            }
            else {
                vm.error = "Some Error Occurred";
            }
        }

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

        function getAllEventsOfUser () {

            var promise = EventService.getAllEventsOfUser(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    vm.events = result.data;
                    vm.noEventsFound = null;
                    console.log(vm.events);

                } else {
                    if (result.status==='KO') {
                        if (result.description) {
                            vm.noEventsFound = result.description;
                        } else {
                            vm.noEventsFound = "Some Error Occurred!!";
                        }
                    }
                    else {
                        vm.noEventsFound = "Some Error Occurred!!";
                    }

                }

            }).error(function () {
                vm.noEventsFound = "Some Error Occurred!!";
            });
        }



    }

})();