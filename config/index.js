// see https://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
	build: {
		env                     : require('./prod.env'),
		index                   : path.resolve(__dirname, '../dist/index.html'),
		assetsRoot              : path.resolve(__dirname, '../dist'),
		assetsSubDirectory      : 'static',
		assetsPublicPath        : './',
		productionSourceMap     : false,
		// Gzip off by default as many popular static hosts such as
		// Surge or Netlify already gzip all static assets for you.
		// Before setting to `true`, make sure to:
		// npm install --save-dev comtestssion-webpack-plugin
		productionGzip          : false,
		productionGzipExtensions: ['js', 'css'],
		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build --report`
		// Set to `true` or `false` to always turn it on or off
		bundleAnalyzerReport    : process.env.npm_config_report
	},
	dev  : {
		env               : require('./dev.env'),
		port              : 8082,
		autoOpenBrowser   : true,
		assetsSubDirectory: 'static',
		assetsPublicPath  : '/',
    proxyTable: {
	      //proxy all requests starting with /api to jsonplaceholder
	      //proxy the request /api/posts/1 to https://jsonplaceholder.typicode.com/posts/1.
	      '/mp': {
					target: 'https://testuser.ipsebe.com',
					changeOrigin: true,
					pathRewrite: {
						// '^/portalsite-cnsebe': '/portalsite-cnsebe'
						'^/mp': ''
					},
					cookieDomainRewrite: "",
	      },
	      '/steward': {
					target: 'https://testuser.ipsebe.com',
					changeOrigin: true,
					pathRewrite: {
						// '^/portalsite-cnsebe': '/portalsite-cnsebe'
						'^/steward': '/steward'
					},
					cookieDomainRewrite: "",
	      },
	      // 商标自助注册项目
	      '/ipp/tmselfregist': {
	          target: 'https://testwww.ipsebe.com',
	          changeOrigin: true,
	          pathRewrite: {
	              '^/ipp/tmselfregist': '/tmselfregist'
	          },
	          cookieDomainRewrite: "",
	      },
	      '/weixin': {
	          target: 'https://testwechat.ipsebe.com',
	          changeOrigin: true,
	          pathRewrite: {
	              // '^/portalsite-cnsebe': '/portalsite-cnsebe'
	              '^/weixin': '/weixin'
	          },
	          cookieDomainRewrite: "",
	      },
	      '/portalsite-cnsebe': {
	          // target: 'https://192.168.1.123:8082',
	          target: 'https://testcart.ipsebe.com',
	          //target: 'https://www.ipsebe.com',
	          changeOrigin: true,
	          pathRewrite: {
	              // '^/portalsite-cnsebe': '/portalsite-cnsebe'
	              // '^/iprp_portal': ''
	              '^/portalsite-cnsebe': ''
	          },
	          cookieDomainRewrite: "",
	      },
	      '/iprp_app': {
	          target: 'https://testiprp.ipsebe.com',
	          changeOrigin: true,
	          pathRewrite: {
	              '^/iprp_app': ''
	          },
	          cookieDomainRewrite: "",
	      },


	      '/iprp_portal/productweb': {
	          // target: 'https://192.168.1.123:8382',
	          target: 'https://testwww.ipsebe.com',
	          //target: 'https://www.ipsebe.com',
	          changeOrigin: true,
	          pathRewrite: {
	              // '^/portalsite-cnsebe': '/portalsite-cnsebe'
	              // '^/iprp_portal': ''
	              '^/iprp_portal/productweb': '/productweb'
	          },
	          cookieDomainRewrite: "",
	      },

	      '/ipp/productweb': {
	          // target: 'https://192.168.1.123:8382',
	          target: 'https://testwww.ipsebe.com',
	          //target: 'https://www.ipsebe.com',
	          changeOrigin: true,
	          pathRewrite: {
	              // '^/portalsite-cnsebe': '/portalsite-cnsebe'
	              // '^/iprp_portal': ''
	              '^/ipp/productweb': '/productweb'
	          },
	          cookieDomainRewrite: "",
	      },
	      '/ipp': {
	          // target: 'https://192.168.1.123:8382',
	          target: 'https://testwww.ipsebe.com',
	          //target: 'https://www.ipsebe.com',
	          changeOrigin: true,
	          pathRewrite: {
	              // '^/portalsite-cnsebe': '/portalsite-cnsebe'
	              // '^/iprp_portal': ''
	              '^/ipp': ''
	          },
	          cookieDomainRewrite: "",
	      },


	      '/iprp_portal': {
	          // target: 'http://192.168.1.138:8080',
	          target: 'https://testuser.ipsebe.com',
	          //target: 'https://www.ipsebe.com',
	          changeOrigin: true,
	          pathRewrite: {
	              // '^/portalsite-cnsebe': '/portalsite-cnsebe'
	              // '^/iprp_portal': ''
	              '^/iprp_portal': ''
	          },
	          cookieDomainRewrite: "",
	      },



	      '/iprp_portal/portalsite-cnsebe': {
	          // target: 'https://192.168.1.123:8382',
	          target: 'https://testwww.ipsebe.com',
	          //target: 'https://www.ipsebe.com',
	          changeOrigin: true,
	          pathRewrite: {
	              // '^/portalsite-cnsebe': '/portalsite-cnsebe'
	              // '^/iprp_portal': ''
	              '^/iprp_portal/portalsite-cnsebe': '/portalsite-cnsebe'
	          },
	          cookieDomainRewrite: "",
	      },

	      '/user': {
	          target: 'https://testuser.ipsebe.com',
	          changeOrigin: true,
	          pathRewrite: {
	              // '^/portalsite-cnsebe': '/portalsite-cnsebe'
	              '^/user': ''
	          },
	          cookieDomainRewrite: "",
	      },

	      '/portalsite-cnsebe/iprp_portal': {
	          // target: 'https://192.168.1.117:8280',
	          target: 'https://testuser.ipsebe.com',
	          changeOrigin: true,
	          pathRewrite: {
	              // '^/portalsite-cnsebe': '/portalsite-cnsebe'
	              '^/portalsite-cnsebe/iprp_portal': ''
	          },
	          cookieDomainRewrite: "",
	      },
	      '/trademark': {
	          // target: 'https://192.168.1.117:8280',
	          target: 'https://testuser.ipsebe.com',
	          changeOrigin: true,
	          pathRewrite: {
	              // '^/portalsite-cnsebe': '/portalsite-cnsebe'
	              '^/trademark': '/trademark'
	          },
	          cookieDomainRewrite: "",
	      },


	      '/ipp/portalsite-cnsebe': {
	          // target: 'https://192.168.1.123:8382',
	          target: 'https://testmarket.ipsebe.com',
	          //target: 'https://www.ipsebe.com',
	          changeOrigin: true,
	          pathRewrite: {
	              // '^/portalsite-cnsebe': '/portalsite-cnsebe'
	              // '^/iprp_portal': ''
	              '^/ipp/portalsite-cnsebe': '/portalsite-cnsebe'
	          },
	          cookieDomainRewrite: "",
	      },
	      

	      '/cz': {
		        // target: 'https://192.168.1.117:8280',
		        //target: 'https://192.168.1.155:8080',
		        target: 'https://testcz.ipsebe.com',
		        //target: 'https://www.ipsebe.com',
		        changeOrigin: true,
		        pathRewrite: {
		            // '^/portalsite-cnsebe': '/portalsite-cnsebe'
		            '^/cz': ''
		        },
						cookieDomainRewrite: "",
				},
				'/sp': {
	        // target: 'http://192.168.1.150:85',
	        target:  'https://testsp.ipsebe.com',
	        changeOrigin: true,
	        pathRewrite: {'^/sp' : ''},
	        cookieDomainRewrite: "",
	      }

		},
		// CSS Sourcemaps off by default because relative paths are "buggy"
		// with this option, according to the CSS-Loader README
		// (https://github.com/webpack/css-loader#sourcemaps)
		// In our experience, they generally work as expected,
		// just be aware of this issue when enabling this option.
		cssSourceMap      : false
	}
}
