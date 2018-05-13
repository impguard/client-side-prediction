Note: React dom rendering is purely for:
- Setting up my initial framework
- Kinda unnecessary but just cleaner than using document.creates or messing with HTML
- Also makes making the GUI later a little more friendly

Phase 1:
- On keypress, the state should change...
- Need a clear location where the state change is sent to the server...
- Need to play an action locally as well, outside of React dom rendering.

Phase 2:
- Need some sort of tick that matches the server...
- Need some sort of emulation of a server and a client tick rates...
- Need some sort of emulation of "sending a packet to the server"
