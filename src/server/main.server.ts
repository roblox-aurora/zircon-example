import Log, { Logger } from "@rbxts/log";
import Zircon, {
	ZirconConfigurationBuilder,
	ZirconDefaultGroup,
	ZirconFunctionBuilder,
	ZirconServer,
} from "@rbxts/zircon";

// Set the logger to output to Zircon
Log.SetLogger(Logger.configure().EnrichWithProperty("Version", PKG_VERSION).WriteTo(Zircon.Log.Console()).Create());

// It's recommended if you do custom roles, to use an enum for them.
export enum MyZirconGroups {
	Moderator = "moderator",
}

/*
    We call 'Init' here with all the options etc. we want for Zircon.
*/
ZirconServer.Registry.Init(
	new ZirconConfigurationBuilder()
		// By default, Zircon ships with three predefined groups you can use.
		// A 'Creator' is a person who owns the group or place.
		.CreateDefaultCreatorGroup()
		// An admin is a person in your group game with a rank >= 250.
		.CreateDefaultAdminGroup()
		// A user refers to anyone in the game.
		.CreateDefaultUserGroup()
		// If you want your own custom groups, e.g. a moderator - you would do the following:
		.CreateGroup(
			150, // The priority will determine which permissions get applied. Higher rank = those permissions will be used.
			MyZirconGroups.Moderator, // This is our group name. Use an enum if you want an easy way to keep track of them.
			(group) =>
				group
					// This is how you set permissions for Zircon to the user
					.SetPermissions({
						CanExecuteZirconiumScripts: true,
					})
					// This is using the easy games group as an example, the first argument is the group id, the second is the role name
					.BindToGroupRole(5774246, "Moderator")
					.BindToUserIds([83348]), // You can even bind to specific user ids.
			// There is also BindToCreator (which binds to the place/group owner), BindToEveryone (that binds to _everyone_, and is dangerous with the wrong permissions)
		)
		// A function is something that anyone with the permissions to execute a script, can execute
		.AddFunction(
			// The function builder is a simple way of building a function
			new ZirconFunctionBuilder("ping").Bind((context) => {
				// 'context' refers to the context of the call, so has things like the calling player, the function etc.

				// This will directly respond to the calling player with Pong!
				context.LogInfo("Pong!");
			}),
			// this is a list of groups that can execute this function. Here we're using the default 'Creator' group we registered above.
			[ZirconDefaultGroup.Creator],
		)
		.AddFunction(
			// A variadic argument refers to any 0-n arguments. `unknown` is our built in type for this function.
			// In typescript, this bound function would be typed like `(context: ZirconContext, ...args: readonly unknown[]): void`
			// So this would be equivalent to the Roblox 'print' function.
			new ZirconFunctionBuilder("print").AddVariadicArgument("unknown").Bind((context, ...args) => {
				context.LogInfo(args.map(tostring).join(" "));
			}),
			[ZirconDefaultGroup.User],
		)
		.AddFunction(
			// This is a function that takes one argument, a string. It sends back a message using message templates.
			// In general, you could chain 'AddArgument's multiple times, then at the end if you want a variadic argument use 'AddVariadicArgument'
			// It's a bit like explicitly declaring a function. This all helps the Zircon type system understand what arguments you want + enforce the types of them
			new ZirconFunctionBuilder("say").AddArgument("string").Bind((context, message) => {
				context.LogInfo("Zircon says '{Message}'", message);
			}),
			[ZirconDefaultGroup.User],
		)
		.Build(),
);
