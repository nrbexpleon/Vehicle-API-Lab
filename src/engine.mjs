const idFor=(contractId,kind,index=0)=>`${contractId}:${kind}:${index}`;
const REQUIRED_KINDS=['HAPPY_PATH','INVALID_INPUT','ERROR_CONTRACT','TIMING'];
export function validateLab(x){const e=[];for(const k of ['name','owner','vehicleProgramme'])if(!x?.[k]?.trim())e.push(`${k} is required.`);return e}
export function validateContract(x){const e=[];for(const k of ['name','version','protocol','operation'])if(!x?.[k]?.trim())e.push(`${k} is required.`);if(!['REST','SOME_IP','GRPC','MQTT'].includes(x?.protocol))e.push('Supported protocol is required.');return e}
export function generateCases(contract){
 const out=[
  {id:idFor(contract.id,'HAPPY_PATH'),kind:'HAPPY_PATH',name:'Valid request returns contract response',critical:true,expectation:`Status ${contract.successCode||200}; response matches declared schema`},
  {id:idFor(contract.id,'INVALID_INPUT'),kind:'INVALID_INPUT',name:'Invalid request is rejected',critical:true,expectation:`Status ${contract.invalidCode||400}; structured error returned`},
  {id:idFor(contract.id,'ERROR_CONTRACT'),kind:'ERROR_CONTRACT',name:'Error response follows contract',critical:true,expectation:'Declared error code and schema are used'},
  {id:idFor(contract.id,'TIMING'),kind:'TIMING',name:'Response meets timing budget',critical:Boolean(contract.timingCritical),expectation:`Latency <= ${Number(contract.maxLatencyMs||100)} ms`}
 ];
 if(contract.authenticationRequired)out.push({id:idFor(contract.id,'AUTHORIZATION'),kind:'AUTHORIZATION',name:'Unauthorised request is rejected',critical:true,expectation:'Missing or invalid credentials are rejected'});
 if(contract.idempotent)out.push({id:idFor(contract.id,'IDEMPOTENCY'),kind:'IDEMPOTENCY',name:'Repeated request is idempotent',critical:false,expectation:'Repeated request has no unintended side effects'});
 if(contract.versionCompatibility)out.push({id:idFor(contract.id,'VERSION_COMPATIBILITY'),kind:'VERSION_COMPATIBILITY',name:'Version compatibility is preserved',critical:true,expectation:'Declared compatible clients receive equivalent behaviour'});
 for(const [i,b] of (contract.boundaries||[]).entries())out.push({id:idFor(contract.id,'BOUNDARY',i),kind:'BOUNDARY',name:`Boundary: ${b}`,critical:false,expectation:'Boundary value is handled according to contract'});
 return out;
}
export function evaluateRun(lab,suite,run){
 const expected=suite.cases||[],results=run.results||[],findings=[];
 const byId=new Map(results.map(r=>[r.caseId,r]));let passed=0,failed=0,notRun=0;
 const cases=expected.map(c=>{const r=byId.get(c.id);let status='NOT_RUN',reason='No result recorded';if(r){status=r.status;reason=r.notes||'';if(c.kind==='TIMING'&&r.status==='PASSED'&&Number(r.latencyMs)>Number(lab.contracts.find(x=>x.id===suite.contractId)?.maxLatencyMs||100)){status='FAILED';reason=`Measured latency ${r.latencyMs} ms exceeds budget`;}}if(status==='PASSED')passed++;else if(status==='FAILED')failed++;else notRun++;return{...c,status,reason,latencyMs:r?.latencyMs??null,evidenceRef:r?.evidenceRef||''}});
 const criticalFailures=cases.filter(c=>c.critical&&c.status!=='PASSED');
 if(criticalFailures.length)findings.push({severity:'critical',title:`${criticalFailures.length} critical tests failed or were not run`,action:'Resolve failures and execute the complete critical suite.'});
 if(notRun)findings.push({severity:'high',title:`${notRun} test cases have no result`,action:'Execute and record all generated conformance cases.'});
 const missingKinds=REQUIRED_KINDS.filter(k=>!expected.some(c=>c.kind===k));if(missingKinds.length)findings.push({severity:'high',title:'Required conformance categories are missing',action:`Regenerate the suite with: ${missingKinds.join(', ')}`});
 const percent=expected.length?Math.round(passed/expected.length*100):0;
 const decision=criticalFailures.length||notRun||missingKinds.length?'NON_CONFORMANT':percent===100?'CONFORMANT_CANDIDATE':'REVIEW_REQUIRED';
 return{generatedAt:new Date().toISOString(),decision,summary:{total:expected.length,passed,failed,notRun,passRate:percent,criticalFailures:criticalFailures.length},cases,findings,disclaimer:'Recorded-result assessment only. Independent execution and competent human review are required.'};
}
