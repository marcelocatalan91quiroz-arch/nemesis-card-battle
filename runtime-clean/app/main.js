import{MainIntegrationBridge}from'./MainIntegrationBridge.js';
const app=new MainIntegrationBridge();
app.boot().catch(error=>console.error('[NEMESIS_RUNTIME_CLEAN_BOOT]',error));
window.NEMESIS_RUNTIME_CLEAN_APP=app;