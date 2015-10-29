var $Main = {
	canvas: null,
	context: null,
	trackEvt: null,
	preInit: function(){
		$Main.canvas = document.querySelector("#compositeCanvas");
		$Main.canvas.width = $Main.canvas.height = window.screen.width;
		$Main.context = $Main.canvas.getContext('2d');
		$Main.context.fillStyle = "#000";
		$Main.context.fillRect(0, 0, window.screen.width, window.screen.width);
	},
	init: function(){
		$CamUi.init();

		$Main.canvas.width = $Main.canvas.height = $VidStream.sizeH;


		$Main.update();
	},
	trackInit: function(){
		if (!$FaceTrack.isInit)
			$FaceTrack.init($VidStream.video);
		else
			$FaceTrack.stop();

		var init = $FaceTrack.isInit;

		if (init) {
			document.addEventListener("facetrackingEvent", $Main.onTrackEvent);
		}
		else {
			document.removeEventListener("facetrackingEvent", $Main.onTrackEvent);
			$Main.trackEvt = null;
		}

		return init;
	},
	toggleSource: function(){
		$FaceTrack.stop;
		$VidStream.toggleStream();
	},
	update: function(){
		requestAnimationFrame($Main.update);

		$VidStream.copyToCanvas($VidStream.context);
		$Main.context.drawImage($VidStream.canvas, 0, 0);

		if ($Main.trackEvt === null)
			return

		var x = $Main.trackEvt.x; 
		var y = $Main.trackEvt.y;
		var angle = $Main.trackEvt.angle;

		if ($VidStream.isMirrored()){
			x = $VidStream.video.videoWidth - x;
			angle *= -1;
		}

		x -= $VidStream.copyPos[0];
		y -= $VidStream.copyPos[1];

		$Main.context.translate(x, y)
		$Main.context.rotate(angle-(Math.PI/2));
		$Main.context.strokeStyle = "#00CC00";
		$Main.context.strokeRect((-($Main.trackEvt.width/2)) >> 0, (-($Main.trackEvt.height/2)) >> 0, $Main.trackEvt.width, $Main.trackEvt.height);
		$Main.context.rotate((Math.PI/2)-angle);
		$Main.context.translate(-x, -y);
	},
	onTrackEvent: function(event) {

		if (event.detection == "CS") {
			$Main.trackEvt = event;
		}
	}
};