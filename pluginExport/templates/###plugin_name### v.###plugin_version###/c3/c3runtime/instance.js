"use strict";

###ROUTINES###

{
	C3.Plugins.###PLUGIN_ID###.Instance = class ###PLUGIN_ID###Instance extends C3.SDKInstanceBase
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