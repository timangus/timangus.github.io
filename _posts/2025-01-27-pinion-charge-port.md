---
layout: post
title:  "Pinion Smart.Shift Charge Port"
date:   2025-01-27 12:00:00 +0100
cover-img: "/assets/bikes/pinion-charge-port-9.jpg"
tags: vehicles bikes deviate 3dprinting cad pinion retrofit
---
I covered in an [earlier post]({% post_url 2024-11-22-deviate-smart-shift %}) that I had retrofitted a [Pinion Smart.Shift](https://pinion.eu/en/smartshift/) gearbox to my [Deviate Guide](https://www.deviatecycles.com/guide). I ended that post mentioning that I had yet to come up with a good solution for accessing the battery charge port, leaving it poking out one of the existing cable holes; hardly ideal.

![Pinion Charge Cable](/assets/bikes/pinion-charge-port-1.jpg)

I'm a bit perplexed by their choice of connector here, to be frank. It's a connector from [Higo](https://www.higoconnector.com/), a company that specialises in connectors for use in e-bikes. This is all well and good, but given the insertion force required and obvious waterproofing, it seems to me like these are really intended to be used to connect the various internal components of an e-bike together, and not as an end user accessible charging port, where you might expect to find a (sufficiently waterproofed) traditional 3.5mm power jack or such like. It could be that the system was developed more with having a display involved, connecting to the CAN bus lines also found on the connector pins, with the OEM making their own loom extension and choosing their own charging connector, who knows. Nevermind, it just seems a bit lazy on Pinion's part, or should I say [FIT E-Bike](https://fit-ebike.com/), who appear to be the partner predominantly responsible for developing the system.

Anyway, it is what it is, and in a case of (almost) square peg, (almost) round hole, I needed to find a less ugly way to make it accessible. The connector itself is only a millimetre or so narrower than the hole through which I intended for it to be available so engineering something to hold it in place was going to be tricky from a clearance and tolerance point of view. As a first step I used some silicone putty to take a mould of the orifice I would be working to, and subsequently cast a replica in epoxy resin.

![Pouring Mould](/assets/bikes/pinion-charge-port-2.jpg)

![Epoxy Cast](/assets/bikes/pinion-charge-port-3.jpg)

Basically this is a time saving device, wherein testing a prototype does not require opening two doors, descending a flight of stairs, opening the garage, finding the prototype doesn't fit, then reversing the aforementioned steps and trying again. I could of course bring my bike upstairs into my flat but, while I love my bike very much, I also love the state of my carpets. In order to complete my prototyping tools, I also needed a replica of the connector itself.

![Connector Replica](/assets/bikes/pinion-charge-port-4.jpg)

The black/purple colour here is just from me having covered it in black [Sharpie](https://en.wikipedia.org/wiki/Sharpie_(marker)) marker, the clear resin I used having made it difficult to see what was going on due to internal reflections.

I decided early doors that the only feasible way to make this work was in 3D printing [TPU](https://en.wikipedia.org/wiki/Thermoplastic_polyurethane), creating a small device that held the connector itself while at the same time interfacing with the hole in the frame. TPU differs to standard PLA filament, in that it is flexible, the resultant prints being both pliable and highly resistant to damage, to the extent that I'm pretty confident you could print a [Benchy](https://en.wikipedia.org/wiki/3DBenchy), twat it with a hammer and it suffer no obvious ill effects -- it's amazingly useful stuff.

After probably 10 to 15 prints to test out various ideas and approaches, I eventually ended up with the following. The black thing is an approximation of the connector, the red is the holder itself, and the green is a cap to cover the port when not in use.

![CAD Design](/assets/bikes/pinion-charge-port-5.png)

The flexibility of TPU is useful in three separate ways for my purposes here:

* The hole in the frame is clearly not accessible from the rear for any potential fixing hardware, so it needed to deform so that it could pass through the hole and rebound back into its original shape to snap into place.
* The connector is (obviously) on the end of a cable which must exit the connector holder. The only way it could be assembled without first cutting the cable is if the holder is flexed open and the connector and cable inserted through a strategically placed slit in its side.
* Given the electrical nature of the system, moisture is the enemy. Making the cap fit tightly should in theory prevent any ingress; this is only possible if it's flexible enough to deform and snap into place.

![CAD Render 1](/assets/bikes/pinion-charge-port-6.png)

![CAD Render 2](/assets/bikes/pinion-charge-port-7.png)

Actually fixing the connector to the holder was a problem. I briefly considered using some kind of adhesive but this makes repairs or future changes more difficult, so I was keen to avoid this if possible. I had noticed that the rear most cylindrical section of the connector had a very slight negative taper to it, which when clamped creates a mechanical fixing of sorts, albeit a weak one. To actually facilitate the clamping I turned to the humble [zip tie](https://en.wikipedia.org/wiki/Cable_tie), surely one of the unsung heroes of the modern world. The holder has two external channels to locate said zip ties, preventing any lateral movement once tight. The zip tie nearest the frame hole doesn't mechanically arrest the connector like the other does, but it at least provides some additional clamping friction.

![Prototype](/assets/bikes/pinion-charge-port-8.jpg)

Having proved the print could work with the epoxy casting, the only thing left to do was install it in the real thing.

![Zip Tied](/assets/bikes/pinion-charge-port-9.jpg)

![Pre Insertion](/assets/bikes/pinion-charge-port-10.jpg)

It was a bit of a squeeze to get the head of forward most zip tie through the hole, but it's just about large enough.

![Installed](/assets/bikes/pinion-charge-port-11.jpg)

![Charging](/assets/bikes/pinion-charge-port-12.jpg)

It takes a fair bit of physical effort to actually connect the charger, mostly due to the design of the connector seemingly being intended for a more permanent connection, as I mentioned earlier. As a result of this, I was concerned that pulling the charger out might bring the connector with it, but fortunately this doesn't seem to be the case.

![Charge Port Cap](/assets/bikes/pinion-charge-port-13.jpg)

The cap is deliberately quite a tight fit over the charge port; it really needs a strong thumbnail or possibly even a screwdriver to pry it off. This will hopefully ensure it is decently waterproof. The next time I go on a properly wet bike ride I'll give it a close inspection and see how it's doing.

The irony in going to all this effort of making it easy to access the charge port is that the battery itself is of such a capacity that at my current usage rates I estimate that it will need charging probably twice a year, at the absolute most. Oh well, it looks a lot better than the piece of tape that it replaced.
