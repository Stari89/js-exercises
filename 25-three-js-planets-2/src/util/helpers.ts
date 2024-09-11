export default class Helpers {
    public static generateRandomString(length: number): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    public static generateRandomUniqueId(map: Map<string, any>): string {
        let id = '';
        do {
            id += Helpers.generateRandomString(1);
        } while (map.has(id));
        return id;
    }

    public static getProperty(obj: any, key: string) {
        return obj[key];
    }

    public static divideArray<T>(arr: T[], partsCount: number): T[][] {
        const result: T[][] = [];
        const size = Math.ceil(arr.length / partsCount);

        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size)); // Slice the array into chunks
        }

        return result;
    }
}
