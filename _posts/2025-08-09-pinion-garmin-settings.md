---
layout: post
title:  "Garmin App for Pinion Smart.Shift Settings"
date:   2025-08-09 12:00:00 +0100
cover-img: "/assets/bikes/pinion-garmin-app-cover.jpg"
tags: vehicles bikes deviate pinion software
---
In [one of]({% post_url 2024-11-22-deviate-smart-shift %}) my earlier posts where I discuss my first impressions of the [Pinion Smart.Shift](https://pinion.eu/en/smartshift/) gearbox I had fitted to my bike, I had a little moan about the missed opportunity in the *Pre.Select* auto shifting feature. This is a setting where a gear is automatically pre-selected if the system detects you're coasting. In general I like it, but it becomes annoying when switched on all the time. For me I only really want it enabled on descents, where it comes into its own. What is really needed is a simple way to easily toggle it on and off as and when required. Sadly Pinion don't agree, and the only way you can do so is via the phone app. When you're covered in mud and have got gloves on, and your phone is safely tucked away in your backpack, it's really not very convenient to have to get it out, take your gloves off, hunt around for the app etc., just to change a single setting.

![Pinion's Phone App](/assets/bikes/pinion-garmin-app-1.png)

After posting about my [charge port 3D print]({% post_url 2025-01-27-pinion-charge-port %}), there developed a conversation in the comments beneath the post about the possibility of displaying the current gear on a bike computer. I had previously noticed that there were CAN Bus lines in the loom that I thought might potentially be a source for reverse engineering a system for getting at such data, but the initial commenter pointed out that (obviously, in hindsight) the phone app must communicate with the Smart.Shift box via Bluetooth, and was asking if I might take a look. Initially just using my phone to verify that it was indeed advertising Bluetooth, intrigued, I subsequently got myself a [Bluetooth sniffer dongle](https://wiki.makerdiary.com/nrf52840-mdk-usb-dongle/) and started to look a bit deeper. (Incidentally, I designed and printed a [case](https://www.printables.com/model/1199637-makerdiary-nrf52840-mdk-usb-bluetooth-dongle-case) for the dongle, having stupidly bought the caseless version.)

After some setup gymnastics I got the dongle to work with [Wireshark](https://www.wireshark.org/) and set to work. By going through the options one by one on my phone as I simultaneously did a network traffic capture and screen recording, I was able to correlate the changing bytes to settings I was changing on the phone. It's quite a simple protocol, so relatively quickly I had an idea of how it worked. I would later learn that it's essentially the [CANOpen](https://en.wikipedia.org/wiki/CANopen) protocol, and the data was in the form of SDOs (Service Data Objects). To ease my understanding I wrote a [dissector](https://wiki.wireshark.org/lua/dissectors), basically a plugin that would decode the data so that Wireshark could display it in a more human readable format. Incidentally this gave me strange flashbacks to my first job out of university, where [the game](https://en.wikipedia.org/wiki/Brave:_The_Search_for_Spirit_Dancer) we worked on used [Lua](https://www.lua.org/) as its scripting language; I hadn't used it since then.

<details markdown="1">
<summary markdown="span">Wireshark Smart.Shift BLE dissector</summary>

```lua
smart_shift_proto = Proto("smart.shift", "Smart.Shift Post-Dissector")
local smart_shift_type_field = ProtoField.string("smart.shift.type", "Type", base.ASCII)
local smart_shift_property_field = ProtoField.string("smart.shift.property", "Property", base.ASCII)
smart_shift_proto.fields = {smart_shift_type_field, smart_shift_property_field}

local btatt_value_f = Field.new("btatt.value")

local READ_TYPE         = 0x01
local REPLY_TYPE        = 0x02
local WRITE_TYPE        = 0x03
local ACK_TYPE          = 0x04
local BLOCK_READ_TYPE   = 0x05
local BLOCK_REPLY_TYPE  = 0x06

local type_tbl =
{
    [READ_TYPE]         = "Read",
    [REPLY_TYPE]        = "Reply",
    [WRITE_TYPE]        = "Write",
    [ACK_TYPE]          = "Ack",
    [BLOCK_READ_TYPE]   = "Block Read",
    [BLOCK_REPLY_TYPE]  = "Block Reply",
}

function default(values)
    if #values == 1 then
        return values[1]
    end

    return string.format("[%s]", table.concat(values, ", "))
end

function dotted_quad(values)
    return table.concat(values, ".")
end

function boolean(values)
    if values[1] == 0 then
        return "[OFF]"
    end

    return "[ON]"
end

function power_supply(values)
    if values[1] == 1 then
        return "[Pinion Battery (P6510)]"
    elseif values[1] == 3 then
        return "[Direct connection to 12V e-bike battery]"
    elseif values[1] == 4 then
        return "[DC/DC converter P5620]"
    end

    return "[Unknown Value]"
end

function speed_sensor(values)
    if values[1] == 0 then
        return "[No speed sensor]"
    elseif values[1] == 1 then
        return "[Pinion speed sensor (P8360)]"
    elseif values[1] == 3 then
        return "[CAN message]"
    end

    return "[Unknown Value]"
end

function trigger_mapping(values)
    if values[1] == 1 then
        return "[Normal]"
    elseif values[1] == 2 then
        return "[Reversed]"
    end

    return "[Unknown Value]"
end

function settings_write(values)
    if values[1] == 0x56a93c03 then
        return "[ENABLED]"
    elseif values[1] == 0 then
        return "[DISABLED]"
    end

    return "[Unknown Value]"
end

function battery_level(values)
    return string.format("%.2f%%", values[1] / 100.0)
end

local property_tbl =
{
    [0x091000] = {name="Hardware Version",          unit=1, f=dotted_quad   },
    [0x561f01] = {name="Firmware Version",          unit=1, f=dotted_quad   },
    [0x561f02] = {name="Bootloader Version",        unit=1, f=dotted_quad   },
    [0x181004] = {name="Serial Number"                                      },

    [0x252500] = {name="Mounting Angle"                                     },
    [0x023402] = {name="Rear Teeth"                                         },
    [0x023403] = {name="Front Teeth"                                        },
    [0x023401] = {name="Wheel Circumference"                                },
    [0x003402] = {name="Power Supply",              f=power_supply          },
    [0x003405] = {name="CAN bus",                   f=boolean               },
    [0x003404] = {name="Display",                   f=boolean               },
    [0x003401] = {name="Speed Sensor Type",         f=speed_sensor          },
    [0x003001] = {name="Number of Magnets"                                  },

    [0x502500] = {name="Reverse Trigger Mapping",   f=trigger_mapping       },

    [0x016102] = {name="Current Gear"                                       },
    [0x646101] = {name="Battery Level",             f=battery_level         },

    [0x122502] = {name="Auto Start Gear"                                    },
    [0x112500] = {name="Pre.Select Cadence"                                 },
    [0x122501] = {name="Start.Select",              f=boolean               },
    [0x132500] = {name="Pre.Select",                f=boolean               },

    [0x003004] = {name="Settings",                  f=settings_write        },
    [0x002500] = {name="Number of Gears"                                    },

    [0x016101] = {name="_ShifterStatus"                                     },
    [0x511f01] = {name="_ProgramControlApplication"                         },
    [0x043101] = {name="_NumberOfActiveErrors"                              },
    [0x402500] = {name="_ShiftModeSelection"                                },
    [0x036201] = {name="_SetDays"                                           },
    [0x036202] = {name="_SetMilliseconds"                                   },
    [0x043102] = {name="_RequestActiveErrorNumber"                          },
    [0x043103] = {name="_ActiveError"                                       },
    [0x023101] = {name="_NumberErrorsMemory"                                },
    [0x053105] = {name="_LogType"                                           },

    [0x053101] = {name="Error Log"                                          },
}

function hex_string_for(bytes)
    return "0x" .. string.lower(bytes:bytes():tohex())
end

function filter_string_for(s)
    return s:gsub("[^a-zA-Z]", "_"):lower()
end

function smart_shift_proto.dissector(buffer, pinfo, tree)
    local att_value = btatt_value_f()
    if not att_value then
        return
    end

    local all_bytes = att_value.range:bytes():tvb("Smart.Shift")

    local type = all_bytes:range(0, 1):uint()
    local type_string = type_tbl[type]
    if not type_string then
        return
    end

    local subtree = tree:add(smart_shift_proto, buffer(), "Smart.Shift")

    subtree:add(buffer(), "Type: " .. type_string .. " (" .. type .. ")")
    subtree:add(smart_shift_type_field, filter_string_for(type_string)):set_hidden()
    pinfo.cols.info = string.format("Smart.Shift %-5s", type_string)

    local number_payload_bytes  = all_bytes:range(1, 1):uint()
    local property_bytes        = all_bytes:range(2, 3)
    local property_bytes_hex    = hex_string_for(property_bytes)

    local property_string           = ""
    local property_string_verbose   = ""
    local property_string_filter    = ""
    local property = property_tbl[property_bytes:uint()]
    if property then
        property_string = property.name
        property_string_verbose = property_string .. " (" .. property_bytes_hex .. ")"
        property_string_filter = filter_string_for(property_string)
    else
        property_string = "Unknown (" .. property_bytes_hex .. ")"
        property_string_verbose = property_string
        property_string_filter = "unknown"
    end

    subtree:add(buffer(), "Property: " .. property_string_verbose)
    subtree:add(smart_shift_property_field, property_string_filter):set_hidden()
    pinfo.cols.info:append(" " .. property_string)

    if type ~= REPLY_TYPE and type ~= WRITE_TYPE and type ~= UNK2_TYPE then
        return
    end

    local value_bytes           = all_bytes:range(5, number_payload_bytes)
    local value_bytes_hex       = hex_string_for(value_bytes)
    local value_string          = "";
    local value_string_verbose  = "";

    if property then
        local values = {}

        local unit = number_payload_bytes
        if property.unit then
            unit = property.unit
        end

        local n = number_payload_bytes / unit
        for i = 0, n - 1 do
            values[#values+1] = value_bytes:range(number_payload_bytes - ((i + 1) * unit),
                unit):le_uint()
        end

        if property.f then
            value_string = property.f(values)
        else
            value_string = default(values)
        end

        value_string_verbose = value_string .. " (" ..
            hex_string_for(all_bytes:range(5, number_payload_bytes)) .. ")"
    else
        value_string = value_bytes_hex;
        value_string_verbose = value_bytes_hex;
    end

    subtree:add(buffer(), "Value: " .. value_string_verbose)
    pinfo.cols.info:append(" " .. value_string)
end

register_postdissector(smart_shift_proto)
```
</details>

![Wireshark Bluetooth Packet Capture](/assets/bikes/pinion-garmin-app-wireshark.png)

I later realised that I could have saved myself quite a lot of effort here by just reverse engineering the phone app itself, but dismissed it as impractical and too time consuming versus just sniffing the data itself. However it turns out the that app is written in Javascript, and as such is trivially easy to understand. The wizened old software engineer that I am assumed that something that communicates with actual hardware would be written in a lower level compiled language like C++, or at least Java/C#/Kotlin, but no, Javascript! Learning about Bluetooth sniffing was quite interesting, regardless. Anyway, I digress.

From here I started to look into the Garmin ecosystem, to see how the Smart.Shift box might be addressed from a Garmin device, such as my aging [Edge 530](https://www.garmin.com/en-GB/p/621224/). They have a platform called [ConnectIQ](https://developer.garmin.com/connect-iq/overview/) which allows for third party developers to write apps for their devices. I have various critical thoughts about this, but I'll save those for a later [addendum](#and-now-for-my-rants) as they're not really relevant to the job in hand. Anyway, to test the waters, I set about to develop a simple data field that displayed the current gear of the Pinion. It was very quick and dirty, doing the absolute bare minimum of error checking or good abstraction, the point being simply to see if it could be made to work at all.

<iframe style="width: 100%; aspect-ratio: 16 / 9" src="https://www.youtube.com/embed/q6fo5UNQHpM" title="YouTube video player" frameborder="0" allowfullscreen></iframe>

It's a bit slow due to accumulating polling delay, but as you can see it does work. I tried it out on an actual bike ride but found that the connection had a tendency to drop after a few minutes, unfortunately making it not very practical (although, more on this later). In order for a device to connect to the Smart.Shift box — be it the phone app or anything else — it must be put into 'pairing' mode. To most people who have used Bluetooth devices, 'pairing' implies forming a persistent, automatic connection between two devices. However, Pinion's 'pairing' mode is actually a misnomer; it simply turns on Bluetooth advertising for a short period, making the gearbox visible to other devices. This means that if the connection to your Garmin drops for any reason, you must manually hold down the rear shift button for 3 seconds again to re-enable advertising and allow the device to reconnect. It's this manual intervention that makes the gear display data field a bit impractical for continuous use. If the Garmin to Smart.Shift connection drops for any reason, and the Smart.Shift box is no longer advertising, the data field can't reconnect itself without manual user intervention; hardly ideal.

(It was at about this time that [Patrick Schlangen](https://patsch.dev/) showed up the comments of the [previous post]({% post_url 2025-01-27-pinion-charge-port %}), having independently followed much the same path as I had, and developed his own gear/battery display Smart.Shift widget. He was finding, as I was, that the connection dropped often and easily, so abandoned his effort there as a result. He subsequently took things much further and made a lot of progress reverse engineering the CAN protocol, as I had originally suggested I might attempt. Unfortunately for other reasons that seems to have also hit a dead end. Nevertheless we had a very interesting conversation. He also has a blog where he documented his project to use [Shimano brake levers with his Pinion](https://patsch.dev/2024/11/14/pinion-smartshift-with-a-shimano-grx-di2-lever/). Check it out!)

The connection persistence isn't really a great concern from my point of view, where my use case is just turning Pre.Select on and off - having to enter 'pairing' mode is just an inconvenience. Speaking of which, I now turned my attention to how I might implement this function. ConnectIQ apps exist in three flavours: Data Fields, Apps and Widgets. The Data Fields are as already discussed, a non-interactive[^1] way of displaying data to the user. Apps are full blown applications, launched from the Garmin's main menu. Unfortunately, they can only be started when not already engaged in an activity (i.e. a recording of your bike ride), so are not much use for anything *during* a bike ride. That leaves Widgets, that are very much like Apps besides a few restrictions, but crucially they are able to be executed from the Widgets menu, during an activity. So a Widget it was.

Good software engineer that I am, I decided to implement the Pinion communication part of my widget as a [library](https://github.com/timangus/garmin-connectiq-pinion-barrel) (or a 'Barrel', in ConnectIQ terms). I'll spare you the details, but I probably went a bit overboard here in terms of my actual needs. If you implement the code for dealing with switching one setting, other settings are obviously going to be very similar, so why not add those too? Long story short, the library can read and change all the settings that you'd realistically want to.

<details markdown="1">
<summary markdown="span">AbstractInterface.mc</summary>

```javascript
using Toybox.Lang;

module Pinion
{
    typedef AbstractInterface as interface
    {
        function startScan() as Void;
        function stopScan() as Void;
        function foundDevices() as Lang.Array<DeviceHandle>;

        function connect(deviceHandle as DeviceHandle) as Lang.Boolean;
        function isConnected() as Lang.Boolean;
        function disconnect() as Void;

        function read(parameter as ParameterType) as Void;
        function write(parameter as ParameterType, value as Lang.Number) as Void;
        function blockRead(parameter as ParameterType) as Void;

        function getActiveErrors() as Void;

        function setDelegate(delegate as Delegate) as Void;
    };
}
```
</details>

<details markdown="1">
<summary markdown="span">Delegate.mc</summary>

```javascript
using Toybox.Lang;
using Toybox.BluetoothLowEnergy as Ble;

module Pinion
{
    typedef Delegate as interface
    {
        function onScanStateChanged(scanState as ScanState) as Void;
        function onConnected(device as Ble.Device) as Void;
        function onDisconnected() as Void;
        function onConnectionTimeout() as Void;
        function onFoundDevicesChanged(foundDevices as Lang.Array<DeviceHandle>) as Void;
        function onCurrentGearChanged(currentGear as Lang.Number) as Void;
        function onParameterRead(parameter as ParameterType, value as Lang.Number) as Void;
        function onParameterWrite(parameter as ParameterType, value as Lang.Number) as Void;
        function onBlockRead(bytes as Lang.ByteArray, cumulative as Lang.Number, total as Lang.Number) as Void;
        function onActiveErrorsRetrieved(activeErrors as Lang.Array<Lang.Number>) as Void;
    };
}
```
</details>

<details markdown="1">
<summary markdown="span">Parameters.mc</summary>

```javascript
using Toybox.Lang;

module Pinion
{
    enum ParameterType
    {
        HARDWARE_VERSION,
        FIRMWARE_VERSION,
        BOOTLOADER_VERSION,
        SERIAL_NUMBER,

        MOUNTING_ANGLE,
        REAR_TEETH,
        FRONT_TEETH,
        WHEEL_CIRCUMFERENCE,
        POWER_SUPPLY,
        CAN_BUS,
        DISPLAY,
        SPEED_SENSOR_TYPE,
        NUMBER_OF_MAGNETS,

        REVERSE_TRIGGER_MAPPING,

        CURRENT_GEAR,
        BATTERY_LEVEL,

        START_SELECT_GEAR,
        PRE_SELECT_CADENCE,
        START_SELECT,
        PRE_SELECT,

        NUMBER_OF_GEARS,

        NUMBER_OF_ERRORS,
        CLEAR_ERRORS,
        ERROR_LOG_TYPE,
        ERROR_LOG,

        NUMBER_OF_ACTIVE_ERRORS,
        GET_ACTIVE_ERROR,
        ACTIVE_ERROR,

        // Don't set this manually, it's done automatically
        HIDDEN_SETTINGS_ENABLE,
    }

    const PARAMETERS =
    {
        HARDWARE_VERSION =>         { :name => "HARDWARE_VERSION",          :address => [0x09, 0x10, 0x00]b,  :length => 4 },
        FIRMWARE_VERSION =>         { :name => "FIRMWARE_VERSION",          :address => [0x56, 0x1f, 0x01]b,  :length => 4 },
        BOOTLOADER_VERSION =>       { :name => "BOOTLOADER_VERSION",        :address => [0x56, 0x1f, 0x02]b,  :length => 4 },
        SERIAL_NUMBER =>            { :name => "SERIAL_NUMBER",             :address => [0x18, 0x10, 0x04]b,  :length => 4 },

        MOUNTING_ANGLE =>           { :name => "MOUNTING_ANGLE",            :address => [0x25, 0x25, 0x00]b,  :length => 2,   :minmax => [0, 359],        :hidden => true },
        REAR_TEETH =>               { :name => "REAR_TEETH",                :address => [0x02, 0x34, 0x02]b,  :length => 1,   :minmax => [15, 60],        :hidden => true },
        FRONT_TEETH =>              { :name => "FRONT_TEETH",               :address => [0x02, 0x34, 0x03]b,  :length => 1,   :minmax => [15, 60],        :hidden => true },
        WHEEL_CIRCUMFERENCE =>      { :name => "WHEEL_CIRCUMFERENCE",       :address => [0x02, 0x34, 0x01]b,  :length => 2,   :minmax => [1000, 3000],    :hidden => true },
        POWER_SUPPLY =>             { :name => "POWER_SUPPLY",              :address => [0x00, 0x34, 0x02]b,  :length => 1,   :values => [1, 3, 4],       :hidden => true },
        CAN_BUS =>                  { :name => "CAN_BUS",                   :address => [0x00, 0x34, 0x05]b,  :length => 1,   :values => [0, 1],          :hidden => true },
        DISPLAY =>                  { :name => "DISPLAY",                   :address => [0x00, 0x34, 0x04]b,  :length => 1,   :values => [0, 1],          :hidden => true },
        SPEED_SENSOR_TYPE =>        { :name => "SPEED_SENSOR_TYPE",         :address => [0x00, 0x34, 0x01]b,  :length => 1,   :values => [0, 1, 3],       :hidden => true },
        NUMBER_OF_MAGNETS =>        { :name => "NUMBER_OF_MAGNETS",         :address => [0x00, 0x30, 0x01]b,  :length => 2,   :minmax => [1, 8],          :hidden => true },

        REVERSE_TRIGGER_MAPPING =>  { :name => "REVERSE_TRIGGER_MAPPING",   :address => [0x50, 0x25, 0x00]b,  :length => 1,   :values => [1, 2] },

        CURRENT_GEAR =>             { :name => "CURRENT_GEAR",              :address => [0x01, 0x61, 0x02]b,  :length => 1 },
        BATTERY_LEVEL =>            { :name => "BATTERY_LEVEL",             :address => [0x64, 0x61, 0x01]b,  :length => 2 },

        START_SELECT_GEAR =>        { :name => "START_SELECT_GEAR",         :address => [0x12, 0x25, 0x02]b,  :length => 1,   :minmax => [1, 12] },
        PRE_SELECT_CADENCE =>       { :name => "PRE_SELECT_CADENCE",        :address => [0x11, 0x25, 0x00]b,  :length => 1,   :minmax => [40, 100] },
        START_SELECT =>             { :name => "START_SELECT",              :address => [0x12, 0x25, 0x01]b,  :length => 1,   :values => [0, 1] },
        PRE_SELECT =>               { :name => "PRE_SELECT",                :address => [0x13, 0x25, 0x00]b,  :length => 1,   :values => [0, 1] },

        NUMBER_OF_GEARS =>          { :name => "NUMBER_OF_GEARS",           :address => [0x00, 0x25, 0x00]b,  :length => 1 },

        NUMBER_OF_ERRORS =>         { :name => "NUMBER_OF_ERRORS",          :address => [0x02, 0x31, 0x01]b,  :length => 4 },
        CLEAR_ERRORS =>             { :name => "CLEAR_ERRORS",              :address => [0x02, 0x31, 0x02]b,  :length => 1,   :values => [0, 1] },
        ERROR_LOG_TYPE =>           { :name => "ERROR_LOG_TYPE",            :address => [0x05, 0x31, 0x05]b,  :length => 1,   :values => [0, 1, 2] },
        ERROR_LOG =>                { :name => "ERROR_LOG",                 :address => [0x05, 0x31, 0x01]b },

        NUMBER_OF_ACTIVE_ERRORS =>  { :name => "NUMBER_OF_ACTIVE_ERRORS",   :address => [0x04, 0x31, 0x01]b,  :length => 2 },
        GET_ACTIVE_ERROR =>         { :name => "GET_ACTIVE_ERROR",          :address => [0x04, 0x31, 0x02]b,  :length => 2,   :minmax => [0, 0xffff] },
        ACTIVE_ERROR =>             { :name => "ACTIVE_ERROR",              :address => [0x04, 0x31, 0x03]b,  :length => 2 },

        HIDDEN_SETTINGS_ENABLE =>   { :name => "HIDDEN_SETTINGS_ENABLE",    :address => [0x00, 0x30, 0x04]b,  :length => 4,   :values => [0, 0x56a93c03] },
    } as Lang.Dictionary<ParameterType, Lang.Dictionary>;

    function stringForParameter(parameter as ParameterType) as Lang.String
    {
        if(!PARAMETERS.hasKey(parameter))
        {
            return "UNKNOWN";
        }

        var parameterData = PARAMETERS[parameter] as Lang.Dictionary;
        return parameterData[:name] as Lang.String;
    }

    class UnknownParameterException extends Lang.Exception
    {
        private var _parameter as ParameterType;

        public function initialize(parameter as ParameterType)
        {
            Lang.Exception.initialize();
            _parameter = parameter;
        }

        public function getErrorMessage() as Lang.String?
        {
            return "Unknown Pinion Parameter " + _parameter;
        }
    }

    class ParameterNotWritableException extends Lang.Exception
    {
        private var _parameter as ParameterType;

        public function initialize(parameter as ParameterType)
        {
            Lang.Exception.initialize();
            _parameter = parameter;
        }

        public function getErrorMessage() as Lang.String?
        {
            return "Pinion Parameter " + _parameter + " is not writable";
        }
    }
}
```
</details>


For the [app](https://github.com/timangus/pinion-garmin-settings) itself I decided that since I had made this library that *can* read and write all the settings you'd realistically want to, I may as well just make a UI that allows you to use most of the features of the library. So that's what I did, effectively ending up with a near-clone of the phone app. Again, I'll spare you the details, it's just normal software development stuff for the most part.

<div style="display: flex; justify-content: center; gap: 10px;">
  <img src="/assets/bikes/pinion-garmin-app-2.png" alt="Scanning">
  <img src="/assets/bikes/pinion-garmin-app-3.png" alt="Connecting">
  <img src="/assets/bikes/pinion-garmin-app-4.png" alt="Syncing">
</div>

I mentioned before the difficulty in establishing a connection to the Pinion from the Garmin with my quick hack gear indicator data field. For the purposes of the settings app this was less of a concern, but nevertheless it was still a present irritation, and a confusingly inconsistent one at that — sometimes it would connect and persist absolutely fine. Eventually I established that the pattern was that the connection problems only occurred when I was wearing my [Polar](https://www.polar.com/uk-en/sensors/h10-heart-rate-sensor) heart rate monitor. I found it was configured to connect using [ANT+](https://en.wikipedia.org/wiki/ANT_(network)), so on a whim decided to try switch it over to BLE mode, and... the Pinion/Garmin connection problems immediately went away. Whether this is the fault of Pinion, Garmin, Polar or just the general congestion of the [2.4Ghz radio band](https://en.wikipedia.org/wiki/2.4_GHz_radio_use), I don't know, but it's nice to have that fixed. I may have another look at doing a gear indicator data field, now that this is (apparently) solved, and that I have written a nice library to talk to the Pinion.

<div style="display: flex; justify-content: center; gap: 10px;">
  <img src="/assets/bikes/pinion-garmin-app-5.png" alt="Main Menu">
  <img src="/assets/bikes/pinion-garmin-app-6.png" alt="Information Menu">
  <img src="/assets/bikes/pinion-garmin-app-7.png" alt="Setup Menu">
</div>

The net result of all of this is that I'm now able to turn my Pre.Select on and off during a bike ride. It still could be a lot better in that in order to do so I first have to put the Smart.Shift box in pairing mode by holding the button, then on the garmin I need to go back to the home screen, up to the status page, up again to select Widgets then select to start the widget, then select to toggle Pre.Select, then all those steps in reverse to get back to my activity. In total it's a [Konami Code](https://en.wikipedia.org/wiki/Konami_Code)-esque Back, Up, Up, Select, Select, Back, Select, which is a lot for what should really just be a long press on one of the shifter buttons or something, but in any case is still way, *way*, **way** better than having to fumble about with my phone during peak Scottish Winter.

<iframe style="width: 100%; aspect-ratio: 16 / 9" src="https://www.youtube.com/embed/9OB08cecnaU" title="YouTube video player" frameborder="0" allowfullscreen></iframe>

If you have a Pinion Smart.Shift gearbox and a Garmin Edge device, in theory you could side load[^2] the widget and have a play with it yourself. I have GitHub configured to automatically make [builds](https://github.com/timangus/pinion-garmin-settings/actions/runs/16059878866) for various Edge devices, so do feel free. If there are people who actually find this useful I might publish it through more official channels, but given the number of hacks I was forced to employ and quirks I encountered during development, I'm slightly reticent to do so on devices that I don't own and obviously can't test myself. If you do try it out and happen to have something other than an Edge 530, do let me know your experiences and if it works for you. Obviously this is not an official Pinion product, so it may brick your gearbox or void your warranty or eat your homework, and I accept no responsibility for any of that. I mean it won't, but if it does it's not my fault.

Despite some frustrations, this was quite an interesting project to work on. I'm a strong advocate for trying to develop for a new software platform or paradigm on a regular basis, as you'll almost always learn something new, and it keeps you sharp. It's something I haven't really done enough of in recent years.

<details markdown="1">
<summary markdown="span">Addendum: ConnectIQ Criticisms (skip this if you don't care about software development)</summary>

#### And now for my rants
I'll try and keep this brief. Garmin's third party app ecosystem, ConnectIQ, is a bit of a mess:

* Why did Garmin decide to invent [their own](https://developer.garmin.com/connect-iq/monkey-c/) programming language? There is a [veritable panoply](https://en.wikipedia.org/wiki/List_of_programming_languages) of existing programming languages, many of which are mature and general purpose and would have been perfectly fine for use here. They've needlessly given themselves an unnecessary overhead, and predictably have repeated the mistakes of other languages. MonkeyC was initially a duck-typed language, but at some point they've decided that yes, actually, types are quite a good idea and have retrofitted them to the language, in a manner highly reminiscent of Typescript/Javascript. The result of this is an awkward and unnatural syntax that could have been avoided. In fairness their static type checker seems to work quite well though.
* The generated API documentation is quite poor. For example the sum total of the documentation for `Menu2.updateItem(item as WatchUi.MenuItem, index as Lang.Number) as Void` reads "Update a MenuItem in a Menu2." Thanks for that. What does it update? Why do I need to update? Do I need to update? When do I need to update? They do have a slightly better set of more general discursive documentation too, but it doesn't have a search facility and it's quite hard to find your way around in the first place so it's also not great.
* There is a web forum for support, but it doesn't appear to be used by Garmin staff, at least not recently. There are the usual 3 or 4 extremely regular users who seem to answer every question, some of which are extremely helpful, others of which are... less so, eschewing the use of source control altogether and recommending that the type system is disabled. For such a popular platform though, relying on the charity of such people for providing support to your customers isn't really a good look. The forum software itself is very odd, seemingly needing to maintain an AJAX connection to a server in order to operate.
* Speaking of the forum software, their bug tracking system appears to be effectively a sub-forum on this quirky software. Could you not just use GitHub or Jira like everyone else? They also seem thoroughly uninterested in bug reports, on the whole.
* There is a module called Menu which provides a native like menu experience on the virtual machine based ConnectIQ apps. At some point they've realised it wasn't very good, and added another module imaginatively called Menu2. Among its purported features is that it can supposedly be dynamically edited, a facility the original module lacked. Except it doesn't really work. If you add or remove a menu item programmatically, nothing changes. Not even if you call the aforementioned `updateItem`. Unless you press a scroll button that is, then it magically appears. Also...
* It has a simulator that runs on the desktop so that you can test your apps without having to use a real device. On the simulator, dynamically altering a Menu2 *does* work, making it extra annoying when you move to a real device, and you find you have to rethink your design because the simulator fails at simulating. You had one job. The simulator randomly crashes maybe 1 out of 10 times. The simulator *always* crashes if you have it configured to use a Bluetooth dongle and said dongle isn't connected. (Yes, I [reported](https://forums.garmin.com/developer/connect-iq/i/bug-reports/bluetoothlowenergy-registerprofile-crashes-simulator-under-linux-when-nrf52840-dongle-isn-t-present#) the bug, no they don't appear to care.) Using Menu2, what's displayed on the simulator only rarely matches what you see on an actual device, again defeating the point. Honestly what on earth is going here where programs that run on a virtual machine, on the actual hardware, behave so differently on the simulator, which you would hope is just running the same virtual machine, and the same libraries? It boggles the mind.
* The BLE implementation is... incredibly frustrating.
    + You can't get it to return the manufacturer data from a advertising packet at all, meaning during a device scan I can't just show the user the serial number of the gearbox(es) in their vicinity from the scan alone. Instead I have to do this ridiculous dance where if a device shows up in a scan, I temporarily connect to it, retrieve the serial number, then disconnect and resume scanning. Obviously managing the state with this approach is complicated enough, and it will inevitably be slow, but it's super silly in that the data I need is *right there*, just the implementation refuses to let me at it.
    + `BluetoothLowEnergy.Device.isConnected` flat out doesn't work. Once connected to a device it returns `true` permanently, regardless of the actual connection state.
    + `BluetoothLowEnergy.BleDelegate.onConnectedStateChanged` doesn't get called if you deliberately disconnect a device, so you have to call what you need to manually.
    + When you do a scan and get back a `BluetoothLowEnergy.ScanResult` for a device, you only get that scan result once, regardless if the connection strength changes or the device goes out of range and comes back or whatever else. This means that unless you're aware of this unintuitive behaviour, your device effectively vanishes into thin air. In my code I have a hack to literally [turn it off and on again](https://www.youtube.com/watch?v=DPqdyoTpyEs) that avoids this happening.

OK, that wasn't brief, I apologise. ConnectIQ really ranks pretty low in the list of platforms I've worked on in my reasonably extensive career, and I've had to use [BREW](https://en.wikipedia.org/wiki/Binary_Runtime_Environment_for_Wireless). Sigh.

</details>

[^1]: On a touch screen device, Data Fields *can be* partially interactive
[^2]: Connect the device to a computer via USB, copy the .prg file to /garmin/Apps, eject the device
