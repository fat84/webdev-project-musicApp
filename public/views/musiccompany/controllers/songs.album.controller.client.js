/**
 * Created by sumitbhanwala on 4/2/17.
 */
(function() {

    angular
        .module("WebDevMusicApp")
        .controller("SongsInAlbums",SongsInAlbums);

    function SongsInAlbums($location,Upload,$timeout,MusicService,$sce,EmailService,$scope) {
        var vm = this;
        vm.songs = [
            {
                title:"Love the way you lie1",
                createdOn:Date.now(),
                Singer : "random1",
                Genre : "random1"
            },
            {
                title:"Love the way you lie1",
                createdOn:Date.now(),
                Singer : "random2",
                Genre : "random3"
            },
            {
                title:"Love the way you lie1",
                createdOn:Date.now(),
                Singer : "random3",
                Genre : "random1d"
            }
        ];
        function init() {
        }
        init();
        // title : vm.song.title,
        //     singer : vm.song.singer,
        //     genre : vm.song.genre,
         vm.sendtoserver = function () {
                Upload.upload({
                    url: '/api/musicCompany/uploadSong', // web api which will handle the data
                    data:{
                        title : vm.song.title,
                        singer : vm.song.singer,
                        genre : vm.song.genre,
                        file:vm.file
                    } //pass file as data, should be user ng-model
                }).then(function (resp) { //upload function returns a promise
                    console.log(resp.data);
                    var data = JSON.parse(resp.data);
                    vm.music = data.metadata.music;
                }, function (resp) { //catch error
                    console.log(resp);
                }, function (evt) {

                });
        }
    }
})();