---
layout: post
title:  "Wanhao Fan Timer"
date:   2020-06-30 12:00:00 +0100
cover-img: "/assets/electronics/wanhao-fan-2.jpg"
tags: electronics retrofit
---
For the most part I was very happy with my [Wanhao](https://wanhao.store) 3D printer. I performed all the usual upgrades of beefier MOSFETs, better cooling shroud, magnetic bed, [Octoprint](https://octoprint.org/) etc., but one thing always annoyed me; the constantly running cooling fan.

It was hard wired to turn on with the machine itself, and it's not quiet. To some extent this is a classic first world problem -- when the printer isn't printing it's switched off anyway, so it's not really a big deal. On the other hand, when iterating a part there are times when there some minutes when I was making CAD adjustments before starting a new print and in this instance it wouldn't make sense to power down only to switch it back on. Having the fan buzzing in my ear was quite irritating. I resolved to fix this in some way. What I came up with a simple (and classic) [555](https://en.wikipedia.org/wiki/555_timer_IC) timer based circuit that activated the fan when the filament heater was switched on, but kept the fan running for a couple of minutes after the heater went off. There were experiments and prototypes.

![Wanhao Fan Prototyping](/assets/electronics/wanhao-fan-1.jpg)

Honestly this had taken me quite a while, having needed to reawaken decades old analogue electronics knowledge. What I probably should have done is cut my losses and just use a microcontroller, doing it much more simply in software (simple is a matter of perspective here, I guess), but I'm stubborn and I persevered. To complete the old school look, I used a bit of stripboard, ending up with a daughter board for the print head's connector block.

![Wanhao Fan Daughter Board](/assets/electronics/wanhao-fan-2.jpg)

![Wanhao Fan Daughter Board](/assets/electronics/wanhao-fan-3.jpg)

![Wanhao Fan Daughter Board](/assets/electronics/wanhao-fan-4.jpg)

It ended up working pretty well, and hasn't given me any trouble since.

<iframe style="width: 100%; aspect-ratio: 1" src="https://www.youtube.com/embed/KnkUdQtP4sk" title="YouTube video player" frameborder="0" allowfullscreen></iframe>

Here's the circuit.

![Wanhao Fan Circuit Diagram](/assets/electronics/wanhao-fan-5.webp)
