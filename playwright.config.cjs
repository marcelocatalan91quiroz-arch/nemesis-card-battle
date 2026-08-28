
const { defineConfig } = require('@playwright/test');
module.exports=defineConfig({
  testDir:'./tests',
  testMatch:'browser.spec.cjs',
  retries:1,
  reporter:[['list'],['html',{open:'never'}]],
  use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure',screenshot:'only-on-failure'},
  webServer:{command:'npx http-server . -p 4173 -c-1',port:4173,reuseExistingServer:true,timeout:20000}
});
