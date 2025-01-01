---
layout: post
title:  "GK Button Auto Repeat"
date:   2020-07-27 12:00:00 +0100
cover-img: "/assets/electronics/gk-button-repeater.jpg"
tags: guitar electronics software
---
At some point I upgraded my guitar synth unit to a [Roland GR-55](https://www.roland.com/us/products/gr-55/). This is a fun thing, but has one annoying flaw. Unlikely previous units I had owned, if I *held down* the button on the guitar to change patch, it would only advance by a single patch.

What I would expect to have happen, and what is the norm with most selection UIs, is that after a short delay, the GR-55 interpret the held button as a request to keep scrolling through the patches. Pressing the button 10 times to go from e.g. patch 13 to 23 was *so incredibly annoying*, I had to do something about it. I acquired a bunch of minuscule knock-off [ATtiny85](https://www.microchip.com/en-us/product/attiny85) microcontrollers and went from there.

![ATtiny85](/assets/electronics/gk-button-repeater.jpg)

Then it was just a matter of writing some [trivially simple software](https://github.com/timangus/gk-button-autorepeat) that when I held a button, manually issued multiple virtual button presses. Wiring it in was pretty straightforward, just using a couple of diodes and piggy backing off the GK module's power supply.

<iframe style="width: 100%; aspect-ratio: 9 / 16" src="https://www.youtube.com/embed/BADpTXQrU9I" title="YouTube video player" frameborder="0" allowfullscreen></iframe>
