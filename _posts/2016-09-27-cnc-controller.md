---
layout: post
title:  "Milling Machine Controller"
date:   2016-09-27 12:00:00 +0100
cover-img: "/assets/milling/lightpipe-bracket.jpg"
tags: workshop cnc milling machining
---
The controller box my milling machine originally came with was a bit lack-lustre really. The box itself appeared to be repurposed from a previous life, and from the outside it had minimal indication of what was going on. At some point I added (I can't remember when) hall effect limit switches and simple opto-isolator based circuit to insulate them from the [Gecko](https://www.geckodrive.com/) stepper driver control board. Later, for reasons I'll cover in another post, I decided to replace the motor, and that meant building a new control box.

I got a metal off-the-shelf box from somewhere. It needed to house the existing stepper drivers, but also a power supply for said drivers and the new BLDC motor controller. All a bit of a squeeze.

![Controller Interior](/assets/milling/controller-interior.jpg)

Given I had a CNC machine, it seems rude not to CNC out the front and back panels as required.

![Front](/assets/milling/front.jpg)

![Back](/assets/milling/back.jpg)

You'll notice there are several LEDs on the front panel, indicating this or that. I could have tediously desoldered the existing LEDs from their respective boards on the interior and extended them via wires. I had discovered [light pipes](https://uk.rs-online.com/web/c/displays-optoelectronics/led-lighting-components/led-light-pipes/) though, and used those to extend the LEDs optically, rather than electrically.

![Light Pipe Bracket 1](/assets/milling/lightpipe-bracket.jpg)

![Light Pipe Bracket 2](/assets/milling/lightpipe-bracket-front.jpg)

![Front](/assets/milling/front-illuminated.jpg)

These days all the brackets would have been *much* faster to fabricate with a 3D printer, but this predates me getting one. Here's the box in-situ.

![Controller Mounted](/assets/milling/controller-mounted.jpg)

As a bonus, and for lack of a better place for it, here's a video of the machine going through its homing sequence.

<iframe style="width: 100%; aspect-ratio: 16 / 9" src="https://www.youtube.com/embed/68-tpbNGJnY" title="YouTube video player" frameborder="0" allowfullscreen></iframe>
