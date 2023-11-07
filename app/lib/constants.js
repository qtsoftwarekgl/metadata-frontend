const { CAPTCHA_KEY } = process.env;
const { ACTIVATE_CAPTCHA } = process.env;

module.exports = {
  SESSION: {
    TOKEN: 'token',
    EXPIRED: 'session_expired',
    EXPIRED_ERROR_CODE: 310
  },
  HEADER: {
    TOKEN: 'x-auth-token',
    CONTENT_TYPE: 'application/json',
    MULTIPART_CONTENT_TYPE: 'multipart/form-data',
    TIMEOUT: 120000
  },
  ERROR: {
    MSG: 'error',
    INVALID_RESPONSE: 'INVALID_RESPONSE'
  },
  MINISTRIES: [
    { label: 'MOH', value: 'MOH' },
    { label: 'MINAFFET', value: 'MINAFFET' },
    { label: 'MINALOC', value: 'MINALOC' }
  ],
  ROLES: [
    { value: 'NOTIFIER', label: 'Notifier' },
    { value: 'CR', label: 'Registrar' },
    { value: 'MINISTRY_ADMIN', label: 'Administrator' },
    { value: 'SECONDARY_ADMIN', label: 'Secondary Administrator' },
    { value: 'SUPER_ADMIN', label: 'Super Administrator' },
    { value: 'LAUNCHER', label: 'Launcher' },
    { value: 'VIEWER', label: 'Viewer' }
  ],
  DATE_FORMAT: 'DD/MM/YYYY',
  DATE_TIME_FORMAT: 'DD/MM/YYYY hh:mm a',
  PHONE_LENGTH: 10,
  PAGE: 1,
  LIMIT: 20,
  REGEX: {
    CITY_PATTERN: /^[a-zA-Z,.!?-_\-`^'() áàâãéèêíïóôõöúçñ ]*$/,
    CITY_PATTERN_: /^[a-zA-Z,.!?-_\-`^'() áàâãéèêíïóôõöúçñ ÆÐƎƏƐƔĲŊŒẞÞǷȜæðǝəɛɣĳŋœĸſßþƿȝĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯY̨Ƴąɓçđɗęħįƙłøơşșţțŧųưy̨ƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƏƐĠĜǦĞĢƔáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗðéèėêëěĕēęẹǝəɛġĝǧğģɣĤḤĦIÍÌİÎÏǏĬĪĨĮỊĲĴĶƘĹĻŁĽĿʼNŃN̈ŇÑŅŊÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĳĵķƙĸĺļłľŀŉńn̈ňñņŋóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÞÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄǷÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧþúùûüǔŭūũűůųụưẃẁŵẅƿýỳŷÿȳỹƴźżžẓ ]*$/,
    NUMBER: /^[0-9]*$/,
    NAME: /^[a-zA-Z ]*$/,
    LANGUAGE: /^\D+$/,
    PHONE: /^[0][7][2389]\d{7}$/,
    PHONE_EMBASSY: /^[0-9)(+\- ]{0,20}$/,
    EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_])(?=.{10,16})/
  },
  CAPTCHA_KEY,
  ACTIVE_CAPTCHA: ACTIVATE_CAPTCHA,
  SLICE_CHARACTER: 30,
  CLIENT_KEY: 20,
  COMPANY_NAME: 50,
  IDLE_TIMOUT_INTERVAL: 900000,
  FACILITY_CATEGORY: [
    { label: 'Referral Hospital', value: 'Referral Hospital' },
    { label: 'Provincial Hospital', value: 'Provincial Hospital' },
    { label: 'District Hospital', value: 'District Hospital' },
    { label: 'Medicalized Health Center', value: 'Medicalized Health Center' },
    { label: 'Health Center', value: 'Health Center' },
    { label: 'Health Post', value: 'Health Post' },
    { label: 'Polyclinic', value: 'Polyclinic' },
    { label: 'Clinic', value: 'Clinic' },
    { label: 'Home(N/A)', value: 'Home(N/A)' }
  ],
  FACILITY_TYPE: [
    { label: 'Public', value: 'Public' },
    { label: 'Semi-Public', value: 'Semi-Public' },
    { label: 'Private', value: 'Private' }
  ],
  SETTINGS: {
    REGISTRATION_NOTE: 'Note: Available placeholders {{SURNAME}} {{POSTNAMES}} {{USERNAME}} {{OTP}} {{NIN_NUMBER}}',
    PASSWORD_RESET_NOTE: 'Note: Available placeholders {{SURNAME}} {{POSTNAMES}} {{OTP}}',
    BIRTH_MOTHER_NOTE: 'Note: Available placeholders {{MOTHER_SURNAME}} {{MOTHER_POSTNAMES}} {{MOTHER_NIN}} {{CHILD_SURNAME}} {{CHILD_POSTNAMES}} {{CHILD_NIN}} {{CHILD_APPLICATION_NUMBER}}',
    BIRTH_FATHER_NOTE: 'Note: Available placeholders {{FATHER_SURNAME}} {{FATHER_POSTNAMES}} {{FATHER_NIN}} {{CHILD_SURNAME}} {{CHILD_POSTNAMES}} {{CHILD_NIN}} {{CHILD_APPLICATION_NUMBER}}',
    BIRTH_DECLARANT_NOTE: 'Note: Available placeholders {{DECLARANT_SURNAME}} {{DECLARANT_POSTNAMES}} {{DECLARANT_NIN}} {{CHILD_SURNAME}} {{CHILD_POSTNAMES}} {{CHILD_NIN}} {{CHILD_APPLICATION_NUMBER}}',
    BIRTH_WITNESS_NOTE: 'Note: Available placeholders {{WITNESS_SURNAME}} {{WITNESS_POSTNAMES}} {{WITNESS_NIN}} {{CHILD_SURNAME}} {{CHILD_POSTNAMES}} {{CHILD_NIN}} {{CHILD_APPLICATION_NUMBER}}',
    DEATH_NOTE: 'Note: Available placeholders {{DECEASED_SURNAME}} {{DECEASED_POSTNAMES}} {{DECEASED_NIN}} {{DECEASED_APPLICATION_NUMBER}}',
    SHORT_MSG_BIRTH_NOTE: 'Note: {{SURNAME}} for replacement surname',
    SHORT_MSG_DEATH_NOTE: 'Note: {{SURNAME}} for replacement surname'
  },
  EXTERNAL_SERVICE: [
    { label: 'MOH', value: 'MOH' },
    { label: 'NISR', value: 'NISR' },
    { label: 'NPR', value: 'NPR' },
    { label: 'IREMBO', value: 'IREMBO' },
    { label: 'IECMS', value: 'IECMS' }
  ],
  EXTERNAL_SERVICE_ROLE: [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Super Admin', value: 'SUPER_ADMIN' }
  ],
  VITAL_STATUS: {
    0: 'Alive',
    13: 'Deceased'
  },
  COURT_CATEGORIES: [
    { value: 'Primary Court', label: 'Primary Court' },
    { value: 'Intermediate Court', label: 'Intermediate Court' },
    { value: 'Court of Appeal', label: 'Court of Appeal' },
    { value: 'High Court', label: 'High Court' },
    { value: 'Supreme Court', label: 'Supreme Court' }
  ]
};
