var rootConfig = {
	rootUrl: '//user.ipsebe.com',
  indexUrl: '//www.ipsebe.com',
  cartUrl: '//cart.ipsebe.com',
  czUrl:'//cz.ipsebe.com',
  payUrl:'//iprp.ipsebe.com',
  userUrl: '//user.ipsebe.com',
  wxUrl:'//wechat.ipsebe.com',
  spUrl: '//sp.ipsebe.com',
  toolsUrl: '//tools.ipsebe.com',
  stewardUrl: '//user.ipsebe.com/steward',
  trademarkUrl:'//market.ipsebe.com',
};
if (location.host.indexOf('localhost') === 0) {
	rootConfig = {
	  rootUrl: '//' + location.host + '/iprp_portal',//ajax根路径
	  indexUrl: '//' + location.host + '/iprp',
	  cartUrl: '//' + location.host + '/portalsite-cnsebe',
	  czUrl:'//' + location.host + '/cz',
	  payUrl:'//' + location.host + '/iprp_app',
	  userUrl: '//' + location.host + '/iprp_portal',
	  wxUrl:'//' + location.host + '',
	  spUrl: '//' + location.host + '/sp',
	  toolsUrl: '//' + location.host + '/tools',
  	stewardUrl: '//' + location.host + '/steward',
  	trademarkUrl:'//' + location.host + '/premarket'
	};
}
if (location.host.indexOf('test') === 0) {
	rootConfig = {
	  rootUrl: '//testuser.ipsebe.com',
	  indexUrl: '//testwww.ipsebe.com',
	  cartUrl: '//testcart.ipsebe.com',
	  czUrl:'//testcz.ipsebe.com',
	  payUrl:'//testiprp.ipsebe.com',
	  userUrl: '//testuser.ipsebe.com',
	  wxUrl:'//testwechat.ipsebe.com',
	  spUrl: '//testsp.ipsebe.com',
	  toolsUrl: '//testtools.ipsebe.com',
  	stewardUrl: '//testuser.ipsebe.com/steward',
  	trademarkUrl:'//testmarket.ipsebe.com'
	};
}
if (location.host.indexOf('pre') === 0) {
	rootConfig = {
	  rootUrl: '//preuser.ipsebe.com',
	  indexUrl: '//prewww.ipsebe.com',
	  cartUrl: '//precart.ipsebe.com',
	  czUrl:'//precz.ipsebe.com',
	  payUrl:'//preiprp.ipsebe.com',
	  userUrl: '//preuser.ipsebe.com',
	  wxUrl:'//prewechat.ipsebe.com',
	  spUrl: '//presp.ipsebe.com',
	  toolsUrl: '//pretools.ipsebe.com',
  	stewardUrl: '//preuser.ipsebe.com/steward',
  	trademarkUrl:'//premarket.ipsebe.com'
	};
}

window.CONFIG = rootConfig;
