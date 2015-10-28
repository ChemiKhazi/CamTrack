var $Main = {
	canvas: null,
	context: null,
	init: function(){
		$CamUi.init();

		$Main.canvas = document.querySelector("#compositeCanvas");
		$Main.canvas.width = $Main.canvas.height = $VidStream.sizeH;

		$Main.context = $Main.canvas.getContext('2d');

		$Main.update();
	},
	trackInit: function(){
		if (!$FaceTrack.isInit)
			$FaceTrack.init($VidStream.canvas);
		else
			$FaceTrack.stop();
		return $FaceTrack.isInit;
	},
	toggleSource: function(){
		$FaceTrack.stop;
		$VidStream.toggleStream();
	},
	update: function(){
		requestAnimationFrame($Main.update);

		$VidStream.copyToCanvas($VidStream.context);
		$Main.context.drawImage($VidStream.canvas, 0, 0);

		if ($FaceTrack.isInit) {
			$FaceTrack.update($Main.canvas, true);
		}
	}	
};