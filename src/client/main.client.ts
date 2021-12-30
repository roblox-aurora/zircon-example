import Log, { Logger } from "@rbxts/log";
import Zircon, { ZirconClient } from "@rbxts/zircon";

// Set the logger to output to Zircon
Log.SetLogger(Logger.configure().WriteTo(Zircon.Log.Console()).Create());

// This binds the console to the F10 key. You can provide options inside the function if required to further tune it.
ZirconClient.Init();
