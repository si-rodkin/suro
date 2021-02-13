import { isEmpty } from ".";

const phoneRegexp = /^\+\d{11,13}$/;

export default phone => {
    let val = phone
    if (!isEmpty(phone)) {
        val = phone.replace(/[ \(\)-]/g, '');
    }
    return phoneRegexp.test(val);
}
