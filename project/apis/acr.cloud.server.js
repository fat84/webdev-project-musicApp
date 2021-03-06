module.exports = function () {

    var api = {
        findMusicFingerPrint : findMusicFingerPrint
    };

    var q = require('q');
    var url = require('url');
    var fs = require('fs');
    var crypto = require('crypto');
    var request = require('request');


    var defaultOptions = {
        host: 'us-west-2.api.acrcloud.com',
        endpoint: '/v1/identify',
        signature_version: '1',
        data_type:'audio',
        secure: true,
        access_key: process.env.ACR_ACCESS_KEY,
        access_secret: process.env.ACR_ACCESS_SECRET
    };

    function buildStringToSign(method, uri, accessKey, dataType, signatureVersion, timestamp) {
        return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n');
    }

    function sign(signString, accessSecret) {
        return crypto.createHmac('sha1', accessSecret)
            .update(new Buffer(signString, 'utf-8'))
            .digest().toString('base64');
    }

    function identify(data, options, cb) {

        var current_data = new Date();
        var timestamp = current_data.getTime()/1000;

        var stringToSign = buildStringToSign('POST',
            options.endpoint,
            options.access_key,
            options.data_type,
            options.signature_version,
            timestamp);

        var signature = sign(stringToSign, options.access_secret);

        var formData = {
            sample: data,
            access_key:options.access_key,
            data_type:options.data_type,
            signature_version:options.signature_version,
            signature:signature,
            sample_bytes:data.length,
            timestamp:timestamp,
        }
        request.post({
            url: "http://"+ options.host + options.endpoint,
            method: 'POST',
            formData: formData
        }, cb);
    }
    return api;


    function findMusicFingerPrint (musicObject) {
       // var bitmap = fs.readFileSync('./sample_bad.wav')
        var defered = q.defer();
        identify(new Buffer(musicObject), defaultOptions, function (err, httpResponse, body) {
            if (err)
            {
                console.log(err);
                defered.reject({status:"KO",description:"Oh Ooh!! Music not Recognised. Try again by keeping the Mic close to the Music!"});
            }
            else {
                body = JSON.parse(body);
                console.log(body);

                if (body.status!==null && body.status.code!==null && body.status.code == 0) {
                    //Found a Match
                    if (body.metadata && body.metadata.music && body.metadata.music.length != 0) {

                        var musicObject = body.metadata.music[0];

                        if (musicObject.external_metadata
                            && musicObject.external_metadata.spotify
                            && musicObject.external_metadata.spotify.track
                            && musicObject.external_metadata.spotify.track.id) {
                            var spotifyTrackId = musicObject.external_metadata.spotify.track.id;
                            defered.resolve(spotifyTrackId);
                        }
                        else {
                            defered.reject({status:"KO",description:"Oh Ooh!! Music not Recognised. Try again by keeping the Mic close to the Music!"});
                        }


                    }
                    else {
                        defered.reject({status:"KO",description:"Oh Ooh!! Music not Recognised. Try again by keeping the Mic close to the Music!"});
                    }
                }
                else {
                    defered.reject({status:"KO",description:"Oh Ooh!! Music not Recognised. Try again by keeping the Mic close to the Music!"});
                }

            }
        });
        return defered.promise;
    }
}