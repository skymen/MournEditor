"use strict";

###ROUTINES###

{
	$$$
	// Ignore this: ###PLUGIN_IS_OBJECT_TYPE###
	$$${
	C3.Plugins.###PLUGIN_ID###.Instance = class ###PLUGIN_ID###Instance extends C3.SDKInstanceBase
	$$$}
	$$$

	$$$
	// Ignore this: ###PLUGIN_IS_WORLD_TYPE###	
	$$${
	C3.Plugins.###PLUGIN_ID###.Instance = class ###PLUGIN_ID###Instance extends C3.SDKWorldInstanceBase
	$$$}
	$$$
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Backward compatibility for C2 runtime
			this.properties = properties;

			###INSTANCE_CONSTRUCTOR_BODY###
		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				// data to be saved for savegames
			};
		}
		
		LoadFromJson(o)
		{
			// load state for savegames
		}
	};


	var InstanceFunctionsObject = ###INSTANCE_OBJECT###
	for( var k in InstanceFunctionsObject )
	{
		C3.Plugins.###PLUGIN_ID###.Instance.prototype[k] = InstanceFunctionsObject[k];
	}
	
}