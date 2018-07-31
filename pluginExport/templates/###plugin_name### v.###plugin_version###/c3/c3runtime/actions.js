"use strict";

{
var ActsObject = 
{
$$$ DOMAIN="ACE" DELIMITER="," WHERE ACES_C3_JSON_TYPE="actions"
###SCRIPT###
$$$
};

	C3.Plugins.###PLUGIN_ID###.Acts = {};

	for( var k in ActsObject )
	{
		C3.Plugins.###PLUGIN_ID###.Acts[k] = ActsObject[k];
	}
}

C3.Plugins.###PLUGIN_ID###.Instance.prototype.ACTS = C3.Plugins.###PLUGIN_ID###.Acts;
