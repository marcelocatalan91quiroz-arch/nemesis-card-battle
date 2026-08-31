const crypto=require('crypto');

const COOKIE_NAME='nemesis_owner_session';
const TOKEN_TTL_MS=12*60*60*1000;

function now(){return Date.now()}
function key(){return String(process.env.NEMESIS_OWNER_KEY||'')}
function secret(){return String(process.env.NEMESIS_OWNER_SIGNING_SECRET||'')}
function ready(){return key().length>=12&&secret().length>=24}
function safeEqual(a,b){const x=Buffer.from(String(a||'')),y=Buffer.from(String(b||''));return x.length===y.length&&crypto.timingSafeEqual(x,y)}
function sign(payload){return crypto.createHmac('sha256',secret()).update(payload).digest('base64url')}
function issueToken(){
 if(!ready())return null;
 const payload=Buffer.from(JSON.stringify({role:'OWNER',iat:now(),exp:now()+TOKEN_TTL_MS,nonce:crypto.randomBytes(12).toString('base64url')})).toString('base64url');
 return payload+'.'+sign(payload)
}
function verifyToken(token){
 if(!ready()||typeof token!=='string'||!token.includes('.'))return false;
 const [payload,sig]=token.split('.',2);
 if(!payload||!sig||!safeEqual(sign(payload),sig))return false;
 try{const data=JSON.parse(Buffer.from(payload,'base64url').toString('utf8'));return data.role==='OWNER'&&Number(data.exp)>now()}catch{return false}
}
function parseCookies(req){
 const out={};String(req?.headers?.cookie||'').split(';').forEach(part=>{const i=part.indexOf('=');if(i<0)return;const k=part.slice(0,i).trim(),v=part.slice(i+1).trim();if(k)out[k]=decodeURIComponent(v)});return out
}
function tokenFromRequest(req){return parseCookies(req)[COOKIE_NAME]||''}
function verifyRequest(req){return verifyToken(tokenFromRequest(req))}
function verifyKey(candidate){return ready()&&safeEqual(candidate,key())}
function cookieHeader(token,secure=true){
 const maxAge=Math.floor(TOKEN_TTL_MS/1000);
 return COOKIE_NAME+'='+encodeURIComponent(token)+'; Path=/; HttpOnly; SameSite=Strict; Max-Age='+maxAge+(secure?'; Secure':'')
}
function clearCookieHeader(secure=true){return COOKIE_NAME+'=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'+(secure?'; Secure':'')}
module.exports={COOKIE_NAME,TOKEN_TTL_MS,ready,issueToken,verifyToken,verifyRequest,verifyKey,cookieHeader,clearCookieHeader};
