---
layout: post
title:  "Bin Tracker"
date:   2026-02-16 12:00:00 +0100
cover-img: "/assets/3dprinting/bin-tracker-1.jpg"
tags: 3dprinting cad property
---

Several years ago, my domestic waste bin went missing. Bit odd I thought, but then it was quite old and looking somewhat worse for wear, perhaps the fortnightly refuse collectors had decided it was EOL and taken it away for recycling? I ordered a new one from the council and didn't think any more of it. A couple of years later though, it went missing again, and this time I couldn't come up with a sensible reason for its absence. This was a bit irritating, but I dutifully ordered another new one and life went on. Late last year however, laden with a smelly bag of rubbish, I was dismayed to discover then yet again my bin was in absentia. I had now accrued a great deal of experience in procuring a replacement from Edinburgh council, and the process is uncharacteristically straightforward and efficient, so I'm not really hugely bothered by having to get a new one every now and then. On the other hand, the (increasing) frequency with which I am replacing my bin makes me paranoid that I may have been placed on some kind of refuse collection head office based watch list, so I'm keen to discover what's happening to it. To this end, I resolved to put some kind of tracker on my bin(!)

My first port of call was to survey the usual Chinese megastores e.g. AliExpress, Temu etc., and I ordered a few very cheap options. The strongest contender were claimed GPS trackers, that took a SIM card and periodically reported their location to a service located in the PRC, which you then accessed with an ad-laden app. This in itself felt a bit dodge, but since the device wasn't actually a GPS tracker at all, just a highly inaccurate cell tower based tracker, and the fact that it had abysmal battery life, it was a non-starter. Instead, after speaking to a friend, I got myself a [PebbleBee](https://pebblebee.com/) tracker. This is basically an Android equivalent of an [Apple AirTag](https://www.apple.com/uk/airtag/) which don't track in themselves, but rely on briefly connecting (via BLE) to nearby/passing mobile phones which then report the tracker's location on its behalf. At ~£25 each this was somewhat more than I really wanted to spend, especially in that if and when the bin does again go AWOL, I may not necessarily be able to retrieve it from wherever it ends up. Nevertheless, I coughed up the required notes chiefly because I JUST WANT TO KNOW WTF IS HAPPENING TO MY BIN.

The PebbleBees themselves are nice bits of kit, pretty small and unobtrusive, are USB-C chargeable, and have a nice loud beeper and bright LEDs for when you want to locate an item. They also integrate with the Google Find Hub system, so you don't need to use any software from PebbleBee directly. They have obviously not been engineered for tracking a bin however, and have a key ring style form factor. Now I could have just got a bit of double sided tape or glue and stuck the thing to my bin and said job done, but this would have looked highly conspicuous to an inquisitive refuse collector and furthermore would have made charging the battery quite annoying. Fortunately it doesn't seem like this needs to be done particularly often, but if you've read any of this site before you'll know that I only need the vaguest of excuses for a 3D printing project.

![Cross Section](/assets/3dprinting/bin-tracker-3.png)

![Prototype](/assets/3dprinting/bin-tracker-5.jpg)

The bin itself it a standard injection molded affair as you'll find in many cities across the world. I identified a suitably discreet pocket inbetween two reinforcing ribs, that was just about large enough for the tracker, and set about designing a housing. Eventually I arrived at a form where one half is permanently affixed to the bin, and the other secured to the first via two print-in-place screws, facilitating occasional removal for the aforementioned charging. The PebbleBee claims IPX6 water-resistance, but since it will always be facing downwards it should never get directly wet, besides condensation or humidity. Nevertheless I added a hole to the half that houses the tracker, doubling up as an outlet for the built in speaker and as a drain hole for any moisture that does accumulate.

![Installed](/assets/3dprinting/bin-tracker-2.jpg)

As installed and printed in black it's quite discreet -- you'd have to be paying close attention to notice it. It's been about a month now and my bin remains mercifully present. Rest assured if it ever goes missing again I will update the post to (hopefully) explain its fate, but having gone to all this effort it almost certainly won't.

![Bins](/assets/3dprinting/bin-tracker-1.jpg)