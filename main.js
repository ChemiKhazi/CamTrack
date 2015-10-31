var $Main = {
	trackEvt: null,
	img: null,
	imgLoaded: null,
	imgInScene: false,
	dbgRect: null,
	fabric: null,
	video: null,
	size: null,
	preInit: function(){
		
		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
		var size = Math.min(w, h, 500);
		$Main.size = size;

		document.querySelector("#display").style.width = size + "px";

		$Main.fabric = new fabric.Canvas("compositeCanvas", {
				backgroundColor: 'rgb(0,0,0)',
				width: size,
				height: size
			});
		
		console.log(size);
		var el = $Main.fabric.getElement();
		el.width = el.height = size;
		console.log(el.width + ", " + el.height);
	},
	init: function(){
		$CamUi.init();

		var el = $Main.fabric.getElement();
		el.width = el.height = $VidStream.sizeH;

		document.querySelector("#display").style.width = $VidStream.sizeH + "px";

		var scaleBy = ($Main.size / $VidStream.sizeH) * 100;
		var scaleStyle = document.querySelector("#scaler").style;
		scaleStyle.width = scaleBy + "%";
		scaleStyle.paddingTop =scaleBy + "%"; 

		$Main.video = new fabric.Image($VidStream.video, {
			left: -$VidStream.copyPos.x,
			top: -$VidStream.copyPos.y,
			selectable: false,
			width: $VidStream.video.videoWidth,
			height: $VidStream.video.videoHeight,
			originX: 'left',
			originY: 'top'
		});
		$Main.fabric.add($Main.video);

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

		if ($Main.trackEvt !== null && $Main.img !== null)
		{
			var evt = $Main.trackEvt;

			var x = evt.x;
			var y = evt.y;
			var angle = (evt.angle * 180/Math.PI)-90;
			var scale = (evt.width * 2.5) / $Main.img.width;

			x -= $VidStream.copyPos.x;
			y -= $VidStream.copyPos.y;

			var targetY = -(evt.height / 2) + (evt.width / 3) * 1.8;

			$Main.img.set({
				left: x,
				top: y,
				angle: angle,
				transformMatrix: [scale, 0, 0, scale, 0, targetY]
			});
		}

		$Main.fabric.renderAll();
		requestAnimationFrame($Main.update);

	},
	onTrackEvent: function(event) {

		if (event.detection == "CS") {
			$Main.trackEvt = event;
			if (!$Main.imgInScene) {

				// $Main.fabric.add($Main.img);
				fabric.Image.fromURL('helmet-test.png', function(img){
					$Main.img = img;
					$Main.imgLoaded = true;
					img.set({
						originX: 'center',
						originY: 'center',
						selectable: false
					});
					$Main.fabric.add(img);
				});
				$Main.imgInScene = true;
			}
		}
	}
};