import { library } from '@fortawesome/fontawesome-svg-core'
import {faCogs, faEdit, faPhone, faUserCog} from '@fortawesome/free-solid-svg-icons'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default class Icons {
    constructor() {
        library.add(
            faPhone,
            faHome,
            faSignInAlt,
            faSignOutAlt,
            faUser,
            faUserCog,
            faCogs,
            faEdit,
        );
    }
}
