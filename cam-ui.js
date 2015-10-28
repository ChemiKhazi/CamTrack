var $CamUi = {
	btnStart: null,
	btnSource: null,
	init: function () {

		var btn = document.querySelector("#startbutton")
		btn.disabled = false;
		btn.value = "Start";
		btn.addEventListener("click", $CamUi.startPressed);
		$CamUi.btnStart = btn;

		btn = document.querySelector("#switchsource")
		btn.addEventListener("click", $Main.toggleSource);
	},
	startPressed: function() {
		var isStarted = $Main.trackInit();
		if (isStarted)
			$CamUi.btnStart.value = "Stop";
		else
			$CamUi.btnStart.value = "Start";
	}
}