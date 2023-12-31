const { BASE_URL } = process.env;
const { ASSET_URL } = process.env;

module.exports = {
  ASSET_URL,
  GET_CITIZEN: `${BASE_URL}/citizens/getCitizen`,
  GET_CITIZEN_IMAGE: `${BASE_URL}/citizens/base64ToImage`,
  HEALTH_FACILITIES: `${BASE_URL}/healthfacilities`,
  HEALTH_FACILITIES_LIST: `${BASE_URL}/healthfacilities/activeList`,
  ROlES: `${BASE_URL}/roles`,
  ROLES_LIST: `${BASE_URL}/roles/activeList`,
  USERS: `${BASE_URL}/fileUpload/acknowledgement-list`,
  CREATE_ADMIN: `${BASE_URL}/admin`,
  EMAIL_EXIST: `${BASE_URL}/user/email`,
  USER_PROFILE: `${BASE_URL}/user/profile`,
  DELETE_USERS: `${BASE_URL}/users/deleteByIds`,
  EMBASSIES: `${BASE_URL}/embassies`,
  EMBASSIES_LIST: `${BASE_URL}/embassies/activeList`,
  PROVINCES: `${BASE_URL}/provinces`,
  DISTRICTS: `${BASE_URL}/districts`,
  SECTORS: `${BASE_URL}/sectors`,
  CELLS: `${BASE_URL}/cells`,
  VILLAGES: `${BASE_URL}/villages`,
  PROVINCES_LIST: `${BASE_URL}/provinces/activeList`,
  DISTRICTS_LIST: `${BASE_URL}/districts/activeList`,
  SECTORS_LIST: `${BASE_URL}/sectors/activeList`,
  CELLS_LIST: `${BASE_URL}/cells/activeList`,
  VILLAGES_LIST: `${BASE_URL}/villages/activeList`,
  TRANSFER: `${BASE_URL}/transferApplications`,
  TRANSFER_LOGS: `${BASE_URL}/transferApplications/transferLogs`,
  NURSES: `${BASE_URL}/nurses`,
  USER_APPLICATIONS: `${BASE_URL}/userApplications`,
  USER_APPLICATIONS_COUNT: `${BASE_URL}/userApplications/count`,
  ATTENDANTS: `${BASE_URL}/attendants`,
  HEALTHFACILITY_COUNT: `${BASE_URL}/healthfacilities/count`,
  LOGIN: `${BASE_URL}/user/login`,
  USER_STATUS_LOGS: `${BASE_URL}/fileUpload/list`,
  DUMP_EDIT: `${BASE_URL}/fileUpload/update`,
  DUMP_FILES:`${BASE_URL}/fileUpload/file-download`,
  OCCUPATIONS: `${BASE_URL}/occupations`,
  DISEASES: `${BASE_URL}/diseases`,
  CHAPTERS: `${BASE_URL}/diseases/chapters/activeList`,
  INSURANCES: `${BASE_URL}/insurances`,
  ORPHANAGES: `${BASE_URL}/orphanages`,
  MANNER_OF_DEATHS: `${BASE_URL}/mannerofdeaths`,
  PROFESSIONS: `${BASE_URL}/professions`,
  LOG_OUT_USER: `${BASE_URL}/user/logout`,
  TRANSFER_REQ_PENDING: `${BASE_URL}/transferApplications/pendingRequest`,
  WORKER_LOG_HISTORY: `${BASE_URL}/workLog/list`,
  GET_BIRTH_BY_COUNT: `${BASE_URL}/dashboard/birthcount`,
  GET_BIRTH_BY_MOM_AGE: `${BASE_URL}/dashboard/birthmotherage`,
  GET_BIRTH_BY_CHILD_WEIGHT: `${BASE_URL}/dashboard/childweight`,
  BIRTHS_VS_DEATHS: `${BASE_URL}/dashboard/birthvsdeath`,
  GET_BIRTH_BY_SEX: `${BASE_URL}/dashboard/birthbysex`,
  GET_BIRTH_BY_REGISTRATION: `${BASE_URL}/dashboard/birthbyregistrationtime`,
  GET_DEATH_BY_COUNT: `${BASE_URL}/dashboard/deathcount`,
  GET_DEATH_BY_AGE_COUNT: `${BASE_URL}/dashboard/deathbyage`,
  GET_DEATH_BYGENDER_COUNT: `${BASE_URL}/dashboard/deathbysex`,
  GET_DEATH_BYREGISTRATION_COUNT: `${BASE_URL}/dashboard/deathbyregistrationtime`,
  GET_DEATH_BYMANNER_COUNT: `${BASE_URL}/dashboard/deathbymannerofdeath`,
  FORGOT_PASSWORD: `${BASE_URL}/user/changePassword`,
  GET_OTP: `${BASE_URL}/user/forgotPassword`,
  RESET_PASSWORD: `${BASE_URL}/user/updatePassword`,
  SETTINGS: `${BASE_URL}/settings`,
  NPR_RETRY_BIRTH: `${BASE_URL}/nprretry`,
  NPR_RETRY_DEATH: `${BASE_URL}/nprretry`,
  SERVICE: `${BASE_URL}/externalserviceusers`,
  IREMBO_RETRY_BIRTH: `${BASE_URL}/crvsservices/birth`,
  IREMBO_RETRY_DEATH: `${BASE_URL}/crvsservices/death`,
  IREMBO_RETRY_BIRTH_SUCCESS: `${BASE_URL}/irembopaymentreference/birth`,
  IREMBO_RETRY_DEATH_SUCCESS: `${BASE_URL}/irembopaymentreference/death`,
  DASHBOARD_TRANSFERS_COUNT: `${BASE_URL}/dashboard/transfer`,
  DASHBOARD_DEACTIVATION_COUNT: `${BASE_URL}/dashboard/deactivation`,
  GET_DIVORCE_COUNT: `${BASE_URL}/dashboard/divorce/count`,
  GET_DIVORCE_COUNT_BY_AGE_GROUP: `${BASE_URL}/dashboard/divorce/agegroups/count`,
  GET_DIVORCE_VS_MARRIAGE: `${BASE_URL}/dashboard/divorce/divorcevsmarriage/count`,
  GET_ANNULMENT_VS_MARRIAGE: `${BASE_URL}/dashboard/annulment/annulmentvsmarriage/count`,
  GET_ANNULMENT_COUNT_BY_AGE_GROUP: `${BASE_URL}/dashboard/annulment/agegroups/count`,
  GET_ANNULMENT_COUNT: `${BASE_URL}/dashboard/annulment/count`,
  DISABILITY_AREAS: `${BASE_URL}/disabilityarea`,
  SPECIFIC_DISABILITY: `${BASE_URL}/disabilityspecific`,
  DISABILITY_PERIODS: `${BASE_URL}/disabilityperiod`,
  CONSUMER_LIST: `${BASE_URL}/kafka-api/consumer`,
  CONSUMER_COUNT: `${BASE_URL}/kafka-api/consumer`,
  DELETE_CONSUMERS: `${BASE_URL}/consumer/deleteByIds`,
  KAFKA_TOPIC_LIST: `${BASE_URL}/kafka-api/topic/list`,
  KAFKA_CREATE_TOPIC: `${BASE_URL}/kafka-api/topic/create`,
  KAFKA_CREATE_CONSUMER: `${BASE_URL}/kafka-api/consumer`,
  COURT_NAMES: `${BASE_URL}/courtnames`,
  GET_RECOGNITION_BY_COUNT: `${BASE_URL}/dashboard/recognitioncount`,
  GET_RECOGNITION_COUNT_BY_TYPE: `${BASE_URL}/dashboard/recognitioncountbytype`,
  GET_NOTIFICATIONS_VS_REGISTRATIONS: `${BASE_URL}/dashboard/notifiedvsregistratios`,
  GET_RECOGNITION_BY_PLACE_OF_REGISTRATION: `${BASE_URL}/dashboard/recognitioncountbyplaceofregistration`,
  GET_MARRIAGE_BY_COUNT: `${BASE_URL}/dashboard/marriage/count`,
  GET_MARRIAGE_BY_AGE_GROUP: `${BASE_URL}/dashboard/marriage/agegroups/count`,
  GET_MARRIAGE_RWANDA_VS_ABROAD: `${BASE_URL}/dashboard/marriage/rwandavsabroad/count`,
  GET_ADOPTION_BY_COUNT: `${BASE_URL}/dashboard/adoptioncount`,
  GET_ADOPTION_COUNT_BY_FORM_OF_ADOPTION: `${BASE_URL}/dashboard/adoptioncountbyformofadoption`,
  GET_ADOPTION_BY_PLACE_OF_REGISTRATION: `${BASE_URL}/dashboard/adoptioncountbyplaceofregistration`,
};
