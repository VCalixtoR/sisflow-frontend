const base_url = `${process.env.VUE_APP_SERVICE_URL}`

// Used to avoid code duplication on requests
async function baseRequestHandle(headers, endpoint){

  var vreturn = {};

  try{
    vreturn['response'] = await fetch(`${base_url}${endpoint}`, headers);
    vreturn['status'] = vreturn['response'].status;

    let vreturnOk = vreturn['response'].ok;

    if(vreturn['response']['statusText'] != 'NO CONTENT'){
      vreturn['response'] = await vreturn['response'].json();
    }
    
    // if ok, return
    if(vreturnOk){
      vreturn['ok'] = true;
      return vreturn;
    }

    // if not, location is set to return error message
    vreturn['ok'] = false;
    vreturn['location'] = `Return in ${endpoint}`;

    return vreturn;
  }
  catch(error){
    vreturn['ok'] = false;
    vreturn['location'] = `Exception in ${endpoint}`;
    vreturn['message'] = error.message;

    return vreturn;
  }
}

// return parsed query string to use directly in url
function parseQueryStrFromObj(queryObj){

  let queryString = '?';
  let keyList = Object.keys(queryObj);
  let started = false;

  keyList.forEach((key) => {
    if(queryObj[key]!==null && queryObj[key]!==undefined && queryObj[key]!==''){
      if(started){
        queryString += `&${key}=${queryObj[key]}`
      }
      else{
        started = true;
        queryString += `${key}=${queryObj[key]}`
      }
    }
  });
  return queryString;
}

// do auth with user login mail password
async function loginDo(_, args){

  let userMailIns = args[0];
  let userPass = args[1];

  let auth = window.btoa(`${userMailIns}:${userPass}`);
  
  var myHeaders = {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Basic ${auth}`
    }
  }

  let vreturn = await baseRequestHandle(myHeaders, 'login');
  return vreturn;
}

async function signMakeCode(_, args){
  
  let insEmail = args[0];

  var myHeaders = {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'institutional_email': insEmail
    })
  }

  let vreturn = await baseRequestHandle(myHeaders, 'signup');
  return vreturn;
}

async function signVerifyCodeData(_, args){

  let insEmail = args[0];
  let valCode = args[1];

  var myHeaders = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }
  }

  var querystring = `?institutional_email=${insEmail}&validation_code=${valCode}`;

  let vreturn = await baseRequestHandle(myHeaders, `signup${querystring}`);
  return vreturn;
}

async function signVerifyCodeToken(_, args){

  let token = args[0];

  var myHeaders = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }
  }

  var querystring = `?acess_token=${token}`;

  let vreturn = await baseRequestHandle(myHeaders, `signup${querystring}`);
  return vreturn;
}

async function signDoWithCode(_, args){
  
  let insEmail = args[0];
  let secEmail = args[1];
  let phone = args[2]
  let plainPass = args[3];
  let valCode = args[4];

  var myHeaders = {
    method: 'PUT',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'institutional_email': insEmail,
      'secondary_email': secEmail,
      'phone': phone,
      'plain_password': plainPass,
      'validation_code': valCode
    })
  }

  let vreturn = await baseRequestHandle(myHeaders, 'signup');
  return vreturn;
}

async function getAdvisors(token_jwt, args){

  let myHeaders = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`
    }
  }

  let querystring = parseQueryStrFromObj({
    'start_row': args[0],
    'quantity_rows': args[1],
    'advisor_name': args[2]
  });

  let vreturn = await baseRequestHandle(myHeaders, `advisors${querystring}`);
  return vreturn;
}

async function getCoordinatorSolicitations(token_jwt, args){

  args;

  var myHeaders = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`
    }
  }

  let vreturn = await baseRequestHandle(myHeaders, 'solicitations/coordinator');
  return vreturn;
}

async function getAdvisorSolicitations(token_jwt, args){

  args;

  var myHeaders = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`
    }
  }

  let vreturn = await baseRequestHandle(myHeaders, 'solicitations/advisor');
  return vreturn;
}

