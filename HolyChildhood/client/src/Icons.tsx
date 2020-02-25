import { library } from '@fortawesome/fontawesome-svg-core'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { faHome } from '@fortawesome/free-solid-svg-icons'

export default class Icons {
    constructor() {
        library.add(
            faPhone,
            faHome,
        );
    }
}
