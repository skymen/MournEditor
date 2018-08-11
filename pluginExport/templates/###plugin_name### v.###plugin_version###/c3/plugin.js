"use strict";


{
	////////////////////////////////////////////
	// The plugin ID is how Construct identifies different kinds of plugins.
	// *** NEVER CHANGE THE PLUGIN ID! ***
	// If you change the plugin ID after releasing the plugin, Construct will think it is an entirely different
	// plugin and assume it is incompatible with the old one, and YOU WILL BREAK ALL EXISTING PROJECTS USING THE PLUGIN.
	// Only the plugin name is displayed in the editor, so to rename your plugin change the name but NOT the ID.
	// If you want to completely replace a plugin, make it deprecated (it will be hidden but old projects keep working),
	// and create an entirely new plugin with a different plugin ID.
	const PLUGIN_ID = "###PLUGIN_ID###";
	////////////////////////////////////////////
	
	const PLUGIN_VERSION = "###PLUGIN_VERSION###";
	const PLUGIN_CATEGORY = "###PLUGIN_CATEGORY_C3###";
	
	const PLUGIN_CLASS = SDK.Plugins.###PLUGIN_ID### = class ###PLUGIN_ID### extends SDK.IPluginBase
	{
		constructor()
		{
			super(PLUGIN_ID);
			
			SDK.Lang.PushContext("plugins." + PLUGIN_ID.toLowerCase());
			
			this._info.SetName(lang(".name"));
			this._info.SetDescription(lang(".description"));
			this._info.SetVersion(PLUGIN_VERSION);
			this._info.SetCategory(PLUGIN_CATEGORY);
			this._info.SetAuthor("###PLUGIN_AUTHOR###");
			this._info.SetHelpUrl(lang(".help-url"));

			$$$ DOMAIN="FILE_DEPENDENCIES" 
			this._info.AddFileDependency(
			{
				filename: "###FILENAME###",
				type: "###TYPE###"
				,fileType: "###FILETYPE###"
				,platform: "###PLATFORM###"
			});
			$$$
			$$$ DOMAIN="CORDOVA_PLUGIN_DEPENDENCIES" 
			this._info.AddCordovaPluginReference(
			{
				id: "###ID###"
				,version: "###VERSION###"
				,platform: "###PLATFORM###"
			});
			$$$
			$$$ DOMAIN="REMOTE_SCRIPT_DEPENDENCIES" 
			this._info.AddRemoteScriptDependency("###URL###");
			$$$
			$$$
			// Ignore this: ###PLUGIN_IS_OBJECT_TYPE###	
			this._info.SetPluginType("object");
			$$$
			$$$
			// Ignore this: ###PLUGIN_IS_WORLD_TYPE###	
			this._info.SetPluginType("world");
			$$$

			this._info.SetIsSingleGlobal(###PLUGIN_ISSINGLEGLOBAL_C3###);
			this._info.SetCanBeBundled(###PLUGIN_CANBEBUNDELED_C3###);
			this._info.SetIsResizable(###PLUGIN_ISRESIZABLE_C3###);
			this._info.SetIsRotatable(###PLUGIN_ISROTATABLE###);
			this._info.SetHasImage(###PLUGIN_HASIMAGE_C3###);
			this._info.SetIsTiled(###PLUGIN_ISTILED_C3###);
			this._info.SetIsDeprecated(###PLUGIN_ISDEPRECATED_C3###);
			this._info.SetSupportsEffects(###PLUGIN_SUPPORTSEFFECTS_C3###);
			this._info.SetMustPreDraw(###PLUGIN_MUSTPREDRAW_C3###);
			
			$$$
			// Ignore this: ###PLUGIN_AddCommonPositionACEs_C3###
			this._info.AddCommonPositionACEs();
			$$$
			$$$
			// Ignore this: ###PLUGIN_AddCommonSizeACEs_C3###
			this._info.AddCommonSizeACEs();
			$$$
			$$$
			// Ignore this: ###PLUGIN_AddCommonAngleACEs_C3###
			this._info.AddCommonAngleACEs();
			$$$
			$$$
			// Ignore this: ###PLUGIN_AddCommonAppearanceACEs_C3###
			this._info.AddCommonAppearanceACEs();
			$$$
			$$$
			// Ignore this: ###PLUGIN_AddCommonZOrderACEs_C3###
			this._info.AddCommonZOrderACEs();
			$$$
		
			// Support both the C2 and C3 runtimes
			this._info.SetSupportedRuntimes([###PLUGIN_SUPPORTED_RUNTIMES###]);
			
			SDK.Lang.PushContext(".properties");
			
			this._info.SetProperties([
				$$$ DOMAIN="PROPS" DELIMITER="," 
				new SDK.PluginProperty("###TYPE_C3###", "###ID_C3###", ###INIT_VALUE###)
				$$$
			]);
			
			SDK.Lang.PopContext();		// .properties
			
			SDK.Lang.PopContext();
		}
	};
	
	PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS);
}