import { library } from '@fortawesome/fontawesome-svg-core';
import { faCogs } from '@fortawesome/free-solid-svg-icons/faCogs';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone';
import { faUserCog } from '@fortawesome/free-solid-svg-icons/faUserCog';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faChevronDoubleUp } from "@fortawesome/pro-solid-svg-icons/faChevronDoubleUp";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faChevronDoubleDown } from "@fortawesome/pro-solid-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

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
            faPlus,
            faTrash,
            faPencilAlt,
            faCheck,
            faBan,
            faChevronUp,
            faChevronDoubleUp,
            faChevronDown,
            faChevronDoubleDown,
            faCaretDown
        );
    }
}
