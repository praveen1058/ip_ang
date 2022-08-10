import { Injectable } from '@angular/core';

export class Settings {
    constructor(public name: string,
                public theme: string,
                public rtl: boolean,
                public logo: string) { }
}

@Injectable()
export class AppSettings {
    public settings = new Settings(
        'Indiapicture',  // theme name
        'grey',     // green, blue, red, pink, purple, grey
        false,       // true = rtl, false = ltr
        'assets/images/logo.png'
    );
}