async function getStudentSolicitations(token_jwt, args){

  args;

  var myHeaders = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`
    }
  }

  let vreturn = await baseRequestHandle(myHeaders, 'solicitations/student');
  return vreturn;
}

async function getSolicitation(token_jwt, args){
  
  let userHasStateId = args[0];
  
  var myHeaders = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`
    }
  }
  
  var querystring = `?user_has_state_id=${userHasStateId}`;
  let vreturn = await baseRequestHandle(myHeaders, `solicitation${querystring}`);
  return vreturn;
}

async function putSolicitation(token_jwt, args){
  
  let solicitationId = args[0];

  var myHeaders = {
    method: 'PUT',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'solicitation_id': solicitationId
    })
  }

  let vreturn = await baseRequestHandle(myHeaders, 'solicitation');
  return vreturn;
}

async function postSolicitation(token_jwt, args){
  
  let userHasStateId = args[0];
  let transitionId = args[1];
  let solicitationUserData = args[2] ? args[2] : { 'inputs' : [], 'uploads' : [], 'select_uploads' : [] };
  let validateDynamicPageFields = args[3] ? args[3] : 1;

  var myHeaders = {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'user_has_state_id': userHasStateId,
      'transition_id': transitionId,
      'solicitation_user_data': solicitationUserData,
      'validate_dynamic_page_fields': validateDynamicPageFields
    })
  }

  let vreturn = await baseRequestHandle(myHeaders, 'solicitation');
  return vreturn;
}

async function putSolicitationAdvisor(token_jwt, args){
  
  let userHasSolicitationId = args[0];
  let advisorSiape = args[1];

  var myHeaders = {
    method: 'PUT',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'user_has_solicitation_id': userHasSolicitationId,
      'advisor_siape': advisorSiape
    })
  }

  let vreturn = await baseRequestHandle(myHeaders, 'solicitation/advisor');
  return vreturn;
}

async function patchSolicitationAdvisor(token_jwt, args){
  
  let userHasSolicitationId = args[0];
  let advisorSiape = args[1];

  var myHeaders = {
    method: 'PATCH',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'user_has_solicitation_id': userHasSolicitationId,
      'advisor_siape': advisorSiape
    })
  }

  let vreturn = await baseRequestHandle(myHeaders, 'solicitation/advisor');
  return vreturn;
}

async function getReasons(token_jwt, args){

  let myHeaders = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`
    }
  }

  let querystring = parseQueryStrFromObj({
    'user_has_state_id': args[0],
    'reason_content': args[1],
    'class_names': args[2],
    'reason_id': args[3]
  });

  let vreturn = await baseRequestHandle(myHeaders, `reasons${querystring}`);
  return vreturn;
}

async function postSendMail(token_jwt, args){
  
  let userHasStateId = args[0];
  let mailSubject = args[1];
  let mailBody = args[2];
  let isSentToStudent = args[3];
  let isSentToAdvisor = args[4];
  let isSentToCoordinator = args[5];

  var myHeaders = {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token_jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'user_has_state_id': userHasStateId,
      'mail_subject': mailSubject,
      'mail_body': mailBody,
      'is_sent_to_student': isSentToStudent,
      'is_sent_to_advisor': isSentToAdvisor,
      'is_sent_to_coordinator': isSentToCoordinator
    })
  }

  let vreturn = await baseRequestHandle(myHeaders, 'sendmail');
  return vreturn;
}

export default{
  loginDo,
  signMakeCode,
  signVerifyCodeData,
  signVerifyCodeToken,
  signDoWithCode,
  getAdvisors,
  getCoordinatorSolicitations,
  getAdvisorSolicitations,
  getStudentSolicitations,
  getSolicitation,
  putSolicitation,
  postSolicitation,
  putSolicitationAdvisor,
  patchSolicitationAdvisor,
  getReasons,
  postSendMail
}