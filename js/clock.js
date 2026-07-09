let select = e => document.querySelector(e);
let selectAll = e => document.querySelectorAll(e);

const face01 = select("#face01").getAttribute("d"),
	face02 = select("#face01").getAttribute("d"),

	handSec01 = select("#handSec01").getAttribute("d"),
	handSec02 = select("#handSec02").getAttribute("d"),
	sec = select("#sec"),

	handMin01 = select("#handMin01").getAttribute("d"),
	handMin02 = select("#handMin02").getAttribute("d"),
	min = select("#min"),

	handHr01 = select("#handHr01").getAttribute("d"),
	handHr02 = select("#handHr02").getAttribute("d"),
	hr = select("#hr");

gsap.set("#face", { attr: { d: face01 } });
gsap.set("#hand-sec", { attr: { d: handSec01 } });
gsap.set("#hand-min", { attr: { d: handMin01 } });
gsap.set("#hand-hr", { attr: { d: handHr01 } });

window.addEventListener('load', function () { startAnimation(); });

function startAnimation() {

	setTimeSec();
	setTimeMinHr();
	gsap.set([".gsapWrapper", ".vline"], { autoAlpha: 1, });

	gsap.to(".cw.t24", 1, { rotation: "-=15", transformOrigin: "50% 50%", ease: "bounce", onComplete: function () { this.invalidate().delay(1).restart(true); } });
	gsap.to(".cw.t20", 1, { rotation: "-=18", transformOrigin: "50% 50%", ease: "bounce", onComplete: function () { this.invalidate().delay(1).restart(true); } });
	gsap.to(".ccw.t12", 1, { rotation: "+=30", transformOrigin: "50% 50%", ease: "bounce", onComplete: function () { this.invalidate().delay(1).restart(true); } });
	gsap.to(min, 0.5, {
		rotation: getMinRotation, transformOrigin: "50% 50%", ease: "none", onComplete: function () {

			if (gsap.getProperty(min, "rotation") >= 360)
				gsap.set(min, { rotation: 0, transformOrigin: "50% 50%" });
			this.invalidate().delay(5).restart(true);

		}
	});

	gsap.to(hr, 0.5, {
		rotation: getHrRotation, transformOrigin: "50% 50%", ease: "none", onComplete: function () {

			if (gsap.getProperty(hr, "rotation") >= 360)
				gsap.set(hr, { rotation: 0, transformOrigin: "50% 50%" });
			this.invalidate().delay(5).restart(true);

		}
	});

	gsap.to(sec, 0.5, {
		rotation: geSecRotation, transformOrigin: "50% 50%", ease: "bounce", onComplete: function () {

			setTimeSec();
			if (gsap.getProperty(sec, "rotation") >= 360)
				gsap.set(sec, { rotation: 0, transformOrigin: "50% 50%" });
			this.invalidate().delay(0.).restart(true);

		}
	});


	// Removed MorphSVG timelines because MorphSVGPlugin is a premium Greensock plugin 
	// and cannot be loaded from unpkg. The clock hands will now rotate perfectly without morphing.

	function setTimeSec() {

		gsap.set(sec, { rotation: geSecRotation, transformOrigin: "50% 50%" });

	};

function setTimeMinHr() {

		gsap.set(min, { rotation: getMinRotation, transformOrigin: "50% 50%" });
		gsap.set(hr, { rotation: getHrRotation, transformOrigin: "50% 50%" });

	};

	function geSecRotation() {

		let seconds = new Date().getSeconds();
		let rotation = seconds * 6;
		let scaleXSec = gsap.getProperty(sec, "scaleX");

		let difference = Math.abs(gsap.getProperty(sec, "rotation") - rotation);
		if (difference >= 12)
			gsap.set(sec, { rotation: rotation, transformOrigin: "50% 50%" });

		if ((rotation >= 180 && rotation < 360) && (scaleXSec == 1))
			gsap.to(sec, { scaleX: -1, duration: 0.25 });
		else if ((rotation < 180 || rotation >= 360) && (scaleXSec == -1))
			gsap.to(sec, { scaleX: 1, duration: 0.25 });

		return rotation;

	};
	function getMinRotation() {

		let newDateTime = new Date();
		let rotation = newDateTime.getMinutes() * 6 + newDateTime.getSeconds() * 6 / 59;
		let scaleXMin = gsap.getProperty(min, "scaleX");

		let difference = Math.abs(gsap.getProperty(min, "rotation") - rotation);
		if (difference >= 5)
			gsap.set(min, { rotation: rotation, transformOrigin: "50% 50%" });

		if ((rotation >= 180 && rotation < 360) && (scaleXMin == 1))
			gsap.to(min, { scaleX: -1, duration: 0.25 });
		else if ((rotation < 180 || rotation >= 360) && (scaleXMin == -1))
			gsap.to(min, { scaleX: 1, duration: 0.25 });

		return rotation;

	};

	function getHrRotation() {

		let newDateTime = new Date();
		let rotation = (newDateTime.getHours() % 12) * 30 + newDateTime.getMinutes() * 0.5;
		let scaleHr = gsap.getProperty(hr, "scaleX");

		let difference = Math.abs(gsap.getProperty(hr, "rotation") - rotation);
		if (difference >= 5)
			gsap.set(hr, { rotation: rotation, transformOrigin: "50% 50%" });

		if ((rotation >= 180 && rotation < 360) && (scaleHr == 1))
			gsap.to(hr, { scaleX: -1, duration: 0.25 });
		else if ((rotation < 180 || rotation >= 360) && (scaleHr == -1))
			gsap.to(hr, { scaleX: 1, duration: 0.25 });

		return rotation;

	};

}

