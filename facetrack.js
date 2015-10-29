var $FaceTrack = {
	tracker: null,
	canvas: null,
	isInit: false,
	init: function(video){
		if ($FaceTrack.isInit)
			return;

		$FaceTrack.isInit = true;
		$FaceTrack.tracker = new headtrackr.Tracker({
			calcAngles: true,
			ui: false
		});

		$FaceTrack.canvas = document.querySelector("#debugCanvas");
		$FaceTrack.canvas.width = video.videoWidth;
		$FaceTrack.canvas.height = video.videoHeight;

		$FaceTrack.tracker.init(video, $FaceTrack.canvas, false);
		$FaceTrack.tracker.start();
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