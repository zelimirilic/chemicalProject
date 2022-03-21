var fs = require('fs');

module.exports = {
	publicPath: process.env.NODE_ENV === "production" ? "/iChemistry/Scripts/chemsoft/dist/" : "/",
	devServer: {
		https: {
			key: fs.readFileSync('localhost.key', 'utf8'),
			cert: fs.readFileSync('localhost.crt', 'utf8'),
		},
	}
  };
  
  