"use strict";

{
	var ExpsObject =
	{
$$$ DOMAIN="ACE" DELIMITER="," WHERE ACES_C3_JSON_TYPE="expressions"
###SCRIPT_C3_RUNTIME###
$$$
	};

	C3.Plugins.###PLUGIN_ID###.Exps = {};

	for( var k in ExpsObject )
	{
		C3.Plugins.###PLUGIN_ID###.Exps[k] = ExpsObject[k];
	}

}

C3.Plugins.###PLUGIN_ID###.Instance.prototype.EXPS = C3.Plugins.###PLUGIN_ID###.Exps;