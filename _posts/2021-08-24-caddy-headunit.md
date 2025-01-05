---
layout: post
title:  "Volkswagen Caddy Head Unit Upgrade"
date:   2021-08-24 12:00:00 +0100
cover-img: "/assets/caddy/headunit-12.jpg"
tags: cars vehicles caddy 3dprinting cad electronics retrofit
---
Sick of my [Renault Kangoo]({% post_url 2019-04-22-kangoo-repair %}), I reverted to the correct manufacturer and got myself a Volkswagen Caddy. It wasn't cheap by any means, but having been working a pretty well paid contract for the previous year, I felt justified in splurging a little. But of course I wasn't going to leave it in its stock condition.

Top of the priority list was getting a modern head unit installed, with a screen that facilitates satellite navigation. There a few things I hate more than car phone holders; they're so untidy, unsightly and often dangerous. Just crap all round. Here's the original, quite basic head unit.

![Old Head Unit](/assets/caddy/headunit-1.jpg)

The choice for replacing it was quite wide; obviously there are a great many third party options available. In the end I decided to restrict myself to OEM options that VW originally specified, the thinking being that they are more likely to work with the rest of the vehicle functionality and indeed integrate aesthetically more seamlessly. The one I went for in the end was the so called *Composition Media* model, which didn't have built in satnav, but did allow for Android Auto/Apple Carplay. I got it second hand off eBay for a few hundred quid. Generally speaking they're VIN and feature locked, but the advert promised all such restrictions had been lifted, which indeed they had. I'm not sure by which nefarious means such things were defeated; I shall remain in blissful ignorance.

The old stereo used a "standard" Quadlock, but it turns out the new one had a newer "standard" Quadlock. I think initially I used an adapter but eventually ended up re-pinning a new connector as I was putting other stuff in there and it was getting too messy.

![Old Quadlock](/assets/caddy/headunit-2.jpg)

![New Quadlock](/assets/caddy/headunit-3.jpg)

As such it wasn't quite a it-just-works situation, but with a bit of patience it wasn't too difficult. The new head unit is a 5K7 035 200 K.

![New Head Unit](/assets/caddy/headunit-4.jpg)

Examining the Quadlock pin-out, I assumed that connecting a USB socket (to connect my Android phone) would be straightforward, it having 1 pin each for the standard USB lines. Unfortunately it turned out to be a bit more complicated, in that the (highly expensive) socket you're forced into using has some built in electronics that are presumably there to conditionally enable the data lines if the head unit tells it to do so. I assume this is something to do with upselling software features like Android Auto.

![USB Socket](/assets/caddy/headunit-7.jpg)

Having eventually figured this out, I needed to decide on a location to put the socket. At the same time I had got hold of a centre console out of a Touran to replace the stock Caddy one. This common mod give you a nicer handbrake lever, armrest and cubby hole to store things. In said cubby hole is an old school 3.5 AUX jack for plugging your phone (or other audio device) into.

![AUX jack](/assets/caddy/headunit-5.jpg)

![AUX jack](/assets/caddy/headunit-6.jpg)

This was the ideal location as I could connect my phone and store it neatly out of sight. Unfortunately in an *almost* literal case of square peg, round hole, the new USB socket wasn't going to work in this location, unless I came up with a way of forcing it to do so.

![USB Adapter](/assets/caddy/headunit-8.jpg)

![USB Adapter](/assets/caddy/headunit-9.jpg)

This [adapter](https://www.printables.com/model/156663-vw-volkswagen-usb-to-aux-jack-adapter-5q0035726-to) does just that, allowing for the USB socket to be fitted in place of the AUX socket. I gave it the sanding and painting treatment to make it a bit less 3D-printy. It's worked out pretty well.

![USB Adapter](/assets/caddy/headunit-10.jpg)

![USB Adapter](/assets/caddy/headunit-11.jpg)

Other bits I installed at the same time include a DAB aerial, a microphone for voice activation/hands free and a reversing camera. I'm not sure the aerial gets a lot of use; in practice it rarely gets a good signal. I think this is more a function of DAB than the aerial itself -- as I understand it DAB is really optimised for stationary reception. The reversing camera has been invaluable, however. A rear windowless and long wheel base van can obviously be a bit of a pain to reverse park, so the camera is very helpful.

![Reversing Camera](/assets/caddy/headunit-12.jpg)

It's a small thing, but initially the graphical proximity sensor overlay didn't work. [Long story](https://forums.ross-tech.com/index.php?threads/30694/) short, it turned out that the parking sensor module wasn't communicating with the (much newer) head unit optimally, eventually leading me to installing a 5N0 919 475 D module, making it all work.

![Reversing Overlay](/assets/caddy/headunit-13.jpg)
