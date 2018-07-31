"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.###PLUGIN_ID###;
	
	PLUGIN_CLASS.Type = class ###PLUGIN_ID###Type extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}