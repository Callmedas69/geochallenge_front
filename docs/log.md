2025-10-15T15:59:04.408Z [info] [farcaster] /og?nxtPid=5 status=200
2025-10-15T15:59:06.331Z [error] OG generation error:  ContractFunctionExecutionError: HTTP request failed.

Status: 403
URL: https://sepolia.base.org
Request body: {"method":"eth_call","params":[{"data":"0xf40364660000000000000000000000000000000000000000000000000000000000000005","to":"0xf920e5E886780587B6D09B804baa227155Ef2AB3"},"latest"]}
 
Raw Call Arguments:
  to:    0xf920e5E886780587B6D09B804baa227155Ef2AB3
  data:  0xf40364660000000000000000000000000000000000000000000000000000000000000005
 
Contract Call:
  address:   0xf920e5E886780587B6D09B804baa227155Ef2AB3
  function:  getCompetition(uint256 competitionId)
  args:                    (5)

Docs: https://viem.sh/docs/contract/readContract
Details: "<!DOCTYPE html>\n<!--[if lt IE 7]> <html class=\"no-js ie6 oldie\" lang=\"en-US\"> <![endif]-->\n<!--[if IE 7]>    <html class=\"no-js ie7 oldie\" lang=\"en-US\"> <![endif]-->\n<!--[if IE 8]>    <html class=\"no-js ie8 oldie\" lang=\"en-US\"> <![endif]-->\n<!--[if gt IE 8]><!--> <html class=\"no-js\" lang=\"en-US\"> <!--<![endif]-->\n<head>\n<title>Attention Required! | Cloudflare</title>\n<meta charset=\"UTF-8\" />\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n<meta http-equiv=\"X-UA-Compatible\" content=\"IE=Edge\" />\n<meta name=\"robots\" content=\"noindex, nofollow\" />\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\" />\n<link rel=\"stylesheet\" id=\"cf_styles-css\" href=\"/cdn-cgi/styles/cf.errors.css\" />\n<!--[if lt IE 9]><link rel=\"stylesheet\" id='cf_styles-ie-css' href=\"/cdn-cgi/styles/cf.errors.ie.css\" /><![endif]-->\n<style>body{margin:0;padding:0}</style>\n\n\n<!--[if gte IE 10]><!-->\n<script>\n  if (!navigator.cookieEnabled) {\n    window.addEventListener('DOMContentLoaded', function () {\n      var cookieEl = document.getElementById('cookie-alert');\n      cookieEl.style.display = 'block';\n    })\n  }\n</script>\n<!--<![endif]-->\n\n\n</head>\n<body>\n  <div id=\"cf-wrapper\">\n    <div class=\"cf-alert cf-alert-error cf-cookie-error\" id=\"cookie-alert\" data-translate=\"enable_cookies\">Please enable cookies.</div>\n    <div id=\"cf-error-details\" class=\"cf-error-details-wrapper\">\n      <div class=\"cf-wrapper cf-header cf-error-overview\">\n        <h1 data-translate=\"block_headline\">Sorry, you have been blocked</h1>\n        <h2 class=\"cf-subheadline\"><span data-translate=\"unable_to_access\">You are unable to access</span> base.org</h2>\n      </div><!-- /.header -->\n\n      <div class=\"cf-section cf-highlight\">\n        <div class=\"cf-wrapper\">\n          <div class=\"cf-screenshot-container cf-screenshot-full\">\n            \n              <span class=\"cf-no-screenshot error\"></span>\n            \n          </div>\n        </div>\n      </div><!-- /.captcha-container -->\n\n      <div class=\"cf-section cf-wrapper\">\n        <div class=\"cf-columns two\">\n          <div class=\"cf-column\">\n            <h2 data-translate=\"blocked_why_headline\">Why have I been blocked?</h2>\n\n            <p data-translate=\"blocked_why_detail\">This website is using a security service to protect itself from online attacks. The action you just performed triggered the security solution. There are several actions that could trigger this block including submitting a certain word or phrase, a SQL command or malformed data.</p>\n          </div>\n\n          <div class=\"cf-column\">\n            <h2 data-translate=\"blocked_resolve_headline\">What can I do to resolve this?</h2>\n\n            <p data-translate=\"blocked_resolve_detail\">You can email the site owner to let them know you were blocked. Please include what you were doing when this page came up and the Cloudflare Ray ID found at the bottom of this page.</p>\n          </div>\n        </div>\n      </div><!-- /.section -->\n\n      <div class=\"cf-error-footer cf-wrapper w-240 lg:w-full py-10 sm:py-4 sm:px-8 mx-auto text-center sm:text-left border-solid border-0 border-t border-gray-300\">\n  <p class=\"text-13\">\n    <span class=\"cf-footer-item sm:block sm:mb-1\">Cloudflare Ray ID: <strong class=\"font-semibold\">98f0858e788ae646</strong></span>\n    <span class=\"cf-footer-separator sm:hidden\">&bull;</span>\n    <span id=\"cf-footer-item-ip\" class=\"cf-footer-item hidden sm:block sm:mb-1\">\n      Your IP:\n      <button type=\"button\" id=\"cf-footer-ip-reveal\" class=\"cf-footer-ip-reveal-btn\">Click to reveal</button>\n      <span class=\"hidden\" id=\"cf-footer-ip\">18.206.87.82</span>\n      <span class=\"cf-footer-separator sm:hidden\">&bull;</span>\n    </span>\n    <span class=\"cf-footer-item sm:block sm:mb-1\"><span>Performance &amp; security by</span> <a rel=\"noopener noreferrer\" href=\"https://www.cloudflare.com/5xx-error-landing\" id=\"brand_link\" target=\"_blank\">Cloudflare</a></span>\n    \n  </p>\n  <script>(function(){function d(){var b=a.getElementById(\"cf-footer-item-ip\"),c=a.getElementById(\"cf-footer-ip-reveal\");b&&\"classList\"in b&&(b.classList.remove(\"hidden\"),c.addEventListener(\"click\",function(){c.classList.add(\"hidden\");a.getElementById(\"cf-footer-ip\").classList.remove(\"hidden\")}))}var a=document;document.addEventListener&&a.addEventListener(\"DOMContentLoaded\",d)})();</script>\n</div><!-- /.error-footer -->\n\n\n    </div><!-- /#cf-error-details -->\n  </div><!-- /#cf-wrapper -->\n\n  <script>\n  window._cf_translation = {};\n  \n  \n</script>\n\n</body>\n</html>\n"
Version: viem@2.37.8
    at (node_modules/viem/_esm/utils/errors/getContractError.js:30:0)
    at (node_modules/viem/_esm/actions/public/readContract.js:58:14)
    at (src/app/api/farcaster/competition/[id]/og/route.tsx:166:6)
    at (../../src/server/route-modules/app-route/module.ts:586:14)
    at (../../src/server/route-modules/app-route/module.ts:706:30)
    at (node_modules/next/dist/esm/server/web/edge-route-module-wrapper.js:88:0)
    at (node_modules/next/dist/esm/server/web/adapter.js:184:0) {
  cause:  CallExecutionError: HTTP request failed.

Status: 403
URL: https://sepolia.base.org
Request body: {"method":"eth_call","params":[{"data":"0xf40364660000000000000000000000000000000000000000000000000000000000000005","to":"0xf920e5E886780587B6D09B804baa227155Ef2AB3"},"latest"]}
 
Raw Call Arguments:
  to:    0xf920e5E886780587B6D09B804baa227155Ef2AB3
  data:  0xf40364660000000000000000000000000000000000000000000000000000000000000005

Details: "<!DOCTYPE html>\n<!--[if lt IE 7]> <html class=\"no-js ie6 oldie\" lang=\"en-US\"> <![endif]-->\n<!--[if IE 7]>    <html class=\"no-js ie7 oldie\" lang=\"en-US\"> <![endif]-->\n<!--[if IE 8]>    <html class=\"no-js ie8 oldie\" lang=\"en-US\"> <![endif]-->\n<!--[if gt IE 8]><!--> <html class=\"no-js\" lang=\"en-US\"> <!--<![endif]-->\n<head>\n<title>Attention Required! | Cloudflare</title>\n<meta charset=\"UTF-8\" />\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n<meta http-equiv=\"X-UA-Compatible\" content=\"IE=Edge\" />\n<meta name=\"robots\" content=\"noindex, nofollow\" />\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\" />\n<link rel=\"stylesheet\" id=\"cf_styles-css\" href=\"/cdn-cgi/styles/cf.errors.css\" />\n<!--[if lt IE 9]><link rel=\"stylesheet\" id='cf_styles-ie-css' href=\"/cdn-cgi/styles/cf.errors.ie.css\" /><![endif]-->\n<style>body{margin:0;padding:0}</style>\n\n\n<!--[if gte IE 10]><!-->\n<script>\n  if (!navigator.cookieEnabled) {\n    window.addEventListener('DOMContentLoaded', function () {\n      var cookieEl = document.getElementById('cookie-alert');\n      cookieEl.style.display = 'block';\n    })\n  }\n</script>\n<!--<![endif]-->\n\n\n</head>\n<body>\n  <div id=\"cf-wrapper\">\n    <div class=\"cf-alert cf-alert-error cf-cookie-error\" id=\"cookie-alert\" data-translate=\"enable_cookies\">Please enable cookies.</div>\n    <div id=\"cf-error-details\" class=\"cf-error-details-wrapper\">\n      <div class=\"cf-wrapper cf-header cf-error-overview\">\n        <h1 data-translate=\"block_headline\">Sorry, you have been blocked</h1>\n        <h2 class=\"cf-subheadline\"><span data-translate=\"unable_to_access\">You are unable to access</span> base.org</h2>\n      </div><!-- /.header -->\n\n      <div class=\"cf-section cf-highlight\">\n        <div class=\"cf-wrapper\">\n          <div class=\"cf-screenshot-container cf-screenshot-full\">\n            \n              <span class=\"cf-no-screenshot error\"></span>\n            \n          </div>\n        </div>\n      </div><!-- /.captcha-container -->\n\n      <div class=\"cf-section cf-wrapper\">\n        <div class=\"cf-columns two\">\n          <div class=\"cf-column\">\n            <h2 data-translate=\"blocked_why_headline\">Why have I been blocked?</h2>\n\n            <p data-translate=\"blocked_why_detail\">This website is using a security service to protect itself from online attacks. The action you just performed triggered the security solution. There are several actions that could trigger this block including submitting a certain word or phrase, a SQL command or malformed data.</p>\n          </div>\n\n          <div class=\"cf-column\">\n            <h2 data-translate=\"blocked_resolve_headline\">What can I do to resolve this?</h2>\n\n            <p data-translate=\"blocked_resolve_detail\">You can email the site owner to let them know you were blocked. Please include what you were doing when this page came up and the Cloudflare Ray ID found at the bottom of this page.</p>\n          </div>\n        </div>\n      </div><!-- /.section -->\n\n      <div class=\"cf-error-footer cf-wrapper w-240 lg:w-full py-10 sm:py-4 sm:px-8 mx-auto text-center sm:text-left border-solid border-0 border-t border-gray-300\">\n  <p class=\"text-13\">\n    <span class=\"cf-footer-item sm:block sm:mb-1\">Cloudflare Ray ID: <strong class=\"font-semibold\">98f0858e788ae646</strong></span>\n    <span class=\"cf-footer-separator sm:hidden\">&bull;</span>\n    <span id=\"cf-footer-item-ip\" class=\"cf-footer-item hidden sm:block sm:mb-1\">\n      Your IP:\n      <button type=\"button\" id=\"cf-footer-ip-reveal\" class=\"cf-footer-ip-reveal-btn\">Click to reveal</button>\n      <span class=\"hidden\" id=\"cf-footer-ip\">18.206.87.82</span>\n      <span class=\"cf-footer-separator sm:hidden\">&bull;</span>\n    </span>\n    <span class=\"cf-footer-item sm:block sm:mb-1\"><span>Performance &amp; security by</span> <a rel=\"noopener noreferrer\" href=\"https://www.cloudflare.com/5xx-error-landing\" id=\"brand_link\" target=\"_blank\">Cloudflare</a></span>\n    \n  </p>\n  <script>(function(){function d(){var b=a.getElementById(\"cf-footer-item-ip\"),c=a.getElementById(\"cf-footer-ip-reveal\");b&&\"classList\"in b&&(b.classList.remove(\"hidden\"),c.addEventListener(\"click\",function(){c.classList.add(\"hidden\");a.getElementById(\"cf-footer-ip\").classList.remove(\"hidden\")}))}var a=document;document.addEventListener&&a.addEventListener(\"DOMContentLoaded\",d)})();</script>\n</div><!-- /.error-footer -->\n\n\n    </div><!-- /#cf-error-details -->\n  </div><!-- /#cf-wrapper -->\n\n  <script>\n  window._cf_translation = {};\n  \n  \n</script>\n\n</body>\n</html>\n"
Version: viem@2.37.8
    at (node_modules/viem/_esm/utils/errors/getCallError.js:11:0)
    at (node_modules/viem/_esm/actions/public/call.js:149:26)
    at (node_modules/viem/_esm/actions/public/readContract.js:45:23)
    at (src/app/api/farcaster/competition/[id]/og/route.tsx:166:6)
    at (../../src/server/route-modules/app-route/module.ts:586:14)
    at (../../src/server/route-modules/app-route/module.ts:706:30)
    at (node_modules/next/dist/esm/server/web/edge-route-module-wrapper.js:88:0)
    at (node_modules/next/dist/esm/server/web/adapter.js:184:0) {
  cause:  HttpRequestError: HTTP request failed.

Status: 403
URL: https://sepolia.base.org
Request body: {"method":"eth_call","params":[{"data":"0xf40364660000000000000000000000000000000000000000000000000000000000000005","to":"0xf920e5E886780587B6D09B804baa227155Ef2AB3"},"latest"]}

Details: "<!DOCTYPE html>\n<!--[if lt IE 7]> <html class=\"no-js ie6 oldie\" lang=\"en-US\"> <![endif]-->\n<!--[if IE 7]>    <html class=\"no-js ie7 oldie\" lang=\"en-US\"> <![endif]-->\n<!--[if IE 8]>    <html class=\"no-js ie8 oldie\" lang=\"en-US\"> <![endif]-->\n<!--[if gt IE 8]><!--> <html class=\"no-js\" lang=\"en-US\"> <!--<![endif]-->\n<head>\n<title>Attention Required! | Cloudflare</title>\n<meta charset=\"UTF-8\" />\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n<meta http-equiv=\"X-UA-Compatible\" content=\"IE=Edge\" />\n<meta name=\"robots\" content=\"noindex, nofollow\" />\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\" />\n<link rel=\"stylesheet\" id=\"cf_styles-css\" href=\"/cdn-cgi/styles/cf.errors.css\" />\n<!--[if lt IE 9]><link rel=\"stylesheet\" id='cf_styles-ie-css' href=\"/cdn-cgi/styles/cf.errors.ie.css\" /><![endif]-->\n<style>body{margin:0;padding:0}</style>\n\n\n<!--[if gte IE 10]><!-->\n<script>\n  if (!navigator.cookieEnabled) {\n    window.addEventListener('DOMContentLoaded', function () {\n      var cookieEl = document.getElementById('cookie-alert');\n      cookieEl.style.display = 'block';\n    })\n  }\n</script>\n<!--<![endif]-->\n\n\n</head>\n<body>\n  <div id=\"cf-wrapper\">\n    <div class=\"cf-alert cf-alert-error cf-cookie-error\" id=\"cookie-alert\" data-translate=\"enable_cookies\">Please enable cookies.</div>\n    <div id=\"cf-error-details\" class=\"cf-error-details-wrapper\">\n      <div class=\"cf-wrapper cf-header cf-error-overview\">\n        <h1 data-translate=\"block_headline\">Sorry, you have been blocked</h1>\n        <h2 class=\"cf-subheadline\"><span data-translate=\"unable_to_access\">You are unable to access</span> base.org</h2>\n      </div><!-- /.header -->\n\n      <div class=\"cf-section cf-highlight\">\n        <div class=\"cf-wrapper\">\n          <div class=\"cf-screenshot-container cf-screenshot-full\">\n            \n              <span class=\"cf-no-screenshot error\"></span>\n            \n          </div>\n        </div>\n      </div><!-- /.captcha-container -->\n\n      <div class=\"cf-section cf-wrapper\">\n        <div class=\"cf-columns two\">\n          <div class=\"cf-column\">\n            <h2 data-translate=\"blocked_why_headline\">Why have I been blocked?</h2>\n\n            <p data-translate=\"blocked_why_detail\">This website is using a security service to protect itself from online attacks. The action you just performed triggered the security solution. There are several actions that could trigger this block including submitting a certain word or phrase, a SQL command or malformed data.</p>\n          </div>\n\n          <div class=\"cf-column\">\n            <h2 data-translate=\"blocked_resolve_headline\">What can I do to resolve this?</h2>\n\n            <p data-translate=\"blocked_resolve_detail\">You can email the site owner to let them know you were blocked. Please include what you were doing when this page came up and the Cloudflare Ray ID found at the bottom of this page.</p>\n          </div>\n        </div>\n      </div><!-- /.section -->\n\n      <div class=\"cf-error-footer cf-wrapper w-240 lg:w-full py-10 sm:py-4 sm:px-8 mx-auto text-center sm:text-left border-solid border-0 border-t border-gray-300\">\n  <p class=\"text-13\">\n    <span class=\"cf-footer-item sm:block sm:mb-1\">Cloudflare Ray ID: <strong class=\"font-semibold\">98f0858e788ae646</strong></span>\n    <span class=\"cf-footer-separator sm:hidden\">&bull;</span>\n    <span id=\"cf-footer-item-ip\" class=\"cf-footer-item hidden sm:block sm:mb-1\">\n      Your IP:\n      <button type=\"button\" id=\"cf-footer-ip-reveal\" class=\"cf-footer-ip-reveal-btn\">Click to reveal</button>\n      <span class=\"hidden\" id=\"cf-footer-ip\">18.206.87.82</span>\n      <span class=\"cf-footer-separator sm:hidden\">&bull;</span>\n    </span>\n    <span class=\"cf-footer-item sm:block sm:mb-1\"><span>Performance &amp; security by</span> <a rel=\"noopener noreferrer\" href=\"https://www.cloudflare.com/5xx-error-landing\" id=\"brand_link\" target=\"_blank\">Cloudflare</a></span>\n    \n  </p>\n  <script>(function(){function d(){var b=a.getElementById(\"cf-footer-item-ip\"),c=a.getElementById(\"cf-footer-ip-reveal\");b&&\"classList\"in b&&(b.classList.remove(\"hidden\"),c.addEventListener(\"click\",function(){c.classList.add(\"hidden\");a.getElementById(\"cf-footer-ip\").classList.remove(\"hidden\")}))}var a=document;document.addEventListener&&a.addEventListener(\"DOMContentLoaded\",d)})();</script>\n</div><!-- /.error-footer -->\n\n\n    </div><!-- /#cf-error-details -->\n  </div><!-- /#cf-wrapper -->\n\n  <script>\n  window._cf_translation = {};\n  \n  \n</script>\n\n</body>\n</html>\n"
Version: viem@2.37.8
    at (node_modules/viem/_esm/utils/rpc/http.js:62:0)
    at (node_modules/viem/_esm/clients/transports/http.js:47:0)
    at (node_modules/viem/_esm/clients/transports/http.js:51:40)
    at (node_modules/viem/_esm/utils/buildRequest.js:28:0)
    at (node_modules/viem/_esm/utils/promise/withRetry.js:12:0) {
  details: '"<!DOCTYPE html>\\n<!--[if lt IE 7]> <html class=\\"no-js ie6 oldie\\" lang=\\"en-US\\"> <![endif]-->\\n<!--[if IE 7]>    <html class=\\"no-js ie7 oldie\\" lang=\\"en-US\\"> <![endif]-->\\n<!--[if IE 8]>    <html class=\\"no-js ie8 oldie\\" lang=\\"en-US\\"> <![endif]-->\\n<!--[if gt IE 8]><!--> <html class=\\"no-js\\" lang=\\"en-US\\"> <!--<![endif]-->\\n<head>\\n<title>Attention Required! | Cloudflare</title>\\n<meta charset=\\"UTF-8\\" />\\n<meta http-equiv=\\"Content-Type\\" content=\\"text/html; charset=UTF-8\\" />\\n<meta http-equiv=\\"X-UA-Compatible\\" content=\\"IE=Edge\\" />\\n<meta name=\\"robots\\" content=\\"noindex, nofollow\\" />\\n<meta name=\\"viewport\\" content=\\"width=device-width,initial-scale=1\\" />\\n<link rel=\\"stylesheet\\" id=\\"cf_styles-css\\" href=\\"/cdn-cgi/styles/cf.errors.css\\" />\\n<!--[if lt IE 9]><link rel=\\"stylesheet\\" id=\'cf_styles-ie-css\' href=\\"/cdn-cgi/styles/cf.errors.ie.css\\" /><![endif]-->\\n<style>body{margin:0;padding:0}</style>\\n\\n\\n<!--[if gte IE 10]><!-->\\n<script>\\n  if (!navigator.cookieEnabled) {\\n    window.addEventListener(\'DOMContentLoaded\', function () {\\n      var cookieEl = document.getElementById(\'cookie-alert\');\\n      cookieEl.style.display = \'block\';\\n    })\\n  }\\n</script>\\n<!--<![endif]-->\\n\\n\\n</head>\\n<body>\\n  <div id=\\"cf-wrapper\\">\\n    <div class=\\"cf-alert cf-alert-error cf-cookie-error\\" id=\\"cookie-alert\\" data-translate=\\"enable_cookies\\">Please enable cookies.</div>\\n    <div id=\\"cf-error-details\\" class=\\"cf-error-details-wrapper\\">\\n      <div class=\\"cf-wrapper cf-header cf-error-overview\\">\\n        <h1 data-translate=\\"block_headline\\">Sorry, you have been blocked</h1>\\n        <h2 class=\\"cf-subheadline\\"><span data-translate=\\"unable_to_access\\">You are unable to access</span> base.org</h2>\\n      </div><!-- /.header -->\\n\\n      <div class=\\"cf-section cf-highlight\\">\\n        <div class=\\"cf-wrapper\\">\\n          <div class=\\"cf-screenshot-container cf-screenshot-full\\">\\n            \\n              <span class=\\"cf-no-screenshot error\\"></span>\\n            \\n          </div>\\n        </div>\\n      </div><!-- /.captcha-container -->\\n\\n      <div class=\\"cf-section cf-wrapper\\">\\n        <div class=\\"cf-columns two\\">\\n          <div class=\\"cf-column\\">\\n            <h2 data-translate=\\"blocked_why_headline\\">Why have I been blocked?</h2>\\n\\n            <p data-translate=\\"blocked_why_detail\\">This website is using a security service to protect itself from online attacks. The action you just performed triggered the security solution. There are several actions that could trigger this block including submitting a certain word or phrase, a SQL command or malformed data.</p>\\n          </div>\\n\\n          <div class=\\"cf-column\\">\\n            <h2 data-translate=\\"blocked_resolve_headline\\">What can I do to resolve this?</h2>\\n\\n            <p data-translate=\\"blocked_resolve_detail\\">You can email the site owner to let them know you were blocked. Please include what you were doing when this page came up and the Cloudflare Ray ID found at the bottom of this page.</p>\\n          </div>\\n        </div>\\n      </div><!-- /.section -->\\n\\n      <div class=\\"cf-error-footer cf-wrapper w-240 lg:w-full py-10 sm:py-4 sm:px-8 mx-auto text-center sm:text-left border-solid border-0 border-t border-gray-300\\">\\n  <p class=\\"text-13\\">\\n    <span class=\\"cf-footer-item sm:block sm:mb-1\\">Cloudflare Ray ID: <strong class=\\"font-semibold\\">98f0858e788ae646</strong></span>\\n    <span class=\\"cf-footer-separator sm:hidden\\">&bull;</span>\\n    <span id=\\"cf-footer-item-ip\\" class=\\"cf-footer-item hidden sm:block sm:mb-1\\">\\n      Your IP:\\n      <button type=\\"button\\" id=\\"cf-footer-ip-reveal\\" class=\\"cf-footer-ip-reveal-btn\\">Click to reveal</button>\\n      <span class=\\"hidden\\" id=\\"cf-footer-ip\\">18.206.87.82</span>\\n      <span class=\\"cf-footer-separator sm:hidden\\">&bull;</span>\\n    </span>\\n    <span class=\\"cf-footer-item sm:block sm:mb-1\\"><span>Performance &amp; security by</span> <a rel=\\"noopener noreferrer\\" href=\\"https://www.cloudflare.com/5xx-error-landing\\" id=\\"brand_link\\" target=\\"_blank\\">Cloudflare</a></span>\\n    \\n  </p>\\n  <script>(function(){function d(){var b=a.getElementById(\\"cf-footer-item-ip\\"),c=a.getElementById(\\"cf-footer-ip-reveal\\");b&&\\"classList\\"in b&&(b.classList.remove(\\"hidden\\"),c.addEventListener(\\"click\\",function(){c.classList.add(\\"hidden\\");a.getElementById(\\"cf-footer-ip\\").classList.remove(\\"hidden\\")}))}var a=document;document.addEventListener&&a.addEventListener(\\"DOMContentLoaded\\",d)})();</script>\\n</div><!-- /.error-footer -->\\n\\n\\n    </div><!-- /#cf-error-details -->\\n  </div><!-- /#cf-wrapper -->\\n\\n  <script>\\n  window._cf_translation = {};\\n  \\n  \\n</script>\\n\\n</body>\\n</html>\\n"',
  docsPath: undefined,
  metaMessages: [
  'Status: 403',
  'URL: https://sepolia.base.org',
  'Request body: {"method":"eth_call","params":[{"data":"0xf40364660000000000000000000000000000000000000000000000000000000000000005","to":"0xf920e5E886780587B6D09B804baa227155Ef2AB3"},"latest"]}'
],
  shortMessage: 'HTTP request failed.',
  version: '2.37.8',
  name: 'HttpRequestError',
  body: {
  method: 'eth_call',
  params: [
  {
  data: '0xf40364660000000000000000000000000000000000000000000000000000000000000005',
  to: '0xf920e5E886780587B6D09B804baa227155Ef2AB3'
},
  'latest'
]
},
  headers: Headers {  },
  status: 403,
  url: 'https://sepolia.base.org'
},
  details: '"<!DOCTYPE html>\\n<!--[if lt IE 7]> <html class=\\"no-js ie6 oldie\\" lang=\\"en-US\\"> <![endif]-->\\n<!--[if IE 7]>    <html class=\\"no-js ie7 oldie\\" lang=\\"en-US\\"> <![endif]-->\\n<!--[if IE 8]>    <html class=\\"no-js ie8 oldie\\" lang=\\"en-US\\"> <![endif]-->\\n<!--[if gt IE 8]><!--> <html class=\\"no-js\\" lang=\\"en-US\\"> <!--<![endif]-->\\n<head>\\n<title>Attention Required! | Cloudflare</title>\\n<meta charset=\\"UTF-8\\" />\\n<meta http-equiv=\\"Content-Type\\" content=\\"text/html; charset=UTF-8\\" />\\n<meta http-equiv=\\"X-UA-Compatible\\" content=\\"IE=Edge\\" />\\n<meta name=\\"robots\\" content=\\"noindex, nofollow\\" />\\n<meta name=\\"viewport\\" content=\\"width=device-width,initial-scale=1\\" />\\n<link rel=\\"stylesheet\\" id=\\"cf_styles-css\\" href=\\"/cdn-cgi/styles/cf.errors.css\\" />\\n<!--[if lt IE 9]><link rel=\\"stylesheet\\" id=\'cf_styles-ie-css\' href=\\"/cdn-cgi/styles/cf.errors.ie.css\\" /><![endif]-->\\n<style>body{margin:0;padding:0}</style>\\n\\n\\n<!--[if gte IE 10]><!-->\\n<script>\\n  if (!navigator.cookieEnabled) {\\n    window.addEventListener(\'DOMContentLoaded\', function () {\\n      var cookieEl = document.getElementById(\'cookie-alert\');\\n      cookieEl.style.display = \'block\';\\n    })\\n  }\\n</script>\\n<!--<![endif]-->\\n\\n\\n</head>\\n<body>\\n  <div id=\\"cf-wrapper\\">\\n    <div class=\\"cf-alert cf-alert-error cf-cookie-error\\" id=\\"cookie-alert\\" data-translate=\\"enable_cookies\\">Please enable cookies.</div>\\n    <div id=\\"cf-error-details\\" class=\\"cf-error-details-wrapper\\">\\n      <div class=\\"cf-wrapper cf-header cf-error-overview\\">\\n        <h1 data-translate=\\"block_headline\\">Sorry, you have been blocked</h1>\\n        <h2 class=\\"cf-subheadline\\"><span data-translate=\\"unable_to_access\\">You are unable to access</span> base.org</h2>\\n      </div><!-- /.header -->\\n\\n      <div class=\\"cf-section cf-highlight\\">\\n        <div class=\\"cf-wrapper\\">\\n          <div class=\\"cf-screenshot-container cf-screenshot-full\\">\\n            \\n              <span class=\\"cf-no-screenshot error\\"></span>\\n            \\n          </div>\\n        </div>\\n      </div><!-- /.captcha-container -->\\n\\n      <div class=\\"cf-section cf-wrapper\\">\\n        <div class=\\"cf-columns two\\">\\n          <div class=\\"cf-column\\">\\n            <h2 data-translate=\\"blocked_why_headline\\">Why have I been blocked?</h2>\\n\\n            <p data-translate=\\"blocked_why_detail\\">This website is using a security service to protect itself from online attacks. The action you just performed triggered the security solution. There are several actions that could trigger this block including submitting a certain word or phrase, a SQL command or malformed data.</p>\\n          </div>\\n\\n          <div class=\\"cf-column\\">\\n            <h2 data-translate=\\"blocked_resolve_headline\\">What can I do to resolve this?</h2>\\n\\n            <p data-translate=\\"blocked_resolve_detail\\">You can email the site owner to let them know you were blocked. Please include what you were doing when this page came up and the Cloudflare Ray ID found at the bottom of this page.</p>\\n          </div>\\n        </div>\\n      </div><!-- /.section -->\\n\\n      <div class=\\"cf-error-footer cf-wrapper w-240 lg:w-full py-10 sm:py-4 sm:px-8 mx-auto text-center sm:text-left border-solid border-0 border-t border-gray-300\\">\\n  <p class=\\"text-13\\">\\n    <span class=\\"cf-footer-item sm:block sm:mb-1\\">Cloudflare Ray ID: <strong class=\\"font-semibold\\">98f0858e788ae646</strong></span>\\n    <span class=\\"cf-footer-separator sm:hidden\\">&bull;</span>\\n    <span id=\\"cf-footer-item-ip\\" class=\\"cf-footer-item hidden sm:block sm:mb-1\\">\\n      Your IP:\\n      <button type=\\"button\\" id=\\"cf-footer-ip-reveal\\" class=\\"cf-footer-ip-reveal-btn\\">Click to reveal</button>\\n      <span class=\\"hidden\\" id=\\"cf-footer-ip\\">18.206.87.82</span>\\n      <span class=\\"cf-footer-separator sm:hidden\\">&bull;</span>\\n    </span>\\n    <span class=\\"cf-footer-item sm:block sm:mb-1\\"><span>Performance &amp; security by</span> <a rel=\\"noopener noreferrer\\" href=\\"https://www.cloudflare.com/5xx-error-landing\\" id=\\"brand_link\\" target=\\"_blank\\">Cloudflare</a></span>\\n    \\n  </p>\\n  <script>(function(){function d(){var b=a.getElementById(\\"cf-footer-item-ip\\"),c=a.getElementById(\\"cf-footer-ip-reveal\\");b&&\\"classList\\"in b&&(b.classList.remove(\\"hidden\\"),c.addEventListener(\\"click\\",function(){c.classList.add(\\"hidden\\");a.getElementById(\\"cf-footer-ip\\").classList.remove(\\"hidden\\")}))}var a=document;document.addEventListener&&a.addEventListener(\\"DOMContentLoaded\\",d)})();</script>\\n</div><!-- /.error-footer -->\\n\\n\\n    </div><!-- /#cf-error-details -->\\n  </div><!-- /#cf-wrapper -->\\n\\n  <script>\\n  window._cf_translation = {};\\n  \\n  \\n</script>\\n\\n</body>\\n</html>\\n"',
  docsPath: undefined,
  metaMessages: [
  'Status: 403',
  'URL: https://sepolia.base.org',
  'Request body: {"method":"eth_call","params":[{"data":"0xf40364660000000000000000000000000000000000000000000000000000000000000005","to":"0xf920e5E886780587B6D09B804baa227155Ef2AB3"},"latest"]}',
  ' ',
  'Raw Call Arguments:',
  '  to:    0xf920e5E886780587B6D09B804baa227155Ef2AB3\n  data:  0xf40364660000000000000000000000000000000000000000000000000000000000000005'
],
  shortMessage: 'HTTP request failed.',
  version: '2.37.8',
  name: 'CallExecutionError'
},
  details: '"<!DOCTYPE html>\\n<!--[if lt IE 7]> <html class=\\"no-js ie6 oldie\\" lang=\\"en-US\\"> <![endif]-->\\n<!--[if IE 7]>    <html class=\\"no-js ie7 oldie\\" lang=\\"en-US\\"> <![endif]-->\\n<!--[if IE 8]>    <html class=\\"no-js ie8 oldie\\" lang=\\"en-US\\"> <![endif]-->\\n<!--[if gt IE 8]><!--> <html class=\\"no-js\\" lang=\\"en-US\\"> <!--<![endif]-->\\n<head>\\n<title>Attention Required! | Cloudflare</title>\\n<meta charset=\\"UTF-8\\" />\\n<meta http-equiv=\\"Content-Type\\" content=\\"text/html; charset=UTF-8\\" />\\n<meta http-equiv=\\"X-UA-Compatible\\" content=\\"IE=Edge\\" />\\n<meta name=\\"robots\\" content=\\"noindex, nofollow\\" />\\n<meta name=\\"viewport\\" content=\\"width=device-width,initial-scale=1\\" />\\n<link rel=\\"stylesheet\\" id=\\"cf_styles-css\\" href=\\"/cdn-cgi/styles/cf.errors.css\\" />\\n<!--[if lt IE 9]><link rel=\\"stylesheet\\" id=\'cf_styles-ie-css\' href=\\"/cdn-cgi/styles/cf.errors.ie.css\\" /><![endif]-->\\n<style>body{margin:0;padding:0}</style>\\n\\n\\n<!--[if gte IE 10]><!-->\\n<script>\\n  if (!navigator.cookieEnabled) {\\n    window.addEventListener(\'DOMContentLoaded\', function () {\\n      var cookieEl = document.getElementById(\'cookie-alert\');\\n      cookieEl.style.display = \'block\';\\n    })\\n  }\\n</script>\\n<!--<![endif]-->\\n\\n\\n</head>\\n<body>\\n  <div id=\\"cf-wrapper\\">\\n    <div class=\\"cf-alert cf-alert-error cf-cookie-error\\" id=\\"cookie-alert\\" data-translate=\\"enable_cookies\\">Please enable cookies.</div>\\n    <div id=\\"cf-error-details\\" class=\\"cf-error-details-wrapper\\">\\n      <div class=\\"cf-wrapper cf-header cf-error-overview\\">\\n        <h1 data-translate=\\"block_headline\\">Sorry, you have been blocked</h1>\\n        <h2 class=\\"cf-subheadline\\"><span data-translate=\\"unable_to_access\\">You are unable to access</span> base.org</h2>\\n      </div><!-- /.header -->\\n\\n      <div class=\\"cf-section cf-highlight\\">\\n        <div class=\\"cf-wrapper\\">\\n          <div class=\\"cf-screenshot-container cf-screenshot-full\\">\\n            \\n              <span class=\\"cf-no-screenshot error\\"></span>\\n            \\n          </div>\\n        </div>\\n      </div><!-- /.captcha-container -->\\n\\n      <div class=\\"cf-section cf-wrapper\\">\\n        <div class=\\"cf-columns two\\">\\n          <div class=\\"cf-column\\">\\n            <h2 data-translate=\\"blocked_why_headline\\">Why have I been blocked?</h2>\\n\\n            <p data-translate=\\"blocked_why_detail\\">This website is using a security service to protect itself from online attacks. The action you just performed triggered the security solution. There are several actions that could trigger this block including submitting a certain word or phrase, a SQL command or malformed data.</p>\\n          </div>\\n\\n          <div class=\\"cf-column\\">\\n            <h2 data-translate=\\"blocked_resolve_headline\\">What can I do to resolve this?</h2>\\n\\n            <p data-translate=\\"blocked_resolve_detail\\">You can email the site owner to let them know you were blocked. Please include what you were doing when this page came up and the Cloudflare Ray ID found at the bottom of this page.</p>\\n          </div>\\n        </div>\\n      </div><!-- /.section -->\\n\\n      <div class=\\"cf-error-footer cf-wrapper w-240 lg:w-full py-10 sm:py-4 sm:px-8 mx-auto text-center sm:text-left border-solid border-0 border-t border-gray-300\\">\\n  <p class=\\"text-13\\">\\n    <span class=\\"cf-footer-item sm:block sm:mb-1\\">Cloudflare Ray ID: <strong class=\\"font-semibold\\">98f0858e788ae646</strong></span>\\n    <span class=\\"cf-footer-separator sm:hidden\\">&bull;</span>\\n    <span id=\\"cf-footer-item-ip\\" class=\\"cf-footer-item hidden sm:block sm:mb-1\\">\\n      Your IP:\\n      <button type=\\"button\\" id=\\"cf-footer-ip-reveal\\" class=\\"cf-footer-ip-reveal-btn\\">Click to reveal</button>\\n      <span class=\\"hidden\\" id=\\"cf-footer-ip\\">18.206.87.82</span>\\n      <span class=\\"cf-footer-separator sm:hidden\\">&bull;</span>\\n    </span>\\n    <span class=\\"cf-footer-item sm:block sm:mb-1\\"><span>Performance &amp; security by</span> <a rel=\\"noopener noreferrer\\" href=\\"https://www.cloudflare.com/5xx-error-landing\\" id=\\"brand_link\\" target=\\"_blank\\">Cloudflare</a></span>\\n    \\n  </p>\\n  <script>(function(){function d(){var b=a.getElementById(\\"cf-footer-item-ip\\"),c=a.getElementById(\\"cf-footer-ip-reveal\\");b&&\\"classList\\"in b&&(b.classList.remove(\\"hidden\\"),c.addEventListener(\\"click\\",function(){c.classList.add(\\"hidden\\");a.getElementById(\\"cf-footer-ip\\").classList.remove(\\"hidden\\")}))}var a=document;document.addEventListener&&a.addEventListener(\\"DOMContentLoaded\\",d)})();</script>\\n</div><!-- /.error-footer -->\\n\\n\\n    </div><!-- /#cf-error-details -->\\n  </div><!-- /#cf-wrapper -->\\n\\n  <script>\\n  window._cf_translation = {};\\n  \\n  \\n</script>\\n\\n</body>\\n</html>\\n"',
  docsPath: '/docs/contract/readContract',
  metaMessages: [
  'Status: 403',
  'URL: https://sepolia.base.org',
  'Request body: {"method":"eth_call","params":[{"data":"0xf40364660000000000000000000000000000000000000000000000000000000000000005","to":"0xf920e5E886780587B6D09B804baa227155Ef2AB3"},"latest"]}',
  ' ',
  'Raw Call Arguments:',
  '  to:    0xf920e5E886780587B6D09B804baa227155Ef2AB3\n  data:  0xf40364660000000000000000000000000000000000000000000000000000000000000005',
  ' ',
  'Contract Call:',
  '  address:   0xf920e5E886780587B6D09B804baa227155Ef2AB3\n  function:  getCompetition(uint256 competitionId)\n  args:                    (5)'
],
  shortMessage: 'HTTP request failed.',
  version: '2.37.8',
  name: 'ContractFunctionExecutionError',
  abi: [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
  inputs: [ { internalType: 'address', name: 'target', type: 'address' } ],
  name: 'AddressEmptyCode',
  type: 'error'
},
  {
  inputs: [
  { internalType: 'address', name: 'sender', type: 'address' },
  { internalType: 'uint256', name: 'balance', type: 'uint256' },
  { internalType: 'uint256', name: 'needed', type: 'uint256' },
  { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
],
  name: 'ERC1155InsufficientBalance',
  type: 'error'
},
  {
  inputs: [ { internalType: 'address', name: 'approver', type: 'address' } ],
  name: 'ERC1155InvalidApprover',
  type: 'error'
},
  {
  inputs: [
  { internalType: 'uint256', name: 'idsLength', type: 'uint256' },
  { internalType: 'uint256', name: 'valuesLength', type: 'uint256' }
],
  name: 'ERC1155InvalidArrayLength',
  type: 'error'
},
  {
  inputs: [ { internalType: 'address', name: 'operator', type: 'address' } ],
  name: 'ERC1155InvalidOperator',
  type: 'error'
},
  {
  inputs: [ { internalType: 'address', name: 'receiver', type: 'address' } ],
  name: 'ERC1155InvalidReceiver',
  type: 'error'
},
  {
  inputs: [ { internalType: 'address', name: 'sender', type: 'address' } ],
  name: 'ERC1155InvalidSender',
  type: 'error'
},
  {
  inputs: [
  { internalType: 'address', name: 'operator', type: 'address' },
  { internalType: 'address', name: 'owner', type: 'address' }
],
  name: 'ERC1155MissingApprovalForAll',
  type: 'error'
},
  {
  inputs: [
  { internalType: 'address', name: 'implementation', type: 'address' }
],
  name: 'ERC1967InvalidImplementation',
  type: 'error'
},
  { inputs: [], name: 'ERC1967NonPayable', type: 'error' },
  { inputs: [], name: 'EnforcedPause', type: 'error' },
  { inputs: [], name: 'ExpectedPause', type: 'error' },
  { inputs: [], name: 'FailedCall', type: 'error' },
  { inputs: [], name: 'InvalidInitialization', type: 'error' },
  { inputs: [], name: 'NotInitializing', type: 'error' },
  {
  inputs: [ { internalType: 'address', name: 'owner', type: 'address' } ],
  name: 'OwnableInvalidOwner',
  type: 'error'
},
  {
  inputs: [ { internalType: 'address', name: 'account', type: 'address' } ],
  name: 'OwnableUnauthorizedAccount',
  type: 'error'
},
  { inputs: [], name: 'ReentrancyGuardReentrantCall', type: 'error' },
  { inputs: [], name: 'UUPSUnauthorizedCallContext', type: 'error' },
  {
  inputs: [ { internalType: 'bytes32', name: 'slot', type: 'bytes32' } ],
  name: 'UUPSUnsupportedProxiableUUID',
  type: 'error'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'uint256',
  name: 'competitionId',
  type: 'uint256'
},
  {
  indexed: false,
  internalType: 'uint256',
  name: 'amount',
  type: 'uint256'
},
  {
  indexed: true,
  internalType: 'address',
  name: 'addedBy',
  type: 'address'
}
],
  name: 'AdditionalPrizeAdded',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'address',
  name: 'account',
  type: 'address'
},
  {
  indexed: true,
  internalType: 'address',
  name: 'operator',
  type: 'address'
},
  {
  indexed: false,
  internalType: 'bool',
  name: 'approved',
  type: 'bool'
}
],
  name: 'ApprovalForAll',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'uint256',
  name: 'competitionId',
  type: 'uint256'
}
],
  name: 'CompetitionCancelled',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'uint256',
  name: 'competitionId',
  type: 'uint256'
},
  {
  indexed: true,
  internalType: 'address',
  name: 'collectionAddress',
  type: 'address'
}
],
  name: 'CompetitionCreated',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'uint256',
  name: 'competitionId',
  type: 'uint256'
}
],
  name: 'CompetitionEmergencyPaused',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'uint256',
  name: 'competitionId',
  type: 'uint256'
}
],
  name: 'CompetitionEmergencyUnpaused',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'uint256',
  name: 'competitionId',
  type: 'uint256'
},
  {
  indexed: false,
  internalType: 'bool',
  name: 'hasWinner',
  type: 'bool'
}
],
  name: 'CompetitionEnded',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'uint256',
  name: 'competitionId',
  type: 'uint256'
}
],
  name: 'CompetitionFinalized',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'uint256',
  name: 'competitionId',
  type: 'uint256'
},
  {
  indexed: false,
  internalType: 'uint256',
  name: 'deadline',
  type: 'uint256'
}
],
  name: 'CompetitionStarted',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'uint256',
  name: 'competitionId',
  type: 'uint256'
},
  {
  indexed: false,
  internalType: 'uint256',
  name: 'treasuryAmount',
  type: 'uint256'
},
  {
  indexed: false,
  internalType: 'uint256',
  name: 'prizeAmount',
  type: 'uint256'
}
],
  name: 'FundsSplit',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: false,
  internalType: 'uint64',
  name: 'version',
  type: 'uint64'
}
],
  name: 'Initialized',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'uint256',
  name: 'competitionId',
  type: 'uint256'
},
  {
  indexed: false,
  internalType: 'uint256',
  name: 'prizePerTicket',
  type: 'uint256'
}
],
  name: 'NoWinnerPrizeDistribution',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'address',
  name: 'previousOwner',
  type: 'address'
},
  {
  indexed: true,
  internalType: 'address',
  name: 'newOwner',
  type: 'address'
}
],
  name: 'OwnershipTransferred',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'address',
  name: 'participant',
  type: 'address'
},
  {
  indexed: true,
  internalType: 'uint256',
  name: 'competitionId',
  type: 'uint256'
},
  {
  indexed: false,
  internalType: 'uint256',
  name: 'amount',
  type: 'uint256'
}
],
  name: 'ParticipantPrizeClaimed',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: false,
  internalType: 'address',
  name: 'account',
  type: 'address'
}
],
  name: 'Paused',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'address',
  name: 'participant',
  type: 'address'
},
  {
  indexed: true,
  internalType: 'uint256',
  name: 'competitionId',
  type: 'uint256'
},
  {
  indexed: false,
  internalType: 'uint256',
  name: 'amount',
  type: 'uint256'
}
],
  name: 'RefundIssued',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'address',
  name: 'buyer',
  type: 'address'
},
  {
  indexed: true,
  internalType: 'uint256',
  name: 'competitionId',
  type: 'uint256'
},
  {
  indexed: false,
  internalType: 'uint256',
  name: 'price',
  type: 'uint256'
}
],
  name: 'TicketPurchased',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'address',
  name: 'operator',
  type: 'address'
},
  {
  indexed: true,
  internalType: 'address',
  name: 'from',
  type: 'address'
},
  { indexed: true, internalType: 'address', name: 'to', type: 'address' },
  {
  indexed: false,
  internalType: 'uint256[]',
  name: 'ids',
  type: 'uint256[]'
},
  {
  indexed: false,
  internalType: 'uint256[]',
  name: 'values',
  type: 'uint256[]'
}
],
  name: 'TransferBatch',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'address',
  name: 'operator',
  type: 'address'
},
  {
  indexed: true,
  internalType: 'address',
  name: 'from',
  type: 'address'
},
  { indexed: true, internalType: 'address', name: 'to', type: 'address' },
  {
  indexed: false,
  internalType: 'uint256',
  name: 'id',
  type: 'uint256'
},
  {
  indexed: false,
  internalType: 'uint256',
  name: 'value',
  type: 'uint256'
}
],
  name: 'TransferSingle',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: false,
  internalType: 'string',
  name: 'value',
  type: 'string'
},
  { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' }
],
  name: 'URI',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: false,
  internalType: 'address',
  name: 'account',
  type: 'address'
}
],
  name: 'Unpaused',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'address',
  name: 'implementation',
  type: 'address'
}
],
  name: 'Upgraded',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'address',
  name: 'user',
  type: 'address'
},
  {
  indexed: true,
  internalType: 'uint256',
  name: 'competitionId',
  type: 'uint256'
},
  {
  indexed: false,
  internalType: 'bytes32',
  name: 'proofHash',
  type: 'bytes32'
}
],
  name: 'WinnerClaimed',
  type: 'event'
},
  {
  anonymous: false,
  inputs: [
  {
  indexed: true,
  internalType: 'address',
  name: 'winner',
  type: 'address'
},
  {
  indexed: true,
  internalType: 'uint256',
  name: 'competitionId',
  type: 'uint256'
},
  {
  indexed: false,
  internalType: 'uint256',
  name: 'timestamp',
  type: 'uint256'
}
],
  name: 'WinnerDeclared',
  type: 'event'
},
  {
  inputs: [],
  name: 'GRACE_PERIOD',
  outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [],
  name: 'NO_WINNER_WAIT_PERIOD',
  outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [],
  name: 'UPGRADE_INTERFACE_VERSION',
  outputs: [ { internalType: 'string', name: '', type: 'string' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '_competitionId', type: 'uint256' },
  {
  internalType: 'uint256',
  name: '_additionalQuantity',
  type: 'uint256'
}
],
  name: 'addBoosterBoxes',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '_competitionId', type: 'uint256' }
],
  name: 'addPrizeETH',
  outputs: [],
  stateMutability: 'payable',
  type: 'function'
},
  {
  inputs: [],
  name: 'adminValidationManager',
  outputs: [
  {
  internalType: 'contract AdminValidationManager',
  name: '',
  type: 'address'
}
],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'address', name: 'account', type: 'address' },
  { internalType: 'uint256', name: 'id', type: 'uint256' }
],
  name: 'balanceOf',
  outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'address[]', name: 'accounts', type: 'address[]' },
  { internalType: 'uint256[]', name: 'ids', type: 'uint256[]' }
],
  name: 'balanceOfBatch',
  outputs: [ { internalType: 'uint256[]', name: '', type: 'uint256[]' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [],
  name: 'boosterBoxManager',
  outputs: [
  {
  internalType: 'contract BoosterBoxManager',
  name: '',
  type: 'address'
}
],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '_competitionId', type: 'uint256' }
],
  name: 'buyTicket',
  outputs: [],
  stateMutability: 'payable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '_competitionId', type: 'uint256' }
],
  name: 'cancelCompetition',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '_competitionId', type: 'uint256' }
],
  name: 'claimParticipantPrize',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '_competitionId', type: 'uint256' }
],
  name: 'claimPrize',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '_competitionId', type: 'uint256' }
],
  name: 'claimRefund',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [],
  name: 'competitionLifecycleManager',
  outputs: [
  {
  internalType: 'contract CompetitionLifecycleManager',
  name: '',
  type: 'address'
}
],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [],
  name: 'competitionManager',
  outputs: [
  {
  internalType: 'contract CompetitionManager',
  name: '',
  type: 'address'
}
],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [
  {
  components: [
  { internalType: 'string', name: 'name', type: 'string' },
  { internalType: 'string', name: 'description', type: 'string' },
  { internalType: 'address', name: 'collectionAddress', type: 'address' },
  { internalType: 'uint8[]', name: 'rarityTiers', type: 'uint8[]' },
  { internalType: 'uint256', name: 'ticketPrice', type: 'uint256' },
  { internalType: 'address', name: 'treasuryWallet', type: 'address' },
  { internalType: 'uint256', name: 'treasuryPercent', type: 'uint256' },
  { internalType: 'uint256', name: 'deadline', type: 'uint256' },
  { internalType: 'bool', name: 'boosterBoxEnabled', type: 'bool' },
  { internalType: 'address', name: 'boosterBoxAddress', type: 'address' },
  { internalType: 'address', name: 'verifierAddress', type: 'address' }
],
  internalType: 'struct ICompetitionStorage.CreateCompetitionParams',
  name: 'params',
  type: 'tuple'
}
],
  name: 'createCompetition',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '_competitionId', type: 'uint256' }
],
  name: 'emergencyPauseCompetition',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '_competitionId', type: 'uint256' }
],
  name: 'emergencyUnpauseCompetition',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '_competitionId', type: 'uint256' }
],
  name: 'endCompetition',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '_competitionId', type: 'uint256' },
  { internalType: 'uint256', name: '_newDeadline', type: 'uint256' }
],
  name: 'extendDeadline',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '_competitionId', type: 'uint256' }
],
  name: 'finalizeCompetition',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '_competitionId', type: 'uint256' }
],
  name: 'getBoosterBoxInfo',
  outputs: [
  { internalType: 'bool', name: 'enabled', type: 'bool' },
  { internalType: 'address', name: 'contractAddress', type: 'address' },
  { internalType: 'uint256', name: 'quantity', type: 'uint256' },
  { internalType: 'bool', name: 'claimed', type: 'bool' }
],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '_competitionId', type: 'uint256' }
],
  name: 'getBoosterBoxQuantity',
  outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [ { internalType: 'address', name: 'user', type: 'address' } ],
  name: 'getClaimableBalance',
  outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [ { internalType: 'uint256', name: 'competitionId', type: 'uint256' } ],
  name: 'getCompetition',
  outputs: [
  {
  components: [
  { internalType: 'address', name: 'collectionAddress', type: 'address' },
  { internalType: 'uint8[]', name: 'rarityTiers', type: 'uint8[]' },
  { internalType: 'uint256', name: 'ticketPrice', type: 'uint256' },
  { internalType: 'address', name: 'treasuryWallet', type: 'address' },
  { internalType: 'uint256', name: 'treasuryPercent', type: 'uint256' },
  { internalType: 'uint256', name: 'deadline', type: 'uint256' },
  { internalType: 'bool', name: 'boosterBoxEnabled', type: 'bool' },
  { internalType: 'address', name: 'boosterBoxAddress', type: 'address' },
  { internalType: 'address', name: 'verifierAddress', type: 'address' },
  {
  internalType: 'enum ICompetitionStorage.CompetitionState',
  name: 'state',
  type: 'uint8'
},
  { internalType: 'address', name: 'winner', type: 'address' },
  { internalType: 'uint256', name: 'prizePool', type: 'uint256' },
  { internalType: 'uint256', name: 'totalTickets', type: 'uint256' },
  { internalType: 'bool', name: 'winnerDeclared', type: 'bool' },
  { internalType: 'uint256', name: 'winnerDeclaredAt', type: 'uint256' },
  { internalType: 'bool', name: 'emergencyPaused', type: 'bool' }
],
  internalType: 'struct ICompetitionStorage.Competition',
  name: '',
  type: 'tuple'
}
],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [ { internalType: 'uint256', name: 'competitionId', type: 'uint256' } ],
  name: 'getCompetitionDescription',
  outputs: [ { internalType: 'string', name: '', type: 'string' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [ { internalType: 'uint256', name: 'competitionId', type: 'uint256' } ],
  name: 'getCompetitionMetadata',
  outputs: [
  { internalType: 'string', name: 'name', type: 'string' },
  { internalType: 'string', name: 'description', type: 'string' }
],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [ { internalType: 'uint256', name: 'competitionId', type: 'uint256' } ],
  name: 'getCompetitionName',
  outputs: [ { internalType: 'string', name: '', type: 'string' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [],
  name: 'getCurrentCompetitionId',
  outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [ { internalType: 'uint256', name: 'competitionId', type: 'uint256' } ],
  name: 'getPrizePool',
  outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: 'competitionId', type: 'uint256' },
  { internalType: 'address', name: 'user', type: 'address' }
],
  name: 'hasTicket',
  outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '_competitionId', type: 'uint256' },
  { internalType: 'bytes32', name: '_proofHash', type: 'bytes32' },
  { internalType: 'bytes', name: '_signature', type: 'bytes' }
],
  name: 'iamtheWinner',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  {
  components: [
  { internalType: 'address', name: 'ticketRenderer', type: 'address' },
  { internalType: 'address', name: 'proofValidator', type: 'address' },
  { internalType: 'address', name: 'prizeManager', type: 'address' },
  {
  internalType: 'address',
  name: 'prizeCalculationManager',
  type: 'address'
},
  {
  internalType: 'address',
  name: 'competitionLifecycleManager',
  type: 'address'
},
  {
  internalType: 'address',
  name: 'adminValidationManager',
  type: 'address'
},
  { internalType: 'address', name: 'boosterBoxManager', type: 'address' },
  {
  internalType: 'address',
  name: 'competitionManager',
  type: 'address'
},
  { internalType: 'address', name: 'metadataManager', type: 'address' },
  { internalType: 'address', name: 'queryManager', type: 'address' },
  { internalType: 'address', name: 'userTracking', type: 'address' }
],
  internalType: 'struct ModuleAddresses',
  name: 'modules',
  type: 'tuple'
}
],
  name: 'initialize',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'address', name: 'account', type: 'address' },
  { internalType: 'address', name: 'operator', type: 'address' }
],
  name: 'isApprovedForAll',
  outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [],
  name: 'metadataManager',
  outputs: [
  { internalType: 'contract MetadataManager', name: '', type: 'address' }
],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'address', name: '', type: 'address' },
  { internalType: 'address', name: '', type: 'address' },
  { internalType: 'uint256[]', name: '', type: 'uint256[]' },
  { internalType: 'uint256[]', name: '', type: 'uint256[]' },
  { internalType: 'bytes', name: '', type: 'bytes' }
],
  name: 'onERC1155BatchReceived',
  outputs: [ { internalType: 'bytes4', name: '', type: 'bytes4' } ],
  stateMutability: 'pure',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'address', name: '', type: 'address' },
  { internalType: 'address', name: '', type: 'address' },
  { internalType: 'uint256', name: '', type: 'uint256' },
  { internalType: 'uint256', name: '', type: 'uint256' },
  { internalType: 'bytes', name: '', type: 'bytes' }
],
  name: 'onERC1155Received',
  outputs: [ { internalType: 'bytes4', name: '', type: 'bytes4' } ],
  stateMutability: 'pure',
  type: 'function'
},
  {
  inputs: [],
  name: 'owner',
  outputs: [ { internalType: 'address', name: '', type: 'address' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '', type: 'uint256' },
  { internalType: 'address', name: '', type: 'address' }
],
  name: 'participantPrizeClaimed',
  outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
  name: 'participantPrizePerTicket',
  outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [],
  name: 'pause',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [],
  name: 'paused',
  outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [],
  name: 'prizeCalculationManager',
  outputs: [
  {
  internalType: 'contract PrizeCalculationManager',
  name: '',
  type: 'address'
}
],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [],
  name: 'prizeManager',
  outputs: [
  { internalType: 'contract PrizeManager', name: '', type: 'address' }
],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [],
  name: 'proofValidator',
  outputs: [
  { internalType: 'contract ProofValidator', name: '', type: 'address' }
],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [],
  name: 'proxiableUUID',
  outputs: [ { internalType: 'bytes32', name: '', type: 'bytes32' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [],
  name: 'queryManager',
  outputs: [
  { internalType: 'contract QueryManager', name: '', type: 'address' }
],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '', type: 'uint256' },
  { internalType: 'address', name: '', type: 'address' }
],
  name: 'refundsClaimed',
  outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [],
  name: 'renounceOwnership',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'address', name: 'from', type: 'address' },
  { internalType: 'address', name: 'to', type: 'address' },
  { internalType: 'uint256[]', name: 'ids', type: 'uint256[]' },
  { internalType: 'uint256[]', name: 'values', type: 'uint256[]' },
  { internalType: 'bytes', name: 'data', type: 'bytes' }
],
  name: 'safeBatchTransferFrom',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'address', name: 'from', type: 'address' },
  { internalType: 'address', name: 'to', type: 'address' },
  { internalType: 'uint256', name: 'id', type: 'uint256' },
  { internalType: 'uint256', name: 'value', type: 'uint256' },
  { internalType: 'bytes', name: 'data', type: 'bytes' }
],
  name: 'safeTransferFrom',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [ { internalType: 'address', name: '_newManager', type: 'address' } ],
  name: 'setAdminValidationManager',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'address', name: 'operator', type: 'address' },
  { internalType: 'bool', name: 'approved', type: 'bool' }
],
  name: 'setApprovalForAll',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [ { internalType: 'address', name: '_newManager', type: 'address' } ],
  name: 'setBoosterBoxManager',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '_competitionId', type: 'uint256' },
  { internalType: 'uint256', name: '_quantity', type: 'uint256' }
],
  name: 'setBoosterBoxQuantity',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [ { internalType: 'address', name: '_newManager', type: 'address' } ],
  name: 'setCompetitionLifecycleManager',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [ { internalType: 'address', name: '_newManager', type: 'address' } ],
  name: 'setCompetitionManager',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [ { internalType: 'address', name: '_newManager', type: 'address' } ],
  name: 'setMetadataManager',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [ { internalType: 'address', name: '_newManager', type: 'address' } ],
  name: 'setPrizeCalculationManager',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [ { internalType: 'address', name: '_newManager', type: 'address' } ],
  name: 'setPrizeManager',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [ { internalType: 'address', name: '_newValidator', type: 'address' } ],
  name: 'setProofValidator',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [ { internalType: 'address', name: '_newManager', type: 'address' } ],
  name: 'setQueryManager',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [ { internalType: 'address', name: '_newRenderer', type: 'address' } ],
  name: 'setTicketRenderer',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'address', name: '_newUserTracking', type: 'address' }
],
  name: 'setUserTracking',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '_competitionId', type: 'uint256' }
],
  name: 'startCompetition',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [ { internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' } ],
  name: 'supportsInterface',
  outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '', type: 'uint256' },
  { internalType: 'address', name: '', type: 'address' }
],
  name: 'ticketHolders',
  outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [],
  name: 'ticketRenderer',
  outputs: [
  { internalType: 'contract TicketRenderer', name: '', type: 'address' }
],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [ { internalType: 'address', name: 'newOwner', type: 'address' } ],
  name: 'transferOwnership',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [],
  name: 'unpause',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'uint256', name: '_competitionId', type: 'uint256' },
  { internalType: 'address', name: '_newVerifier', type: 'address' }
],
  name: 'updateVerifier',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
  {
  inputs: [
  { internalType: 'address', name: 'newImplementation', type: 'address' },
  { internalType: 'bytes', name: 'data', type: 'bytes' }
],
  name: 'upgradeToAndCall',
  outputs: [],
  stateMutability: 'payable',
  type: 'function'
},
  {
  inputs: [ { internalType: 'uint256', name: '_tokenId', type: 'uint256' } ],
  name: 'uri',
  outputs: [ { internalType: 'string', name: '', type: 'string' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [],
  name: 'userTracking',
  outputs: [
  { internalType: 'contract UserTracking', name: '', type: 'address' }
],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
  name: 'winnerPrizeClaimed',
  outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
  stateMutability: 'view',
  type: 'function'
},
  {
  inputs: [],
  name: 'withdrawBalance',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
}
],
  args: [ 5n ],
  contractAddress: '0xf920e5E886780587B6D09B804baa227155Ef2AB3',
  formattedArgs: undefined,
  functionName: 'getCompetition',
  sender: undefined
}