"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.###PLUGIN_ID###;

	$$$
	// Ignore this: ###PLUGIN_IS_OBJECT_TYPE###
	$$${
	PLUGIN_CLASS.Instance = class ###PLUGIN_ID###Instance extends SDK.IInstanceBase
	$$$}
	$$$

	$$$
	// Ignore this: ###PLUGIN_IS_WORLD_TYPE###	
	$$${
	PLUGIN_CLASS.Instance = class ###PLUGIN_ID###Instance extends SDK.SDK.IWorldInstanceBase
	$$$}
	$$$
	{
		constructor(sdkType, inst)
		{
			super(sdkType, inst);
		}
		
		Release()
		{
		}
		
		OnCreate()
		{
		}
		
		OnPropertyChanged(id, value)
		{
		}
		
		LoadC2Property(name, valueString)
		{
			return false;		// not handled
		}
	};
}