export class Category {
    constructor(public id: number,
                public name: string,
                public hasSubCategory: boolean,
                public parentId: number,
                public creativePrice: number,
                public editorialPrice: number) {
    }
}

export class Product {
    constructor(public id: number,
                public name: string,
                public images: Array<any>,
                public oldPrice: number,
                public newPrice: number,
                public discount: number,
                public ratingsCount: number,
                public ratingsValue: number,
                public description: string,
                public availibilityCount: number,
                public cartCount: number,
                public color: Array<string>,
                public size: Array<string>,
                public weight: number,
                public categoryId: number) {
    }
}

export class Results {

    constructor(public id: string,
                public filename: string,
                public caption: string,
                public desc: string,
                public model: string,
                public license: string,
                public collection: string,
                public category: string,
                public property: string,
                public author: string,
                public tags: Array<any>,
                public max_size: string,
                public restrictions: string,
                public thumbnail: string,
                public preview: string,
                public sizes: Sizes[],
                public large_thumbnail: string,
                public medium_thumbnail: string,
                public time: string,
                public isHover: boolean,
                public contributor: string,
                public ext: string,
                public usage: string,
                public location: string,
                public audio_channel: string,
                public compressor: string,
                public type: string,
                public iseditorial: boolean,
                public flexGrow: string = "1 !important"
    ) {
    }
}

export class CartData {
    constructor(public id: number,
                public filename: string,
                public license: string,
                public collection: string,
                public size: string,
                public thumbnail: string,
                public preview: string,
                public price: number,
                public cartCount: number,
                public type: string,
                public caption: string,
                public downloadLink: string,
                public category: string
    ) {
    }
}

export class CartStatus {
    constructor(public statusCode: number,
                public data: CartList[]
    ) {
    }
}

export class Plan {
    constructor(public id: number,
                public name: string,
                public sizes: string,
                public collection_id: string,
                public no_of_images: number,
                public days_validity: number
    ) {
    }
}

export class Order {
    constructor(public id: number,
                public date: string,
                public status: string,
                public amount: string,
                public taxAmount: string,
                public collection: string,
                public sizes: string,
                public plan_detail: string,
    ) {
    }
}


export class Filter {
    constructor(public license: Array<string>,
                public orientation: string,
                public imageType: string,
                public people: string,
                public gender: string,
                public age: string,
                public ethnicity: string,
                public sort: string,
                public coll_id: Array<string>,
                public advsearchtxt: string) {
    }
}


export class VideoFilter {
    constructor(public durationFrom: string,
                public durationTo: string,
                public fpsFrom: string,
                public fpsTo: string,
                public gender: string,
                public people: string,
                public resolution: Array<string>,
                public sort: string,
                public priceFrom: string,
                public priceTo: string,
                public advsearchtxt: string) {
    }
}

export class Sizes {
    constructor(public name: string,
                public pixels: string,
                public inches: string,
                public dpi: string,
                public price: number,
                public price_usd: number,
                public subscription: number,
                public download_link: string,
                public is_downloaded: boolean) {
    }
}


export class Images {
    constructor(public total: number,
                public pages: number,
                public results: Results[]) {
    }
}

export class EditorialImages {
    constructor(public total_images: number,
                public total_pages: number,
                public results: EditorialResults[]) {
    }
}

export class EditorialResults {
    constructor(public images_id: number,
                public images_filename: string,
                public images_license_type: string,
                public images_collectionid: string,
                public images_caption: string,
                public preview_path: string,
                public thumbnail_path: string) {
    }
}

// export class User {
//     constructor(public token: string) {
//     }
// }


export class User {
    constructor(public id: number,
                public customers_id: string,
                public customers_firstname: string,
                public customers_lastname: string,
                public customers_email_address: string,
                public customers_city: string,
                public customers_state: string,
                public customers_telephone: string,
                public customers_company: string,
                public customers_address_line1: string,
                public customers_address_line2: string,
                public customers_comp_status: string,
                public customers_postcode: string,
                public customers_country: string,
                public customers_password: string,
                public customers_password1: string,
                public company_type: string,
                public job_description: string,
                public customers_fax: string,
                public token: string) {
    }
}

export class WishList {
    constructor(public id: number,
                public name: string,
                public no_of_images: string,
                public no_of_sharing: string,
                public created_at: string,
                public imagesArray: Results[]) {
    }
}

export class CartList {
    constructor(public imagesArray: CartData[],
                public total_price: string,
                public total_item: number) {
    }

}

export class Subscription {
    constructor(public name: string,
                public subscription: number,
                public download_link: string,
                public is_downloaded: boolean,
                public price_high: number) {
    }
}

export class Auth {
    constructor(public name: string,
                public email: string,
                public password: string,
                public phone: string) {
    }


}

export class ContributorData {
    constructor(public username: string,
                public firstname: string,
                public lastname: string,
                public photograph: string,
                public interest: string,
                public code: string
    ) {
    }
}
