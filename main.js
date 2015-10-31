var $Main = {
	canvas: null,
	context: null,
	trackEvt: null,
	img: null,
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

		$Main.img = new Image();
		$Main.img.src = "helmet-test.png";

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
		var scale = 1;

		x -= $VidStream.copyPos[0];
		y -= $VidStream.copyPos[1];

		$Main.context.translate(x, y)
		$Main.context.rotate(angle-(Math.PI/2));

		$Main.context.strokeStyle = "#00CC00";
		$Main.context.strokeRect((-($Main.trackEvt.width/2)) >> 0, (-($Main.trackEvt.height/2)) >> 0, $Main.trackEvt.width, $Main.trackEvt.height);

		// $Main.context.beginPath();
		// $Main.context.arc(0, 0, 50, 0, 2*Math.PI);
		// $Main.context.fillStyle = "#CC0000";
		// $Main.context.fill();

		var offX = -$Main.img.width * 0.5;
		var offY = -$Main.trackEvt.height * 0.5 - $Main.img.height * 0.1;
		
		$Main.context.translate(offX, offY);
		$Main.context.scale(scale, scale);
		$Main.context.drawImage($Main.img, 0, 0); //-$Main.trackEvt.width/2, $Main.trackEvt.height/2);
		$Main.context.scale(scale, scale);
		$Main.context.translate(-offX, -offY);

		$Main.context.rotate((Math.PI/2)-angle);
		$Main.context.translate(-x, -y);
	},
	onTrackEvent: function(event) {

		if (event.detection == "CS") {
			$Main.trackEvt = event;
		}
	}
};