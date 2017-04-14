/**
 * Created by sumitbhanwala on 4/9/17.
 */
module.exports = function (app ,listOfModel) {


    app.post("/api/playList" ,createplayList);
    app.get("/api/user/playList/song/:pid",findPlayListById);
    app.delete("/api/playList/:pid" ,deleteplayList);
    app.get("/api/playList/new/:songid/:pid" ,addSongToPlayList);
    app.delete("/api/user/playlist/song/:playListId/:songId" ,deleteSongFromPlayList);
    
    var albumModel = listOfModel.albumModel;
    var userModel = listOfModel.UserModel;
    var songModel = listOfModel.songModel;
    var playListModel = listOfModel.playListModel;


    function deleteSongFromPlayList (req ,res) {
        var playListId = req.params.playListId;
        var songId = req.params.songId ;
        var response = {};
        playListModel
            .deleteSong(songId ,playListId)
            .then(function() {
                response.status = "OK";
                response.data = playList;
                res.send(response);
            }, function (error) {
                response.status="KO";
                response.description="Some error occurred while deletion of song!!";
                res.json(response);
            });
    }

    function addSongToPlayList(req ,res) {
        var songId = req.params.songid ;
        var pid  = req.params.pid;
        var response = {};
        playListModel.addSongtoPlaylist(songId ,pid)
            .then(function(playList) {
                response.status = "OK";
                response.data = playList;
                res.send(response);
            }, function (error) {
                response.status="KO";
                response.description="Some error occurred while addition of song!!";
                res.json(response);
            });
    }

    function createplayList(req,res) {
        var playList = req.body;
        var response = {};
        playListModel.createplayList(playList)
            .then(function(newplayList) {
                return userModel.addplayList(newplayList);
            })
            .then(function (updatedUser) {
                if (updatedUser) {
                    response.status ="OK";
                }
                else {
                    response.status ="KO";
                }
                res.json(response);
            },function (err) {
                response.status ="KO";
                res.json(response);
            })
    }

    function findPlayListById(req,res) {
        var response = {};
        var playListId = req.params.pid;
        playListModel
            .findplayListById(playListId)
            .then(function (playList) {
                response.status = "OK";
                response.data = playList;
                res.send(response);
            },function (err) {
                response.status="KO";
                response.description="Some error occurred!!";
                res.json(response);
            });
    }


    function deleteplayList(req,res) {
        console.log("inside the server side");
        var playListId = req.params.pid;
        playListModel.deleteplayList(playListId)
            .then(function (playList) {
                var userId = playList.playListOwner ;
                    userModel.deleteplayList(userId ,playListId)
                    .then(function (user) {
                        res.send(user);
                    },function (err) {
                        res.send(err);
                    });
            },function (err) {
              res.send(err);
            });
    }
}