import Config from "./models/Config.model.js";

export const categoryId = await Config.get('categoryId');
export const subroutineRoleId = await Config.get('memberRole');


class Configuration {
    categoryId
    subroutineRoleId

    constructor() {
        this.update();
    }

    async update() {
        Object.keys(this).forEach(async key => {
            this[key] = await Config.get(key);
        })
    }
}

export default new Configuration();