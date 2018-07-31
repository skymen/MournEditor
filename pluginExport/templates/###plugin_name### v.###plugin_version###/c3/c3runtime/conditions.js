"use strict";

{
	var CndsObject =
	{
$$$ DOMAIN="ACE" DELIMITER="," WHERE ACES_C3_JSON_TYPE="conditions"
###SCRIPT###
$$$
	};	

	C3.Plugins.###PLUGIN_ID###.Cnds = {};

	for( var k in CndsObject )
	{
		C3.Plugins.###PLUGIN_ID###.Cnds[k] = CndsObject[k];
	}
}

C3.Plugins.###PLUGIN_ID###.Instance.prototype.CNDS = C3.Plugins.###PLUGIN_ID###.Cnds;
