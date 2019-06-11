export interface Child {
    firstName: string;
    middleName: string;
    lastName: string;
    birthday: string;
    school: string;
    grade: string;
}

export interface FormFields {
    firstName: string;
    middleName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    homePhone: string;
    mobilePhone: string;
    emailAddress: string;
    hasChildren: boolean;
    children: Child[];
    talkToPastor: boolean;
    bestTimeDay: string;
    interests: string[];
    interestsOther: string;
    heardHow: string;
    heardHowOther: string;
    comments: string;
}
