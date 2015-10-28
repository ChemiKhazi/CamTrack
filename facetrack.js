var $FaceTrack = {
	tracker: null,
	canvas: null,
	isInit: false,
	init: function(canvas){
		if ($FaceTrack.isInit)
			return;
		
		$FaceTrack.isInit = true;
		$FaceTrack.tracker = new clm.tracker({useWebGL : true});
		$FaceTrack.tracker.init(pModel);
		$FaceTrack.tracker.start(canvas);
	},
	stop: function() {
		$FaceTrack.tracker.stop();
		$FaceTrack.isInit = false;
	},
	update: function(canvas, doDraw){
		if (!$FaceTrack.isInit)
			return;

		if ($FaceTrack.tracker.getCurrentPosition() && doDraw)
			$FaceTrack.tracker.draw(canvas);
	}
}