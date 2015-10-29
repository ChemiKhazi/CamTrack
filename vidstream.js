var $VidStream = {
    video: null,
    canvas: null,
    context: null,
    texture: null,
    currentStream: -1,
    sizeH: 600,
    init: function(){
        // console.log("Init Video Stream");
        $VidStream.video = document.querySelector('video');

        $VidStream.canvas = document.querySelector('#videoCanvas');
        // Set size of the video canvas
        $VidStream.canvas.width = $VidStream.canvas.height = $VidStream.sizeH;

        $VidStream.context = $VidStream.canvas.getContext('2d');
        // Fill canvas with black
        $VidStream.context.fillStyle = '#000000';
        $VidStream.context.fillRect( 0, 0, $VidStream.sizeH, $VidStream.sizeH );

        if ((typeof window === 'undefined') || (typeof navigator === 'undefined')) {
            alert('This page needs a Web browser with the objects window.* and navigator.*!');
        }
        else {

            // Check if possible to choose video source
            if (typeof MediaStreamTrack === 'undefined'){
                // Can't choose source, call fetch sources with null
                $VidStream.fetchSources(null);
            } else {
                // Get source data
                MediaStreamTrack.getSources($VidStream.fetchSources);
            }
        }
    },
    setupContext: function(){
        console.log("Setup context");
        $VidStream.video.removeEventListener('playing', $VidStream.setupContext);

        // Find smallest size of the video
        $VidStream.sizeH = Math.min($VidStream.video.videoWidth, $VidStream.video.videoHeight);

        // Set size of the video canvas
        $VidStream.canvas.width = $VidStream.canvas.height = $VidStream.sizeH;
        // Fill canvas with black
        $VidStream.context.fillStyle = '#000000';
        $VidStream.context.fillRect( 0, 0, $VidStream.sizeH, $VidStream.sizeH );

        console.log($VidStream.sizeH);

        // Setup the region of the video element that needs to be copied to canvas
        $VidStream.copyPos = [0,0];
        if ($VidStream.video.videoWidth > $VidStream.sizeH)
            $VidStream.copyPos[0] = Math.round(($VidStream.video.videoWidth - $VidStream.sizeH) / 2);
        if ($VidStream.video.videoHeight > $VidStream.sizeH)
            $VidStream.copyPos[1] = Math.round(($VidStream.video.videoHeight - $VidStream.sizeH) / 2);

        $Main.init();
    },
    copyToCanvas: function(context){
        if ($VidStream.copyPos === undefined && $VidStream.video.readyState !== $VidStream.video.HAVE_ENOUGH_DATA )
            return false;
        
        var mirrorImg = 1;
        if ($VidStream.sources.length == 1 || $VidStream.sourceCurrent.isMirror)
            mirrorImg = -1;

        // Copy the video over to the context
        context.scale(mirrorImg, 1);
        context.drawImage($VidStream.video,
                        $VidStream.copyPos[0],$VidStream.copyPos[1],
                        $VidStream.sizeH, $VidStream.sizeH,
                        0, 0, $VidStream.sizeH * mirrorImg, $VidStream.sizeH);

        context.restore();
        return true;
    },
    fetchSources: function(sourceInfos) {
        // console.log("FetchSources");
        navigator.getUserMedia = navigator.getUserMedia ||
                                navigator.webkitGetUserMedia ||
                                navigator.mozGetUserMedia ||
                                navigator.msGetUserMedia;
        if (navigator.getUserMedia === undefined)
        {
            console.log("No getUserMedia");
            alert("Video not supported in browser");
            return;
        }

        $VidStream.sources = [];

        // if source infos is not null, collate the video sources
        if (sourceInfos !== null) {
            for (var i = 0; i != sourceInfos.length; ++i) {
                var sourceInfo = sourceInfos[i];
                if (sourceInfo.kind === "video")
                {
                    $VidStream.sources[$VidStream.sources.length] = {
                        id: sourceInfo.id,
                        isMirror: sourceInfo.facing === "user"
                    };
                }
            }
        }
        $VidStream.fetchStream(0);
    },
    sourceCurrent: function(){
        return $VidStream.sources[$VidStream.currentStream];
    },
    fetchStream: function(sourceIndex){
        // console.log("fetchStream " + sourceIndex);
        // Default parameters if no source info
        var parameters = {
            video: true,
            audio: false
        }

        // Actually have sources...
        if ($VidStream.sources.length > 0)
        {
            parameters.video = {optional: [{sourceId: $VidStream.sources[sourceIndex].id}] };
            $VidStream.currentStream = sourceIndex;
        }

        navigator.getUserMedia(parameters, $VidStream.gotStream, $VidStream.noStream);
    },
    toggleStream: function(){
        if ($VidStream.sources.length == 0)
            return;

        var newSource = $VidStream.currentStream;
        newSource++;
        if(newSource >= $VidStream.sources.length)
            newSource = 0;

        $VidStream.video.pause();
        $VidStream.video.src = null;
        $VidStream.videoStream.active = false;
        $VidStream.fetchStream(newSource);
    },
    gotStream: function(stream){
        console.log("gotStream");
        $VidStream.videoStream = stream;

        $VidStream.video.addEventListener('playing', $VidStream.setupContext);
        $VidStream.video.src = window.URL.createObjectURL(stream);
    },
    noStream: function(errorMsg) {
        console.log(errorMsg);
        alert('Access to camera was denied! ' + errorMsg);
    }
}
