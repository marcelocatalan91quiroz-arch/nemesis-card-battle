const auth=require('../lib/owner-auth');
function secure(req){return process.env.VERCEL_ENV==='production'||String(req.headers?.['x-forwarded-proto']||'').includes('https')}
function noStore(res){res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff')}
module.exports=async function handler(req,res){
 noStore(res);
 if(req.method==='GET'){
  return res.status(200).json({ok:true,owner:auth.verifyRequest(req),configured:auth.ready()});
 }
 if(req.method!=='POST')return res.status(405).json({ok:false,error:'METHOD'});
 const b=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
 if(b.action==='login'){
  if(!auth.ready())return res.status(503).json({ok:false,error:'OWNER_AUTH_NOT_CONFIGURED'});
  if(!auth.verifyKey(b.key))return res.status(403).json({ok:false,error:'OWNER_AUTH_INVALID'});
  const token=auth.issueToken();res.setHeader('Set-Cookie',auth.cookieHeader(token,secure(req)));
  return res.status(200).json({ok:true,owner:true,expiresInMs:auth.TOKEN_TTL_MS});
 }
 if(b.action==='logout'){
  res.setHeader('Set-Cookie',auth.clearCookieHeader(secure(req)));
  return res.status(200).json({ok:true,owner:false});
 }
 return res.status(400).json({ok:false,error:'UNKNOWN_ACTION'});
};
