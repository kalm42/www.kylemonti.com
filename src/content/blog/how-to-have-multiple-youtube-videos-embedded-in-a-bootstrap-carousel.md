---
title: How to have multiple YouTube videos embedded in a Bootstrap carousel
date: 2021-03-01
excerpt: A Bootstrap carousel that mixes image slides with YouTube video slides, playing only the video on the current slide and pausing everything else.
tags: Bootstrap, JavaScript
---

A friend asked me for help with the JavaScript behind this, and the final version seemed worth sharing.

## The ask

Build a slideshow with multiple YouTube videos. Whichever slide is showing a video should play it, and no other video should be playing — including when the current slide has no video at all. That last part sounds obvious, but a spec that states the edge cases plainly is easier to build against than one that doesn't.

## The solution

First, the HTML for the slides.

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta http-equiv="X-UA-Compatible" content="ie=edge" />
		<title>Image & Youtube Video Carousel For Bootstrap 4 Example</title>
		<link href="https://www.jqueryscript.net/css/jquerysctipttop.css" rel="stylesheet" type="text/css" />
		<link
			rel="stylesheet"
			href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
			integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
			crossorigin="anonymous"
		/>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
		<link rel="stylesheet" href="./style.css" />
		<script src="./index.js"></script>
	</head>
	<body>
		<div class="container contenedor-slide">
			<div id="carouselExampleControls" class="carousel slide" data-ride="carousel" data-interval="false">
				<div class="carousel-inner">
					<div class="carousel-item active">
						<img class="d-block w-100" src="https://source.unsplash.com/Be8TdJZPaBE/1280x720" alt="First slide" />
					</div>
					<div class="carousel-item">
						<img class="d-block w-100" src="https://source.unsplash.com/0crv9tTkzhk/1280x720" alt="Second slide" />
					</div>
					<div class="carousel-item">
						<img class="d-block w-100" src="https://source.unsplash.com/8LWtpfhGP4U/1280x720" alt="Third slide" />
					</div>
					<div class="carousel-item">
						<div class="carousel-video-inner embed-responsive embed-responsive-16by9">
							<div class="video-player" id="player1" data-video-id="dOy7vPwEtCw"></div>
						</div>
					</div>
					<div class="carousel-item">
						<div class="carousel-video-inner embed-responsive embed-responsive-16by9">
							<div class="video-player" id="player2" data-video-id="QWtsV50_-p4"></div>
						</div>
					</div>
				</div>
				<a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
					<span class="carousel-control-prev-icon" aria-hidden="true"></span>
					<span class="sr-only">Previous</span>
				</a>
				<a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
					<span class="carousel-control-next-icon" aria-hidden="true"></span>
					<span class="sr-only">Next</span>
				</a>
			</div>
		</div>
	</body>
</html>
```

Pretty basic HTML — styling, jQuery, Popper, and our own script, imported in order. The carousel itself is standard Bootstrap. The interesting part is the two video containers:

```html
<div class="carousel-video-inner embed-responsive embed-responsive-16by9">
	<div class="video-player" id="player1" data-video-id="dOy7vPwEtCw"></div>
</div>
```

Every video placeholder needs the same class, a [`data-`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*) attribute holding the YouTube video ID, and a unique `id`.

```javascript title="index.js"
const videos = []
const tag = document.createElement("script")
const firstScriptTag = document.getElementsByTagName("script")[0]

tag.src = "https://www.youtube.com/iframe_api"
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

// YouTube wants this function, don't rename it
function onYouTubeIframeAPIReady() {
	const slides = Array.from(document.querySelectorAll(".carousel-item"))
	slides.forEach((slide, index) => {
		// does this slide have a video?
		const video = slide.querySelector(".video-player")
		if (video && video.dataset) {
			const player = createPlayer({
				id: video.id,
				videoId: video.dataset.videoId,
			})
			videos.push({ player, index })
		}
	})
}

function createPlayer(playerInfo) {
	return new YT.Player(playerInfo.id, {
		videoId: playerInfo.videoId,
		playerVars: {
			showinfo: 0,
		},
	})
}

function theBigPause() {
	videos.map((video) => video.player.pauseVideo())
}

$(function () {
	$(".carousel").on("slide.bs.carousel", function (e) {
		theBigPause()
		const next = $(e.relatedTarget).index()
		const video = videos.filter((v) => v.index === next)[0]
		if (video) {
			video.player.playVideo()
		}
	})
})
```

A `videos` array holds a reference to every player so the rest of the script can control them later.

The first few lines inject the YouTube iframe API by writing a `<script>` tag with JavaScript rather than putting it directly in the HTML — that way, a visitor with JavaScript disabled never downloads a script they can't use.

Once the page loads, that injected script finishes loading and calls `onYouTubeIframeAPIReady`. That function walks every slide, image and video alike, looking for a `.video-player` element inside it. A slide without one gets `undefined` back from the query and is skipped. A slide with one gets a real DOM node — a truthy value — and only then does the code check that the node actually carries a `dataset`, which it will as long as the `data-` attribute is there.

For each match, a small helper turns the node's `id` and `data-video-id` into a real `YT.Player` instance, and the player gets pushed onto `videos` alongside the index of the slide it belongs to — so by the time the page has finished loading, every video placeholder has become a working player, and `videos` knows exactly which slide each one lives on.

From there, the last block handles what happens when the slide changes. `theBigPause` runs first and pauses every player unconditionally. Then the handler reads the index of the slide being switched to and filters `videos` down to the one entry with a matching index. If the target slide has no video, that filter comes back empty and there's nothing left to do; if it does, the matching player's `playVideo` gets called.
